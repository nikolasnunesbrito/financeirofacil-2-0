-- Tabela de transações financeiras do FinanceiroFácil 2.0
create table public.transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  description text not null,
  amount numeric(12, 2) not null check (amount > 0),
  type text not null check (type in ('receita', 'despesa')),
  category text not null,
  date date not null,
  created_at timestamptz not null default now()
);

create index transactions_user_date_idx on public.transactions (user_id, date desc);

-- Acesso via Data API (RLS sozinho não basta sem GRANT)
grant select, insert, update, delete on public.transactions to authenticated;
grant all on public.transactions to service_role;

alter table public.transactions enable row level security;

-- Cada usuário só enxerga e só altera as próprias transações.
-- O dono vem sempre de auth.uid(), nunca de um campo enviado pelo formulário.
create policy "Usuários leem as próprias transações"
  on public.transactions
  for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Usuários inserem as próprias transações"
  on public.transactions
  for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Usuários atualizam as próprias transações"
  on public.transactions
  for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Usuários excluem as próprias transações"
  on public.transactions
  for delete
  to authenticated
  using (auth.uid() = user_id);