import Anthropic from "@anthropic-ai/sdk";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const DescriptionSchema = z.object({
  industry: z.string().min(1).max(100),
  country: z.string().min(1).max(100),
  region: z.string().min(1).max(100),
  annual_revenue: z.number().nonnegative(),
  annual_profit: z.number(),
  years_operating: z.number().int().nonnegative(),
  valuation_mid: z.number().nonnegative(),
  key_value_drivers: z.array(z.string().max(300)).max(10),
  key_risks: z.array(z.string().max(300)).max(10),
});

function sanitize(value: string): string {
  return value.replace(/[<>]/g, "").trim();
}

const client = new Anthropic();

const SYSTEM_PROMPT = `You are an expert business broker who writes compelling, confidential listing descriptions for businesses for sale. Your descriptions are professional, factual, and highlight genuine strengths without being hyperbolic. You write for sophisticated buyers including private equity firms, family offices, and strategic acquirers.

Write descriptions that:
- Lead with the strongest value proposition
- Include concrete financial performance details
- Highlight operational strengths and market position
- Mention growth opportunities naturally
- Remain confidential (no specific company names or identifying details)
- Are structured in exactly 3 paragraphs
- Total length: 180-220 words`;

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return cookieStore.getAll(); },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          },
        },
      }
    );

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = DescriptionSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    const {
      industry,
      country,
      region,
      annual_revenue,
      annual_profit,
      years_operating,
      valuation_mid,
      key_value_drivers,
      key_risks,
    } = parsed.data;

    const profitMargin = ((annual_profit / annual_revenue) * 100).toFixed(1);
    const driversText = key_value_drivers.map((d, i) => `${i + 1}. ${sanitize(d)}`).join("\n");
    const risksText = key_risks.map((r, i) => `${i + 1}. ${sanitize(r)}`).join("\n");

    const userPrompt = `Write a confidential business listing description for the following business:

Industry: <industry>${sanitize(industry)}</industry>
Location: <location>${sanitize(region)}, ${sanitize(country)}</location>
Years Operating: ${years_operating}
Annual Revenue: $${Number(annual_revenue).toLocaleString()}
Annual Profit: $${Number(annual_profit).toLocaleString()} (${profitMargin}% margin)
Estimated Market Value: $${Number(valuation_mid).toLocaleString()}

Key Value Drivers:
${driversText}

Key Risks (acknowledge briefly, frame constructively):
${risksText}

Write exactly 3 paragraphs. Do not include a heading or title. Do not mention the business by name.`;

    const response = await client.messages.create({
      model: "claude-opus-4-7",
      max_tokens: 600,
      system: [
        {
          type: "text",
          text: SYSTEM_PROMPT,
          cache_control: { type: "ephemeral" },
        },
      ],
      messages: [{ role: "user", content: userPrompt }],
    });

    const description =
      response.content[0].type === "text" ? response.content[0].text : "";

    return NextResponse.json({ description });
  } catch (err) {
    console.error("generate-description error:", err);
    return NextResponse.json(
      { error: "Failed to generate description" },
      { status: 500 }
    );
  }
}
