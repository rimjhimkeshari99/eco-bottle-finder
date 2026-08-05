import { createFileRoute } from "@tanstack/react-router";

type Body = { image?: string };

const SYSTEM = [
  "You are the intake inspector for Green Glam, a skincare packaging take-back programme.",
  "You receive a photo of an empty skincare container of ANY material: plastic, glass, silicone, metal or mixed.",
  "Do two jobs: (1) identify the material, (2) judge whether the item is in good enough condition to be accepted.",
  "Reject (accepted=false) only when the item is shattered/cracked glass, heavily contaminated with product, badly",
  "burnt/melted, or is not a skincare/cosmetic container at all. Light scratches, faded labels and residue that can be",
  "rinsed out are still ACCEPTED.",
  "Points guide: glass 40-60, metal 35-50, plastic 20-35, silicone 15-30, mixed/other 10-20.",
  "Scale within the range by condition (excellent highest) and size. If accepted=false, points must be 0.",
  "Reply ONLY with a JSON object with keys:",
  "productName (short guess, e.g. 'Serum dropper bottle'),",
  "material (one of: plastic, glass, silicone, metal, other),",
  "materialDetail (short string, e.g. 'PET pump bottle' or 'Amber soda-lime glass'),",
  "resinCode (integer 1-7 if plastic and inferable, otherwise null),",
  "condition (one of: excellent, good, fair, poor),",
  "accepted (boolean), cleanliness (short phrase), damage (short phrase),",
  "confidence (0-100 integer), points (integer),",
  "prepSteps (array of 3 short strings on preparing it for drop-off),",
  "note (one short sentence explaining the decision).",
  "No markdown, no code fences.",
].join(" ");

export const Route = createFileRoute("/api/identify")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { image } = (await request.json()) as Body;
        if (!image) return new Response("Missing image", { status: 400 });

        const key = process.env["LOVABLE_API_KEY"];
        if (!key) return new Response("Missing LOVABLE_API_KEY", { status: 500 });

        const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
          method: "POST",
          headers: {
            "Lovable-API-Key": key,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "google/gemini-3.6-flash",
            messages: [
              { role: "system", content: SYSTEM },
              {
                role: "user",
                content: [
                  {
                    type: "text",
                    text: "Inspect this empty skincare container: material, condition, and whether Green Glam should accept it.",
                  },
                  { type: "image_url", image_url: { url: image } },
                ],
              },
            ],
            response_format: { type: "json_object" },
          }),
        });

        if (!res.ok) {
          return new Response(await res.text(), { status: res.status });
        }

        const data = (await res.json()) as {
          choices?: Array<{ message?: { content?: string } }>;
        };
        const raw = data.choices?.[0]?.message?.content ?? "";
        const cleaned = raw.replace(/```json|```/g, "").trim();

        try {
          return Response.json(JSON.parse(cleaned));
        } catch {
          return new Response("Could not parse AI response", { status: 502 });
        }
      },
    },
  },
});
