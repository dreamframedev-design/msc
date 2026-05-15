"use client";

import { useEffect, useState } from "react";

const COLLAPSED_KEY = "msc-sidebar-collapsed";
const LAYOUT_KEY = "msc-sidebar-layout";

export type SidebarLayout = "vertical" | "horizontal";

function readBool(key: string): boolean | null {
  if (typeof window === "undefined") return null;
  try {
    const v = window.localStorage.getItem(key);
    if (v === "1") return true;
    if (v === "0") return false;
  } catch {}
  return null;
}

function writeBool(key: string, v: boolean) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, v ? "1" : "0");
  } catch {}
}

function readLayout(): SidebarLayout | null {
  if (typeof window === "undefined") return null;
  try {
    const v = window.localStorage.getItem(LAYOUT_KEY);
    if (v === "horizontal" || v === "vertical") return v;
  } catch {}
  return null;
}

function writeLayout(layout: SidebarLayout) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(LAYOUT_KEY, layout);
  } catch {}
}

export function usePersistedSidebar(defaultCollapsed = false): [boolean, (v: boolean) => void] {
  const [collapsed, setCollapsedState] = useState<boolean>(defaultCollapsed);

  useEffect(() => {
    const stored = readBool(COLLAPSED_KEY);
    if (stored !== null) setCollapsedState(stored);
  }, []);

  const setCollapsed = (v: boolean) => {
    setCollapsedState(v);
    writeBool(COLLAPSED_KEY, v);
  };

  return [collapsed, setCollapsed];
}

export function usePersistedLayout(defaultLayout: SidebarLayout = "vertical"): [SidebarLayout, (v: SidebarLayout) => void] {
  const [layout, setLayoutState] = useState<SidebarLayout>(defaultLayout);

  useEffect(() => {
    const stored = readLayout();
    if (stored) setLayoutState(stored);
  }, []);

  const setLayout = (v: SidebarLayout) => {
    setLayoutState(v);
    writeLayout(v);
  };

  return [layout, setLayout];
}
