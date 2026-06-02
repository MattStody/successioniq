type ListingForDisplay = {
  industry: string;
  annual_revenue: number;
  annual_profit: number;
  years_operating: number;
};

function fmtRevenue(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${Math.round(n / 1_000)}K`;
  return `$${n.toLocaleString()}`;
}

export function anonListingName(l: ListingForDisplay): string {
  const base = `${l.industry} Business`;
  const margin = l.annual_revenue > 0 ? l.annual_profit / l.annual_revenue : 0;

  if (l.years_operating >= 10) {
    return `${base} of ${l.years_operating} Years`;
  }
  if (l.annual_revenue >= 1_000_000) {
    return `${base} · ${fmtRevenue(l.annual_revenue)} Revenue`;
  }
  if (margin >= 0.35 && l.annual_revenue >= 200_000) {
    return `${base} · ${Math.round(margin * 100)}% Net Margins`;
  }
  if (l.years_operating >= 3) {
    return `${base} of ${l.years_operating} Years`;
  }
  return base;
}

export function getListingDisplayName(l: {
  is_anonymous: boolean;
  business_name: string | null;
  industry: string;
  annual_revenue: number;
  annual_profit: number;
  years_operating: number;
}): string {
  if (!l.is_anonymous && l.business_name) return l.business_name;
  return anonListingName(l);
}
