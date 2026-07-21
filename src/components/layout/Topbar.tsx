"use client";

import { useRouter } from "next/navigation";
import { LogOut, Search } from "lucide-react";
import { clearSession } from "./AuthGate";

export function Topbar() {
  const router = useRouter();

  function handleLogout() {
    clearSession();
    router.push("/");
  }

  return (
    <header className="sticky top-0 z-10 flex items-center justify-between border-b border-hairline bg-surface/80 px-6 py-3 backdrop-blur">
      <div className="flex items-center gap-2 rounded-lg border border-hairline px-3 py-1.5 text-sm text-ink-muted">
        <Search className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">Search is not available in this prototype</span>
      </div>
      <button
        type="button"
        onClick={handleLogout}
        className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm text-ink-secondary hover:bg-page"
      >
        <LogOut className="h-3.5 w-3.5" />
        Log out
      </button>
    </header>
  );
}
