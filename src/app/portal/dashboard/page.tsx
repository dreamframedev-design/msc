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
  Moon
} from "lucide-react";
import Image from "next/image";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

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
    <div className={`min-h-screen flex pt-24 ${isDark ? 'bg-[#0A0A0A] text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Sidebar */}
      <aside className={`w-64 border-r flex flex-col hidden md:flex h-[calc(100vh-6rem)] fixed left-0 top-24 z-30 ${isDark ? 'bg-[#111111] border-white/10' : 'bg-white border-gray-200'}`}>
        <div className={`p-6 border-b ${isDark ? 'border-white/10' : 'border-gray-200'}`}>
          <div className="flex items-center gap-3">
            <Image 
              src={isDark ? "/images/MSC LOGO BITTERSWEET VECTOR (1).svg" : "/images/MSC_Logo with blk tagline (1).svg"} 
              alt="MSC Logo" 
              width={isDark ? 32 : 120} 
              height={isDark ? 32 : 40} 
              className="object-contain"
            />
            {isDark && <span className="font-heading font-bold text-xl tracking-tight">Client Portal</span>}
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <button 
            onClick={() => setActiveTab("overview")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
              activeTab === "overview" 
                ? "bg-[#F0564A]/10 text-[#F0564A]" 
                : isDark ? "text-gray-400 hover:bg-white/5 hover:text-white" : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            }`}
          >
            <LayoutDashboard className="w-5 h-5" />
            <span className="font-medium">Overview</span>
          </button>
          <button 
            onClick={() => setActiveTab("tickets")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
              activeTab === "tickets" 
                ? "bg-[#F0564A]/10 text-[#F0564A]" 
                : isDark ? "text-gray-400 hover:bg-white/5 hover:text-white" : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            }`}
          >
            <Ticket className="w-5 h-5" />
            <span className="font-medium">Support Tickets</span>
          </button>
          <button 
            onClick={() => setActiveTab("files")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
              activeTab === "files" 
                ? "bg-[#F0564A]/10 text-[#F0564A]" 
                : isDark ? "text-gray-400 hover:bg-white/5 hover:text-white" : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            }`}
          >
            <FolderOpen className="w-5 h-5" />
            <span className="font-medium">File Vault</span>
          </button>
          <button 
            onClick={() => setActiveTab("billing")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
              activeTab === "billing" 
                ? "bg-[#F0564A]/10 text-[#F0564A]" 
                : isDark ? "text-gray-400 hover:bg-white/5 hover:text-white" : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            }`}
          >
            <CreditCard className="w-5 h-5" />
            <span className="font-medium">Billing & Invoices</span>
          </button>
          <button 
            onClick={() => setActiveTab("settings")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
              activeTab === "settings" 
                ? "bg-[#F0564A]/10 text-[#F0564A]" 
                : isDark ? "text-gray-400 hover:bg-white/5 hover:text-white" : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            }`}
          >
            <Settings className="w-5 h-5" />
            <span className="font-medium">Settings</span>
          </button>
        </nav>

        <div className={`p-4 border-t ${isDark ? 'border-white/10' : 'border-gray-200'}`}>
          <div className={`px-4 py-3 mb-2 rounded-xl border ${isDark ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'}`}>
            <p className={`text-xs uppercase tracking-wider font-bold mb-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Logged in as</p>
            <p className={`text-sm truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>{user.email}</p>
          </div>
          <button 
            onClick={handleSignOut}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${isDark ? 'text-gray-400 hover:bg-red-500/10 hover:text-red-500' : 'text-gray-600 hover:bg-red-50 hover:text-red-600'}`}
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-[calc(100vh-6rem)] ml-0 md:ml-64 relative">
        {/* Top Header */}
        <header className={`h-20 border-b flex items-center justify-between px-8 sticky top-24 z-40 backdrop-blur-xl ${isDark ? 'bg-[#0A0A0A]/80 border-white/10' : 'bg-white/80 border-gray-200'}`}>
          <h1 className="text-2xl font-heading font-bold capitalize">
            {activeTab === "overview" ? "Dashboard Overview" : activeTab === "tickets" ? "Support Tickets" : activeTab === "files" ? "File Vault" : activeTab}
          </h1>
          
          <div className="flex items-center gap-4">
            {/* Global Search Mock */}
            <div className={`hidden lg:flex items-center border rounded-full px-4 py-2 ${isDark ? 'bg-[#111111] border-white/10' : 'bg-gray-100 border-gray-200'}`}>
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
              <Button className="bg-[#F0564A] hover:bg-[#D94D42] text-white rounded-full px-6 shadow-[0_0_15px_rgba(240,86,74,0.3)]">
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
                  className="bg-[#F0564A] hover:bg-[#D94D42] text-white rounded-full px-6 shadow-[0_0_15px_rgba(240,86,74,0.3)]"
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
            <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* Welcome Banner */}
              <div className="bg-gradient-to-r from-[#111111] to-[#1a1a1a] border border-white/10 rounded-3xl p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#F0564A]/10 rounded-full blur-[80px] pointer-events-none" />
                <h2 className="text-3xl font-heading font-bold mb-2">Welcome back, Client! 👋</h2>
                <p className="text-gray-400 max-w-2xl">Here is what's happening with your brand ecosystem today. Your website traffic is up, and our team is currently reviewing your Q3 pitch deck revisions.</p>
              </div>

              {/* KPI Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-[#111111] border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-colors">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl">
                      <Activity className="w-6 h-6" />
                    </div>
                    <span className="flex items-center text-xs font-bold text-green-400 bg-green-400/10 px-2 py-1 rounded-full">
                      <TrendingUp className="w-3 h-3 mr-1" /> +24%
                    </span>
                  </div>
                  <p className="text-sm text-gray-400 font-medium mb-1">Website Traffic</p>
                  <h3 className="text-3xl font-bold">12,450</h3>
                </div>

                <div className="bg-[#111111] border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-colors">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-purple-500/10 text-purple-400 rounded-xl">
                      <Users className="w-6 h-6" />
                    </div>
                    <span className="flex items-center text-xs font-bold text-green-400 bg-green-400/10 px-2 py-1 rounded-full">
                      <TrendingUp className="w-3 h-3 mr-1" /> +12%
                    </span>
                  </div>
                  <p className="text-sm text-gray-400 font-medium mb-1">Active Leads</p>
                  <h3 className="text-3xl font-bold">342</h3>
                </div>

                <div className="bg-[#111111] border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-colors">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-yellow-500/10 text-yellow-400 rounded-xl">
                      <Ticket className="w-6 h-6" />
                    </div>
                  </div>
                  <p className="text-sm text-gray-400 font-medium mb-1">Open Tickets</p>
                  <h3 className="text-3xl font-bold">2</h3>
                </div>

                <div className="bg-[#111111] border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-colors">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-green-500/10 text-green-400 rounded-xl">
                      <FolderOpen className="w-6 h-6" />
                    </div>
                  </div>
                  <p className="text-sm text-gray-400 font-medium mb-1">Vault Storage</p>
                  <h3 className="text-3xl font-bold">1.2 <span className="text-lg text-gray-500">/ 50 GB</span></h3>
                </div>
              </div>

              {/* Charts & Activity Grid */}
              <div className="grid lg:grid-cols-3 gap-8">
                {/* Chart */}
                <div className="lg:col-span-2 bg-[#111111] border border-white/10 rounded-3xl p-8">
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h3 className="text-xl font-bold">Audience Growth</h3>
                      <p className="text-sm text-gray-400">Traffic & Engagement over time</p>
                    </div>
                    <select className="bg-black border border-white/10 rounded-lg px-3 py-1.5 text-sm text-gray-300 outline-none">
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
                        <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                        <XAxis dataKey="name" stroke="#666" tick={{fill: '#888', fontSize: 12}} tickLine={false} axisLine={false} />
                        <YAxis stroke="#666" tick={{fill: '#888', fontSize: 12}} tickLine={false} axisLine={false} />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#111', borderColor: '#333', borderRadius: '12px', color: '#fff' }}
                          itemStyle={{ color: '#fff' }}
                        />
                        <Area type="monotone" dataKey="traffic" stroke="#F0564A" strokeWidth={3} fillOpacity={1} fill="url(#colorTraffic)" />
                        <Area type="monotone" dataKey="engagement" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorEngagement)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-[#111111] border border-white/10 rounded-3xl p-8">
                  <h3 className="text-xl font-bold mb-6">Recent Activity</h3>
                  <div className="space-y-6">
                    <div className="flex gap-4">
                      <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0">
                        <FileText className="w-4 h-4 text-blue-400" />
                      </div>
                      <div>
                        <p className="text-sm text-white font-medium">New pitch deck uploaded</p>
                        <p className="text-xs text-gray-500 mt-1">MSC Team • 2 hours ago</p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="w-10 h-10 rounded-full bg-yellow-500/10 flex items-center justify-center shrink-0">
                        <Ticket className="w-4 h-4 text-yellow-400" />
                      </div>
                      <div>
                        <p className="text-sm text-white font-medium">Ticket #1042 status changed</p>
                        <p className="text-xs text-gray-400 mt-1">Status: <span className="text-yellow-400">In Progress</span></p>
                        <p className="text-xs text-gray-500 mt-1">Today, 10:23 AM</p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center shrink-0">
                        <CheckCircle2 className="w-4 h-4 text-green-400" />
                      </div>
                      <div>
                        <p className="text-sm text-white font-medium">Ticket #1038 resolved</p>
                        <p className="text-xs text-gray-500 mt-1">May 4, 2026</p>
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full mt-6 border-white/10 text-white hover:bg-white/10 hover:text-white">
                    View All Activity
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* TICKETS TAB */}
          {activeTab === "tickets" && (
            <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="bg-[#111111] border border-white/10 rounded-3xl overflow-hidden">
                <div className="p-6 border-b border-white/10 flex items-center justify-between bg-black/20">
                  <h3 className="text-lg font-bold">Active Requests</h3>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="border-white/10 text-gray-300 hover:bg-white/5">Filter</Button>
                    <Button variant="outline" size="sm" className="border-white/10 text-gray-300 hover:bg-white/5">Sort</Button>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-white/5 text-xs uppercase tracking-wider text-gray-500 bg-black/40">
                        <th className="p-4 font-medium">Ticket ID</th>
                        <th className="p-4 font-medium">Subject</th>
                        <th className="p-4 font-medium">Status</th>
                        <th className="p-4 font-medium">Priority</th>
                        <th className="p-4 font-medium">Last Updated</th>
                        <th className="p-4 font-medium text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {mockTickets.map((ticket, i) => (
                        <tr key={i} className="hover:bg-white/5 transition-colors group">
                          <td className="p-4 text-sm text-gray-400 font-mono">{ticket.id}</td>
                          <td className="p-4 text-sm font-medium text-white">{ticket.subject}</td>
                          <td className="p-4">
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${getStatusColor(ticket.status)}`}>
                              {ticket.status}
                            </span>
                          </td>
                          <td className="p-4">
                            <span className={`text-sm ${ticket.priority === 'Urgent' ? 'text-red-400' : ticket.priority === 'High' ? 'text-orange-400' : 'text-gray-400'}`}>
                              {ticket.priority}
                            </span>
                          </td>
                          <td className="p-4 text-sm text-gray-500">{ticket.date}</td>
                          <td className="p-4 text-right">
                            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity">
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
                <div className="bg-[#111111] border border-white/10 rounded-3xl p-6 hover:border-[#F0564A]/50 transition-colors cursor-pointer group shadow-lg">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-4 bg-blue-500/10 text-blue-400 rounded-2xl">
                      <FolderOpen className="w-8 h-8" />
                    </div>
                  </div>
                  <h3 className="font-bold text-xl mb-1 group-hover:text-[#F0564A] transition-colors">Brand Assets</h3>
                  <p className="text-sm text-gray-500">Logos, Fonts, Colors</p>
                </div>
                <div className="bg-[#111111] border border-white/10 rounded-3xl p-6 hover:border-[#F0564A]/50 transition-colors cursor-pointer group shadow-lg">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-4 bg-green-500/10 text-green-400 rounded-2xl">
                      <FolderOpen className="w-8 h-8" />
                    </div>
                  </div>
                  <h3 className="font-bold text-xl mb-1 group-hover:text-[#F0564A] transition-colors">Pitch Decks</h3>
                  <p className="text-sm text-gray-500">Final PDF & PPTX</p>
                </div>
                <div className="bg-[#111111] border border-white/10 rounded-3xl p-6 hover:border-[#F0564A]/50 transition-colors cursor-pointer group shadow-lg">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-4 bg-purple-500/10 text-purple-400 rounded-2xl">
                      <FolderOpen className="w-8 h-8" />
                    </div>
                  </div>
                  <h3 className="font-bold text-xl mb-1 group-hover:text-[#F0564A] transition-colors">Uploads</h3>
                  <p className="text-sm text-gray-500">Files you sent us</p>
                </div>
              </div>

              <h3 className="text-2xl font-bold mb-6">Your Files</h3>
              <div className="bg-[#111111] border border-white/10 rounded-3xl overflow-hidden shadow-xl">
                {files.length === 0 ? (
                  <div className="p-16 text-center">
                    <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                      <FileText className="w-10 h-10 text-gray-500" />
                    </div>
                    <h3 className="text-2xl font-bold mb-3">Your Vault is Empty</h3>
                    <p className="text-gray-400 mb-8 max-w-md mx-auto text-lg">Upload documents, images, or videos securely. Both you and the MSC team can access files stored here.</p>
                    <Button 
                      onClick={() => fileInputRef.current?.click()}
                      size="lg"
                      className="bg-white text-black hover:bg-gray-200 rounded-full px-8 font-bold"
                    >
                      Upload First File
                    </Button>
                  </div>
                ) : (
                  <div className="divide-y divide-white/5">
                    {files.map((file, idx) => (
                      <div key={idx} className="flex items-center justify-between p-6 hover:bg-white/5 transition-colors group">
                        <div className="flex items-center gap-5">
                          <div className="p-3 bg-white/5 rounded-xl text-gray-400 group-hover:text-[#F0564A] group-hover:bg-[#F0564A]/10 transition-colors">
                            <FileText className="w-6 h-6" />
                          </div>
                          <div>
                            <p className="font-bold text-white text-lg">{file.name}</p>
                            <p className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                              <span>{(file.metadata.size / 1024 / 1024).toFixed(2)} MB</span>
                              <span>•</span>
                              <span className="flex items-center"><Clock className="w-3 h-3 mr-1"/> {new Date(file.created_at).toLocaleDateString()}</span>
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Button 
                            onClick={() => handleDownload(file.name)}
                            variant="outline" 
                            className="border-white/10 text-gray-300 hover:text-white hover:bg-white/10 rounded-full px-6"
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
              <div className="bg-[#111111] border border-white/10 rounded-3xl p-8 mb-8 flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold mb-1">Current Balance</h3>
                  <p className="text-gray-400">Next invoice due on June 1, 2026</p>
                </div>
                <div className="text-right">
                  <h2 className="text-4xl font-bold text-white">$0.00</h2>
                  <p className="text-sm text-green-400 font-medium mt-1 flex items-center justify-end"><CheckCircle2 className="w-4 h-4 mr-1"/> All paid up</p>
                </div>
              </div>

              <h3 className="text-xl font-bold mb-4">Invoice History</h3>
              <div className="bg-[#111111] border border-white/10 rounded-3xl overflow-hidden">
                <div className="p-16 text-center">
                  <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                    <FileText className="w-8 h-8 text-gray-500" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">No Invoices Yet</h3>
                  <p className="text-gray-400">Your future invoices and payment history will appear here.</p>
                </div>
              </div>
            </div>
          )}

          {/* SETTINGS TAB */}
          {activeTab === "settings" && (
            <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
               <div className="bg-[#111111] border border-white/10 rounded-3xl p-8 shadow-xl">
                <div className="flex items-center gap-4 mb-8 pb-8 border-b border-white/10">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#F0564A] to-orange-500 flex items-center justify-center text-3xl font-bold text-white shadow-lg">
                    {user.email?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">Client Profile</h3>
                    <p className="text-gray-400">Manage your account settings and preferences.</p>
                  </div>
                </div>

                <div className="space-y-8">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-400">Email Address</label>
                      <input type="text" disabled value={user.email} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-gray-300 cursor-not-allowed focus:outline-none" />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-400">Company Name</label>
                      <input type="text" placeholder="Enter company name" className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#F0564A] transition-colors" />
                    </div>
                  </div>

                  <div className="pt-6 border-t border-white/10">
                    <h4 className="text-lg font-bold mb-4">Security</h4>
                    <Button variant="outline" className="border-white/20 text-black hover:bg-white/10 rounded-full px-6">
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