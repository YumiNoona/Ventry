import { Worker } from "bullmq";
import { connection } from "@ventry/queue";
import { processWebhookEvent } from "@ventry/automation";

// Helper to determine what type of ingest event it is
const handleIngest = async (job: any) => {
  const { platform, payload } = job.data;
  console.log(`[Worker] Processing ingest job ${job.id} for ${platform}`);
  
  // Example dummy payload parsing for Instagram
  const accountId = "dummy-account-id"; // in real app, fetch from payload
  const content = payload.changes?.[0]?.value?.text || "test";
  const eventType = payload.changes?.[0]?.field || "keyword_match";
  const threadId = "dummy-thread-id";

  await processWebhookEvent(accountId, content, eventType, threadId);
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
