import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { z } from "zod";

const BuyerProfileSchema = z.object({
  full_name: z.string().min(1).max(200),
  phone: z.string().max(30).nullable().optional(),
  capital_min: z.number().min(0).max(1_000_000_000_000),
  capital_max: z.number().min(0).max(1_000_000_000_000),
  preferred_industries: z.array(z.string().max(100)).min(1),
  preferred_countries: z.array(z.string().max(100)).min(1),
  preferred_regions: z.array(z.string().max(100)).nullable().optional(),
  experience_years: z.number().int().min(0).max(60),
  acquisition_type: z.enum(["full_acquisition", "partial_stake", "either"]),
  buyer_type: z.enum(["individual", "search_fund", "private_equity", "strategic"]),
  background_summary: z.string().max(1000).nullable().optional(),
  notification_preferences: z.object({
    new_matches: z.boolean(),
    price_changes: z.boolean(),
    weekly_digest: z.boolean(),
  }),
}).refine((d) => d.capital_max >= d.capital_min, {
  message: "capital_max must be greater than or equal to capital_min",
  path: ["capital_max"],
});

export async function GET() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await supabase
    .from("buyer_profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error && error.code !== "PGRST116") {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ profile: data ?? null });
}

export async function POST(request: Request) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, email")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "buyer") {
    return NextResponse.json({ error: "Buyer role required" }, { status: 403 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = BuyerProfileSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const payload = {
    id: user.id,
    email: profile.email ?? user.email ?? "",
    ...parsed.data,
  };

  const { data, error } = await supabase
    .from("buyer_profiles")
    .upsert(payload, { onConflict: "id" })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ profile: data });
}
