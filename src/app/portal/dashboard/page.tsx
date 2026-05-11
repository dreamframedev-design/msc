"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
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
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [isLoading, setIsLoading] = useState(true);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [recentUpload, setRecentUpload] = useState<string | null>(null);
  const [showNewTicket, setShowNewTicket] = useState(false);
  const [ticketFilter, setTicketFilter] = useState<"all" | "open" | "completed">("all");

  // Storage State
  const [files, setFiles] = useState<any[]>([]);
  const [isUploading, setIsUploading] = useState(false);
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
  }, [user, activeTab]);

  const fetchFiles = async () => {
    if (!user) return;
    const { data } = await supabase.storage.from('client-vault').list(user.id + '/');
    if (data) {
      setFiles(data.filter(f => f.name !== '.emptyFolderPlaceholder'));
    }
  };

  const uploadFile = async (file: File) => {
    if (!user) return;
    setIsUploading(true);
    setUploadProgress(0);

    // Simulated progress for visual feedback
    const progressInterval = setInterval(() => {
      setUploadProgress((p) => Math.min(p + Math.random() * 15, 90));
    }, 200);

    const filePath = `${user.id}/${file.name}`;
    const { error } = await supabase.storage.from('client-vault').upload(filePath, file, {
      upsert: true,
    });

    clearInterval(progressInterval);
    setUploadProgress(100);

    if (!error) {
      setRecentUpload(file.name);
      setTimeout(() => setRecentUpload(null), 3000);
      await fetchFiles();
    } else {
      alert("Error uploading file: " + error.message);
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

  const handleDownload = async (fileName: string) => {
    if (!user) return;
    const { data } = await supabase.storage.from('client-vault').download(`${user.id}/${fileName}`);
    if (data) {
      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const handleDelete = async (fileName: string) => {
    if (!user || !confirm(`Delete ${fileName}?`)) return;
    const { error } = await supabase.storage.from('client-vault').remove([`${user.id}/${fileName}`]);
    if (!error) {
      fetchFiles();
    } else {
      alert("Error deleting file: " + error.message);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/portal");
  };

  const filteredTickets = useMemo(() => {
    if (ticketFilter === "all") return mockTickets;
    if (ticketFilter === "completed") return mockTickets.filter(t => t.status === "Completed");
    return mockTickets.filter(t => t.status !== "Completed");
  }, [ticketFilter]);

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
        case "In Progress": return "text-amber-700 bg-amber-100 border-amber-200";
        case "Review": return "text-[#5BCBD7] bg-[#5BCBD7]/10 border-[#5BCBD7]/30";
        case "Completed": return "text-emerald-700 bg-emerald-100 border-emerald-200";
        default: return "text-gray-600 bg-gray-100 border-gray-200";
      }
    }
    switch (status) {
      case "In Progress": return "text-amber-300 bg-amber-400/10 border-amber-400/20";
      case "Review": return "text-[#5BCBD7] bg-[#5BCBD7]/10 border-[#5BCBD7]/20";
      case "Completed": return "text-emerald-400 bg-emerald-400/10 border-emerald-400/20";
      default: return "text-gray-400 bg-gray-400/10 border-gray-400/20";
    }
  };

  const isDark = theme === "dark";

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
            <Link href="/" className={`hidden md:flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-300 ${isDark ? 'border-white/[0.08] text-gray-300 hover:bg-white/[0.06] hover:text-white' : 'border-gray-200 text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}>
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm font-medium">Home</span>
            </Link>

            <div className={`hidden lg:flex items-center border rounded-full px-4 py-2 transition-all ${isDark ? 'bg-black/40 border-white/[0.08] focus-within:border-[#F0564A]/40' : 'bg-white/70 border-gray-200 focus-within:border-[#F0564A]/40'}`}>
              <Search className={`w-4 h-4 mr-2 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
              <input type="text" placeholder="Search..." className={`bg-transparent border-none outline-none text-sm w-48 ${isDark ? 'text-white placeholder:text-gray-500' : 'text-gray-900 placeholder:text-gray-400'}`} />
            </div>

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
                            <td className={`p-4 text-sm font-mono ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{ticket.id}</td>
                            <td className={`p-4 text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{ticket.subject}</td>
                            <td className="p-4">
                              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${getStatusColor(ticket.status)}`}>
                                {ticket.status}
                              </span>
                            </td>
                            <td className="p-4">
                              <span className={`text-sm font-medium ${ticket.priority === 'Urgent' ? 'text-red-400' : ticket.priority === 'High' ? 'text-[#F08435]' : isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                {ticket.priority}
                              </span>
                            </td>
                            <td className={`p-4 text-sm ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>{ticket.date}</td>
                            <td className="p-4 text-right">
                              <Button variant="ghost" size="sm" className={`${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'} group/btn`}>
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

          {/* ============ FILES ============ */}
          {activeTab === "files" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="max-w-6xl mx-auto"
            >
              {/* DRAG-AND-DROP ZONE */}
              <div
                ref={dropZoneRef}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`relative cursor-pointer rounded-3xl p-8 sm:p-10 mb-6 border-2 border-dashed transition-all duration-300 ${
                  isDragging
                    ? "dragging-active"
                    : isDark
                      ? "border-white/15 hover:border-[#F0564A]/40 glass-panel-dark"
                      : "border-gray-300 hover:border-[#F0564A]/40 glass-panel"
                }`}
              >
                {/* Upload progress overlay */}
                <AnimatePresence>
                  {isUploading && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className={`absolute inset-0 rounded-3xl flex items-center justify-center z-10 ${isDark ? 'bg-black/70' : 'bg-white/70'} backdrop-blur-sm`}
                    >
                      <div className="text-center w-full max-w-xs px-6">
                        <Loader2 className="w-10 h-10 mx-auto mb-4 animate-spin text-[#F0564A]" />
                        <p className={`text-sm font-bold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>Uploading... {Math.round(uploadProgress)}%</p>
                        <div className={`h-1.5 rounded-full overflow-hidden ${isDark ? 'bg-white/10' : 'bg-gray-200'}`}>
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

                <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                  <motion.div
                    animate={isDragging ? { y: [-4, 0, -4] } : { y: 0 }}
                    transition={{ duration: 1.2, repeat: Infinity }}
                    className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center shrink-0 ${isDragging ? "bg-[#F0564A]/20" : isDark ? "bg-white/[0.06]" : "bg-gray-100"}`}
                  >
                    {isDragging && (
                      <motion.div
                        className="absolute inset-0 rounded-2xl bg-[#F0564A]/30"
                        animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      />
                    )}
                    <UploadCloud className={`w-7 h-7 sm:w-9 sm:h-9 relative ${isDragging ? "text-[#F0564A]" : isDark ? "text-gray-400" : "text-gray-500"}`} />
                  </motion.div>
                  <div className="text-center sm:text-left flex-1">
                    <h3 className={`text-lg sm:text-xl font-bold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {isDragging ? "Drop it like it's hot 🔥" : "Drag & drop files here"}
                    </h3>
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      or click to browse · PDF, images, decks, videos accepted
                    </p>
                  </div>
                </div>
              </div>

              {/* Recent upload success toast */}
              <AnimatePresence>
                {recentUpload && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    className="mb-6 inline-flex items-center gap-3 px-5 py-3 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 backdrop-blur-md"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span className="text-sm font-medium">{recentUpload} uploaded successfully</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Folder Pills */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8">
                {[
                  { label: "Brand Assets", sub: "Logos, Fonts, Colors", accent: "#5BCBD7", count: 24 },
                  { label: "Pitch Decks", sub: "Final PDF & PPTX", accent: "#F08435", count: 8 },
                  { label: "Uploads", sub: "Files you sent us", accent: "#F0564A", count: files.length },
                ].map((folder, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                    whileHover={{ y: -3 }}
                    className={`cursor-pointer rounded-2xl p-5 border transition-all group ${isDark ? 'glass-panel-dark' : 'glass-panel'}`}
                    style={{ boxShadow: `0 0 0 1px ${folder.accent}28` }}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div
                        className="p-3 rounded-xl transition-transform group-hover:scale-110"
                        style={{ background: `${folder.accent}1F`, color: folder.accent }}
                      >
                        <FolderOpen className="w-6 h-6" />
                      </div>
                      <span className={`text-xs font-bold px-2 py-1 rounded-full ${isDark ? 'bg-white/[0.06] text-gray-400' : 'bg-gray-100 text-gray-500'}`}>
                        {folder.count}
                      </span>
                    </div>
                    <h3 className={`font-bold text-lg mb-0.5 group-hover:translate-x-0.5 transition-transform ${isDark ? 'text-white' : 'text-gray-900'}`}>{folder.label}</h3>
                    <p className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>{folder.sub}</p>
                  </motion.div>
                ))}
              </div>

              {/* File List */}
              <h3 className={`text-xl sm:text-2xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Your Files</h3>
              <div className={`rounded-3xl overflow-hidden border ${isDark ? 'glass-panel-dark' : 'glass-panel'}`}>
                {files.length === 0 ? (
                  <div className="p-12 sm:p-16 text-center">
                    <div className={`w-20 h-20 sm:w-24 sm:h-24 rounded-2xl flex items-center justify-center mx-auto mb-6 ${isDark ? 'bg-white/[0.04]' : 'bg-gray-100'}`}>
                      <FileText className={`w-9 h-9 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
                    </div>
                    <h3 className={`text-xl sm:text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>Your Vault is Empty</h3>
                    <p className={`mb-6 max-w-md mx-auto text-base ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Upload documents, images, or videos. Both you and the MSC team can access files stored here.</p>
                    <Button
                      onClick={() => fileInputRef.current?.click()}
                      size="lg"
                      className="bg-[#F0564A] hover:bg-[#D94D42] text-white rounded-full px-7 font-semibold glow-spark-sm glow-spark-hover"
                    >
                      <UploadCloud className="w-4 h-4 mr-2" />
                      Upload First File
                    </Button>
                  </div>
                ) : (
                  <div className={`divide-y ${isDark ? 'divide-white/[0.05]' : 'divide-gray-100'}`}>
                    {files.map((file, idx) => {
                      const { Icon, color, bg } = getFileIcon(file.name);
                      return (
                        <motion.div
                          key={file.name + idx}
                          layout
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.04 }}
                          className={`flex items-center justify-between p-4 sm:p-6 transition-colors group ${isDark ? 'hover:bg-white/[0.04]' : 'hover:bg-gray-50/60'}`}
                        >
                          <div className="flex items-center gap-4 min-w-0">
                            <div className={`p-3 rounded-xl ${bg} ${color} shrink-0 transition-transform group-hover:scale-105`}>
                              <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                            </div>
                            <div className="min-w-0">
                              <p className={`font-semibold text-sm sm:text-base truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>{file.name}</p>
                              <p className={`text-xs sm:text-sm flex items-center gap-2 mt-1 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                                <span>{(file.metadata.size / 1024 / 1024).toFixed(2)} MB</span>
                                <span>•</span>
                                <span className="flex items-center"><Clock className="w-3 h-3 mr-1" /> {new Date(file.created_at).toLocaleDateString()}</span>
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <Button
                              onClick={() => handleDownload(file.name)}
                              className={`border rounded-full px-4 sm:px-5 bg-transparent ${isDark ? 'border-white/[0.1] text-gray-300 hover:text-white hover:bg-white/[0.06]' : 'border-gray-200 text-gray-700 hover:text-gray-900 hover:bg-gray-50'}`}
                            >
                              <Download className="w-4 h-4 sm:mr-2" /> <span className="hidden sm:inline">Download</span>
                            </Button>
                            <Button
                              onClick={() => handleDelete(file.name)}
                              variant="ghost"
                              size="icon"
                              className="text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-full"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                            </Button>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </div>
            </motion.div>
          )}

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
                    <Button className={`border rounded-full px-6 bg-transparent ${isDark ? 'border-white/[0.15] text-white hover:bg-white/[0.06]' : 'border-gray-200 text-gray-900 hover:bg-gray-50'}`}>
                      Change Password
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

        </div>
      </main>

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
                          className={`py-2.5 rounded-xl text-sm font-semibold border transition-all ${isDark ? 'border-white/[0.1] text-gray-300 hover:bg-white/[0.06] hover:border-[#F0564A]/40' : 'border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-[#F0564A]/40'}`}
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
                      placeholder="Add details, links, or context..."
                      className={`w-full border rounded-xl px-4 py-3 focus:outline-none focus:border-[#F0564A] transition-colors resize-none ${isDark ? 'bg-black/40 border-white/[0.08] text-white placeholder:text-gray-500' : 'bg-white border-gray-200 text-gray-900'}`}
                    />
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
                    onClick={() => setShowNewTicket(false)}
                    className="bg-[#F0564A] hover:bg-[#D94D42] text-white rounded-full px-6 glow-spark-sm glow-spark-hover"
                  >
                    Submit Ticket
                  </Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
