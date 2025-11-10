import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { clientSchema } from "@/lib/validations";
import { z } from "zod";

interface ClientFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: (data: ClientFormData) => void;
  initialData?: ClientFormData;
}

export interface ClientFormData {
  nome: string;
  nuit: string;
  email: string;
  telefone: string;
  endereco: string;
  ativo: boolean;
}

export const ClientForm = ({ open, onOpenChange, onSubmit, initialData }: ClientFormProps) => {
  const [formData, setFormData] = useState<ClientFormData>({
    nome: "",
    nuit: "",
    email: "",
    telefone: "",
    endereco: "",
    ativo: true,
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Atualizar formData quando initialData mudar
  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        nome: "",
        nuit: "",
        email: "",
        telefone: "",
        endereco: "",
        ativo: true,
      });
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate using Zod schema
    try {
      clientSchema.parse(formData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const firstError = error.errors[0];
        toast({
          title: "Erro de validação",
          description: firstError.message,
          variant: "destructive",
        });
        return;
      }
    }

    setLoading(true);
    
    try {
      let result: any = { success: false };
      if (!onSubmit) {
        toast({
          title: "Erro",
          description: "Ação indisponível no momento. Tente novamente.",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      result = await onSubmit(formData as any);
      
      if (result?.success) {
        // Reset form only if not editing
        if (!initialData) {
          setFormData({
            nome: "",
            nuit: "",
            email: "",
            telefone: "",
            endereco: "",
            ativo: true,
          });
        }
        
        toast({
          title: "✅ Sucesso",
          description: initialData ? "Cliente atualizado com sucesso!" : "Cliente adicionado com sucesso!",
        });
        
        onOpenChange(false);
        return;
      }
      
      // Trata erro com mensagens contextuais e dicas úteis
      const error = result?.error;
      let errorTitle = "Erro";
      let errorMessage = initialData ? "Erro ao atualizar cliente" : "Erro ao adicionar cliente";
      
      if (error?.code === '23505') {
        errorTitle = "⚠️ NUIT Duplicado";
        errorMessage = `O NUIT "${formData.nuit}" já está registado no sistema.\n\n💡 Dica: Verifique se este cliente já existe na lista ou use um NUIT diferente.`;
      } else if (error?.code === '23502') {
        errorTitle = "❌ Dados Obrigatórios";
        errorMessage = "Por favor, preencha todos os campos obrigatórios (Nome e NUIT).";
      } else if (error?.code === '23503') {
        errorTitle = "❌ Referência Inválida";
        errorMessage = "Erro de referência nos dados. Verifique as informações inseridas.";
      } else if (error?.message?.includes('invalid input syntax')) {
        errorTitle = "❌ Formato Inválido";
        errorMessage = "O formato dos dados está incorreto. Verifique os campos e tente novamente.";
      } else if (error?.message?.includes('permission')) {
        errorTitle = "🔒 Sem Permissão";
        errorMessage = "Você não tem permissão para realizar esta ação. Contacte o administrador.";
      } else if (error?.message) {
        errorMessage = `${errorMessage}: ${error.message}`;
      }
      
      console.error("Erro ao salvar cliente:", error);
      
      toast({
        title: errorTitle,
        description: errorMessage,
        variant: "destructive",
      });
      return;
    } catch (error) {
      console.error("Erro ao salvar cliente:", error);
      toast({
        title: "Erro",
        description: initialData ? "Erro ao atualizar cliente" : "Erro ao adicionar cliente",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof ClientFormData, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{initialData ? 'Editar Cliente' : 'Novo Cliente'}</DialogTitle>
          <DialogDescription>
            {initialData ? 'Edite os dados do cliente.' : 'Adicione um novo cliente à base de dados da Ncangaza Multiservices'}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="nome">Nome Completo *</Label>
              <Input
                id="nome"
                value={formData.nome}
                onChange={(e) => handleInputChange("nome", e.target.value)}
                placeholder="Ex: João Manuel Silva"
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="nuit">NUIT *</Label>
                <Input
                  id="nuit"
                  value={formData.nuit}
                  onChange={(e) => handleInputChange("nuit", e.target.value)}
                  placeholder="123456789"
                  required
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="telefone">Telefone</Label>
                <Input
                  id="telefone"
                  value={formData.telefone}
                  onChange={(e) => handleInputChange("telefone", e.target.value)}
                  placeholder="+258 84 123 4567"
                />
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="cliente@email.com"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="endereco">Endereço</Label>
              <Textarea
                id="endereco"
                value={formData.endereco}
                onChange={(e) => handleInputChange("endereco", e.target.value)}
                placeholder="Av. Julius Nyerere, Bairro Central, Tete"
                rows={3}
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="ativo"
                checked={formData.ativo}
                onCheckedChange={(checked) => handleInputChange("ativo", checked)}
              />
              <Label htmlFor="ativo">Cliente ativo</Label>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancelar
            </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Guardando..." : (initialData ? "Atualizar Cliente" : "Guardar Cliente")}
          </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};