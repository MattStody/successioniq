import { supabase } from "@/lib/supabase";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const { data, error } = await supabase
    .from("listings")
    .select("*")
    .eq("status", "active")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("listings GET error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Get user from session and attach user_id server-side
    let userId: string | null = null;
    try {
      const cookieStore = await cookies();
      const serverSupabase = createServerClient(
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
      const { data: { user } } = await serverSupabase.auth.getUser();
      userId = user?.id ?? null;
    } catch {
      // Non-fatal — listing saved without user_id
    }

    // Strip client-supplied user_id and set it server-side
    const { user_id: _ignored, ...safeBody } = body;
    const payload = { ...safeBody, user_id: userId };

    const { data, error } = await supabase
      .from("listings")
      .insert([payload])
      .select()
      .single();

    if (error) {
      console.error("listings POST error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    console.error("listings POST exception:", err);
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}
