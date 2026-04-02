"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Button } from "@ventry/ui/components/ui/button";
import { ChevronRight, Zap, LogOut, Settings, User, Loader2 } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";
import { createBrowserClient } from "@/lib/supabase-browser";

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
  const [showDropdown, setShowDropdown] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      const supabase = createBrowserClient();
      await supabase.auth.signOut();
      window.location.href = "/login";
    } catch (e) {
      setLoggingOut(false);
      setShowDropdown(false);
    }
  };

  return (
    <header className="h-14 border-b border-border bg-card/50 px-6 flex items-center justify-between sticky top-0 z-10 backdrop-blur-md">
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
        <ThemeToggle />
        
        <div className="hidden sm:flex items-center gap-2 text-xs px-3 py-1.5 rounded-full border border-border bg-background/80">
          <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-muted-foreground font-medium">Free Plan</span>
        </div>
        
        <Link href="/dashboard/settings/billing" className="hidden xs:block">
          <Button
            variant="outline"
            size="sm"
            className="h-8 gap-1.5 border-primary/20 hover:border-primary/40 hover:bg-primary/5 text-xs font-semibold"
          >
            <Zap className="h-3 w-3 text-primary" />
            Upgrade
          </Button>
        </Link>

        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setShowDropdown(!showDropdown)}
            className="size-8 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-[10px] font-bold text-primary ring-2 ring-primary/10 uppercase transition-transform active:scale-95 hover:ring-primary/30"
          >
            {user?.name?.charAt(0) || "U"}
          </button>

          {showDropdown && (
            <div className="absolute right-0 mt-2 w-56 rounded-xl border border-border bg-card shadow-lg shadow-black/10 py-2 animate-in fade-in zoom-in-95 origin-top-right z-50">
              <div className="px-4 py-2 border-b border-border mb-1">
                <p className="text-sm font-bold truncate text-foreground">{user?.name || "User"}</p>
                <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
              </div>
              
              <Link 
                href="/dashboard/settings" 
                onClick={() => setShowDropdown(false)}
                className="flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              >
                <Settings className="h-4 w-4" />
                Settings
              </Link>
              
              <div className="h-px bg-border my-1" />
              
              <button 
                onClick={handleLogout}
                disabled={loggingOut}
                className="flex items-center gap-2 w-full px-4 py-2 text-sm text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors disabled:opacity-50"
              >
                {loggingOut ? (
                  <Loader2 className="h-4 w-4 animate-spin text-destructive" />
                ) : (
                  <LogOut className="h-4 w-4" />
                )}
                {loggingOut ? "Signing out..." : "Sign Out"}
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
