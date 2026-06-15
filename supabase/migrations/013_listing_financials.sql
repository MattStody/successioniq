-- Snapshot financial metrics for listings (EBITDA-grade detail, Merge-style).
-- Margin, valuation multiple, and YoY growth are DERIVED in code from these
-- columns plus annual_revenue / asking_price / valuation_mid — not stored.
ALTER TABLE listings
  ADD COLUMN IF NOT EXISTS ebitda NUMERIC,
  ADD COLUMN IF NOT EXISTS adjusted_ebitda NUMERIC,
  ADD COLUMN IF NOT EXISTS sde NUMERIC,
  ADD COLUMN IF NOT EXISTS gross_profit NUMERIC,
  ADD COLUMN IF NOT EXISTS revenue_prior_year NUMERIC,
  ADD COLUMN IF NOT EXISTS ebitda_prior_year NUMERIC,
  ADD COLUMN IF NOT EXISTS mrr NUMERIC,
  ADD COLUMN IF NOT EXISTS arr NUMERIC,
  ADD COLUMN IF NOT EXISTS customer_concentration_percent INTEGER;
