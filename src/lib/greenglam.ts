export type Material = "plastic" | "glass" | "silicone" | "metal" | "other";

export type Assessment = {
  productName: string;
  material: Material;
  materialDetail: string;
  resinCode: number | null;
  condition: "excellent" | "good" | "fair" | "poor";
  accepted: boolean;
  cleanliness: string;
  damage: string;
  confidence: number;
  points: number;
  prepSteps: string[];
  note: string;
};

export type DropEntry = Assessment & {
  id: string;
  image: string;
  createdAt: string;
};

export type Redemption = {
  id: string;
  productId: string;
  productName: string;
  points: number;
  createdAt: string;
};

const DROPS_KEY = "greenglam.drops.v1";
const ORDERS_KEY = "greenglam.orders.v1";

function read<T>(key: string): T[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T[]) : [];
  } catch {
    return [];
  }
}

function write<T>(key: string, value: T[]) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage unavailable */
  }
}

export const loadDrops = () => read<DropEntry>(DROPS_KEY);
export const saveDrops = (v: DropEntry[]) => write(DROPS_KEY, v);
export const loadOrders = () => read<Redemption>(ORDERS_KEY);
export const saveOrders = (v: Redemption[]) => write(ORDERS_KEY, v);

export function earnedPoints(drops: DropEntry[]) {
  return drops.reduce((sum, d) => sum + (d.accepted ? d.points : 0), 0);
}

export function spentPoints(orders: Redemption[]) {
  return orders.reduce((sum, o) => sum + o.points, 0);
}

export function balance(drops: DropEntry[], orders: Redemption[]) {
  return earnedPoints(drops) - spentPoints(orders);
}

/** Average empty skincare container weight by material, in grams. */
const WEIGHTS: Record<Material, number> = {
  plastic: 28,
  glass: 110,
  silicone: 22,
  metal: 45,
  other: 30,
};

export function materialSaved(drops: DropEntry[]) {
  return drops
    .filter((d) => d.accepted)
    .reduce((sum, d) => sum + (WEIGHTS[d.material] ?? 30), 0);
}

export function tierFor(points: number) {
  if (points >= 500) return { name: "Evergreen", next: null as number | null };
  if (points >= 250) return { name: "Grove", next: 500 };
  if (points >= 100) return { name: "Sapling", next: 250 };
  return { name: "Seedling", next: 100 };
}

export const MATERIAL_LABEL: Record<Material, string> = {
  plastic: "Plastic",
  glass: "Glass",
  silicone: "Silicone",
  metal: "Metal",
  other: "Mixed / other",
};

export function fileToDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Could not read file"));
    reader.readAsDataURL(file);
  });
}

export async function assessBottle(image: string): Promise<Assessment> {
  const res = await fetch("/api/identify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ image }),
  });

  if (res.status === 429) throw new Error("Too many scans — try again in a moment.");
  if (res.status === 402) throw new Error("AI credits exhausted. Add credits to keep scanning.");
  if (!res.ok) throw new Error("Could not read this bottle. Try a clearer, well-lit photo.");

  const data = (await res.json()) as Partial<Assessment>;
  const material = (["plastic", "glass", "silicone", "metal", "other"] as Material[]).includes(
    data.material as Material,
  )
    ? (data.material as Material)
    : "other";

  return {
    productName: data.productName || "Skincare container",
    material,
    materialDetail: data.materialDetail || MATERIAL_LABEL[material],
    resinCode: typeof data.resinCode === "number" ? data.resinCode : null,
    condition: (["excellent", "good", "fair", "poor"] as const).includes(
      data.condition as Assessment["condition"],
    )
      ? (data.condition as Assessment["condition"])
      : "fair",
    accepted: Boolean(data.accepted),
    cleanliness: data.cleanliness || "Not assessed",
    damage: data.damage || "None detected",
    confidence: Number(data.confidence) || 0,
    points: Math.max(0, Number(data.points) || 0),
    prepSteps: Array.isArray(data.prepSteps) ? data.prepSteps.slice(0, 4) : [],
    note: data.note || "",
  };
}
