import { useState, type FormEvent } from "react";
import { useNavigate } from "@tanstack/react-router";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";

type Mode = "login" | "cadastro";

interface Feedback {
  tone: "error" | "ok";
  text: string;
}

/** Mensagens amigáveis para os erros mais comuns do provedor de autenticação. */
function authMessage(raw: string): string {
  if (/invalid login credentials/i.test(raw)) return "E-mail ou senha incorretos.";
  if (/already registered|already been registered/i.test(raw))
    return "Este e-mail já tem uma conta. Entre para continuar.";
  if (/email.*not allowed|cannot receive email|invalid.*email/i.test(raw))
    return "Este endereço de e-mail não é aceito. Use um e-mail real que você consiga acessar.";
  if (/confirm/i.test(raw)) return "Confirme seu e-mail antes de entrar. Verifique sua caixa de entrada.";
  if (/rate limit|too many/i.test(raw)) return "Muitas tentativas seguidas. Aguarde um pouco e tente de novo.";
  if (/weak password|password/i.test(raw))
    return "A senha não atende aos requisitos. Use pelo menos 6 caracteres, sem senhas óbvias.";
  // Mostra a mensagem real do servidor para não esconder a causa do erro.
  return `Não foi possível concluir: ${raw}`;
}

export function AuthForm({ mode }: { mode: Mode }) {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [feedback, setFeedback] = useState<Feedback | null>(null);

  const goToDashboard = async () => {
    const { data } = await supabase.auth.getSession();
    if (!data.session) {
      setFeedback({ tone: "error", text: "O acesso não foi confirmado. Tente novamente." });
      return;
    }
    await navigate({ to: "/dashboard", replace: true });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setFeedback(null);

    try {
      if (mode === "cadastro") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: name.trim() } },
        });
        if (error) {
          setFeedback({ tone: "error", text: authMessage(error.message) });
          return;
        }
        if (!data.session) {
          setFeedback({
            tone: "ok",
            text: `Conta criada! Enviamos um link de confirmação para ${email}. Confirme para poder entrar.`,
          });
          return;
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
          setFeedback({ tone: "error", text: authMessage(error.message) });
          return;
        }
      }
      await goToDashboard();
    } catch {
      setFeedback({ tone: "error", text: "Falha de conexão. Verifique sua internet e tente de novo." });
    } finally {
      setBusy(false);
    }
  };

  const handleGoogle = async () => {
    if (busy) return;
    setBusy(true);
    setFeedback(null);
    try {
      const result = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: `${window.location.origin}/auth/callback`,
      });
      if (result.error) {
        setFeedback({ tone: "error", text: authMessage(result.error.message) });
        return;
      }
      if (result.redirected) return; // o navegador cuida do resto
      await goToDashboard();
    } catch {
      setFeedback({ tone: "error", text: "Não foi possível entrar com o Google. Tente novamente." });
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {mode === "cadastro" && (
        <div className="space-y-2">
          <Label htmlFor="name">Nome</Label>
          <Input
            id="name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Seu nome"
            autoComplete="name"
          />
        </div>
      )}
      <div className="space-y-2">
        <Label htmlFor="email">E-mail</Label>
        <Input
          id="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="voce@email.com"
          autoComplete="email"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Senha</Label>
        <Input
          id="password"
          type="password"
          required
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          autoComplete={mode === "login" ? "current-password" : "new-password"}
        />
      </div>

      <Button type="submit" className="w-full" size="lg" disabled={busy}>
        {busy && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {mode === "login" ? "Entrar" : "Criar conta"}
      </Button>

      <div className="flex items-center gap-3 text-xs uppercase tracking-wider text-muted-foreground">
        <span className="h-px flex-1 bg-border" />
        ou
        <span className="h-px flex-1 bg-border" />
      </div>

      <Button type="button" variant="outline" className="w-full" size="lg" onClick={handleGoogle} disabled={busy}>
        <GoogleIcon />
        Continuar com Google
      </Button>

      {feedback && (
        <p
          role="status"
          className={
            feedback.tone === "error"
              ? "flex items-start gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive"
              : "flex items-start gap-2 rounded-lg bg-income/10 p-3 text-sm text-income"
          }
        >
          {feedback.tone === "error" ? (
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          ) : (
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
          )}
          {feedback.text}
        </p>
      )}
    </form>
  );
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="mr-2 h-4 w-4" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M23.52 12.27c0-.79-.07-1.54-.2-2.27H12v4.51h6.47a5.54 5.54 0 0 1-2.4 3.63v3h3.87c2.26-2.09 3.58-5.17 3.58-8.87Z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.96-1.08 7.94-2.91l-3.87-3c-1.08.72-2.45 1.15-4.07 1.15-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09A11.99 11.99 0 0 0 12 24Z"
      />
      <path fill="#FBBC05" d="M5.27 14.28a7.2 7.2 0 0 1 0-4.56V6.63H1.29a12 12 0 0 0 0 10.74l3.98-3.09Z" />
      <path
        fill="#EA4335"
        d="M12 4.77c1.76 0 3.34.6 4.59 1.79l3.44-3.44A11.97 11.97 0 0 0 12 0 11.99 11.99 0 0 0 1.29 6.63l3.98 3.09C6.22 6.88 8.87 4.77 12 4.77Z"
      />
    </svg>
  );
}
