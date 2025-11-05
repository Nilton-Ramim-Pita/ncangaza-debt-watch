-- Create trigger to notify when debt becomes overdue
CREATE OR REPLACE FUNCTION public.notify_debt_overdue()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  client_name TEXT;
  days_overdue INTEGER;
BEGIN
  -- Only trigger when status changes to 'vencida'
  IF NEW.status = 'vencida' AND (OLD.status IS NULL OR OLD.status != 'vencida') THEN
    SELECT nome INTO client_name FROM clientes WHERE id = NEW.cliente_id;
    
    -- Calculate days overdue
    days_overdue := CURRENT_DATE - NEW.data_vencimento;
    
    INSERT INTO notificacoes (
      divida_id,
      cliente_id,
      tipo,
      status,
      mensagem,
      data_agendamento,
      data_envio
    ) VALUES (
      NEW.id,
      NEW.cliente_id,
      'in_app',
      'enviada',
      'ATENÇÃO: Dívida vencida há ' || days_overdue || ' dias - ' || client_name || ' deve ' || NEW.valor::text || ' MTn (Venceu em ' || TO_CHAR(NEW.data_vencimento, 'DD/MM/YYYY') || ')',
      NOW(),
      NOW()
    );
  END IF;
  RETURN NEW;
END;
$function$;

-- Drop trigger if exists
DROP TRIGGER IF EXISTS on_debt_overdue ON public.dividas;

-- Create trigger
CREATE TRIGGER on_debt_overdue
  AFTER INSERT OR UPDATE ON public.dividas
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_debt_overdue();

-- Manually create notifications for existing overdue debts
INSERT INTO notificacoes (divida_id, cliente_id, tipo, status, mensagem, data_agendamento, data_envio)
SELECT 
  d.id,
  d.cliente_id,
  'in_app',
  'enviada',
  'ATENÇÃO: Dívida vencida há ' || (CURRENT_DATE - d.data_vencimento) || ' dias - ' || c.nome || ' deve ' || d.valor::text || ' MTn (Venceu em ' || TO_CHAR(d.data_vencimento, 'DD/MM/YYYY') || ')',
  NOW(),
  NOW()
FROM dividas d
INNER JOIN clientes c ON d.cliente_id = c.id
WHERE d.status = 'vencida'
  AND NOT EXISTS (
    SELECT 1 FROM notificacoes n 
    WHERE n.divida_id = d.id 
    AND n.tipo = 'in_app'
    AND n.mensagem LIKE 'ATENÇÃO: Dívida vencida%'
  );