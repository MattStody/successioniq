"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const INDUSTRIES = [
  "Retail",
  "Restaurant/Food",
  "Healthcare",
  "Professional Services",
  "Construction/Trades",
  "Manufacturing",
  "Technology",
  "Real Estate",
  "Other",
];

const COUNTRIES = ["Canada", "USA", "UK", "Australia", "Other"];

interface FormData {
  full_name: string;
  phone: string;
  experience_years: number;
  buyer_type: "individual" | "search_fund" | "private_equity" | "strategic";
  background_summary: string;
  capital_min: number;
  capital_max: number;
  preferred_industries: string[];
  preferred_countries: string[];
  acquisition_type: "full_acquisition" | "partial_stake" | "either";
  notif_new_matches: boolean;
  notif_price_changes: boolean;
  notif_weekly_digest: boolean;
}

function fmtCurrency(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${Math.round(n / 1_000)}K`;
  return `$${n}`;
}

export default function OnboardingClient({
  initialName,
}: {
  initialName: string;
  userEmail: string;
}) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState<FormData>({
    full_name: initialName,
    phone: "",
    experience_years: 0,
    buyer_type: "individual",
    background_summary: "",
    capital_min: 100000,
    capital_max: 1000000,
    preferred_industries: [],
    preferred_countries: [],
    acquisition_type: "either",
    notif_new_matches: true,
    notif_price_changes: true,
    notif_weekly_digest: true,
  });

  function update<K extends keyof FormData>(field: K, value: FormData[K]) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function toggleArray(
    field: "preferred_industries" | "preferred_countries",
    item: string
  ) {
    setForm((prev) => {
      const arr = prev[field] as string[];
      return {
        ...prev,
        [field]: arr.includes(item) ? arr.filter((x) => x !== item) : [...arr, item],
      };
    });
  }

  function canProceed() {
    if (step === 1) return form.full_name.trim().length > 0;
    if (step === 2)
      return (
        form.preferred_industries.length > 0 &&
        form.preferred_countries.length > 0 &&
        form.capital_max > form.capital_min
      );
    return true;
  }

  async function handleSubmit() {
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/buyer-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: form.full_name,
          phone: form.phone || null,
          experience_years: form.experience_years,
          buyer_type: form.buyer_type,
          background_summary: form.background_summary || null,
          capital_min: form.capital_min,
          capital_max: form.capital_max,
          preferred_industries: form.preferred_industries,
          preferred_countries: form.preferred_countries,
          acquisition_type: form.acquisition_type,
          notification_preferences: {
            new_matches: form.notif_new_matches,
            price_changes: form.notif_price_changes,
            weekly_digest: form.notif_weekly_digest,
          },
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Failed to save profile");
      }

      // Fire-and-forget initial match generation
      fetch("/api/match-listings", { method: "POST" }).catch(() => {});

      router.push("/buyer/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setSubmitting(false);
    }
  }

  const BUYER_TYPES = [
    { value: "individual", label: "Individual Operator", desc: "Buying to run personally" },
    { value: "search_fund", label: "Search Fund", desc: "Searching for acquisition target" },
    { value: "private_equity", label: "Private Equity", desc: "PE firm or fund" },
    { value: "strategic", label: "Strategic Acquirer", desc: "Existing business expanding" },
  ] as const;

  const ACQUISITION_TYPES = [
    { value: "full_acquisition", label: "Full Acquisition", desc: "100% ownership" },
    { value: "partial_stake", label: "Partial Stake", desc: "Minority or majority" },
    { value: "either", label: "Either", desc: "Open to both" },
  ] as const;

  return (
    <div className="min-h-screen bg-slate-50 py-16">
      <div className="max-w-2xl mx-auto px-6">
        <div className="text-center mb-10">
          <p className="text-sm text-blue-900 font-semibold uppercase tracking-widest mb-3">
            Buyer Onboarding
          </p>
          <h1 className="font-serif text-4xl font-bold text-slate-900 mb-3">
            Set up your buyer profile
          </h1>
          <p className="text-slate-500 text-lg">
            Tell us what you&apos;re looking for and we&apos;ll match you with the best
            opportunities.
          </p>
        </div>

        {/* Step progress */}
        <div className="flex items-center mb-10">
          {[
            { n: 1, label: "About You" },
            { n: 2, label: "Criteria" },
            { n: 3, label: "Notifications" },
          ].map(({ n, label }, idx) => (
            <div key={n} className="flex items-center flex-1">
              <div className="flex items-center gap-2.5 flex-shrink-0">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                    step > n
                      ? "bg-blue-900 text-white"
                      : step === n
                      ? "bg-blue-900 text-white"
                      : "bg-slate-200 text-slate-500"
                  }`}
                >
                  {step > n ? "✓" : n}
                </div>
                <span
                  className={`text-sm font-medium ${step >= n ? "text-slate-900" : "text-slate-400"}`}
                >
                  {label}
                </span>
              </div>
              {idx < 2 && (
                <div
                  className={`flex-1 h-px mx-4 ${step > n ? "bg-blue-900" : "bg-slate-200"}`}
                />
              )}
            </div>
          ))}
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
          {/* ── STEP 1: About You ── */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-slate-900 mb-1">About You</h2>
                <p className="text-sm text-slate-400">
                  Help sellers understand who you are as a buyer.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Full name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={form.full_name}
                  onChange={(e) => update("full_name", e.target.value)}
                  placeholder="Your full name"
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900 transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Phone number{" "}
                  <span className="text-slate-400 font-normal">(optional)</span>
                </label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => update("phone", e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900 transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Years of business experience <span className="text-red-400">*</span>
                </label>
                <input
                  type="number"
                  min={0}
                  max={60}
                  value={form.experience_years}
                  onChange={(e) =>
                    update("experience_years", Math.max(0, parseInt(e.target.value) || 0))
                  }
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900 transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-3">
                  Buyer type <span className="text-red-400">*</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {BUYER_TYPES.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => update("buyer_type", opt.value)}
                      className={`text-left p-4 rounded-xl border transition-all ${
                        form.buyer_type === opt.value
                          ? "border-blue-900 bg-blue-50"
                          : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                      }`}
                    >
                      <div className="text-sm font-medium text-slate-900">{opt.label}</div>
                      <div className="text-xs text-slate-400 mt-0.5">{opt.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Background{" "}
                  <span className="text-slate-400 font-normal">(optional)</span>
                </label>
                <textarea
                  value={form.background_summary}
                  onChange={(e) => update("background_summary", e.target.value)}
                  placeholder="Tell sellers about yourself and your acquisition experience..."
                  rows={4}
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900 transition-colors resize-none"
                />
              </div>
            </div>
          )}

          {/* ── STEP 2: Acquisition Criteria ── */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-slate-900 mb-1">
                  Acquisition Criteria
                </h2>
                <p className="text-sm text-slate-400">
                  Define your ideal deal so we can match you with the right businesses.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-3">
                  Capital available <span className="text-red-400">*</span>
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs text-slate-400 mb-1.5">Minimum deal size</div>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
                        $
                      </span>
                      <input
                        type="number"
                        min={0}
                        value={form.capital_min}
                        onChange={(e) =>
                          update("capital_min", Math.max(0, parseInt(e.target.value) || 0))
                        }
                        className="w-full border border-slate-200 rounded-xl pl-7 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900 transition-colors"
                      />
                    </div>
                    <div className="text-xs text-slate-400 mt-1">
                      {fmtCurrency(form.capital_min)}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-400 mb-1.5">Maximum deal size</div>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
                        $
                      </span>
                      <input
                        type="number"
                        min={0}
                        value={form.capital_max}
                        onChange={(e) =>
                          update("capital_max", Math.max(0, parseInt(e.target.value) || 0))
                        }
                        className="w-full border border-slate-200 rounded-xl pl-7 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900 transition-colors"
                      />
                    </div>
                    <div className="text-xs text-slate-400 mt-1">
                      {fmtCurrency(form.capital_max)}
                    </div>
                  </div>
                </div>
                {form.capital_max > 0 && form.capital_max <= form.capital_min && (
                  <p className="text-xs text-red-500 mt-2">
                    Maximum must be greater than minimum.
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-3">
                  Preferred industries <span className="text-red-400">*</span>{" "}
                  <span className="text-slate-400 font-normal">(select all that apply)</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {INDUSTRIES.map((ind) => (
                    <label
                      key={ind}
                      className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                        form.preferred_industries.includes(ind)
                          ? "border-blue-900 bg-blue-50"
                          : "border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={form.preferred_industries.includes(ind)}
                        onChange={() => toggleArray("preferred_industries", ind)}
                        className="rounded accent-blue-900"
                      />
                      <span className="text-sm text-slate-700">{ind}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-3">
                  Preferred countries <span className="text-red-400">*</span>{" "}
                  <span className="text-slate-400 font-normal">(select all that apply)</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {COUNTRIES.map((country) => (
                    <label
                      key={country}
                      className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                        form.preferred_countries.includes(country)
                          ? "border-blue-900 bg-blue-50"
                          : "border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={form.preferred_countries.includes(country)}
                        onChange={() => toggleArray("preferred_countries", country)}
                        className="rounded accent-blue-900"
                      />
                      <span className="text-sm text-slate-700">{country}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-3">
                  Acquisition type <span className="text-red-400">*</span>
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {ACQUISITION_TYPES.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => update("acquisition_type", opt.value)}
                      className={`text-left p-4 rounded-xl border transition-all ${
                        form.acquisition_type === opt.value
                          ? "border-blue-900 bg-blue-50"
                          : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                      }`}
                    >
                      <div className="text-sm font-medium text-slate-900">{opt.label}</div>
                      <div className="text-xs text-slate-400 mt-0.5">{opt.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── STEP 3: Notifications + Preview ── */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-slate-900 mb-1">
                  Notifications &amp; Preview
                </h2>
                <p className="text-sm text-slate-400">
                  Choose how you want to hear about new opportunities.
                </p>
              </div>

              <div className="space-y-3">
                {(
                  [
                    {
                      key: "notif_new_matches" as const,
                      label: "New matching listings",
                      desc: "Email me when businesses matching my criteria are posted",
                    },
                    {
                      key: "notif_price_changes" as const,
                      label: "Price changes",
                      desc: "Email me when asking prices change on listings I've saved",
                    },
                    {
                      key: "notif_weekly_digest" as const,
                      label: "Weekly digest",
                      desc: "Send me a weekly summary of top matching businesses",
                    },
                  ] as const
                ).map(({ key, label, desc }) => (
                  <div
                    key={key}
                    className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100"
                  >
                    <button
                      type="button"
                      onClick={() => update(key, !form[key])}
                      className={`relative flex-shrink-0 mt-0.5 w-11 h-6 rounded-full transition-colors ${
                        form[key] ? "bg-blue-900" : "bg-slate-300"
                      }`}
                      aria-label={`Toggle ${label}`}
                    >
                      <span
                        className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-150 ${
                          form[key] ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </button>
                    <div>
                      <div className="text-sm font-medium text-slate-900">{label}</div>
                      <div className="text-xs text-slate-500 mt-0.5">{desc}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Criteria preview */}
              <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5">
                <p className="text-xs font-semibold uppercase tracking-widest text-blue-900 mb-4">
                  Your Match Criteria Preview
                </p>
                <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-sm">
                  <div>
                    <div className="text-xs text-slate-500 mb-1">Capital range</div>
                    <div className="font-semibold text-slate-900">
                      {fmtCurrency(form.capital_min)} – {fmtCurrency(form.capital_max)}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 mb-1">Buyer type</div>
                    <div className="font-semibold text-slate-900 capitalize">
                      {form.buyer_type.replace(/_/g, " ")}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 mb-1">Industries</div>
                    <div className="font-semibold text-slate-900">
                      {form.preferred_industries.length > 0
                        ? form.preferred_industries.join(", ")
                        : "—"}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 mb-1">Countries</div>
                    <div className="font-semibold text-slate-900">
                      {form.preferred_countries.length > 0
                        ? form.preferred_countries.join(", ")
                        : "—"}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 mb-1">Acquisition type</div>
                    <div className="font-semibold text-slate-900 capitalize">
                      {form.acquisition_type.replace(/_/g, " ")}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 mb-1">Experience</div>
                    <div className="font-semibold text-slate-900">
                      {form.experience_years} year{form.experience_years !== 1 ? "s" : ""}
                    </div>
                  </div>
                </div>
              </div>

              {error && (
                <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                  {error}
                </p>
              )}
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-100">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep((s) => s - 1)}
                className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
              >
                ← Back
              </button>
            ) : (
              <div />
            )}

            {step < 3 ? (
              <button
                type="button"
                onClick={() => setStep((s) => s + 1)}
                disabled={!canProceed()}
                className="bg-blue-900 hover:bg-blue-800 disabled:bg-slate-200 disabled:text-slate-400 text-white px-6 py-3 rounded-xl text-sm font-semibold transition-all"
              >
                Continue →
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting}
                className="bg-blue-900 hover:bg-blue-800 disabled:bg-slate-300 disabled:cursor-not-allowed text-white px-8 py-3 rounded-xl text-sm font-semibold transition-all"
              >
                {submitting ? "Setting up your profile…" : "Find my matches →"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
