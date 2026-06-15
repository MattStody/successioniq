import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const ListingSchema = z.object({
  is_anonymous: z.boolean(),
  business_name: z.string().max(200).nullable().optional(),
  industry: z.string().min(1).max(100),
  country: z.string().min(1).max(100),
  region: z.string().min(1).max(100),
  annual_revenue: z.number().nonnegative(),
  annual_profit: z.number(),
  years_operating: z.number().int().nonnegative(),
  asking_price: z.number().nonnegative().nullable().optional(),
  valuation_low: z.number().nonnegative(),
  valuation_mid: z.number().nonnegative(),
  valuation_high: z.number().nonnegative(),
  ebitda: z.number().nullable().optional(),
  sde: z.number().nullable().optional(),
  description: z.string().min(1).max(5000),
  whats_included: z.string().min(1).max(2000),
  transition_period: z.string().min(1).max(200),
  preferred_buyer: z.string().min(1).max(500),
  contact_email: z.string().email().max(254),
  key_value_drivers: z.array(z.string().max(300)).max(10),
  key_risks: z.array(z.string().max(300)).max(10),
});

const PUBLIC_COLUMNS = [
  "id", "created_at", "status", "is_anonymous", "business_name",
  "industry", "country", "region", "annual_revenue", "annual_profit",
  "years_operating", "asking_price", "valuation_low", "valuation_mid",
  "valuation_high", "ebitda", "sde", "description", "whats_included",
  "transition_period", "preferred_buyer", "key_value_drivers", "key_risks",
].join(", ");

async function createRouteClient() {
  const cookieStore = await cookies();
  return createServerClient(
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
}

export async function GET() {
  const supabase = await createRouteClient();

  const { data, error } = await supabase
    .from("listings")
    .select(PUBLIC_COLUMNS)
    .eq("status", "active")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("listings GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createRouteClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = ListingSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    const payload = { ...parsed.data, user_id: user.id };

    const { data, error } = await supabase
      .from("listings")
      .insert([payload])
      .select()
      .single();

    if (error) {
      console.error("listings POST error:", error);
      return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    console.error("listings POST exception:", err);
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}
