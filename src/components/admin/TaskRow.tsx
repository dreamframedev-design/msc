"use client";

import { useEffect, useRef, useState } from "react";
import { Reorder, useDragControls } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  GripVertical,
  CheckCircle2,
  Clock,
  MessageSquare,
  Trash2,
  Star,
  StickyNote,
} from "lucide-react";

type Task = {
  id: string;
  title: string;
  status: string;
  client_tag?: string | null;
  created_at: string;
  note?: string | null;
  is_highlighted?: boolean;
  [k: string]: any;
};

type Props = {
  task: Task;
  onToggleComplete: () => void;
  onStart: () => void;
  onOpen: () => void;
  onDelete: () => void;
  onToggleHighlight?: () => void;
  onUpdateNote?: (note: string) => void;
};

export function TaskRow({
  task,
  onToggleComplete,
  onStart,
  onOpen,
  onDelete,
  onToggleHighlight,
  onUpdateNote,
}: Props) {
  const controls = useDragControls();
  const [editingNote, setEditingNote] = useState(false);
  const [noteDraft, setNoteDraft] = useState(task.note ?? "");
  const noteInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setNoteDraft(task.note ?? "");
  }, [task.note]);

  useEffect(() => {
    if (editingNote) noteInputRef.current?.focus();
  }, [editingNote]);

  const commitNote = () => {
    setEditingNote(false);
    const trimmed = noteDraft.trim();
    if ((task.note ?? "") !== trimmed) onUpdateNote?.(trimmed);
  };

  const isHighlighted = !!task.is_highlighted;

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
      className={`relative border-b border-white/5 last:border-0 p-5 transition-colors flex flex-col gap-3 group/task bg-[#111111] select-none ${
        task.status === "completed" ? "opacity-60" : ""
      } ${
        isHighlighted
          ? "bg-gradient-to-r from-amber-500/[0.06] via-amber-500/[0.02] to-transparent hover:from-amber-500/[0.09]"
          : "hover:bg-white/[0.02]"
      }`}
    >
      {isHighlighted && (
        <span className="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-amber-400 via-amber-500 to-orange-400 rounded-r-sm pointer-events-none" />
      )}
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

        {onToggleHighlight && (
          <button
            onClick={onToggleHighlight}
            title={isHighlighted ? "Remove highlight" : "Highlight as important"}
            aria-label={isHighlighted ? "Remove highlight" : "Highlight as important"}
            className={`shrink-0 p-1.5 rounded-md transition-colors ${
              isHighlighted
                ? "text-amber-400 hover:text-amber-300 hover:bg-amber-500/10"
                : "text-zinc-700 hover:text-amber-400 hover:bg-white/[0.04] opacity-0 group-hover/task:opacity-100"
            }`}
          >
            <Star className={`w-4 h-4 ${isHighlighted ? "fill-amber-400" : ""}`} />
          </button>
        )}

        <div className="flex-1 min-w-0 grid grid-cols-1 sm:grid-cols-[1fr_minmax(140px,260px)] gap-x-4 gap-y-1 items-start">
          <div className="min-w-0">
            <div className="flex items-start justify-between gap-3 mb-0.5">
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
            <p className="text-xs text-zinc-500">
              Added{" "}
              {new Date(task.created_at).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          </div>

          {/* Note column */}
          {onUpdateNote && (
            <div className="min-w-0 sm:border-l sm:border-white/5 sm:pl-4 sm:py-0.5">
              {editingNote ? (
                <input
                  ref={noteInputRef}
                  value={noteDraft}
                  onChange={(e) => setNoteDraft(e.target.value)}
                  onBlur={commitNote}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") commitNote();
                    else if (e.key === "Escape") {
                      setNoteDraft(task.note ?? "");
                      setEditingNote(false);
                    }
                  }}
                  placeholder="Note (e.g. blocked by design, due Fri)"
                  maxLength={200}
                  className="w-full bg-black/40 border border-white/10 rounded-md px-2.5 py-1.5 text-xs text-zinc-200 focus:outline-none focus:border-amber-400/40 placeholder:text-zinc-600"
                />
              ) : task.note ? (
                <button
                  onClick={() => setEditingNote(true)}
                  className="w-full flex items-start gap-1.5 text-left text-xs text-zinc-400 hover:text-zinc-200 italic leading-snug rounded-md px-2.5 py-1.5 hover:bg-white/[0.04] transition-colors group/note border border-transparent hover:border-white/10"
                  title="Click to edit note"
                >
                  <StickyNote className="w-3 h-3 mt-0.5 text-amber-400/70 shrink-0" />
                  <span className="break-words">{task.note}</span>
                </button>
              ) : (
                <button
                  onClick={() => setEditingNote(true)}
                  className="opacity-0 group-hover/task:opacity-100 text-[11px] text-zinc-600 hover:text-amber-400 px-2.5 py-1.5 rounded-md hover:bg-white/[0.04] transition-all w-full text-left flex items-center gap-1"
                  title="Add a note"
                >
                  <StickyNote className="w-3 h-3" />
                  Add note…
                </button>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
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
