-- ==========================================
-- MASTER SQL SCRIPT: ACTIVITY AUDIT LOG
-- Tracks who-did-what-and-when across the platform.
-- ==========================================

-- 1. Create activity_log table
CREATE TABLE IF NOT EXISTS public.activity_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    actor_email TEXT,
    action TEXT NOT NULL,            -- machine-readable verb e.g. "ticket.create"
    target_type TEXT,                -- "ticket" | "task" | "board" | "file" | "user" | "comment"
    target_id TEXT,                  -- uuid string or arbitrary id of the target
    target_label TEXT,               -- human-readable name (subject/title/filename/email)
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Index for fast feed queries (newest first)
CREATE INDEX IF NOT EXISTS activity_log_created_at_idx
  ON public.activity_log (created_at DESC);

CREATE INDEX IF NOT EXISTS activity_log_actor_idx
  ON public.activity_log (actor_id, created_at DESC);

CREATE INDEX IF NOT EXISTS activity_log_target_idx
  ON public.activity_log (target_type, target_id, created_at DESC);

-- 3. Enable RLS
ALTER TABLE public.activity_log ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policies
--    SELECT: admins and superadmins can read.
--    INSERT: any authenticated user can insert events about themselves
--            (we still let clients log their own actions for completeness).
--    DELETE/UPDATE: nobody (immutable audit trail). No policies needed.

DROP POLICY IF EXISTS "Admins read activity_log" ON public.activity_log;
CREATE POLICY "Admins read activity_log"
ON public.activity_log FOR SELECT
USING (
  (auth.jwt() -> 'user_metadata' ->> 'role') IN ('admin', 'superadmin')
  OR (auth.jwt() -> 'app_metadata' ->> 'role') IN ('admin', 'superadmin')
);

DROP POLICY IF EXISTS "Authenticated insert own activity" ON public.activity_log;
CREATE POLICY "Authenticated insert own activity"
ON public.activity_log FOR INSERT
WITH CHECK (
  auth.uid() IS NOT NULL
  AND (actor_id IS NULL OR actor_id = auth.uid())
);

-- 5. Optional: housekeeping function to prune events older than 1 year.
--    Schedule manually via pg_cron if desired.
CREATE OR REPLACE FUNCTION public.prune_activity_log(days INT DEFAULT 365)
RETURNS INT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  deleted INT;
BEGIN
  DELETE FROM public.activity_log
  WHERE created_at < NOW() - (days || ' days')::INTERVAL;
  GET DIAGNOSTICS deleted = ROW_COUNT;
  RETURN deleted;
END;
$$;
