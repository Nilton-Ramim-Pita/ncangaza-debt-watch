import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useSettings } from "@/hooks/useSettings";
import { toast } from "sonner";
import { Bell, Mail, MessageCircle, Settings as SettingsIcon, Save } from "lucide-react";

export const NotificationSettings = () => {
  const { settings, updateSetting } = useSettings();
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      toast.success("Configurações salvas com sucesso!");
      setIsSaving(false);
    }, 500);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold">Configurações de Notificações</h3>
        <p className="text-sm text-muted-foreground">
          Configure como e quando deseja receber notificações do sistema
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Notificações por Email */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Email
            </CardTitle>
            <CardDescription>
              Receba notificações importantes por email
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Ativar notificações por email</Label>
                <p className="text-sm text-muted-foreground">
                  Emails automáticos de clientes e dívidas
                </p>
              </div>
              <Switch
                checked={settings.emailNotifications}
                onCheckedChange={(checked) => updateSetting("emailNotifications", checked)}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Email de contato</Label>
              <Input
                type="email"
                value={settings.contactEmail}
                onChange={(e) => updateSetting("contactEmail", e.target.value)}
                placeholder="seu@email.com"
              />
            </div>
          </CardContent>
        </Card>

        {/* Notificações WhatsApp */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-green-600" />
              WhatsApp
            </CardTitle>
            <CardDescription>
              Use WhatsApp Click-to-Chat para notificações
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Ativar WhatsApp</Label>
                <p className="text-sm text-muted-foreground">
                  Enviar lembretes via WhatsApp
                </p>
              </div>
              <Switch
                checked={settings.whatsappNotifications}
                onCheckedChange={(checked) => updateSetting("whatsappNotifications", checked)}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Telefone da empresa</Label>
              <Input
                type="tel"
                value={settings.contactPhone}
                onChange={(e) => updateSetting("contactPhone", e.target.value)}
                placeholder="+258 84 123 4567"
              />
              <p className="text-xs text-muted-foreground">
                Formato: +258 XX XXX XXXX (com código do país)
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Notificações In-App */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notificações In-App
            </CardTitle>
            <CardDescription>
              Receba alertas dentro do sistema
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-start gap-3">
                <Bell className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <p className="font-medium text-green-900">Sempre ativas</p>
                  <p className="text-sm text-green-700">
                    As notificações in-app estão sempre ativas e aparecem no ícone de sino no cabeçalho.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Tipos de notificação in-app:</Label>
              <ul className="text-sm text-muted-foreground space-y-1 ml-4 list-disc">
                <li>Novas dívidas cadastradas</li>
                <li>Dívidas próximas ao vencimento</li>
                <li>Dívidas vencidas</li>
                <li>Atualizações do sistema</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Configurações Avançadas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <SettingsIcon className="h-5 w-5" />
              Configurações Avançadas
            </CardTitle>
            <CardDescription>
              Personalize o comportamento das notificações
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Dias de antecedência para lembrete</Label>
              <Input
                type="number"
                min="1"
                max="30"
                defaultValue="3"
                placeholder="3"
              />
              <p className="text-xs text-muted-foreground">
                Enviar lembrete X dias antes do vencimento
              </p>
            </div>

            <div className="space-y-2">
              <Label>Horário de envio automático</Label>
              <Input
                type="time"
                defaultValue="08:00"
              />
              <p className="text-xs text-muted-foreground">
                Hora local de Moçambique (GMT+2)
              </p>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Backup automático</Label>
                <p className="text-sm text-muted-foreground">
                  Fazer backup diário dos dados
                </p>
              </div>
              <Switch
                checked={settings.autoBackup}
                onCheckedChange={(checked) => updateSetting("autoBackup", checked)}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={() => window.location.reload()}>
          Cancelar
        </Button>
        <Button onClick={handleSave} disabled={isSaving}>
          <Save className="mr-2 h-4 w-4" />
          {isSaving ? "Salvando..." : "Salvar Configurações"}
        </Button>
      </div>
    </div>
  );
};
