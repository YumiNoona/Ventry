import { prisma } from "@ventry/db";
import { generateContent } from "@ventry/ai";

export const executeAction = async (action: any, contextData: any) => {
  if (action.type === 'reply_comment' || action.type === 'send_dm') {
    // Determine the generated text
    let replyText = "";
    
    // Check if the payload specifies an AI reply instead of hardcoded
    if (action.payload?.useAI) {
      replyText = await generateContent("reply", contextData);
    } else {
      replyText = action.payload?.text || "Thanks for your message!";
    }

    // Pretend External API Call to Instagram
    console.log(`[ActionExecutor] Triggering external API...`);
    console.log(`Sending payload to External API -> Mode: ${action.type}, Content: ${replyText}`);
    
    // Add the generated AI reply back to database locally as an outbound message
    await prisma.message.create({
      data: {
        accountId: contextData.accountId,
        threadId: contextData.threadId,
        externalId: "ext_" + Date.now().toString(), // Stub for standard meta id
        direction: "outbound",
        content: replyText,
      }
    });

    return true;
  }
  
  console.warn(`[ActionExecutor] Unrecognized action type: ${action.type}`);
  return false;
};
