import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Search, 
  Plus, 
  Eye, 
  Edit, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Filter
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatCurrencySimple, formatCurrency } from "@/utils/currency";
import { generatePDF, downloadPDF } from "@/utils/pdfGenerator";
import { FileDown } from "lucide-react";
import { useState } from "react";
import { DebtForm, type DebtFormData } from "@/components/forms/DebtForm";
import { useDebts } from "@/hooks/useDebts";
import { useClients } from "@/hooks/useClients";
import { useToast } from "@/hooks/use-toast";

interface Debt {
  id: string;
  clientName: string;
  clientNuit: string;
  amount: number;
  description: string;
  creationDate: string;
  dueDate: string;
  status: "pendente" | "paga" | "vencida";
  category: string;
}

const mockDebts: Debt[] = [
  {
    id: "D001",
    clientName: "João Mutema Silva",
    clientNuit: "123456789",  
    amount: 75000,
    description: "Serviços de consultoria empresarial",
    creationDate: "2024-01-01",
    dueDate: "2024-01-15",
    status: "vencida",
    category: "Consultoria"
  },
  {
    id: "D002",
    clientName: "Maria Joaquina Banda",
    clientNuit: "987654321",
    amount: 42000,
    description: "Fornecimento de material de construção",
    creationDate: "2024-01-05",
    dueDate: "2024-01-18",
    status: "pendente",
    category: "Material"
  },
  {
    id: "D003",
    clientName: "Carlos Mandlate Nhongo",
    clientNuit: "456789123",
    amount: 128000,
    description: "Equipamentos informáticos - Dell OptiPlex",
    creationDate: "2024-01-08",
    dueDate: "2024-01-20",
    status: "pendente",
    category: "Equipamentos"
  },
  {
    id: "D004",
    clientName: "Ana Cristina Macome",
    clientNuit: "789123456",
    amount: 89500,
    description: "Campanha de marketing digital",
    creationDate: "2023-12-15",
    dueDate: "2024-01-12",
    status: "paga",
    category: "Marketing"
  },
  {
    id: "D005",
    clientName: "Pedro Antônio Machel",
    clientNuit: "321654987",
    amount: 156000,
    description: "Desenvolvimento de software personalizado",
    creationDate: "2024-01-10",
    dueDate: "2024-01-22",
    status: "vencida",
    category: "Software"
  },
  {
    id: "D006",
    clientName: "João Mutema Silva",
    clientNuit: "123456789",
    amount: 23000,
    description: "Manutenção de equipamentos",
    creationDate: "2024-01-12",
    dueDate: "2024-01-25",
    status: "pendente",
    category: "Manutenção"
  }
];

export const DebtsTable = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showDebtForm, setShowDebtForm] = useState(false);
  const [editingDebt, setEditingDebt] = useState<DebtFormData | undefined>();
  
  const { debts, loading, createDebt, updateDebt, deleteDebt } = useDebts();
  const { clients } = useClients();
  const { toast } = useToast();

  // Filter debts based on search and status
  const filteredDebts = debts.filter(debt => {
    const client = clients.find(c => c.id === debt.cliente_id);
    const matchesSearch = !searchTerm || 
      client?.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client?.nuit?.includes(searchTerm) ||
      debt.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
      debt.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || debt.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleAddDebt = async (debtData: DebtFormData) => {
    try {
      if (editingDebt?.id) {
        await updateDebt(editingDebt.id, debtData);
        toast({
          title: "Sucesso",
          description: "Dívida actualizada com sucesso!",
        });
      } else {
        await createDebt(debtData);
        toast({
          title: "Sucesso", 
          description: "Dívida adicionada com sucesso!",
        });
      }
      setEditingDebt(undefined);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao processar dívida",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (debt: any) => {
    setEditingDebt({
      id: debt.id,
      cliente_id: debt.cliente_id,
      valor: Number(debt.valor),
      descricao: debt.descricao,
      data_vencimento: debt.data_vencimento,
      status: debt.status,
    });
    setShowDebtForm(true);
  };

  const handleCloseForm = () => {
    setShowDebtForm(false);
    setEditingDebt(undefined);
  };

  const getStatusBadge = (status: "pendente" | "paga" | "vencida") => {
    switch (status) {
      case "paga":
        return (
          <Badge className="bg-green-100 text-green-800">
            <CheckCircle className="mr-1 h-3 w-3" />
            Paga
          </Badge>
        );
      case "pendente":
        return (
          <Badge variant="secondary">
            <Clock className="mr-1 h-3 w-3" />
            Pendente
          </Badge>
        );
      case "vencida":
        return (
          <Badge className="bg-red-100 text-red-800">
            <AlertTriangle className="mr-1 h-3 w-3" />
            Vencida
          </Badge>
        );
      default:
        return <Badge variant="outline">Indefinido</Badge>;
    }
  };

  const getDaysUntilDue = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handleExportPDF = () => {
    const headers = ['ID', 'Cliente', 'NUIT', 'Descrição', 'Valor', 'Vencimento', 'Status'];
    const data = filteredDebts.map(debt => {
      const client = clients.find(c => c.id === debt.cliente_id);
      return [
        debt.id.slice(0, 8),
        client?.nome || 'N/A',
        client?.nuit || 'N/A',
        debt.descricao,
        formatCurrency(Number(debt.valor)),
        new Date(debt.data_vencimento).toLocaleDateString('pt-PT'),
        debt.status
      ];
    });

    const totalValue = filteredDebts.reduce((sum, debt) => sum + Number(debt.valor), 0);
    const summaryData = [
      { label: 'Total de Dívidas', value: filteredDebts.length.toString() },
      { label: 'Valor Total', value: formatCurrency(totalValue) },
      { label: 'Status Filtrado', value: statusFilter === 'all' ? 'Todos' : statusFilter }
    ];

    const doc = generatePDF(
      {
        title: 'Relatório de Dívidas',
        subtitle: `Filtro: ${statusFilter === 'all' ? 'Todas as dívidas' : statusFilter}`,
        orientation: 'landscape',
        showLogo: true,
        filename: 'relatorio_dividas'
      },
      headers,
      data,
      summaryData
    );

    downloadPDF(doc, 'relatorio_dividas');
    
    toast({
      title: "✅ PDF Gerado",
      description: "Relatório de dívidas exportado com sucesso!",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Dívidas</h2>
          <p className="text-muted-foreground">
            Controle completo das dívidas em aberto
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExportPDF}>
            <FileDown className="mr-2 h-4 w-4" />
            Exportar PDF
          </Button>
          <Button className="bg-primary hover:bg-primary/90" onClick={() => setShowDebtForm(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Nova Dívida
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Lista de Dívidas
            <div className="flex items-center space-x-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="pendente">Pendentes</SelectItem>
                  <SelectItem value="vencida">Vencidas</SelectItem>
                  <SelectItem value="paga">Pagas</SelectItem>
                </SelectContent>
              </Select>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Buscar dívidas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-80"
                />
              </div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Carregando dívidas...</p>
            </div>
          ) : filteredDebts.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Nenhuma dívida encontrada</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Vencimento</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDebts.map((debt) => {
                  const client = clients.find(c => c.id === debt.cliente_id);
                  const daysUntilDue = getDaysUntilDue(debt.data_vencimento);
                  const isUrgent = daysUntilDue <= 3 && debt.status === "pendente";
                  
                  return (
                    <TableRow 
                      key={debt.id} 
                      className={cn(
                        "hover:bg-muted/50",
                        debt.status === "vencida" && "bg-red-50 border-l-4 border-l-red-500",
                        isUrgent && "bg-yellow-50 border-l-4 border-l-yellow-500"
                      )}
                    >
                      <TableCell className="font-mono font-medium">
                        {debt.id.slice(0, 8)}
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium text-foreground">{client?.nome || 'Cliente não encontrado'}</div>
                          <div className="text-sm text-muted-foreground font-mono">
                            NUIT: {client?.nuit || 'N/A'}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-xs">
                          <div className="font-medium text-sm">{debt.descricao}</div>
                          <div className="text-xs text-muted-foreground">
                            Criado: {new Date(debt.data_criacao).toLocaleDateString("pt-MZ")}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-bold text-foreground">
                          {formatCurrency(Number(debt.valor))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {new Date(debt.data_vencimento).toLocaleDateString("pt-MZ")}
                          </div>
                          {debt.status === "pendente" && (
                            <div className={cn(
                              "text-xs",
                              daysUntilDue < 0 && "text-red-600",
                              daysUntilDue <= 3 && daysUntilDue >= 0 && "text-yellow-600",
                              daysUntilDue > 3 && "text-muted-foreground"
                            )}>
                              {daysUntilDue < 0 
                                ? `${Math.abs(daysUntilDue)} dias em atraso`
                                : daysUntilDue === 0 
                                  ? "Vence hoje"
                                  : `${daysUntilDue} dias restantes`
                              }
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(debt.status)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleEdit(debt)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
      
      <DebtForm 
        open={showDebtForm}
        onOpenChange={handleCloseForm}
        onSubmit={handleAddDebt}
        clients={clients}
        editData={editingDebt}
      />
    </div>
  );
};