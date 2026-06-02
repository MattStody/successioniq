import { supabase } from "@/lib/supabase";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { Listing } from "@/lib/types";
import { getListingDisplayName } from "@/lib/listing-display";
import Link from "next/link";
import { notFound } from "next/navigation";
import DeleteListingButton from "./DeleteListingButton";
import BookmarkButton from "@/components/BookmarkButton";

function fmtCurrency(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${Math.round(n / 1_000)}K`;
  return `$${n.toLocaleString()}`;
}

export default async function ListingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [listingResult, supabaseAuth] = await Promise.all([
    supabase.from("listings").select("*").eq("id", id).single(),
    createSupabaseServerClient(),
  ]);

  if (listingResult.error || !listingResult.data) notFound();

  const listing = listingResult.data as Listing;
  const { data: { user } } = await supabaseAuth.auth.getUser();
  const isOwner = !!user && user.id === listing.user_id;

  let isBuyer = false;
  let isBookmarked = false;
  let matchScore: number | null = null;
  let matchReason: string | null = null;

  if (user && !isOwner) {
    const [profileResult, savedResult, matchResult] = await Promise.all([
      supabaseAuth.from("profiles").select("role").eq("id", user.id).single(),
      supabaseAuth
        .from("saved_listings")
        .select("id")
        .eq("buyer_id", user.id)
        .eq("listing_id", id)
        .single(),
      supabaseAuth
        .from("listing_matches")
        .select("match_score, match_reason")
        .eq("buyer_id", user.id)
        .eq("listing_id", id)
        .single(),
    ]);
    isBuyer = profileResult.data?.role === "buyer";
    isBookmarked = !!savedResult.data && !savedResult.error;
    matchScore = matchResult.data?.match_score ?? null;
    matchReason = matchResult.data?.match_reason ?? null;
  }

  const displayName = getListingDisplayName(listing);

  const askingPrice = listing.asking_price ?? listing.valuation_mid;
  const profitMargin = ((listing.annual_profit / listing.annual_revenue) * 100).toFixed(1);

  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-slate-400 mb-8">
        <Link href="/listings" className="hover:text-slate-700 transition-colors">
          Listings
        </Link>
        <span>/</span>
        <span className="text-slate-600">{displayName}</span>
      </div>

      <div className="grid lg:grid-cols-[1fr_340px] gap-10 items-start">
        {/* ── Left: Main content ── */}
        <div>
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-xs font-semibold uppercase tracking-widest text-blue-900 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-100">
                {listing.industry}
              </span>
              {listing.is_anonymous && (
                <span className="text-xs font-medium text-slate-500 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-200">
                  Anonymous Listing
                </span>
              )}
              {isOwner && (
                <span className="text-xs font-medium text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200">
                  Your listing
                </span>
              )}
            </div>
            <h1 className="font-serif text-4xl font-bold text-slate-900 mb-2">
              {displayName}
            </h1>
            <p className="text-slate-500">
              {listing.region}, {listing.country} · {listing.years_operating} years operating
            </p>
          </div>

          {/* Financials */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 mb-6 shadow-sm">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-5">
              Financial Overview
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
              <div>
                <div className="text-xs text-slate-400 mb-1">Annual Revenue</div>
                <div className="text-2xl font-bold text-slate-900">
                  {fmtCurrency(listing.annual_revenue)}
                </div>
              </div>
              <div>
                <div className="text-xs text-slate-400 mb-1">Annual Profit</div>
                <div className="text-2xl font-bold text-slate-900">
                  {fmtCurrency(listing.annual_profit)}
                </div>
              </div>
              <div>
                <div className="text-xs text-slate-400 mb-1">Profit Margin</div>
                <div className="text-2xl font-bold text-slate-900">{profitMargin}%</div>
              </div>
              <div>
                <div className="text-xs text-slate-400 mb-1">Valuation Range</div>
                <div className="text-sm font-semibold text-slate-700">
                  {fmtCurrency(listing.valuation_low)} – {fmtCurrency(listing.valuation_high)}
                </div>
              </div>
              <div>
                <div className="text-xs text-slate-400 mb-1">Years Operating</div>
                <div className="text-sm font-semibold text-slate-700">
                  {listing.years_operating} years
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 mb-6 shadow-sm">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4">
              About this Business
            </p>
            <div className="text-slate-600 leading-relaxed whitespace-pre-wrap text-sm">
              {listing.description}
            </div>
          </div>

          {/* What's included */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 mb-6 shadow-sm">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4">
              What&apos;s Included
            </p>
            <p className="text-slate-600 leading-relaxed text-sm">{listing.whats_included}</p>
          </div>

          {/* Transition & Buyer */}
          <div className="grid sm:grid-cols-2 gap-6 mb-6">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">
                Transition Period
              </p>
              <p className="text-slate-700 text-sm leading-relaxed">{listing.transition_period}</p>
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">
                Preferred Buyer
              </p>
              <p className="text-slate-700 text-sm leading-relaxed">{listing.preferred_buyer}</p>
            </div>
          </div>

          {/* Value drivers & risks */}
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <p className="text-xs font-semibold text-emerald-700 uppercase tracking-widest mb-4">
                Key Value Drivers
              </p>
              <ul className="space-y-3">
                {listing.key_value_drivers.map((d, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm">
                    <div className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-emerald-500" />
                    <span className="text-slate-600 leading-relaxed">{d}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <p className="text-xs font-semibold text-red-600 uppercase tracking-widest mb-4">
                Key Risks
              </p>
              <ul className="space-y-3">
                {listing.key_risks.map((r, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm">
                    <div className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-red-400" />
                    <span className="text-slate-600 leading-relaxed">{r}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* ── Right: Sticky sidebar ── */}
        <div className="lg:sticky lg:top-24 space-y-4">
          {/* Asking price card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="text-xs text-slate-400 mb-1 uppercase tracking-widest">
              Asking Price
            </div>
            <div className="font-serif text-4xl font-bold text-slate-900 mb-1">
              {fmtCurrency(askingPrice)}
            </div>
            <div className="text-xs text-slate-400 mb-6">
              AI Valuation: {fmtCurrency(listing.valuation_low)} – {fmtCurrency(listing.valuation_high)}
            </div>

            {isOwner ? (
              <div className="space-y-3">
                <div className="w-full py-3 rounded-xl bg-blue-50 border border-blue-200 text-center text-sm font-medium text-blue-900">
                  This is your listing
                </div>
                <DeleteListingButton listingId={listing.id} />
              </div>
            ) : (
              <>
                {matchScore !== null && (
                  <div
                    className={`flex items-center justify-between px-4 py-3 rounded-xl border mb-4 text-sm ${
                      matchScore >= 75
                        ? "bg-emerald-50 border-emerald-200"
                        : matchScore >= 50
                        ? "bg-amber-50 border-amber-200"
                        : "bg-slate-50 border-slate-200"
                    }`}
                  >
                    <span className="font-medium text-slate-700">Your match score</span>
                    <span
                      className={`font-bold ${
                        matchScore >= 75
                          ? "text-emerald-700"
                          : matchScore >= 50
                          ? "text-amber-700"
                          : "text-slate-500"
                      }`}
                    >
                      {matchScore}%
                    </span>
                  </div>
                )}
                {matchReason && (
                  <p className="text-xs text-slate-500 italic mb-4 leading-relaxed">
                    &ldquo;{matchReason}&rdquo;
                  </p>
                )}
                <button className="w-full bg-blue-900 hover:bg-blue-800 text-white px-6 py-3.5 rounded-xl font-semibold transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 text-sm mb-3">
                  Sign NDA &amp; Get Contact Details
                </button>
                {isBuyer && (
                  <BookmarkButton
                    listingId={listing.id}
                    initialSaved={isBookmarked}
                    variant="full"
                  />
                )}
                <p className="text-center text-xs text-slate-400 mt-2">
                  NDA is managed electronically — takes 2 minutes
                </p>
              </>
            )}
          </div>

          {/* Confidentiality notice */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5">
            <div className="flex items-start gap-3">
              <div className="text-blue-900 text-lg mt-0.5">🔒</div>
              <div>
                <p className="text-sm font-medium text-slate-900 mb-1">
                  Confidential Listing
                </p>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {listing.is_anonymous
                    ? "The seller's identity is protected. Business name and contact details are only released after an NDA is signed."
                    : "All communications are managed through SuccessionIQ to protect both parties."}
                </p>
              </div>
            </div>
          </div>

          <p className="text-center text-xs text-slate-400">
            Listed{" "}
            {new Date(listing.created_at).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        </div>
      </div>
    </div>
  );
}
