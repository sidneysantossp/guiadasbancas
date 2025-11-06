-- 🔑 Atualizar tokens da Mercos
-- Execute este SQL no SQL Editor do Supabase

UPDATE distribuidores
SET 
  mercos_application_token = 'd987c9ca-b404-11f0-ab94-7aff24e80016',
  mercos_company_token = 'e0924fa8-ab79-11f0-b719-fee26d2b0936',
  updated_at = NOW()
WHERE id = '1511df09-1f4a-4e68-9f8c-05cd06be6269';

-- Verificar se atualizou
SELECT 
  id,
  nome,
  LEFT(mercos_application_token, 15) || '...' as app_token,
  LEFT(mercos_company_token, 15) || '...' as company_token,
  updated_at
FROM distribuidores
WHERE id = '1511df09-1f4a-4e68-9f8c-05cd06be6269';
