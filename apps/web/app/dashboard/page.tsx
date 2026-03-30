import { OnboardingChecklist } from "@/components/dashboard/onboarding-checklist";
import { requireUser } from "@/lib/getUser";
import { prisma } from "@/lib/prisma";
import { Zap, MessageSquare, Link as LinkIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@ventry/ui/components/ui/button";

export default async function DashboardPage() {
  const { dbUser } = await requireUser();

  // Basic stats
  const [totalReplies, activeAccounts, automationsCount, activeAutomationsCount] = await Promise.all([
    prisma.automationExecution.count({ 
      where: { automation: { userId: dbUser?.id } } 
    }),
    prisma.account.count({ 
      where: { userId: dbUser?.id, accessToken: { not: null } } 
    }),
    prisma.automation.count({
      where: { userId: dbUser?.id }
    }),
    prisma.automation.count({
      where: { userId: dbUser?.id, isActive: true }
    })
  ]);

  return (
    <div className="flex flex-col gap-6">
      <OnboardingChecklist 
        hasAccounts={activeAccounts > 0} 
        hasAutomations={automationsCount > 0} 
        hasActiveAutomations={activeAutomationsCount > 0} 
      />
      
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Welcome back, {dbUser?.name?.split(' ')[0] || 'User'}!</h1>
        <Link href="/dashboard/automations/new">
          <Button>Create Automation</Button>
        </Link>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Stat 1 */}
        <div className="rounded-xl border bg-card p-6 shadow-sm flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-muted-foreground">AI Replies</h3>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="text-3xl font-bold">{totalReplies}</div>
          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
            <span className="text-success inline-block font-semibold">↑ Active</span> this month
          </p>
        </div>
        
        {/* Stat 2 */}
        <div className="rounded-xl border bg-card p-6 shadow-sm flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-muted-foreground">Active Automations</h3>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="text-3xl font-bold">{activeAutomationsCount}</div>
          <p className="text-xs text-muted-foreground mt-1">Listening to DMs & Comments</p>
        </div>

        {/* Stat 3 */}
        <div className="rounded-xl border bg-card p-6 shadow-sm flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-muted-foreground">Connected Accounts</h3>
            <LinkIcon className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="text-3xl font-bold">{activeAccounts}</div>
          <Link href="/dashboard/settings/accounts" className="text-xs text-primary hover:underline mt-1 font-medium">
            Manage connections &rarr;
          </Link>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 mt-4">
        <div className="rounded-xl border bg-card shadow-sm p-0 flex flex-col">
          <div className="p-6 border-b border-border">
            <h3 className="text-lg font-semibold">Recent Activity</h3>
            <p className="text-sm text-muted-foreground mt-1">Latest messages handled by AI.</p>
          </div>
          <div className="p-6 flex flex-col items-center justify-center text-center text-muted-foreground py-12">
            <div className="size-12 rounded-full bg-muted flex items-center justify-center mb-4">
              <MessageSquare className="h-6 w-6 opacity-50" />
            </div>
            <p>No activity yet.</p>
          </div>
        </div>

        <div className="rounded-xl border bg-card shadow-sm flex flex-col p-6 items-center justify-center text-center min-h-[300px]">
          <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <Zap className="h-6 w-6 text-primary" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Ready to automate?</h3>
          <p className="text-sm text-muted-foreground mb-6 max-w-[250px]">
            Set up keyword triggers to organically grow your audience.
          </p>
          <Link href="/dashboard/automations/new">
            <Button>Create your first trigger</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
