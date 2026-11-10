"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Hero animation for the sellers page: an illustrative "value reveal". The
 * number counts up, the range bar fills to the estimate, and the low/high
 * anchors fade in — visualizing the page's promise ("find out what it's worth").
 *
 * Play-once on mount. Fully static for users who prefer reduced motion (the JS
 * count-up is skipped and CSS transitions are disabled via motion-reduce:).
 */
const TARGET = 740_000;
const LOW = 480_000;
const HIGH = 960_000;
const FILL_PCT = 68; // where the mid estimate sits along the low→high track

function fmtK(n: number) {
  return `$${Math.round(n / 1000)}K`;
}

export default function ValueRevealCard() {
  const [val, setVal] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const rafRef = useRef(0);

  useEffect(() => {
    const prefersReduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Reduced motion: skip the count-up, settle on the final state (deferred so
    // it doesn't run synchronously inside the effect body).
    if (prefersReduce) {
      const id = window.setTimeout(() => {
        setVal(TARGET);
        setRevealed(true);
      }, 0);
      return () => window.clearTimeout(id);
    }

    const duration = 1500;
    let startTime = 0;
    const tick = (now: number) => {
      if (!startTime) startTime = now;
      const t = Math.min(1, (now - startTime) / duration);
      const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
      setVal(Math.round(TARGET * eased));
      if (t < 1) rafRef.current = requestAnimationFrame(tick);
    };

    const startId = window.setTimeout(() => {
      setRevealed(true);
      rafRef.current = requestAnimationFrame(tick);
    }, 200);

    return () => {
      window.clearTimeout(startId);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div className="relative overflow-hidden rounded-3xl border border-[#DCE3F2] bg-white p-8 shadow-[0_24px_60px_-32px_rgba(14,19,48,0.35)]">
      {/* soft brand glow */}
      <div className="pointer-events-none absolute -right-8 -top-10 h-36 w-36 rounded-full bg-[#4F6BFF]/10 blur-2xl" />

      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold uppercase tracking-widest text-[#525C7A]">
          Estimated value
        </p>
        <span className="rounded-full bg-[#F1F3F6] px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-[#8A93A8]">
          Example
        </span>
      </div>

      <div className="mt-3">
        <span className="text-[52px] font-extrabold leading-none tracking-[-0.03em] text-[#0E1330] tabular-nums sm:text-[60px]">
          {fmtK(val)}
        </span>
      </div>
      <p className="mt-3 text-sm text-[#525C7A]">
        Based on your revenue and profit — in about a minute.
      </p>

      {/* range track */}
      <div className="mt-8">
        <div className="relative h-2.5 rounded-full bg-[#E8EEFF]">
          <div
            className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-[#4F6BFF] to-[#6B83FF] transition-[width] duration-[1400ms] ease-out motion-reduce:transition-none"
            style={{ width: revealed ? `${FILL_PCT}%` : "0%" }}
          />
          <div
            className="absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-[#4F6BFF] shadow-md transition-[left] duration-[1400ms] ease-out motion-reduce:transition-none"
            style={{ left: revealed ? `${FILL_PCT}%` : "0%" }}
          >
            <span className="absolute inset-0 rounded-full bg-[#4F6BFF]/40 motion-safe:animate-ping" />
          </div>
        </div>
        <div className="mt-3 flex justify-between text-sm font-semibold text-[#525C7A]">
          <span
            className={`transition-opacity delay-700 duration-700 ${
              revealed ? "opacity-100" : "opacity-0"
            }`}
          >
            {fmtK(LOW)}
          </span>
          <span
            className={`transition-opacity delay-1000 duration-700 ${
              revealed ? "opacity-100" : "opacity-0"
            }`}
          >
            {fmtK(HIGH)}
          </span>
        </div>
      </div>
    </div>
  );
}
