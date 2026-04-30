alter table public.orders
  add column if not exists shipping_name text,
  add column if not exists shipping_phone text,
  add column if not exists shipping_addr text;
