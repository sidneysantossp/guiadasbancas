-- ============================================
-- DEBUG DETALHADO: Por que bancas têm 0 produtos?
-- ============================================

-- 1. Quantos produtos beta existem?
SELECT COUNT(*) as produtos_beta_total
FROM products 
WHERE codigo_mercos IS NOT NULL;

-- 2. Quantas bancas ativas existem?
SELECT COUNT(*) as bancas_ativas_total
FROM bancas 
WHERE active = true;

-- 3. Quantos relacionamentos foram criados na tabela?
SELECT COUNT(*) as relacionamentos_total
FROM banca_produtos_distribuidor;

-- 4. Ver alguns relacionamentos criados
SELECT 
  bpd.banca_id,
  bpd.product_id,
  b.name as banca_nome,
  p.name as produto_nome,
  p.codigo_mercos
FROM banca_produtos_distribuidor bpd
JOIN bancas b ON b.id = bpd.banca_id
JOIN products p ON p.id = bpd.product_id
LIMIT 10;

-- 5. Verificar se o JOIN está funcionando corretamente
SELECT 
  b.name as banca_nome,
  COUNT(*) as total_relacionamentos_diretos
FROM bancas b
JOIN banca_produtos_distribuidor bpd ON bpd.banca_id = b.id
WHERE b.active = true
GROUP BY b.id, b.name
ORDER BY total_relacionamentos_diretos DESC
LIMIT 10;

-- 6. Verificar produtos na tabela de relacionamento
SELECT 
  p.name as produto_nome,
  p.codigo_mercos,
  COUNT(bpd.banca_id) as bancas_vinculadas
FROM products p
JOIN banca_produtos_distribuidor bpd ON bpd.product_id = p.id
GROUP BY p.id, p.name, p.codigo_mercos
ORDER BY bancas_vinculadas DESC;

-- ============================================
-- RESULTADO ESPERADO:
-- - produtos_beta_total: 13
-- - bancas_ativas_total: ~10
-- - relacionamentos_total: ~130 (13 × 10)
-- ============================================
