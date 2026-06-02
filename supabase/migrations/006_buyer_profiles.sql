-- buyer_profiles: one-to-one with auth.users (like the profiles table)
CREATE TABLE buyer_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  capital_min NUMERIC NOT NULL DEFAULT 0,
  capital_max NUMERIC NOT NULL DEFAULT 0,
  preferred_industries TEXT[] NOT NULL DEFAULT '{}',
  preferred_countries TEXT[] NOT NULL DEFAULT '{}',
  preferred_regions TEXT[],
  experience_years INTEGER NOT NULL DEFAULT 0,
  acquisition_type TEXT NOT NULL DEFAULT 'either',
  buyer_type TEXT NOT NULL DEFAULT 'individual',
  background_summary TEXT,
  is_verified BOOLEAN NOT NULL DEFAULT false,
  notification_preferences JSONB NOT NULL DEFAULT '{"new_matches": true, "price_changes": true, "weekly_digest": true}'
);

ALTER TABLE buyer_profiles ENABLE ROW LEVEL SECURITY;

-- Only the owner can insert their own profile
CREATE POLICY "Users can insert own buyer profile" ON buyer_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Only the owner can update their own profile
CREATE POLICY "Users can update own buyer profile" ON buyer_profiles
  FOR UPDATE USING (auth.uid() = id);

-- All authenticated users can read buyer profiles (for public profile pages and seller visibility)
CREATE POLICY "Authenticated users can view buyer profiles" ON buyer_profiles
  FOR SELECT USING (auth.role() = 'authenticated');


-- listing_matches: AI-generated match scores cached per buyer
CREATE TABLE listing_matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  buyer_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  match_score INTEGER NOT NULL CHECK (match_score >= 0 AND match_score <= 100),
  match_reason TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(listing_id, buyer_id)
);

ALTER TABLE listing_matches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Buyers can read own matches" ON listing_matches
  FOR SELECT USING (auth.uid() = buyer_id);

CREATE POLICY "Buyers can insert own matches" ON listing_matches
  FOR INSERT WITH CHECK (auth.uid() = buyer_id);

CREATE POLICY "Buyers can update own matches" ON listing_matches
  FOR UPDATE USING (auth.uid() = buyer_id);


-- saved_listings: buyer bookmarks
CREATE TABLE saved_listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  buyer_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(buyer_id, listing_id)
);

ALTER TABLE saved_listings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Buyers can view own saved listings" ON saved_listings
  FOR SELECT USING (auth.uid() = buyer_id);

CREATE POLICY "Buyers can save listings" ON saved_listings
  FOR INSERT WITH CHECK (auth.uid() = buyer_id);

CREATE POLICY "Buyers can delete own saved listings" ON saved_listings
  FOR DELETE USING (auth.uid() = buyer_id);
