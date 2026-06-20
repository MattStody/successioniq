-- 014_security_hardening.sql
-- Pre-launch RLS hardening. The app uses ONLY the Supabase anon key (no
-- service-role key), so RLS is the entire security boundary. This migration
-- closes the data-exposure / privilege-escalation gaps found in the audit.
--
-- IMPORTANT: apply this in a staging Supabase project and smoke-test the auth,
-- buyer-profile, valuation and listing flows before running it in production.
--
-- NOT covered here (tracked separately): listings.contact_email is still
-- column-readable for active listings via PostgREST. The fix is to move it to a
-- dedicated listing_contacts table gated by an NDA — see SECURITY_AUDIT.md.

-- ───────────────────────────────────────────────────────────────────────────
-- 1. Lock down the broker role (privilege escalation)
--    Clients may self-select only 'seller' / 'buyer'. 'broker' must be granted
--    by a privileged DB role (Supabase dashboard / CLI), never through the
--    anon/authenticated API. SECURITY INVOKER so current_user is the real caller.
-- ───────────────────────────────────────────────────────────────────────────
create or replace function public.enforce_profile_role()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.role is null or new.role not in ('seller', 'buyer', 'broker') then
    new.role := coalesce(old.role, 'seller');
  end if;

  if new.role = 'broker'
     and (tg_op = 'INSERT' or old.role is distinct from 'broker')
     and current_user not in ('postgres', 'supabase_admin', 'service_role') then
    raise exception 'The broker role cannot be self-assigned';
  end if;

  return new;
end;
$$;

drop trigger if exists profiles_enforce_role on public.profiles;
create trigger profiles_enforce_role
  before insert or update on public.profiles
  for each row execute function public.enforce_profile_role();

-- Explicit WITH CHECK on the profiles UPDATE policy (defense in depth).
drop policy if exists "Users can update their own profile" on public.profiles;
create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- ───────────────────────────────────────────────────────────────────────────
-- 2. Valuations: private to owner only (were world-readable by default)
-- ───────────────────────────────────────────────────────────────────────────
drop policy if exists "Anyone can view public valuations" on public.valuations;
-- The only remaining SELECT policy is the 002 owner policy
-- (auth.uid() = user_id), so anonymous / other users can no longer read them.

-- Keep the column for future opt-in sharing, but stop defaulting it on.
alter table public.valuations alter column is_public set default false;

-- ───────────────────────────────────────────────────────────────────────────
-- 3. Buyer profiles: hide PII (email / phone). Owners read their own full row;
--    everyone else sees only non-PII fields through a curated view.
-- ───────────────────────────────────────────────────────────────────────────
drop policy if exists "Authenticated users can view buyer profiles" on public.buyer_profiles;
create policy "Users can view own buyer profile"
  on public.buyer_profiles for select
  using (auth.uid() = id);

-- Definer view (bypasses base RLS) exposing ONLY non-PII columns for the
-- public buyer-profile pages — no email, phone, or notification preferences.
create or replace view public.buyer_public_profiles as
  select id, full_name, buyer_type, acquisition_type, capital_min, capital_max,
         preferred_industries, preferred_countries, preferred_regions,
         experience_years, background_summary, is_verified, created_at
  from public.buyer_profiles;

grant select on public.buyer_public_profiles to authenticated;

-- ───────────────────────────────────────────────────────────────────────────
-- 4. Listings: stop exposing non-active (draft / under_offer / sold) rows to
--    the public. Owners still see their own listings in any status.
-- ───────────────────────────────────────────────────────────────────────────
drop policy if exists public_can_read_listings on public.listings;
create policy public_can_read_listings
  on public.listings for select
  to anon, authenticated
  using (status = 'active' or auth.uid() = user_id);

-- ───────────────────────────────────────────────────────────────────────────
-- 5. Harden SECURITY DEFINER functions with a fixed search_path
-- ───────────────────────────────────────────────────────────────────────────
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, email, role)
  values (new.id, new.email, 'seller');
  return new;
end;
$$;

create or replace function public.increment_valuation_view(token text)
returns void
language sql
security definer
set search_path = ''
as $$
  update public.valuations
  set view_count = view_count + 1
  where share_token = token and is_public = true;
$$;
