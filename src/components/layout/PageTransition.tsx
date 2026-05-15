"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  // Skip transition on app surfaces — they manage their own internal tab transitions
  // and they have heavy state (subscriptions, modals) that conflicts with
  // AnimatePresence mode="wait" exit timing, causing a brief white page on nav.
  if (pathname?.startsWith("/portal/dashboard") || pathname?.startsWith("/admin")) {
    return <>{children}</>;
  }

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -4 }}
        transition={{
          duration: 0.45,
          ease: [0.16, 1, 0.3, 1],
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
