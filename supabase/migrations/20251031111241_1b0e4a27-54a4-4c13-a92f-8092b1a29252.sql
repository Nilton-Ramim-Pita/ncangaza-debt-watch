-- Habilitar extensão pg_net para fazer requisições HTTP assíncronas
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

-- Configurar settings do Supabase para uso nas funções
-- NOTA: Estes valores precisam ser configurados manualmente no Supabase Dashboard
-- em Database > Settings > Custom Postgres Configuration

-- Para configurar:
-- 1. Vá para: https://supabase.com/dashboard/project/vmgrnkuhprxowcvydnvm/settings/database
-- 2. Adicione estas configurações customizadas:
--    app.settings.supabase_url = 'https://vmgrnkuhprxowcvydnvm.supabase.co'
--    app.settings.supabase_service_key = 'sua_service_role_key_aqui'

-- Comentário para lembrar a configuração
COMMENT ON EXTENSION pg_net IS 'Extensão para fazer requisições HTTP assíncronas dos triggers';