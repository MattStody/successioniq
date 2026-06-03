import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { z } from "zod";

const Schema = z.object({
  listing_id: z.string().uuid(),
  full_name: z.string().min(2).max(200),
  email: z.string().email().max(254),
});

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
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = Schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const { listing_id, full_name, email } = parsed.data;

    // Fetch the listing to verify it exists and get contact details
    const { data: listing, error: listingError } = await supabase
      .from("listings")
      .select("id, contact_email, business_name, is_anonymous, user_id")
      .eq("id", listing_id)
      .single();

    if (listingError || !listing) {
      return NextResponse.json({ error: "Listing not found" }, { status: 404 });
    }

    if (listing.user_id === user.id) {
      return NextResponse.json({ error: "Cannot sign NDA on your own listing" }, { status: 400 });
    }

    // Upsert: if already signed, treat as success
    const { error: insertError } = await supabase.from("ndas").upsert(
      { listing_id, buyer_id: user.id, full_name, email },
      { onConflict: "listing_id,buyer_id", ignoreDuplicates: true }
    );

    if (insertError) {
      return NextResponse.json({ error: "Failed to record NDA" }, { status: 500 });
    }

    return NextResponse.json({
      ok: true,
      contact_email: listing.contact_email,
      business_name: listing.is_anonymous ? listing.business_name : null,
    });
  } catch {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
