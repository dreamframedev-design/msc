"use client";

import { type CSSProperties } from "react";

type Size = "xs" | "sm" | "md" | "lg" | "xl";

const SIZE_MAP: Record<Size, { box: string; text: string; ring: string }> = {
  xs: { box: "w-6 h-6", text: "text-[9px]", ring: "ring-1" },
  sm: { box: "w-8 h-8", text: "text-[11px]", ring: "ring-1" },
  md: { box: "w-10 h-10", text: "text-xs", ring: "ring-1" },
  lg: { box: "w-14 h-14", text: "text-base", ring: "ring-2" },
  xl: { box: "w-20 h-20", text: "text-xl", ring: "ring-2" },
};

const GRADIENTS: [string, string][] = [
  ["#F0564A", "#D25C26"],
  ["#5BCBD7", "#7AAEB7"],
  ["#F08435", "#FAAC40"],
  ["#A855F7", "#6366F1"],
  ["#10B981", "#0EA5E9"],
  ["#EC4899", "#F0564A"],
  ["#8B5CF6", "#3B82F6"],
  ["#F59E0B", "#EF4444"],
  ["#06B6D4", "#3B82F6"],
];

function hashCode(input: string): number {
  let h = 0;
  for (let i = 0; i < input.length; i++) {
    h = (h << 5) - h + input.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

export function getInitials(input: string | undefined | null): string {
  if (!input) return "?";
  const s = input.trim();
  if (!s) return "?";
  if (s.includes("@")) {
    const name = s.split("@")[0];
    const parts = name.split(/[._-]/).filter(Boolean);
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return name.slice(0, 2).toUpperCase();
  }
  const parts = s.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return s.slice(0, 2).toUpperCase();
}

export function getAvatarGradient(seed: string | undefined | null): [string, string] {
  if (!seed) return GRADIENTS[0];
  return GRADIENTS[hashCode(seed) % GRADIENTS.length];
}

type Props = {
  name?: string | null;
  email?: string | null;
  src?: string | null;
  size?: Size;
  className?: string;
  ringClassName?: string;
  title?: string;
};

export function UserAvatar({
  name,
  email,
  src,
  size = "md",
  className = "",
  ringClassName = "ring-white/10",
  title,
}: Props) {
  const seed = email || name || "anonymous";
  const initials = getInitials(name || email);
  const [from, to] = getAvatarGradient(seed);
  const { box, text, ring } = SIZE_MAP[size];

  const gradientStyle: CSSProperties = {
    backgroundImage: `linear-gradient(135deg, ${from} 0%, ${to} 100%)`,
  };

  if (src) {
    return (
      <span
        title={title ?? (name || email || undefined)}
        className={`relative inline-flex items-center justify-center rounded-full overflow-hidden ${box} ${ring} ${ringClassName} ${className}`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={name || email || "avatar"} className="w-full h-full object-cover" />
      </span>
    );
  }

  return (
    <span
      title={title ?? (name || email || undefined)}
      style={gradientStyle}
      className={`relative inline-flex items-center justify-center rounded-full font-semibold text-white tracking-wide ${box} ${text} ${ring} ${ringClassName} ${className}`}
    >
      <span className="drop-shadow-sm">{initials}</span>
    </span>
  );
}
