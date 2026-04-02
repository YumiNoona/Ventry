import { login } from '../auth-actions'
import { LoadingButton } from '@/components/ui/loading-button'
import Link from 'next/link'
import { Sparkles, ShieldCheck, Zap } from 'lucide-react'

export default function LoginPage({
  searchParams,
}: {
  searchParams: { error?: string }
}) {
  return (
    <div className="flex min-h-screen bg-background overflow-hidden">
      {/* Left Side: Premium Illustration / Brand */}
      <div className="hidden lg:flex flex-1 relative items-center justify-center bg-[#020617] overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-primary/20 blur-[120px] animate-pulse" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-success/10 blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
        </div>

        <div className="relative z-10 max-w-lg text-center px-12 stagger-children">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-xs font-bold text-white/80 uppercase tracking-widest">The Future of AI Automation</span>
          </div>
          
          <h1 className="text-5xl font-black text-white leading-tight tracking-tighter mb-6">
            Engage your audience <span className="text-primary">automatically.</span>
          </h1>
          <p className="text-xl text-white/60 font-medium leading-relaxed mb-12">
            Ventry uses advanced AI to monitor, respond, and grow your social presence while you sleep.
          </p>

          <div className="grid grid-cols-2 gap-4 text-left">
            <div className="p-6 bento-card bg-white/5 border-white/10">
              <Zap className="h-6 w-6 text-primary mb-3" />
              <p className="text-sm font-bold text-white">Instant Replies</p>
              <p className="text-xs text-white/40 mt-1">Real-time keyword triggers.</p>
            </div>
            <div className="p-6 bento-card bg-white/5 border-white/10">
              <ShieldCheck className="h-6 w-6 text-success mb-3" />
              <p className="text-sm font-bold text-white">Safe & Secure</p>
              <p className="text-xs text-white/40 mt-1">Official API integrations.</p>
            </div>
          </div>
        </div>

        {/* Decorative 3D-like Card */}
        <div className="absolute bottom-20 right-20 w-64 h-80 bg-white/5 border border-white/10 backdrop-blur-2xl rounded-[2.5rem] rotate-6 shadow-2xl animate-bounce-slow flex flex-col p-6 items-center justify-center gap-4">
            <div className="size-20 rounded-3xl bg-gradient-to-br from-primary to-primary-foreground/20 flex items-center justify-center shadow-xl">
               <Zap className="h-10 w-10 text-white" />
            </div>
            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-primary w-2/3 rounded-full" />
            </div>
            <div className="space-y-2 w-full">
                <div className="h-2 w-full bg-white/5 rounded-full" />
                <div className="h-2 w-3/4 bg-white/5 rounded-full" />
            </div>
        </div>
      </div>

      {/* Right Side: Auth Form */}
      <div className="w-full lg:w-[500px] flex flex-col p-8 lg:p-12 bg-background relative z-20">
        <div className="lg:hidden mb-12 flex items-center gap-2">
            <div className="size-8 rounded-xl bg-primary text-white flex items-center justify-center font-black text-xs">V</div>
            <span className="font-black text-lg tracking-tighter">Ventry</span>
        </div>

        <div className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full stagger-children">
          <div className="mb-10 text-left">
            <h2 className="text-3xl font-black tracking-tighter text-foreground mb-3">Welcome back</h2>
            <p className="font-medium text-muted-foreground">Enter your credentials to access your dashboard.</p>
          </div>

          {searchParams?.error && (
            <div className="mb-6 rounded-2xl bg-destructive/5 border border-destructive/10 p-4 text-sm text-destructive font-bold flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
              <div className="size-2 rounded-full bg-destructive animate-pulse" />
              {searchParams.error}
            </div>
          )}

          <form className="space-y-5">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1" htmlFor="email">Email Address</label>
              <input 
                id="email" 
                name="email" 
                type="email" 
                required 
                className="w-full h-12 rounded-2xl border border-border/50 bg-muted/30 px-4 text-sm font-bold placeholder:text-muted-foreground/40 focus:bg-background focus:border-primary/50 focus:ring-4 focus:ring-primary/5 transition-all outline-none"
                placeholder="name@company.com"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground" htmlFor="password">Password</label>
                <Link href="#" className="text-[10px] font-bold text-primary hover:underline">Forgot password?</Link>
              </div>
              <input 
                id="password" 
                name="password" 
                type="password" 
                required 
                className="w-full h-12 rounded-2xl border border-border/50 bg-muted/30 px-4 text-sm font-bold placeholder:text-muted-foreground/40 focus:bg-background focus:border-primary/50 focus:ring-4 focus:ring-primary/5 transition-all outline-none"
                placeholder="••••••••"
              />
            </div>

            <LoadingButton 
                formAction={login} 
                className="w-full h-12 rounded-2xl text-sm font-black shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-shadow translate-y-2 active:scale-[0.98]" 
                loadingText="Securing access…"
            >
                Sign in to Ventry
            </LoadingButton>
          </form>

          <p className="mt-10 text-center text-sm font-bold text-muted-foreground">
            New to Ventry?{' '}
            <Link href="/signup" className="text-primary hover:underline underline-offset-4 decoration-2">
              Create an account
            </Link>
          </p>
        </div>

        <div className="mt-auto pt-8 text-[11px] text-muted-foreground/50 font-bold flex justify-between items-center">
            <span>© 2024 Ventry AI</span>
            <div className="flex gap-4">
                <Link href="#" className="hover:text-foreground">Privacy</Link>
                <Link href="#" className="hover:text-foreground">Terms</Link>
            </div>
        </div>
      </div>
    </div>
  )
}
