import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { Leaf, Recycle, Sparkles, Weight } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { BottleUploader } from "@/components/BottleUploader";
import { ResultCard } from "@/components/ResultCard";
import { HistoryList } from "@/components/HistoryList";
import {
  identifyBottle,
  loadHistory,
  plasticSaved,
  saveHistory,
  tierFor,
  totalPoints,
  type Identification,
  type RecycleEntry,
} from "@/lib/recycling";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ReBottle — Recycle Skincare Bottles with AI" },
      {
        name: "description",
        content:
          "Upload an empty skincare bottle, let AI identify its plastic resin, log your recycling history and earn eco points.",
      },
      { property: "og:title", content: "ReBottle — Recycle Skincare Bottles with AI" },
      {
        property: "og:description",
        content:
          "AI plastic identification for beauty packaging, with recycling history and eco points.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  const [image, setImage] = useState<string | null>(null);
  const [result, setResult] = useState<Identification | null>(null);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [entries, setEntries] = useState<RecycleEntry[]>([]);

  useEffect(() => setEntries(loadHistory()), []);

  const points = useMemo(() => totalPoints(entries), [entries]);
  const tier = tierFor(points);
  const progress = tier.next ? Math.min(100, (points / tier.next) * 100) : 100;

  const update = (next: RecycleEntry[]) => {
    setEntries(next);
    saveHistory(next);
  };

  async function scan() {
    if (!image) return;
    setLoading(true);
    setResult(null);
    setSaved(false);
    try {
      setResult(await identifyBottle(image));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  function logEntry() {
    if (!result || !image) return;
    update([
      { ...result, id: crypto.randomUUID(), image, createdAt: new Date().toISOString() },
      ...entries,
    ]);
    setSaved(true);
    toast.success(`+${result.points} eco points earned`);
  }

  return (
    <main className="mx-auto w-full max-w-6xl px-4 pb-20 pt-8 sm:px-6">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="gradient-hero flex size-9 items-center justify-center rounded-xl text-primary-foreground">
            <Recycle className="size-4" />
          </span>
          <span className="font-display text-lg font-semibold">ReBottle</span>
        </div>
        <div className="flex items-center gap-2 rounded-full bg-secondary px-4 py-1.5 text-sm font-semibold text-secondary-foreground">
          <Sparkles className="size-4" /> {points} pts
        </div>
      </header>

      <section className="mt-12 text-center">
        <p className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          <Leaf className="size-3.5 text-leaf" /> AI-powered
        </p>
        <h1 className="mx-auto mt-5 max-w-3xl text-4xl leading-tight sm:text-6xl">
          Every empty bottle deserves a second life
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
          Photograph your finished skincare packaging. Our AI reads the container, identifies the
          plastic resin, and tells you exactly how to recycle it — while you collect eco points.
        </p>
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
              Your impact
            </p>
            <p className="mt-2 font-display text-5xl font-semibold">{points}</p>
            <p className="text-sm text-muted-foreground">eco points · {tier.name} tier</p>
            <Progress value={progress} className="mt-4" />
            <p className="mt-2 text-xs text-muted-foreground">
              {tier.next
                ? `${tier.next - points} points to the next tier`
                : "Top tier reached — legendary recycler"}
            </p>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-card/80 px-4 py-3">
                <Recycle className="size-4 text-leaf" />
                <p className="mt-1 text-xl font-semibold">{entries.length}</p>
                <p className="text-xs text-muted-foreground">bottles logged</p>
              </div>
              <div className="rounded-2xl bg-card/80 px-4 py-3">
                <Weight className="size-4 text-leaf" />
                <p className="mt-1 text-xl font-semibold">{plasticSaved(entries)}g</p>
                <p className="text-xs text-muted-foreground">plastic diverted</p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="mb-3 text-xl">Recycling history</h2>
            <HistoryList
              entries={entries}
              onRemove={(id) => update(entries.filter((e) => e.id !== id))}
            />
          </div>
        </aside>
      </div>
    </main>
  );
}
