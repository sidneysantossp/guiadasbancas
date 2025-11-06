-- 🔧 FIX COMPLETO: Adicionar colunas e inserir tokens
-- Execute TUDO de uma vez no SQL Editor do Supabase

-- PASSO 1: Adicionar as colunas se não existirem
ALTER TABLE distribuidores
ADD COLUMN IF NOT EXISTS mercos_application_token TEXT,
ADD COLUMN IF NOT EXISTS mercos_company_token TEXT;

-- PASSO 2: Atualizar com os tokens da Mercos
UPDATE distribuidores
SET 
  mercos_application_token = 'd987c9ca-b404-11f0-ab94-7aff24e80016',
  mercos_company_token = 'e0924fa8-ab79-11f0-b719-fee26d2b0936',
  updated_at = NOW()
WHERE id = '1511df09-1f4a-4e68-9f8c-05cd06be6269';

-- PASSO 3: Verificar se salvou corretamente
SELECT 
  id,
  nome,
  CASE 
    WHEN mercos_application_token IS NULL THEN '❌ NULL'
    WHEN mercos_application_token = '' THEN '❌ VAZIO'
    ELSE '✅ ' || LEFT(mercos_application_token, 20) || '...'
  END as application_token,
  CASE 
    WHEN mercos_company_token IS NULL THEN '❌ NULL'
    WHEN mercos_company_token = '' THEN '❌ VAZIO'
    ELSE '✅ ' || LEFT(mercos_company_token, 20) || '...'
  END as company_token,
  updated_at
FROM distribuidores
WHERE id = '1511df09-1f4a-4e68-9f8c-05cd06be6269';
