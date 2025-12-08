import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid } from "recharts";
import { useStats } from "@/hooks/useStats";

// Dados simulados para evolução mensal das dívidas (últimos 12 meses)
const monthlyData = [
  { month: "Jan", pagas: 45000, pendentes: 28000, vencidas: 12000 },
  { month: "Fev", pagas: 52000, pendentes: 31000, vencidas: 8500 },
  { month: "Mar", pagas: 48000, pendentes: 35000, vencidas: 15000 },
  { month: "Abr", pagas: 61000, pendentes: 29000, vencidas: 11000 },
  { month: "Mai", pagas: 55000, pendentes: 42000, vencidas: 18500 },
  { month: "Jun", pagas: 67000, pendentes: 38000, vencidas: 14000 },
  { month: "Jul", pagas: 72000, pendentes: 45000, vencidas: 9500 },
  { month: "Ago", pagas: 58000, pendentes: 51000, vencidas: 22000 },
  { month: "Set", pagas: 84000, pendentes: 47000, vencidas: 16500 },
  { month: "Out", pagas: 91000, pendentes: 39000, vencidas: 13000 },
  { month: "Nov", pagas: 78000, pendentes: 56000, vencidas: 19500 },
  { month: "Dez", pagas: 95000, pendentes: 48000, vencidas: 11500 },
];

export const DebtChart = () => {
  const { stats } = useStats();

  const statusData = [
    { name: "Pagas", value: Number(stats.paidValue ?? 0), color: "hsl(var(--success))" },
    { name: "Pendentes", value: Number(stats.pendingValue ?? 0), color: "hsl(var(--warning))" },
    { name: "Vencidas", value: Number(stats.overdueValue ?? 0), color: "hsl(var(--destructive))" },
  ];

  const total = statusData.reduce((acc, cur) => acc + (cur.value || 0), 0);

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Evolução Mensal das Dívidas</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={monthlyData}>
              <defs>
                <linearGradient id="colorPagas" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--success))" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="hsl(var(--success))" stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id="colorPendentes" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--warning))" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="hsl(var(--warning))" stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id="colorVencidas" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--destructive))" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="hsl(var(--destructive))" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="month" 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
                formatter={(value: number) => [`MZN ${value.toLocaleString()}`, ""]}
                labelStyle={{ color: "hsl(var(--foreground))" }}
              />
              <Area
                type="monotone"
                dataKey="pagas"
                name="Pagas"
                stroke="hsl(var(--success))"
                fillOpacity={1}
                fill="url(#colorPagas)"
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="pendentes"
                name="Pendentes"
                stroke="hsl(var(--warning))"
                fillOpacity={1}
                fill="url(#colorPendentes)"
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="vencidas"
                name="Vencidas"
                stroke="hsl(var(--destructive))"
                fillOpacity={1}
                fill="url(#colorVencidas)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-6 mt-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[hsl(var(--success))]" />
              <span className="text-muted-foreground">Pagas</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[hsl(var(--warning))]" />
              <span className="text-muted-foreground">Pendentes</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[hsl(var(--destructive))]" />
              <span className="text-muted-foreground">Vencidas</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Distribuição por Status (Valor)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number) => [
                  `MZN ${(value as number).toLocaleString()}`,
                  "Valor",
                ]}
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          {total === 0 && (
            <p className="mt-2 text-center text-xs text-muted-foreground">
              Não há valores para exibir no gráfico por enquanto.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
