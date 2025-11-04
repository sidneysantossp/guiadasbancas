-- Enable UUID extension if not already enabled
create extension if not exists "uuid-ossp" with schema extensions;

-- Create sync_status table
create table if not exists public.sync_status (
  id text primary key default 'sync_' || gen_random_uuid(),
  distribuidor_id uuid not null references public.distribuidores(id) on delete cascade,
  status text not null check (status in ('pending', 'in_progress', 'completed', 'failed')),
  last_processed_id integer,
  last_processed_date timestamptz,
  total_processed integer not null default 0,
  errors jsonb,
  last_run_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Add indexes for better performance
create index if not exists idx_sync_status_distribuidor on public.sync_status(distribuidor_id);
create index if not exists idx_sync_status_status on public.sync_status(status);

-- Add RLS policies
alter table public.sync_status enable row level security;

-- Allow admins to access all sync statuses
create policy "Admins can view all sync statuses"
on public.sync_status for select
to authenticated
using (auth.jwt() ->> 'role' = 'admin');

create policy "Admins can insert sync statuses"
on public.sync_status for insert
to authenticated
with check (auth.jwt() ->> 'role' = 'admin');

create policy "Admins can update sync statuses"
on public.sync_status for update
to authenticated
using (auth.jwt() ->> 'role' = 'admin');

-- Create a trigger to update the updated_at column
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Apply the trigger to sync_status
create or replace trigger on_sync_status_updated
  before update on public.sync_status
  for each row
  execute function public.handle_updated_at();

-- Create a function to get or create a sync status
create or replace function public.get_or_create_sync_status(
  p_distribuidor_id uuid
)
returns public.sync_status as $$
declare
  v_sync_status public.sync_status;
begin
  -- Try to find existing status
  select * into v_sync_status
  from public.sync_status
  where distribuidor_id = p_distribuidor_id
  order by created_at desc
  limit 1;
  
  -- If not found, create a new one
  if v_sync_status is null then
    insert into public.sync_status (distribuidor_id, status, total_processed)
    values (p_distribuidor_id, 'pending', 0)
    returning * into v_sync_status;
  end if;
  
  return v_sync_status;
end;
$$ language plpgsql security definer;

-- Create a function to update sync status
create or replace function public.update_sync_status(
  p_id text,
  p_status text,
  p_last_processed_id integer default null,
  p_last_processed_date timestamptz default null,
  p_total_processed integer default null,
  p_errors text[] default null,
  p_last_run_at timestamptz default null
)
returns void as $$
begin
  update public.sync_status
  set 
    status = p_status,
    last_processed_id = coalesce(p_last_processed_id, last_processed_id),
    last_processed_date = coalesce(p_last_processed_date, last_processed_date),
    total_processed = coalesce(p_total_processed, total_processed),
    errors = case when p_errors is not null then p_errors::jsonb else errors end,
    last_run_at = coalesce(p_last_run_at, last_run_at),
    updated_at = now()
  where id = p_id;
end;
$$ language plpgsql security definer;
