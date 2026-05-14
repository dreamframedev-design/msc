"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { CheckSquare, CheckCircle2, Clock, Loader2, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from 'framer-motion';

export default function SharedTasksPage() {
  const params = useParams();
  const boardId = params?.boardId as string;
  const [tasks, setTasks] = useState<any[]>([]);
  const [board, setBoard] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (boardId) {
      fetchBoardData();
    }
  }, [boardId]);

  const fetchBoardData = async () => {
    // Fetch Board info
    const { data: boardData } = await supabase
      .from("task_boards")
      .select("*")
      .eq("id", boardId)
      .single();
      
    if (boardData) {
      setBoard(boardData);
    }

    // Fetch Tasks
    const { data: tasksData } = await supabase
      .from("admin_tasks")
      .select("*")
      .eq("board_id", boardId)
      .order("created_at", { ascending: false });
      
    if (tasksData) {
      setTasks(tasksData);
    }
    setIsLoading(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center text-white">
        <Loader2 className="w-10 h-10 animate-spin text-[#F0564A]" />
      </div>
    );
  }

  const completedCount = tasks.filter(t => t.status === 'completed').length;
  const progressPercentage = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-zinc-100 flex flex-col relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#F0564A]/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#5BCBD7]/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Header */}
      <header className="relative z-10 p-6 sm:p-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Image
            src="/images/MSC LOGO BITTERSWEET VECTOR (1).svg"
            alt="MSC Logo"
            width={32}
            height={32}
            className="object-contain"
          />
          <span className="font-heading font-bold text-xl tracking-tight text-white">
            Shared Task List
          </span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 relative z-10 px-4 sm:px-6 py-8">
        <div className="max-w-3xl mx-auto space-y-8">
          
          <div className="text-center space-y-3 mb-10">
            <h1 className="text-3xl sm:text-4xl font-heading font-bold text-white">
              {board?.title || "Mighty Spark Action Items"}
            </h1>
            <p className="text-zinc-400">Current progress and to-dos for {board?.client_tag || "the team"}.</p>
          </div>

          {/* Progress Bar */}
          {tasks.length > 0 && (
            <div className="bg-[#111111] border border-white/5 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold text-zinc-300">Overall Progress</span>
                <span className="text-sm font-bold text-[#F0564A]">{progressPercentage}%</span>
              </div>
              <div className="h-3 w-full bg-black/50 rounded-full overflow-hidden border border-white/5">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercentage}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-[#F0564A] to-[#F08435]"
                />
              </div>
              <p className="text-xs text-zinc-500 mt-4 text-center">
                {completedCount} of {tasks.length} tasks completed
              </p>
            </div>
          )}

          {/* Task List */}
          <div className="bg-[#111111] border border-white/5 rounded-2xl overflow-hidden">
            <AnimatePresence mode="popLayout">
              {tasks.length > 0 ? tasks.map((task) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-5 sm:p-6 border-b border-white/5 last:border-0 flex items-start sm:items-center gap-4 transition-colors hover:bg-white/[0.02] ${task.status === 'completed' ? 'opacity-50' : ''}`}
                >
                  <div className="mt-1 sm:mt-0">
                    {task.status === 'completed' ? (
                      <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                    ) : task.status === 'in_progress' ? (
                      <Clock className="w-6 h-6 text-blue-400" />
                    ) : (
                      <div className="w-6 h-6 rounded-md border-2 border-zinc-600" />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1">
                      <p className={`text-base sm:text-lg font-medium ${task.status === 'completed' ? 'text-zinc-500 line-through' : 'text-zinc-100'}`}>
                        {task.title}
                      </p>
                      {task.client_tag && (
                        <span className="inline-flex px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-white/10 text-zinc-300 border border-white/10 w-fit">
                          {task.client_tag}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-zinc-500">
                      Added {new Date(task.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>

                  <div className="shrink-0">
                    {task.status === 'in_progress' && (
                      <span className="inline-flex px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider border bg-blue-500/10 text-blue-400 border-blue-500/20">
                        In Progress
                      </span>
                    )}
                  </div>
                </motion.div>
              )) : (
                <div className="text-center p-16">
                  <Sparkles className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
                  <p className="text-xl font-bold text-white mb-2">You're all caught up!</p>
                  <p className="text-zinc-500">There are no active tasks on the board.</p>
                </div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </main>
      
      {/* Footer */}
      <footer className="relative z-10 py-8 text-center border-t border-white/5 mt-auto">
        <p className="text-xs text-zinc-600">
          Powered by Mighty Spark Communications
        </p>
      </footer>
    </div>
  );
}