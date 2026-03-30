import * as dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.join(__dirname, "../../../.env") });

console.log("REDIS_URL:", process.env.REDIS_URL ? "SET" : "NOT SET");
import { Worker } from "bullmq";

import { connection } from "@ventry/queue";
import { processWebhookEvent } from "@ventry/automation";

const handleIngest = async (job: any) => {
  const { platform, payload } = job.data;
  console.log(`[Worker] Processing ingest job ${job.id} for ${platform}`);
  
  // Real Meta Webhook Parsing
  // 1. DMs / Messaging
  if (payload.messaging && payload.messaging.length > 0) {
    for (const msg of payload.messaging) {
      const senderId = msg.sender.id;
      const recipientId = msg.recipient.id;
      const text = msg.message?.text;
      const mid = msg.message?.mid;

      if (text && mid) {
        // Here accountId should be looked up via recipientId
        // For MVP, we pass recipientId as accountId if we don't have a mapping yet
        await processWebhookEvent(recipientId, text, "messages", senderId, mid);
      }
    }
  }

  // 2. Comments / Feed Changes
  if (payload.changes && payload.changes.length > 0) {
    for (const change of payload.changes) {
      if (change.field === "comments" && change.value?.text) {
        const commentId = change.value.id;
        const text = change.value.text;
        const fromId = change.value.from.id;
        // In comments, the 'id' of the account is usually the IG User node
        const accountId = payload.id; 

        await processWebhookEvent(accountId, text, "comments", fromId, commentId);
      }
    }
  }
};


export const startWorker = () => {
  console.log("Starting BullMQ Workers...");

  const ingestWorker = new Worker("ingestQueue", async (job) => {
    return await handleIngest(job);
  }, { connection });

  ingestWorker.on('completed', job => {
    console.log(`Ingest Job ${job.id} has completed!`);
  });

  ingestWorker.on('failed', (job, err) => {
    console.log(`Ingest Job ${job?.id} has failed with ${err.message}`);
  });
};

startWorker();
