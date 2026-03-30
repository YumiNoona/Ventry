"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Button } from "@ventry/ui/components/ui/button";

export function Topbar({ user }: { user: any }) {
  const pathname = usePathname();
  
  // Basic breadcrumb generation
  const segments = pathname.split('/').filter(Boolean).slice(1);
  const title = segments.length > 0 
    ? segments[0].charAt(0).toUpperCase() + segments[0].slice(1) 
    : "Overview";

  return (
    <header className="h-16 border-b border-border bg-card/50 px-6 flex items-center justify-between sticky top-0 z-10 backdrop-blur-sm">
      <div className="flex items-center gap-2">
        <h1 className="text-lg font-semibold tracking-tight">{title}</h1>
      </div>
      
      <div className="flex items-center gap-4">
        {/* Placeholder for usage meter */}
        <div className="flex items-center gap-2 text-sm px-3 py-1.5 rounded-full border border-border bg-background">
          <div className="h-2 w-2 rounded-full bg-success"></div>
          <span className="text-muted-foreground font-medium">Free Plan</span>
          {/* We'll load context dynamically later */}
        </div>
        
        <Link href="/dashboard/settings/billing">
          <Button variant="outline" size="sm" className="h-8">Upgrade</Button>
        </Link>
      </div>
    </header>
  );
}
