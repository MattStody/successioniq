import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import Anthropic from "@anthropic-ai/sdk";
import type { BuyerProfile } from "@/lib/types";
import { enforceRateLimit, LIMITS } from "@/lib/rate-limit";

export const maxDuration = 60;

const client = new Anthropic();
const MODEL = "claude-haiku-4-5-20251001";

const SYSTEM_PROMPT = `You are a business acquisition matching specialist. Given a buyer's investment criteria and a list of businesses for sale, score each listing 0-100 based on fit.

Scoring factors (apply in this priority order):
1. Capital fit (40 pts): Does the asking price fall within the buyer's capital range?
2. Industry match (35 pts): Does the industry match any of the buyer's preferred industries?
3. Country match (25 pts): Does the business country match any of the buyer's preferred countries?

Partial credit: near-range asking prices, related industries, and flexible acquisition types earn partial points.

Respond ONLY with a valid JSON array — no preamble, no markdown, no text outside the array.`;

type MatchResult = { listing_id: string; score: number; reason: string };

export async function POST(req: Request) {
  const limited = enforceRateLimit(req, "match-listings", LIMITS.matchListings.limit, LIMITS.matchListings.windowMs);
  if (limited) return limited;

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const [profileResult, listingsResult] = await Promise.all([
    supabase.from("buyer_profiles").select("*").eq("id", user.id).single(),
    supabase
      .from("listings")
      .select(
        "id, industry, country, region, asking_price, valuation_mid, annual_revenue, annual_profit, years_operating"
      )
      .eq("status", "active")
      .order("created_at", { ascending: false })
      .limit(50),
  ]);

  if (profileResult.error || !profileResult.data) {
    return NextResponse.json({ error: "Buyer profile not found" }, { status: 404 });
  }

  const buyerProfile = profileResult.data as BuyerProfile;
  const listings = listingsResult.data ?? [];

  if (listings.length === 0) {
    return NextResponse.json({ matches: [], count: 0 });
  }

  const listingIds = new Set(listings.map((l) => l.id));

  const buyerSummary = `Capital Range: $${buyerProfile.capital_min.toLocaleString()} – $${buyerProfile.capital_max.toLocaleString()}
Preferred Industries: ${buyerProfile.preferred_industries.join(", ")}
Preferred Countries: ${buyerProfile.preferred_countries.join(", ")}
Buyer Type: ${buyerProfile.buyer_type}
Acquisition Type: ${buyerProfile.acquisition_type}
Experience: ${buyerProfile.experience_years} years`;

  const listingsSummary = listings.map((l) => ({
    id: l.id,
    industry: l.industry,
    country: l.country,
    asking_price: l.asking_price ?? l.valuation_mid,
    annual_revenue: l.annual_revenue,
    annual_profit: l.annual_profit,
    years_operating: l.years_operating,
  }));

  const userMessage = `Buyer Profile:
${buyerSummary}

Listings to score:
${JSON.stringify(listingsSummary, null, 2)}

Return a JSON array with one object per listing:
[{"listing_id": "<id>", "score": <0-100>, "reason": "<one sentence explaining why this matches or doesn't match>"}]`;

  let matchData: MatchResult[];

  try {
    const response = await client.messages.create({
      model: MODEL,
      max_tokens: 4096,
      system: [
        {
          type: "text",
          text: SYSTEM_PROMPT,
          cache_control: { type: "ephemeral" },
        },
      ],
      messages: [{ role: "user", content: userMessage }],
    });

    const textBlock = response.content.find((b) => b.type === "text");
    if (!textBlock || textBlock.type !== "text") throw new Error("No text response");

    const parsed = JSON.parse(textBlock.text);
    if (!Array.isArray(parsed)) throw new Error("Response is not an array");
    matchData = parsed;
  } catch {
    matchData = listings.map((l) => {
      const askingPrice = l.asking_price ?? l.valuation_mid;
      const inRange =
        askingPrice >= buyerProfile.capital_min && askingPrice <= buyerProfile.capital_max;
      const industryMatch = buyerProfile.preferred_industries.some((i) =>
        l.industry.toLowerCase().includes(i.toLowerCase())
      );
      const countryMatch = buyerProfile.preferred_countries.some((c) =>
        l.country.toLowerCase().includes(c.toLowerCase())
      );
      const score = (inRange ? 40 : 10) + (industryMatch ? 35 : 5) + (countryMatch ? 25 : 0);
      return {
        listing_id: l.id,
        score: Math.min(100, score),
        reason: "Match score calculated based on your acquisition criteria.",
      };
    });
  }

  const now = new Date().toISOString();
  const upsertData = matchData
    .filter((m) => listingIds.has(m.listing_id))
    .map((m) => ({
      listing_id: m.listing_id,
      buyer_id: user.id,
      match_score: Math.max(0, Math.min(100, Math.round(m.score))),
      match_reason: String(m.reason).slice(0, 500),
      updated_at: now,
    }));

  const { error } = await supabase
    .from("listing_matches")
    .upsert(upsertData, { onConflict: "listing_id,buyer_id" });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ matches: upsertData, count: upsertData.length });
}

export async function GET() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await supabase
    .from("listing_matches")
    .select("listing_id, match_score, match_reason")
    .eq("buyer_id", user.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ matches: data ?? [] });
}
