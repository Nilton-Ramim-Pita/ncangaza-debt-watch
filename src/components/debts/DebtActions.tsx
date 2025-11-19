import { Button } from "@/components/ui/button";
import { MessageCircle, Mail, Phone } from "lucide-react";
import { toast } from "sonner";
import { openWhatsApp } from "@/utils/notifications";
import { formatCurrency } from "@/utils/currency";
import { supabase } from "@/integrations/supabase/client";

interface DebtActionsProps {
  debt: any;
  client: any;
}

export const DebtActions = ({ debt, client }: DebtActionsProps) => {
  const generateMessage = () => {
    const dueDate = new Date(debt.data_vencimento).toLocaleDateString('pt-MZ');
    const today = new Date();
    const due = new Date(debt.data_vencimento);
    const isOverdue = due < today;
    
    if (isOverdue) {
      return `Caro(a) ${client.nome}, a sua dívida de ${formatCurrency(Number(debt.valor))} venceu em ${dueDate}. Por favor, entre em contacto connosco para regularizar a situação.\n\nDescrição: ${debt.descricao}\n\nNcangaza Multiservices`;
    } else {
      return `Caro(a) ${client.nome}, lembramos que a sua dívida de ${formatCurrency(Number(debt.valor))} vence em ${dueDate}. Agradecemos a atenção.\n\nDescrição: ${debt.descricao}\n\nNcangaza Multiservices`;
    }
  };

  const handleWhatsApp = async () => {
    if (!client.telefone) {
      toast.error('Cliente não possui telefone cadastrado');
      return;
    }
    const message = generateMessage();
    openWhatsApp(client.telefone, message);
    
    // Registra notificação in-app
    try {
      await supabase.from('notificacoes').insert({
        tipo: 'whatsapp',
        status: 'enviada',
        mensagem: `WhatsApp enviado para ${client.nome}: ${message}`,
        divida_id: debt.id,
        data_envio: new Date().toISOString(),
        data_agendamento: new Date().toISOString(),
        cliente_id: client.id
      });
    } catch (error) {
      console.error('Erro ao registrar notificação:', error);
    }
    
    toast.success('WhatsApp aberto! Mensagem registrada.');
  };

  const handleEmail = async () => {
    if (!client.email) {
      toast.error('Cliente não possui email cadastrado');
      return;
    }
    const message = generateMessage();
    const subject = 'Lembrete de Dívida - Ncangaza Multiservices';
    
    try {
      toast.loading('Enviando email...');
      
      const { data, error } = await supabase.functions.invoke('send-email', {
        body: {
          to: client.email,
          subject: subject,
          message: message
        }
      });

      if (error) throw error;

      // Registra notificação in-app
      await supabase.from('notificacoes').insert({
        tipo: 'email',
        status: 'enviada',
        mensagem: `Email enviado para ${client.nome} (${client.email}): ${subject}`,
        divida_id: debt.id,
        data_envio: new Date().toISOString(),
        data_agendamento: new Date().toISOString(),
        cliente_id: client.id
      });
      
      toast.dismiss();
      toast.success('Email enviado com sucesso!');
    } catch (error) {
      console.error('Erro ao enviar email:', error);
      toast.dismiss();
      toast.error('Erro ao enviar email. Tente novamente.');
    }
  };

  const handlePhone = async () => {
    if (!client.telefone) {
      toast.error('Cliente não possui telefone cadastrado');
      return;
    }
    
    // Abre o app de chamadas
    window.location.href = `tel:${client.telefone}`;
    
    // Registra notificação in-app
    try {
      await supabase.from('notificacoes').insert({
        tipo: 'in_app',
        status: 'enviada',
        mensagem: `Chamada iniciada para ${client.nome} (${client.telefone})`,
        divida_id: debt.id,
        data_envio: new Date().toISOString(),
        data_agendamento: new Date().toISOString(),
        cliente_id: client.id
      });
    } catch (error) {
      console.error('Erro ao registrar notificação:', error);
    }
    
    toast.success(`Ligando para ${client.telefone}...`);
  };

  return (
    <div className="flex gap-2">
      <Button
        size="sm"
        variant="outline"
        onClick={handleWhatsApp}
        disabled={!client.telefone}
        title="Enviar mensagem WhatsApp"
      >
        <MessageCircle className="h-4 w-4" />
      </Button>
      <Button
        size="sm"
        variant="outline"
        onClick={handleEmail}
        disabled={!client.email}
        title="Enviar email"
      >
        <Mail className="h-4 w-4" />
      </Button>
      <Button
        size="sm"
        variant="outline"
        onClick={handlePhone}
        disabled={!client.telefone}
        title="Copiar telefone"
      >
        <Phone className="h-4 w-4" />
      </Button>
    </div>
  );
};
