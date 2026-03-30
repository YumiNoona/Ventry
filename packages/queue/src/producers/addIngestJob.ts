import { ingestQueue } from "../queues";

interface IngestPayload {
  platform: string;
  payload: any;
}

export const addIngestJob = async (id: string, payload: IngestPayload) => {
  return await ingestQueue.add("ingest", payload, {
    jobId: id, // ensures idempotency so we don't process the same webhook event twice
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 1000,
    },
  });
};
