-- ==========================================
-- ADD SUBTASKS COLUMN TO ADMIN TASKS
-- ==========================================

-- This allows creating "multiple itemed tasks" or checklists inside a single task.
ALTER TABLE public.admin_tasks 
ADD COLUMN IF NOT EXISTS subtasks JSONB DEFAULT '[]'::jsonb;
