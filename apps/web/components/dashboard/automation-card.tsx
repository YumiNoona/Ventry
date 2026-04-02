"use client";

import { useState } from "react";
import { Button } from "@ventry/ui/components/ui/button";
import { Zap, MessageSquare } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface AutomationWithTriggers {
  id: string;
  name: string;
  isActive: boolean;
  keywords: string[];
  executions: any[];
}

export function AutomationCard({ automation }: { automation: AutomationWithTriggers }) {
  const router = useRouter();
  const [isActive, setIsActive] = useState(automation.isActive);

  const toggleAutomation = async () => {
    // Optimistic UI: Apply the change immediately
    const nextState = !isActive;
    setIsActive(nextState);
    
    try {
      const response = await fetch(`/api/automations/${automation.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: nextState }),
      });
      if (!response.ok) {
        throw new Error("Failed to update");
      }
      // Re-fetch data in the background to sync server state
      router.refresh();
    } catch (e) {
      console.error("Toggle failed:", e);
      // Revert optimistic update on failure
      setIsActive(!nextState);
    }
  };

  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Zap className="h-4 w-4 text-foreground" />
          <h4 className="font-semibold text-lg text-foreground">{automation.name}</h4>
        </div>
        <button 
          onClick={toggleAutomation} 
          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background ${isActive ? "bg-foreground" : "bg-muted"}`}
        >
          <span
            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-background shadow ring-0 transition duration-200 ease-in-out ${isActive ? "translate-x-5" : "translate-x-0"}`}
          />
        </button>
      </div>

      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {automation.keywords.map((kw: string) => (
            <span key={kw} className="px-2 py-0.5 rounded-md bg-muted text-xs font-semibold uppercase tracking-wider text-muted-foreground border border-border">
              {kw}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-border mt-4">
          <div className="flex items-center gap-4 text-xs font-medium text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <MessageSquare className="h-3.5 w-3.5" />
              <span>{automation.executions?.length || 0} hits</span>
            </div>
          </div>
          <div className="flex gap-2">
            <Link href={`/dashboard/automations/${automation.id}`}>
              <Button variant="ghost" size="sm" className="h-8 text-[13px] font-semibold underline hover:no-underline hover:bg-muted/50 text-foreground transition-colors">
                Edit Sequence
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
