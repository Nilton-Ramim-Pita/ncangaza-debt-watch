import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState, useMemo, useEffect } from "react";
import { useDebts } from "@/hooks/useDebts";
import { useClients } from "@/hooks/useClients";
import { useToast } from "@/hooks/use-toast";
import { formatCurrency } from "@/utils/currency";
import { supabase } from "@/integrations/supabase/client";
import { 
  Bell, 
  Mail, 
  MessageSquare, 
  Phone,
  Calendar,
  CheckCircle,
  Clock,
  AlertTriangle,
  Send,
  Settings
} from "lucide-react";

interface NotificationSettings {
  emailEnabled: boolean;
  smsEnabled: boolean;
  whatsappEnabled: boolean;
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
}

export const NotificationsReal = () => {
  const [settings, setSettings] = useState<NotificationSettings>({
    emailEnabled: true,
    smsEnabled: false,
    whatsappEnabled: false,
    reminderDays: 3,
    autoSend: false
  });
  
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [customMessage, setCustomMessage] = useState("");
  
  const { debts } = useDebts();
  const { clients } = useClients();
  const { toast } = useToast();

  // Load notifications from database
  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('notificacoes')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setNotifications(data || []);
    } catch (error) {
      console.error('Erro ao carregar notificações:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar notificações",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Calculate notifications summary
  const notificationsSummary = useMemo(() => {
    const today = new Date().toDateString();
    const todayNotifications = notifications.filter(n => 
      new Date(n.created_at).toDateString() === today
    );
    
    const successRate = notifications.length > 0 
      ? (notifications.filter(n => n.status === 'enviada').length / notifications.length * 100).toFixed(1)
      : '0';

    const nextSend = debts
      .filter(debt => debt.status === 'pendente')
      .sort((a, b) => new Date(a.data_vencimento).getTime() - new Date(b.data_vencimento).getTime())
      .slice(0, 5);

    return {
      todayCount: todayNotifications.length,
      successRate,
      nextSend
    };
  }, [notifications, debts]);

  // Get overdue debts that need notification
  const overdueDebts = useMemo(() => {
    const today = new Date();
    const reminderDate = new Date();
    reminderDate.setDate(today.getDate() + settings.reminderDays);

    return debts.filter(debt => {
      if (debt.status !== 'pendente') return false;
      const dueDate = new Date(debt.data_vencimento);
      return dueDate <= reminderDate;
    });
  }, [debts, settings.reminderDays]);

  const sendNotification = async (debtId: string, type: 'email' | 'sms' | 'whatsapp', message?: string) => {
    try {
      setSending(true);
      
      const defaultMessage = message || generateDefaultMessage(debtId);
      
      const { error } = await supabase
        .from('notificacoes')
        .insert({
          divida_id: debtId,
          tipo: type,
          status: 'pendente',
          mensagem: defaultMessage,
          data_agendamento: new Date().toISOString(),
        });

      if (error) throw error;

      // Simulate sending (in real implementation, this would call an API)
      setTimeout(async () => {
        const { error: updateError } = await supabase
          .from('notificacoes')
          .update({ 
            status: 'enviada',
            data_envio: new Date().toISOString()
          })
          .eq('divida_id', debtId)
          .eq('tipo', type)
          .eq('status', 'pendente');

        if (!updateError) {
          toast({
            title: "Notificação enviada",
            description: `Notificação ${type} enviada com sucesso!`,
          });
          loadNotifications();
        }
      }, 2000);

    } catch (error) {
      console.error('Erro ao enviar notificação:', error);
      toast({
        title: "Erro",
        description: "Erro ao enviar notificação",
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  };

  const generateDefaultMessage = (debtId: string) => {
    const debt = debts.find(d => d.id === debtId);
    const client = debt ? clients.find(c => c.id === debt.cliente_id) : null;
    
    if (!debt || !client) return "Lembrete de pagamento";

    const dueDate = new Date(debt.data_vencimento).toLocaleDateString('pt-MZ');
    const today = new Date();
    const due = new Date(debt.data_vencimento);
    const isOverdue = due < today;
    
    if (isOverdue) {
      return `Caro(a) ${client.nome}, a sua dívida de ${formatCurrency(Number(debt.valor))} venceu em ${dueDate}. Por favor, entre em contacto connosco para regularizar a situação. Ncangaza Multiservices`;
    } else {
      return `Caro(a) ${client.nome}, lembramos que a sua dívida de ${formatCurrency(Number(debt.valor))} vence em ${dueDate}. Agradecemos a atenção. Ncangaza Multiservices`;
    }
  };

  const sendBulkNotifications = async () => {
    if (overdueDebts.length === 0) {
      toast({
        title: "Informação",
        description: "Não há dívidas pendentes para notificar",
      });
      return;
    }

    setSending(true);
    
    for (const debt of overdueDebts) {
      if (settings.emailEnabled) {
        await sendNotification(debt.id, 'email', customMessage);
      }
      if (settings.smsEnabled) {
        await sendNotification(debt.id, 'sms', customMessage);
      }
      if (settings.whatsappEnabled) {
        await sendNotification(debt.id, 'whatsapp', customMessage);
      }
    }

    toast({
      title: "Notificações enviadas",
      description: `${overdueDebts.length} notificações foram programadas para envio`,
    });
    
    setSending(false);
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
        return <Mail className="w-4 h-4" />;
      case 'sms':
        return <Phone className="w-4 h-4" />;
      case 'whatsapp':
        return <MessageSquare className="w-4 h-4" />;
      default:
        return <Bell className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-foreground">Notificações</h2>
        <p className="text-muted-foreground">
          Sistema de notificações automáticas da Ncangaza Multiservices
        </p>
      </div>

      {/* Summary Cards */}
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

      {/* Notification Settings */}
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
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, emailEnabled: checked }))}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">SMS</Label>
                  <p className="text-sm text-muted-foreground">Enviar notificações por SMS</p>
                </div>
                <Switch 
                  checked={settings.smsEnabled}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, smsEnabled: checked }))}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">WhatsApp</Label>
                  <p className="text-sm text-muted-foreground">Enviar notificações por WhatsApp</p>
                </div>
                <Switch 
                  checked={settings.whatsappEnabled}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, whatsappEnabled: checked }))}
                />
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
                  onChange={(e) => setSettings(prev => ({ ...prev, reminderDays: parseInt(e.target.value) || 3 }))}
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
              <Send className="w-4 h-4 mr-2" />
              {sending ? "Enviando..." : "Enviar Todas"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Notifications History */}
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Notificações</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Carregando notificações...</p>
            </div>
          ) : notifications.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Nenhuma notificação encontrada</p>
            </div>
          ) : (
            <div className="space-y-4">
              {notifications.map((notification) => {
                const debt = debts.find(d => d.id === notification.divida_id);
                const client = debt ? clients.find(c => c.id === debt.cliente_id) : null;
                
                return (
                  <div key={notification.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="text-muted-foreground">
                        {getTypeIcon(notification.tipo)}
                      </div>
                      <div>
                        <p className="font-medium">
                          {client?.nome || 'Cliente não encontrado'}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {debt ? formatCurrency(Number(debt.valor)) : 'Dívida não encontrada'}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(notification.created_at).toLocaleString('pt-MZ')}
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
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};