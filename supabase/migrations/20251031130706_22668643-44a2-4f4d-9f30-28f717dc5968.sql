-- Corrigir trigger de notificação de cliente para não bloquear inserções
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
    BEGIN
      -- Tentar pegar configurações (podem não existir ainda)
      v_supabase_url := current_setting('app.settings.supabase_url', true);
      v_service_key := current_setting('app.settings.supabase_service_key', true);
      
      -- Só tenta enviar se as configurações existirem
      IF v_supabase_url IS NOT NULL AND v_service_key IS NOT NULL THEN
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

        -- Usar pg_net para fazer requisição HTTP assíncrona
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
    EXCEPTION
      WHEN OTHERS THEN
        -- Log do erro mas não bloqueia a inserção
        RAISE WARNING 'Erro ao enviar email de boas-vindas: %', SQLERRM;
    END;
  END IF;

  RETURN NEW;
END;
$$;

-- Corrigir trigger de notificação de dívida
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
    BEGIN
      v_supabase_url := current_setting('app.settings.supabase_url', true);
      v_service_key := current_setting('app.settings.supabase_service_key', true);
      
      IF v_supabase_url IS NOT NULL AND v_service_key IS NOT NULL THEN
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
    EXCEPTION
      WHEN OTHERS THEN
        RAISE WARNING 'Erro ao enviar email de nova dívida: %', SQLERRM;
    END;
  END IF;

  RETURN NEW;
END;
$$;