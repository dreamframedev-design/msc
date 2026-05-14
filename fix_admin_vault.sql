-- Fix for vault_files admin access
CREATE POLICY "Admins can manage all vault files" 
ON public.vault_files FOR ALL 
USING (
  (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin' OR 
  (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
);
