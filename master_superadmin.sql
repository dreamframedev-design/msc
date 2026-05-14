-- ==========================================
-- MASTER SQL SCRIPT: SUPER ADMIN & GRANULAR LIST PERMISSIONS
-- ==========================================

-- 1. Update the User Management RPC to be restricted to 'superadmin' only
CREATE OR REPLACE FUNCTION set_user_role(target_user_id uuid, new_role text)
RETURNS void
SECURITY DEFINER
AS $$
BEGIN
  -- Only superadmins can change roles
  IF (auth.jwt() -> 'user_metadata' ->> 'role') = 'superadmin' OR (auth.jwt() -> 'app_metadata' ->> 'role') = 'superadmin' THEN
    UPDATE auth.users
    SET raw_user_meta_data = COALESCE(raw_user_meta_data, '{}'::jsonb) || jsonb_build_object('role', new_role)
    WHERE id = target_user_id;
  ELSE
    RAISE EXCEPTION 'Access denied: Only Super Admins can manage roles.';
  END IF;
END;
$$ LANGUAGE plpgsql;

-- 2. Drop existing RLS policies for tasks
DROP POLICY IF EXISTS "Admins see all boards, members see their boards" ON public.task_boards;
DROP POLICY IF EXISTS "Admins can manage boards" ON public.task_boards;

DROP POLICY IF EXISTS "Admins see all members, users see their own memberships" ON public.task_board_members;
DROP POLICY IF EXISTS "Admins see all members, users see their board members" ON public.task_board_members;
DROP POLICY IF EXISTS "Admins can manage board members" ON public.task_board_members;

DROP POLICY IF EXISTS "Admins see all tasks, members see their board tasks" ON public.admin_tasks;
DROP POLICY IF EXISTS "Admins manage all tasks" ON public.admin_tasks;

-- ==========================================
-- TASK BOARDS (Lists) POLICIES
-- ==========================================

-- SELECT: Superadmins see all. Creators see their own. Members see lists they belong to.
CREATE POLICY "Superadmins see all, creators and members see theirs" 
ON public.task_boards FOR SELECT 
USING (
  (auth.jwt() -> 'user_metadata' ->> 'role') = 'superadmin' OR 
  (auth.jwt() -> 'app_metadata' ->> 'role') = 'superadmin' OR
  created_by = auth.uid() OR
  id IN (SELECT board_id FROM public.task_board_members WHERE user_id = auth.uid())
);

-- ALL (Insert, Update, Delete): Superadmins can do anything. Creators can manage their own boards.
CREATE POLICY "Superadmins manage all, creators manage theirs" 
ON public.task_boards FOR ALL 
USING (
  (auth.jwt() -> 'user_metadata' ->> 'role') = 'superadmin' OR 
  (auth.jwt() -> 'app_metadata' ->> 'role') = 'superadmin' OR
  created_by = auth.uid()
);

-- ==========================================
-- TASK BOARD MEMBERS (List Access) POLICIES
-- ==========================================

-- SELECT: Superadmins see all. Creators see members of their boards. Members see who else is in their boards.
CREATE POLICY "Superadmins see all, creators and members see board members" 
ON public.task_board_members FOR SELECT 
USING (
  (auth.jwt() -> 'user_metadata' ->> 'role') = 'superadmin' OR 
  (auth.jwt() -> 'app_metadata' ->> 'role') = 'superadmin' OR
  board_id IN (SELECT id FROM public.task_boards WHERE created_by = auth.uid()) OR
  board_id IN (SELECT board_id FROM public.task_board_members WHERE user_id = auth.uid())
);

-- ALL: Superadmins can manage any membership. Creators can manage memberships for their own boards.
CREATE POLICY "Superadmins and board creators can manage members" 
ON public.task_board_members FOR ALL 
USING (
  (auth.jwt() -> 'user_metadata' ->> 'role') = 'superadmin' OR 
  (auth.jwt() -> 'app_metadata' ->> 'role') = 'superadmin' OR
  board_id IN (SELECT id FROM public.task_boards WHERE created_by = auth.uid())
);

-- ==========================================
-- ADMIN TASKS (List Items) POLICIES
-- ==========================================

-- SELECT: Superadmins see all. Creators and members of the board see its tasks.
CREATE POLICY "Superadmins see all, board creators and members see tasks" 
ON public.admin_tasks FOR SELECT 
USING (
  (auth.jwt() -> 'user_metadata' ->> 'role') = 'superadmin' OR 
  (auth.jwt() -> 'app_metadata' ->> 'role') = 'superadmin' OR
  board_id IN (SELECT id FROM public.task_boards WHERE created_by = auth.uid()) OR
  board_id IN (SELECT board_id FROM public.task_board_members WHERE user_id = auth.uid())
);

-- ALL: Superadmins manage all. Admins who created the board or are members can manage tasks. Clients can only view (so no ALL policy for them).
CREATE POLICY "Superadmins and Admin members can manage tasks" 
ON public.admin_tasks FOR ALL 
USING (
  (auth.jwt() -> 'user_metadata' ->> 'role') IN ('superadmin', 'admin') OR 
  (auth.jwt() -> 'app_metadata' ->> 'role') IN ('superadmin', 'admin')
)
WITH CHECK (
  (auth.jwt() -> 'user_metadata' ->> 'role') = 'superadmin' OR 
  (auth.jwt() -> 'app_metadata' ->> 'role') = 'superadmin' OR
  board_id IN (SELECT id FROM public.task_boards WHERE created_by = auth.uid()) OR
  board_id IN (SELECT board_id FROM public.task_board_members WHERE user_id = auth.uid())
);