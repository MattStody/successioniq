import { supabase } from "@/lib/supabase";
import { Listing } from "@/lib/types";
import Link from "next/link";
import { notFound } from "next/navigation";

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

  const { data, error } = await supabase
    .from("listings")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) notFound();

  const listing = data as Listing;
  const displayName =
    listing.is_anonymous || !listing.business_name
      ? `${listing.industry} Business`
      : listing.business_name;

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
              <p className="text-slate-700 text-sm leading-relaxed">
                {listing.transition_period}
              </p>
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">
                Preferred Buyer
              </p>
              <p className="text-slate-700 text-sm leading-relaxed">
                {listing.preferred_buyer}
              </p>
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

            {/* NDA button */}
            <button className="w-full bg-blue-900 hover:bg-blue-800 text-white px-6 py-3.5 rounded-xl font-semibold transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 text-sm mb-3">
              Sign NDA & Get Contact Details
            </button>
            <p className="text-center text-xs text-slate-400">
              NDA is managed electronically — takes 2 minutes
            </p>
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

          {/* Listed date */}
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
