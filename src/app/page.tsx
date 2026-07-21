"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Layers, Lock, User } from "lucide-react";
import { setSession } from "@/components/layout/AuthGate";

export default function LoginPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    // Cosmetic only — any credentials proceed. There is no real auth in Phase 1a.
    setSession();
    router.push("/overview");
  }

  return (
    <div className="flex min-h-screen flex-1 items-center justify-center bg-canvas px-4">
      <div className="w-full max-w-sm rounded-2xl border border-hairline bg-surface p-8 shadow-card">
        <div className="mb-6 flex items-center gap-2">
          <Layers className="h-7 w-7 text-accent-500" strokeWidth={2.2} />
          <div>
            <p className="text-base font-semibold text-ink">BNU Analytical Dashboard</p>
            <p className="text-xs text-ink-muted">Vice Chancellor Access</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="flex flex-col gap-1.5 text-sm text-ink-secondary">
            Username
            <div className="flex items-center gap-2 rounded-lg border border-hairline px-3 py-2 transition-colors duration-150 focus-within:border-accent-500">
              <User className="h-4 w-4 text-ink-muted" strokeWidth={1.5} />
              <input
                type="text"
                required
                placeholder="vc.office"
                className="w-full bg-transparent text-sm text-ink outline-none"
              />
            </div>
          </label>

          <label className="flex flex-col gap-1.5 text-sm text-ink-secondary">
            Password
            <div className="flex items-center gap-2 rounded-lg border border-hairline px-3 py-2 transition-colors duration-150 focus-within:border-accent-500">
              <Lock className="h-4 w-4 text-ink-muted" strokeWidth={1.5} />
              <input
                type="password"
                required
                placeholder="Any password"
                className="w-full bg-transparent text-sm text-ink outline-none"
              />
            </div>
          </label>

          <button
            type="submit"
            disabled={submitting}
            className="mt-2 rounded-lg bg-accent-500 px-4 py-2.5 text-sm font-medium text-white transition-colors duration-150 hover:bg-accent-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-500/40 disabled:opacity-60"
          >
            {submitting ? "Signing in…" : "Sign in"}
          </button>

          <p className="text-center text-xs text-ink-muted">
            Prototype login — any credentials proceed. No real authentication is in place.
          </p>
        </form>
      </div>
    </div>
  );
}
