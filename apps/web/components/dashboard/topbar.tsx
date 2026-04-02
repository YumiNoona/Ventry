"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Zap, LogOut, Settings, Search, Bell, Loader2, Bot } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";
import { createBrowserClient } from "@/lib/supabase-browser";

export function Topbar({ user }: { user: any }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  
  // Hardcoded to false for now, can be wired up to actual unread count later
  const hasUnread = false;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
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
    <header className="h-16 px-6 lg:px-8 flex items-center justify-between sticky top-0 z-40 bg-background border-b border-border">
      {/* Clean Search Input */}
      <div className="flex-1 max-w-sm">
        <div className="relative group w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-foreground transition-colors" />
          <input 
            type="text" 
            placeholder="Search triggers, messages..." 
            className="w-full h-9 bg-muted/50 border border-transparent rounded-md pl-9 pr-3 text-sm transition-all focus:bg-background focus:border-border focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1 focus:ring-offset-background placeholder:text-muted-foreground font-medium"
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 hidden sm:flex items-center gap-1 opacity-50 text-[10px] font-medium pointer-events-none">
            <span>⌘K</span>
          </div>
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2">
        <div className="hidden sm:flex items-center gap-1 mr-2">
          <ThemeToggle />
          
          {/* Notifications Dropdown */}
          <div className="relative" ref={notifRef}>
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="h-9 w-9 flex items-center justify-center rounded-md hover:bg-muted/80 transition-colors relative"
            >
              <Bell className="h-4 w-4 text-muted-foreground" />
              {hasUnread && (
                <div className="absolute top-2 right-2 size-2 rounded-full bg-foreground border-2 border-background" />
              )}
            </button>
            
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-72 rounded-xl border border-border bg-card p-4 shadow-md origin-top-right z-50 animate-in fade-in zoom-in-95 slide-in-from-top-2">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-sm font-semibold">Notifications</h4>
                  <span className="text-xs text-muted-foreground cursor-pointer hover:text-foreground">Mark all as read</span>
                </div>
                <div className="flex flex-col items-center justify-center py-6 text-center text-muted-foreground space-y-2">
                   <Bot className="h-6 w-6 opacity-40" />
                   <p className="text-sm">You are all caught up.</p>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="h-6 w-px bg-border hidden sm:block mx-1" />

        {/* User Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-muted/50 transition-colors select-none"
          >
            <div className="size-8 rounded-md bg-foreground text-background flex items-center justify-center text-xs font-bold">
              {user?.name?.charAt(0) || "U"}
            </div>
            <div className="hidden md:flex flex-col items-start leading-none pr-1">
              <span className="text-sm font-medium">{user?.name?.split(' ')[0] || "User"}</span>
            </div>
          </button>

          {showDropdown && (
            <div className="absolute right-0 mt-2 w-56 rounded-xl border border-border bg-card p-1 shadow-md origin-top-right z-50 animate-in fade-in zoom-in-95 slide-in-from-top-2">
              <div className="px-2 py-2 mb-1">
                <p className="text-sm font-medium text-foreground leading-none mb-1">{user?.name || "User"}</p>
                <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
              </div>
              
              <div className="h-px bg-border my-1" />
              
              <a 
                href="/dashboard/settings" 
                onClick={() => setShowDropdown(false)}
                className="flex items-center gap-2 w-full p-2 rounded-md text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                <Settings className="h-4 w-4" />
                Settings
              </a>

              <a 
                href="/dashboard/settings/billing" 
                onClick={() => setShowDropdown(false)}
                className="flex items-center gap-2 w-full p-2 rounded-md text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                <Zap className="h-4 w-4" />
                Upgrade Pro
              </a>
              
              <div className="h-px bg-border my-1" />
              
              <button 
                onClick={handleLogout}
                disabled={loggingOut}
                className="flex items-center gap-2 w-full p-2 rounded-md text-sm text-foreground hover:bg-destructive hover:text-destructive-foreground transition-colors disabled:opacity-50"
              >
                {loggingOut ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
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
