import type { ReactNode } from "react";
import { ToastProvider } from "@/components/ui/toast";
import { CommandPaletteProvider } from "@/components/command/CommandPaletteContext";

export default function PortalLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="portal-layout relative z-[100] min-h-screen bg-[#0A0A0A]">
      <ToastProvider>
        <CommandPaletteProvider
          placeholder="Search tickets, tasks, files…"
          emptyHint="No matches — try a different query"
        >
          {children}
        </CommandPaletteProvider>
      </ToastProvider>
    </div>
  );
}
