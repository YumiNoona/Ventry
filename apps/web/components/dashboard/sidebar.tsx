"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Settings, 
  MessageSquare, 
  BarChart, 
  Zap,
  LogOut
} from "lucide-react";
import { createClient } from "@/lib/supabase"; // Client-side safe initialization 

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Automations", href: "/dashboard/automations", icon: Zap },
  { name: "Inbox", href: "/dashboard/messages", icon: MessageSquare },
  { name: "Analytics", href: "/dashboard/analytics", icon: BarChart },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export function Sidebar({ user }: { user: any }) {
  const pathname = usePathname();

  const handleLogout = async () => {
    // using window location here to trigger hard refresh and clear state
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  return (
    <div className="w-64 flex-shrink-0 border-r border-border bg-card flex flex-col justify-between">
      <div>
        <div className="h-16 flex items-center px-6 border-b border-border">
          <Link href="/dashboard" className="flex items-center gap-2 font-bold text-xl tracking-tight">
            <div className="size-6 rounded bg-primary text-primary-foreground flex items-center justify-center text-xs">V</div>
            Ventry
          </Link>
        </div>
        <nav className="p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  isActive 
                    ? "bg-primary/10 text-primary" 
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <item.icon className={`h-4 w-4 ${isActive ? "text-primary" : "text-muted-foreground"}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-4 border-t border-border space-y-4">
        <div className="flex items-center gap-3">
          <div className="size-8 rounded-full bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground uppercase">
            {user?.name?.charAt(0) || "U"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user?.name || "User"}</p>
            <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
          </div>
        </div>
        <button 
          onClick={handleLogout}
          className="flex items-center gap-2 w-full px-3 py-2 text-sm text-muted-foreground font-medium rounded-md hover:bg-destructive/10 hover:text-destructive transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </button>
      </div>
    </div>
  );
}
