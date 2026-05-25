import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const PUBLIC_COLUMNS = [
  "id", "created_at", "status", "is_anonymous", "business_name",
  "industry", "country", "region", "annual_revenue", "annual_profit",
  "years_operating", "asking_price", "valuation_low", "valuation_mid",
  "valuation_high", "description", "whats_included", "transition_period",
  "preferred_buyer", "key_value_drivers", "key_risks",
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

    // Strip client-supplied user_id and set it server-side
    const { user_id: _ignored, ...safeBody } = body;
    const payload = { ...safeBody, user_id: user.id };

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
