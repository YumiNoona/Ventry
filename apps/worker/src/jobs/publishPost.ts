import { Worker } from "bullmq";
import { connection } from "@ventry/queue";
import { prisma } from "@ventry/db";

// Dedicated queue for scheduling/publishing posts
export const startPostWorker = () => {
  const postWorker = new Worker("postQueue", async (job) => {
    const { postId } = job.data;
    console.log(`[Worker] Publishing post ${postId}`);
    
    const post = await prisma.post.findUnique({ where: { id: postId }, include: { account: true }});
    if (!post) throw new Error("Post not found");

    console.log(`Uploading to Instagram... ${post.content}`);
    
    await prisma.post.update({
      where: { id: postId },
      data: { status: 'published' }
    });

  }, { connection });

  postWorker.on('completed', async (job) => {
    try {
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
            queueName: "postQueue",
            status: isRetry ? "RETRY" : "COMPLETED",
            attempts: job.attemptsMade,
            durationMs,
          }
        });
      }
    } catch (e) {
      console.error("[WorkerLog] Failed to log post completion:", e);
    }
  });

  postWorker.on('failed', async (job, err) => {
    try {
      let durationMs = null;
      if (job?.processedOn && job?.finishedOn) {
        durationMs = job.finishedOn - job.processedOn;
      }

      await prisma.workerLog.create({
        data: {
          jobId: job?.id || "unknown",
          queueName: "postQueue",
          status: "FAILED",
          attempts: job?.attemptsMade || 0,
          durationMs,
          error: err.message,
        }
      });
    } catch (e) {
       console.error("[WorkerLog] Failed to log post failure:", e);
    }
  });
};
