import { CheckCircle2, XCircle, Sparkles, Recycle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MATERIAL_LABEL, type Assessment } from "@/lib/greenglam";

type Props = {
  result: Assessment;
  saved: boolean;
  onSave: () => void;
};

const CONDITION_LABEL: Record<Assessment["condition"], string> = {
  excellent: "Excellent condition",
  good: "Good condition",
  fair: "Fair condition",
  poor: "Poor condition",
};

export function ResultCard({ result, saved, onSave }: Props) {
  return (
    <div className="surface rounded-3xl p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            AI intake inspection
          </p>
          <h2 className="mt-1 text-2xl">{result.productName}</h2>
          <p className="text-sm text-muted-foreground">{result.materialDetail}</p>
        </div>
        <div className="gradient-hero flex size-16 shrink-0 flex-col items-center justify-center rounded-2xl px-1 text-center text-primary-foreground shadow-glow">
          <Recycle className="size-4" />
          <span className="text-[11px] font-semibold leading-tight">
            {result.resinCode ? `#${result.resinCode}` : MATERIAL_LABEL[result.material]}
          </span>
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <Stat label="Material" value={MATERIAL_LABEL[result.material]} />
        <Stat label="Condition" value={CONDITION_LABEL[result.condition]} />
        <Stat label="Confidence" value={`${result.confidence}%`} />
      </div>

      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <Stat label="Cleanliness" value={result.cleanliness} />
        <Stat label="Damage" value={result.damage} />
      </div>

      <div
        className={`mt-4 flex items-start gap-2 rounded-2xl px-4 py-3 text-sm font-medium ${
          result.accepted
            ? "bg-secondary text-secondary-foreground"
            : "bg-destructive/10 text-destructive"
        }`}
      >
        {result.accepted ? (
          <CheckCircle2 className="mt-0.5 size-4 shrink-0" />
        ) : (
          <XCircle className="mt-0.5 size-4 shrink-0" />
        )}
        <span>
          {result.accepted
            ? `Accepted for drop-off — worth ${result.points} points.`
            : "Not accepted at intake."}{" "}
          {result.note}
        </span>
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
        disabled={saved || !result.accepted}
        variant={saved || !result.accepted ? "secondary" : "default"}
      >
        <Sparkles className="size-4" />
        {!result.accepted
          ? "Cannot be accepted — try another item"
          : saved
            ? "Logged to your drop-offs"
            : `Confirm drop-off & claim ${result.points} points`}
      </Button>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-muted/70 px-4 py-3">
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-1 text-sm font-semibold">{value}</p>
    </div>
  );
}
