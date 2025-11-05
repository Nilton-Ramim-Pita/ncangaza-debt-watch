import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { createInAppNotification, formatWelcomeMessage } from '@/utils/notifications';

export interface Client {
  id: string;
  nome: string;
  nuit: string | null;
  email: string | null;
  telefone: string | null;
  endereco: string | null;
  ativo: boolean;
  created_at: string;
  updated_at: string;
}

export interface ClientFormData {
  nome: string;
  nuit: string;
  email: string;
  telefone: string;
  endereco: string;
  ativo: boolean;
}

export const useClients = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchClients = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('clientes')
        .select('*')
        .order('nome');

      if (error) throw error;
      setClients(data || []);
    } catch (error) {
      console.error('Erro ao buscar clientes:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os clientes",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createClient = async (clientData: ClientFormData) => {
    try {
      const { data, error } = await supabase
        .from('clientes')
        .insert([clientData])
        .select()
        .single();

      if (error) throw error;

      // Atualiza imediatamente a UI
      setClients(prev => [...prev, data].sort((a, b) => a.nome.localeCompare(b.nome)));
      
      // Garante consistência buscando novamente do servidor
      await fetchClients();
      
      // Criar notificação in-app
      await createInAppNotification({
        titulo: '🆕 Novo Cliente Adicionado',
        mensagem: `O cliente ${data.nome} foi adicionado com sucesso ao sistema.`,
        tipo: 'success',
        categoria: 'clientes',
      });
      
      toast({
        title: "✅ Sucesso",
        description: `Cliente ${data.nome} foi criado com sucesso!`,
      });
      
      return { success: true, data };
    } catch (error) {
      console.error('Erro ao criar cliente:', error);
      toast({
        title: "Erro",
        description: "Não foi possível criar o cliente",
        variant: "destructive",
      });
      return { success: false, error };
    }
  };
  const updateClient = async (id: string, clientData: Partial<ClientFormData>) => {
    try {
      const { data, error } = await supabase
        .from('clientes')
        .update(clientData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setClients(prev => prev.map(client => 
        client.id === id ? data : client
      ));
      
      // Criar notificação in-app de atualização
      await createInAppNotification({
        titulo: '✏️ Cliente Atualizado',
        mensagem: `Os dados do cliente ${data.nome} foram atualizados com sucesso.`,
        tipo: 'info',
        categoria: 'clientes',
      });
      
      toast({
        title: "✅ Sucesso",
        description: `Cliente ${data.nome} atualizado com sucesso!`,
      });
      return { success: true, data };
    } catch (error) {
      console.error('Erro ao atualizar cliente:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o cliente",
        variant: "destructive",
      });
      return { success: false, error };
    }
  };

  const deleteClient = async (id: string) => {
    try {
      const { error } = await supabase
        .from('clientes')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setClients(prev => prev.filter(client => client.id !== id));
      toast({
        title: "Sucesso",
        description: "Cliente eliminado com sucesso",
      });
      return { success: true };
    } catch (error) {
      console.error('Erro ao eliminar cliente:', error);
      toast({
        title: "Erro",
        description: "Não foi possível eliminar o cliente",
        variant: "destructive",
      });
      return { success: false, error };
    }
  };

  useEffect(() => {
    fetchClients();

    // Realtime: atualiza automaticamente quando clientes forem criados/atualizados/excluídos em qualquer lugar do sistema
    const channel = supabase
      .channel('realtime:clientes')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'clientes' }, (payload) => {
        setClients((prev) => {
          const exists = prev.some((c) => c.id === (payload.new as any).id);
          const next = exists ? prev : [...prev, payload.new as Client];
          return next.sort((a, b) => a.nome.localeCompare(b.nome));
        });
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'clientes' }, (payload) => {
        setClients((prev) => prev
          .map((c) => (c.id === (payload.new as any).id ? (payload.new as Client) : c))
          .sort((a, b) => a.nome.localeCompare(b.nome))
        );
      })
      .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'clientes' }, (payload) => {
        setClients((prev) => prev.filter((c) => c.id !== (payload.old as any).id));
      })
      .subscribe();

    // Recarrega quando a aba volta a ficar visível (garante sincronização)
    const onVisibility = () => {
      if (document.visibilityState === 'visible') {
        fetchClients();
      }
    };
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      document.removeEventListener('visibilitychange', onVisibility);
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    clients,
    loading,
    createClient,
    updateClient,
    deleteClient,
    refetch: fetchClients,
  };
};