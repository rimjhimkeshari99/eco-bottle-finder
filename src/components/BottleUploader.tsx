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
    <div className="surface rounded-[2rem] p-4 sm:p-5">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />

      {image ? (
        <div className="space-y-4">
          <div className="chunky relative overflow-hidden rounded-3xl bg-muted">
            <img
              src={image}
              alt="Uploaded skincare bottle awaiting plastic identification"
              className="mx-auto max-h-80 w-full object-contain"
            />
            <button
              type="button"
              onClick={onClear}
              aria-label="Remove photo"
              className="sticker absolute right-3 top-3 bg-card p-2 text-foreground transition hover:bg-lime"
            >
              <X className="size-4" />
            </button>
          </div>
          <Button
            size="lg"
            className="chunky pop-hover w-full rounded-full text-base font-extrabold"
            onClick={onScan}
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="size-4 animate-spin" /> scanning your empty…
              </>
            ) : (
              <>
                <Camera className="size-4" /> scan it →
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
          className={`flex cursor-pointer flex-col items-center justify-center gap-3 rounded-3xl border-2 border-dashed px-6 py-14 text-center transition ${
            dragging ? "border-foreground bg-lime" : "border-foreground/40 gradient-soft"
          }`}
        >
          <span className="gradient-hero chunky flex size-16 animate-float items-center justify-center rounded-2xl text-foreground">
            <Upload className="size-6" />
          </span>
          <p className="font-display text-2xl font-extrabold">drop that empty here</p>
          <p className="max-w-xs text-sm font-medium text-muted-foreground">
            serums, cleansers, jars, pumps — one bottle per pic, label facing the cam 📸
          </p>
          <Button className="chunky pop-hover mt-2 rounded-full bg-lime font-extrabold text-foreground hover:bg-lime">
            browse photos
          </Button>
        </div>
      )}
    </div>
  );
}
