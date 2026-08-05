import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { Leaf, Recycle, ShoppingBag, Weight } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { SiteNav } from "@/components/SiteNav";
import { BottleUploader } from "@/components/BottleUploader";
import { ResultCard } from "@/components/ResultCard";
import { HistoryList } from "@/components/HistoryList";
import {
  assessBottle,
  balance,
  loadDrops,
  loadOrders,
  materialSaved,
  saveDrops,
  tierFor,
  type Assessment,
  type DropEntry,
  type Redemption,
} from "@/lib/greenglam";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Green Glam — Return Skincare Bottles, Earn Points" },
      {
        name: "description",
        content:
          "Send back empty skincare bottles in plastic, glass or silicone. AI checks their condition, we accept them and pay you in points you can spend on skincare.",
      },
      { property: "og:title", content: "Green Glam — Return Skincare Bottles, Earn Points" },
      {
        property: "og:description",
        content:
          "AI-inspected packaging take-back for skincare empties, with points you can spend in the Green Glam shop.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  const [image, setImage] = useState<string | null>(null);
  const [result, setResult] = useState<Assessment | null>(null);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [drops, setDrops] = useState<DropEntry[]>([]);
  const [orders, setOrders] = useState<Redemption[]>([]);

  useEffect(() => {
    setDrops(loadDrops());
    setOrders(loadOrders());
  }, []);

  const points = useMemo(() => balance(drops, orders), [drops, orders]);
  const tier = tierFor(points);
  const progress = tier.next ? Math.min(100, (points / tier.next) * 100) : 100;

  const update = (next: DropEntry[]) => {
    setDrops(next);
    saveDrops(next);
  };

  async function scan() {
    if (!image) return;
    setLoading(true);
    setResult(null);
    setSaved(false);
    try {
      setResult(await assessBottle(image));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  function logEntry() {
    if (!result || !image || !result.accepted) return;
    update([
      { ...result, id: crypto.randomUUID(), image, createdAt: new Date().toISOString() },
      ...drops,
    ]);
    setSaved(true);
    toast.success(`Accepted — +${result.points} points added`);
  }

  return (
    <main className="mx-auto w-full max-w-6xl px-4 pb-20 pt-8 sm:px-6">
      <SiteNav points={points} />

      <section className="mt-12 text-center">
        <p className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          <Leaf className="size-3.5 text-leaf" /> AI intake inspection
        </p>
        <h1 className="mx-auto mt-5 max-w-3xl text-4xl leading-tight sm:text-6xl">
          Give us your empties. Get points for glam.
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
          Plastic, glass or silicone — photograph any finished skincare container. Our AI checks the
          material and condition, accepts it on the spot, and credits points you can spend on
          skincare from our partner manufacturers.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Button asChild variant="secondary" className="rounded-full">
            <Link to="/shop">
              <ShoppingBag className="size-4" /> Spend your points
            </Link>
          </Button>
          <Button asChild variant="ghost" className="rounded-full">
            <Link to="/partners">Supply raw material to your brand</Link>
          </Button>
        </div>
      </section>

      <div className="mt-12 grid gap-6 lg:grid-cols-[1.1fr_1fr]">
        <div className="space-y-6">
          <BottleUploader
            image={image}
            loading={loading}
            onSelect={(dataUrl) => {
              setImage(dataUrl);
              setResult(null);
              setSaved(false);
            }}
            onClear={() => {
              setImage(null);
              setResult(null);
              setSaved(false);
            }}
            onScan={scan}
          />
          {result && <ResultCard result={result} saved={saved} onSave={logEntry} />}
        </div>

        <aside className="space-y-6">
          <div className="surface gradient-soft rounded-3xl p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Your wallet
            </p>
            <p className="mt-2 font-display text-5xl font-semibold">{points}</p>
            <p className="text-sm text-muted-foreground">points available · {tier.name} tier</p>
            <Progress value={progress} className="mt-4" />
            <p className="mt-2 text-xs text-muted-foreground">
              {tier.next
                ? `${Math.max(0, tier.next - points)} points to the next tier`
                : "Top tier reached — legendary returner"}
            </p>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-card/80 px-4 py-3">
                <Recycle className="size-4 text-leaf" />
                <p className="mt-1 text-xl font-semibold">
                  {drops.filter((d) => d.accepted).length}
                </p>
                <p className="text-xs text-muted-foreground">bottles accepted</p>
              </div>
              <div className="rounded-2xl bg-card/80 px-4 py-3">
                <Weight className="size-4 text-leaf" />
                <p className="mt-1 text-xl font-semibold">{materialSaved(drops)}g</p>
                <p className="text-xs text-muted-foreground">material recovered</p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="mb-3 text-xl">Your drop-offs</h2>
            <HistoryList
              entries={drops}
              onRemove={(id) => update(drops.filter((e) => e.id !== id))}
            />
          </div>
        </aside>
      </div>
    </main>
  );
}
