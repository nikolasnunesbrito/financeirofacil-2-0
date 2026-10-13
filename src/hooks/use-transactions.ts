import { useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createTransaction,
  deleteTransaction,
  listTransactions,
  updateTransaction,
} from "@/lib/finance/transactions.functions";
import type { Transaction, TransactionInput } from "@/lib/finance/types";

const KEY = ["transactions"] as const;

const SESSION_MSG = "Sua sessão expirou. Entre novamente para continuar.";

type Op =
  | { kind: "add"; values: TransactionInput }
  | { kind: "update"; id: string; values: TransactionInput }
  | { kind: "remove"; id: string };

/**
 * Transações lidas e gravadas na tabela `transactions`, já filtradas
 * pelas políticas de segurança do banco (cada usuário vê só as suas).
 */
export function useTransactions() {
  const queryClient = useQueryClient();

  const query = useQuery({ queryKey: KEY, queryFn: () => listTransactions() });

  const mutation = useMutation({
    mutationFn: (op: Op) => {
      if (op.kind === "add") return createTransaction({ data: op.values });
      if (op.kind === "update") return updateTransaction({ data: { id: op.id, ...op.values } });
      return deleteTransaction({ data: { id: op.id } });
    },
    onSuccess: (result) => {
      if (result.ok) queryClient.invalidateQueries({ queryKey: KEY });
    },
  });

  const run = async (op: Op): Promise<string | null> => {
    try {
      const result = await mutation.mutateAsync(op);
      return result.ok ? null : result.message;
    } catch (error) {
      console.error(error);
      return String(error).includes("Unauthorized") ? SESSION_MSG : GENERIC;
    }
  };

  const items = useMemo(() => (query.data?.ok ? query.data.data : []), [query.data]);

  const totals = useMemo(() => {
    const income = items.filter((t) => t.type === "receita").reduce((s, t) => s + t.amount, 0);
    const expense = items.filter((t) => t.type === "despesa").reduce((s, t) => s + t.amount, 0);
    return { income, expense, balance: income - expense };
  }, [items]);

  const loadError =
    query.error != null
      ? String(query.error).includes("Unauthorized")
        ? SESSION_MSG
        : GENERIC
      : query.data && !query.data.ok
        ? query.data.message
        : null;

  return {
    items,
    totals,
    add: (values: TransactionInput) => run({ kind: "add", values }),
    update: (id: string, values: TransactionInput) => run({ kind: "update", id, values }),
    remove: (id: string) => run({ kind: "remove", id }),
    isLoading: query.isPending,
    isSaving: mutation.isPending,
    loadError,
    reload: () => query.refetch(),
  };
}

const GENERIC = "Não foi possível concluir a operação. Tente novamente.";
