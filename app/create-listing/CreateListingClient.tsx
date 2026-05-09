"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ValuationParams {
  industry: string;
  country: string;
  region: string;
  annual_revenue: number;
  annual_profit: number;
  years_operating: number;
  valuation_low: number;
  valuation_mid: number;
  valuation_high: number;
  key_value_drivers: string[];
  key_risks: string[];
}

interface FormState {
  business_name: string;
  is_anonymous: boolean;
  whats_included: string;
  transition_period: string;
  preferred_buyer: string;
  contact_email: string;
  asking_price: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmtCurrency(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${Math.round(n / 1_000)}K`;
  return `$${n.toLocaleString()}`;
}

const inputCls =
  "w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-100 transition-colors text-sm";

const textareaCls = `${inputCls} resize-none leading-relaxed`;

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1.5">{label}</label>
      {hint && <p className="text-xs text-slate-400 mb-2">{hint}</p>}
      {children}
    </div>
  );
}

// ─── Preview Panel ────────────────────────────────────────────────────────────

function PreviewPanel({
  valuation,
  form,
  description,
  descLoading,
}: {
  valuation: ValuationParams | null;
  form: FormState;
  description: string;
  descLoading: boolean;
}) {
  if (!valuation) return null;

  const displayName =
    form.is_anonymous || !form.business_name
      ? `${valuation.industry} Business`
      : form.business_name;

  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
      {/* Header */}
      <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest">
          Live Preview
        </span>
        <span className="text-xs text-slate-400 bg-white border border-slate-200 px-2.5 py-1 rounded-md">
          How buyers will see this
        </span>
      </div>

      <div className="p-6">
        {/* Industry tag */}
        <div className="flex items-start justify-between mb-4">
          <span className="text-xs font-semibold uppercase tracking-widest text-blue-900 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-100">
            {valuation.industry}
          </span>
          {form.is_anonymous && (
            <span className="text-xs font-medium text-slate-500 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-200">
              Anonymous
            </span>
          )}
        </div>

        {/* Business name */}
        <h2 className="font-serif text-xl font-bold text-slate-900 mb-1">{displayName}</h2>
        <p className="text-sm text-slate-400 mb-5">
          {valuation.region}, {valuation.country} · {valuation.years_operating} years operating
        </p>

        {/* Financials grid */}
        <div className="grid grid-cols-2 gap-4 mb-5">
          <div className="bg-slate-50 rounded-xl p-4">
            <div className="text-xs text-slate-400 mb-1">Annual Revenue</div>
            <div className="text-lg font-bold text-slate-900">
              {fmtCurrency(valuation.annual_revenue)}
            </div>
          </div>
          <div className="bg-slate-50 rounded-xl p-4">
            <div className="text-xs text-slate-400 mb-1">Annual Profit</div>
            <div className="text-lg font-bold text-slate-900">
              {fmtCurrency(valuation.annual_profit)}
            </div>
          </div>
          <div className="bg-slate-50 rounded-xl p-4">
            <div className="text-xs text-slate-400 mb-1">Asking Price</div>
            <div className="text-lg font-bold text-slate-900">
              {form.asking_price
                ? fmtCurrency(Number(form.asking_price))
                : fmtCurrency(valuation.valuation_mid)}
            </div>
          </div>
          <div className="bg-slate-50 rounded-xl p-4">
            <div className="text-xs text-slate-400 mb-1">Valuation Range</div>
            <div className="text-sm font-semibold text-slate-700">
              {fmtCurrency(valuation.valuation_low)} – {fmtCurrency(valuation.valuation_high)}
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="mb-5">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">
            About this Business
          </div>
          {descLoading ? (
            <div className="space-y-2">
              {[100, 90, 85, 100, 75].map((w, i) => (
                <div
                  key={i}
                  className="h-3 rounded bg-slate-100 animate-pulse"
                  style={{ width: `${w}%` }}
                />
              ))}
            </div>
          ) : description ? (
            <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">
              {description}
            </p>
          ) : (
            <p className="text-sm text-slate-300 italic">
              Description will appear here once generated…
            </p>
          )}
        </div>

        {/* Value drivers */}
        {valuation.key_value_drivers.length > 0 && (
          <div className="mb-5">
            <div className="text-xs font-semibold text-emerald-700 uppercase tracking-widest mb-2">
              Value Drivers
            </div>
            <ul className="space-y-1.5">
              {valuation.key_value_drivers.slice(0, 3).map((d, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-slate-600">
                  <div className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-emerald-500" />
                  {d}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Whats included preview */}
        {form.whats_included && (
          <div>
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">
              What&apos;s Included
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">{form.whats_included}</p>
          </div>
        )}
      </div>

      <div className="px-6 pb-6">
        <div className="w-full py-3 rounded-xl bg-blue-900/5 border border-blue-900/10 text-center text-sm font-medium text-blue-900">
          Request NDA & Contact Details
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function CreateListingClient() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [valuation, setValuation] = useState<ValuationParams | null>(null);
  const [form, setForm] = useState<FormState>({
    business_name: "",
    is_anonymous: false,
    whats_included: "",
    transition_period: "",
    preferred_buyer: "",
    contact_email: "",
    asking_price: "",
  });
  const [description, setDescription] = useState("");
  const [descLoading, setDescLoading] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = (fields: Partial<FormState>) =>
    setForm((prev) => ({ ...prev, ...fields }));

  // Parse URL params on mount
  useEffect(() => {
    try {
      const v: ValuationParams = {
        industry: searchParams.get("industry") ?? "",
        country: searchParams.get("country") ?? "",
        region: searchParams.get("region") ?? "",
        annual_revenue: Number(searchParams.get("annual_revenue") ?? 0),
        annual_profit: Number(searchParams.get("annual_profit") ?? 0),
        years_operating: Number(searchParams.get("years_operating") ?? 0),
        valuation_low: Number(searchParams.get("valuation_low") ?? 0),
        valuation_mid: Number(searchParams.get("valuation_mid") ?? 0),
        valuation_high: Number(searchParams.get("valuation_high") ?? 0),
        key_value_drivers: JSON.parse(
          searchParams.get("key_value_drivers") ?? "[]"
        ),
        key_risks: JSON.parse(searchParams.get("key_risks") ?? "[]"),
      };
      setValuation(v);
    } catch {
      // Missing or malformed params — user came directly to page
    }
  }, [searchParams]);

  const generateDescription = useCallback(async () => {
    if (!valuation) return;
    setDescLoading(true);
    try {
      const res = await fetch("/api/generate-description", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(valuation),
      });
      const data = await res.json();
      if (data.description) setDescription(data.description);
    } catch {
      // silently fail — user can regenerate
    } finally {
      setDescLoading(false);
    }
  }, [valuation]);

  // Auto-generate description once we have valuation data
  useEffect(() => {
    if (valuation && !description && !descLoading) {
      generateDescription();
    }
  }, [valuation, description, descLoading, generateDescription]);

  const canPublish =
    description &&
    form.whats_included &&
    form.transition_period &&
    form.preferred_buyer &&
    form.contact_email &&
    valuation;

  const handlePublish = async () => {
    if (!canPublish || !valuation) return;
    setPublishing(true);
    setError(null);

    try {
      const payload = {
        industry: valuation.industry,
        country: valuation.country,
        region: valuation.region,
        annual_revenue: valuation.annual_revenue,
        annual_profit: valuation.annual_profit,
        years_operating: valuation.years_operating,
        valuation_low: valuation.valuation_low,
        valuation_mid: valuation.valuation_mid,
        valuation_high: valuation.valuation_high,
        key_value_drivers: valuation.key_value_drivers,
        key_risks: valuation.key_risks,
        description,
        is_anonymous: form.is_anonymous,
        business_name: form.is_anonymous ? null : form.business_name || null,
        whats_included: form.whats_included,
        transition_period: form.transition_period,
        preferred_buyer: form.preferred_buyer,
        contact_email: form.contact_email,
        asking_price: form.asking_price ? Number(form.asking_price) : null,
        status: "active",
      };

      const res = await fetch("/api/listings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? `HTTP ${res.status}`);
      }

      const listing = await res.json();
      router.push(`/listings/${listing.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to publish listing");
      setPublishing(false);
    }
  };

  // No valuation data — show manual entry prompt
  const noData = valuation && !valuation.industry;

  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      {/* Header */}
      <div className="mb-10">
        <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 text-blue-800 text-sm px-4 py-1.5 rounded-full mb-5 font-medium">
          <span className="h-1.5 w-1.5 rounded-full bg-blue-700" />
          Create Listing
        </div>
        <h1 className="font-serif text-4xl font-bold text-slate-900 mb-2">
          List your business for sale
        </h1>
        <p className="text-slate-500 text-sm max-w-lg">
          Your valuation data has been pre-filled. Complete the details below to
          publish your listing to our curated buyer marketplace.
        </p>
      </div>

      {noData && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-5 py-4 mb-8 text-sm text-amber-800">
          No valuation data detected. Please{" "}
          <a href="/valuate" className="underline font-medium">
            complete a valuation
          </a>{" "}
          first to auto-fill your listing details.
        </div>
      )}

      <div className="grid lg:grid-cols-[1fr_420px] gap-10 items-start">
        {/* ── Left: Form ── */}
        <div className="space-y-8">
          {/* Valuation summary (read-only) */}
          {valuation && valuation.industry && (
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4">
                From Your Valuation
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
                <div>
                  <div className="text-slate-400 mb-0.5">Industry</div>
                  <div className="font-semibold text-slate-900">{valuation.industry}</div>
                </div>
                <div>
                  <div className="text-slate-400 mb-0.5">Location</div>
                  <div className="font-semibold text-slate-900">
                    {valuation.region}, {valuation.country}
                  </div>
                </div>
                <div>
                  <div className="text-slate-400 mb-0.5">Annual Revenue</div>
                  <div className="font-semibold text-slate-900">
                    {fmtCurrency(valuation.annual_revenue)}
                  </div>
                </div>
                <div>
                  <div className="text-slate-400 mb-0.5">Annual Profit</div>
                  <div className="font-semibold text-slate-900">
                    {fmtCurrency(valuation.annual_profit)}
                  </div>
                </div>
                <div>
                  <div className="text-slate-400 mb-0.5">Est. Value</div>
                  <div className="font-semibold text-slate-900">
                    {fmtCurrency(valuation.valuation_mid)}
                  </div>
                </div>
                <div>
                  <div className="text-slate-400 mb-0.5">Years Operating</div>
                  <div className="font-semibold text-slate-900">
                    {valuation.years_operating}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Identity */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h2 className="text-base font-semibold text-slate-900 mb-5 pb-4 border-b border-slate-200">
              Business Identity
            </h2>
            <div className="space-y-5">
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="anonymous"
                  checked={form.is_anonymous}
                  onChange={(e) => update({ is_anonymous: e.target.checked })}
                  className="mt-0.5 h-4 w-4 accent-blue-900 cursor-pointer"
                />
                <label htmlFor="anonymous" className="cursor-pointer">
                  <div className="text-sm font-medium text-slate-900">
                    List anonymously
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">
                    Your business name will be hidden until an NDA is signed
                  </div>
                </label>
              </div>

              {!form.is_anonymous && (
                <Field label="Business Name">
                  <input
                    type="text"
                    placeholder="e.g. Acme Plumbing LLC"
                    value={form.business_name}
                    onChange={(e) => update({ business_name: e.target.value })}
                    className={inputCls}
                  />
                </Field>
              )}
            </div>
          </div>

          {/* AI Description */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-5 pb-4 border-b border-slate-200">
              <div>
                <h2 className="text-base font-semibold text-slate-900">
                  Listing Description
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  AI-generated from your valuation data — edit as needed
                </p>
              </div>
              <button
                onClick={generateDescription}
                disabled={descLoading}
                className="text-xs text-blue-900 hover:text-blue-700 font-medium border border-blue-200 hover:border-blue-300 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
              >
                {descLoading ? "Generating…" : "Regenerate"}
              </button>
            </div>

            {descLoading ? (
              <div className="space-y-2 py-2">
                {[100, 90, 95, 80, 100, 85].map((w, i) => (
                  <div
                    key={i}
                    className="h-3 rounded bg-slate-100 animate-pulse"
                    style={{ width: `${w}%` }}
                  />
                ))}
              </div>
            ) : (
              <textarea
                rows={8}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Your AI-generated description will appear here…"
                className={textareaCls}
              />
            )}
          </div>

          {/* Listing Details */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h2 className="text-base font-semibold text-slate-900 mb-5 pb-4 border-b border-slate-200">
              Listing Details
            </h2>
            <div className="space-y-5">
              <Field
                label="What's Included in the Sale"
                hint="Equipment, inventory, IP, customer contracts, staff, etc."
              >
                <textarea
                  rows={3}
                  placeholder="e.g. All equipment (fully owned), client contracts, trained staff of 12, proprietary software, brand and domain..."
                  value={form.whats_included}
                  onChange={(e) => update({ whats_included: e.target.value })}
                  className={textareaCls}
                />
              </Field>

              <Field
                label="Transition Period"
                hint="How long will you stay to support the new owner?"
              >
                <input
                  type="text"
                  placeholder="e.g. 3–6 months of training and handover included"
                  value={form.transition_period}
                  onChange={(e) => update({ transition_period: e.target.value })}
                  className={inputCls}
                />
              </Field>

              <Field
                label="Preferred Buyer Type"
                hint="Who is the ideal acquirer?"
              >
                <input
                  type="text"
                  placeholder="e.g. Operator-buyer or strategic acquirer in the same industry"
                  value={form.preferred_buyer}
                  onChange={(e) => update({ preferred_buyer: e.target.value })}
                  className={inputCls}
                />
              </Field>
            </div>
          </div>

          {/* Pricing & Contact */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h2 className="text-base font-semibold text-slate-900 mb-5 pb-4 border-b border-slate-200">
              Pricing & Contact
            </h2>
            <div className="space-y-5">
              <Field
                label="Asking Price (optional)"
                hint={
                  valuation
                    ? `Your AI valuation is ${fmtCurrency(valuation.valuation_mid)} — leave blank to display this`
                    : "Leave blank to display the AI valuation estimate"
                }
              >
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
                    $
                  </span>
                  <input
                    type="number"
                    min="0"
                    placeholder="Leave blank to use AI estimate"
                    value={form.asking_price}
                    onChange={(e) => update({ asking_price: e.target.value })}
                    className={`${inputCls} pl-8`}
                  />
                </div>
              </Field>

              <Field
                label="Contact Email"
                hint="Buyer inquiries will be routed here after NDA is signed"
              >
                <input
                  type="email"
                  placeholder="you@company.com"
                  value={form.contact_email}
                  onChange={(e) => update({ contact_email: e.target.value })}
                  className={inputCls}
                />
              </Field>
            </div>
          </div>

          {/* Publish */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl px-5 py-4 text-sm text-red-700">
              {error}
            </div>
          )}

          <button
            onClick={handlePublish}
            disabled={!canPublish || publishing}
            className="w-full bg-blue-900 hover:bg-blue-800 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white px-8 py-4 rounded-xl font-semibold transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 disabled:translate-y-0 disabled:shadow-none text-sm"
          >
            {publishing ? "Publishing…" : "Publish Listing →"}
          </button>

          <p className="text-center text-xs text-slate-400 -mt-4">
            Your listing will be visible to our curated network of verified buyers immediately.
          </p>
        </div>

        {/* ── Right: Preview ── */}
        <div className="lg:sticky lg:top-24">
          <PreviewPanel
            valuation={valuation}
            form={form}
            description={description}
            descLoading={descLoading}
          />
        </div>
      </div>
    </div>
  );
}
