import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const monthlyData = [
  { month: "Jan", pendentes: 120000, pagas: 180000, vencidas: 45000 },
  { month: "Fev", pendentes: 135000, pagas: 220000, vencidas: 52000 },
  { month: "Mar", pendentes: 98000, pagas: 195000, vencidas: 38000 },
  { month: "Abr", pendentes: 145000, pagas: 275000, vencidas: 61000 },
  { month: "Mai", pendentes: 162000, pagas: 310000, vencidas: 49000 },
  { month: "Jun", pendentes: 178000, pagas: 285000, vencidas: 73000 }
];

const statusData = [
  { name: "Pagas", value: 1654300, color: "hsl(var(--success))" },
  { name: "Pendentes", value: 847550, color: "hsl(var(--warning))" },
  { name: "Vencidas", value: 486200, color: "hsl(var(--destructive))" }
];

export const DebtChart = () => {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Evolução Mensal das Dívidas</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="month" 
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
                formatter={(value: number) => [`MZN ${value.toLocaleString()}`, ""]}
              />
              <Bar dataKey="pagas" fill="hsl(var(--success))" name="Pagas" radius={[2, 2, 0, 0]} />
              <Bar dataKey="pendentes" fill="hsl(var(--warning))" name="Pendentes" radius={[2, 2, 0, 0]} />
              <Bar dataKey="vencidas" fill="hsl(var(--destructive))" name="Vencidas" radius={[2, 2, 0, 0]} />
            </BarChart>
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
                data={statusData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: number) => [`MZN ${value.toLocaleString()}`, "Valor"]}
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px"
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};