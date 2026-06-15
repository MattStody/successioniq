import { supabase } from "@/lib/supabase";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { Listing } from "@/lib/types";
import { getListingDisplayName } from "@/lib/listing-display";
import { getIndustryImage } from "@/lib/industry-image";
import { completenessLabel } from "@/lib/profile-completeness";
import Link from "next/link";
import { notFound } from "next/navigation";
import DeleteListingButton from "./DeleteListingButton";
import BookmarkButton from "@/components/BookmarkButton";
import NDASection from "./NDASection";
import ListingTabs from "./ListingTabs";
import { deriveFinancials, fmtMoney, fmtMultiple, fmtGrowth } from "@/lib/financials";

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
  let hasSigned = false;
  let ndaContactEmail: string | undefined;
  let ndaBusinessName: string | null | undefined;
  let buyerProfileName: string | undefined;
  let buyerProfileEmail: string | undefined;

  if (user && !isOwner) {
    const [profileResult, savedResult, matchResult, ndaResult] = await Promise.all([
      supabaseAuth.from("profiles").select("role, full_name").eq("id", user.id).single(),
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
      supabaseAuth
        .from("ndas")
        .select("id")
        .eq("buyer_id", user.id)
        .eq("listing_id", id)
        .single(),
    ]);
    isBuyer = profileResult.data?.role === "buyer";
    isBookmarked = !!savedResult.data && !savedResult.error;
    matchScore = matchResult.data?.match_score ?? null;
    matchReason = matchResult.data?.match_reason ?? null;
    hasSigned = !!ndaResult.data && !ndaResult.error;
    buyerProfileName = profileResult.data?.full_name ?? undefined;
    buyerProfileEmail = user.email ?? undefined;

    if (hasSigned) {
      ndaContactEmail = listing.contact_email;
      ndaBusinessName = listing.is_anonymous ? listing.business_name : null;
    }
  }

  const displayName = getListingDisplayName(listing);

  const fin = deriveFinancials(listing);
  const askingPrice = fin.effectivePrice;
  const profitMargin = (fin.profitMargin ?? 0).toFixed(1);

  // Secondary stats shown as chips below the primary figures, only when present.
  const secondaryStats: { label: string; value: string; tone?: "pos" | "neg" }[] = [];
  if (fin.ebitdaMargin != null)
    secondaryStats.push({ label: "EBITDA Margin", value: `${fin.ebitdaMargin.toFixed(1)}%` });
  if (fin.revenueGrowth != null)
    secondaryStats.push({
      label: "Revenue Growth (YoY)",
      value: fmtGrowth(fin.revenueGrowth),
      tone: fin.revenueGrowth >= 0 ? "pos" : "neg",
    });
  if (fin.ebitdaGrowth != null)
    secondaryStats.push({
      label: "EBITDA Growth (YoY)",
      value: fmtGrowth(fin.ebitdaGrowth),
      tone: fin.ebitdaGrowth >= 0 ? "pos" : "neg",
    });
  if (fin.mrr != null) secondaryStats.push({ label: "MRR", value: fmtMoney(fin.mrr) });
  if (fin.arr != null) secondaryStats.push({ label: "ARR", value: fmtMoney(fin.arr) });
  if (fin.recurringRevenuePercent != null && fin.recurringRevenuePercent > 0)
    secondaryStats.push({
      label: "Recurring Revenue",
      value: `${fin.recurringRevenuePercent}%`,
    });
  if (listing.sde != null) secondaryStats.push({ label: "SDE", value: fmtMoney(listing.sde) });
  if (listing.gross_profit != null)
    secondaryStats.push({ label: "Gross Profit", value: fmtMoney(listing.gross_profit) });
  if (listing.customer_concentration_percent != null)
    secondaryStats.push({
      label: "Top Customer Concentration",
      value: `${listing.customer_concentration_percent}%`,
    });

  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      {/* Hero image */}
      <div className="relative h-64 w-full rounded-2xl overflow-hidden mb-8 shadow-sm">
        <img
          src={getIndustryImage(listing.industry)}
          alt={listing.industry}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />
        <div className="absolute bottom-5 left-6 flex items-center gap-3">
          <span className="text-xs font-semibold uppercase tracking-widest text-white bg-blue-900/80 backdrop-blur-sm px-3 py-1.5 rounded-md border border-blue-700/50">
            {listing.industry}
          </span>
          {listing.is_anonymous && (
            <span className="text-xs font-medium text-white/90 bg-slate-900/60 backdrop-blur-sm px-2.5 py-1.5 rounded-md border border-white/20">
              Anonymous Listing
            </span>
          )}
        </div>
      </div>

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
            {isOwner && (
              <div className="flex items-center gap-3 mb-4">
                <span className="text-xs font-medium text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200">
                  Your listing
                </span>
                <Link
                  href={`/seller/profile/${listing.id}`}
                  className="text-xs font-medium text-slate-600 hover:text-blue-900 border border-slate-200 hover:border-blue-200 bg-white px-2.5 py-1 rounded-md transition-colors"
                >
                  Edit Profile →
                </Link>
              </div>
            )}
            <h1 className="font-serif text-4xl font-bold text-slate-900 mb-2">
              {displayName}
            </h1>
            <div className="flex items-center gap-3 flex-wrap">
              <p className="text-slate-500">
                {listing.region}, {listing.country} · {listing.years_operating} years operating
              </p>
              {listing.profile_completeness != null && listing.profile_completeness > 0 && (() => {
                const { label, color } = completenessLabel(listing.profile_completeness)
                const colorMap: Record<string, string> = {
                  emerald: "bg-emerald-50 text-emerald-700 border-emerald-200",
                  amber: "bg-amber-50 text-amber-700 border-amber-200",
                  slate: "bg-slate-50 text-slate-600 border-slate-200",
                }
                return (
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-md border ${colorMap[color] ?? colorMap.slate}`}>
                    {label}
                  </span>
                )
              })()}
            </div>
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
                  {fmtMoney(listing.annual_revenue)}
                </div>
              </div>
              {fin.ebitda != null ? (
                <div>
                  <div className="text-xs text-slate-400 mb-1">EBITDA</div>
                  <div className="text-2xl font-bold text-slate-900">
                    {fmtMoney(fin.ebitda)}
                  </div>
                </div>
              ) : (
                <div>
                  <div className="text-xs text-slate-400 mb-1">Annual Profit</div>
                  <div className="text-2xl font-bold text-slate-900">
                    {fmtMoney(listing.annual_profit)}
                  </div>
                </div>
              )}
              {fin.multiple != null ? (
                <div>
                  <div className="text-xs text-slate-400 mb-1">Multiple</div>
                  <div className="text-2xl font-bold text-slate-900">
                    {fmtMultiple(fin.multiple)}
                  </div>
                  <div className="text-[10px] text-slate-400">price ÷ EBITDA</div>
                </div>
              ) : (
                <div>
                  <div className="text-xs text-slate-400 mb-1">Profit Margin</div>
                  <div className="text-2xl font-bold text-slate-900">{profitMargin}%</div>
                </div>
              )}
              <div>
                <div className="text-xs text-slate-400 mb-1">Valuation Range</div>
                <div className="text-sm font-semibold text-slate-700">
                  {fmtMoney(listing.valuation_low)} – {fmtMoney(listing.valuation_high)}
                </div>
              </div>
              <div>
                <div className="text-xs text-slate-400 mb-1">Years Operating</div>
                <div className="text-sm font-semibold text-slate-700">
                  {listing.years_operating} years
                </div>
              </div>
            </div>

            {secondaryStats.length > 0 && (
              <div className="mt-5 pt-5 border-t border-slate-100 flex flex-wrap gap-x-8 gap-y-4">
                {secondaryStats.map((s) => (
                  <div key={s.label}>
                    <div className="text-xs text-slate-400 mb-0.5">{s.label}</div>
                    <div
                      className={`text-base font-semibold ${
                        s.tone === "pos"
                          ? "text-emerald-700"
                          : s.tone === "neg"
                          ? "text-red-600"
                          : "text-slate-800"
                      }`}
                    >
                      {s.value}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Tabbed content or fallback */}
          {(() => {
            const descriptionNode = (
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4">
                  About this Business
                </p>
                <div className="text-slate-600 leading-relaxed whitespace-pre-wrap text-sm">
                  {listing.description}
                </div>
              </div>
            )
            const whatsIncludedNode = (
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4">
                  What&apos;s Included
                </p>
                <p className="text-slate-600 leading-relaxed text-sm">{listing.whats_included}</p>
              </div>
            )
            const transitionNode = (
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">
                  Transition Period
                </p>
                <p className="text-slate-700 text-sm leading-relaxed">{listing.transition_period}</p>
              </div>
            )
            const preferredBuyerNode = (
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">
                  Preferred Buyer
                </p>
                <p className="text-slate-700 text-sm leading-relaxed">{listing.preferred_buyer}</p>
              </div>
            )
            const valueDriversNode = (
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
            )
            const risksNode = (
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
            )

            const tabs = (
              <ListingTabs
                listing={listing}
                descriptionContent={descriptionNode}
                whatsIncludedContent={whatsIncludedNode}
                transitionContent={transitionNode}
                preferredBuyerContent={preferredBuyerNode}
                valueDriversContent={valueDriversNode}
                risksContent={risksNode}
              />
            )

            if (tabs === null) {
              return (
                <div className="space-y-6">
                  {descriptionNode}
                  {whatsIncludedNode}
                  <div className="grid sm:grid-cols-2 gap-6">
                    {transitionNode}
                    {preferredBuyerNode}
                  </div>
                  <div className="grid sm:grid-cols-2 gap-6">
                    {valueDriversNode}
                    {risksNode}
                  </div>
                </div>
              )
            }

            return tabs
          })()}
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
                <NDASection
                  listingId={listing.id}
                  industry={listing.industry}
                  isAnonymous={listing.is_anonymous}
                  isLoggedIn={!!user}
                  hasSigned={hasSigned}
                  initialContactEmail={ndaContactEmail}
                  initialBusinessName={ndaBusinessName}
                  buyerName={buyerProfileName}
                  buyerEmail={buyerProfileEmail}
                />
                {isBuyer && (
                  <div className="mt-3">
                    <BookmarkButton
                      listingId={listing.id}
                      initialSaved={isBookmarked}
                      variant="full"
                    />
                  </div>
                )}
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
