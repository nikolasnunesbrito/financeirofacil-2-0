import { useMemo } from "react";
import { Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { formatBRL } from "@/lib/finance/format";
import type { Transaction } from "@/lib/finance/types";

const MONTHS = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
const PIE_COLORS = ["var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)", "var(--chart-1)", "var(--primary)", "var(--muted-foreground)"];

const tooltipStyle = { background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, fontSize: 12 };

export function MonthlyChart({ items }: { items: Transaction[] }) {
  const data = useMemo(() => {
    const map = new Map<string, { mes: string; Receitas: number; Despesas: number }>();
    [...items].sort((a, b) => a.date.localeCompare(b.date)).forEach((t) => {
      const key = t.date.slice(0, 7);
      const row = map.get(key) ?? { mes: MONTHS[Number(key.slice(5)) - 1] ?? key, Receitas: 0, Despesas: 0 };
      if (t.type === "receita") row.Receitas += t.amount; else row.Despesas += t.amount;
      map.set(key, row);
    });
    return [...map.values()].slice(-6);
  }, [items]);

  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} barGap={4}>
        <CartesianGrid vertical={false} stroke="var(--border)" />
        <XAxis dataKey="mes" tickLine={false} axisLine={false} fontSize={12} stroke="var(--muted-foreground)" />
        <YAxis tickLine={false} axisLine={false} fontSize={11} width={48} stroke="var(--muted-foreground)" tickFormatter={(v) => `${v / 1000}k`} />
        <Tooltip formatter={(v) => formatBRL(Number(v))} contentStyle={tooltipStyle} cursor={{ fill: "var(--muted)" }} />
        <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
        <Bar dataKey="Receitas" fill="var(--income)" radius={[6, 6, 0, 0]} />
        <Bar dataKey="Despesas" fill="var(--expense)" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function CategoryChart({ items }: { items: Transaction[] }) {
  const data = useMemo(() => {
    const map = new Map<string, number>();
    items.filter((t) => t.type === "despesa").forEach((t) => map.set(t.category, (map.get(t.category) ?? 0) + t.amount));
    return [...map.entries()].map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
  }, [items]);

  if (!data.length) return <p className="py-10 text-center text-sm text-muted-foreground">Sem despesas para exibir.</p>;

  return (
    <ResponsiveContainer width="100%" height={260}>
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="name" innerRadius={55} outerRadius={90} paddingAngle={3} stroke="none">
          {data.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length] ?? "var(--primary)"} />)}
        </Pie>
        <Tooltip formatter={(v) => formatBRL(Number(v))} contentStyle={tooltipStyle} />
        <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
      </PieChart>
    </ResponsiveContainer>
  );
}
