export type Identification = {
  productName: string;
  resinCode: number;
  resinName: string;
  resinFull: string;
  confidence: number;
  recyclable: boolean;
  points: number;
  prepSteps: string[];
  note: string;
};

export type RecycleEntry = Identification & {
  id: string;
  image: string;
  createdAt: string;
};

const KEY = "rebottle.history.v1";

export function loadHistory(): RecycleEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as RecycleEntry[]) : [];
  } catch {
    return [];
  }
}

export function saveHistory(entries: RecycleEntry[]) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(entries));
  } catch {
    /* storage unavailable */
  }
}

export function totalPoints(entries: RecycleEntry[]) {
  return entries.reduce((sum, e) => sum + (e.points || 0), 0);
}

/** Rough estimate: ~28g of plastic diverted per skincare container. */
export function plasticSaved(entries: RecycleEntry[]) {
  return entries.filter((e) => e.recyclable).length * 28;
}

export function tierFor(points: number) {
  if (points >= 500) return { name: "Evergreen", next: null as number | null };
  if (points >= 250) return { name: "Grove", next: 500 };
  if (points >= 100) return { name: "Sapling", next: 250 };
  return { name: "Seedling", next: 100 };
}

export function fileToDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Could not read file"));
    reader.readAsDataURL(file);
  });
}

export async function identifyBottle(image: string): Promise<Identification> {
  const res = await fetch("/api/identify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ image }),
  });

  if (res.status === 429) throw new Error("Too many requests — try again in a moment.");
  if (res.status === 402) throw new Error("AI credits exhausted. Add credits to keep scanning.");
  if (!res.ok) throw new Error("Could not identify this bottle. Try a clearer photo.");

  const data = (await res.json()) as Partial<Identification>;
  return {
    productName: data.productName || "Skincare container",
    resinCode: Number(data.resinCode) || 7,
    resinName: data.resinName || "Other",
    resinFull: data.resinFull || "Unspecified resin",
    confidence: Number(data.confidence) || 0,
    recyclable: Boolean(data.recyclable),
    points: Number(data.points) || 10,
    prepSteps: Array.isArray(data.prepSteps) ? data.prepSteps.slice(0, 4) : [],
    note: data.note || "",
  };
}
