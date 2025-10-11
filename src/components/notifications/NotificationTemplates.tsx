import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { Loader2, Plus, Pencil, Trash2, Mail, Bell, Send } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';

interface NotificationTemplate {
  id: string;
  type: 'email' | 'in_app';
  name: string;
  subject: string;
  body: string;
  is_default: boolean;
  created_at: string;
}

export const NotificationTemplates = () => {
  const [templates, setTemplates] = useState<NotificationTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<NotificationTemplate | null>(null);
  const [testEmail, setTestEmail] = useState('');
  const [testing, setTesting] = useState(false);

  const [formData, setFormData] = useState({
    type: 'email' as 'email' | 'in_app',
    name: '',
    subject: '',
    body: '',
    is_default: false,
  });

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      const { data, error } = await supabase
        .from('notification_templates')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTemplates((data || []) as NotificationTemplate[]);
    } catch (error: any) {
      console.error('Erro ao carregar templates:', error);
      toast.error('Erro ao carregar templates de notificação');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (editingTemplate) {
        const { error } = await supabase
          .from('notification_templates')
          .update(formData)
          .eq('id', editingTemplate.id);

        if (error) throw error;
        toast.success('Template atualizado com sucesso');
      } else {
        const { error } = await supabase
          .from('notification_templates')
          .insert([formData]);

        if (error) throw error;
        toast.success('Template criado com sucesso');
      }

      setIsDialogOpen(false);
      resetForm();
      loadTemplates();
    } catch (error: any) {
      console.error('Erro ao salvar template:', error);
      toast.error('Erro ao salvar template');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este template?')) return;

    try {
      const { error } = await supabase
        .from('notification_templates')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Template excluído com sucesso');
      loadTemplates();
    } catch (error: any) {
      console.error('Erro ao excluir template:', error);
      toast.error('Erro ao excluir template');
    }
  };

  const handleEdit = (template: NotificationTemplate) => {
    setEditingTemplate(template);
    setFormData({
      type: template.type,
      name: template.name,
      subject: template.subject,
      body: template.body,
      is_default: template.is_default,
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setEditingTemplate(null);
    setFormData({
      type: 'email',
      name: '',
      subject: '',
      body: '',
      is_default: false,
    });
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    resetForm();
  };

  const handleTestSend = async (template: NotificationTemplate) => {
    if (!testEmail) {
      toast.error('Por favor, insira um email para teste');
      return;
    }

    setTesting(true);
    try {
      const { error } = await supabase.functions.invoke('send-email', {
        body: {
          to: testEmail,
          subject: template.subject,
          message: template.body
            .replace(/{{cliente_nome}}/g, 'João Silva (Teste)')
            .replace(/{{valor}}/g, '5,000.00')
            .replace(/{{data_vencimento}}/g, new Date().toLocaleDateString('pt-MZ'))
            .replace(/{{descricao}}/g, 'Teste de template'),
        },
      });

      if (error) throw error;
      toast.success('Email de teste enviado com sucesso!');
      setTestEmail('');
    } catch (error: any) {
      console.error('Erro ao enviar email de teste:', error);
      toast.error('Erro ao enviar email de teste');
    } finally {
      setTesting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Templates de Notificação</h2>
          <p className="text-muted-foreground">
            Gerencie os templates para notificações automáticas
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Novo Template
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingTemplate ? 'Editar Template' : 'Novo Template'}
              </DialogTitle>
              <DialogDescription>
                Use variáveis: {'{{cliente_nome}}'}, {'{{valor}}'}, {'{{data_vencimento}}'}, {'{{descricao}}'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="type">Tipo</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value: 'email' | 'in_app') =>
                    setFormData({ ...formData, type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="in_app">Notificação In-App</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Nome do Template</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Ex: Aviso de Dívida Cadastrada"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">Assunto (para emails)</Label>
                <Input
                  id="subject"
                  value={formData.subject}
                  onChange={(e) =>
                    setFormData({ ...formData, subject: e.target.value })
                  }
                  placeholder="Ex: Nova dívida registrada com sucesso"
                  required={formData.type === 'email'}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="body">Mensagem</Label>
                <Textarea
                  id="body"
                  value={formData.body}
                  onChange={(e) =>
                    setFormData({ ...formData, body: e.target.value })
                  }
                  placeholder="Corpo da notificação..."
                  rows={6}
                  required
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="is_default"
                  checked={formData.is_default}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, is_default: checked })
                  }
                />
                <Label htmlFor="is_default">Template padrão</Label>
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleDialogClose}
                  disabled={saving}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={saving}>
                  {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  {editingTemplate ? 'Atualizar' : 'Criar'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {templates.map((template) => (
          <Card key={template.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    {template.type === 'email' ? (
                      <Mail className="h-4 w-4 text-blue-500" />
                    ) : (
                      <Bell className="h-4 w-4 text-green-500" />
                    )}
                    <CardTitle className="text-lg">{template.name}</CardTitle>
                    {template.is_default && (
                      <Badge variant="secondary">Padrão</Badge>
                    )}
                  </div>
                  <CardDescription>
                    {template.type === 'email' ? (
                      <>Email: {template.subject}</>
                    ) : (
                      'Notificação In-App'
                    )}
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(template)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(template.id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <pre className="text-sm bg-muted p-3 rounded whitespace-pre-wrap">
                {template.body}
              </pre>
              
              {template.type === 'email' && (
                <div className="mt-4 pt-4 border-t">
                  <Label htmlFor={`test-email-${template.id}`}>Testar envio</Label>
                  <div className="flex gap-2 mt-2">
                    <Input
                      id={`test-email-${template.id}`}
                      type="email"
                      placeholder="email@exemplo.com"
                      value={testEmail}
                      onChange={(e) => setTestEmail(e.target.value)}
                      disabled={testing}
                    />
                    <Button
                      variant="outline"
                      onClick={() => handleTestSend(template)}
                      disabled={testing || !testEmail}
                    >
                      {testing ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Send className="h-4 w-4" />
                      )}
                      <span className="ml-2">Enviar Teste</span>
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
