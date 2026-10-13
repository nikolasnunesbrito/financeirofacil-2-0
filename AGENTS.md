<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Finance data flows through `src/hooks/use-transactions.ts`, which calls authenticated server functions in `src/lib/finance/transactions.functions.ts` — keeps UI decoupled from storage.
- Transaction ownership always comes from `context.userId` on the server, never from client input; RLS on `transactions` enforces `auth.uid() = user_id` as the second guard.
- Signed-in pages live under `src/routes/_authenticated/` (client-only gate redirecting to `/login`) because the session lives in browser storage.
