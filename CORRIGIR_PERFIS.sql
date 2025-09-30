-- ═══════════════════════════════════════════════════════════════
-- CORRIGIR PERFIS DE USUÁRIOS EXISTENTES
-- ═══════════════════════════════════════════════════════════════
-- Execute este SQL no Supabase SQL Editor
-- ═══════════════════════════════════════════════════════════════

-- Criar perfis para usuários que não têm
INSERT INTO public.user_profiles (id, role, full_name, phone, created_at, updated_at)
SELECT 
  u.id,
  COALESCE(u.raw_user_meta_data->>'role', 'cliente')::text as role,
  COALESCE(u.raw_user_meta_data->>'full_name', split_part(u.email, '@', 1))::text as full_name,
  COALESCE(u.raw_user_meta_data->>'phone', NULL)::text as phone,
  u.created_at,
  NOW()
FROM auth.users u
WHERE u.id NOT IN (SELECT id FROM public.user_profiles)
ON CONFLICT (id) DO NOTHING;

-- Verificar perfis criados
SELECT 
  u.email,
  up.role,
  up.full_name,
  CASE 
    WHEN up.id IS NULL THEN '❌ SEM PERFIL'
    ELSE '✅ COM PERFIL'
  END as status
FROM auth.users u
LEFT JOIN public.user_profiles up ON up.id = u.id
ORDER BY u.created_at DESC;
