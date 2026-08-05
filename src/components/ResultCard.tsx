import { CheckCircle2, AlertTriangle, Sparkles, Recycle } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Identification } from "@/lib/recycling";

type Props = {
  result: Identification;
  saved: boolean;
  onSave: () => void;
};

export function ResultCard({ result, saved, onSave }: Props) {
  return (
    <div className="surface rounded-3xl p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            AI identification
          </p>
          <h2 className="mt-1 text-2xl">{result.productName}</h2>
        </div>
        <div className="gradient-hero flex size-16 shrink-0 flex-col items-center justify-center rounded-2xl text-primary-foreground shadow-glow">
          <Recycle className="size-4" />
          <span className="text-lg font-bold leading-none">{result.resinCode}</span>
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <Stat label="Resin" value={result.resinName} />
        <Stat label="Confidence" value={`${result.confidence}%`} />
        <Stat label="Eco points" value={`+${result.points}`} />
      </div>

      <p className="mt-4 text-sm text-muted-foreground">
        {result.resinFull}. {result.note}
      </p>

      <div
        className={`mt-4 flex items-center gap-2 rounded-2xl px-4 py-3 text-sm font-medium ${
          result.recyclable
            ? "bg-secondary text-secondary-foreground"
            : "bg-accent/25 text-accent-foreground"
        }`}
      >
        {result.recyclable ? (
          <CheckCircle2 className="size-4" />
        ) : (
          <AlertTriangle className="size-4" />
        )}
        {result.recyclable
          ? "Widely accepted in kerbside recycling"
          : "Hard to recycle — use a beauty take-back programme"}
      </div>

      {result.prepSteps.length > 0 && (
        <ol className="mt-5 space-y-2">
          {result.prepSteps.map((step, i) => (
            <li key={i} className="flex gap-3 text-sm">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold">
                {i + 1}
              </span>
              <span className="pt-0.5 text-muted-foreground">{step}</span>
            </li>
          ))}
        </ol>
      )}

      <Button
        className="mt-6 w-full rounded-full"
        onClick={onSave}
        disabled={saved}
        variant={saved ? "secondary" : "default"}
      >
        <Sparkles className="size-4" />
        {saved ? "Logged to your history" : `Log recycling & claim ${result.points} points`}
      </Button>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-muted/70 px-4 py-3">
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-1 font-semibold">{value}</p>
    </div>
  );
}
