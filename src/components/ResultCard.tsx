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
    <div className="surface animate-scale-in rounded-[2rem] p-5 sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="sticker inline-block bg-sky px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.14em]">
            ai verdict
          </p>
          <h2 className="mt-2 text-2xl">{result.productName}</h2>
          <p className="text-sm font-medium text-muted-foreground">{result.materialDetail}</p>
        </div>
        <div className="gradient-hero chunky flex size-16 shrink-0 flex-col items-center justify-center rounded-2xl px-1 text-center text-foreground">
          <Recycle className="size-4" />
          <span className="text-[11px] font-extrabold leading-tight">
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
        className={`chunky mt-4 flex items-start gap-2 rounded-2xl px-4 py-3 text-sm font-semibold ${
          result.accepted ? "bg-lime text-foreground" : "bg-destructive/15 text-destructive"
        }`}
      >
        {result.accepted ? (
          <CheckCircle2 className="mt-0.5 size-4 shrink-0" />
        ) : (
          <XCircle className="mt-0.5 size-4 shrink-0" />
        )}
        <span>
          {result.accepted
            ? `accepted — worth ${result.points} points`
            : "not accepted at intake."}{" "}
          {result.note}
        </span>
      </div>

      {result.prepSteps.length > 0 && (
        <ol className="mt-5 space-y-2">
          {result.prepSteps.map((step, i) => (
            <li key={i} className="flex gap-3 text-sm">
              <span className="sticker flex size-6 shrink-0 items-center justify-center bg-card text-xs font-extrabold">
                {i + 1}
              </span>
              <span className="pt-0.5 font-medium text-muted-foreground">{step}</span>
            </li>
          ))}
        </ol>
      )}

      <Button
        className="chunky pop-hover mt-6 w-full rounded-full text-base font-extrabold"
        onClick={onSave}
        disabled={saved || !result.accepted}
        variant={saved || !result.accepted ? "secondary" : "default"}
      >
        <Sparkles className="size-4" />
        {!result.accepted
          ? "can't take this one — try another"
          : saved
            ? "logged ✓"
            : `claim ${result.points} points`}
      </Button>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="chunky rounded-2xl bg-muted px-4 py-3">
      <p className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-1 text-sm font-extrabold">{value}</p>
    </div>
  );
}
