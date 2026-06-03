import { createSupabaseServerClient } from "@/lib/supabase-server";
import { Listing } from "@/lib/types";
import { getListingDisplayName } from "@/lib/listing-display";
import { getIndustryImage } from "@/lib/industry-image";
import { calculateCompleteness, completenessLabel } from "@/lib/profile-completeness";
import Link from "next/link";
import BookmarkButton from "@/components/BookmarkButton";

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

const FILTER_INDUSTRIES = [
  "All Industries",
  "SaaS",
  "Healthcare",
  "Manufacturing",
  "Retail",
  "Professional Services",
  "Technology",
  "Construction/Trades",
];

export default async function ListingsPage({
  searchParams,
}: {
  searchParams: Promise<{ industry?: string }>;
}) {
  const { industry: industryFilter } = await searchParams;

  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let isBuyer = false;
  let matchMap = new Map<string, { score: number; reason: string }>();
  let savedIds = new Set<string>();

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    isBuyer = profile?.role === "buyer";

    if (isBuyer) {
      const [matchesResult, savedResult, profileCheck] = await Promise.all([
        supabase
          .from("listing_matches")
          .select("listing_id, match_score, match_reason")
          .eq("buyer_id", user.id),
        supabase.from("saved_listings").select("listing_id").eq("buyer_id", user.id),
        supabase.from("buyer_profiles").select("id").eq("id", user.id).single(),
      ]);

      if (profileCheck.data) {
        matchMap = new Map(
          (matchesResult.data ?? []).map((m) => [
            m.listing_id,
            { score: m.match_score, reason: m.match_reason },
          ])
        );
        savedIds = new Set((savedResult.data ?? []).map((s) => s.listing_id));
      }
    }
  }

  let query = supabase
    .from("listings")
    .select("*")
    .eq("status", "active")
    .order("created_at", { ascending: false });

  if (industryFilter && industryFilter !== "All Industries") {
    query = query.ilike("industry", `%${industryFilter}%`);
  }

  const { data, error } = await query;
  let listings: Listing[] = error ? [] : (data as Listing[]);

  // Sort by match score for buyers; unmatched listings fall to the end
  if (isBuyer && matchMap.size > 0) {
    listings = [
      ...listings
        .filter((l) => matchMap.has(l.id))
        .sort(
          (a, b) => (matchMap.get(b.id)?.score ?? 0) - (matchMap.get(a.id)?.score ?? 0)
        ),
      ...listings.filter((l) => !matchMap.has(l.id)),
    ];
  }

  const hasMatches = isBuyer && matchMap.size > 0;

  return (
    <div className="max-w-7xl mx-auto px-6 py-24">
      <div className="mb-12">
        <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4 text-slate-900">
          Business Listings
        </h1>
        <p className="text-slate-500 text-lg max-w-xl">
          Browse vetted businesses available for acquisition. All listings are confidential and
          pre-screened by our team.
        </p>
      </div>

      {/* Filter bar */}
      <div className="flex gap-3 mb-6 flex-wrap">
        {FILTER_INDUSTRIES.map((f) => {
          const isActive =
            f === "All Industries"
              ? !industryFilter || industryFilter === "All Industries"
              : industryFilter === f;
          return (
            <Link
              key={f}
              href={
                f === "All Industries"
                  ? "/listings"
                  : `/listings?industry=${encodeURIComponent(f)}`
              }
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-blue-900 text-white"
                  : "bg-white text-slate-600 border border-slate-200 hover:border-slate-300 hover:text-slate-900"
              }`}
            >
              {f}
            </Link>
          );
        })}
      </div>

      {hasMatches && (
        <p className="text-sm text-slate-500 mb-8 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-900 inline-block" />
          Based on your criteria — sorted by match score
        </p>
      )}

      {/* Listing cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {listings.length === 0 && !error ? (
          <div className="col-span-3 py-24 text-center">
            <p className="text-slate-400 text-sm">
              No listings found
              {industryFilter && industryFilter !== "All Industries"
                ? ` in ${industryFilter}`
                : ""}
              . Check back soon.
            </p>
          </div>
        ) : (
          listings.map((l) => {
            const displayName = getListingDisplayName(l);
            const askingPrice = l.asking_price ?? l.valuation_mid;
            const profitMargin = ((l.annual_profit / l.annual_revenue) * 100).toFixed(1);
            const match = matchMap.get(l.id);

            return (
              <Link
                key={l.id}
                href={`/listings/${l.id}`}
                className="bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md hover:border-blue-200 transition-all cursor-pointer group block overflow-hidden"
              >
                {/* Cover image */}
                <div className="relative h-44 w-full">
                  <img
                    src={getIndustryImage(l.industry)}
                    alt={l.industry}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  {/* Overlay badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-start justify-between">
                    <span className="text-xs font-semibold uppercase tracking-widest text-blue-900 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-md border border-blue-100 shadow-sm">
                      {l.industry}
                    </span>
                    <div className="flex items-center gap-1.5">
                      {match && match.score >= 75 && (
                        <span className="text-xs font-semibold text-emerald-700 bg-white/90 backdrop-blur-sm border border-emerald-200 px-2 py-0.5 rounded-md shadow-sm">
                          Matches criteria
                        </span>
                      )}
                      {l.is_anonymous && (
                        <span className="text-xs font-medium text-slate-500 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-md border border-slate-200 shadow-sm">
                          Anonymous
                        </span>
                      )}
                      {(() => {
                        const pc = l.profile_completeness ?? calculateCompleteness(l as unknown as Partial<Record<string, unknown>>)
                        if (pc <= 0) return null
                        const { label, color } = completenessLabel(pc)
                        return (
                          <span className={`text-xs px-2 py-0.5 rounded-md border bg-${color}-50 border-${color}-200 text-${color}-700 bg-white/90 backdrop-blur-sm shadow-sm`}>
                            {label}
                          </span>
                        )
                      })()}
                      {isBuyer && (
                        <BookmarkButton
                          listingId={l.id}
                          initialSaved={savedIds.has(l.id)}
                          variant="icon"
                        />
                      )}
                    </div>
                  </div>
                </div>

                {/* Card body */}
                <div className="p-6">
                <h3 className="font-semibold text-slate-900 mb-1 group-hover:text-blue-900 transition-colors">
                  {displayName}
                </h3>
                <p className="text-xs text-slate-400 mb-4">
                  {l.region}, {l.country}
                </p>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <div className="text-xs text-slate-400 mb-1">Revenue</div>
                    <div className="text-lg font-semibold text-slate-900">
                      {fmtCurrency(l.annual_revenue)}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-400 mb-1">Profit</div>
                    <div className="text-lg font-semibold text-slate-900">
                      {fmtCurrency(l.annual_profit)}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-400 mb-1">Margin</div>
                    <div className="text-lg font-semibold text-slate-900">{profitMargin}%</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-400 mb-1">Asking Price</div>
                    <div className="text-lg font-semibold text-slate-900">
                      {fmtCurrency(askingPrice)}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-blue-800 group-hover:text-blue-900 transition-colors">
                    View details →
                  </span>
                  {match && (
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded-md border ${scoreColor(match.score)}`}
                    >
                      {match.score}% match
                    </span>
                  )}
                </div>
                </div>{/* end card body */}
              </Link>
            );
          })
        )}

        {/* Coming soon card */}
        <div className="bg-white border border-slate-200 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center text-center min-h-[240px]">
          <div className="text-3xl mb-3">🔍</div>
          <p className="text-slate-400 text-sm max-w-[160px]">
            More listings added weekly. Check back soon.
          </p>
        </div>
      </div>

      {listings.length > 0 && (
        <div className="text-center">
          <p className="text-slate-400 text-sm">
            Showing {listings.length} active listing{listings.length !== 1 ? "s" : ""}
          </p>
        </div>
      )}
    </div>
  );
}
