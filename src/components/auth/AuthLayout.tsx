import type { ReactNode } from "react";
import { Logo } from "@/components/brand/Logo";

export function AuthLayout({ title, subtitle, children, footer }: { title: string; subtitle: string; children: ReactNode; footer: ReactNode }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <aside className="hidden flex-col justify-between bg-surface-dark p-10 text-surface-dark-foreground lg:flex">
        <Logo inverted />
        <div>
          <h2 className="text-4xl font-bold leading-tight">Seu dinheiro,<br />com clareza.</h2>
          <p className="mt-4 max-w-sm opacity-75">Acompanhe receitas e despesas, entenda seus hábitos e tome decisões melhores.</p>
        </div>
        <p className="text-sm opacity-60">© 2026 FinanceiroFácil</p>
      </aside>
      <main className="flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm">
          <div className="mb-8 lg:hidden"><Logo /></div>
          <h1 className="text-3xl font-bold">{title}</h1>
          <p className="mt-2 text-muted-foreground">{subtitle}</p>
          <div className="mt-8">{children}</div>
          <div className="mt-6 text-center text-sm text-muted-foreground">{footer}</div>
        </div>
      </main>
    </div>
  );
}
