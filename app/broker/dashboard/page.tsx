import { createSupabaseServerClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import Link from "next/link";
import type { Listing, ListingStatus } from "@/lib/types";
import { getListingDisplayName } from "@/lib/listing-display";
import DeleteListingButton from "@/app/listings/[id]/DeleteListingButton";

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

export default async function BrokerDashboardPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  const [profileResult, brokerResult, listingsResult] = await Promise.all([
    supabase.from("profiles").select("role, full_name").eq("id", user.id).single(),
    supabase.from("brokers").select("*").eq("id", user.id).single(),
    supabase
      .from("listings")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false }),
  ]);

  if (profileResult.data?.role !== "broker") redirect("/dashboard");

  const broker = brokerResult.data;
  const listings: Listing[] = listingsResult.data ?? [];
  const displayName = profileResult.data?.full_name || user.email?.split("@")[0] || "there";

  const activeCount = listings.filter((l) => l.status === "active").length;
  const totalValue = listings.reduce(
    (sum, l) => sum + (l.asking_price ?? l.valuation_mid ?? 0),
    0
  );

  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      {/* Header */}
      <div className="flex items-start justify-between mb-10">
        <div>
          <p className="text-sm text-slate-400 mb-1">Broker Dashboard</p>
          <h1 className="font-serif text-4xl font-bold text-slate-900">
            Welcome back, {displayName}
          </h1>
          {broker?.agency_name && (
            <p className="text-slate-500 mt-1 flex items-center gap-2">
              {broker.agency_name}
              {broker.verified && (
                <span className="text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                  Verified
                </span>
              )}
            </p>
          )}
        </div>

        {/* CTAs */}
        <div className="flex gap-3 flex-shrink-0">
          <Link
            href="/valuate"
            className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:border-slate-300 hover:text-slate-900 text-sm font-medium transition-colors bg-white"
          >
            Add Single Listing
          </Link>
          <Link
            href="/broker/bulk-upload"
            className="px-5 py-2.5 rounded-xl bg-blue-900 hover:bg-blue-800 text-white text-sm font-semibold transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
          >
            Bulk Upload Listings →
          </Link>
        </div>
      </div>

      {/* Broker profile setup prompt */}
      {!broker && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl px-6 py-5 mb-8 flex items-start gap-4">
          <div className="text-amber-500 text-2xl mt-0.5">⚠</div>
          <div>
            <p className="text-sm font-semibold text-amber-900 mb-1">
              Complete your broker profile
            </p>
            <p className="text-sm text-amber-800">
              Add your agency name, license number, and contact details to unlock
              full access and verification.
            </p>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-5 mb-10">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">
            Total Listings
          </div>
          <div className="text-4xl font-bold text-slate-900">{listings.length}</div>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">
            Active
          </div>
          <div className="text-4xl font-bold text-emerald-600">{activeCount}</div>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">
            Total Listed Value
          </div>
          <div className="text-4xl font-bold text-blue-900">
            {fmtCurrency(totalValue)}
          </div>
        </div>
      </div>

      {/* Listings table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <h2 className="text-base font-semibold text-slate-900">Your Listings</h2>
          <Link
            href="/broker/bulk-upload"
            className="text-xs font-medium text-blue-900 hover:text-blue-700 transition-colors"
          >
            + Bulk upload
          </Link>
        </div>

        {listings.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-slate-400 text-sm mb-5">
              No listings yet. Use bulk upload to add multiple at once.
            </p>
            <Link
              href="/broker/bulk-upload"
              className="inline-block bg-blue-900 hover:bg-blue-800 text-white px-6 py-3 rounded-xl text-sm font-semibold transition-all"
            >
              Bulk Upload Listings →
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {listings.map((l) => {
              const displayName = getListingDisplayName(l);
              return (
                <div
                  key={l.id}
                  className="flex items-center justify-between px-6 py-4 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="font-medium text-slate-900 truncate">
                        {displayName}
                      </span>
                      <span
                        className={`flex-shrink-0 text-xs font-medium px-2 py-0.5 rounded-md border ${STATUS_BADGE[l.status]}`}
                      >
                        {STATUS_LABEL[l.status]}
                      </span>
                    </div>
                    <div className="text-xs text-slate-400">
                      {l.industry} · {l.region}, {l.country} ·{" "}
                      {fmtCurrency(l.annual_revenue)} revenue ·{" "}
                      {fmtDate(l.created_at)}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 ml-4 flex-shrink-0">
                    <span className="text-sm font-semibold text-slate-900">
                      {fmtCurrency(l.asking_price ?? l.valuation_mid ?? 0)}
                    </span>
                    <Link
                      href={`/listings/${l.id}`}
                      className="text-xs text-blue-900 hover:underline font-medium"
                    >
                      View
                    </Link>
                    <DeleteListingButton
                      listingId={l.id}
                      redirectTo="/broker/dashboard"
                      compact
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
