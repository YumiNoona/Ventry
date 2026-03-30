import { replyQueue } from "../queues";

interface ReplyPayload {
  messageId: string;
  automationId: string;
}

export const addReplyJob = async (id: string, payload: ReplyPayload) => {
  return await replyQueue.add("reply", payload, {
    jobId: id, 
    attempts: 5,
    backoff: {
      type: "exponential",
      delay: 2000,
    },
  });
};
