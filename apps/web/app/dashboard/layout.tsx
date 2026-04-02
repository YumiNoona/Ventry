import { ReactNode, Suspense } from "react";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Topbar } from "@/components/dashboard/topbar";
import { getAuthUser } from "@/lib/getUser";

function PageLoader() {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="h-6 w-6 rounded-full border-2 border-primary border-t-transparent animate-spin" />
    </div>
  );
}

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const user = await getAuthUser();
  const userData = {
    name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
    email: user.email!,
  };

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      <Sidebar user={userData} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Topbar user={userData} />
        <main className="flex-1 p-6 overflow-auto">
          <div className="mx-auto max-w-6xl">
            <Suspense fallback={<PageLoader />}>
              {children}
            </Suspense>
          </div>
        </main>
      </div>
    </div>
  );
}
