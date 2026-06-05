import { createSupabaseServerClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import Link from "next/link";
import ProfileForm from "./ProfileForm";
import type { Listing, ListingStatus, Valuation } from "@/lib/types";
import { getListingDisplayName } from "@/lib/listing-display";
import { completenessLabel } from "@/lib/profile-completeness";

function fmtCurrency(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${Math.round(n / 1_000)}K`;
  return `$${n.toLocaleString()}`;
}

function fmtDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

const STATUS_BADGE: Record<ListingStatus, string> = {
  draft: "bg-slate-100 text-slate-600 border-slate-200",
  active: "bg-emerald-50 text-emerald-700 border-emerald-200",
  under_offer: "bg-amber-50 text-amber-700 border-amber-200",
  sold: "bg-blue-50 text-blue-700 border-blue-200",
};

const STATUS_LABEL: Record<ListingStatus, string> = {
  draft: "Draft",
  active: "Active",
  under_offer: "Under Offer",
  sold: "Sold",
};

export default async function DashboardPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  const [profileResult, valuationsResult, listingsResult, ndasResult] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user.id).single(),
    supabase
      .from("valuations")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false }),
    supabase
      .from("listings")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false }),
    supabase
      .from("ndas")
      .select("id, created_at, full_name, email, listing_id, listings!inner(id, industry, business_name, is_anonymous)")
      .order("created_at", { ascending: false })
      .limit(20),
  ]);

  const profile = profileResult.data;
  const valuations: Valuation[] = valuationsResult.data ?? [];
  const listings: Listing[] = listingsResult.data ?? [];
  type NdaRow = {
    id: string;
    created_at: string;
    full_name: string;
    email: string;
    listing_id: string;
    listings: { id: string; industry: string; business_name: string | null; is_anonymous: boolean };
  };
  const ndaRequests: NdaRow[] = (ndasResult.data ?? []) as unknown as NdaRow[];

  const displayName = profile?.full_name || user.email?.split("@")[0] || "there";

  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      {/* Welcome header */}
      <div className="mb-12">
        <p className="text-sm text-slate-400 mb-1">Welcome back</p>
        <h1 className="font-serif text-4xl font-bold text-slate-900">
          {displayName}
        </h1>
      </div>

      <div className="grid lg:grid-cols-[1fr_320px] gap-10 items-start">
        {/* Left: Valuations + Listings */}
        <div className="space-y-12">
          {/* Valuations */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-slate-900">Your Valuations</h2>
              <Link
                href="/valuate"
                className="text-sm font-medium text-blue-900 hover:text-blue-700 border border-blue-200 hover:border-blue-300 px-4 py-2 rounded-lg transition-colors"
              >
                + Run new valuation
              </Link>
            </div>

            {valuations.length === 0 ? (
              <div className="bg-white border border-slate-200 border-dashed rounded-2xl p-10 text-center">
                <p className="text-slate-400 text-sm mb-4">
                  No valuations yet. Run your first one to track your business value over time.
                </p>
                <Link
                  href="/valuate"
                  className="inline-block bg-blue-900 hover:bg-blue-800 text-white px-6 py-3 rounded-xl text-sm font-semibold transition-all"
                >
                  Get free valuation →
                </Link>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-4">
                {valuations.map((v) => {
                  const createUrl = `/create-listing?${new URLSearchParams({
                    industry: v.industry,
                    country: v.country,
                    region: v.region,
                    annual_revenue: String(v.annual_revenue),
                    annual_profit: String(v.annual_profit),
                    years_operating: String(v.years_operating),
                    valuation_low: String(v.valuation_low),
                    valuation_mid: String(v.valuation_mid),
                    valuation_high: String(v.valuation_high),
                    key_value_drivers: JSON.stringify(v.key_value_drivers),
                    key_risks: JSON.stringify(v.key_risks),
                  }).toString()}`;

                  return (
                    <div
                      key={v.id}
                      className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm transition-all hover:shadow-md hover:border-blue-200"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <span className="text-xs font-semibold uppercase tracking-widest text-blue-900 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-100">
                          {v.industry}
                        </span>
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-md border ${
                          v.confidence === "High"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : v.confidence === "Medium"
                            ? "bg-amber-50 text-amber-700 border-amber-200"
                            : "bg-red-50 text-red-700 border-red-200"
                        }`}>
                          {v.confidence} confidence
                        </span>
                      </div>
                      <div className="mb-4">
                        <div className="text-xs text-slate-400 mb-0.5">Valuation Range</div>
                        <div className="text-lg font-bold text-slate-900">
                          {fmtCurrency(v.valuation_low)} – {fmtCurrency(v.valuation_high)}
                        </div>
                        <div className="text-sm text-blue-900 font-semibold">
                          Most likely: {fmtCurrency(v.valuation_mid)}
                        </div>
                      </div>
                      <div className="text-xs text-slate-400 mb-4">
                        {v.region}, {v.country} · {fmtDate(v.created_at)}
                      </div>
                      <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
                        {v.share_token && (
                          <Link
                            href={`/valuation/${v.share_token}`}
                            className="text-xs font-medium text-slate-500 hover:text-blue-900 transition-colors"
                          >
                            View report →
                          </Link>
                        )}
                        <Link
                          href={createUrl}
                          className="ml-auto text-xs font-semibold text-white bg-blue-900 hover:bg-blue-800 px-3 py-1.5 rounded-lg transition-colors"
                        >
                          Create listing →
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          {/* Listings */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-slate-900">Your Listings</h2>
              <Link
                href="/valuate"
                className="text-sm font-medium text-blue-900 hover:text-blue-700 border border-blue-200 hover:border-blue-300 px-4 py-2 rounded-lg transition-colors"
              >
                + Create new listing
              </Link>
            </div>

            {listings.length === 0 ? (
              <div className="bg-white border border-slate-200 border-dashed rounded-2xl p-10 text-center">
                <p className="text-slate-400 text-sm mb-4">
                  No listings yet. Complete a valuation to create your first listing.
                </p>
                <Link
                  href="/valuate"
                  className="inline-block bg-blue-900 hover:bg-blue-800 text-white px-6 py-3 rounded-xl text-sm font-semibold transition-all"
                >
                  Start with a valuation →
                </Link>
              </div>
            ) : (
              <>
                {listings.some((l) => (l.profile_completeness ?? 0) < 70) && (() => {
                  const lowest = listings.reduce((min, l) =>
                    (l.profile_completeness ?? 0) < (min.profile_completeness ?? 0) ? l : min
                  );
                  return (
                    <div className="mb-4 flex items-center justify-between bg-amber-50 border border-amber-200 rounded-2xl px-5 py-4">
                      <div className="flex items-center gap-3">
                        <span className="text-amber-700 text-lg">✦</span>
                        <p className="text-sm text-amber-800 font-medium">
                          Complete your listing profiles to attract more buyers
                        </p>
                      </div>
                      <Link
                        href={`/seller/profile/${lowest.id}`}
                        className="text-xs font-semibold text-amber-800 border border-amber-300 hover:border-amber-500 bg-white px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap"
                      >
                        Complete now →
                      </Link>
                    </div>
                  );
                })()}
                <div className="space-y-3">
                  {listings.map((l) => {
                    const listingDisplayName = getListingDisplayName(l);
                    const pc = l.profile_completeness ?? 0;
                    const { label: pcLabel, color: pcColor } = completenessLabel(pc);
                    const pcColorMap: Record<string, string> = {
                      emerald: "bg-emerald-50 text-emerald-700 border-emerald-200",
                      amber: "bg-amber-50 text-amber-700 border-amber-200",
                      slate: "bg-slate-50 text-slate-500 border-slate-200",
                    };
                    return (
                      <div
                        key={l.id}
                        className="flex items-center justify-between bg-white border border-slate-200 rounded-2xl px-5 py-4 shadow-sm hover:border-blue-200 hover:shadow-md transition-all"
                      >
                        <div>
                          <div className="font-medium text-slate-900">
                            {listingDisplayName}
                          </div>
                          <div className="text-xs text-slate-400 mt-0.5">
                            {fmtCurrency(l.annual_revenue)} revenue · Listed {fmtDate(l.created_at)}
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          {pc > 0 && (
                            <span className={`text-xs font-medium px-2.5 py-1 rounded-md border ${pcColorMap[pcColor] ?? pcColorMap.slate}`}>
                              {pc}% · {pcLabel}
                            </span>
                          )}
                          <span
                            className={`text-xs font-medium px-2.5 py-1 rounded-md border ${STATUS_BADGE[l.status]}`}
                          >
                            {STATUS_LABEL[l.status]}
                          </span>
                          <Link
                            href={`/seller/profile/${l.id}`}
                            className="text-xs font-medium text-blue-900 border border-blue-200 hover:border-blue-400 hover:bg-blue-50 px-2.5 py-1 rounded-md transition-colors"
                          >
                            Edit Profile →
                          </Link>
                          <Link
                            href={`/listings/${l.id}`}
                            className="text-slate-400 text-sm hover:text-slate-700 transition-colors"
                          >
                            →
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </section>

          {/* NDA Requests */}
          {ndaRequests.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-slate-900">NDA Requests</h2>
                <span className="text-xs font-medium bg-blue-50 text-blue-800 border border-blue-200 px-2.5 py-1 rounded-md">
                  {ndaRequests.length} signed
                </span>
              </div>
              <div className="space-y-3">
                {ndaRequests.map((nda) => {
                  const listingName =
                    nda.listings.is_anonymous || !nda.listings.business_name
                      ? `${nda.listings.industry} Business`
                      : nda.listings.business_name;
                  return (
                    <div
                      key={nda.id}
                      className="flex items-center justify-between bg-white border border-slate-200 rounded-2xl px-5 py-4 shadow-sm"
                    >
                      <div>
                        <div className="font-medium text-slate-900">{nda.full_name}</div>
                        <div className="text-xs text-slate-400 mt-0.5">
                          <a
                            href={`mailto:${nda.email}`}
                            className="hover:text-blue-700 transition-colors"
                          >
                            {nda.email}
                          </a>
                          {" · "}
                          {fmtDate(nda.created_at)}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Link
                          href={`/listings/${nda.listing_id}`}
                          className="text-xs text-slate-500 hover:text-slate-800 transition-colors"
                        >
                          {listingName} →
                        </Link>
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 border border-emerald-200 text-xs text-emerald-700 flex-shrink-0">
                          ✓
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}
        </div>

        {/* Right: Profile settings */}
        <div className="lg:sticky lg:top-24 space-y-5">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h2 className="text-base font-semibold text-slate-900 mb-5 pb-4 border-b border-slate-200">
              Profile Settings
            </h2>
            <ProfileForm
              userId={user.id}
              initialName={profile?.full_name ?? null}
              initialPhone={profile?.phone ?? null}
              email={user.email ?? ""}
              role={profile?.role ?? "seller"}
            />
          </div>

          {profile?.role === "broker" && (
            <div className="bg-blue-900 rounded-2xl p-6 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-widest text-blue-300 mb-2">
                Broker Tools
              </p>
              <h3 className="text-white font-semibold text-base mb-1">
                Bulk Upload Listings
              </h3>
              <p className="text-blue-200 text-sm mb-4">
                Import multiple listings at once via CSV.
              </p>
              <Link
                href="/broker/bulk-upload"
                className="block text-center bg-white text-blue-900 hover:bg-blue-50 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors"
              >
                Go to Bulk Upload →
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
