/**
 * Canonical site URL, in one place. Set NEXT_PUBLIC_SITE_URL to the production
 * domain (e.g. "https://mercato.com") in the environment; it falls back to the
 * current Vercel deployment URL for previews, then to the legacy host.
 *
 * Used for SEO canonicals, OpenGraph, JSON-LD, and footer/display links so the
 * domain swap at launch is a single env var, not a code hunt.
 */
const configured =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.NEXT_PUBLIC_VERCEL_URL
    ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
    : "") ||
  "https://successioniq.vercel.app";

/** Absolute origin, no trailing slash — e.g. "https://mercato.com". */
export const SITE_URL = configured.replace(/\/+$/, "");

/** Display host, no scheme — e.g. "mercato.com". */
export const SITE_HOST = SITE_URL.replace(/^https?:\/\//, "");
