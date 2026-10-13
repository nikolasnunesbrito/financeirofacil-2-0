import { createFileRoute, Link } from "@tanstack/react-router";
import { BarChart3, ShieldCheck, Smartphone, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/layout/SiteHeader";
import hero from "@/assets/hero.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "FinanceiroFácil 2.0 — Controle financeiro pessoal" },
      { name: "description", content: "Organize receitas e despesas, acompanhe seu saldo e visualize seus gastos com gráficos claros." },
      { property: "og:title", content: "FinanceiroFácil 2.0 — Controle financeiro pessoal" },
      { property: "og:description", content: "Organize receitas e despesas e visualize seus gastos com gráficos claros." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const features = [
  { icon: Wallet, title: "Saldo sempre à vista", text: "Receitas, despesas e saldo atualizados a cada lançamento." },
  { icon: BarChart3, title: "Gráficos claros", text: "Compare meses e descubra para onde vai seu dinheiro." },
  { icon: Smartphone, title: "No celular ou no PC", text: "Interface pensada para qualquer tamanho de tela." },
  { icon: ShieldCheck, title: "Simples de usar", text: "Cadastre, edite e exclua transações em segundos." },
];

function Index() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main>
        <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 pb-16 pt-8 sm:px-6 lg:grid-cols-2 lg:pt-16">
          <div>
            <span className="inline-block rounded-full bg-accent px-3 py-1 text-xs font-bold uppercase tracking-wider text-accent-foreground">Nova versão 2.0</span>
            <h1 className="mt-5 text-4xl font-extrabold leading-[1.05] sm:text-6xl">
              Suas finanças, <span className="text-income">leves</span> e organizadas.
            </h1>
            <p className="mt-5 max-w-lg text-lg text-muted-foreground">
              O FinanceiroFácil ajuda você a registrar receitas e despesas, acompanhar o saldo e entender seus hábitos com gráficos simples.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg"><Link to="/cadastro">Começar agora</Link></Button>
              <Button asChild size="lg" variant="outline"><Link to="/login">Já tenho conta</Link></Button>
            </div>
          </div>
          <img src={hero} alt="Celular exibindo gráficos financeiros" width={1280} height={1024} className="aspect-[5/4] w-full rounded-3xl object-cover shadow-soft" />
        </section>

        <section className="bg-surface-dark py-16 text-surface-dark-foreground">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <h2 className="max-w-xl text-3xl font-bold sm:text-4xl">Tudo o que você precisa para cuidar do seu dinheiro.</h2>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {features.map(({ icon: Icon, title, text }) => (
                <div key={title} className="rounded-2xl border border-surface-dark-foreground/15 p-6">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-accent text-accent-foreground"><Icon className="h-5 w-5" /></span>
                  <h3 className="mt-4 text-lg font-bold">{title}</h3>
                  <p className="mt-2 text-sm opacity-75">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <footer className="mx-auto max-w-6xl px-4 py-8 text-sm text-muted-foreground sm:px-6">© 2026 FinanceiroFácil 2.0</footer>
      </main>
    </div>
  );
}
