
-- 1) Promover ramimpita65@gmail.com a admin e garantir perfil com notificações por email
INSERT INTO public.profiles (user_id, full_name, active, email_notifications)
VALUES ('1a539985-302c-4b8a-a84a-0897c83573a6', 'Ramimpita', true, true)
ON CONFLICT (user_id) DO UPDATE SET active=true, email_notifications=true;

INSERT INTO public.user_roles (user_id, role)
VALUES ('1a539985-302c-4b8a-a84a-0897c83573a6', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;

-- 2) Corrigir as 3 funções de trigger: profiles não tem coluna email — usar auth.users
CREATE OR REPLACE FUNCTION public.notify_debt_created()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $$
DECLARE
  v_client RECORD; v_admin_emails TEXT[]; v_email TEXT; v_body TEXT; v_token TEXT;
BEGIN
  SELECT nome, email INTO v_client FROM clientes WHERE id = NEW.cliente_id;
  v_token := public.get_service_role_key();

  INSERT INTO notificacoes (divida_id, cliente_id, tipo, status, mensagem, data_agendamento, data_envio)
  VALUES (NEW.id, NEW.cliente_id, 'in_app','enviada',
    '🆕 Nova dívida registada: '||v_client.nome||' | '||NEW.valor::text||' MTn | '||NEW.descricao, NOW(), NOW());

  IF v_client.email IS NOT NULL AND v_token IS NOT NULL THEN
    v_body := format('Caro(a) %s,

Foi registada uma nova dívida em seu nome.

• Descrição: %s
• Valor: %s MTn
• Vencimento: %s

Ncangaza Multiservices', v_client.nome, NEW.descricao,
      to_char(NEW.valor,'FM999,999,999.00'), to_char(NEW.data_vencimento,'DD/MM/YYYY'));
    PERFORM net.http_post(
      url := 'https://vmgrnkuhprxowcvydnvm.supabase.co/functions/v1/send-email',
      headers := jsonb_build_object('Content-Type','application/json','Authorization','Bearer '||v_token),
      body := jsonb_build_object('to', v_client.email,
        'subject','🆕 Nova Dívida Registada','message', v_body, 'clientName', v_client.nome));
  END IF;

  SELECT ARRAY_AGG(DISTINCT u.email) INTO v_admin_emails
  FROM auth.users u
  JOIN user_roles ur ON ur.user_id=u.id
  LEFT JOIN profiles p ON p.user_id=u.id
  WHERE ur.role='admin' AND COALESCE(p.active,true)=true AND COALESCE(p.email_notifications,true)=true
    AND u.email IS NOT NULL;

  IF v_admin_emails IS NOT NULL AND v_token IS NOT NULL THEN
    FOREACH v_email IN ARRAY v_admin_emails LOOP
      PERFORM net.http_post(
        url := 'https://vmgrnkuhprxowcvydnvm.supabase.co/functions/v1/send-email',
        headers := jsonb_build_object('Content-Type','application/json','Authorization','Bearer '||v_token),
        body := jsonb_build_object('to', v_email,
          'subject','🆕 Nova dívida: '||v_client.nome,
          'message', format('Nova dívida para %s no valor de %s MTn (vence %s).',
            v_client.nome, to_char(NEW.valor,'FM999,999,999.00'), to_char(NEW.data_vencimento,'DD/MM/YYYY'))));
    END LOOP;
  END IF;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.notify_debt_overdue()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $$
DECLARE
  v_client RECORD; v_days INT; v_admin_emails TEXT[]; v_email TEXT; v_body TEXT; v_token TEXT;
BEGIN
  IF NEW.status='vencida' AND (OLD.status IS NULL OR OLD.status!='vencida') THEN
    SELECT nome, email INTO v_client FROM clientes WHERE id=NEW.cliente_id;
    v_days := CURRENT_DATE - NEW.data_vencimento;
    v_token := public.get_service_role_key();

    INSERT INTO notificacoes (divida_id, cliente_id, tipo, status, mensagem, data_agendamento, data_envio)
    VALUES (NEW.id, NEW.cliente_id, 'in_app','enviada',
      '⚠️ Dívida vencida há '||v_days||' dias - '||v_client.nome||' | '||NEW.valor::text||' MTn', NOW(), NOW());

    IF v_client.email IS NOT NULL AND v_token IS NOT NULL THEN
      v_body := format('Caro(a) %s,

A sua dívida está VENCIDA há %s dias.

• Descrição: %s
• Valor: %s MTn
• Vencimento: %s

Ncangaza Multiservices', v_client.nome, v_days, NEW.descricao,
        to_char(NEW.valor,'FM999,999,999.00'), to_char(NEW.data_vencimento,'DD/MM/YYYY'));
      PERFORM net.http_post(
        url := 'https://vmgrnkuhprxowcvydnvm.supabase.co/functions/v1/send-email',
        headers := jsonb_build_object('Content-Type','application/json','Authorization','Bearer '||v_token),
        body := jsonb_build_object('to', v_client.email,
          'subject','⚠️ Dívida Vencida','message', v_body, 'clientName', v_client.nome));
    END IF;

    SELECT ARRAY_AGG(DISTINCT u.email) INTO v_admin_emails
    FROM auth.users u
    JOIN user_roles ur ON ur.user_id=u.id
    LEFT JOIN profiles p ON p.user_id=u.id
    WHERE ur.role='admin' AND COALESCE(p.active,true)=true AND COALESCE(p.email_notifications,true)=true
      AND u.email IS NOT NULL;

    IF v_admin_emails IS NOT NULL AND v_token IS NOT NULL THEN
      FOREACH v_email IN ARRAY v_admin_emails LOOP
        PERFORM net.http_post(
          url := 'https://vmgrnkuhprxowcvydnvm.supabase.co/functions/v1/send-email',
          headers := jsonb_build_object('Content-Type','application/json','Authorization','Bearer '||v_token),
          body := jsonb_build_object('to', v_email,
            'subject','⚠️ Dívida vencida: '||v_client.nome||' ('||v_days||'d)',
            'message', format('A dívida de %s (%s MTn) está vencida há %s dias.',
              v_client.nome, to_char(NEW.valor,'FM999,999,999.00'), v_days)));
      END LOOP;
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.notify_payment_completed()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $$
DECLARE
  v_client RECORD; v_admin_emails TEXT[]; v_email TEXT; v_body TEXT; v_token TEXT;
BEGIN
  IF NEW.status='paga' AND (OLD.status IS NULL OR OLD.status!='paga') THEN
    SELECT nome, email INTO v_client FROM clientes WHERE id=NEW.cliente_id;
    v_token := public.get_service_role_key();

    INSERT INTO notificacoes (divida_id, cliente_id, tipo, status, mensagem, data_agendamento, data_envio)
    VALUES (NEW.id, NEW.cliente_id,'in_app','enviada',
      '✅ Pagamento confirmado: '||v_client.nome||' | '||NEW.valor::text||' MTn', NOW(), NOW());

    IF v_client.email IS NOT NULL AND v_token IS NOT NULL THEN
      v_body := format('Caro(a) %s,

Confirmamos o pagamento da sua dívida.

• Descrição: %s
• Valor Pago: %s MTn
• Data: %s

Obrigado!
Ncangaza Multiservices', v_client.nome, NEW.descricao,
        to_char(NEW.valor,'FM999,999,999.00'),
        to_char(COALESCE(NEW.data_pagamento, NOW()),'DD/MM/YYYY HH24:MI'));
      PERFORM net.http_post(
        url := 'https://vmgrnkuhprxowcvydnvm.supabase.co/functions/v1/send-email',
        headers := jsonb_build_object('Content-Type','application/json','Authorization','Bearer '||v_token),
        body := jsonb_build_object('to', v_client.email,
          'subject','✅ Pagamento Confirmado','message', v_body, 'clientName', v_client.nome));
    END IF;

    SELECT ARRAY_AGG(DISTINCT u.email) INTO v_admin_emails
    FROM auth.users u
    JOIN user_roles ur ON ur.user_id=u.id
    LEFT JOIN profiles p ON p.user_id=u.id
    WHERE ur.role='admin' AND COALESCE(p.active,true)=true AND COALESCE(p.email_notifications,true)=true
      AND u.email IS NOT NULL;

    IF v_admin_emails IS NOT NULL AND v_token IS NOT NULL THEN
      FOREACH v_email IN ARRAY v_admin_emails LOOP
        PERFORM net.http_post(
          url := 'https://vmgrnkuhprxowcvydnvm.supabase.co/functions/v1/send-email',
          headers := jsonb_build_object('Content-Type','application/json','Authorization','Bearer '||v_token),
          body := jsonb_build_object('to', v_email,
            'subject','✅ Pagamento confirmado: '||v_client.nome,
            'message', format('Pagamento de %s MTn confirmado para %s.',
              to_char(NEW.valor,'FM999,999,999.00'), v_client.nome)));
      END LOOP;
    END IF;
  END IF;
  RETURN NEW;
END;
$$;
