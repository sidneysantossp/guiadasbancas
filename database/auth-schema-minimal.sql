-- Schema MÍNIMO para Autenticação
-- Execute este SQL no Supabase SQL Editor

-- 1. Criar tabela user_profiles se não existir
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    role VARCHAR(20) NOT NULL DEFAULT 'cliente' CHECK (role IN ('admin', 'jornaleiro', 'cliente')),
    full_name VARCHAR(255),
    phone VARCHAR(20),
    avatar_url TEXT,
    banca_id UUID REFERENCES bancas(id) ON DELETE SET NULL,
    active BOOLEAN DEFAULT TRUE,
    email_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Adicionar colunas na tabela bancas (ignora se já existirem)
DO $$ 
BEGIN
    ALTER TABLE bancas ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;
    ALTER TABLE bancas ADD COLUMN IF NOT EXISTS logo_url TEXT;
    ALTER TABLE bancas ADD COLUMN IF NOT EXISTS description TEXT;
    ALTER TABLE bancas ADD COLUMN IF NOT EXISTS phone VARCHAR(20);
    ALTER TABLE bancas ADD COLUMN IF NOT EXISTS whatsapp VARCHAR(20);
    ALTER TABLE bancas ADD COLUMN IF NOT EXISTS email VARCHAR(255);
    ALTER TABLE bancas ADD COLUMN IF NOT EXISTS instagram VARCHAR(255);
    ALTER TABLE bancas ADD COLUMN IF NOT EXISTS facebook VARCHAR(255);
    ALTER TABLE bancas ADD COLUMN IF NOT EXISTS opening_hours JSONB;
    ALTER TABLE bancas ADD COLUMN IF NOT EXISTS delivery_fee DECIMAL(10, 2) DEFAULT 0;
    ALTER TABLE bancas ADD COLUMN IF NOT EXISTS min_order_value DECIMAL(10, 2) DEFAULT 0;
    ALTER TABLE bancas ADD COLUMN IF NOT EXISTS delivery_radius INTEGER DEFAULT 5;
    ALTER TABLE bancas ADD COLUMN IF NOT EXISTS preparation_time INTEGER DEFAULT 30;
    ALTER TABLE bancas ADD COLUMN IF NOT EXISTS payment_methods TEXT[];
    ALTER TABLE bancas ADD COLUMN IF NOT EXISTS active BOOLEAN DEFAULT TRUE;
    ALTER TABLE bancas ADD COLUMN IF NOT EXISTS approved BOOLEAN DEFAULT FALSE;
    ALTER TABLE bancas ADD COLUMN IF NOT EXISTS approved_at TIMESTAMP WITH TIME ZONE;
    ALTER TABLE bancas ADD COLUMN IF NOT EXISTS approved_by UUID REFERENCES auth.users(id);
EXCEPTION
    WHEN duplicate_column THEN NULL;
END $$;

-- 3. Criar índices
CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON user_profiles(role);
CREATE INDEX IF NOT EXISTS idx_user_profiles_banca_id ON user_profiles(banca_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_active ON user_profiles(active);
CREATE INDEX IF NOT EXISTS idx_bancas_user_id ON bancas(user_id);
CREATE INDEX IF NOT EXISTS idx_bancas_active ON bancas(active);
CREATE INDEX IF NOT EXISTS idx_bancas_approved ON bancas(approved);

-- 4. Habilitar RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- 5. Remover políticas antigas
DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
DROP POLICY IF EXISTS "Service role full access" ON user_profiles;
DROP POLICY IF EXISTS "Public read access" ON user_profiles;

-- 6. Criar políticas RLS
CREATE POLICY "Service role full access"
ON user_profiles FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

CREATE POLICY "Users can view own profile"
ON user_profiles FOR SELECT
TO authenticated
USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
ON user_profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- 7. Função para criar perfil automaticamente
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO public.user_profiles (id, role, full_name, email_verified)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'role', 'cliente'),
        COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
        COALESCE(NEW.email_confirmed_at IS NOT NULL, false)
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
EXCEPTION
    WHEN OTHERS THEN
        RAISE WARNING 'Erro ao criar perfil: %', SQLERRM;
        RETURN NEW;
END;
$$;

-- 8. Criar trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- 9. Testar se trigger está ativo
SELECT 
    trigger_name, 
    event_manipulation, 
    event_object_table,
    action_statement
FROM information_schema.triggers
WHERE trigger_name = 'on_auth_user_created';
