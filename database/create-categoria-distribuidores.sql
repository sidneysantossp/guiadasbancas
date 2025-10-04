-- Criar categoria genérica para produtos de distribuidores
INSERT INTO categories (
  id,
  name,
  link,
  image,
  active,
  "order",
  created_at,
  updated_at
) VALUES (
  'aaaaaaaa-0000-0000-0000-000000000001', -- UUID fixo para fácil referência
  'Diversos',
  '/categorias/diversos',
  NULL,
  true,
  999, -- Última posição
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  link = EXCLUDED.link,
  updated_at = NOW();

COMMENT ON TABLE categories IS 'Categorias de produtos - inclui categoria especial para distribuidores';
