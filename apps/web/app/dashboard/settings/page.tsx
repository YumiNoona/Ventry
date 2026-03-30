import { requireUser } from "@/lib/getUser";
import { Button } from "@ventry/ui/components/ui/button";
import { updateProfile, updatePassword } from "./actions";

export default async function SettingsPage() {
  const { dbUser, authUser } = await requireUser();

  return (
    <div className="max-w-3xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your profile, connected accounts, and billing.</p>
      </div>

      <div className="grid gap-8">
        {/* Profile Settings */}
        <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
          <div className="p-6 border-b border-border">
            <h3 className="text-lg font-semibold">Profile</h3>
            <p className="text-sm text-muted-foreground mt-1">Update your personal information.</p>
          </div>
          <div className="p-6 bg-card/50">
            <form action={updateProfile} className="space-y-4 max-w-md">
              <div className="space-y-2">
                <label className="text-sm font-medium">Name</label>
                <input 
                  name="name" 
                  defaultValue={dbUser?.name || ""} 
                  className="w-full rounded-md border bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <input 
                  name="email" 
                  type="email"
                  defaultValue={authUser?.email || ""} 
                  className="w-full rounded-md border bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" 
                />
                <p className="text-xs text-muted-foreground">Changing your email requires verification.</p>
              </div>
              <Button type="submit">Save Changes</Button>
            </form>
          </div>
        </div>

        {/* Security / Password */}
        <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
          <div className="p-6 border-b border-border">
            <h3 className="text-lg font-semibold">Security</h3>
            <p className="text-sm text-muted-foreground mt-1">Update your password to keep your account secure.</p>
          </div>
          <div className="p-6 bg-card/50">
            <form action={updatePassword} className="space-y-4 max-w-md">
              <div className="space-y-2">
                <label className="text-sm font-medium">New Password</label>
                <input 
                  name="password" 
                  type="password"
                  placeholder="••••••••"
                  className="w-full rounded-md border bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" 
                  minLength={6}
                  required
                />
              </div>
              <Button type="submit" variant="secondary">Update Password</Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
