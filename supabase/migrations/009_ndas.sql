CREATE TABLE IF NOT EXISTS ndas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  listing_id uuid NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  buyer_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  email text NOT NULL,
  UNIQUE(listing_id, buyer_id)
);

ALTER TABLE ndas ENABLE ROW LEVEL SECURITY;

-- Any authenticated user can sign an NDA
CREATE POLICY "authenticated_can_sign_nda"
  ON ndas FOR INSERT TO authenticated
  WITH CHECK (buyer_id = auth.uid());

-- Buyers can see their own NDAs
CREATE POLICY "buyers_see_own_ndas"
  ON ndas FOR SELECT TO authenticated
  USING (buyer_id = auth.uid());

-- Listing owners and brokers can see NDAs on their listings
CREATE POLICY "owners_and_brokers_see_ndas"
  ON ndas FOR SELECT TO authenticated
  USING (
    listing_id IN (
      SELECT id FROM listings
      WHERE user_id = auth.uid() OR broker_id = auth.uid()
    )
  );
