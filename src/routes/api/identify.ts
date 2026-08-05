import { createFileRoute } from "@tanstack/react-router";

type Body = { image?: string };

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
              {
                role: "system",
                content:
                  "You are a recycling expert specialised in skincare and cosmetics packaging. " +
                  "Given a photo of a bottle or jar, identify the most likely plastic resin type. " +
                  "Reply ONLY with a JSON object with keys: " +
                  "productName (short guess of the item, e.g. 'Serum pump bottle'), " +
                  "resinCode (integer 1-7), resinName (e.g. 'PET'), resinFull (e.g. 'Polyethylene Terephthalate'), " +
                  "confidence (0-100 integer), recyclable (boolean), " +
                  "points (integer 5-50 eco points reflecting recycling value), " +
                  "prepSteps (array of 3 short strings on how to prepare it for recycling), " +
                  "note (one short sentence of context). No markdown, no code fences.",
              },
              {
                role: "user",
                content: [
                  { type: "text", text: "Identify the plastic type of this skincare container." },
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
