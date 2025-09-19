import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { 
  Settings as SettingsIcon, 
  Bell, 
  Palette, 
  Database,
  Mail,
  Smartphone,
  MessageSquare,
  Shield,
  Download,
  Upload,
  RefreshCw,
  Trash2,
  Save,
  Globe
} from "lucide-react";

interface SystemSettings {
  siteName: string;
  siteUrl: string;
  contactEmail: string;
  contactPhone: string;
  currency: string;
  timezone: string;
  language: string;
  theme: string;
  emailNotifications: boolean;
  smsNotifications: boolean;
  whatsappNotifications: boolean;
  autoBackup: boolean;
  backupFrequency: string;
  dataRetention: number;
  twoFactorAuth: boolean;
  sessionTimeout: number;
}

export const Settings = () => {
  const [settings, setSettings] = useState<SystemSettings>({
    siteName: "Ncangaza Multiservices",
    siteUrl: "https://ncangaza.mz",
    contactEmail: "info@ncangaza.mz",
    contactPhone: "+258 84 123 4567",
    currency: "MZN",
    timezone: "Africa/Maputo",
    language: "pt-MZ",
    theme: "system",
    emailNotifications: true,
    smsNotifications: false,
    whatsappNotifications: true,
    autoBackup: true,
    backupFrequency: "daily",
    dataRetention: 365,
    twoFactorAuth: false,
    sessionTimeout: 30
  });

  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSave = async () => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Configurações salvas",
        description: "Todas as configurações foram atualizadas com sucesso!",
      });
    }, 1000);
  };

  const handleExportData = () => {
    toast({
      title: "Exportação iniciada",
      description: "Os dados estão sendo preparados para download.",
    });
  };

  const handleImportData = () => {
    toast({
      title: "Funcionalidade em desenvolvimento",
      description: "Importação de dados será implementada em breve.",
    });
  };

  const handleBackupNow = () => {
    toast({
      title: "Backup iniciado",
      description: "Criando backup dos dados do sistema...",
    });
  };

  const handleClearCache = () => {
    toast({
      title: "Cache limpo",
      description: "Cache do sistema foi limpo com sucesso.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Configurações</h2>
          <p className="text-muted-foreground">
            Configure o sistema de acordo com as suas necessidades
          </p>
        </div>
        <Button onClick={handleSave} disabled={loading}>
          <Save className="w-4 h-4 mr-2" />
          {loading ? "Salvando..." : "Salvar Tudo"}
        </Button>
      </div>

      <div className="grid gap-6">
        {/* General Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <SettingsIcon className="w-5 h-5 mr-2" />
              Configurações Gerais
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="siteName">Nome da Empresa</Label>
                <Input
                  id="siteName"
                  value={settings.siteName}
                  onChange={(e) => setSettings(prev => ({ ...prev, siteName: e.target.value }))}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="siteUrl">URL do Site</Label>
                <Input
                  id="siteUrl"
                  value={settings.siteUrl}
                  onChange={(e) => setSettings(prev => ({ ...prev, siteUrl: e.target.value }))}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="contactEmail">Email de Contacto</Label>
                <Input
                  id="contactEmail"
                  type="email"
                  value={settings.contactEmail}
                  onChange={(e) => setSettings(prev => ({ ...prev, contactEmail: e.target.value }))}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="contactPhone">Telefone de Contacto</Label>
                <Input
                  id="contactPhone"
                  value={settings.contactPhone}
                  onChange={(e) => setSettings(prev => ({ ...prev, contactPhone: e.target.value }))}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="currency">Moeda</Label>
                <Select 
                  value={settings.currency} 
                  onValueChange={(value) => setSettings(prev => ({ ...prev, currency: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MZN">Metical (MZN)</SelectItem>
                    <SelectItem value="USD">Dólar (USD)</SelectItem>
                    <SelectItem value="EUR">Euro (EUR)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="timezone">Fuso Horário</Label>
                <Select 
                  value={settings.timezone} 
                  onValueChange={(value) => setSettings(prev => ({ ...prev, timezone: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Africa/Maputo">África/Maputo (CAT)</SelectItem>
                    <SelectItem value="UTC">UTC</SelectItem>
                    <SelectItem value="Europe/Lisbon">Europa/Lisboa</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Appearance Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Palette className="w-5 h-5 mr-2" />
              Aparência
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="theme">Tema</Label>
                <Select 
                  value={settings.theme} 
                  onValueChange={(value) => setSettings(prev => ({ ...prev, theme: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Claro</SelectItem>
                    <SelectItem value="dark">Escuro</SelectItem>
                    <SelectItem value="system">Sistema</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="language">Idioma</Label>
                <Select 
                  value={settings.language} 
                  onValueChange={(value) => setSettings(prev => ({ ...prev, language: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pt-MZ">Português (Moçambique)</SelectItem>
                    <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
                    <SelectItem value="en-US">English (US)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bell className="w-5 h-5 mr-2" />
              Notificações
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="flex items-center">
                    <Mail className="w-4 h-4 mr-2 text-muted-foreground" />
                    <Label className="text-base">Notificações por Email</Label>
                  </div>
                  <p className="text-sm text-muted-foreground">Receber notificações por email</p>
                </div>
                <Switch 
                  checked={settings.emailNotifications}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, emailNotifications: checked }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="flex items-center">
                    <Smartphone className="w-4 h-4 mr-2 text-muted-foreground" />
                    <Label className="text-base">Notificações por SMS</Label>
                  </div>
                  <p className="text-sm text-muted-foreground">Receber notificações por SMS</p>
                </div>
                <Switch 
                  checked={settings.smsNotifications}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, smsNotifications: checked }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="flex items-center">
                    <MessageSquare className="w-4 h-4 mr-2 text-muted-foreground" />
                    <Label className="text-base">Notificações por WhatsApp</Label>
                  </div>
                  <p className="text-sm text-muted-foreground">Receber notificações por WhatsApp</p>
                </div>
                <Switch 
                  checked={settings.whatsappNotifications}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, whatsappNotifications: checked }))}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="w-5 h-5 mr-2" />
              Segurança
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Autenticação de Dois Fatores</Label>
                  <p className="text-sm text-muted-foreground">Adicionar uma camada extra de segurança</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={settings.twoFactorAuth ? "secondary" : "outline"}>
                    {settings.twoFactorAuth ? "Ativo" : "Inativo"}
                  </Badge>
                  <Switch 
                    checked={settings.twoFactorAuth}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, twoFactorAuth: checked }))}
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="sessionTimeout">Timeout da Sessão (minutos)</Label>
                <Input
                  id="sessionTimeout"
                  type="number"
                  min="5"
                  max="480"
                  value={settings.sessionTimeout}
                  onChange={(e) => setSettings(prev => ({ ...prev, sessionTimeout: parseInt(e.target.value) || 30 }))}
                />
                <p className="text-sm text-muted-foreground">
                  Tempo até deslogar automaticamente por inatividade
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Data Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Database className="w-5 h-5 mr-2" />
              Gestão de Dados
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Backup Automático</Label>
                  <p className="text-sm text-muted-foreground">Criar backups automaticamente</p>
                </div>
                <Switch 
                  checked={settings.autoBackup}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, autoBackup: checked }))}
                />
              </div>

              {settings.autoBackup && (
                <div className="grid gap-2">
                  <Label htmlFor="backupFrequency">Frequência do Backup</Label>
                  <Select 
                    value={settings.backupFrequency} 
                    onValueChange={(value) => setSettings(prev => ({ ...prev, backupFrequency: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hourly">A cada hora</SelectItem>
                      <SelectItem value="daily">Diariamente</SelectItem>
                      <SelectItem value="weekly">Semanalmente</SelectItem>
                      <SelectItem value="monthly">Mensalmente</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="grid gap-2">
                <Label htmlFor="dataRetention">Retenção de Dados (dias)</Label>
                <Input
                  id="dataRetention"
                  type="number"
                  min="30"
                  max="3650"
                  value={settings.dataRetention}
                  onChange={(e) => setSettings(prev => ({ ...prev, dataRetention: parseInt(e.target.value) || 365 }))}
                />
                <p className="text-sm text-muted-foreground">
                  Tempo para manter os dados antes da exclusão automática
                </p>
              </div>
            </div>

            <Separator />

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Button variant="outline" onClick={handleBackupNow}>
                <Download className="w-4 h-4 mr-2" />
                Backup Agora
              </Button>

              <Button variant="outline" onClick={handleExportData}>
                <Upload className="w-4 h-4 mr-2" />
                Exportar Dados
              </Button>

              <Button variant="outline" onClick={handleImportData}>
                <Download className="w-4 h-4 mr-2" />
                Importar Dados
              </Button>

              <Button variant="outline" onClick={handleClearCache}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Limpar Cache
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* System Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Globe className="w-5 h-5 mr-2" />
              Informações do Sistema
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div className="text-center p-4 border rounded-lg">
                <div className="text-sm font-medium text-muted-foreground">Versão</div>
                <div className="text-lg font-semibold">v1.0.0</div>
              </div>
              
              <div className="text-center p-4 border rounded-lg">
                <div className="text-sm font-medium text-muted-foreground">Base de Dados</div>
                <div className="text-lg font-semibold">PostgreSQL</div>
              </div>
              
              <div className="text-center p-4 border rounded-lg">
                <div className="text-sm font-medium text-muted-foreground">Último Backup</div>
                <div className="text-lg font-semibold">Hoje</div>
              </div>
              
              <div className="text-center p-4 border rounded-lg">
                <div className="text-sm font-medium text-muted-foreground">Status</div>
                <Badge className="bg-green-100 text-green-800">Online</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};