-- 015_listing_contacts.sql
-- Closes the last P0: listings.contact_email was column-readable by anon via
-- PostgREST despite the NDA UI. Move it into a dedicated table that is NOT
-- publicly readable, and expose it to buyers only through an NDA-gated
-- SECURITY DEFINER function.
--
-- IMPORTANT: apply in a staging Supabase project and smoke-test listing
-- creation, the NDA reveal, and broker bulk upload before production. This
-- migration DROPS listings.contact_email — back up first.

create table if not exists public.listing_contacts (
  listing_id uuid primary key references public.listings(id) on delete cascade,
  contact_email text not null
);

alter table public.listing_contacts enable row level security;

-- Only the listing's owner can read/write its contact row directly.
drop policy if exists owner_rw_listing_contacts on public.listing_contacts;
create policy owner_rw_listing_contacts on public.listing_contacts
  for all
  using (
    listing_id in (select id from public.listings where user_id = auth.uid())
  )
  with check (
    listing_id in (select id from public.listings where user_id = auth.uid())
  );

-- Buyers get the email only after signing an NDA (owners always can).
create or replace function public.reveal_listing_contact(p_listing_id uuid)
returns text
language sql
security definer
set search_path = ''
as $$
  select c.contact_email
  from public.listing_contacts c
  where c.listing_id = p_listing_id
    and (
      exists (
        select 1 from public.listings l
        where l.id = p_listing_id and l.user_id = auth.uid()
      )
      or exists (
        select 1 from public.ndas n
        where n.listing_id = p_listing_id and n.buyer_id = auth.uid()
      )
    );
$$;

grant execute on function public.reveal_listing_contact(uuid) to authenticated;

-- Backfill existing emails, then drop the publicly-exposed column.
insert into public.listing_contacts (listing_id, contact_email)
  select id, contact_email from public.listings
  where contact_email is not null
  on conflict (listing_id) do nothing;

alter table public.listings drop column if exists contact_email;
