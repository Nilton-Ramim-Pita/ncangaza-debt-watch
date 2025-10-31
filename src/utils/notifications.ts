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
 * Gera link do WhatsApp Click to Chat
 */
export const generateWhatsAppLink = (phone: string, message: string): string => {
  // Normaliza telefone (apenas dígitos)
  const cleanPhone = phone.replace(/\D/g, '');
  
  // Adiciona código do país se não existir (Moçambique: 258)
  const phoneNumber = cleanPhone.startsWith('258') ? cleanPhone : `258${cleanPhone}`;
  
  // Codifica mensagem para URL
  const encodedMessage = encodeURIComponent(message);
  
  // Detecta se é mobile para usar link adequado
  const isMobile = /Android|iPhone|iPad|iPod|IEMobile|Opera Mini/i.test(navigator.userAgent);
  
  if (isMobile) {
    return `whatsapp://send?phone=${phoneNumber}&text=${encodedMessage}`;
  } else {
    return `https://web.whatsapp.com/send?phone=${phoneNumber}&text=${encodedMessage}`;
  }
};

/**
 * Abre o WhatsApp com mensagem pré-preenchida
 */
export const openWhatsApp = (phone: string, message: string) => {
  const link = generateWhatsAppLink(phone, message);
  const fallbackLink = `https://wa.me/${phone.replace(/\D/g, '').startsWith('258') ? phone.replace(/\D/g, '') : '258' + phone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
  
  const win = window.open(link, '_blank');
  
  // Fallback se o navegador bloquear o popup
  if (!win || win.closed || typeof win.closed === 'undefined') {
    window.open(fallbackLink, '_blank');
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
