import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProfileHeader } from './ProfileHeader';
import { PersonalInfoForm } from './PersonalInfoForm';
import { PasswordChange } from './PasswordChange';
import { NotificationPreferences } from './NotificationPreferences';
import { SecuritySettings } from './SecuritySettings';
import { ActivityLog } from './ActivityLog';
import { User, Lock, Bell, Shield, Activity } from 'lucide-react';

export const Profile = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Perfil do Usuário</h1>
        <p className="text-muted-foreground">
          Gerencie suas informações pessoais, segurança e preferências
        </p>
      </div>

      <ProfileHeader />

      <Tabs defaultValue="personal" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="personal" className="flex items-center gap-2">
            <User className="w-4 h-4" />
            <span className="hidden sm:inline">Pessoal</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Lock className="w-4 h-4" />
            <span className="hidden sm:inline">Senha</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="w-4 h-4" />
            <span className="hidden sm:inline">Notificações</span>
          </TabsTrigger>
          <TabsTrigger value="advanced" className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            <span className="hidden sm:inline">Segurança</span>
          </TabsTrigger>
          <TabsTrigger value="activity" className="flex items-center gap-2">
            <Activity className="w-4 h-4" />
            <span className="hidden sm:inline">Atividade</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="personal" className="space-y-6 mt-6">
          <PersonalInfoForm />
        </TabsContent>

        <TabsContent value="security" className="space-y-6 mt-6">
          <PasswordChange />
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6 mt-6">
          <NotificationPreferences />
        </TabsContent>

        <TabsContent value="advanced" className="space-y-6 mt-6">
          <SecuritySettings />
        </TabsContent>

        <TabsContent value="activity" className="space-y-6 mt-6">
          <ActivityLog />
        </TabsContent>
      </Tabs>
    </div>
  );
};
