"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "msc-sidebar-collapsed";

function readStored(): boolean | null {
  if (typeof window === "undefined") return null;
  try {
    const v = window.localStorage.getItem(STORAGE_KEY);
    if (v === "1") return true;
    if (v === "0") return false;
  } catch {
    // ignore
  }
  return null;
}

function persist(collapsed: boolean) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, collapsed ? "1" : "0");
  } catch {
    // ignore
  }
}

export function usePersistedSidebar(defaultCollapsed = false): [boolean, (v: boolean) => void] {
  const [collapsed, setCollapsedState] = useState<boolean>(defaultCollapsed);

  useEffect(() => {
    const stored = readStored();
    if (stored !== null) setCollapsedState(stored);
  }, []);

  const setCollapsed = (v: boolean) => {
    setCollapsedState(v);
    persist(v);
  };

  return [collapsed, setCollapsed];
}
