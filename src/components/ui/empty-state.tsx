"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

type Props = {
  Icon?: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
  accent?: "spark" | "cyan" | "neutral";
  className?: string;
};

const ACCENT_MAP = {
  spark: {
    ring: "rgba(240, 86, 74, 0.15)",
    glow: "rgba(240, 86, 74, 0.08)",
    icon: "text-[#F0564A]",
    iconBg: "bg-[#F0564A]/10",
  },
  cyan: {
    ring: "rgba(91, 203, 215, 0.15)",
    glow: "rgba(91, 203, 215, 0.08)",
    icon: "text-[#5BCBD7]",
    iconBg: "bg-[#5BCBD7]/10",
  },
  neutral: {
    ring: "rgba(255, 255, 255, 0.08)",
    glow: "rgba(255, 255, 255, 0.04)",
    icon: "text-zinc-400",
    iconBg: "bg-white/5",
  },
};

export function EmptyState({
  Icon,
  title,
  description,
  action,
  accent = "neutral",
  className = "",
}: Props) {
  const styles = ACCENT_MAP[accent];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className={`relative overflow-hidden rounded-2xl border border-white/5 bg-[#0E0E0E] px-8 py-14 text-center ${className}`}
      style={{
        boxShadow: `0 0 0 1px ${styles.ring}, 0 30px 80px -40px ${styles.glow}`,
      }}
    >
      <div
        className="absolute inset-x-0 -top-32 h-64 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at center, ${styles.glow} 0%, transparent 70%)`,
        }}
      />
      <div className="relative flex flex-col items-center max-w-md mx-auto">
        {Icon && (
          <div className={`w-12 h-12 rounded-xl ${styles.iconBg} flex items-center justify-center mb-5 border border-white/5`}>
            <Icon className={`w-5 h-5 ${styles.icon}`} />
          </div>
        )}
        <h3 className="text-base font-semibold text-white">{title}</h3>
        {description && (
          <p className="mt-1.5 text-sm text-zinc-500 leading-relaxed">{description}</p>
        )}
        {action && <div className="mt-6">{action}</div>}
      </div>
    </motion.div>
  );
}
