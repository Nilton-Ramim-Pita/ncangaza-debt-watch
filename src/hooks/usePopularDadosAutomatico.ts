import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const usePopularDadosAutomatico = () => {
  const [jaPopulado, setJaPopulado] = useState(false);
  const [verificando, setVerificando] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const verificarEPopular = async () => {
      try {
        // Verificar se já existe o flag no localStorage
        const flagPopulado = localStorage.getItem('dados_teste_populados');
        if (flagPopulado === 'true') {
          setJaPopulado(true);
          setVerificando(false);
          return;
        }

        // Verificar se já existem clientes suficientes na base de dados (pelo menos 20)
        const { count } = await supabase
          .from('clientes')
          .select('*', { count: 'exact', head: true });

        if (count && count >= 20) {
          // Já existem dados suficientes, marcar como populado
          localStorage.setItem('dados_teste_populados', 'true');
          setJaPopulado(true);
          setVerificando(false);
          return;
        }

        // Base de dados vazia, popular automaticamente
        console.log('🚀 Base de dados vazia. Populando automaticamente...');
        
        const { data, error } = await supabase.functions.invoke('popular-dados-teste');

        if (error) {
          console.error('❌ Erro ao popular dados:', error);
          toast({
            title: 'Erro ao popular dados',
            description: error.message,
            variant: 'destructive',
          });
          setVerificando(false);
          return;
        }

        console.log('✅ Dados populados com sucesso:', data);
        
        // Marcar como populado
        localStorage.setItem('dados_teste_populados', 'true');
        setJaPopulado(true);
        
        toast({
          title: '✅ Base de dados populada!',
          description: `${data.clientes} clientes e ${data.dividas} dívidas foram adicionados automaticamente.`,
        });

        // Recarregar a página para mostrar os novos dados
        setTimeout(() => {
          window.location.reload();
        }, 2000);

      } catch (erro) {
        console.error('❌ Erro fatal:', erro);
        toast({
          title: 'Erro',
          description: 'Erro ao verificar/popular base de dados',
          variant: 'destructive',
        });
      } finally {
        setVerificando(false);
      }
    };

    verificarEPopular();
  }, [toast]);

  return { jaPopulado, verificando };
};
