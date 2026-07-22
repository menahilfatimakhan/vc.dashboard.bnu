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
    <header className="sticky top-0 z-10 flex items-center justify-between border-b border-hairline bg-surface px-6 py-3">
      <label className="flex w-full max-w-md items-center gap-2 rounded-lg border border-hairline bg-subtle px-3.5 py-2.5 text-sm text-ink-muted focus-within:border-accent-500">
        <Search className="h-4 w-4 shrink-0" strokeWidth={1.5} />
        <input
          type="search"
          placeholder="Search"
          disabled
          className="w-full bg-transparent text-ink outline-none placeholder:text-ink-muted disabled:cursor-not-allowed"
        />
      </label>
      <button
        type="button"
        onClick={handleLogout}
        className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm text-ink-muted transition-colors duration-150 hover:bg-subtle hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-500/40"
      >
        <LogOut className="h-4 w-4" strokeWidth={1.5} />
        Log out
      </button>
    </header>
  );
}
