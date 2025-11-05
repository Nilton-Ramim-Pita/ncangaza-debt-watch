import { Button } from "@/components/ui/button";
import { MessageCircle, Mail, Phone } from "lucide-react";
import { toast } from "sonner";
import { openWhatsApp } from "@/utils/notifications";
import { formatCurrency } from "@/utils/currency";

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

  const handleWhatsApp = () => {
    if (!client.telefone) {
      toast.error('Cliente não possui telefone cadastrado');
      return;
    }
    const message = generateMessage();
    openWhatsApp(client.telefone, message);
    toast.success('WhatsApp aberto! Envie a mensagem ao cliente.');
  };

  const handleEmail = () => {
    if (!client.email) {
      toast.error('Cliente não possui email cadastrado');
      return;
    }
    const message = generateMessage();
    const subject = 'Lembrete de Dívida - Ncangaza Multiservices';
    const mailtoLink = `mailto:${client.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
    window.location.href = mailtoLink;
    toast.success('Cliente de email aberto!');
  };

  const handlePhone = () => {
    if (!client.telefone) {
      toast.error('Cliente não possui telefone cadastrado');
      return;
    }
    navigator.clipboard.writeText(client.telefone);
    toast.success(`Telefone copiado: ${client.telefone}`);
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
