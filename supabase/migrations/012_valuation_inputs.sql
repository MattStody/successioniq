ALTER TABLE valuations
  ADD COLUMN IF NOT EXISTS revenue_trend text,
  ADD COLUMN IF NOT EXISTS owner_dependency integer,
  ADD COLUMN IF NOT EXISTS customer_concentration text,
  ADD COLUMN IF NOT EXISTS reason_for_selling text,
  ADD COLUMN IF NOT EXISTS asking_price numeric;
