import { prisma } from "@/lib/prisma"; // Assuming we have a prisma helper in web
import { AutomationList } from "@/components/automations/automation-list";

export default async function AutomationsPage() {
  // 1. Fetch Stats
  const [totalReplies, activeAccounts, automations] = await Promise.all([
    prisma.message.count({ where: { direction: "outbound" } }),
    prisma.account.count({ where: { accessToken: { not: null } } }),
    prisma.automation.findMany({
      include: { 
        triggers: true, 
        actions: true
      },
      orderBy: { createdAt: "desc" }
    })
  ]);


  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      {/* 2. Metrics Header */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-card border rounded-xl p-6 shadow-sm">
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Total AI Replies</p>
          <h2 className="text-4xl font-bold mt-2">{totalReplies}</h2>
        </div>
        <div className="bg-card border rounded-xl p-6 shadow-sm">
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Active Connections</p>
          <div className="flex items-center gap-2 mt-2">
            <h2 className="text-4xl font-bold">{activeAccounts}</h2>
            <span className="h-3 w-3 rounded-full bg-green-500 animate-pulse" />
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center pt-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Automations</h1>
          <p className="text-muted-foreground">Manage your keyword-based AI auto-replies.</p>
        </div>
        <div className="flex gap-4">
          <a 
            href="/api/auth/meta/login"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
            Connect Instagram
          </a>
          <a 
            href="/dashboard/automations/new"
            className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:opacity-90 transition-opacity flex items-center"
          >
            Create Automation
          </a>
        </div>

      </div>

      <AutomationList initialData={automations} />
    </div>
  );
}
