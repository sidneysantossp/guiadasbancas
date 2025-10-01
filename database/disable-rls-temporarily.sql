-- Script para desabilitar RLS temporariamente e testar conectividade
-- Execute no SQL Editor do Supabase

-- 1. Verificar status atual do RLS
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('bancas', 'products', 'categories', 'orders', 'branding');

-- 2. Desabilitar RLS temporariamente para teste
ALTER TABLE bancas DISABLE ROW LEVEL SECURITY;
ALTER TABLE products DISABLE ROW LEVEL SECURITY;
ALTER TABLE categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE orders DISABLE ROW LEVEL SECURITY;
ALTER TABLE branding DISABLE ROW LEVEL SECURITY;

-- 3. Verificar dados existentes
SELECT 'bancas' as tabela, count(*) as total FROM bancas
UNION ALL
SELECT 'products' as tabela, count(*) as total FROM products
UNION ALL
SELECT 'categories' as tabela, count(*) as total FROM categories
UNION ALL
SELECT 'orders' as tabela, count(*) as total FROM orders
UNION ALL
SELECT 'branding' as tabela, count(*) as total FROM branding;

-- 4. Mostrar algumas bancas para verificar estrutura
SELECT id, name, address, lat, lng, categories, cover_image 
FROM bancas 
LIMIT 3;

-- 5. Mostrar alguns produtos para verificar estrutura
SELECT id, name, price, category_id, banca_id, images 
FROM products 
LIMIT 5;

-- IMPORTANTE: Após testar as APIs, execute este comando para reabilitar RLS:
/*
ALTER TABLE bancas ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE branding ENABLE ROW LEVEL SECURITY;
*/
