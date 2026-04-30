create table if not exists public.coupons (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  discount_percent int check (discount_percent >= 0 and discount_percent <= 100),
  discount_amount numeric(12,2) check (discount_amount >= 0),
  min_order_amount numeric(12,2) default 0,
  max_uses int,
  current_uses int default 0,
  valid_from timestamptz default now(),
  valid_until timestamptz,
  active boolean default true,
  created_at timestamptz default now()
);