"use client";

import { motion } from "framer-motion";
import {
  AlertCircle,
  Clock,
  CheckCircle2,
  Ticket,
  CheckSquare,
  Activity as ActivityIcon,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { UserAvatar } from "@/components/ui/user-avatar";
import { describeAction, targetAccent } from "@/lib/activity";

type Props = {
  userEmail?: string | null;
  tickets: any[];
  tasks: any[];
  activity: any[];
  activityTableMissing: boolean;
  onGoToTickets: () => void;
  onGoToTasks: () => void;
  onGoToActivity: () => void;
  onOpenTicket: (ticket: any) => void;
  onOpenTask: (task: any) => void;
};

function startOfTodayMs() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

export function TodayDashboard({
  userEmail,
  tickets,
  tasks,
  activity,
  activityTableMissing,
  onGoToTickets,
  onGoToTasks,
  onGoToActivity,
  onOpenTicket,
  onOpenTask,
}: Props) {
  const todayMs = startOfTodayMs();

  const openTickets = tickets.filter((t) => t.status !== "completed");
  const urgentTickets = openTickets.filter((t) => t.priority === "Urgent");
  const pendingTasks = tasks.filter((t) => t.status === "pending");
  const inProgressTasks = tasks.filter((t) => t.status === "in_progress");
  const ticketsToday = tickets.filter((t) => new Date(t.created_at).getTime() >= todayMs).length;
  const tasksCompletedToday = tasks.filter(
    (t) => t.status === "completed" && new Date(t.created_at).getTime() >= todayMs
  ).length;
  const recentActivity = activity.slice(0, 8);

  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 5) return "Burning the midnight oil";
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    if (h < 21) return "Good evening";
    return "Good night";
  })();

  const name = userEmail?.split("@")[0] || "Admin";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      {/* Hero */}
      <div className="relative overflow-hidden rounded-2xl border border-white/5 bg-gradient-to-br from-[#141414] via-[#0F0F0F] to-[#0A0A0A] p-8">
        <div className="absolute -top-32 -right-32 w-80 h-80 rounded-full bg-[#F0564A]/15 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-[#5BCBD7]/10 blur-3xl pointer-events-none" />
        <div className="relative flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-[10.5px] uppercase tracking-[0.18em] text-zinc-500 font-bold mb-2">
              <Sparkles className="w-3 h-3 text-[#F0564A]" />
              {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
            </div>
            <h1 className="text-3xl sm:text-4xl font-semibold text-white tracking-tight">
              {greeting}, <span className="text-[#F0564A]">{name}</span>.
            </h1>
            <p className="text-sm text-zinc-400 mt-2">
              {urgentTickets.length > 0
                ? `${urgentTickets.length} urgent ${urgentTickets.length === 1 ? "item needs" : "items need"} your attention.`
                : openTickets.length > 0
                ? `${openTickets.length} open ${openTickets.length === 1 ? "ticket" : "tickets"} in the queue.`
                : "Inbox zero. Nice."}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 shrink-0">
            <MiniStat label="Opened today" value={ticketsToday} />
            <MiniStat label="Resolved today" value={tasksCompletedToday} accent="text-emerald-400" />
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          Icon={AlertCircle}
          label="Urgent"
          value={urgentTickets.length}
          accent="text-red-400"
          bg="bg-red-500/5"
          ring="ring-red-500/20"
          onClick={onGoToTickets}
        />
        <KpiCard
          Icon={Ticket}
          label="Open Tickets"
          value={openTickets.length}
          accent="text-purple-400"
          bg="bg-purple-500/5"
          ring="ring-purple-500/20"
          onClick={onGoToTickets}
        />
        <KpiCard
          Icon={Clock}
          label="In Progress"
          value={inProgressTasks.length}
          accent="text-blue-400"
          bg="bg-blue-500/5"
          ring="ring-blue-500/20"
          onClick={onGoToTasks}
        />
        <KpiCard
          Icon={CheckSquare}
          label="Pending Tasks"
          value={pendingTasks.length}
          accent="text-amber-400"
          bg="bg-amber-500/5"
          ring="ring-amber-500/20"
          onClick={onGoToTasks}
        />
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Priorities */}
        <div className="lg:col-span-3 rounded-2xl border border-white/5 bg-[#0E0E0E] overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
            <h3 className="text-sm font-semibold text-white">Today's Priorities</h3>
            <button
              onClick={onGoToTickets}
              className="text-[11px] text-zinc-500 hover:text-white flex items-center gap-1 transition-colors"
            >
              View all <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          {urgentTickets.length === 0 && inProgressTasks.length === 0 ? (
            <div className="px-5 py-10 text-center text-sm text-zinc-500">
              No urgent items. You're flying clean.
            </div>
          ) : (
            <ul className="divide-y divide-white/5">
              {urgentTickets.slice(0, 4).map((t) => (
                <li
                  key={`pt-${t.id}`}
                  onClick={() => onOpenTicket(t)}
                  className="px-5 py-3.5 flex items-center gap-3 hover:bg-white/[0.02] cursor-pointer transition-colors"
                >
                  <span className="w-1 h-8 bg-red-500 rounded-full shrink-0" />
                  <span className="text-[9.5px] uppercase tracking-wider font-bold bg-red-500/10 text-red-400 border border-red-500/20 px-1.5 py-0.5 rounded">
                    Urgent
                  </span>
                  <span className="flex-1 text-sm text-white truncate">{t.subject || t.title}</span>
                  <span className="text-[10.5px] text-zinc-500 font-mono">#{t.id.substring(0, 6)}</span>
                </li>
              ))}
              {inProgressTasks.slice(0, 4).map((t) => (
                <li
                  key={`pip-${t.id}`}
                  onClick={() => onOpenTask(t)}
                  className="px-5 py-3.5 flex items-center gap-3 hover:bg-white/[0.02] cursor-pointer transition-colors"
                >
                  <span className="w-1 h-8 bg-blue-400 rounded-full shrink-0" />
                  <span className="text-[9.5px] uppercase tracking-wider font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20 px-1.5 py-0.5 rounded">
                    In Progress
                  </span>
                  <span className="flex-1 text-sm text-white truncate">{t.title}</span>
                  {t.client_tag && (
                    <span className="text-[10.5px] text-zinc-400 bg-white/5 border border-white/10 rounded px-1.5 py-0.5">
                      {t.client_tag}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Recent activity */}
        <div className="lg:col-span-2 rounded-2xl border border-white/5 bg-[#0E0E0E] overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <ActivityIcon className="w-3.5 h-3.5 text-emerald-400" />
              Recent activity
            </h3>
            <button
              onClick={onGoToActivity}
              className="text-[11px] text-zinc-500 hover:text-white flex items-center gap-1 transition-colors"
            >
              Full feed <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          {activityTableMissing ? (
            <div className="px-5 py-10 text-center text-xs text-zinc-500">
              Run <code className="text-[#F0564A]">master_activity_log.sql</code> to enable the audit feed.
            </div>
          ) : recentActivity.length === 0 ? (
            <div className="px-5 py-10 text-center text-sm text-zinc-500">No activity yet.</div>
          ) : (
            <ul className="divide-y divide-white/5">
              {recentActivity.map((ev) => {
                const verb = describeAction(ev.action);
                const accent = targetAccent(ev.target_type);
                return (
                  <li key={ev.id} className="px-5 py-3 flex items-center gap-3">
                    <UserAvatar email={ev.actor_email} size="xs" ringClassName="ring-white/10" />
                    <div className="flex-1 min-w-0">
                      <p className="text-[12.5px] text-zinc-300 truncate">
                        <span className="font-semibold text-white">
                          {ev.actor_email?.split("@")[0] || "Unknown"}
                        </span>{" "}
                        <span className="text-zinc-500">{verb}</span>{" "}
                        {ev.target_label && (
                          <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold border ${accent}`}>
                            {ev.target_label.length > 28 ? ev.target_label.slice(0, 28) + "…" : ev.target_label}
                          </span>
                        )}
                      </p>
                      <p className="text-[10px] text-zinc-600 mt-0.5">
                        {timeAgo(ev.created_at)}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function MiniStat({ label, value, accent = "text-white" }: { label: string; value: number; accent?: string }) {
  return (
    <div className="rounded-xl bg-black/40 border border-white/5 backdrop-blur px-4 py-3 text-center min-w-[88px]">
      <div className={`text-2xl font-semibold tracking-tight ${accent}`}>{value}</div>
      <div className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold mt-0.5">{label}</div>
    </div>
  );
}

function KpiCard({
  Icon,
  label,
  value,
  accent,
  bg,
  ring,
  onClick,
}: {
  Icon: typeof CheckCircle2;
  label: string;
  value: number;
  accent: string;
  bg: string;
  ring: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`group relative overflow-hidden rounded-2xl border border-white/5 bg-[#111111] px-5 py-5 text-left ring-1 ${ring} hover:border-white/10 transition-colors`}
    >
      <div className={`absolute top-0 right-0 w-24 h-24 rounded-bl-full pointer-events-none ${bg}`} />
      <div className="relative">
        <p className="text-xs text-zinc-400 font-medium flex items-center gap-2">
          <Icon className={`w-3.5 h-3.5 ${accent}`} />
          {label}
        </p>
        <p className="text-3xl font-semibold text-white tracking-tight mt-1.5">{value}</p>
      </div>
    </button>
  );
}

function timeAgo(iso: string): string {
  const t = new Date(iso).getTime();
  const diff = Date.now() - t;
  const sec = Math.floor(diff / 1000);
  if (sec < 60) return `${sec}s ago`;
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const day = Math.floor(hr / 24);
  if (day < 7) return `${day}d ago`;
  return new Date(iso).toLocaleDateString();
}
