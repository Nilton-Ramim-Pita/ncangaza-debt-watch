-- Corrigir search_path nas funções criadas
CREATE OR REPLACE FUNCTION notify_new_client()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO notificacoes (
    divida_id,
    tipo,
    status,
    mensagem,
    data_agendamento,
    data_envio
  ) VALUES (
    NULL,
    'in_app',
    'enviada',
    'Novo cliente cadastrado: ' || NEW.nome || ' (NUIT: ' || COALESCE(NEW.nuit, 'N/A') || ')',
    NOW(),
    NOW()
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION notify_new_debt()
RETURNS TRIGGER AS $$
DECLARE
  client_name TEXT;
BEGIN
  SELECT nome INTO client_name FROM clientes WHERE id = NEW.cliente_id;
  
  INSERT INTO notificacoes (
    divida_id,
    tipo,
    status,
    mensagem,
    data_agendamento,
    data_envio
  ) VALUES (
    NEW.id,
    'in_app',
    'enviada',
    'Nova dívida registrada: ' || client_name || ' - ' || NEW.valor::text || ' MT - Vence em ' || NEW.data_vencimento::text,
    NOW(),
    NOW()
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION notify_payment_completed()
RETURNS TRIGGER AS $$
DECLARE
  client_name TEXT;
BEGIN
  IF NEW.status = 'paga' AND (OLD.status IS NULL OR OLD.status != 'paga') THEN
    SELECT nome INTO client_name FROM clientes WHERE id = NEW.cliente_id;
    
    INSERT INTO notificacoes (
      divida_id,
      tipo,
      status,
      mensagem,
      data_agendamento,
      data_envio
    ) VALUES (
      NEW.id,
      'in_app',
      'enviada',
      'Pagamento confirmado: ' || client_name || ' - ' || NEW.valor::text || ' MT - ' || NEW.descricao,
      NOW(),
      NOW()
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
