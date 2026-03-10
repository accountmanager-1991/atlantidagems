import { NextRequest, NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin-auth";

export async function POST(request: NextRequest) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "ANTHROPIC_API_KEY not configured" },
      { status: 500 }
    );
  }

  try {
    const { name, category, stoneType, metalType, stoneOrigin, weightGrams, dimensions } = await request.json();

    const prompt = `You are a luxury jewelry copywriter for Ambar & Larimar Shop, a Dominican Republic jewelry brand specializing in Larimar and Amber gemstones.

Generate product descriptions for this jewelry piece in THREE languages (English, Spanish, German):
- Name: ${name}
- Category: ${category}
- Stone: ${stoneType}
- Metal: ${metalType}
- Origin: ${stoneOrigin || "Dominican Republic"}
- Weight: ${weightGrams ? weightGrams + "g" : "not specified"}
- Dimensions: ${dimensions || "not specified"}

Respond in this exact JSON format (no markdown, no code blocks):
{
  "en": {
    "short": "One compelling sentence (under 150 chars) highlighting the key selling point in English.",
    "full": "2-3 sentences in English. Evoke luxury and rarity. Mention the stone origin, craftsmanship, and what makes it special."
  },
  "es": {
    "short": "Una oracion convincente (menos de 150 caracteres) destacando el punto de venta clave en espanol.",
    "full": "2-3 oraciones en espanol. Evocar lujo y rareza. Mencionar el origen de la piedra, la artesania y lo que la hace especial."
  },
  "de": {
    "short": "Ein uberzeugender Satz (unter 150 Zeichen) der den Hauptverkaufspunkt auf Deutsch hervorhebt.",
    "full": "2-3 Satze auf Deutsch. Luxus und Seltenheit hervorrufen. Den Ursprung des Steins, die Handwerkskunst und das Besondere erwahnen."
  }
}`;

    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 1000,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("Anthropic API error:", err);
      return NextResponse.json({ error: "AI generation failed" }, { status: 500 });
    }

    const data = await res.json();
    const text = data.content[0]?.text || "";
    const parsed = JSON.parse(text);

    return NextResponse.json({
      en: { short: parsed.en.short, full: parsed.en.full },
      es: { short: parsed.es.short, full: parsed.es.full },
      de: { short: parsed.de.short, full: parsed.de.full },
    });
  } catch (error) {
    console.error("Generate error:", error);
    return NextResponse.json({ error: "Failed to generate descriptions" }, { status: 500 });
  }
}
