// Seed offerwall settings with production credentials
import { db } from "../src/lib/db.js";
import { offerwallSettings } from "../shared/schema.js";
import { eq } from "drizzle-orm";

const OFFERWALL_DATA = [
  {
    network: "cpagrip",
    isEnabled: true,
    apiKey: "35b59eb1af2454f46fe63ad7d34f923b",
    secretKey: "35b59eb1af2454f46fe63ad7d34f923b",
    userId: "621093",
    postbackUrl: null,
  },
  {
    network: "adbluemedia",
    isEnabled: true,
    apiKey: "f24063d0d801e4daa846e9da4454c467",
    secretKey: "f24063d0d801e4daa846e9da4454c467",
    userId: "518705",
    postbackUrl: null,
  },
];

async function seedOfferwalls() {
  console.log("🌱 Seeding offerwall settings...\n");
  
  try {
    for (const data of OFFERWALL_DATA) {
      // Check if exists
      const existing = await db
        .select()
        .from(offerwallSettings)
        .where(eq(offerwallSettings.network, data.network))
        .limit(1);

      if (existing.length > 0) {
        // Update existing
        await db
          .update(offerwallSettings)
          .set({
            ...data,
            updatedAt: new Date(),
          })
          .where(eq(offerwallSettings.network, data.network));
        console.log(`✅ Updated ${data.network} offerwall`);
      } else {
        // Insert new
        await db.insert(offerwallSettings).values({
          id: crypto.randomUUID(),
          ...data,
          updatedAt: new Date(),
        });
        console.log(`✅ Created ${data.network} offerwall`);
      }
    }

    // Verify
    console.log("\n📋 Current offerwall settings:");
    const all = await db.select().from(offerwallSettings);
    all.forEach((setting) => {
      console.log(`  - ${setting.network}: ${setting.isEnabled ? "✅ Enabled" : "❌ Disabled"}`);
      console.log(`    User ID: ${setting.userId}`);
      console.log(`    API Key: ${setting.apiKey ? "Set" : "Not set"}`);
    });

    console.log("\n✅ Offerwall seeding complete!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding offerwalls:", error);
    process.exit(1);
  }
}

seedOfferwalls();
