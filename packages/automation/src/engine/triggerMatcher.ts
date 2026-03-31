import { prisma, TriggerType } from "@ventry/db";

const extractWords = (text: string) => text.toLowerCase().match(/\b\w+\b/g) || [];

export const matchTriggers = async (accountId: string, content: string, eventType: string, mediaId?: string) => {
  const normalizedType: TriggerType = eventType === "messages" ? "DM" : "COMMENT";

  const triggers = await prisma.trigger.findMany({
    where: {
      automation: {
        user: {
          accounts: { some: { id: accountId } }
        },
        isActive: true, // Only active automations
      },
      AND: [
        {
          keywords: {
            hasSome: extractWords(content)
          }
        },
        {
          OR: [
            { type: "DM" },
            {
              type: "COMMENT",
              postId: mediaId, // Restrict comments to specific media if configured
            }
          ]
        }
      ]
    },
    include: {
      automation: {
        include: { actions: true }
      }
    }
  });

  return triggers;
};
