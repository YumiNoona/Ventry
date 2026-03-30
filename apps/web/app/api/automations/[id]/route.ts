import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  const body = await req.json();
  const { isActive } = body;

  const automation = await prisma.automation.update({
    where: { id },
    data: { isActive },
  });

  return NextResponse.json(automation);
}
