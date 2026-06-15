import { Listing } from "@/lib/types";

/**
 * Industry options shown across the funnel. Kept here so the homepage hero and
 * the valuation form draw from one source of truth.
 */
export const INDUSTRIES = [
  "Retail",
  "Restaurant/Food",
  "Healthcare",
  "Professional Services",
  "Construction/Trades",
  "Manufacturing",
  "Technology",
  "Real Estate",
  "Other",
] as const;

/**
 * Rough revenue-multiple bands by industry for the *instant* (non-AI) range we
 * show before any wall. These are deliberately wide ballpark figures for SMB
 * sale comps — the AI valuation later refines this with profit and other inputs.
 */
const INDUSTRY_REVENUE_MULTIPLES: Record<string, { low: number; high: number }> = {
  Retail: { low: 0.3, high: 0.6 },
  "Restaurant/Food": { low: 0.3, high: 0.5 },
  Healthcare: { low: 0.6, high: 1.2 },
  "Professional Services": { low: 0.5, high: 1.1 },
  "Construction/Trades": { low: 0.4, high: 0.8 },
  Manufacturing: { low: 0.5, high: 1.0 },
  Technology: { low: 1.5, high: 4.0 },
  "Real Estate": { low: 0.8, high: 1.5 },
  Other: { low: 0.5, high: 1.0 },
};

/**
 * Instant ballpark value range from revenue alone, banded by industry. Returns
 * null when revenue isn't a positive number so callers can gate the reveal.
 */
export function instantValuationRange(
  revenue: number,
  industry: string
): { low: number; high: number } | null {
  if (!Number.isFinite(revenue) || revenue <= 0) return null;
  const band = INDUSTRY_REVENUE_MULTIPLES[industry] ?? INDUSTRY_REVENUE_MULTIPLES.Other;
  return {
    low: Math.round(revenue * band.low),
    high: Math.round(revenue * band.high),
  };
}

/** Compact money formatter: $1.2M, $850K, $1,200. */
export function fmtMoney(n: number): string {
  if (!Number.isFinite(n)) return "—";
  const abs = Math.abs(n);
  if (abs >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (abs >= 1_000) return `$${Math.round(n / 1_000)}K`;
  return `$${Math.round(n).toLocaleString()}`;
}

/** Valuation multiple, e.g. "4.2×". */
export function fmtMultiple(m: number): string {
  return `${m.toFixed(1)}×`;
}

/** Signed percent for growth, e.g. "+18%" / "−7%". */
export function fmtGrowth(pct: number): string {
  const rounded = Math.round(pct);
  if (rounded === 0) return "0%";
  return `${rounded > 0 ? "+" : "−"}${Math.abs(rounded)}%`;
}

/**
 * Recovers the earnings figure a valuation multiple was applied to, so a
 * listing created from a valuation can show EBITDA/SDE without re-entry.
 *
 * The valuation engine reports valuation_mid = multiple × earnings-base, where
 * the base is EBITDA, SDE, or (for DCF) not multiple-derived. We invert that
 * and attribute the base to the field named by the primary method.
 */
export function impliedEarningsFromValuation(input: {
  valuationMid: number;
  multipleApplied: number | null | undefined;
  primaryMethod: string | null | undefined;
}): { ebitda: number | null; sde: number | null } {
  const { valuationMid, multipleApplied, primaryMethod } = input;
  if (!multipleApplied || multipleApplied <= 0 || !(valuationMid > 0)) {
    return { ebitda: null, sde: null };
  }
  const base = Math.round(valuationMid / multipleApplied);
  const method = (primaryMethod ?? "").toLowerCase();
  if (method.includes("ebitda")) return { ebitda: base, sde: null };
  if (method.includes("sde")) return { ebitda: null, sde: base };
  // DCF or unknown: the multiple isn't an earnings multiple, so don't attribute.
  return { ebitda: null, sde: null };
}

export interface DerivedFinancials {
  /** asking_price when set, otherwise the mid valuation. */
  effectivePrice: number;
  ebitda: number | null;
  /** ebitda / annual_revenue, as a percent (0–100). */
  ebitdaMargin: number | null;
  /** effectivePrice / ebitda. */
  multiple: number | null;
  /** Net profit margin, as a percent (0–100). */
  profitMargin: number | null;
  /** YoY revenue growth as a percent; null when no prior-year figure. */
  revenueGrowth: number | null;
  /** YoY EBITDA growth as a percent; null when no prior-year figure. */
  ebitdaGrowth: number | null;
  mrr: number | null;
  /** arr column when present, else mrr × 12. */
  arr: number | null;
  recurringRevenuePercent: number | null;
}

/**
 * Derives the headline financial metrics shown on listings. All ratios are
 * computed here so the display layers stay consistent and DB stays normalized.
 */
export function deriveFinancials(l: Listing): DerivedFinancials {
  const effectivePrice = l.asking_price ?? l.valuation_mid;
  const ebitda = l.ebitda ?? null;

  const ebitdaMargin =
    ebitda != null && l.annual_revenue > 0
      ? (ebitda / l.annual_revenue) * 100
      : null;

  const multiple =
    ebitda != null && ebitda > 0 ? effectivePrice / ebitda : null;

  const profitMargin =
    l.annual_revenue > 0 ? (l.annual_profit / l.annual_revenue) * 100 : null;

  const revenueGrowth =
    l.revenue_prior_year != null && l.revenue_prior_year > 0
      ? ((l.annual_revenue - l.revenue_prior_year) / l.revenue_prior_year) * 100
      : null;

  const ebitdaGrowth =
    ebitda != null && l.ebitda_prior_year != null && l.ebitda_prior_year > 0
      ? ((ebitda - l.ebitda_prior_year) / l.ebitda_prior_year) * 100
      : null;

  const arr = l.arr ?? (l.mrr != null ? l.mrr * 12 : null);

  return {
    effectivePrice,
    ebitda,
    ebitdaMargin,
    multiple,
    profitMargin,
    revenueGrowth,
    ebitdaGrowth,
    mrr: l.mrr ?? null,
    arr,
    recurringRevenuePercent: l.recurring_revenue_percent ?? null,
  };
}
