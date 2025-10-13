-- Criar admin padrão se não existir
DO $$
DECLARE
  admin_user_id UUID;
  admin_exists BOOLEAN;
BEGIN
  -- Verificar se o admin já existe no auth.users
  SELECT EXISTS (
    SELECT 1 FROM auth.users WHERE email = 'admin@nms.com'
  ) INTO admin_exists;

  IF NOT admin_exists THEN
    -- Criar o usuário admin no auth.users
    INSERT INTO auth.users (
      instance_id,
      id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      raw_app_meta_data,
      raw_user_meta_data,
      created_at,
      updated_at,
      confirmation_token,
      email_change,
      email_change_token_new,
      recovery_token
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'admin@nms.com',
      crypt('nmsadmin4321', gen_salt('bf')),
      NOW(),
      '{"provider":"email","providers":["email"]}',
      '{"full_name":"Administrador Sistema"}',
      NOW(),
      NOW(),
      '',
      '',
      '',
      ''
    )
    RETURNING id INTO admin_user_id;

    -- Criar perfil para o admin
    INSERT INTO public.profiles (user_id, full_name, active)
    VALUES (admin_user_id, 'Administrador Sistema', true);

    -- Atribuir role de admin
    INSERT INTO public.user_roles (user_id, role)
    VALUES (admin_user_id, 'admin');

    RAISE NOTICE 'Admin padrão criado com sucesso: admin@nms.com';
  ELSE
    RAISE NOTICE 'Admin padrão já existe';
  END IF;
END $$;