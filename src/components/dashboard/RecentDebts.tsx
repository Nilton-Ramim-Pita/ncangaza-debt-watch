import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface Debt {
  id: string;
  client: string;
  nuit: string;
  amount: number;
  dueDate: string;
  status: "pendente" | "vencida" | "paga";
  description: string;
}

const recentDebts: Debt[] = [
  {
    id: "D001",
    client: "João Mutema Silva",
    nuit: "123456789",
    amount: 75000,
    dueDate: "2024-01-15",
    status: "vencida",
    description: "Serviços de consultoria"
  },
  {
    id: "D002",
    client: "Maria Joaquina Banda",
    nuit: "987654321",
    amount: 42000,
    dueDate: "2024-01-18",
    status: "pendente",
    description: "Material de construção"
  },
  {
    id: "D003",
    client: "Carlos Mandlate Nhongo",
    nuit: "456789123",
    amount: 128000,
    dueDate: "2024-01-20",
    status: "pendente",
    description: "Equipamentos informáticos"
  },
  {
    id: "D004",
    client: "Ana Cristina Macome",
    nuit: "789123456",
    amount: 89500,
    dueDate: "2024-01-12",
    status: "paga",
    description: "Serviços de marketing"
  },
  {
    id: "D005",
    client: "Pedro Antônio Machel",
    nuit: "321654987",
    amount: 156000,
    dueDate: "2024-01-22",
    status: "vencida",
    description: "Software personalizado"
  }
];

const getStatusBadge = (status: Debt["status"]) => {
  switch (status) {
    case "paga":
      return <Badge className="bg-success text-success-foreground">Paga</Badge>;
    case "pendente":
      return <Badge variant="secondary">Pendente</Badge>;
    case "vencida":
      return <Badge className="bg-destructive text-destructive-foreground">Vencida</Badge>;
    default:
      return <Badge variant="outline">Desconhecido</Badge>;
  }
};

const isOverdue = (dueDate: string, status: string) => {
  const today = new Date();
  const due = new Date(dueDate);
  return status !== "paga" && due < today;
};

export const RecentDebts = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Dívidas Recentes
          <Button variant="outline" size="sm">
            Ver Todas
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentDebts.map((debt) => {
            const overdue = isOverdue(debt.dueDate, debt.status);
            
            return (
              <div
                key={debt.id}
                className={cn(
                  "flex items-center justify-between p-4 rounded-lg border transition-colors",
                  overdue && "border-destructive/20 bg-destructive/5",
                  !overdue && "hover:bg-muted/50"
                )}
              >
                <div className="flex-1 space-y-1">
                  <div className="flex items-center space-x-2">
                    <h4 className="text-sm font-medium text-foreground">
                      {debt.client}
                    </h4>
                    {overdue && <AlertTriangle className="h-4 w-4 text-destructive" />}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    NUIT: {debt.nuit} • {debt.description}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Vencimento: {new Date(debt.dueDate).toLocaleDateString("pt-MZ")}
                  </p>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <p className="text-sm font-medium text-foreground">
                      MZN {debt.amount.toLocaleString()}
                    </p>
                    {getStatusBadge(debt.status)}
                  </div>
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};