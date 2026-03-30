import { CheckCircle2, Circle, Instagram, Zap, MessageSquare } from "lucide-react";
import Link from "next/link";
import { Button } from "@ventry/ui/components/ui/button";

export function OnboardingChecklist({ 
  hasAccounts, 
  hasAutomations, 
  hasActiveAutomations 
}: { 
  hasAccounts: boolean; 
  hasAutomations: boolean; 
  hasActiveAutomations: boolean;
}) {
  const steps = [
    {
      title: "Connect Instagram",
      description: "Link your business profile via Meta to start monitoring engagement.",
      icon: Instagram,
      done: hasAccounts,
      href: "/dashboard/settings/accounts",
    },
    {
      title: "Create your first automation",
      description: "Define keywords that will trigger your AI persona.",
      icon: MessageSquare,
      done: hasAutomations,
      href: "/dashboard/automations/new",
    },
    {
      title: "Activate a trigger",
      description: "Turn your automation ON to start replying to customers.",
      icon: Zap,
      done: hasActiveAutomations,
      href: "/dashboard/automations",
    },
  ];

  const completedCount = steps.filter(s => s.done).length;
  const isComplete = completedCount === steps.length;

  if (isComplete) return null;

  return (
    <div className="rounded-2xl border border-primary/20 bg-primary/5 p-8 mb-8 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
         <Zap className="size-32 text-primary" />
      </div>
      
      <div className="relative z-10 space-y-6">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Getting Started</h2>
          <p className="text-sm text-muted-foreground mt-1">Complete these steps to activate your AI automation engine.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {steps.map((step, i) => (
            <div key={i} className={`p-4 rounded-xl border bg-card transition-all ${step.done ? 'opacity-60 grayscale' : 'shadow-sm hover:shadow-md'}`}>
               <div className="flex items-center justify-between mb-4">
                  <div className={`p-2 rounded-lg ${step.done ? 'bg-success/10 text-success' : 'bg-primary/10 text-primary'}`}>
                    <step.icon className="size-5" />
                  </div>
                  {step.done ? (
                    <CheckCircle2 className="size-5 text-success fill-success/20" />
                  ) : (
                    <Circle className="size-5 text-muted-foreground opacity-30" />
                  )}
               </div>
               <h3 className="font-bold text-sm mb-1">{step.title}</h3>
               <p className="text-xs text-muted-foreground mb-4 line-clamp-2">{step.description}</p>
               {!step.done && (
                 <Link href={step.href}>
                   <Button size="sm" className="w-full text-xs h-8">Complete Step</Button>
                 </Link>
               )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
