update public.plans
set
  price = 149.00,
  updated_at = now()
where
  lower(coalesce(type, '')) = 'premium'
  or lower(coalesce(slug, '')) = 'premium';

insert into public.system_settings (key, value, description, is_secret)
values (
  'premium_launch_price',
  '97',
  'Preço promocional da oferta de lançamento do Premium',
  false
)
on conflict (key) do update
set
  value = excluded.value,
  description = excluded.description,
  is_secret = excluded.is_secret,
  updated_at = now();
