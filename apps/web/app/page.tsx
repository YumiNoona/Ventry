import { Button } from "@ventry/ui/components/ui/button";

export default function Page() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-background">
      <div className="flex flex-col items-center space-y-4 text-center max-w-2xl">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl text-foreground">
          Welcome to Ventry
        </h1>
        <p className="text-xl text-muted-foreground">
          AI-powered social automation platform. Manage automations, triggers, and memory effortlessly.
        </p>
        <div className="flex gap-4 pt-10">
          <Button size="lg">Get Started</Button>
          <Button size="lg" variant="outline">Learn More</Button>
        </div>
      </div>
    </main>
  );
}
