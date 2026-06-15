"use client";

import { useState } from "react";
import Link from "next/link";
import { INDUSTRIES, instantValuationRange, fmtMoney } from "@/lib/financials";

const inputCls =
  "w-full bg-white border border-slate-300 rounded-xl px-4 py-3.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-100 transition-colors text-base";

/**
 * Steps 1–2 of the funnel, inline on the homepage: enter revenue + industry,
 * get an instant ballpark value range before any signup wall. The "unlock"
 * CTA carries what they entered into the condensed valuation flow (step 3).
 */
export default function HeroFunnel() {
  const [revenue, setRevenue] = useState("");
  const [industry, setIndustry] = useState("");
  const [revealed, setRevealed] = useState(false);

  const revenueNum = Number(revenue);
  const canReveal = revenueNum > 0 && !!industry;
  const range = revealed ? instantValuationRange(revenueNum, industry) : null;

  const unlockHref = `/valuate?quick=1&revenue=${encodeURIComponent(
    revenue
  )}&industry=${encodeURIComponent(industry)}`;

  return (
    <div className="max-w-xl mx-auto">
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-lg text-left">
        {!range ? (
          <>
            <h2 className="text-lg font-semibold text-slate-900 mb-1">
              What&apos;s your annual revenue?
            </h2>
            <p className="text-sm text-slate-500 mb-6">
              Get an instant value range — no account needed yet.
            </p>

            <div className="space-y-4">
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  $
                </span>
                <input
                  type="number"
                  min="0"
                  inputMode="numeric"
                  placeholder="500,000"
                  value={revenue}
                  onChange={(e) => setRevenue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && canReveal) setRevealed(true);
                  }}
                  className={`${inputCls} pl-8`}
                  autoFocus
                />
              </div>

              <div className="relative">
                <select
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  className={`${inputCls} appearance-none pr-10 cursor-pointer ${
                    industry ? "text-slate-900" : "text-slate-400"
                  }`}
                >
                  <option value="">Select your industry…</option>
                  {INDUSTRIES.map((o) => (
                    <option key={o} value={o} className="text-slate-900">
                      {o}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-xs">
                  ▾
                </div>
              </div>

              <button
                onClick={() => setRevealed(true)}
                disabled={!canReveal}
                className="w-full bg-blue-900 hover:bg-blue-800 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white py-3.5 rounded-xl text-base font-semibold transition-all shadow-md hover:shadow-lg"
              >
                See my valuation range →
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs px-3 py-1 rounded-full mb-4 font-medium">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Instant estimate
            </div>
            <p className="text-sm text-slate-500 mb-2">
              A {industry.toLowerCase()} business at {fmtMoney(revenueNum)} revenue is
              typically worth
            </p>
            <div className="text-4xl sm:text-5xl font-bold text-slate-900 mb-2 tracking-tight">
              {fmtMoney(range.low)} – {fmtMoney(range.high)}
            </div>
            <p className="text-xs text-slate-400 mb-6">
              Based on revenue multiples for your industry. Add a few details to reveal
              your exact, AI-backed figure.
            </p>

            <Link
              href={unlockHref}
              className="block w-full text-center bg-blue-900 hover:bg-blue-800 text-white py-3.5 rounded-xl text-base font-semibold transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
            >
              Unlock your full valuation →
            </Link>
            <button
              onClick={() => setRevealed(false)}
              className="w-full text-center text-slate-400 hover:text-slate-600 text-sm mt-3 transition-colors"
            >
              ← Change my numbers
            </button>
          </>
        )}
      </div>

      <div className="mt-5 text-center">
        <Link
          href="/listings"
          className="text-slate-600 hover:text-slate-900 text-sm font-medium transition-colors"
        >
          Just browsing? See businesses for sale →
        </Link>
      </div>
    </div>
  );
}
