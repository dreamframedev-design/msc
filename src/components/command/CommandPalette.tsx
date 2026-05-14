"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, CornerDownLeft, ArrowUp, ArrowDown, Command as CommandIcon } from "lucide-react";

export type CommandItem = {
  id: string;
  label: string;
  sublabel?: string;
  group: string;
  keywords?: string;
  icon?: ReactNode;
  accent?: string;
  shortcut?: string;
  action: () => void;
};

type Props = {
  items: CommandItem[];
  placeholder?: string;
  emptyHint?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

const SCORE_PREFIX = 100;
const SCORE_WORD_PREFIX = 60;
const SCORE_SUBSTRING = 25;
const SCORE_KEYWORD = 15;

function score(item: CommandItem, query: string): number {
  if (!query) return 1;
  const q = query.toLowerCase();
  const label = item.label.toLowerCase();
  const sub = (item.sublabel || "").toLowerCase();
  const kw = (item.keywords || "").toLowerCase();

  if (label.startsWith(q)) return SCORE_PREFIX;
  for (const word of label.split(/\s+/)) {
    if (word.startsWith(q)) return SCORE_WORD_PREFIX;
  }
  if (label.includes(q)) return SCORE_SUBSTRING;
  if (sub.includes(q)) return SCORE_SUBSTRING - 5;
  if (kw.includes(q)) return SCORE_KEYWORD;

  let qi = 0;
  for (let i = 0; i < label.length && qi < q.length; i++) {
    if (label[i] === q[qi]) qi++;
  }
  return qi === q.length ? 5 : 0;
}

function Highlight({ text, query }: { text: string; query: string }) {
  if (!query) return <>{text}</>;
  const i = text.toLowerCase().indexOf(query.toLowerCase());
  if (i === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, i)}
      <span className="text-[#F0564A] font-semibold">{text.slice(i, i + query.length)}</span>
      {text.slice(i + query.length)}
    </>
  );
}

export function CommandPalette({
  items,
  placeholder = "Search anything…",
  emptyHint = "No matches",
  open: openProp,
  onOpenChange,
}: Props) {
  const [openState, setOpenState] = useState(false);
  const open = openProp ?? openState;
  const setOpen = useCallback(
    (next: boolean | ((v: boolean) => boolean)) => {
      setOpenState((prev) => {
        const resolved = typeof next === "function" ? next(prev) : next;
        onOpenChange?.(resolved);
        return resolved;
      });
    },
    [onOpenChange]
  );
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const isMod = e.metaKey || e.ctrlKey;
      if (isMod && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
        return;
      }
      if (e.key === "Escape" && open) {
        e.preventDefault();
        setOpen(false);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, setOpen]);

  useEffect(() => {
    if (open) {
      setQuery("");
      setActiveIndex(0);
      const id = requestAnimationFrame(() => inputRef.current?.focus());
      return () => cancelAnimationFrame(id);
    }
  }, [open]);

  const filtered = useMemo(() => {
    const scored = items
      .map((it) => ({ item: it, s: score(it, query.trim()) }))
      .filter((x) => x.s > 0)
      .sort((a, b) => b.s - a.s);
    return scored.map((x) => x.item).slice(0, 60);
  }, [items, query]);

  const groups = useMemo(() => {
    const m = new Map<string, CommandItem[]>();
    for (const it of filtered) {
      const arr = m.get(it.group) ?? [];
      arr.push(it);
      m.set(it.group, arr);
    }
    return Array.from(m.entries());
  }, [filtered]);

  useEffect(() => {
    if (activeIndex >= filtered.length) setActiveIndex(0);
  }, [filtered.length, activeIndex]);

  useEffect(() => {
    const el = listRef.current?.querySelector<HTMLElement>(`[data-cmd-index="${activeIndex}"]`);
    el?.scrollIntoView({ block: "nearest" });
  }, [activeIndex]);

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((i) => Math.min(filtered.length - 1, i + 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((i) => Math.max(0, i - 1));
      } else if (e.key === "Enter") {
        e.preventDefault();
        const it = filtered[activeIndex];
        if (it) {
          setOpen(false);
          it.action();
        }
      } else if (e.key === "Home") {
        setActiveIndex(0);
      } else if (e.key === "End") {
        setActiveIndex(filtered.length - 1);
      }
    },
    [filtered, activeIndex]
  );

  let runningIndex = -1;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="cmdk-root"
          className="fixed inset-0 z-[200] flex items-start justify-center p-4 pt-[12vh]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          onClick={() => setOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Command palette"
        >
          <motion.div
            className="absolute inset-0 bg-black/70 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          <motion.div
            initial={{ y: -12, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -8, opacity: 0, scale: 0.985 }}
            transition={{ type: "spring", stiffness: 420, damping: 32 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-[640px] rounded-2xl border border-white/10 bg-[#0E0E0E]/95 shadow-2xl shadow-black/60 overflow-hidden"
            style={{ boxShadow: "0 30px 80px -10px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04)" }}
          >
            <div className="flex items-center gap-3 px-4 h-14 border-b border-white/5">
              <Search className="w-4 h-4 text-zinc-500" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setActiveIndex(0);
                }}
                onKeyDown={onKeyDown}
                placeholder={placeholder}
                className="flex-1 bg-transparent outline-none text-[15px] text-white placeholder:text-zinc-500"
                autoComplete="off"
                spellCheck={false}
              />
              <kbd className="hidden sm:flex items-center gap-1 text-[10px] font-medium text-zinc-500 bg-white/5 border border-white/10 rounded px-1.5 py-0.5">
                ESC
              </kbd>
            </div>

            <div ref={listRef} className="max-h-[60vh] overflow-y-auto py-2">
              {filtered.length === 0 ? (
                <div className="px-4 py-12 text-center text-sm text-zinc-500">
                  <CommandIcon className="w-5 h-5 mx-auto mb-3 opacity-40" />
                  {emptyHint}
                </div>
              ) : (
                groups.map(([groupName, groupItems]) => (
                  <div key={groupName} className="mb-1">
                    <div className="px-4 py-1.5 text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                      {groupName}
                    </div>
                    {groupItems.map((it) => {
                      runningIndex++;
                      const idx = runningIndex;
                      const isActive = idx === activeIndex;
                      return (
                        <button
                          key={it.id}
                          data-cmd-index={idx}
                          onMouseMove={() => setActiveIndex(idx)}
                          onClick={() => {
                            setOpen(false);
                            it.action();
                          }}
                          className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                            isActive ? "bg-white/[0.06]" : "bg-transparent"
                          }`}
                        >
                          <span
                            className={`shrink-0 w-7 h-7 rounded-md flex items-center justify-center border border-white/5 ${
                              isActive ? "bg-white/[0.08]" : "bg-white/[0.03]"
                            }`}
                            style={it.accent ? { color: it.accent } : undefined}
                          >
                            {it.icon}
                          </span>
                          <span className="flex-1 min-w-0">
                            <span className="block text-[13.5px] text-white truncate">
                              <Highlight text={it.label} query={query} />
                            </span>
                            {it.sublabel && (
                              <span className="block text-[11.5px] text-zinc-500 truncate">
                                {it.sublabel}
                              </span>
                            )}
                          </span>
                          {it.shortcut && (
                            <kbd className="text-[10px] text-zinc-500 bg-white/5 border border-white/10 rounded px-1.5 py-0.5">
                              {it.shortcut}
                            </kbd>
                          )}
                          {isActive && (
                            <CornerDownLeft className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                ))
              )}
            </div>

            <div className="flex items-center justify-between px-4 py-2.5 border-t border-white/5 bg-black/30">
              <div className="flex items-center gap-3 text-[10.5px] text-zinc-500">
                <span className="flex items-center gap-1">
                  <ArrowUp className="w-3 h-3" />
                  <ArrowDown className="w-3 h-3" />
                  navigate
                </span>
                <span className="flex items-center gap-1">
                  <CornerDownLeft className="w-3 h-3" />
                  select
                </span>
              </div>
              <div className="text-[10.5px] text-zinc-500">
                {filtered.length} {filtered.length === 1 ? "result" : "results"}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function useCommandPaletteHotkey(label = "Command Palette") {
  return { label, hint: "Cmd+K / Ctrl+K" };
}
