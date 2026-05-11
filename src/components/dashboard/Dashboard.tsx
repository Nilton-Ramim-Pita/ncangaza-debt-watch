import { StatsCards } from "./StatsCards";
import { DebtChart } from "./DebtChart";
import { RecentDebts } from "./RecentDebts";
import { useStats } from "@/hooks/useStats";

interface DashboardProps {
  onNavigate?: (tab: string, debtId?: string) => void;
}

export const Dashboard = ({ onNavigate }: DashboardProps) => {
  useStats();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-foreground">Painel de Controlo</h2>
        <p className="text-muted-foreground">
          Visão geral do sistema de gestão de dívidas da Ncangaza Multiservices
        </p>
      </div>
      
      <StatsCards />
      
      <DebtChart />
      
      <RecentDebts
        onViewAll={() => onNavigate?.("debts")}
        onViewDebt={(debtId) => onNavigate?.("debts", debtId)}
      />
    </div>
  );
};
