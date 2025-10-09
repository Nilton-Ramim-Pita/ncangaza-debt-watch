import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useState, useMemo, useEffect } from "react";
import { useDebts } from "@/hooks/useDebts";
import { useClients } from "@/hooks/useClients";
import { NotificationTemplates } from './NotificationTemplates';
import { toast } from 'sonner';
import { formatCurrency } from "@/utils/currency";
import { supabase } from "@/integrations/supabase/client";
import { 
  Bell, 
  Mail, 
  Calendar,
  CheckCircle,
  Clock,
  AlertTriangle,
  Send,
  Settings,
  Loader2
} from "lucide-react";

interface NotificationSettings {
  emailEnabled: boolean;
  reminderDays: number;
  autoSend: boolean;
}

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
  const [settings, setSettings] = useState<NotificationSettings>({
    emailEnabled: true,
    reminderDays: 3,
    autoSend: false
  });
  
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [customMessage, setCustomMessage] = useState("");
  
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

  const notificationsSummary = useMemo(() => {
    const today = new Date().toDateString();
    const todayNotifications = notifications.filter(n => 
      new Date(n.created_at).toDateString() === today
    );
    
    const successRate = notifications.length > 0 
      ? (notifications.filter(n => n.status === 'enviada').length / notifications.length * 100).toFixed(1)
      : '0';

    return {
      todayCount: todayNotifications.length,
      successRate,
    };
  }, [notifications]);

  const overdueDebts = useMemo(() => {
    const today = new Date();
    const reminderDate = new Date();
    reminderDate.setDate(today.getDate() + settings.reminderDays);

    return debts.filter(debt => {
      if (debt.status !== 'vencida' && debt.status !== 'pendente') return false;
      const dueDate = new Date(debt.data_vencimento);
      return dueDate <= reminderDate;
    });
  }, [debts, settings.reminderDays]);

  const generateDefaultMessage = (debt: any, client: any) => {
    const dueDate = new Date(debt.data_vencimento).toLocaleDateString('pt-MZ');
    const today = new Date();
    const due = new Date(debt.data_vencimento);
    const isOverdue = due < today;
    
    if (isOverdue) {
      return `Caro(a) ${client.nome}, a sua dívida de ${formatCurrency(Number(debt.valor))} venceu em ${dueDate}. Por favor, entre em contacto connosco para regularizar a situação.`;
    } else {
      return `Caro(a) ${client.nome}, lembramos que a sua dívida de ${formatCurrency(Number(debt.valor))} vence em ${dueDate}. Agradecemos a atenção.`;
    }
  };

  const sendNotification = async (debt: any, type: 'email' | 'in_app') => {
    try {
      const client = clients.find(c => c.id === debt.cliente_id);
      if (!client) return;

      const message = customMessage || generateDefaultMessage(debt, client);

      if (type === 'email' && client.email) {
        const { error } = await supabase.functions.invoke('send-email', {
          body: {
            to: client.email,
            subject: 'Aviso de Dívida Vencida',
            message: message,
          },
        });

        if (error) throw error;

        await supabase.from('notificacoes').insert({
          divida_id: debt.id,
          tipo: 'email',
          status: 'enviada',
          mensagem: message,
          data_envio: new Date().toISOString(),
          data_agendamento: new Date().toISOString(),
        });

        toast.success('Email enviado com sucesso!');
      } else if (type === 'in_app') {
        await supabase.from('notificacoes').insert({
          divida_id: debt.id,
          tipo: 'in_app',
          status: 'enviada',
          mensagem: message,
          data_envio: new Date().toISOString(),
          data_agendamento: new Date().toISOString(),
        });

        toast.success('Notificação in-app criada!');
      }

      loadNotifications();
    } catch (error: any) {
      console.error('Erro ao enviar notificação:', error);
      toast.error('Erro ao enviar notificação');
      
      await supabase.from('notificacoes').insert({
        divida_id: debt.id,
        tipo: type,
        status: 'erro',
        mensagem: customMessage || '',
        erro: error.message,
        data_agendamento: new Date().toISOString(),
      });
    }
  };

  const sendBulkNotifications = async () => {
    if (overdueDebts.length === 0) {
      toast.info('Não há dívidas vencidas para notificar');
      return;
    }

    setSending(true);
    let successCount = 0;

    try {
      for (const debt of overdueDebts) {
        const client = clients.find(c => c.id === debt.cliente_id);
        if (!client) continue;

        if (settings.emailEnabled && client.email) {
          await sendNotification(debt, 'email');
          successCount++;
        }

        await sendNotification(debt, 'in_app');
        successCount++;

        await new Promise(resolve => setTimeout(resolve, 500));
      }

      toast.success(`${successCount} notificações enviadas com sucesso!`);
    } catch (error) {
      console.error('Erro ao enviar notificações em massa:', error);
      toast.error('Erro ao enviar notificações em massa');
    } finally {
      setSending(false);
      loadNotifications();
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'enviada':
        return <Badge variant="secondary" className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Enviada</Badge>;
      case 'pendente':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800"><Clock className="w-3 h-3 mr-1" />Pendente</Badge>;
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
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  return (
    <Tabs defaultValue="notifications" className="space-y-6">
      <TabsList>
        <TabsTrigger value="notifications">Notificações</TabsTrigger>
        <TabsTrigger value="templates">Templates</TabsTrigger>
      </TabsList>

      <TabsContent value="notifications" className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">Notificações Automáticas</h2>
            <p className="text-muted-foreground">
              Configure e envie notificações para clientes com dívidas vencidas
            </p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Notificações Hoje</CardTitle>
              <Bell className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{notificationsSummary.todayCount}</div>
              <p className="text-xs text-muted-foreground">enviadas hoje</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Taxa de Sucesso</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{notificationsSummary.successRate}%</div>
              <p className="text-xs text-muted-foreground">de entrega</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Próximos Envios</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{overdueDebts.length}</div>
              <p className="text-xs text-muted-foreground">dívidas pendentes</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Settings className="w-5 h-5 mr-2" />
              Configurações de Notificação
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Email</Label>
                    <p className="text-sm text-muted-foreground">Enviar notificações por email</p>
                  </div>
                  <Switch 
                    checked={settings.emailEnabled}
                    onCheckedChange={(checked) => setSettings({ ...settings, emailEnabled: checked })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="in-app-enabled" className="flex items-center gap-2 cursor-pointer">
                    <Bell className="h-4 w-4" />
                    Notificações In-App
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Notificações visíveis dentro do sistema (sempre ativo)
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="reminderDays">Dias de Antecedência</Label>
                  <Input
                    id="reminderDays"
                    type="number"
                    min="1"
                    max="30"
                    value={settings.reminderDays}
                    onChange={(e) => setSettings({ ...settings, reminderDays: parseInt(e.target.value) || 3 })}
                  />
                  <p className="text-sm text-muted-foreground">
                    Notificar {settings.reminderDays} dias antes do vencimento
                  </p>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="customMessage">Mensagem Personalizada</Label>
                  <Textarea
                    id="customMessage"
                    value={customMessage}
                    onChange={(e) => setCustomMessage(e.target.value)}
                    placeholder="Deixe vazio para usar mensagem padrão..."
                    rows={3}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center mt-6 pt-6 border-t">
              <div>
                <p className="text-sm font-medium">Envio em Lote</p>
                <p className="text-sm text-muted-foreground">
                  {overdueDebts.length} dívidas precisam de notificação
                </p>
              </div>
              <Button 
                onClick={sendBulkNotifications}
                disabled={sending || overdueDebts.length === 0}
              >
                {sending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                <Send className="w-4 h-4 mr-2" />
                {sending ? "Enviando..." : "Enviar Todas"}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Histórico de Notificações</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8 flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : notifications.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Nenhuma notificação encontrada</p>
              </div>
            ) : (
              <div className="space-y-4">
                {notifications.map((notification) => (
                  <div key={notification.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="text-muted-foreground">
                        {getTypeIcon(notification.tipo)}
                      </div>
                      <div>
                        <p className="font-medium">
                          {notification.dividas?.clientes?.nome || 'Cliente desconhecido'}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {notification.mensagem?.substring(0, 60)}...
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {notification.data_envio 
                            ? new Date(notification.data_envio).toLocaleString('pt-MZ')
                            : 'Pendente'}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      {getStatusBadge(notification.status)}
                      <p className="text-xs text-muted-foreground mt-1">
                        {notification.tipo.toUpperCase()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="templates">
        <NotificationTemplates />
      </TabsContent>
    </Tabs>
  );
};
