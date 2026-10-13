import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AlertCircle, Banknote, Loader2, LogOut, Pencil, TrendingDown, TrendingUp, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Logo } from "@/components/brand/Logo";
import { StatCard } from "@/components/finance/StatCard";
import { Panel } from "@/components/finance/Panel";
import { TransactionForm } from "@/components/finance/TransactionForm";
import { TransactionList } from "@/components/finance/TransactionList";
import { CategoryChart, MonthlyChart } from "@/components/finance/FinanceCharts";
import { useTransactions } from "@/hooks/use-transactions";
import { useSession } from "@/hooks/use-session";
import { supabase } from "@/integrations/supabase/client";
import type { Transaction, TransactionInput } from "@/lib/finance/types";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { title: "Painel — FinanceiroFácil 2.0" },
      { name: "description", content: "Saldo, receitas, despesas e gráficos das suas finanças." },
      { property: "og:title", content: "Painel — FinanceiroFácil 2.0" },
      { property: "og:description", content: "Saldo, receitas, despesas e gráficos das suas finanças." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const navigate = useNavigate();
  const session = useSession();
  const { items, totals, add, update, remove, isLoading, isSaving, loadError, reload } = useTransactions();

  const [editing, setEditing] = useState<Transaction | null>(null);
  const [deleting, setDeleting] = useState<Transaction | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [listError, setListError] = useState<string | null>(null);
  const [salaryOpen, setSalaryOpen] = useState(false);
  const [salaryInput, setSalaryInput] = useState("");
  const [salaryError, setSalaryError] = useState<string | null>(null);
  const [salarySaving, setSalarySaving] = useState(false);

  const monthlySalary = (session.data?.user_metadata?.["monthly_salary"] as number | null) ?? null;

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      setListError("Não foi possível sair. Tente novamente.");
      return;
    }
    await navigate({ to: "/" });
  };

  const handleAdd = async (values: TransactionInput) => {
    setFormError(null);
    const message = await add(values);
    if (message) setFormError(message);
    return message;
  };

  const handleUpdate = async (values: TransactionInput) => {
    if (!editing) return null;
    setFormError(null);
    const message = await update(editing.id, values);
    if (message) setFormError(message);
    else setEditing(null);
    return message;
  };

  const handleDelete = async () => {
    const target = deleting;
    setDeleting(null);
    if (!target) return;
    setListError(null);
    const message = await remove(target.id);
    if (message) setListError(message);
  };

  const openSalaryDialog = () => {
    setSalaryInput(monthlySalary != null ? String(monthlySalary) : "");
    setSalaryError(null);
    setSalaryOpen(true);
  };

  const handleSaveSalary = async () => {
    const trimmed = salaryInput.trim();
    const value = trimmed ? Number(trimmed.replace(",", ".")) : null;
    if (trimmed && (!Number.isFinite(value) || value! < 0)) {
      setSalaryError("Informe um valor válido (apenas números).");
      return;
    }
    setSalarySaving(true);
    setSalaryError(null);
    const { error } = await supabase.auth.updateUser({ data: { monthly_salary: value } });
    setSalarySaving(false);
    if (error) {
      setSalaryError("Não foi possível salvar o salário. Tente novamente.");
      return;
    }
    setSalaryOpen(false);
  };

  return (
    <div className="min-h-screen">
      <header className="border-b bg-card">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <Logo />
          <div className="flex items-center gap-3">
            <span className="hidden max-w-[220px] truncate text-sm text-muted-foreground sm:block">
              {session.data?.email}
            </span>
            <Button variant="ghost" size="sm" onClick={signOut}>
              <LogOut className="mr-2 h-4 w-4" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-6 px-4 py-8 sm:px-6">
        <div>
          <h1 className="text-3xl font-bold">Seu painel</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Saldo, receitas e despesas calculados a partir das suas transações salvas.
          </p>
        </div>

        {loadError && (
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-destructive/30 bg-destructive/10 p-4">
            <p role="alert" className="flex items-center gap-2 text-sm text-destructive">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {loadError}
            </p>
            <Button size="sm" variant="outline" onClick={reload}>
              Tentar de novo
            </Button>
          </div>
        )}

        {isLoading ? (
          <div className="grid place-items-center rounded-2xl border bg-card py-20">
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Carregando suas transações…
            </p>
          </div>
        ) : (
          <>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard label="Saldo atual" value={totals.balance} icon={Wallet} tone="balance" />
              <StatCard label="Total de receitas" value={totals.income} icon={TrendingUp} tone="income" />
              <StatCard label="Total de despesas" value={totals.expense} icon={TrendingDown} tone="expense" />
              <div className="relative">
                <StatCard label="Salário mensal" value={monthlySalary ?? 0} icon={Banknote} tone="balance" />
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-2"
                  onClick={openSalaryDialog}
                  aria-label="Editar salário mensal"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
              <Panel title="Receitas x Despesas por mês">
                <MonthlyChart items={items} />
              </Panel>
              <Panel title="Nova transação">
                <TransactionForm onSubmit={handleAdd} busy={isSaving} error={formError} />
              </Panel>
            </div>

            <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
              <Panel title="Transações">
                {listError && (
                  <p role="alert" className="mb-3 flex items-center gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    {listError}
                  </p>
                )}
                <TransactionList items={items} onEdit={setEditing} onDelete={setDeleting} />
              </Panel>
              <Panel title="Despesas por categoria" className="self-start">
                <CategoryChart items={items} />
              </Panel>
            </div>
          </>
        )}
      </main>

      <Dialog open={!!editing} onOpenChange={(open) => !open && (setEditing(null), setFormError(null))}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar transação</DialogTitle>
          </DialogHeader>
          <TransactionForm
            initial={editing}
            busy={isSaving}
            error={formError}
            onCancel={() => {
              setEditing(null);
              setFormError(null);
            }}
            onSubmit={handleUpdate}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={salaryOpen} onOpenChange={setSalaryOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Salário mensal</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="salary-edit">Valor (R$)</Label>
            <Input
              id="salary-edit"
              inputMode="decimal"
              value={salaryInput}
              onChange={(e) => setSalaryInput(e.target.value)}
              placeholder="Ex.: 3500"
            />
            {salaryError && (
              <p role="alert" className="flex items-center gap-2 text-sm text-destructive">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {salaryError}
              </p>
            )}
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setSalaryOpen(false)}>Cancelar</Button>
            <Button onClick={handleSaveSalary} disabled={salarySaving}>
              {salarySaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Salvar
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleting} onOpenChange={(open) => !open && setDeleting(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir transação?</AlertDialogTitle>
            <AlertDialogDescription>“{deleting?.description}” será removida da lista.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Excluir</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
