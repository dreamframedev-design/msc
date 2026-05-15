"use client";

import { Reorder, useDragControls, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  GripVertical,
  Clock,
  CheckCircle2,
  MessageSquare,
  ChevronRight,
} from "lucide-react";

type QueueItem = {
  type: "ticket" | "task";
  id: string;
  title: string;
  description: string;
  priority: string;
  status: string;
  created_at: string;
  client: string;
  originalItem: any;
};

type Props = {
  item: QueueItem;
  statusColor: string;
  onStart: () => void;
  onResolve: () => void;
  onOpenTicket: () => void;
  onOpenTask: () => void;
  onGoToProject: () => void;
};

export function QueueRow({
  item,
  statusColor,
  onStart,
  onResolve,
  onOpenTicket,
  onOpenTask,
  onGoToProject,
}: Props) {
  const controls = useDragControls();

  return (
    <Reorder.Item
      value={item}
      dragListener={false}
      dragControls={controls}
      layout="position"
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ type: "spring", stiffness: 600, damping: 40, mass: 0.6 }}
      whileDrag={{
        scale: 1.015,
        boxShadow: "0 20px 50px -12px rgba(0,0,0,0.6)",
        zIndex: 20,
        cursor: "grabbing",
      }}
      className="bg-[#111111] border border-white/5 rounded-xl p-4 hover:border-white/10 group relative flex flex-col gap-3 select-none"
    >
      {/* Urgent Edge Highlight */}
      {item.priority === "Urgent" && (
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-500 rounded-l-xl pointer-events-none" />
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <button
          type="button"
          onPointerDown={(e) => {
            e.preventDefault();
            controls.start(e);
          }}
          aria-label="Drag to reorder"
          title="Drag to reorder"
          className="touch-none cursor-grab active:cursor-grabbing text-zinc-600 hover:text-zinc-300 transition-colors shrink-0 self-start sm:self-center -ml-1 sm:-ml-1 p-1.5 rounded-md hover:bg-white/[0.04]"
        >
          <GripVertical className="w-4 h-4" />
        </button>

        <div className="flex-1 min-w-0 flex flex-col gap-1.5">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-mono text-zinc-500">#{item.id.substring(0, 6)}</span>
            <h3 className="text-base font-bold text-white truncate max-w-sm" title={item.title}>
              {item.title}
            </h3>
            {item.priority === "Urgent" && (
              <span className="bg-red-500/10 text-red-500 border border-red-500/20 text-[9px] uppercase font-bold px-1.5 py-0.5 rounded">
                Urgent
              </span>
            )}
            {item.type === "ticket" ? (
              <span className="bg-purple-500/10 text-purple-400 border border-purple-500/20 text-[9px] uppercase font-bold px-1.5 py-0.5 rounded">
                Ticket
              </span>
            ) : (
              <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[9px] uppercase font-bold px-1.5 py-0.5 rounded">
                Task
              </span>
            )}
            <span className={`text-[9px] uppercase font-bold px-1.5 py-0.5 rounded border ${statusColor}`}>
              {item.status.replace("_", " ")}
            </span>
            <span className="flex items-center gap-1 bg-white/5 text-zinc-300 border border-white/5 text-[9px] uppercase font-bold px-1.5 py-0.5 rounded">
              {item.client.split("@")[0]}
            </span>
          </div>

          <div className="text-xs text-zinc-400 truncate max-w-4xl pr-4">{item.description}</div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {item.status === "pending" && (
            <Button
              variant="outline"
              size="sm"
              onClick={onStart}
              className="h-8 text-xs text-blue-400 border-blue-400/20 bg-blue-400/10 hover:bg-blue-400/20 px-3"
            >
              <Clock className="w-3.5 h-3.5 mr-1.5" /> Start
            </Button>
          )}
          {item.status !== "completed" && (
            <Button
              variant="outline"
              size="sm"
              onClick={onResolve}
              className="h-8 text-xs text-emerald-400 border-emerald-400/20 bg-emerald-400/10 hover:bg-emerald-400/20 px-3"
            >
              <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" /> Resolve
            </Button>
          )}

          <div className="w-px h-5 bg-white/10 mx-1 hidden sm:block" />

          {item.type === "ticket" ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={onOpenTicket}
              className="h-8 text-xs text-zinc-400 hover:text-white hover:bg-white/5"
            >
              Details <ChevronRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          ) : (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={onOpenTask}
                className="h-8 text-xs text-zinc-400 hover:text-white hover:bg-white/5"
              >
                <MessageSquare className="w-3.5 h-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onGoToProject}
                className="h-8 text-xs text-zinc-400 hover:text-white hover:bg-white/5 px-2"
              >
                Project <ChevronRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </>
          )}
        </div>
      </div>
    </Reorder.Item>
  );
}
