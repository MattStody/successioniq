-- Representative/seed listings used to populate the marketplace at launch.
-- These are surfaced to buyers with a "Representative listing" badge, and their
-- contact details route to FairMark rather than a real seller, so no buyer is
-- misled into contacting a business that isn't a genuine live deal.
alter table public.listings
  add column if not exists is_sample boolean not null default false;

comment on column public.listings.is_sample is
  'Marks representative/seed listings shown with a "Representative listing" badge; their contact routes to FairMark.';
