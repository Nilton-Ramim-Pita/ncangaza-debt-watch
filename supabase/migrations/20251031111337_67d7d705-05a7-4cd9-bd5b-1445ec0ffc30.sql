-- Habilitar extensão pg_cron para agendar tarefas
CREATE EXTENSION IF NOT EXISTS pg_cron WITH SCHEMA extensions;

-- Agendar verificação diária de dívidas (executa todo dia às 9h da manhã)
SELECT cron.schedule(
  'check-debts-daily',
  '0 9 * * *', -- Executa às 9h todos os dias
  $$
  SELECT public.check_and_notify_debts();
  $$
);

COMMENT ON EXTENSION pg_cron IS 'Extensão para agendar tarefas recorrentes no PostgreSQL';