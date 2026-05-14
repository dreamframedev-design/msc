-- ==========================================
-- FIX RLS INFINITE RECURSION
-- ==========================================

-- Drop all the old recursive policies that are causing the database to loop
DROP POLICY IF EXISTS "Superadmins see all, creators and members see theirs" ON public.task_boards;
DROP POLICY IF EXISTS "Superadmins manage all, creators manage theirs" ON public.task_boards;

DROP POLICY IF EXISTS "Superadmins see all, creators and members see board members" ON public.task_board_members;
DROP POLICY IF EXISTS "Superadmins and board creators can manage members" ON public.task_board_members;

DROP POLICY IF EXISTS "Superadmins see all, board creators and members see tasks" ON public.admin_tasks;
DROP POLICY IF EXISTS "Superadmins and Admin members can manage tasks" ON public.admin_tasks;

-- Replace them with flat, non-recursive policies

-- 1. TASK BOARDS
CREATE POLICY "task_boards_select" ON public.task_boards FOR SELECT USING (
  (auth.jwt() -> 'user_metadata' ->> 'role') = 'superadmin' OR 
  (auth.jwt() -> 'app_metadata' ->> 'role') = 'superadmin' OR
  created_by = auth.uid() OR
  id IN (SELECT board_id FROM public.task_board_members WHERE user_id = auth.uid())
);

CREATE POLICY "task_boards_all" ON public.task_boards FOR ALL USING (
  (auth.jwt() -> 'user_metadata' ->> 'role') = 'superadmin' OR 
  (auth.jwt() -> 'app_metadata' ->> 'role') = 'superadmin' OR
  created_by = auth.uid()
);

-- 2. TASK BOARD MEMBERS
CREATE POLICY "task_board_members_select" ON public.task_board_members FOR SELECT USING (
  true
);

CREATE POLICY "task_board_members_all" ON public.task_board_members FOR ALL USING (
  (auth.jwt() -> 'user_metadata' ->> 'role') = 'superadmin' OR 
  (auth.jwt() -> 'app_metadata' ->> 'role') = 'superadmin' OR
  board_id IN (SELECT id FROM public.task_boards WHERE created_by = auth.uid())
);

-- 3. ADMIN TASKS
CREATE POLICY "admin_tasks_select" ON public.admin_tasks FOR SELECT USING (
  (auth.jwt() -> 'user_metadata' ->> 'role') = 'superadmin' OR 
  (auth.jwt() -> 'app_metadata' ->> 'role') = 'superadmin' OR
  board_id IN (SELECT id FROM public.task_boards WHERE created_by = auth.uid()) OR
  board_id IN (SELECT board_id FROM public.task_board_members WHERE user_id = auth.uid())
);

CREATE POLICY "admin_tasks_all" ON public.admin_tasks FOR ALL USING (
  (auth.jwt() -> 'user_metadata' ->> 'role') = 'superadmin' OR 
  (auth.jwt() -> 'app_metadata' ->> 'role') = 'superadmin' OR
  board_id IN (SELECT id FROM public.task_boards WHERE created_by = auth.uid()) OR
  board_id IN (SELECT board_id FROM public.task_board_members WHERE user_id = auth.uid())
);