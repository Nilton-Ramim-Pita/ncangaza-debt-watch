import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Stats {
  totalClients: number;
  totalDebts: number;
  totalValue: number;
  pendingValue: number;
  overdueValue: number;
  paidValue: number;
  pendingCount: number;
  overdueCount: number;
  paidCount: number;
}

export const useStats = () => {
  const [stats, setStats] = useState<Stats>({
    totalClients: 0,
    totalDebts: 0,
    totalValue: 0,
    pendingValue: 0,
    overdueValue: 0,
    paidValue: 0,
    pendingCount: 0,
    overdueCount: 0,
    paidCount: 0,
  });
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      setLoading(true);
      
      // Buscar total de clientes
      const { count: clientsCount } = await supabase
        .from('clientes')
        .select('*', { count: 'exact', head: true });

      // Buscar estatísticas das dívidas
      const { data: debtsData } = await supabase
        .from('dividas')
        .select('valor, status, data_vencimento');

      if (debtsData) {
        const today = new Date();
        let totalValue = 0;
        let pendingValue = 0;
        let overdueValue = 0;
        let paidValue = 0;
        let pendingCount = 0;
        let overdueCount = 0;
        let paidCount = 0;

        debtsData.forEach(debt => {
          const value = Number(debt.valor);
          totalValue += value;

          if (debt.status === 'paga') {
            paidValue += value;
            paidCount++;
          } else if (debt.status === 'vencida' || (debt.status === 'pendente' && new Date(debt.data_vencimento) < today)) {
            overdueValue += value;
            overdueCount++;
          } else {
            pendingValue += value;
            pendingCount++;
          }
        });

        setStats({
          totalClients: clientsCount || 0,
          totalDebts: debtsData.length,
          totalValue,
          pendingValue,
          overdueValue,
          paidValue,
          pendingCount,
          overdueCount,
          paidCount,
        });
      }
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return {
    stats,
    loading,
    refetch: fetchStats,
  };
};