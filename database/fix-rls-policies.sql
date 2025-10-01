-- Script para corrigir políticas RLS no Supabase
-- Execute no SQL Editor do Supabase

-- 1. Reabilitar RLS (necessário para segurança)
ALTER TABLE bancas ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE branding ENABLE ROW LEVEL SECURITY;

-- 2. Remover políticas antigas que podem estar conflitando
DROP POLICY IF EXISTS "Allow public read access on bancas" ON bancas;
DROP POLICY IF EXISTS "Allow public read access on categories" ON categories;
DROP POLICY IF EXISTS "Allow public read access on products" ON products;
DROP POLICY IF EXISTS "Allow public read access on branding" ON branding;
DROP POLICY IF EXISTS "Allow service role all access on bancas" ON bancas;
DROP POLICY IF EXISTS "Allow service role all access on categories" ON categories;
DROP POLICY IF EXISTS "Allow service role all access on products" ON products;
DROP POLICY IF EXISTS "Allow service role all access on orders" ON orders;
DROP POLICY IF EXISTS "Allow service role all access on branding" ON branding;

-- 3. Criar políticas corretas para leitura pública
CREATE POLICY "Enable read access for all users" ON bancas FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON categories FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON products FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON branding FOR SELECT USING (true);

-- 4. Criar políticas para service_role (operações administrativas)
CREATE POLICY "Enable all for service role" ON bancas FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Enable all for service role" ON categories FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Enable all for service role" ON products FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Enable all for service role" ON orders FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Enable all for service role" ON branding FOR ALL USING (auth.role() = 'service_role');

-- 5. Verificar se as políticas foram criadas
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE schemaname = 'public' 
AND tablename IN ('bancas', 'products', 'categories', 'orders', 'branding')
ORDER BY tablename, policyname;

-- 6. Testar uma consulta simples
SELECT count(*) as total_bancas FROM bancas;
SELECT count(*) as total_products FROM products;
