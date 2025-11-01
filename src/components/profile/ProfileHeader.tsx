import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Camera, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export const ProfileHeader = () => {
  const { profile, user, userRole } = useAuth();
  const [uploading, setUploading] = useState(false);

  const getRoleDisplay = (role: string) => {
    switch (role) {
      case 'admin': return 'Administrador';
      case 'manager': return 'Gerente';
      case 'user': return 'Usuário';
      default: return role;
    }
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'admin': return 'default';
      case 'manager': return 'secondary';
      case 'user': return 'outline';
      default: return 'outline';
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    // Validate file
    if (!file.type.startsWith('image/')) {
      toast.error('Por favor, selecione uma imagem');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error('A imagem deve ter no máximo 2MB');
      return;
    }

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;

      // Upload to storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      // Update profile
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('user_id', user.id);

      if (updateError) throw updateError;

      toast.success('Foto de perfil atualizada!');
      
      // Refresh page to show new avatar
      window.location.reload();
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast.error('Erro ao carregar foto de perfil');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row items-center gap-6 p-6 bg-card rounded-lg border">
      <div className="relative">
        <Avatar className="w-32 h-32 border-4 border-primary/20">
          <AvatarImage src={profile?.avatar_url || undefined} />
          <AvatarFallback className="text-4xl bg-primary/10 text-primary">
            {profile?.full_name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
          </AvatarFallback>
        </Avatar>
        
        <label className="absolute bottom-0 right-0 cursor-pointer">
          <div className="bg-primary text-primary-foreground p-2 rounded-full shadow-lg hover:bg-primary/90 transition-colors">
            {uploading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Camera className="w-5 h-5" />
            )}
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={handleAvatarUpload}
            className="hidden"
            disabled={uploading}
          />
        </label>
      </div>

      <div className="flex-1 text-center md:text-left">
        <h1 className="text-3xl font-bold text-foreground">{profile?.full_name}</h1>
        <p className="text-muted-foreground mt-1">{user?.email}</p>
        {profile?.cargo && (
          <p className="text-sm text-muted-foreground mt-1">{profile.cargo}</p>
        )}
        <div className="flex items-center gap-2 mt-3 justify-center md:justify-start">
          <Badge variant={getRoleBadgeVariant(userRole || 'user')}>
            {getRoleDisplay(userRole || 'user')}
          </Badge>
          {profile?.departamento && (
            <Badge variant="outline">{profile.departamento}</Badge>
          )}
        </div>
      </div>
    </div>
  );
};
