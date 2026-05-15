"use client";

import { Reorder, useDragControls } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  GripVertical,
  CheckCircle2,
  Clock,
  MessageSquare,
  Trash2,
} from "lucide-react";

type Task = {
  id: string;
  title: string;
  status: string;
  client_tag?: string | null;
  created_at: string;
  [k: string]: any;
};

type Props = {
  task: Task;
  onToggleComplete: () => void;
  onStart: () => void;
  onOpen: () => void;
  onDelete: () => void;
};

export function TaskRow({ task, onToggleComplete, onStart, onOpen, onDelete }: Props) {
  const controls = useDragControls();

  return (
    <Reorder.Item
      value={task}
      dragListener={false}
      dragControls={controls}
      layout="position"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ type: "spring", stiffness: 600, damping: 40, mass: 0.6 }}
      whileDrag={{
        scale: 1.01,
        boxShadow: "0 16px 40px -10px rgba(0,0,0,0.55)",
        zIndex: 20,
        cursor: "grabbing",
      }}
      className={`border-b border-white/5 last:border-0 p-5 hover:bg-white/[0.02] transition-colors flex flex-col gap-3 group/task bg-[#111111] select-none ${
        task.status === "completed" ? "opacity-60" : ""
      }`}
    >
      <div className="flex items-center gap-3">
        <button
          type="button"
          onPointerDown={(e) => {
            e.preventDefault();
            controls.start(e);
          }}
          aria-label="Drag to reorder"
          title="Drag to reorder"
          className="touch-none cursor-grab active:cursor-grabbing text-zinc-600 hover:text-zinc-300 transition-colors shrink-0 -ml-1 p-1.5 rounded-md hover:bg-white/[0.04]"
        >
          <GripVertical className="w-4 h-4" />
        </button>

        <button
          onClick={onToggleComplete}
          className={`w-6 h-6 rounded-md border flex items-center justify-center shrink-0 transition-colors ${
            task.status === "completed"
              ? "bg-emerald-500 border-emerald-500 text-white"
              : "bg-transparent border-zinc-600 hover:border-emerald-500 text-transparent hover:text-emerald-500"
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4 mb-1">
            <p
              className={`text-base font-medium break-words whitespace-pre-wrap flex-1 min-w-0 ${
                task.status === "completed" ? "text-zinc-500 line-through" : "text-zinc-100"
              }`}
            >
              {task.title}
            </p>
            {task.client_tag && (
              <span className="inline-flex shrink-0 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-white/10 text-zinc-300 border border-white/10 mt-1">
                {task.client_tag}
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <p className="text-xs text-zinc-500">
              Added{" "}
              {new Date(task.created_at).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {task.status !== "completed" && task.status !== "in_progress" && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onStart}
              className="h-8 text-xs text-blue-400 hover:bg-blue-400/10 hover:text-blue-300"
            >
              <Clock className="w-3.5 h-3.5 mr-1.5" /> Start
            </Button>
          )}
          {task.status === "in_progress" && (
            <span className="inline-flex px-2 py-1 rounded text-[10px] font-bold uppercase border bg-blue-500/10 text-blue-400 border-blue-500/20 mr-2">
              In Progress
            </span>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={onOpen}
            className="h-8 text-xs text-zinc-400 hover:text-white hover:bg-white/5"
          >
            <MessageSquare className="w-4 h-4 mr-1.5" /> Chat
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onDelete}
            className="h-8 w-8 text-zinc-500 hover:text-red-400 hover:bg-red-500/10"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Reorder.Item>
  );
}
