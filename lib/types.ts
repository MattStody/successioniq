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
  contact_email: string;
  key_value_drivers: string[];
  key_risks: string[];
  user_id: string | null;
  broker_id: string | null;
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
