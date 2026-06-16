import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";

const anthropic = new Anthropic();

// Cap per-request work: each row fans out into a Claude call + an insert.
const MAX_ROWS = 100;

const BulkRowSchema = z
  .object({
    is_anonymous: z.union([z.boolean(), z.string()]).optional(),
    business_name: z.string().max(200).nullable().optional(),
    industry: z.string().min(1).max(100),
    country: z.string().min(1).max(100),
    region: z.string().min(1).max(100),
    annual_revenue: z.coerce.number().nonnegative(),
    annual_profit: z.coerce.number(),
    years_operating: z.coerce.number().int().nonnegative(),
    asking_price: z.coerce.number().nonnegative().nullable().optional(),
    revenue_trend: z.string().max(100).optional(),
    whats_included: z.string().min(1).max(2000),
    transition_period: z.string().min(1).max(2000),
    preferred_buyer: z.string().min(1).max(2000),
    contact_email: z.string().email().max(254),
  })
  .passthrough();

const BulkSchema = z.object({
  rows: z.array(BulkRowSchema).min(1).max(MAX_ROWS),
});

const SYSTEM_PROMPT = `You are an expert business broker who writes compelling, confidential listing descriptions. Write exactly 2 professional paragraphs (total 120–160 words) for each business. Lead with the strongest value proposition. Include concrete financials and operational strengths. Do not use the business name or identifying details. No headings, no bullet points — flowing prose only.`;

function sanitize(value: string): string {
  return value.replace(/[<>]/g, "").trim();
}

async function generateDescription(row: Record<string, unknown>): Promise<string> {
  const industry = sanitize(String(row.industry ?? ""));
  const region = sanitize(String(row.region ?? ""));
  const country = sanitize(String(row.country ?? ""));
  const revenueTrend = sanitize(String(row.revenue_trend ?? "not specified")).slice(0, 100);
  const whatsIncluded = sanitize(String(row.whats_included ?? "")).slice(0, 500);

  try {
    const profitMargin = (
      (Number(row.annual_profit) / Number(row.annual_revenue)) *
      100
    ).toFixed(1);

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 400,
      system: [
        {
          type: "text",
          text: SYSTEM_PROMPT,
          cache_control: { type: "ephemeral" },
        },
      ],
      messages: [
        {
          role: "user",
          content: `Write a 2-paragraph confidential listing description for this business:
Industry: <industry>${industry}</industry>
Location: <location>${region}, ${country}</location>
Annual Revenue: $${Number(row.annual_revenue).toLocaleString()}
Annual Profit: $${Number(row.annual_profit).toLocaleString()} (${profitMargin}% margin)
Years Operating: ${Number(row.years_operating)}
Revenue Trend: <revenue_trend>${revenueTrend}</revenue_trend>
What's Included: <whats_included>${whatsIncluded}</whats_included>`,
        },
      ],
    });

    const block = response.content[0];
    return block.type === "text" ? block.text : "";
  } catch {
    return `This established ${industry} business presents a compelling acquisition opportunity. With $${Number(row.annual_revenue).toLocaleString()} in annual revenue and ${Number(row.years_operating)} years of operating history, it represents a stable and proven enterprise.`;
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

    // Verify broker role
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profile?.role !== "broker") {
      return NextResponse.json({ error: "Broker access required" }, { status: 403 });
    }


    let bodyJson: unknown;
    try {
      bodyJson = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const parsedBody = BulkSchema.safeParse(bodyJson);
    if (!parsedBody.success) {
      return NextResponse.json(
        { error: `Invalid upload — check required fields and limit of ${MAX_ROWS} rows.` },
        { status: 400 }
      );
    }
    const rows = parsedBody.data.rows;

    // Generate descriptions for all rows in parallel
    const descriptions = await Promise.all(rows.map(generateDescription));

    // Build listing payloads
    const payloads = rows.map((row, i) => ({
      user_id: user.id,
      status: "active",
      is_anonymous: row.is_anonymous === true || String(row.is_anonymous).toLowerCase() === "true",
      business_name: row.business_name || null,
      industry: row.industry,
      country: row.country,
      region: row.region,
      annual_revenue: Number(row.annual_revenue),
      annual_profit: Number(row.annual_profit),
      years_operating: Number(row.years_operating),
      asking_price: row.asking_price ? Number(row.asking_price) : null,
      valuation_low: 0,
      valuation_mid: 0,
      valuation_high: 0,
      description: descriptions[i],
      whats_included: String(row.whats_included),
      transition_period: String(row.transition_period),
      preferred_buyer: String(row.preferred_buyer),
      key_value_drivers: [],
      key_risks: [],
    }));

    // Insert all listings
    const results = await Promise.allSettled(
      payloads.map((payload) =>
        supabase.from("listings").insert([payload]).select("id").single()
      )
    );

    // Store contact emails in the protected table for the listings that landed.
    const contactRows = results
      .map((result, i) =>
        result.status === "fulfilled" && result.value.data
          ? { listing_id: result.value.data.id, contact_email: String(rows[i].contact_email) }
          : null
      )
      .filter((r): r is { listing_id: string; contact_email: string } => r !== null);
    if (contactRows.length > 0) {
      const { error: contactError } = await supabase
        .from("listing_contacts")
        .insert(contactRows);
      if (contactError) console.error("bulk listing_contacts insert error:", contactError);
    }

    const succeeded = results.filter((r) => r.status === "fulfilled" && !r.value.error).length;
    const failed = results.length - succeeded;
    const errors: Record<number, string> = {};

    results.forEach((result, i) => {
      if (result.status === "rejected") {
        errors[i] = String(result.reason);
      } else if (result.value.error) {
        errors[i] = result.value.error.message;
      }
    });

    return NextResponse.json({ succeeded, failed, errors, total: rows.length });
  } catch (err) {
    console.error("bulk-upload error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
