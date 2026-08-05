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
      <div className="surface flex flex-col items-center gap-2 rounded-3xl px-6 py-12 text-center">
        <Leaf className="size-6 text-leaf" />
        <p className="font-semibold">No drop-offs yet</p>
        <p className="max-w-xs text-sm text-muted-foreground">
          Scan your first empty bottle and it will appear here with the points you earned.
        </p>
      </div>
    );
  }

  return (
    <ul className="space-y-3">
      {entries.map((e) => (
        <li key={e.id} className="surface flex items-center gap-4 rounded-2xl p-3">
          <img
            src={e.image}
            alt={`Dropped off ${e.productName}`}
            className="size-16 shrink-0 rounded-xl bg-muted object-cover"
          />
          <div className="min-w-0 flex-1">
            <p className="truncate font-semibold">{e.productName}</p>
            <p className="text-sm text-muted-foreground">
              {MATERIAL_LABEL[e.material]} · {e.condition} ·{" "}
              {new Date(e.createdAt).toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
              })}
            </p>
          </div>
          <span className="rounded-full bg-secondary px-3 py-1 text-sm font-semibold text-secondary-foreground">
            +{e.points}
          </span>
          <Button
            variant="ghost"
            size="icon"
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
