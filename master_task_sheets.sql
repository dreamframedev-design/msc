-- ==========================================
-- MASTER SQL SCRIPT: MULTIPLE TASK SHEETS
-- ==========================================

-- 1. Create Task Boards Table
CREATE TABLE IF NOT EXISTS public.task_boards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    client_tag TEXT,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create Task Board Members Table (for sharing)
CREATE TABLE IF NOT EXISTS public.task_board_members (
    board_id UUID REFERENCES public.task_boards(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    PRIMARY KEY (board_id, user_id)
);

-- 3. Update Admin Tasks Table to link to a board
ALTER TABLE public.admin_tasks ADD COLUMN IF NOT EXISTS board_id UUID REFERENCES public.task_boards(id) ON DELETE CASCADE;

-- Insert a default board for existing tasks
DO $$
DECLARE
  default_board_id UUID;
BEGIN
  -- Create a default board if admin_tasks has entries without a board
  IF EXISTS (SELECT 1 FROM public.admin_tasks WHERE board_id IS NULL) THEN
    INSERT INTO public.task_boards (title, client_tag) VALUES ('General Internal Tasks', 'Internal') RETURNING id INTO default_board_id;
    UPDATE public.admin_tasks SET board_id = default_board_id WHERE board_id IS NULL;
  END IF;
END $$;

-- Enable RLS
ALTER TABLE public.task_boards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_board_members ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policies

-- Task Boards: Admins see all, users see boards they are members of
CREATE POLICY "Admins see all boards, members see their boards" 
ON public.task_boards FOR SELECT 
USING (
  (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin' OR 
  (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin' OR
  id IN (SELECT board_id FROM public.task_board_members WHERE user_id = auth.uid())
);

CREATE POLICY "Admins can manage boards" 
ON public.task_boards FOR ALL 
USING (
  (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin' OR 
  (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
);

-- Task Board Members: Admins see all, users see members of their boards
CREATE POLICY "Admins see all members, users see their board members" 
ON public.task_board_members FOR SELECT 
USING (
  (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin' OR 
  (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin' OR
  board_id IN (SELECT board_id FROM public.task_board_members WHERE user_id = auth.uid())
);

CREATE POLICY "Admins can manage board members" 
ON public.task_board_members FOR ALL 
USING (
  (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin' OR 
  (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
);

-- Admin Tasks: Admins manage all, users see tasks on their boards
DROP POLICY IF EXISTS "Admins can manage admin_tasks" ON public.admin_tasks;
DROP POLICY IF EXISTS "Admins can manage all tasks" ON public.admin_tasks;

CREATE POLICY "Admins see all tasks, members see their board tasks" 
ON public.admin_tasks FOR SELECT 
USING (
  (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin' OR 
  (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin' OR
  board_id IN (SELECT board_id FROM public.task_board_members WHERE user_id = auth.uid())
);

CREATE POLICY "Admins manage all tasks" 
ON public.admin_tasks FOR ALL 
USING (
  (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin' OR 
  (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
);
