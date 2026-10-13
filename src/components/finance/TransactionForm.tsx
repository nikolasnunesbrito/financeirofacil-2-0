import { useEffect, useState, type FormEvent } from "react";
import { AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { CATEGORIES, type Transaction, type TransactionInput, type TransactionType } from "@/lib/finance/types";

const today = () => new Date().toISOString().slice(0, 10);
const empty = (type: TransactionType = "despesa"): TransactionInput => ({
  type, description: "", amount: 0, category: CATEGORIES[type][0] ?? "Outros", date: today(),
});

interface Props {
  initial?: Transaction | null;
  /** Retorna a mensagem de erro quando a gravação falha, ou null quando deu certo. */
  onSubmit: (data: TransactionInput) => Promise<string | null> | void;
  onCancel?: () => void;
  error?: string | null;
  busy?: boolean;
}

export function TransactionForm({ initial, onSubmit, onCancel, error, busy }: Props) {
  const [data, setData] = useState<TransactionInput>(initial ?? empty());
  const [amount, setAmount] = useState(initial ? String(initial.amount) : "");

  useEffect(() => {
    setData(initial ?? empty());
    setAmount(initial ? String(initial.amount) : "");
  }, [initial]);

  const setType = (type: TransactionType) => setData((d) => ({ ...d, type, category: CATEGORIES[type][0] ?? "Outros" }));

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (busy) return;
    const value = Number(amount.replace(",", "."));
    if (!data.description.trim() || !(value > 0)) return;
    const result = await onSubmit({ ...data, description: data.description.trim(), amount: value });
    // Só limpa o formulário quando a gravação realmente deu certo.
    if (!result && !initial) { setData(empty(data.type)); setAmount(""); }
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid grid-cols-2 gap-2 rounded-xl bg-muted p-1">
        {(["receita", "despesa"] as const).map((t) => (
          <button
            key={t} type="button" onClick={() => setType(t)}
            className={cn(
              "rounded-lg py-2 text-sm font-semibold capitalize transition-colors",
              data.type === t ? (t === "receita" ? "bg-income text-primary-foreground" : "bg-expense text-primary-foreground") : "text-muted-foreground hover:text-foreground",
            )}
          >
            {t}
          </button>
        ))}
      </div>
      <div className="space-y-2">
        <Label htmlFor="desc">Descrição</Label>
        <Input id="desc" required value={data.description} onChange={(e) => setData({ ...data, description: e.target.value })} placeholder="Ex.: Supermercado" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label htmlFor="amount">Valor (R$)</Label>
          <Input id="amount" required inputMode="decimal" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0,00" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="date">Data</Label>
          <Input id="date" type="date" required value={data.date} onChange={(e) => setData({ ...data, date: e.target.value })} />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="cat">Categoria</Label>
        <select
          id="cat" value={data.category} onChange={(e) => setData({ ...data, category: e.target.value })}
          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {CATEGORIES[data.type].map((c) => <option key={c}>{c}</option>)}
        </select>
      </div>
      {error && (
        <p role="alert" className="flex items-start gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          {error}
        </p>
      )}
      <div className="flex gap-2">
        {onCancel && <Button type="button" variant="outline" className="flex-1" onClick={onCancel}>Cancelar</Button>}
        <Button type="submit" className="flex-1" disabled={busy}>
          {busy && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {initial ? "Salvar alterações" : "Adicionar"}
        </Button>
      </div>
    </form>
  );
}
