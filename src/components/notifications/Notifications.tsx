import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { 
  Bell, 
  Mail, 
  MessageSquare, 
  Calendar, 
  Clock,
  CheckCircle,
  AlertTriangle,
  Settings
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Notification {
  id: string;
  type: "email" | "sms" | "whatsapp";
  client: string;
  debt: string;
  amount: number;
  dueDate: string;
  status: "enviada" | "pendente" | "falhou";
  sentDate: string;
  template: string;
}

const mockNotifications: Notification[] = [
  {
    id: "N001",
    type: "email",
    client: "João Mutema Silva",
    debt: "D001",
    amount: 75000,
    dueDate: "2024-01-15",
    status: "enviada",
    sentDate: "2024-01-12 08:00",
    template: "Lembrete de vencimento (D-3)"
  },
  {
    id: "N002",
    type: "sms",
    client: "Maria Joaquina Banda",
    debt: "D002", 
    amount: 42000,
    dueDate: "2024-01-18",
    status: "pendente",
    sentDate: "2024-01-15 08:00",
    template: "Lembrete de vencimento (D-3)"
  },
  {
    id: "N003",
    type: "whatsapp",
    client: "Carlos Mandlate Nhongo",
    debt: "D003",
    amount: 128000,
    dueDate: "2024-01-20",
    status: "falhou",
    sentDate: "2024-01-17 08:00",
    template: "Lembrete de vencimento (D-3)"
  }
];

export const Notifications = () => {
  const getStatusBadge = (status: Notification["status"]) => {
    switch (status) {
      case "enviada":
        return (
          <Badge className="bg-success text-success-foreground">
            <CheckCircle className="mr-1 h-3 w-3" />
            Enviada
          </Badge>
        );
      case "pendente":
        return (
          <Badge variant="secondary">
            <Clock className="mr-1 h-3 w-3" />
            Pendente
          </Badge>
        );
      case "falhou":
        return (
          <Badge className="bg-destructive text-destructive-foreground">
            <AlertTriangle className="mr-1 h-3 w-3" />
            Falhou
          </Badge>
        );
      default:
        return <Badge variant="outline">Indefinido</Badge>;
    }
  };

  const getTypeIcon = (type: Notification["type"]) => {
    switch (type) {
      case "email":
        return <Mail className="h-4 w-4" />;
      case "sms":
        return <MessageSquare className="h-4 w-4" />;
      case "whatsapp":
        return <MessageSquare className="h-4 w-4 text-green-600" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-foreground">Notificações</h2>
        <p className="text-muted-foreground">
          Sistema automático de lembretes e alertas
        </p>    
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Notificações Hoje
            </CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              Lembretes programados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Taxa de Sucesso
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">87.5%</div>
            <p className="text-xs text-muted-foreground">
              Últimos 30 dias
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Próximo Envio
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">08:00</div>
            <p className="text-xs text-muted-foreground">
              Amanhã, 5 notificações
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Configurações de Envio
              <Settings className="h-5 w-5 text-muted-foreground" />
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <label className="text-sm font-medium">
                  Notificações por Email
                </label>
                <p className="text-xs text-muted-foreground">
                  Enviar lembretes via email
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <label className="text-sm font-medium">
                  Notificações por SMS
                </label>
                <p className="text-xs text-muted-foreground">
                  Enviar lembretes via SMS
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <label className="text-sm font-medium">
                  WhatsApp Business
                </label>
                <p className="text-xs text-muted-foreground">
                  Integração com WhatsApp
                </p>
              </div>
              <Switch />
            </div>

            <div className="pt-4 border-t">
              <div className="space-y-2">
                <label className="text-sm font-medium">Horário de Envio</label>
                <p className="text-sm">08:00 (UTC+2 - Africa/Maputo)</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Histórico de Notificações</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={cn(
                    "flex items-center justify-between p-3 rounded-lg border transition-colors",
                    notification.status === "falhou" && "border-destructive/20 bg-destructive/5",
                    notification.status === "enviada" && "border-success/20 bg-success/5"
                  )}
                >
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted">
                      {getTypeIcon(notification.type)}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{notification.client}</p>
                      <p className="text-xs text-muted-foreground">
                        {notification.template} • MZN {notification.amount.toLocaleString()}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {notification.sentDate}
                      </p>
                    </div>
                  </div>
                  {getStatusBadge(notification.status)}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};