import { createFileRoute, Link } from "@tanstack/react-router";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { AuthForm } from "@/components/auth/AuthForm";

export const Route = createFileRoute("/cadastro")({
  head: () => ({
    meta: [
      { title: "Criar conta — FinanceiroFácil 2.0" },
      { name: "description", content: "Crie sua conta no FinanceiroFácil 2.0 e organize suas finanças." },
      { property: "og:title", content: "Criar conta — FinanceiroFácil 2.0" },
      { property: "og:description", content: "Crie sua conta e organize suas finanças." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => (
    <AuthLayout
      title="Crie sua conta"
      subtitle="Comece a organizar seu dinheiro hoje."
      footer={<>Já tem conta? <Link to="/login" className="font-semibold text-income hover:underline">Entrar</Link></>}
    >
      <AuthForm mode="cadastro" />
    </AuthLayout>
  ),
});
