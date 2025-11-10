import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { formatCurrencySimple, parseCurrency } from "@/utils/currency";
import { debtSchema } from "@/lib/validations";
import { z } from "zod";

interface DebtFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: (data: DebtFormData) => void;
  clients?: Array<{ id: string; nome: string; nuit: string }>;
  editData?: DebtFormData;
}

export interface DebtFormData {
  id?: string;
  cliente_id: string;
  valor: number;
  descricao: string;
  data_vencimento: string;
  status: "pendente" | "paga" | "vencida";
}

const categorias = [
  "Consultoria",
  "Material",
  "Equipamentos", 
  "Software",
  "Marketing",
  "Manutenção",
  "Treinamento",
  "Licenciamento",
  "Outros"
];

export const DebtForm = ({ open, onOpenChange, onSubmit, clients = [], editData }: DebtFormProps) => {
  const [formData, setFormData] = useState<DebtFormData>({
    cliente_id: "",
    valor: 0,
    descricao: "",
    data_vencimento: "",
    status: "pendente",
  });
  const [valorDisplay, setValorDisplay] = useState("");

  // Load edit data when provided
  useEffect(() => {
    if (editData) {
      setFormData(editData);
      setValorDisplay(editData.valor.toString());
    } else {
      setFormData({
        cliente_id: "",
        valor: 0,
        descricao: "",
        data_vencimento: "",
        status: "pendente",
      });
      setValorDisplay("");
    }
  }, [editData]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Mock clients se não fornecidos
  const mockClients = [
    { id: "1", nome: "João Manuel Silva", nuit: "123456789" },
    { id: "2", nome: "Maria José Santos", nuit: "987654321" },
    { id: "3", nome: "António Carlos Mabote", nuit: "456789123" },
  ];

  const clientsData = clients.length > 0 ? clients : mockClients;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate using Zod schema
    try {
      debtSchema.parse(formData);
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
        if (!editData) {
          setFormData({
            cliente_id: "",
            valor: 0,
            descricao: "",
            data_vencimento: "",
            status: "pendente",
          });
          setValorDisplay("");
        }
        
        toast({
          title: "✅ Sucesso",
          description: editData ? "Dívida actualizada com sucesso!" : "Dívida adicionada com sucesso!",
        });
        
        onOpenChange(false);
        return;
      }
      
      // Trata erro com mensagem específica
      const error = result?.error;
      let errorMessage = editData ? "Erro ao actualizar dívida" : "Erro ao adicionar dívida";
      
      if (error?.message) {
        errorMessage = `${errorMessage}: ${error.message}`;
      }
      
      console.error("Erro ao salvar dívida:", error);
      
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      });
      return;
    } catch (error) {
      console.error("Erro ao salvar dívida:", error);
      toast({
        title: "Erro",
        description: "Erro ao adicionar dívida",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof DebtFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleValorChange = (value: string) => {
    setValorDisplay(value);
    const parsedValue = parseCurrency(value);
    setFormData(prev => ({
      ...prev,
      valor: parsedValue,
    }));
  };

  // Set minimum date to today
  const today = new Date().toISOString().split('T')[0];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{editData ? "Editar Dívida" : "Nova Dívida"}</DialogTitle>
          <DialogDescription>
            {editData ? "Edite os dados da dívida" : "Registre uma nova dívida na base de dados da Ncangaza Multiservices"}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="cliente">Cliente *</Label>
              <Select value={formData.cliente_id} onValueChange={(value) => handleInputChange("cliente_id", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um cliente" />
                </SelectTrigger>
                <SelectContent>
                  {clientsData.map((client) => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.nome} (NUIT: {client.nuit})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="valor">Valor (MZN) *</Label>
              <Input
                id="valor"
                value={valorDisplay}
                onChange={(e) => handleValorChange(e.target.value)}
                placeholder="Ex: 15000,00"
                required
              />
              {formData.valor > 0 && (
                <p className="text-sm text-muted-foreground">
                  {formatCurrencySimple(formData.valor)}
                </p>
              )}
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="descricao">Descrição *</Label>
              <Textarea
                id="descricao"
                value={formData.descricao}
                onChange={(e) => handleInputChange("descricao", e.target.value)}
                placeholder="Descrição detalhada dos serviços/produtos"
                rows={3}
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="data_vencimento">Data de Vencimento *</Label>
                <Input
                  id="data_vencimento"
                  type="date"
                  value={formData.data_vencimento}
                  onChange={(e) => handleInputChange("data_vencimento", e.target.value)}
                  min={today}
                  required
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pendente">Pendente</SelectItem>
                    <SelectItem value="paga">Paga</SelectItem>
                    <SelectItem value="vencida">Vencida</SelectItem>
                  </SelectContent>
                </Select>
              </div>
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
              {loading ? "Guardando..." : (editData ? "Actualizar Dívida" : "Guardar Dívida")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};