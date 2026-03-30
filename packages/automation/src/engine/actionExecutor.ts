import { prisma } from "@ventry/db";
import { generateContent } from "@ventry/ai";

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const executeAction = async (action: any, contextData: any) => {
  if (action.type === "reply_comment" || action.type === "send_dm") {
    // 1. Fetch Account + User + Plan
    const account = await prisma.account.findUnique({
      where: { id: contextData.accountId },
      include: {
        user: {
          include: { plan: true }
        }
      }
    });

    if (!account || !account.accessToken) {
      console.error(`[ActionExecutor] No access token found for account: ${contextData.accountId}`);
      return false;
    }

    // 1.1 Enforcement: Message Limit
    let user = account.user;
    let plan = user.plan;

    if (!plan) {
      // Default to Free plan if none set
      plan = await prisma.plan.findUnique({
        where: { name: "Free" }
      });
    }

    if (plan?.messageLimit !== null) {
      const firstDayOfMonth = new Date();
      firstDayOfMonth.setDate(1);
      firstDayOfMonth.setHours(0, 0, 0, 0);

      const outboundCount = await prisma.message.count({
        where: {
          account: { userId: user.id },
          direction: "outbound",
          createdAt: { gte: firstDayOfMonth }
        }
      });

      const limit = plan?.messageLimit || 50; 
      if (outboundCount >= limit) {
        console.warn(`[ActionExecutor] Usage limit exceeded for user ${user.id} (${outboundCount}/${limit})`);
        return false;
      }
    }



    // 2. Determine the generated text
    let replyText = "";
    if (action.payload?.useAI) {
      replyText = await generateContent("reply", contextData);
    } else {
      replyText = action.payload?.text || "Thanks for your message!";
    }

    // 3. Prepare Payload
    let endpoint = "";
    let body = {};

    if (action.type === "send_dm") {
      endpoint = `https://graph.facebook.com/v19.0/${account.externalId}/messages`;
      body = {
        recipient: { id: contextData.senderId || contextData.threadId },
        message: { text: replyText },
        access_token: account.accessToken,
      };
    } else if (action.type === "reply_comment") {
      const commentId = contextData.externalId;
      endpoint = `https://graph.facebook.com/v19.0/${commentId}/replies`;
      body = {
        message: replyText,
        access_token: account.accessToken,
      };
    }

    // 4. Execute With Retries (Decided logic: 3 retries, 1s, 5s, 15s)
    const retryDelays = [1000, 5000, 15000];
    let lastError: any = null;

    console.log("[Meta][Request]", JSON.stringify({ type: action.type, endpoint, body: { ...body, access_token: "REDACTED" } }));

    for (let i = 0; i <= 3; i++) {
      try {
        const response = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });

        const result: any = await response.json();
        console.log("[Meta][Response]", response.status, JSON.stringify(result));

        if (response.ok) {
          // 5. Persist the outbound Message
          const message = await prisma.message.create({
            data: {
              accountId: contextData.accountId,
              threadId: contextData.threadId,
              externalId: result.message_id || result.id || "ext_" + Date.now().toString(),
              direction: "outbound", // Prisma 7 will map this string to the MessageDirection enum
              content: replyText,
            },
          });

          // 6. Audit Log: Trace high-level execution
          if (contextData.automationId) {
            await prisma.automationExecution.create({
              data: {
                automationId: contextData.automationId,
                messageId: message.id,
              }
            });
          }

          return true;
        }



        // Only retry on 5xx or 429
        if (response.status < 500 && response.status !== 429) {
          console.error("[Meta][Error] Non-retryable status:", response.status);
          return false;
        }

        lastError = result;
      } catch (error) {
        console.error("[Meta][Error] Network failure:", error);
        lastError = error;
      }

      if (i < 3) {
        console.log(`[ActionExecutor] Retry ${i + 1} after ${retryDelays[i]}ms...`);
        await wait(retryDelays[i]);
      }
    }

    console.error("[Meta][Error] All retries failed.");
    return false;
  }

  console.warn(`[ActionExecutor] Unrecognized action type: ${action.type}`);
  return false;
};


