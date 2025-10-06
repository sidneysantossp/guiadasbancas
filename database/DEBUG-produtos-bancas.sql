-- ============================================
-- DEBUG: Por que produtos não aparecem nas bancas?
-- ============================================

-- 1. Ver produtos e suas configurações de banca
SELECT 
  p.id,
  p.name,
  p.codigo_mercos,
  p.banca_id,
  p.distribuidor_id,
  p.origem,
  p.created_at
FROM products p
WHERE p.codigo_mercos IS NOT NULL
ORDER BY p.created_at DESC
LIMIT 10;

-- 2. Ver se existem produtos na tabela de relacionamento banca-produtos
SELECT COUNT(*) as total_relacionamentos
FROM banca_produtos_distribuidor;

-- 3. Ver bancas ativas
SELECT id, name, active 
FROM bancas 
WHERE active = true
LIMIT 5;

-- 4. Verificar se produtos têm banca_id ou distribuidor_id
SELECT 
  CASE 
    WHEN banca_id IS NOT NULL THEN 'Banca específica'
    WHEN distribuidor_id IS NOT NULL THEN 'Distribuidor'
    ELSE 'Sem vinculação'
  END as tipo_vinculacao,
  COUNT(*) as quantidade
FROM products
GROUP BY 
  CASE 
    WHEN banca_id IS NOT NULL THEN 'Banca específica'
    WHEN distribuidor_id IS NOT NULL THEN 'Distribuidor'
    ELSE 'Sem vinculação'
  END;

-- ============================================
-- RESULTADO ESPERADO: 
-- - Produtos devem ter distribuidor_id OU banca_id
-- - Ou estar na tabela banca_produtos_distribuidor
-- ============================================
