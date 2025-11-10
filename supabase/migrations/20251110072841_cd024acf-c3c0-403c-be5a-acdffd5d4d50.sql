-- Corrigir search_path das funções criadas para segurança

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.notify_new_client()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  PERFORM pg_notify(
    'novo_cliente',
    json_build_object(
      'id', NEW.id,
      'nome', NEW.nome,
      'data', now()
    )::text
  );
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.notify_client_updated()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  PERFORM pg_notify(
    'cliente_atualizado',
    json_build_object(
      'id', NEW.id,
      'nome', NEW.nome,
      'data', now()
    )::text
  );
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.notify_new_debt()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  PERFORM pg_notify(
    'nova_divida',
    json_build_object(
      'id', NEW.id,
      'cliente_id', NEW.cliente_id,
      'valor', NEW.valor,
      'status', NEW.status,
      'data_vencimento', NEW.data_vencimento,
      'data', now()
    )::text
  );
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.notify_debt_updated()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Notificação geral de atualização da dívida
  PERFORM pg_notify(
    'divida_atualizada',
    json_build_object(
      'id', NEW.id,
      'cliente_id', NEW.cliente_id,
      'valor', NEW.valor,
      'status', NEW.status,
      'data_vencimento', NEW.data_vencimento,
      'data', now()
    )::text
  );

  -- Notificação específica quando pagamento é concluído
  IF NEW.status = 'paga' AND (OLD.status IS DISTINCT FROM 'paga') THEN
    PERFORM pg_notify(
      'pagamento_confirmado',
      json_build_object(
        'id', NEW.id,
        'cliente_id', NEW.cliente_id,
        'valor', NEW.valor,
        'data_pagamento', NEW.data_pagamento,
        'data', now()
      )::text
    );
  END IF;

  -- Notificação quando entra em atraso
  IF NEW.status = 'vencida' AND (OLD.status IS DISTINCT FROM 'vencida') THEN
    PERFORM pg_notify(
      'divida_vencida',
      json_build_object(
        'id', NEW.id,
        'cliente_id', NEW.cliente_id,
        'valor', NEW.valor,
        'data_vencimento', NEW.data_vencimento,
        'data', now()
      )::text
    );
  END IF;

  RETURN NEW;
END;
$$;
