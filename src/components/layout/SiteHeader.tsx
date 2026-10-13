import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/brand/Logo";

export function SiteHeader() {
  return (
    <header className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-5 sm:px-6">
      <Logo />
      <nav className="flex items-center gap-2">
        <Button asChild variant="ghost" size="sm">
          <Link to="/login">Entrar</Link>
        </Button>
        <Button asChild size="sm">
          <Link to="/cadastro">Criar conta</Link>
        </Button>
      </nav>
    </header>
  );
}
