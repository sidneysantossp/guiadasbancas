-- Mini Banners table for rotating small banners under "Ofertas para você"
-- Safe to run multiple times

create table if not exists public.mini_banners (
  id uuid primary key default gen_random_uuid(),
  image_url text not null,
  -- order is a reserved word in SQL; use display_order
  display_order int not null default 0,
  active boolean not null default true,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now()
);

-- Helpful index for ordering
create index if not exists idx_mini_banners_display_order on public.mini_banners(display_order);
create index if not exists idx_mini_banners_active on public.mini_banners(active);

-- Update trigger to keep updated_at fresh
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger t_mini_banners_updated_at
  before update on public.mini_banners
  for each row execute procedure public.set_updated_at();

-- RLS (Row Level Security) disabled for simplicity (reads are public, writes via service key)
alter table public.mini_banners disable row level security;
