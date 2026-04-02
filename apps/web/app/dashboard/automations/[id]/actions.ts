'use server'

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { ActionState } from '@/lib/types';
import { redirect } from 'next/navigation';

export async function updateAutomation(id: string, prevState: ActionState, formData: FormData): Promise<ActionState> {
  const name = formData.get('name') as string;
  const keywordsStr = formData.get('keywords') as string;
  const keywords = keywordsStr.split(',').map(k => k.trim().toUpperCase()).filter(Boolean);
  const type = formData.get('type') as string; // 'DM' or 'COMMENT' or 'ALL'
  const useAI = formData.get('useAI') === 'on' || formData.get('useAI') === 'true';
  const customReply = formData.get('customReply') as string;

  if (!name || keywords.length === 0) {
    return { error: 'Name and at least one keyword are required', success: null };
  }

  const trigger = await prisma.trigger.findFirst({ where: { automationId: id } });
  const action = await prisma.action.findFirst({ where: { automationId: id } });

  await prisma.automation.update({
    where: { id },
    data: { name }
  });

  if (trigger) {
    await prisma.trigger.update({
      where: { id: trigger.id },
      data: { type: (type === 'ALL' ? 'DM' : type) as any, keywords }
    });
  }

  if (action) {
    await prisma.action.update({
      where: { id: action.id },
      data: {
        type: useAI ? 'AI_REPLY' : 'TEXT_REPLY',
        payload: useAI ? { model: 'gemini-1.5-flash' } : { text: customReply || 'Default response' }
      }
    });
  }

  revalidatePath('/dashboard/automations');
  redirect('/dashboard/automations');
}

export async function deleteAutomation(id: string) {
  await prisma.action.deleteMany({ where: { automationId: id }});
  await prisma.trigger.deleteMany({ where: { automationId: id }});
  await prisma.automation.delete({ where: { id }});
  
  revalidatePath('/dashboard/automations');
  redirect('/dashboard/automations');
}
