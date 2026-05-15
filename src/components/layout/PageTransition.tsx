"use client";

import { ReactNode } from "react";

/**
 * Pass-through.
 *
 * We previously wrapped route children in framer-motion's AnimatePresence
 * with mode="wait" to fade between pages. That occasionally got stuck in
 * the exit animation, leaving a blank page until the user manually
 * refreshed — both on /admin → / navigation (heavy state) and very
 * occasionally on plain marketing-page → marketing-page navigation.
 *
 * Pages each have their own entrance animations on hero blocks, so the
 * cross-route fade was decorative. The reliability win is worth the
 * lost flourish.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
