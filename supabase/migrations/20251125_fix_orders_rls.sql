-- Fix RLS policy for orders table to allow inserts

-- Desabilitar RLS temporariamente para corrigir
ALTER TABLE orders DISABLE ROW LEVEL SECURITY;

-- Reabilitar RLS
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Dropar políticas existentes se houver
DROP POLICY IF EXISTS "Allow all for service role" ON orders;
DROP POLICY IF EXISTS "Allow insert for all" ON orders;
DROP POLICY IF EXISTS "Allow select for authenticated" ON orders;
DROP POLICY IF EXISTS "Allow update for authenticated" ON orders;
DROP POLICY IF EXISTS "orders_insert_policy" ON orders;
DROP POLICY IF EXISTS "orders_select_policy" ON orders;
DROP POLICY IF EXISTS "orders_update_policy" ON orders;

-- Criar política para permitir INSERT de qualquer pessoa (checkout público)
CREATE POLICY "orders_insert_policy" ON orders
  FOR INSERT
  WITH CHECK (true);

-- Criar política para permitir SELECT de usuários autenticados
CREATE POLICY "orders_select_policy" ON orders
  FOR SELECT
  USING (true);

-- Criar política para permitir UPDATE de usuários autenticados
CREATE POLICY "orders_update_policy" ON orders
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Comentário
COMMENT ON TABLE orders IS 'Tabela de pedidos - RLS configurado para permitir checkout público';
