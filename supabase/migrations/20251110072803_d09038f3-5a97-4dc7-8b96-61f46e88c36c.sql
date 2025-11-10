-- 1) Remover triggers existentes para evitar duplicidade
DROP TRIGGER IF EXISTS on_client_created ON public.clientes;
DROP TRIGGER IF EXISTS on_client_updated ON public.clientes;
DROP TRIGGER IF EXISTS update_clientes_updated_at ON public.clientes;

DROP TRIGGER IF EXISTS on_debt_created ON public.dividas;
DROP TRIGGER IF EXISTS on_debt_updated ON public.dividas;
DROP TRIGGER IF EXISTS update_dividas_updated_at ON public.dividas;
DROP TRIGGER IF EXISTS on_debt_paid ON public.dividas;

-- 2) Função genérica para atualizar updated_at de forma segura
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END;
$$;

-- 3) Funções de notificação MINIMALISTAS (sem dependências externas)
-- Clientes
CREATE OR REPLACE FUNCTION public.notify_new_client()
RETURNS trigger
LANGUAGE plpgsql
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

-- Dívidas
CREATE OR REPLACE FUNCTION public.notify_new_debt()
RETURNS trigger
LANGUAGE plpgsql
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

-- 4) Recriar triggers, garantindo apenas UMA por ação
-- Clientes
CREATE TRIGGER update_clientes_updated_at
BEFORE UPDATE ON public.clientes
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER on_client_created
AFTER INSERT ON public.clientes
FOR EACH ROW
EXECUTE FUNCTION public.notify_new_client();

CREATE TRIGGER on_client_updated
AFTER UPDATE ON public.clientes
FOR EACH ROW
EXECUTE FUNCTION public.notify_client_updated();

-- Dívidas
CREATE TRIGGER update_dividas_updated_at
BEFORE UPDATE ON public.dividas
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER on_debt_created
AFTER INSERT ON public.dividas
FOR EACH ROW
EXECUTE FUNCTION public.notify_new_debt();

CREATE TRIGGER on_debt_updated
AFTER UPDATE ON public.dividas
FOR EACH ROW
EXECUTE FUNCTION public.notify_debt_updated();
