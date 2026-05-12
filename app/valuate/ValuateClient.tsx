"use client";

import { useState } from "react";
import Link from "next/link";

// ─── Types ───────────────────────────────────────────────────────────────────

interface FormData {
  industry: string;
  country: string;
  region: string;
  revenue: string;
  netProfit: string;
  yearsInOperation: string;
  revenueTrend: string;
  ownerDependency: number;
  customerConcentration: string;
  reasonForSelling: string;
  askingPrice: string;
}

interface ValuationResult {
  valuation_low: number;
  valuation_mid: number;
  valuation_high: number;
  primary_method: string;
  multiple_applied: number;
  comparable_range: { low: number; high: number };
  confidence: string;
  key_value_drivers: string[];
  key_risks: string[];
  summary: string;
  saved?: boolean;
  valuation_id?: string | null;
}

// ─── Constants ───────────────────────────────────────────────────────────────

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

const REVENUE_TRENDS = [
  "Growing 20%+",
  "Growing 10-20%",
  "Growing 0-10%",
  "Flat",
  "Declining",
];

const CUSTOMER_CONCENTRATIONS = [
  "Diversified — 100+ customers",
  "Moderate — 20-100 customers",
  "Concentrated — top 5 customers = 50%+ revenue",
];

const REASONS = [
  "Retirement",
  "Pursuing other ventures",
  "Health reasons",
  "Partnership dispute",
  "Lifestyle change",
  "Other",
];

const STEPS = ["Business Overview", "Financials", "Business Health", "Exit Intent"];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function fmtCurrency(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${Math.round(n / 1_000)}K`;
  return `$${n.toLocaleString()}`;
}

// ─── Shared UI primitives ─────────────────────────────────────────────────────

const inputCls =
  "w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-100 transition-colors";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-600 mb-2">{label}</label>
      {children}
    </div>
  );
}

function SelectInput({
  value,
  onChange,
  options,
  placeholder = "Select…",
}: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
  placeholder?: string;
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`${inputCls} appearance-none pr-10 cursor-pointer`}
      >
        <option value="">{placeholder}</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-xs">
        ▾
      </div>
    </div>
  );
}

function MoneyInput({
  value,
  onChange,
  placeholder = "0",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="relative">
      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
        $
      </span>
      <input
        type="number"
        min="0"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`${inputCls} pl-8`}
      />
    </div>
  );
}

// ─── Step progress ────────────────────────────────────────────────────────────

function StepProgress({ current }: { current: number }) {
  return (
    <div className="flex items-start gap-0 mb-10">
      {STEPS.map((label, i) => (
        <div key={label} className="flex items-center flex-1">
          <div className="flex flex-col items-center min-w-0">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0 transition-all ${
                i < current
                  ? "bg-blue-900 text-white"
                  : i === current
                  ? "bg-blue-900 text-white ring-4 ring-blue-900/20"
                  : "bg-white text-slate-400 border border-slate-300"
              }`}
            >
              {i < current ? "✓" : i + 1}
            </div>
            <span
              className={`text-xs mt-1.5 text-center hidden sm:block leading-tight ${
                i === current ? "text-blue-900 font-medium" : "text-slate-400"
              }`}
            >
              {label}
            </span>
          </div>
          {i < STEPS.length - 1 && (
            <div
              className={`flex-1 h-0.5 mx-2 mt-4 sm:mt-4 transition-colors ${
                i < current ? "bg-blue-900" : "bg-slate-200"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Loading view ─────────────────────────────────────────────────────────────

function LoadingView() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-32 text-center">
      <div className="w-20 h-20 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-4xl mx-auto mb-8 animate-pulse">
        🧠
      </div>
      <h2 className="text-2xl font-bold mb-3 text-slate-900">Analyzing your business…</h2>
      <p className="text-slate-500 max-w-sm mx-auto leading-relaxed">
        Our AI analyst is applying SDE multiple, EBITDA multiple, and DCF models
        to your data. This usually takes 15–20 seconds.
      </p>
      <div className="mt-10 flex justify-center gap-1.5">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-2.5 h-2.5 rounded-full bg-blue-900 animate-bounce"
            style={{ animationDelay: `${i * 0.18}s` }}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Results view ─────────────────────────────────────────────────────────────

function ResultsView({
  result,
  formData,
  email,
  setEmail,
}: {
  result: ValuationResult;
  formData: FormData;
  email: string;
  setEmail: (v: string) => void;
}) {
  const [submitted, setSubmitted] = useState(false);

  const midPct =
    ((result.valuation_mid - result.valuation_low) /
      (result.valuation_high - result.valuation_low)) *
    100;

  const confidenceColor =
    result.confidence === "High"
      ? "text-emerald-600"
      : result.confidence === "Medium"
      ? "text-amber-600"
      : "text-red-600";

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm px-4 py-1.5 rounded-full mb-6 font-medium">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          Valuation Complete
        </div>
        <h1 className="font-serif text-4xl font-bold mb-2 text-slate-900">Your Business Valuation</h1>
        <p className="text-slate-500">
          {formData.industry} · {formData.region}, {formData.country}
        </p>
      </div>

      {/* Valuation range card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-8 mb-6 shadow-sm">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-8">
          Estimated Value Range
        </p>

        {/* Three values */}
        <div className="grid grid-cols-3 gap-4 text-center mb-6">
          <div>
            <div className="text-xs text-slate-400 mb-1.5 uppercase tracking-wider">
              Conservative
            </div>
            <div className="text-2xl font-bold text-slate-500">
              {fmtCurrency(result.valuation_low)}
            </div>
          </div>
          <div className="border-x border-slate-200 px-4">
            <div className="text-xs text-blue-900 font-semibold mb-1.5 uppercase tracking-wider">
              Most Likely
            </div>
            <div className="text-4xl font-bold text-slate-900">
              {fmtCurrency(result.valuation_mid)}
            </div>
          </div>
          <div>
            <div className="text-xs text-slate-400 mb-1.5 uppercase tracking-wider">
              Optimistic
            </div>
            <div className="text-2xl font-bold text-slate-500">
              {fmtCurrency(result.valuation_high)}
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

        {/* Method metadata */}
        <div className="mt-8 pt-6 border-t border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
          <div>
            <div className="text-slate-400 mb-1">Primary Method</div>
            <div className="text-slate-900 font-medium">{result.primary_method}</div>
          </div>
          <div>
            <div className="text-slate-400 mb-1">Multiple Applied</div>
            <div className="text-slate-900 font-medium">{result.multiple_applied}x</div>
          </div>
          <div>
            <div className="text-slate-400 mb-1">Market Range</div>
            <div className="text-slate-900 font-medium">
              {result.comparable_range.low}–{result.comparable_range.high}x
            </div>
          </div>
          <div>
            <div className="text-slate-400 mb-1">Confidence</div>
            <div className={`font-semibold ${confidenceColor}`}>
              {result.confidence}
            </div>
          </div>
        </div>
      </div>

      {/* Drivers & Risks */}
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        {/* Value drivers */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-emerald-700 mb-5 uppercase tracking-wider">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-50 border border-emerald-200 text-xs">
              ✓
            </span>
            Key Value Drivers
          </h3>
          <ul className="space-y-3">
            {result.key_value_drivers.map((d, i) => (
              <li key={i} className="flex items-start gap-3 text-sm">
                <div className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-emerald-500" />
                <span className="text-slate-600 leading-relaxed">{d}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Key risks */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-red-600 mb-5 uppercase tracking-wider">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-50 border border-red-200 text-xs">
              !
            </span>
            Key Risks
          </h3>
          <ul className="space-y-3">
            {result.key_risks.map((r, i) => (
              <li key={i} className="flex items-start gap-3 text-sm">
                <div className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-red-500" />
                <span className="text-slate-600 leading-relaxed">{r}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Analyst summary */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 mb-6 shadow-sm">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4">
          Analyst Summary
        </p>
        <p className="text-slate-600 leading-relaxed">{result.summary}</p>
      </div>

      {/* Save banner */}
      {result.saved ? (
        <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 rounded-2xl px-6 py-4 mb-6">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-white text-xs flex-shrink-0">
            ✓
          </span>
          <p className="text-sm text-emerald-800 font-medium">
            Valuation saved to your account — view it anytime in your{" "}
            <Link href="/dashboard" className="underline">
              dashboard
            </Link>
            .
          </p>
        </div>
      ) : (
        <div className="flex items-center justify-between gap-4 bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 mb-6">
          <p className="text-sm text-slate-600">
            <span className="font-medium text-slate-900">Save this valuation</span> to your account and track your business value over time.
          </p>
          <Link
            href="/auth"
            className="flex-shrink-0 text-sm font-medium bg-blue-900 hover:bg-blue-800 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Sign in →
          </Link>
        </div>
      )}

      {/* Email capture */}
      <div className="bg-blue-900 rounded-2xl p-8 mb-6 text-white">
        <h3 className="text-xl font-bold mb-2">Download your full PDF report</h3>
        <p className="text-blue-200 text-sm mb-6 max-w-md leading-relaxed">
          Get a detailed 10-page valuation report with comparable market data, SDE/EBITDA
          breakdown, and buyer positioning recommendations.
        </p>
        {submitted ? (
          <div className="flex items-center gap-3 text-emerald-300 font-medium">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/20 border border-emerald-400/30 text-sm">
              ✓
            </span>
            Check your inbox — your report is on its way.
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (email) setSubmitted(true);
            }}
            className="flex gap-3"
          >
            <input
              type="email"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 bg-blue-800 border border-blue-700 rounded-xl px-4 py-3 text-white placeholder-blue-300 focus:outline-none focus:border-blue-400 transition-colors"
              required
            />
            <button
              type="submit"
              className="bg-white text-blue-900 hover:bg-blue-50 px-6 py-3 rounded-xl font-medium transition-colors whitespace-nowrap"
            >
              Send Report
            </button>
          </form>
        )}
      </div>

      {/* List your business CTA */}
      <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center shadow-sm">
        <h3 className="font-serif text-2xl font-bold text-slate-900 mb-2">
          Ready to meet qualified buyers?
        </h3>
        <p className="text-slate-500 text-sm mb-6 max-w-md mx-auto">
          List your business on SuccessionIQ and connect with vetted private equity firms,
          family offices, and strategic acquirers.
        </p>
        <Link
          href={`/create-listing?industry=${encodeURIComponent(formData.industry)}&country=${encodeURIComponent(formData.country)}&region=${encodeURIComponent(formData.region)}&annual_revenue=${encodeURIComponent(formData.revenue)}&annual_profit=${encodeURIComponent(formData.netProfit)}&years_operating=${encodeURIComponent(formData.yearsInOperation)}&valuation_low=${encodeURIComponent(result.valuation_low)}&valuation_mid=${encodeURIComponent(result.valuation_mid)}&valuation_high=${encodeURIComponent(result.valuation_high)}&key_value_drivers=${encodeURIComponent(JSON.stringify(result.key_value_drivers))}&key_risks=${encodeURIComponent(JSON.stringify(result.key_risks))}`}
          className="inline-block bg-blue-900 hover:bg-blue-800 text-white px-10 py-4 rounded-xl font-semibold transition-all shadow-md hover:-translate-y-0.5"
        >
          List your business for sale →
        </Link>
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function ValuateClient() {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<FormData>({
    industry: "",
    country: "",
    region: "",
    revenue: "",
    netProfit: "",
    yearsInOperation: "",
    revenueTrend: "",
    ownerDependency: 5,
    customerConcentration: "",
    reasonForSelling: "",
    askingPrice: "",
  });
  const [result, setResult] = useState<ValuationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState("");

  const update = (fields: Partial<FormData>) =>
    setFormData((prev) => ({ ...prev, ...fields }));

  const canProceed = () => {
    switch (step) {
      case 0:
        return !!(formData.industry && formData.country && formData.region);
      case 1:
        return !!(
          formData.revenue &&
          Number(formData.revenue) > 0 &&
          formData.netProfit !== "" &&
          formData.yearsInOperation &&
          Number(formData.yearsInOperation) > 0
        );
      case 2:
        return !!(formData.revenueTrend && formData.customerConcentration);
      case 3:
        return !!formData.reasonForSelling;
      default:
        return false;
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/valuate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          revenue: Number(formData.revenue),
          netProfit: Number(formData.netProfit),
          yearsInOperation: Number(formData.yearsInOperation),
          askingPrice: formData.askingPrice ? Number(formData.askingPrice) : null,
        }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResult(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong. Please try again."
      );
      setLoading(false);
    }
  };

  if (result)
    return (
      <ResultsView result={result} formData={formData} email={email} setEmail={setEmail} />
    );
  if (loading) return <LoadingView />;

  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      {/* Page header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 text-blue-800 text-sm px-4 py-1.5 rounded-full mb-5 font-medium">
          <span className="h-1.5 w-1.5 rounded-full bg-blue-700" />
          AI Valuation Engine
        </div>
        <h1 className="font-serif text-4xl font-bold mb-3 text-slate-900">Get your free business valuation</h1>
        <p className="text-slate-500 text-sm">
          4 quick steps · takes under 3 minutes · completely free
        </p>
      </div>

      {/* Progress */}
      <StepProgress current={step} />

      {/* Form card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
        <h2 className="text-base font-semibold text-slate-700 mb-6 pb-4 border-b border-slate-200">
          Step {step + 1} of {STEPS.length} — {STEPS[step]}
        </h2>

        {/* ── Step 0: Business Overview ── */}
        {step === 0 && (
          <div className="space-y-5">
            <Field label="Business Industry">
              <SelectInput
                value={formData.industry}
                onChange={(v) => update({ industry: v })}
                options={INDUSTRIES}
                placeholder="Select an industry…"
              />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Country">
                <input
                  type="text"
                  placeholder="e.g. United States"
                  value={formData.country}
                  onChange={(e) => update({ country: e.target.value })}
                  className={inputCls}
                />
              </Field>
              <Field label="Region / State">
                <input
                  type="text"
                  placeholder="e.g. California"
                  value={formData.region}
                  onChange={(e) => update({ region: e.target.value })}
                  className={inputCls}
                />
              </Field>
            </div>
          </div>
        )}

        {/* ── Step 1: Financials ── */}
        {step === 1 && (
          <div className="space-y-5">
            <Field label="Annual Revenue (USD)">
              <MoneyInput
                value={formData.revenue}
                onChange={(v) => update({ revenue: v })}
                placeholder="500000"
              />
            </Field>
            <Field label="Annual Net Profit (USD)">
              <MoneyInput
                value={formData.netProfit}
                onChange={(v) => update({ netProfit: v })}
                placeholder="120000"
              />
            </Field>
            <Field label="Years in Operation">
              <input
                type="number"
                min="1"
                placeholder="e.g. 8"
                value={formData.yearsInOperation}
                onChange={(e) => update({ yearsInOperation: e.target.value })}
                className={inputCls}
              />
            </Field>
          </div>
        )}

        {/* ── Step 2: Business Health ── */}
        {step === 2 && (
          <div className="space-y-6">
            <Field label="Revenue Trend (Last 3 Years)">
              <SelectInput
                value={formData.revenueTrend}
                onChange={(v) => update({ revenueTrend: v })}
                options={REVENUE_TRENDS}
                placeholder="Select trend…"
              />
            </Field>

            <Field label={`Owner Dependency — ${formData.ownerDependency}/10`}>
              <div className="space-y-3">
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={formData.ownerDependency}
                  onChange={(e) =>
                    update({ ownerDependency: parseInt(e.target.value) })
                  }
                  className="w-full accent-blue-900 cursor-pointer"
                />
                <div className="flex justify-between text-xs text-slate-400">
                  <span>1 — Business runs itself</span>
                  <span>10 — Owner does everything</span>
                </div>
              </div>
            </Field>

            <Field label="Customer Concentration">
              <SelectInput
                value={formData.customerConcentration}
                onChange={(v) => update({ customerConcentration: v })}
                options={CUSTOMER_CONCENTRATIONS}
                placeholder="Select concentration…"
              />
            </Field>
          </div>
        )}

        {/* ── Step 3: Exit Intent ── */}
        {step === 3 && (
          <div className="space-y-5">
            <Field label="Reason for Selling">
              <SelectInput
                value={formData.reasonForSelling}
                onChange={(v) => update({ reasonForSelling: v })}
                options={REASONS}
                placeholder="Select reason…"
              />
            </Field>

            <Field label="Asking Price (optional — leave blank if unknown)">
              <MoneyInput
                value={formData.askingPrice}
                onChange={(v) => update({ askingPrice: v })}
                placeholder="Leave blank if unknown"
              />
              <p className="text-xs text-slate-400 mt-2">
                If you have a number in mind, our AI will tell you whether it&apos;s
                in range for your market.
              </p>
            </Field>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex items-center gap-4 mt-6">
        {step > 0 && (
          <button
            onClick={() => setStep((s) => s - 1)}
            className="px-6 py-3 rounded-xl border border-slate-300 text-slate-500 hover:border-slate-400 hover:text-slate-900 transition-colors text-sm font-medium bg-white"
          >
            ← Back
          </button>
        )}
        <div className="flex-1" />
        {step < STEPS.length - 1 ? (
          <button
            onClick={() => setStep((s) => s + 1)}
            disabled={!canProceed()}
            className="bg-blue-900 hover:bg-blue-800 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white px-8 py-3 rounded-xl font-semibold transition-all text-sm"
          >
            Continue →
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={!canProceed()}
            className="bg-blue-900 hover:bg-blue-800 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white px-8 py-3 rounded-xl font-semibold transition-all text-sm"
          >
            Get My Valuation →
          </button>
        )}
      </div>

      {error && (
        <p className="text-red-600 text-sm mt-4 text-center bg-red-50 border border-red-200 rounded-lg px-4 py-3">
          {error}
        </p>
      )}
    </div>
  );
}
