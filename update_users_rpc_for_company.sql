CREATE OR REPLACE FUNCTION get_all_users()
RETURNS TABLE (id uuid, email varchar, role varchar, company varchar)
SECURITY DEFINER
AS $$
BEGIN
  IF (auth.jwt() -> 'user_metadata' ->> 'role') IN ('admin', 'superadmin') OR 
     (auth.jwt() -> 'app_metadata' ->> 'role') IN ('admin', 'superadmin') THEN
    RETURN QUERY 
    SELECT 
      au.id, 
      au.email::varchar, 
      COALESCE(au.raw_user_meta_data->>'role', au.raw_app_meta_data->>'role', 'client')::varchar,
      (au.raw_user_meta_data->>'company')::varchar
    FROM auth.users au;
  ELSE
    RAISE EXCEPTION 'Access denied';
  END IF;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION set_user_company(target_user_id uuid, new_company text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF (auth.jwt() -> 'user_metadata' ->> 'role') IN ('admin', 'superadmin') OR 
     (auth.jwt() -> 'app_metadata' ->> 'role') IN ('admin', 'superadmin') THEN
    UPDATE auth.users
    SET raw_user_meta_data = 
      COALESCE(raw_user_meta_data, '{}'::jsonb) || jsonb_build_object('company', new_company)
    WHERE id = target_user_id;
  ELSE
    RAISE EXCEPTION 'Access denied: Must be an admin to change company';
  END IF;
END;
$$;