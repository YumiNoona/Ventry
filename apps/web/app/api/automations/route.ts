import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  const { name, keywords, type, useAI } = body;

  // For MVP, find first user or create one
  let user = await prisma.user.findFirst();
  if (!user) {
    user = await prisma.user.create({ data: { email: "owner@ventry.ai", name: "System Owner" } });
  }

  const automation = await prisma.automation.create({
    data: {
      userId: user.id,
      name,
      isActive: true,
      triggers: {
        create: {
          type: "messages",
          keywords,
        }
      },
      actions: {
        create: {
          type,
          payload: { useAI }
        }
      }
    }
  });

  return NextResponse.json(automation);
}
