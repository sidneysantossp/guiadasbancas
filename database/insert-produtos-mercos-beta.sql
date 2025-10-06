-- ============================================
-- INSERÇÃO DE PRODUTOS MERCOS PARA BETA LAUNCH
-- ============================================
-- Produtos cadastrados com dados reais da Mercos
-- Imagens serão vinculadas depois via upload em massa
-- Categoria: Diversos (aaaaaaaa-0000-0000-0000-000000000001)
-- ============================================

INSERT INTO products (
  name,
  description,
  price,
  category_id,
  images,
  stock_qty,
  track_stock,
  active,
  pronta_entrega,
  sob_encomenda,
  pre_venda,
  codigo_mercos,
  unidade_medida,
  venda_multiplos,
  categoria_mercos,
  disponivel_todas_bancas
) VALUES
-- 1. AKOTO001
(
  '10 COISAS PARA FAZER ANTES DOS 40 - 01',
  'Mangá - 10 Coisas Para Fazer Antes dos 40, Volume 01',
  40.90,
  'aaaaaaaa-0000-0000-0000-000000000001',
  ARRAY[]::text[],
  1327,
  true,
  true,
  true,
  false,
  false,
  'AKOTO001',
  'UN',
  1.00,
  'Mangá',
  true
),

-- 2. ADBEM001
(
  '100 BALAS: IRMAO LONO - EDICAO DE LUXO',
  'HQ - 100 Balas: Irmão Lono - Edição de Luxo',
  90.90,
  'aaaaaaaa-0000-0000-0000-000000000001',
  ARRAY[]::text[],
  492,
  true,
  true,
  true,
  false,
  false,
  'ADBEM001',
  'UN',
  1.00,
  'HQ',
  true
),

-- 3. ACBKA004
(
  '20TH CENTURY BOYS ED. DEFINITIVA - 04',
  'Mangá - 20th Century Boys Edição Definitiva, Volume 04',
  74.90,
  'aaaaaaaa-0000-0000-0000-000000000001',
  ARRAY[]::text[],
  724,
  true,
  true,
  true,
  false,
  false,
  'ACBKA004',
  'UN',
  1.00,
  'Mangá',
  true
),

-- 4. ACBKA002
(
  '20TH CENTURY BOYS ED. DEFINITIVA - 2',
  'Mangá - 20th Century Boys Edição Definitiva, Volume 02',
  69.90,
  'aaaaaaaa-0000-0000-0000-000000000001',
  ARRAY[]::text[],
  165,
  true,
  true,
  true,
  false,
  false,
  'ACBKA002',
  'UN',
  1.00,
  'Mangá',
  true
),

-- 5. ACBKA003
(
  '20TH CENTURY BOYS ED. DEFINITIVA - 3',
  'Mangá - 20th Century Boys Edição Definitiva, Volume 03',
  74.90,
  'aaaaaaaa-0000-0000-0000-000000000001',
  ARRAY[]::text[],
  504,
  true,
  true,
  true,
  false,
  false,
  'ACBKA003',
  'UN',
  1.00,
  'Mangá',
  true
),

-- 6. AOITO001
(
  '8 BILHOES DE GENIOS N.1',
  'HQ - 8 Bilhões de Gênios, Número 1',
  129.90,
  'aaaaaaaa-0000-0000-0000-000000000001',
  ARRAY[]::text[],
  423,
  true,
  true,
  true,
  false,
  false,
  'AOITO001',
  'UN',
  1.00,
  'HQ',
  true
),

-- 7. ABELC001
(
  'A BELA CASA DE PRAIA VOL.01',
  'HQ - A Bela Casa de Praia, Volume 01',
  108.90,
  'aaaaaaaa-0000-0000-0000-000000000001',
  ARRAY[]::text[],
  603,
  true,
  true,
  true,
  false,
  false,
  'ABELC001',
  'UN',
  1.00,
  'HQ',
  true
),

-- 8. ABELA002
(
  'A BELA CASA DO LAGO N.2',
  'HQ - A Bela Casa do Lago, Número 2',
  89.90,
  'aaaaaaaa-0000-0000-0000-000000000001',
  ARRAY[]::text[],
  141,
  true,
  true,
  true,
  false,
  false,
  'ABELA002',
  'UN',
  1.00,
  'HQ',
  true
),

-- 9. ABRIG001
(
  'A BRIGADA DOS ENCAPOTADOS N.1',
  'HQ - A Brigada dos Encapotados, Número 1',
  144.90,
  'aaaaaaaa-0000-0000-0000-000000000001',
  ARRAY[]::text[],
  829,
  true,
  true,
  true,
  false,
  false,
  'ABRIG001',
  'UN',
  1.00,
  'HQ',
  true
),

-- 10. AECOF001
(
  'A CANCAO DA FENIX: ECO',
  'HQ - A Canção da Fênix: Eco',
  34.90,
  'aaaaaaaa-0000-0000-0000-000000000001',
  ARRAY[]::text[],
  292,
  true,
  true,
  true,
  false,
  false,
  'AECOF001',
  'UN',
  1.00,
  'HQ',
  true
),

-- 11. AHNIE002
(
  'A CASA ESTRANHA - 02',
  'HQ - A Casa Estranha, Volume 02',
  44.90,
  'aaaaaaaa-0000-0000-0000-000000000001',
  ARRAY[]::text[],
  734,
  true,
  true,
  true,
  false,
  false,
  'AHNIE002',
  'UN',
  1.00,
  'HQ',
  true
),

-- 12. AZRAE001
(
  'A ESPADA DE AZRAEL',
  'HQ - A Espada de Azrael',
  54.90,
  'aaaaaaaa-0000-0000-0000-000000000001',
  ARRAY[]::text[],
  571,
  true,
  true,
  true,
  false,
  false,
  'AZRAE001',
  'UN',
  1.00,
  'HQ',
  true
),

-- 13. HBRCO012
(
  'A ESPADA SELVAGEM DE CON N.12',
  'HQ - A Espada Selvagens de Conan, Número 12',
  54.90,
  'aaaaaaaa-0000-0000-0000-000000000001',
  ARRAY[]::text[],
  87,
  true,
  true,
  true,
  false,
  false,
  'HBRCO012',
  'UN',
  1.00,
  'HQ',
  true
);

-- ============================================
-- VERIFICAÇÃO
-- ============================================
-- Para verificar se os produtos foram inseridos:
-- SELECT name, codigo_mercos, price, stock_qty FROM products WHERE codigo_mercos IS NOT NULL ORDER BY name;

-- ============================================
-- PRÓXIMOS PASSOS
-- ============================================
-- 1. Execute este SQL no Supabase
-- 2. Baixe as imagens da Mercos
-- 3. Renomeie as imagens com os códigos:
--    - AKOTO001.jpg
--    - ADBEM001.jpg
--    - ACBKA004.jpg
--    - etc...
-- 4. Faça upload em massa em: /admin/produtos/upload-imagens
-- 5. As imagens serão vinculadas automaticamente!
-- ============================================
