"use client";

import { useState } from "react";
import Link from "next/link";

/** Hamburger + slide-down panel for the marketing nav on small screens. */
export default function MobileMenu({
  links,
  isLoggedIn,
  dashboardHref,
}: {
  links: { href: string; label: string }[];
  isLoggedIn: boolean;
  dashboardHref: string;
}) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <>
      <button
        type="button"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="p-2 text-navy"
      >
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          {open ? (
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {open && (
        <div className="absolute inset-x-0 top-16 border-b border-slate-200 bg-cream shadow-lg lg:hidden">
          <div className="flex flex-col gap-1 px-5 py-4">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={close}
                className="rounded-lg px-3 py-3 text-base font-medium text-navy hover:bg-cream-deep"
              >
                {l.label}
              </Link>
            ))}
            <Link
              href="/listings"
              onClick={close}
              className="rounded-lg px-3 py-3 text-base font-medium text-navy hover:bg-cream-deep"
            >
              Browse Listings
            </Link>

            <div className="my-2 border-t border-slate-200" />

            {isLoggedIn ? (
              <Link
                href={dashboardHref}
                onClick={close}
                className="rounded-lg px-3 py-3 text-base font-medium text-navy hover:bg-cream-deep"
              >
                My Dashboard
              </Link>
            ) : (
              <div className="flex flex-col gap-1">
                <Link
                  href="/auth/login"
                  onClick={close}
                  className="rounded-lg px-3 py-3 text-base font-medium text-navy hover:bg-cream-deep"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/signup"
                  onClick={close}
                  className="rounded-lg px-3 py-3 text-base font-medium text-navy hover:bg-cream-deep"
                >
                  Create Account
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
