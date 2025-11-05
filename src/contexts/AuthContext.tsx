import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Interface para o perfil do utilizador
interface Perfil {
  id: string;
  user_id: string;
  full_name: string;
  active: boolean;
  created_at: string;
  updated_at: string;
  created_by?: string;
  avatar_url?: string;
  telefone?: string;
  cargo?: string;
  departamento?: string;
  bio?: string;
  email_notifications?: boolean;
  sms_notifications?: boolean;
  whatsapp_notifications?: boolean;
}

// Interface para a função do utilizador
interface FuncaoUtilizador {
  user_id: string;
  role: 'admin' | 'user';
}

// Interface do contexto de autenticação
interface ContextoAutenticacao {
  // Propriedades em português
  utilizador: User | null;
  perfil: Perfil | null;
  sessao: Session | null;
  carregando: boolean;
  iniciarSessao: (email: string, senha: string) => Promise<{ erro: any }>;
  terminarSessao: () => Promise<void>;
  ehAdmin: boolean;
  funcaoUtilizador: 'admin' | 'user' | null;
  // Manter compatibilidade com código existente em inglês
  user: User | null;
  profile: Perfil | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, senha: string) => Promise<{ erro: any }>;
  signOut: () => Promise<void>;
  isAdmin: boolean;
  userRole: 'admin' | 'user' | null;
}

const ContextoAutenticacao = createContext<ContextoAutenticacao | undefined>(undefined);

export const useAuth = () => {
  const contexto = useContext(ContextoAutenticacao);
  if (contexto === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return contexto;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [utilizador, setUtilizador] = useState<User | null>(null);
  const [perfil, setPerfil] = useState<Perfil | null>(null);
  const [sessao, setSessao] = useState<Session | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [funcaoUtilizador, setFuncaoUtilizador] = useState<'admin' | 'user' | null>(null);

  const buscarPerfil = async (idUtilizador: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', idUtilizador)
        .single();

      if (error) {
        // Se o perfil não existir, criar um
        if (error.code === 'PGRST116') {
          await criarPerfil(idUtilizador);
          return;
        }
        console.error('Erro ao buscar perfil:', error);
        return;
      }

      setPerfil(data);
      
      // Buscar função do utilizador separadamente
      const { data: dadosFuncao } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', idUtilizador)
        .single();
      
      setFuncaoUtilizador(dadosFuncao?.role || 'user');
    } catch (erro) {
      console.error('Erro ao buscar perfil:', erro);
    }
  };

  const criarPerfil = async (idUtilizador: string) => {
    try {
      const { data: dadosUtilizador } = await supabase.auth.getUser();
      const nomeCompleto = dadosUtilizador.user?.user_metadata?.full_name || dadosUtilizador.user?.email || 'Utilizador';
      
      const { data, error } = await supabase
        .from('profiles')
        .insert({
          user_id: idUtilizador,
          full_name: nomeCompleto,
          active: true
        })
        .select()
        .single();

      if (error) {
        console.error('Erro ao criar perfil:', error);
        return;
      }

      setPerfil(data);
      setFuncaoUtilizador('user'); // Função padrão
    } catch (erro) {
      console.error('Erro ao criar perfil:', erro);
    }
  };

  useEffect(() => {
    // Configurar listener do estado de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (evento, sessao) => {
        setSessao(sessao);
        setUtilizador(sessao?.user ?? null);
        
        if (sessao?.user) {
          setPerfil(null);
          // Usar setTimeout para adiar chamadas do Supabase e prevenir deadlock
          setTimeout(() => {
            buscarPerfil(sessao.user.id);
          }, 0);
        } else {
          setPerfil(null);
        }
        
        setCarregando(false);
      }
    );

    // Verificar sessão existente
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSessao(session);
      setUtilizador(session?.user ?? null);
      
      if (session?.user) {
        buscarPerfil(session.user.id);
      } else {
        setCarregando(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const iniciarSessao = async (email: string, senha: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password: senha,
      });

      if (error) {
        // Mensagens de erro mais amigáveis em português
        const mensagemErro = 
          error.message.includes('Invalid login credentials') ? 'Email ou senha incorretos. Tente novamente.' :
          error.message.includes('Email not confirmed') ? 'Por favor, confirme seu email antes de fazer login.' :
          error.message.includes('User not found') ? 'Utilizador não encontrado.' :
          `Erro ao fazer login: ${error.message}`;
        
        toast.error(mensagemErro);
      } else {
        // Registar atividade de login
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            await supabase.functions.invoke('log-login', {
              body: {
                userId: user.id,
                ipAddress: 'N/A', // Numa aplicação real, obteria isso da requisição
                userAgent: navigator.userAgent,
              },
            });
          }
        } catch (erroLog) {
          console.error('Erro ao registar login:', erroLog);
          // Não falhar o login se o registo falhar
        }
        
        toast.success('Login realizado com sucesso!');
      }

      return { erro: error };
    } catch (erro) {
      toast.error('Erro inesperado ao fazer login');
      return { erro };
    }
  };

  const terminarSessao = async () => {
    try {
      await supabase.auth.signOut();
      setUtilizador(null);
      setPerfil(null);
      setSessao(null);
      setFuncaoUtilizador(null);
      toast.success('Logout realizado com sucesso!');
    } catch (erro) {
      toast.error('Erro ao fazer logout');
    }
  };

  const ehAdmin = funcaoUtilizador === 'admin';

  const valor = {
    utilizador,
    perfil,
    sessao,
    carregando,
    iniciarSessao,
    terminarSessao,
    ehAdmin,
    funcaoUtilizador,
    // Manter compatibilidade com código existente
    user: utilizador,
    profile: perfil,
    session: sessao,
    loading: carregando,
    signIn: iniciarSessao,
    signOut: terminarSessao,
    isAdmin: ehAdmin,
    userRole: funcaoUtilizador,
  };

  return <ContextoAutenticacao.Provider value={valor}>{children}</ContextoAutenticacao.Provider>;
};