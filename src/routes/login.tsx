import { createFileRoute, Link } from "@tanstack/react-router";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { AuthForm } from "@/components/auth/AuthForm";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Entrar — FinanceiroFácil 2.0" },
      { name: "description", content: "Acesse sua conta do FinanceiroFácil 2.0." },
      { property: "og:title", content: "Entrar — FinanceiroFácil 2.0" },
      { property: "og:description", content: "Acesse sua conta do FinanceiroFácil 2.0." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => (
    <AuthLayout
      title="Bem-vindo de volta"
      subtitle="Entre para acompanhar suas finanças."
      footer={<>Ainda não tem conta? <Link to="/cadastro" className="font-semibold text-income hover:underline">Criar conta</Link></>}
    >
      <AuthForm mode="login" />
    </AuthLayout>
  ),
});
