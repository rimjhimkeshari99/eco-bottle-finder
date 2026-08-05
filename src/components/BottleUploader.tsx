import { useCallback, useRef, useState } from "react";
import { Upload, Camera, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
  image: string | null;
  loading: boolean;
  onSelect: (dataUrl: string) => void;
  onClear: () => void;
  onScan: () => void;
};

export function BottleUploader({ image, loading, onSelect, onClear, onScan }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const handleFiles = useCallback(
    (files: FileList | null) => {
      const file = files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => onSelect(String(reader.result));
      reader.readAsDataURL(file);
    },
    [onSelect],
  );

  return (
    <div className="surface rounded-3xl p-5 sm:p-6">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />

      {image ? (
        <div className="space-y-4">
          <div className="relative overflow-hidden rounded-2xl bg-muted">
            <img
              src={image}
              alt="Uploaded skincare bottle awaiting plastic identification"
              className="mx-auto max-h-80 w-full object-contain"
            />
            <button
              type="button"
              onClick={onClear}
              aria-label="Remove photo"
              className="absolute right-3 top-3 rounded-full bg-background/85 p-2 text-foreground backdrop-blur transition hover:bg-background"
            >
              <X className="size-4" />
            </button>
          </div>
          <Button size="lg" className="w-full rounded-full" onClick={onScan} disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="size-4 animate-spin" /> Analysing plastic…
              </>
            ) : (
              <>
                <Camera className="size-4" /> Identify plastic type
              </>
            )}
          </Button>
        </div>
      ) : (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            handleFiles(e.dataTransfer.files);
          }}
          onClick={() => inputRef.current?.click()}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
          className={`flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed px-6 py-14 text-center transition ${
            dragging ? "border-primary bg-secondary/60" : "border-border gradient-soft"
          }`}
        >
          <span className="gradient-hero flex size-14 items-center justify-center rounded-2xl text-primary-foreground shadow-glow">
            <Upload className="size-6" />
          </span>
          <p className="font-semibold">Drop a bottle photo here</p>
          <p className="max-w-xs text-sm text-muted-foreground">
            Serums, cleansers, jars, pumps — one container per photo, label facing the camera.
          </p>
          <Button variant="secondary" className="mt-2 rounded-full">
            Browse photos
          </Button>
        </div>
      )}
    </div>
  );
}
