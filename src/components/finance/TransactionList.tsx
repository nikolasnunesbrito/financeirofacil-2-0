import { ArrowDownRight, ArrowUpRight, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { formatBRL, formatDate } from "@/lib/finance/format";
import type { Transaction } from "@/lib/finance/types";

interface Props {
  items: Transaction[];
  onEdit: (t: Transaction) => void;
  onDelete: (t: Transaction) => void;
}

export function TransactionList({ items, onEdit, onDelete }: Props) {
  if (!items.length) return <p className="py-10 text-center text-sm text-muted-foreground">Nenhuma transação cadastrada.</p>;

  return (
    <ul className="divide-y">
      {items.map((t) => {
        const income = t.type === "receita";
        const Icon = income ? ArrowUpRight : ArrowDownRight;
        return (
          <li key={t.id} className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 py-3">
            <span className={cn("grid h-10 w-10 shrink-0 place-items-center rounded-xl", income ? "bg-income/15 text-income" : "bg-expense/15 text-expense")}>
              <Icon className="h-4 w-4" />
            </span>
            <div className="min-w-0">
              <p className="truncate font-semibold">{t.description}</p>
              <p className="truncate text-xs text-muted-foreground">{t.category} · {formatDate(t.date)}</p>
            </div>
            <div className="flex items-center gap-1">
              <span className={cn("mr-2 whitespace-nowrap text-sm font-bold", income ? "text-income" : "text-expense")}>
                {income ? "+" : "−"} {formatBRL(t.amount)}
              </span>
              <Button size="icon" variant="ghost" aria-label={`Editar ${t.description}`} onClick={() => onEdit(t)}><Pencil className="h-4 w-4" /></Button>
              <Button size="icon" variant="ghost" aria-label={`Excluir ${t.description}`} onClick={() => onDelete(t)} className="text-destructive hover:text-destructive"><Trash2 className="h-4 w-4" /></Button>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
