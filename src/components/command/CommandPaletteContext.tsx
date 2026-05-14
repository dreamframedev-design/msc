"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { CommandPalette, type CommandItem } from "./CommandPalette";

type CommandPaletteContextValue = {
  setItems: (items: CommandItem[]) => void;
  open: () => void;
  close: () => void;
  toggle: () => void;
};

const Ctx = createContext<CommandPaletteContextValue | null>(null);

export function CommandPaletteProvider({
  children,
  placeholder,
  emptyHint,
}: {
  children: ReactNode;
  placeholder?: string;
  emptyHint?: string;
}) {
  const [items, setItems] = useState<CommandItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const value = useMemo<CommandPaletteContextValue>(
    () => ({
      setItems: (next) => setItems(next),
      open: () => setIsOpen(true),
      close: () => setIsOpen(false),
      toggle: () => setIsOpen((v) => !v),
    }),
    []
  );

  return (
    <Ctx.Provider value={value}>
      {children}
      <CommandPalette
        items={items}
        open={isOpen}
        onOpenChange={setIsOpen}
        placeholder={placeholder}
        emptyHint={emptyHint}
      />
    </Ctx.Provider>
  );
}

export function useCommandPalette() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCommandPalette must be inside CommandPaletteProvider");
  return ctx;
}

export function useRegisterCommandsMemo(builder: () => CommandItem[], deps: unknown[]) {
  const ctx = useContext(Ctx);
  const setItems = ctx?.setItems;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const items = useMemo(builder, deps);
  const stableSet = useCallback((arr: CommandItem[]) => setItems?.(arr), [setItems]);
  useEffect(() => {
    stableSet(items);
    return () => stableSet([]);
  }, [items, stableSet]);
}
