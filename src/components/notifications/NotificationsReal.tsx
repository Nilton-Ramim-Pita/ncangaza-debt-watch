import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useState, useMemo, useEffect } from "react";
import { useDebts } from "@/hooks/useDebts";
import { useClients } from "@/hooks/useClients";
import { NotificationTemplates } from './NotificationTemplates';
import { NotificationCenter } from './NotificationCenter';
import { NotificationSettings } from './NotificationSettings';
import { toast } from 'sonner';
import { formatCurrency } from "@/utils/currency";
import { supabase } from "@/integrations/supabase/client";
import { openWhatsApp } from '@/utils/notifications';
import { 
  Bell, 
  Mail, 
  Phone,
  CheckCircle,
  AlertTriangle,
  Settings,
  MessageCircle,
  Info
} from "lucide-react";

interface Notification {
  id: string;
  divida_id: string;
  tipo: string;
  status: string;
  mensagem: string;
  data_agendamento: string;
  data_envio: string;
  erro: string;
  created_at: string;
  dividas?: {
    valor: number;
    descricao: string;
    clientes?: {
      nome: string;
      email: string;
    };
  };
}

export const NotificationsReal = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const { debts } = useDebts();
  const { clients } = useClients();

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('notificacoes')
        .select(`
          *,
          dividas (
            valor,
            descricao,
            clientes (
              nome,
              email
            )
          )
        `)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setNotifications(data || []);
    } catch (error) {
      console.error('Erro ao carregar notificações:', error);
      toast.error('Erro ao carregar notificações');
    } finally {
      setLoading(false);
    }
  };

  // Calcula dívidas que precisam de atenção (vencidas ou prestes a vencer)
  const urgentDebts = useMemo(() => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return debts.filter(debt => {
      if (debt.status === 'paga') return false;
      const dueDate = new Date(debt.data_vencimento);
      return dueDate <= tomorrow; // Vencidas ou vencem amanhã
    });
  }, [debts]);

  // Gera mensagem padrão para notificação
  const generateMessage = (debt: any, client: any) => {
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

  // Abre WhatsApp com mensagem pré-formatada
  const handleWhatsAppContact = (debt: any) => {
    const client = clients.find(c => c.id === debt.cliente_id);
    if (!client?.telefone) {
      toast.error('Cliente não possui telefone cadastrado');
      return;
    }

    const message = generateMessage(debt, client);
    openWhatsApp(client.telefone, message);
    toast.success('WhatsApp aberto! Envie a mensagem ao cliente.');
  };

  // Abre cliente de email com mensagem pré-formatada
  const handleEmailContact = (debt: any) => {
    const client = clients.find(c => c.id === debt.cliente_id);
    if (!client?.email) {
      toast.error('Cliente não possui email cadastrado');
      return;
    }

    const message = generateMessage(debt, client);
    const subject = 'Lembrete de Dívida - Ncangaza Multiservices';
    const mailtoLink = `mailto:${client.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
    
    window.location.href = mailtoLink;
    toast.success('Cliente de email aberto!');
  };

  // Copia número de telefone para clipboard
  const handlePhoneContact = (debt: any) => {
    const client = clients.find(c => c.id === debt.cliente_id);
    if (!client?.telefone) {
      toast.error('Cliente não possui telefone cadastrado');
      return;
    }

    navigator.clipboard.writeText(client.telefone);
    toast.success(`Telefone copiado: ${client.telefone}`);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'enviada':
        return <Badge variant="secondary" className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Enviada</Badge>;
      case 'erro':
        return <Badge variant="destructive"><AlertTriangle className="w-3 h-3 mr-1" />Erro</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'email':
        return <Mail className="h-4 w-4 text-blue-500" />;
      case 'in_app':
        return <Bell className="h-4 w-4 text-green-500" />;
      case 'whatsapp':
        return <MessageCircle className="h-4 w-4 text-green-600" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  return (
    <Tabs defaultValue="notifications" className="space-y-6">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="notifications">
          <Bell className="w-4 h-4 mr-2" />
          Notificações
        </TabsTrigger>
        <TabsTrigger value="center">
          <Info className="w-4 h-4 mr-2" />
          Central
        </TabsTrigger>
        <TabsTrigger value="config">
          <Settings className="w-4 h-4 mr-2" />
          Configurações
        </TabsTrigger>
        <TabsTrigger value="templates">
          <Mail className="w-4 h-4 mr-2" />
          Templates
        </TabsTrigger>
      </TabsList>

      <TabsContent value="center" className="space-y-6">
        <NotificationCenter />
      </TabsContent>

      <TabsContent value="config" className="space-y-6">
        <NotificationSettings />
      </TabsContent>

      <TabsContent value="notifications" className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">Dívidas Urgentes</h2>
            <p className="text-muted-foreground">
              Clientes com dívidas vencidas ou a vencer em breve - contacte manualmente
            </p>
          </div>
        </div>

        <Card className="border-yellow-200 bg-yellow-50/50">
          <CardHeader>
            <CardTitle className="flex items-center text-yellow-900">
              <AlertTriangle className="w-5 h-5 mr-2" />
              Dívidas que Precisam de Atenção ({urgentDebts.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {urgentDebts.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                Nenhuma dívida urgente no momento
              </p>
            ) : (
              <div className="space-y-3">
                {urgentDebts.map(debt => {
                  const client = clients.find(c => c.id === debt.cliente_id);
                  if (!client) return null;

                  const dueDate = new Date(debt.data_vencimento);
                  const today = new Date();
                  const isOverdue = dueDate < today;
                  const daysUntilDue = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

                  return (
                    <Card key={debt.id} className={isOverdue ? "border-red-300 bg-red-50/50" : "border-yellow-300"}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h4 className="font-semibold text-lg">{client.nome}</h4>
                            <p className="text-sm text-muted-foreground">{debt.descricao}</p>
                            <div className="flex gap-4 mt-2 text-sm">
                              <span className="font-bold text-foreground">{formatCurrency(Number(debt.valor))}</span>
                              <span className={isOverdue ? "text-red-600 font-medium" : "text-yellow-600"}>
                                {isOverdue 
                                  ? `Venceu há ${Math.abs(daysUntilDue)} dias`
                                  : daysUntilDue === 0
                                    ? 'Vence hoje!'
                                    : `Vence amanhã`
                                }
                              </span>
                            </div>
                            <div className="flex gap-2 mt-2 text-xs text-muted-foreground">
                              {client.telefone && <span>📱 {client.telefone}</span>}
                              {client.email && <span>✉️ {client.email}</span>}
                            </div>
                          </div>
                          <div className="flex flex-col gap-2 ml-4">
                            <Button
                              size="sm"
                              variant="outline"
                              className="gap-2"
                              onClick={() => handleWhatsAppContact(debt)}
                              disabled={!client.telefone}
                            >
                              <MessageCircle className="h-4 w-4" />
                              WhatsApp
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="gap-2"
                              onClick={() => handleEmailContact(debt)}
                              disabled={!client.email}
                            >
                              <Mail className="h-4 w-4" />
                              Email
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="gap-2"
                              onClick={() => handlePhoneContact(debt)}
                              disabled={!client.telefone}
                            >
                              <Phone className="h-4 w-4" />
                              Ligar
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-blue-200 bg-blue-50/50">
          <CardHeader>
            <CardTitle className="flex items-center text-blue-900">
              <Info className="w-5 h-5 mr-2" />
              Como Funciona o Sistema de Notificações
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-blue-900 mb-2">📱 Notificações Internas</h4>
                <p className="text-sm text-muted-foreground">
                  O sistema notifica o administrador quando há dívidas vencidas ou prestes a vencer. 
                  Todas as notificações aparecem na Central de Notificações (ícone de sino no topo).
                </p>
              </div>

              <div className="pt-4 border-t">
                <h4 className="font-semibold text-blue-900 mb-2">✉️ Contacto Manual</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  Para cada dívida urgente, você pode escolher como contactar o cliente:
                </p>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-4">
                  <li><strong>WhatsApp:</strong> Abre o WhatsApp com mensagem pré-formatada para o cliente</li>
                  <li><strong>Email:</strong> Abre seu cliente de email com mensagem pré-formatada</li>
                  <li><strong>Telefone:</strong> Copia o número para você ligar diretamente</li>
                </ul>
              </div>

              <div className="pt-4 border-t">
                <p className="text-xs text-muted-foreground">
                  💡 <strong>Vantagem:</strong> Sem custos de servidores ou configurações complexas. 
                  Você controla quando e como contactar cada cliente!
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Histórico de Contactos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {loading ? (
              <p className="text-center text-muted-foreground">Carregando histórico...</p>
            ) : notifications.length === 0 ? (
              <p className="text-center text-muted-foreground">Nenhum contacto registrado ainda</p>
            ) : (
              <div className="space-y-2">
                {notifications.slice(0, 10).map(notif => (
                  <div key={notif.id} className="flex items-start justify-between p-3 border rounded-lg">
                    <div className="flex items-start gap-3">
                      {getTypeIcon(notif.tipo)}
                      <div>
                        <p className="text-sm font-medium">{notif.mensagem?.slice(0, 80)}...</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(notif.created_at).toLocaleString('pt-MZ')}
                        </p>
                      </div>
                    </div>
                    {getStatusBadge(notif.status)}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="templates" className="space-y-6">
        <NotificationTemplates />
      </TabsContent>
    </Tabs>
  );
};
