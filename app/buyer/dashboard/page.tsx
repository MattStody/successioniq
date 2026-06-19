import { createSupabaseServerClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import Link from "next/link";
import type { Listing, BuyerProfile } from "@/lib/types";
import { getListingDisplayName } from "@/lib/listing-display";
import BookmarkButton from "@/components/BookmarkButton";
import SignOutButton from "@/components/SignOutButton";
import GenerateMatchesButton from "./GenerateMatchesButton";

function fmtCurrency(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${Math.round(n / 1_000)}K`;
  return `$${n.toLocaleString()}`;
}

function scoreColor(score: number) {
  if (score >= 75) return "bg-emerald-50 text-emerald-700 border-emerald-200";
  if (score >= 50) return "bg-amber-50 text-amber-700 border-amber-200";
  return "bg-slate-50 text-slate-500 border-slate-200";
}

function completenessScore(p: BuyerProfile): number {
  const checks = [
    !!p.full_name,
    !!p.phone,
    !!p.background_summary,
    p.capital_min > 0,
    p.capital_max > 0,
    p.preferred_industries.length > 0,
    p.preferred_countries.length > 0,
    p.experience_years > 0,
  ];
  return Math.round((checks.filter(Boolean).length / checks.length) * 100);
}

const BUYER_TYPE_LABEL: Record<string, string> = {
  individual: "Individual Operator",
  search_fund: "Search Fund",
  private_equity: "Private Equity",
  strategic: "Strategic Acquirer",
};

const ACQUISITION_LABEL: Record<string, string> = {
  full_acquisition: "Full Acquisition",
  partial_stake: "Partial Stake",
  either: "Full or Partial",
};

export default async function BuyerDashboardPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "buyer") redirect("/dashboard");

  const { data: buyerProfile } = await supabase
    .from("buyer_profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!buyerProfile) redirect("/buyer/onboarding");

  const bp = buyerProfile as BuyerProfile;
  const firstName = bp.full_name.split(" ")[0];

  const [matchesResult, savedResult, listingsResult] = await Promise.all([
    supabase
      .from("listing_matches")
      .select("listing_id, match_score, match_reason")
      .eq("buyer_id", user.id)
      .order("match_score", { ascending: false }),
    supabase.from("saved_listings").select("listing_id").eq("buyer_id", user.id),
    supabase
      .from("listings")
      .select("*")
      .eq("status", "active")
      .order("created_at", { ascending: false }),
  ]);

  const matches = matchesResult.data ?? [];
  const savedIds = new Set((savedResult.data ?? []).map((s) => s.listing_id));
  const allListings: Listing[] = listingsResult.data ?? [];

  const matchMap = new Map(
    matches.map((m) => [m.listing_id, { score: m.match_score, reason: m.match_reason }])
  );

  const rankedListings = allListings
    .filter((l) => matchMap.has(l.id))
    .sort((a, b) => (matchMap.get(b.id)?.score ?? 0) - (matchMap.get(a.id)?.score ?? 0))
    .slice(0, 10);

  const savedListings = allListings.filter((l) => savedIds.has(l.id));
  const completeness = completenessScore(bp);

  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      {/* Header */}
      <div className="mb-12 flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-slate-400 mb-1">Welcome back</p>
          <h1 className="font-serif text-4xl font-bold text-slate-900">{firstName}</h1>
        </div>
        <SignOutButton />
      </div>

      <div className="grid lg:grid-cols-[1fr_320px] gap-10 items-start">
        {/* ── Main content ── */}
        <div className="space-y-12">
          {/* Match Score Section */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">Your Match Score</h2>
                <p className="text-sm text-slate-400 mt-0.5">
                  Businesses ranked by how well they fit your criteria
                </p>
              </div>
              <GenerateMatchesButton
                label={matches.length > 0 ? "Refresh matches" : "Generate matches"}
              />
            </div>

            {matches.length === 0 ? (
              <div className="bg-white border border-slate-200 border-dashed rounded-2xl p-10 text-center">
                <div className="text-3xl mb-3">🎯</div>
                <p className="text-slate-600 font-medium mb-1">No matches yet</p>
                <p className="text-slate-400 text-sm mb-5 max-w-xs mx-auto">
                  Generate your personalized match scores to see which businesses fit your
                  criteria.
                </p>
                <GenerateMatchesButton label="Generate my matches →" />
              </div>
            ) : rankedListings.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center">
                <p className="text-slate-400 text-sm">
                  No active listings match your criteria yet. Check back soon.
                </p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-4">
                {rankedListings.map((l) => {
                  const match = matchMap.get(l.id);
                  const displayName = getListingDisplayName(l);
                  const askingPrice = l.asking_price ?? l.valuation_mid;

                  return (
                    <Link
                      key={l.id}
                      href={`/listings/${l.id}`}
                      className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-blue-200 transition-all block group"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <span className="text-xs font-semibold uppercase tracking-widest text-blue-900 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-100">
                          {l.industry}
                        </span>
                        {match && (
                          <span
                            className={`text-xs font-bold px-2.5 py-1 rounded-md border ${scoreColor(match.score)}`}
                          >
                            {match.score}% match
                          </span>
                        )}
                      </div>

                      <h3 className="font-semibold text-slate-900 mb-0.5 group-hover:text-blue-900 transition-colors">
                        {displayName}
                      </h3>
                      <p className="text-xs text-slate-400 mb-3">
                        {l.region}, {l.country}
                      </p>

                      {match && (
                        <p className="text-xs text-slate-500 mb-3 italic leading-relaxed">
                          &ldquo;{match.reason}&rdquo;
                        </p>
                      )}

                      <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                        <div>
                          <div className="text-xs text-slate-400">Asking Price</div>
                          <div className="font-semibold text-slate-900">
                            {fmtCurrency(askingPrice)}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-slate-400">Revenue</div>
                          <div className="font-semibold text-slate-900">
                            {fmtCurrency(l.annual_revenue)}
                          </div>
                        </div>
                      </div>

                      {match && match.score >= 75 && (
                        <div className="mt-3 flex items-center gap-1.5 text-xs font-medium text-emerald-700">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          Matches your criteria
                        </div>
                      )}
                    </Link>
                  );
                })}
              </div>
            )}

            {rankedListings.length > 0 && (
              <div className="mt-4 text-center">
                <Link
                  href="/listings"
                  className="text-sm font-medium text-blue-900 hover:text-blue-700 transition-colors"
                >
                  Browse all listings →
                </Link>
              </div>
            )}
          </section>

          {/* Saved Listings */}
          <section>
            <h2 className="text-xl font-semibold text-slate-900 mb-6">Saved Listings</h2>

            {savedListings.length === 0 ? (
              <div className="bg-white border border-slate-200 border-dashed rounded-2xl p-10 text-center">
                <p className="text-slate-400 text-sm">
                  No saved listings yet. Bookmark listings you&apos;re interested in while
                  browsing.
                </p>
                <Link
                  href="/listings"
                  className="inline-block mt-4 text-sm font-medium text-blue-900 hover:text-blue-700 transition-colors"
                >
                  Browse listings →
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {savedListings.map((l) => {
                  const displayName = getListingDisplayName(l);
                  const askingPrice = l.asking_price ?? l.valuation_mid;
                  const match = matchMap.get(l.id);

                  return (
                    <div
                      key={l.id}
                      className="flex items-center gap-4 bg-white border border-slate-200 rounded-2xl px-5 py-4 shadow-sm"
                    >
                      <Link
                        href={`/listings/${l.id}`}
                        className="flex-1 min-w-0 hover:text-blue-900 transition-colors"
                      >
                        <div className="font-medium text-slate-900">{displayName}</div>
                        <div className="text-xs text-slate-400 mt-0.5">
                          {l.region}, {l.country} · {fmtCurrency(askingPrice)} asking
                          {match && (
                            <span
                              className={`ml-2 inline-flex items-center px-1.5 py-0.5 rounded text-xs font-semibold ${scoreColor(match.score)}`}
                            >
                              {match.score}%
                            </span>
                          )}
                        </div>
                      </Link>
                      <BookmarkButton listingId={l.id} initialSaved={true} variant="icon" />
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </div>

        {/* ── Right sidebar ── */}
        <div className="lg:sticky lg:top-24 space-y-5">
          {/* Criteria summary */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-100">
              <h2 className="text-base font-semibold text-slate-900">Your Criteria</h2>
              <Link
                href="/buyer/onboarding"
                className="text-xs font-medium text-blue-900 hover:text-blue-700 transition-colors"
              >
                Edit →
              </Link>
            </div>

            <div className="space-y-4 text-sm">
              <div>
                <div className="text-xs text-slate-400 mb-1">Capital range</div>
                <div className="font-semibold text-slate-900">
                  {fmtCurrency(bp.capital_min)} – {fmtCurrency(bp.capital_max)}
                </div>
              </div>
              <div>
                <div className="text-xs text-slate-400 mb-1">Buyer type</div>
                <div className="font-semibold text-slate-900">
                  {BUYER_TYPE_LABEL[bp.buyer_type] ?? bp.buyer_type}
                </div>
              </div>
              <div>
                <div className="text-xs text-slate-400 mb-1">Acquisition type</div>
                <div className="font-semibold text-slate-900">
                  {ACQUISITION_LABEL[bp.acquisition_type] ?? bp.acquisition_type}
                </div>
              </div>
              <div>
                <div className="text-xs text-slate-400 mb-1">Industries</div>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {bp.preferred_industries.map((ind) => (
                    <span
                      key={ind}
                      className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md"
                    >
                      {ind}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <div className="text-xs text-slate-400 mb-1">Countries</div>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {bp.preferred_countries.map((c) => (
                    <span
                      key={c}
                      className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Profile completeness */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-semibold text-slate-900">Profile</h2>
              <span className="text-sm font-bold text-blue-900">{completeness}%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2 mb-3">
              <div
                className="bg-blue-900 h-2 rounded-full transition-all"
                style={{ width: `${completeness}%` }}
              />
            </div>
            {completeness < 100 && (
              <p className="text-xs text-slate-500">
                Complete your profile to build trust with sellers.{" "}
                <Link
                  href="/buyer/onboarding"
                  className="text-blue-900 hover:text-blue-700 font-medium transition-colors"
                >
                  Update profile →
                </Link>
              </p>
            )}
            {completeness === 100 && (
              <p className="text-xs text-emerald-600 font-medium">Profile complete!</p>
            )}
          </div>

          {/* Public profile link */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5">
            <p className="text-sm font-medium text-slate-900 mb-1">Your public profile</p>
            <p className="text-xs text-slate-500 mb-3">
              Sellers can view your profile when you express interest.
            </p>
            <Link
              href={`/buyers/${user.id}`}
              className="text-xs font-medium text-blue-900 hover:text-blue-700 transition-colors"
            >
              View public profile →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
