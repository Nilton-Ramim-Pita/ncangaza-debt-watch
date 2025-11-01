import { Bell, User, LogOut, X, Check, Settings, UserCog } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useNotifications } from "@/hooks/useNotifications";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import logoNcangaza from "@/assets/logo-ncangaza-full.png";

interface HeaderProps {
  onTabChange: (tab: string) => void;
}

export const Header = ({ onTabChange }: HeaderProps) => {
  const { notifications, unreadCount, markAsRead, markAllAsRead, deleteNotification } = useNotifications();
  const { profile, signOut, isAdmin, userRole } = useAuth();
  const [notificationOpen, setNotificationOpen] = useState(false);

  const handleProfileClick = () => {
    onTabChange('profile');
  };

  const handleSettingsClick = () => {
    onTabChange('settings');
  };

  const handleUsersClick = () => {
    onTabChange('users');
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Agora mesmo';
    if (diffInMinutes < 60) return `${diffInMinutes}m atrás`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h atrás`;
    return `${Math.floor(diffInMinutes / 1440)}d atrás`;
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success': return '✅';
      case 'warning': return '⚠️';
      case 'error': return '❌';
      default: return 'ℹ️';
    }
  };

  return (
    <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-40">
      <div className="flex h-16 items-center justify-between px-6">
        <div className="flex items-center space-x-4">
          <img 
            src={logoNcangaza} 
            alt="Ncangaza Multiservices Logo" 
            className="h-12 object-contain"
          />
        </div>

        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <Popover open={notificationOpen} onOpenChange={setNotificationOpen}>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="sm" className="relative">
                <Bell className={`h-5 w-5 ${unreadCount > 0 ? 'animate-pulse text-primary' : ''}`} />
                {unreadCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs bg-destructive animate-bounce">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="end">
              <div className="flex items-center justify-between p-4 border-b bg-muted/50">
                <h3 className="font-semibold flex items-center gap-2">
                  <Bell className="h-4 w-4" />
                  Notificações
                </h3>
                <div className="flex items-center space-x-2">
                  {unreadCount > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={markAllAsRead}
                      className="text-xs hover:bg-primary hover:text-primary-foreground"
                    >
                      <Check className="w-3 h-3 mr-1" />
                      Marcar todas
                    </Button>
                  )}
                </div>
              </div>
              <ScrollArea className="h-80">
                {notifications.length === 0 ? (
                  <div className="p-4 text-center text-muted-foreground">
                    <Bell className="h-12 w-12 mx-auto mb-2 opacity-20" />
                    <p className="text-sm">Nenhuma notificação</p>
                    <p className="text-xs mt-1">Você está em dia!</p>
                  </div>
                ) : (
                  <div className="p-2">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-3 rounded-lg mb-2 cursor-pointer transition-colors hover:bg-muted/50 ${
                          !notification.read ? 'bg-muted/30' : ''
                        }`}
                        onClick={() => markAsRead(notification.id)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <span className="text-sm">{getNotificationIcon(notification.type)}</span>
                              <h4 className="text-sm font-medium">{notification.title}</h4>
                              {!notification.read && (
                                <Badge variant="secondary" className="h-2 w-2 p-0 bg-primary" />
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                              {notification.message}
                            </p>
                            <p className="text-xs text-muted-foreground mt-2">
                              {formatTimeAgo(notification.created_at)}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteNotification(notification.id);
                            }}
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </PopoverContent>
          </Popover>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span className="hidden md:inline">{profile?.full_name || 'Usuário'}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>
                <div>
                  <p className="font-medium">{profile?.full_name}</p>
                  <p className="text-xs text-muted-foreground capitalize">{userRole || 'user'}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleProfileClick}>
                <User className="mr-2 h-4 w-4" />
                Perfil
              </DropdownMenuItem>
              {isAdmin && (
                <DropdownMenuItem onClick={handleUsersClick}>
                  <UserCog className="mr-2 h-4 w-4" />
                  Gestão de Usuários
                </DropdownMenuItem>
              )}
              <DropdownMenuItem onClick={handleSettingsClick}>
                <Settings className="mr-2 h-4 w-4" />
                Configurações
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive" onClick={signOut}>
                <LogOut className="mr-2 h-4 w-4" />
                Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};