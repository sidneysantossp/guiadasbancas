-- ============================================
-- VERIFICAR PRODUTOS CADASTRADOS
-- ============================================

-- 1. Contar total de produtos
SELECT COUNT(*) as total_produtos FROM products;

-- 2. Listar produtos com codigo_mercos
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

-- 3. Verificar se categoria existe
SELECT id, name FROM categories WHERE id = 'aaaaaaaa-0000-0000-0000-000000000001';

-- 4. Ver TODOS os produtos (últimos 20)
SELECT 
  id,
  name,
  price,
  banca_id,
  codigo_mercos,
  created_at
FROM products 
ORDER BY created_at DESC 
LIMIT 20;
