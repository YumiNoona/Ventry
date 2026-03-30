'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { requireUser } from '@/lib/getUser'

export async function createAutomation(formData: FormData) {
  const { dbUser } = await requireUser();

  const name = formData.get('name') as string;
  const keywordsStr = formData.get('keywords') as string;
  const keywords = keywordsStr.split(',').map(k => k.trim().toUpperCase()).filter(Boolean);
  const type = formData.get('type') as string; // 'DM' or 'COMMENT' or 'ALL'
  const useAI = formData.get('useAI') === 'on';

  if (!name || keywords.length === 0) {
    return { error: 'Name and at least one keyword are required' };
  }

  await prisma.automation.create({
    data: {
      userId: dbUser?.id || "",
      name,
      isActive: true,
      triggers: {
        create: {
          type: type === 'ALL' ? 'DM_COMMENT' : type,
          keywords,
        }
      },
      actions: {
        create: {
          type: useAI ? 'AI_REPLY' : 'TEXT_REPLY',
          payload: useAI ? { model: 'gemini-1.5-flash' } : { text: 'Default response' }
        }
      }
    }
  });

  revalidatePath('/dashboard/automations');
  redirect('/dashboard/automations');
}
