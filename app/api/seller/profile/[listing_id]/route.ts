import { NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { z } from "zod"
import { calculateCompleteness } from "@/lib/profile-completeness"

const ProfileSchema = z.object({
  tagline: z.string().max(2000).optional().nullable(),
  founded_year: z.number().int().min(1800).max(2100).optional().nullable(),
  business_model: z.string().max(2000).optional().nullable(),
  revenue_type: z.string().max(2000).optional().nullable(),
  recurring_revenue_percent: z.number().int().min(0).max(100).optional().nullable(),
  competitive_advantages: z.string().max(2000).optional().nullable(),
  growth_opportunities: z.string().max(2000).optional().nullable(),
  ebitda: z.number().optional().nullable(),
  adjusted_ebitda: z.number().optional().nullable(),
  sde: z.number().optional().nullable(),
  gross_profit: z.number().optional().nullable(),
  revenue_prior_year: z.number().min(0).optional().nullable(),
  ebitda_prior_year: z.number().optional().nullable(),
  mrr: z.number().min(0).optional().nullable(),
  arr: z.number().min(0).optional().nullable(),
  customer_concentration_percent: z.number().int().min(0).max(100).optional().nullable(),
  employee_count: z.number().int().min(0).optional().nullable(),
  full_time_employees: z.number().int().min(0).optional().nullable(),
  part_time_employees: z.number().int().min(0).optional().nullable(),
  owner_hours_per_week: z.number().int().min(0).max(168).optional().nullable(),
  key_person_dependencies: z.string().max(2000).optional().nullable(),
  systems_and_processes: z.string().max(2000).optional().nullable(),
  real_estate_included: z.boolean().optional().nullable(),
  real_estate_value: z.number().min(0).optional().nullable(),
  has_equipment: z.boolean().optional().nullable(),
  equipment_value: z.number().min(0).optional().nullable(),
  equipment_description: z.string().max(2000).optional().nullable(),
  has_intellectual_property: z.boolean().optional().nullable(),
  ip_description: z.string().max(2000).optional().nullable(),
  has_licenses_permits: z.boolean().optional().nullable(),
  licenses_description: z.string().max(2000).optional().nullable(),
  has_lease: z.boolean().optional().nullable(),
  lease_monthly_cost: z.number().min(0).optional().nullable(),
  lease_expiry: z.string().max(2000).optional().nullable(),
  active_customer_count: z.number().int().min(0).optional().nullable(),
  top_customer_count: z.number().int().min(0).optional().nullable(),
  longest_customer_relationship: z.number().int().min(0).optional().nullable(),
  avg_customer_relationship: z.number().int().min(0).optional().nullable(),
  is_seasonal: z.boolean().optional().nullable(),
  seasonal_description: z.string().max(2000).optional().nullable(),
  seller_financing_available: z.boolean().optional().nullable(),
  seller_financing_details: z.string().max(2000).optional().nullable(),
  training_included: z.boolean().optional().nullable(),
  training_description: z.string().max(2000).optional().nullable(),
  non_compete_willing: z.boolean().optional().nullable(),
  reason_for_sale_detail: z.string().max(2000).optional().nullable(),
  transition_period: z.string().max(2000).optional().nullable(),
})

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ listing_id: string }> }
) {
  try {
    const { listing_id } = await params

    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return cookieStore.getAll() },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          },
        },
      }
    )

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: listing, error: listingError } = await supabase
      .from("listings")
      .select("id, user_id")
      .eq("id", listing_id)
      .single()

    if (listingError || !listing) {
      return NextResponse.json({ error: "Listing not found" }, { status: 404 })
    }

    if (listing.user_id !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const body = await req.json()
    const parsed = ProfileSchema.safeParse(body)
    if (!parsed.success) {
      console.error("Profile PATCH validation error:", parsed.error.flatten())
      return NextResponse.json({ error: "Invalid request body", details: parsed.error.flatten() }, { status: 400 })
    }

    const payload = parsed.data

    // transition_period is NOT NULL in the DB — only include it in the update when non-empty.
    const { transition_period, ...profilePayload } = payload
    const safeUpdate: Record<string, unknown> = { ...profilePayload }
    if (transition_period) safeUpdate.transition_period = transition_period

    const profile_completeness = calculateCompleteness(safeUpdate as Partial<Record<string, unknown>>)

    const { error: updateError } = await supabase
      .from("listings")
      .update({ ...safeUpdate, profile_completeness })
      .eq("id", listing_id)
      .eq("user_id", user.id)

    if (updateError) {
      console.error("Profile update error:", updateError)
      return NextResponse.json({ error: updateError.message, code: updateError.code }, { status: 500 })
    }

    return NextResponse.json({ ok: true, profile_completeness })
  } catch (err) {
    console.error("Profile PATCH error:", err)
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}
