import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { createInAppNotification } from '@/utils/notifications';
import { formatCurrency } from '@/utils/currency';

export interface Debt {
  id: string;
  cliente_id: string;
  valor: number;
  descricao: string;
  data_vencimento: string;
  status: 'pendente' | 'paga' | 'vencida';
  data_criacao: string;
  data_pagamento: string | null;
  cliente: {
    nome: string;
    nuit: string | null;
  } | null;
}

export interface DebtFormData {
  cliente_id: string;
  valor: number;
  descricao: string;
  data_vencimento: string;
  status: 'pendente' | 'paga' | 'vencida';
}

export const useDebts = () => {
  const [debts, setDebts] = useState<Debt[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchDebts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('dividas')
        .select(`
          *,
          cliente:clientes(nome, nuit)
        `)
        .order('data_criacao', { ascending: false });

      if (error) throw error;
      setDebts(data?.map(debt => ({
        ...debt,
        status: debt.status as 'pendente' | 'paga' | 'vencida'
      })) || []);
    } catch (error) {
      console.error('Erro ao buscar dívidas:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as dívidas",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createDebt = async (debtData: DebtFormData) => {
    try {
      const { data, error } = await supabase
        .from('dividas')
        .insert([debtData])
        .select(`
          *,
          cliente:clientes(nome, nuit, email, telefone)
        `)
        .single();

      if (error) throw error;

      const clientName = data.cliente?.nome || 'Cliente';
      const formattedValue = formatCurrency(data.valor);
      const formattedDate = new Date(data.data_vencimento).toLocaleDateString('pt-PT');

      // Atualiza imediatamente a UI
      setDebts(prev => [{
        ...data,
        status: data.status as 'pendente' | 'paga' | 'vencida'
      }, ...prev]);
      
      // Criar notificação in-app
      await createInAppNotification({
        titulo: '💰 Nova Dívida Registada',
        mensagem: `Dívida de ${formattedValue} para ${clientName} com vencimento em ${formattedDate}.`,
        tipo: 'info',
        divida_id: data.id,
        categoria: 'dividas',
      });
      
      return { success: true, data };
    } catch (error: any) {
      console.error('Erro ao criar dívida:', error);
      return { success: false, error };
    }
  };
  const updateDebt = async (id: string, debtData: Partial<DebtFormData>) => {
    try {
      const { data, error } = await supabase
        .from('dividas')
        .update(debtData)
        .eq('id', id)
        .select(`
          *,
          cliente:clientes(nome, nuit)
        `)
        .single();

      if (error) throw error;

      const clientName = data.cliente?.nome || 'Cliente';
      const formattedValue = formatCurrency(data.valor);

      setDebts(prev => prev.map(debt => 
        debt.id === id ? {
          ...data,
          status: data.status as 'pendente' | 'paga' | 'vencida'
        } : debt
      ));
      
      // Criar notificação in-app
      await createInAppNotification({
        titulo: '✏️ Dívida Atualizada',
        mensagem: `A dívida de ${formattedValue} para o cliente ${clientName} foi atualizada.`,
        tipo: 'info',
        divida_id: data.id,
        categoria: 'dividas',
      });
      
      return { success: true, data };
    } catch (error: any) {
      console.error('Erro ao atualizar dívida:', error);
      return { success: false, error };
    }
  };

  const deleteDebt = async (id: string) => {
    try {
      const { error } = await supabase
        .from('dividas')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setDebts(prev => prev.filter(debt => debt.id !== id));
      toast({
        title: "Sucesso",
        description: "Dívida eliminada com sucesso",
      });
      return { success: true };
    } catch (error) {
      console.error('Erro ao eliminar dívida:', error);
      toast({
        title: "Erro",
        description: "Não foi possível eliminar a dívida",
        variant: "destructive",
      });
      return { success: false, error };
    }
  };

  const markAsPaid = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('dividas')
        .update({ 
          status: 'paga',
          data_pagamento: new Date().toISOString()
        })
        .eq('id', id)
        .select(`
          *,
          cliente:clientes(nome, nuit)
        `)
        .single();

      if (error) throw error;

      const clientName = data.cliente?.nome || 'Cliente';
      const formattedValue = formatCurrency(data.valor);

      setDebts(prev => prev.map(debt => 
        debt.id === id ? {
          ...data,
          status: data.status as 'pendente' | 'paga' | 'vencida'
        } : debt
      ));
      
      // Criar notificação in-app
      await createInAppNotification({
        titulo: '✅ Dívida Paga',
        mensagem: `O cliente ${clientName} pagou a dívida de ${formattedValue}.`,
        tipo: 'success',
        divida_id: data.id,
        categoria: 'pagamentos',
      });
      
      toast({
        title: "Sucesso",
        description: "Dívida marcada como paga",
      });
      
      return { success: true, data };
    } catch (error) {
      console.error('Erro ao marcar dívida como paga:', error);
      toast({
        title: "Erro",
        description: "Não foi possível marcar a dívida como paga",
        variant: "destructive",
      });
      return { success: false, error };
    }
  };

  useEffect(() => {
    fetchDebts();

    // Realtime: sincroniza automaticamente INSERT/UPDATE/DELETE em 'dividas'
    const channel = supabase
      .channel('realtime:dividas')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'dividas' }, async (payload) => {
        // Buscar o registo completo com o join do cliente
        const { data } = await supabase
          .from('dividas')
          .select('*, cliente:clientes(nome, nuit)')
          .eq('id', (payload.new as any).id)
          .single();
        if (data) {
          setDebts((prev) => [
            { ...data, status: data.status as 'pendente' | 'paga' | 'vencida' },
            ...prev.filter((d) => d.id !== data.id),
          ].sort((a, b) => new Date(b.data_criacao).getTime() - new Date(a.data_criacao).getTime()));
        }
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'dividas' }, async (payload) => {
        const { data } = await supabase
          .from('dividas')
          .select('*, cliente:clientes(nome, nuit)')
          .eq('id', (payload.new as any).id)
          .single();
        if (data) {
          setDebts((prev) => prev
            .map((d) => d.id === data.id ? { ...data, status: data.status as 'pendente' | 'paga' | 'vencida' } : d)
            .sort((a, b) => new Date(b.data_criacao).getTime() - new Date(a.data_criacao).getTime()));
        }
      })
      .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'dividas' }, (payload) => {
        setDebts((prev) => prev.filter((d) => d.id !== (payload.old as any).id));
      })
      .subscribe();

    // Recarrega quando a aba volta a ficar visível
    const onVisibility = () => {
      if (document.visibilityState === 'visible') {
        fetchDebts();
      }
    };
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      document.removeEventListener('visibilitychange', onVisibility);
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    debts,
    loading,
    createDebt,
    updateDebt,
    deleteDebt,
    markAsPaid,
    refetch: fetchDebts,
  };
};