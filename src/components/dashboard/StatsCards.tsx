import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, DollarSign, Clock, CheckCircle, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

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
          <span className={cn(
            "flex items-center",
            changeType === "positive" && "text-success",
            changeType === "negative" && "text-destructive",
            changeType === "neutral" && "text-muted-foreground"
          )}>
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
  const stats = [
    {
      title: "Total de Dívidas",
      value: "MZN 2.847.550,00",
      change: "+12.5%",
      changeType: "positive" as const,
      icon: <DollarSign className="h-4 w-4" />,
      description: "vs. mês anterior"
    },
    {
      title: "Dívidas Vencidas",
      value: "MZN 486.200,00",
      change: "+8.2%",
      changeType: "negative" as const,
      icon: <AlertTriangle className="h-4 w-4" />,
      description: "requer atenção"
    },
    {
      title: "Próximas a Vencer",
      value: "MZN 123.450,00",
      change: "7 dívidas",
      changeType: "neutral" as const,
      icon: <Clock className="h-4 w-4" />,
      description: "próximos 7 dias"
    },
    {
      title: "Dívidas Pagas",
      value: "MZN 1.654.300,00",
      change: "+15.3%",
      changeType: "positive" as const,
      icon: <CheckCircle className="h-4 w-4" />,
      description: "este mês"
    }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  );
};