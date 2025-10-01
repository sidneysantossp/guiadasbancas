-- Script para desabilitar RLS na tabela products
-- Execute no SQL Editor do Supabase

-- Verificar se RLS está habilitado
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename IN ('products', 'bancas', 'campaigns');

-- Desabilitar RLS nas tabelas principais
ALTER TABLE products DISABLE ROW LEVEL SECURITY;
ALTER TABLE bancas DISABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns DISABLE ROW LEVEL SECURITY;

-- Verificar novamente
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename IN ('products', 'bancas', 'campaigns');

-- Testar se conseguimos buscar dados
SELECT COUNT(*) as total_products FROM products;
SELECT COUNT(*) as total_bancas FROM bancas;
SELECT COUNT(*) as total_campaigns FROM campaigns;
