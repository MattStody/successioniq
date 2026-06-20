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
| 4 | `listings.contact_email` scrapable via PostgREST | P0 | ✅ Fixed (mig 015) |
| 5 | Draft/sold listings publicly readable | P1 | ✅ Fixed (mig 014) |
| 6 | `SECURITY DEFINER` fns lacked `search_path` | P1 | ✅ Fixed (mig 014) |
| 7 | Bulk-upload body unvalidated / unbounded | P1 | ✅ Fixed |
| 8 | Raw DB errors returned to clients | P1 | ✅ Fixed |
| 9 | `suggestions_cache` writable by any user (poisoning) | P1 | ◻️ Accepted for launch (low impact) |
| 10 | No rate limiting on AI / public endpoints | P1 | ✅ Added (per-IP, in-memory) |
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

## Issue #4 (contact_email) — fixed in migration 015

`listings.contact_email` was readable by `anon` via PostgREST despite the NDA
UI. Migration `015_listing_contacts.sql` moves it into a `listing_contacts`
table that is **not** publicly readable, gated by an NDA-aware
`reveal_listing_contact(uuid)` SECURITY DEFINER function. App changes: the
create-listing and bulk-upload routes write to `listing_contacts`; the NDA
route and listing detail call `reveal_listing_contact(...)` (owner or
NDA-signer only). The column is dropped, so `select('*')` no longer returns it.

**Staging checklist for 015:** create a listing (contact saved), sign an NDA as
a different user (email revealed), confirm a direct
`GET /rest/v1/listings?select=contact_email` now fails, and run a broker bulk
upload (contacts stored). Back up before the `drop column`.

## Rate limiting (added)

`lib/rate-limit.ts` provides a per-IP, fixed-window limiter applied to every
expensive / abusable endpoint: `valuate` (10/h), `capture-email` (10/h),
`generate-description` (30/h), `match-listings` (20/h), `bulk-upload` (5/h),
and the seller AI suggestion routes (40/h). Over-limit callers get a `429` with
`Retry-After`.

**Limitation:** the store is in-memory, so limits are per serverless instance,
not global. That's a solid first guard at launch volumes, but for hard global
caps swap the internals for Upstash/Redis — the call sites and `LIMITS` config
stay the same.

## Also recommended before scale (not blockers)
- Lock `suggestions_cache` writes behind a definer function (cache poisoning).
- The 6 ESLint `set-state-in-effect` errors are intentional mount patterns
  (one extra render, not bugs); clean up when convenient.
