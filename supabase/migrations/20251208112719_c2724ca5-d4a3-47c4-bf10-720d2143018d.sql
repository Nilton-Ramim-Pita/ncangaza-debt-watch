-- Criar perfil para admin@ncangaza.co.mz
INSERT INTO public.profiles (user_id, full_name, cargo, departamento, active)
VALUES ('ccc06de8-edb7-422b-9b3c-faf97d8d6cd2', 'Nilton Ramim Pita', 'Director Geral', 'Administração', true)
ON CONFLICT (user_id) DO UPDATE SET full_name = 'Nilton Ramim Pita', cargo = 'Director Geral', departamento = 'Administração';

-- Criar perfil para user@ncangaza.co.mz
INSERT INTO public.profiles (user_id, full_name, cargo, departamento, active)
VALUES ('c6a416b6-82a9-45f7-a9c8-90bc09838d0c', 'Maria João Silva', 'Assistente Financeiro', 'Finanças', true)
ON CONFLICT (user_id) DO UPDATE SET full_name = 'Maria João Silva', cargo = 'Assistente Financeiro', departamento = 'Finanças';

-- Criar perfil para ramimpita65@gmail.com
INSERT INTO public.profiles (user_id, full_name, cargo, departamento, active)
VALUES ('1a539985-302c-4b8a-a84a-0897c83573a6', 'Ramim Pita', 'Gestor de Cobranças', 'Operações', true)
ON CONFLICT (user_id) DO UPDATE SET full_name = 'Ramim Pita', cargo = 'Gestor de Cobranças', departamento = 'Operações';