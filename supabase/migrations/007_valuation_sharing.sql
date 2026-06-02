ALTER TABLE valuations
  ADD COLUMN IF NOT EXISTS share_token TEXT UNIQUE,
  ADD COLUMN IF NOT EXISTS is_public BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS shared_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS view_count INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS title TEXT;

CREATE POLICY "Anyone can view public valuations" ON valuations
  FOR SELECT USING (is_public = true);

CREATE POLICY "Users can update own valuations" ON valuations
  FOR UPDATE USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION increment_valuation_view(token TEXT)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
AS $$
  UPDATE valuations
  SET view_count = view_count + 1
  WHERE share_token = token AND is_public = true;
$$;

GRANT EXECUTE ON FUNCTION increment_valuation_view(TEXT) TO anon, authenticated;
