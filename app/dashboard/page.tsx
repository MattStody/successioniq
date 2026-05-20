import { createSupabaseServerClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import Link from "next/link";
import ProfileForm from "./ProfileForm";
import type { Listing, ListingStatus, Valuation } from "@/lib/types";

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

  const [profileResult, valuationsResult, listingsResult] = await Promise.all([
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
  ]);

  const profile = profileResult.data;
  const valuations: Valuation[] = valuationsResult.data ?? [];
  const listings: Listing[] = listingsResult.data ?? [];

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
                {valuations.map((v) => (
                  <div
                    key={v.id}
                    className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm"
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
                    <div className="mb-3">
                      <div className="text-xs text-slate-400 mb-0.5">Valuation Range</div>
                      <div className="text-lg font-bold text-slate-900">
                        {fmtCurrency(v.valuation_low)} – {fmtCurrency(v.valuation_high)}
                      </div>
                      <div className="text-sm text-blue-900 font-semibold">
                        Most likely: {fmtCurrency(v.valuation_mid)}
                      </div>
                    </div>
                    <div className="text-xs text-slate-400">
                      {v.region}, {v.country} · {fmtDate(v.created_at)}
                    </div>
                  </div>
                ))}
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
              <div className="space-y-3">
                {listings.map((l) => {
                  const displayName =
                    l.is_anonymous || !l.business_name
                      ? `${l.industry} Business`
                      : l.business_name;
                  return (
                    <Link
                      key={l.id}
                      href={`/listings/${l.id}`}
                      className="flex items-center justify-between bg-white border border-slate-200 rounded-2xl px-5 py-4 shadow-sm hover:border-blue-200 hover:shadow-md transition-all group"
                    >
                      <div>
                        <div className="font-medium text-slate-900 group-hover:text-blue-900 transition-colors">
                          {displayName}
                        </div>
                        <div className="text-xs text-slate-400 mt-0.5">
                          {fmtCurrency(l.annual_revenue)} revenue · Listed {fmtDate(l.created_at)}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span
                          className={`text-xs font-medium px-2.5 py-1 rounded-md border ${STATUS_BADGE[l.status]}`}
                        >
                          {STATUS_LABEL[l.status]}
                        </span>
                        <span className="text-slate-400 text-sm">→</span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </section>
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
