-- Make divida_id optional to allow system-wide in-app notifications without a specific debt
ALTER TABLE public.notificacoes
ALTER COLUMN divida_id DROP NOT NULL;

-- Trigger to send welcome email on new client creation
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'trg_notify_new_client'
  ) THEN
    CREATE TRIGGER trg_notify_new_client
    AFTER INSERT ON public.clientes
    FOR EACH ROW
    EXECUTE FUNCTION public.notify_new_client();
  END IF;
END $$;

-- Trigger to notify on new debt creation
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'trg_notify_new_debt'
  ) THEN
    CREATE TRIGGER trg_notify_new_debt
    AFTER INSERT ON public.dividas
    FOR EACH ROW
    EXECUTE FUNCTION public.notify_new_debt();
  END IF;
END $$;