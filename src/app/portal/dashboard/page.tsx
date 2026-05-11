"use client";

import { useState, useEffect, useRef } from "react";
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
  BarChart3,
  TrendingUp,
  Users,
  Activity,
  CreditCard,
  Bell,
  Search,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  Sun,
  Moon,
  ArrowLeft
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';

// Mock Data for Analytics
const mockChartData = [
  { name: 'Jan', traffic: 4000, engagement: 2400 },
  { name: 'Feb', traffic: 3000, engagement: 1398 },
  { name: 'Mar', traffic: 2000, engagement: 9800 },
  { name: 'Apr', traffic: 2780, engagement: 3908 },
  { name: 'May', traffic: 1890, engagement: 4800 },
  { name: 'Jun', traffic: 2390, engagement: 3800 },
  { name: 'Jul', traffic: 3490, engagement: 4300 },
];

// Mock Data for Tickets
const mockTickets = [
  { id: "T-1042", subject: "Update Leadership Team Page", status: "In Progress", priority: "Normal", date: "Today, 10:23 AM" },
  { id: "T-1041", subject: "Q3 Investor Deck Revisions", status: "Review", priority: "High", date: "Yesterday" },
  { id: "T-1038", subject: "New Press Release Distribution", status: "Completed", priority: "Urgent", date: "May 4, 2026" },
  { id: "T-1035", subject: "Fix broken link on Contact page", status: "Completed", priority: "Normal", date: "May 1, 2026" },
];

export default function PortalDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [isLoading, setIsLoading] = useState(true);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  
  // Storage State
  const [files, setFiles] = useState<any[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  // Fetch files when tab changes to 'files'
  useEffect(() => {
    if (user && activeTab === "files") {
      fetchFiles();
    }
  }, [user, activeTab]);

  const fetchFiles = async () => {
    if (!user) return;
    const { data, error } = await supabase.storage.from('client-vault').list(user.id + '/');
    if (data) {
      // Filter out the empty placeholder file that Supabase sometimes creates for folders
      setFiles(data.filter(f => f.name !== '.emptyFolderPlaceholder'));
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0 || !user) return;
    
    const file = e.target.files[0];
    setIsUploading(true);
    
    // Store files in a folder named after the user's ID
    const filePath = `${user.id}/${file.name}`;
    
    const { error } = await supabase.storage.from('client-vault').upload(filePath, file, { 
      upsert: true 
    });
    
    if (!error) {
      fetchFiles();
    } else {
      alert("Error uploading file: " + error.message);
    }
    
    setIsUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDownload = async (fileName: string) => {
    if (!user) return;
    const { data, error } = await supabase.storage.from('client-vault').download(`${user.id}/${fileName}`);
    
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
    if (!user || !confirm(`Are you sure you want to delete ${fileName}?`)) return;
    
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

  if (isLoading) {
    return <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center text-white">
      <Loader2 className="w-8 h-8 animate-spin text-[#F0564A]" />
    </div>;
  }

  if (!user) return null;

  const getStatusColor = (status: string) => {
    if (theme === "light") {
      switch(status) {
        case "In Progress": return "text-yellow-600 bg-yellow-100 border-yellow-200";
        case "Review": return "text-blue-600 bg-blue-100 border-blue-200";
        case "Completed": return "text-green-600 bg-green-100 border-green-200";
        default: return "text-gray-600 bg-gray-100 border-gray-200";
      }
    }
    switch(status) {
      case "In Progress": return "text-yellow-400 bg-yellow-400/10 border-yellow-400/20";
      case "Review": return "text-blue-400 bg-blue-400/10 border-blue-400/20";
      case "Completed": return "text-green-400 bg-green-400/10 border-green-400/20";
      default: return "text-gray-400 bg-gray-400/10 border-gray-400/20";
    }
  };

  const isDark = theme === "dark";

  return (
    <div className={`min-h-screen flex relative ${isDark ? 'text-white' : 'text-gray-900'}`}>
      {/* Fixed Background Image */}
      <div className="fixed inset-0 z-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab === "tickets" ? "tickets-bg" : "default-bg"}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0"
          >
            <Image 
              src={activeTab === "tickets" 
                ? "/images/flowsaber_a_beautiful_scientific_biotech_close_up_molecular_mic_231de8ff-e324-440e-9056-b28133c799dc_edited (1).jpg" 
                : "/images/flowsaber_minimal_simple_opening_photorealistic_cinematic_shot__42eeffda-30d1-41a4-8f73-c49a4ac32608.png"}
              alt="Portal Background"
              fill
              className="object-cover"
              priority
            />
          </motion.div>
        </AnimatePresence>
        {/* Gradient Overlay for readability */}
        <div className={`absolute inset-0 ${isDark ? 'bg-black/80' : 'bg-white/80'} backdrop-blur-[2px] transition-colors duration-500`} />
      </div>

      {/* Sidebar */}
      <aside className={`w-64 border-r flex flex-col hidden md:flex h-screen fixed left-0 top-0 z-50 ${isDark ? 'bg-black/40 backdrop-blur-2xl border-white/10' : 'bg-white/60 backdrop-blur-2xl border-gray-200'}`}>
        <div className={`p-6 border-b ${isDark ? 'border-white/10' : 'border-gray-200'}`}>
          <div className="flex items-center gap-3">
            <Image 
              src="/images/MSC LOGO BITTERSWEET VECTOR (1).svg" 
              alt="MSC Logo" 
              width={32} 
              height={32} 
              className="object-contain"
            />
            <span className={`font-heading font-bold text-xl tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>Client Portal</span>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <button 
            onClick={() => setActiveTab("overview")}
            className={`group w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
              activeTab === "overview" 
                ? "bg-[#F0564A]/10 text-[#F0564A]" 
                : isDark ? "text-gray-400 hover:bg-white/5 hover:text-white" : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            }`}
          >
            <LayoutDashboard className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span className="font-medium group-hover:translate-x-1 transition-transform">Overview</span>
          </button>
          <button 
            onClick={() => setActiveTab("tickets")}
            className={`group w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
              activeTab === "tickets" 
                ? "bg-[#F0564A]/10 text-[#F0564A]" 
                : isDark ? "text-gray-400 hover:bg-white/5 hover:text-white" : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            }`}
          >
            <Ticket className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span className="font-medium group-hover:translate-x-1 transition-transform">Support Tickets</span>
          </button>
          <button 
            onClick={() => setActiveTab("files")}
            className={`group w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
              activeTab === "files" 
                ? "bg-[#F0564A]/10 text-[#F0564A]" 
                : isDark ? "text-gray-400 hover:bg-white/5 hover:text-white" : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            }`}
          >
            <FolderOpen className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span className="font-medium group-hover:translate-x-1 transition-transform">File Vault</span>
          </button>
          <button 
            onClick={() => setActiveTab("billing")}
            className={`group w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
              activeTab === "billing" 
                ? "bg-[#F0564A]/10 text-[#F0564A]" 
                : isDark ? "text-gray-400 hover:bg-white/5 hover:text-white" : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            }`}
          >
            <CreditCard className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span className="font-medium group-hover:translate-x-1 transition-transform">Billing & Invoices</span>
          </button>
          <button 
            onClick={() => setActiveTab("settings")}
            className={`group w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
              activeTab === "settings" 
                ? "bg-[#F0564A]/10 text-[#F0564A]" 
                : isDark ? "text-gray-400 hover:bg-white/5 hover:text-white" : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            }`}
          >
            <Settings className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span className="font-medium group-hover:translate-x-1 transition-transform">Settings</span>
          </button>
        </nav>

        <div className={`p-4 border-t ${isDark ? 'border-white/10' : 'border-gray-200'}`}>
          <div className={`px-4 py-3 mb-2 rounded-xl border backdrop-blur-xl ${isDark ? 'bg-black/40 border-white/10' : 'bg-white/60 border-gray-200'}`}>
            <p className={`text-xs uppercase tracking-wider font-bold mb-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Logged in as</p>
            <p className={`text-sm truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>{user.email}</p>
          </div>
          <button 
            onClick={handleSignOut}
            className={`group w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${isDark ? 'text-gray-400 hover:bg-red-500/20 hover:text-red-500' : 'text-gray-600 hover:bg-red-50 hover:text-red-600'}`}
          >
            <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen ml-0 md:ml-64 relative z-40">
        {/* Top Header */}
        <header className={`h-20 border-b flex items-center justify-between px-8 sticky top-0 z-40 backdrop-blur-2xl ${isDark ? 'bg-black/40 border-white/10' : 'bg-white/60 border-gray-200'}`}>
          <h1 className={`text-2xl font-heading font-bold capitalize ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {activeTab === "overview" ? "Dashboard Overview" : activeTab === "tickets" ? "Support Tickets" : activeTab === "files" ? "File Vault" : activeTab}
          </h1>
          
          <div className="flex items-center gap-4">
            <Link href="/" className={`hidden md:flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-300 ${isDark ? 'border-white/10 text-gray-300 hover:bg-white/10 hover:text-white' : 'border-gray-200 text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}>
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm font-medium">Home</span>
            </Link>

            {/* Global Search Mock */}
            <div className={`hidden lg:flex items-center border rounded-full px-4 py-2 ${isDark ? 'bg-black/40 border-white/10' : 'bg-white/60 border-gray-200'}`}>
              <Search className={`w-4 h-4 mr-2 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
              <input type="text" placeholder="Search..." className={`bg-transparent border-none outline-none text-sm w-48 ${isDark ? 'text-white placeholder:text-gray-500' : 'text-gray-900 placeholder:text-gray-400'}`} />
            </div>

            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setTheme(isDark ? "light" : "dark")}
              className={`rounded-full ${isDark ? 'text-gray-400 hover:text-white hover:bg-white/10' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`}
              title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>

            <Button variant="ghost" size="icon" className={`rounded-full ${isDark ? 'text-gray-400 hover:text-white hover:bg-white/10' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`}>
              <Bell className="w-5 h-5" />
            </Button>

            {activeTab === "tickets" && (
              <Button className="bg-[#F0564A] hover:bg-[#D94D42] text-white rounded-full px-6 shadow-[0_0_15px_rgba(240,86,74,0.3)] hover:shadow-[0_0_25px_rgba(240,86,74,0.5)] transition-all hover:scale-105">
                <Plus className="w-4 h-4 mr-2" />
                New Ticket
              </Button>
            )}
            {activeTab === "files" && (
              <>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileUpload} 
                  className="hidden" 
                />
                <Button 
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="bg-[#F0564A] hover:bg-[#D94D42] text-white rounded-full px-6 shadow-[0_0_15px_rgba(240,86,74,0.3)] hover:shadow-[0_0_25px_rgba(240,86,74,0.5)] transition-all hover:scale-105"
                >
                  {isUploading ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Plus className="w-4 h-4 mr-2" />
                  )}
                  {isUploading ? "Uploading..." : "Upload File"}
                </Button>
              </>
            )}
          </div>
        </header>

        {/* Dynamic Content Area */}
        <div className="flex-1 p-8 overflow-x-hidden">
          
          {/* OVERVIEW TAB */}
          {activeTab === "overview" && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-7xl mx-auto space-y-8"
            >
              {/* Welcome Banner */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className={`bg-gradient-to-r ${isDark ? 'from-black/60 to-black/40 border-white/10' : 'from-white/80 to-white/60 border-gray-200'} backdrop-blur-xl border rounded-3xl p-8 relative overflow-hidden shadow-xl`}
              >
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#F0564A]/10 rounded-full blur-[80px] pointer-events-none" />
                <h2 className={`text-3xl font-heading font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r ${isDark ? 'from-white to-gray-400' : 'from-gray-900 to-gray-500'}`}>Welcome back, Client! 👋</h2>
                <p className={`max-w-2xl ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Here is what's happening with your brand ecosystem today. Your website traffic is up, and our team is currently reviewing your Q3 pitch deck revisions.</p>
              </motion.div>

              {/* KPI Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { title: "Website Traffic", value: "12,450", icon: Activity, color: "blue", trend: "+24%" },
                  { title: "Active Leads", value: "342", icon: Users, color: "purple", trend: "+12%" },
                  { title: "Open Tickets", value: "2", icon: Ticket, color: "yellow" },
                  { title: "Vault Storage", value: "1.2", suffix: " / 50 GB", icon: FolderOpen, color: "green" }
                ].map((kpi, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                    whileHover={{ y: -5, scale: 1.02 }}
                    className={`${isDark ? 'bg-black/40 backdrop-blur-xl border-white/10 hover:border-white/30 hover:shadow-[0_0_30px_rgba(255,255,255,0.05)]' : 'bg-white/60 backdrop-blur-xl border-gray-200 hover:border-gray-300 hover:shadow-[0_0_30px_rgba(0,0,0,0.05)]'} border rounded-2xl p-6 transition-all duration-300 relative overflow-hidden group`}
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br from-${kpi.color}-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                    <div className="flex justify-between items-start mb-4 relative z-10">
                      <div className={`p-3 bg-${kpi.color}-500/10 text-${kpi.color}-500 rounded-xl`}>
                        <kpi.icon className="w-6 h-6" />
                      </div>
                      {kpi.trend && (
                        <span className="flex items-center text-xs font-bold text-green-500 bg-green-500/10 px-2 py-1 rounded-full">
                          <TrendingUp className="w-3 h-3 mr-1" /> {kpi.trend}
                        </span>
                      )}
                    </div>
                    <p className={`text-sm font-medium mb-1 relative z-10 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{kpi.title}</p>
                    <h3 className="text-3xl font-bold relative z-10">
                      {kpi.value} {kpi.suffix && <span className={`text-lg ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{kpi.suffix}</span>}
                    </h3>
                  </motion.div>
                ))}
              </div>

              {/* Charts & Activity Grid */}
              <div className="grid lg:grid-cols-3 gap-8">
                {/* Chart */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  className={`lg:col-span-2 ${isDark ? 'bg-black/40 backdrop-blur-xl border-white/10' : 'bg-white/60 backdrop-blur-xl border-gray-200'} border rounded-3xl p-8 hover:shadow-[0_0_40px_rgba(240,86,74,0.05)] transition-shadow duration-500`}
                >
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Audience Growth</h3>
                      <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Traffic & Engagement over time</p>
                    </div>
                    <select className={`${isDark ? 'bg-black border-white/10 text-gray-300' : 'bg-gray-50 border-gray-200 text-gray-700'} border rounded-lg px-3 py-1.5 text-sm outline-none`}>
                      <option>Last 6 Months</option>
                      <option>This Year</option>
                      <option>All Time</option>
                    </select>
                  </div>
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={mockChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorTraffic" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#F0564A" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#F0564A" stopOpacity={0}/>
                          </linearGradient>
                          <linearGradient id="colorEngagement" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#333" : "#eee"} vertical={false} />
                        <XAxis dataKey="name" stroke={isDark ? "#666" : "#999"} tick={{fill: isDark ? '#888' : '#666', fontSize: 12}} tickLine={false} axisLine={false} />
                        <YAxis stroke={isDark ? "#666" : "#999"} tick={{fill: isDark ? '#888' : '#666', fontSize: 12}} tickLine={false} axisLine={false} />
                        <Tooltip 
                          contentStyle={{ backgroundColor: isDark ? '#111' : '#fff', borderColor: isDark ? '#333' : '#eee', borderRadius: '12px', color: isDark ? '#fff' : '#000' }}
                          itemStyle={{ color: isDark ? '#fff' : '#000' }}
                        />
                        <Area type="monotone" dataKey="traffic" stroke="#F0564A" strokeWidth={3} fillOpacity={1} fill="url(#colorTraffic)" />
                        <Area type="monotone" dataKey="engagement" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorEngagement)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </motion.div>

                {/* Recent Activity */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.7 }}
                  className={`${isDark ? 'bg-black/40 backdrop-blur-xl border-white/10' : 'bg-white/60 backdrop-blur-xl border-gray-200'} border rounded-3xl p-8 hover:shadow-[0_0_40px_rgba(139,92,246,0.05)] transition-shadow duration-500`}
                >
                  <h3 className={`text-xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>Recent Activity</h3>
                  <div className="space-y-6">
                    <div className="flex gap-4 group">
                      <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-blue-500/20 transition-all">
                        <FileText className="w-4 h-4 text-blue-500" />
                      </div>
                      <div>
                        <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>New pitch deck uploaded</p>
                        <p className={`text-xs mt-1 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>MSC Team • 2 hours ago</p>
                      </div>
                    </div>
                    <div className="flex gap-4 group">
                      <div className="w-10 h-10 rounded-full bg-yellow-500/10 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-yellow-500/20 transition-all">
                        <Ticket className="w-4 h-4 text-yellow-500" />
                      </div>
                      <div>
                        <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>Ticket #1042 status changed</p>
                        <p className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Status: <span className="text-yellow-500 font-medium">In Progress</span></p>
                        <p className={`text-xs mt-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Today, 10:23 AM</p>
                      </div>
                    </div>
                    <div className="flex gap-4 group">
                      <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-green-500/20 transition-all">
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                      </div>
                      <div>
                        <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>Ticket #1038 resolved</p>
                        <p className={`text-xs mt-1 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>May 4, 2026</p>
                      </div>
                    </div>
                  </div>
                  <Button className={`w-full mt-6 border bg-transparent ${isDark ? 'border-white/10 text-white hover:bg-white/10' : 'border-gray-200 text-gray-900 hover:bg-gray-50'}`}>
                    View All Activity
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          )}

          {/* TICKETS TAB */}
          {activeTab === "tickets" && (
            <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className={`${isDark ? 'bg-black/40 backdrop-blur-xl border-white/10' : 'bg-white/60 backdrop-blur-xl border-gray-200'} border rounded-3xl overflow-hidden shadow-xl`}>
                <div className={`p-6 border-b flex items-center justify-between ${isDark ? 'border-white/10 bg-black/20' : 'border-gray-200 bg-gray-50/50'}`}>
                  <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Active Requests</h3>
                  <div className="flex gap-2">
                    <Button size="sm" className={`border bg-transparent ${isDark ? 'border-white/10 text-gray-300 hover:bg-white/5' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}>Filter</Button>
                    <Button size="sm" className={`border bg-transparent ${isDark ? 'border-white/10 text-gray-300 hover:bg-white/5' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}>Sort</Button>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className={`border-b text-xs uppercase tracking-wider ${isDark ? 'border-white/5 text-gray-500 bg-black/40' : 'border-gray-200 text-gray-500 bg-gray-50'}`}>
                        <th className="p-4 font-medium">Ticket ID</th>
                        <th className="p-4 font-medium">Subject</th>
                        <th className="p-4 font-medium">Status</th>
                        <th className="p-4 font-medium">Priority</th>
                        <th className="p-4 font-medium">Last Updated</th>
                        <th className="p-4 font-medium text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className={`divide-y ${isDark ? 'divide-white/5' : 'divide-gray-100'}`}>
                      {mockTickets.map((ticket, i) => (
                        <tr key={i} className={`transition-colors group ${isDark ? 'hover:bg-white/5' : 'hover:bg-gray-50'}`}>
                          <td className={`p-4 text-sm font-mono ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{ticket.id}</td>
                          <td className={`p-4 text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{ticket.subject}</td>
                          <td className="p-4">
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${getStatusColor(ticket.status)}`}>
                              {ticket.status}
                            </span>
                          </td>
                          <td className="p-4">
                            <span className={`text-sm ${ticket.priority === 'Urgent' ? 'text-red-500' : ticket.priority === 'High' ? 'text-orange-500' : isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                              {ticket.priority}
                            </span>
                          </td>
                          <td className={`p-4 text-sm ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>{ticket.date}</td>
                          <td className="p-4 text-right">
                            <Button variant="ghost" size="sm" className={`${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'} opacity-0 group-hover:opacity-100 transition-opacity`}>
                              View Details <ArrowUpRight className="w-4 h-4 ml-1" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* FILES TAB */}
          {activeTab === "files" && (
            <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* Placeholder Folders */}
                <div className={`${isDark ? 'bg-black/40 backdrop-blur-xl border-white/10' : 'bg-white/60 backdrop-blur-xl border-gray-200'} border rounded-3xl p-6 hover:border-[#F0564A]/50 transition-colors cursor-pointer group shadow-lg`}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-4 bg-blue-500/10 text-blue-500 rounded-2xl">
                      <FolderOpen className="w-8 h-8" />
                    </div>
                  </div>
                  <h3 className={`font-bold text-xl mb-1 group-hover:text-[#F0564A] transition-colors ${isDark ? 'text-white' : 'text-gray-900'}`}>Brand Assets</h3>
                  <p className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>Logos, Fonts, Colors</p>
                </div>
                <div className={`${isDark ? 'bg-black/40 backdrop-blur-xl border-white/10' : 'bg-white/60 backdrop-blur-xl border-gray-200'} border rounded-3xl p-6 hover:border-[#F0564A]/50 transition-colors cursor-pointer group shadow-lg`}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-4 bg-green-500/10 text-green-500 rounded-2xl">
                      <FolderOpen className="w-8 h-8" />
                    </div>
                  </div>
                  <h3 className={`font-bold text-xl mb-1 group-hover:text-[#F0564A] transition-colors ${isDark ? 'text-white' : 'text-gray-900'}`}>Pitch Decks</h3>
                  <p className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>Final PDF & PPTX</p>
                </div>
                <div className={`${isDark ? 'bg-black/40 backdrop-blur-xl border-white/10' : 'bg-white/60 backdrop-blur-xl border-gray-200'} border rounded-3xl p-6 hover:border-[#F0564A]/50 transition-colors cursor-pointer group shadow-lg`}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-4 bg-purple-500/10 text-purple-500 rounded-2xl">
                      <FolderOpen className="w-8 h-8" />
                    </div>
                  </div>
                  <h3 className={`font-bold text-xl mb-1 group-hover:text-[#F0564A] transition-colors ${isDark ? 'text-white' : 'text-gray-900'}`}>Uploads</h3>
                  <p className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>Files you sent us</p>
                </div>
              </div>

              <h3 className={`text-2xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>Your Files</h3>
              <div className={`${isDark ? 'bg-black/40 backdrop-blur-xl border-white/10' : 'bg-white/60 backdrop-blur-xl border-gray-200'} border rounded-3xl overflow-hidden shadow-xl`}>
                {files.length === 0 ? (
                  <div className="p-16 text-center">
                    <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 ${isDark ? 'bg-white/5' : 'bg-gray-100'}`}>
                      <FileText className={`w-10 h-10 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
                    </div>
                    <h3 className={`text-2xl font-bold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>Your Vault is Empty</h3>
                    <p className={`mb-8 max-w-md mx-auto text-lg ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Upload documents, images, or videos securely. Both you and the MSC team can access files stored here.</p>
                    <Button 
                      onClick={() => fileInputRef.current?.click()}
                      size="lg"
                      className={`${isDark ? 'bg-white text-black hover:bg-gray-200' : 'bg-gray-900 text-white hover:bg-gray-800'} rounded-full px-8 font-bold`}
                    >
                      Upload First File
                    </Button>
                  </div>
                ) : (
                  <div className={`divide-y ${isDark ? 'divide-white/5' : 'divide-gray-100'}`}>
                    {files.map((file, idx) => (
                      <div key={idx} className={`flex items-center justify-between p-6 transition-colors group ${isDark ? 'hover:bg-white/5' : 'hover:bg-gray-50'}`}>
                        <div className="flex items-center gap-5">
                          <div className={`p-3 rounded-xl transition-colors ${isDark ? 'bg-white/5 text-gray-400 group-hover:text-[#F0564A] group-hover:bg-[#F0564A]/10' : 'bg-gray-100 text-gray-500 group-hover:text-[#F0564A] group-hover:bg-[#F0564A]/10'}`}>
                            <FileText className="w-6 h-6" />
                          </div>
                          <div>
                            <p className={`font-bold text-lg ${isDark ? 'text-white' : 'text-gray-900'}`}>{file.name}</p>
                            <p className={`text-sm flex items-center gap-2 mt-1 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                              <span>{(file.metadata.size / 1024 / 1024).toFixed(2)} MB</span>
                              <span>•</span>
                              <span className="flex items-center"><Clock className="w-3 h-3 mr-1"/> {new Date(file.created_at).toLocaleDateString()}</span>
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Button 
                            onClick={() => handleDownload(file.name)}
                            className={`border rounded-full px-6 bg-transparent ${isDark ? 'border-white/10 text-gray-300 hover:text-white hover:bg-white/10' : 'border-gray-200 text-gray-700 hover:text-gray-900 hover:bg-gray-50'}`}
                          >
                            <Download className="w-4 h-4 mr-2" /> Download
                          </Button>
                          <Button 
                            onClick={() => handleDelete(file.name)}
                            variant="ghost" 
                            size="icon" 
                            className="text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-full"
                            title="Delete"
                          >
                            <Trash2 className="w-5 h-5" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* BILLING TAB (Mock) */}
          {activeTab === "billing" && (
            <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className={`${isDark ? 'bg-black/40 backdrop-blur-xl border-white/10' : 'bg-white/60 backdrop-blur-xl border-gray-200'} border rounded-3xl p-8 mb-8 flex items-center justify-between`}>
                <div>
                  <h3 className={`text-xl font-bold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>Current Balance</h3>
                  <p className={isDark ? 'text-gray-400' : 'text-gray-500'}>Next invoice due on June 1, 2026</p>
                </div>
                <div className="text-right">
                  <h2 className={`text-4xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>$0.00</h2>
                  <p className="text-sm text-green-500 font-medium mt-1 flex items-center justify-end"><CheckCircle2 className="w-4 h-4 mr-1"/> All paid up</p>
                </div>
              </div>

              <h3 className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Invoice History</h3>
              <div className={`${isDark ? 'bg-black/40 backdrop-blur-xl border-white/10' : 'bg-white/60 backdrop-blur-xl border-gray-200'} border rounded-3xl overflow-hidden shadow-xl`}>
                <div className="p-16 text-center">
                  <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${isDark ? 'bg-white/5' : 'bg-gray-100'}`}>
                    <FileText className={`w-8 h-8 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
                  </div>
                  <h3 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>No Invoices Yet</h3>
                  <p className={isDark ? 'text-gray-400' : 'text-gray-500'}>Your future invoices and payment history will appear here.</p>
                </div>
              </div>
            </div>
          )}

          {/* SETTINGS TAB */}
          {activeTab === "settings" && (
            <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
               <div className={`${isDark ? 'bg-black/40 backdrop-blur-xl border-white/10' : 'bg-white/60 backdrop-blur-xl border-gray-200'} border rounded-3xl p-8 shadow-xl`}>
                <div className={`flex items-center gap-4 mb-8 pb-8 border-b ${isDark ? 'border-white/10' : 'border-gray-200'}`}>
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#F0564A] to-orange-500 flex items-center justify-center text-3xl font-bold text-white shadow-lg">
                    {user.email?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Client Profile</h3>
                    <p className={isDark ? 'text-gray-400' : 'text-gray-500'}>Manage your account settings and preferences.</p>
                  </div>
                </div>

                <div className="space-y-8">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className={`block text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-700'}`}>Email Address</label>
                      <input type="text" disabled value={user.email} className={`w-full border rounded-xl px-4 py-3 cursor-not-allowed focus:outline-none ${isDark ? 'bg-black/50 border-white/10 text-gray-300' : 'bg-gray-50 border-gray-200 text-gray-500'}`} />
                    </div>
                    <div className="space-y-2">
                      <label className={`block text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-700'}`}>Company Name</label>
                      <input type="text" placeholder="Enter company name" className={`w-full border rounded-xl px-4 py-3 focus:outline-none focus:border-[#F0564A] transition-colors ${isDark ? 'bg-black/50 border-white/10 text-white' : 'bg-white border-gray-200 text-gray-900'}`} />
                    </div>
                  </div>

                  <div className={`pt-6 border-t ${isDark ? 'border-white/10' : 'border-gray-200'}`}>
                    <h4 className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Security</h4>
                    <Button className={`border rounded-full px-6 bg-transparent ${isDark ? 'border-white/20 text-white hover:bg-white/10' : 'border-gray-200 text-gray-900 hover:bg-gray-50'}`}>
                      Change Password
                    </Button>
                  </div>
                </div>
               </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}