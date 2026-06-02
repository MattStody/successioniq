CREATE TABLE IF NOT EXISTS email_leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  email text NOT NULL,
  source text NOT NULL DEFAULT 'valuation_gate',
  industry text,
  country text,
  region text,
  valuation_id uuid REFERENCES valuations(id) ON DELETE SET NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS email_leads_email_idx ON email_leads(email);

ALTER TABLE email_leads ENABLE ROW LEVEL SECURITY;

-- Allow anyone to submit their email (anon visitors included)
CREATE POLICY "anyone_can_insert_email_leads"
  ON email_leads FOR INSERT TO anon, authenticated
  WITH CHECK (true);
