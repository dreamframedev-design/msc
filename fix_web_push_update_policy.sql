-- One-line fix: allow users to UPDATE their own push subscription rows
-- so re-clicking "Enable Notifications" upserts cleanly instead of erroring.

DROP POLICY IF EXISTS "Owner updates own subs" ON public.web_push_subscriptions;
CREATE POLICY "Owner updates own subs"
ON public.web_push_subscriptions FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);
