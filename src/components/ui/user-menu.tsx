"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Settings as SettingsIcon, LogOut, ShieldAlert, Building2 } from "lucide-react";
import { UserAvatar } from "@/components/ui/user-avatar";

type Props = {
  isDark?: boolean;
  email?: string | null;
  role?: string | null;
  company?: string | null;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  ringClassName?: string;
  onOpenSettings?: () => void;
  onSignOut?: () => void | Promise<void>;
  extra?: ReactNode;
};

export function UserMenu({
  isDark = true,
  email,
  role,
  company,
  size = "xs",
  ringClassName,
  onOpenSettings,
  onSignOut,
  extra,
}: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDocClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
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

  const roleLabel = role === "superadmin" ? "Master Admin" : role === "admin" ? "Administrator" : "Client";
  const roleStyles = role === "superadmin"
    ? "bg-purple-500/10 text-purple-400 border-purple-500/20"
    : role === "admin"
    ? "bg-[#F0564A]/10 text-[#F0564A] border-[#F0564A]/20"
    : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="rounded-full focus:outline-none focus:ring-2 focus:ring-[#F0564A]/40 transition-all"
        aria-label="Open user menu"
        aria-expanded={open}
      >
        <UserAvatar email={email} size={size} ringClassName={ringClassName ?? (isDark ? "ring-white/10" : "ring-gray-200")} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 460, damping: 32 }}
            className={`absolute right-0 mt-2 w-[min(300px,calc(100vw-2rem))] rounded-2xl border shadow-2xl z-50 overflow-hidden ${
              isDark ? "bg-[#0E0E0E] border-white/10 shadow-black/60" : "bg-white border-gray-200 shadow-gray-300/40"
            }`}
          >
            <div className={`flex items-center justify-between px-3 py-2.5 border-b ${isDark ? "border-white/5" : "border-gray-100"}`}>
              <div className="flex items-center gap-2.5 min-w-0">
                <UserAvatar email={email} size="sm" ringClassName={isDark ? "ring-white/10" : "ring-gray-200"} />
                <div className="min-w-0">
                  <p className={`text-[12.5px] font-semibold truncate ${isDark ? "text-white" : "text-gray-900"}`}>
                    {email?.split("@")[0] || "User"}
                  </p>
                  <p className={`text-[10px] truncate ${isDark ? "text-zinc-500" : "text-gray-500"}`}>{email}</p>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className={`p-1 rounded ${isDark ? "text-zinc-500 hover:text-white" : "text-gray-400 hover:text-gray-900"}`}
                aria-label="Close"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="px-3 py-2.5 space-y-2">
              <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${roleStyles}`}>
                {role === "superadmin" && <ShieldAlert className="w-3 h-3" />}
                {roleLabel}
              </span>
              {company && (
                <div className={`flex items-center gap-1.5 text-[11px] ${isDark ? "text-zinc-400" : "text-gray-500"}`}>
                  <Building2 className="w-3 h-3 shrink-0" />
                  <span className="truncate">{company}</span>
                </div>
              )}
            </div>

            {extra && <div className={`px-3 pb-2.5 ${isDark ? "border-t border-white/5 pt-2.5" : "border-t border-gray-100 pt-2.5"}`}>{extra}</div>}

            <div className={`flex flex-col py-1.5 border-t ${isDark ? "border-white/5" : "border-gray-100"}`}>
              {onOpenSettings && (
                <button
                  onClick={() => {
                    setOpen(false);
                    onOpenSettings();
                  }}
                  className={`flex items-center gap-2.5 px-3 py-2 text-left text-[12.5px] transition-colors ${
                    isDark ? "text-zinc-300 hover:text-white hover:bg-white/5" : "text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  <SettingsIcon className="w-3.5 h-3.5" />
                  Account Settings
                </button>
              )}
              {onSignOut && (
                <button
                  onClick={async () => {
                    setOpen(false);
                    await onSignOut();
                  }}
                  className={`flex items-center gap-2.5 px-3 py-2 text-left text-[12.5px] transition-colors ${
                    isDark ? "text-zinc-300 hover:text-red-400 hover:bg-red-500/10" : "text-gray-700 hover:text-red-600 hover:bg-red-50"
                  }`}
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Sign Out
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
