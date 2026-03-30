import { prisma } from "@ventry/db";
import { matchTriggers } from "./triggerMatcher";
import { buildContext } from "./contextBuilder";
import { executeAction } from "./actionExecutor";

export const processWebhookEvent = async (accountId: string, content: string, eventType: string, externalThreadId: string) => {
  // 1. Ensure the conversation Thread exists
  const thread = await prisma.thread.upsert({
    where: {
      accountId_externalThreadId: { accountId, externalThreadId }
    },
    update: {},
    create: { accountId, externalThreadId }
  });

  // 2. Persist the incoming Message
  await prisma.message.create({
    data: {
      accountId,
      threadId: thread.id,
      externalId: "in_ext_" + Date.now().toString(), // Stub for standard meta id
      direction: "inbound",
      content,
    }
  });

  // 3. Identify which automations map to this incoming event / message
  const matchingAutomations = await matchTriggers(accountId, content, eventType);
  if (matchingAutomations.length === 0) {
    console.log(`[runAutomation] No triggers matched for account: ${accountId}`);
    return;
  }

  // 4. Build conversation history for context
  const history = await buildContext(thread.id);

  // 3. For every matched automation, run its assigned Actions
  for (const automation of matchingAutomations) {
    for (const action of automation.actions) {
      // 4. Execute the action, dynamically leaning on AI if configured
      await executeAction(action, {
        accountId,
        threadId: thread.id,
        history,
        triggeringMessage: content,
      });
    }
  }
};
