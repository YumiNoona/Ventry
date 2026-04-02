import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/getUser";
import { EditAutomationForm } from "./edit-form";

export default async function EditAutomationPage({ params }: { params: { id: string } }) {
  const user = await getAuthUser();

  const automation = await prisma.automation.findUnique({
    where: { 
      id: params.id,
      userId: user.id 
    },
    include: {
      triggers: true,
      actions: true
    }
  });

  if (!automation) {
    notFound();
  }

  const trigger = automation.triggers[0];
  const action = automation.actions[0];

  const initialData = {
    id: automation.id,
    name: automation.name,
    triggerType: trigger?.type || 'DM',
    keywords: trigger?.keywords?.join(', ') || '',
    useAI: action?.type === 'AI_REPLY',
    customReply: action?.type === 'TEXT_REPLY' && action.payload ? (action.payload as any).text : ''
  };

  return <EditAutomationForm initialData={initialData} />;
}
