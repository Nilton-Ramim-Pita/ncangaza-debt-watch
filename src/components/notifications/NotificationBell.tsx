import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useNotifications, Notification } from "@/hooks/useNotifications";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { pt } from "date-fns/locale";
import { useEffect, useRef } from "react";

export const NotificationBell = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const navigate = useNavigate();
  const audioRef = useRef<HTMLAudioElement>(null);
  const previousCountRef = useRef(unreadCount);

  // Tocar som quando novas notificações chegarem
  useEffect(() => {
    if (unreadCount > previousCountRef.current && unreadCount > 0) {
      // Nova notificação recebida
      if (audioRef.current) {
        audioRef.current.play().catch(e => console.log('Erro ao tocar som:', e));
      }
    }
    previousCountRef.current = unreadCount;
  }, [unreadCount]);

  const handleNotificationClick = (notification: Notification) => {
    markAsRead(notification.id);
    
    // Redirecionar baseado no tipo de notificação
    if (notification.dividas?.id) {
      navigate('/');
    } else if (notification.message?.includes('cliente')) {
      navigate('/');
    }
  };

  const getNotificationIcon = (message: string) => {
    if (message.includes('cliente')) return '👤';
    if (message.includes('dívida')) return '💰';
    if (message.includes('pagamento') || message.includes('Pagamento')) return '✅';
    if (message.includes('vence') || message.includes('Vence')) return '⏰';
    return '🔔';
  };

  return (
    <>
      {/* Som de notificação (beep curto) */}
      <audio ref={audioRef} preload="auto">
        <source src="data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBi6Azei9cynxAAAAAA==" type="audio/wav" />
      </audio>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <Badge 
                variant="destructive" 
                className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
              >
                {unreadCount > 9 ? '9+' : unreadCount}
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80" align="end">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-lg">Notificações</h3>
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={markAllAsRead}
                className="text-xs"
              >
                Marcar todas como lidas
              </Button>
            )}
          </div>
          
          <ScrollArea className="h-[400px] pr-4">
            {notifications.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Bell className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>Nenhuma notificação</p>
              </div>
            ) : (
              <div className="space-y-2">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    onClick={() => handleNotificationClick(notification)}
                    className={`
                      p-3 rounded-lg border cursor-pointer transition-colors
                      ${!notification.read 
                        ? 'bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800' 
                        : 'bg-background hover:bg-muted'
                      }
                    `}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-2xl flex-shrink-0">
                        {getNotificationIcon(notification.message)}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm ${!notification.read ? 'font-semibold' : ''}`}>
                          {notification.message}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatDistanceToNow(new Date(notification.created_at), {
                            addSuffix: true,
                            locale: pt
                          })}
                        </p>
                      </div>
                      {!notification.read && (
                        <div className="w-2 h-2 rounded-full bg-blue-600 flex-shrink-0 mt-1" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </PopoverContent>
      </Popover>
    </>
  );
};
