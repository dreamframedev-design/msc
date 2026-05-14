-- ==========================================
-- GRANT SUPERADMIN FULL ACCESS TO ALL TABLES
-- ==========================================

-- 1. Vault Files
DROP POLICY IF EXISTS "Superadmins can manage all files" ON public.vault_files;
CREATE POLICY "Superadmins can manage all files" ON public.vault_files FOR ALL USING (
  (auth.jwt() -> 'user_metadata' ->> 'role') = 'superadmin' OR 
  (auth.jwt() -> 'app_metadata' ->> 'role') = 'superadmin'
);

-- Update the existing admin policy just to be safe
DROP POLICY IF EXISTS "Admins can manage all files" ON public.vault_files;
CREATE POLICY "Admins can manage all files" ON public.vault_files FOR ALL USING (
  (auth.jwt() -> 'user_metadata' ->> 'role') IN ('admin', 'superadmin') OR 
  (auth.jwt() -> 'app_metadata' ->> 'role') IN ('admin', 'superadmin')
);

-- 2. Client Tickets
DROP POLICY IF EXISTS "Admins can manage all tickets" ON public.client_tickets;
CREATE POLICY "Admins can manage all tickets" ON public.client_tickets FOR ALL USING (
  (auth.jwt() -> 'user_metadata' ->> 'role') IN ('admin', 'superadmin') OR 
  (auth.jwt() -> 'app_metadata' ->> 'role') IN ('admin', 'superadmin')
);

-- 3. Ticket Comments
DROP POLICY IF EXISTS "Admins can manage all ticket comments" ON public.ticket_comments;
CREATE POLICY "Admins can manage all ticket comments" ON public.ticket_comments FOR ALL USING (
  (auth.jwt() -> 'user_metadata' ->> 'role') IN ('admin', 'superadmin') OR 
  (auth.jwt() -> 'app_metadata' ->> 'role') IN ('admin', 'superadmin')
);

-- 4. File Requests
DROP POLICY IF EXISTS "Admins can manage file requests" ON public.file_requests;
CREATE POLICY "Admins can manage file requests" ON public.file_requests FOR ALL USING (
  (auth.jwt() -> 'user_metadata' ->> 'role') IN ('admin', 'superadmin') OR 
  (auth.jwt() -> 'app_metadata' ->> 'role') IN ('admin', 'superadmin')
);
