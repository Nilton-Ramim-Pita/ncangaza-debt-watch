-- Atualizar função para notificar novos clientes
CREATE OR REPLACE FUNCTION public.notify_new_client()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_email_body text;
  v_response record;
BEGIN
  -- Só envia se tiver email
  IF NEW.email IS NOT NULL AND NEW.email != '' THEN
    BEGIN
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

      -- Fazer requisição HTTP para o edge function
      SELECT * INTO v_response FROM net.http_post(
        url := 'https://vmgrnkuhprxowcvydnvm.supabase.co/functions/v1/send-email',
        headers := jsonb_build_object(
          'Content-Type', 'application/json',
          'Authorization', 'Bearer ' || current_setting('request.jwt.claim.sub', true)
        ),
        body := jsonb_build_object(
          'to', NEW.email,
          'subject', '🎉 Bem-vindo à Ncangaza Multiservices',
          'message', v_email_body
        )
      );

      RAISE LOG 'Email de boas-vindas enviado para %: %', NEW.email, v_response;
      
    EXCEPTION
      WHEN OTHERS THEN
        RAISE WARNING 'Erro ao enviar email de boas-vindas: %', SQLERRM;
    END;
  END IF;

  RETURN NEW;
END;
$function$;

-- Atualizar função para notificar novas dívidas
CREATE OR REPLACE FUNCTION public.notify_new_debt()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_client_email text;
  v_client_name text;
  v_email_body text;
  v_response record;
BEGIN
  -- Buscar dados do cliente
  SELECT email, nome INTO v_client_email, v_client_name
  FROM public.clientes
  WHERE id = NEW.cliente_id;

  -- Só envia se cliente tiver email
  IF v_client_email IS NOT NULL AND v_client_email != '' THEN
    BEGIN
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

      SELECT * INTO v_response FROM net.http_post(
        url := 'https://vmgrnkuhprxowcvydnvm.supabase.co/functions/v1/send-email',
        headers := jsonb_build_object(
          'Content-Type', 'application/json',
          'Authorization', 'Bearer ' || current_setting('request.jwt.claim.sub', true)
        ),
        body := jsonb_build_object(
          'to', v_client_email,
          'subject', '💰 Nova dívida registrada - Ncangaza Multiservices',
          'message', v_email_body
        )
      );

      -- Registrar notificação no banco
      INSERT INTO public.notificacoes (divida_id, tipo, status, mensagem, data_envio, data_agendamento)
      VALUES (NEW.id, 'email', 'enviada', v_email_body, now(), now());
      
      RAISE LOG 'Email de nova dívida enviado para %: %', v_client_email, v_response;
      
    EXCEPTION
      WHEN OTHERS THEN
        RAISE WARNING 'Erro ao enviar email de nova dívida: %', SQLERRM;
    END;
  END IF;

  RETURN NEW;
END;
$function$;

-- Atualizar função para verificar dívidas vencendo
CREATE OR REPLACE FUNCTION public.check_and_notify_debts()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_debt record;
  v_email_body text;
  v_response record;
BEGIN
  -- Notificar dívidas que vencem em 1 dia
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

⚠️ LEMBRETE: Sua dívida vence amanhã!

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

    BEGIN
      SELECT * INTO v_response FROM net.http_post(
        url := 'https://vmgrnkuhprxowcvydnvm.supabase.co/functions/v1/send-email',
        headers := jsonb_build_object(
          'Content-Type', 'application/json',
          'Authorization', 'Bearer ' || current_setting('request.jwt.claim.sub', true)
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
      
      RAISE LOG 'Lembrete de vencimento enviado para %', v_debt.email;
    EXCEPTION
      WHEN OTHERS THEN
        RAISE WARNING 'Erro ao enviar lembrete de vencimento: %', SQLERRM;
    END;
  END LOOP;
END;
$function$;