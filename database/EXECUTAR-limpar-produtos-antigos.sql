-- ============================================
-- DELETAR PRODUTOS ANTIGOS - MANTER APENAS OS 13 BETA
-- ============================================
-- Execute este arquivo no SQL Editor do Supabase
-- ============================================

-- PASSO 1: Ver o que será deletado (PREVIEW)
SELECT 
  id, 
  name, 
  banca_id,
  created_at 
FROM products 
WHERE codigo_mercos IS NULL
ORDER BY created_at DESC;

-- PASSO 2: Deletar produtos antigos (EXECUTE DEPOIS DE CONFIRMAR)
DELETE FROM products WHERE codigo_mercos IS NULL;

-- PASSO 3: Confirmar que sobraram apenas 13 produtos
SELECT COUNT(*) as total_produtos_restantes FROM products;

-- PASSO 4: Listar os 13 produtos beta
SELECT 
  id,
  name,
  codigo_mercos,
  price,
  stock_qty
FROM products
ORDER BY name;
