import { prisma, decryptToken } from "@ventry/db";
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

    const decryptedAccessToken = decryptToken(account.accessToken);
    if (!decryptedAccessToken) {
      console.error(`[ActionExecutor] Failed to decrypt access token for account: ${contextData.accountId}`);
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
        access_token: decryptedAccessToken,
      };
    } else if (action.type === "reply_comment") {
      const commentId = contextData.externalId;
      endpoint = `https://graph.facebook.com/v19.0/${commentId}/replies`;
      body = {
        message: replyText,
        access_token: decryptedAccessToken,
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
        console.log(`[Meta][Response][${response.status}]`, JSON.stringify(result));

        if (response.ok) {
          // ... (existing success logic)
          const message = await prisma.message.create({
            data: {
              accountId: contextData.accountId,
              threadId: contextData.threadId,
              externalId: result.message_id || result.id || "ext_" + Date.now().toString(),
              direction: "outbound",
              content: replyText,
            },
          });

          if (contextData.automationId && contextData.triggerId) {
            await prisma.automationExecution.create({
              data: {
                automationId: contextData.automationId,
                triggerId: contextData.triggerId,
                messageId: message.id,
              }
            });
          }

          return true;
        }

        // 7. Token Health & Retry Classification
        const error = result.error;
        const errorCode = error?.code;
        const errorSubcode = error?.error_subcode;

        // Code 190 is explicitly an Access Token error
        // Subcodes: 458 (App deauthorized), 463 (Expired)
        const isAuthError = errorCode === 190 || [458, 463].includes(errorSubcode);

        if (isAuthError) {
          console.error(`[Meta][Error] Terminal Token Error for account ${contextData.accountId}. Code: ${errorCode}, Subcode: ${errorSubcode}`);
          
          await prisma.account.update({
            where: { id: contextData.accountId },
            data: {
              tokenValid: false,
              lastChecked: new Date(),
            },
          });

          // Deduplicated Notification: Only create if no unread TOKEN_INVALID exists
          const existingNotification = await prisma.notification.findFirst({
            where: {
              userId: account.userId,
              type: "TOKEN_INVALID",
              isRead: false,
            }
          });

          if (!existingNotification) {
            await prisma.notification.create({
              data: {
                userId: account.userId,
                type: "TOKEN_INVALID",
                message: "Instagram connection expired. Please reconnect.",
              }
            });
          }

          return false;
        }

        // 8. Retry Signaling: Codes 4/17 are rate limits
        if (errorCode === 4 || errorCode === 17) {
          console.warn(`[Meta][Retry] Rate limit encountered. Code: ${errorCode}. Throwing for BullMQ retry.`);
          throw new Error("RATE_LIMIT");
        }

        // If it's a 400/401 but NOT a terminal auth error, it might be a temporary platform issue or specific API error
        // We should allow it to retry if it's 5xx/429 or log it as non-retryable if it's a permanent bad request (e.g. invalid recipient)
        if (response.status < 500 && response.status !== 429) {
          console.error(`[Meta][Error] Non-retryable error [${response.status}]:`, JSON.stringify(result));
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


