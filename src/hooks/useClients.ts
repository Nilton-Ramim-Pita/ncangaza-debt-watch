import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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

      setClients(prev => [...prev, data]);
      toast({
        title: "Sucesso",
        description: "Cliente criado com sucesso",
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
      toast({
        title: "Sucesso",
        description: "Cliente atualizado com sucesso",
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