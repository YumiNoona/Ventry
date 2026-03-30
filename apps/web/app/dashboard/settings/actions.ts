'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase'
import { prisma } from '@/lib/prisma'
import { requireUser } from '@/lib/getUser'

export async function updateProfile(formData: FormData) {
  const { authUser, dbUser } = await requireUser();
  const supabase = createClient();

  const name = formData.get('name') as string;
  const email = formData.get('email') as string;

  // Update Supabase Auth Email if changed
  if (email !== authUser.email) {
    const { error } = await supabase.auth.updateUser({ email });
    if (error) {
      return { error: error.message };
    }
  }

  // Update Prisma Profile
  await prisma.user.update({
    where: { id: dbUser?.id },
    data: { name, email }
  });

  revalidatePath('/dashboard/settings');
  return { success: "Profile updated successfully" };
}

export async function updatePassword(formData: FormData) {
  const { authUser } = await requireUser();
  const supabase = createClient();

  const password = formData.get('password') as string;

  const { error } = await supabase.auth.updateUser({ password });
  
  if (error) {
    return { error: error.message };
  }

  return { success: "Password updated successfully" };
}
