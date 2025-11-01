import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Bell, Mail, Smartphone, MessageSquare } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export const NotificationPreferences = () => {
  const { profile } = useAuth();
  const [preferences, setPreferences] = useState({
    email_notifications: true,
    sms_notifications: false,
    whatsapp_notifications: true,
  });

  useEffect(() => {
    if (profile) {
      setPreferences({
        email_notifications: profile.email_notifications ?? true,
        sms_notifications: profile.sms_notifications ?? false,
        whatsapp_notifications: profile.whatsapp_notifications ?? true,
      });
    }
  }, [profile]);

  const handleToggle = async (key: keyof typeof preferences) => {
    if (!profile) return;

    const newValue = !preferences[key];
    setPreferences({ ...preferences, [key]: newValue });

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ [key]: newValue })
        .eq('id', profile.id);

      if (error) throw error;

      const notificationType = key.replace('_notifications', '');
      toast.success(`Notificações por ${notificationType} ${newValue ? 'ativadas' : 'desativadas'}`);
    } catch (error) {
      console.error('Error updating preferences:', error);
      toast.error('Erro ao atualizar preferências');
      // Revert on error
      setPreferences({ ...preferences, [key]: !newValue });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="w-5 h-5" />
          Preferências de Notificação
        </CardTitle>
        <CardDescription>
          Configure como deseja receber notificações do sistema
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-muted-foreground" />
              <Label htmlFor="email" className="text-base cursor-pointer">
                Notificações por Email
              </Label>
            </div>
            <p className="text-sm text-muted-foreground">
              Receber alertas e notificações por email
            </p>
          </div>
          <Switch
            id="email"
            checked={preferences.email_notifications}
            onCheckedChange={() => handleToggle('email_notifications')}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-muted-foreground" />
              <Label htmlFor="sms" className="text-base cursor-pointer">
                Notificações por SMS
              </Label>
            </div>
            <p className="text-sm text-muted-foreground">
              Receber alertas importantes por SMS
            </p>
          </div>
          <Switch
            id="sms"
            checked={preferences.sms_notifications}
            onCheckedChange={() => handleToggle('sms_notifications')}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-muted-foreground" />
              <Label htmlFor="whatsapp" className="text-base cursor-pointer">
                Notificações por WhatsApp
              </Label>
            </div>
            <p className="text-sm text-muted-foreground">
              Receber notificações via WhatsApp
            </p>
          </div>
          <Switch
            id="whatsapp"
            checked={preferences.whatsapp_notifications}
            onCheckedChange={() => handleToggle('whatsapp_notifications')}
          />
        </div>

        <div className="pt-4 border-t">
          <p className="text-xs text-muted-foreground">
            💡 <strong>Dica:</strong> Ativar múltiplos canais de notificação garante que você não perca informações importantes sobre dívidas e pagamentos.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
