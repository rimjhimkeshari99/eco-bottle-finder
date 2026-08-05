import { Leaf, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MATERIAL_LABEL, type DropEntry } from "@/lib/greenglam";

export function HistoryList({
  entries,
  onRemove,
}: {
  entries: DropEntry[];
  onRemove: (id: string) => void;
}) {
  if (entries.length === 0) {
    return (
      <div className="surface flex flex-col items-center gap-2 rounded-[2rem] px-6 py-12 text-center">
        <Leaf className="size-7 animate-wiggle text-leaf" />
        <p className="font-display text-xl font-extrabold">nothing here yet 👀</p>
        <p className="max-w-xs text-sm font-medium text-muted-foreground">
          scan your first empty and watch the points roll in.
        </p>
      </div>
    );
  }

  return (
    <ul className="space-y-3">
      {entries.map((e) => (
        <li key={e.id} className="surface pop-hover flex items-center gap-3 rounded-3xl p-3">
          <img
            src={e.image}
            alt={`Dropped off ${e.productName}`}
            className="chunky size-16 shrink-0 rounded-2xl bg-muted object-cover"
          />
          <div className="min-w-0 flex-1">
            <p className="truncate font-display font-extrabold">{e.productName}</p>
            <p className="text-xs font-medium text-muted-foreground">
              {MATERIAL_LABEL[e.material]} · {e.condition} ·{" "}
              {new Date(e.createdAt).toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
              })}
            </p>
          </div>
          <span className="sticker bg-lime px-3 py-1 text-sm font-extrabold text-foreground">
            +{e.points}
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full"
            aria-label={`Remove ${e.productName} from history`}
            onClick={() => onRemove(e.id)}
          >
            <Trash2 className="size-4" />
          </Button>
        </li>
      ))}
    </ul>
  );
}
