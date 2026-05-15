"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Ticket,
  CheckSquare,
  FolderOpen,
  Activity as ActivityIcon,
  Mail,
  Calendar,
  Building2,
  ShieldAlert,
  Eye,
  ExternalLink,
} from "lucide-react";
import { UserAvatar } from "@/components/ui/user-avatar";
import { describeAction, targetAccent } from "@/lib/activity";
import { supabase } from "@/lib/supabase";

type ClientUser = {
  id: string;
  email: string;
  role?: string;
  company?: string;
  created_at?: string;
  last_sign_in_at?: string;
};

type Props = {
  user: ClientUser | null;
  tickets: any[];          // all tickets in admin context
  tasks: any[];            // all tasks in admin context
  files: any[];            // all vault files in admin context
  onClose: () => void;
  onOpenTicket: (t: any) => void;
  onOpenTask: (t: any) => void;
  onImpersonate: (id: string) => void;
};

type DrawerTab = "tickets" | "tasks" | "files" | "activity";

const TABS: { key: DrawerTab; label: string; Icon: typeof Ticket }[] = [
  { key: "tickets", label: "Tickets", Icon: Ticket },
  { key: "tasks", label: "Tasks", Icon: CheckSquare },
  { key: "files", label: "Files", Icon: FolderOpen },
  { key: "activity", label: "Activity", Icon: ActivityIcon },
];

export function ClientDrawer({
  user,
  tickets,
  tasks,
  files,
  onClose,
  onOpenTicket,
  onOpenTask,
  onImpersonate,
}: Props) {
  const [tab, setTab] = useState<DrawerTab>("tickets");
  const [activity, setActivity] = useState<any[]>([]);
  const [activityLoading, setActivityLoading] = useState(false);
  const [activityMissing, setActivityMissing] = useState(false);

  const userTickets = useMemo(
    () => (user ? tickets.filter((t) => t.client_id === user.id) : []),
    [tickets, user]
  );

  const userTasks = useMemo(() => {
    if (!user) return [] as any[];
    const tag = user.company?.trim();
    const local = user.email.split("@")[0];
    return tasks.filter(
      (t) =>
        t.created_by === user.id ||
        (tag && t.client_tag && t.client_tag.toLowerCase() === tag.toLowerCase()) ||
        (t.client_tag && t.client_tag.toLowerCase() === local.toLowerCase())
    );
  }, [tasks, user]);

  const userFiles = useMemo(
    () => (user ? files.filter((f) => f.client_id === user.id) : []),
    [files, user]
  );

  useEffect(() => {
    if (!user || tab !== "activity") return;
    let cancelled = false;
    setActivityLoading(true);
    supabase
      .from("activity_log")
      .select("*")
      .or(`actor_id.eq.${user.id},target_id.eq.${user.id}`)
      .order("created_at", { ascending: false })
      .limit(80)
      .then(({ data, error }) => {
        if (cancelled) return;
        setActivityLoading(false);
        if (error) {
          if (error.code === "42P01") setActivityMissing(true);
          return;
        }
        setActivityMissing(false);
        setActivity(data ?? []);
      });
    return () => {
      cancelled = true;
    };
  }, [user, tab]);

  return (
    <AnimatePresence>
      {user && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[140]"
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 360, damping: 38 }}
            className="fixed top-0 right-0 bottom-0 z-[141] w-full sm:w-[480px] lg:w-[560px] bg-[#0E0E0E] border-l border-white/10 flex flex-col"
          >
            {/* Header */}
            <div className="relative p-6 border-b border-white/5 bg-gradient-to-br from-[#161616] to-[#0E0E0E]">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-1.5 rounded-md text-zinc-500 hover:text-white hover:bg-white/5"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="flex items-center gap-4">
                <UserAvatar email={user.email} size="lg" ringClassName="ring-white/15" />
                <div className="min-w-0 flex-1">
                  <h2 className="text-xl font-semibold text-white truncate">{user.email}</h2>
                  <div className="flex items-center gap-2 flex-wrap mt-1.5">
                    <RoleBadge role={user.role} />
                    {user.company && (
                      <span className="inline-flex items-center gap-1 text-[10.5px] uppercase tracking-wider font-bold text-zinc-400 bg-white/5 border border-white/10 rounded px-1.5 py-0.5">
                        <Building2 className="w-3 h-3" />
                        {user.company}
                      </span>
                    )}
                    {user.created_at && (
                      <span className="inline-flex items-center gap-1 text-[10.5px] text-zinc-500">
                        <Calendar className="w-3 h-3" />
                        Joined {new Date(user.created_at).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 mt-5">
                <a
                  href={`mailto:${user.email}`}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium bg-white/[0.04] border border-white/10 text-zinc-300 hover:text-white hover:bg-white/[0.08] transition-colors"
                >
                  <Mail className="w-3.5 h-3.5" /> Email
                </a>
                {user.role === "client" && (
                  <button
                    onClick={() => onImpersonate(user.id)}
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium bg-blue-500/10 border border-blue-500/20 text-blue-400 hover:bg-blue-500/20 transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" /> View as client
                  </button>
                )}
              </div>

              {/* Stat strip */}
              <div className="grid grid-cols-4 gap-2 mt-5">
                <Stat label="Tickets" value={userTickets.length} />
                <Stat label="Tasks" value={userTasks.length} />
                <Stat label="Files" value={userFiles.length} />
                <Stat label="Open" value={userTickets.filter((t) => t.status !== "completed").length} accent="text-amber-400" />
              </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-white/5 bg-[#0A0A0A]">
              {TABS.map(({ key, label, Icon }) => (
                <button
                  key={key}
                  onClick={() => setTab(key)}
                  className={`flex-1 px-4 py-2.5 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors border-b-2 ${
                    tab === key
                      ? "text-white border-[#F0564A]"
                      : "text-zinc-500 hover:text-zinc-300 border-transparent"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {label}
                </button>
              ))}
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {tab === "tickets" &&
                (userTickets.length === 0 ? (
                  <EmptyBody label="No tickets from this client yet." />
                ) : (
                  userTickets.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => onOpenTicket(t)}
                      className="w-full text-left p-3 rounded-lg border border-white/5 bg-[#141414] hover:bg-white/[0.03] hover:border-white/10 transition-colors group"
                    >
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <StatusPill status={t.status} />
                        {t.priority === "Urgent" && (
                          <span className="bg-red-500/10 text-red-400 border border-red-500/20 text-[9px] uppercase font-bold px-1.5 py-0.5 rounded">
                            Urgent
                          </span>
                        )}
                        <span className="text-[10.5px] text-zinc-500 font-mono">#{t.id.substring(0, 6)}</span>
                        <span className="text-[10.5px] text-zinc-500 ml-auto">
                          {new Date(t.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-white truncate">{t.subject || t.title}</p>
                      {t.description && (
                        <p className="text-[11.5px] text-zinc-500 mt-1 line-clamp-2">{t.description}</p>
                      )}
                    </button>
                  ))
                ))}

              {tab === "tasks" &&
                (userTasks.length === 0 ? (
                  <EmptyBody label="No tasks linked to this client." />
                ) : (
                  userTasks.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => onOpenTask(t)}
                      className="w-full text-left p-3 rounded-lg border border-white/5 bg-[#141414] hover:bg-white/[0.03] hover:border-white/10 transition-colors"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <StatusPill status={t.status} />
                        <span className="text-[10.5px] text-zinc-500 ml-auto">
                          {new Date(t.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-white">{t.title}</p>
                    </button>
                  ))
                ))}

              {tab === "files" &&
                (userFiles.length === 0 ? (
                  <EmptyBody label="No files for this client." />
                ) : (
                  userFiles.map((f) => (
                    <div
                      key={f.id}
                      className="flex items-center justify-between p-3 rounded-lg border border-white/5 bg-[#141414]"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="text-sm text-white truncate">{f.filename || f.name || "Untitled"}</p>
                        <p className="text-[10.5px] text-zinc-500 mt-0.5">
                          {f.folder || "root"} ·{" "}
                          {new Date(f.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <span className="text-[10.5px] text-zinc-500 shrink-0 ml-3">
                        {f.size ? formatBytes(f.size) : "—"}
                      </span>
                    </div>
                  ))
                ))}

              {tab === "activity" && (
                activityMissing ? (
                  <EmptyBody label="Run master_activity_log.sql to enable per-client activity." />
                ) : activityLoading && activity.length === 0 ? (
                  <EmptyBody label="Loading activity…" />
                ) : activity.length === 0 ? (
                  <EmptyBody label="No activity recorded yet for this client." />
                ) : (
                  activity.map((ev) => {
                    const verb = describeAction(ev.action);
                    const accent = targetAccent(ev.target_type);
                    return (
                      <div
                        key={ev.id}
                        className="flex items-start gap-3 p-3 rounded-lg border border-white/5 bg-[#141414]"
                      >
                        <UserAvatar email={ev.actor_email} size="xs" ringClassName="ring-white/10" />
                        <div className="flex-1 min-w-0">
                          <p className="text-[12.5px] text-zinc-300 leading-snug">
                            <span className="font-semibold text-white">
                              {ev.actor_email?.split("@")[0] || "Unknown"}
                            </span>{" "}
                            <span className="text-zinc-500">{verb}</span>{" "}
                            {ev.target_label && (
                              <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold border ${accent}`}>
                                {ev.target_label.length > 32 ? ev.target_label.slice(0, 32) + "…" : ev.target_label}
                              </span>
                            )}
                          </p>
                          <p className="text-[10px] text-zinc-600 mt-0.5">
                            {new Date(ev.created_at).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    );
                  })
                )
              )}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

function Stat({ label, value, accent = "text-white" }: { label: string; value: number; accent?: string }) {
  return (
    <div className="rounded-lg bg-black/30 border border-white/5 px-3 py-2 text-center">
      <div className={`text-lg font-semibold tracking-tight ${accent}`}>{value}</div>
      <div className="text-[9px] uppercase tracking-wider text-zinc-500 font-bold mt-0.5">{label}</div>
    </div>
  );
}

function EmptyBody({ label }: { label: string }) {
  return <div className="text-center text-xs text-zinc-500 py-10">{label}</div>;
}

function RoleBadge({ role }: { role?: string }) {
  const r = role || "client";
  const styles =
    r === "superadmin"
      ? "bg-purple-500/10 text-purple-400 border-purple-500/20"
      : r === "admin"
      ? "bg-[#F0564A]/10 text-[#F0564A] border-[#F0564A]/20"
      : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
  const label = r === "superadmin" ? "Master Admin" : r;
  return (
    <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${styles}`}>
      {r === "superadmin" && <ShieldAlert className="w-3 h-3" />}
      {label}
    </span>
  );
}

function StatusPill({ status }: { status: string }) {
  const styles: Record<string, string> = {
    pending: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    in_progress: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    review: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    completed: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  };
  return (
    <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${styles[status] ?? "bg-white/5 text-zinc-400 border-white/10"}`}>
      {status.replace("_", " ")}
    </span>
  );
}

function formatBytes(n: number) {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  if (n < 1024 * 1024 * 1024) return `${(n / 1024 / 1024).toFixed(1)} MB`;
  return `${(n / 1024 / 1024 / 1024).toFixed(2)} GB`;
}
