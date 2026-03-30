import { prisma } from "@ventry/db";

export const matchTriggers = async (accountId: string, content: string, eventType: string) => {
  // Find active automations for the account's user
  const account = await prisma.account.findUnique({
    where: { id: accountId },
    include: {
      user: {
        include: {
          automations: {
            where: { isActive: true },
            include: { triggers: true, actions: true }
          }
        }
      }
    }
  });

  if (!account) return [];

  const matchedAutomations = [];

  for (const automation of account.user.automations) {
    for (const trigger of automation.triggers) {
      if (trigger.type !== eventType) continue;

      const keywords = trigger.keywords || [];
      if (keywords.length === 0) {
        matchedAutomations.push(automation);
        continue;
      }

      // Simple keyword match (can be enhanced with regex)
      const lowerContent = content.toLowerCase();
      const hasMatch = keywords.some(kw => lowerContent.includes(kw.toLowerCase()));
      
      if (hasMatch) {
        matchedAutomations.push(automation);
        break; // matched this automation
      }
    }
  }

  return matchedAutomations;
};
