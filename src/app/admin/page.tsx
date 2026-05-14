"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { createClient } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Ticket,
  FolderOpen,
  Plus,
  Trash2,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  ArrowLeft,
  Link2,
  AlertCircle,
  MessageSquare,
  Newspaper,
  ShieldAlert,
  Search,
  MoreVertical,
  ChevronRight,
  CheckSquare,
  Share2,
  X,
  Bell,
  Users,
  Sparkles,
  Eye,
  Settings
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { articles } from "../news/data";
import { useToast } from "@/components/ui/toast";
import { UserAvatar } from "@/components/ui/user-avatar";
import { useRegisterCommandsMemo, useCommandPalette } from "@/components/command/CommandPaletteContext";
import type { CommandItem } from "@/components/command/CommandPalette";
import { Command as CommandIcon } from "lucide-react";

export default function AdminDashboard() {
  const router = useRouter();
  const toast = useToast();
  const palette = useCommandPalette();
  const [activeTab, setActiveTab] = useState("tickets");
  const [tickets, setTickets] = useState<any[]>([]);
  const [vaultFiles, setVaultFiles] = useState<any[]>([]);
  // Internal Tasks State
  const [taskBoards, setTaskBoards] = useState<any[]>([]);
  const [activeBoardId, setActiveBoardId] = useState<string>("");
  const [taskViewMode, setTaskViewMode] = useState<"lists" | "overview">("lists");
  const [showNewBoardModal, setShowNewBoardModal] = useState(false);
  const [newBoardTitle, setNewBoardTitle] = useState("");
  const [newBoardClient, setNewBoardClient] = useState("");
  const [newBoardSelectedMembers, setNewBoardSelectedMembers] = useState<string[]>([]);
  const [showManageMembersModal, setShowManageMembersModal] = useState(false);
  const [boardMembers, setBoardMembers] = useState<any[]>([]);
  const [selectedUserToAdd, setSelectedUserToAdd] = useState("");

  const [internalTasks, setInternalTasks] = useState<any[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskClient, setNewTaskClient] = useState("");
  const [ticketFilter, setTicketFilter] = useState("active");
  const [clientFilter, setClientFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  
  const [boardShortcuts, setBoardShortcuts] = useState<string[]>([]);
  const [showShortcutDropdown, setShowShortcutDropdown] = useState(false);

  const [allInternalTasks, setAllInternalTasks] = useState<any[]>([]);

  const fetchBoardMembers = async (boardId: string) => {
    const { data } = await supabase
      .from('task_board_members')
      .select('user_id')
      .eq('board_id', boardId);
    if (data) {
      setBoardMembers(data.map(m => m.user_id));
    }
  };

  const handleAddMember = async () => {
    if (!activeBoardId || !selectedUserToAdd) return;
    const { error } = await supabase.from('task_board_members').insert({
      board_id: activeBoardId,
      user_id: selectedUserToAdd
    });
    if (!error) {
      fetchBoardMembers(activeBoardId);
      setSelectedUserToAdd("");
    } else {
      toast.error("Couldn't add member", error.message);
    }
  };

  const handleRemoveMember = async (userId: string) => {
    if (!activeBoardId) return;
    const { error } = await supabase.from('task_board_members')
      .delete()
      .eq('board_id', activeBoardId)
      .eq('user_id', userId);
    if (!error) {
      fetchBoardMembers(activeBoardId);
    }
  };

  // Ticket Chat State
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
      .channel(`ticket_comments_${selectedTicket.id}`)
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
      .channel(`task_comments_${selectedTask.id}`)
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

  // File Request State
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requestClient, setRequestClient] = useState("");
  const [requestMessage, setRequestMessage] = useState("");

  // Edit File State
  const [editingFile, setEditingFile] = useState<any>(null);
  const [editFileVisibility, setEditFileVisibility] = useState<"internal" | "global" | "client" | "superadmin">("internal");
  const [editFileClient, setEditFileClient] = useState("");
  const [editFileFolder, setEditFileFolder] = useState("");
  const [usersList, setUsersList] = useState<any[]>([]);

  // Preview File State
  const [previewFile, setPreviewFile] = useState<any>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // New User State
  const [showNewUserModal, setShowNewUserModal] = useState(false);
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserPassword, setNewUserPassword] = useState("");
  const [newUserRole, setNewUserRole] = useState("client");
  const [newUserCompany, setNewUserCompany] = useState("");
  const [isCreatingUser, setIsCreatingUser] = useState(false);

  const fetchAllInternalTasks = async () => {
    const { data } = await supabase
      .from("admin_tasks")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setAllInternalTasks(data);
  };

  useEffect(() => {
    const checkAuth = async () => {
      // Force refresh the session so any database role changes take effect immediately
      await supabase.auth.refreshSession();
      
      const { data: { session } } = await supabase.auth.getSession();
      const role = session?.user?.user_metadata?.role || session?.user?.app_metadata?.role;
      const isAdmin = role === 'admin' || role === 'superadmin';
      if (!session || !isAdmin) {
        window.location.href = "/portal";
      } else {
        setUser(session.user);
        setIsSuperAdmin(role === 'superadmin');
      }
      setIsLoading(false);
    };
    checkAuth();
    fetchTickets();
    fetchVaultFiles();
    fetchBoards();
    fetchUsersList();
    fetchAllInternalTasks();

    // ====== REALTIME LIST SUBSCRIPTIONS ======
    // Live-update the major lists whenever rows change anywhere in the table.
    // Refetches are coarse but keep state consistent with RLS-filtered results.
    const ticketsChannel = supabase
      .channel('admin_tickets_list')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'client_tickets' }, () => fetchTickets())
      .subscribe();

    const tasksChannel = supabase
      .channel('admin_tasks_list')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'admin_tasks' }, () => {
        fetchTasks();
        fetchAllInternalTasks();
      })
      .subscribe();

    const boardsChannel = supabase
      .channel('admin_boards_list')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'task_boards' }, () => fetchBoards())
      .subscribe();

    const filesChannel = supabase
      .channel('admin_files_list')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'vault_files' }, () => fetchVaultFiles())
      .subscribe();

    const cleanup = () => {
      supabase.removeChannel(ticketsChannel);
      supabase.removeChannel(tasksChannel);
      supabase.removeChannel(boardsChannel);
      supabase.removeChannel(filesChannel);
    };

    // Register Service Worker for PWA / Push
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').then((reg) => {
        console.log('Service Worker registered for PWA', reg);
      }).catch((err) => {
        console.error('Service Worker registration failed', err);
      });
    }

    return cleanup;
  }, []);

  const fetchUsersList = async () => {
    const { data } = await supabase.rpc('get_all_users');
    if (data) setUsersList(data);
  };

  const handleUpdateUserRole = async (userId: string, newRole: string) => {
    if (!confirm(`Are you sure you want to change this user's role to ${newRole.toUpperCase()}?`)) return;
    
    const { error } = await supabase.rpc('set_user_role', { target_user_id: userId, new_role: newRole });
    if (!error) {
      fetchUsersList();
      toast.success("Role updated");
    } else {
      toast.error("Couldn't update role", "Run set_user_role SQL? " + error.message);
    }
  };

  const handleUpdateUserCompany = async (userId: string, newCompany: string) => {
    const { error } = await supabase.rpc('set_user_company', { target_user_id: userId, new_company: newCompany });
    if (!error) {
      fetchUsersList();
      toast.success("Company updated");
    } else {
      toast.error("Couldn't update company", "Run set_user_company SQL? " + error.message);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserEmail || !newUserPassword) return;

    setIsCreatingUser(true);
    
    // Create a temporary client that doesn't persist the session
    // so we don't accidentally log the admin out when creating a new user
    const tempClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { auth: { persistSession: false, autoRefreshToken: false } }
    );

    const { data, error } = await tempClient.auth.signUp({
      email: newUserEmail,
      password: newUserPassword,
      options: {
        data: {
          role: newUserRole,
          company: newUserCompany
        }
      }
    });

    setIsCreatingUser(false);

    if (error) {
      toast.error("Couldn't create user", error.message);
    } else {
      toast.success("User created", newUserEmail);
      setShowNewUserModal(false);
      setNewUserEmail("");
      setNewUserPassword("");
      setNewUserCompany("");
      setNewUserRole("client");
      fetchUsersList();
    }
  };

  const fetchBoards = async () => {
    const { data } = await supabase
      .from("task_boards")
      .select("*")
      .order("created_at", { ascending: false });
    if (data && data.length > 0) {
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      const customOrder = currentUser?.user_metadata?.board_order || [];
      const shortcuts = currentUser?.user_metadata?.board_shortcuts || [];
      
      setBoardShortcuts(shortcuts);
      
      if (customOrder.length > 0) {
        data.sort((a, b) => {
          const indexA = customOrder.indexOf(a.id);
          const indexB = customOrder.indexOf(b.id);
          if (indexA !== -1 && indexB !== -1) return indexA - indexB;
          if (indexA !== -1) return -1;
          if (indexB !== -1) return 1;
          return 0;
        });
      }

      setTaskBoards(data);
      if (!activeBoardId) setActiveBoardId(data[0].id);
    }
  };

  const handleAddShortcut = async (boardId: string) => {
    if (boardShortcuts.includes(boardId)) {
      setShowShortcutDropdown(false);
      return;
    }
    const newShortcuts = [...boardShortcuts, boardId];
    setBoardShortcuts(newShortcuts);
    setShowShortcutDropdown(false);
    await supabase.auth.updateUser({
      data: { board_shortcuts: newShortcuts }
    });
  };

  const handleRemoveShortcut = async (boardId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newShortcuts = boardShortcuts.filter(id => id !== boardId);
    setBoardShortcuts(newShortcuts);
    await supabase.auth.updateUser({
      data: { board_shortcuts: newShortcuts }
    });
  };

  const handleReorderBoards = async (newOrder: any[]) => {
    setTaskBoards(newOrder);
    const orderIds = newOrder.map(board => board.id);
    await supabase.auth.updateUser({
      data: { board_order: orderIds }
    });
  };

  const fetchTasks = async (boardId?: string, mode?: string) => {
    const currentMode = mode || taskViewMode;
    
    if (currentMode === "overview") {
      const { data } = await supabase
        .from("admin_tasks")
        .select("*")
        .eq('status', 'pending')
        .order("created_at", { ascending: false });
      if (data) setInternalTasks(data);
      return;
    }

    const targetBoard = boardId || activeBoardId;
    if (!targetBoard) return;
    const { data } = await supabase
      .from("admin_tasks")
      .select("*")
      .eq('board_id', targetBoard)
      .order("created_at", { ascending: false });
    if (data) setInternalTasks(data);
  };

  useEffect(() => {
    if (taskViewMode === "overview") {
      fetchTasks(undefined, "overview");
    } else if (activeBoardId) {
      fetchTasks(activeBoardId, "lists");
      fetchBoardMembers(activeBoardId);
    }
  }, [activeBoardId, taskViewMode]);

  const handleCreateBoard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBoardTitle.trim() || !user) return;
    
    const { data, error } = await supabase.from('task_boards').insert({
      title: newBoardTitle,
      client_tag: newBoardClient.trim() || null,
      created_by: user.id
    }).select().single();

    if (!error && data) {
      if (newBoardSelectedMembers.length > 0) {
        const membersToInsert = newBoardSelectedMembers.map(userId => ({
          board_id: data.id,
          user_id: userId
        }));
        await supabase.from('task_board_members').insert(membersToInsert);
      }
      setNewBoardTitle("");
      setNewBoardClient("");
      setNewBoardSelectedMembers([]);
      setShowNewBoardModal(false);
      setTaskBoards([data, ...taskBoards]);
      setActiveBoardId(data.id);
    } else {
      toast.error("Couldn't create board", error?.message);
    }
  };

  const handleDeleteBoard = async () => {
    if (!activeBoardId) return;
    const board = taskBoards.find(b => b.id === activeBoardId);
    if (!board) return;
    
    if (!confirm(`Are you sure you want to completely delete the project "${board.title}"?\n\nThis will instantly delete ALL tasks and comments inside this project forever. This cannot be undone.`)) return;
    
    const { error } = await supabase.from('task_boards').delete().eq('id', activeBoardId);
    
    if (!error) {
      const remainingBoards = taskBoards.filter(b => b.id !== activeBoardId);
      setTaskBoards(remainingBoards);
      setActiveBoardId(remainingBoards.length > 0 ? remainingBoards[0].id : "");
      setInternalTasks([]); // Clear the tasks view
    } else {
      toast.error("Couldn't delete board", error.message);
    }
  };

  const handleCreateTask = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!newTaskTitle.trim() || !user || !activeBoardId) return;
    
    // Split by newlines to allow bulk-adding tasks
    const titles = newTaskTitle.split('\n').map(t => t.trim()).filter(t => t.length > 0);
    
    if (titles.length === 0) return;

    const tasksToInsert = titles.map(title => ({
      title: title,
      client_tag: newTaskClient.trim() || null,
      created_by: user.id,
      board_id: activeBoardId
    }));
    
    const { error } = await supabase.from('admin_tasks').insert(tasksToInsert);
    
    if (!error) {
      setNewTaskTitle("");
      setNewTaskClient("");
      fetchTasks();
      fetchAllInternalTasks();
    } else {
      toast.error("Couldn't create task", "Run the admin_tasks SQL migration? " + error.message);
    }
  };

  const updateInternalTaskStatus = async (id: string, newStatus: string) => {
    const { error } = await supabase.from('admin_tasks').update({ status: newStatus }).eq('id', id);
    if (!error) {
      fetchTasks();
      fetchAllInternalTasks();

      if (newStatus === 'completed' && user) {
        await supabase.from('task_comments').insert({
          task_id: id,
          user_id: user.id,
          content: "✅ This task has been marked as completed."
        });
      }
    }
  };

  const deleteInternalTask = async (id: string) => {
    if (!confirm("Delete this task?")) return;
    const { error } = await supabase.from('admin_tasks').delete().eq('id', id);
    if (!error) {
      fetchTasks();
      fetchAllInternalTasks();
    }
  };

  const handleShareTasks = async () => {
    if (!activeBoardId) return;
    const url = window.location.origin + "/shared-tasks/" + activeBoardId;
    await navigator.clipboard.writeText(url);
    toast.success("Shareable link copied", url);
  };

  const fetchVaultFiles = async () => {
    const { data } = await supabase
      .from("vault_files")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setVaultFiles(data);
  };

  const toggleFileInternal = async (id: string, currentStatus: boolean) => {
    const { error } = await supabase.from('vault_files').update({ 
      is_internal: !currentStatus,
      is_superadmin_only: !currentStatus ? false : false // Reset superadmin if toggled
    }).eq('id', id);
    if (!error) fetchVaultFiles();
  };

  const deleteVaultFile = async (id: string, storagePath: string) => {
    if (!confirm("Delete this file permanently?")) return;
    await supabase.storage.from('client-vault').remove([storagePath]);
    await supabase.from('vault_files').delete().eq('id', id);
    fetchVaultFiles();
  };

  const openEditFileModal = (file: any) => {
    setEditingFile(file);
    setEditFileFolder(file.folder || 'root');
    if (file.is_superadmin_only) {
      setEditFileVisibility('superadmin');
      setEditFileClient(file.client_id);
    } else if (file.is_internal) {
      setEditFileVisibility('internal');
      setEditFileClient(file.client_id);
    } else if (file.client_id === '00000000-0000-0000-0000-000000000000') {
      setEditFileVisibility('global');
      setEditFileClient('');
    } else {
      setEditFileVisibility('client');
      setEditFileClient(file.client_id);
    }
  };

  const handleUpdateFile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingFile) return;

    let finalClientId = editingFile.client_id;
    let finalIsInternal = true;
    let finalIsSuperAdminOnly = false;

    if (editFileVisibility === "global") {
      finalClientId = '00000000-0000-0000-0000-000000000000';
      finalIsInternal = false;
    } else if (editFileVisibility === "client") {
      finalClientId = editFileClient || editingFile.client_id;
      finalIsInternal = false;
    } else if (editFileVisibility === "superadmin") {
      finalClientId = editFileClient || user?.id || editingFile.client_id;
      finalIsInternal = true;
      finalIsSuperAdminOnly = true;
    } else {
      finalClientId = editFileClient || editingFile.client_id;
      finalIsInternal = true;
    }

    const { error } = await supabase.from('vault_files').update({
      client_id: finalClientId,
      is_internal: finalIsInternal,
      is_superadmin_only: finalIsSuperAdminOnly,
      folder: editFileFolder || 'root'
    }).eq('id', editingFile.id);

    if (!error) {
      setEditingFile(null);
      fetchVaultFiles();
    } else {
      toast.error("Couldn't update file", error.message);
    }
  };

  const handleShareLink = async (storagePath: string) => {
    const { data, error } = await supabase.storage.from('client-vault').createSignedUrl(storagePath, 60 * 60 * 24 * 7);
    if (data?.signedUrl) {
      await navigator.clipboard.writeText(data.signedUrl);
      toast.success("Shareable link copied", "Valid for 7 days");
    } else {
      toast.error("Couldn't generate link", error?.message);
    }
  };

  const handlePreviewFile = async (file: any) => {
    const isImage = file.name.match(/\.(jpeg|jpg|gif|png|webp)$/i);
    if (isImage) {
      const { data, error } = await supabase.storage.from('client-vault').createSignedUrl(file.storage_path, 60 * 60);
      if (data?.signedUrl) {
        setPreviewUrl(data.signedUrl);
        setPreviewFile(file);
      } else {
        toast.error("Couldn't generate preview", error?.message);
      }
    } else {
      window.open(supabase.storage.from('client-vault').getPublicUrl(file.storage_path).data.publicUrl, '_blank');
    }
  };

  const requestNotificationPermission = async () => {
    if (!('Notification' in window)) {
      toast.error("Push notifications not supported in this browser");
      return;
    }
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      toast.success("Push notifications enabled", "You'll receive alerts for urgent tickets");
      // In a full implementation, you would subscribe the user to push manager and save the PushSubscription to Supabase.
      // e.g., const registration = await navigator.serviceWorker.ready;
      // const subscription = await registration.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: 'YOUR_PUBLIC_VAPID_KEY' });
      // await supabase.from('admin_push_subs').insert({ user_id: user.id, subscription });
    }
  };

  const handleCreateRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!requestClient.trim() || !user) return;

    const { data, error } = await supabase.from('file_requests').insert({
      client_tag: requestClient.trim(),
      message: requestMessage.trim(),
      created_by: user.id
    }).select().single();

    if (error) {
      toast.error("Couldn't create file request", "Run the master SQL script? " + error.message);
    } else if (data) {
      const url = `${window.location.origin}/request/${data.id}`;
      await navigator.clipboard.writeText(url);
      toast.success("File request created", `Link copied — ${url}`);
      setShowRequestModal(false);
      setRequestClient("");
      setRequestMessage("");
    }
  };

  const fetchTickets = async () => {
    const { data } = await supabase
      .from("client_tickets")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setTickets(data);
  };

  const updateTicketStatus = async (id: string, newStatus: string) => {
    const { error } = await supabase
      .from("client_tickets")
      .update({ status: newStatus })
      .eq("id", id);
    if (!error) {
      fetchTickets();
      if (selectedTicket && selectedTicket.id === id) {
        setSelectedTicket({ ...selectedTicket, status: newStatus });
      }
      
      if (newStatus === 'completed' && user) {
        await supabase.from('ticket_comments').insert({
          ticket_id: id,
          user_id: user.id,
          content: "✅ This ticket has been marked as resolved by the MSC Team. If you need further assistance, please reply to this thread."
        });
      }
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
    }
  };

  const handleOpenTicket = (ticket: any) => {
    setSelectedTicket(ticket);
    fetchComments(ticket.id);
  };

  const handleSubmitComment = async () => {
    if (!selectedTicket || !commentText.trim() || !user) return;
    
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

    if (error) {
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

  const uniqueClients = useMemo(() => {
    const clients = new Set<string>();
    tickets.forEach(t => {
      const clientEmail = usersList.find(u => u.id === t.client_id)?.email || t.client_id;
      clients.add(clientEmail);
    });
    allInternalTasks.forEach(t => {
      clients.add(t.client_tag || 'Internal / Untagged');
    });
    return Array.from(clients).sort();
  }, [tickets, allInternalTasks, usersList]);

  const unifiedQueue = useMemo(() => {
    const queue: any[] = [];

    tickets.forEach(t => {
      const clientEmail = usersList.find(u => u.id === t.client_id)?.email || t.client_id;
      queue.push({
        type: 'ticket',
        id: t.id,
        title: t.title,
        description: t.description,
        priority: t.priority || 'Normal',
        status: t.status,
        created_at: t.created_at,
        client: clientEmail,
        originalItem: t
      });
    });

    allInternalTasks.forEach(t => {
      queue.push({
        type: 'task',
        id: t.id,
        title: t.title,
        description: `Internal Task from ${taskBoards.find(b => b.id === t.board_id)?.title || 'Unknown Project'}`,
        priority: 'Normal',
        status: t.status === 'pending' ? 'pending' : (t.status === 'in_progress' ? 'in_progress' : 'completed'),
        created_at: t.created_at,
        client: t.client_tag || 'Internal / Untagged',
        originalItem: t
      });
    });

    // Apply status filter
    let filtered = queue.filter(item => {
      if (ticketFilter === "all") return true;
      if (ticketFilter === "active") return item.status !== "completed";
      return item.status === ticketFilter;
    });

    // Apply client filter
    if (clientFilter !== 'all') {
      filtered = filtered.filter(item => item.client === clientFilter);
    }

    // Sort by Priority, then Client, then Date
    const priorityWeight = { 'Urgent': 3, 'High': 2, 'Normal': 1 };
    
    filtered.sort((a, b) => {
      const pA = priorityWeight[a.priority as keyof typeof priorityWeight] || 1;
      const pB = priorityWeight[b.priority as keyof typeof priorityWeight] || 1;
      if (pA !== pB) return pB - pA;
      
      const cA = a.client.toLowerCase();
      const cB = b.client.toLowerCase();
      if (cA !== cB) return cA.localeCompare(cB);

      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

    return filtered;
  }, [tickets, allInternalTasks, usersList, taskBoards, ticketFilter, clientFilter]);

  // ============ COMMAND PALETTE REGISTRATION ============
  useRegisterCommandsMemo(() => {
    const goto = (tab: string, extra?: () => void) => () => {
      setActiveTab(tab);
      extra?.();
    };

    const tabItems: CommandItem[] = [
      { id: "tab-tickets", group: "Navigate", label: "Global Action Queue", sublabel: "Tickets dashboard", icon: <Ticket className="w-3.5 h-3.5" />, accent: "#F0564A", action: goto("tickets"), keywords: "support help requests inbox" },
      { id: "tab-tasks", group: "Navigate", label: "Project Boards", sublabel: "Internal task management", icon: <CheckSquare className="w-3.5 h-3.5" />, accent: "#F0564A", action: goto("tasks"), keywords: "kanban tasks projects boards" },
      { id: "tab-files", group: "Navigate", label: "Global Vault", sublabel: "Files & folders", icon: <FolderOpen className="w-3.5 h-3.5" />, action: goto("files"), keywords: "documents storage uploads" },
      { id: "tab-users", group: "Navigate", label: "User Management", sublabel: "Clients & admins", icon: <Users className="w-3.5 h-3.5" />, action: goto("users"), keywords: "people accounts roles" },
      { id: "tab-news", group: "Navigate", label: "News Articles", sublabel: "Published & drafts", icon: <Newspaper className="w-3.5 h-3.5" />, action: goto("news"), keywords: "blog posts press" },
      { id: "tab-settings", group: "Navigate", label: "Account Settings", icon: <Settings className="w-3.5 h-3.5" />, action: goto("settings"), keywords: "preferences profile" },
    ];

    const actionItems: CommandItem[] = [
      { id: "act-new-board", group: "Actions", label: "New Project Board", sublabel: "Create a board", icon: <Plus className="w-3.5 h-3.5" />, action: () => { setActiveTab("tasks"); setShowNewBoardModal(true); }, keywords: "create project board" },
      { id: "act-file-request", group: "Actions", label: "Send File Request", sublabel: "Generate a secure upload link", icon: <Link2 className="w-3.5 h-3.5" />, action: () => { setActiveTab("files"); setShowRequestModal(true); }, keywords: "upload request link share" },
      { id: "act-new-user", group: "Actions", label: "Create User", sublabel: "Add a client or admin", icon: <Users className="w-3.5 h-3.5" />, action: () => { setActiveTab("users"); setShowNewUserModal(true); }, keywords: "add invite signup" },
      { id: "act-portal", group: "Actions", label: "Open Client Portal", sublabel: "View as client", icon: <Eye className="w-3.5 h-3.5" />, action: () => { window.location.href = "/portal/dashboard"; }, keywords: "impersonate preview" },
    ];

    const ticketItems: CommandItem[] = tickets.slice(0, 25).map((t: any) => ({
      id: `ticket-${t.id}`,
      group: "Tickets",
      label: t.subject || t.title || "Untitled ticket",
      sublabel: `${t.status || "open"} · ${t.client_email || t.client_tag || "—"}`,
      icon: <Ticket className="w-3.5 h-3.5" />,
      action: () => { setActiveTab("tickets"); setSelectedTicket(t); },
      keywords: `${t.client_email || ""} ${t.client_tag || ""} ${t.status || ""}`,
    }));

    const boardItems: CommandItem[] = taskBoards.map((b: any) => ({
      id: `board-${b.id}`,
      group: "Project Boards",
      label: b.title,
      sublabel: b.client_tag ? `Client: ${b.client_tag}` : "Internal",
      icon: <CheckSquare className="w-3.5 h-3.5" />,
      action: () => { setActiveTab("tasks"); setActiveBoardId(b.id); setTaskViewMode("lists"); },
      keywords: b.client_tag || "",
    }));

    const taskItems: CommandItem[] = allInternalTasks.slice(0, 40).map((t: any) => {
      const board = taskBoards.find((b: any) => b.id === t.board_id);
      return {
        id: `task-${t.id}`,
        group: "Tasks",
        label: t.title,
        sublabel: `${board?.title || "Board"} · ${t.status || "pending"}`,
        icon: <CheckSquare className="w-3.5 h-3.5" />,
        action: () => { setActiveTab("tasks"); setActiveBoardId(t.board_id); setTaskViewMode("lists"); setSelectedTask(t); },
        keywords: `${board?.title || ""} ${t.client_tag || ""}`,
      };
    });

    const userItems: CommandItem[] = isSuperAdmin
      ? usersList.slice(0, 30).map((u: any) => ({
          id: `user-${u.id}`,
          group: "Users",
          label: u.email || "Unknown",
          sublabel: `${u.role || "client"}${u.company ? ` · ${u.company}` : ""}`,
          icon: <Users className="w-3.5 h-3.5" />,
          action: () => { setActiveTab("users"); },
          keywords: `${u.company || ""} ${u.role || ""}`,
        }))
      : [];

    const fileItems: CommandItem[] = vaultFiles.slice(0, 20).map((f: any) => ({
      id: `file-${f.id}`,
      group: "Files",
      label: f.filename || "Untitled",
      sublabel: f.folder ? `${f.folder}` : "root",
      icon: <FolderOpen className="w-3.5 h-3.5" />,
      action: () => { setActiveTab("files"); setPreviewFile(f); },
      keywords: f.folder || "",
    }));

    return [...tabItems, ...actionItems, ...ticketItems, ...boardItems, ...taskItems, ...userItems, ...fileItems];
  }, [tickets, taskBoards, allInternalTasks, usersList, vaultFiles, isSuperAdmin]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center text-white">
        <div className="w-6 h-6 border-2 border-zinc-700 border-t-zinc-300 rounded-full animate-spin" />
      </div>
    );
  }

  const getPriorityBadge = (priority: string) => {
    switch(priority) {
      case 'Urgent': return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'High': return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
      default: return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "text-amber-400 bg-amber-400/10 border-amber-400/20";
      case "in_progress": return "text-blue-400 bg-blue-400/10 border-blue-400/20";
      case "review": return "text-purple-400 bg-purple-400/10 border-purple-400/20";
      case "completed": return "text-emerald-400 bg-emerald-400/10 border-emerald-400/20";
      default: return "text-zinc-400 bg-zinc-800 border-zinc-700";
    }
  };

  return (
    <div className="min-h-screen flex text-zinc-100 bg-[#0A0A0A] selection:bg-[#F0564A]/30">
      {/* ============ MINIMAL SIDEBAR ============ */}
      <aside className="w-64 border-r border-white/5 flex-col hidden md:flex h-screen fixed left-0 top-0 z-50 bg-[#0A0A0A]">
        <div className="p-6">
          <Link href="/admin" className="flex items-center gap-3 group">
            <Image
              src="/images/MSC LOGO BITTERSWEET VECTOR (1).svg"
              alt="MSC Logo"
              width={28}
              height={28}
              className="object-contain opacity-90 group-hover:opacity-100 transition-opacity"
            />
            {isSuperAdmin ? (
              <div className="relative group/badge ml-1">
                {/* Minimal Particle Background */}
                <div className="absolute -inset-2 overflow-hidden pointer-events-none mix-blend-screen">
                  <motion.div 
                    animate={{ y: [-10, 40], opacity: [0, 1, 0], scale: [0.5, 1, 0.5] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: "linear", delay: 0 }}
                    className="absolute left-[20%] w-[2px] h-[2px] rounded-full bg-violet-400 blur-[0.5px] shadow-[0_0_8px_2px_rgba(139,92,246,0.8)]"
                  />
                  <motion.div 
                    animate={{ y: [-10, 40], opacity: [0, 1, 0], scale: [0.5, 1, 0.5] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear", delay: 1 }}
                    className="absolute left-[50%] w-[3px] h-[3px] rounded-full bg-indigo-400 blur-[1px] shadow-[0_0_10px_3px_rgba(99,102,241,0.8)]"
                  />
                  <motion.div 
                    animate={{ y: [-10, 40], opacity: [0, 1, 0], scale: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear", delay: 0.5 }}
                    className="absolute left-[80%] w-[2px] h-[2px] rounded-full bg-fuchsia-400 blur-[0.5px] shadow-[0_0_8px_2px_rgba(217,70,239,0.8)]"
                  />
                </div>
                
                {/* Main Badge */}
                <div className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0d041a] border border-violet-500/30 shadow-[0_0_20px_rgba(139,92,246,0.15)] transition-colors duration-500 hover:border-violet-500/60 hover:shadow-[0_0_25px_rgba(139,92,246,0.25)]">
                  <Sparkles className="w-3.5 h-3.5 text-violet-400 animate-pulse" />
                  <span className="font-heading text-[10px] font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-300 via-fuchsia-300 to-violet-300 bg-[length:200%_auto] animate-[gradient_3s_linear_infinite] tracking-[0.2em] uppercase">
                    Master Admin
                  </span>
                </div>
              </div>
            ) : (
              <span className="font-heading font-semibold text-lg tracking-tight text-white flex items-center gap-2">
                Admin <ShieldAlert className="w-3.5 h-3.5 text-zinc-500" />
              </span>
            )}
          </Link>
        </div>

        <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
          <div className="space-y-6">
            <div>
              <h4 className="px-3 text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-2">Core Operations</h4>
              <div className="space-y-1">
                {[
                  { key: "tickets", label: "Global Action Queue", Icon: Ticket, accent: "text-[#F0564A]" },
                  { key: "tasks", label: "Project Boards", Icon: CheckSquare, accent: "text-[#F0564A]" },
                ].map(({ key, label, Icon, accent }) => (
                  <button
                    key={key}
                    onClick={() => setActiveTab(key)}
                    className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all text-sm font-semibold border ${
                      activeTab === key
                        ? "bg-[#1A1A1A] text-white border-white/10 shadow-[0_0_15px_rgba(240,86,74,0.1)]"
                        : "bg-transparent border-transparent text-zinc-400 hover:bg-white/5 hover:text-zinc-200"
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${activeTab === key ? accent : ""}`} />
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h4 className="px-3 text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-2">System</h4>
              <div className="space-y-1">
                {[
                  { key: "files", label: "Global Vault", Icon: FolderOpen },
                  { key: "users", label: "User Management", Icon: Users },
                  { key: "news", label: "News Articles", Icon: Newspaper },
                  { key: "settings", label: "Account Settings", Icon: Settings },
                ].map(({ key, label, Icon }) => (
                  <button
                    key={key}
                    onClick={() => setActiveTab(key)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm font-medium ${
                      activeTab === key
                        ? "bg-white/10 text-white"
                        : "text-zinc-400 hover:bg-white/5 hover:text-zinc-200"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-4 pb-2">
            <div className="h-px w-full bg-white/10 mb-4" />
            <div className="px-3 flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Shortcuts</span>
            </div>
            
            {boardShortcuts.map(boardId => {
              const board = taskBoards.find(b => b.id === boardId);
              if (!board) return null;
              return (
                <button
                  key={`shortcut-${boardId}`}
                  onClick={() => {
                    setActiveTab("tasks");
                    setTaskViewMode("lists");
                    setActiveBoardId(boardId);
                  }}
                  className="w-full flex items-center justify-between group px-3 py-2 rounded-lg transition-colors text-xs font-medium text-zinc-400 hover:bg-white/5 hover:text-zinc-200"
                >
                  <span className="truncate pr-2 text-left">{board.title}</span>
                  <X 
                    className="w-3 h-3 opacity-0 group-hover:opacity-100 hover:text-red-400 transition-opacity shrink-0" 
                    onClick={(e) => handleRemoveShortcut(boardId, e)}
                  />
                </button>
              );
            })}

            <div className="relative mt-1">
              <button
                onClick={() => setShowShortcutDropdown(!showShortcutDropdown)}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-xs font-medium text-zinc-500 hover:bg-white/5 hover:text-zinc-300"
              >
                <Plus className="w-3.5 h-3.5" /> Add Shortcut
              </button>
              
              {showShortcutDropdown && (
                <div className="absolute top-full left-0 w-full mt-1 bg-[#1A1A1A] border border-white/10 rounded-lg shadow-xl overflow-hidden z-50">
                  <div className="max-h-48 overflow-y-auto p-1 custom-scrollbar">
                    {taskBoards.filter(b => !boardShortcuts.includes(b.id)).length > 0 ? (
                      taskBoards.filter(b => !boardShortcuts.includes(b.id)).map(board => (
                        <button
                          key={`add-${board.id}`}
                          onClick={() => handleAddShortcut(board.id)}
                          className="w-full text-left px-3 py-2 rounded-md hover:bg-white/10 text-xs text-zinc-300 truncate transition-colors"
                        >
                          {board.title}
                        </button>
                      ))
                    ) : (
                      <div className="px-3 py-2 text-xs text-zinc-500 italic text-center">No projects available</div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </nav>

        <div className="p-4 border-t border-white/5 space-y-3">
          <button 
            onClick={requestNotificationPermission}
            className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors text-xs font-medium border border-blue-500/20"
          >
            <Bell className="w-3.5 h-3.5" /> Enable Notifications
          </button>
          <div className="flex items-center gap-3 px-2">
            <UserAvatar email={user?.email} size="sm" ringClassName="ring-white/10" />
            <div className="min-w-0">
              <p className="text-xs font-medium text-white truncate">{user?.email}</p>
              <p className="text-[10px] text-zinc-500 uppercase tracking-widest mt-0.5">Administrator</p>
            </div>
          </div>
        </div>
      </aside>

      {/* ============ MAIN VIEW ============ */}
      <main className="flex-1 flex flex-col min-h-screen ml-0 md:ml-64 relative z-40">
        {/* Top Header */}
        <header className="h-16 border-b border-white/5 flex items-center justify-between px-8 sticky top-0 z-40 bg-[#0A0A0A]/80 backdrop-blur-xl">
          <h1 className="text-lg font-semibold text-white">
            {activeTab === "tickets" ? "Ticket Queue" : activeTab === "tasks" ? "Internal Tasks" : activeTab === "files" ? "File Vault" : "Insights"}
          </h1>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={palette.open}
              className="group flex items-center gap-2 pl-3 pr-2 py-1.5 rounded-md text-xs font-medium text-zinc-400 hover:text-white bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 hover:border-white/15 transition-colors"
              aria-label="Open command palette"
            >
              <Search className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Search</span>
              <kbd className="hidden sm:inline-flex items-center gap-0.5 ml-2 text-[10px] font-semibold text-zinc-500 bg-white/5 border border-white/10 rounded px-1.5 py-0.5">
                <CommandIcon className="w-2.5 h-2.5" />K
              </kbd>
            </button>
            <Link
              href="/"
              className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-colors text-zinc-400 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/10"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Return to Website
            </Link>
          </div>
        </header>

        {/* Dynamic Content Area */}
        <div className="flex-1 p-4 md:p-8 pb-24 md:pb-8 max-w-7xl mx-auto w-full">

          {/* ============ TICKETS ============ */}
          {activeTab === "tickets" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {/* Stats Row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-[#111111] rounded-2xl p-6 border border-white/5 flex flex-col gap-2 relative overflow-hidden">
                   <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-bl-full pointer-events-none" />
                   <p className="text-sm text-zinc-400 font-medium flex items-center gap-2">
                     <AlertCircle className="w-4 h-4 text-amber-500/50" /> Pending Review
                   </p>
                   <p className="text-4xl font-semibold text-white tracking-tight">{tickets.filter(t => t.status === 'pending').length}</p>
                </div>
                <div className="bg-[#111111] rounded-2xl p-6 border border-white/5 flex flex-col gap-2 relative overflow-hidden">
                   <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-bl-full pointer-events-none" />
                   <p className="text-sm text-zinc-400 font-medium flex items-center gap-2">
                     <Clock className="w-4 h-4 text-blue-500/50" /> In Progress
                   </p>
                   <p className="text-4xl font-semibold text-white tracking-tight">{tickets.filter(t => t.status === 'in_progress').length}</p>
                </div>
                <div className="bg-[#111111] rounded-2xl p-6 border border-white/5 flex flex-col gap-2 relative overflow-hidden">
                   <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-bl-full pointer-events-none" />
                   <p className="text-sm text-zinc-400 font-medium flex items-center gap-2">
                     <CheckCircle2 className="w-4 h-4 text-emerald-500/50" /> Resolved
                   </p>
                   <p className="text-4xl font-semibold text-white tracking-tight">{tickets.filter(t => t.status === 'completed').length}</p>
                </div>
              </div>

              {/* Toolbar */}
              <div className="flex flex-wrap items-center justify-between gap-4 mt-10 mb-4">
                <div className="flex bg-[#111111] p-1 rounded-lg border border-white/5">
                  {(["all", "active", "completed"] as const).map((f) => (
                    <button
                      key={f}
                      onClick={() => setTicketFilter(f)}
                      className={`px-5 py-1.5 rounded-md text-xs font-semibold capitalize transition-all ${
                        ticketFilter === f
                          ? "bg-zinc-800 text-white shadow-sm"
                          : "text-zinc-500 hover:text-zinc-300"
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
                
                <div className="relative">
                  <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input 
                    type="text" 
                    placeholder="Search tickets..." 
                    className="bg-[#111111] border border-white/5 rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-zinc-700 text-zinc-200 placeholder:text-zinc-600 transition-colors w-72"
                  />
                </div>
              </div>

              {/* Tickets List */}
              <div className="space-y-4">
                <AnimatePresence mode="popLayout">
                  {unifiedQueue.length > 0 ? unifiedQueue.map((item, i) => (
                    <motion.div
                      key={`${item.type}-${item.id}`}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      transition={{ duration: 0.2, delay: i * 0.03 }}
                      className={`bg-[#111111] border border-white/5 rounded-xl p-4 transition-all hover:border-white/10 group relative flex flex-col gap-3`}
                    >
                      {/* Urgent Edge Highlight */}
                      {item.priority === 'Urgent' && (
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-500 rounded-l-xl" />
                      )}

                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex-1 min-w-0 flex flex-col gap-1.5 pl-2">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs font-mono text-zinc-500">#{item.id.substring(0,6)}</span>
                            <h3 className="text-base font-bold text-white truncate max-w-sm" title={item.title}>{item.title}</h3>
                            {item.priority === 'Urgent' && <span className="bg-red-500/10 text-red-500 border border-red-500/20 text-[9px] uppercase font-bold px-1.5 py-0.5 rounded">Urgent</span>}
                            {item.type === 'ticket' ? (
                              <span className="bg-purple-500/10 text-purple-400 border border-purple-500/20 text-[9px] uppercase font-bold px-1.5 py-0.5 rounded">Ticket</span>
                            ) : (
                              <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[9px] uppercase font-bold px-1.5 py-0.5 rounded">Task</span>
                            )}
                            <span className={`text-[9px] uppercase font-bold px-1.5 py-0.5 rounded border ${getStatusColor(item.status)}`}>
                              {item.status.replace('_', ' ')}
                            </span>
                            <span className="flex items-center gap-1 bg-white/5 text-zinc-300 border border-white/5 text-[9px] uppercase font-bold px-1.5 py-0.5 rounded">
                              {item.client.split('@')[0]}
                            </span>
                          </div>
                          
                          {/* Description */}
                          <div className="text-xs text-zinc-400 truncate max-w-4xl pr-4">
                            {item.description}
                          </div>
                        </div>

                        {/* Actions (right aligned on desktop) */}
                        <div className="flex items-center gap-2 shrink-0">
                          {item.status === 'pending' && (
                            <Button 
                              variant="outline" size="sm" 
                              onClick={() => item.type === 'ticket' ? updateTicketStatus(item.id, 'in_progress') : updateInternalTaskStatus(item.id, 'in_progress')} 
                              className="h-8 text-xs text-blue-400 border-blue-400/20 bg-blue-400/10 hover:bg-blue-400/20 px-3"
                            >
                              <Clock className="w-3.5 h-3.5 mr-1.5" /> Start
                            </Button>
                          )}
                          {item.status !== 'completed' && (
                            <Button 
                              variant="outline" size="sm" 
                              onClick={() => item.type === 'ticket' ? updateTicketStatus(item.id, 'completed') : updateInternalTaskStatus(item.id, 'completed')} 
                              className="h-8 text-xs text-emerald-400 border-emerald-400/20 bg-emerald-400/10 hover:bg-emerald-400/20 px-3"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" /> Resolve
                            </Button>
                          )}
                          
                          <div className="w-px h-5 bg-white/10 mx-1 hidden sm:block" />

                          {item.type === 'ticket' ? (
                            <Button variant="ghost" size="sm" onClick={() => handleOpenTicket(item.originalItem)} className="h-8 text-xs text-zinc-400 hover:text-white hover:bg-white/5">
                              Details <ChevronRight className="w-3.5 h-3.5 ml-1" />
                            </Button>
                          ) : (
                            <>
                              <Button variant="ghost" size="sm" onClick={() => handleOpenTask(item.originalItem)} className="h-8 text-xs text-zinc-400 hover:text-white hover:bg-white/5">
                                <MessageSquare className="w-3.5 h-3.5" />
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => { setActiveTab('tasks'); setActiveBoardId(item.originalItem.board_id); setTaskViewMode('lists'); }} className="h-8 text-xs text-zinc-400 hover:text-white hover:bg-white/5 px-2">
                                Project <ChevronRight className="w-3.5 h-3.5 ml-1" />
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )) : (
                    <div className="bg-[#111111] border border-white/5 rounded-2xl p-16 text-center flex flex-col items-center justify-center">
                      <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-6">
                        <MessageSquare className="w-8 h-8 text-zinc-600" />
                      </div>
                      <h3 className="text-lg font-bold text-white mb-2">No action items found</h3>
                      <p className="text-sm text-zinc-500 max-w-sm mx-auto">You're all caught up! There are no items matching the current filter criteria.</p>
                    </div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}

          {/* ============ INTERNAL TASKS ============ */}
          {activeTab === "tasks" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {/* Stats Row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-[#111111] rounded-2xl p-6 border border-white/5 flex flex-col gap-2 relative overflow-hidden">
                   <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-bl-full pointer-events-none" />
                   <p className="text-sm text-zinc-400 font-medium flex items-center gap-2">
                     <AlertCircle className="w-4 h-4 text-amber-500/50" /> Pending Tasks
                   </p>
                   <p className="text-4xl font-semibold text-white tracking-tight">{allInternalTasks.filter(t => t.status === 'pending').length}</p>
                </div>
                <div className="bg-[#111111] rounded-2xl p-6 border border-white/5 flex flex-col gap-2 relative overflow-hidden">
                   <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-bl-full pointer-events-none" />
                   <p className="text-sm text-zinc-400 font-medium flex items-center gap-2">
                     <Clock className="w-4 h-4 text-blue-500/50" /> In Progress Tasks
                   </p>
                   <p className="text-4xl font-semibold text-white tracking-tight">{allInternalTasks.filter(t => t.status === 'in_progress').length}</p>
                </div>
                <div className="bg-[#111111] rounded-2xl p-6 border border-white/5 flex flex-col gap-2 relative overflow-hidden">
                   <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-bl-full pointer-events-none" />
                   <p className="text-sm text-zinc-400 font-medium flex items-center gap-2">
                     <CheckCircle2 className="w-4 h-4 text-emerald-500/50" /> Completed Tasks
                   </p>
                   <p className="text-4xl font-semibold text-white tracking-tight">{allInternalTasks.filter(t => t.status === 'completed').length}</p>
                </div>
              </div>

              {/* Top Navigation / Toggle */}
              <div className="flex bg-[#111111] border border-white/5 rounded-xl p-1 w-fit">
                <button
                  onClick={() => setTaskViewMode("lists")}
                  className={`px-6 py-2 rounded-lg text-sm font-semibold transition-colors ${taskViewMode === 'lists' ? 'bg-[#F0564A] text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
                >
                  Project Boards
                </button>
                <button
                  onClick={() => setTaskViewMode("overview")}
                  className={`px-6 py-2 rounded-lg text-sm font-semibold transition-colors ${taskViewMode === 'overview' ? 'bg-[#F0564A] text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
                >
                  Client Overview Dashboard
                </button>
              </div>

              {taskViewMode === "lists" ? (
                <>
                  <div className="flex flex-col gap-8">
                    {/* Top Section: Projects List */}
                    <div className="w-full flex flex-col gap-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-bold text-white uppercase tracking-wider">Select Project</h3>
                        <Button 
                          onClick={() => {
                            setNewBoardTitle("");
                            setNewBoardClient("");
                            setNewBoardSelectedMembers([]);
                            setShowNewBoardModal(true);
                          }}
                          className="bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 rounded-lg px-3 h-9 flex items-center transition-colors text-xs font-semibold"
                          title="New Project"
                        >
                          <Plus className="w-4 h-4 mr-1.5" /> New Project
                        </Button>
                      </div>
                      
                      {taskBoards.length > 0 ? (
                        <Reorder.Group 
                          axis="x" 
                          values={taskBoards} 
                          onReorder={handleReorderBoards}
                          className="flex overflow-x-auto pb-4 gap-3 custom-scrollbar"
                        >
                          {taskBoards.map(board => (
                            <Reorder.Item
                              key={board.id}
                              value={board}
                              className="shrink-0 cursor-grab active:cursor-grabbing list-none"
                            >
                              <button
                                onClick={() => setActiveBoardId(board.id)}
                                className={`w-64 flex flex-col items-start gap-1.5 p-4 rounded-xl text-left transition-all border ${activeBoardId === board.id ? 'bg-[#F0564A]/10 border-[#F0564A]/30 text-white shadow-sm ring-1 ring-[#F0564A]/50' : 'bg-[#111111] border-white/5 text-zinc-400 hover:bg-white/5 hover:text-zinc-200 hover:border-white/10'}`}
                              >
                                <span className="font-semibold text-sm truncate w-full">{board.title}</span>
                                <span className={`text-[10px] uppercase tracking-wider font-bold truncate w-full ${activeBoardId === board.id ? 'text-[#F0564A]' : 'text-zinc-500'}`}>
                                  {board.client_tag || 'Internal / Untagged'}
                                </span>
                              </button>
                            </Reorder.Item>
                          ))}
                        </Reorder.Group>
                      ) : (
                        <div className="flex overflow-x-auto pb-4 gap-3 custom-scrollbar">
                          <div className="text-sm text-zinc-500 italic p-4 text-center border border-white/5 rounded-xl border-dashed w-full">
                            No projects available.
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Bottom Section: Active Project Details & Tasks */}
                    <div className="flex-1 min-w-0 flex flex-col gap-6 bg-[#111111]/30 p-1 sm:p-6 rounded-3xl border border-white/5">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#111111] p-5 rounded-2xl border border-white/10 shadow-sm">
                        <div className="min-w-0 flex-1">
                          <h2 className="text-xl font-bold text-white mb-1 truncate">
                            {taskBoards.find(b => b.id === activeBoardId)?.title || "Select a Project"}
                          </h2>
                          <p className="text-sm text-zinc-400 truncate">
                            {taskBoards.find(b => b.id === activeBoardId)?.client_tag ? `Client: ${taskBoards.find(b => b.id === activeBoardId)?.client_tag}` : "Internal / Untagged"}
                          </p>
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-2 shrink-0">
                          <Button 
                            onClick={() => setShowManageMembersModal(true)}
                            disabled={!activeBoardId || (!isSuperAdmin && taskBoards.find(b => b.id === activeBoardId)?.created_by !== user?.id)}
                            className={`border rounded-lg px-3 h-9 flex items-center transition-colors text-xs font-semibold ${boardMembers.length > 0 ? 'bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border-blue-500/20' : 'bg-white/5 hover:bg-white/10 text-zinc-300 border-white/10'} disabled:opacity-50 disabled:cursor-not-allowed`}
                            title="Manage Project Access"
                          >
                            <Users className="w-4 h-4 mr-1.5" /> 
                            {boardMembers.length > 0 ? `Shared (${boardMembers.length})` : 'Private'}
                          </Button>
                          
                          <Button 
                            onClick={handleShareTasks}
                            disabled={!activeBoardId}
                            className="bg-white/10 hover:bg-white/20 text-white border border-white/5 rounded-lg px-3 h-9 flex items-center transition-colors text-xs"
                            title="Get Shareable Public Link"
                          >
                            <Share2 className="w-4 h-4 mr-1.5" /> Link
                          </Button>

                          <Button 
                            onClick={handleDeleteBoard}
                            disabled={!activeBoardId || (!isSuperAdmin && taskBoards.find(b => b.id === activeBoardId)?.created_by !== user?.id)}
                            className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-lg px-3 h-9 flex items-center transition-colors text-xs"
                            title="Delete this entire project"
                          >
                            <Trash2 className="w-4 h-4 mr-1.5" /> Delete
                          </Button>
                        </div>
                      </div>

              {/* Add New Task Form */}
              <div className="bg-[#111111] p-4 rounded-xl border border-white/5">
                <form onSubmit={handleCreateTask} className="flex flex-col sm:flex-row items-start gap-3">
                  <div className="flex-1 w-full relative">
                    <textarea 
                      value={newTaskTitle}
                      onChange={(e) => setNewTaskTitle(e.target.value)}
                    placeholder="Add a task, or paste a list of multiple tasks to add them to this project all at once..." 
                    className="w-full bg-black/50 border border-white/5 rounded-lg pl-4 pr-4 py-2.5 text-sm focus:outline-none focus:border-zinc-600 text-white placeholder:text-zinc-500 min-h-[44px] max-h-32 resize-y"
                      rows={1}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleCreateTask(e as any);
                        }
                      }}
                    />
                  </div>
                  <div className="w-full sm:w-48 relative">
                    <input 
                      type="text" 
                      list="client-suggestions"
                      value={newTaskClient}
                      onChange={(e) => setNewTaskClient(e.target.value)}
                      placeholder="Client Tag" 
                      className="w-full bg-black/50 border border-white/5 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-zinc-600 text-white placeholder:text-zinc-500"
                    />
                    <datalist id="client-suggestions">
                      <option value="Aclipse" />
                      <option value="Actym" />
                      <option value="Agilex" />
                      <option value="Akigai" />
                      <option value="CELLTAXIS" />
                      <option value="FREEQ" />
                      <option value="FRENELLE" />
                      <option value="HSD" />
                      <option value="Infocustx" />
                      <option value="Keife" />
                      <option value="Leon Nano" />
                      <option value="Lytix" />
                      <option value="Medicenna" />
                      <option value="Metfora" />
                      <option value="MSC" />
                      <option value="Paint" />
                      <option value="PBL" />
                      <option value="PBT" />
                      <option value="PGP Health" />
                      <option value="Phytonatural" />
                      <option value="Platypus" />
                      <option value="Precision Bio Tools" />
                      <option value="Resolve" />
                      <option value="RSO" />
                      <option value="Seyltx" />
                      <option value="Sirna" />
                      <option value="Southern Clinical" />
                      <option value="SpaceMD" />
                      <option value="Mighty Spark Internal" />
                    </datalist>
                  </div>
                  <Button 
                    type="submit"
                    disabled={!newTaskTitle.trim() || !activeBoardId}
                    className="w-full sm:w-auto bg-[#F0564A] hover:bg-[#D94D42] text-white rounded-lg px-6 h-10 shadow-sm"
                  >
                    Add Task
                  </Button>
                </form>
              </div>

              {/* Task List */}
              <div className="bg-[#111111] rounded-2xl border border-white/5 overflow-hidden">
                <AnimatePresence mode="popLayout">
                  {internalTasks.map((task) => (
                    <motion.div
                      key={task.id}
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className={`border-b border-white/5 last:border-0 p-5 hover:bg-white/[0.02] transition-colors flex flex-col gap-3 ${task.status === 'completed' ? 'opacity-60' : ''}`}
                    >
                      <div className="flex items-center gap-4">
                        <button 
                          onClick={() => updateInternalTaskStatus(task.id, task.status === 'completed' ? 'pending' : 'completed')}
                          className={`w-6 h-6 rounded-md border flex items-center justify-center shrink-0 transition-colors ${task.status === 'completed' ? 'bg-emerald-500 border-emerald-500 text-white' : 'bg-transparent border-zinc-600 hover:border-emerald-500 text-transparent hover:text-emerald-500'}`}
                        >
                          <CheckCircle2 className="w-4 h-4" />
                        </button>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4 mb-1">
                            <p className={`text-base font-medium break-words whitespace-pre-wrap flex-1 min-w-0 ${task.status === 'completed' ? 'text-zinc-500 line-through' : 'text-zinc-100'}`}>
                              {task.title}
                            </p>
                            {task.client_tag && (
                              <span className="inline-flex shrink-0 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-white/10 text-zinc-300 border border-white/10 mt-1">
                                {task.client_tag}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-3">
                            <p className="text-xs text-zinc-500">
                              Added {new Date(task.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {task.status !== 'completed' && task.status !== 'in_progress' && (
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => updateInternalTaskStatus(task.id, 'in_progress')}
                              className="h-8 text-xs text-blue-400 hover:bg-blue-400/10 hover:text-blue-300"
                            >
                              <Clock className="w-3.5 h-3.5 mr-1.5" /> Start
                            </Button>
                          )}
                          {task.status === 'in_progress' && (
                            <span className="inline-flex px-2 py-1 rounded text-[10px] font-bold uppercase border bg-blue-500/10 text-blue-400 border-blue-500/20 mr-2">
                              In Progress
                            </span>
                          )}
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleOpenTask(task)}
                            className="h-8 text-xs text-zinc-400 hover:text-white hover:bg-white/5"
                          >
                            <MessageSquare className="w-4 h-4 mr-1.5" /> Chat
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => deleteInternalTask(task.id)}
                            className="h-8 w-8 text-zinc-500 hover:text-red-400 hover:bg-red-500/10"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                    </motion.div>
                  ))}
                  {internalTasks.length === 0 && (
                    <div className="text-center p-16">
                      <CheckSquare className="w-10 h-10 text-zinc-700 mx-auto mb-4" />
                      <p className="text-lg font-medium text-white mb-1">No pending tasks</p>
                      <p className="text-sm text-zinc-500">Add a task above to get started.</p>
                    </div>
                  )}
                </AnimatePresence>
              </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="space-y-6">
                  {/* CLIENT OVERVIEW DASHBOARD */}
                  <div className="bg-[#111111] rounded-2xl border border-white/5 overflow-hidden p-6">
                    <div className="mb-6">
                      <h3 className="text-lg font-bold text-white mb-1">Active Tasks by Client</h3>
                      <p className="text-sm text-zinc-400">An overview of all pending tasks across all projects, grouped by Client Tag.</p>
                    </div>
                    
                    <div className="space-y-8">
                      {Array.from(new Set(internalTasks.map(t => t.client_tag || 'Internal / Untagged'))).sort().map(client => {
                        const clientTasks = internalTasks.filter(t => (t.client_tag || 'Internal / Untagged') === client);
                        return (
                          <div key={client} className="space-y-3">
                            <div className="flex items-center gap-2 border-b border-white/10 pb-2">
                              <h4 className="text-sm font-bold text-white uppercase tracking-wider">{client}</h4>
                              <span className="bg-white/10 text-zinc-300 px-2 py-0.5 rounded-full text-xs font-semibold">{clientTasks.length}</span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                              {clientTasks.map(task => {
                                const board = taskBoards.find(b => b.id === task.board_id);
                                return (
                                  <div key={task.id} className="bg-black/40 border border-white/5 p-4 rounded-xl hover:bg-white/[0.02] transition-colors flex flex-col justify-between">
                                    <div>
                                      <p className="text-sm font-medium text-zinc-100 mb-2">{task.title}</p>
                                    </div>
                                    <div className="flex items-center justify-between mt-4">
                                      <span className="text-[10px] text-zinc-500 truncate max-w-[120px]">
                                        in <span className="font-semibold text-zinc-400">{board?.title || 'Unknown Project'}</span>
                                      </span>
                                      <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${task.status === 'in_progress' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 'bg-amber-500/10 text-amber-500 border-amber-500/20'}`}>
                                        {task.status.replace('_', ' ')}
                                      </span>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                      {internalTasks.length === 0 && (
                        <div className="text-center p-12">
                          <CheckSquare className="w-10 h-10 text-zinc-700 mx-auto mb-4" />
                          <p className="text-lg font-medium text-white mb-1">No active tasks across any projects</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* ============ FILE VAULT ============ */}
          {activeTab === "files" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="bg-[#111111] rounded-2xl border border-white/5 overflow-hidden">
                <div className="p-6 border-b border-white/5 flex items-center justify-between">
                  <h2 className="text-lg font-bold text-white">Global File Vault</h2>
                  <div className="flex items-center gap-4">
                    <Button 
                      onClick={() => setShowRequestModal(true)}
                      className="bg-white/10 hover:bg-white/20 text-white border border-white/5 rounded-lg h-9 px-4 text-xs font-medium transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5 mr-1.5" /> Request File
                    </Button>
                    <div className="relative">
                      <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input 
                        type="text" 
                        placeholder="Search files..." 
                        className="bg-black/50 border border-white/5 rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-zinc-700 text-zinc-200 placeholder:text-zinc-600 transition-colors w-64"
                      />
                    </div>
                  </div>
                </div>
                <table className="w-full text-left border-collapse min-w-[640px]">
                  <thead>
                    <tr className="border-b border-white/5 text-[10px] uppercase tracking-widest text-zinc-500 bg-black/20 font-semibold">
                      <th className="p-5 pl-6">File Name</th>
                      <th className="p-5">Client ID</th>
                      <th className="p-5">Folder</th>
                      <th className="p-5">Size</th>
                      <th className="p-5">Visibility</th>
                      <th className="p-5 text-right pr-6">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {vaultFiles.map(file => (
                      <tr key={file.id} className="hover:bg-white/[0.02] transition-colors group">
                        <td className="p-5 pl-6 text-sm text-zinc-200 font-medium flex items-center gap-3">
                          <FolderOpen className="w-4 h-4 text-zinc-500" />
                          {file.name}
                        </td>
                        <td className="p-5 text-xs text-zinc-500 font-mono">
                          <span className="bg-white/5 px-2 py-1 rounded">
                            {file.client_id === '00000000-0000-0000-0000-000000000000' 
                              ? 'GLOBAL' 
                              : (usersList.find(u => u.id === file.client_id)?.email || file.client_id.substring(0,8))}
                          </span>
                        </td>
                        <td className="p-5 text-sm text-zinc-400">{file.folder}</td>
                        <td className="p-5 text-sm text-zinc-500">{(file.size / 1024 / 1024).toFixed(2)} MB</td>
                        <td className="p-5">
                          <span className={`inline-flex px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider border ${file.is_internal ? "bg-amber-500/10 text-amber-500 border-amber-500/20" : file.client_id === '00000000-0000-0000-0000-000000000000' ? "bg-blue-500/10 text-blue-400 border-blue-500/20" : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"}`}>
                            {file.is_internal ? "Internal Only" : file.client_id === '00000000-0000-0000-0000-000000000000' ? "Global Visible" : "Client Visible"}
                          </span>
                        </td>
                        <td className="p-5 pr-6 text-right flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          {file.name.match(/\.(jpeg|jpg|gif|png|webp)$/i) && (
                            <Button variant="ghost" size="sm" onClick={() => handlePreviewFile(file)} className="h-8 text-xs text-zinc-400 hover:text-white hover:bg-white/5 rounded-md">
                              <Eye className="w-3.5 h-3.5 mr-1.5" /> Preview
                            </Button>
                          )}
                          <Button variant="ghost" size="sm" onClick={() => handleShareLink(file.storage_path)} className="h-8 text-xs text-zinc-400 hover:text-white hover:bg-white/5 rounded-md">
                            <Link2 className="w-3.5 h-3.5 mr-1.5" /> Share
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => openEditFileModal(file)} className="h-8 text-xs text-zinc-400 hover:text-white hover:bg-white/5 rounded-md">
                            Edit
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => deleteVaultFile(file.id, file.storage_path)} className="h-8 w-8 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded-md ml-1">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                    {vaultFiles.length === 0 && (
                      <tr>
                        <td colSpan={6} className="text-center text-zinc-500 p-20 text-sm">
                          <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
                            <FolderOpen className="w-8 h-8 text-zinc-600" />
                          </div>
                          No files stored in the vault across any clients.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {/* ============ CLIENT MANAGEMENT ============ */}
          {activeTab === "users" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-xl font-bold text-white mb-1">User Management</h2>
                  <p className="text-sm text-zinc-400">Manage portal access and assign roles or companies.</p>
                </div>
                {isSuperAdmin && (
                  <Button 
                    onClick={() => setShowNewUserModal(true)}
                    className="bg-[#F0564A] hover:bg-[#F0564A]/90 text-white"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    New User
                  </Button>
                )}
              </div>
              <div className="bg-[#111111] rounded-2xl border border-white/5 overflow-hidden">
                <table className="w-full text-left border-collapse min-w-[640px]">
                  <thead>
                    <tr className="border-b border-white/5 text-[10px] uppercase tracking-widest text-zinc-500 bg-black/20 font-semibold">
                      <th className="p-5 pl-6">User Email</th>
                      <th className="p-5">User ID</th>
                      <th className="p-5">Role</th>
                      <th className="p-5">Company</th>
                      <th className="p-5 text-right pr-6">Manage User</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {usersList.map((u) => (
                      <tr key={u.id} className="hover:bg-white/[0.02] transition-colors group">
                        <td className="p-5 pl-6 text-sm font-semibold text-zinc-100 flex items-center gap-3">
                           <UserAvatar email={u.email} size="sm" ringClassName={u.role === 'admin' || u.role === 'superadmin' ? 'ring-[#F0564A]/30' : 'ring-white/10'} />
                           {u.email}
                        </td>
                        <td className="p-5 text-xs text-zinc-500 font-mono">
                          <span className="bg-white/5 px-2 py-1 rounded">{u.id.substring(0,8)}</span>
                        </td>
                        <td className="p-5">
                          <span className={`inline-flex px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider border ${
                            u.role === 'superadmin' ? "bg-purple-500/10 text-purple-400 border-purple-500/20" :
                            u.role === 'admin' ? "bg-[#F0564A]/10 text-[#F0564A] border-[#F0564A]/20" : 
                            "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                          }`}>
                            {u.role === 'superadmin' ? 'Master Admin' : u.role}
                          </span>
                        </td>
                        <td className="p-5">
                          <span className="text-sm text-zinc-300">
                            {u.company || <span className="text-zinc-600 italic">None</span>}
                          </span>
                        </td>
                        <td className="p-5 pr-6 text-right flex items-center justify-end gap-2">
                          {u.role === 'client' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => window.open(`/portal/dashboard?impersonate=${u.id}`, '_blank')}
                              className="text-xs border-blue-500/20 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 hover:text-blue-300 h-8 mr-2"
                              title="View portal as this client"
                            >
                              <Eye className="w-3.5 h-3.5 mr-1.5" /> View As Client
                            </Button>
                          )}
                          {isSuperAdmin ? (
                            <>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  const newCompany = prompt("Enter new company name:", u.company || "");
                                  if (newCompany !== null) {
                                    handleUpdateUserCompany(u.id, newCompany);
                                  }
                                }}
                                className="text-xs text-zinc-400 hover:text-white hover:bg-white/5 h-8 mr-2"
                                title="Edit Company"
                              >
                                Edit Co.
                              </Button>
                              <select
                                value={u.role || 'client'}
                                onChange={(e) => handleUpdateUserRole(u.id, e.target.value)}
                                className="bg-black/50 border border-white/10 rounded-md px-3 py-1.5 text-xs text-zinc-300 focus:outline-none focus:border-[#F0564A]"
                              >
                                <option value="client">Client</option>
                                <option value="admin">Admin</option>
                                <option value="superadmin">Master Admin</option>
                              </select>
                            </>
                          ) : (
                            <span className="text-xs text-zinc-500 italic">No permission</span>
                          )}
                        </td>
                      </tr>
                    ))}
                    {usersList.length === 0 && (
                      <tr>
                        <td colSpan={5} className="text-center text-zinc-500 p-20 text-sm">
                          Loading users...
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {/* ============ SETTINGS ============ */}
          {activeTab === "settings" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="max-w-2xl"
            >
              <div className="mb-8">
                <h2 className="text-xl font-bold text-white mb-1">Account Settings</h2>
                <p className="text-sm text-zinc-400">Manage your profile and security.</p>
              </div>

              <div className="bg-[#111111] rounded-2xl border border-white/5 p-6 space-y-6">
                <div>
                  <h3 className="text-sm font-semibold text-white mb-4">Update Password</h3>
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
                  }} className="space-y-4">
                    <div>
                      <label className="block text-xs font-medium text-zinc-400 mb-1.5">New Password</label>
                      <input 
                        name="password"
                        type="password" 
                        placeholder="••••••••" 
                        className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#F0564A] transition-colors"
                      />
                    </div>
                    <Button type="submit" className="bg-[#F0564A] hover:bg-[#F0564A]/90 text-white w-full sm:w-auto">
                      Update Password
                    </Button>
                  </form>
                </div>
              </div>
            </motion.div>
          )}

          {/* ============ NEWS ============ */}
          {activeTab === "news" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-bold text-white">News & Insights Management</h2>
                <Link href="/admin/news/create" className="bg-white hover:bg-zinc-200 text-black px-5 py-2.5 rounded-lg text-sm font-semibold flex items-center transition-colors shadow-sm">
                  <Plus className="w-4 h-4 mr-2" />
                  New Article
                </Link>
              </div>
              <div className="bg-[#111111] rounded-2xl border border-white/5 overflow-hidden">
                <table className="w-full text-left border-collapse min-w-[640px]">
                  <thead>
                    <tr className="border-b border-white/5 text-[10px] uppercase tracking-widest text-zinc-500 bg-black/20 font-semibold">
                      <th className="p-5 pl-6">Title</th>
                      <th className="p-5">Date</th>
                      <th className="p-5">Read Time</th>
                      <th className="p-5 text-right pr-6"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {articles.map((article) => (
                      <tr key={article.id} className="hover:bg-white/[0.02] transition-colors group">
                        <td className="p-5 pl-6 text-sm font-semibold text-zinc-100">{article.title}</td>
                        <td className="p-5 text-sm text-zinc-400">{article.date}</td>
                        <td className="p-5 text-sm text-zinc-500">{article.readTime}</td>
                        <td className="p-5 pr-6 text-right flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Link href={`/admin/news/edit/${article.id}`} className="text-zinc-400 hover:text-white px-4 py-2 rounded-md hover:bg-white/5 text-xs font-medium transition-colors border border-transparent hover:border-white/10">
                            Edit Article
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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
                      onClick={() => handleShareLink(previewFile.storage_path)}
                      className="text-zinc-400 hover:text-white hover:bg-white/5"
                    >
                      <Link2 className="w-4 h-4 mr-2" /> Share
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

      {/* ============ TICKET CHAT MODAL ============ */}
      <AnimatePresence>
        {selectedTicket && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedTicket(null)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100]"
            />
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.96 }}
              transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[92%] max-w-2xl max-h-[85vh] flex flex-col z-[101]"
            >
              <div className="rounded-2xl border border-white/10 overflow-hidden flex flex-col h-full bg-[#111111]">
                {/* Header */}
                <div className="p-6 border-b border-white/5 flex items-center justify-between shrink-0 bg-black/40">
                  <div>
                    <h3 className="text-xl font-bold text-white">{selectedTicket.title}</h3>
                    <div className="flex items-center gap-3 mt-2">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${getStatusColor(selectedTicket.status)}`}>
                        {selectedTicket.status.replace('_', ' ')}
                      </span>
                      <span className="text-xs text-zinc-500 font-mono">
                        Ticket #{selectedTicket.id.substring(0,8)}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedTicket(null)}
                    className="p-2 rounded-full transition-colors self-start text-zinc-500 hover:bg-white/5 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                {/* Chat Area */}
                <div ref={ticketChatScrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 bg-black/20 scroll-smooth">
                  {/* Original Ticket Description */}
                  <div className="flex gap-4">
                    {(() => {
                      const clientEmail = usersList.find(u => u.id === selectedTicket.client_id)?.email;
                      return <UserAvatar email={clientEmail} name={clientEmail?.split('@')[0]} size="md" ringClassName="ring-white/10" />;
                    })()}
                    <div className="flex-1">
                      <div className="flex items-baseline gap-2 mb-1">
                        <span className="font-semibold text-zinc-200">
                          {usersList.find(u => u.id === selectedTicket.client_id)?.email?.split('@')[0] || 'Client'}
                        </span>
                        <span className="text-xs text-zinc-500">{new Date(selectedTicket.created_at).toLocaleString()}</span>
                      </div>
                      <div className="p-4 rounded-2xl rounded-tl-sm text-sm whitespace-pre-wrap bg-white/5 border border-white/5 text-zinc-300">
                        {selectedTicket.description}
                      </div>
                    </div>
                  </div>

                  {/* Comments */}
                  {ticketComments.map((comment) => {
                    const isAdminComment = comment.user_id === user.id;
                    const commentUser = usersList.find(u => u.id === comment.user_id);
                    return (
                      <div key={comment.id} className="flex gap-4">
                        <UserAvatar
                          email={isAdminComment ? user.email : commentUser?.email}
                          name={isAdminComment ? 'MSC Admin' : commentUser?.email?.split('@')[0]}
                          size="md"
                          ringClassName={isAdminComment ? 'ring-[#F0564A]/30' : 'ring-white/10'}
                        />
                        <div className="flex-1">
                          <div className="flex items-baseline gap-2 mb-1">
                            <span className={`font-semibold ${isAdminComment ? 'text-[#F0564A]' : 'text-zinc-200'}`}>{isAdminComment ? 'You' : (commentUser?.email?.split('@')[0] || 'Client')}</span>
                            <span className="text-xs text-zinc-500">{new Date(comment.created_at).toLocaleString()}</span>
                          </div>
                          <div className={`p-4 rounded-2xl rounded-tl-sm text-sm whitespace-pre-wrap border ${isAdminComment ? 'bg-[#F0564A]/5 border-[#F0564A]/10 text-zinc-200' : 'bg-white/5 border-white/5 text-zinc-300'}`}>
                            {comment.content}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Input Area */}
                <div className="p-4 border-t border-white/5 shrink-0 bg-black/40">
                  <div className="flex gap-3 p-1.5 rounded-xl border bg-black/50 border-white/10 focus-within:border-zinc-500">
                    <input
                      type="text"
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder="Type a reply..."
                      onKeyDown={(e) => { if(e.key === 'Enter') handleSubmitComment(); }}
                      className="flex-1 bg-transparent border-none outline-none px-3 text-sm text-white placeholder:text-zinc-600"
                    />
                    <Button
                      onClick={handleSubmitComment}
                      disabled={!commentText.trim()}
                      className="bg-[#F0564A] hover:bg-[#D94D42] text-white rounded-lg h-9 px-6 shadow-sm disabled:opacity-50"
                    >
                      Reply
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
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100]"
            />
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.96 }}
              transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[92%] max-w-2xl max-h-[85vh] flex flex-col z-[101]"
            >
              <div className="rounded-2xl border border-white/10 overflow-hidden flex flex-col h-full bg-[#111111]">
                {/* Header */}
                <div className="p-6 border-b border-white/5 flex items-center justify-between shrink-0 bg-black/40">
                  <div>
                    <h3 className="text-xl font-bold text-white">{selectedTask.title}</h3>
                    <div className="flex items-center gap-3 mt-2">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${getStatusColor(selectedTask.status)}`}>
                        {selectedTask.status.replace('_', ' ')}
                      </span>
                      <span className="text-xs text-zinc-500 font-mono">
                        Task #{selectedTask.id.substring(0,8)}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedTask(null)}
                    className="p-2 rounded-full transition-colors self-start text-zinc-500 hover:bg-white/5 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                {/* Chat Area */}
                <div ref={taskChatScrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 bg-black/20 scroll-smooth">
                  {/* Task Metadata */}
                  <div className="flex gap-4">
                    {(() => {
                      const creator = usersList.find(u => u.id === selectedTask.created_by);
                      return <UserAvatar email={creator?.email} name={creator?.email?.split('@')[0]} size="md" />;
                    })()}
                    <div className="flex-1">
                      <div className="flex items-baseline gap-2 mb-1">
                        <span className="font-semibold text-zinc-200">
                          {usersList.find(u => u.id === selectedTask.created_by)?.email?.split('@')[0] || 'Creator'}
                        </span>
                        <span className="text-xs text-zinc-500">{new Date(selectedTask.created_at).toLocaleString()}</span>
                      </div>
                      <div className="p-4 rounded-2xl rounded-tl-sm text-sm whitespace-pre-wrap bg-white/5 border border-white/5 text-zinc-300">
                        {`Client Tag: ${selectedTask.client_tag || 'None'}`}
                      </div>
                    </div>
                  </div>

                  {/* Comments */}
                  {taskComments.map((comment) => {
                    const isMyComment = comment.user_id === user.id;
                    const commentUser = usersList.find(u => u.id === comment.user_id);
                    return (
                      <div key={comment.id} className="flex gap-4">
                        <UserAvatar
                          email={isMyComment ? user.email : commentUser?.email}
                          name={isMyComment ? 'You' : commentUser?.email?.split('@')[0]}
                          size="md"
                          ringClassName={isMyComment ? 'ring-blue-400/30' : 'ring-white/10'}
                        />
                        <div className="flex-1">
                          <div className="flex items-baseline gap-2 mb-1">
                            <span className={`font-semibold ${isMyComment ? 'text-blue-400' : 'text-zinc-200'}`}>
                              {isMyComment ? 'You' : (commentUser?.email?.split('@')[0] || 'User')}
                            </span>
                            <span className="text-xs text-zinc-500">{new Date(comment.created_at).toLocaleString()}</span>
                          </div>
                          <div className={`p-4 rounded-2xl rounded-tl-sm text-sm whitespace-pre-wrap border ${isMyComment ? 'bg-blue-500/5 border-blue-500/10 text-zinc-200' : 'bg-white/5 border-white/5 text-zinc-300'}`}>
                            {comment.content}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Input Area */}
                <div className="p-4 border-t border-white/5 shrink-0 bg-black/40">
                  <div className="flex gap-3 p-1.5 rounded-xl border bg-black/50 border-white/10 focus-within:border-zinc-500">
                    <input
                      type="text"
                      value={taskCommentText}
                      onChange={(e) => setTaskCommentText(e.target.value)}
                      placeholder="Add a comment to this task..."
                      onKeyDown={(e) => { if(e.key === 'Enter') handleSubmitTaskComment(); }}
                      className="flex-1 bg-transparent border-none outline-none px-3 text-sm text-white placeholder:text-zinc-600"
                    />
                    <Button
                      onClick={handleSubmitTaskComment}
                      disabled={!taskCommentText.trim()}
                      className="bg-[#F0564A] hover:bg-[#D94D42] text-white rounded-lg h-9 px-6 shadow-sm disabled:opacity-50"
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

      {/* ============ FILE REQUEST MODAL ============ */}
      <AnimatePresence>
        {showRequestModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowRequestModal(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100]"
            />
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.96 }}
              transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[92%] max-w-lg flex flex-col z-[101]"
            >
              <div className="rounded-2xl border border-white/10 overflow-hidden flex flex-col h-full bg-[#111111]">
                <div className="p-6 border-b border-white/5 flex items-center justify-between shrink-0 bg-black/40">
                  <div>
                    <h3 className="text-xl font-bold text-white">Create File Request</h3>
                    <p className="text-sm text-zinc-400 mt-1">Send a magic link for clients to securely upload files.</p>
                  </div>
                  <button
                    onClick={() => setShowRequestModal(false)}
                    className="p-2 rounded-full transition-colors self-start text-zinc-500 hover:bg-white/5 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <form onSubmit={handleCreateRequest} className="p-6 space-y-5 bg-black/20">
                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">Client</label>
                    <input 
                      type="text" 
                      list="client-suggestions"
                      value={requestClient}
                      onChange={(e) => setRequestClient(e.target.value)}
                      placeholder="Select or type client name..." 
                      className="w-full bg-black/50 border border-white/5 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-zinc-500 text-white placeholder:text-zinc-600"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">Request Message (Optional)</label>
                    <textarea 
                      value={requestMessage}
                      onChange={(e) => setRequestMessage(e.target.value)}
                      placeholder="e.g. Please upload the Q3 financial report." 
                      className="w-full bg-black/50 border border-white/5 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-zinc-500 text-white placeholder:text-zinc-600 min-h-[100px] resize-none"
                    />
                  </div>
                  <div className="pt-2">
                    <Button 
                      type="submit"
                      disabled={!requestClient.trim()}
                      className="w-full bg-[#F0564A] hover:bg-[#D94D42] text-white rounded-lg h-11 font-medium shadow-sm disabled:opacity-50"
                    >
                      Generate Magic Link
                    </Button>
                  </div>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ============ EDIT FILE MODAL ============ */}
      <AnimatePresence>
        {editingFile && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEditingFile(null)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100]"
            />
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.96 }}
              transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[92%] max-w-lg flex flex-col z-[101]"
            >
              <div className="rounded-2xl border border-white/10 overflow-hidden flex flex-col h-full bg-[#111111]">
                <div className="p-6 border-b border-white/5 flex items-center justify-between shrink-0 bg-black/40">
                  <div>
                    <h3 className="text-xl font-bold text-white">Edit File Visibility</h3>
                    <p className="text-sm text-zinc-400 mt-1 truncate max-w-[280px]">{editingFile.name}</p>
                  </div>
                  <button
                    onClick={() => setEditingFile(null)}
                    className="p-2 rounded-full transition-colors self-start text-zinc-500 hover:bg-white/5 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <form onSubmit={handleUpdateFile} className="p-6 space-y-5 bg-black/20">
                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">Folder</label>
                    <input 
                      type="text" 
                      value={editFileFolder}
                      onChange={(e) => setEditFileFolder(e.target.value)}
                      placeholder="e.g. root or Client Assets" 
                      className="w-full bg-black/50 border border-white/5 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-zinc-500 text-white placeholder:text-zinc-600"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">Visibility Settings</label>
                    <div className="space-y-2">
                      {isSuperAdmin && (
                        <label className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${editFileVisibility === 'superadmin' ? 'bg-purple-500/10 border-purple-500/30' : 'bg-black/50 border-white/5'}`}>
                          <input type="radio" name="visibility" value="superadmin" checked={editFileVisibility === 'superadmin'} onChange={() => setEditFileVisibility('superadmin')} className="accent-purple-500" />
                          <div>
                            <div className={`font-semibold text-sm ${editFileVisibility === 'superadmin' ? 'text-purple-400' : 'text-zinc-200'}`}>Master Admin Only</div>
                            <div className="text-xs text-zinc-500">Only visible to Master Admins. Hidden from regular admins.</div>
                          </div>
                        </label>
                      )}
                      <label className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${editFileVisibility === 'internal' ? 'bg-amber-500/10 border-amber-500/30' : 'bg-black/50 border-white/5'}`}>
                        <input type="radio" name="visibility" value="internal" checked={editFileVisibility === 'internal'} onChange={() => setEditFileVisibility('internal')} className="accent-amber-500" />
                        <div>
                          <div className={`font-semibold text-sm ${editFileVisibility === 'internal' ? 'text-amber-500' : 'text-zinc-200'}`}>Internal Only</div>
                          <div className="text-xs text-zinc-500">Only visible to the MSC admin team.</div>
                        </div>
                      </label>
                      <label className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${editFileVisibility === 'global' ? 'bg-blue-500/10 border-blue-500/30' : 'bg-black/50 border-white/5'}`}>
                        <input type="radio" name="visibility" value="global" checked={editFileVisibility === 'global'} onChange={() => setEditFileVisibility('global')} className="accent-blue-500" />
                        <div>
                          <div className={`font-semibold text-sm ${editFileVisibility === 'global' ? 'text-blue-400' : 'text-zinc-200'}`}>Global (All Clients)</div>
                          <div className="text-xs text-zinc-500">Visible to EVERY logged-in client.</div>
                        </div>
                      </label>
                      <label className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${editFileVisibility === 'client' ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-black/50 border-white/5'}`}>
                        <input type="radio" name="visibility" value="client" checked={editFileVisibility === 'client'} onChange={() => setEditFileVisibility('client')} className="accent-emerald-500" />
                        <div className="flex-1">
                          <div className={`font-semibold text-sm ${editFileVisibility === 'client' ? 'text-emerald-400' : 'text-zinc-200'}`}>Specific Client</div>
                          <div className="text-xs text-zinc-500">Only visible to a specific client account.</div>
                          
                          {editFileVisibility === 'client' && (
                            <div className="mt-3">
                              <select 
                                value={editFileClient} 
                                onChange={(e) => setEditFileClient(e.target.value)}
                                className="w-full bg-black/50 border border-white/10 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                              >
                                <option value="" disabled>Select a client...</option>
                                {usersList.filter(u => u.role !== 'admin').map(u => (
                                  <option key={u.id} value={u.id}>{u.email}</option>
                                ))}
                                {usersList.length > 0 && !usersList.filter(u => u.role !== 'admin').some(u => u.id === editFileClient) && editFileClient && (
                                  <option value={editFileClient}>Currently: You (Admin)</option>
                                )}
                                {usersList.length === 0 && <option value={editingFile.client_id}>Keep current ({editingFile.client_id.substring(0,8)})</option>}
                              </select>
                            </div>
                          )}
                        </div>
                      </label>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/5 flex gap-3">
                    <Button 
                      type="button"
                      variant="ghost"
                      onClick={() => setEditingFile(null)}
                      className="flex-1 text-zinc-400 hover:text-white hover:bg-white/5"
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit"
                      disabled={editFileVisibility === 'client' && !editFileClient}
                      className="flex-1 bg-[#F0564A] hover:bg-[#D94D42] text-white rounded-lg shadow-sm disabled:opacity-50"
                    >
                      Save Changes
                    </Button>
                  </div>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ============ NEW BOARD MODAL ============ */}
      <AnimatePresence>
        {showNewBoardModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowNewBoardModal(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100]"
            />
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.96 }}
              transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[92%] max-w-md flex flex-col z-[101]"
            >
              <div className="rounded-2xl border border-white/10 overflow-hidden flex flex-col h-full bg-[#111111]">
                <div className="p-6 border-b border-white/5 flex items-center justify-between shrink-0 bg-black/40">
                  <div>
                    <h3 className="text-xl font-bold text-white">New Project</h3>
                    <p className="text-sm text-zinc-400 mt-1">Create a separate project board that can be shared with specific people.</p>
                  </div>
                  <button
                    onClick={() => setShowNewBoardModal(false)}
                    className="p-2 rounded-full transition-colors self-start text-zinc-500 hover:bg-white/5 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <form onSubmit={handleCreateBoard} className="p-6 space-y-5 bg-black/20">
                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">Project Title</label>
                    <input 
                      type="text" 
                      value={newBoardTitle}
                      onChange={(e) => setNewBoardTitle(e.target.value)}
                      placeholder="e.g. Q3 Marketing Plan" 
                      className="w-full bg-black/50 border border-white/5 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-zinc-500 text-white placeholder:text-zinc-600"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">Client Tag (Optional)</label>
                    <input 
                      type="text" 
                      list="client-suggestions"
                      value={newBoardClient}
                      onChange={(e) => setNewBoardClient(e.target.value)}
                      placeholder="Client this project is for" 
                      className="w-full bg-black/50 border border-white/5 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-zinc-500 text-white placeholder:text-zinc-600"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-zinc-300 mb-2">Share with Admins</label>
                      <div className="space-y-2 max-h-32 overflow-y-auto bg-black/30 p-3 rounded-lg border border-white/5">
                        {usersList.filter(u => (u.role === 'admin' || u.role === 'superadmin') && u.id !== user?.id).map(admin => (
                           <label key={admin.id} className="flex items-center gap-2 text-sm text-zinc-300 cursor-pointer">
                             <input 
                               type="checkbox" 
                               checked={newBoardSelectedMembers.includes(admin.id)}
                               onChange={(e) => {
                                 if (e.target.checked) setNewBoardSelectedMembers([...newBoardSelectedMembers, admin.id]);
                                 else setNewBoardSelectedMembers(newBoardSelectedMembers.filter(id => id !== admin.id));
                               }}
                               className="accent-[#F0564A]"
                             />
                             {admin.email.split('@')[0]}
                           </label>
                        ))}
                        {usersList.filter(u => (u.role === 'admin' || u.role === 'superadmin') && u.id !== user?.id).length === 0 && (
                          <div className="text-zinc-500 text-xs italic">No other admins.</div>
                        )}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-zinc-300 mb-2">Share with Clients</label>
                      <div className="space-y-2 max-h-32 overflow-y-auto bg-black/30 p-3 rounded-lg border border-white/5">
                        {usersList.filter(u => u.role !== 'admin' && u.role !== 'superadmin').map(client => (
                           <label key={client.id} className="flex items-center gap-2 text-sm text-zinc-300 cursor-pointer">
                             <input 
                               type="checkbox" 
                               checked={newBoardSelectedMembers.includes(client.id)}
                               onChange={(e) => {
                                 if (e.target.checked) {
                                    setNewBoardSelectedMembers([...newBoardSelectedMembers, client.id]);
                                    // Optionally auto-set the tag if it's empty
                                    if (!newBoardClient) setNewBoardClient(client.email.split('@')[0]);
                                 } else {
                                    setNewBoardSelectedMembers(newBoardSelectedMembers.filter(id => id !== client.id));
                                 }
                               }}
                               className="accent-emerald-500"
                             />
                             {client.email.split('@')[0]}
                           </label>
                        ))}
                        {usersList.filter(u => u.role !== 'admin' && u.role !== 'superadmin').length === 0 && (
                          <div className="text-zinc-500 text-xs italic">No registered clients.</div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="pt-2 flex gap-3">
                    <Button 
                      type="button"
                      variant="ghost"
                      onClick={() => setShowNewBoardModal(false)}
                      className="flex-1 text-zinc-400 hover:text-white hover:bg-white/5"
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit"
                      disabled={!newBoardTitle.trim()}
                      className="flex-1 bg-[#F0564A] hover:bg-[#D94D42] text-white rounded-lg shadow-sm disabled:opacity-50"
                    >
                      Create Project
                    </Button>
                  </div>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ============ MANAGE MEMBERS MODAL ============ */}
      <AnimatePresence>
        {showManageMembersModal && activeBoardId && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowManageMembersModal(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100]"
            />
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.96 }}
              transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[92%] max-w-lg flex flex-col z-[101]"
            >
              <div className="rounded-2xl border border-white/10 overflow-hidden flex flex-col h-full bg-[#111111]">
                  <div className="p-6 border-b border-white/5 flex items-center justify-between shrink-0 bg-black/40">
                    <div>
                      <h3 className="text-xl font-bold text-white">Manage Project Access</h3>
                      <p className="text-sm text-zinc-400 mt-1">Add or remove users who are allowed to view this project board.</p>
                    </div>
                  <button
                    onClick={() => setShowManageMembersModal(false)}
                    className="p-2 rounded-full transition-colors self-start text-zinc-500 hover:bg-white/5 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="p-6 space-y-6 bg-black/20">
                  {/* Add Member Form */}
                  <div className="flex gap-2">
                    <select
                      value={selectedUserToAdd}
                      onChange={(e) => setSelectedUserToAdd(e.target.value)}
                      className="flex-1 bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-sm text-zinc-100 focus:outline-none focus:border-[#F0564A]"
                    >
                      <option value="">Select a user to add...</option>
                      {usersList
                        .filter(u => !boardMembers.includes(u.id))
                        .map(u => (
                        <option key={u.id} value={u.id}>{u.email} ({u.role})</option>
                      ))}
                    </select>
                    <Button
                      onClick={handleAddMember}
                      disabled={!selectedUserToAdd}
                      className="bg-[#F0564A] hover:bg-[#D94D42] text-white rounded-lg px-4 shadow-sm disabled:opacity-50"
                    >
                      Add
                    </Button>
                  </div>

                  {/* Members List */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold text-zinc-300">Current Members ({boardMembers.length})</h4>
                    <div className="max-h-60 overflow-y-auto space-y-2 pr-2">
                      {boardMembers.length === 0 ? (
                        <p className="text-sm text-zinc-500 italic">No specific members added. (Admins can still see it)</p>
                      ) : (
                        usersList
                          .filter(u => boardMembers.includes(u.id))
                          .map(u => (
                            <div key={u.id} className="flex items-center justify-between bg-black/40 border border-white/5 p-3 rounded-lg">
                              <div className="flex items-center gap-3">
                                <UserAvatar email={u.email} size="sm" ringClassName={u.role === 'admin' || u.role === 'superadmin' ? 'ring-[#F0564A]/30' : 'ring-emerald-400/30'} />
                                <div>
                                  <p className="text-sm font-medium text-white">{u.email}</p>
                                  <p className="text-xs text-zinc-500 capitalize">{u.role}</p>
                                </div>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRemoveMember(u.id)}
                                className="text-zinc-500 hover:text-red-400 hover:bg-red-500/10 h-8 px-2"
                              >
                                Remove
                              </Button>
                            </div>
                          ))
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ============ NEW USER MODAL ============ */}
      <AnimatePresence>
        {showNewUserModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowNewUserModal(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
            />
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.96 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[92%] max-w-md z-[101]"
            >
              <div className="rounded-2xl border border-white/10 overflow-hidden bg-[#111111] shadow-2xl">
                <div className="p-6 border-b border-white/5 flex items-center justify-between bg-black/40">
                  <div>
                    <h3 className="text-xl font-bold text-white">Create New User</h3>
                    <p className="text-sm text-zinc-400 mt-1">Set up a new client or admin account.</p>
                  </div>
                  <button
                    onClick={() => setShowNewUserModal(false)}
                    className="p-2 rounded-full transition-colors text-zinc-500 hover:bg-white/5 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <form onSubmit={handleCreateUser} className="p-6 space-y-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-zinc-300">Email Address</label>
                    <input
                      required
                      type="email"
                      value={newUserEmail}
                      onChange={(e) => setNewUserEmail(e.target.value)}
                      placeholder="client@company.com"
                      className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-[#F0564A]"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-zinc-300">Password</label>
                    <input
                      required
                      type="password"
                      value={newUserPassword}
                      onChange={(e) => setNewUserPassword(e.target.value)}
                      placeholder="Min 6 characters"
                      className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-[#F0564A]"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-zinc-300">Role</label>
                      <select
                        value={newUserRole}
                        onChange={(e) => setNewUserRole(e.target.value)}
                        className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-[#F0564A]"
                      >
                        <option value="client">Client</option>
                        <option value="admin">Admin</option>
                        {isSuperAdmin && <option value="superadmin">Master Admin</option>}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-zinc-300">Company (Optional)</label>
                      <input
                        type="text"
                        value={newUserCompany}
                        onChange={(e) => setNewUserCompany(e.target.value)}
                        placeholder="e.g. Acme Corp"
                        className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-[#F0564A]"
                      />
                    </div>
                  </div>
                  <div className="pt-4 flex justify-end gap-3">
                    <Button type="button" variant="ghost" onClick={() => setShowNewUserModal(false)} className="text-zinc-400 hover:text-white">
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isCreatingUser} className="bg-[#F0564A] hover:bg-[#F0564A]/90 text-white min-w-[120px]">
                      {isCreatingUser ? "Creating..." : "Create User"}
                    </Button>
                  </div>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ============ MOBILE BOTTOM NAV ============ */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#0A0A0A]/95 backdrop-blur-xl border-t border-white/10 pb-safe">
        <div className="flex items-center justify-around p-2">
          {[
            { key: "tickets", label: "Tickets", Icon: Ticket },
            { key: "tasks", label: "Tasks", Icon: CheckSquare },
            { key: "files", label: "Vault", Icon: FolderOpen },
            { key: "users", label: "Clients", Icon: Users },
            { key: "news", label: "News", Icon: Newspaper },
          ].map(({ key, label, Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex flex-col items-center gap-1.5 p-2 min-w-[64px] rounded-lg transition-colors ${
                activeTab === key ? "text-[#F0564A]" : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}