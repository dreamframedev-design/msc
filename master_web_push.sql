-- ==========================================
-- MASTER SQL SCRIPT: WEB PUSH SUBSCRIPTIONS
-- Stores Web Push subscriptions so the server can dispatch
-- notifications to logged-in admins and clients (both browser
-- and installed PWA on iOS/Android).
-- ==========================================

-- 1. Subscriptions table — one row per (user, device) endpoint
CREATE TABLE IF NOT EXISTS public.web_push_subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    endpoint TEXT NOT NULL,
    p256dh TEXT NOT NULL,
    auth TEXT NOT NULL,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    last_used_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (user_id, endpoint)
);

-- 2. Indexes
CREATE INDEX IF NOT EXISTS web_push_subs_user_idx
  ON public.web_push_subscriptions (user_id);

-- 3. RLS
ALTER TABLE public.web_push_subscriptions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Owner reads own subs" ON public.web_push_subscriptions;
CREATE POLICY "Owner reads own subs"
ON public.web_push_subscriptions FOR SELECT
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Owner inserts own subs" ON public.web_push_subscriptions;
CREATE POLICY "Owner inserts own subs"
ON public.web_push_subscriptions FOR INSERT
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Owner deletes own subs" ON public.web_push_subscriptions;
CREATE POLICY "Owner deletes own subs"
ON public.web_push_subscriptions FOR DELETE
USING (auth.uid() = user_id);

-- Admins can SELECT all subs (needed by /api/push when using anon key);
-- prefer running /api/push with the service role key in production.
DROP POLICY IF EXISTS "Admins read all subs" ON public.web_push_subscriptions;
CREATE POLICY "Admins read all subs"
ON public.web_push_subscriptions FOR SELECT
USING (
  (auth.jwt() -> 'user_metadata' ->> 'role') IN ('admin', 'superadmin')
  OR (auth.jwt() -> 'app_metadata' ->> 'role') IN ('admin', 'superadmin')
);
