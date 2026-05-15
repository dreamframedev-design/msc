"use client";

import type { LucideIcon } from "lucide-react";

const ACCENTS = {
  amber: { icon: "text-amber-500/70", bg: "bg-amber-500/5", num: "text-white" },
  blue: { icon: "text-blue-500/70", bg: "bg-blue-500/5", num: "text-white" },
  emerald: { icon: "text-emerald-500/70", bg: "bg-emerald-500/5", num: "text-white" },
  red: { icon: "text-red-500/70", bg: "bg-red-500/5", num: "text-white" },
  violet: { icon: "text-violet-400/80", bg: "bg-violet-500/5", num: "text-white" },
  cyan: { icon: "text-cyan-400/80", bg: "bg-cyan-500/5", num: "text-white" },
} as const;

export function CompactStat({
  Icon,
  label,
  value,
  accent = "blue",
}: {
  Icon: LucideIcon;
  label: string;
  value: number | string;
  accent?: keyof typeof ACCENTS;
}) {
  const a = ACCENTS[accent];
  return (
    <div className={`relative overflow-hidden rounded-xl sm:rounded-2xl border border-white/5 bg-[#111111] p-3 sm:p-4 lg:p-6`}>
      <div className={`absolute top-0 right-0 w-16 h-16 sm:w-24 sm:h-24 ${a.bg} rounded-bl-full pointer-events-none`} />
      <p className="text-[10px] sm:text-xs lg:text-sm text-zinc-400 font-medium flex items-center gap-1.5 sm:gap-2">
        <Icon className={`w-3 h-3 sm:w-3.5 sm:h-3.5 lg:w-4 lg:h-4 ${a.icon} shrink-0`} />
        <span className="truncate">{label}</span>
      </p>
      <p className={`text-2xl sm:text-3xl lg:text-4xl font-semibold ${a.num} tracking-tight mt-0.5 sm:mt-1 lg:mt-2`}>
        {value}
      </p>
    </div>
  );
}
