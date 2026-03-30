import Link from "next/link";
import { Button } from "@ventry/ui/components/ui/button";
import { Zap, MessageSquare, ArrowRight, CheckCircle2, Bot } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      {/* Navbar */}
      <header className="px-6 h-16 flex items-center justify-between border-b border-border bg-card/50 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
          <div className="size-6 rounded bg-primary text-primary-foreground flex items-center justify-center text-xs">V</div>
          Ventry
        </div>
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link href="#features" className="text-muted-foreground hover:text-foreground transition-colors">Features</Link>
          <Link href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">Pricing</Link>
        </nav>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Log In</Link>
          <Link href="/signup">
            <Button size="sm">Get Started</Button>
          </Link>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-24 px-6 md:py-32 flex flex-col items-center text-center space-y-8 max-w-4xl mx-auto">
          <div className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium leading-tight text-primary bg-primary/10 mb-2 border border-primary/20">
            <span className="flex h-2 w-2 rounded-full bg-success mr-2 animate-pulse"></span>
            Ventry 2.0 is now live
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight">
            Automate your social presence with <span className="text-transparent bg-clip-text bg-gradient-to-r from-neutral-200 to-neutral-500">AI precision.</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl leading-relaxed">
            Stop replying to every DM. Set up intelligent keyword triggers and let our Gemini-powered AI engine engage, convert, and retain your audience 24/7.
          </p>
          <div className="flex gap-4 pt-4">
            <Link href="/signup">
              <Button size="lg" className="rounded-full px-8 h-12 text-base shadow-[0_0_20px_rgba(255,255,255,0.15)] hover:shadow-[0_0_30px_rgba(255,255,255,0.25)] transition-shadow">
                Start Free Trial <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </section>

        {/* Features Grid */}
        <section id="features" className="py-24 px-6 bg-card border-y border-border">
          <div className="max-w-6xl mx-auto space-y-16">
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Built for modern creators.</h2>
              <p className="mt-4 text-muted-foreground">Everything you need to scale your Instagram growth without burning out.</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-background rounded-2xl p-8 border border-border shadow-sm">
                <div className="size-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">Instant Keyword Triggers</h3>
                <p className="text-muted-foreground">Catch specific words in DMs or comments and automatically sequence custom replies and funnels.</p>
              </div>
              
              <div className="bg-background rounded-2xl p-8 border border-border shadow-sm">
                <div className="size-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
                  <Bot className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">Persona-driven AI</h3>
                <p className="text-muted-foreground">Not just canned responses. Our AI understands context and replies dynamically in your unique brand voice.</p>
              </div>
              
              <div className="bg-background rounded-2xl p-8 border border-border shadow-sm">
                <div className="size-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
                  <MessageSquare className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">Unified Inbox</h3>
                <p className="text-muted-foreground">Monitor all AI-handled conversations and human hand-offs in one secure, thread-safe dashboard.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="py-24 px-6">
          <div className="max-w-6xl mx-auto space-y-16">
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Simple, transparent pricing.</h2>
              <p className="mt-4 text-muted-foreground">Start for free. Upgrade as your audience grows.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {/* Free */}
              <div className="rounded-3xl border border-border bg-card p-8 flex flex-col">
                <div className="mb-4">
                  <span className="px-3 py-1 text-xs font-semibold rounded-full bg-secondary text-secondary-foreground mb-4 inline-block">Free</span>
                  <div className="flex items-baseline gap-1 mt-2">
                    <span className="text-4xl font-bold">$0</span>
                    <span className="text-muted-foreground">/mo</span>
                  </div>
                </div>
                <ul className="space-y-3 mb-8 flex-1 text-sm text-muted-foreground mt-4">
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-success" /> 50 AI Replies / month</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-success" /> 1 Instagram Account</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-success" /> Basic Keyword Triggers</li>
                </ul>
                <Link href="/signup">
                  <Button variant="outline" className="w-full">Get Started</Button>
                </Link>
              </div>

              {/* Pro */}
              <div className="rounded-3xl border border-primary bg-card p-8 flex flex-col relative ring-1 ring-primary shadow-lg shadow-primary/10 transform md:-translate-y-4">
                <div className="absolute top-0 right-8 transform -translate-y-1/2">
                  <span className="bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest shadow-sm">Popular</span>
                </div>
                <div className="mb-4">
                  <span className="px-3 py-1 text-xs font-semibold rounded-full bg-primary/10 text-primary mb-4 inline-block">Pro</span>
                  <div className="flex items-baseline gap-1 mt-2">
                    <span className="text-4xl font-bold">$29</span>
                    <span className="text-muted-foreground">/mo</span>
                  </div>
                </div>
                <ul className="space-y-3 mb-8 flex-1 text-sm text-foreground mt-4">
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary" /> 1,000 AI Replies / month</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary" /> Up to 3 Instagram Accounts</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary" /> Advanced Persona AI</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary" /> Priority Support</li>
                </ul>
                <Link href="/signup">
                  <Button className="w-full shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] transition-shadow">Start 7-Day Trial</Button>
                </Link>
              </div>

              {/* Elite */}
              <div className="rounded-3xl border border-border bg-card p-8 flex flex-col">
                <div className="mb-4">
                  <span className="px-3 py-1 text-xs font-semibold rounded-full bg-secondary text-secondary-foreground mb-4 inline-block">Elite</span>
                  <div className="flex items-baseline gap-1 mt-2">
                    <span className="text-4xl font-bold">$99</span>
                    <span className="text-muted-foreground">/mo</span>
                  </div>
                </div>
                <ul className="space-y-3 mb-8 flex-1 text-sm text-muted-foreground mt-4">
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-success" /> Unlimited AI Replies</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-success" /> Unlimited Accounts</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-success" /> API Access</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-success" /> Dedicated Account Manager</li>
                </ul>
                <Link href="/signup">
                  <Button variant="outline" className="w-full">Contact Sales</Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-12 px-6 border-t border-border bg-card text-center text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} Ventry AI. All rights reserved.</p>
      </footer>
    </div>
  );
}
