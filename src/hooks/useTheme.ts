"use client";

import { useEffect, useState } from "react";

export type Theme = "light" | "dark";

const STORAGE_KEY = "bnu-vitals-theme";

function getSystemTheme(): Theme {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  localStorage.setItem(STORAGE_KEY, theme);
}

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>("light");

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as Theme | null;
    // Intentional: reads browser-only APIs (localStorage/matchMedia), can't move out of the effect.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setThemeState(stored ?? getSystemTheme());
  }, []);

  function setTheme(next: Theme) {
    setThemeState(next);
    applyTheme(next);
  }

  return { theme, setTheme };
}
