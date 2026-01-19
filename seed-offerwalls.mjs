// Seed offerwall settings with CPAGrip and AdBlueMedia credentials
import { db } from "./src/lib/db.js";
import { offerwallSettings } from "./shared/schema.js";
import { eq } from "drizzle-orm";
import { randomUUID } from "crypto";

async function seedOfferwalls() {
  console.log("🔄 Seeding offerwall settings...\n");

  try {
    // CPAGrip configuration
    const cpagrip = {
      id: randomUUID(),
      network: "cpagrip",
      isEnabled: true,
      apiKey: "35b59eb1af2454f46fe63ad7d34f923b",
      secretKey: "35b59eb1af2454f46fe63ad7d34f923b",
      userId: "621093",
      postbackUrl: null,
      updatedAt: new Date(),
    };

    // AdBlueMedia configuration
    const adbluemedia = {
      id: randomUUID(),
      network: "adbluemedia",
      isEnabled: true,
      apiKey: "f24063d0d801e4daa846e9da4454c467",
      secretKey: "f24063d0d801e4daa846e9da4454c467",
      userId: "518705",
      postbackUrl: null,
      updatedAt: new Date(),
    };

    // Check if CPAGrip exists
    const existingCpagrip = await db.select()
      .from(offerwallSettings)
      .where(eq(offerwallSettings.network, "cpagrip"))
      .limit(1);

    if (existingCpagrip.length > 0) {
      console.log("✅ CPAGrip already exists, updating...");
      await db.update(offerwallSettings)
        .set(cpagrip)
        .where(eq(offerwallSettings.network, "cpagrip"));
    } else {
      console.log("➕ Inserting CPAGrip...");
      await db.insert(offerwallSettings).values(cpagrip);
    }

    // Check if AdBlueMedia exists
    const existingAdbluemedia = await db.select()
      .from(offerwallSettings)
      .where(eq(offerwallSettings.network, "adbluemedia"))
      .limit(1);

    if (existingAdbluemedia.length > 0) {
      console.log("✅ AdBlueMedia already exists, updating...");
      await db.update(offerwallSettings)
        .set(adbluemedia)
        .where(eq(offerwallSettings.network, "adbluemedia"));
    } else {
      console.log("➕ Inserting AdBlueMedia...");
      await db.insert(offerwallSettings).values(adbluemedia);
    }

    // Verify
    console.log("\n✅ Offerwall settings seeded successfully!\n");
    const allSettings = await db.select().from(offerwallSettings);
    console.log("Current offerwall settings:");
    allSettings.forEach(setting => {
      console.log(`  - ${setting.network}: ${setting.isEnabled ? 'ENABLED' : 'DISABLED'}`);
      console.log(`    User ID: ${setting.userId}`);
      console.log(`    API Key: ${setting.apiKey ? '***' + setting.apiKey.slice(-4) : 'None'}`);
    });

    process.exit(0);
  } catch (error) {
    console.error("\n❌ Error seeding offerwalls:", error);
    process.exit(1);
  }
}

seedOfferwalls();
