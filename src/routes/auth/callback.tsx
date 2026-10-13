import { useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/brand/Logo";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth/callback")({
  head: () => ({
    meta: [
      { title: "Entrando — FinanceiroFácil 2.0" },
      { name: "description", content: "Finalizando o seu acesso ao FinanceiroFácil 2.0." },
      { property: "og:title", content: "Entrando — FinanceiroFácil 2.0" },
      { property: "og:description", content: "Finalizando o seu acesso ao FinanceiroFácil 2.0." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AuthCallback,
});

function AuthCallback() {
  const navigate = useNavigate();
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      for (let attempt = 0; attempt < 25; attempt++) {
        const { data } = await supabase.auth.getSession();
        if (!active) return;
        if (data.session) {
          await navigate({ to: "/dashboard", replace: true });
          return;
        }
        await new Promise((resolve) => setTimeout(resolve, 200));
      }
      if (active) setFailed(true);
    })();
    return () => {
      active = false;
    };
  }, [navigate]);

  return (
    <div className="grid min-h-screen place-items-center px-4">
      <div className="w-full max-w-sm rounded-2xl border bg-card p-8 text-center shadow-soft">
        <Logo />
        {failed ? (
          <div className="mt-6 space-y-4">
            <p role="alert" className="text-sm text-muted-foreground">
              Não conseguimos concluir o seu acesso. O login pode ter sido cancelado ou ter expirado.
            </p>
            <Button asChild className="w-full">
              <Link to="/login">Voltar para o login</Link>
            </Button>
          </div>
        ) : (
          <p className="mt-6 flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Finalizando o seu acesso…
          </p>
        )}
      </div>
    </div>
  );
}
