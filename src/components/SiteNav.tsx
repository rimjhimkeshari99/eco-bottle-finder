import { Link, useRouterState } from "@tanstack/react-router";
import { Leaf, Sparkles } from "lucide-react";

const links = [
  { to: "/", label: "Recycle" },
  { to: "/shop", label: "Shop" },
  { to: "/partners", label: "For manufacturers" },
] as const;

export function SiteNav({ points }: { points?: number }) {
  const path = useRouterState({ select: (s) => s.location.pathname });

  return (
    <header className="flex flex-wrap items-center justify-between gap-3">
      <Link to="/" className="flex items-center gap-2">
        <span className="gradient-hero flex size-9 items-center justify-center rounded-xl text-primary-foreground">
          <Leaf className="size-4" />
        </span>
        <span className="font-display text-lg font-semibold">Green Glam</span>
      </Link>

      <nav className="order-3 flex items-center gap-1 sm:order-2">
        {links.map((l) => (
          <Link
            key={l.to}
            to={l.to}
            className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
              path === l.to
                ? "bg-secondary text-secondary-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {l.label}
          </Link>
        ))}
      </nav>

      {typeof points === "number" && (
        <div className="order-2 flex items-center gap-2 rounded-full bg-secondary px-4 py-1.5 text-sm font-semibold text-secondary-foreground sm:order-3">
          <Sparkles className="size-4" /> {points} pts
        </div>
      )}
    </header>
  );
}
