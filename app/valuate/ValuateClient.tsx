"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { instantValuationRange } from "@/lib/financials";
import { PENDING_LISTING_KEY, GATE_EMAIL_KEY } from "@/lib/post-auth";

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
  comparable_range?: { low: number; high: number };
  confidence: string;
  key_value_drivers: string[];
  key_risks: string[];
  summary: string;
  saved?: boolean;
  valuation_id?: string | null;
  share_token?: string | null;
}

type Phase = "form" | "gating" | "waiting" | "result";

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

const CA_PROVINCES = [
  "Alberta", "British Columbia", "Manitoba", "New Brunswick",
  "Newfoundland and Labrador", "Northwest Territories", "Nova Scotia", "Nunavut",
  "Ontario", "Prince Edward Island", "Quebec", "Saskatchewan", "Yukon",
];

const US_STATES = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado",
  "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois",
  "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland",
  "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana",
  "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico", "New York",
  "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania",
  "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah",
  "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming",
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

// Fast country + region picker: a Canada/US/Other toggle and a province/state
// dropdown (free text only for "Other") — far quicker than typing for Bob.
function CountryRegionFields({
  country,
  region,
  update,
}: {
  country: string;
  region: string;
  update: (fields: Partial<FormData>) => void;
}) {
  const isCanada = country === "Canada";
  const isUS = country === "United States";
  const isKnown = isCanada || isUS;
  const regionOptions = isCanada ? CA_PROVINCES : isUS ? US_STATES : null;

  const toggleCls = (active: boolean) =>
    `rounded-xl border px-2 py-2.5 text-sm font-medium transition-all ${
      active
        ? "bg-blue-900 text-white border-blue-900 shadow-sm"
        : "bg-white text-slate-600 border-slate-300 hover:border-slate-400 hover:text-slate-900"
    }`;

  return (
    <div className="space-y-5">
      <Field label="Country">
        <div className="grid grid-cols-3 gap-2">
          <button type="button" onClick={() => update({ country: "Canada", region: "" })} className={toggleCls(isCanada)}>
            🇨🇦 Canada
          </button>
          <button type="button" onClick={() => update({ country: "United States", region: "" })} className={toggleCls(isUS)}>
            🇺🇸 U.S.
          </button>
          <button type="button" onClick={() => update({ country: "", region: "" })} className={toggleCls(!isKnown)}>
            Other
          </button>
        </div>
        {!isKnown && (
          <input
            type="text"
            placeholder="Enter your country"
            value={country}
            onChange={(e) => update({ country: e.target.value })}
            className={`${inputCls} mt-2`}
          />
        )}
      </Field>
      <Field label={isUS ? "State" : "Province / Region"}>
        {regionOptions ? (
          <SelectInput
            value={region}
            onChange={(v) => update({ region: v })}
            options={regionOptions}
            placeholder={isUS ? "Select a state…" : "Select a province…"}
          />
        ) : (
          <input
            type="text"
            placeholder="e.g. Ontario"
            value={region}
            onChange={(e) => update({ region: e.target.value })}
            className={inputCls}
          />
        )}
      </Field>
    </div>
  );
}

// Tap-to-select industry tiles — one tap instead of open/scroll/select.
function IndustryChips({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
      {INDUSTRIES.map((opt) => (
        <button
          type="button"
          key={opt}
          onClick={() => onChange(opt)}
          className={`rounded-xl border px-3 py-2.5 text-sm font-medium transition-all ${
            value === opt
              ? "bg-blue-900 text-white border-blue-900 shadow-sm"
              : "bg-white text-slate-600 border-slate-300 hover:border-slate-400 hover:text-slate-900"
          }`}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

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

// ─── Email gate view ──────────────────────────────────────────────────────────

function EmailGateView({
  industry,
  isAiReady,
  onSubmit,
}: {
  industry: string;
  isAiReady: boolean;
  onSubmit: (email: string) => void;
}) {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || submitting) return;
    setSubmitting(true);
    setError("");
    try {
      await fetch("/api/capture-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "valuation_gate", industry }),
      });
      if (typeof window !== "undefined") {
        localStorage.setItem("siq_email_captured", "1");
        localStorage.setItem(GATE_EMAIL_KEY, email);
      }
      onSubmit(email);
    } catch {
      setError("Something went wrong. Please try again.");
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-md mx-auto px-6 py-24 text-center">
      {/* Status icon */}
      <div className="flex justify-center mb-8">
        {isAiReady ? (
          <div className="w-20 h-20 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-3xl">
            ✓
          </div>
        ) : (
          <div className="w-20 h-20 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-4xl animate-pulse">
            🧠
          </div>
        )}
      </div>

      {/* Status badge */}
      <div
        className={`inline-flex items-center gap-2 text-sm px-4 py-1.5 rounded-full mb-6 font-medium ${
          isAiReady
            ? "bg-emerald-50 border border-emerald-200 text-emerald-700"
            : "bg-blue-50 border border-blue-200 text-blue-700"
        }`}
      >
        <span
          className={`h-1.5 w-1.5 rounded-full ${
            isAiReady ? "bg-emerald-500" : "bg-blue-500 animate-pulse"
          }`}
        />
        {isAiReady ? "Valuation complete" : "Analysing your business…"}
      </div>

      <h2 className="font-serif text-3xl font-bold text-slate-900 mb-3">
        Where should we send your results?
      </h2>
      <p className="text-slate-500 text-sm mb-8 leading-relaxed">
        Enter your email to reveal your {industry} valuation and receive a free copy of
        your report.
      </p>

      <form onSubmit={handleSubmit} className="space-y-3 text-left">
        <input
          type="email"
          placeholder="you@company.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-100 transition-colors text-base"
          required
          autoFocus
        />
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button
          type="submit"
          disabled={submitting || !email}
          className="w-full bg-blue-900 hover:bg-blue-800 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white py-3.5 rounded-xl font-semibold transition-all text-base"
        >
          {submitting
            ? "One moment…"
            : isAiReady
            ? "Show My Valuation →"
            : "Continue to My Results →"}
        </button>
      </form>

      <p className="text-xs text-slate-400 mt-4">
        No spam, ever. Unsubscribe any time.
      </p>
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

function ListYourBusinessCTA({
  isLoggedIn,
  listingHref,
  tone = "light",
}: {
  isLoggedIn: boolean;
  listingHref: string;
  tone?: "light" | "onDark";
}) {
  const router = useRouter();
  const base =
    "inline-block px-10 py-4 rounded-xl text-lg font-semibold transition-all shadow-md hover:-translate-y-0.5";
  const cls =
    tone === "onDark"
      ? "bg-white text-blue-900 hover:bg-blue-50"
      : "bg-blue-900 text-white hover:bg-blue-800";
  const label = isLoggedIn
    ? "List your business for sale →"
    : "Create your free account to list →";

  if (isLoggedIn) {
    return (
      <Link href={listingHref} className={`${base} ${cls}`}>
        {label}
      </Link>
    );
  }
  return (
    <button
      type="button"
      onClick={() => {
        if (typeof window !== "undefined") {
          localStorage.setItem(PENDING_LISTING_KEY, listingHref);
        }
        router.push("/auth/signup");
      }}
      className={`${base} ${cls}`}
    >
      {label}
    </button>
  );
}

function ResultsView({
  result,
  formData,
  isLoggedIn,
}: {
  result: ValuationResult;
  formData: FormData;
  isLoggedIn: boolean;
}) {
  const listingHref = `/create-listing?industry=${encodeURIComponent(formData.industry)}&country=${encodeURIComponent(formData.country)}&region=${encodeURIComponent(formData.region)}&annual_revenue=${encodeURIComponent(formData.revenue)}&annual_profit=${encodeURIComponent(formData.netProfit)}&years_operating=${encodeURIComponent(formData.yearsInOperation)}&valuation_low=${encodeURIComponent(result.valuation_low)}&valuation_mid=${encodeURIComponent(result.valuation_mid)}&valuation_high=${encodeURIComponent(result.valuation_high)}&primary_method=${encodeURIComponent(result.primary_method)}&multiple_applied=${encodeURIComponent(String(result.multiple_applied))}&key_value_drivers=${encodeURIComponent(JSON.stringify(result.key_value_drivers))}&key_risks=${encodeURIComponent(JSON.stringify(result.key_risks))}`;
  const valuationSpan = result.valuation_high - result.valuation_low;
  const midPct =
    valuationSpan > 0
      ? ((result.valuation_mid - result.valuation_low) / valuationSpan) * 100
      : 50;

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
          Estimated Value Range · CAD
        </p>

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
          {result.comparable_range && (
            <div>
              <div className="text-slate-400 mb-1">Market Range</div>
              <div className="text-slate-900 font-medium">
                {result.comparable_range.low}–{result.comparable_range.high}x
              </div>
            </div>
          )}
          <div>
            <div className="text-slate-400 mb-1">Confidence</div>
            <div className={`font-semibold ${confidenceColor}`}>
              {result.confidence}
            </div>
          </div>
        </div>
      </div>

      {/* Prominent list CTA — placed at the moment of peak interest, right
          under the number, so it isn't buried below the analysis. */}
      <div className="bg-blue-900 rounded-2xl p-8 mb-6 shadow-md text-center">
        <h2 className="font-serif text-2xl md:text-3xl font-bold text-white mb-2">
          Ready to find the right buyer?
        </h2>
        <p className="text-blue-200 text-sm mb-6 max-w-md mx-auto leading-relaxed">
          Turn this valuation into a confidential listing in one click. We&apos;ll write
          the description for you and put it in front of qualified buyers.
        </p>
        <ListYourBusinessCTA isLoggedIn={isLoggedIn} listingHref={listingHref} tone="onDark" />
        {!isLoggedIn && (
          <p className="mt-3 text-xs text-blue-300">
            Free to create. Your valuation is saved and ready to publish.
          </p>
        )}
      </div>

      {/* Drivers & Risks */}
      <div className="grid md:grid-cols-2 gap-6 mb-6">
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

      {/* List your business CTA */}
      <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center shadow-sm">
        <h3 className="font-serif text-2xl font-bold text-slate-900 mb-2">
          Ready to meet qualified buyers?
        </h3>
        <p className="text-slate-500 text-sm mb-6 max-w-md mx-auto">
          List your business on SuccessionIQ and connect with vetted private equity firms,
          family offices, and strategic acquirers.
        </p>
        <ListYourBusinessCTA isLoggedIn={isLoggedIn} listingHref={listingHref} tone="light" />
        {!isLoggedIn && (
          <p className="mt-3 text-xs text-slate-400">
            Free to create. Your valuation is saved and ready to publish.
          </p>
        )}
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function ValuateClient({
  isLoggedIn,
  initialData,
  editMode,
  editValuationId,
  quickMode = false,
}: {
  isLoggedIn: boolean;
  initialData?: Partial<FormData>;
  editMode?: boolean;
  editValuationId?: string;
  quickMode?: boolean;
}) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<FormData>({
    industry: "",
    country: "Canada",
    region: "",
    revenue: "",
    netProfit: "",
    yearsInOperation: "",
    revenueTrend: "",
    ownerDependency: 5,
    customerConcentration: "",
    reasonForSelling: "",
    askingPrice: "",
    ...initialData,
  });
  const [phase, setPhase] = useState<Phase>("form");
  const [result, setResult] = useState<ValuationResult | null>(null);
  const [pendingResult, setPendingResult] = useState<ValuationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // When AI finishes while user is on the waiting screen (after gate), show results
  useEffect(() => {
    if (phase === "waiting" && pendingResult) {
      setResult(pendingResult);
      setPhase("result");
    }
  }, [phase, pendingResult]);

  const update = (fields: Partial<FormData>) =>
    setFormData((prev) => ({ ...prev, ...fields }));

  // In quick mode the funnel is a single condensed step — industry and revenue
  // arrive from the homepage hero, so we only validate the remaining inputs.
  const canSubmitQuick = !!(
    formData.industry &&
    formData.revenue &&
    Number(formData.revenue) > 0 &&
    formData.netProfit !== "" &&
    formData.yearsInOperation &&
    Number(formData.yearsInOperation) > 0 &&
    formData.country &&
    formData.region
  );

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

  const runValuation = () => {
    // Build the payload explicitly so optional inputs left blank in quick mode
    // are omitted entirely (an empty string would fail the API's enum checks).
    const payload: Record<string, unknown> = {
      industry: formData.industry,
      country: formData.country,
      region: formData.region,
      revenue: Number(formData.revenue),
      yearsInOperation: Number(formData.yearsInOperation),
      ownerDependency: formData.ownerDependency,
      askingPrice: formData.askingPrice ? Number(formData.askingPrice) : null,
    };
    if (formData.netProfit !== "") payload.netProfit = Number(formData.netProfit);
    if (formData.revenueTrend) payload.revenueTrend = formData.revenueTrend;
    if (formData.customerConcentration)
      payload.customerConcentration = formData.customerConcentration;
    if (formData.reasonForSelling) payload.reasonForSelling = formData.reasonForSelling;
    if (editMode && editValuationId) payload.updateId = editValuationId;

    return fetch("/api/valuate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (data.error) throw new Error(data.error);
        return data as ValuationResult;
      });
  };

  const handleSubmit = () => {
    setError(null);
    const skipGate =
      editMode ||
      isLoggedIn ||
      (typeof window !== "undefined" && localStorage.getItem("siq_email_captured") === "1");

    if (skipGate) {
      setPhase("waiting");
      runValuation()
        .then((data) => {
          if (editMode && data.share_token) {
            router.push(`/valuation/${data.share_token}`);
          } else {
            setResult(data);
            setPhase("result");
          }
        })
        .catch((err) => {
          setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
          setPhase("form");
        });
    } else {
      setPhase("gating");
      runValuation()
        .then((data) => setPendingResult(data))
        .catch((err) => {
          setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
          setPhase("form");
        });
    }
  };

  const handleGateSubmit = () => {
    if (pendingResult) {
      setResult(pendingResult);
      setPhase("result");
    } else {
      // AI still running — show brief loading screen until it resolves
      setPhase("waiting");
    }
  };

  if (phase === "result" && result) {
    return <ResultsView result={result} formData={formData} isLoggedIn={isLoggedIn} />;
  }

  if (phase === "waiting") {
    return <LoadingView />;
  }

  if (phase === "gating") {
    return (
      <EmailGateView
        industry={formData.industry}
        isAiReady={!!pendingResult}
        onSubmit={handleGateSubmit}
      />
    );
  }

  // ── Quick form (step 3 of the homepage funnel) ──
  if (quickMode) {
    const quickRange = instantValuationRange(
      Number(formData.revenue),
      formData.industry
    );
    return (
      <div className="max-w-xl mx-auto px-6 py-16">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 text-blue-800 text-sm px-4 py-1.5 rounded-full mb-5 font-medium">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-700" />
            Almost there
          </div>
          <h1 className="font-serif text-4xl font-bold mb-3 text-slate-900">
            Unlock your full valuation
          </h1>
          <p className="text-slate-500 text-sm">
            Three quick details and our AI gives you an exact, defensible figure.
          </p>
        </div>

        {quickRange && (
          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 mb-6 text-center">
            <div className="text-xs text-blue-700 uppercase tracking-widest mb-1">
              Your instant range
            </div>
            <div className="text-2xl font-bold text-slate-900">
              {fmtCurrency(quickRange.low)} – {fmtCurrency(quickRange.high)}
            </div>
            <div className="text-xs text-slate-500 mt-1">
              {formData.industry} · {fmtCurrency(Number(formData.revenue))} revenue
            </div>
          </div>
        )}

        <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm space-y-5">
          <Field label="Annual Net Profit (CAD)">
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
          <CountryRegionFields
            country={formData.country}
            region={formData.region}
            update={update}
          />
          <p className="text-xs text-slate-400">All figures in Canadian dollars (CAD).</p>
        </div>

        <button
          onClick={handleSubmit}
          disabled={!canSubmitQuick}
          className="w-full mt-6 bg-blue-900 hover:bg-blue-800 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white px-8 py-3.5 rounded-xl font-semibold transition-all"
        >
          Reveal my valuation →
        </button>

        {error && (
          <p className="text-red-600 text-sm mt-4 text-center bg-red-50 border border-red-200 rounded-lg px-4 py-3">
            {error}
          </p>
        )}

        <p className="text-center text-xs text-slate-400 mt-6">
          Want a more thorough analysis?{" "}
          <Link href="/valuate" className="text-blue-700 hover:underline">
            Use the detailed valuation →
          </Link>
        </p>
      </div>
    );
  }

  // ── Form ──
  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      {/* Page header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 text-blue-800 text-sm px-4 py-1.5 rounded-full mb-5 font-medium">
          <span className="h-1.5 w-1.5 rounded-full bg-blue-700" />
          AI Valuation Engine
        </div>
        <h1 className="font-serif text-4xl font-bold mb-3 text-slate-900">
          {editMode ? "Refine your valuation" : "Get your free business valuation"}
        </h1>
        <p className="text-slate-500 text-sm">
          {editMode ? "Update your inputs below and recalculate" : "4 quick steps · takes under 3 minutes · completely free"}
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
              <IndustryChips
                value={formData.industry}
                onChange={(v) => update({ industry: v })}
              />
            </Field>
            <CountryRegionFields
              country={formData.country}
              region={formData.region}
              update={update}
            />
          </div>
        )}

        {/* ── Step 1: Financials ── */}
        {step === 1 && (
          <div className="space-y-5">
            <Field label="Annual Revenue (CAD)">
              <MoneyInput
                value={formData.revenue}
                onChange={(v) => update({ revenue: v })}
                placeholder="500000"
              />
            </Field>
            <Field label="Annual Net Profit (CAD)">
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
            <p className="text-xs text-slate-400">All figures in Canadian dollars (CAD).</p>
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
            {editMode ? "Recalculate →" : "Get My Valuation →"}
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
