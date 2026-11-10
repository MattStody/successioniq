"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { VALUATOR_PATH } from "./config";
import { instantValuationRange, fmtMoney } from "@/lib/financials";

const PRESETS = [
  { label: "$500K", value: 500_000 },
  { label: "$1M", value: 1_000_000 },
  { label: "$2.5M", value: 2_500_000 },
  { label: "$5M", value: 5_000_000 },
];

export function ValuatorTeaser() {
  const [revenue, setRevenue] = useState(1_200_000);
  const hasRevenue = revenue > 0;
  // Revenue-only first pass uses the same shared band the full valuator uses
  // for its instant estimate (industry-agnostic "Other" band here).
  const range = instantValuationRange(revenue, "Other");
  // Pass revenue forward so the full tool can pre-fill it.
  const href = hasRevenue ? `${VALUATOR_PATH}?revenue=${revenue}` : VALUATOR_PATH;

  return (
    <div id="valuator" className="scroll-mt-24 overflow-hidden rounded-3xl border border-[#DCE3F2] bg-white shadow-[0_24px_60px_-28px_rgba(14,26,60,0.35)] motion-safe:animate-[fade-up_0.7s_ease-out_both]">
      <Image src="/mercato/hero.jpg" alt="" width={696} height={690} priority className="h-[170px] w-full object-cover object-[50%_8%]" />
      <div className="flex flex-col gap-[22px] p-6 sm:p-8">
        <div className="flex flex-col gap-1">
          <h2 className="text-[26px] font-bold tracking-[-0.015em]">Free business valuation</h2>
          <p className="text-base text-[#525C7A]">One question to start. You can sharpen it after.</p>
        </div>

        <div className="flex flex-col gap-2.5">
          <label htmlFor="revenue" className="text-base font-semibold">Annual revenue, last 12 months</label>
          <div className="flex items-center rounded-xl border-2 border-[#C9D2E8] px-4 focus-within:border-[#4F6BFF]">
            <span aria-hidden="true" className="text-[26px] font-semibold text-[#525C7A]">$</span>
            <input
              id="revenue"
              inputMode="numeric"
              autoComplete="off"
              placeholder="1,200,000"
              value={hasRevenue ? revenue.toLocaleString("en-US") : ""}
              onChange={(e) => {
                const digits = e.target.value.replace(/[^0-9]/g, "");
                setRevenue(digits ? Math.min(parseInt(digits, 10), 999_999_999) : 0);
              }}
              className="min-w-0 flex-1 bg-transparent px-2 py-3.5 text-[26px] font-semibold outline-none"
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
                  className={`min-h-11 rounded-full border px-4 py-2.5 text-[15px] font-semibold ${
                    on ? "border-[#0E1330] bg-[#0E1330] text-white" : "border-[#C9D2E8] bg-white text-[#0E1330] hover:border-[#0E1330]"
                  }`}
                >
                  {p.label}
                </button>
              );
            })}
          </div>
        </div>

        <div aria-live="polite" className="rounded-2xl bg-[#F4F6FC] px-[22px] py-5">
          {hasRevenue && range ? (
            <div className="flex flex-col gap-1.5">
              <span className="text-[15px] font-semibold text-[#525C7A]">Estimated value range</span>
              <span className="text-[34px] font-extrabold leading-tight tracking-[-0.025em] sm:text-[40px]">
                {fmtMoney(range.low)} – {fmtMoney(range.high)}
              </span>
              <span className="text-[15px] text-[#525C7A]">Based on revenue alone. Add your profit and a few details to narrow it.</span>
            </div>
          ) : (
            <p className="text-base text-[#525C7A]">Enter your revenue and your range appears here.</p>
          )}
        </div>

        <Link href={href} className="flex min-h-14 items-center justify-center rounded-xl bg-[#4F6BFF] px-6 py-[18px] text-[19px] font-bold text-white hover:bg-[#3f57e6]">
          Sharpen my estimate
        </Link>
        <p className="-mt-2 text-center text-sm text-[#525C7A]">A few more questions. Each one narrows the range.</p>
      </div>
    </div>
  );
}
