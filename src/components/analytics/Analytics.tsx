import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import { TrendingUp, TrendingDown, Target, DollarSign } from "lucide-react";
import { cn } from "@/lib/utils";

const performanceData = [
  { month: "Jul", colecao: 85, meta: 90 },
  { month: "Ago", colecao: 78, meta: 90 },
  { month: "Set", colecao: 92, meta: 90 },
  { month: "Out", colecao: 88, meta: 90 },
  { month: "Nov", colecao: 95, meta: 90 },
  { month: "Dez", colecao: 91, meta: 90 },
  { month: "Jan", colecao: 87, meta: 90 }
];

const cashFlowData = [
  { week: "S1", entrada: 45000, saida: 32000 },
  { week: "S2", entrada: 52000, saida: 38000 },
  { week: "S3", entrada: 38000, saida: 41000 },
  { week: "S4", entrada: 61000, saida: 35000 },
  { week: "S5", entrada: 55000, saida: 42000 }
];

interface MetricCardProps {
  title: string;
  value: string;
  change: string;
  changeType: "positive" | "negative";
  icon: React.ReactNode;
}

const MetricCard = ({ title, value, change, changeType, icon }: MetricCardProps) => {
  return (
    <Card>
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
        <div className="flex items-center space-x-2 text-xs">
          <span className={cn(
            "flex items-center",
            changeType === "positive" && "text-success",
            changeType === "negative" && "text-destructive"
          )}>
            {changeType === "positive" ? (
              <TrendingUp className="w-3 h-3 mr-1" />
            ) : (
              <TrendingDown className="w-3 h-3 mr-1" />
            )}
            {change}
          </span>
          <span className="text-muted-foreground">vs. período anterior</span>
        </div>
      </CardContent>
    </Card>
  );
};

export const Analytics = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-foreground">Analytics</h2>
        <p className="text-muted-foreground">
          Métricas avançadas e análise de performance
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Taxa de Cobrança"
          value="87.5%"
          change="+5.2%"
          changeType="positive"
          icon={<Target className="h-4 w-4" />}
        />
        <MetricCard
          title="Tempo Médio de Cobrança"
          value="12 dias"
          change="-2 dias"
          changeType="positive"
          icon={<TrendingUp className="h-4 w-4" />}
        />
        <MetricCard
          title="Volume Médio"
          value="MZN 45.2K"
          change="+12.3%"
          changeType="positive"
          icon={<DollarSign className="h-4 w-4" />}
        />
        <MetricCard
          title="Inadimplência"
          value="8.3%"
          change="+1.2%"
          changeType="negative"
          icon={<TrendingDown className="h-4 w-4" />}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Performance de Cobrança</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="month" 
                  tick={{ fill: "hsl(var(--foreground))", fontSize: 12 }}
                />
                <YAxis 
                  tick={{ fill: "hsl(var(--foreground))", fontSize: 12 }}
                  domain={[70, 100]}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px"
                  }}
                  formatter={(value: number, name: string) => [
                    `${value}%`, 
                    name === "colecao" ? "Taxa de Cobrança" : "Meta"
                  ]}
                />
                <Line 
                  type="monotone" 
                  dataKey="colecao" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={3}
                  dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 4 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="meta" 
                  stroke="hsl(var(--muted-foreground))" 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={{ fill: "hsl(var(--muted-foreground))", strokeWidth: 2, r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Fluxo de Caixa Semanal</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={cashFlowData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="week" 
                  tick={{ fill: "hsl(var(--foreground))", fontSize: 12 }}
                />
                <YAxis 
                  tick={{ fill: "hsl(var(--foreground))", fontSize: 12 }}
                  tickFormatter={(value) => `${(value/1000).toFixed(0)}K`}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px"
                  }}
                  formatter={(value: number, name: string) => [
                    `MZN ${value.toLocaleString()}`, 
                    name === "entrada" ? "Recebimentos" : "Pendências"
                  ]}
                />
                <Area 
                  type="monotone" 
                  dataKey="entrada" 
                  stackId="1"
                  stroke="hsl(var(--success))" 
                  fill="hsl(var(--success))"
                  fillOpacity={0.6}
                />
                <Area 
                  type="monotone" 
                  dataKey="saida" 
                  stackId="1"
                  stroke="hsl(var(--warning))" 
                  fill="hsl(var(--warning))"
                  fillOpacity={0.6}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Insights e Recomendações</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-4">
              <div className="p-4 rounded-lg border border-success/20 bg-success/5">
                <h4 className="font-medium text-success mb-2">✓ Performance Positiva</h4>
                <p className="text-sm text-muted-foreground">
                  Taxa de cobrança 5.2% acima do período anterior. Manter estratégia atual.
                </p>
              </div>
              
              <div className="p-4 rounded-lg border border-warning/20 bg-warning/5">
                <h4 className="font-medium text-warning mb-2">⚠ Atenção Necessária</h4>
                <p className="text-sm text-muted-foreground">
                  Aumento de 1.2% na inadimplência. Revisar processo de follow-up.
                </p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="p-4 rounded-lg border">
                <h4 className="font-medium mb-2">📈 Oportunidade</h4>
                <p className="text-sm text-muted-foreground">
                  Implementar notificações WhatsApp pode aumentar taxa de resposta em 23%.
                </p>
              </div>
              
              <div className="p-4 rounded-lg border">
                <h4 className="font-medium mb-2">🎯 Meta do Próximo Mês</h4>
                <p className="text-sm text-muted-foreground">
                  Alcançar 92% de taxa de cobrança e reduzir inadimplência para 6%.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};