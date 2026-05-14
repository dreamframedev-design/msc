-- Fix infinite recursion on task_board_members table
DROP POLICY IF EXISTS "Admins see all members, users see their board members" ON public.task_board_members;

CREATE POLICY "Admins see all members, users see their own memberships" 
ON public.task_board_members FOR SELECT 
USING (
  (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin' OR 
  (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin' OR
  user_id = auth.uid()
);