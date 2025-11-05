-- Allow 'in_app' as a valid notification type
ALTER TABLE public.notificacoes DROP CONSTRAINT IF EXISTS notificacoes_tipo_check;
ALTER TABLE public.notificacoes ADD CONSTRAINT notificacoes_tipo_check CHECK (tipo IN ('in_app','email','whatsapp','sms','info','warning','error','success'));

-- Backfill: ensure overdue debts are marked and trigger in-app notifications
UPDATE public.dividas
SET status = 'vencida'
WHERE data_vencimento < CURRENT_DATE
  AND status = 'pendente';