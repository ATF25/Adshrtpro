// Test script to check offerwall settings
import { db } from "./src/lib/db.js";
import { offerwallSettings } from "./shared/schema.js";

async function testOfferwalls() {
  console.log("🔍 Checking offerwall settings...\n");
  
  try {
    const settings = await db.select().from(offerwallSettings);
    
    if (settings.length === 0) {
      console.log("❌ No offerwall settings found in the database!");
      console.log("\nThis is why offerwalls are not appearing.");
      console.log("\nYou need to:");
      console.log("1. Add offerwall settings via the admin panel");
      console.log("2. Or insert them directly into the database");
    } else {
      console.log(`✅ Found ${settings.length} offerwall setting(s):\n`);
      settings.forEach(setting => {
        console.log(`Network: ${setting.network}`);
        console.log(`Enabled: ${setting.isEnabled}`);
        console.log(`Has API Key: ${setting.apiKey ? 'Yes' : 'No'}`);
        console.log(`Has User ID: ${setting.userId ? 'Yes' : 'No'}`);
        console.log('---');
      });
    }
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

testOfferwalls();
