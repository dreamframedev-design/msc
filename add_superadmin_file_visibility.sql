-- ==========================================
-- ADD SUPERADMIN VISIBILITY TO VAULT FILES
-- ==========================================

-- 1. Add the column
ALTER TABLE public.vault_files ADD COLUMN IF NOT EXISTS is_superadmin_only BOOLEAN DEFAULT false;

-- 2. Update RLS policies
DROP POLICY IF EXISTS "Superadmins can manage all files" ON public.vault_files;
CREATE POLICY "Superadmins can manage all files" ON public.vault_files FOR ALL USING (
  (auth.jwt() -> 'user_metadata' ->> 'role') = 'superadmin' OR 
  (auth.jwt() -> 'app_metadata' ->> 'role') = 'superadmin'
);

DROP POLICY IF EXISTS "Admins can manage all files" ON public.vault_files;
CREATE POLICY "Admins can manage all files" ON public.vault_files FOR ALL USING (
  ((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin' OR (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin') AND
  is_superadmin_only = false
);

DROP POLICY IF EXISTS "Clients can view their own and global files" ON public.vault_files;
CREATE POLICY "Clients can view their own and global files" ON public.vault_files FOR SELECT USING (
  is_internal = false AND 
  is_superadmin_only = false AND
  (client_id = auth.uid() OR client_id = '00000000-0000-0000-0000-000000000000'::uuid)
);