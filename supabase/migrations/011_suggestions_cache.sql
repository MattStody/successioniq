CREATE TABLE IF NOT EXISTS suggestions_cache (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  industry text NOT NULL,
  section text NOT NULL,
  suggestions jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS suggestions_cache_industry_section_idx
  ON suggestions_cache (industry, section);

ALTER TABLE suggestions_cache ENABLE ROW LEVEL SECURITY;

CREATE POLICY "authenticated_read_suggestions_cache"
  ON suggestions_cache FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "authenticated_insert_suggestions_cache"
  ON suggestions_cache FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE POLICY "authenticated_update_suggestions_cache"
  ON suggestions_cache FOR UPDATE TO authenticated
  USING (true);
