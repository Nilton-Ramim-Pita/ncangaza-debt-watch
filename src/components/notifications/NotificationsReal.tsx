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
import { NotificationCenter } from './NotificationCenter';
import { toast } from 'sonner';
import { formatCurrency } from "@/utils/currency";
import { supabase } from "@/integrations/supabase/client";
import { openWhatsApp, generateWhatsAppLink } from '@/utils/notifications';
import { 
  Bell, 
  Mail, 
  Calendar,
  CheckCircle,
  Clock,
  AlertTriangle,
  Send,
  Settings,
  Loader2,
  MessageCircle,
  Info
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
  const [testEmail, setTestEmail] = useState("");
  const [testingSend, setTestingSend] = useState(false);
  const [testPhone, setTestPhone] = useState("");
  const [whatsappSettings, setWhatsappSettings] = useState({
    enabled: true,
  });
  
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

        if (whatsappSettings.enabled && client.telefone) {
          const message = customMessage || generateDefaultMessage(debt, client);
          sendWhatsApp(client.telefone, message, debt.id);
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
      case 'whatsapp':
        return <MessageCircle className="h-4 w-4 text-green-600" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const sendWhatsApp = (phone: string, message: string, debtId?: string) => {
    if (!phone) {
      toast.error('Cliente não possui número de telefone cadastrado');
      return;
    }

    // Registrar no banco antes de abrir WhatsApp
    if (debtId) {
      (async () => {
        try {
          await supabase.from('notificacoes').insert({
            divida_id: debtId,
            tipo: 'whatsapp',
            status: 'enviada',
            mensagem: message,
            data_envio: new Date().toISOString(),
            data_agendamento: new Date().toISOString(),
          });
          loadNotifications();
        } catch (error) {
          console.error('Erro ao registrar notificação WhatsApp:', error);
        }
      })();
    }

    // Abrir WhatsApp com mensagem
    openWhatsApp(phone, message);
    toast.success('✅ WhatsApp aberto! Envie a mensagem para o cliente.');
  };

  const sendWhatsAppNotification = async (debt: any) => {
    try {
      const client = clients.find(c => c.id === debt.cliente_id);
      if (!client) return;

      if (!client.telefone) {
        toast.error(`Cliente ${client.nome} não possui telefone cadastrado`);
        return;
      }

      const message = customMessage || generateDefaultMessage(debt, client);
      sendWhatsApp(client.telefone, message, debt.id);
    } catch (error: any) {
      console.error('Erro ao enviar WhatsApp:', error);
      toast.error('Erro ao abrir WhatsApp');
    }
  };

  const sendTestWhatsApp = () => {
    if (!testPhone) {
      toast.error('Por favor, insira um número para teste');
      return;
    }

    const message = `*Teste de Notificacao WhatsApp*\n\nOla! Este e um teste do Sistema de Gestao de Dividas da Ncangaza Multiservices.\n\nSe voce recebeu esta mensagem, significa que a integracao Click to Chat esta funcionando!\n\nData/Hora: ${new Date().toLocaleString('pt-MZ')}\n\nEsta e uma mensagem de teste automatica.`;
    
    sendWhatsApp(testPhone, message);
  };

  const sendTestEmail = async () => {
    if (!testEmail) {
      toast.error('Por favor, insira um email para teste');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(testEmail)) {
      toast.error('Email inválido');
      return;
    }

    setTestingSend(true);
    try {
      const { error } = await supabase.functions.invoke('send-email', {
        body: {
          to: testEmail,
          subject: 'Teste de Email - Sistema de Dívidas',
          message: `Este é um email de teste do Sistema de Gestão de Dívidas da Ncangaza Multiservices.\n\nSe você recebeu este email, significa que a integração com Resend está funcionando corretamente!\n\nData/Hora: ${new Date().toLocaleString('pt-MZ')}`,
        },
      });

      if (error) throw error;

      toast.success('Email de teste enviado com sucesso!');
      setTestEmail('');
    } catch (error: any) {
      console.error('Erro ao enviar email de teste:', error);
      toast.error(`Erro ao enviar email: ${error.message || 'Erro desconhecido'}`);
    } finally {
      setTestingSend(false);
    }
  };

  return (
    <Tabs defaultValue="notifications" className="space-y-6">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="notifications">
          <Bell className="w-4 h-4 mr-2" />
          Notificações
        </TabsTrigger>
        <TabsTrigger value="center">
          <Info className="w-4 h-4 mr-2" />
          Central
        </TabsTrigger>
        <TabsTrigger value="templates">
          <Settings className="w-4 h-4 mr-2" />
          Templates
        </TabsTrigger>
      </TabsList>

      <TabsContent value="center" className="space-y-6">
        <NotificationCenter />
      </TabsContent>

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

        <Card className="border-emerald-200 bg-emerald-50/50">
          <CardHeader>
            <CardTitle className="flex items-center text-emerald-900">
              <CheckCircle className="w-5 h-5 mr-2" />
              Sistema de Notificações Automáticas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-semibold text-emerald-900">✅ Emails Automáticos Ativados</h4>
                <p className="text-sm text-muted-foreground">
                  O sistema envia emails automaticamente nos seguintes momentos:
                </p>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-4">
                  <li><strong>Cliente adicionado:</strong> Email de boas-vindas com dados cadastrais</li>
                  <li><strong>Dívida criada:</strong> Email detalhando valor, descrição e data de vencimento</li>
                  <li><strong>1 dia antes do vencimento:</strong> Lembrete automático para evitar atrasos</li>
                </ul>
              </div>
              
              <div className="pt-4 border-t">
                <h4 className="font-semibold text-emerald-900 mb-2">📧 Como funciona</h4>
                <p className="text-sm text-muted-foreground">
                  Todas as notificações são enviadas automaticamente quando você:
                </p>
                <div className="mt-2 space-y-1 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                    <span>Cadastra um novo cliente com email</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                    <span>Registra uma nova dívida</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                    <span>A dívida está próxima do vencimento (1 dia antes)</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t">
                <p className="text-xs text-muted-foreground">
                  ⚠️ <strong>Importante:</strong> Certifique-se de validar seu domínio no{' '}
                  <a href="https://resend.com/domains" target="_blank" className="underline text-blue-600">
                    Resend
                  </a>
                  {' '}para que os emails sejam entregues corretamente.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

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

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base flex items-center gap-2">
                      <MessageCircle className="h-4 w-4 text-green-600" />
                      WhatsApp
                    </Label>
                    <p className="text-sm text-muted-foreground">Click to Chat (gratuito)</p>
                  </div>
                  <Switch 
                    checked={whatsappSettings.enabled}
                    onCheckedChange={(checked) => setWhatsappSettings({ ...whatsappSettings, enabled: checked })}
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
            <CardTitle>Envio Individual de Notificações</CardTitle>
            <p className="text-sm text-muted-foreground mt-2">
              Enviar notificações para dívidas específicas
            </p>
          </CardHeader>
          <CardContent>
            {overdueDebts.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Nenhuma dívida vencida no momento</p>
              </div>
            ) : (
              <div className="space-y-3">
                {overdueDebts.slice(0, 5).map((debt) => {
                  const client = clients.find(c => c.id === debt.cliente_id);
                  if (!client) return null;
                  
                  return (
                    <div key={debt.id} className="flex items-center justify-between p-3 border rounded-lg bg-card">
                      <div className="flex-1">
                        <p className="font-medium">{client.nome}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatCurrency(Number(debt.valor))} - Vence em {new Date(debt.data_vencimento).toLocaleDateString('pt-MZ')}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        {client.email && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => sendNotification(debt, 'email')}
                            className="text-blue-600 border-blue-300 hover:bg-blue-50"
                          >
                            <Mail className="w-4 h-4 mr-1" />
                            Email
                          </Button>
                        )}
                        {client.telefone && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => sendWhatsAppNotification(debt)}
                            className="text-green-600 border-green-300 hover:bg-green-50"
                          >
                            <MessageCircle className="w-4 h-4 mr-1" />
                            WhatsApp
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
                {overdueDebts.length > 5 && (
                  <p className="text-sm text-muted-foreground text-center pt-2">
                    E mais {overdueDebts.length - 5} dívidas...
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Histórico de Notificações
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-2">
              Últimas 50 notificações enviadas pelo sistema
            </p>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
                <span className="ml-2">Carregando histórico...</span>
              </div>
            ) : notifications.length === 0 ? (
              <div className="text-center py-8">
                <Bell className="w-12 h-12 mx-auto mb-4 opacity-20" />
                <p className="text-muted-foreground">Nenhuma notificação enviada ainda</p>
                <p className="text-sm text-muted-foreground mt-2">
                  As notificações aparecerão aqui após serem enviadas
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className="flex items-start gap-3 p-4 rounded-lg border bg-card hover:shadow-md transition-shadow"
                  >
                    <div className="mt-1">
                      {getTypeIcon(notification.tipo)}
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium text-sm">
                            {notification.dividas?.clientes?.nome || 'Cliente'}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {notification.dividas?.descricao || 'Sem descrição'}
                          </p>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          {getStatusBadge(notification.status)}
                          <span className="text-xs text-muted-foreground">
                            {new Date(notification.created_at).toLocaleString('pt-PT', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {notification.mensagem}
                      </p>
                      {notification.erro && (
                        <div className="mt-2 p-2 bg-destructive/10 rounded text-xs text-destructive">
                          <strong>Erro:</strong> {notification.erro}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-blue-200 bg-blue-50/50">
          <CardHeader>
            <CardTitle className="flex items-center text-blue-900">
              <MessageCircle className="w-5 h-5 mr-2 text-green-600" />
              Testar Notificações
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-2">
              Envie notificações de teste para verificar se tudo está funcionando
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2">
              {/* Teste de Email */}
              <div className="space-y-3">
                <Label htmlFor="testEmail" className="text-base font-semibold flex items-center gap-2">
                  <Mail className="w-4 h-4 text-blue-600" />
                  Teste de Email
                </Label>
                <Input
                  id="testEmail"
                  type="email"
                  placeholder="email@exemplo.com"
                  value={testEmail}
                  onChange={(e) => setTestEmail(e.target.value)}
                />
                <Button
                  onClick={sendTestEmail}
                  disabled={testingSend || !testEmail}
                  variant="outline"
                  className="w-full"
                >
                  {testingSend && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  <Mail className="w-4 h-4 mr-2" />
                  {testingSend ? 'Enviando...' : 'Enviar Email de Teste'}
                </Button>
                <p className="text-xs text-muted-foreground">
                  Certifique-se de que o domínio está verificado no Resend
                </p>
              </div>

              {/* Teste de WhatsApp */}
              <div className="space-y-3">
                <Label htmlFor="testPhone" className="text-base font-semibold flex items-center gap-2">
                  <MessageCircle className="w-4 h-4 text-green-600" />
                  Teste de WhatsApp
                </Label>
                <Input
                  id="testPhone"
                  type="tel"
                  placeholder="+258 84 123 4567"
                  value={testPhone}
                  onChange={(e) => setTestPhone(e.target.value)}
                />
                <Button
                  onClick={sendTestWhatsApp}
                  disabled={!testPhone}
                  variant="outline"
                  className="w-full text-green-600 border-green-300 hover:bg-green-50"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Abrir WhatsApp Teste
                </Button>
                <p className="text-xs text-muted-foreground">
                  Abrirá o WhatsApp com uma mensagem de teste pré-preenchida
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="templates" className="space-y-6">
        <NotificationTemplates />
      </TabsContent>
    </Tabs>
  );
};
