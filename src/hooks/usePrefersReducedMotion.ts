"use client";

import { useEffect, useState } from "react";

const OVERRIDE_KEY = "bnu-vitals-reduce-motion";

export function getReduceMotionOverride(): boolean {
  return localStorage.getItem(OVERRIDE_KEY) === "true";
}

export function setReduceMotionOverride(value: boolean) {
  localStorage.setItem(OVERRIDE_KEY, String(value));
  window.dispatchEvent(new Event("reduce-motion-override-change"));
}

export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");

    function recompute() {
      setReduced(query.matches || getReduceMotionOverride());
    }

    recompute();
    query.addEventListener("change", recompute);
    window.addEventListener("reduce-motion-override-change", recompute);
    window.addEventListener("storage", recompute);
    return () => {
      query.removeEventListener("change", recompute);
      window.removeEventListener("reduce-motion-override-change", recompute);
      window.removeEventListener("storage", recompute);
    };
  }, []);

  return reduced;
}
