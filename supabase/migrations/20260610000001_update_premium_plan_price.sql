update public.plans
set
  price = 97.00,
  updated_at = now()
where
  lower(coalesce(type, '')) = 'premium'
  or lower(coalesce(slug, '')) = 'premium';
