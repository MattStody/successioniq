"use client"

import { useState, useMemo } from "react"
import { Listing } from "@/lib/types"
import { calculateCompleteness, completenessLabel } from "@/lib/profile-completeness"

function SectionHeader({
  title,
  onAiSuggest,
  suggesting,
}: {
  title: string
  onAiSuggest: () => void
  suggesting: boolean
}) {
  return (
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-xl font-semibold text-slate-900">{title}</h2>
      <button
        type="button"
        onClick={onAiSuggest}
        disabled={suggesting}
        className="flex items-center gap-1.5 text-sm font-medium text-blue-900 border border-blue-200 hover:border-blue-400 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {suggesting ? (
          <>
            <span className="w-3.5 h-3.5 border-2 border-blue-900/30 border-t-blue-900 rounded-full animate-spin" />
            Thinking...
          </>
        ) : (
          <>Improve with AI ✦</>
        )}
      </button>
    </div>
  )
}

function Field({
  label,
  hint,
  children,
}: {
  label: string
  hint?: string
  children: React.ReactNode
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
      {hint && <p className="text-xs text-slate-400 mb-2">{hint}</p>}
      {children}
    </div>
  )
}

function ButtonGroup({
  options,
  value,
  onChange,
}: {
  options: string[]
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div className="flex gap-2 flex-wrap">
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          onClick={() => onChange(opt)}
          className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
            value === opt
              ? "bg-blue-900 text-white border-blue-900"
              : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
          }`}
        >
          {opt}
        </button>
      ))}
    </div>
  )
}

function YesNo({
  value,
  onChange,
}: {
  value: boolean | null
  onChange: (v: boolean | null) => void
}) {
  return (
    <div className="flex gap-2">
      <button
        type="button"
        onClick={() => onChange(value === true ? null : true)}
        className={`px-5 py-2 rounded-lg text-sm font-medium border transition-colors ${
          value === true
            ? "bg-blue-900 text-white border-blue-900"
            : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
        }`}
      >
        Yes
      </button>
      <button
        type="button"
        onClick={() => onChange(value === false ? null : false)}
        className={`px-5 py-2 rounded-lg text-sm font-medium border transition-colors ${
          value === false
            ? "bg-blue-900 text-white border-blue-900"
            : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
        }`}
      >
        No
      </button>
    </div>
  )
}

function SubFields({ children }: { children: React.ReactNode }) {
  return (
    <div className="ml-4 pl-4 border-l-2 border-blue-200 mt-4 space-y-4">
      {children}
    </div>
  )
}

export default function ProfileEditor({ listing }: { listing: Listing }) {
  const [tagline, setTagline] = useState(listing.tagline ?? "")
  const [foundedYear, setFoundedYear] = useState(listing.founded_year?.toString() ?? "")
  const [businessModel, setBusinessModel] = useState(listing.business_model ?? "")
  const [revenueType, setRevenueType] = useState(listing.revenue_type ?? "")
  const [recurringRevenuePercent, setRecurringRevenuePercent] = useState(
    listing.recurring_revenue_percent ?? 0
  )
  const [competitiveAdvantages, setCompetitiveAdvantages] = useState(
    listing.competitive_advantages ?? ""
  )
  const [growthOpportunities, setGrowthOpportunities] = useState(
    listing.growth_opportunities ?? ""
  )

  const [employeeCount, setEmployeeCount] = useState(listing.employee_count?.toString() ?? "")
  const [fullTimeEmployees, setFullTimeEmployees] = useState(
    listing.full_time_employees?.toString() ?? ""
  )
  const [partTimeEmployees, setPartTimeEmployees] = useState(
    listing.part_time_employees?.toString() ?? ""
  )
  const [ownerHoursPerWeek, setOwnerHoursPerWeek] = useState(
    listing.owner_hours_per_week ?? 40
  )
  const [keyPersonDependencies, setKeyPersonDependencies] = useState(
    listing.key_person_dependencies ?? ""
  )
  const [systemsAndProcesses, setSystemsAndProcesses] = useState(
    listing.systems_and_processes ?? ""
  )

  const [realEstateIncluded, setRealEstateIncluded] = useState<boolean | null>(
    listing.real_estate_included ?? null
  )
  const [realEstateValue, setRealEstateValue] = useState(
    listing.real_estate_value?.toString() ?? ""
  )
  const [hasEquipment, setHasEquipment] = useState<boolean | null>(listing.has_equipment ?? null)
  const [equipmentValue, setEquipmentValue] = useState(
    listing.equipment_value?.toString() ?? ""
  )
  const [equipmentDescription, setEquipmentDescription] = useState(
    listing.equipment_description ?? ""
  )
  const [hasIntellectualProperty, setHasIntellectualProperty] = useState<boolean | null>(
    listing.has_intellectual_property ?? null
  )
  const [ipDescription, setIpDescription] = useState(listing.ip_description ?? "")
  const [hasLicensesPermits, setHasLicensesPermits] = useState<boolean | null>(
    listing.has_licenses_permits ?? null
  )
  const [licensesDescription, setLicensesDescription] = useState(
    listing.licenses_description ?? ""
  )
  const [hasLease, setHasLease] = useState<boolean | null>(listing.has_lease ?? null)
  const [leaseMonthlyCost, setLeaseMonthlyCost] = useState(
    listing.lease_monthly_cost?.toString() ?? ""
  )
  const [leaseExpiry, setLeaseExpiry] = useState(listing.lease_expiry ?? "")

  const [activeCustomerCount, setActiveCustomerCount] = useState(
    listing.active_customer_count?.toString() ?? ""
  )
  const [topCustomerCount, setTopCustomerCount] = useState(
    listing.top_customer_count?.toString() ?? ""
  )
  const [longestCustomerRelationship, setLongestCustomerRelationship] = useState(
    listing.longest_customer_relationship?.toString() ?? ""
  )
  const [avgCustomerRelationship, setAvgCustomerRelationship] = useState(
    listing.avg_customer_relationship?.toString() ?? ""
  )
  const [isSeasonal, setIsSeasonal] = useState<boolean | null>(listing.is_seasonal ?? null)
  const [seasonalDescription, setSeasonalDescription] = useState(
    listing.seasonal_description ?? ""
  )

  const [sellerFinancingAvailable, setSellerFinancingAvailable] = useState<boolean | null>(
    listing.seller_financing_available ?? null
  )
  const [sellerFinancingDetails, setSellerFinancingDetails] = useState(
    listing.seller_financing_details ?? ""
  )
  const [trainingIncluded, setTrainingIncluded] = useState<boolean | null>(
    listing.training_included ?? null
  )
  const [trainingDescription, setTrainingDescription] = useState(
    listing.training_description ?? ""
  )
  const [nonCompeteWilling, setNonCompeteWilling] = useState<boolean | null>(
    listing.non_compete_willing ?? null
  )
  const [transitionPeriod, setTransitionPeriod] = useState(listing.transition_period ?? "")
  const [reasonForSaleDetail, setReasonForSaleDetail] = useState(
    listing.reason_for_sale_detail ?? ""
  )

  const [saving, setSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState("")
  const [suggestions, setSuggestions] = useState<Record<string, string>>({})
  const [suggesting, setSuggesting] = useState<Record<string, boolean>>({})

  const fieldsForCompleteness = useMemo(
    () => ({
      tagline,
      founded_year: foundedYear ? parseInt(foundedYear) : null,
      business_model: businessModel,
      revenue_type: revenueType,
      competitive_advantages: competitiveAdvantages,
      growth_opportunities: growthOpportunities,
      employee_count: employeeCount ? parseInt(employeeCount) : null,
      owner_hours_per_week: ownerHoursPerWeek,
      key_person_dependencies: keyPersonDependencies,
      systems_and_processes: systemsAndProcesses,
      real_estate_included: realEstateIncluded,
      has_equipment: hasEquipment,
      has_intellectual_property: hasIntellectualProperty,
      has_lease: hasLease,
      top_customer_count: topCustomerCount ? parseInt(topCustomerCount) : null,
      active_customer_count: activeCustomerCount ? parseInt(activeCustomerCount) : null,
      is_seasonal: isSeasonal,
      seller_financing_available: sellerFinancingAvailable,
      reason_for_sale_detail: reasonForSaleDetail,
      non_compete_willing: nonCompeteWilling,
    }),
    [
      tagline, foundedYear, businessModel, revenueType, competitiveAdvantages,
      growthOpportunities, employeeCount, ownerHoursPerWeek, keyPersonDependencies,
      systemsAndProcesses, realEstateIncluded, hasEquipment, hasIntellectualProperty,
      hasLease, topCustomerCount, activeCustomerCount, isSeasonal,
      sellerFinancingAvailable, reasonForSaleDetail, nonCompeteWilling,
    ]
  )

  const completeness = useMemo(
    () => calculateCompleteness(fieldsForCompleteness),
    [fieldsForCompleteness]
  )
  const { label: completenessLabelText, color: completenessColor } = completenessLabel(completeness)

  const sections = [
    { id: "overview", label: "Overview" },
    { id: "operations", label: "Operations" },
    { id: "assets", label: "Assets" },
    { id: "customers", label: "Customers" },
    { id: "deal", label: "Deal Terms" },
  ]

  async function handleAiSuggest(section: string, summary: string) {
    setSuggesting((prev) => ({ ...prev, [section]: true }))
    try {
      const res = await fetch(`/api/seller/profile/${listing.id}/ai-suggest`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section, summary }),
      })
      const data = await res.json()
      if (data.suggestion) {
        setSuggestions((prev) => ({ ...prev, [section]: data.suggestion }))
      }
    } catch {
      // silently fail
    } finally {
      setSuggesting((prev) => ({ ...prev, [section]: false }))
    }
  }

  function overviewSummary() {
    const parts: string[] = []
    if (tagline) parts.push(`Tagline: ${tagline}`)
    if (foundedYear) parts.push(`Founded: ${foundedYear}`)
    if (businessModel) parts.push(`Business model: ${businessModel}`)
    if (revenueType) parts.push(`Revenue type: ${revenueType}`)
    if (recurringRevenuePercent) parts.push(`Recurring revenue: ${recurringRevenuePercent}%`)
    if (competitiveAdvantages) parts.push(`Competitive advantages: ${competitiveAdvantages}`)
    if (growthOpportunities) parts.push(`Growth opportunities: ${growthOpportunities}`)
    return parts.join("\n") || "No content yet"
  }

  function operationsSummary() {
    const parts: string[] = []
    if (employeeCount) parts.push(`Total employees: ${employeeCount}`)
    if (fullTimeEmployees) parts.push(`Full-time: ${fullTimeEmployees}`)
    if (partTimeEmployees) parts.push(`Part-time: ${partTimeEmployees}`)
    parts.push(`Owner hours/week: ${ownerHoursPerWeek}`)
    if (keyPersonDependencies) parts.push(`Key person dependencies: ${keyPersonDependencies}`)
    if (systemsAndProcesses) parts.push(`Systems and processes: ${systemsAndProcesses}`)
    return parts.join("\n") || "No content yet"
  }

  function assetsSummary() {
    const parts: string[] = []
    parts.push(`Real estate included: ${realEstateIncluded === null ? "not answered" : realEstateIncluded ? "Yes" : "No"}`)
    if (realEstateIncluded && realEstateValue) parts.push(`Real estate value: $${realEstateValue}`)
    parts.push(`Has equipment: ${hasEquipment === null ? "not answered" : hasEquipment ? "Yes" : "No"}`)
    if (hasEquipment && equipmentDescription) parts.push(`Equipment: ${equipmentDescription}`)
    parts.push(`Intellectual property: ${hasIntellectualProperty === null ? "not answered" : hasIntellectualProperty ? "Yes" : "No"}`)
    if (hasIntellectualProperty && ipDescription) parts.push(`IP: ${ipDescription}`)
    parts.push(`Has lease: ${hasLease === null ? "not answered" : hasLease ? "Yes" : "No"}`)
    if (hasLease && leaseExpiry) parts.push(`Lease expiry: ${leaseExpiry}`)
    return parts.join("\n")
  }

  function customersSummary() {
    const parts: string[] = []
    if (activeCustomerCount) parts.push(`Active customers: ${activeCustomerCount}`)
    if (topCustomerCount) parts.push(`Top customer concentration: ${topCustomerCount}`)
    if (longestCustomerRelationship) parts.push(`Longest relationship: ${longestCustomerRelationship} years`)
    if (avgCustomerRelationship) parts.push(`Avg relationship: ${avgCustomerRelationship} years`)
    parts.push(`Seasonal: ${isSeasonal === null ? "not answered" : isSeasonal ? "Yes" : "No"}`)
    if (isSeasonal && seasonalDescription) parts.push(`Seasonal details: ${seasonalDescription}`)
    return parts.join("\n") || "No content yet"
  }

  function dealSummary() {
    const parts: string[] = []
    parts.push(`Seller financing: ${sellerFinancingAvailable === null ? "not answered" : sellerFinancingAvailable ? "Yes" : "No"}`)
    if (sellerFinancingAvailable && sellerFinancingDetails) parts.push(`Financing details: ${sellerFinancingDetails}`)
    parts.push(`Training included: ${trainingIncluded === null ? "not answered" : trainingIncluded ? "Yes" : "No"}`)
    if (trainingIncluded && trainingDescription) parts.push(`Training: ${trainingDescription}`)
    parts.push(`Non-compete: ${nonCompeteWilling === null ? "not answered" : nonCompeteWilling ? "Yes" : "No"}`)
    if (transitionPeriod) parts.push(`Transition period: ${transitionPeriod}`)
    if (reasonForSaleDetail) parts.push(`Reason for sale: ${reasonForSaleDetail}`)
    return parts.join("\n")
  }

  async function handleSave() {
    setSaving(true)
    try {
      const payload = {
        tagline: tagline || null,
        founded_year: foundedYear ? parseInt(foundedYear) : null,
        business_model: businessModel || null,
        revenue_type: revenueType || null,
        recurring_revenue_percent: recurringRevenuePercent,
        competitive_advantages: competitiveAdvantages || null,
        growth_opportunities: growthOpportunities || null,
        employee_count: employeeCount ? parseInt(employeeCount) : null,
        full_time_employees: fullTimeEmployees ? parseInt(fullTimeEmployees) : null,
        part_time_employees: partTimeEmployees ? parseInt(partTimeEmployees) : null,
        owner_hours_per_week: ownerHoursPerWeek,
        key_person_dependencies: keyPersonDependencies || null,
        systems_and_processes: systemsAndProcesses || null,
        real_estate_included: realEstateIncluded,
        real_estate_value: realEstateValue ? parseFloat(realEstateValue) : null,
        has_equipment: hasEquipment,
        equipment_value: equipmentValue ? parseFloat(equipmentValue) : null,
        equipment_description: equipmentDescription || null,
        has_intellectual_property: hasIntellectualProperty,
        ip_description: ipDescription || null,
        has_licenses_permits: hasLicensesPermits,
        licenses_description: licensesDescription || null,
        has_lease: hasLease,
        lease_monthly_cost: leaseMonthlyCost ? parseFloat(leaseMonthlyCost) : null,
        lease_expiry: leaseExpiry || null,
        active_customer_count: activeCustomerCount ? parseInt(activeCustomerCount) : null,
        top_customer_count: topCustomerCount ? parseInt(topCustomerCount) : null,
        longest_customer_relationship: longestCustomerRelationship
          ? parseInt(longestCustomerRelationship)
          : null,
        avg_customer_relationship: avgCustomerRelationship
          ? parseInt(avgCustomerRelationship)
          : null,
        is_seasonal: isSeasonal,
        seasonal_description: seasonalDescription || null,
        seller_financing_available: sellerFinancingAvailable,
        seller_financing_details: sellerFinancingDetails || null,
        training_included: trainingIncluded,
        training_description: trainingDescription || null,
        non_compete_willing: nonCompeteWilling,
        transition_period: transitionPeriod || null,
        reason_for_sale_detail: reasonForSaleDetail || null,
      }

      const res = await fetch(`/api/seller/profile/${listing.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (res.ok) {
        setSaveMessage("Profile saved!")
        setTimeout(() => setSaveMessage(""), 3000)
      } else {
        setSaveMessage("Failed to save. Please try again.")
        setTimeout(() => setSaveMessage(""), 3000)
      }
    } catch {
      setSaveMessage("Failed to save. Please try again.")
      setTimeout(() => setSaveMessage(""), 3000)
    } finally {
      setSaving(false)
    }
  }

  const inputClass =
    "w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900 transition-colors"
  const textareaClass =
    "w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900 transition-colors resize-none"

  const colorClasses: Record<string, { bar: string; badge: string }> = {
    emerald: { bar: "bg-emerald-500", badge: "bg-emerald-50 text-emerald-700 border-emerald-200" },
    amber: { bar: "bg-amber-500", badge: "bg-amber-50 text-amber-700 border-amber-200" },
    slate: { bar: "bg-slate-400", badge: "bg-slate-50 text-slate-600 border-slate-200" },
  }

  const colors = colorClasses[completenessColor] ?? colorClasses.slate

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="mb-8">
          <a href="/dashboard" className="text-sm text-slate-400 hover:text-slate-600 transition-colors">
            ← Back to dashboard
          </a>
          <h1 className="font-serif text-3xl font-bold text-slate-900 mt-3">
            Edit Business Profile
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            A complete profile attracts more serious buyers.
          </p>
        </div>

        <div className="grid lg:grid-cols-[240px_1fr] gap-8 items-start">
          {/* Sidebar */}
          <div className="lg:sticky lg:top-8 space-y-6">
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">
                Profile Completeness
              </p>
              <div className="mb-3">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-2xl font-bold text-slate-900">{completeness}%</span>
                  <span
                    className={`text-xs font-medium px-2 py-0.5 rounded-md border ${colors.badge}`}
                  >
                    {completenessLabelText}
                  </span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${colors.bar}`}
                    style={{ width: `${completeness}%` }}
                  />
                </div>
              </div>
            </div>

            <nav className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-1">
              {sections.map((s) => (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  className="block text-sm text-slate-600 hover:text-blue-900 hover:bg-blue-50 px-3 py-2 rounded-lg transition-colors"
                  onClick={(e) => {
                    e.preventDefault()
                    document.getElementById(s.id)?.scrollIntoView({ behavior: "smooth" })
                  }}
                >
                  {s.label}
                </a>
              ))}
            </nav>
          </div>

          {/* Form */}
          <div className="space-y-8 pb-24">
            {/* Section 1: Business Overview */}
            <section
              id="overview"
              className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm"
            >
              <SectionHeader
                title="Business Overview"
                onAiSuggest={() => handleAiSuggest("Business Overview", overviewSummary())}
                suggesting={!!suggesting.overview || !!suggesting["Business Overview"]}
              />

              {suggestions["Business Overview"] && (
                <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">
                  <p className="text-xs font-semibold text-blue-900 mb-2 uppercase tracking-widest">
                    AI Suggestions
                  </p>
                  {suggestions["Business Overview"]}
                </div>
              )}

              <div className="space-y-6">
                <Field label="Tagline">
                  <input
                    type="text"
                    value={tagline}
                    onChange={(e) => setTagline(e.target.value)}
                    placeholder="e.g. Profitable plumbing company serving Hamilton for 20 years"
                    className={inputClass}
                  />
                </Field>

                <Field label="Year Founded">
                  <input
                    type="number"
                    value={foundedYear}
                    onChange={(e) => setFoundedYear(e.target.value)}
                    placeholder="e.g. 2005"
                    className={inputClass}
                  />
                </Field>

                <Field label="Business Model">
                  <ButtonGroup
                    options={["B2B", "B2C", "Both"]}
                    value={businessModel}
                    onChange={setBusinessModel}
                  />
                </Field>

                <Field label="Revenue Type">
                  <ButtonGroup
                    options={["Project-based", "Recurring/subscription", "Mixed"]}
                    value={revenueType}
                    onChange={setRevenueType}
                  />
                </Field>

                <Field label={`Recurring Revenue: ${recurringRevenuePercent}%`}>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={recurringRevenuePercent}
                    onChange={(e) => setRecurringRevenuePercent(parseInt(e.target.value))}
                    className="w-full accent-blue-900"
                  />
                </Field>

                <Field label="Competitive Advantages">
                  <textarea
                    value={competitiveAdvantages}
                    onChange={(e) => setCompetitiveAdvantages(e.target.value)}
                    rows={4}
                    className={textareaClass}
                  />
                </Field>

                <Field label="Growth Opportunities">
                  <textarea
                    value={growthOpportunities}
                    onChange={(e) => setGrowthOpportunities(e.target.value)}
                    rows={4}
                    className={textareaClass}
                  />
                </Field>
              </div>
            </section>

            {/* Section 2: Team & Operations */}
            <section
              id="operations"
              className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm"
            >
              <SectionHeader
                title="Team & Operations"
                onAiSuggest={() => handleAiSuggest("Team & Operations", operationsSummary())}
                suggesting={!!suggesting["Team & Operations"]}
              />

              {suggestions["Team & Operations"] && (
                <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">
                  <p className="text-xs font-semibold text-blue-900 mb-2 uppercase tracking-widest">
                    AI Suggestions
                  </p>
                  {suggestions["Team & Operations"]}
                </div>
              )}

              <div className="space-y-6">
                <Field label="Total Employees">
                  <input
                    type="number"
                    value={employeeCount}
                    onChange={(e) => setEmployeeCount(e.target.value)}
                    min={0}
                    className={inputClass}
                  />
                </Field>

                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="Full-time">
                    <input
                      type="number"
                      value={fullTimeEmployees}
                      onChange={(e) => setFullTimeEmployees(e.target.value)}
                      min={0}
                      className={inputClass}
                    />
                  </Field>
                  <Field label="Part-time">
                    <input
                      type="number"
                      value={partTimeEmployees}
                      onChange={(e) => setPartTimeEmployees(e.target.value)}
                      min={0}
                      className={inputClass}
                    />
                  </Field>
                </div>

                <Field label={`Owner Hours/Week: ${ownerHoursPerWeek} hrs`}>
                  <input
                    type="range"
                    min={0}
                    max={80}
                    value={ownerHoursPerWeek}
                    onChange={(e) => setOwnerHoursPerWeek(parseInt(e.target.value))}
                    className="w-full accent-blue-900"
                  />
                </Field>

                <Field label="Key Person Dependencies">
                  <textarea
                    value={keyPersonDependencies}
                    onChange={(e) => setKeyPersonDependencies(e.target.value)}
                    rows={3}
                    placeholder="Who besides the owner is critical to operations?"
                    className={textareaClass}
                  />
                </Field>

                <Field label="Systems & Processes">
                  <textarea
                    value={systemsAndProcesses}
                    onChange={(e) => setSystemsAndProcesses(e.target.value)}
                    rows={3}
                    placeholder="What software, systems, or processes does the business run on?"
                    className={textareaClass}
                  />
                </Field>
              </div>
            </section>

            {/* Section 3: Assets & Liabilities */}
            <section
              id="assets"
              className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm"
            >
              <SectionHeader
                title="Assets & Liabilities"
                onAiSuggest={() => handleAiSuggest("Assets & Liabilities", assetsSummary())}
                suggesting={!!suggesting["Assets & Liabilities"]}
              />

              {suggestions["Assets & Liabilities"] && (
                <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">
                  <p className="text-xs font-semibold text-blue-900 mb-2 uppercase tracking-widest">
                    AI Suggestions
                  </p>
                  {suggestions["Assets & Liabilities"]}
                </div>
              )}

              <div className="space-y-6">
                <Field label="Real Estate Included">
                  <YesNo value={realEstateIncluded} onChange={setRealEstateIncluded} />
                  {realEstateIncluded && (
                    <SubFields>
                      <Field label="Estimated Value ($)">
                        <input
                          type="number"
                          value={realEstateValue}
                          onChange={(e) => setRealEstateValue(e.target.value)}
                          min={0}
                          className={inputClass}
                        />
                      </Field>
                    </SubFields>
                  )}
                </Field>

                <Field label="Equipment Included">
                  <YesNo value={hasEquipment} onChange={setHasEquipment} />
                  {hasEquipment && (
                    <SubFields>
                      <Field label="Estimated Value ($)">
                        <input
                          type="number"
                          value={equipmentValue}
                          onChange={(e) => setEquipmentValue(e.target.value)}
                          min={0}
                          className={inputClass}
                        />
                      </Field>
                      <Field label="Description">
                        <textarea
                          value={equipmentDescription}
                          onChange={(e) => setEquipmentDescription(e.target.value)}
                          rows={3}
                          className={textareaClass}
                        />
                      </Field>
                    </SubFields>
                  )}
                </Field>

                <Field label="Intellectual Property">
                  <YesNo
                    value={hasIntellectualProperty}
                    onChange={setHasIntellectualProperty}
                  />
                  {hasIntellectualProperty && (
                    <SubFields>
                      <Field label="Description">
                        <textarea
                          value={ipDescription}
                          onChange={(e) => setIpDescription(e.target.value)}
                          rows={3}
                          className={textareaClass}
                        />
                      </Field>
                    </SubFields>
                  )}
                </Field>

                <Field label="Licenses & Permits">
                  <YesNo value={hasLicensesPermits} onChange={setHasLicensesPermits} />
                  {hasLicensesPermits && (
                    <SubFields>
                      <Field label="Description">
                        <textarea
                          value={licensesDescription}
                          onChange={(e) => setLicensesDescription(e.target.value)}
                          rows={3}
                          className={textareaClass}
                        />
                      </Field>
                    </SubFields>
                  )}
                </Field>

                <Field label="Lease">
                  <YesNo value={hasLease} onChange={setHasLease} />
                  {hasLease && (
                    <SubFields>
                      <Field label="Monthly Cost ($)">
                        <input
                          type="number"
                          value={leaseMonthlyCost}
                          onChange={(e) => setLeaseMonthlyCost(e.target.value)}
                          min={0}
                          className={inputClass}
                        />
                      </Field>
                      <Field label="Lease Expiry">
                        <input
                          type="text"
                          value={leaseExpiry}
                          onChange={(e) => setLeaseExpiry(e.target.value)}
                          placeholder="e.g. Dec 2027"
                          className={inputClass}
                        />
                      </Field>
                    </SubFields>
                  )}
                </Field>
              </div>
            </section>

            {/* Section 4: Customers & Revenue */}
            <section
              id="customers"
              className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm"
            >
              <SectionHeader
                title="Customers & Revenue"
                onAiSuggest={() => handleAiSuggest("Customers & Revenue", customersSummary())}
                suggesting={!!suggesting["Customers & Revenue"]}
              />

              {suggestions["Customers & Revenue"] && (
                <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">
                  <p className="text-xs font-semibold text-blue-900 mb-2 uppercase tracking-widest">
                    AI Suggestions
                  </p>
                  {suggestions["Customers & Revenue"]}
                </div>
              )}

              <div className="space-y-6">
                <Field label="Active Customers">
                  <input
                    type="number"
                    value={activeCustomerCount}
                    onChange={(e) => setActiveCustomerCount(e.target.value)}
                    min={0}
                    className={inputClass}
                  />
                </Field>

                <Field
                  label="Top Customer Concentration"
                  hint="How many customers make up 50% of your revenue?"
                >
                  <input
                    type="number"
                    value={topCustomerCount}
                    onChange={(e) => setTopCustomerCount(e.target.value)}
                    min={0}
                    className={inputClass}
                  />
                </Field>

                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="Longest Customer Relationship (years)">
                    <input
                      type="number"
                      value={longestCustomerRelationship}
                      onChange={(e) => setLongestCustomerRelationship(e.target.value)}
                      min={0}
                      className={inputClass}
                    />
                  </Field>
                  <Field label="Avg Customer Relationship (years)">
                    <input
                      type="number"
                      value={avgCustomerRelationship}
                      onChange={(e) => setAvgCustomerRelationship(e.target.value)}
                      min={0}
                      className={inputClass}
                    />
                  </Field>
                </div>

                <Field label="Seasonal Business">
                  <YesNo value={isSeasonal} onChange={setIsSeasonal} />
                  {isSeasonal && (
                    <SubFields>
                      <Field label="Describe peak season">
                        <textarea
                          value={seasonalDescription}
                          onChange={(e) => setSeasonalDescription(e.target.value)}
                          rows={3}
                          className={textareaClass}
                        />
                      </Field>
                    </SubFields>
                  )}
                </Field>
              </div>
            </section>

            {/* Section 5: Deal Terms */}
            <section
              id="deal"
              className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm"
            >
              <SectionHeader
                title="Deal Terms"
                onAiSuggest={() => handleAiSuggest("Deal Terms", dealSummary())}
                suggesting={!!suggesting["Deal Terms"]}
              />

              {suggestions["Deal Terms"] && (
                <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">
                  <p className="text-xs font-semibold text-blue-900 mb-2 uppercase tracking-widest">
                    AI Suggestions
                  </p>
                  {suggestions["Deal Terms"]}
                </div>
              )}

              <div className="space-y-6">
                <Field label="Seller Financing Available">
                  <YesNo
                    value={sellerFinancingAvailable}
                    onChange={setSellerFinancingAvailable}
                  />
                  {sellerFinancingAvailable && (
                    <SubFields>
                      <Field label="Describe terms">
                        <textarea
                          value={sellerFinancingDetails}
                          onChange={(e) => setSellerFinancingDetails(e.target.value)}
                          rows={3}
                          className={textareaClass}
                        />
                      </Field>
                    </SubFields>
                  )}
                </Field>

                <Field label="Training Included">
                  <YesNo value={trainingIncluded} onChange={setTrainingIncluded} />
                  {trainingIncluded && (
                    <SubFields>
                      <Field label="Describe training">
                        <textarea
                          value={trainingDescription}
                          onChange={(e) => setTrainingDescription(e.target.value)}
                          rows={3}
                          className={textareaClass}
                        />
                      </Field>
                    </SubFields>
                  )}
                </Field>

                <Field label="Willing to Sign Non-Compete">
                  <YesNo value={nonCompeteWilling} onChange={setNonCompeteWilling} />
                </Field>

                <Field label="Transition Period">
                  <input
                    type="text"
                    value={transitionPeriod}
                    onChange={(e) => setTransitionPeriod(e.target.value)}
                    placeholder="e.g. 3 months"
                    className={inputClass}
                  />
                </Field>

                <Field label="Reason for Sale (detailed)">
                  <textarea
                    value={reasonForSaleDetail}
                    onChange={(e) => setReasonForSaleDetail(e.target.value)}
                    rows={4}
                    className={textareaClass}
                  />
                </Field>
              </div>
            </section>
          </div>
        </div>
      </div>

      {/* Sticky save bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 shadow-lg z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-2 w-24 bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-300 ${colors.bar}`}
                style={{ width: `${completeness}%` }}
              />
            </div>
            <span className="text-sm text-slate-500">{completeness}% complete</span>
          </div>
          <div className="flex items-center gap-4">
            {saveMessage && (
              <span
                className={`text-sm font-medium ${
                  saveMessage.includes("saved") ? "text-emerald-600" : "text-red-600"
                }`}
              >
                {saveMessage}
              </span>
            )}
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="bg-blue-900 hover:bg-blue-800 text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {saving && (
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              )}
              {saving ? "Saving..." : "Save Profile"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
