import { type HTMLAttributes } from "react";

function cn(...parts: (string | false | undefined | null)[]) {
  return parts.filter(Boolean).join(" ");
}

export function Skeleton({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-md bg-white/[0.04] border border-white/[0.04]",
        "before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.6s_infinite]",
        "before:bg-gradient-to-r before:from-transparent before:via-white/[0.06] before:to-transparent",
        className
      )}
      {...props}
    />
  );
}

export function SkeletonText({ width = "100%", className }: { width?: string | number; className?: string }) {
  return <Skeleton className={cn("h-3.5", className)} style={{ width }} />;
}

export function SkeletonRow() {
  return (
    <div className="flex items-center gap-4 py-3.5 px-4 border-b border-white/[0.04]">
      <Skeleton className="w-9 h-9 rounded-full shrink-0" />
      <div className="flex-1 space-y-2">
        <SkeletonText width="40%" />
        <SkeletonText width="22%" className="h-2.5" />
      </div>
      <Skeleton className="w-16 h-6 rounded-full" />
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="rounded-xl border border-white/5 bg-[#111] p-5 space-y-3">
      <div className="flex items-center justify-between">
        <Skeleton className="w-24 h-3 rounded" />
        <Skeleton className="w-6 h-6 rounded-full" />
      </div>
      <Skeleton className="h-7 w-20 rounded" />
      <Skeleton className="h-2.5 w-32 rounded" />
    </div>
  );
}

export function SkeletonList({ count = 6 }: { count?: number }) {
  return (
    <div className="rounded-xl border border-white/5 bg-[#0E0E0E] overflow-hidden">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonRow key={i} />
      ))}
    </div>
  );
}

export function SkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

export function SkeletonBoardColumn() {
  return (
    <div className="rounded-xl border border-white/5 bg-[#0E0E0E] p-4 space-y-3 min-w-[280px]">
      <div className="flex items-center justify-between">
        <Skeleton className="w-20 h-3 rounded" />
        <Skeleton className="w-6 h-5 rounded-full" />
      </div>
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="rounded-lg border border-white/5 bg-black/30 p-3 space-y-2">
          <SkeletonText width="80%" />
          <SkeletonText width="55%" className="h-2.5" />
          <div className="flex items-center gap-2 pt-1">
            <Skeleton className="w-5 h-5 rounded-full" />
            <Skeleton className="w-12 h-2.5 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}
