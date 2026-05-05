create table if not exists public.admin_banca_crm_leads (
  id uuid primary key default gen_random_uuid(),
  source_type text not null default 'manual'
    check (source_type in ('manual', 'cotista', 'banca')),
  source_id uuid,
  cotista_id uuid references public.cotistas(id) on delete set null,
  banca_id uuid references public.bancas(id) on delete set null,
  codigo text,
  banca_name text not null,
  responsavel_name text,
  phone text,
  phone_2 text,
  document text,
  address text,
  city text,
  state text,
  is_cotista boolean not null default false,
  is_registered boolean not null default false,
  stage text not null default 'novo'
    check (stage in (
      'novo',
      'contato_inicial',
      'qualificacao',
      'apresentacao',
      'negociacao',
      'aguardando_cadastro',
      'convertida',
      'perdida'
    )),
  status text not null default 'ativo'
    check (status in ('ativo', 'pausado', 'convertido', 'perdido')),
  priority text not null default 'media'
    check (priority in ('baixa', 'media', 'alta')),
  assigned_to text,
  notes text,
  last_contact_at timestamptz,
  next_follow_up_at timestamptz,
  lost_reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists idx_admin_banca_crm_leads_source
  on public.admin_banca_crm_leads(source_type, source_id)
  where source_id is not null;

create index if not exists idx_admin_banca_crm_leads_stage
  on public.admin_banca_crm_leads(stage);

create index if not exists idx_admin_banca_crm_leads_document
  on public.admin_banca_crm_leads(document);

create index if not exists idx_admin_banca_crm_leads_cotista
  on public.admin_banca_crm_leads(cotista_id);

create index if not exists idx_admin_banca_crm_leads_banca
  on public.admin_banca_crm_leads(banca_id);

alter table public.admin_banca_crm_leads enable row level security;

drop policy if exists "Admin service role manages banca CRM" on public.admin_banca_crm_leads;

create policy "Admin service role manages banca CRM"
  on public.admin_banca_crm_leads
  for all
  to service_role
  using (true)
  with check (true);

create or replace function public.update_admin_banca_crm_leads_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trigger_update_admin_banca_crm_leads_updated_at
  on public.admin_banca_crm_leads;

create trigger trigger_update_admin_banca_crm_leads_updated_at
  before update on public.admin_banca_crm_leads
  for each row
  execute function public.update_admin_banca_crm_leads_updated_at();

comment on table public.admin_banca_crm_leads is
  'CRM administrativo de prospeccao de bancas, consolidando cotistas, bancas cadastradas e leads manuais.';
