import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatBRL } from "@/lib/finance/format";

const tones = {
  balance: "bg-surface-dark text-surface-dark-foreground",
  income: "bg-card",
  expense: "bg-card",
};
const iconTones = {
  balance: "bg-accent text-accent-foreground",
  income: "bg-income/15 text-income",
  expense: "bg-expense/15 text-expense",
};

export function StatCard({ label, value, icon: Icon, tone }: { label: string; value: number; icon: LucideIcon; tone: keyof typeof tones }) {
  return (
    <div className={cn("rounded-2xl border p-5 shadow-soft", tones[tone])}>
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-medium opacity-80">{label}</span>
        <span className={cn("grid h-9 w-9 shrink-0 place-items-center rounded-xl", iconTones[tone])}>
          <Icon className="h-4 w-4" />
        </span>
      </div>
      <p className="mt-4 truncate font-display text-2xl font-bold sm:text-3xl">{formatBRL(value)}</p>
    </div>
  );
}
