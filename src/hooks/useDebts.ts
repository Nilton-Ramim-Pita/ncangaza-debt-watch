import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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
          cliente:clientes(nome, nuit)
        `)
        .single();

      if (error) throw error;

      setDebts(prev => [{
        ...data,
        status: data.status as 'pendente' | 'paga' | 'vencida'
      }, ...prev]);
      toast({
        title: "Sucesso",
        description: "Dívida criada com sucesso",
      });
      return { success: true, data };
    } catch (error) {
      console.error('Erro ao criar dívida:', error);
      toast({
        title: "Erro",
        description: "Não foi possível criar a dívida",
        variant: "destructive",
      });
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

      setDebts(prev => prev.map(debt => 
        debt.id === id ? {
          ...data,
          status: data.status as 'pendente' | 'paga' | 'vencida'
        } : debt
      ));
      toast({
        title: "Sucesso",
        description: "Dívida atualizada com sucesso",
      });
      return { success: true, data };
    } catch (error) {
      console.error('Erro ao atualizar dívida:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar a dívida",
        variant: "destructive",
      });
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

      setDebts(prev => prev.map(debt => 
        debt.id === id ? {
          ...data,
          status: data.status as 'pendente' | 'paga' | 'vencida'
        } : debt
      ));
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