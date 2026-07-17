"use client";

import { useEffect } from "react";
import Link from "next/link";
import { PENDING_LISTING_KEY } from "@/lib/post-auth";

/**
 * Shown to logged-out visitors (e.g. someone opening a shared link) in place of
 * the listing. Stashes this listing's URL so signup/login returns them here.
 */
export default function ListingAuthGate({
  industry,
  location,
}: {
  industry: string;
  location: string;
}) {
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(
        PENDING_LISTING_KEY,
        window.location.pathname + window.location.search
      );
    }
  }, []);

  return (
    <div className="mx-auto max-w-lg px-6 py-24 text-center">
      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="mb-3 text-xs font-semibold uppercase tracking-widest text-blue-900">
          {industry} · {location}
        </div>
        <h1 className="mb-3 font-serif text-3xl font-bold text-slate-900">
          Create a free account to view this listing
        </h1>
        <p className="mb-8 leading-relaxed text-slate-500">
          Full financials, business details, and the seller&apos;s information are reserved
          for verified members. It&apos;s free and takes a minute — and you&apos;ll be brought
          right back to this listing.
        </p>
        <Link
          href="/auth/signup"
          className="inline-block rounded-xl bg-blue-900 px-8 py-4 text-base font-semibold text-white shadow-md transition-all hover:-translate-y-0.5 hover:bg-blue-800"
        >
          Create your free account →
        </Link>
        <p className="mt-4 text-sm text-slate-400">
          Already a member?{" "}
          <Link href="/auth/login" className="font-medium text-blue-900 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
