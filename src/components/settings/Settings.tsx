import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { toast } from "sonner";
import { useTheme } from "@/contexts/ThemeContext";
import { useSettings } from "@/hooks/useSettings";
import { useLogo } from "@/hooks/useLogo";
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
  Save,
  Globe,
  Sun,
  Moon,
  Monitor,
  Check,
  Image as ImageIcon,
  RotateCcw
} from "lucide-react";
import { cn } from "@/lib/utils";

export const Settings = () => {
  const { theme, setTheme, actualTheme } = useTheme();
  const { settings, updateSetting } = useSettings();
  const { logo, setLogo, resetLogo, defaultLogo } = useLogo();
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    
    setTimeout(() => {
      setLoading(false);
      toast.success("Configurações salvas com sucesso!");
    }, 1000);
  };

  const handleExportData = () => {
    toast.success("Os dados estão sendo preparados para download");
  };

  const handleImportData = () => {
    toast.info("Importação de dados será implementada em breve");
  };

  const handleBackupNow = () => {
    toast.success("Backup iniciado com sucesso");
  };

  const handleClearCache = () => {
    localStorage.clear();
    toast.success("Cache limpo com sucesso");
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Por favor, selecione um arquivo de imagem válido");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("O arquivo deve ter no máximo 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setLogo(result);
      toast.success("Logotipo atualizado com sucesso!");
    };
    reader.readAsDataURL(file);
  };

  const handleResetLogo = () => {
    resetLogo();
    toast.success("Logotipo restaurado para o padrão");
  };

  const themeOptions = [
    { value: "light", label: "Claro", icon: Sun },
    { value: "dark", label: "Escuro", icon: Moon },
    { value: "system", label: "Sistema", icon: Monitor },
  ];

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
        {/* Appearance Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Palette className="w-5 h-5 mr-2" />
              Aparência
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label className="text-base mb-3 block">Tema do Sistema</Label>
                <div className="grid grid-cols-3 gap-4">
                  {themeOptions.map((option) => {
                    const Icon = option.icon;
                    const isActive = theme === option.value;
                    
                    return (
                      <button
                        key={option.value}
                        onClick={() => setTheme(option.value as "light" | "dark" | "system")}
                        className={cn(
                          "relative flex flex-col items-center gap-3 rounded-lg border-2 p-4 transition-all hover:bg-accent",
                          isActive 
                            ? "border-primary bg-primary/5" 
                            : "border-muted"
                        )}
                      >
                        {isActive && (
                          <Check className="absolute top-2 right-2 w-4 h-4 text-primary" />
                        )}
                        <Icon className={cn(
                          "w-8 h-8",
                          isActive ? "text-primary" : "text-muted-foreground"
                        )} />
                        <span className={cn(
                          "text-sm font-medium",
                          isActive ? "text-primary" : "text-muted-foreground"
                        )}>
                          {option.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
                <p className="text-sm text-muted-foreground mt-3">
                  Tema atual: <span className="font-medium">{actualTheme === "dark" ? "Escuro" : "Claro"}</span>
                </p>
              </div>

              <Separator />

              <div className="grid gap-2">
                <Label htmlFor="language">Idioma</Label>
                <Select 
                  value={settings.language} 
                  onValueChange={(value) => updateSetting("language", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pt-MZ">🇲🇿 Português (Moçambique)</SelectItem>
                    <SelectItem value="pt-BR">🇧🇷 Português (Brasil)</SelectItem>
                    <SelectItem value="en-US">🇺🇸 English (US)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* General Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <SettingsIcon className="w-5 h-5 mr-2" />
              Configurações Gerais
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Logo Upload */}
            <div className="space-y-4">
              <Label className="text-base">Logotipo da Empresa</Label>
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0">
                  <div className="w-32 h-32 border-2 border-dashed rounded-lg flex items-center justify-center bg-muted/30 overflow-hidden">
                    {logo ? (
                      <img 
                        src={logo} 
                        alt="Logo atual" 
                        className="w-full h-full object-contain p-2"
                      />
                    ) : (
                      <ImageIcon className="w-12 h-12 text-muted-foreground" />
                    )}
                  </div>
                </div>
                <div className="flex-1 space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Carregue o logotipo da sua empresa. Formatos aceitos: PNG, JPG, SVG (máx. 5MB)
                  </p>
                  <div className="flex gap-2">
                    <Button variant="outline" className="relative" asChild>
                      <label className="cursor-pointer">
                        <Upload className="w-4 h-4 mr-2" />
                        Carregar Logo
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleLogoUpload}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                      </label>
                    </Button>
                    {logo !== defaultLogo && (
                      <Button variant="ghost" onClick={handleResetLogo}>
                        <RotateCcw className="w-4 h-4 mr-2" />
                        Restaurar Padrão
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            <div className="grid gap-6 md:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="siteName">Nome da Empresa</Label>
                <Input
                  id="siteName"
                  value={settings.siteName}
                  onChange={(e) => updateSetting("siteName", e.target.value)}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="siteUrl">URL do Site</Label>
                <Input
                  id="siteUrl"
                  value={settings.siteUrl}
                  onChange={(e) => updateSetting("siteUrl", e.target.value)}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="contactEmail">Email de Contacto</Label>
                <Input
                  id="contactEmail"
                  type="email"
                  value={settings.contactEmail}
                  onChange={(e) => updateSetting("contactEmail", e.target.value)}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="contactPhone">Telefone de Contacto</Label>
                <Input
                  id="contactPhone"
                  value={settings.contactPhone}
                  onChange={(e) => updateSetting("contactPhone", e.target.value)}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="currency">Moeda</Label>
                <Select 
                  value={settings.currency} 
                  onValueChange={(value) => updateSetting("currency", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MZN">💵 Metical (MZN)</SelectItem>
                    <SelectItem value="USD">💵 Dólar (USD)</SelectItem>
                    <SelectItem value="EUR">💶 Euro (EUR)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="timezone">Fuso Horário</Label>
                <Select 
                  value={settings.timezone} 
                  onValueChange={(value) => updateSetting("timezone", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Africa/Maputo">🌍 África/Maputo (CAT)</SelectItem>
                    <SelectItem value="UTC">🌐 UTC</SelectItem>
                    <SelectItem value="Europe/Lisbon">🇵🇹 Europa/Lisboa</SelectItem>
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
                  onCheckedChange={(checked) => updateSetting("emailNotifications", checked)}
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
                  onCheckedChange={(checked) => updateSetting("smsNotifications", checked)}
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
                  onCheckedChange={(checked) => updateSetting("whatsappNotifications", checked)}
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
                    onCheckedChange={(checked) => updateSetting("twoFactorAuth", checked)}
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
                  onChange={(e) => updateSetting("sessionTimeout", parseInt(e.target.value) || 30)}
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
                  onCheckedChange={(checked) => updateSetting("autoBackup", checked)}
                />
              </div>

              {settings.autoBackup && (
                <div className="grid gap-2">
                  <Label htmlFor="backupFrequency">Frequência do Backup</Label>
                  <Select 
                    value={settings.backupFrequency} 
                    onValueChange={(value) => updateSetting("backupFrequency", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hourly">⏰ A cada hora</SelectItem>
                      <SelectItem value="daily">📅 Diariamente</SelectItem>
                      <SelectItem value="weekly">📆 Semanalmente</SelectItem>
                      <SelectItem value="monthly">🗓️ Mensalmente</SelectItem>
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
                  onChange={(e) => updateSetting("dataRetention", parseInt(e.target.value) || 365)}
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
                <Badge className="bg-success/20 text-success">Online</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
