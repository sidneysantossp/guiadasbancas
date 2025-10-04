-- Script de teste para validar gestão de estoque próprio
-- Execute após criar os campos custom_stock_enabled e custom_stock_qty

-- 1. Verificar se as colunas foram criadas
SELECT 
  column_name, 
  data_type, 
  column_default,
  is_nullable
FROM information_schema.columns
WHERE table_name = 'banca_produtos_distribuidor'
  AND column_name IN ('custom_stock_enabled', 'custom_stock_qty')
ORDER BY column_name;

-- 2. Verificar produtos de distribuidores existentes
SELECT 
  p.id,
  p.name,
  p.stock_qty as estoque_distribuidor,
  p.distribuidor_id,
  COUNT(bpd.id) as qtd_bancas_usando
FROM products p
LEFT JOIN banca_produtos_distribuidor bpd ON bpd.product_id = p.id
WHERE p.distribuidor_id IS NOT NULL
GROUP BY p.id, p.name, p.stock_qty, p.distribuidor_id
ORDER BY p.name
LIMIT 10;

-- 3. Verificar customizações existentes
SELECT 
  bpd.id,
  b.name as banca_nome,
  p.name as produto_nome,
  p.stock_qty as estoque_distribuidor,
  bpd.enabled,
  bpd.custom_price,
  bpd.custom_stock_enabled,
  bpd.custom_stock_qty
FROM banca_produtos_distribuidor bpd
JOIN bancas b ON b.id = bpd.banca_id
JOIN products p ON p.id = bpd.product_id
ORDER BY b.name, p.name
LIMIT 10;

-- 4. Simular ativação de estoque próprio (EXEMPLO - NÃO EXECUTE!)
-- UPDATE banca_produtos_distribuidor
-- SET 
--   custom_stock_enabled = true,
--   custom_stock_qty = 10
-- WHERE banca_id = '[ID_DA_SUA_BANCA]'
--   AND product_id = '[ID_DO_PRODUTO]';

-- 5. Verificar produtos esgotados no distribuidor
SELECT 
  p.id,
  p.name,
  p.stock_qty,
  p.distribuidor_id,
  COUNT(bpd.id) FILTER (WHERE bpd.custom_stock_enabled = true) as bancas_com_estoque_proprio,
  COUNT(bpd.id) FILTER (WHERE bpd.enabled = true) as bancas_habilitadas
FROM products p
LEFT JOIN banca_produtos_distribuidor bpd ON bpd.product_id = p.id
WHERE p.distribuidor_id IS NOT NULL
  AND p.stock_qty = 0
GROUP BY p.id, p.name, p.stock_qty, p.distribuidor_id
ORDER BY bancas_com_estoque_proprio DESC, p.name
LIMIT 10;

-- 6. Análise: Produtos que podem ser reativados
-- (Produtos esgotados no distribuidor mas que poderiam ter estoque próprio)
SELECT 
  p.id,
  p.name as produto,
  p.stock_qty as estoque_dist,
  b.name as banca,
  bpd.enabled as habilitado,
  bpd.custom_stock_enabled as usa_estoque_proprio,
  bpd.custom_stock_qty as estoque_proprio
FROM products p
JOIN banca_produtos_distribuidor bpd ON bpd.product_id = p.id
JOIN bancas b ON b.id = bpd.banca_id
WHERE p.distribuidor_id IS NOT NULL
  AND p.stock_qty = 0
  AND bpd.enabled = true
  AND (bpd.custom_stock_enabled = false OR bpd.custom_stock_qty IS NULL OR bpd.custom_stock_qty = 0)
ORDER BY b.name, p.name;

-- Resultado esperado:
-- ✅ Colunas custom_stock_enabled e custom_stock_qty devem existir
-- ✅ Default: custom_stock_enabled = false, custom_stock_qty = NULL
-- ✅ Produtos sem customização aparecem com valores NULL/false
-- ✅ Ao ativar, valores são gravados corretamente
