-- ==========================================
-- ULTIMATE RLS INFINITE RECURSION FIX
-- ==========================================

-- 1. Drop ALL existing policies on these tables dynamically to ensure no ghost policies remain
DO $$ 
DECLARE
    pol record;
BEGIN
    FOR pol IN SELECT policyname, tablename FROM pg_policies WHERE schemaname = 'public' AND tablename IN ('task_boards', 'task_board_members', 'admin_tasks')
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', pol.policyname, pol.tablename);
    END LOOP;
END $$;

-- 2. Create helper functions that bypass RLS (SECURITY DEFINER) to check permissions
-- This completely prevents the "infinite recursion" loop.

CREATE OR REPLACE FUNCTION public.is_board_creator(b_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT EXISTS (SELECT 1 FROM public.task_boards WHERE id = b_id AND created_by = auth.uid());
$$;

CREATE OR REPLACE FUNCTION public.is_board_member(b_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT EXISTS (SELECT 1 FROM public.task_board_members WHERE board_id = b_id AND user_id = auth.uid());
$$;

-- 3. Recreate flat, safe policies using the helper functions

-- TASK BOARDS
CREATE POLICY "task_boards_select" ON public.task_boards FOR SELECT USING (
  (auth.jwt() -> 'user_metadata' ->> 'role') = 'superadmin' OR 
  (auth.jwt() -> 'app_metadata' ->> 'role') = 'superadmin' OR
  created_by = auth.uid() OR
  public.is_board_member(id)
);

CREATE POLICY "task_boards_all" ON public.task_boards FOR ALL USING (
  (auth.jwt() -> 'user_metadata' ->> 'role') = 'superadmin' OR 
  (auth.jwt() -> 'app_metadata' ->> 'role') = 'superadmin' OR
  created_by = auth.uid()
);

-- TASK BOARD MEMBERS
CREATE POLICY "task_board_members_select" ON public.task_board_members FOR SELECT USING (
  true
);

CREATE POLICY "task_board_members_all" ON public.task_board_members FOR ALL USING (
  (auth.jwt() -> 'user_metadata' ->> 'role') = 'superadmin' OR 
  (auth.jwt() -> 'app_metadata' ->> 'role') = 'superadmin' OR
  public.is_board_creator(board_id)
);

-- ADMIN TASKS
CREATE POLICY "admin_tasks_select" ON public.admin_tasks FOR SELECT USING (
  (auth.jwt() -> 'user_metadata' ->> 'role') = 'superadmin' OR 
  (auth.jwt() -> 'app_metadata' ->> 'role') = 'superadmin' OR
  public.is_board_creator(board_id) OR
  public.is_board_member(board_id)
);

CREATE POLICY "admin_tasks_all" ON public.admin_tasks FOR ALL USING (
  (auth.jwt() -> 'user_metadata' ->> 'role') = 'superadmin' OR 
  (auth.jwt() -> 'app_metadata' ->> 'role') = 'superadmin' OR
  public.is_board_creator(board_id) OR
  public.is_board_member(board_id)
);
