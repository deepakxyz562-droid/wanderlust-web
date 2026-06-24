
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_first_admin() FROM PUBLIC, anon, authenticated;
-- has_role stays callable because RLS policies invoke it
