import { Worker } from "bullmq";
import { connection } from "@ventry/queue";
import { prisma } from "@ventry/db";

// Dedicated queue for scheduling/publishing posts
export const startPostWorker = () => {
  const postWorker = new Worker("postQueue", async (job) => {
    const { postId } = job.data;
    console.log(`[Worker] Publishing post ${postId}`);
    
    // 1. Fetch post and connection details
    const post = await prisma.post.findUnique({ where: { id: postId }, include: { account: true }});
    if (!post) throw new Error("Post not found");

    // 2. Call Instagram API
    console.log(`Uploading to Instagram... ${post.content}`);
    
    // 3. Mark published
    await prisma.post.update({
      where: { id: postId },
      data: { status: 'published' }
    });

  }, { connection });
};
