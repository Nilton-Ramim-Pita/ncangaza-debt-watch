-- Criar função para gerar notificações automáticas quando um novo cliente é cadastrado
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Criar trigger para notificar quando novo cliente é cadastrado
DROP TRIGGER IF EXISTS trigger_notify_new_client ON clientes;
CREATE TRIGGER trigger_notify_new_client
  AFTER INSERT ON clientes
  FOR EACH ROW
  EXECUTE FUNCTION notify_new_client();

-- Criar função para gerar notificações automáticas quando uma nova dívida é registrada
CREATE OR REPLACE FUNCTION notify_new_debt()
RETURNS TRIGGER AS $$
DECLARE
  client_name TEXT;
BEGIN
  -- Buscar nome do cliente
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Criar trigger para notificar quando nova dívida é registrada
DROP TRIGGER IF EXISTS trigger_notify_new_debt ON dividas;
CREATE TRIGGER trigger_notify_new_debt
  AFTER INSERT ON dividas
  FOR EACH ROW
  EXECUTE FUNCTION notify_new_debt();

-- Criar função para gerar notificações quando um pagamento é confirmado
CREATE OR REPLACE FUNCTION notify_payment_completed()
RETURNS TRIGGER AS $$
DECLARE
  client_name TEXT;
BEGIN
  -- Verificar se o status mudou para 'paga'
  IF NEW.status = 'paga' AND (OLD.status IS NULL OR OLD.status != 'paga') THEN
    -- Buscar nome do cliente
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Criar trigger para notificar quando pagamento é confirmado
DROP TRIGGER IF EXISTS trigger_notify_payment_completed ON dividas;
CREATE TRIGGER trigger_notify_payment_completed
  AFTER UPDATE ON dividas
  FOR EACH ROW
  EXECUTE FUNCTION notify_payment_completed();

-- Adicionar coluna para controlar se notificação foi lida
ALTER TABLE notificacoes ADD COLUMN IF NOT EXISTS lida BOOLEAN DEFAULT FALSE;

-- Adicionar coluna para armazenar referência (cliente_id ou divida_id)
ALTER TABLE notificacoes ADD COLUMN IF NOT EXISTS cliente_id UUID REFERENCES clientes(id) ON DELETE CASCADE;

-- Adicionar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_notificacoes_lida ON notificacoes(lida);
CREATE INDEX IF NOT EXISTS idx_notificacoes_created_at ON notificacoes(created_at);
CREATE INDEX IF NOT EXISTS idx_notificacoes_tipo ON notificacoes(tipo);
