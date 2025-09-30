-- ═══════════════════════════════════════════════════════════════
-- CORRIGIR RLS (Row Level Security) - SOLUÇÃO DEFINITIVA
-- ═══════════════════════════════════════════════════════════════
-- Execute este SQL no Supabase SQL Editor
-- ═══════════════════════════════════════════════════════════════

-- 1. DESABILITAR RLS TEMPORARIAMENTE (para debug)
ALTER TABLE public.user_profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.bancas DISABLE ROW LEVEL SECURITY;

-- 2. REMOVER POLÍTICAS ANTIGAS
DROP POLICY IF EXISTS "Usuários podem ver próprio perfil" ON public.user_profiles;
DROP POLICY IF EXISTS "Usuários podem atualizar próprio perfil" ON public.user_profiles;
DROP POLICY IF EXISTS "Admins podem ver todos os perfis" ON public.user_profiles;
DROP POLICY IF EXISTS "Jornaleiros podem ver própria banca" ON public.bancas;
DROP POLICY IF EXISTS "Jornaleiros podem atualizar própria banca" ON public.bancas;
DROP POLICY IF EXISTS "Todos podem ver bancas ativas" ON public.bancas;
DROP POLICY IF EXISTS "Admins podem gerenciar bancas" ON public.bancas;

-- 3. HABILITAR RLS
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bancas ENABLE ROW LEVEL SECURITY;

-- 4. CRIAR POLÍTICAS CORRETAS PARA user_profiles

-- Permitir que usuários vejam seu próprio perfil
CREATE POLICY "Usuários podem ver próprio perfil"
ON public.user_profiles
FOR SELECT
TO authenticated
USING (auth.uid() = id);

-- Permitir que usuários atualizem seu próprio perfil
CREATE POLICY "Usuários podem atualizar próprio perfil"
ON public.user_profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Permitir que admins vejam todos os perfis
CREATE POLICY "Admins podem ver todos os perfis"
ON public.user_profiles
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Permitir inserção de perfis (para o trigger)
CREATE POLICY "Sistema pode criar perfis"
ON public.user_profiles
FOR INSERT
TO authenticated
WITH CHECK (true);

-- 5. CRIAR POLÍTICAS CORRETAS PARA bancas

-- Todos podem ver bancas ativas e aprovadas
CREATE POLICY "Todos podem ver bancas ativas"
ON public.bancas
FOR SELECT
TO authenticated, anon
USING (active = true AND approved = true);

-- Jornaleiros podem ver sua própria banca (mesmo não aprovada)
CREATE POLICY "Jornaleiros podem ver própria banca"
ON public.bancas
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Jornaleiros podem atualizar sua própria banca
CREATE POLICY "Jornaleiros podem atualizar própria banca"
ON public.bancas
FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Jornaleiros podem criar sua banca
CREATE POLICY "Jornaleiros podem criar banca"
ON public.bancas
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

-- Admins podem fazer tudo
CREATE POLICY "Admins podem gerenciar bancas"
ON public.bancas
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.user_profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- 6. VERIFICAR POLÍTICAS CRIADAS
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies
WHERE schemaname = 'public' 
  AND tablename IN ('user_profiles', 'bancas')
ORDER BY tablename, policyname;

-- ═══════════════════════════════════════════════════════════════
-- TESTE: Verificar se consegue ler perfis
-- ═══════════════════════════════════════════════════════════════

-- Deve retornar todos os perfis
SELECT id, role, full_name, phone FROM public.user_profiles;
