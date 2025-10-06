-- ============================================
-- CORRIGIR: Tornar produtos beta como produtos de distribuidor
-- ============================================

-- 1. Criar um distribuidor "Admin" se não existir
INSERT INTO distribuidores (
  id, 
  nome, 
  application_token, 
  company_token,
  ativo, 
  created_at, 
  updated_at
)
VALUES (
  'dddddddd-0000-0000-0000-000000000001',
  'Administrador - Produtos Beta',
  'admin-token-' || extract(epoch from now())::text,
  'company-token-' || extract(epoch from now())::text,
  true,
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. Atualizar produtos beta para serem produtos de distribuidor
UPDATE products 
SET 
  distribuidor_id = 'dddddddd-0000-0000-0000-000000000001',
  origem = 'admin'
WHERE codigo_mercos IS NOT NULL
AND distribuidor_id IS NULL
AND banca_id IS NULL;

-- 3. Verificar produtos atualizados
SELECT 
  name,
  codigo_mercos,
  distribuidor_id,
  origem,
  CASE 
    WHEN distribuidor_id IS NOT NULL THEN 'Produto de distribuidor'
    WHEN banca_id IS NOT NULL THEN 'Produto próprio da banca'
    ELSE 'Sem vinculação'
  END as tipo
FROM products 
WHERE codigo_mercos IS NOT NULL
ORDER BY name;

-- 4. Testar se agora aparecem nas bancas
SELECT 
  COUNT(*) as produtos_distribuidor_total
FROM products 
WHERE distribuidor_id IS NOT NULL;

-- ============================================
-- RESULTADO ESPERADO:
-- - 13 produtos beta agora são produtos de distribuidor
-- - Devem aparecer em TODAS as bancas automaticamente
-- ============================================
