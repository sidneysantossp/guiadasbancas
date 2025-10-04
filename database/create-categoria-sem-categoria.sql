-- Criar categoria genérica para produtos sem categoria definida
-- Usada como fallback quando produtos de distribuidores são importados sem category_id
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
  'bbbbbbbb-0000-0000-0000-000000000001', -- UUID fixo para fácil referência
  'Sem Categoria',
  '/categorias/sem-categoria',
  NULL,
  true,
  998, -- Penúltima posição (antes de "Produtos de Distribuidores")
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  link = EXCLUDED.link,
  updated_at = NOW();

COMMENT ON TABLE categories IS 'Categorias de produtos - inclui categoria fallback para produtos sem categoria';
