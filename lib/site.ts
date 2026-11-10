/**
 * Canonical site URL, in one place. Always the production domain so sitemaps,
 * canonicals and OpenGraph never point at a per-deployment Vercel URL (Google
 * rejects a sitemap whose URLs don't match the host it's served from).
 *
 * Override with NEXT_PUBLIC_SITE_URL only to change the canonical domain itself.
 */
const configured = process.env.NEXT_PUBLIC_SITE_URL || "https://gofairmark.com";

/** Absolute origin, no trailing slash — e.g. "https://mercato.com". */
export const SITE_URL = configured.replace(/\/+$/, "");

/** Display host, no scheme — e.g. "mercato.com". */
export const SITE_HOST = SITE_URL.replace(/^https?:\/\//, "");
