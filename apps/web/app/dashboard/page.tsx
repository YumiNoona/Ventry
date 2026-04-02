import { OnboardingChecklist } from "@/components/dashboard/onboarding-checklist";
import { SystemStatus } from "@/components/dashboard/system-status";
import { getAuthUser } from "@/lib/getUser";
import { prisma } from "@/lib/prisma";
import { Zap, MessageSquare, Link as LinkIcon, ArrowUpRight, TrendingUp } from "lucide-react";
import Link from "next/link";
import { Button } from "@ventry/ui/components/ui/button";

export default async function DashboardPage() {
  const user = await getAuthUser();
  const userName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'User';

  const [totalReplies, activeAccounts, automationsCount, activeAutomationsCount] = await Promise.all([
    prisma.automationExecution.count({ 
      where: { automation: { userId: user.id } } 
    }),
    prisma.account.count({ 
      where: { userId: user.id, accessToken: { not: null } } 
    }),
    prisma.automation.count({
      where: { userId: user.id }
    }),
    prisma.automation.count({
      where: { userId: user.id, isActive: true }
    })
  ]);

  return (
    <div className="max-w-[1400px] mx-auto space-y-8 animate-page-enter p-8 overflow-x-hidden">
      {/* Dynamic Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 stagger-children">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Welcome back, {userName.split(' ')[0]}.
          </h1>
          <p className="text-muted-foreground text-sm">Your AI agents are currently monitoring <span className="text-foreground font-medium">{activeAutomationsCount} channels</span>.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Link href="/dashboard/automations/new">
            <Button className="h-10 px-4 gap-2 font-medium shadow-sm transition-all hover:shadow-md">
              <Zap className="h-4 w-4" />
              New Automation
            </Button>
          </Link>
        </div>
      </div>

      <OnboardingChecklist 
        hasAccounts={activeAccounts > 0} 
        hasAutomations={automationsCount > 0} 
        hasActiveAutomations={activeAutomationsCount > 0} 
      />
      
      {/* Clean Grid Transformation */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 stagger-children">
        
        {/* Engagement Stats - Double Wide */}
        <div className="md:col-span-2 bento-card flex flex-col justify-between group overflow-hidden relative">
          <div className="absolute top-0 right-0 p-8 opacity-[0.02] -rotate-12 transition-transform group-hover:scale-105 group-hover:rotate-0">
             <MessageSquare className="size-32" />
          </div>
          
          <div className="flex items-center justify-between z-10 w-full h-full">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Total Engagement</p>
              <h2 className="text-4xl font-bold tabular-nums tracking-tight text-foreground">{totalReplies.toLocaleString()}</h2>
            </div>
            
            <div className="flex flex-col items-end gap-2 text-right">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-success/15 text-success text-xs font-bold w-fit">
                <TrendingUp className="h-3 w-3" />
                +18.4%
              </div>
              <p className="text-xs font-medium text-muted-foreground">vs last 30 days</p>
            </div>
          </div>
        </div>

        {/* Active Channels - Square */}
        <div className="bento-card flex flex-col justify-between group">
           <div className="flex items-center justify-between">
             <div className="size-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center transition-all group-hover:bg-primary/20">
                <Zap className="h-5 w-5" />
             </div>
             <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-50 transition-opacity group-hover:opacity-100" />
           </div>
           <div className="mt-6">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Active Automations</p>
              <h3 className="text-3xl font-bold mt-1 text-foreground leading-none">{activeAutomationsCount}</h3>
              <div className="flex items-center gap-2 mt-3">
                 <div className="size-2 rounded-full bg-success shadow-[0_0_8px_hsla(var(--success)/0.6)]" />
                 <span className="text-xs font-medium text-muted-foreground">Monitoring active traffic</span>
              </div>
           </div>
        </div>

        {/* Connected Accounts - Square */}
        <div className="bento-card flex flex-col justify-between group">
           <div className="flex items-center justify-between">
             <div className="size-10 rounded-lg bg-muted text-muted-foreground flex items-center justify-center transition-all group-hover:bg-muted/80">
                <LinkIcon className="h-5 w-5" />
             </div>
             <Link href="/dashboard/settings/accounts">
                <ArrowUpRight className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors" />
             </Link>
           </div>
           <div className="mt-6">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Account Status</p>
              <h3 className="text-3xl font-bold mt-1 text-foreground flex items-baseline gap-2">
                {activeAccounts} 
                <span className="text-sm font-medium text-muted-foreground">Linked</span>
              </h3>
              <Link href="/dashboard/settings/accounts" className="inline-block mt-3 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors">
                Review connection links &rarr;
              </Link>
           </div>
        </div>

        {/* System Health / Alerts - Horizontal Wide */}
        <div className="md:col-span-4 bento-card p-0 overflow-hidden border-border bg-background shadow-xs">
           <SystemStatus />
        </div>
      </div>
    </div>
  );
}
