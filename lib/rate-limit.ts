import { NextResponse } from "next/server";

// Lightweight in-memory rate limiter (fixed window). This is per server
// instance — it is NOT shared across serverless instances — but it's a real
// first guard against bursts/cost-abuse at launch with zero extra infra.
// To make it global at scale, swap the `rateLimit` internals for Upstash/Redis
// keeping the same RateLimitResult shape; the call sites won't change.

type Bucket = { count: number; reset: number };
const buckets = new Map<string, Bucket>();
let lastCleanup = 0;

export interface RateLimitResult {
  success: boolean;
  remaining: number;
  /** epoch ms when the current window resets */
  reset: number;
}

function rateLimit(key: string, limit: number, windowMs: number): RateLimitResult {
  const now = Date.now();
  const existing = buckets.get(key);

  if (!existing || existing.reset <= now) {
    buckets.set(key, { count: 1, reset: now + windowMs });
    return { success: true, remaining: limit - 1, reset: now + windowMs };
  }

  existing.count += 1;
  return {
    success: existing.count <= limit,
    remaining: Math.max(0, limit - existing.count),
    reset: existing.reset,
  };
}

// Evict expired buckets occasionally so the Map can't grow unbounded.
function maybeCleanup() {
  const now = Date.now();
  if (now - lastCleanup < 60_000) return;
  lastCleanup = now;
  for (const [k, b] of buckets) if (b.reset <= now) buckets.delete(k);
}

/** Best-effort client IP from proxy headers (Vercel sets x-forwarded-for). */
export function clientIp(req: Request): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}

/**
 * Enforce a per-IP limit for a named bucket. Returns a 429 NextResponse when
 * the caller is over the limit, or null when the request may proceed.
 */
export function enforceRateLimit(
  req: Request,
  name: string,
  limit: number,
  windowMs: number
): NextResponse | null {
  maybeCleanup();
  const result = rateLimit(`${name}:${clientIp(req)}`, limit, windowMs);
  if (result.success) return null;

  const retryAfter = Math.max(1, Math.ceil((result.reset - Date.now()) / 1000));
  return NextResponse.json(
    { error: "Too many requests. Please slow down and try again shortly." },
    { status: 429, headers: { "Retry-After": String(retryAfter) } }
  );
}

const MINUTE = 60_000;
const HOUR = 60 * MINUTE;

// Tuned for normal use; generous enough not to hit real users, tight enough to
// blunt scripted abuse and runaway AI cost.
export const LIMITS = {
  valuate: { limit: 10, windowMs: HOUR },
  captureEmail: { limit: 10, windowMs: HOUR },
  generateDescription: { limit: 30, windowMs: HOUR },
  matchListings: { limit: 20, windowMs: HOUR },
  bulkUpload: { limit: 5, windowMs: HOUR },
  sellerSuggestions: { limit: 40, windowMs: HOUR },
} as const;
