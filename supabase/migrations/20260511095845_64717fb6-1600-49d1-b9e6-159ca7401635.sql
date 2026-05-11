
-- Habilitar extensões necessárias
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Helper: obter service role key do Vault
CREATE OR REPLACE FUNCTION public.get_service_role_key()
RETURNS text
LANGUAGE sql
SECURITY DEFINER
SET search_path = public, vault
AS $$
  SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = 'service_role_key' LIMIT 1
$$;

-- Função: notificar quando nova dívida é criada (envia ao CLIENTE + admins)
CREATE OR REPLACE FUNCTION public.notify_debt_created()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_client RECORD;
  v_admin_emails TEXT[];
  v_email TEXT;
  v_body TEXT;
  v_token TEXT;
BEGIN
  SELECT nome, email INTO v_client FROM clientes WHERE id = NEW.cliente_id;
  v_token := public.get_service_role_key();

  -- Notificação in-app
  INSERT INTO notificacoes (divida_id, cliente_id, tipo, status, mensagem, data_agendamento, data_envio)
  VALUES (NEW.id, NEW.cliente_id, 'in_app', 'enviada',
    '🆕 Nova dívida registada: ' || v_client.nome || ' | ' || NEW.valor::text || ' MTn | ' || NEW.descricao,
    NOW(), NOW());

  -- Email ao cliente
  IF v_client.email IS NOT NULL AND v_token IS NOT NULL THEN
    v_body := format(
      'Caro(a) %s,

Foi registada uma nova dívida em seu nome no sistema Ncangaza Multiservices.

Detalhes:
• Descrição: %s
• Valor: %s MTn
• Data de Vencimento: %s

Por favor, efetue o pagamento até a data de vencimento para evitar juros.

Atenciosamente,
Equipe Ncangaza Multiservices',
      v_client.nome, NEW.descricao,
      to_char(NEW.valor, 'FM999,999,999.00'),
      to_char(NEW.data_vencimento, 'DD/MM/YYYY')
    );

    PERFORM net.http_post(
      url := 'https://vmgrnkuhprxowcvydnvm.supabase.co/functions/v1/send-email',
      headers := jsonb_build_object('Content-Type','application/json','Authorization','Bearer '||v_token),
      body := jsonb_build_object('to', v_client.email,
        'subject', '🆕 Nova Dívida Registada - Ncangaza Multiservices',
        'message', v_body, 'clientName', v_client.nome)
    );

    INSERT INTO notificacoes (divida_id, cliente_id, tipo, status, mensagem, data_agendamento, data_envio)
    VALUES (NEW.id, NEW.cliente_id, 'email', 'enviada',
      'Email de nova dívida enviado para ' || v_client.email, NOW(), NOW());
  END IF;

  -- Emails aos admins
  SELECT ARRAY_AGG(DISTINCT p.email) INTO v_admin_emails
  FROM profiles p INNER JOIN user_roles ur ON ur.user_id = p.user_id
  WHERE ur.role='admin' AND p.active=true AND p.email_notifications=true;

  IF v_admin_emails IS NOT NULL AND v_token IS NOT NULL THEN
    FOREACH v_email IN ARRAY v_admin_emails LOOP
      PERFORM net.http_post(
        url := 'https://vmgrnkuhprxowcvydnvm.supabase.co/functions/v1/send-email',
        headers := jsonb_build_object('Content-Type','application/json','Authorization','Bearer '||v_token),
        body := jsonb_build_object('to', v_email,
          'subject', '🆕 Nova dívida: ' || v_client.nome,
          'message', format('Nova dívida registada para %s no valor de %s MTn (vence em %s).',
            v_client.nome, to_char(NEW.valor,'FM999,999,999.00'), to_char(NEW.data_vencimento,'DD/MM/YYYY')))
      );
    END LOOP;
  END IF;

  RETURN NEW;
END;
$$;

-- Substituir notify_debt_overdue para enviar TAMBÉM ao cliente
CREATE OR REPLACE FUNCTION public.notify_debt_overdue()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
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

    -- Email ao cliente
    IF v_client.email IS NOT NULL AND v_token IS NOT NULL THEN
      v_body := format('Caro(a) %s,

A sua dívida está VENCIDA há %s dias.

Detalhes:
• Descrição: %s
• Valor: %s MTn
• Vencimento: %s

Solicitamos a regularização imediata para evitar juros adicionais.

Ncangaza Multiservices', v_client.nome, v_days, NEW.descricao,
        to_char(NEW.valor,'FM999,999,999.00'), to_char(NEW.data_vencimento,'DD/MM/YYYY'));

      PERFORM net.http_post(
        url := 'https://vmgrnkuhprxowcvydnvm.supabase.co/functions/v1/send-email',
        headers := jsonb_build_object('Content-Type','application/json','Authorization','Bearer '||v_token),
        body := jsonb_build_object('to', v_client.email,
          'subject','⚠️ Dívida Vencida - Regularize Já',
          'message', v_body, 'clientName', v_client.nome));

      INSERT INTO notificacoes (divida_id, cliente_id, tipo, status, mensagem, data_agendamento, data_envio)
      VALUES (NEW.id, NEW.cliente_id, 'email','enviada',
        'Email de vencimento enviado ao cliente '||v_client.email, NOW(), NOW());
    END IF;

    -- Emails aos admins
    SELECT ARRAY_AGG(DISTINCT p.email) INTO v_admin_emails
    FROM profiles p JOIN user_roles ur ON ur.user_id=p.user_id
    WHERE ur.role='admin' AND p.active=true AND p.email_notifications=true;

    IF v_admin_emails IS NOT NULL AND v_token IS NOT NULL THEN
      FOREACH v_email IN ARRAY v_admin_emails LOOP
        PERFORM net.http_post(
          url := 'https://vmgrnkuhprxowcvydnvm.supabase.co/functions/v1/send-email',
          headers := jsonb_build_object('Content-Type','application/json','Authorization','Bearer '||v_token),
          body := jsonb_build_object('to', v_email,
            'subject','⚠️ Dívida vencida: '||v_client.nome||' ('||v_days||'d)',
            'message', format('A dívida de %s no valor de %s MTn está vencida há %s dias.',
              v_client.nome, to_char(NEW.valor,'FM999,999,999.00'), v_days)));
      END LOOP;
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

-- Substituir notify_payment_completed para enviar TAMBÉM ao cliente
CREATE OR REPLACE FUNCTION public.notify_payment_completed()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_client RECORD; v_admin_emails TEXT[]; v_email TEXT; v_body TEXT; v_token TEXT;
BEGIN
  IF NEW.status='paga' AND (OLD.status IS NULL OR OLD.status!='paga') THEN
    SELECT nome, email INTO v_client FROM clientes WHERE id=NEW.cliente_id;
    v_token := public.get_service_role_key();

    INSERT INTO notificacoes (divida_id, cliente_id, tipo, status, mensagem, data_agendamento, data_envio)
    VALUES (NEW.id, NEW.cliente_id,'in_app','enviada',
      '✅ Pagamento confirmado: '||v_client.nome||' | '||NEW.valor::text||' MTn', NOW(), NOW());

    -- Email ao cliente
    IF v_client.email IS NOT NULL AND v_token IS NOT NULL THEN
      v_body := format('Caro(a) %s,

Confirmamos o pagamento da sua dívida. Obrigado!

Detalhes:
• Descrição: %s
• Valor Pago: %s MTn
• Data Pagamento: %s

Ncangaza Multiservices agradece a sua confiança.', v_client.nome, NEW.descricao,
        to_char(NEW.valor,'FM999,999,999.00'),
        to_char(COALESCE(NEW.data_pagamento, NOW()),'DD/MM/YYYY HH24:MI'));

      PERFORM net.http_post(
        url := 'https://vmgrnkuhprxowcvydnvm.supabase.co/functions/v1/send-email',
        headers := jsonb_build_object('Content-Type','application/json','Authorization','Bearer '||v_token),
        body := jsonb_build_object('to', v_client.email,
          'subject','✅ Pagamento Confirmado - Obrigado!',
          'message', v_body, 'clientName', v_client.nome));

      INSERT INTO notificacoes (divida_id, cliente_id, tipo, status, mensagem, data_agendamento, data_envio)
      VALUES (NEW.id, NEW.cliente_id, 'email','enviada',
        'Recibo enviado ao cliente '||v_client.email, NOW(), NOW());
    END IF;

    -- Emails aos admins
    SELECT ARRAY_AGG(DISTINCT p.email) INTO v_admin_emails
    FROM profiles p JOIN user_roles ur ON ur.user_id=p.user_id
    WHERE ur.role='admin' AND p.active=true AND p.email_notifications=true;

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

-- Atualizar check_and_notify_debts para usar o vault
CREATE OR REPLACE FUNCTION public.check_and_notify_debts()
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_debt RECORD; v_body TEXT; v_token TEXT;
BEGIN
  v_token := public.get_service_role_key();
  IF v_token IS NULL THEN RETURN; END IF;

  FOR v_debt IN
    SELECT d.id, d.valor, d.descricao, d.data_vencimento, c.email, c.nome AS client_name
    FROM dividas d JOIN clientes c ON d.cliente_id=c.id
    WHERE d.status='pendente' AND d.data_vencimento = CURRENT_DATE + INTERVAL '1 day'
      AND c.email IS NOT NULL
      AND NOT EXISTS (SELECT 1 FROM notificacoes n WHERE n.divida_id=d.id
        AND n.tipo='email' AND n.mensagem LIKE '%vence amanhã%' AND DATE(n.created_at)=CURRENT_DATE)
  LOOP
    v_body := format('Olá %s,

⚠️ LEMBRETE: A sua dívida vence AMANHÃ.

• Descrição: %s
• Valor: %s MTn
• Vencimento: %s

Por favor regularize a tempo.

Ncangaza Multiservices', v_debt.client_name, v_debt.descricao,
      to_char(v_debt.valor,'FM999,999,999.00'), to_char(v_debt.data_vencimento,'DD/MM/YYYY'));

    PERFORM net.http_post(
      url := 'https://vmgrnkuhprxowcvydnvm.supabase.co/functions/v1/send-email',
      headers := jsonb_build_object('Content-Type','application/json','Authorization','Bearer '||v_token),
      body := jsonb_build_object('to', v_debt.email,
        'subject','⚠️ LEMBRETE: Dívida vence amanhã',
        'message', v_body, 'clientName', v_debt.client_name));

    INSERT INTO notificacoes (divida_id, tipo, status, mensagem, data_envio, data_agendamento)
    VALUES (v_debt.id, 'email','enviada', v_body || ' [vence amanhã]', NOW(), NOW());
  END LOOP;
END;
$$;

-- Criar triggers na tabela dividas
DROP TRIGGER IF EXISTS trg_notify_debt_created ON public.dividas;
CREATE TRIGGER trg_notify_debt_created
  AFTER INSERT ON public.dividas
  FOR EACH ROW EXECUTE FUNCTION public.notify_debt_created();

DROP TRIGGER IF EXISTS trg_notify_debt_overdue ON public.dividas;
CREATE TRIGGER trg_notify_debt_overdue
  AFTER UPDATE ON public.dividas
  FOR EACH ROW EXECUTE FUNCTION public.notify_debt_overdue();

DROP TRIGGER IF EXISTS trg_notify_payment_completed ON public.dividas;
CREATE TRIGGER trg_notify_payment_completed
  AFTER UPDATE ON public.dividas
  FOR EACH ROW EXECUTE FUNCTION public.notify_payment_completed();

-- Cron diário às 08:00 para verificar vencimentos
DO $$
BEGIN
  PERFORM cron.unschedule('verificar-dividas-diariamente');
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

SELECT cron.schedule(
  'verificar-dividas-diariamente',
  '0 8 * * *',
  $$ SELECT public.check_and_notify_debts(); SELECT public.update_debt_status(); $$
);
