-- Fix RLS policy for orders table - FINAL
-- Garante que qualquer pessoa pode criar pedidos via checkout público

-- Desabilitar RLS completamente na tabela orders
-- O supabaseAdmin já bypassa RLS, mas vamos garantir que não há bloqueio
ALTER TABLE IF EXISTS orders DISABLE ROW LEVEL SECURITY;

-- Se quiser manter RLS habilitado mas permitir tudo:
-- ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Dropar todas as políticas existentes
DROP POLICY IF EXISTS "Allow all for service role" ON orders;
DROP POLICY IF EXISTS "Allow insert for all" ON orders;
DROP POLICY IF EXISTS "Allow select for authenticated" ON orders;
DROP POLICY IF EXISTS "Allow update for authenticated" ON orders;
DROP POLICY IF EXISTS "orders_insert_policy" ON orders;
DROP POLICY IF EXISTS "orders_select_policy" ON orders;
DROP POLICY IF EXISTS "orders_update_policy" ON orders;
DROP POLICY IF EXISTS "orders_delete_policy" ON orders;
DROP POLICY IF EXISTS "Enable insert for all users" ON orders;
DROP POLICY IF EXISTS "Enable read access for all users" ON orders;
DROP POLICY IF EXISTS "Enable update for all users" ON orders;

-- Comentário
COMMENT ON TABLE orders IS 'Tabela de pedidos - RLS DESABILITADO para permitir checkout público';
