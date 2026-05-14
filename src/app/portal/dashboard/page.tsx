"use client";

import { useState, useEffect, useRef, useMemo, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import {
  LogOut,
  LayoutDashboard,
  Ticket,
  FolderOpen,
  Settings,
  Plus,
  FileText,
  Download,
  Loader2,
  Trash2,
  TrendingUp,
  Users,
  Activity,
  CreditCard,
  Bell,
  Search,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  CheckSquare,
  MessageSquare,
  Sun,
  Moon,
  ArrowLeft,
  UploadCloud,
  Sparkles,
  File,
  FileImage,
  FileVideo,
  FileSpreadsheet,
  Filter,
  X,
  ChevronRight,
  FolderPlus,
  Folder,
  Link2,
  Eye,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from 'framer-motion';
import { useToast } from "@/components/ui/toast";
import { useRegisterCommandsMemo, useCommandPalette } from "@/components/command/CommandPaletteContext";
import type { CommandItem } from "@/components/command/CommandPalette";
import { Command as CommandIcon } from "lucide-react";

// ============ MOCK DATA ============
const mockChartData = [
  { name: 'Jan', traffic: 4000, engagement: 2400 },
  { name: 'Feb', traffic: 3000, engagement: 1398 },
  { name: 'Mar', traffic: 5200, engagement: 4800 },
  { name: 'Apr', traffic: 4780, engagement: 3908 },
  { name: 'May', traffic: 6890, engagement: 5400 },
  { name: 'Jun', traffic: 8390, engagement: 6800 },
  { name: 'Jul', traffic: 9490, engagement: 7300 },
];

const mockSparkline = [3, 5, 4, 7, 6, 9, 8, 12, 10, 14, 13, 16];

const mockTickets = [
  { id: "T-1042", subject: "Update Leadership Team Page", status: "In Progress", priority: "Normal", date: "Today, 10:23 AM" },
  { id: "T-1041", subject: "Q3 Investor Deck Revisions", status: "Review", priority: "High", date: "Yesterday" },
  { id: "T-1038", subject: "New Press Release Distribution", status: "Completed", priority: "Urgent", date: "May 4, 2026" },
  { id: "T-1035", subject: "Fix broken link on Contact page", status: "Completed", priority: "Normal", date: "May 1, 2026" },
];

// ============ HELPERS ============
function AnimatedCounter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => Math.round(v).toLocaleString());

  useEffect(() => {
    const controls = animate(count, value, {
      duration: 1.6,
      ease: [0.16, 1, 0.3, 1],
    });
    return controls.stop;
  }, [value, count]);

  return (
    <span className="inline-flex items-baseline">
      <motion.span>{rounded}</motion.span>
      {suffix && <span className="opacity-60">{suffix}</span>}
    </span>
  );
}

function getFileIcon(filename: string) {
  const ext = filename.split('.').pop()?.toLowerCase() || '';
  if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'avif'].includes(ext)) {
    return { Icon: FileImage, color: 'text-[#5BCBD7]', bg: 'bg-[#5BCBD7]/10' };
  }
  if (['mp4', 'mov', 'avi', 'webm', 'mkv'].includes(ext)) {
    return { Icon: FileVideo, color: 'text-[#F08435]', bg: 'bg-[#F08435]/10' };
  }
  if (['xlsx', 'xls', 'csv', 'numbers'].includes(ext)) {
    return { Icon: FileSpreadsheet, color: 'text-emerald-500', bg: 'bg-emerald-500/10' };
  }
  if (['pdf', 'doc', 'docx', 'pptx', 'ppt', 'txt', 'md'].includes(ext)) {
    return { Icon: FileText, color: 'text-[#F0564A]', bg: 'bg-[#F0564A]/10' };
  }
  return { Icon: File, color: 'text-gray-400', bg: 'bg-gray-400/10' };
}

const KPI_ACCENTS = {
  spark: { ring: "rgba(240, 86, 74, 0.18)", glow: "rgba(240, 86, 74, 0.12)", text: "text-[#F0564A]", bg: "bg-[#F0564A]/10" },
  cyan: { ring: "rgba(91, 203, 215, 0.2)", glow: "rgba(91, 203, 215, 0.12)", text: "text-[#5BCBD7]", bg: "bg-[#5BCBD7]/10" },
  warm: { ring: "rgba(240, 132, 53, 0.2)", glow: "rgba(240, 132, 53, 0.12)", text: "text-[#F08435]", bg: "bg-[#F08435]/10" },
  emerald: { ring: "rgba(16, 185, 129, 0.2)", glow: "rgba(16, 185, 129, 0.12)", text: "text-emerald-400", bg: "bg-emerald-500/10" },
};

export default function PortalDashboard() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-[#F0564A]" /></div>}>
      <DashboardContent />
    </Suspense>
  );
}

function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const impersonateId = searchParams.get('impersonate');
  const toast = useToast();
  const palette = useCommandPalette();
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [isLoading, setIsLoading] = useState(true);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [recentUpload, setRecentUpload] = useState<string | null>(null);
  const [showNewTicket, setShowNewTicket] = useState(false);
  const [ticketFilter, setTicketFilter] = useState<"all" | "open" | "completed">("all");
  
  // Ticket State
  const [tickets, setTickets] = useState<any[]>([]);
  const [taskBoards, setTaskBoards] = useState<any[]>([]);
  const [internalTasks, setInternalTasks] = useState<any[]>([]);
  const [activeBoardId, setActiveBoardId] = useState<string>("");
  const [newTicketSubject, setNewTicketSubject] = useState("");
  const [newTicketPriority, setNewTicketPriority] = useState("Normal");
  const [newTicketPageUrl, setNewTicketPageUrl] = useState("");
  const [newTicketSection, setNewTicketSection] = useState("");
  const [newTicketDescription, setNewTicketDescription] = useState("");
  const [isSubmittingTicket, setIsSubmittingTicket] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [commentText, setCommentText] = useState("");
  const [ticketComments, setTicketComments] = useState<any[]>([]);
  const ticketChatScrollRef = useRef<HTMLDivElement>(null);

  // Task Chat State
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [taskCommentText, setTaskCommentText] = useState("");
  const [taskComments, setTaskComments] = useState<any[]>([]);
  const taskChatScrollRef = useRef<HTMLDivElement>(null);

  // Real-time subscriptions and scrolling
  useEffect(() => {
    if (ticketChatScrollRef.current) {
      ticketChatScrollRef.current.scrollTop = ticketChatScrollRef.current.scrollHeight;
    }
  }, [ticketComments]);

  useEffect(() => {
    if (taskChatScrollRef.current) {
      taskChatScrollRef.current.scrollTop = taskChatScrollRef.current.scrollHeight;
    }
  }, [taskComments]);

  useEffect(() => {
    if (!selectedTicket) return;
    const channel = supabase
      .channel(`client_ticket_comments_${selectedTicket.id}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'ticket_comments',
        filter: `ticket_id=eq.${selectedTicket.id}`
      }, payload => {
        setTicketComments(prev => {
          if (prev.find(c => c.id === payload.new.id)) return prev;
          return [...prev, payload.new];
        });
      })
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedTicket]);

  useEffect(() => {
    if (!selectedTask) return;
    const channel = supabase
      .channel(`client_task_comments_${selectedTask.id}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'task_comments',
        filter: `task_id=eq.${selectedTask.id}`
      }, payload => {
        setTaskComments(prev => {
          if (prev.find(c => c.id === payload.new.id)) return prev;
          return [...prev, payload.new];
        });
      })
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedTask]);

  // Storage State
  const [files, setFiles] = useState<any[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [currentFolder, setCurrentFolder] = useState<string>("root");
  const [showNewFolder, setShowNewFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [previewFile, setPreviewFile] = useState<any>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/portal");
      } else {
        setUser(session.user);
      }
      setIsLoading(false);
    };
    checkUser();
  }, [router]);

  useEffect(() => {
    if (user && activeTab === "files") {
      fetchFiles();
    }
    if (user && activeTab === "tickets") {
      fetchTickets();
    }
    if (user && activeTab === "tasks") {
      fetchTaskBoards();
    }
    // Also fetch on load for dashboard overview stats
    if (user) {
      fetchTickets();
      fetchTaskBoards();
    }
  }, [user, activeTab]);

  const fetchTaskBoards = async () => {
    if (!user) return;
    const isAdmin = user?.user_metadata?.role === 'admin' || user?.app_metadata?.role === 'admin' || user?.user_metadata?.role === 'superadmin' || user?.app_metadata?.role === 'superadmin';
    const targetUserId = (isAdmin && impersonateId) ? impersonateId : user.id;

    // Client can see boards where they are a member
    const { data: memberData } = await supabase
      .from("task_board_members")
      .select("board_id")
      .eq("user_id", targetUserId);
      
    if (memberData && memberData.length > 0) {
      const boardIds = memberData.map(m => m.board_id);
      const { data } = await supabase
        .from("task_boards")
        .select("*")
        .in("id", boardIds)
        .order("created_at", { ascending: false });
        
      if (data) {
        setTaskBoards(data);
        if (data.length > 0 && !activeBoardId) {
          setActiveBoardId(data[0].id);
        }
      }
    } else {
      setTaskBoards([]);
    }
  };

  useEffect(() => {
    if (activeBoardId) {
      fetchTasksForBoard(activeBoardId);
    }
  }, [activeBoardId]);

  const fetchTasksForBoard = async (boardId: string) => {
    const { data } = await supabase
      .from("admin_tasks")
      .select("*")
      .eq("board_id", boardId)
      .order("created_at", { ascending: false });
    if (data) setInternalTasks(data);
  };

  const fetchTickets = async () => {
    if (!user) return;
    const isAdmin = user?.user_metadata?.role === 'admin' || user?.app_metadata?.role === 'admin' || user?.user_metadata?.role === 'superadmin' || user?.app_metadata?.role === 'superadmin';
    
    let query = supabase
      .from("client_tickets")
      .select("*")
      .order("created_at", { ascending: false });
      
    if (isAdmin && impersonateId) {
      query = query.eq("client_id", impersonateId);
    }

    const { data, error } = await query;
      
    if (data) {
      setTickets(data);
    }
  };

  const fetchComments = async (ticketId: string) => {
    const { data, error } = await supabase
      .from('ticket_comments')
      .select('*')
      .eq('ticket_id', ticketId)
      .order('created_at', { ascending: true });
    
    if (data) {
      setTicketComments(data);
    } else if (error && error.code === '42P01') {
      // Table doesn't exist yet, just mock for now so UI doesn't break
      setTicketComments([
        { id: 1, user_id: 'system', content: 'We received your ticket and are looking into it.', created_at: new Date(Date.now() - 3600000).toISOString() }
      ]);
    }
  };

  const handleOpenTicket = (ticket: any) => {
    setSelectedTicket(ticket);
    fetchComments(ticket.id);
  };

  const handleSubmitComment = async () => {
    if (!selectedTicket || !commentText.trim() || !user) return;
    
    // Optimistic update
    const newComment = {
      id: Date.now(),
      ticket_id: selectedTicket.id,
      user_id: user.id,
      content: commentText,
      created_at: new Date().toISOString()
    };
    
    setTicketComments(prev => [...prev, newComment]);
    setCommentText("");

    const { error } = await supabase.from('ticket_comments').insert({
      ticket_id: selectedTicket.id,
      user_id: user.id,
      content: newComment.content
    });

    if (error && error.code !== '42P01') {
       toast.error("Couldn't post comment", error.message);
    }
  };

  const fetchTaskComments = async (taskId: string) => {
    const { data, error } = await supabase
      .from('task_comments')
      .select('*')
      .eq('task_id', taskId)
      .order('created_at', { ascending: true });
    
    if (data) {
      setTaskComments(data);
    }
  };

  const handleOpenTask = (task: any) => {
    setSelectedTask(task);
    fetchTaskComments(task.id);
  };

  const handleSubmitTaskComment = async () => {
    if (!selectedTask || !taskCommentText.trim() || !user) return;
    
    const newComment = {
      id: Date.now(),
      task_id: selectedTask.id,
      user_id: user.id,
      content: taskCommentText,
      created_at: new Date().toISOString()
    };
    
    setTaskComments(prev => [...prev, newComment]);
    setTaskCommentText("");

    const { error } = await supabase.from('task_comments').insert({
      task_id: selectedTask.id,
      user_id: user.id,
      content: newComment.content
    });

    if (error) {
       toast.error("Couldn't post comment", error.message);
    }
  };

  const fetchFiles = async () => {
    if (!user) return;
    const isAdmin = user?.user_metadata?.role === 'admin' || user?.app_metadata?.role === 'admin' || user?.user_metadata?.role === 'superadmin' || user?.app_metadata?.role === 'superadmin';

    let query = supabase
      .from('vault_files')
      .select('*')
      .order('created_at', { ascending: false });

    if (isAdmin && impersonateId) {
       query = query.or(`client_id.eq.${impersonateId},client_id.eq.00000000-0000-0000-0000-000000000000`);
       query = query.eq('is_internal', false);
    }

    const { data } = await query;
    if (data) {
      setFiles(data);
    }
  };

  const uploadFile = async (file: File) => {
    if (!user) return;
    setIsUploading(true);
    setUploadProgress(0);

    const isAdmin = user?.user_metadata?.role === 'admin' || user?.app_metadata?.role === 'admin' || user?.user_metadata?.role === 'superadmin' || user?.app_metadata?.role === 'superadmin';
    const targetUserId = (isAdmin && impersonateId) ? impersonateId : user.id;

    // Simulated progress for visual feedback
    const progressInterval = setInterval(() => {
      setUploadProgress((p) => Math.min(p + Math.random() * 15, 90));
    }, 200);

    const filePath = `${targetUserId}/${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const { error: storageError } = await supabase.storage.from('client-vault').upload(filePath, file);

    clearInterval(progressInterval);
    setUploadProgress(100);

    if (!storageError) {
      const { error: dbError } = await supabase.from('vault_files').insert({
        client_id: targetUserId,
        name: file.name,
        folder: currentFolder, // Default to active folder
        storage_path: filePath,
        size: file.size,
        is_internal: false // Clients can't make files internal
      });

      if (!dbError) {
        setRecentUpload(file.name);
        setTimeout(() => setRecentUpload(null), 3000);
        await fetchFiles();
      } else {
        toast.error("Couldn't save file record", dbError.message);
      }
    } else {
      toast.error("Upload failed", storageError.message);
    }

    setTimeout(() => {
      setIsUploading(false);
      setUploadProgress(0);
    }, 600);

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    await uploadFile(e.target.files[0]);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.currentTarget === dropZoneRef.current) {
      setIsDragging(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      await uploadFile(e.dataTransfer.files[0]);
    }
  };

  const handleCreateFolder = async () => {
    if (!user || !newFolderName) return;

    const isAdmin = user?.user_metadata?.role === 'admin' || user?.app_metadata?.role === 'admin' || user?.user_metadata?.role === 'superadmin' || user?.app_metadata?.role === 'superadmin';
    const targetUserId = (isAdmin && impersonateId) ? impersonateId : user.id;

    const { error } = await supabase.from('vault_files').insert({
      client_id: targetUserId,
      name: '.keep',
      folder: newFolderName,
      storage_path: `${targetUserId}/.keep_${Date.now()}`,
      size: 0,
      is_internal: false
    });
    if (!error) {
      setShowNewFolder(false);
      setNewFolderName("");
      fetchFiles();
      setCurrentFolder(newFolderName);
    } else {
      toast.error("Couldn't create folder", error.message);
    }
  };

  const handleDownload = async (file: any) => {
    if (!user) return;
    const { data } = await supabase.storage.from('client-vault').download(file.storage_path);
    if (data) {
      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.name;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const handleShareLink = async (file: any) => {
    if (!user) return;
    const { data, error } = await supabase.storage.from('client-vault').createSignedUrl(file.storage_path, 60 * 60 * 24 * 7); // 7 days
    if (data?.signedUrl) {
      await navigator.clipboard.writeText(data.signedUrl);
      toast.success("Shareable link copied", "Valid for 7 days");
    } else {
      toast.error("Couldn't generate link", error?.message);
    }
  };

  const handleDelete = async (file: any) => {
    if (!user || !confirm(`Delete ${file.name}?`)) return;
    // Remove from storage first
    await supabase.storage.from('client-vault').remove([file.storage_path]);
    // Then remove from DB
    const { error } = await supabase.from('vault_files').delete().eq('id', file.id);
    if (!error) {
      fetchFiles();
    } else {
      toast.error("Couldn't delete file", error.message);
    }
  };

  const handlePreviewFile = async (file: any) => {
    if (!user) return;
    
    // Check if it's an image
    const isImage = file.name.match(/\.(jpeg|jpg|gif|png|webp)$/i);
    
    if (isImage) {
      const { data, error } = await supabase.storage.from('client-vault').createSignedUrl(file.storage_path, 60 * 60); // 1 hour
      if (data?.signedUrl) {
        setPreviewUrl(data.signedUrl);
        setPreviewFile(file);
      } else {
        toast.error("Couldn't generate preview", error?.message);
      }
    } else {
      // If not an image, just download it
      handleDownload(file);
    }
  };

  const handleSubmitTicket = async () => {
    if (!user || !newTicketSubject || !newTicketDescription) return;
    setIsSubmittingTicket(true);
    
    // Combine fields into a structured description for AI parsing
    let finalDescription = "";
    if (newTicketPageUrl) finalDescription += `[Page URL: ${newTicketPageUrl}]\n`;
    if (newTicketSection) finalDescription += `[Section/Element: ${newTicketSection}]\n`;
    if (newTicketPageUrl || newTicketSection) finalDescription += `\n`;
    finalDescription += newTicketDescription;

    const isAdmin = user?.user_metadata?.role === 'admin' || user?.app_metadata?.role === 'admin' || user?.user_metadata?.role === 'superadmin' || user?.app_metadata?.role === 'superadmin';
    const targetUserId = (isAdmin && impersonateId) ? impersonateId : user.id;

    const { data, error } = await supabase.from('client_tickets').insert({
      client_id: targetUserId,
      title: newTicketSubject,
      description: finalDescription,
      priority: newTicketPriority,
      task_type: 'General',
      status: 'pending'
    }).select();

    setIsSubmittingTicket(false);
    
    if (!error && data) {
      setShowNewTicket(false);
      
      // Fire Slack Notification
      fetch('/api/slack', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ticketId: data[0].id,
          title: newTicketSubject,
          description: finalDescription,
          priority: newTicketPriority,
          clientEmail: user.email
        })
      }).catch(console.error);

      setNewTicketSubject("");
      setNewTicketPageUrl("");
      setNewTicketSection("");
      setNewTicketDescription("");
      setNewTicketPriority("Normal");
      fetchTickets();
    } else {
      toast.error("Couldn't submit ticket", error?.message);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/portal");
  };

  const filteredTickets = useMemo(() => {
    if (ticketFilter === "all") return tickets;
    if (ticketFilter === "completed") return tickets.filter(t => t.status === "completed");
    return tickets.filter(t => t.status !== "completed");
  }, [ticketFilter, tickets]);

  useRegisterCommandsMemo(() => {
    const goto = (tab: string) => () => setActiveTab(tab);

    const tabItems: CommandItem[] = [
      { id: "p-tab-overview", group: "Navigate", label: "Overview", sublabel: "Dashboard home", icon: <LayoutDashboard className="w-3.5 h-3.5" />, accent: "#F0564A", action: goto("overview") },
      { id: "p-tab-tasks", group: "Navigate", label: "Shared Projects", sublabel: "Tasks shared with you", icon: <CheckSquare className="w-3.5 h-3.5" />, action: goto("tasks") },
      { id: "p-tab-tickets", group: "Navigate", label: "Support Tickets", icon: <Ticket className="w-3.5 h-3.5" />, action: goto("tickets") },
      { id: "p-tab-files", group: "Navigate", label: "File Vault", icon: <FolderOpen className="w-3.5 h-3.5" />, action: goto("files") },
      { id: "p-tab-billing", group: "Navigate", label: "Billing & Invoices", icon: <CreditCard className="w-3.5 h-3.5" />, action: goto("billing") },
      { id: "p-tab-settings", group: "Navigate", label: "Settings", icon: <Settings className="w-3.5 h-3.5" />, action: goto("settings") },
    ];

    const actions: CommandItem[] = [
      { id: "p-act-new-ticket", group: "Actions", label: "New Support Ticket", icon: <Plus className="w-3.5 h-3.5" />, action: () => { setActiveTab("tickets"); setShowNewTicket(true); }, keywords: "support request open" },
      { id: "p-act-upload", group: "Actions", label: "Upload Files", icon: <UploadCloud className="w-3.5 h-3.5" />, action: () => { setActiveTab("files"); fileInputRef.current?.click(); }, keywords: "vault attach" },
      { id: "p-act-theme", group: "Actions", label: `Toggle ${theme === "dark" ? "Light" : "Dark"} Mode`, icon: theme === "dark" ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />, action: () => setTheme(theme === "dark" ? "light" : "dark"), keywords: "theme appearance" },
      { id: "p-act-home", group: "Actions", label: "Return to Home", icon: <ArrowLeft className="w-3.5 h-3.5" />, action: () => { window.location.href = "/"; } },
    ];

    const ticketItems: CommandItem[] = tickets.slice(0, 20).map((t: any) => ({
      id: `p-ticket-${t.id}`,
      group: "My Tickets",
      label: t.subject || "Ticket",
      sublabel: `${t.status || "open"} · ${t.priority || "Normal"}`,
      icon: <Ticket className="w-3.5 h-3.5" />,
      action: () => { setActiveTab("tickets"); setSelectedTicket(t); },
    }));

    const taskItems: CommandItem[] = internalTasks.slice(0, 30).map((t: any) => {
      const board = taskBoards.find((b: any) => b.id === t.board_id);
      return {
        id: `p-task-${t.id}`,
        group: "Shared Tasks",
        label: t.title,
        sublabel: `${board?.title || "Project"} · ${t.status || "pending"}`,
        icon: <CheckSquare className="w-3.5 h-3.5" />,
        action: () => { setActiveTab("tasks"); setActiveBoardId(t.board_id); setSelectedTask(t); },
      };
    });

    const fileItems: CommandItem[] = files.slice(0, 20).map((f: any) => ({
      id: `p-file-${f.id}`,
      group: "My Files",
      label: f.filename || "Untitled",
      sublabel: f.folder || "root",
      icon: <FolderOpen className="w-3.5 h-3.5" />,
      action: () => { setActiveTab("files"); setPreviewFile(f); },
    }));

    return [...tabItems, ...actions, ...ticketItems, ...taskItems, ...fileItems];
  }, [tickets, internalTasks, taskBoards, files, theme]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center text-white relative overflow-hidden">
        <div className="absolute w-[500px] h-[500px] orb orb-coral" />
        <div className="absolute w-[400px] h-[400px] orb orb-cyan" style={{ animationDelay: "-3s" }} />
        <Loader2 className="w-10 h-10 animate-spin text-[#F0564A] relative z-10" />
      </div>
    );
  }

  if (!user) return null;

  const getStatusColor = (status: string) => {
    if (theme === "light") {
      switch (status) {
        case "pending":
        case "in_progress": return "text-amber-700 bg-amber-100 border-amber-200";
        case "review": return "text-[#5BCBD7] bg-[#5BCBD7]/10 border-[#5BCBD7]/30";
        case "completed": return "text-emerald-700 bg-emerald-100 border-emerald-200";
        default: return "text-gray-600 bg-gray-100 border-gray-200";
      }
    }
    switch (status) {
      case "pending":
      case "in_progress": return "text-amber-300 bg-amber-400/10 border-amber-400/20";
      case "review": return "text-[#5BCBD7] bg-[#5BCBD7]/10 border-[#5BCBD7]/20";
      case "completed": return "text-emerald-400 bg-emerald-400/10 border-emerald-400/20";
      default: return "text-gray-400 bg-gray-400/10 border-gray-400/20";
    }
  };

  const isDark = theme === "dark";
  const isAdmin = user?.user_metadata?.role === 'admin' || user?.app_metadata?.role === 'admin' || user?.user_metadata?.role === 'superadmin' || user?.app_metadata?.role === 'superadmin';

  return (
    <div className={`min-h-screen flex relative ${isDark ? 'text-white bg-black' : 'text-gray-900 bg-gray-50'}`}>
      {/* ============ IMMERSIVE BACKGROUND ============ */}
      <div className="fixed inset-0 z-0 bg-black overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab === "tickets" ? "tickets-bg" : "default-bg"}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0"
          >
            <Image
              src={activeTab === "tickets"
                ? "/images/flowsaber_a_beautiful_scientific_biotech_close_up_molecular_mic_231de8ff-e324-440e-9056-b28133c799dc_edited (1).jpg"
                : "/images/flowsaber_minimal_simple_opening_photorealistic_cinematic_shot__42eeffda-30d1-41a4-8f73-c49a4ac32608.png"}
              alt=""
              fill
              className="object-cover"
              priority
            />
          </motion.div>
        </AnimatePresence>

        {/* Deep filter for premium feel */}
        <div className={`absolute inset-0 transition-colors duration-700 ${isDark ? 'bg-black/85 backdrop-blur-[3px]' : 'bg-white/82 backdrop-blur-[3px]'}`} />

        {/* Floating brand orbs */}
        <motion.div
          className="absolute top-[10%] right-[15%] w-[500px] h-[500px] rounded-full opacity-30"
          style={{ background: "radial-gradient(circle, rgba(240,86,74,0.6) 0%, transparent 60%)", filter: "blur(80px)" }}
          animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-[15%] left-[10%] w-[600px] h-[600px] rounded-full opacity-25"
          style={{ background: "radial-gradient(circle, rgba(91,203,215,0.6) 0%, transparent 60%)", filter: "blur(100px)" }}
          animate={{ x: [0, -25, 0], y: [0, 25, 0] }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-[55%] right-[5%] w-[400px] h-[400px] rounded-full opacity-20"
          style={{ background: "radial-gradient(circle, rgba(240,132,53,0.5) 0%, transparent 60%)", filter: "blur(70px)" }}
          animate={{ x: [0, 20, 0], y: [0, 20, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* ============ SIDEBAR ============ */}
      <aside className={`w-64 border-r flex-col hidden md:flex h-screen fixed left-0 top-0 z-50 ${isDark ? 'bg-black/50 backdrop-blur-2xl border-white/[0.08]' : 'bg-white/70 backdrop-blur-2xl border-gray-200'}`}>
        <div className={`p-6 border-b ${isDark ? 'border-white/[0.08]' : 'border-gray-200'}`}>
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-[#F0564A]/40 blur-md" />
              <Image
                src="/images/MSC LOGO BITTERSWEET VECTOR (1).svg"
                alt="MSC Logo"
                width={32}
                height={32}
                className="object-contain relative"
              />
            </div>
            <span className={`font-heading font-bold text-xl tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>Client Portal</span>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {[
            { key: "overview", label: "Overview", Icon: LayoutDashboard },
            { key: "tasks", label: "Shared Projects", Icon: CheckSquare },
            { key: "tickets", label: "Support Tickets", Icon: Ticket },
            { key: "files", label: "File Vault", Icon: FolderOpen },
            { key: "billing", label: "Billing & Invoices", Icon: CreditCard },
            { key: "settings", label: "Settings", Icon: Settings },
          ].map(({ key, label, Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`group relative w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                activeTab === key
                  ? isDark
                    ? "bg-[#F0564A]/15 text-[#F0564A]"
                    : "bg-[#F0564A]/10 text-[#F0564A]"
                  : isDark
                    ? "text-gray-400 hover:bg-white/[0.04] hover:text-white"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              {activeTab === key && (
                <motion.span
                  layoutId="activeTabIndicator"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-[#F0564A] rounded-r-full"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              <Icon className="w-5 h-5 transition-transform group-hover:scale-110" />
              <span className="font-medium">{label}</span>
            </button>
          ))}
        </nav>

        <div className={`p-4 border-t ${isDark ? 'border-white/[0.08]' : 'border-gray-200'}`}>
          <div className={`px-4 py-3 mb-2 rounded-xl border backdrop-blur-xl ${isDark ? 'bg-black/40 border-white/[0.08]' : 'bg-white/60 border-gray-200'}`}>
            <p className={`text-eyebrow mb-1 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>Logged in as</p>
            <p className={`text-sm truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>{user.email}</p>
          </div>
          <button
            onClick={handleSignOut}
            className={`group w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${isDark ? 'text-gray-400 hover:bg-red-500/15 hover:text-red-400' : 'text-gray-600 hover:bg-red-50 hover:text-red-600'}`}
          >
            <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* ============ MAIN ============ */}
      <main className="flex-1 flex flex-col min-h-screen ml-0 md:ml-64 relative z-40">
        {/* Top Header */}
        <header className={`h-20 border-b flex items-center justify-between px-4 sm:px-8 sticky top-0 z-40 backdrop-blur-2xl ${isDark ? 'bg-black/50 border-white/[0.08]' : 'bg-white/70 border-gray-200'}`}>
          <h1 className={`text-xl sm:text-2xl font-heading font-bold capitalize ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {activeTab === "overview" ? "Dashboard" : activeTab === "tickets" ? "Support Tickets" : activeTab === "files" ? "File Vault" : activeTab}
          </h1>

          <div className="flex items-center gap-2 sm:gap-4">
            {isAdmin && (
              <Link href="/admin" className={`hidden md:flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-300 bg-[#F0564A]/10 border-[#F0564A]/30 text-[#F0564A] hover:bg-[#F0564A]/20`}>
                <span className="text-sm font-bold">Admin Portal</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            )}

            <Link href="/" className={`hidden md:flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-300 ${isDark ? 'border-white/[0.08] text-gray-300 hover:bg-white/[0.06] hover:text-white' : 'border-gray-200 text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}>
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm font-medium">Home</span>
            </Link>

            <button
              type="button"
              onClick={palette.open}
              className={`hidden lg:flex items-center gap-2 border rounded-full pl-4 pr-1.5 py-1.5 transition-all group ${isDark ? 'bg-black/40 border-white/[0.08] hover:bg-black/60 text-gray-400 hover:text-white' : 'bg-white/70 border-gray-200 hover:bg-white text-gray-500 hover:text-gray-900'}`}
              aria-label="Open command palette"
            >
              <Search className="w-4 h-4" />
              <span className="text-sm w-32 text-left">Search…</span>
              <kbd className={`inline-flex items-center gap-0.5 text-[10px] font-semibold rounded px-1.5 py-0.5 border ${isDark ? 'text-gray-500 bg-white/5 border-white/10' : 'text-gray-500 bg-gray-100 border-gray-200'}`}>
                <CommandIcon className="w-2.5 h-2.5" />K
              </kbd>
            </button>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(isDark ? "light" : "dark")}
              className={`rounded-full ${isDark ? 'text-gray-400 hover:text-white hover:bg-white/[0.08]' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`}
              title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={isDark ? "sun" : "moon"}
                  initial={{ opacity: 0, rotate: -90 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: 90 }}
                  transition={{ duration: 0.25 }}
                >
                  {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </motion.div>
              </AnimatePresence>
            </Button>

            <Button variant="ghost" size="icon" className={`relative rounded-full ${isDark ? 'text-gray-400 hover:text-white hover:bg-white/[0.08]' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`}>
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#F0564A]">
                <span className="absolute inset-0 rounded-full bg-[#F0564A] animate-ping" />
              </span>
            </Button>

            {activeTab === "tickets" && (
              <Button
                onClick={() => setShowNewTicket(true)}
                className="bg-[#F0564A] hover:bg-[#D94D42] text-white rounded-full px-4 sm:px-6 glow-spark-sm glow-spark-hover"
              >
                <Plus className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">New Ticket</span>
              </Button>
            )}
            {activeTab === "files" && (
              <>
                <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" />
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="bg-[#F0564A] hover:bg-[#D94D42] text-white rounded-full px-4 sm:px-6 glow-spark-sm glow-spark-hover"
                >
                  {isUploading ? <Loader2 className="w-4 h-4 sm:mr-2 animate-spin" /> : <Plus className="w-4 h-4 sm:mr-2" />}
                  <span className="hidden sm:inline">{isUploading ? "Uploading..." : "Upload File"}</span>
                </Button>
              </>
            )}
          </div>
        </header>

        {/* Dynamic Content Area */}
        <div className="flex-1 p-4 sm:p-6 md:p-8 overflow-x-hidden">

          {/* ============ OVERVIEW ============ */}
          {activeTab === "overview" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-7xl mx-auto space-y-6 md:space-y-8"
            >
              {/* Welcome Banner */}
              <motion.div
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className={`relative overflow-hidden rounded-3xl p-6 sm:p-8 border ${isDark ? 'glass-panel-dark' : 'glass-panel'}`}
              >
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#F0564A]/15 rounded-full blur-[80px] pointer-events-none" />
                <div className="absolute bottom-0 left-1/3 w-48 h-48 bg-[#5BCBD7]/15 rounded-full blur-[60px] pointer-events-none" />

                <div className="relative">
                  <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 rounded-full bg-[#F0564A]/10 border border-[#F0564A]/20 text-xs font-bold text-[#F0564A]">
                    <Sparkles className="w-3 h-3" />
                    {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                  </div>
                  <h2 className={`text-2xl sm:text-3xl md:text-4xl font-heading font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Welcome back, <span className="text-aurora">Client</span>
                    {isAdmin && impersonateId && <span className="text-xs ml-3 bg-white/10 px-3 py-1 rounded-full text-zinc-400 font-normal">Viewing as: {impersonateId.substring(0,8)}</span>}
                  </h2>
                  <p className={`max-w-2xl text-sm sm:text-base ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Your brand ecosystem is humming today. Website traffic is climbing, the MSC team is reviewing your Q3 pitch deck, and your vault is healthy.
                  </p>
                </div>
              </motion.div>

              {/* KPI Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {[
                  { title: "Website Traffic", value: 12450, accent: "spark" as const, Icon: Activity, trend: "+24%", spark: [3, 5, 4, 7, 6, 9, 8, 12] },
                  { title: "Active Leads", value: 342, accent: "cyan" as const, Icon: Users, trend: "+12%", spark: [2, 3, 5, 4, 6, 7, 9, 11] },
                  { title: "Open Tickets", value: 2, accent: "warm" as const, Icon: Ticket, spark: [1, 2, 4, 3, 5, 3, 2, 2] },
                  { title: "Avg. Turnaround", value: 18, suffix: "h", accent: "emerald" as const, Icon: Clock, trend: "-8%", spark: [24, 22, 25, 20, 19, 21, 18, 18] },
                ].map((kpi, index) => {
                  const accent = KPI_ACCENTS[kpi.accent];
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.2 + index * 0.08 }}
                      whileHover={{ y: -4 }}
                      className={`relative overflow-hidden rounded-2xl p-5 sm:p-6 border transition-all duration-500 group ${isDark ? 'glass-panel-dark' : 'glass-panel'}`}
                      style={{
                        boxShadow: `0 0 0 1px ${accent.ring}`,
                      }}
                    >
                      <div
                        className="absolute -top-12 -right-12 w-40 h-40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                        style={{ background: `radial-gradient(circle, ${accent.glow}, transparent 70%)`, filter: "blur(20px)" }}
                      />
                      <div className="relative">
                        <div className="flex justify-between items-start mb-4">
                          <div className={`p-3 rounded-xl ${accent.bg} ${accent.text}`}>
                            <kpi.Icon className="w-5 h-5" />
                          </div>
                          {kpi.trend && (
                            <span className={`flex items-center text-xs font-bold ${kpi.trend.startsWith('-') ? 'text-emerald-400 bg-emerald-400/10' : 'text-emerald-400 bg-emerald-400/10'} px-2 py-1 rounded-full`}>
                              <TrendingUp className="w-3 h-3 mr-1" /> {kpi.trend}
                            </span>
                          )}
                        </div>
                        <p className={`text-xs font-medium mb-1 uppercase tracking-wider ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>{kpi.title}</p>
                        <h3 className={`text-2xl sm:text-3xl font-bold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          <AnimatedCounter value={kpi.value} suffix={kpi.suffix} />
                        </h3>
                        {/* Sparkline */}
                        <div className="h-10 -mx-2">
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={kpi.spark.map((v, i) => ({ v, i }))}>
                              <Line
                                type="monotone"
                                dataKey="v"
                                stroke={accent.text.includes('F0564A') ? '#F0564A' : accent.text.includes('5BCBD7') ? '#5BCBD7' : accent.text.includes('F08435') ? '#F08435' : '#10b981'}
                                strokeWidth={2}
                                dot={false}
                                strokeLinecap="round"
                              />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Charts & Activity Grid */}
              <div className="grid lg:grid-cols-3 gap-6 md:gap-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  className={`lg:col-span-2 rounded-3xl p-6 sm:p-8 border ${isDark ? 'glass-panel-dark' : 'glass-panel'}`}
                >
                  <div className="flex items-center justify-between mb-6 sm:mb-8 flex-wrap gap-3">
                    <div>
                      <h3 className={`text-lg sm:text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Audience Growth</h3>
                      <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Traffic & Engagement over time</p>
                    </div>
                    <select className={`${isDark ? 'bg-black/40 border-white/[0.08] text-gray-300' : 'bg-gray-50 border-gray-200 text-gray-700'} border rounded-lg px-3 py-1.5 text-sm outline-none focus:border-[#F0564A]/40`}>
                      <option>Last 6 Months</option>
                      <option>This Year</option>
                      <option>All Time</option>
                    </select>
                  </div>
                  <div className="h-[260px] sm:h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={mockChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorTraffic" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#F0564A" stopOpacity={0.35} />
                            <stop offset="95%" stopColor="#F0564A" stopOpacity={0} />
                          </linearGradient>
                          <linearGradient id="colorEngagement" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#5BCBD7" stopOpacity={0.35} />
                            <stop offset="95%" stopColor="#5BCBD7" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "rgba(255,255,255,0.06)" : "#eee"} vertical={false} />
                        <XAxis dataKey="name" stroke={isDark ? "#666" : "#999"} tick={{ fill: isDark ? '#888' : '#666', fontSize: 12 }} tickLine={false} axisLine={false} />
                        <YAxis stroke={isDark ? "#666" : "#999"} tick={{ fill: isDark ? '#888' : '#666', fontSize: 12 }} tickLine={false} axisLine={false} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: isDark ? 'rgba(10,10,14,0.95)' : 'rgba(255,255,255,0.98)',
                            borderColor: isDark ? 'rgba(255,255,255,0.1)' : '#eee',
                            borderRadius: '12px',
                            color: isDark ? '#fff' : '#000',
                            boxShadow: "0 10px 40px -10px rgba(0,0,0,0.3)",
                            backdropFilter: "blur(12px)",
                          }}
                          itemStyle={{ color: isDark ? '#fff' : '#000' }}
                        />
                        <Area type="monotone" dataKey="traffic" stroke="#F0564A" strokeWidth={3} fillOpacity={1} fill="url(#colorTraffic)" />
                        <Area type="monotone" dataKey="engagement" stroke="#5BCBD7" strokeWidth={3} fillOpacity={1} fill="url(#colorEngagement)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.7 }}
                  className={`rounded-3xl p-6 sm:p-8 border ${isDark ? 'glass-panel-dark' : 'glass-panel'}`}
                >
                  <h3 className={`text-lg sm:text-xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>Recent Activity</h3>
                  <div className="space-y-5">
                    {[
                      { Icon: FileText, color: "text-[#5BCBD7]", bg: "bg-[#5BCBD7]/10", title: "New pitch deck uploaded", meta: "MSC Team • 2 hours ago" },
                      { Icon: Ticket, color: "text-amber-400", bg: "bg-amber-400/10", title: "Ticket #1042 → In Progress", meta: "Today, 10:23 AM" },
                      { Icon: CheckCircle2, color: "text-emerald-400", bg: "bg-emerald-400/10", title: "Ticket #1038 resolved", meta: "May 4, 2026" },
                    ].map((a, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.8 + i * 0.1 }}
                        className="flex gap-4 group"
                      >
                        <div className={`w-10 h-10 rounded-full ${a.bg} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
                          <a.Icon className={`w-4 h-4 ${a.color}`} />
                        </div>
                        <div>
                          <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{a.title}</p>
                          <p className={`text-xs mt-0.5 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>{a.meta}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  <Button className={`w-full mt-6 border bg-transparent rounded-full ${isDark ? 'border-white/[0.08] text-white hover:bg-white/[0.06]' : 'border-gray-200 text-gray-900 hover:bg-gray-50'}`}>
                    View All Activity
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          )}

          {/* ============ TICKETS ============ */}
          {activeTab === "tickets" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="max-w-6xl mx-auto"
            >
              <div className={`rounded-3xl overflow-hidden border ${isDark ? 'glass-panel-dark' : 'glass-panel'}`}>
                <div className={`p-4 sm:p-6 border-b flex items-center justify-between flex-wrap gap-3 ${isDark ? 'border-white/[0.06]' : 'border-gray-200'}`}>
                  <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Active Requests</h3>
                  <div className="flex gap-1.5">
                    {(["all", "open", "completed"] as const).map((f) => (
                      <button
                        key={f}
                        onClick={() => setTicketFilter(f)}
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold capitalize transition-all ${
                          ticketFilter === f
                            ? "bg-[#F0564A] text-white"
                            : isDark
                              ? "text-gray-400 hover:bg-white/[0.06]"
                              : "text-gray-600 hover:bg-gray-100"
                        }`}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[640px]">
                    <thead>
                      <tr className={`border-b text-xs uppercase tracking-wider ${isDark ? 'border-white/[0.05] text-gray-500' : 'border-gray-200 text-gray-500 bg-gray-50/40'}`}>
                        <th className="p-4 font-semibold">Ticket</th>
                        <th className="p-4 font-semibold">Subject</th>
                        <th className="p-4 font-semibold">Status</th>
                        <th className="p-4 font-semibold">Priority</th>
                        <th className="p-4 font-semibold">Updated</th>
                        <th className="p-4 font-semibold text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className={`divide-y ${isDark ? 'divide-white/[0.05]' : 'divide-gray-100'}`}>
                      <AnimatePresence mode="popLayout">
                        {filteredTickets.map((ticket, i) => (
                          <motion.tr
                            key={ticket.id}
                            layout
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            transition={{ duration: 0.25, delay: i * 0.04 }}
                            className={`transition-colors group ${isDark ? 'hover:bg-white/[0.04]' : 'hover:bg-gray-50/60'}`}
                          >
                            <td className={`p-4 text-sm font-mono ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>#{ticket.id.substring(0, 8)}</td>
                            <td className={`p-4 text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{ticket.title}</td>
                            <td className="p-4">
                              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border capitalize ${getStatusColor(ticket.status)}`}>
                                {ticket.status.replace('_', ' ')}
                              </span>
                            </td>
                            <td className="p-4">
                              <span className={`text-sm font-medium ${ticket.priority === 'Urgent' ? 'text-red-400' : ticket.priority === 'High' ? 'text-[#F08435]' : isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                {ticket.priority}
                              </span>
                            </td>
                            <td className={`p-4 text-sm ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                              {new Date(ticket.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </td>
                            <td className="p-4 text-right">
                              <Button variant="ghost" size="sm" onClick={() => handleOpenTicket(ticket)} className={`${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'} group/btn`}>
                                View <ArrowUpRight className="w-4 h-4 ml-1 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
                              </Button>
                            </td>
                          </motion.tr>
                        ))}
                      </AnimatePresence>
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {/* ============ TASKS ============ */}
          {activeTab === "tasks" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="max-w-6xl mx-auto"
            >
              <div className="flex flex-col md:flex-row gap-6">
                {/* Boards Sidebar */}
                <div className="w-full md:w-64 space-y-2">
                  <h3 className={`text-sm font-bold uppercase tracking-wider mb-4 px-2 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Shared Projects</h3>
                  {taskBoards.length === 0 ? (
                    <div className={`p-4 rounded-xl text-sm text-center ${isDark ? 'bg-white/[0.02] text-gray-500' : 'bg-gray-50 text-gray-400'}`}>
                      No shared projects found.
                    </div>
                  ) : (
                    taskBoards.map(board => (
                      <button
                        key={board.id}
                        onClick={() => setActiveBoardId(board.id)}
                        className={`w-full text-left px-4 py-3 rounded-xl transition-all ${
                          activeBoardId === board.id
                            ? (isDark ? 'bg-[#5BCBD7]/10 text-[#5BCBD7] border border-[#5BCBD7]/20' : 'bg-[#5BCBD7]/10 text-[#5BCBD7] border border-[#5BCBD7]/20')
                            : (isDark ? 'text-gray-400 hover:bg-white/[0.04] hover:text-white border border-transparent' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 border border-transparent')
                        }`}
                      >
                        <div className="font-semibold text-sm truncate">{board.title}</div>
                        {board.client_tag && (
                          <div className="text-[10px] mt-1 opacity-70 uppercase tracking-widest">{board.client_tag}</div>
                        )}
                      </button>
                    ))
                  )}
                </div>

                {/* Tasks List */}
                <div className={`flex-1 rounded-3xl overflow-hidden border ${isDark ? 'glass-panel-dark' : 'glass-panel'}`}>
                  <div className={`p-4 sm:p-6 border-b flex items-center justify-between flex-wrap gap-3 ${isDark ? 'border-white/[0.06]' : 'border-gray-200'}`}>
                    <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {taskBoards.find(b => b.id === activeBoardId)?.title || "Select a Project"}
                    </h3>
                  </div>
                  <div className="overflow-x-auto">
                    {internalTasks.length === 0 ? (
                      <div className="p-16 text-center">
                        <CheckSquare className={`w-10 h-10 mx-auto mb-4 ${isDark ? 'text-gray-600' : 'text-gray-300'}`} />
                        <h3 className={`text-lg font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>No active tasks</h3>
                        <p className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>There are no tasks available in this project right now.</p>
                      </div>
                    ) : (
                      <div className={`divide-y ${isDark ? 'divide-white/[0.05]' : 'divide-gray-100'}`}>
                        {internalTasks.map((task) => (
                          <div key={task.id} className={`p-4 sm:p-6 flex flex-col gap-3 transition-colors ${task.status === 'completed' ? 'opacity-60' : ''} ${isDark ? 'hover:bg-white/[0.02]' : 'hover:bg-gray-50/60'}`}>
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full">
                              <div className="flex-1 min-w-0">
                                <p className={`text-base font-semibold mb-1 break-words whitespace-pre-wrap ${task.status === 'completed' ? (isDark ? 'text-gray-500 line-through' : 'text-gray-400 line-through') : (isDark ? 'text-white' : 'text-gray-900')}`}>
                                  {task.title}
                                </p>
                                <div className="flex items-center gap-3">
                                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${getStatusColor(task.status)}`}>
                                    {task.status.replace('_', ' ')}
                                  </span>
                                  <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                                    {new Date(task.created_at).toLocaleDateString()}
                                  </span>
                                </div>
                              </div>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => handleOpenTask(task)}
                                className={`shrink-0 ${isDark ? 'text-gray-400 hover:text-white hover:bg-white/10' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'}`}
                              >
                                <MessageSquare className="w-4 h-4 mr-2" /> Chat
                              </Button>
                            </div>
                            
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ============ FILES ============ */}
          {activeTab === "files" && (() => {
            const uniqueFolders = Array.from(new Set(files.map(f => f.folder || "root"))).filter(f => f !== "root");
            const displayedFiles = files.filter(f => (f.folder || "root") === currentFolder).filter(f => f.name !== '.keep');

            return (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="max-w-6xl mx-auto"
            >
              {/* BREADCRUMBS */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-2 text-2xl font-heading font-bold">
                  <button 
                    onClick={() => setCurrentFolder("root")} 
                    className={`${currentFolder === "root" ? (isDark ? 'text-white' : 'text-gray-900') : (isDark ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-gray-700')} transition-colors`}
                  >
                    File Vault
                  </button>
                  {currentFolder !== "root" && (
                    <>
                      <ChevronRight className={`w-6 h-6 ${isDark ? 'text-gray-600' : 'text-gray-300'}`} />
                      <span className={isDark ? 'text-white' : 'text-gray-900'}>{currentFolder}</span>
                    </>
                  )}
                </div>
                
                {/* TOOLBAR */}
                <div className="flex flex-wrap items-center gap-2">
                  <Button onClick={() => setShowNewFolder(true)} variant="outline" className={`rounded-full h-10 ${isDark ? 'border-white/[0.1] text-gray-300 hover:bg-white/[0.06] hover:text-white' : 'border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-gray-900'}`}>
                    <FolderPlus className="w-4 h-4 mr-2" />
                    New Folder
                  </Button>
                  <Button onClick={() => fileInputRef.current?.click()} className={`rounded-full h-10 ${isDark ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-gray-200 text-gray-900 hover:bg-gray-300'}`}>
                    <File className="w-4 h-4 mr-2" />
                    Upload Files
                  </Button>
                </div>
              </div>

              {/* FOLDERS GRID (Only in Root) */}
              {currentFolder === "root" && uniqueFolders.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
                  {uniqueFolders.map(folder => {
                    const itemCount = files.filter(f => f.folder === folder && f.name !== '.keep').length;
                    return (
                      <motion.div
                        key={folder}
                        whileHover={{ y: -3 }}
                        onClick={() => setCurrentFolder(folder)}
                        className={`cursor-pointer rounded-2xl p-4 border transition-all flex flex-col gap-3 ${isDark ? 'glass-panel-dark hover:border-[#5BCBD7]/40' : 'glass-panel hover:border-[#5BCBD7]/40'}`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="p-3 rounded-xl bg-[#5BCBD7]/10 text-[#5BCBD7]">
                            <Folder className="w-6 h-6 fill-current opacity-20" />
                          </div>
                        </div>
                        <div className="min-w-0">
                          <h3 className={`font-bold text-lg truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>{folder}</h3>
                          <p className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                            {itemCount} {itemCount === 1 ? 'item' : 'items'}
                          </p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}

              {/* MAIN DROP ZONE & FILE LIST */}
              <div
                ref={dropZoneRef}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`relative min-h-[400px] rounded-3xl border transition-all duration-300 overflow-hidden flex flex-col ${
                  isDragging
                    ? isDark ? "border-[#F0564A] bg-[#F0564A]/5" : "border-[#F0564A] bg-[#F0564A]/5"
                    : isDark ? "glass-panel-dark border-transparent" : "glass-panel border-transparent"
                }`}
              >
                {/* Drag Overlay */}
                <AnimatePresence>
                  {isDragging && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/40 rounded-3xl border-2 border-[#F0564A] border-dashed"
                    >
                      <div className="text-center pointer-events-none">
                        <UploadCloud className="w-16 h-16 text-[#F0564A] mx-auto mb-4 animate-bounce" />
                        <h3 className="text-2xl font-bold text-white mb-2">Drop files to upload</h3>
                        <p className="text-gray-300">Files will be uploaded to {currentFolder === "root" ? "File Vault" : currentFolder}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Upload progress overlay */}
                <AnimatePresence>
                  {isUploading && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className={`absolute inset-0 z-40 flex items-center justify-center ${isDark ? 'bg-black/80' : 'bg-white/80'} backdrop-blur-md rounded-3xl`}
                    >
                      <div className="text-center w-full max-w-sm px-6">
                        <Loader2 className="w-12 h-12 mx-auto mb-6 animate-spin text-[#F0564A]" />
                        <h3 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>Uploading...</h3>
                        <p className={`text-sm mb-6 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Saving to {currentFolder === "root" ? "Vault" : currentFolder}</p>
                        <div className={`h-2 rounded-full overflow-hidden ${isDark ? 'bg-white/10' : 'bg-gray-200'}`}>
                          <motion.div
                            className="h-full bg-gradient-to-r from-[#F0564A] to-[#F08435]"
                            style={{ width: `${uploadProgress}%` }}
                            transition={{ duration: 0.3 }}
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* File Header (Columns) */}
                {displayedFiles.length > 0 && (
                  <div className={`grid grid-cols-12 gap-4 p-4 sm:px-6 border-b text-xs font-bold uppercase tracking-wider ${isDark ? 'border-white/[0.05] text-gray-500' : 'border-gray-200 text-gray-500'}`}>
                    <div className="col-span-6 sm:col-span-5">Name</div>
                    <div className="col-span-3 hidden sm:block">Date Modified</div>
                    <div className="col-span-3 sm:col-span-2 text-right sm:text-left">Size</div>
                    <div className="col-span-3 sm:col-span-2 text-right">Actions</div>
                  </div>
                )}

                {/* Empty State */}
                {displayedFiles.length === 0 && !isDragging && (
                  <div className="flex-1 flex flex-col items-center justify-center p-12 text-center h-full">
                    <div className={`w-24 h-24 rounded-3xl flex items-center justify-center mb-6 shadow-inner ${isDark ? 'bg-white/[0.02] shadow-white/[0.02]' : 'bg-gray-50 shadow-gray-200/50'}`}>
                      <UploadCloud className={`w-10 h-10 ${isDark ? 'text-gray-600' : 'text-gray-400'}`} />
                    </div>
                    <h3 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>This folder is empty</h3>
                    <p className={`mb-8 max-w-sm mx-auto text-base ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      Drag and drop files right here to upload, or click the button below to browse your computer.
                    </p>
                    <Button
                      onClick={() => fileInputRef.current?.click()}
                      className="bg-[#F0564A] hover:bg-[#D94D42] text-white rounded-full px-8 h-12 font-bold shadow-[0_0_20px_rgba(240,86,74,0.3)] hover:shadow-[0_0_30px_rgba(240,86,74,0.5)] transition-all"
                    >
                      <UploadCloud className="w-5 h-5 mr-2" />
                      Select Files to Upload
                    </Button>
                  </div>
                )}

                {/* File List */}
                {displayedFiles.length > 0 && (
                  <div className={`flex-1 overflow-y-auto divide-y ${isDark ? 'divide-white/[0.05]' : 'divide-gray-100'}`}>
                    <AnimatePresence>
                      {displayedFiles.map((file, idx) => {
                        const { Icon, color, bg } = getFileIcon(file.name);
                        return (
                          <motion.div
                            key={file.id + idx}
                            layout
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                            className={`grid grid-cols-12 gap-4 p-4 sm:px-6 items-center transition-colors group ${isDark ? 'hover:bg-white/[0.02]' : 'hover:bg-gray-50/80'}`}
                          >
                            <div className="col-span-8 sm:col-span-5 flex items-center gap-4 min-w-0">
                              <div className={`p-2.5 rounded-xl ${bg} ${color} shrink-0`}>
                                <Icon className="w-5 h-5" />
                              </div>
                              <div className="min-w-0">
                                <p className={`font-semibold text-sm truncate ${isDark ? 'text-gray-200 group-hover:text-white' : 'text-gray-700 group-hover:text-gray-900'} transition-colors`}>{file.name}</p>
                              </div>
                            </div>
                            
                            <div className={`col-span-3 hidden sm:flex items-center text-sm ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                              {new Date(file.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </div>
                            
                            <div className={`col-span-2 hidden sm:flex items-center text-sm ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                              {(file.size / 1024 / 1024).toFixed(2)} MB
                            </div>
                            
                            <div className="col-span-4 sm:col-span-2 flex items-center justify-end gap-1 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                              {file.name.match(/\.(jpeg|jpg|gif|png|webp)$/i) && (
                                <Button
                                  onClick={() => handlePreviewFile(file)}
                                  variant="ghost"
                                  size="icon"
                                  className={`rounded-full ${isDark ? 'hover:bg-white/10 text-gray-400 hover:text-white' : 'hover:bg-gray-200 text-gray-500 hover:text-gray-900'}`}
                                  title="Preview Image"
                                >
                                  <Eye className="w-4 h-4" />
                                </Button>
                              )}
                              <Button
                                onClick={() => handleShareLink(file)}
                                variant="ghost"
                                size="icon"
                                className={`rounded-full ${isDark ? 'hover:bg-white/10 text-gray-400 hover:text-white' : 'hover:bg-gray-200 text-gray-500 hover:text-gray-900'}`}
                                title="Copy Shareable Link"
                              >
                                <Link2 className="w-4 h-4" />
                              </Button>
                              <Button
                                onClick={() => handleDownload(file)}
                                variant="ghost"
                                size="icon"
                                className={`rounded-full ${isDark ? 'hover:bg-white/10 text-gray-400 hover:text-white' : 'hover:bg-gray-200 text-gray-500 hover:text-gray-900'}`}
                                title="Download"
                              >
                                <Download className="w-4 h-4" />
                              </Button>
                              <Button
                                onClick={() => handleDelete(file)}
                                variant="ghost"
                                size="icon"
                                className={`rounded-full hover:bg-red-500/10 hover:text-red-500 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}
                                title="Delete"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>
                  </div>
                )}
              </div>
            </motion.div>
            );
          })()}

          {/* ============ BILLING ============ */}
          {activeTab === "billing" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="max-w-4xl mx-auto"
            >
              <div className={`rounded-3xl p-6 sm:p-8 mb-6 flex items-center justify-between flex-wrap gap-4 border ${isDark ? 'glass-panel-dark' : 'glass-panel'}`}>
                <div>
                  <p className={`text-eyebrow mb-2 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>Current Balance</p>
                  <p className={isDark ? 'text-gray-400 text-sm' : 'text-gray-500 text-sm'}>Next invoice due on June 1, 2026</p>
                </div>
                <div className="text-right">
                  <h2 className={`text-3xl sm:text-4xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>$0.00</h2>
                  <p className="text-sm text-emerald-400 font-medium mt-1 flex items-center justify-end"><CheckCircle2 className="w-4 h-4 mr-1" /> All paid up</p>
                </div>
              </div>

              <h3 className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Invoice History</h3>
              <div className={`rounded-3xl overflow-hidden border ${isDark ? 'glass-panel-dark' : 'glass-panel'}`}>
                <div className="p-12 sm:p-16 text-center">
                  <div className={`w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 ${isDark ? 'bg-white/[0.04]' : 'bg-gray-100'}`}>
                    <FileText className={`w-8 h-8 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
                  </div>
                  <h3 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>No Invoices Yet</h3>
                  <p className={isDark ? 'text-gray-400' : 'text-gray-500'}>Your future invoices and payment history will appear here.</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* ============ SETTINGS ============ */}
          {activeTab === "settings" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="max-w-4xl mx-auto"
            >
              <div className={`rounded-3xl p-6 sm:p-8 border ${isDark ? 'glass-panel-dark' : 'glass-panel'}`}>
                <div className={`flex items-center gap-4 mb-8 pb-8 border-b ${isDark ? 'border-white/[0.08]' : 'border-gray-200'}`}>
                  <div className="relative">
                    <div className="absolute inset-0 rounded-full bg-[#F0564A]/40 blur-xl" />
                    <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-[#F0564A] to-[#F08435] flex items-center justify-center text-2xl sm:text-3xl font-bold text-white shadow-lg">
                      {user.email?.charAt(0).toUpperCase()}
                    </div>
                  </div>
                  <div>
                    <h3 className={`text-xl sm:text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Client Profile</h3>
                    <p className={isDark ? 'text-gray-400 text-sm' : 'text-gray-500 text-sm'}>Manage your account settings and preferences.</p>
                  </div>
                </div>

                <div className="space-y-8">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className={`block text-sm font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Email Address</label>
                      <input type="text" disabled value={user.email} className={`w-full border rounded-xl px-4 py-3 cursor-not-allowed focus:outline-none ${isDark ? 'bg-black/40 border-white/[0.08] text-gray-300' : 'bg-gray-50 border-gray-200 text-gray-500'}`} />
                    </div>
                    <div className="space-y-2">
                      <label className={`block text-sm font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Company Name</label>
                      <input type="text" placeholder="Enter company name" className={`w-full border rounded-xl px-4 py-3 focus:outline-none focus:border-[#F0564A] transition-colors ${isDark ? 'bg-black/40 border-white/[0.08] text-white' : 'bg-white border-gray-200 text-gray-900'}`} />
                    </div>
                  </div>

                  <div className={`pt-6 border-t ${isDark ? 'border-white/[0.08]' : 'border-gray-200'}`}>
                    <h4 className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Security</h4>
                    <form onSubmit={async (e) => {
                      e.preventDefault();
                      const formData = new FormData(e.currentTarget);
                      const password = formData.get('password') as string;
                      if (!password || password.length < 6) { toast.error("Password must be at least 6 characters"); return; }
                      
                      const { error } = await supabase.auth.updateUser({ password });
                      if (error) toast.error("Couldn't update password", error.message);
                      else {
                        toast.success("Password updated");
                        (e.target as HTMLFormElement).reset();
                      }
                    }} className="space-y-4 max-w-sm">
                      <div className="space-y-2">
                        <label className={`block text-sm font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>New Password</label>
                        <input 
                          name="password"
                          type="password" 
                          placeholder="••••••••" 
                          className={`w-full border rounded-xl px-4 py-3 focus:outline-none focus:border-[#F0564A] transition-colors ${isDark ? 'bg-black/40 border-white/[0.08] text-white' : 'bg-white border-gray-200 text-gray-900'}`} 
                        />
                      </div>
                      <Button type="submit" className={`border rounded-full px-6 bg-[#F0564A] text-white hover:bg-[#F0564A]/90 border-transparent`}>
                        Change Password
                      </Button>
                    </form>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

        </div>
      </main>

      {/* ============ FILE PREVIEW MODAL ============ */}
      <AnimatePresence>
        {previewFile && previewUrl && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => { setPreviewFile(null); setPreviewUrl(null); }}
              className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100]"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="fixed inset-4 md:inset-10 z-[101] flex flex-col items-center justify-center pointer-events-none"
            >
              <div className="bg-[#111111] border border-white/10 rounded-2xl overflow-hidden w-full max-w-5xl max-h-full flex flex-col pointer-events-auto shadow-2xl">
                <div className="flex items-center justify-between p-4 border-b border-white/5 bg-black/20">
                  <h3 className="text-white font-semibold truncate pr-4">{previewFile.name}</h3>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDownload(previewFile)}
                      className="text-zinc-400 hover:text-white hover:bg-white/5"
                    >
                      <Download className="w-4 h-4 mr-2" /> Download
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => { setPreviewFile(null); setPreviewUrl(null); }}
                      className="text-zinc-400 hover:text-white hover:bg-white/5 rounded-full"
                    >
                      <X className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
                <div className="flex-1 overflow-auto p-4 flex items-center justify-center bg-black/40 min-h-[300px]">
                  <img 
                    src={previewUrl} 
                    alt={previewFile.name} 
                    className="max-w-full max-h-full object-contain rounded-lg shadow-lg"
                  />
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ============ NEW TICKET MODAL ============ */}
      <AnimatePresence>
        {showNewTicket && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowNewTicket(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
            />
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.96 }}
              transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[92%] max-w-lg z-[101]"
            >
              <div className={`rounded-3xl border overflow-hidden ${isDark ? 'glass-panel-dark' : 'glass-panel'}`}>
                <div className={`p-6 border-b flex items-center justify-between ${isDark ? 'border-white/[0.08]' : 'border-gray-200'}`}>
                  <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>New Support Ticket</h3>
                  <button
                    onClick={() => setShowNewTicket(false)}
                    className={`p-2 rounded-full transition-colors ${isDark ? 'text-gray-400 hover:bg-white/[0.06]' : 'text-gray-500 hover:bg-gray-100'}`}
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="p-6 space-y-5">
                  <div className="space-y-2">
                    <label className={`block text-sm font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Subject</label>
                    <input
                      type="text"
                      value={newTicketSubject}
                      onChange={(e) => setNewTicketSubject(e.target.value)}
                      placeholder="What can we help with?"
                      className={`w-full border rounded-xl px-4 py-3 focus:outline-none focus:border-[#F0564A] transition-colors ${isDark ? 'bg-black/40 border-white/[0.08] text-white placeholder:text-gray-500' : 'bg-white border-gray-200 text-gray-900'}`}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className={`block text-sm font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Priority</label>
                    <div className="grid grid-cols-3 gap-2">
                      {["Normal", "High", "Urgent"].map((p) => (
                        <button
                          key={p}
                          onClick={() => setNewTicketPriority(p)}
                          className={`py-2.5 rounded-xl text-sm font-semibold border transition-all ${newTicketPriority === p ? (isDark ? 'bg-[#F0564A]/20 border-[#F0564A] text-[#F0564A]' : 'bg-[#F0564A]/10 border-[#F0564A] text-[#F0564A]') : (isDark ? 'border-white/[0.1] text-gray-300 hover:bg-white/[0.06] hover:border-[#F0564A]/40' : 'border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-[#F0564A]/40')}`}
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className={`block text-sm font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Description</label>
                    <textarea
                      rows={4}
                      value={newTicketDescription}
                      onChange={(e) => setNewTicketDescription(e.target.value)}
                      placeholder="Add details or context..."
                      className={`w-full border rounded-xl px-4 py-3 focus:outline-none focus:border-[#F0564A] transition-colors resize-none ${isDark ? 'bg-black/40 border-white/[0.08] text-white placeholder:text-gray-500' : 'bg-white border-gray-200 text-gray-900'}`}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className={`block text-sm font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Page URL (Optional)</label>
                      <input
                        type="text"
                        value={newTicketPageUrl}
                        onChange={(e) => setNewTicketPageUrl(e.target.value)}
                        placeholder="e.g. /about-us"
                        className={`w-full border rounded-xl px-4 py-3 focus:outline-none focus:border-[#F0564A] transition-colors ${isDark ? 'bg-black/40 border-white/[0.08] text-white placeholder:text-gray-500' : 'bg-white border-gray-200 text-gray-900'}`}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className={`block text-sm font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Section (Optional)</label>
                      <input
                        type="text"
                        value={newTicketSection}
                        onChange={(e) => setNewTicketSection(e.target.value)}
                        placeholder="e.g. Hero Banner"
                        className={`w-full border rounded-xl px-4 py-3 focus:outline-none focus:border-[#F0564A] transition-colors ${isDark ? 'bg-black/40 border-white/[0.08] text-white placeholder:text-gray-500' : 'bg-white border-gray-200 text-gray-900'}`}
                      />
                    </div>
                  </div>
                </div>
                <div className={`p-6 pt-0 flex justify-end gap-3`}>
                  <Button
                    onClick={() => setShowNewTicket(false)}
                    className={`border rounded-full px-5 bg-transparent ${isDark ? 'border-white/[0.1] text-gray-300 hover:bg-white/[0.06]' : 'border-gray-200 text-gray-700 hover:bg-gray-50'}`}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSubmitTicket}
                    disabled={isSubmittingTicket || !newTicketSubject || !newTicketDescription}
                    className="bg-[#F0564A] hover:bg-[#D94D42] text-white rounded-full px-6 glow-spark-sm glow-spark-hover disabled:opacity-50"
                  >
                    {isSubmittingTicket ? "Submitting..." : "Submit Ticket"}
                  </Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      {/* ============ NEW FOLDER MODAL ============ */}
      <AnimatePresence>
        {showNewFolder && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowNewFolder(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
            />
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.96 }}
              transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[92%] max-w-sm z-[101]"
            >
              <div className={`rounded-3xl border overflow-hidden ${isDark ? 'glass-panel-dark' : 'glass-panel'}`}>
                <div className={`p-6 border-b flex items-center justify-between ${isDark ? 'border-white/[0.08]' : 'border-gray-200'}`}>
                  <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>New Folder</h3>
                  <button
                    onClick={() => setShowNewFolder(false)}
                    className={`p-2 rounded-full transition-colors ${isDark ? 'text-gray-400 hover:bg-white/[0.06]' : 'text-gray-500 hover:bg-gray-100'}`}
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="p-6 space-y-5">
                  <div className="space-y-2">
                    <label className={`block text-sm font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Folder Name</label>
                    <input
                      type="text"
                      value={newFolderName}
                      onChange={(e) => setNewFolderName(e.target.value)}
                      placeholder="e.g. Q4 Pitch Decks"
                      autoFocus
                      onKeyDown={(e) => { if(e.key === 'Enter') handleCreateFolder(); }}
                      className={`w-full border rounded-xl px-4 py-3 focus:outline-none focus:border-[#F0564A] transition-colors ${isDark ? 'bg-black/40 border-white/[0.08] text-white placeholder:text-gray-500' : 'bg-white border-gray-200 text-gray-900'}`}
                    />
                  </div>
                </div>
                <div className={`p-6 pt-0 flex justify-end gap-3`}>
                  <Button
                    onClick={() => setShowNewFolder(false)}
                    className={`border rounded-full px-5 bg-transparent ${isDark ? 'border-white/[0.1] text-gray-300 hover:bg-white/[0.06]' : 'border-gray-200 text-gray-700 hover:bg-gray-50'}`}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleCreateFolder}
                    disabled={!newFolderName.trim()}
                    className="bg-[#F0564A] hover:bg-[#D94D42] text-white rounded-full px-6 glow-spark-sm glow-spark-hover disabled:opacity-50"
                  >
                    Create
                  </Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      {/* ============ TICKET CHAT MODAL ============ */}
      <AnimatePresence>
        {selectedTicket && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedTicket(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
            />
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.96 }}
              transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[92%] max-w-2xl max-h-[85vh] flex flex-col z-[101]"
            >
              <div className={`rounded-3xl border overflow-hidden flex flex-col h-full ${isDark ? 'glass-panel-dark' : 'glass-panel bg-white'}`}>
                {/* Header */}
                <div className={`p-6 border-b flex items-center justify-between shrink-0 ${isDark ? 'border-white/[0.08]' : 'border-gray-200'}`}>
                  <div>
                    <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{selectedTicket.title}</h3>
                    <div className="flex items-center gap-2 mt-2">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold border capitalize ${getStatusColor(selectedTicket.status)}`}>
                        {selectedTicket.status.replace('_', ' ')}
                      </span>
                      <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        Ticket #{selectedTicket.id.substring(0,8)}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedTicket(null)}
                    className={`p-2 rounded-full transition-colors self-start ${isDark ? 'text-gray-400 hover:bg-white/[0.06]' : 'text-gray-500 hover:bg-gray-100'}`}
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                {/* Chat Area */}
                <div ref={ticketChatScrollRef} className={`flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth ${isDark ? 'bg-black/20' : 'bg-gray-50/50'}`}>
                  {/* Original Ticket Description */}
                  <div className="flex gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 font-bold ${isDark ? 'bg-[#F0564A]/20 text-[#F0564A]' : 'bg-[#F0564A]/10 text-[#F0564A]'}`}>
                      {user.email?.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-baseline gap-2 mb-1">
                        <span className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>You</span>
                        <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{new Date(selectedTicket.created_at).toLocaleString()}</span>
                      </div>
                      <div className={`p-4 rounded-2xl rounded-tl-sm text-sm whitespace-pre-wrap ${isDark ? 'bg-white/[0.06] text-gray-200' : 'bg-white border border-gray-100 text-gray-700 shadow-sm'}`}>
                        {selectedTicket.description}
                      </div>
                    </div>
                  </div>

                  {/* Comments */}
                  {ticketComments.map((comment) => {
                    const isClient = comment.user_id === user.id;
                    return (
                      <div key={comment.id} className="flex gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 font-bold ${isClient ? (isDark ? 'bg-[#F0564A]/20 text-[#F0564A]' : 'bg-[#F0564A]/10 text-[#F0564A]') : (isDark ? 'bg-[#5BCBD7]/20 text-[#5BCBD7]' : 'bg-[#5BCBD7]/10 text-[#5BCBD7]')}`}>
                          {isClient ? user.email?.charAt(0).toUpperCase() : 'M'}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-baseline gap-2 mb-1">
                            <span className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{isClient ? 'You' : 'MSC Support'}</span>
                            <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{new Date(comment.created_at).toLocaleString()}</span>
                          </div>
                          <div className={`p-4 rounded-2xl rounded-tl-sm text-sm whitespace-pre-wrap ${isClient ? (isDark ? 'bg-white/[0.06] text-gray-200' : 'bg-white border border-gray-100 text-gray-700 shadow-sm') : (isDark ? 'bg-[#5BCBD7]/10 text-gray-200' : 'bg-cyan-50 border border-cyan-100 text-gray-800 shadow-sm')}`}>
                            {comment.content}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Input Area */}
                <div className={`p-4 border-t shrink-0 ${isDark ? 'border-white/[0.08] bg-black/40' : 'border-gray-200 bg-white'}`}>
                  <div className={`flex gap-3 p-2 rounded-2xl border ${isDark ? 'bg-black/60 border-white/[0.1] focus-within:border-[#F0564A]/40' : 'bg-gray-50 border-gray-200 focus-within:border-[#F0564A]/40'}`}>
                    <input
                      type="text"
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder="Type a message..."
                      onKeyDown={(e) => { if(e.key === 'Enter') handleSubmitComment(); }}
                      className={`flex-1 bg-transparent border-none outline-none px-2 text-sm ${isDark ? 'text-white placeholder:text-gray-500' : 'text-gray-900 placeholder:text-gray-400'}`}
                    />
                    <Button
                      onClick={handleSubmitComment}
                      disabled={!commentText.trim()}
                      className="bg-[#F0564A] hover:bg-[#D94D42] text-white rounded-xl h-10 px-6 glow-spark-sm disabled:opacity-50"
                    >
                      Send
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ============ TASK CHAT MODAL ============ */}
      <AnimatePresence>
        {selectedTask && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedTask(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
            />
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.96 }}
              transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[92%] max-w-2xl max-h-[85vh] flex flex-col z-[101]"
            >
              <div className={`rounded-3xl border overflow-hidden flex flex-col h-full ${isDark ? 'glass-panel-dark' : 'glass-panel bg-white'}`}>
                {/* Header */}
                <div className={`p-6 border-b flex items-center justify-between shrink-0 ${isDark ? 'border-white/[0.08]' : 'border-gray-200'}`}>
                  <div>
                    <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{selectedTask.title}</h3>
                    <div className="flex items-center gap-2 mt-2">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold border capitalize ${getStatusColor(selectedTask.status)}`}>
                        {selectedTask.status.replace('_', ' ')}
                      </span>
                      <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        Task #{selectedTask.id.substring(0,8)}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedTask(null)}
                    className={`p-2 rounded-full transition-colors self-start ${isDark ? 'text-gray-400 hover:bg-white/[0.06]' : 'text-gray-500 hover:bg-gray-100'}`}
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                {/* Chat Area */}
                <div ref={taskChatScrollRef} className={`flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth ${isDark ? 'bg-black/20' : 'bg-gray-50/50'}`}>
                  {/* Task Metadata */}
                  <div className="flex gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 font-bold ${isDark ? 'bg-[#5BCBD7]/20 text-[#5BCBD7]' : 'bg-[#5BCBD7]/10 text-[#5BCBD7]'}`}>
                      M
                    </div>
                    <div className="flex-1">
                      <div className="flex items-baseline gap-2 mb-1">
                        <span className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>MSC Team</span>
                        <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{new Date(selectedTask.created_at).toLocaleString()}</span>
                      </div>
                      <div className={`p-4 rounded-2xl rounded-tl-sm text-sm whitespace-pre-wrap ${isDark ? 'bg-[#5BCBD7]/10 text-gray-200' : 'bg-cyan-50 border border-cyan-100 text-gray-800 shadow-sm'}`}>
                        {`Client Tag: ${selectedTask.client_tag || 'None'}`}
                      </div>
                    </div>
                  </div>

                  {/* Comments */}
                  {taskComments.map((comment) => {
                    const isClient = comment.user_id === user.id;
                    return (
                      <div key={comment.id} className="flex gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 font-bold ${isClient ? (isDark ? 'bg-[#F0564A]/20 text-[#F0564A]' : 'bg-[#F0564A]/10 text-[#F0564A]') : (isDark ? 'bg-[#5BCBD7]/20 text-[#5BCBD7]' : 'bg-[#5BCBD7]/10 text-[#5BCBD7]')}`}>
                          {isClient ? user.email?.charAt(0).toUpperCase() : 'M'}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-baseline gap-2 mb-1">
                            <span className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{isClient ? 'You' : 'MSC Support'}</span>
                            <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{new Date(comment.created_at).toLocaleString()}</span>
                          </div>
                          <div className={`p-4 rounded-2xl rounded-tl-sm text-sm whitespace-pre-wrap ${isClient ? (isDark ? 'bg-white/[0.06] text-gray-200' : 'bg-white border border-gray-100 text-gray-700 shadow-sm') : (isDark ? 'bg-[#5BCBD7]/10 text-gray-200' : 'bg-cyan-50 border border-cyan-100 text-gray-800 shadow-sm')}`}>
                            {comment.content}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Input Area */}
                <div className={`p-4 border-t shrink-0 ${isDark ? 'border-white/[0.08] bg-black/40' : 'border-gray-200 bg-white'}`}>
                  <div className={`flex gap-3 p-2 rounded-2xl border ${isDark ? 'bg-black/60 border-white/[0.1] focus-within:border-[#F0564A]/40' : 'bg-gray-50 border-gray-200 focus-within:border-[#F0564A]/40'}`}>
                    <input
                      type="text"
                      value={taskCommentText}
                      onChange={(e) => setTaskCommentText(e.target.value)}
                      placeholder="Add a comment to this task..."
                      onKeyDown={(e) => { if(e.key === 'Enter') handleSubmitTaskComment(); }}
                      className={`flex-1 bg-transparent border-none outline-none px-2 text-sm ${isDark ? 'text-white placeholder:text-gray-500' : 'text-gray-900 placeholder:text-gray-400'}`}
                    />
                    <Button
                      onClick={handleSubmitTaskComment}
                      disabled={!taskCommentText.trim()}
                      className="bg-[#F0564A] hover:bg-[#D94D42] text-white rounded-xl h-10 px-6 glow-spark-sm disabled:opacity-50"
                    >
                      Post
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
