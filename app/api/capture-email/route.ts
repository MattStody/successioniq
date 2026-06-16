import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { z } from "zod";
import { enforceRateLimit, LIMITS } from "@/lib/rate-limit";

const Schema = z.object({
  email: z.string().email().max(254),
  source: z.string().max(50).optional().default("valuation_gate"),
  industry: z.string().max(100).optional(),
  country: z.string().max(100).optional(),
  region: z.string().max(100).optional(),
  valuation_id: z.string().uuid().optional().nullable(),
});

export async function POST(req: NextRequest) {
  try {
    const limited = enforceRateLimit(req, "capture-email", LIMITS.captureEmail.limit, LIMITS.captureEmail.windowMs);
    if (limited) return limited;

    const body = await req.json();
    const parsed = Schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const { email, source, industry, country, region, valuation_id } = parsed.data;

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

    await supabase.from("email_leads").upsert(
      { email, source, industry, country, region, valuation_id: valuation_id ?? null },
      { onConflict: "email", ignoreDuplicates: true }
    );

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }
}
