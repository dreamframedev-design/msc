"use client";

import React, { useRef, useState } from 'react';
import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion';
import {
  LayoutDashboard,
  FileText,
  Users,
  Settings,
  Bell,
  Search,
  TrendingUp,
  Activity,
  Clock,
  CheckCircle2,
  Download,
  Filter,
  MoreVertical,
  FolderOpen
} from 'lucide-react';

// Scroll-linked animated number — counts up as the user scrolls into the dashboard
function ScrollCounter({ to, suffix = "", enter }: { to: number; suffix?: string; enter: MotionValue<number> }) {
  const display = useTransform(enter, (v) => {
    const eased = Math.min(1, v * 1.4);
    const val = to * eased;
    return Number.isInteger(to) ? Math.round(val).toLocaleString() : val.toFixed(1);
  });
  return (
    <span className="inline-flex items-baseline">
      <motion.span>{display}</motion.span>
      {suffix && <span>{suffix}</span>}
    </span>
  );
}

export default function ClientPortalDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const ref = useRef<HTMLDivElement>(null);

  // Scroll progress drives the dashboard counters + progress bar
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const enter = useTransform(scrollYProgress, [0.1, 0.5], [0, 1], { clamp: true });

  const renderContent = () => {
    switch (activeTab) {
      case 'trials':
        return (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-end mb-8">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 mb-1">Active Clinical Trials</h1>
                <p className="text-sm text-slate-500">Manage and monitor ongoing studies</p>
              </div>
              <button className="px-4 py-2 bg-white border border-slate-200 text-slate-700 text-sm font-bold rounded-lg shadow-sm hover:bg-slate-50 transition-colors flex items-center gap-2">
                <Filter className="w-4 h-4" /> Filter
              </button>
            </div>
            
            <div className="grid grid-cols-1 gap-6">
              {[
                { id: 'BX-204', name: 'Phase II Efficacy Study', status: 'Enrolling', progress: 65, patients: 248 },
                { id: 'BX-105', name: 'Phase I Safety & Dose Escalation', status: 'Active', progress: 90, patients: 45 },
                { id: 'BX-301', name: 'Phase III Multi-center Trial', status: 'Planning', progress: 15, patients: 0 }
              ].map((trial, idx) => (
                <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-slate-300 transition-colors cursor-pointer">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-sm font-bold text-slate-900">{trial.id}</span>
                      <span className={`px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full ${
                        trial.status === 'Enrolling' ? 'bg-blue-100 text-blue-700' :
                        trial.status === 'Active' ? 'bg-emerald-100 text-emerald-700' :
                        'bg-amber-100 text-amber-700'
                      }`}>{trial.status}</span>
                    </div>
                    <h3 className="text-lg font-medium text-slate-700">{trial.name}</h3>
                  </div>
                  
                  <div className="flex-1 max-w-xs w-full">
                    <div className="flex justify-between text-xs text-slate-500 mb-2">
                      <span>Study Progress</span>
                      <span className="font-bold text-slate-700">{trial.progress}%</span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-[#F0564A] rounded-full" style={{ width: `${trial.progress}%` }}></div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-8">
                    <div className="text-right">
                      <p className="text-2xl font-bold text-slate-900">{trial.patients}</p>
                      <p className="text-xs text-slate-500">Patients</p>
                    </div>
                    <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-colors">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      
      case 'documents':
        return (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-end mb-8">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 mb-1">Document Repository</h1>
                <p className="text-sm text-slate-500">Secure access to study protocols and reports</p>
              </div>
              <div className="flex gap-3">
                <button className="px-4 py-2 bg-white border border-slate-200 text-slate-700 text-sm font-bold rounded-lg shadow-sm hover:bg-slate-50 transition-colors flex items-center gap-2">
                  <FolderOpen className="w-4 h-4" /> New Folder
                </button>
                <button className="px-4 py-2 bg-[#F0564A] text-white text-sm font-bold rounded-lg shadow-md shadow-[#F0564A]/20 hover:bg-[#D94D42] transition-colors">
                  Upload File
                </button>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100">
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Modified</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Size</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {[
                    { name: 'BX-204_Protocol_v2.1.pdf', date: 'Oct 24, 2026', size: '2.4 MB' },
                    { name: 'Investigator_Brochure_2026.pdf', date: 'Oct 15, 2026', size: '5.1 MB' },
                    { name: 'Informed_Consent_Form_EN.docx', date: 'Sep 30, 2026', size: '845 KB' },
                    { name: 'Q3_Interim_Analysis_Report.pptx', date: 'Sep 12, 2026', size: '12.8 MB' }
                  ].map((doc, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50 transition-colors group cursor-pointer">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-red-50 text-red-500 rounded-lg">
                            <FileText className="w-4 h-4" />
                          </div>
                          <span className="text-sm font-medium text-slate-900 group-hover:text-[#F0564A] transition-colors">{doc.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500">{doc.date}</td>
                      <td className="px-6 py-4 text-sm text-slate-500">{doc.size}</td>
                      <td className="px-6 py-4 text-right">
                        <button className="p-2 text-slate-400 hover:text-[#F0564A] hover:bg-red-50 rounded-lg transition-colors">
                          <Download className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'patients':
        return (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-end mb-8">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 mb-1">Patient Directory</h1>
                <p className="text-sm text-slate-500">Comprehensive view of enrolled subjects</p>
              </div>
              <button className="px-4 py-2 bg-white border border-slate-200 text-slate-700 text-sm font-bold rounded-lg shadow-sm hover:bg-slate-50 transition-colors flex items-center gap-2">
                <Filter className="w-4 h-4" /> Filter
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { id: 'PT-8492', site: 'Mass General', status: 'Dosed', cohort: 'Cohort A (10mg)' },
                { id: 'PT-8493', site: 'Mayo Clinic', status: 'Screening', cohort: 'Pending' },
                { id: 'PT-8488', site: 'Dana-Farber', status: 'Follow-up', cohort: 'Cohort B (25mg)' },
                { id: 'PT-8485', site: 'Johns Hopkins', status: 'Completed', cohort: 'Cohort A (10mg)' },
                { id: 'PT-8501', site: 'Mass General', status: 'Screening', cohort: 'Pending' },
                { id: 'PT-8470', site: 'UCSF', status: 'Dosed', cohort: 'Cohort C (50mg)' }
              ].map((patient, idx) => (
                <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer group">
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-[#F0564A]/10 group-hover:text-[#F0564A] transition-colors">
                      <Users className="w-5 h-5" />
                    </div>
                    <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full ${
                      patient.status === 'Dosed' ? 'bg-emerald-100 text-emerald-700' :
                      patient.status === 'Screening' ? 'bg-blue-100 text-blue-700' :
                      patient.status === 'Completed' ? 'bg-purple-100 text-purple-700' :
                      'bg-amber-100 text-amber-700'
                    }`}>{patient.status}</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-1">{patient.id}</h3>
                  <p className="text-sm text-slate-500 mb-4">{patient.site}</p>
                  <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                    <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Cohort</span>
                    <span className="text-sm font-bold text-slate-700">{patient.cohort}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'dashboard':
      default:
        return (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-end mb-8">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 mb-1">Trial Overview</h1>
                <p className="text-sm text-slate-500">Phase II Study: BX-204 Efficacy</p>
              </div>
              <button className="px-4 py-2 bg-[#F0564A] text-white text-sm font-bold rounded-lg shadow-md shadow-[#F0564A]/20 hover:bg-[#D94D42] transition-colors">
                Export Report
              </button>
            </div>

            {/* Stats Row — counters tied to scroll progress */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
                <motion.div
                  className="absolute -top-6 -right-6 w-24 h-24 rounded-full"
                  style={{
                    background: "radial-gradient(circle, rgba(59,130,246,0.18), transparent 70%)",
                    filter: "blur(20px)",
                    opacity: useTransform(enter, [0.2, 0.6], [0, 1], { clamp: true }),
                  }}
                />
                <div className="flex justify-between items-start mb-4 relative">
                  <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                    <Users className="w-6 h-6" />
                  </div>
                  <motion.span
                    className="flex items-center gap-1 text-xs font-bold text-emerald-500 bg-emerald-50 px-2 py-1 rounded-md"
                    style={{ opacity: useTransform(enter, [0.55, 0.85], [0, 1], { clamp: true }) }}
                  >
                    <TrendingUp className="w-3 h-3" /> +<ScrollCounter to={12} suffix="%" enter={useTransform(enter, [0.55, 0.95], [0, 1], { clamp: true })} />
                  </motion.span>
                </div>
                <p className="text-3xl font-bold text-slate-900 mb-1 tabular-nums">
                  <ScrollCounter to={248} enter={enter} />
                </p>
                <p className="text-sm text-slate-500 font-medium">Active Enrolled Patients</p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
                <motion.div
                  className="absolute -top-6 -right-6 w-24 h-24 rounded-full"
                  style={{
                    background: "radial-gradient(circle, rgba(16,185,129,0.18), transparent 70%)",
                    filter: "blur(20px)",
                    opacity: useTransform(enter, [0.3, 0.7], [0, 1], { clamp: true }),
                  }}
                />
                <div className="flex justify-between items-start mb-4 relative">
                  <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                </div>
                <p className="text-3xl font-bold text-slate-900 mb-1 tabular-nums">
                  <ScrollCounter to={89} suffix="%" enter={useTransform(enter, [0.1, 0.6], [0, 1], { clamp: true })} />
                </p>
                <p className="text-sm text-slate-500 font-medium">Protocol Compliance Rate</p>
                {/* Animated progress bar tied to scroll */}
                <div className="mt-3 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-emerald-500 rounded-full"
                    style={{ width: useTransform(enter, [0.1, 0.6], ["0%", "89%"], { clamp: true }) }}
                  />
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
                <motion.div
                  className="absolute -top-6 -right-6 w-24 h-24 rounded-full"
                  style={{
                    background: "radial-gradient(circle, rgba(249,115,22,0.18), transparent 70%)",
                    filter: "blur(20px)",
                    opacity: useTransform(enter, [0.4, 0.8], [0, 1], { clamp: true }),
                  }}
                />
                <div className="flex justify-between items-start mb-4 relative">
                  <div className="p-3 bg-orange-50 text-orange-600 rounded-xl">
                    <Clock className="w-6 h-6" />
                  </div>
                  <motion.span
                    className="flex items-center gap-1 text-xs font-bold text-red-500 bg-red-50 px-2 py-1 rounded-md"
                    style={{ opacity: useTransform(enter, [0.65, 0.9], [0, 1], { clamp: true }) }}
                  >
                    <ScrollCounter to={3} enter={useTransform(enter, [0.65, 0.95], [0, 1], { clamp: true })} /> Action Required
                  </motion.span>
                </div>
                <p className="text-3xl font-bold text-slate-900 mb-1 tabular-nums">
                  <ScrollCounter to={14} enter={enter} />
                </p>
                <p className="text-sm text-slate-500 font-medium">Pending SAE Reports</p>
              </div>
            </div>

            {/* Recent Activity Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center">
                <h3 className="font-bold text-slate-900">Recent Patient Activity</h3>
                <button onClick={() => setActiveTab('patients')} className="text-sm font-medium text-[#F0564A] hover:underline">View All</button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/50">
                      <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Patient ID</th>
                      <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Site</th>
                      <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Last Visit</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-slate-900">PT-8492</td>
                      <td className="px-6 py-4 text-sm text-slate-500">Mass General</td>
                      <td className="px-6 py-4">
                        <span className="px-2.5 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full">Dosed</span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500">Today, 09:41 AM</td>
                    </tr>
                    <tr className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-slate-900">PT-8493</td>
                      <td className="px-6 py-4 text-sm text-slate-500">Mayo Clinic</td>
                      <td className="px-6 py-4">
                        <span className="px-2.5 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full">Screening</span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500">Yesterday</td>
                    </tr>
                    <tr className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-slate-900">PT-8488</td>
                      <td className="px-6 py-4 text-sm text-slate-500">Dana-Farber</td>
                      <td className="px-6 py-4">
                        <span className="px-2.5 py-1 bg-amber-100 text-amber-700 text-xs font-bold rounded-full">Follow-up</span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500">Oct 24, 2026</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div ref={ref} className="w-full h-[600px] bg-slate-50 rounded-[2.5rem] shadow-inner border border-slate-200 overflow-hidden flex font-sans relative">
      
      {/* Sidebar */}
      <aside className="w-64 text-white flex flex-col hidden md:flex relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src="/images/22.webp" alt="Background" className="w-full h-full object-cover opacity-20" />
          <div className="absolute inset-0 bg-slate-900/90 mix-blend-multiply"></div>
        </div>
        
        <div className="h-20 flex items-center px-8 border-b border-white/10 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#F0564A] to-orange-500 flex items-center justify-center text-white font-bold shadow-lg shadow-[#F0564A]/20">
              B
            </div>
            <span className="font-bold text-white tracking-wide">BioPortal Pro</span>
          </div>
        </div>
        
        <nav className="flex-1 py-8 px-4 space-y-2 relative z-10">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${
              activeTab === 'dashboard' 
                ? 'bg-[#F0564A] text-white shadow-lg shadow-[#F0564A]/20' 
                : 'hover:bg-white/10 text-slate-300 hover:text-white'
            }`}
          >
            <LayoutDashboard className="w-5 h-5" />
            Dashboard
          </button>
          <button 
            onClick={() => setActiveTab('trials')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${
              activeTab === 'trials' 
                ? 'bg-[#F0564A] text-white shadow-lg shadow-[#F0564A]/20' 
                : 'hover:bg-white/10 text-slate-300 hover:text-white'
            }`}
          >
            <Activity className="w-5 h-5" />
            Clinical Trials
          </button>
          <button 
            onClick={() => setActiveTab('documents')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${
              activeTab === 'documents' 
                ? 'bg-[#F0564A] text-white shadow-lg shadow-[#F0564A]/20' 
                : 'hover:bg-white/10 text-slate-300 hover:text-white'
            }`}
          >
            <FileText className="w-5 h-5" />
            Documents
          </button>
          <button 
            onClick={() => setActiveTab('patients')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${
              activeTab === 'patients' 
                ? 'bg-[#F0564A] text-white shadow-lg shadow-[#F0564A]/20' 
                : 'hover:bg-white/10 text-slate-300 hover:text-white'
            }`}
          >
            <Users className="w-5 h-5" />
            Patients
          </button>
        </nav>

        <div className="p-4 border-t border-white/10 relative z-10">
          <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/10 text-slate-300 hover:text-white rounded-xl font-medium transition-colors">
            <Settings className="w-5 h-5" />
            Settings
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden bg-slate-50/50">
        {/* Header */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-8 shrink-0 z-20">
          <div className="relative w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search patients, trials..." 
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#F0564A]/20 focus:border-[#F0564A]"
            />
          </div>
          <div className="flex items-center gap-6">
            <button className="relative text-slate-400 hover:text-slate-600 transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#F0564A] rounded-full border-2 border-white"></span>
            </button>
            <div className="flex items-center gap-3 pl-6 border-l border-slate-200">
              <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden">
                <img src="https://i.pravatar.cc/100?img=33" alt="User" className="w-full h-full object-cover" />
              </div>
              <div className="hidden lg:block">
                <p className="text-sm font-bold text-slate-900">Dr. Sarah Jenkins</p>
                <p className="text-xs text-slate-500">Principal Investigator</p>
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Content Area */}
        <div className="flex-1 overflow-y-auto p-8 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}
