import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { Boxes, Factory, Recycle, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { SiteNav } from "@/components/SiteNav";

export const Route = createFileRoute("/partners")({
  head: () => ({
    meta: [
      { title: "Recycled Raw Material for Skincare Brands — Green Glam" },
      {
        name: "description",
        content:
          "Green Glam collects skincare empties, sorts plastic, glass and silicone, and supplies manufacturers with recycled raw material for new packaging.",
      },
      {
        property: "og:title",
        content: "Recycled Raw Material for Skincare Brands — Green Glam",
      },
      {
        property: "og:description",
        content:
          "Closed-loop supply: we collect and inspect empties, then supply manufacturers with sorted recyclate.",
      },
    ],
  }),
  component: Partners,
});

const STEPS = [
  {
    icon: Recycle,
    title: "We collect",
    body: "Customers return empties of any material and get points — inspected by AI at intake.",
  },
  {
    icon: Boxes,
    title: "We sort & process",
    body: "Plastic is shredded to flake, glass is cullet-graded, silicone is separated for downcycling.",
  },
  {
    icon: Truck,
    title: "You receive raw material",
    body: "Certified batches of rPET, rHDPE, glass cullet and silicone crumb, delivered to your plant.",
  },
  {
    icon: Factory,
    title: "We stock your product",
    body: "Brands manufacturing with our recyclate get listed in the Green Glam shop.",
  },
];

const MATERIALS = [
  { name: "rPET flake", spec: "Food-grade, ≤50 ppm contamination", price: "₹78 / kg" },
  { name: "rHDPE pellets", spec: "Natural & mixed colour lots", price: "₹92 / kg" },
  { name: "Glass cullet", spec: "Colour-sorted, furnace-ready", price: "₹14 / kg" },
  { name: "Silicone crumb", spec: "Platinum-cure, 2-4 mm", price: "₹120 / kg" },
];

function Partners() {
  const [sent, setSent] = useState(false);

  return (
    <main className="mx-auto w-full max-w-6xl px-4 pb-20 pt-8 sm:px-6">
      <SiteNav />

      <section className="mt-12 max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          For manufacturers
        </p>
        <h1 className="mt-4 text-4xl leading-tight sm:text-5xl">
          Closed-loop raw material from beauty empties
        </h1>
        <p className="mt-4 text-muted-foreground">
          We take back skincare packaging in plastic, glass and silicone, inspect and sort it, then
          supply your production line with recycled material — and sell your finished product back
          to the same customers.
        </p>
      </section>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {STEPS.map((s) => (
          <div key={s.title} className="surface rounded-3xl p-5">
            <span className="gradient-hero flex size-9 items-center justify-center rounded-xl text-primary-foreground">
              <s.icon className="size-4" />
            </span>
            <h2 className="mt-3 text-lg">{s.title}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{s.body}</p>
          </div>
        ))}
      </div>

      <section className="mt-14 grid gap-8 lg:grid-cols-[1.1fr_1fr]">
        <div>
          <h2 className="text-2xl">Material catalogue</h2>
          <ul className="mt-4 space-y-3">
            {MATERIALS.map((m) => (
              <li
                key={m.name}
                className="surface flex items-center justify-between gap-4 rounded-2xl px-5 py-4"
              >
                <div>
                  <p className="font-semibold">{m.name}</p>
                  <p className="text-sm text-muted-foreground">{m.spec}</p>
                </div>
                <span className="shrink-0 text-sm font-semibold">{m.price}</span>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-muted-foreground">
            Indicative pricing for 500 kg+ lots; final quote after sample approval.
          </p>
        </div>

        <div className="surface gradient-soft rounded-3xl p-6">
          <h2 className="text-2xl">Request a supply quote</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Tell us what you manufacture and the volumes you need.
          </p>
          <form
            className="mt-5 space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              setSent(true);
              toast.success("Enquiry received — our supply team will be in touch.");
            }}
          >
            <div className="space-y-1.5">
              <Label htmlFor="company">Company</Label>
              <Input id="company" required placeholder="Verdant Lab Pvt Ltd" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email">Work email</Label>
              <Input id="email" type="email" required placeholder="supply@yourbrand.com" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="needs">What do you need?</Label>
              <Textarea
                id="needs"
                required
                rows={4}
                placeholder="2 tonnes of food-grade rPET flake per month for 50 ml serum bottles."
              />
            </div>
            <Button type="submit" className="w-full rounded-full" disabled={sent}>
              {sent ? "Enquiry sent" : "Send enquiry"}
            </Button>
          </form>
        </div>
      </section>
    </main>
  );
}
