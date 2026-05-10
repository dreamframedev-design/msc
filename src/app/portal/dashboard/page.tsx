"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { LogOut, LayoutDashboard, Ticket, FolderOpen, Settings, Plus, FileText, Download } from "lucide-react";
import Image from "next/image";

export default function PortalDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("tickets");
  const [isLoading, setIsLoading] = useState(true);

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

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/portal");
  };

  if (isLoading) {
    return <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center text-white">Loading...</div>;
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[#111111] border-r border-white/10 flex flex-col hidden md:flex">
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <Image 
              src="/images/MSC LOGO BITTERSWEET VECTOR (1).svg" 
              alt="MSC Logo" 
              width={32} 
              height={32} 
              className="object-contain"
            />
            <span className="font-heading font-bold text-xl tracking-tight">Client Portal</span>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <button 
            onClick={() => setActiveTab("tickets")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === "tickets" ? "bg-[#F0564A]/10 text-[#F0564A]" : "text-gray-400 hover:bg-white/5 hover:text-white"}`}
          >
            <Ticket className="w-5 h-5" />
            <span className="font-medium">Support Tickets</span>
          </button>
          <button 
            onClick={() => setActiveTab("files")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === "files" ? "bg-[#F0564A]/10 text-[#F0564A]" : "text-gray-400 hover:bg-white/5 hover:text-white"}`}
          >
            <FolderOpen className="w-5 h-5" />
            <span className="font-medium">File Vault</span>
          </button>
          <button 
            onClick={() => setActiveTab("settings")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === "settings" ? "bg-[#F0564A]/10 text-[#F0564A]" : "text-gray-400 hover:bg-white/5 hover:text-white"}`}
          >
            <Settings className="w-5 h-5" />
            <span className="font-medium">Settings</span>
          </button>
        </nav>

        <div className="p-4 border-t border-white/10">
          <div className="px-4 py-3 mb-2">
            <p className="text-sm text-gray-400 truncate">{user.email}</p>
          </div>
          <button 
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:bg-red-500/10 hover:text-red-500 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Header */}
        <header className="h-20 border-b border-white/10 bg-[#111111]/50 backdrop-blur-md flex items-center justify-between px-8">
          <h1 className="text-2xl font-heading font-bold capitalize">
            {activeTab === "tickets" ? "Support Tickets" : activeTab === "files" ? "File Vault" : "Settings"}
          </h1>
          {activeTab === "tickets" && (
            <Button className="bg-[#F0564A] hover:bg-[#D94D42] text-white rounded-full px-6">
              <Plus className="w-4 h-4 mr-2" />
              New Ticket
            </Button>
          )}
          {activeTab === "files" && (
            <Button className="bg-[#F0564A] hover:bg-[#D94D42] text-white rounded-full px-6">
              <Plus className="w-4 h-4 mr-2" />
              Upload File
            </Button>
          )}
        </header>

        {/* Dynamic Content Area */}
        <div className="flex-1 overflow-y-auto p-8">
          
          {activeTab === "tickets" && (
            <div className="max-w-5xl mx-auto">
              <div className="bg-[#111111] border border-white/10 rounded-2xl p-8 text-center">
                <Ticket className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">No Active Tickets</h3>
                <p className="text-gray-400 mb-6 max-w-md mx-auto">You don't have any open support requests. If you need updates to your website, deck, or have a general inquiry, create a new ticket.</p>
                <Button variant="outline" className="border-white/20 text-black hover:bg-white/10 rounded-full">
                  Create First Ticket
                </Button>
              </div>
            </div>
          )}

          {activeTab === "files" && (
            <div className="max-w-5xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* Placeholder Folders */}
                <div className="bg-[#111111] border border-white/10 rounded-2xl p-6 hover:border-[#F0564A]/50 transition-colors cursor-pointer group">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl">
                      <FolderOpen className="w-6 h-6" />
                    </div>
                  </div>
                  <h3 className="font-bold text-lg mb-1 group-hover:text-[#F0564A] transition-colors">Brand Assets</h3>
                  <p className="text-sm text-gray-500">Logos, Fonts, Colors</p>
                </div>
                <div className="bg-[#111111] border border-white/10 rounded-2xl p-6 hover:border-[#F0564A]/50 transition-colors cursor-pointer group">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-green-500/10 text-green-400 rounded-xl">
                      <FolderOpen className="w-6 h-6" />
                    </div>
                  </div>
                  <h3 className="font-bold text-lg mb-1 group-hover:text-[#F0564A] transition-colors">Pitch Decks</h3>
                  <p className="text-sm text-gray-500">Final PDF & PPTX</p>
                </div>
                <div className="bg-[#111111] border border-white/10 rounded-2xl p-6 hover:border-[#F0564A]/50 transition-colors cursor-pointer group">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-purple-500/10 text-purple-400 rounded-xl">
                      <FolderOpen className="w-6 h-6" />
                    </div>
                  </div>
                  <h3 className="font-bold text-lg mb-1 group-hover:text-[#F0564A] transition-colors">Uploads</h3>
                  <p className="text-sm text-gray-500">Files you sent us</p>
                </div>
              </div>

              <h3 className="text-xl font-bold mb-4">Recent Files</h3>
              <div className="bg-[#111111] border border-white/10 rounded-2xl overflow-hidden">
                <div className="p-8 text-center">
                  <FileText className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2">Your Vault is Empty</h3>
                  <p className="text-gray-400 mb-6 max-w-md mx-auto">Upload documents, images, or videos securely. Both you and the MSC team can access files stored here.</p>
                  <Button variant="outline" className="border-white/20 text-black hover:bg-white/10 rounded-full">
                    Upload File
                  </Button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "settings" && (
            <div className="max-w-3xl mx-auto">
               <div className="bg-[#111111] border border-white/10 rounded-2xl p-8">
                <h3 className="text-xl font-bold mb-6">Account Settings</h3>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Email Address</label>
                    <input type="text" disabled value={user.email} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-gray-300 cursor-not-allowed" />
                  </div>
                  <Button variant="outline" className="border-white/20 text-black hover:bg-white/10 rounded-full">
                    Reset Password
                  </Button>
                </div>
               </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}