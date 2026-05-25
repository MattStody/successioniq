-- Require authenticated users to create listings and tie each row to its owner.
-- Replaces the open "Anyone can create a listing" policy from 001_listings.sql.
drop policy if exists "Anyone can create a listing" on listings;

create policy "Authenticated users can create their own listings"
  on listings for insert
  with check (auth.uid() = user_id);
