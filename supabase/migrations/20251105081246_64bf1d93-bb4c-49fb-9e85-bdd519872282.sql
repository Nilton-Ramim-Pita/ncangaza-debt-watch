-- Melhorar sistema de notificações: in-app + e-mail para eventos importantes

-- 1. Atualizar função de notificação de novo cliente para incluir e-mail
CREATE OR REPLACE FUNCTION public.notify_new_client()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
DECLARE
  v_admin_emails TEXT[];
  v_email TEXT;
  v_email_body TEXT;
BEGIN
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
    '✅ Novo cliente cadastrado: ' || NEW.nome || 
    ' | NUIT: ' || COALESCE(NEW.nuit, 'N/A') || 
    ' | Tel: ' || COALESCE(NEW.telefone, 'N/A') || 
    ' | Email: ' || COALESCE(NEW.email, 'N/A'),
    NOW(),
    NOW()
  );

  -- Buscar emails de todos os administradores ativos
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
        'Novo Cliente Cadastrado no Sistema

📋 Detalhes do Cliente:
• Nome: %s
• NUIT: %s
• Telefone: %s
• Email: %s
• Endereço: %s
• Data de Registro: %s

Esta é uma notificação automática do sistema Ncangaza Multiservices.',
        NEW.nome,
        COALESCE(NEW.nuit, 'Não informado'),
        COALESCE(NEW.telefone, 'Não informado'),
        COALESCE(NEW.email, 'Não informado'),
        COALESCE(NEW.endereco, 'Não informado'),
        TO_CHAR(NEW.data_registro, 'DD/MM/YYYY HH24:MI')
      );

      -- Chamar edge function para enviar e-mail
      PERFORM net.http_post(
        url := 'https://vmgrnkuhprxowcvydnvm.supabase.co/functions/v1/send-email',
        headers := jsonb_build_object(
          'Content-Type', 'application/json',
          'Authorization', 'Bearer ' || current_setting('request.jwt.claim.sub', true)
        ),
        body := jsonb_build_object(
          'to', v_email,
          'subject', '✅ Novo Cliente Cadastrado - ' || NEW.nome,
          'message', v_email_body
        )
      );

      -- Registrar notificação de e-mail
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
        'E-mail enviado para ' || v_email || ' sobre novo cliente: ' || NEW.nome,
        NOW(),
        NOW()
      );
    END LOOP;
  END IF;

  RETURN NEW;
END;
$function$;

-- 2. Atualizar função de notificação de nova dívida para incluir e-mail
CREATE OR REPLACE FUNCTION public.notify_new_debt()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
DECLARE
  client_name TEXT;
  v_admin_emails TEXT[];
  v_email TEXT;
  v_email_body TEXT;
BEGIN
  SELECT nome INTO client_name FROM clientes WHERE id = NEW.cliente_id;
  
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
    '💰 Nova dívida registrada: ' || client_name || 
    ' | Valor: ' || NEW.valor::text || ' MTn' ||
    ' | Vencimento: ' || TO_CHAR(NEW.data_vencimento, 'DD/MM/YYYY') ||
    ' | Descrição: ' || NEW.descricao,
    NOW(),
    NOW()
  );

  -- Buscar emails de todos os administradores ativos
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
        'Nova Dívida Registrada no Sistema

💰 Detalhes da Dívida:
• Cliente: %s
• Valor: %s MTn
• Descrição: %s
• Data de Vencimento: %s
• Status: %s
• Dias até vencimento: %s

Esta é uma notificação automática do sistema Ncangaza Multiservices.',
        client_name,
        to_char(NEW.valor, 'FM999,999,999.00'),
        NEW.descricao,
        TO_CHAR(NEW.data_vencimento, 'DD/MM/YYYY'),
        NEW.status,
        (NEW.data_vencimento - CURRENT_DATE)::text
      );

      -- Chamar edge function para enviar e-mail
      PERFORM net.http_post(
        url := 'https://vmgrnkuhprxowcvydnvm.supabase.co/functions/v1/send-email',
        headers := jsonb_build_object(
          'Content-Type', 'application/json',
          'Authorization', 'Bearer ' || current_setting('request.jwt.claim.sub', true)
        ),
        body := jsonb_build_object(
          'to', v_email,
          'subject', '💰 Nova Dívida Registrada - ' || client_name,
          'message', v_email_body
        )
      );

      -- Registrar notificação de e-mail
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
        'E-mail enviado para ' || v_email || ' sobre nova dívida: ' || client_name,
        NOW(),
        NOW()
      );
    END LOOP;
  END IF;

  RETURN NEW;
END;
$function$;

-- 3. Recriar triggers se não existirem
DROP TRIGGER IF EXISTS on_client_created ON public.clientes;
CREATE TRIGGER on_client_created
  AFTER INSERT ON public.clientes
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_new_client();

DROP TRIGGER IF EXISTS on_debt_created ON public.dividas;
CREATE TRIGGER on_debt_created
  AFTER INSERT ON public.dividas
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_new_debt();

-- 4. Melhorar a função de notificação de pagamento completo
CREATE OR REPLACE FUNCTION public.notify_payment_completed()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
DECLARE
  client_name TEXT;
  v_admin_emails TEXT[];
  v_email TEXT;
  v_email_body TEXT;
BEGIN
  IF NEW.status = 'paga' AND (OLD.status IS NULL OR OLD.status != 'paga') THEN
    SELECT nome INTO client_name FROM clientes WHERE id = NEW.cliente_id;
    
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
      '✅ Pagamento confirmado: ' || client_name || 
      ' | Valor: ' || NEW.valor::text || ' MTn' ||
      ' | Descrição: ' || NEW.descricao,
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
          'Pagamento Confirmado

✅ Uma dívida foi paga!

Detalhes:
• Cliente: %s
• Valor Pago: %s MTn
• Descrição: %s
• Data de Pagamento: %s
• Data de Vencimento Original: %s

Esta é uma notificação automática do sistema Ncangaza Multiservices.',
          client_name,
          to_char(NEW.valor, 'FM999,999,999.00'),
          NEW.descricao,
          TO_CHAR(NEW.data_pagamento, 'DD/MM/YYYY HH24:MI'),
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
            'subject', '✅ Pagamento Confirmado - ' || client_name,
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
          'E-mail enviado para ' || v_email || ' sobre pagamento: ' || client_name,
          NOW(),
          NOW()
        );
      END LOOP;
    END IF;
  END IF;
  RETURN NEW;
END;
$function$;