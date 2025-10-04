-- Fix security warnings by adding search_path to existing functions

-- Update update_updated_at_column function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Update update_debt_status function
CREATE OR REPLACE FUNCTION public.update_debt_status()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.dividas 
  SET status = 'vencida' 
  WHERE data_vencimento < CURRENT_DATE 
    AND status = 'pendente';
END;
$$;

-- Update create_user_profile function
CREATE OR REPLACE FUNCTION public.create_user_profile(email text, password text, full_name text, role text DEFAULT 'user'::text)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_user_id UUID;
BEGIN
  -- Check if current user is admin
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Only admins can create users';
  END IF;
  
  -- This would be handled by admin interface calling Supabase Admin API
  -- For now, we'll create the profile structure
  RETURN gen_random_uuid();
END;
$$;