export type ListingStatus = "draft" | "active" | "under_offer" | "sold";

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
}
