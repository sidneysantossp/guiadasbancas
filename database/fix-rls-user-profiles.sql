-- FIX: Remover recursão infinita das políticas RLS de user_profiles
-- Execute este SQL no Supabase SQL Editor

-- 1. Desabilitar RLS temporariamente
ALTER TABLE user_profiles DISABLE ROW LEVEL SECURITY;

-- 2. Remover todas as políticas antigas
DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON user_profiles;
DROP POLICY IF EXISTS "Service role can manage all profiles" ON user_profiles;
DROP POLICY IF EXISTS "Allow service role full access" ON user_profiles;

-- 3. Criar/atualizar o perfil do jornaleiro
INSERT INTO user_profiles (id, role, full_name, active, email_verified)
VALUES ('b35d107d-5114-4f18-b5aa-a3b8c711fa84', 'jornaleiro', 'Banca Guia das Bancas', true, true)
ON CONFLICT (id) DO UPDATE 
  SET active = true, 
      role = 'jornaleiro',
      full_name = 'Banca Guia das Bancas',
      email_verified = true;

-- 4. Reabilitar RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- 5. Criar políticas SEM recursão
-- Service role tem acesso total (não precisa checar outras tabelas)
CREATE POLICY "service_role_all_access" 
ON user_profiles 
FOR ALL 
TO service_role
USING (true)
WITH CHECK (true);

-- Usuários autenticados podem ver apenas seu próprio perfil
CREATE POLICY "users_read_own" 
ON user_profiles 
FOR SELECT 
TO authenticated
USING (auth.uid() = id);

-- Usuários autenticados podem atualizar apenas seu próprio perfil
CREATE POLICY "users_update_own" 
ON user_profiles 
FOR UPDATE 
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- 6. Verificar resultado
SELECT id, role, full_name, active, email_verified 
FROM user_profiles 
WHERE id = 'b35d107d-5114-4f18-b5aa-a3b8c711fa84';
