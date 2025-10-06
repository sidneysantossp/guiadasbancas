-- ============================================
-- DESABILITAR RLS NA TABELA PRODUCTS
-- ============================================
-- RLS pode estar bloqueando a consulta dos produtos
-- Execute este SQL no Supabase

-- 1. Desabilitar RLS
ALTER TABLE products DISABLE ROW LEVEL SECURITY;

-- 2. Verificar se funcionou
SELECT 
  tablename, 
  rowsecurity 
FROM pg_tables 
WHERE tablename = 'products';

-- 3. Contar produtos
SELECT COUNT(*) as total_produtos FROM products;

-- 4. Listar os 5 primeiros
SELECT 
  id, 
  name, 
  codigo_mercos, 
  price, 
  stock_qty 
FROM products 
LIMIT 5;

-- ============================================
-- Se mesmo assim não aparecer, o problema é na API
-- Nesse caso, verifique o console do navegador
-- ============================================
