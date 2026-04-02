'use client'

import { useFormState } from "react-dom";
import { Button } from "@ventry/ui/components/ui/button";
import { updateProfile, updatePassword } from "./actions";
import { AlertCircle, CheckCircle2 } from "lucide-react";

type ActionState = {
  error: string | null;
  success: string | null;
};

const initialState: ActionState = { error: null, success: null };

interface SettingsClientProps {
  dbUser: any;
  authUser: any;
}

export default function SettingsClient({ dbUser, authUser }: SettingsClientProps) {
  const [profileState, profileAction] = useFormState(updateProfile, initialState);
  const [passwordState, passwordAction] = useFormState(updatePassword, initialState);

  return (
    <div className="max-w-5xl mx-auto space-y-12 animate-page-enter p-8">
      {/* Profile Section */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-10 stagger-children">
        <div className="lg:col-span-1 space-y-3">
          <h2 className="text-2xl font-black tracking-tighter">Profile Configuration</h2>
          <p className="text-sm font-medium text-muted-foreground leading-relaxed">
            Manage your personal identity and public-facing profile information across Ventry.
          </p>
          <div className="pt-4 flex items-center gap-3">
             <div className="size-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-black text-xs">V</div>
             <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Verified Member</p>
          </div>
        </div>

        <div className="lg:col-span-2 bento-card border-border/40 p-10 group overflow-hidden relative">
          <div className="absolute -top-10 -right-10 size-40 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors" />
          
          <form key={profileState?.success} action={profileAction} className="space-y-8 relative z-10">
            {profileState?.error && (
              <div className="p-4 rounded-2xl bg-destructive/5 border border-destructive/10 flex items-center gap-4 text-destructive animate-in slide-in-from-top-2">
                <AlertCircle className="h-5 w-5" />
                <p className="text-sm font-bold">{profileState.error}</p>
              </div>
            )}
            {profileState?.success && (
              <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10 flex items-center gap-4 text-primary animate-in slide-in-from-top-2">
                <CheckCircle2 className="h-5 w-5" />
                <p className="text-sm font-bold">{profileState.success}</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Full Name</label>
                <input 
                  name="name" 
                  defaultValue={dbUser?.name || ""} 
                  className="w-full h-12 rounded-2xl border border-transparent bg-muted/40 px-5 text-sm font-bold transition-all focus:bg-background focus:border-primary/40 focus:ring-4 focus:ring-primary/5 outline-none placeholder:text-muted-foreground/30" 
                  placeholder="Jane Doe"
                />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Email Address</label>
                <input 
                  name="email" 
                  type="email"
                  defaultValue={authUser?.email || ""} 
                  className="w-full h-12 rounded-2xl border border-transparent bg-muted/20 px-5 text-sm font-bold opacity-60 cursor-not-allowed outline-none" 
                  disabled
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-border/40 flex justify-end">
              <Button type="submit" className="h-12 px-10 rounded-2xl font-black shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
                Save Profile
              </Button>
            </div>
          </form>
        </div>
      </section>

      <div className="h-px bg-gradient-to-r from-transparent via-border/40 to-transparent" />

      {/* Security Section */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-10 stagger-children">
        <div className="lg:col-span-1 space-y-3">
          <h2 className="text-2xl font-black tracking-tighter">Security & Privacy</h2>
          <p className="text-sm font-medium text-muted-foreground leading-relaxed">
            Update your password and manage session security protocols.
          </p>
        </div>

        <div className="lg:col-span-2 bento-card border-border/40 p-10 group overflow-hidden relative">
          <form key={passwordState?.success} action={passwordAction} className="space-y-8 relative z-10 max-w-md">
            {passwordState?.error && (
              <div className="p-4 rounded-2xl bg-destructive/5 border border-destructive/10 flex items-center gap-4 text-destructive animate-in slide-in-from-top-2">
                <AlertCircle className="h-5 w-5" />
                <p className="text-sm font-bold">{passwordState.error}</p>
              </div>
            )}
            {passwordState?.success && (
              <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10 flex items-center gap-4 text-primary animate-in slide-in-from-top-2">
                <CheckCircle2 className="h-5 w-5" />
                <p className="text-sm font-bold">{passwordState.success}</p>
              </div>
            )}

            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">New Password</label>
              <input 
                name="password" 
                type="password"
                placeholder="••••••••••••"
                className="w-full h-12 rounded-2xl border border-transparent bg-muted/40 px-5 text-sm font-bold transition-all focus:bg-background focus:border-primary/40 focus:ring-4 focus:ring-primary/5 outline-none" 
                minLength={6}
                required
              />
              <p className="text-[10px] font-bold text-muted-foreground/60 ml-1">Minimum 6 characters required.</p>
            </div>

            <div className="pt-4">
              <Button type="submit" variant="secondary" className="h-12 px-10 rounded-2xl font-black shadow-lg hover:bg-muted active:scale-95 transition-all border border-border/40">
                Update Password
              </Button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}
