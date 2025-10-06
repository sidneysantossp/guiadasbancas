-- ============================================
-- ALTERNATIVA: Usar distribuidor existente
-- ============================================

-- 1. Ver distribuidores existentes
SELECT id, nome, ativo FROM distribuidores WHERE ativo = true LIMIT 5;

-- 2. Atualizar produtos beta para usar o primeiro distribuidor ativo
UPDATE products 
SET 
  distribuidor_id = (SELECT id FROM distribuidores WHERE ativo = true LIMIT 1)
WHERE codigo_mercos IS NOT NULL
AND distribuidor_id IS NULL
AND banca_id IS NULL;

-- 3. Verificar produtos atualizados
SELECT 
  p.name,
  p.codigo_mercos,
  p.distribuidor_id,
  d.nome as distribuidor_nome,
  p.origem
FROM products p
LEFT JOIN distribuidores d ON d.id = p.distribuidor_id
WHERE p.codigo_mercos IS NOT NULL
ORDER BY p.name;

-- 4. Testar se agora aparecem nas bancas
SELECT 
  COUNT(*) as produtos_distribuidor_total
FROM products 
WHERE distribuidor_id IS NOT NULL;
