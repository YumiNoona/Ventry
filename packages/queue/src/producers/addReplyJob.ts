import { replyQueue } from "../queues";

interface ReplyPayload {
  executionId: string;
  accountId: string;
  text: string;
}

export const addReplyJob = async (id: string, payload: ReplyPayload) => {
  return await replyQueue.add("execute-action", payload, {
    jobId: id, 
    attempts: 5,
    backoff: {
      type: "exponential",
      delay: 2000,
    },
  });
};
