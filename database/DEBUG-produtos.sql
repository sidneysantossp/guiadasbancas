-- ============================================
-- DEBUG: Verificar produtos com codigo_mercos
-- ============================================

-- 1. Contar produtos com codigo_mercos
SELECT COUNT(*) as total_com_codigo 
FROM products 
WHERE codigo_mercos IS NOT NULL;

-- 2. Listar todos os produtos com codigo_mercos
SELECT 
  id,
  name,
  codigo_mercos,
  price,
  stock_qty,
  category_id,
  banca_id,
  created_at
FROM products 
WHERE codigo_mercos IS NOT NULL
ORDER BY created_at DESC;

-- 3. Verificar se a coluna codigo_mercos existe
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'products' 
AND column_name = 'codigo_mercos';

-- 4. Ver últimos 20 produtos cadastrados
SELECT 
  id,
  name,
  codigo_mercos,
  price,
  created_at
FROM products 
ORDER BY created_at DESC 
LIMIT 20;
