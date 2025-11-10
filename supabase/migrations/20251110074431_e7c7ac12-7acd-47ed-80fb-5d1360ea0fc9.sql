-- Deduplicar e padronizar triggers de clientes e dívidas, removendo dependências externas
-- Clientes: remover gatilhos duplicados e recriar apenas 1 por ação
DROP TRIGGER IF EXISTS on_client_created ON public.clientes;
DROP TRIGGER IF EXISTS trg_notify_new_client ON public.clientes;
DROP TRIGGER IF EXISTS trigger_notify_new_client ON public.clientes;
DROP TRIGGER IF EXISTS on_client_updated ON public.clientes;
DROP TRIGGER IF EXISTS update_clientes_updated_at ON public.clientes;

CREATE TRIGGER clientes_after_insert
AFTER INSERT ON public.clientes
FOR EACH ROW EXECUTE FUNCTION public.notify_new_client();

CREATE TRIGGER clientes_after_update
AFTER UPDATE ON public.clientes
FOR EACH ROW EXECUTE FUNCTION public.notify_client_updated();

CREATE TRIGGER clientes_set_updated_at
BEFORE UPDATE ON public.clientes
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Dívidas: remover gatilhos duplicados e os que chamam funções com chamadas externas
DROP TRIGGER IF EXISTS on_debt_created ON public.dividas;
DROP TRIGGER IF EXISTS trg_notify_new_debt ON public.dividas;
DROP TRIGGER IF EXISTS trigger_notify_new_debt ON public.dividas;
DROP TRIGGER IF EXISTS on_debt_updated ON public.dividas;
DROP TRIGGER IF EXISTS on_debt_overdue ON public.dividas;
DROP TRIGGER IF EXISTS trigger_notify_payment_completed ON public.dividas;
DROP TRIGGER IF EXISTS update_dividas_updated_at ON public.dividas;

CREATE TRIGGER dividas_after_insert
AFTER INSERT ON public.dividas
FOR EACH ROW EXECUTE FUNCTION public.notify_new_debt();

CREATE TRIGGER dividas_after_update
AFTER UPDATE ON public.dividas
FOR EACH ROW EXECUTE FUNCTION public.notify_debt_updated();

CREATE TRIGGER dividas_set_updated_at
BEFORE UPDATE ON public.dividas
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
