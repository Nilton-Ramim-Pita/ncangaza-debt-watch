-- Limpar todos os dados mantendo apenas o admin principal

-- 1. Deletar todas as notificações
DELETE FROM notificacoes;

-- 2. Deletar todas as dívidas
DELETE FROM dividas;

-- 3. Deletar todos os clientes
DELETE FROM clientes;

-- 4. Deletar templates de notificação (se existirem)
DELETE FROM notification_templates;

-- 5. Deletar perfis que não são admin (mantém admin@nms.com)
DELETE FROM profiles 
WHERE user_id NOT IN (
  SELECT user_id FROM user_roles WHERE role = 'admin' LIMIT 1
);

-- 6. Deletar roles que não são do admin principal
DELETE FROM user_roles 
WHERE user_id NOT IN (
  SELECT id FROM auth.users WHERE email = 'admin@nms.com'
);