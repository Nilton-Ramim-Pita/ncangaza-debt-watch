import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell } from "recharts";
import { useStats } from "@/hooks/useStats";
import { useDebts } from "@/hooks/useDebts";
import { useClients } from "@/hooks/useClients";
import { useMemo } from "react";
import { formatCurrency } from "@/utils/currency";
import { TrendingUp, TrendingDown, Users, FileText, Clock, CheckCircle, AlertCircle } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative';
  icon: React.ReactNode;
}

const MetricCard = ({ title, value, change, changeType, icon }: MetricCardProps) => (
  <Card>
    <CardContent className="flex items-center justify-between p-6">
      <div>
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <h3 className="text-2xl font-bold">{value}</h3>
        <p className={`text-xs flex items-center ${
          changeType === 'positive' ? 'text-green-600' : 'text-red-600'
        }`}>
          {changeType === 'positive' ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
          {change}
        </p>
      </div>
      <div className="text-muted-foreground">
        {icon}
      </div>
    </CardContent>
  </Card>
);

export const AnalyticsReal = () => {
  const { stats } = useStats();
  const { debts } = useDebts();
  const { clients } = useClients();

  const analyticsData = useMemo(() => {
    const monthlyData = [];
    const statusData = [];
    
    // Generate last 6 months data
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const month = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthName = month.toLocaleDateString('pt-MZ', { month: 'short' });
      
      const monthDebts = debts.filter(debt => {
        const debtDate = new Date(debt.data_criacao);
        return debtDate.getMonth() === month.getMonth() && 
               debtDate.getFullYear() === month.getFullYear();
      });

      const monthlyTotal = monthDebts.reduce((sum, debt) => sum + Number(debt.valor), 0);
      const paid = monthDebts.filter(d => d.status === 'paga').reduce((sum, debt) => sum + Number(debt.valor), 0);
      const pending = monthDebts.filter(d => d.status === 'pendente').reduce((sum, debt) => sum + Number(debt.valor), 0);
      const overdue = monthDebts.filter(d => d.status === 'vencida').reduce((sum, debt) => sum + Number(debt.valor), 0);

      monthlyData.push({
        month: monthName,
        total: monthlyTotal,
        paid,
        pending,
        overdue,
      });
    }

    // Status distribution
    statusData.push(
      { name: 'Pagas', value: stats.paidValue, fill: '#22c55e' },
      { name: 'Pendentes', value: stats.pendingValue, fill: '#f59e0b' },
      { name: 'Vencidas', value: stats.overdueValue, fill: '#ef4444' }
    );

    return { monthlyData, statusData };
  }, [debts, stats]);

  const collectionRate = stats.totalValue > 0 ? (stats.paidValue / stats.totalValue * 100).toFixed(1) : '0';
  const avgDebtValue = stats.totalDebts > 0 ? (stats.totalValue / stats.totalDebts) : 0;
  const overdueRate = stats.totalDebts > 0 ? (stats.overdueCount / stats.totalDebts * 100).toFixed(1) : '0';

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-foreground">Analytics</h2>
        <p className="text-muted-foreground">
          Análise detalhada de performance e métricas da Ncangaza Multiservices
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Taxa de Cobrança"
          value={`${collectionRate}%`}
          change={`${Number(collectionRate) >= 70 ? '+' : ''}${collectionRate}%`}
          changeType={Number(collectionRate) >= 70 ? 'positive' : 'negative'}
          icon={<CheckCircle className="h-8 w-8" />}
        />
        <MetricCard
          title="Valor Total"
          value={formatCurrency(stats.totalValue)}
          change={`${stats.totalDebts} dívidas`}
          changeType="positive"
          icon={<FileText className="h-8 w-8" />}
        />
        <MetricCard
          title="Dívida Média"
          value={formatCurrency(avgDebtValue)}
          change={`por ${stats.totalClients} clientes`}
          changeType="positive"
          icon={<Users className="h-8 w-8" />}
        />
        <MetricCard
          title="Taxa Vencidas"
          value={`${overdueRate}%`}
          change={`${stats.overdueCount} vencidas`}
          changeType={Number(overdueRate) <= 10 ? 'positive' : 'negative'}
          icon={<AlertCircle className="h-8 w-8" />}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Performance de Cobrança (6 meses)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analyticsData.monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`} />
                <Tooltip 
                  formatter={(value: number) => [formatCurrency(value), '']}
                />
                <Line 
                  type="monotone" 
                  dataKey="paid" 
                  stroke="#22c55e" 
                  strokeWidth={2}
                  name="Pagas"
                />
                <Line 
                  type="monotone" 
                  dataKey="pending" 
                  stroke="#f59e0b" 
                  strokeWidth={2}
                  name="Pendentes"
                />
                <Line 
                  type="monotone" 
                  dataKey="overdue" 
                  stroke="#ef4444" 
                  strokeWidth={2}
                  name="Vencidas"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Distribuição por Status</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={analyticsData.statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {analyticsData.statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Insights e Recomendações</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <div>
                <h4 className="font-semibold">Performance de Cobrança</h4>
                <p className="text-sm text-muted-foreground">
                  {Number(collectionRate) >= 80 
                    ? "Excelente taxa de cobrança! Continue com as estratégias actuais."
                    : Number(collectionRate) >= 60
                    ? "Taxa de cobrança satisfatória. Considere melhorar os processos de follow-up."
                    : "Taxa de cobrança baixa. Implemente notificações automáticas e melhor gestão de vencimentos."
                  }
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-amber-500 rounded-full mt-2"></div>
              <div>
                <h4 className="font-semibold">Gestão de Vencimentos</h4>
                <p className="text-sm text-muted-foreground">
                  {Number(overdueRate) <= 5
                    ? "Gestão excelente de vencimentos. Poucas dívidas vencidas."
                    : Number(overdueRate) <= 15
                    ? "Gestão satisfatória. Configure notificações automáticas antes do vencimento."
                    : "Muitas dívidas vencidas. Implemente um sistema de follow-up mais agressivo."
                  }
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div>
                <h4 className="font-semibold">Diversificação de Clientes</h4>
                <p className="text-sm text-muted-foreground">
                  {stats.totalClients >= 50
                    ? "Boa base de clientes diversificada."
                    : "Considere expandir a base de clientes para reduzir riscos de concentração."
                  }
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};