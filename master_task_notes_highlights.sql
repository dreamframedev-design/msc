-- ==========================================
-- MASTER SQL SCRIPT: TASK NOTES + HIGHLIGHTS
-- Adds two optional columns to admin_tasks so the admin can:
--   1. Add a short note alongside each task title (right-hand area)
--   2. Highlight important tasks with a star (team-wide visibility)
-- ==========================================

ALTER TABLE public.admin_tasks
  ADD COLUMN IF NOT EXISTS note TEXT,
  ADD COLUMN IF NOT EXISTS is_highlighted BOOLEAN DEFAULT FALSE;

CREATE INDEX IF NOT EXISTS admin_tasks_highlight_idx
  ON public.admin_tasks (board_id)
  WHERE is_highlighted = TRUE;
