CREATE OR REPLACE FUNCTION get_all_users()
RETURNS TABLE (id uuid, email varchar, role varchar)
SECURITY DEFINER
AS $$
BEGIN
  IF (auth.jwt() -> 'user_metadata' ->> 'role') IN ('admin', 'superadmin') OR 
     (auth.jwt() -> 'app_metadata' ->> 'role') IN ('admin', 'superadmin') THEN
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