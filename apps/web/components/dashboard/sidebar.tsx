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
    <div className="w-64 flex-shrink-0 border-r border-border bg-card/80 backdrop-blur-xl flex flex-col justify-between">
      <div>
        <div className="h-16 flex items-center px-6 border-b border-border">
          <Link href="/dashboard" className="flex items-center gap-2.5 font-bold text-xl tracking-tight group">
            <div className="size-7 rounded-lg bg-primary text-primary-foreground flex items-center justify-center text-xs font-black transition-transform duration-200 group-hover:scale-110 group-hover:rotate-3">V</div>
            <span className="transition-colors duration-200 group-hover:text-primary">Ventry</span>
          </Link>
        </div>
        <nav className="p-3 space-y-0.5">
          {navItems.map((item: typeof navItems[number]) => {
            const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(`${item.href}/`));
            const isDashboardExact = item.href === "/dashboard" && pathname === "/dashboard";
            const active = isActive || isDashboardExact;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group relative flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                  active 
                    ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20" 
                    : "text-muted-foreground hover:bg-muted/80 hover:text-foreground hover:translate-x-0.5"
                }`}
              >
                <item.icon className={`h-4 w-4 transition-all duration-200 ${
                  active 
                    ? "text-primary-foreground" 
                    : "text-muted-foreground group-hover:text-foreground group-hover:scale-110"
                }`} />
                {item.name}
                {active && (
                  <span className="absolute right-3 flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-foreground/60 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary-foreground"></span>
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

    </div>
  );
}
