"use client";

import { useEffect } from "react";
import Link from "next/link";
import { PENDING_LISTING_KEY } from "@/lib/post-auth";

/**
 * Replaces the Financial Overview card for logged-out visitors. The listing
 * itself stays viewable; only the numbers are gated behind a free account.
 * Stashes this listing's URL so signup/login returns them here.
 */
export default function FinancialsGate() {
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(
        PENDING_LISTING_KEY,
        window.location.pathname + window.location.search
      );
    }
  }, []);

  return (
    <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-900">
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
          />
        </svg>
      </div>
      <h3 className="mb-1 text-lg font-semibold text-slate-900">Financials are members-only</h3>
      <p className="mx-auto mb-6 max-w-sm text-sm leading-relaxed text-slate-500">
        Create a free account to see revenue, profit, EBITDA, and the full valuation for this
        business — you&apos;ll come right back here.
      </p>
      <Link
        href="/auth/signup"
        className="inline-block rounded-xl bg-blue-900 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-800"
      >
        Create your free account →
      </Link>
      <p className="mt-3 text-xs text-slate-400">
        Already a member?{" "}
        <Link href="/auth/login" className="text-blue-900 hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
