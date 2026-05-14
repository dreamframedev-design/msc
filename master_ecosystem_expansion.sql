-- ==========================================
-- MASTER SQL SCRIPT: ECOSYSTEM EXPANSION
-- Assignments, Task Comments, & Client Views
-- ==========================================

-- 1. Add "assigned_to" to existing tables
ALTER TABLE public.client_tickets 
ADD COLUMN IF NOT EXISTS assigned_to UUID REFERENCES auth.users(id) ON DELETE SET NULL;

ALTER TABLE public.admin_tasks 
ADD COLUMN IF NOT EXISTS assigned_to UUID REFERENCES auth.users(id) ON DELETE SET NULL;

-- 2. Create Task Comments Table
CREATE TABLE IF NOT EXISTS public.task_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id UUID REFERENCES public.admin_tasks(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on task_comments
ALTER TABLE public.task_comments ENABLE ROW LEVEL SECURITY;

-- 3. RLS Policies for Task Comments

-- SELECT: Superadmins see all. Others see comments if they have access to the board the task is on.
CREATE POLICY "Superadmins see all task comments, members see their boards" 
ON public.task_comments FOR SELECT 
USING (
  (auth.jwt() -> 'user_metadata' ->> 'role') = 'superadmin' OR 
  (auth.jwt() -> 'app_metadata' ->> 'role') = 'superadmin' OR
  task_id IN (
    SELECT t.id FROM public.admin_tasks t
    LEFT JOIN public.task_boards b ON t.board_id = b.id
    LEFT JOIN public.task_board_members m ON b.id = m.board_id
    WHERE b.created_by = auth.uid() OR m.user_id = auth.uid()
  )
);

-- INSERT: Allowed if Superadmin, or if the user has access to the board the task is on.
CREATE POLICY "Superadmins and members can insert task comments" 
ON public.task_comments FOR INSERT 
WITH CHECK (
  (auth.jwt() -> 'user_metadata' ->> 'role') = 'superadmin' OR 
  (auth.jwt() -> 'app_metadata' ->> 'role') = 'superadmin' OR
  task_id IN (
    SELECT t.id FROM public.admin_tasks t
    LEFT JOIN public.task_boards b ON t.board_id = b.id
    LEFT JOIN public.task_board_members m ON b.id = m.board_id
    WHERE b.created_by = auth.uid() OR m.user_id = auth.uid()
  )
);

-- UPDATE/DELETE: Only the creator of the comment or Superadmin can modify it.
CREATE POLICY "Users can manage their own task comments" 
ON public.task_comments FOR ALL 
USING (
  (auth.jwt() -> 'user_metadata' ->> 'role') = 'superadmin' OR 
  (auth.jwt() -> 'app_metadata' ->> 'role') = 'superadmin' OR
  user_id = auth.uid()
);