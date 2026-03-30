import { Queue } from "bullmq";
import { Redis } from "ioredis";

// Note: BullMQ requires a standard Redis TCP connection.
// If your Upstash instance only provides REST, you may need 
// to use QStash or retrieve the TCP rediss:// URL from the Upstash console.
// We fall back to standard local redis for dev if not provided.

const redisUrl = process.env.REDIS_URL || process.env.UPSTASH_REDIS_REST_URL;

// Parse the URL to see if it requires TLS (Upstash requires this)
const isTls = redisUrl?.startsWith("rediss://") || redisUrl?.includes("upstash.io");

const connection = redisUrl 
  ? new Redis(redisUrl, { 
      maxRetriesPerRequest: null,
      ...(isTls ? { tls: { rejectUnauthorized: false } } : {}) // Mandatory for Upstash
    })
  : new Redis({ host: '127.0.0.1', port: 6379, maxRetriesPerRequest: null });

// Core Queues for Ventry
export const replyQueue = new Queue("replyQueue", { connection });
export const postQueue = new Queue("postQueue", { connection });
export const ingestQueue = new Queue("ingestQueue", { connection });

export { connection };
