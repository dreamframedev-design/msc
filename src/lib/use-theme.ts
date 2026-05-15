"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "msc-theme";

export type Theme = "dark" | "light";

function readStoredTheme(): Theme | null {
  if (typeof window === "undefined") return null;
  try {
    const v = window.localStorage.getItem(STORAGE_KEY);
    if (v === "dark" || v === "light") return v;
  } catch {
    // ignore
  }
  return null;
}

function persistTheme(theme: Theme) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    // ignore (private mode etc.)
  }
}

/**
 * Persisted theme hook. Defaults to provided default if nothing in storage.
 * Survives navigation across /portal, /admin, etc. since it reads/writes
 * the same localStorage key.
 */
export function usePersistedTheme(defaultTheme: Theme = "dark"): [Theme, (t: Theme) => void] {
  const [theme, setThemeState] = useState<Theme>(defaultTheme);

  useEffect(() => {
    const stored = readStoredTheme();
    if (stored) setThemeState(stored);
  }, []);

  const setTheme = (next: Theme) => {
    setThemeState(next);
    persistTheme(next);
  };

  return [theme, setTheme];
}
