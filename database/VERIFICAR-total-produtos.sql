-- ============================================
-- VERIFICAR TOTAL DE PRODUTOS NO BANCO
-- ============================================

-- 1. Total geral de produtos
SELECT COUNT(*) as total_produtos FROM products;

-- 2. Produtos da integração Mercos (sem codigo_mercos customizado)
SELECT COUNT(*) as produtos_mercos_integracao 
FROM products 
WHERE (codigo_mercos IS NULL OR origem = 'mercos');

-- 3. Produtos novos do print (com codigo_mercos customizado)
SELECT COUNT(*) as produtos_novos_print 
FROM products 
WHERE codigo_mercos IN (
  'AKOTO001', 'ADBEM001', 'ACBKA004', 'ACBKA002', 'ACBKA003',
  'AOITO001', 'ABELC001', 'ABELA002', 'ABRIG001', 'AECOF001',
  'AHNIE002', 'AZRAE001', 'HBRCO012'
);

-- 4. Listar TODOS os produtos (primeiros 30)
SELECT 
  id,
  name,
  codigo_mercos,
  origem,
  price,
  created_at
FROM products 
ORDER BY created_at DESC
LIMIT 30;

-- Esperado:
-- total_produtos: 30 (ou mais se tiver produtos antigos)
-- produtos_mercos_integracao: 17
-- produtos_novos_print: 13
