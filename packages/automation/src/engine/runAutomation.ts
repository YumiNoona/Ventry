import { prisma } from "@ventry/db";
import { matchTriggers } from "./triggerMatcher";
import { buildContext } from "./contextBuilder";
import { executeAction } from "./actionExecutor";

export const processWebhookEvent = async (accountId: string, content: string, eventType: string, externalThreadId: string, externalId: string) => {
  // 1. Idempotency Check
  const exists = await prisma.message.findUnique({
    where: { externalId }
  });

  if (exists) {
    console.log(`[runAutomation] Skipping duplicate message: ${externalId}`);
    return;
  }

  // 2. Fetch Account & Verify "Ignore Self"
  const account = await prisma.account.findUnique({
    where: { id: accountId }
  });

  if (!account) return;

  // We check externalThreadId because in DMs, the thread ID is often the sender ID
  if (externalThreadId === account.externalId) {
    console.log(`[runAutomation] Ignoring self-message from account: ${account.externalId}`);
    return;
  }

  // 3. Rate Limiting & Loop Breaker
  const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
  const fiveSecondsAgo = new Date(Date.now() - 5 * 1000);

  const threadMessages = await prisma.message.findMany({
    where: {
      accountId,
      thread: { externalThreadId },
      createdAt: { gte: tenMinutesAgo }
    },
    orderBy: { createdAt: "desc" },
    take: 11 // Just enough to see if we hit 10
  });

  // Loop Breaker: If last message was outbound and very recent
  const lastMessage = threadMessages[0];
  if (lastMessage?.direction === "outbound" && lastMessage.createdAt > fiveSecondsAgo) {
    console.log(`[runAutomation] Loop breaker triggered for thread: ${externalThreadId}`);
    return;
  }

  // Rate Limit: 10 replies per 10 minutes
  const outboundCount = threadMessages.filter(m => m.direction === "outbound").length;
  if (outboundCount >= 10) {
    console.warn(`[runAutomation] Rate limit exceeded for thread: ${externalThreadId}`);
    return;
  }

  // 4. Ensure the conversation Thread exists
  const thread = await prisma.thread.upsert({
    where: {
      accountId_externalThreadId: { accountId, externalThreadId }
    },
    update: {},
    create: { accountId, externalThreadId }
  });

  // 5. Persist the incoming Message
  const incomingMessage = await prisma.message.create({
    data: {
      accountId,
      threadId: thread.id,
      externalId,
      direction: "inbound", // Prisma 7 enum mapping
      content,
    }
  });

  // 6. Identify which automations map to this incoming event
  const triggers = await matchTriggers(accountId, content, eventType, externalId);
  if (triggers.length === 0) {
    console.log(`[runAutomation] No triggers matched for account: ${accountId}`);
    return;
  }

  // 7. Deduplicate & Dispatch to Worker Queue
  for (const trigger of triggers) {
    // Deduplication check: Was this exact trigger mapped to this account recently?
    const exists = await prisma.automationExecution.findFirst({
      where: {
        triggerId: trigger.id,
        automation: {
          user: {
            accounts: { some: { id: accountId } }
          }
        },
        createdAt: {
          gt: new Date(Date.now() - 5 * 60 * 1000)
        }
      }
    });

    if (exists) {
      console.log(`[runAutomation] Deduplicated execution for trigger: ${trigger.id}`);
      continue;
    }

    // Generate the PENDING execution ticket
    const execution = await prisma.automationExecution.create({
      data: {
        automationId: trigger.automationId,
        triggerId: trigger.id,
        messageId: incomingMessage.id, // Track which message spawned this
        status: "PENDING"
      }
    });

    // Enqueue to BullMQ worker explicitly mapped by executionId
    // We import addReplyJob later, for now we will enqueue directly or via utility
    const { addReplyJob } = await import("@ventry/queue");
    await addReplyJob(execution.id, {
      executionId: execution.id,
      accountId,
      text: content
    });
  }
};

