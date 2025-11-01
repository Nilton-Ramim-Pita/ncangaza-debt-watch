import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Shield, Monitor, MapPin, Clock, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface LoginHistory {
  id: string;
  login_at: string;
  ip_address: string;
  user_agent: string;
  device_info: string;
  location: string;
}

export const SecuritySettings = () => {
  const { user } = useAuth();
  const [loginHistory, setLoginHistory] = useState<LoginHistory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchLoginHistory();
    }
  }, [user]);

  const fetchLoginHistory = async () => {
    try {
      const { data, error } = await supabase
        .from('login_history')
        .select('*')
        .order('login_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setLoginHistory(data || []);
    } catch (error) {
      console.error('Error fetching login history:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogoutAllDevices = async () => {
    try {
      await supabase.auth.signOut({ scope: 'global' });
      toast.success('Desconectado de todos os dispositivos');
      window.location.href = '/login';
    } catch (error) {
      toast.error('Erro ao desconectar dispositivos');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Segurança Avançada
          </CardTitle>
          <CardDescription>
            Gerencie suas sessões e visualize o histórico de acessos
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <h4 className="font-medium">Sessões Ativas</h4>
              <p className="text-sm text-muted-foreground">
                Desconecte de todos os dispositivos exceto este
              </p>
            </div>
            <Button variant="outline" onClick={handleLogoutAllDevices}>
              <LogOut className="w-4 h-4 mr-2" />
              Desconectar Tudo
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Monitor className="w-5 h-5" />
            Histórico de Login
          </CardTitle>
          <CardDescription>
            Últimos 10 acessos à sua conta
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-center text-muted-foreground py-4">Carregando...</p>
          ) : loginHistory.length === 0 ? (
            <div className="text-center py-8">
              <Monitor className="w-12 h-12 mx-auto mb-3 text-muted-foreground opacity-50" />
              <p className="text-muted-foreground">Nenhum histórico de login registrado</p>
              <p className="text-sm text-muted-foreground mt-1">
                Os próximos logins serão registrados aqui
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {loginHistory.map((login) => (
                <div
                  key={login.id}
                  className="flex items-start gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <Monitor className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium truncate">
                        {login.device_info || 'Dispositivo desconhecido'}
                      </p>
                      <Badge variant="outline" className="flex-shrink-0">
                        <Clock className="w-3 h-3 mr-1" />
                        {formatDate(login.login_at)}
                      </Badge>
                    </div>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      {login.ip_address && (
                        <p className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          IP: {login.ip_address}
                        </p>
                      )}
                      {login.location && (
                        <p className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {login.location}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
