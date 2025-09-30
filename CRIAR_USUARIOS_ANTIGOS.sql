-- ═══════════════════════════════════════════════════════════════
-- CRIAR USUÁRIOS JORNALEIROS DO SISTEMA ANTIGO
-- ═══════════════════════════════════════════════════════════════
-- Execute este SQL no Supabase SQL Editor
-- ═══════════════════════════════════════════════════════════════

-- 1. JORNALEIRO DEMO (Maria Alves)
-- ───────────────────────────────────────────────────────────────
-- Deletar se já existir
DELETE FROM auth.users WHERE email = 'maria@jornaleiro.com';

-- Criar usuário
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'maria@jornaleiro.com',
  crypt('senha123', gen_salt('bf')),
  NOW(),
  '{"provider":"email","providers":["email"]}',
  '{"full_name":"Maria Alves","role":"jornaleiro"}',
  NOW(),
  NOW()
);

-- Criar banca da Maria
INSERT INTO public.bancas (
  user_id,
  name,
  cep,
  address,
  lat,
  lng,
  whatsapp,
  email,
  delivery_fee,
  min_order_value,
  delivery_radius,
  preparation_time,
  payment_methods,
  active,
  approved
) VALUES (
  (SELECT id FROM auth.users WHERE email = 'maria@jornaleiro.com'),
  'Banca São Jorge',
  '01305-100',
  'Rua Augusta, 1024 - Consolação, São Paulo - SP',
  -23.5505,
  -46.6333,
  '11987654321',
  'maria@jornaleiro.com',
  5.00,
  10.00,
  5,
  30,
  ARRAY['pix', 'dinheiro', 'debito', 'credito'],
  true,
  true
);

-- Atualizar perfil com banca_id
UPDATE public.user_profiles
SET banca_id = (SELECT id FROM public.bancas WHERE user_id = (SELECT id FROM auth.users WHERE email = 'maria@jornaleiro.com'))
WHERE id = (SELECT id FROM auth.users WHERE email = 'maria@jornaleiro.com');


-- 2. JORNALEIRO TESTE
-- ───────────────────────────────────────────────────────────────
-- Deletar se já existir
DELETE FROM auth.users WHERE email = 'teste@jornaleiro.com';

-- Criar usuário
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'teste@jornaleiro.com',
  crypt('senha123', gen_salt('bf')),
  NOW(),
  '{"provider":"email","providers":["email"]}',
  '{"full_name":"Jornaleiro Teste","role":"jornaleiro"}',
  NOW(),
  NOW()
);

-- Criar banca de teste
INSERT INTO public.bancas (
  user_id,
  name,
  cep,
  address,
  lat,
  lng,
  whatsapp,
  email,
  delivery_fee,
  min_order_value,
  delivery_radius,
  preparation_time,
  payment_methods,
  active,
  approved
) VALUES (
  (SELECT id FROM auth.users WHERE email = 'teste@jornaleiro.com'),
  'Banca Teste',
  '01310-100',
  'Av. Paulista, 1000 - Bela Vista, São Paulo - SP',
  -23.5505,
  -46.6333,
  '11999999999',
  'teste@jornaleiro.com',
  5.00,
  10.00,
  5,
  30,
  ARRAY['pix', 'dinheiro'],
  true,
  true
);

-- Atualizar perfil com banca_id
UPDATE public.user_profiles
SET banca_id = (SELECT id FROM public.bancas WHERE user_id = (SELECT id FROM auth.users WHERE email = 'teste@jornaleiro.com'))
WHERE id = (SELECT id FROM auth.users WHERE email = 'teste@jornaleiro.com');


-- 3. ADMIN
-- ───────────────────────────────────────────────────────────────
-- Deletar se já existir
DELETE FROM auth.users WHERE email = 'admin@guiadasbancas.com';

-- Criar usuário
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'admin@guiadasbancas.com',
  crypt('admin123', gen_salt('bf')),
  NOW(),
  '{"provider":"email","providers":["email"]}',
  '{"full_name":"Administrador","role":"admin"}',
  NOW(),
  NOW()
);


-- ═══════════════════════════════════════════════════════════════
-- VERIFICAR USUÁRIOS CRIADOS
-- ═══════════════════════════════════════════════════════════════

SELECT 
  u.email,
  up.role,
  up.full_name,
  b.name as banca_name,
  b.active,
  b.approved
FROM auth.users u
LEFT JOIN public.user_profiles up ON up.id = u.id
LEFT JOIN public.bancas b ON b.user_id = u.id
WHERE u.email IN ('maria@jornaleiro.com', 'teste@jornaleiro.com', 'admin@guiadasbancas.com');


-- ═══════════════════════════════════════════════════════════════
-- CREDENCIAIS PARA LOGIN
-- ═══════════════════════════════════════════════════════════════

/*

JORNALEIRO 1 (Maria):
Email: maria@jornaleiro.com
Senha: senha123
Banca: Banca São Jorge

JORNALEIRO 2 (Teste):
Email: teste@jornaleiro.com
Senha: senha123
Banca: Banca Teste

ADMIN:
Email: admin@guiadasbancas.com
Senha: admin123

*/
