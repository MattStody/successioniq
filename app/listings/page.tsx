import { supabase } from "@/lib/supabase";
import { Listing } from "@/lib/types";
import Link from "next/link";

function fmtCurrency(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${Math.round(n / 1_000)}K`;
  return `$${n.toLocaleString()}`;
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

export const revalidate = 60;

export default async function ListingsPage({
  searchParams,
}: {
  searchParams: Promise<{ industry?: string }>;
}) {
  const { industry: industryFilter } = await searchParams;

  let query = supabase
    .from("listings")
    .select("*")
    .eq("status", "active")
    .order("created_at", { ascending: false });

  if (industryFilter && industryFilter !== "All Industries") {
    query = query.ilike("industry", `%${industryFilter}%`);
  }

  const { data, error } = await query;
  const listings: Listing[] = error ? [] : (data as Listing[]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-24">
      <div className="mb-12">
        <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4 text-slate-900">
          Business Listings
        </h1>
        <p className="text-slate-500 text-lg max-w-xl">
          Browse vetted businesses available for acquisition. All listings are
          confidential and pre-screened by our team.
        </p>
      </div>

      {/* Filter bar */}
      <div className="flex gap-3 mb-10 flex-wrap">
        {FILTER_INDUSTRIES.map((f) => {
          const isActive =
            f === "All Industries"
              ? !industryFilter || industryFilter === "All Industries"
              : industryFilter === f;
          return (
            <Link
              key={f}
              href={f === "All Industries" ? "/listings" : `/listings?industry=${encodeURIComponent(f)}`}
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
            const displayName =
              l.is_anonymous || !l.business_name
                ? `${l.industry} Business`
                : l.business_name;
            const askingPrice = l.asking_price ?? l.valuation_mid;
            const profitMargin = ((l.annual_profit / l.annual_revenue) * 100).toFixed(1);

            return (
              <Link
                key={l.id}
                href={`/listings/${l.id}`}
                className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-blue-200 transition-all cursor-pointer group block"
              >
                <div className="flex items-start justify-between mb-4">
                  <span className="text-xs font-semibold uppercase tracking-widest text-blue-900 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-100">
                    {l.industry}
                  </span>
                  {l.is_anonymous && (
                    <span className="text-xs font-medium text-slate-400 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-200">
                      Anonymous
                    </span>
                  )}
                </div>

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
                    <div className="text-lg font-semibold text-slate-900">
                      {profitMargin}%
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-400 mb-1">Asking Price</div>
                    <div className="text-lg font-semibold text-slate-900">
                      {fmtCurrency(askingPrice)}
                    </div>
                  </div>
                </div>

                <div className="text-sm font-medium text-blue-800 group-hover:text-blue-900 transition-colors">
                  View details →
                </div>
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
