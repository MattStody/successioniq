import { createSupabaseServerClient } from "@/lib/supabase-server";
import { notFound, redirect } from "next/navigation";
import type { BuyerProfile } from "@/lib/types";

function fmtCurrency(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${Math.round(n / 1_000)}K`;
  return `$${n.toLocaleString()}`;
}

function displayName(fullName: string): string {
  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 1) return parts[0];
  return `${parts[0]} ${parts[parts.length - 1][0]}.`;
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

export default async function BuyerPublicProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  const { data, error } = await supabase
    .from("buyer_public_profiles")
    .select(
      "full_name, buyer_type, acquisition_type, capital_min, capital_max, preferred_industries, preferred_countries, experience_years, background_summary, is_verified, created_at"
    )
    .eq("id", id)
    .single();

  if (error || !data) notFound();

  const bp = data as Pick<
    BuyerProfile,
    | "full_name"
    | "buyer_type"
    | "acquisition_type"
    | "capital_min"
    | "capital_max"
    | "preferred_industries"
    | "preferred_countries"
    | "experience_years"
    | "background_summary"
    | "is_verified"
    | "created_at"
  >;

  const name = displayName(bp.full_name);
  const memberSince = new Date(bp.created_at).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm mb-6">
        <div className="flex items-start gap-5">
          <div className="w-16 h-16 rounded-full bg-blue-900 text-white flex items-center justify-center text-2xl font-bold flex-shrink-0">
            {name[0].toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h1 className="font-serif text-2xl font-bold text-slate-900">{name}</h1>
              {bp.is_verified && (
                <span className="text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-md">
                  Verified
                </span>
              )}
            </div>
            <p className="text-sm text-slate-500">
              {BUYER_TYPE_LABEL[bp.buyer_type] ?? bp.buyer_type} · Member since {memberSince}
            </p>
          </div>
        </div>

        {bp.background_summary && (
          <div className="mt-6 pt-6 border-t border-slate-100">
            <p className="text-sm text-slate-600 leading-relaxed">{bp.background_summary}</p>
          </div>
        )}
      </div>

      {/* Stats grid */}
      <div className="grid sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <div className="text-xs text-slate-400 uppercase tracking-widest mb-2">Capital Range</div>
          <div className="font-semibold text-slate-900">
            {fmtCurrency(bp.capital_min)} – {fmtCurrency(bp.capital_max)}
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <div className="text-xs text-slate-400 uppercase tracking-widest mb-2">Experience</div>
          <div className="font-semibold text-slate-900">
            {bp.experience_years} year{bp.experience_years !== 1 ? "s" : ""}
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <div className="text-xs text-slate-400 uppercase tracking-widest mb-2">
            Acquisition Type
          </div>
          <div className="font-semibold text-slate-900">
            {ACQUISITION_LABEL[bp.acquisition_type] ?? bp.acquisition_type}
          </div>
        </div>
      </div>

      {/* Industries + Countries */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-4">
            Preferred Industries
          </p>
          <div className="flex flex-wrap gap-2">
            {bp.preferred_industries.map((ind) => (
              <span
                key={ind}
                className="text-sm bg-blue-50 text-blue-900 border border-blue-100 px-3 py-1 rounded-lg"
              >
                {ind}
              </span>
            ))}
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-4">
            Preferred Countries
          </p>
          <div className="flex flex-wrap gap-2">
            {bp.preferred_countries.map((c) => (
              <span
                key={c}
                className="text-sm bg-slate-100 text-slate-700 border border-slate-200 px-3 py-1 rounded-lg"
              >
                {c}
              </span>
            ))}
          </div>
        </div>
      </div>

      <p className="text-center text-xs text-slate-400 mt-8">
        Contact details are only shared after both parties agree to proceed.
      </p>
    </div>
  );
}
