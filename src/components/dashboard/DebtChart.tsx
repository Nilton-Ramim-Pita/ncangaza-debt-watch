import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { useStats } from "@/hooks/useStats";

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
          <div className="flex items-center justify-center h-[300px] text-sm text-muted-foreground">
            Sem dados históricos suficientes
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