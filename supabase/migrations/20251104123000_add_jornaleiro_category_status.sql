-- Add jornaleiro visibility control fields to categories
alter table categories
  add column if not exists jornaleiro_status text not null default 'all';

alter table categories
  add column if not exists jornaleiro_bancas uuid[] default array[]::uuid[];

do $$
begin
  if not exists (
    select 1
    from information_schema.table_constraints
    where constraint_name = 'categories_jornaleiro_status_check'
      and table_name = 'categories'
      and table_schema = 'public'
  ) then
    alter table categories
      add constraint categories_jornaleiro_status_check
      check (jornaleiro_status in ('all', 'specific', 'inactive'));
  end if;
end $$;

update categories
   set jornaleiro_status = coalesce(jornaleiro_status, 'all'),
       jornaleiro_bancas = coalesce(jornaleiro_bancas, array[]::uuid[]);
