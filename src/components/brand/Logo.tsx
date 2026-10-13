import { Link } from "@tanstack/react-router";
import { Leaf } from "lucide-react";

export function Logo({ inverted = false }: { inverted?: boolean }) {
  return (
    <Link to="/" className="flex items-center gap-2 font-display text-lg font-bold">
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-accent text-accent-foreground">
        <Leaf className="h-5 w-5" />
      </span>
      <span className={inverted ? "text-surface-dark-foreground" : "text-foreground"}>
        FinanceiroFácil <span className="text-income">2.0</span>
      </span>
    </Link>
  );
}
