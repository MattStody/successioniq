import { NextRequest, NextResponse } from "next/server"
import Anthropic from "@anthropic-ai/sdk"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { z } from "zod"
import { enforceRateLimit, LIMITS } from "@/lib/rate-limit"

const AiSuggestSchema = z.object({
  section: z.string().min(1).max(100),
  summary: z.string().min(1).max(4000),
})

const client = new Anthropic()

const SYSTEM_PROMPT =
  "You are a business broker with 20+ years of SMB M&A experience reviewing a seller's listing profile on SuccessionIQ. Your job is to suggest improvements that will make the listing more compelling to serious buyers."

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ listing_id: string }> }
) {
  try {
    const limited = enforceRateLimit(req, "ai-suggest", LIMITS.sellerSuggestions.limit, LIMITS.sellerSuggestions.windowMs)
    if (limited) return limited

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
    const parsed = AiSuggestSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
    }

    const { section, summary } = parsed.data

    const response = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 600,
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
          content: `Section: ${section}\nWhat the seller has written:\n${summary}\n\nProvide 2-3 specific, actionable suggestions to improve this section. Reference what they've actually written. Be direct. Format as a numbered list (1. ... 2. ... 3. ...). Keep each suggestion to 1-2 sentences.`,
        },
      ],
    })

    const suggestion =
      response.content[0].type === "text" ? response.content[0].text : ""

    return NextResponse.json({ suggestion })
  } catch (err) {
    console.error("AI suggest error:", err)
    return NextResponse.json({ error: "Failed to generate suggestion" }, { status: 500 })
  }
}
