"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Button } from "@ventry/ui/components/ui/button";
import { ChevronRight, Zap } from "lucide-react";

const BREADCRUMBS: Record<string, { label: string; parent?: string; parentLabel?: string }> = {
  "/dashboard": { label: "Overview" },
  "/dashboard/automations": { label: "Automations" },
  "/dashboard/automations/new": { label: "New Automation", parent: "/dashboard/automations", parentLabel: "Automations" },
  "/dashboard/messages": { label: "Inbox" },
  "/dashboard/analytics": { label: "Analytics" },
  "/dashboard/settings": { label: "Settings" },
  "/dashboard/settings/accounts": { label: "Connected Accounts", parent: "/dashboard/settings", parentLabel: "Settings" },
  "/dashboard/settings/billing": { label: "Billing", parent: "/dashboard/settings", parentLabel: "Settings" },
};

export function Topbar({ user }: { user: any }) {
  const pathname = usePathname();
  const current = BREADCRUMBS[pathname];

  return (
    <header className="h-14 border-b border-border bg-card/50 px-6 flex items-center justify-between sticky top-0 z-10 backdrop-blur-md">
      {/* Clean breadcrumb — no "Dashboard >" prefix */}
      <div className="flex items-center gap-2 text-sm">
        {current?.parent ? (
          <>
            <Link
              href={current.parent}
              className="text-muted-foreground hover:text-foreground transition-colors font-medium"
            >
              {current.parentLabel}
            </Link>
            <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/40" />
            <span className="font-semibold text-foreground">{current.label}</span>
          </>
        ) : (
          <span className="font-bold text-base">{current?.label || "Dashboard"}</span>
        )}
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 text-xs px-3 py-1.5 rounded-full border border-border bg-background/80">
          <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-muted-foreground font-medium">Free Plan</span>
        </div>
        <Link href="/dashboard/settings/billing">
          <Button
            variant="outline"
            size="sm"
            className="h-8 gap-1.5 border-primary/20 hover:border-primary/40 hover:bg-primary/5 text-xs font-semibold"
          >
            <Zap className="h-3 w-3 text-primary" />
            Upgrade
          </Button>
        </Link>
      </div>
    </header>
  );
}
