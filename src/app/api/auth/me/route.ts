import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import * as storage from "@/lib/storage";
import { db, schema } from "@/lib/db";
import { eq, sql } from "drizzle-orm";
import { randomUUID } from "crypto";

/**
 * Migrate a legacy user (old UUID id) to use their Clerk ID.
 * Updates the user's primary key and ALL foreign-key references across every table.
 */
async function migrateLegacyUser(oldId: string, newClerkId: string): Promise<void> {
  // Use raw SQL to update PK + all FK references in a single transaction
  // This is safer than drizzle ORM for PK updates
  await db.execute(sql`
    BEGIN;

    -- 1. Update FK references in all child tables FIRST (before PK changes)
    UPDATE links SET user_id = ${newClerkId} WHERE user_id = ${oldId};
    UPDATE notifications SET user_id = ${newClerkId} WHERE user_id = ${oldId};
    UPDATE user_balances SET user_id = ${newClerkId} WHERE user_id = ${oldId};
    UPDATE transactions SET user_id = ${newClerkId} WHERE user_id = ${oldId};
    UPDATE offerwall_completions SET user_id = ${newClerkId} WHERE user_id = ${oldId};
    UPDATE task_submissions SET user_id = ${newClerkId} WHERE user_id = ${oldId};
    UPDATE withdrawal_requests SET user_id = ${newClerkId} WHERE user_id = ${oldId};
    UPDATE social_verifications SET user_id = ${newClerkId} WHERE user_id = ${oldId};

    -- Referrals: both referrer and referred columns
    UPDATE referrals SET referrer_id = ${newClerkId} WHERE referrer_id = ${oldId};
    UPDATE referrals SET referred_id = ${newClerkId} WHERE referred_id = ${oldId};

    -- Users: referred_by column (other users who were referred by this user)
    UPDATE users SET referred_by = ${newClerkId} WHERE referred_by = ${oldId};

    -- 2. Update the user's own primary key LAST
    UPDATE users SET id = ${newClerkId} WHERE id = ${oldId};

    COMMIT;
  `);
}

export async function GET(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json(null);

    // Try to find user in our database by Clerk ID
    let user = await storage.getUser(userId);

    // If user doesn't exist by Clerk ID, check if they're a legacy user
    if (!user) {
      const clerkUser = await currentUser();
      if (!clerkUser) return NextResponse.json(null);

      const email = clerkUser.emailAddresses[0]?.emailAddress;
      if (!email) return NextResponse.json(null);

      // Check if a user with this email already exists (legacy user)
      const existingByEmail = await storage.getUserByEmail(email);
      if (existingByEmail) {
        // Migrate legacy user: update their ID to the Clerk ID across all tables
        console.log(`Migrating legacy user ${existingByEmail.id} -> ${userId} (${email})`);
        try {
          await migrateLegacyUser(existingByEmail.id, userId);
          user = await storage.getUser(userId);
          if (!user) {
            console.error("Migration succeeded but user not found after migration");
            return NextResponse.json(null);
          }
          // Update email verified status from Clerk
          if (clerkUser.emailAddresses[0]?.verification?.status === "verified" && !user.emailVerified) {
            await storage.updateUser(userId, { emailVerified: true });
            user.emailVerified = true;
          }
          console.log(`Successfully migrated user ${email} to Clerk ID ${userId}`);
        } catch (migrationError) {
          console.error("User migration failed:", migrationError);
          // Return the existing user data even if migration fails
          // They can still use the app, migration will retry next request
          const balance = await storage.getUserBalance(existingByEmail.id);
          return NextResponse.json({
            id: existingByEmail.id,
            email: existingByEmail.email,
            emailVerified: existingByEmail.emailVerified ?? true,
            isAdmin: existingByEmail.isAdmin ?? false,
            analyticsUnlockExpiry: existingByEmail.analyticsUnlockExpiry,
            referralCode: existingByEmail.referralCode ?? null,
            balanceUsd: balance?.balanceUsd || "0",
            socialVerified: existingByEmail.socialVerified ?? false,
            telegramUsername: existingByEmail.telegramUsername || undefined,
          });
        }
      } else {
        // Brand new Clerk user — create in our database
        const referralCode = Math.random().toString(36).substring(2, 10).toUpperCase();

        await db.insert(schema.users).values({
          id: userId,
          email,
          password: "clerk-managed",
          emailVerified: clerkUser.emailAddresses[0]?.verification?.status === "verified",
          referralCode,
          isAdmin: false,
          isBanned: false,
          socialVerified: false,
          createdAt: new Date(),
        });

        await db.insert(schema.userBalances).values({
          id: randomUUID(),
          userId: userId,
          balanceUsd: "0",
          totalEarned: "0",
          totalWithdrawn: "0",
        });

        user = await storage.getUser(userId);
        if (!user) return NextResponse.json(null);
      }
    }

    const balance = await storage.getUserBalance(user.id);

    return NextResponse.json({
      id: user.id,
      email: user.email,
      emailVerified: user.emailVerified ?? true,
      isAdmin: user.isAdmin ?? false,
      analyticsUnlockExpiry: user.analyticsUnlockExpiry,
      referralCode: user.referralCode ?? null,
      balanceUsd: balance?.balanceUsd || "0",
      socialVerified: user.socialVerified ?? false,
      telegramUsername: user.telegramUsername || undefined,
    });
  } catch (error) {
    console.error("/api/auth/me error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
