create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  title text not null,
  message text not null,
  type text default 'info',
  read boolean default false,
  created_at timestamptz not null default now()
);

create index idx_notifications_user on public.notifications(user_id);