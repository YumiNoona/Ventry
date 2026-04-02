"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Settings, 
  MessageSquare, 
  BarChart, 
  Zap
} from "lucide-react";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Automations", href: "/dashboard/automations", icon: Zap },
  { name: "Inbox", href: "/dashboard/messages", icon: MessageSquare },
  { name: "Analytics", href: "/dashboard/analytics", icon: BarChart },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export function Sidebar({ user }: { user: { name: string | null; email: string } | null }) {
  const pathname = usePathname();

  return (
    <div className="w-20 lg:w-64 flex-shrink-0 flex flex-col h-screen p-4 gap-4 transition-all duration-300 border-r border-border bg-background">
      {/* Brand / Logo */}
      <div className="flex items-center px-2 lg:px-4 h-14 shrink-0">
        <Link href="/dashboard" className="flex items-center gap-3 font-bold text-xl tracking-tight group outline-none">
          <div className="size-8 rounded-lg bg-foreground text-background flex items-center justify-center text-sm font-bold shadow-sm transition-transform duration-300 group-hover:scale-105">
            V
          </div>
          <span className="hidden lg:block text-foreground transition-all duration-300 group-hover:tracking-tight">
            Ventry
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 flex flex-col gap-1 px-2 py-4 lg:p-4 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(`${item.href}/`));
          const isDashboardExact = item.href === "/dashboard" && pathname === "/dashboard";
          const active = isActive || isDashboardExact;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group flex items-center gap-3 p-2.5 rounded-lg transition-all duration-200 outline-none ${
                active 
                  ? "bg-accent text-accent-foreground font-medium" 
                  : "text-muted-foreground hover:bg-accent/50 hover:text-foreground font-medium"
              }`}
            >
              <div className={`shrink-0 transition-transform duration-200 ${active ? "scale-100" : "group-hover:scale-105 group-active:scale-95"}`}>
                <item.icon className="h-5 w-5 lg:h-[18px] lg:w-[18px]" strokeWidth={active ? 2.5 : 2} />
              </div>
              <span className={`hidden lg:block text-sm transition-opacity duration-200 ${active ? "opacity-100" : "opacity-80 group-hover:opacity-100"}`}>
                {item.name}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Action / Upgrade */}
      <div className="hidden lg:flex flex-col gap-2 p-4 rounded-xl border border-border bg-card transition-all hover:border-border/80 hover:shadow-sm">
        <div className="flex items-center gap-2">
          <Zap className="h-4 w-4 text-foreground" />
          <p className="text-sm font-semibold text-foreground">Pro Plan</p>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">Unlock advanced 3D triggers & analytics.</p>
      </div>
    </div>
  );
}
