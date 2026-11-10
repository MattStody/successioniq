-- Admin read access to captured valuation leads.
--
-- email_leads is otherwise write-only (anyone may INSERT a lead from the public
-- valuation funnel, nobody may read them back). This grants SELECT only to the
-- FairMark admin, identified by the email on their authenticated JWT, so the
-- in-app /admin/leads dashboard can list signups. The app uses only the anon
-- key, so RLS is the entire boundary — this policy is what makes those rows
-- readable, and only to the admin.
create policy "Admin can read email leads"
  on public.email_leads
  for select
  using ((auth.jwt() ->> 'email') = 'matt@boldlymedia.com');
