create type listing_status as enum ('draft', 'active', 'under_offer', 'sold');

create table listings (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  status listing_status not null default 'active',
  is_anonymous boolean not null default false,
  business_name text,
  industry text not null,
  country text not null,
  region text not null,
  annual_revenue numeric not null,
  annual_profit numeric not null,
  years_operating integer not null,
  asking_price numeric,
  valuation_low numeric not null,
  valuation_mid numeric not null,
  valuation_high numeric not null,
  description text not null,
  whats_included text not null,
  transition_period text not null,
  preferred_buyer text not null,
  contact_email text not null,
  key_value_drivers text[] not null default '{}',
  key_risks text[] not null default '{}'
);

alter table listings enable row level security;

-- Anyone can read active listings
create policy "Public can view active listings"
  on listings for select
  using (status = 'active');

-- Anyone can insert (no auth yet)
create policy "Anyone can create a listing"
  on listings for insert
  with check (true);
