-- 🔍 DEBUG: Verificar tokens da Mercos
-- Execute este SQL no SQL Editor do Supabase

-- 1. Ver os tokens atuais (mascarados para segurança)
SELECT 
  id,
  nome,
  CASE 
    WHEN mercos_application_token IS NULL THEN '❌ NULL'
    WHEN mercos_application_token = '' THEN '❌ VAZIO'
    ELSE '✅ ' || LEFT(mercos_application_token, 15) || '...'
  END as application_token_status,
  CASE 
    WHEN mercos_company_token IS NULL THEN '❌ NULL'
    WHEN mercos_company_token = '' THEN '❌ VAZIO'
    ELSE '✅ ' || LEFT(mercos_company_token, 15) || '...'
  END as company_token_status,
  created_at,
  updated_at
FROM distribuidores
WHERE id = '1511df09-1f4a-4e68-9f8c-05cd06be6269';

-- 2. Contar quantos produtos sem categoria
SELECT 
  COUNT(*) as total_produtos,
  COUNT(CASE WHEN category_id = 'bbbbbbbb-0000-0000-0000-000000000001' THEN 1 END) as sem_categoria
FROM products
WHERE distribuidor_id = '1511df09-1f4a-4e68-9f8c-05cd06be6269';

-- 3. Verificar se há categorias sincronizadas
SELECT COUNT(*) as total_categorias
FROM distribuidor_categories
WHERE distribuidor_id = '1511df09-1f4a-4e68-9f8c-05cd06be6269';
