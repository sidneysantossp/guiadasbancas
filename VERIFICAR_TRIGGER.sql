-- ═══════════════════════════════════════════════════════════════
-- VERIFICAR SE O TRIGGER ESTÁ FUNCIONANDO
-- ═══════════════════════════════════════════════════════════════

-- 1. Verificar se o trigger existe
SELECT 
  trigger_name,
  event_manipulation,
  event_object_table,
  action_statement
FROM information_schema.triggers
WHERE trigger_name = 'on_auth_user_created';

-- 2. Verificar se a função existe
SELECT 
  routine_name,
  routine_type,
  routine_definition
FROM information_schema.routines
WHERE routine_name = 'handle_new_user';

-- 3. Verificar usuários sem perfil
SELECT 
  u.id,
  u.email,
  u.created_at,
  up.id as profile_id,
  up.role
FROM auth.users u
LEFT JOIN public.user_profiles up ON up.id = u.id
WHERE up.id IS NULL;

-- 4. Se houver usuários sem perfil, criar manualmente
-- Execute este bloco para cada usuário sem perfil:

/*
INSERT INTO public.user_profiles (id, role, full_name, created_at, updated_at)
SELECT 
  id,
  COALESCE(raw_user_meta_data->>'role', 'cliente'),
  COALESCE(raw_user_meta_data->>'full_name', email),
  created_at,
  updated_at
FROM auth.users
WHERE id NOT IN (SELECT id FROM public.user_profiles);
*/

-- 5. Verificar todos os perfis criados
SELECT 
  u.email,
  up.role,
  up.full_name,
  up.created_at
FROM auth.users u
INNER JOIN public.user_profiles up ON up.id = u.id
ORDER BY up.created_at DESC;
