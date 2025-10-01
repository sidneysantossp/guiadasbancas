-- Script para corrigir políticas RLS para service_role
-- Execute no SQL Editor do Supabase

-- 1. Verificar role atual
SELECT current_user, current_setting('role');

-- 2. Remover todas as políticas existentes
DROP POLICY IF EXISTS "Enable read access for all users" ON bancas;
DROP POLICY IF EXISTS "Enable read access for all users" ON categories;
DROP POLICY IF EXISTS "Enable read access for all users" ON products;
DROP POLICY IF EXISTS "Enable read access for all users" ON branding;
DROP POLICY IF EXISTS "Enable all for service role" ON bancas;
DROP POLICY IF EXISTS "Enable all for service role" ON categories;
DROP POLICY IF EXISTS "Enable all for service role" ON products;
DROP POLICY IF EXISTS "Enable all for service role" ON orders;
DROP POLICY IF EXISTS "Enable all for service role" ON branding;

-- 3. Criar políticas mais permissivas para service_role
CREATE POLICY "service_role_all_bancas" ON bancas FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "service_role_all_categories" ON categories FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "service_role_all_products" ON products FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "service_role_all_orders" ON orders FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "service_role_all_branding" ON branding FOR ALL TO service_role USING (true) WITH CHECK (true);

-- 4. Criar políticas para leitura pública (anon role)
CREATE POLICY "public_read_bancas" ON bancas FOR SELECT TO anon USING (true);
CREATE POLICY "public_read_categories" ON categories FOR SELECT TO anon USING (true);
CREATE POLICY "public_read_products" ON products FOR SELECT TO anon USING (true);
CREATE POLICY "public_read_branding" ON branding FOR SELECT TO anon USING (true);

-- 5. Criar políticas para usuários autenticados
CREATE POLICY "authenticated_read_bancas" ON bancas FOR SELECT TO authenticated USING (true);
CREATE POLICY "authenticated_read_categories" ON categories FOR SELECT TO authenticated USING (true);
CREATE POLICY "authenticated_read_products" ON products FOR SELECT TO authenticated USING (true);
CREATE POLICY "authenticated_read_branding" ON branding FOR SELECT TO authenticated USING (true);

-- 6. Verificar políticas criadas
SELECT schemaname, tablename, policyname, roles, cmd 
FROM pg_policies 
WHERE schemaname = 'public' 
AND tablename IN ('bancas', 'products', 'categories', 'orders', 'branding')
ORDER BY tablename, policyname;

-- 7. Testar consultas
SELECT 'Bancas:' as tabela, count(*) as total FROM bancas
UNION ALL
SELECT 'Products:' as tabela, count(*) as total FROM products
UNION ALL
SELECT 'Categories:' as tabela, count(*) as total FROM categories;
