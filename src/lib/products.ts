export type Product = {
  id: string;
  name: string;
  brand: string;
  blurb: string;
  price: number;
  points: number;
  packaging: string;
  tone: string;
};

/** Skincare sourced directly from partner manufacturers, in refillable packaging. */
export const PRODUCTS: Product[] = [
  {
    id: "gg-cleanser",
    name: "Gentle Gel Cleanser",
    brand: "Verdant Lab",
    blurb: "Amino-acid cleanser that lifts SPF without stripping the barrier.",
    price: 549,
    points: 220,
    packaging: "Recycled PET pump — returnable",
    tone: "from-[oklch(0.9_0.06_155)] to-[oklch(0.96_0.03_120)]",
  },
  {
    id: "gg-serum",
    name: "10% Niacinamide Serum",
    brand: "Verdant Lab",
    blurb: "Evens tone and calms post-acne marks in a refillable glass dropper.",
    price: 699,
    points: 280,
    packaging: "Glass dropper — refill pods available",
    tone: "from-[oklch(0.93_0.05_95)] to-[oklch(0.97_0.02_100)]",
  },
  {
    id: "gg-moist",
    name: "Barrier Repair Moisturiser",
    brand: "Aloe & Ash",
    blurb: "Ceramides plus squalane in a silicone-free whipped cream.",
    price: 799,
    points: 320,
    packaging: "Aluminium jar — infinitely recyclable",
    tone: "from-[oklch(0.92_0.05_140)] to-[oklch(0.97_0.02_120)]",
  },
  {
    id: "gg-spf",
    name: "Everyday Mineral SPF 50",
    brand: "Aloe & Ash",
    blurb: "No white cast, reef-safe filters, made from our recovered polymer.",
    price: 899,
    points: 360,
    packaging: "rPET tube — 60% Green Glam recyclate",
    tone: "from-[oklch(0.94_0.06_85)] to-[oklch(0.97_0.02_95)]",
  },
  {
    id: "gg-oil",
    name: "Cold-Pressed Facial Oil",
    brand: "Sombre Botanics",
    blurb: "Rosehip and jojoba blend for overnight repair.",
    price: 649,
    points: 260,
    packaging: "Amber glass — return for ₹50 credit",
    tone: "from-[oklch(0.91_0.05_60)] to-[oklch(0.97_0.02_80)]",
  },
  {
    id: "gg-mask",
    name: "Clay Detox Mask",
    brand: "Sombre Botanics",
    blurb: "Kaolin and green tea weekly reset for congested skin.",
    price: 499,
    points: 200,
    packaging: "Silicone-lined tub — take-back scheme",
    tone: "from-[oklch(0.9_0.04_170)] to-[oklch(0.97_0.02_150)]",
  },
];
