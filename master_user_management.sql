-- ==========================================
-- MASTER SQL SCRIPT: CLIENT MANAGEMENT
-- ==========================================

-- Create a secure function for Admins to update user roles
CREATE OR REPLACE FUNCTION set_user_role(target_user_id uuid, new_role text)
RETURNS void
SECURITY DEFINER
AS $$
BEGIN
  -- Check if the calling user is an admin
  IF (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin' OR (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin' THEN
    UPDATE auth.users
    SET raw_user_meta_data = COALESCE(raw_user_meta_data, '{}'::jsonb) || jsonb_build_object('role', new_role)
    WHERE id = target_user_id;
  ELSE
    RAISE EXCEPTION 'Access denied';
  END IF;
END;
$$ LANGUAGE plpgsql;
