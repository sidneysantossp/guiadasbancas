-- Create cotistas table for managing quota holders
create table if not exists public.cotistas (
  id uuid primary key default gen_random_uuid(),
  codigo text not null unique, -- Código do cotista (ex: "0001", "10", "100")
  razao_social text not null,
  cnpj_cpf text not null unique,
  telefone text,
  telefone_2 text,
  endereco_principal text,
  cidade text,
  estado text,
  ativo boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Create index for fast searches
create index if not exists idx_cotistas_cnpj_cpf on public.cotistas(cnpj_cpf);
create index if not exists idx_cotistas_codigo on public.cotistas(codigo);
create index if not exists idx_cotistas_razao_social on public.cotistas(razao_social);

-- Add cotista reference to bancas table
alter table if exists public.bancas
  add column if not exists is_cotista boolean default false,
  add column if not exists cotista_id uuid references public.cotistas(id) on delete set null,
  add column if not exists cotista_codigo text,
  add column if not exists cotista_razao_social text,
  add column if not exists cotista_cnpj_cpf text;

-- Create index for banca cotista lookups
create index if not exists idx_bancas_cotista_id on public.bancas(cotista_id);
create index if not exists idx_bancas_is_cotista on public.bancas(is_cotista);

-- Enable RLS
alter table public.cotistas enable row level security;

-- Drop old policies if they exist (for idempotency)
drop policy if exists "Admin full access to cotistas" on public.cotistas;
drop policy if exists "Jornaleiros can read cotistas" on public.cotistas;

-- Allow all authenticated users to read cotistas (search/select)
create policy "Authenticated can read cotistas"
  on public.cotistas
  for select
  to authenticated
  using (true);

-- Note: service_role bypasses RLS automatically in Supabase for inserts/updates/deletes
-- Admin APIs use the service key (supabaseAdmin), so no extra write policies are required here.

-- Update trigger for updated_at
create or replace function update_cotistas_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger trigger_update_cotistas_updated_at
  before update on public.cotistas
  for each row
  execute function update_cotistas_updated_at();

-- Comment on table
comment on table public.cotistas is 'Cadastro de cotistas (quota holders) que compram através de distribuidores';
