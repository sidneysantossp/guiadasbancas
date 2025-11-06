-- 🧪 Testar com token de Sandbox
-- Execute no SQL Editor do Supabase

UPDATE distribuidores
SET 
  mercos_application_token = 'd39001ac-0b14-11f0-8ed7-6e1485be00f2',
  mercos_company_token = 'e0924fa8-ab79-11f0-b719-fee26d2b0936',
  updated_at = NOW()
WHERE id = '1511df09-1f4a-4e68-9f8c-05cd06be6269';

-- Verificar
SELECT 
  LEFT(mercos_application_token, 25) || '...' as app_token,
  LEFT(mercos_company_token, 25) || '...' as company_token
FROM distribuidores
WHERE id = '1511df09-1f4a-4e68-9f8c-05cd06be6269';
