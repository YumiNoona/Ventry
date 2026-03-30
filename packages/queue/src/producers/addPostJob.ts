import { postQueue } from "../queues";

interface PostPayload {
  postId: string;
}

export const addPostJob = async (id: string, payload: PostPayload) => {
  return await postQueue.add("post", payload, {
    jobId: id,
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 5000,
    },
  });
};
