-- Atualizar trigger de dívida vencida para enviar e-mail também
CREATE OR REPLACE FUNCTION public.notify_debt_overdue()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  client_name TEXT;
  days_overdue INTEGER;
  v_admin_emails TEXT[];
  v_email TEXT;
  v_email_body TEXT;
BEGIN
  IF NEW.status = 'vencida' AND (OLD.status IS NULL OR OLD.status != 'vencida') THEN
    SELECT nome INTO client_name FROM clientes WHERE id = NEW.cliente_id;
    days_overdue := CURRENT_DATE - NEW.data_vencimento;
    
    -- Criar notificação in-app
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
      '⚠️ ATENÇÃO: Dívida vencida há ' || days_overdue || ' dias - ' || client_name || 
      ' deve ' || NEW.valor::text || ' MTn (Venceu em ' || TO_CHAR(NEW.data_vencimento, 'DD/MM/YYYY') || ')',
      NOW(),
      NOW()
    );

    -- Buscar emails de administradores ativos
    SELECT ARRAY_AGG(DISTINCT p.email)
    INTO v_admin_emails
    FROM profiles p
    INNER JOIN user_roles ur ON ur.user_id = p.user_id
    WHERE ur.role = 'admin'
      AND p.active = true
      AND p.email_notifications = true;

    -- Enviar e-mail para cada administrador
    IF v_admin_emails IS NOT NULL THEN
      FOREACH v_email IN ARRAY v_admin_emails
      LOOP
        v_email_body := format(
          '⚠️ ALERTA: Dívida Vencida

ATENÇÃO! Uma dívida entrou em atraso no sistema.

Detalhes da Dívida:
• Cliente: %s
• Valor Devedor: %s MTn
• Descrição: %s
• Data de Vencimento: %s
• Dias em Atraso: %s dias

Status: VENCIDA

É necessário contato urgente com o cliente para regularização do pagamento.

Esta é uma notificação automática do sistema Ncangaza Multiservices.
Sistema de Gestão de Dívidas',
          client_name,
          to_char(NEW.valor, 'FM999,999,999.00'),
          NEW.descricao,
          TO_CHAR(NEW.data_vencimento, 'DD/MM/YYYY'),
          days_overdue::text
        );

        PERFORM net.http_post(
          url := 'https://vmgrnkuhprxowcvydnvm.supabase.co/functions/v1/send-email',
          headers := jsonb_build_object(
            'Content-Type', 'application/json',
            'Authorization', 'Bearer ' || current_setting('request.jwt.claim.sub', true)
          ),
          body := jsonb_build_object(
            'to', v_email,
            'subject', '⚠️ ALERTA: Dívida Vencida - ' || client_name || ' (' || days_overdue || ' dias)',
            'message', v_email_body
          )
        );

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
          'email',
          'enviada',
          'E-mail de alerta enviado para ' || v_email || ' sobre dívida vencida: ' || client_name,
          NOW(),
          NOW()
        );
      END LOOP;
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

-- Criar trigger para notificar quando uma dívida for atualizada (mudança de status)
CREATE OR REPLACE FUNCTION public.notify_debt_updated()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  client_name TEXT;
  v_admin_emails TEXT[];
  v_email TEXT;
  v_email_body TEXT;
  v_changes TEXT;
BEGIN
  -- Só notificar se houve mudança significativa (status, valor, vencimento)
  IF (OLD.status != NEW.status OR OLD.valor != NEW.valor OR OLD.data_vencimento != NEW.data_vencimento) THEN
    SELECT nome INTO client_name FROM clientes WHERE id = NEW.cliente_id;
    
    -- Identificar o que mudou
    v_changes := '';
    IF OLD.status != NEW.status THEN
      v_changes := v_changes || 'Status: ' || OLD.status || ' → ' || NEW.status || E'\n';
    END IF;
    IF OLD.valor != NEW.valor THEN
      v_changes := v_changes || 'Valor: ' || to_char(OLD.valor, 'FM999,999,999.00') || ' → ' || to_char(NEW.valor, 'FM999,999,999.00') || ' MTn' || E'\n';
    END IF;
    IF OLD.data_vencimento != NEW.data_vencimento THEN
      v_changes := v_changes || 'Vencimento: ' || TO_CHAR(OLD.data_vencimento, 'DD/MM/YYYY') || ' → ' || TO_CHAR(NEW.data_vencimento, 'DD/MM/YYYY') || E'\n';
    END IF;
    
    -- Criar notificação in-app
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
      '🔄 Dívida atualizada: ' || client_name || ' | ' || v_changes,
      NOW(),
      NOW()
    );

    -- Buscar emails de administradores ativos
    SELECT ARRAY_AGG(DISTINCT p.email)
    INTO v_admin_emails
    FROM profiles p
    INNER JOIN user_roles ur ON ur.user_id = p.user_id
    WHERE ur.role = 'admin'
      AND p.active = true
      AND p.email_notifications = true;

    -- Enviar e-mail para cada administrador
    IF v_admin_emails IS NOT NULL THEN
      FOREACH v_email IN ARRAY v_admin_emails
      LOOP
        v_email_body := format(
          'Dívida Atualizada no Sistema

🔄 Uma dívida foi modificada no sistema.

Cliente: %s
Descrição: %s

Alterações Realizadas:
%s

Estado Atual:
• Valor: %s MTn
• Status: %s
• Vencimento: %s

Esta é uma notificação automática do sistema Ncangaza Multiservices.',
          client_name,
          NEW.descricao,
          v_changes,
          to_char(NEW.valor, 'FM999,999,999.00'),
          NEW.status,
          TO_CHAR(NEW.data_vencimento, 'DD/MM/YYYY')
        );

        PERFORM net.http_post(
          url := 'https://vmgrnkuhprxowcvydnvm.supabase.co/functions/v1/send-email',
          headers := jsonb_build_object(
            'Content-Type', 'application/json',
            'Authorization', 'Bearer ' || current_setting('request.jwt.claim.sub', true)
          ),
          body := jsonb_build_object(
            'to', v_email,
            'subject', '🔄 Dívida Atualizada - ' || client_name,
            'message', v_email_body
          )
        );

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
          'email',
          'enviada',
          'E-mail enviado para ' || v_email || ' sobre atualização de dívida: ' || client_name,
          NOW(),
          NOW()
        );
      END LOOP;
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

-- Criar trigger para notificar quando um cliente for atualizado
CREATE OR REPLACE FUNCTION public.notify_client_updated()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_admin_emails TEXT[];
  v_email TEXT;
  v_email_body TEXT;
  v_changes TEXT;
BEGIN
  -- Só notificar se houve mudança nos dados principais
  IF (OLD.nome != NEW.nome OR OLD.telefone != NEW.telefone OR 
      OLD.email != NEW.email OR OLD.nuit != NEW.nuit OR OLD.ativo != NEW.ativo) THEN
    
    -- Identificar o que mudou
    v_changes := '';
    IF OLD.nome != NEW.nome THEN
      v_changes := v_changes || 'Nome: ' || OLD.nome || ' → ' || NEW.nome || E'\n';
    END IF;
    IF COALESCE(OLD.telefone, '') != COALESCE(NEW.telefone, '') THEN
      v_changes := v_changes || 'Telefone: ' || COALESCE(OLD.telefone, 'N/A') || ' → ' || COALESCE(NEW.telefone, 'N/A') || E'\n';
    END IF;
    IF COALESCE(OLD.email, '') != COALESCE(NEW.email, '') THEN
      v_changes := v_changes || 'Email: ' || COALESCE(OLD.email, 'N/A') || ' → ' || COALESCE(NEW.email, 'N/A') || E'\n';
    END IF;
    IF COALESCE(OLD.nuit, '') != COALESCE(NEW.nuit, '') THEN
      v_changes := v_changes || 'NUIT: ' || COALESCE(OLD.nuit, 'N/A') || ' → ' || COALESCE(NEW.nuit, 'N/A') || E'\n';
    END IF;
    IF OLD.ativo != NEW.ativo THEN
      v_changes := v_changes || 'Status: ' || (CASE WHEN OLD.ativo THEN 'Ativo' ELSE 'Inativo' END) || ' → ' || (CASE WHEN NEW.ativo THEN 'Ativo' ELSE 'Inativo' END) || E'\n';
    END IF;
    
    -- Criar notificação in-app
    INSERT INTO notificacoes (
      cliente_id,
      tipo,
      status,
      mensagem,
      data_agendamento,
      data_envio
    ) VALUES (
      NEW.id,
      'in_app',
      'enviada',
      '📝 Dados do cliente atualizados: ' || NEW.nome || ' | ' || v_changes,
      NOW(),
      NOW()
    );

    -- Buscar emails de administradores ativos
    SELECT ARRAY_AGG(DISTINCT p.email)
    INTO v_admin_emails
    FROM profiles p
    INNER JOIN user_roles ur ON ur.user_id = p.user_id
    WHERE ur.role = 'admin'
      AND p.active = true
      AND p.email_notifications = true;

    -- Enviar e-mail para cada administrador
    IF v_admin_emails IS NOT NULL THEN
      FOREACH v_email IN ARRAY v_admin_emails
      LOOP
        v_email_body := format(
          'Cliente Atualizado no Sistema

📝 Os dados de um cliente foram modificados.

Cliente: %s

Alterações Realizadas:
%s

Dados Atuais:
• NUIT: %s
• Telefone: %s
• Email: %s
• Endereço: %s
• Status: %s

Esta é uma notificação automática do sistema Ncangaza Multiservices.',
          NEW.nome,
          v_changes,
          COALESCE(NEW.nuit, 'Não informado'),
          COALESCE(NEW.telefone, 'Não informado'),
          COALESCE(NEW.email, 'Não informado'),
          COALESCE(NEW.endereco, 'Não informado'),
          CASE WHEN NEW.ativo THEN 'Ativo' ELSE 'Inativo' END
        );

        PERFORM net.http_post(
          url := 'https://vmgrnkuhprxowcvydnvm.supabase.co/functions/v1/send-email',
          headers := jsonb_build_object(
            'Content-Type', 'application/json',
            'Authorization', 'Bearer ' || current_setting('request.jwt.claim.sub', true)
          ),
          body := jsonb_build_object(
            'to', v_email,
            'subject', '📝 Cliente Atualizado - ' || NEW.nome,
            'message', v_email_body
          )
        );

        INSERT INTO notificacoes (
          cliente_id,
          tipo,
          status,
          mensagem,
          data_agendamento,
          data_envio
        ) VALUES (
          NEW.id,
          'email',
          'enviada',
          'E-mail enviado para ' || v_email || ' sobre atualização de cliente: ' || NEW.nome,
          NOW(),
          NOW()
        );
      END LOOP;
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

-- Recriar triggers
DROP TRIGGER IF EXISTS on_debt_overdue ON dividas;
CREATE TRIGGER on_debt_overdue
  AFTER UPDATE ON dividas
  FOR EACH ROW
  EXECUTE FUNCTION notify_debt_overdue();

DROP TRIGGER IF EXISTS on_debt_updated ON dividas;
CREATE TRIGGER on_debt_updated
  AFTER UPDATE ON dividas
  FOR EACH ROW
  EXECUTE FUNCTION notify_debt_updated();

DROP TRIGGER IF EXISTS on_client_updated ON clientes;
CREATE TRIGGER on_client_updated
  AFTER UPDATE ON clientes
  FOR EACH ROW
  EXECUTE FUNCTION notify_client_updated();