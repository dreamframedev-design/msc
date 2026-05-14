"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, AlertCircle, Info, X, Loader2 } from "lucide-react";

export type ToastVariant = "success" | "error" | "info" | "loading";

export type Toast = {
  id: string;
  title: string;
  description?: string;
  variant: ToastVariant;
  duration?: number;
};

type ToastContextValue = {
  toast: (t: Omit<Toast, "id" | "variant"> & { variant?: ToastVariant }) => string;
  success: (title: string, description?: string) => string;
  error: (title: string, description?: string) => string;
  info: (title: string, description?: string) => string;
  loading: (title: string, description?: string) => string;
  dismiss: (id: string) => void;
  update: (id: string, patch: Partial<Toast>) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

const VARIANT_STYLES: Record<ToastVariant, { ring: string; icon: ReactNode; text: string }> = {
  success: {
    ring: "ring-emerald-500/30 shadow-emerald-500/10",
    icon: <CheckCircle2 className="w-4 h-4 text-emerald-400" />,
    text: "text-emerald-400",
  },
  error: {
    ring: "ring-[#F0564A]/40 shadow-[#F0564A]/10",
    icon: <AlertCircle className="w-4 h-4 text-[#F0564A]" />,
    text: "text-[#F0564A]",
  },
  info: {
    ring: "ring-sky-400/30 shadow-sky-400/10",
    icon: <Info className="w-4 h-4 text-sky-400" />,
    text: "text-sky-400",
  },
  loading: {
    ring: "ring-white/15 shadow-black/40",
    icon: <Loader2 className="w-4 h-4 text-zinc-300 animate-spin" />,
    text: "text-zinc-300",
  },
};

function newId() {
  return Math.random().toString(36).slice(2, 10);
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const timersRef = useRef(new Map<string, ReturnType<typeof setTimeout>>());

  const dismiss = useCallback((id: string) => {
    setToasts((arr) => arr.filter((t) => t.id !== id));
    const timer = timersRef.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timersRef.current.delete(id);
    }
  }, []);

  const schedule = useCallback(
    (id: string, duration: number) => {
      const existing = timersRef.current.get(id);
      if (existing) clearTimeout(existing);
      if (duration > 0) {
        const t = setTimeout(() => dismiss(id), duration);
        timersRef.current.set(id, t);
      }
    },
    [dismiss]
  );

  const toast = useCallback<ToastContextValue["toast"]>(
    ({ title, description, variant = "info", duration }) => {
      const id = newId();
      const def = variant === "loading" ? 0 : variant === "error" ? 6000 : 3800;
      const t: Toast = { id, title, description, variant, duration: duration ?? def };
      setToasts((arr) => [...arr, t]);
      schedule(id, t.duration ?? 0);
      return id;
    },
    [schedule]
  );

  const update = useCallback<ToastContextValue["update"]>(
    (id, patch) => {
      setToasts((arr) => arr.map((t) => (t.id === id ? { ...t, ...patch } : t)));
      if (patch.duration !== undefined || patch.variant !== undefined) {
        const next = toasts.find((t) => t.id === id);
        const variant = patch.variant ?? next?.variant ?? "info";
        const def = variant === "loading" ? 0 : variant === "error" ? 6000 : 3800;
        schedule(id, patch.duration ?? def);
      }
    },
    [schedule, toasts]
  );

  const value = useMemo<ToastContextValue>(
    () => ({
      toast,
      dismiss,
      update,
      success: (title, description) => toast({ title, description, variant: "success" }),
      error: (title, description) => toast({ title, description, variant: "error" }),
      info: (title, description) => toast({ title, description, variant: "info" }),
      loading: (title, description) => toast({ title, description, variant: "loading" }),
    }),
    [toast, dismiss, update]
  );

  useEffect(() => {
    const timers = timersRef.current;
    return () => {
      timers.forEach((t) => clearTimeout(t));
      timers.clear();
    };
  }, []);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastViewport toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  );
}

function ToastViewport({ toasts, onDismiss }: { toasts: Toast[]; onDismiss: (id: string) => void }) {
  return (
    <div className="fixed top-4 right-4 z-[300] flex flex-col gap-2 w-[min(380px,calc(100vw-2rem))] pointer-events-none">
      <AnimatePresence initial={false}>
        {toasts.map((t) => {
          const styles = VARIANT_STYLES[t.variant];
          return (
            <motion.div
              key={t.id}
              layout
              initial={{ opacity: 0, y: -12, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.97, transition: { duration: 0.15 } }}
              transition={{ type: "spring", stiffness: 380, damping: 30 }}
              className={`pointer-events-auto rounded-xl border border-white/10 bg-[#111]/95 backdrop-blur-xl shadow-lg ring-1 ${styles.ring}`}
            >
              <div className="flex items-start gap-3 p-3.5">
                <span className="mt-0.5">{styles.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-semibold text-white truncate">{t.title}</div>
                  {t.description && (
                    <div className="text-[11.5px] text-zinc-400 mt-0.5 leading-snug">
                      {t.description}
                    </div>
                  )}
                </div>
                <button
                  onClick={() => onDismiss(t.id)}
                  className="text-zinc-500 hover:text-zinc-200 transition-colors shrink-0"
                  aria-label="Dismiss"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
