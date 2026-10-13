import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type { Transaction, TransactionType } from "@/lib/finance/types";

/**
 * Acesso à tabela `transactions`.
 * O dono de cada registro vem sempre de `context.userId` (token da sessão),
 * nunca de um campo enviado pelo formulário.
 */

const fields = "id, description, amount, type, category, date" as const;

const transactionSchema = z.object({
  description: z.string().trim().min(1, "Informe uma descrição").max(200),
  amount: z.coerce.number().positive("O valor precisa ser maior que zero").max(9_999_999),
  type: z.enum(["receita", "despesa"]),
  category: z.string().trim().min(1, "Informe uma categoria").max(60),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Data inválida"),
});

type Result<T> = { ok: true; data: T } | { ok: false; message: string };

const GENERIC = "Não foi possível concluir a operação. Tente novamente.";

type Row = {
  id: string;
  description: string;
  amount: number;
  type: string;
  category: string;
  date: string;
};

const toTransaction = (row: Row): Transaction => ({
  id: row.id,
  description: row.description,
  amount: Number(row.amount),
  type: row.type as TransactionType,
  category: row.category,
  date: row.date,
});

export const listTransactions = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<Result<Transaction[]>> => {
    const { data, error } = await context.supabase
      .from("transactions")
      .select(fields)
      .order("date", { ascending: false })
      .order("created_at", { ascending: false })
      .limit(500);

    if (error) {
      console.error("[transactions] list:", error.message);
      return { ok: false, message: GENERIC };
    }
    return { ok: true, data: data.map(toTransaction) };
  });

export const createTransaction = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(transactionSchema)
  .handler(async ({ data, context }): Promise<Result<Transaction>> => {
    const { data: row, error } = await context.supabase
      .from("transactions")
      .insert({ ...data, user_id: context.userId })
      .select(fields)
      .single();

    if (error) {
      console.error("[transactions] create:", error.message);
      return { ok: false, message: GENERIC };
    }
    return { ok: true, data: toTransaction(row) };
  });

export const updateTransaction = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(z.object({ id: z.string().uuid(), ...transactionSchema.shape }))
  .handler(async ({ data, context }): Promise<Result<Transaction>> => {
    const { id, ...patch } = data;
    const { data: row, error } = await context.supabase
      .from("transactions")
      .update(patch)
      .eq("id", id)
      .eq("user_id", context.userId)
      .select(fields)
      .maybeSingle();

    if (error) {
      console.error("[transactions] update:", error.message);
      return { ok: false, message: GENERIC };
    }
    if (!row) return { ok: false, message: "Transação não encontrada." };
    return { ok: true, data: toTransaction(row) };
  });

export const deleteTransaction = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(z.object({ id: z.string().uuid() }))
  .handler(async ({ data, context }): Promise<Result<{ id: string }>> => {
    const { error, count } = await context.supabase
      .from("transactions")
      .delete({ count: "exact" })
      .eq("id", data.id)
      .eq("user_id", context.userId);

    if (error) {
      console.error("[transactions] delete:", error.message);
      return { ok: false, message: GENERIC };
    }
    if (!count) return { ok: false, message: "Transação não encontrada." };
    return { ok: true, data: { id: data.id } };
  });
