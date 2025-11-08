-- Add TPU URL column to bancas
alter table if exists public.bancas
  add column if not exists tpu_url text;
