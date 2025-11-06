-- 🔧 Atualizar Company Token COMPLETO
-- Execute no SQL Editor do Supabase

UPDATE distribuidores
SET 
  mercos_company_token = 'e0924fa8-ab79-11f0-b719-fee26d2b0936',
  updated_at = NOW()
WHERE id = '1511df09-1f4a-4e68-9f8c-05cd06be6269';

-- Verificar se atualizou corretamente
SELECT 
  id,
  nome,
  mercos_application_token as app_token,
  mercos_company_token as company_token,
  updated_at
FROM distribuidores
WHERE id = '1511df09-1f4a-4e68-9f8c-05cd06be6269';
