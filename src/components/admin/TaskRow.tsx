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
  Pencil,
  Check,
  X,
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
  onUpdateTitle?: (title: string) => void;
};

function IconButton({
  Icon,
  onClick,
  title,
  variant = "neutral",
}: {
  Icon: typeof Trash2;
  onClick: () => void;
  title: string;
  variant?: "neutral" | "blue" | "red";
}) {
  const styles =
    variant === "blue"
      ? "text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
      : variant === "red"
      ? "text-zinc-500 hover:text-red-400 hover:bg-red-500/10"
      : "text-zinc-400 hover:text-white hover:bg-white/5";
  return (
    <button
      onClick={onClick}
      title={title}
      aria-label={title}
      className={`shrink-0 inline-flex items-center justify-center w-8 h-8 rounded-md transition-colors ${styles}`}
    >
      <Icon className="w-3.5 h-3.5" />
    </button>
  );
}

export function TaskRow({
  task,
  onToggleComplete,
  onStart,
  onOpen,
  onDelete,
  onToggleHighlight,
  onUpdateNote,
  onUpdateTitle,
}: Props) {
  const controls = useDragControls();
  const [editingNote, setEditingNote] = useState(false);
  const [noteDraft, setNoteDraft] = useState(task.note ?? "");
  const noteInputRef = useRef<HTMLInputElement>(null);
  const [editingTitle, setEditingTitle] = useState(false);
  const [titleDraft, setTitleDraft] = useState(task.title);
  const titleInputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setNoteDraft(task.note ?? "");
  }, [task.note]);

  useEffect(() => {
    setTitleDraft(task.title);
  }, [task.title]);

  useEffect(() => {
    if (editingNote) noteInputRef.current?.focus();
  }, [editingNote]);

  useEffect(() => {
    if (editingTitle) {
      const el = titleInputRef.current;
      if (el) {
        el.focus();
        el.setSelectionRange(el.value.length, el.value.length);
      }
    }
  }, [editingTitle]);

  const commitNote = () => {
    setEditingNote(false);
    const trimmed = noteDraft.trim();
    if ((task.note ?? "") !== trimmed) onUpdateNote?.(trimmed);
  };

  const commitTitle = () => {
    const trimmed = titleDraft.trim();
    if (!trimmed) {
      setTitleDraft(task.title);
      setEditingTitle(false);
      return;
    }
    setEditingTitle(false);
    if (trimmed !== task.title) onUpdateTitle?.(trimmed);
  };

  const cancelTitle = () => {
    setTitleDraft(task.title);
    setEditingTitle(false);
  };

  const isHighlighted = !!task.is_highlighted;
  const isCompleted = task.status === "completed";
  const isInProgress = task.status === "in_progress";

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
      className={`relative border-b border-white/5 last:border-0 px-5 py-4 transition-colors flex items-center gap-3 group/task bg-[#111111] select-none ${
        isCompleted ? "opacity-60" : ""
      } ${
        isHighlighted
          ? "bg-gradient-to-r from-amber-500/[0.06] via-amber-500/[0.02] to-transparent hover:from-amber-500/[0.09]"
          : "hover:bg-white/[0.02]"
      }`}
    >
      {isHighlighted && (
        <span className="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-amber-400 via-amber-500 to-orange-400 rounded-r-sm pointer-events-none" />
      )}

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
        title={isCompleted ? "Mark as pending" : "Mark complete"}
        className={`w-6 h-6 rounded-md border flex items-center justify-center shrink-0 transition-colors ${
          isCompleted
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

      <div className="flex-1 min-w-0 grid grid-cols-1 sm:grid-cols-[1fr_minmax(140px,240px)] gap-x-4 gap-y-1 items-center">
        {/* Title block */}
        <div className="min-w-0 flex items-center gap-3">
          {editingTitle ? (
            <div className="flex-1 flex items-start gap-1.5">
              <textarea
                ref={titleInputRef}
                value={titleDraft}
                onChange={(e) => setTitleDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    commitTitle();
                  } else if (e.key === "Escape") {
                    cancelTitle();
                  }
                }}
                rows={Math.min(4, Math.max(1, (titleDraft.match(/\n/g)?.length ?? 0) + 1))}
                className="flex-1 bg-black/40 border border-white/10 rounded-md px-2.5 py-1.5 text-base text-zinc-100 focus:outline-none focus:border-[#F0564A]/50 resize-none leading-snug"
              />
              <button
                onClick={commitTitle}
                title="Save (Enter)"
                aria-label="Save"
                className="shrink-0 inline-flex items-center justify-center w-7 h-7 rounded-md text-emerald-400 hover:bg-emerald-500/10 transition-colors mt-1"
              >
                <Check className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={cancelTitle}
                title="Cancel (Esc)"
                aria-label="Cancel"
                className="shrink-0 inline-flex items-center justify-center w-7 h-7 rounded-md text-zinc-500 hover:text-white hover:bg-white/5 transition-colors mt-1"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <>
              <button
                onClick={() => onUpdateTitle && setEditingTitle(true)}
                className={`flex-1 min-w-0 text-left text-base font-medium break-words whitespace-pre-wrap leading-snug ${
                  isCompleted ? "text-zinc-500 line-through" : "text-zinc-100"
                } ${onUpdateTitle ? "hover:text-white cursor-text" : "cursor-default"} rounded -mx-1 px-1 hover:bg-white/[0.03] transition-colors`}
                title={onUpdateTitle ? "Click to edit" : undefined}
              >
                {task.title}
              </button>
              {task.client_tag && (
                <span className="inline-flex shrink-0 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-white/10 text-zinc-300 border border-white/10 whitespace-nowrap">
                  {task.client_tag}
                </span>
              )}
            </>
          )}
        </div>

        {/* Note column */}
        {onUpdateNote && (
          <div className="min-w-0 sm:border-l sm:border-white/5 sm:pl-4">
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
                className="w-full flex items-start gap-1.5 text-left text-xs text-zinc-400 hover:text-zinc-200 italic leading-snug rounded-md px-2.5 py-1.5 hover:bg-white/[0.04] transition-colors border border-transparent hover:border-white/10"
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

      {/* Compact action column — icon-only buttons */}
      <div className="flex items-center gap-0.5 shrink-0">
        {!isCompleted && !isInProgress && (
          <IconButton Icon={Clock} onClick={onStart} title="Start" variant="blue" />
        )}
        {isInProgress && (
          <span className="inline-flex h-8 px-2 items-center justify-center rounded-md text-[9.5px] font-bold uppercase border bg-blue-500/10 text-blue-400 border-blue-500/20">
            In Progress
          </span>
        )}
        {onUpdateTitle && !editingTitle && (
          <IconButton
            Icon={Pencil}
            onClick={() => setEditingTitle(true)}
            title="Edit title"
          />
        )}
        <IconButton Icon={MessageSquare} onClick={onOpen} title="Open chat" />
        <IconButton Icon={Trash2} onClick={onDelete} title="Delete" variant="red" />
      </div>
    </Reorder.Item>
  );
}
