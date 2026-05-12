-- Brokers table
create table brokers (
  id uuid primary key references auth.users on delete cascade,
  created_at timestamptz not null default now(),
  agency_name text not null default '',
  license_number text,
  phone text not null default '',
  website text,
  verified boolean not null default false
);

alter table brokers enable row level security;

create policy "Brokers can view their own record"
  on brokers for select
  using (auth.uid() = id);

create policy "Brokers can insert their own record"
  on brokers for insert
  with check (auth.uid() = id);

create policy "Brokers can update their own record"
  on brokers for update
  using (auth.uid() = id);

-- Add broker_id to listings
alter table listings add column if not exists broker_id uuid references auth.users on delete set null;

-- Broker-specific listing policies
create policy "Brokers can update their own broker listings"
  on listings for update
  using (auth.uid() = broker_id);

create policy "Brokers can delete their own broker listings"
  on listings for delete
  using (auth.uid() = broker_id);
