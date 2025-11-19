import { supabase } from '@/integrations/supabase/client';

export interface CreateNotificationParams {
  titulo: string;
  mensagem: string;
  tipo: 'info' | 'success' | 'warning' | 'error';
  divida_id?: string;
  categoria?: 'sistema' | 'dividas' | 'clientes' | 'pagamentos';
}

/**
 * Cria uma notificação in-app no sistema
 */
export const createInAppNotification = async (params: CreateNotificationParams) => {
  try {
    const { error } = await supabase.from('notificacoes').insert({
      tipo: 'in_app',
      status: 'enviada',
      mensagem: `${params.titulo}\n${params.mensagem}`,
      divida_id: params.divida_id || null,
      data_envio: new Date().toISOString(),
      data_agendamento: new Date().toISOString(),
    });

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Erro ao criar notificação in-app:', error);
    return { success: false, error };
  }
};

/**
 * Copia texto para área de transferência
 */
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Erro ao copiar para área de transferência:', error);
    return false;
  }
};

/**
 * Abre o WhatsApp com mensagem pré-preenchida
 * Prioriza wa.me que é mais confiável e não bloqueado por redes
 */
export const openWhatsApp = (phone: string, message: string) => {
  // Normaliza telefone (apenas dígitos)
  const cleanPhone = phone.replace(/\D/g, '');
  
  // Adiciona código do país se não existir (Moçambique: 258)
  const phoneNumber = cleanPhone.startsWith('258') ? cleanPhone : `258${cleanPhone}`;
  
  // Codifica mensagem para URL
  const encodedMessage = encodeURIComponent(message);
  
  // Detecta se é mobile
  const isMobile = /Android|iPhone|iPad|iPod|IEMobile|Opera Mini/i.test(navigator.userAgent);
  
  // PRIORIDADE 1: wa.me (funciona melhor, menos bloqueado)
  const waLink = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
  
  // PRIORIDADE 2: App nativo mobile
  const mobileLink = `whatsapp://send?phone=${phoneNumber}&text=${encodedMessage}`;
  
  // PRIORIDADE 3: Web WhatsApp (mais bloqueado)
  const webLink = `https://web.whatsapp.com/send?phone=${phoneNumber}&text=${encodedMessage}`;
  
  try {
    if (isMobile) {
      // Mobile: tenta app nativo primeiro, depois wa.me
      const win = window.open(mobileLink, '_blank');
      
      setTimeout(() => {
        if (!win || win.closed || typeof win.closed === 'undefined') {
          window.open(waLink, '_blank');
        }
      }, 1000);
    } else {
      // Desktop: usa wa.me diretamente (mais confiável)
      window.open(waLink, '_blank');
    }
  } catch (error) {
    console.error('Erro ao abrir WhatsApp:', error);
    // Último fallback: copia número e mensagem
    copyToClipboard(`Número: ${phoneNumber}\n\nMensagem:\n${message}`);
  }
};

/**
 * Formata mensagem de notificação de dívida
 */
export const formatDebtNotificationMessage = (
  clientName: string,
  amount: number,
  dueDate: string,
  description: string,
  isOverdue: boolean = false
): string => {
  const formattedAmount = new Intl.NumberFormat('pt-MZ', {
    style: 'currency',
    currency: 'MZN',
  }).format(amount);
  
  const formattedDate = new Date(dueDate).toLocaleDateString('pt-PT', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  if (isOverdue) {
    return `Olá ${clientName},

Gostaríamos de informar que a dívida referente a "${description}" no valor de ${formattedAmount} venceu em ${formattedDate}.

Por favor, entre em contacto connosco o mais breve possível para regularizar a situação.

Atenciosamente,
Equipe Ncangaza Multiservices`;
  } else {
    return `Olá ${clientName},

Este é um lembrete de que possui uma dívida referente a "${description}" no valor de ${formattedAmount} com vencimento em ${formattedDate}.

Por favor, certifique-se de efetuar o pagamento até a data indicada.

Agradecemos a sua atenção.

Atenciosamente,
Equipe Ncangaza Multiservices`;
  }
};

/**
 * Formata mensagem de boas-vindas para novo cliente
 */
export const formatWelcomeMessage = (clientName: string, email?: string): string => {
  return `Bem-vindo(a) à Ncangaza Multiservices, ${clientName}!

O seu cadastro foi realizado com sucesso no nosso sistema de gestão.

${email ? `Confirme o seu email: ${email}` : ''}

Em caso de dúvidas, entre em contacto connosco.

Atenciosamente,
Equipe Ncangaza Multiservices`;
};
