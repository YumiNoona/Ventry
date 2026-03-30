import { prisma } from "@ventry/db";

export const buildContext = async (threadId: string) => {
  const thread = await prisma.thread.findUnique({
    where: { id: threadId },
    include: {
      messages: {
        orderBy: { createdAt: 'desc' },
        take: 10, // Fetch last 10 messages for memory
      }
    }
  });

  if (!thread) return null;

  // Reverse so chronological order is 'oldest first' for AI context
  const history = thread.messages.reverse().map(m => ({
    direction: m.direction,
    content: m.content,
  }));

  return history;
};
