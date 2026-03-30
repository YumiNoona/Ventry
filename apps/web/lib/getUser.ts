import { createClient } from "./supabase";
import { prisma } from "./prisma";
import { redirect } from "next/navigation";

export async function getUser() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  return user;
}

export async function requireUser() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id }
  });

  return { authUser: user, dbUser };
}
