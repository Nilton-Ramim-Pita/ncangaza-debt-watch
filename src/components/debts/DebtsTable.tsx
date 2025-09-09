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
import { formatCurrencySimple } from "@/utils/currency";
import { useState } from "react";
import { DebtForm, type DebtFormData } from "@/components/forms/DebtForm";

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
  const [filteredDebts, setFilteredDebts] = useState(mockDebts);
  const [showDebtForm, setShowDebtForm] = useState(false);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    applyFilters(value, statusFilter);
  };

  const handleStatusFilter = (status: string) => {
    setStatusFilter(status);
    applyFilters(searchTerm, status);
  };

  const applyFilters = (search: string, status: string) => {
    let filtered = mockDebts.filter(debt =>
      debt.clientName.toLowerCase().includes(search.toLowerCase()) ||
      debt.clientNuit.includes(search) ||
      debt.description.toLowerCase().includes(search.toLowerCase()) ||
      debt.id.toLowerCase().includes(search.toLowerCase())
    );
    if (status !== "all") {
      filtered = filtered.filter(debt => debt.status === status);
    }
    setFilteredDebts(filtered);
  };

  const handleAddDebt = async (debtData: DebtFormData) => {
    // TODO: Integrate with Supabase when tables are created
    console.log("Nova dívida:", debtData);
    
    // For now, add to mock data
    const newDebt = {
      id: `D${(mockDebts.length + 1).toString().padStart(3, '0')}`,
      clientName: "Cliente Exemplo", // Would get from client_id
      clientNuit: "123456789", // Would get from client_id
      amount: debtData.valor,
      description: debtData.descricao,
      creationDate: new Date().toISOString().split('T')[0],
      dueDate: debtData.data_vencimento,
      status: debtData.status,
      category: "Geral"
    };
    
    setFilteredDebts(prev => [newDebt, ...prev]);
  };

  const getStatusBadge = (status: Debt["status"]) => {
    switch (status) {
      case "paga":
        return (
          <Badge className="bg-success text-success-foreground">
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
          <Badge className="bg-destructive text-destructive-foreground">
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Dívidas</h2>
          <p className="text-muted-foreground">
            Controle completo das dívidas em aberto
          </p>
        </div>
        <Button className="bg-primary hover:bg-primary/90" onClick={() => setShowDebtForm(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nova Dívida
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Lista de Dívidas
            <div className="flex items-center space-x-2">
              <Select value={statusFilter} onValueChange={handleStatusFilter}>
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
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10 w-80"
                />
              </div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Vencimento</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDebts.map((debt) => {
                const daysUntilDue = getDaysUntilDue(debt.dueDate);
                const isUrgent = daysUntilDue <= 3 && debt.status === "pendente";
                
                return (
                  <TableRow 
                    key={debt.id} 
                    className={cn(
                      "hover:bg-muted/50",
                      debt.status === "vencida" && "bg-destructive/5 border-l-4 border-l-destructive",
                      isUrgent && "bg-warning/5 border-l-4 border-l-warning"
                    )}
                  >
                    <TableCell className="font-mono font-medium">
                      {debt.id}
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium text-foreground">{debt.clientName}</div>
                        <div className="text-sm text-muted-foreground font-mono">
                          NUIT: {debt.clientNuit}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-xs">
                        <div className="font-medium text-sm">{debt.description}</div>
                        <div className="text-xs text-muted-foreground">
                          Criado: {new Date(debt.creationDate).toLocaleDateString("pt-MZ")}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-bold text-foreground">
                        {formatCurrencySimple(debt.amount)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          {new Date(debt.dueDate).toLocaleDateString("pt-MZ")}
                        </div>
                        {debt.status === "pendente" && (
                          <div className={cn(
                            "text-xs",
                            daysUntilDue < 0 && "text-destructive",
                            daysUntilDue <= 3 && daysUntilDue >= 0 && "text-warning",
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
                    <TableCell>
                      <Badge variant="outline" className="text-xs">
                        {debt.category}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <DebtForm 
        open={showDebtForm}
        onOpenChange={setShowDebtForm}
        onSubmit={handleAddDebt}
      />
    </div>
  );
};