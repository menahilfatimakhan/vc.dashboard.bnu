"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";

const SESSION_KEY = "bnu-vc-dashboard-session";

export function setSession() {
  if (typeof window !== "undefined") window.sessionStorage.setItem(SESSION_KEY, "1");
}

export function clearSession() {
  if (typeof window !== "undefined") window.sessionStorage.removeItem(SESSION_KEY);
}

function hasSession(): boolean {
  if (typeof window === "undefined") return false;
  return window.sessionStorage.getItem(SESSION_KEY) === "1";
}

/**
 * Cosmetic-only gate — any credentials on the login screen set the session flag.
 * There is no real auth in Phase 1a (see root CLAUDE.md).
 */
export function AuthGate({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (hasSession()) {
      // Intentional: sessionStorage is only readable after mount, so this can't move out of the effect.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setReady(true);
    } else {
      router.replace("/");
    }
  }, [router]);

  if (!ready) return null;
  return <>{children}</>;
}
