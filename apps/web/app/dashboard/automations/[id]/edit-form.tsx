'use client'

import { useState } from "react";
import { useFormState } from "react-dom";
import { Button } from "@ventry/ui/components/ui/button";
import { Zap, ArrowLeft, Info, AlertCircle, Trash2 } from "lucide-react";
import Link from "next/link";
import { updateAutomation, deleteAutomation } from "./actions";

interface InitialData {
  id: string;
  name: string;
  triggerType: string;
  keywords: string;
  useAI: boolean;
  customReply: string;
}

const initialState = { error: null, success: null };

export function EditAutomationForm({ initialData }: { initialData: InitialData }) {
  const updateWithId = updateAutomation.bind(null, initialData.id);
  const [state, formAction] = useFormState(updateWithId, initialState);
  const [useAI, setUseAI] = useState(initialData.useAI);

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in py-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/automations">
            <Button variant="ghost" size="icon" className="rounded-full h-10 w-10 shrink-0">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Edit Sequence</h1>
            <p className="text-sm font-medium text-muted-foreground mt-1">Configure your keyword-triggered AI response flow.</p>
          </div>
        </div>
        
        <form action={() => deleteAutomation(initialData.id)}>
          <Button variant="destructive" size="icon" className="rounded-lg shadow-sm w-9 h-9 opacity-80 hover:opacity-100">
            <Trash2 className="h-4 w-4" />
          </Button>
        </form>
      </div>

      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
        <div className="p-4 border-b border-border bg-muted/20">
          <div className="flex items-center gap-2 text-foreground uppercase font-semibold text-xs tracking-wider">
            <Zap className="h-3.5 w-3.5" />
            Configuring Trigger
          </div>
        </div>

        <form action={formAction} className="p-6 md:p-8 space-y-8">
          {state?.error && (
            <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20 flex items-center gap-3 text-destructive animate-in fade-in slide-in-from-top-1">
              <AlertCircle className="h-4 w-4" />
              <p className="text-sm font-medium">{state.error}</p>
            </div>
          )}
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground" htmlFor="name">Internal Name</label>
              <input 
                id="name" 
                name="name" 
                defaultValue={initialData.name}
                required 
                placeholder="e.g. Sales Inquiry Response"
                className="w-full rounded-md border bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:border-foreground transition-colors placeholder:text-muted-foreground/60" 
              />
              <p className="text-xs text-muted-foreground">Only you see this label.</p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground" htmlFor="keywords">Keywords</label>
              <input 
                id="keywords" 
                name="keywords" 
                defaultValue={initialData.keywords}
                required 
                placeholder="promo, discount, price"
                className="w-full rounded-md border bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:border-foreground transition-colors placeholder:text-muted-foreground/60" 
              />
              <p className="text-xs text-muted-foreground">Separate keywords with commas. Casing does not matter.</p>
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-[11px] font-semibold uppercase text-muted-foreground tracking-wider">Trigger Sources</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <label className="flex flex-col items-start gap-4 p-4 rounded-lg border border-border bg-background hover:bg-muted/30 cursor-pointer transition-colors relative has-[:checked]:border-foreground has-[:checked]:ring-1 has-[:checked]:ring-foreground">
                <input type="radio" name="type" value="DM" defaultChecked={initialData.triggerType === 'DM'} className="absolute top-4 right-4 accent-foreground" />
                <div className="text-sm font-semibold text-foreground">DMs Only</div>
                <p className="text-xs text-muted-foreground font-medium">Direct messages sent to your inbox.</p>
              </label>
              
              <label className="flex flex-col items-start gap-4 p-4 rounded-lg border border-border bg-background hover:bg-muted/30 cursor-pointer transition-colors relative has-[:checked]:border-foreground has-[:checked]:ring-1 has-[:checked]:ring-foreground">
                 <input type="radio" name="type" value="COMMENT" defaultChecked={initialData.triggerType === 'COMMENT'} className="absolute top-4 right-4 accent-foreground" />
                 <div className="text-sm font-semibold text-foreground">Comments</div>
                 <p className="text-xs text-muted-foreground font-medium">Replies to your posts or reels.</p>
              </label>

              <label className="flex flex-col items-start gap-4 p-4 rounded-lg border border-border bg-background hover:bg-muted/30 cursor-pointer transition-colors relative has-[:checked]:border-foreground has-[:checked]:ring-1 has-[:checked]:ring-foreground">
                 <input type="radio" name="type" value="ALL" defaultChecked={initialData.triggerType === 'ALL'} className="absolute top-4 right-4 accent-foreground" />
                 <div className="text-sm font-semibold text-foreground">Both</div>
                 <p className="text-xs text-muted-foreground font-medium">Highest reach across all engagement types.</p>
              </label>
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-muted/30 border border-border flex items-start gap-4 shadow-sm transition-colors hover:bg-muted/50 cursor-pointer" onClick={() => setUseAI(!useAI)}>
              <div className="mt-0.5">
                <input 
                  type="checkbox" 
                  name="useAI" 
                  id="useAI" 
                  onChange={(e) => setUseAI(e.target.checked)} 
                  checked={useAI} 
                  className="accent-foreground size-4" 
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
              <div className="space-y-1">
                <label htmlFor="useAI" className="text-sm font-semibold text-foreground cursor-pointer" onClick={(e) => e.preventDefault()}>Persona-Engaged AI Reply</label>
                <p className="text-xs text-muted-foreground font-medium leading-relaxed">
                  Generative AI will craft a context-aware response using your brand persona. If disabled, a custom reply will be used.
                </p>
              </div>
            </div>

            {!useAI && (
              <div className="space-y-2 animate-in fade-in slide-in-from-top-2 pt-2">
                <label className="text-sm font-medium text-foreground" htmlFor="customReply">Custom Reply</label>
                <textarea 
                  id="customReply" 
                  name="customReply" 
                  defaultValue={initialData.customReply}
                  required 
                  placeholder="Type the exact message to send when this keyword is triggered…"
                  className="w-full min-h-[100px] rounded-md border bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:border-foreground placeholder:text-muted-foreground/60 transition-colors" 
                />
                <p className="text-[11px] text-muted-foreground font-medium">When AI is off, Ventry sends this exact text every time.</p>
              </div>
            )}
          </div>

          <div className="pt-6 flex gap-3 border-t border-border">
            <Button type="submit" className="font-semibold px-6 shadow-sm">Save Changes</Button>
            <Link href="/dashboard/automations">
              <Button variant="outline" className="font-medium shadow-sm hover:bg-muted/50">Discard</Button>
            </Link>
          </div>
        </form>
      </div>

      <div className="rounded-xl border border-border bg-card p-6 flex flex-col sm:flex-row items-start gap-4 shadow-sm relative overflow-hidden group">
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-foreground opacity-50 group-hover:opacity-100 transition-opacity"></div>
        <div className="size-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0 text-muted-foreground group-hover:text-foreground transition-colors mt-0.5">
          <Info className="h-4 w-4" />
        </div>
        <div className="space-y-1.5 pt-0.5">
          <h4 className="text-[11px] font-semibold text-foreground uppercase tracking-widest">How triggers work</h4>
          <p className="text-[13px] text-muted-foreground font-medium leading-relaxed max-w-xl">
            Ventry scans for your keywords in any incoming message. Once found, our AI generates a response, adds it to the queue, and executes it via the Meta API in under 5 seconds.
          </p>
        </div>
      </div>
    </div>
  );
}
