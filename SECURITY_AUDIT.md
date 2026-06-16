# SuccessionIQ — Pre-Launch Audit

Date: 2026-06-16. Scope: security, correctness, launch-readiness across the
Next.js 16 app, all 14 API routes, and all 13 Supabase migrations.

## Architecture note that drives everything

The app authenticates with **only the Supabase anon key + cookies** — there is
no service-role key anywhere. That means **Postgres RLS is the entire security
boundary**: anyone who has the public anon key (it ships to the browser) can
talk to PostgREST directly and read/write anything RLS allows, regardless of
what the UI does. So permissive policies = open data.

---

## Status summary

| # | Issue | Severity | Status |
|---|-------|----------|--------|
| 1 | Valuations world-readable by default | P0 | ✅ Fixed (mig 014) |
| 2 | Buyer email/phone readable by any logged-in user | P0 | ✅ Fixed (mig 014) |
| 3 | Anyone can self-promote to `broker` | P0 | ✅ Fixed (mig 014 + signup) |
| 4 | `listings.contact_email` scrapable via PostgREST | P0 | ⚠️ **Open — needs mig 015 (see below)** |
| 5 | Draft/sold listings publicly readable | P1 | ✅ Fixed (mig 014) |
| 6 | `SECURITY DEFINER` fns lacked `search_path` | P1 | ✅ Fixed (mig 014) |
| 7 | Bulk-upload body unvalidated / unbounded | P1 | ✅ Fixed |
| 8 | Raw DB errors returned to clients | P1 | ✅ Fixed |
| 9 | `suggestions_cache` writable by any user (poisoning) | P1 | ◻️ Accepted for launch (low impact) |
| 10 | No rate limiting on AI / public endpoints | P1 | ◻️ Recommended (see below) |
| 11 | Listing detail could crash on null arrays | P1 | ✅ Fixed |
| 12 | Dead "SaaS" industry filter | P1 | ✅ Fixed |
| 13 | Build threw without env (module-level client) | P1 | ✅ Fixed |

### False positives ruled out during the audit
- **"Missing `WITH CHECK` lets users reassign ownership."** Not true: for
  `USING (auth.uid() = col)` UPDATE policies, Postgres uses `USING` as the
  `WITH CHECK` when the latter is omitted, so re-homing a row already fails.
- **"NDA route inverts anonymity and leaks the name."** Not true: that handler
  runs *after* recording the NDA; revealing the name post-signature is intended.
- **Build failure (`supabaseUrl is required`)** was env-absence only, not a code
  bug — now also hardened (lazy client) so builds don't depend on env presence.

---

## What was fixed in this pass

**Database — `supabase/migrations/014_security_hardening.sql`** (apply in staging first):
1. **Broker lockdown.** A `before insert/update` trigger on `profiles` rejects
   self-assigning `role = 'broker'` from the anon/authenticated API; brokers are
   provisioned by a privileged DB role. Signup UI no longer offers "Broker".
2. **Valuations private to owner.** Dropped the `is_public = true` public-read
   policy; only the owner policy remains. Default `is_public` flipped to `false`.
3. **Buyer PII hidden.** `buyer_profiles` SELECT is now owner-only; public buyer
   pages read a new `buyer_public_profiles` view that omits email/phone.
4. **Listings draft scope.** Public read restricted to `status = 'active'`
   (owners still see their own in any status).
5. **`search_path` hardening** on `handle_new_user` and `increment_valuation_view`.

**Application code:**
- `lib/supabase.ts` lazy client (build no longer throws without env).
- Bulk-upload: zod validation, 100-row cap, numeric coercion, email validation.
- Buyer-profile: bounded capital, `capital_max >= capital_min`.
- Stopped returning raw DB errors / zod internals to clients.
- Listing detail null-array crash guard; divide-by-zero guards.
- Listings filter aligned to the real industry taxonomy (dead "SaaS" removed).

---

## ⚠️ Remaining launch blocker — Issue #4 (contact_email)

`listings.contact_email` is `NOT NULL` on every row and readable by `anon`, so
a script can pull every seller's email via
`GET /rest/v1/listings?select=contact_email` even though the UI only reveals it
post-NDA. This is the core confidentiality promise of the marketplace.

It is **not** shipped in this pass because the safe fix touches the listing
**write path** and the email is read via `select('*')` in six places — it must
be validated against a real database, which this environment can't do.

**Recommended fix (migration 015 + ~3 code changes):** move the column out of
`listings` into a dedicated table so `select('*')` simply stops returning it.

```sql
-- 015 (draft)
create table listing_contacts (
  listing_id uuid primary key references listings(id) on delete cascade,
  contact_email text not null
);
alter table listing_contacts enable row level security;

create policy owner_rw on listing_contacts for all
  using (listing_id in (select id from listings where user_id = auth.uid()))
  with check (listing_id in (select id from listings where user_id = auth.uid()));

-- NDA-gated read for buyers
create or replace function reveal_listing_contact(p_listing_id uuid)
returns text language sql security definer set search_path = '' as $$
  select c.contact_email from public.listing_contacts c
  where c.listing_id = p_listing_id
    and (
      exists (select 1 from public.listings l
              where l.id = p_listing_id and l.user_id = auth.uid())
      or exists (select 1 from public.ndas n
                 where n.listing_id = p_listing_id and n.buyer_id = auth.uid())
    );
$$;
grant execute on function reveal_listing_contact(uuid) to authenticated;

-- backfill, then drop the exposed column
insert into listing_contacts (listing_id, contact_email)
  select id, contact_email from listings on conflict do nothing;
alter table listings drop column contact_email;
```

Code: create-listing route inserts into `listing_contacts`; the NDA route and
listing detail call `reveal_listing_contact(...)` instead of reading the column.

I can implement this end-to-end whenever you have a staging DB to verify it.

## Also recommended before scale (not blockers)
- **Rate limiting** on `/api/valuate` (unauthenticated Opus calls) and
  `/api/capture-email` (open insert) — cost/abuse protection. An edge
  middleware or Upstash limiter keyed by IP is enough.
- Lock `suggestions_cache` writes behind a definer function (cache poisoning).
- The 6 ESLint `set-state-in-effect` errors are intentional mount patterns
  (one extra render, not bugs); clean up when convenient.
