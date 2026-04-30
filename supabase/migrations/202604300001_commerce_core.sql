create extension if not exists pgcrypto;

create table if not exists public.suppliers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  user_id uuid,
  approval_status text not null default 'REVIEW' check (approval_status in ('DRAFT', 'REVIEW', 'APPROVED', 'REJECTED', 'SUSPENDED')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  supplier_id uuid references public.suppliers(id),
  name text not null,
  slug text unique,
  description text,
  price numeric(12,2) not null check (price >= 0),
  approval_status text not null default 'REVIEW' check (approval_status in ('DRAFT', 'REVIEW', 'APPROVED', 'REJECTED', 'ARCHIVED')),
  stock_quantity integer not null default 0 check (stock_quantity >= 0),
  ocop_stars integer check (ocop_stars between 1 and 5),
  certificate_number text,
  origin text,
  ingredients text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  status text not null default 'UNPAID' check (status in ('UNPAID', 'PENDING_PAYMENT', 'PAID', 'PACKING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUND_REVIEW', 'REFUNDED')),
  total_amount numeric(12,2) not null check (total_amount >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid not null references public.products(id),
  quantity integer not null check (quantity > 0),
  price numeric(12,2) not null check (price >= 0)
);

create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  action text not null,
  model text not null,
  model_id text,
  metadata jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.ai_generations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  task_type text not null,
  provider text not null default 'NVIDIA_NIM',
  model text not null,
  input jsonb not null,
  output jsonb,
  status text not null default 'PENDING' check (status in ('PENDING', 'RUNNING', 'SUCCEEDED', 'FAILED')),
  error text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
