import type { ReactNode } from "react";
import { AuthGate } from "@/components/layout/AuthGate";
import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";
import { PageTransition } from "@/components/layout/PageTransition";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <AuthGate>
      <Sidebar />
      <div className="flex min-h-screen flex-col bg-canvas md:pl-64">
        <Topbar />
        <main className="flex-1 px-4 py-6 sm:px-7">
          <PageTransition>{children}</PageTransition>
        </main>
      </div>
    </AuthGate>
  );
}
