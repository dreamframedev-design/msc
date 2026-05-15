"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, X, Activity as ActivityIcon, Ticket, CheckSquare, FolderOpen, MessageSquare } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { describeAction } from "@/lib/activity";

type Props = {
  isDark?: boolean;
  userId?: string | null;
  /** If true, show ALL recent activity (admin mode). If false, only items relevant to this user. */
  adminScope?: boolean;
  onSelect?: (event: any) => void;
};

const ICON_BY_TARGET: Record<string, typeof Ticket> = {
  ticket: Ticket,
  task: CheckSquare,
  file: FolderOpen,
  comment: MessageSquare,
};

function timeAgo(iso: string): string {
  const t = new Date(iso).getTime();
  const diff = Date.now() - t;
  const s = Math.floor(diff / 1000);
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d}d ago`;
  return new Date(iso).toLocaleDateString();
}

const LAST_READ_KEY = "msc-notif-last-read";

export function NotificationBell({ isDark = true, userId, adminScope = false, onSelect }: Props) {
  const [open, setOpen] = useState(false);
  const [events, setEvents] = useState<any[]>([]);
  const [tableMissing, setTableMissing] = useState(false);
  const [lastRead, setLastRead] = useState<number>(0);
  const popRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const v = localStorage.getItem(LAST_READ_KEY);
      if (v) setLastRead(parseInt(v, 10));
    } catch {}
  }, []);

  useEffect(() => {
    if (!userId) return;
    let cancelled = false;
    const load = async () => {
      let query = supabase
        .from("activity_log")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(15);
      if (!adminScope) {
        // For clients: only events where THEY are the actor or the target is them
        // (e.g., admin replied on their ticket → actor is admin but their ticket id is the target)
        // The simplest filter: exclude self-actor events to surface admin replies on their stuff.
        query = query.neq("actor_id", userId);
      }
      const { data, error } = await query;
      if (cancelled) return;
      if (error) {
        if (error.code === "42P01") setTableMissing(true);
        return;
      }
      setEvents(data ?? []);
    };
    load();

    const channel = supabase
      .channel(`notif_bell_${userId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "activity_log" },
        (payload) => {
          const ev = payload.new as any;
          if (!adminScope && ev.actor_id === userId) return;
          setEvents((prev) => {
            if (prev.find((e) => e.id === ev.id)) return prev;
            return [ev, ...prev].slice(0, 15);
          });
        }
      )
      .subscribe();

    return () => {
      cancelled = true;
      supabase.removeChannel(channel);
    };
  }, [userId, adminScope]);

  useEffect(() => {
    if (!open) return;
    const onDocClick = (e: MouseEvent) => {
      if (popRef.current && !popRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onEsc);
    };
  }, [open]);

  const unreadCount = events.filter((e) => new Date(e.created_at).getTime() > lastRead).length;

  const markAllRead = () => {
    const now = Date.now();
    setLastRead(now);
    try {
      localStorage.setItem(LAST_READ_KEY, String(now));
    } catch {}
  };

  return (
    <div className="relative" ref={popRef}>
      <button
        onClick={() => {
          const next = !open;
          setOpen(next);
          if (next) markAllRead();
        }}
        className={`relative rounded-full w-9 h-9 flex items-center justify-center transition-colors ${
          isDark ? "text-gray-400 hover:text-white hover:bg-white/[0.08]" : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
        }`}
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#F0564A]">
            <span className="absolute inset-0 rounded-full bg-[#F0564A] animate-ping" />
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 480, damping: 34 }}
            className={`absolute right-0 mt-2 w-[min(380px,calc(100vw-2rem))] rounded-2xl border shadow-2xl z-50 overflow-hidden ${
              isDark
                ? "bg-[#0E0E0E] border-white/10 shadow-black/60"
                : "bg-white border-gray-200 shadow-gray-300/50"
            }`}
          >
            <div className={`flex items-center justify-between px-4 py-3 border-b ${isDark ? "border-white/5" : "border-gray-200"}`}>
              <div className="flex items-center gap-2">
                <ActivityIcon className={`w-3.5 h-3.5 ${isDark ? "text-emerald-400" : "text-emerald-600"}`} />
                <span className={`text-sm font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>Activity</span>
              </div>
              <button
                onClick={() => setOpen(false)}
                className={`p-1 rounded ${isDark ? "text-zinc-500 hover:text-white" : "text-gray-400 hover:text-gray-900"}`}
                aria-label="Close"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="max-h-[60vh] overflow-y-auto">
              {tableMissing ? (
                <p className={`text-xs px-4 py-10 text-center ${isDark ? "text-zinc-500" : "text-gray-500"}`}>
                  Run <code className="text-[#F0564A]">master_activity_log.sql</code> to enable activity feed.
                </p>
              ) : events.length === 0 ? (
                <p className={`text-sm px-4 py-10 text-center ${isDark ? "text-zinc-500" : "text-gray-500"}`}>
                  You're all caught up.
                </p>
              ) : (
                <ul className={`divide-y ${isDark ? "divide-white/5" : "divide-gray-100"}`}>
                  {events.map((ev) => {
                    const Icon = ICON_BY_TARGET[ev.target_type] ?? ActivityIcon;
                    return (
                      <li key={ev.id}>
                        <button
                          onClick={() => {
                            onSelect?.(ev);
                            setOpen(false);
                          }}
                          className={`w-full text-left px-4 py-3 transition-colors flex items-start gap-3 ${
                            isDark ? "hover:bg-white/[0.03]" : "hover:bg-gray-50"
                          }`}
                        >
                          <span
                            className={`mt-0.5 w-7 h-7 rounded-md flex items-center justify-center shrink-0 ${
                              isDark ? "bg-white/[0.05] border border-white/10" : "bg-gray-100 border border-gray-200"
                            }`}
                          >
                            <Icon className={`w-3.5 h-3.5 ${isDark ? "text-zinc-300" : "text-gray-600"}`} />
                          </span>
                          <div className="flex-1 min-w-0">
                            <p className={`text-[12.5px] leading-snug ${isDark ? "text-zinc-200" : "text-gray-900"}`}>
                              <span className={`font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>
                                {ev.actor_email?.split("@")[0] || "Someone"}
                              </span>{" "}
                              <span className={isDark ? "text-zinc-400" : "text-gray-500"}>{describeAction(ev.action)}</span>{" "}
                              {ev.target_label && (
                                <span className={isDark ? "text-zinc-200" : "text-gray-700"}>
                                  "{ev.target_label.length > 32 ? ev.target_label.slice(0, 32) + "…" : ev.target_label}"
                                </span>
                              )}
                            </p>
                            <p className={`text-[10.5px] mt-0.5 ${isDark ? "text-zinc-600" : "text-gray-400"}`}>
                              {timeAgo(ev.created_at)}
                            </p>
                          </div>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
