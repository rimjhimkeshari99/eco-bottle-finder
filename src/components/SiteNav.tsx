import { Link, useRouterState } from "@tanstack/react-router";
import { Leaf, Sparkles } from "lucide-react";

const links = [
  { to: "/", label: "Recycle" },
  { to: "/shop", label: "Shop" },
  { to: "/partners", label: "Brands" },
] as const;

export function SiteNav({ points }: { points?: number }) {
  const path = useRouterState({ select: (s) => s.location.pathname });

  return (
    <header className="surface sticky top-3 z-30 flex flex-wrap items-center justify-between gap-3 rounded-full px-3 py-2 backdrop-blur">
      <Link to="/" className="flex items-center gap-2 pl-1">
        <span className="gradient-hero sticker flex size-9 animate-wiggle items-center justify-center text-foreground">
          <Leaf className="size-4" />
        </span>
        <span className="font-display text-lg font-extrabold tracking-tight">green glam</span>
      </Link>

      <nav className="order-3 flex items-center gap-1 sm:order-2">
        {links.map((l) => (
          <Link
            key={l.to}
            to={l.to}
            className={`rounded-full px-3 py-1.5 text-sm font-bold transition ${
              path === l.to
                ? "sticker bg-lime text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {l.label}
          </Link>
        ))}
      </nav>

      {typeof points === "number" && (
        <div className="sticker order-2 flex items-center gap-1.5 bg-bubble px-3 py-1.5 text-sm font-extrabold text-foreground sm:order-3">
          <Sparkles className="size-4" /> {points} pts
        </div>
      )}
    </header>
  );
}
