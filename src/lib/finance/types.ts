// Modelos de domínio. Os nomes dos campos já seguem o formato esperado
// para uma futura tabela `transactions` no Supabase.
export type TransactionType = "receita" | "despesa";

export interface Transaction {
  id: string;
  type: TransactionType;
  description: string;
  amount: number;
  category: string;
  date: string; // YYYY-MM-DD
}

export type TransactionInput = Omit<Transaction, "id">;

export const CATEGORIES: Record<TransactionType, string[]> = {
  receita: ["Salário", "Freelance", "Investimentos", "Outros"],
  despesa: ["Moradia", "Alimentação", "Transporte", "Lazer", "Saúde", "Educação", "Outros"],
};
