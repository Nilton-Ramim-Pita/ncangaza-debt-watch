import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { formatCurrencySimple, parseCurrency } from "@/utils/currency";

interface DebtFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: (data: DebtFormData) => void;
  clients?: Array<{ id: string; nome: string; nuit: string }>;
}

export interface DebtFormData {
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

export const DebtForm = ({ open, onOpenChange, onSubmit, clients = [] }: DebtFormProps) => {
  const [formData, setFormData] = useState<DebtFormData>({
    cliente_id: "",
    valor: 0,
    descricao: "",
    data_vencimento: "",
    status: "pendente",
  });
  const [valorDisplay, setValorDisplay] = useState("");
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
    
    // Validações
    if (!formData.cliente_id) {
      toast({
        title: "Erro",
        description: "Selecione um cliente",
        variant: "destructive",
      });
      return;
    }

    if (formData.valor <= 0) {
      toast({
        title: "Erro",
        description: "O valor deve ser maior que zero",
        variant: "destructive",
      });
      return;
    }

    if (!formData.descricao.trim()) {
      toast({
        title: "Erro",
        description: "A descrição é obrigatória",
        variant: "destructive",
      });
      return;
    }

    if (!formData.data_vencimento) {
      toast({
        title: "Erro",
        description: "A data de vencimento é obrigatória",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    try {
      if (onSubmit) {
        await onSubmit(formData);
      }
      
      // Reset form
      setFormData({
        cliente_id: "",
        valor: 0,
        descricao: "",
        data_vencimento: "",
        status: "pendente",
      });
      setValorDisplay("");
      
      onOpenChange(false);
      
      toast({
        title: "Sucesso",
        description: "Dívida adicionada com sucesso!",
      });
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
          <DialogTitle>Nova Dívida</DialogTitle>
          <DialogDescription>
            Registre uma nova dívida na base de dados da Ncangaza Multiservices
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
              {loading ? "Guardando..." : "Guardar Dívida"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};