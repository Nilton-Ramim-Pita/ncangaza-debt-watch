import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, DollarSign, Users, AlertTriangle, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatCurrencySimple } from "@/utils/currency";
import { useStats } from "@/hooks/useStats";

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  changeType: "positive" | "negative" | "neutral";
  icon: React.ReactNode;
  description: string;
}

const StatCard = ({ title, value, change, changeType, icon, description }: StatCardProps) => {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className="h-4 w-4 text-muted-foreground">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-foreground">{value}</div>
        <div className="flex items-center space-x-2 text-xs text-muted-foreground">
          <span
            className={cn(
              "flex items-center",
              changeType === "positive" && "text-success",
              changeType === "negative" && "text-destructive",
              changeType === "neutral" && "text-muted-foreground"
            )}
          >
            {changeType === "positive" && <TrendingUp className="w-3 h-3 mr-1" />}
            {changeType === "negative" && <TrendingDown className="w-3 h-3 mr-1" />}
            {change}
          </span>
          <span>{description}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export const StatsCards = () => {
  const { stats, loading } = useStats();

  const cards = [
    {
      title: "Clientes",
      value: loading ? "—" : String(stats.totalClients ?? 0),
      change: "",
      changeType: "neutral" as const,
      icon: <Users className="h-4 w-4" />,
      description: "dados em tempo real",
    },
    {
      title: "Dívidas (quantidade)",
      value: loading ? "—" : String(stats.totalDebts ?? 0),
      change: "",
      changeType: "neutral" as const,
      icon: <CheckCircle className="h-4 w-4" />,
      description: "dados em tempo real",
    },
    {
      title: "Valor Total",
      value: loading ? "—" : formatCurrencySimple(stats.totalValue ?? 0),
      change: "",
      changeType: "neutral" as const,
      icon: <DollarSign className="h-4 w-4" />,
      description: "dados em tempo real",
    },
    {
      title: "Valor Vencido",
      value: loading ? "—" : formatCurrencySimple(stats.overdueValue ?? 0),
      change: "",
      changeType: "neutral" as const,
      icon: <AlertTriangle className="h-4 w-4" />,
      description: "dados em tempo real",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  );
};