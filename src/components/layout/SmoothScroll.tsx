"use client";

import { ReactLenis } from "lenis/react";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

export function SmoothScroll({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  // Skip Lenis on app surfaces — they manage their own scrolling and Lenis's
  // root-level scroll hijack causes a stale-state white-page when transitioning
  // away (the new route's scroll position can't reset cleanly).
  if (pathname?.startsWith("/admin") || pathname?.startsWith("/portal")) {
    return <>{children}</>;
  }

  return (
    <ReactLenis root options={{ lerp: 0.08, duration: 1.5, smoothWheel: true, syncTouch: true }}>
      {children}
    </ReactLenis>
  );
}
