export type ListingStatus = "draft" | "active" | "under_offer" | "sold";
export type UserRole = "seller" | "buyer" | "broker";
export type AcquisitionType = "full_acquisition" | "partial_stake" | "either";
export type BuyerType = "individual" | "search_fund" | "private_equity" | "strategic";

export interface Listing {
  id: string;
  created_at: string;
  status: ListingStatus;
  is_anonymous: boolean;
  business_name: string | null;
  industry: string;
  country: string;
  region: string;
  annual_revenue: number;
  annual_profit: number;
  years_operating: number;
  asking_price: number | null;
  valuation_low: number;
  valuation_mid: number;
  valuation_high: number;
  description: string;
  whats_included: string;
  transition_period: string;
  preferred_buyer: string;
  /** Stored in the protected listing_contacts table, not on listings — see
   *  migration 015. Revealed to buyers via reveal_listing_contact() post-NDA. */
  contact_email?: string;
  key_value_drivers: string[];
  key_risks: string[];
  user_id: string | null;
  broker_id: string | null;
  tagline?: string | null;
  founded_year?: number | null;
  business_model?: string | null;
  revenue_type?: string | null;
  recurring_revenue_percent?: number | null;
  competitive_advantages?: string | null;
  growth_opportunities?: string | null;
  employee_count?: number | null;
  full_time_employees?: number | null;
  part_time_employees?: number | null;
  owner_hours_per_week?: number | null;
  key_person_dependencies?: string | null;
  systems_and_processes?: string | null;
  real_estate_included?: boolean | null;
  real_estate_value?: number | null;
  has_equipment?: boolean | null;
  equipment_value?: number | null;
  equipment_description?: string | null;
  has_intellectual_property?: boolean | null;
  ip_description?: string | null;
  has_licenses_permits?: boolean | null;
  licenses_description?: string | null;
  has_lease?: boolean | null;
  lease_monthly_cost?: number | null;
  lease_expiry?: string | null;
  active_customer_count?: number | null;
  top_customer_count?: number | null;
  longest_customer_relationship?: number | null;
  avg_customer_relationship?: number | null;
  is_seasonal?: boolean | null;
  seasonal_description?: string | null;
  seller_financing_available?: boolean | null;
  seller_financing_details?: string | null;
  training_included?: boolean | null;
  training_description?: string | null;
  non_compete_willing?: boolean | null;
  reason_for_sale_detail?: string | null;
  profile_completeness?: number | null;
  // Snapshot financials (migration 013). Margin / multiple / growth are derived.
  ebitda?: number | null;
  adjusted_ebitda?: number | null;
  sde?: number | null;
  gross_profit?: number | null;
  revenue_prior_year?: number | null;
  ebitda_prior_year?: number | null;
  mrr?: number | null;
  arr?: number | null;
  customer_concentration_percent?: number | null;
}

export interface Valuation {
  id: string;
  created_at: string;
  user_id: string | null;
  industry: string;
  country: string;
  region: string;
  annual_revenue: number;
  annual_profit: number;
  years_operating: number;
  valuation_low: number;
  valuation_mid: number;
  valuation_high: number;
  primary_method: string;
  multiple_applied: number;
  confidence: string;
  summary: string;
  key_value_drivers: string[];
  key_risks: string[];
  share_token: string | null;
  is_public: boolean;
  view_count: number;
  title: string | null;
}

export interface Profile {
  id: string;
  created_at: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  role: UserRole;
  notification_preferences: {
    new_buyers: boolean;
    valuation_reminders: boolean;
    listing_updates: boolean;
  };
}

export interface Broker {
  id: string;
  created_at: string;
  agency_name: string;
  license_number: string | null;
  phone: string;
  website: string | null;
  verified: boolean;
}

export interface BuyerProfile {
  id: string;
  created_at: string;
  full_name: string;
  email: string;
  phone: string | null;
  capital_min: number;
  capital_max: number;
  preferred_industries: string[];
  preferred_countries: string[];
  preferred_regions: string[] | null;
  experience_years: number;
  acquisition_type: AcquisitionType;
  buyer_type: BuyerType;
  background_summary: string | null;
  is_verified: boolean;
  notification_preferences: {
    new_matches: boolean;
    price_changes: boolean;
    weekly_digest: boolean;
  };
}

export interface ListingMatch {
  id: string;
  listing_id: string;
  buyer_id: string;
  match_score: number;
  match_reason: string;
  created_at: string;
  updated_at: string;
}

export interface SavedListing {
  id: string;
  buyer_id: string;
  listing_id: string;
  created_at: string;
}
