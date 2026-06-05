import { supabase } from "@/lib/supabase";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { notFound } from "next/navigation";
import Link from "next/link";

export const dynamic = "force-dynamic";

function fmtCurrency(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${Math.round(n / 1_000)}K`;
  return `$${n.toLocaleString()}`;
}

function fmtDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

type Valuation = {
  id: string;
  created_at: string;
  user_id: string | null;
  industry: string;
  country: string;
  region: string;
  annual_revenue: number;
  annual_profit: number;
  years_operating: number;
  valuation_low: number;
  valuation_mid: number;
  valuation_high: number;
  primary_method: string;
  multiple_applied: number;
  confidence: string;
  key_value_drivers: string[];
  key_risks: string[];
  summary: string;
  view_count: number;
  title: string | null;
};

export default async function PublicValuationPage({
  params,
}: {
  params: Promise<{ share_token: string }>;
}) {
  const { share_token } = await params;

  const [{ data, error }, authClient] = await Promise.all([
    supabase
      .from("valuations")
      .select(
        "id, created_at, user_id, industry, country, region, annual_revenue, annual_profit, years_operating, valuation_low, valuation_mid, valuation_high, primary_method, multiple_applied, confidence, key_value_drivers, key_risks, summary, view_count, title"
      )
      .eq("share_token", share_token)
      .eq("is_public", true)
      .single(),
    createSupabaseServerClient(),
  ]);

  if (error || !data) notFound();

  const v = data as Valuation;
  const { data: { user } } = await authClient.auth.getUser();
  const isOwner = !!user && user.id === v.user_id;

  const createListingUrl = `/create-listing?${new URLSearchParams({
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

  // Increment view count (fire-and-forget, non-fatal)
  supabase.rpc("increment_valuation_view", { token: share_token }).then(() => {});

  const midPct =
    v.valuation_high > v.valuation_low
      ? ((v.valuation_mid - v.valuation_low) /
          (v.valuation_high - v.valuation_low)) *
        100
      : 50;

  const confidenceColor =
    v.confidence === "High"
      ? "text-emerald-600"
      : v.confidence === "Medium"
      ? "text-amber-600"
      : "text-red-600";

  const displayViews = v.view_count + 1;

  return (
    <div className="min-h-screen bg-slate-50 print:bg-white">
      {/* Top bar */}
      <div className="bg-white border-b border-slate-200 print:hidden">
        <div className="max-w-4xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold tracking-tight text-slate-900">
            Succession<span className="text-blue-900">IQ</span>
          </Link>
          <Link
            href="/valuate"
            className="bg-blue-900 hover:bg-blue-800 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            Get free valuation →
          </Link>
        </div>
      </div>

      {/* Print header — only visible when printing */}
      <div className="hidden print:flex items-center justify-between mb-8 pb-4 border-b border-slate-200">
        <span className="text-xl font-bold text-slate-900">
          Succession<span className="text-blue-900">IQ</span>
        </span>
        <span className="text-sm text-slate-400">successioniq.vercel.app</span>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12 print:py-4">
        {/* Report header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <span className="text-xs font-semibold uppercase tracking-widest text-blue-900 bg-blue-50 px-3 py-1 rounded-md border border-blue-100">
              Prepared by SuccessionIQ
            </span>
            <span className="text-xs text-slate-400">{fmtDate(v.created_at)}</span>
            <span className="text-xs text-slate-400 print:hidden">
              · This report has been viewed {displayViews} time{displayViews !== 1 ? "s" : ""}
            </span>
          </div>

          <h1 className="font-serif text-4xl font-bold text-slate-900 mb-2">
            {v.title ?? "Business Valuation Report"}
          </h1>
          <p className="text-slate-500 text-lg">
            {v.industry} · {v.region}, {v.country}
          </p>
        </div>

        {/* Valuation range card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-8 mb-6 shadow-sm print:shadow-none print:border-slate-300">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-8">
            Estimated Value Range
          </p>

          <div className="grid grid-cols-3 gap-4 text-center mb-6">
            <div>
              <div className="text-xs text-slate-400 mb-1.5 uppercase tracking-wider">
                Conservative
              </div>
              <div className="text-2xl font-bold text-slate-500">
                {fmtCurrency(v.valuation_low)}
              </div>
            </div>
            <div className="border-x border-slate-200 px-4">
              <div className="text-xs text-blue-900 font-semibold mb-1.5 uppercase tracking-wider">
                Most Likely
              </div>
              <div className="text-4xl font-bold text-slate-900">
                {fmtCurrency(v.valuation_mid)}
              </div>
            </div>
            <div>
              <div className="text-xs text-slate-400 mb-1.5 uppercase tracking-wider">
                Optimistic
              </div>
              <div className="text-2xl font-bold text-slate-500">
                {fmtCurrency(v.valuation_high)}
              </div>
            </div>
          </div>

          {/* Range bar */}
          <div className="relative h-2.5 rounded-full bg-gradient-to-r from-slate-200 via-blue-500 to-blue-900">
            <div
              style={{ left: `${midPct}%` }}
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-white border-2 border-blue-900 shadow-md"
            />
          </div>

          <div className="mt-8 pt-6 border-t border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
            <div>
              <div className="text-slate-400 mb-1">Primary Method</div>
              <div className="text-slate-900 font-medium">{v.primary_method}</div>
            </div>
            <div>
              <div className="text-slate-400 mb-1">Multiple Applied</div>
              <div className="text-slate-900 font-medium">{v.multiple_applied}x</div>
            </div>
            <div>
              <div className="text-slate-400 mb-1">Confidence</div>
              <div className={`font-semibold ${confidenceColor}`}>{v.confidence}</div>
            </div>
          </div>
        </div>

        {/* Value drivers & risks */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm print:shadow-none print:border-slate-300">
            <h3 className="flex items-center gap-2 text-sm font-semibold text-emerald-700 mb-5 uppercase tracking-wider">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-50 border border-emerald-200 text-xs">
                ✓
              </span>
              Key Value Drivers
            </h3>
            <ul className="space-y-3">
              {v.key_value_drivers.map((d, i) => (
                <li key={i} className="flex items-start gap-3 text-sm">
                  <div className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-emerald-500" />
                  <span className="text-slate-600 leading-relaxed">{d}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm print:shadow-none print:border-slate-300">
            <h3 className="flex items-center gap-2 text-sm font-semibold text-red-600 mb-5 uppercase tracking-wider">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-50 border border-red-200 text-xs">
                !
              </span>
              Key Risks
            </h3>
            <ul className="space-y-3">
              {v.key_risks.map((r, i) => (
                <li key={i} className="flex items-start gap-3 text-sm">
                  <div className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-red-500" />
                  <span className="text-slate-600 leading-relaxed">{r}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Analyst summary */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 mb-10 shadow-sm print:shadow-none print:border-slate-300">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4">
            Analyst Summary
          </p>
          <p className="text-slate-600 leading-relaxed">{v.summary}</p>
        </div>

        {/* Owner CTA — only visible to the valuation owner */}
        {isOwner && (
          <div className="mb-6 bg-white border border-blue-200 rounded-2xl px-6 py-5 shadow-sm print:hidden">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div>
                <p className="text-sm font-semibold text-slate-900 mb-0.5">
                  Your valuation
                </p>
                <p className="text-xs text-slate-500">
                  Refine your inputs or turn this into a live listing.
                </p>
              </div>
              <div className="flex items-center gap-3 flex-wrap">
                <Link
                  href={`/valuate/edit/${v.id}`}
                  className="flex-shrink-0 border border-blue-200 text-blue-900 hover:bg-blue-50 text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors"
                >
                  Refine valuation →
                </Link>
                <Link
                  href={createListingUrl}
                  className="flex-shrink-0 bg-blue-900 hover:bg-blue-800 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors shadow-sm"
                >
                  Create listing →
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* CTA banner — hidden when printing */}
        <div className="bg-blue-900 rounded-2xl p-8 text-white text-center print:hidden">
          <p className="text-xs font-semibold uppercase tracking-widest text-blue-300 mb-3">
            Free · Takes under 3 minutes
          </p>
          <h2 className="font-serif text-2xl font-bold mb-3">
            Get your own free business valuation
          </h2>
          <p className="text-blue-200 text-sm mb-6 max-w-md mx-auto">
            Join 500+ business owners who have used SuccessionIQ to understand what their
            business is worth.
          </p>
          <Link
            href="/valuate"
            className="inline-block bg-white text-blue-900 hover:bg-blue-50 px-8 py-3.5 rounded-xl font-semibold transition-colors shadow-md"
          >
            Get my free valuation →
          </Link>
        </div>

        {/* Print footer */}
        <div className="hidden print:block mt-12 pt-6 border-t border-slate-200 text-center text-xs text-slate-400">
          Generated by SuccessionIQ · successioniq.vercel.app · {fmtDate(v.created_at)}
        </div>
      </div>
    </div>
  );
}
