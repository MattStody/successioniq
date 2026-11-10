-- Email notification on every new valuation lead.
--
-- When a genuinely new row lands in email_leads (the capture route upserts with
-- ignoreDuplicates, so a returning visitor re-submitting their email does NOT
-- insert a row and does NOT fire this), send the admin an email via Resend.
--
-- The whole thing runs inside the database using pg_net, so there is no edge
-- function or external worker to deploy. The Resend API key lives in Supabase
-- Vault (encrypted at rest) under the name 'RESEND_API_KEY'. Until that secret
-- is set, the trigger is a safe no-op — and any failure is swallowed so a
-- notification problem can never block a signup.

create extension if not exists pg_net;

create or replace function public.notify_new_lead()
returns trigger
language plpgsql
security definer
set search_path = public, vault, net, extensions
as $$
declare
  v_key text;
  v_location text;
begin
  select decrypted_secret into v_key
  from vault.decrypted_secrets
  where name = 'RESEND_API_KEY'
  limit 1;

  -- Not configured yet: do nothing, let the signup succeed.
  if v_key is null or v_key = '' then
    return new;
  end if;

  v_location := nullif(concat_ws(', ', new.region, new.country), '');

  perform net.http_post(
    url := 'https://api.resend.com/emails',
    headers := jsonb_build_object(
      'Authorization', 'Bearer ' || v_key,
      'Content-Type', 'application/json'
    ),
    body := jsonb_build_object(
      -- onboarding@resend.dev works with no domain setup and only reaches the
      -- Resend account owner's own address. Swap to leads@gofairmark.com once
      -- the gofairmark.com domain is verified in Resend.
      'from', 'FairMark Leads <onboarding@resend.dev>',
      'to', 'matt@boldlymedia.com',
      'subject', 'New FairMark lead: ' || new.email,
      'html',
        '<h2 style="margin:0 0 12px">New valuation lead</h2>'
        || '<p><strong>Email:</strong> ' || new.email || '</p>'
        || '<p><strong>Industry:</strong> ' || coalesce(new.industry, '—') || '</p>'
        || '<p><strong>Location:</strong> ' || coalesce(v_location, '—') || '</p>'
        || '<p><strong>Source:</strong> ' || coalesce(new.source, '—') || '</p>'
        || '<p><strong>Captured:</strong> ' || to_char(new.created_at, 'Mon DD, YYYY HH24:MI') || ' UTC</p>'
        || '<p style="margin-top:16px"><a href="https://gofairmark.com/admin/leads">View all leads →</a></p>'
    )
  );

  return new;
exception
  when others then
    -- Never let a notification failure roll back a lead capture.
    return new;
end;
$$;

drop trigger if exists trg_notify_new_lead on public.email_leads;
create trigger trg_notify_new_lead
  after insert on public.email_leads
  for each row
  execute function public.notify_new_lead();
