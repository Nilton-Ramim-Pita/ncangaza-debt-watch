import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, AlertTriangle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatCurrencySimple } from "@/utils/currency";
import { useDebts } from "@/hooks/useDebts";

export const RecentDebts = () => {
  const { debts, loading } = useDebts();

  // Get only the first 5 debts for recent view
  const recentDebts = debts.slice(0, 5);

  const getStatusBadge = (status: string) => {
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
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin" />
            <p className="text-muted-foreground ml-2">Carregando dívidas...</p>
          </div>
        ) : recentDebts.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Nenhuma dívida encontrada</p>
          </div>
        ) : (
          <div className="space-y-4">
            {recentDebts.map((debt) => {
              const overdue = isOverdue(debt.data_vencimento, debt.status);
              
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
                        {debt.cliente?.nome || 'Cliente não encontrado'}
                      </h4>
                      {overdue && <AlertTriangle className="h-4 w-4 text-destructive" />}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      NUIT: {debt.cliente?.nuit || 'N/A'} • {debt.descricao}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Vencimento: {new Date(debt.data_vencimento).toLocaleDateString("pt-MZ")}
                    </p>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <p className="text-sm font-medium text-foreground">
                        {formatCurrencySimple(Number(debt.valor))}
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
        )}
      </CardContent>
    </Card>
  );
};