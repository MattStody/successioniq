import Anthropic from "@anthropic-ai/sdk"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"

const RequestSchema = z.object({
  industry: z.string().min(1).max(100),
  section: z.enum(["equipment", "ip", "licenses", "competitive_advantages", "growth_opportunities", "deal_terms"]),
  listingContext: z.record(z.string(), z.unknown()).optional(),
})

export type SuggestionItem = {
  label: string
  value: string
  hint?: string
}

const anthropic = new Anthropic()

const SYSTEM_PROMPT = `You are a business acquisition specialist who helps sellers prepare comprehensive, accurate business profiles.
Your suggestions are practical, specific to the industry, and formatted exactly as requested.
Always return valid JSON with no markdown code blocks, no explanatory text — only the JSON object.`

function buildPrompt(section: string, industry: string, ctx?: Record<string, unknown>): string {
  switch (section) {
    case "equipment":
      return `List exactly 10 equipment items typically included when a ${industry} business is sold.
Return ONLY this JSON (no markdown): {"items":[{"label":"Item Name","value":"Item Name","hint":"typically $X–$Y"}]}
Keep labels 2–4 words. Include realistic price ranges in every hint.`

    case "ip":
      return `List 8 intellectual property assets typically transferred when a ${industry} business is sold.
Return ONLY this JSON: {"items":[{"label":"Asset Name","value":"Asset Name"}]}
Keep labels 2–4 words.`

    case "licenses":
      return `List 8 licenses and permits typically held by a ${industry} business.
Return ONLY this JSON: {"items":[{"label":"License Name","value":"License Name"}]}
Keep labels 2–5 words.`

    case "competitive_advantages": {
      const extras = [
        ctx?.years_operating ? `Operating years: ${ctx.years_operating}` : "",
        ctx?.annual_revenue ? `Annual revenue: $${Number(ctx.annual_revenue).toLocaleString()}` : "",
      ].filter(Boolean).join(". ")
      return `List 6 competitive advantages a seller should highlight for a ${industry} business.${extras ? " Context: " + extras + "." : ""}
Return ONLY this JSON: {"items":[{"label":"Short title (3–5 words)","value":"One clear sentence describing this advantage"}]}`
    }

    case "growth_opportunities": {
      const modelNote = ctx?.business_model ? ` Business model: ${ctx.business_model}.` : ""
      return `List 5 growth opportunities a buyer of a ${industry} business could pursue.${modelNote}
Return ONLY this JSON: {"items":[{"label":"Short title (3–5 words)","value":"One clear sentence describing this opportunity"}]}`
    }

    case "deal_terms": {
      const priceNote = ctx?.asking_price
        ? ` The asking price is approximately $${Number(ctx.asking_price).toLocaleString()}.`
        : ""
      return `List 6 typical deal structure elements for a ${industry} business sale.${priceNote} Include financing, transition, and earnout options where relevant.
Return ONLY this JSON: {"items":[{"label":"Term (3–5 words)","value":"One sentence describing this deal element"}]}`
    }

    default:
      return `List 8 relevant suggestions for the ${section} of a ${industry} business profile.
Return ONLY this JSON: {"items":[{"label":"Short title","value":"Description"}]}`
  }
}

async function createRouteClient() {
  const cookieStore = await cookies()
  return createServerClient(
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
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createRouteClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const body = await req.json()
    const parsed = RequestSchema.safeParse(body)
    if (!parsed.success) return NextResponse.json({ error: "Invalid request" }, { status: 400 })

    const { industry, section, listingContext } = parsed.data
    const industryKey = industry.toLowerCase().trim()

    // Check cache (30-day expiry)
    const { data: cached } = await supabase
      .from("suggestions_cache")
      .select("suggestions, created_at")
      .eq("industry", industryKey)
      .eq("section", section)
      .gt("created_at", new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
      .single()

    if (cached?.suggestions) {
      return NextResponse.json({ items: cached.suggestions })
    }

    // Cache miss — call Claude
    const prompt = buildPrompt(section, industry, listingContext)
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 800,
      system: [{ type: "text", text: SYSTEM_PROMPT, cache_control: { type: "ephemeral" } }],
      messages: [{ role: "user", content: prompt }],
    })

    const raw = response.content[0].type === "text" ? response.content[0].text : "{}"
    const clean = raw.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim()

    let items: SuggestionItem[] = []
    try {
      const parsed = JSON.parse(clean)
      items = Array.isArray(parsed.items) ? parsed.items : []
    } catch {
      console.error("suggestions: failed to parse Claude response:", clean)
      return NextResponse.json({ items: [] })
    }

    // Write to cache (upsert)
    await supabase
      .from("suggestions_cache")
      .upsert(
        { industry: industryKey, section, suggestions: items, created_at: new Date().toISOString() },
        { onConflict: "industry,section" }
      )

    return NextResponse.json({ items })
  } catch (err) {
    console.error("suggestions error:", err)
    return NextResponse.json({ items: [] })
  }
}
