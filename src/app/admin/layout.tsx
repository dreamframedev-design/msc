import type { ReactNode } from "react";
import { ToastProvider } from "@/components/ui/toast";
import { CommandPaletteProvider } from "@/components/command/CommandPaletteContext";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <ToastProvider>
      <CommandPaletteProvider
        placeholder="Search tickets, tasks, boards, files, users…"
        emptyHint="No matches — try a different query"
      >
        {children}
      </CommandPaletteProvider>
    </ToastProvider>
  );
}
