import * as dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.join(__dirname, "../../../.env") });

import { prisma } from "@ventry/db"; 
import { addIngestJob } from "@ventry/queue";

async function runTest() {
  console.log("🚀 Starting E2E Loop Validation...");

  // 1. Fetch any connected account to use as the 'recipient'
  const account = await prisma.account.findFirst({
    where: { tokenValid: true }
  });

  if (!account) {
    console.error("❌ No valid account found in DB. Please connect an account through the UI first.");
    process.exit(1);
  }

  console.log(`✅ Using Account: ${account.id} (External: ${account.externalId})`);

  // 2. Generate a unique message ID (idempotency safety)
  const mid = "test_mid_" + Date.now();
  const text = "Hello ventry, give me a discount";
  const senderId = "test_user_678";

  console.log(`📤 Simulating DM: "${text}" from ${senderId}`);

  // 3. Inject payload into the Ingest Queue
  await addIngestJob(mid, {
    platform: "instagram",
    payload: {
      id: mid,
      messaging: [{
        sender: { id: senderId },
        recipient: { id: account.externalId }, // THIS IS THE CRITICAL MATCH
        message: { 
          mid: mid,
          text: text
        }
      }]
    }
  });

  console.log("⏳ Job pushed to BullMQ. Waiting for worker to process (max 20s)...");

  // 4. Poll the DB for the outbound response
  let found = false;
  for (let i = 0; i < 20; i++) {
    const outbound = await prisma.message.findFirst({
      where: {
        accountId: account.id,
        direction: "outbound",
        createdAt: { gte: new Date(Date.now() - 30000) } // Within last 30s
      }
    });

    if (outbound) {
      console.log("\n✨ SUCCESS! End-to-End Loop Verified.\n");
      console.log(`🤖 AI Response: "${outbound.content}"`);
      console.log(`📄 Message ID: ${outbound.id}`);
      found = true;
      break;
    }

    process.stdout.write(".");
    await new Promise(r => setTimeout(r, 1000));
  }

  if (!found) {
    console.error("\n❌ TIMEOUT: No outbound response found in DB. Check worker logs.");
    process.exit(1);
  }

  console.log("\nLoop Validation Complete.");
  process.exit(0);
}

runTest().catch(err => {
  console.error("💥 Script Error:", err);
  process.exit(1);
});
