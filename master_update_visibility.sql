-- ==========================================
-- MASTER SQL SCRIPT: ROBUST FILE VISIBILITY
-- ==========================================

-- 1. Create a secure function for Admins to list all users (for assigning files/tickets)
CREATE OR REPLACE FUNCTION get_all_users()
RETURNS TABLE (id uuid, email varchar, role varchar)
SECURITY DEFINER
AS $$
BEGIN
  IF (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin' OR (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin' THEN
    RETURN QUERY 
    SELECT 
      au.id, 
      au.email::varchar, 
      COALESCE(au.raw_user_meta_data->>'role', au.raw_app_meta_data->>'role', 'client')::varchar 
    FROM auth.users au;
  ELSE
    RAISE EXCEPTION 'Access denied';
  END IF;
END;
$$ LANGUAGE plpgsql;

-- 2. Update Vault Files RLS Policy to support 'GLOBAL' files
-- Drop the existing policy if it exists (assuming the name from standard setup)
DROP POLICY IF EXISTS "Clients can view their own files" ON public.vault_files;
DROP POLICY IF EXISTS "Clients can view their files" ON public.vault_files;
DROP POLICY IF EXISTS "Clients can view their own and global files" ON public.vault_files;

-- Create the new, more robust policy
CREATE POLICY "Clients can view their own and global files" 
ON public.vault_files FOR SELECT 
USING (
  is_internal = false AND 
  (client_id = auth.uid() OR client_id = '00000000-0000-0000-0000-000000000000'::uuid)
);

-- Note: Admins already have a policy that lets them see ALL files (USING true)