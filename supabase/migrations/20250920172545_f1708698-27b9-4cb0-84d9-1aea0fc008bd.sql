-- Insert admin user credentials
-- Note: In a real scenario, this would be done through Supabase Auth API
-- For testing purposes, we'll create a profile entry

-- First, let's insert a test admin user into auth.users (this is just for reference)
-- In practice, you would use Supabase dashboard or Admin API

-- Create admin profile directly for testing
INSERT INTO public.profiles (id, user_id, full_name, role, active, created_at, updated_at)
VALUES (
  gen_random_uuid(),
  gen_random_uuid(), -- This would be the actual auth.users.id in practice
  'Administrador Sistema',
  'admin',
  true,
  now(),
  now()
)
ON CONFLICT DO NOTHING;

-- For testing, let's also create a sample user
INSERT INTO public.profiles (id, user_id, full_name, role, active, created_at, updated_at)
VALUES (
  gen_random_uuid(),
  gen_random_uuid(),
  'Usuário Teste',
  'user',
  true,
  now(),
  now()
)
ON CONFLICT DO NOTHING;