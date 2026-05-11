
CREATE OR REPLACE FUNCTION public.set_service_role_key(p_key text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, vault
AS $$
DECLARE
  v_id uuid;
BEGIN
  SELECT id INTO v_id FROM vault.secrets WHERE name = 'service_role_key';
  IF v_id IS NOT NULL THEN
    PERFORM vault.update_secret(v_id, p_key, 'service_role_key');
  ELSE
    PERFORM vault.create_secret(p_key, 'service_role_key');
  END IF;
END;
$$;

REVOKE ALL ON FUNCTION public.set_service_role_key(text) FROM PUBLIC, anon, authenticated;
