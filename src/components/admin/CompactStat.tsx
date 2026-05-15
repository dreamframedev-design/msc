"use client";

import type { LucideIcon } from "lucide-react";

const ACCENTS = {
  amber: { icon: "text-amber-500/80", bg: "bg-amber-500/5", num: "text-white", chip: "bg-amber-500/10 text-amber-400" },
  blue: { icon: "text-blue-500/80", bg: "bg-blue-500/5", num: "text-white", chip: "bg-blue-500/10 text-blue-400" },
  emerald: { icon: "text-emerald-500/80", bg: "bg-emerald-500/5", num: "text-white", chip: "bg-emerald-500/10 text-emerald-400" },
  red: { icon: "text-red-500/80", bg: "bg-red-500/5", num: "text-white", chip: "bg-red-500/10 text-red-400" },
  violet: { icon: "text-violet-400/80", bg: "bg-violet-500/5", num: "text-white", chip: "bg-violet-500/10 text-violet-300" },
  cyan: { icon: "text-cyan-400/80", bg: "bg-cyan-500/5", num: "text-white", chip: "bg-cyan-500/10 text-cyan-300" },
} as const;

/**
 * Side-by-side stat card. Label + icon on the left, big number on the right.
 * Designed to be vertically short (~64–88px tall) so 3 of them stack
 * compactly above the toolbar without dominating the viewport.
 */
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
    <div className="relative overflow-hidden rounded-xl border border-white/5 bg-[#111111] px-3 py-2.5 sm:px-4 sm:py-3 lg:px-5 lg:py-3.5 flex items-center justify-between gap-3">
      <div className={`absolute top-0 right-0 w-14 h-14 sm:w-20 sm:h-20 ${a.bg} rounded-bl-full pointer-events-none`} />
      <div className="flex items-center gap-2 min-w-0 relative">
        <span className={`shrink-0 inline-flex items-center justify-center w-6 h-6 rounded-md ${a.chip}`}>
          <Icon className="w-3 h-3" />
        </span>
        <span className="text-[10.5px] sm:text-xs font-medium text-zinc-400 uppercase tracking-wider truncate">{label}</span>
      </div>
      <p className={`text-2xl sm:text-3xl font-semibold tabular-nums ${a.num} tracking-tight relative shrink-0`}>{value}</p>
    </div>
  );
}
