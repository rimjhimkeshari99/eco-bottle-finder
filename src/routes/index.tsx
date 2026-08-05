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
    <main className="mx-auto w-full max-w-6xl px-4 pb-20 pt-4 sm:px-6">
      <SiteNav points={points} />

      <section className="mt-10 text-center">
        <p className="sticker inline-flex animate-wiggle items-center gap-2 bg-lime px-4 py-1.5 text-xs font-extrabold uppercase tracking-[0.16em]">
          <Leaf className="size-3.5" /> ai scans your empties
        </p>
        <h1 className="mx-auto mt-6 max-w-3xl text-5xl leading-[0.95] sm:text-7xl">
          give us your{" "}
          <span className="gradient-hero chunky inline-block -rotate-2 rounded-2xl px-3 py-1">
            empties
          </span>
          , get points for glam.
        </h1>
        <p className="mx-auto mt-5 max-w-xl font-medium text-muted-foreground">
          plastic, glass or silicone — snap your finished skincare bottle. our AI checks the vibe
          (and the condition), accepts it on the spot, and drops points you can spend on real
          skincare.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Button asChild className="chunky pop-hover rounded-full bg-bubble font-extrabold text-foreground hover:bg-bubble">
            <Link to="/shop">
              <ShoppingBag className="size-4" /> spend your points
            </Link>
          </Button>
          <Button asChild className="chunky pop-hover rounded-full bg-card font-extrabold text-foreground hover:bg-card">
            <Link to="/partners">brands: get recycled material</Link>
          </Button>
        </div>
      </section>

      <div className="chunky mt-10 overflow-hidden rounded-full bg-foreground py-2">
        <div className="animate-marquee flex w-max gap-8 whitespace-nowrap font-display text-sm font-extrabold uppercase tracking-wider text-background">
          {Array.from({ length: 2 }).map((_, r) => (
            <span key={r} className="flex gap-8">
              {[
                "♻︎ scan it",
                "✦ send it",
                "★ earn points",
                "✿ shop skincare",
                "♻︎ zero landfill",
                "✦ closed loop",
              ].map((t) => (
                <span key={t}>{t}</span>
              ))}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-[1.1fr_1fr]">
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
          <div className="surface gradient-soft rounded-[2rem] p-6">
            <p className="sticker inline-block bg-card px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.14em]">
              your wallet
            </p>
            <p className="mt-3 font-display text-6xl font-extrabold leading-none">{points}</p>
            <p className="text-sm font-bold text-muted-foreground">
              points · {tier.name} tier
            </p>
            <Progress value={progress} className="chunky mt-4 h-4 rounded-full" />
            <p className="mt-2 text-xs font-semibold text-muted-foreground">
              {tier.next
                ? `${Math.max(0, tier.next - points)} points to level up`
                : "top tier unlocked — legend"}
            </p>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="chunky rounded-2xl bg-card px-4 py-3">
                <Recycle className="size-4 text-leaf" />
                <p className="mt-1 font-display text-2xl font-extrabold">
                  {drops.filter((d) => d.accepted).length}
                </p>
                <p className="text-xs font-semibold text-muted-foreground">bottles accepted</p>
              </div>
              <div className="chunky rounded-2xl bg-card px-4 py-3">
                <Weight className="size-4 text-leaf" />
                <p className="mt-1 font-display text-2xl font-extrabold">{materialSaved(drops)}g</p>
                <p className="text-xs font-semibold text-muted-foreground">material recovered</p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="mb-3 text-2xl">your drop-offs</h2>
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
