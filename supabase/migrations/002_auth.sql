-- Profiles table (auto-created on signup via trigger)
create table profiles (
  id uuid primary key references auth.users on delete cascade,
  created_at timestamptz not null default now(),
  email text not null,
  full_name text,
  phone text,
  role text not null default 'seller',
  notification_preferences jsonb not null default '{"new_buyers": true, "valuation_reminders": true, "listing_updates": true}'
);

alter table profiles enable row level security;

create policy "Users can view their own profile"
  on profiles for select
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on profiles for update
  using (auth.uid() = id);

-- Auto-create profile row when a new user signs up
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();

-- Valuations table
create table valuations (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  user_id uuid references auth.users on delete set null,
  industry text not null,
  country text not null,
  region text not null,
  annual_revenue numeric not null,
  annual_profit numeric not null,
  years_operating integer not null,
  valuation_low numeric not null,
  valuation_mid numeric not null,
  valuation_high numeric not null,
  primary_method text not null,
  multiple_applied numeric not null,
  confidence text not null,
  summary text not null,
  key_value_drivers text[] not null default '{}',
  key_risks text[] not null default '{}'
);

alter table valuations enable row level security;

create policy "Users can view their own valuations"
  on valuations for select
  using (auth.uid() = user_id);

create policy "Anyone can insert a valuation"
  on valuations for insert
  with check (true);

-- Add user_id to listings
alter table listings add column if not exists user_id uuid references auth.users on delete set null;

-- Owner-only update/delete policies for listings
create policy "Users can update their own listings"
  on listings for update
  using (auth.uid() = user_id);

create policy "Users can delete their own listings"
  on listings for delete
  using (auth.uid() = user_id);
