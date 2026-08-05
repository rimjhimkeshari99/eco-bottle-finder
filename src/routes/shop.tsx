import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteNav } from "@/components/SiteNav";
import { PRODUCTS } from "@/lib/products";
import {
  balance,
  loadDrops,
  loadOrders,
  saveOrders,
  type DropEntry,
  type Redemption,
} from "@/lib/greenglam";

export const Route = createFileRoute("/shop")({
  head: () => ({
    meta: [
      { title: "Shop Skincare with Points — Green Glam" },
      {
        name: "description",
        content:
          "Spend the points you earned returning empties on skincare sourced straight from Green Glam partner manufacturers.",
      },
      { property: "og:title", content: "Shop Skincare with Points — Green Glam" },
      {
        property: "og:description",
        content: "Refillable skincare from partner manufacturers, payable in Green Glam points.",
      },
    ],
  }),
  component: Shop,
});

function Shop() {
  const [drops, setDrops] = useState<DropEntry[]>([]);
  const [orders, setOrders] = useState<Redemption[]>([]);

  useEffect(() => {
    setDrops(loadDrops());
    setOrders(loadOrders());
  }, []);

  const points = useMemo(() => balance(drops, orders), [drops, orders]);
  const ownedIds = useMemo(() => new Set(orders.map((o) => o.productId)), [orders]);

  function redeem(id: string) {
    const product = PRODUCTS.find((p) => p.id === id);
    if (!product) return;
    if (points < product.points) {
      toast.error(`You need ${product.points - points} more points for this.`);
      return;
    }
    const next: Redemption[] = [
      {
        id: crypto.randomUUID(),
        productId: product.id,
        productName: product.name,
        points: product.points,
        createdAt: new Date().toISOString(),
      },
      ...orders,
    ];
    setOrders(next);
    saveOrders(next);
    toast.success(`${product.name} redeemed — we'll ship it to you.`);
  }

  return (
    <main className="mx-auto w-full max-w-6xl px-4 pb-20 pt-8 sm:px-6">
      <SiteNav points={points} />

      <section className="mt-12 max-w-2xl">
        <h1 className="text-4xl leading-tight sm:text-5xl">The Green Glam shop</h1>
        <p className="mt-4 text-muted-foreground">
          Skincare we source directly from our partner manufacturers — the same brands we supply
          with recovered raw material. Pay with points from your returns, or buy outright.
        </p>
      </section>

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {PRODUCTS.map((p) => {
          const owned = ownedIds.has(p.id);
          const affordable = points >= p.points;
          return (
            <article key={p.id} className="surface flex flex-col overflow-hidden rounded-3xl">
              <div className={`h-36 bg-gradient-to-br ${p.tone}`} aria-hidden />
              <div className="flex flex-1 flex-col p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  {p.brand}
                </p>
                <h2 className="mt-1 text-xl">{p.name}</h2>
                <p className="mt-2 flex-1 text-sm text-muted-foreground">{p.blurb}</p>
                <p className="mt-3 text-xs text-muted-foreground">{p.packaging}</p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="font-semibold">₹{p.price}</span>
                  <span className="rounded-full bg-secondary px-3 py-1 text-sm font-semibold text-secondary-foreground">
                    {p.points} pts
                  </span>
                </div>
                <Button
                  className="mt-4 w-full rounded-full"
                  variant={owned || !affordable ? "secondary" : "default"}
                  disabled={owned || !affordable}
                  onClick={() => redeem(p.id)}
                >
                  {owned ? (
                    <>
                      <Check className="size-4" /> Redeemed
                    </>
                  ) : affordable ? (
                    <>
                      <Sparkles className="size-4" /> Redeem with points
                    </>
                  ) : (
                    `${p.points - points} points short`
                  )}
                </Button>
              </div>
            </article>
          );
        })}
      </div>

      {orders.length > 0 && (
        <section className="mt-14">
          <h2 className="text-xl">Redemption history</h2>
          <ul className="mt-4 space-y-2">
            {orders.map((o) => (
              <li
                key={o.id}
                className="surface flex items-center justify-between rounded-2xl px-4 py-3 text-sm"
              >
                <span className="font-medium">{o.productName}</span>
                <span className="text-muted-foreground">
                  −{o.points} pts · {new Date(o.createdAt).toLocaleDateString()}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <p className="mt-12 text-sm text-muted-foreground">
        Short on points?{" "}
        <Link to="/" className="font-semibold text-foreground underline underline-offset-4">
          Scan another empty
        </Link>
        .
      </p>
    </main>
  );
}
