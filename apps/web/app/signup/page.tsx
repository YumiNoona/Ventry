import { signup } from '../auth-actions'
import { LoadingButton } from '@/components/ui/loading-button'
import Link from 'next/link'
import { Sparkles, CheckCircle2, ShieldCheck, Zap } from 'lucide-react'

export default function SignupPage({
  searchParams,
}: {
  searchParams: { error?: string }
}) {
  return (
    <div className="flex min-h-screen bg-background overflow-hidden">
      {/* Left Side: Illustration / Brand */}
      <div className="hidden lg:flex flex-1 relative items-center justify-center bg-[#020617] overflow-hidden">
         <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-primary/20 blur-[120px] animate-pulse" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-success/10 blur-[120px] animate-pulse" style={{ animationDelay: '1.5s' }} />
        </div>

        <div className="relative z-10 max-w-lg text-center px-12 stagger-children">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-xs font-bold text-white/80 uppercase tracking-widest">Join 100+ Active Users</span>
          </div>
          
          <h1 className="text-5xl font-black text-white leading-tight tracking-tighter mb-6">
            Start your AI <span className="text-success">growth journey.</span>
          </h1>
          <p className="text-xl text-white/60 font-medium leading-relaxed mb-12">
            Create your account in seconds and unlock automated engagement for your social platforms.
          </p>

          <div className="space-y-4 text-left">
            {[
              "Keyword-triggered auto-replies",
              "Advanced sentiment analysis",
              "Official API security",
              "Real-time growth analytics"
            ].map((text, i) => (
              <div key={i} className="flex items-center gap-3 text-white/80 font-bold">
                <CheckCircle2 className="h-5 w-5 text-success" />
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Decorative 3D-like Card */}
        <div className="absolute top-20 left-20 w-64 h-80 bg-white/5 border border-white/10 backdrop-blur-2xl rounded-[2.5rem] -rotate-6 shadow-2xl animate-bounce-slow flex flex-col p-8 items-center justify-center gap-6">
            <div className="size-24 rounded-full border-4 border-dashed border-white/20 flex items-center justify-center animate-spin-slow">
               <ShieldCheck className="h-10 w-10 text-success" />
            </div>
            <div className="space-y-3 w-full">
                <div className="h-2 w-full bg-white/10 rounded-full" />
                <div className="h-2 w-2/3 bg-white/10 rounded-full" />
                <div className="h-2 w-full bg-white/10 rounded-full" />
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
            <h2 className="text-3xl font-black tracking-tighter text-foreground mb-3">Create your account</h2>
            <p className="font-medium text-muted-foreground">Join the elite creators using Ventry AI.</p>
          </div>

          {searchParams?.error && (
            <div className="mb-6 rounded-2xl bg-destructive/5 border border-destructive/10 p-4 text-sm text-destructive font-bold flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
              <div className="size-2 rounded-full bg-destructive animate-pulse" />
              {searchParams.error}
            </div>
          )}

          <form className="space-y-5">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1" htmlFor="name">Full Name</label>
              <input 
                id="name" 
                name="name" 
                type="text" 
                required 
                className="w-full h-12 rounded-2xl border border-border/50 bg-muted/30 px-4 text-sm font-bold placeholder:text-muted-foreground/40 focus:bg-background focus:border-primary/50 focus:ring-4 focus:ring-primary/5 transition-all outline-none"
                placeholder="Jane Doe"
              />
            </div>

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
              <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1" htmlFor="password">Password</label>
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
                formAction={signup} 
                className="w-full h-12 rounded-2xl text-sm font-black shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-shadow translate-y-2 active:scale-[0.98]" 
                loadingText="Building your workspace…"
            >
                Get Started for Free
            </LoadingButton>
          </form>

          <p className="mt-10 text-center text-sm font-bold text-muted-foreground">
            Already have an account?{' '}
            <Link href="/login" className="text-primary hover:underline underline-offset-4 decoration-2">
              Sign in here
            </Link>
          </p>
        </div>

        <div className="mt-auto pt-8 text-[11px] text-muted-foreground/50 font-bold flex justify-between items-center">
            <span>By joining, you agree to our <Link href="#" className="underline">Terms</Link>.</span>
        </div>
      </div>
    </div>
  )
}
