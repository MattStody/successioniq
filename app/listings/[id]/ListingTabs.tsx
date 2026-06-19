"use client"

import { useState } from "react"
import { Listing } from "@/lib/types"

function fmtCurrency(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `$${Math.round(n / 1_000)}K`
  return `$${n.toLocaleString()}`
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4">
        {title}
      </p>
      {children}
    </div>
  )
}

function YesNoBadge({ value }: { value: boolean }) {
  return (
    <span
      className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-md border ${
        value
          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
          : "bg-slate-50 text-slate-500 border-slate-200"
      }`}
    >
      {value ? "Yes" : "No"}
    </span>
  )
}

export default function ListingTabs({
  listing,
  descriptionContent,
  whatsIncludedContent,
  transitionContent,
  preferredBuyerContent,
  valueDriversContent,
  risksContent,
}: {
  listing: Listing
  descriptionContent: React.ReactNode
  whatsIncludedContent: React.ReactNode
  transitionContent: React.ReactNode
  preferredBuyerContent: React.ReactNode
  valueDriversContent: React.ReactNode
  risksContent: React.ReactNode
}) {
  const hasOperations =
    listing.employee_count != null ||
    listing.key_person_dependencies ||
    listing.systems_and_processes ||
    listing.owner_hours_per_week != null

  const hasAssets =
    listing.has_equipment != null ||
    listing.has_intellectual_property != null ||
    listing.real_estate_included != null ||
    listing.has_lease != null

  const hasDealTerms =
    listing.seller_financing_available != null ||
    listing.training_included != null ||
    listing.non_compete_willing != null ||
    listing.reason_for_sale_detail

  const tabs: { id: string; label: string }[] = [{ id: "overview", label: "Overview" }]
  if (hasOperations) tabs.push({ id: "operations", label: "Operations" })
  if (hasAssets) tabs.push({ id: "assets", label: "Assets" })
  if (hasDealTerms) tabs.push({ id: "deal", label: "Deal Terms" })

  const [activeTab, setActiveTab] = useState("overview")

  // Overview content (description, what's included, drivers, risks) generated at
  // listing time. Always render it — even when there are no extra tabs yet, so a
  // freshly-published listing still shows everything.
  const overview = (
    <div className="space-y-6">
      {descriptionContent}
      {whatsIncludedContent}
      <div className="grid sm:grid-cols-2 gap-6">
        {transitionContent}
        {preferredBuyerContent}
      </div>
      <div className="grid sm:grid-cols-2 gap-6">
        {valueDriversContent}
        {risksContent}
      </div>
    </div>
  )

  if (tabs.length === 1) return overview

  return (
    <div>
      {/* Tab bar */}
      <div className="flex gap-1 border-b border-slate-200 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px ${
              activeTab === tab.id
                ? "text-blue-900 border-blue-900"
                : "text-slate-500 border-transparent hover:text-slate-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overview tab */}
      {activeTab === "overview" && overview}

      {/* Operations tab */}
      {activeTab === "operations" && (
        <div className="space-y-6">
          {(listing.employee_count != null || listing.full_time_employees != null || listing.part_time_employees != null) && (
            <Card title="Team Size">
              <div className="grid grid-cols-3 gap-4">
                {listing.employee_count != null && (
                  <div>
                    <div className="text-xs text-slate-400 mb-1">Total</div>
                    <div className="text-xl font-semibold text-slate-900">{listing.employee_count}</div>
                  </div>
                )}
                {listing.full_time_employees != null && (
                  <div>
                    <div className="text-xs text-slate-400 mb-1">Full-time</div>
                    <div className="text-xl font-semibold text-slate-900">{listing.full_time_employees}</div>
                  </div>
                )}
                {listing.part_time_employees != null && (
                  <div>
                    <div className="text-xs text-slate-400 mb-1">Part-time</div>
                    <div className="text-xl font-semibold text-slate-900">{listing.part_time_employees}</div>
                  </div>
                )}
              </div>
            </Card>
          )}

          {listing.owner_hours_per_week != null && (
            <Card title="Owner Involvement">
              <div>
                <div className="text-xs text-slate-400 mb-1">Hours per week</div>
                <div className="text-xl font-semibold text-slate-900">
                  {listing.owner_hours_per_week} hrs/week
                </div>
              </div>
            </Card>
          )}

          {listing.key_person_dependencies && (
            <Card title="Key Person Dependencies">
              <p className="text-slate-600 text-sm leading-relaxed">
                {listing.key_person_dependencies}
              </p>
            </Card>
          )}

          {listing.systems_and_processes && (
            <Card title="Systems & Processes">
              <p className="text-slate-600 text-sm leading-relaxed">
                {listing.systems_and_processes}
              </p>
            </Card>
          )}
        </div>
      )}

      {/* Assets tab */}
      {activeTab === "assets" && (
        <div className="space-y-6">
          {listing.real_estate_included != null && (
            <Card title="Real Estate">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-sm font-medium text-slate-700">Included in sale:</span>
                <YesNoBadge value={listing.real_estate_included} />
              </div>
              {listing.real_estate_included && listing.real_estate_value != null && (
                <div>
                  <div className="text-xs text-slate-400 mb-1">Estimated Value</div>
                  <div className="text-lg font-semibold text-slate-900">
                    {fmtCurrency(listing.real_estate_value)}
                  </div>
                </div>
              )}
            </Card>
          )}

          {listing.has_equipment != null && (
            <Card title="Equipment">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-sm font-medium text-slate-700">Included in sale:</span>
                <YesNoBadge value={listing.has_equipment} />
              </div>
              {listing.has_equipment && (
                <>
                  {listing.equipment_value != null && (
                    <div className="mb-3">
                      <div className="text-xs text-slate-400 mb-1">Estimated Value</div>
                      <div className="text-lg font-semibold text-slate-900">
                        {fmtCurrency(listing.equipment_value)}
                      </div>
                    </div>
                  )}
                  {listing.equipment_description && (
                    <p className="text-slate-600 text-sm leading-relaxed">
                      {listing.equipment_description}
                    </p>
                  )}
                </>
              )}
            </Card>
          )}

          {listing.has_intellectual_property != null && (
            <Card title="Intellectual Property">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-sm font-medium text-slate-700">Included:</span>
                <YesNoBadge value={listing.has_intellectual_property} />
              </div>
              {listing.has_intellectual_property && listing.ip_description && (
                <p className="text-slate-600 text-sm leading-relaxed">{listing.ip_description}</p>
              )}
            </Card>
          )}

          {listing.has_licenses_permits != null && (
            <Card title="Licenses & Permits">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-sm font-medium text-slate-700">Has licenses/permits:</span>
                <YesNoBadge value={listing.has_licenses_permits} />
              </div>
              {listing.has_licenses_permits && listing.licenses_description && (
                <p className="text-slate-600 text-sm leading-relaxed">
                  {listing.licenses_description}
                </p>
              )}
            </Card>
          )}

          {listing.has_lease != null && (
            <Card title="Lease">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-sm font-medium text-slate-700">Has lease:</span>
                <YesNoBadge value={listing.has_lease} />
              </div>
              {listing.has_lease && (
                <div className="grid sm:grid-cols-2 gap-4">
                  {listing.lease_monthly_cost != null && (
                    <div>
                      <div className="text-xs text-slate-400 mb-1">Monthly Cost</div>
                      <div className="text-lg font-semibold text-slate-900">
                        {fmtCurrency(listing.lease_monthly_cost)}/mo
                      </div>
                    </div>
                  )}
                  {listing.lease_expiry && (
                    <div>
                      <div className="text-xs text-slate-400 mb-1">Expiry</div>
                      <div className="text-sm font-semibold text-slate-900">
                        {listing.lease_expiry}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </Card>
          )}
        </div>
      )}

      {/* Deal Terms tab */}
      {activeTab === "deal" && (
        <div className="space-y-6">
          {listing.seller_financing_available != null && (
            <Card title="Seller Financing">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-sm font-medium text-slate-700">Available:</span>
                <YesNoBadge value={listing.seller_financing_available} />
              </div>
              {listing.seller_financing_available && listing.seller_financing_details && (
                <p className="text-slate-600 text-sm leading-relaxed">
                  {listing.seller_financing_details}
                </p>
              )}
            </Card>
          )}

          {listing.training_included != null && (
            <Card title="Training">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-sm font-medium text-slate-700">Included:</span>
                <YesNoBadge value={listing.training_included} />
              </div>
              {listing.training_included && listing.training_description && (
                <p className="text-slate-600 text-sm leading-relaxed">
                  {listing.training_description}
                </p>
              )}
            </Card>
          )}

          {listing.non_compete_willing != null && (
            <Card title="Non-Compete Agreement">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-slate-700">
                  Seller willing to sign:
                </span>
                <YesNoBadge value={listing.non_compete_willing} />
              </div>
            </Card>
          )}

          {listing.reason_for_sale_detail && (
            <Card title="Reason for Sale">
              <p className="text-slate-600 text-sm leading-relaxed">
                {listing.reason_for_sale_detail}
              </p>
            </Card>
          )}
        </div>
      )}
    </div>
  )
}
