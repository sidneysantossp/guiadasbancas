-- Desativar produtos com estoque zero que ainda estão ativos
-- Aplica a regra: stock_qty = 0 → active = false
UPDATE products
SET active = false
WHERE stock_qty = 0
  AND active = true
  AND distribuidor_id IS NOT NULL;
