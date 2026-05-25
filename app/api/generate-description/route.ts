import Anthropic from "@anthropic-ai/sdk";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

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
    } = body;

    const profitMargin = ((annual_profit / annual_revenue) * 100).toFixed(1);
    const driversText = (key_value_drivers as string[]).map((d, i) => `${i + 1}. ${d}`).join("\n");
    const risksText = (key_risks as string[]).map((r, i) => `${i + 1}. ${r}`).join("\n");

    const userPrompt = `Write a confidential business listing description for the following business:

Industry: ${industry}
Location: ${region}, ${country}
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
