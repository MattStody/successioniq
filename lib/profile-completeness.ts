export function calculateCompleteness(l: Partial<Record<string, unknown>>): number {
  let score = 0

  const nonEmptyString = (v: unknown) => typeof v === "string" && v.trim().length > 0
  const nonNullNumber = (v: unknown) => v !== null && v !== undefined && typeof v === "number"
  const notNull = (v: unknown) => v !== null && v !== undefined

  if (nonEmptyString(l.tagline)) score += 5
  if (nonNullNumber(l.founded_year)) score += 5
  if (nonEmptyString(l.business_model)) score += 5
  if (nonEmptyString(l.revenue_type)) score += 5
  if (nonEmptyString(l.competitive_advantages)) score += 5
  if (nonEmptyString(l.growth_opportunities)) score += 5
  if (nonNullNumber(l.employee_count)) score += 5
  if (nonNullNumber(l.owner_hours_per_week)) score += 5
  if (nonEmptyString(l.key_person_dependencies)) score += 5
  if (nonEmptyString(l.systems_and_processes)) score += 5
  if (notNull(l.real_estate_included)) score += 5
  if (notNull(l.has_equipment)) score += 5
  if (notNull(l.has_intellectual_property)) score += 5
  if (notNull(l.has_lease)) score += 5
  if (nonNullNumber(l.top_customer_count)) score += 5
  if (nonNullNumber(l.active_customer_count)) score += 5
  if (notNull(l.is_seasonal)) score += 5
  if (notNull(l.seller_financing_available)) score += 5
  if (nonEmptyString(l.reason_for_sale_detail)) score += 5
  if (notNull(l.non_compete_willing)) score += 5

  return score
}

export function completenessLabel(score: number): { label: string; color: string } {
  if (score >= 70) return { label: "Complete listing", color: "emerald" }
  if (score >= 40) return { label: "Detailed listing", color: "amber" }
  return { label: "Basic listing", color: "slate" }
}
