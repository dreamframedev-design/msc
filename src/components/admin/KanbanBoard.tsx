"use client";

import { useRef, useState, type RefObject } from "react";
import { motion, AnimatePresence, type PanInfo } from "framer-motion";
import { CheckCircle2, Clock, MessageSquare, Trash2, AlertCircle, GripHorizontal } from "lucide-react";

type Task = {
  id: string;
  title: string;
  status: string;
  client_tag?: string | null;
  created_at: string;
  [k: string]: any;
};

type ColumnKey = "pending" | "in_progress" | "completed";

const COLUMNS: { key: ColumnKey; label: string; accent: string; bg: string; icon: typeof AlertCircle }[] = [
  { key: "pending", label: "Pending", accent: "text-amber-400", bg: "bg-amber-500/5 border-amber-500/20", icon: AlertCircle },
  { key: "in_progress", label: "In Progress", accent: "text-blue-400", bg: "bg-blue-500/5 border-blue-500/20", icon: Clock },
  { key: "completed", label: "Completed", accent: "text-emerald-400", bg: "bg-emerald-500/5 border-emerald-500/20", icon: CheckCircle2 },
];

type Props = {
  tasks: Task[];
  onChangeStatus: (taskId: string, newStatus: ColumnKey) => void;
  onOpenTask: (task: Task) => void;
  onDeleteTask: (id: string) => void;
};

export function KanbanBoard({ tasks, onChangeStatus, onOpenTask, onDeleteTask }: Props) {
  const columnRefs = useRef<Record<ColumnKey, HTMLDivElement | null>>({
    pending: null,
    in_progress: null,
    completed: null,
  });
  const [hoverColumn, setHoverColumn] = useState<ColumnKey | null>(null);
  const [draggingTaskId, setDraggingTaskId] = useState<string | null>(null);

  const grouped: Record<ColumnKey, Task[]> = {
    pending: [],
    in_progress: [],
    completed: [],
  };
  for (const t of tasks) {
    const key = (COLUMNS.find((c) => c.key === t.status)?.key) ?? "pending";
    grouped[key].push(t);
  }

  const detectColumn = (x: number, y: number): ColumnKey | null => {
    for (const col of COLUMNS) {
      const el = columnRefs.current[col.key];
      if (!el) continue;
      const r = el.getBoundingClientRect();
      if (x >= r.left && x <= r.right && y >= r.top && y <= r.bottom) return col.key;
    }
    return null;
  };

  const handleDragEnd = (task: Task, info: PanInfo) => {
    const dropped = detectColumn(info.point.x, info.point.y);
    setHoverColumn(null);
    setDraggingTaskId(null);
    if (dropped && dropped !== task.status) {
      onChangeStatus(task.id, dropped);
    }
  };

  const handleDrag = (info: PanInfo) => {
    const over = detectColumn(info.point.x, info.point.y);
    setHoverColumn(over);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {COLUMNS.map(({ key, label, accent, bg, icon: Icon }) => {
        const colTasks = grouped[key];
        const isHover = hoverColumn === key && draggingTaskId !== null;
        const showHoverState = isHover && colTasks.every((t) => t.id !== draggingTaskId);
        return (
          <div
            key={key}
            ref={(el) => { columnRefs.current[key] = el; }}
            className={`rounded-2xl border bg-[#0E0E0E] flex flex-col min-h-[360px] transition-colors ${
              showHoverState ? `${bg} border-dashed` : "border-white/5"
            }`}
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
              <div className="flex items-center gap-2">
                <Icon className={`w-3.5 h-3.5 ${accent}`} />
                <span className="text-[10.5px] font-bold uppercase tracking-wider text-zinc-300">{label}</span>
              </div>
              <span className="text-[10.5px] font-bold text-zinc-500 bg-white/5 border border-white/10 rounded-full px-2 py-0.5">
                {colTasks.length}
              </span>
            </div>

            <div className="flex-1 p-3 space-y-2 overflow-y-auto">
              <AnimatePresence initial={false}>
                {colTasks.map((task) => (
                  <KanbanCard
                    key={task.id}
                    task={task}
                    columnRefs={columnRefs}
                    onDragStart={() => setDraggingTaskId(task.id)}
                    onDrag={handleDrag}
                    onDragEnd={(info) => handleDragEnd(task, info)}
                    onOpen={() => onOpenTask(task)}
                    onDelete={() => onDeleteTask(task.id)}
                  />
                ))}
              </AnimatePresence>
              {colTasks.length === 0 && (
                <div className="flex flex-col items-center justify-center text-center py-12 text-zinc-600 text-xs">
                  <span className="opacity-50">No tasks</span>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function KanbanCard({
  task,
  columnRefs,
  onDragStart,
  onDrag,
  onDragEnd,
  onOpen,
  onDelete,
}: {
  task: Task;
  columnRefs: RefObject<Record<ColumnKey, HTMLDivElement | null>>;
  onDragStart: () => void;
  onDrag: (info: PanInfo) => void;
  onDragEnd: (info: PanInfo) => void;
  onOpen: () => void;
  onDelete: () => void;
}) {
  return (
    <motion.div
      layout="position"
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ type: "spring", stiffness: 500, damping: 36 }}
      drag
      dragSnapToOrigin
      dragElastic={0.18}
      dragMomentum={false}
      onDragStart={onDragStart}
      onDrag={(_e, info) => onDrag(info)}
      onDragEnd={(_e, info) => onDragEnd(info)}
      whileDrag={{
        scale: 1.03,
        boxShadow: "0 20px 50px -10px rgba(0,0,0,0.6)",
        zIndex: 50,
        cursor: "grabbing",
      }}
      className="group/card relative rounded-lg border border-white/5 bg-[#141414] p-3 hover:border-white/10 cursor-grab active:cursor-grabbing touch-none select-none"
    >
      <div className="flex items-start gap-2 mb-2">
        <GripHorizontal className="w-3.5 h-3.5 text-zinc-600 group-hover/card:text-zinc-400 transition-colors shrink-0 mt-0.5" />
        <p className="text-sm font-medium text-zinc-100 break-words whitespace-pre-wrap flex-1 min-w-0">
          {task.title}
        </p>
      </div>

      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 min-w-0">
          {task.client_tag && (
            <span className="inline-flex truncate max-w-[120px] px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-white/5 text-zinc-400 border border-white/10">
              {task.client_tag}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1 opacity-0 group-hover/card:opacity-100 transition-opacity">
          <button
            onClick={onOpen}
            className="p-1 rounded text-zinc-500 hover:text-white hover:bg-white/5"
            title="Open chat"
          >
            <MessageSquare className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onDelete}
            className="p-1 rounded text-zinc-500 hover:text-red-400 hover:bg-red-500/10"
            title="Delete"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <p className="text-[10px] text-zinc-600 mt-2">
        {new Date(task.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
      </p>
    </motion.div>
  );
}
