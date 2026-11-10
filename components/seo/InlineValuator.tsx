"use client";

import { useState } from "react";
import Link from "next/link";
import { fmtMoney } from "@/lib/financials";

/**
 * Interactive, industry-specific estimator embedded on SEO pages. The visitor
 * types their revenue and immediately sees their range for this business type;
 * the CTA carries the revenue + industry into the full valuation funnel, so the
 * page converts on-the-spot instead of just linking away.
 */
const PRESETS = [
  { label: "$500K", value: 500_000 },
  { label: "$1M", value: 1_000_000 },
  { label: "$2.5M", value: 2_500_000 },
  { label: "$5M", value: 5_000_000 },
];

export default function InlineValuator({
  industryName,
  heading,
  category,
  low,
  high,
  defaultRevenue,
}: {
  industryName: string;
  /** Overrides the default "Estimate your {industry} business" eyebrow. */
  heading?: string;
  category: string;
  low: number;
  high: number;
  defaultRevenue: number;
}) {
  const [revenue, setRevenue] = useState(defaultRevenue);
  const hasRevenue = revenue > 0;
  const params = new URLSearchParams();
  if (category) params.set("industry", category);
  if (hasRevenue) params.set("revenue", String(revenue));
  const query = params.toString();
  const href = query ? `/valuate?${query}` : "/valuate";

  return (
    <div
      id="estimate"
      className="scroll-mt-24 overflow-hidden rounded-3xl border border-[#DCE3F2] bg-white shadow-[0_24px_60px_-32px_rgba(14,19,48,0.35)]"
    >
      <div className="border-b border-[#E3E8F3] bg-[#F4F6FC] px-6 py-5 sm:px-8">
        <p className="text-sm font-bold uppercase tracking-widest text-[#4F6BFF]">
          {heading ?? `Estimate your ${industryName.toLowerCase()} business`}
        </p>
        <p className="mt-1 text-[#525C7A]">
          Enter last year&apos;s revenue to see your range right away.
        </p>
      </div>

      <div className="flex flex-col gap-5 p-6 sm:p-8">
        <div className="flex flex-col gap-2.5">
          <label htmlFor="seo-revenue" className="text-sm font-semibold text-[#0E1330]">
            Annual revenue
          </label>
          <div className="flex items-center rounded-xl border-2 border-[#C9D2E8] px-4 focus-within:border-[#4F6BFF]">
            <span aria-hidden="true" className="text-[22px] font-semibold text-[#525C7A]">$</span>
            <input
              id="seo-revenue"
              inputMode="numeric"
              autoComplete="off"
              placeholder="1,000,000"
              value={hasRevenue ? revenue.toLocaleString("en-US") : ""}
              onChange={(e) => {
                const digits = e.target.value.replace(/[^0-9]/g, "");
                setRevenue(digits ? Math.min(parseInt(digits, 10), 999_999_999) : 0);
              }}
              className="min-w-0 flex-1 bg-transparent px-2 py-3 text-[22px] font-semibold text-[#0E1330] outline-none"
            />
          </div>
          <div role="group" aria-label="Quick picks" className="flex flex-wrap gap-2">
            {PRESETS.map((p) => {
              const on = revenue === p.value;
              return (
                <button
                  key={p.value}
                  type="button"
                  aria-pressed={on}
                  onClick={() => setRevenue(p.value)}
                  className={`min-h-10 rounded-full border px-3.5 py-2 text-sm font-semibold transition-colors ${
                    on
                      ? "border-[#0E1330] bg-[#0E1330] text-white"
                      : "border-[#C9D2E8] bg-white text-[#0E1330] hover:border-[#0E1330]"
                  }`}
                >
                  {p.label}
                </button>
              );
            })}
          </div>
        </div>

        <div aria-live="polite" className="rounded-2xl bg-[#F4F6FC] px-5 py-5">
          {hasRevenue ? (
            <div className="flex flex-col gap-1">
              <span className="text-sm font-semibold text-[#525C7A]">Estimated value range</span>
              <span className="text-[30px] font-extrabold leading-tight tracking-[-0.02em] text-[#0E1330] sm:text-[36px]">
                {fmtMoney(revenue * low)} – {fmtMoney(revenue * high)}
              </span>
              <span className="text-sm text-[#525C7A]">
                Based on {low}–{high}× revenue. Add your profit and a few details to sharpen it.
              </span>
            </div>
          ) : (
            <p className="text-[#525C7A]">Enter your revenue and your range appears here.</p>
          )}
        </div>

        <Link
          href={href}
          className="flex min-h-14 items-center justify-center rounded-xl bg-[#4F6BFF] px-6 py-4 text-[18px] font-bold text-white transition-colors hover:bg-[#3f57e6]"
        >
          Get my free valuation →
        </Link>
        <p className="-mt-1 text-center text-sm text-[#525C7A]">
          Free · private · no account needed to see your number.
        </p>
      </div>
    </div>
  );
}
