import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { z } from "zod";

const ValuateSchema = z.object({
  industry: z.string().min(1).max(100),
  country: z.string().min(1).max(100),
  region: z.string().min(1).max(100),
  revenue: z.number().nonnegative(),
  netProfit: z.number(),
  yearsInOperation: z.number().int().nonnegative(),
  revenueTrend: z.enum(["Growing 20%+", "Growing 10-20%", "Growing 0-10%", "Flat", "Declining"]),
  ownerDependency: z.number().int().min(1).max(10),
  customerConcentration: z.string().min(1).max(200),
  reasonForSelling: z.string().min(1).max(500),
  askingPrice: z.number().nonnegative().nullable().optional(),
});

function sanitize(value: string): string {
  return value.replace(/[<>]/g, "").trim();
}

const client = new Anthropic();

export const maxDuration = 60;

const SYSTEM_PROMPT =
  "You are a certified business valuation analyst with 20+ years of experience in SMB M&A transactions across North America, Europe, and Australia. You apply the three standard valuation methods — SDE multiple, EBITDA multiple, and DCF — weighted by business size and type. Your output must always be defensible (grounded in real market multiples), honest (surface risks clearly), and useful (written for a business owner, not a finance expert). Respond ONLY with valid JSON, no preamble or markdown.";

const MODEL_PARAMS = {
  model: "claude-opus-4-5" as const,
  max_tokens: 1024,
  system: [
    {
      type: "text" as const,
      text: SYSTEM_PROMPT,
      cache_control: { type: "ephemeral" as const },
    },
  ],
};

const TRANSIENT_STATUS_CODES = new Set([429, 503, 529]);

async function callClaude(
  messages: Anthropic.MessageParam[]
): Promise<Anthropic.Message> {
  try {
    return await client.messages.create({ ...MODEL_PARAMS, messages });
  } catch (err) {
    if (err instanceof Anthropic.APIError && TRANSIENT_STATUS_CODES.has(err.status)) {
      console.warn("callClaude transient error, retrying once:", err.status, err.message);
      return await client.messages.create({ ...MODEL_PARAMS, messages });
    }
    throw err;
  }
}

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
    const parsed = ValuateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    const {
      industry,
      country,
      region,
      revenue,
      netProfit,
      yearsInOperation,
      revenueTrend,
      ownerDependency,
      customerConcentration,
      reasonForSelling,
      askingPrice,
    } = parsed.data;

    const userContent = `Provide a business valuation for the following:

Industry: <industry>${sanitize(industry)}</industry>
Location: <location>${sanitize(region)}, ${sanitize(country)}</location>
Annual Revenue: $${Number(revenue).toLocaleString()}
Annual Net Profit: $${Number(netProfit).toLocaleString()}
Years in Operation: ${yearsInOperation}
Revenue Trend (last 3 years): ${revenueTrend}
Owner Dependency: ${ownerDependency}/10 — 1 = business runs itself, 10 = owner does everything
Customer Concentration: <customer_concentration>${sanitize(customerConcentration)}</customer_concentration>
Reason for Selling: <reason_for_selling>${sanitize(reasonForSelling)}</reason_for_selling>
${askingPrice ? `Owner Asking Price: $${Number(askingPrice).toLocaleString()}` : "No asking price specified"}

Respond ONLY with this JSON object — no other text, no markdown:
{
  "valuation_low": <integer>,
  "valuation_mid": <integer>,
  "valuation_high": <integer>,
  "primary_method": "<SDE Multiple | EBITDA Multiple | DCF>",
  "multiple_applied": <float>,
  "comparable_range": { "low": <float>, "high": <float> },
  "confidence": "<High | Medium | Low>",
  "key_value_drivers": ["<string>", "<string>", "<string>"],
  "key_risks": ["<string>", "<string>", "<string>"],
  "summary": "<2–3 sentences written plainly for a business owner>"
}`;

    const messages: Anthropic.MessageParam[] = [
      { role: "user", content: userContent },
    ];

    const response = await callClaude(messages);

    const block = response.content.find((b) => b.type === "text");
    if (!block || block.type !== "text") throw new Error("No text content in response");

    let result: Record<string, unknown>;
    try {
      result = JSON.parse(block.text);
    } catch {
      const fixResponse = await callClaude([
        ...messages,
        { role: "assistant", content: block.text },
        {
          role: "user",
          content:
            "Your previous response was not valid JSON. Return only the valid JSON object — no other text, no markdown.",
        },
      ]);
      const fixBlock = fixResponse.content.find((b) => b.type === "text");
      if (!fixBlock || fixBlock.type !== "text") throw new Error("No text content in fix response");
      result = JSON.parse(fixBlock.text);
    }

    // Save to DB
    let saved = false;
    let valuation_id: string | null = null;

    try {
      const { data } = await supabase.from("valuations").insert([{
          user_id: user.id,
          industry,
          country,
          region,
          annual_revenue: Number(revenue),
          annual_profit: Number(netProfit),
          years_operating: Number(yearsInOperation),
          valuation_low: result.valuation_low,
          valuation_mid: result.valuation_mid,
          valuation_high: result.valuation_high,
          primary_method: result.primary_method,
          multiple_applied: result.multiple_applied,
          confidence: result.confidence,
          summary: result.summary,
          key_value_drivers: result.key_value_drivers,
          key_risks: result.key_risks,
        }]).select().single();

      if (data) {
        saved = true;
        valuation_id = data.id;
      }
    } catch {
      // Non-fatal — valuation result still returned
    }

    return NextResponse.json({ ...result, saved, valuation_id });
  } catch (err) {
    console.error("Valuation error:", err);
    return NextResponse.json(
      { error: "Something went wrong, please try again." },
      { status: 500 }
    );
  }
}
