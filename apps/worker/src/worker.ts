import * as dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.join(__dirname, "../../../.env") });

import { Worker } from "bullmq";
import { connection } from "@ventry/queue";
import { processWebhookEvent } from "@ventry/automation";
import { prisma } from "@ventry/db";

const handleIngest = async (job: any) => {
  const { platform, payload } = job.data;
  console.log(`[Worker] Processing ingest job ${job.id} for ${platform}`);
  
  // 1. DMs / Messaging
  if (payload.messaging && payload.messaging.length > 0) {
    for (const msg of payload.messaging) {
      const senderId = msg.sender?.id;
      const recipientId = msg.recipient?.id;
      const text = msg.message?.text;
      const mid = msg.message?.mid;

      console.log("[Worker] Incoming DM:", { senderId, recipientId, mid, text });

      if (!text || !mid || !recipientId) continue;

      // 1.1 Idempotency check at worker level
      const existing = await prisma.message.findUnique({
        where: { externalId: mid }
      });
      if (existing) {
        console.log(`[Worker] Duplicate message skipped: ${mid}`);
        continue;
      }

      // 1.2 Resolve Internal Account ID
      const account = await prisma.account.findUnique({
        where: {
          platform_externalId: {
            platform: "instagram",
            externalId: recipientId,
          },
        },
      });

      if (!account) {
        console.error(`[Worker] CRITICAL: No account found for recipientId: ${recipientId}`);
        continue;
      }

      console.log(`[Worker] Account resolved: ${account.id} (${account.externalId})`);

      // 1.3 Hand off to Engine with internal CUID
      await processWebhookEvent(account.id, text, "messages", senderId, mid);
    }
  }

  // 2. Comments / Feed Changes
  if (payload.changes && payload.changes.length > 0) {
    for (const change of payload.changes) {
      if (change.field === "comments" && change.value?.text) {
        const commentId = change.value.id;
        const text = change.value.text;
        const fromId = change.value.from?.id;
        const recipientId = payload.id; // In comments, the root 'id' is often the IG User ID

        console.log("[Worker] Incoming Comment:", { fromId, recipientId, commentId, text });

        if (!text || !commentId || !recipientId) continue;

        // Idempotency
        const existing = await prisma.message.findUnique({
          where: { externalId: commentId }
        });
        if (existing) continue;

        // Resolve Account
        const account = await prisma.account.findUnique({
          where: {
             platform_externalId: { platform: "instagram", externalId: recipientId }
          }
        });

        if (!account) {
          console.error(`[Worker] CRITICAL: No account found for comment recipientId: ${recipientId}`);
          continue;
        }

        await processWebhookEvent(account.id, text, "comments", fromId, commentId);
      }
    }
  }
};

export const startWorker = () => {
  console.log("Starting BullMQ Workers... Listening for Ingest Jobs.");

  const ingestWorker = new Worker("ingestQueue", async (job) => {
    try {
      return await handleIngest(job);
    } catch (err) {
      console.error("[Worker] Job Error:", err);
      throw err;
    }
  }, { connection });

  ingestWorker.on('completed', async (job) => {
    try {
      // Scale Strategy: Log only if it was a retry OR a 10% sample of successes
      const isRetry = job.attemptsMade > 0;
      const shouldLog = isRetry || Math.random() < 0.1;

      if (shouldLog) {
        let durationMs = null;
        if (job.processedOn && job.finishedOn) {
          durationMs = job.finishedOn - job.processedOn;
        }

        await prisma.workerLog.create({
          data: {
            jobId: job.id || "unknown",
            queueName: "ingestQueue",
            status: isRetry ? "RETRY" : "COMPLETED",
            attempts: job.attemptsMade,
            durationMs,
          }
        });
      }
      console.log(`[Worker] Ingest Job ${job.id} completed.`);
    } catch (e) {
      console.error("[WorkerLog] Failed to log completion:", e);
    }
  });

  ingestWorker.on('failed', async (job, err) => {
    try {
      let durationMs = null;
      if (job?.processedOn && job?.finishedOn) {
        durationMs = job.finishedOn - job.processedOn;
      }

      await prisma.workerLog.create({
        data: {
          jobId: job?.id || "unknown",
          queueName: "ingestQueue",
          status: "FAILED",
          attempts: job?.attemptsMade || 0,
          durationMs,
          error: err.message,
        }
      });
      console.error(`[Worker] Ingest Job ${job?.id} failed: ${err.message}`);
    } catch (e) {
      console.error("[WorkerLog] Failed to log failure:", e);
    }
  });
};

startWorker();
