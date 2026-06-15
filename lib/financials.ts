import { Listing } from "@/lib/types";

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
