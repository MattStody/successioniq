ALTER TABLE listings
  ADD COLUMN IF NOT EXISTS tagline TEXT,
  ADD COLUMN IF NOT EXISTS founded_year INTEGER,
  ADD COLUMN IF NOT EXISTS business_model TEXT,
  ADD COLUMN IF NOT EXISTS revenue_type TEXT,
  ADD COLUMN IF NOT EXISTS recurring_revenue_percent INTEGER,
  ADD COLUMN IF NOT EXISTS competitive_advantages TEXT,
  ADD COLUMN IF NOT EXISTS growth_opportunities TEXT,
  ADD COLUMN IF NOT EXISTS employee_count INTEGER,
  ADD COLUMN IF NOT EXISTS full_time_employees INTEGER,
  ADD COLUMN IF NOT EXISTS part_time_employees INTEGER,
  ADD COLUMN IF NOT EXISTS owner_hours_per_week INTEGER,
  ADD COLUMN IF NOT EXISTS key_person_dependencies TEXT,
  ADD COLUMN IF NOT EXISTS systems_and_processes TEXT,
  ADD COLUMN IF NOT EXISTS real_estate_included BOOLEAN,
  ADD COLUMN IF NOT EXISTS real_estate_value NUMERIC,
  ADD COLUMN IF NOT EXISTS has_equipment BOOLEAN,
  ADD COLUMN IF NOT EXISTS equipment_value NUMERIC,
  ADD COLUMN IF NOT EXISTS equipment_description TEXT,
  ADD COLUMN IF NOT EXISTS has_intellectual_property BOOLEAN,
  ADD COLUMN IF NOT EXISTS ip_description TEXT,
  ADD COLUMN IF NOT EXISTS has_licenses_permits BOOLEAN,
  ADD COLUMN IF NOT EXISTS licenses_description TEXT,
  ADD COLUMN IF NOT EXISTS has_lease BOOLEAN,
  ADD COLUMN IF NOT EXISTS lease_monthly_cost NUMERIC,
  ADD COLUMN IF NOT EXISTS lease_expiry TEXT,
  ADD COLUMN IF NOT EXISTS active_customer_count INTEGER,
  ADD COLUMN IF NOT EXISTS top_customer_count INTEGER,
  ADD COLUMN IF NOT EXISTS longest_customer_relationship INTEGER,
  ADD COLUMN IF NOT EXISTS avg_customer_relationship INTEGER,
  ADD COLUMN IF NOT EXISTS is_seasonal BOOLEAN,
  ADD COLUMN IF NOT EXISTS seasonal_description TEXT,
  ADD COLUMN IF NOT EXISTS seller_financing_available BOOLEAN,
  ADD COLUMN IF NOT EXISTS seller_financing_details TEXT,
  ADD COLUMN IF NOT EXISTS training_included BOOLEAN,
  ADD COLUMN IF NOT EXISTS training_description TEXT,
  ADD COLUMN IF NOT EXISTS non_compete_willing BOOLEAN,
  ADD COLUMN IF NOT EXISTS reason_for_sale_detail TEXT,
  ADD COLUMN IF NOT EXISTS profile_completeness INTEGER DEFAULT 0;

DROP POLICY IF EXISTS owners_can_update_profile ON listings;
CREATE POLICY owners_can_update_profile ON listings
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS public_can_read_listings ON listings;
CREATE POLICY public_can_read_listings ON listings
  FOR SELECT
  TO anon, authenticated
  USING (true);
