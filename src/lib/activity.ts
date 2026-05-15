import { supabase } from "@/lib/supabase";

export type ActivityTargetType =
  | "ticket"
  | "task"
  | "board"
  | "file"
  | "user"
  | "comment"
  | "system";

export type ActivityAction =
  | "ticket.create"
  | "ticket.status"
  | "ticket.delete"
  | "ticket.comment"
  | "task.create"
  | "task.status"
  | "task.delete"
  | "task.comment"
  | "task.reorder"
  | "board.create"
  | "board.delete"
  | "board.member.add"
  | "board.member.remove"
  | "file.upload"
  | "file.delete"
  | "file.visibility"
  | "file.request.create"
  | "user.create"
  | "user.role"
  | "user.company"
  | "auth.password";

export type ActivityEvent = {
  action: ActivityAction;
  target_type?: ActivityTargetType;
  target_id?: string | null;
  target_label?: string | null;
  metadata?: Record<string, unknown>;
};

let warned = false;

export async function logActivity(event: ActivityEvent): Promise<void> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase.from("activity_log").insert({
      actor_id: user.id,
      actor_email: user.email,
      action: event.action,
      target_type: event.target_type ?? null,
      target_id: event.target_id ?? null,
      target_label: event.target_label ?? null,
      metadata: event.metadata ?? {},
    });

    if (error && !warned) {
      console.warn(
        "[activity] insert failed — did you run master_activity_log.sql?",
        error.message
      );
      warned = true;
    }
  } catch (e) {
    // Audit logging must never break the main flow.
    if (!warned) {
      console.warn("[activity] unexpected error", e);
      warned = true;
    }
  }
}

const ACTION_LABELS: Record<ActivityAction, string> = {
  "ticket.create": "opened ticket",
  "ticket.status": "changed ticket status",
  "ticket.delete": "deleted ticket",
  "ticket.comment": "commented on ticket",
  "task.create": "added task",
  "task.status": "changed task status",
  "task.delete": "deleted task",
  "task.comment": "commented on task",
  "task.reorder": "reordered tasks",
  "board.create": "created board",
  "board.delete": "deleted board",
  "board.member.add": "added board member",
  "board.member.remove": "removed board member",
  "file.upload": "uploaded file",
  "file.delete": "deleted file",
  "file.visibility": "changed file visibility",
  "file.request.create": "sent file request",
  "user.create": "created user",
  "user.role": "changed user role",
  "user.company": "changed user company",
  "auth.password": "updated password",
};

export function describeAction(action: string): string {
  return ACTION_LABELS[action as ActivityAction] ?? action;
}

const ICON_CLASS_BY_TARGET: Record<ActivityTargetType, string> = {
  ticket: "text-purple-400 bg-purple-500/10 border-purple-500/20",
  task: "text-blue-400 bg-blue-500/10 border-blue-500/20",
  board: "text-[#F0564A] bg-[#F0564A]/10 border-[#F0564A]/20",
  file: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  user: "text-amber-400 bg-amber-500/10 border-amber-500/20",
  comment: "text-zinc-400 bg-white/5 border-white/10",
  system: "text-zinc-500 bg-white/5 border-white/5",
};

export function targetAccent(target?: string | null): string {
  if (!target || !(target in ICON_CLASS_BY_TARGET)) {
    return ICON_CLASS_BY_TARGET.system;
  }
  return ICON_CLASS_BY_TARGET[target as ActivityTargetType];
}
