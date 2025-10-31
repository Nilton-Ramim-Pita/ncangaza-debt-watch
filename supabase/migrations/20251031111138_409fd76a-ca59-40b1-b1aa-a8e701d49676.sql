-- Criar função que envia email de boas-vindas quando cliente é criado
CREATE OR REPLACE FUNCTION public.notify_new_client()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_supabase_url text;
  v_service_key text;
  v_email_body text;
BEGIN
  -- Só envia se tiver email
  IF NEW.email IS NOT NULL AND NEW.email != '' THEN
    v_supabase_url := current_setting('app.settings.supabase_url', true);
    v_service_key := current_setting('app.settings.supabase_service_key', true);
    
    v_email_body := format(
      'Bem-vindo(a) à Ncangaza Multiservices, %s!

Seu cadastro foi realizado com sucesso no nosso sistema de gestão de dívidas.

Dados cadastrados:
- Nome: %s
- NUIT: %s
- Telefone: %s
- Email: %s
- Endereço: %s

Em caso de dúvidas, entre em contato conosco.

Atenciosamente,
Equipe Ncangaza Multiservices',
      NEW.nome,
      NEW.nome,
      COALESCE(NEW.nuit, 'Não informado'),
      COALESCE(NEW.telefone, 'Não informado'),
      NEW.email,
      COALESCE(NEW.endereco, 'Não informado')
    );

    -- Usar pg_net para fazer requisição HTTP assíncrona (não bloqueia o INSERT)
    PERFORM net.http_post(
      url := v_supabase_url || '/functions/v1/send-email',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || v_service_key
      ),
      body := jsonb_build_object(
        'to', NEW.email,
        'subject', 'Bem-vindo à Ncangaza Multiservices',
        'message', v_email_body
      )
    );
  END IF;

  RETURN NEW;
END;
$$;

-- Trigger para enviar email quando cliente é criado
DROP TRIGGER IF EXISTS on_client_created ON public.clientes;
CREATE TRIGGER on_client_created
  AFTER INSERT ON public.clientes
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_new_client();

-- Criar função que envia email quando dívida é criada
CREATE OR REPLACE FUNCTION public.notify_new_debt()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_supabase_url text;
  v_service_key text;
  v_client_email text;
  v_client_name text;
  v_email_body text;
BEGIN
  -- Buscar dados do cliente
  SELECT email, nome INTO v_client_email, v_client_name
  FROM public.clientes
  WHERE id = NEW.cliente_id;

  -- Só envia se cliente tiver email
  IF v_client_email IS NOT NULL AND v_client_email != '' THEN
    v_supabase_url := current_setting('app.settings.supabase_url', true);
    v_service_key := current_setting('app.settings.supabase_service_key', true);
    
    v_email_body := format(
      'Olá %s,

Uma nova dívida foi registrada em seu nome no sistema Ncangaza Multiservices.

Detalhes da dívida:
- Descrição: %s
- Valor: %s MZN
- Data de vencimento: %s
- Status: %s

Por favor, certifique-se de efetuar o pagamento até a data de vencimento.

Em caso de dúvidas, entre em contato conosco.

Atenciosamente,
Equipe Ncangaza Multiservices',
      v_client_name,
      NEW.descricao,
      to_char(NEW.valor, 'FM999,999,999.00'),
      to_char(NEW.data_vencimento, 'DD/MM/YYYY'),
      CASE NEW.status
        WHEN 'pendente' THEN 'Pendente'
        WHEN 'paga' THEN 'Paga'
        WHEN 'vencida' THEN 'Vencida'
        ELSE NEW.status
      END
    );

    -- Usar pg_net para fazer requisição HTTP assíncrona
    PERFORM net.http_post(
      url := v_supabase_url || '/functions/v1/send-email',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || v_service_key
      ),
      body := jsonb_build_object(
        'to', v_client_email,
        'subject', 'Nova dívida registrada - Ncangaza Multiservices',
        'message', v_email_body
      )
    );

    -- Registrar notificação no banco
    INSERT INTO public.notificacoes (divida_id, tipo, status, mensagem, data_envio, data_agendamento)
    VALUES (NEW.id, 'email', 'enviada', v_email_body, now(), now());
  END IF;

  RETURN NEW;
END;
$$;

-- Trigger para enviar email quando dívida é criada
DROP TRIGGER IF EXISTS on_debt_created ON public.dividas;
CREATE TRIGGER on_debt_created
  AFTER INSERT ON public.dividas
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_new_debt();

-- Atualizar função check_debts para incluir alertas 1 dia antes do vencimento
CREATE OR REPLACE FUNCTION public.check_and_notify_debts()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_supabase_url text;
  v_service_key text;
  v_debt record;
  v_email_body text;
BEGIN
  v_supabase_url := current_setting('app.settings.supabase_url', true);
  v_service_key := current_setting('app.settings.supabase_service_key', true);

  -- Notificar dívidas que vencem em 1 dia (apenas se ainda não foi enviado lembrete hoje)
  FOR v_debt IN
    SELECT d.id, d.valor, d.descricao, d.data_vencimento, 
           c.email, c.nome as client_name
    FROM public.dividas d
    INNER JOIN public.clientes c ON d.cliente_id = c.id
    WHERE d.status = 'pendente'
      AND d.data_vencimento = CURRENT_DATE + INTERVAL '1 day'
      AND c.email IS NOT NULL
      AND NOT EXISTS (
        SELECT 1 FROM public.notificacoes n
        WHERE n.divida_id = d.id
          AND n.tipo = 'email'
          AND n.mensagem LIKE '%vence amanhã%'
          AND DATE(n.created_at) = CURRENT_DATE
      )
  LOOP
    v_email_body := format(
      'Olá %s,

LEMBRETE: Sua dívida vence amanhã!

Detalhes da dívida:
- Descrição: %s
- Valor: %s MZN
- Data de vencimento: %s (AMANHÃ)

Por favor, efetue o pagamento o quanto antes para evitar multas ou juros.

Em caso de dúvidas, entre em contato conosco.

Atenciosamente,
Equipe Ncangaza Multiservices',
      v_debt.client_name,
      v_debt.descricao,
      to_char(v_debt.valor, 'FM999,999,999.00'),
      to_char(v_debt.data_vencimento, 'DD/MM/YYYY')
    );

    -- Enviar email
    PERFORM net.http_post(
      url := v_supabase_url || '/functions/v1/send-email',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || v_service_key
      ),
      body := jsonb_build_object(
        'to', v_debt.email,
        'subject', '⚠️ LEMBRETE: Dívida vence amanhã - Ncangaza Multiservices',
        'message', v_email_body
      )
    );

    -- Registrar notificação
    INSERT INTO public.notificacoes (divida_id, tipo, status, mensagem, data_envio, data_agendamento)
    VALUES (v_debt.id, 'email', 'enviada', v_email_body, now(), now());
  END LOOP;
END;
$$;

COMMENT ON FUNCTION public.check_and_notify_debts() IS 'Verifica e notifica sobre dívidas que vencem em 1 dia';