-- Script para desabilitar RLS apenas para as tabelas de API
-- Execute no SQL Editor do Supabase
-- ATENÇÃO: Isso remove a segurança RLS, use apenas se necessário

-- 1. Verificar dados antes
SELECT 'ANTES - Bancas:' as info, count(*) as total FROM bancas
UNION ALL
SELECT 'ANTES - Products:' as info, count(*) as total FROM products
UNION ALL
SELECT 'ANTES - Categories:' as info, count(*) as total FROM categories;

-- 2. Desabilitar RLS para tabelas de leitura pública
ALTER TABLE bancas DISABLE ROW LEVEL SECURITY;
ALTER TABLE products DISABLE ROW LEVEL SECURITY;
ALTER TABLE categories DISABLE ROW LEVEL SECURITY;

-- 3. Manter RLS para tabelas sensíveis
-- ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE branding ENABLE ROW LEVEL SECURITY;

-- 4. Verificar status RLS
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('bancas', 'products', 'categories', 'orders', 'branding');

-- 5. Testar consultas
SELECT 'DEPOIS - Bancas:' as info, count(*) as total FROM bancas
UNION ALL
SELECT 'DEPOIS - Products:' as info, count(*) as total FROM products
UNION ALL
SELECT 'DEPOIS - Categories:' as info, count(*) as total FROM categories;
