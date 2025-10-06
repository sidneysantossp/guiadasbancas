-- ============================================
-- DIAGNÓSTICO COMPLETO - PRODUTOS
-- ============================================

-- 1. Total de produtos
SELECT COUNT(*) as total_produtos FROM products;

-- 2. Produtos por origem
SELECT 
  origem,
  COUNT(*) as quantidade
FROM products
GROUP BY origem;

-- 3. Listar TODOS os produtos
SELECT 
  id,
  name,
  origem,
  codigo_mercos,
  mercos_id,
  banca_id,
  distribuidor_id,
  created_at
FROM products
ORDER BY created_at DESC;

-- 4. Produtos com codigo_mercos
SELECT 
  COUNT(*) as com_codigo_mercos
FROM products
WHERE codigo_mercos IS NOT NULL;

-- 5. Produtos da integração Mercos (mercos_id)
SELECT 
  COUNT(*) as da_integracao_mercos
FROM products
WHERE mercos_id IS NOT NULL;

-- ============================================
-- Me envie o resultado de TODAS essas queries!
-- ============================================
