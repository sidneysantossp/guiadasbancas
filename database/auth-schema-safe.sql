-- Schema adicional para Autenticação e Perfis de Usuário
-- Versão SAFE: Remove objetos existentes antes de criar
-- Execute este SQL após o schema.sql principal

-- Tabela de perfis de usuários (complementa auth.users do Supabase)
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'jornaleiro', 'cliente')),
    full_name VARCHAR(255),
    phone VARCHAR(20),
    avatar_url TEXT,
    banca_id UUID REFERENCES bancas(id) ON DELETE SET NULL,
    active BOOLEAN DEFAULT TRUE,
    email_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON user_profiles(role);
CREATE INDEX IF NOT EXISTS idx_user_profiles_banca_id ON user_profiles(banca_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_active ON user_profiles(active);

-- Trigger para updated_at (DROP antes de criar)
DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON user_profiles;
CREATE TRIGGER update_user_profiles_updated_at 
BEFORE UPDATE ON user_profiles 
FOR EACH ROW 
EXECUTE FUNCTION update_updated_at_column();

-- Adicionar campos à tabela bancas para perfil completo
ALTER TABLE bancas ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;
ALTER TABLE bancas ADD COLUMN IF NOT EXISTS logo_url TEXT;
ALTER TABLE bancas ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE bancas ADD COLUMN IF NOT EXISTS phone VARCHAR(20);
ALTER TABLE bancas ADD COLUMN IF NOT EXISTS whatsapp VARCHAR(20);
ALTER TABLE bancas ADD COLUMN IF NOT EXISTS email VARCHAR(255);
ALTER TABLE bancas ADD COLUMN IF NOT EXISTS instagram VARCHAR(255);
ALTER TABLE bancas ADD COLUMN IF NOT EXISTS facebook VARCHAR(255);
ALTER TABLE bancas ADD COLUMN IF NOT EXISTS opening_hours JSONB; -- {monday: "08:00-18:00", tuesday: "08:00-18:00", ...}
ALTER TABLE bancas ADD COLUMN IF NOT EXISTS delivery_fee DECIMAL(10, 2) DEFAULT 0;
ALTER TABLE bancas ADD COLUMN IF NOT EXISTS min_order_value DECIMAL(10, 2) DEFAULT 0;
ALTER TABLE bancas ADD COLUMN IF NOT EXISTS delivery_radius INTEGER DEFAULT 5; -- km
ALTER TABLE bancas ADD COLUMN IF NOT EXISTS preparation_time INTEGER DEFAULT 30; -- minutos
ALTER TABLE bancas ADD COLUMN IF NOT EXISTS payment_methods TEXT[]; -- ['pix', 'credit_card', 'debit_card', 'cash']
ALTER TABLE bancas ADD COLUMN IF NOT EXISTS active BOOLEAN DEFAULT TRUE;
ALTER TABLE bancas ADD COLUMN IF NOT EXISTS approved BOOLEAN DEFAULT FALSE;
ALTER TABLE bancas ADD COLUMN IF NOT EXISTS approved_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE bancas ADD COLUMN IF NOT EXISTS approved_by UUID REFERENCES auth.users(id);

-- Índices adicionais para bancas
CREATE INDEX IF NOT EXISTS idx_bancas_user_id ON bancas(user_id);
CREATE INDEX IF NOT EXISTS idx_bancas_active ON bancas(active);
CREATE INDEX IF NOT EXISTS idx_bancas_approved ON bancas(approved);

-- RLS para user_profiles
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para user_profiles (DROP antes de criar)
DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON user_profiles;
DROP POLICY IF EXISTS "Service role can manage all profiles" ON user_profiles;

CREATE POLICY "Users can view own profile" 
ON user_profiles FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
ON user_profiles FOR UPDATE 
USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" 
ON user_profiles FOR SELECT 
USING (
    EXISTS (
        SELECT 1 FROM user_profiles 
        WHERE id = auth.uid() AND role = 'admin'
    )
);

CREATE POLICY "Service role can manage all profiles"
ON user_profiles FOR ALL
USING (auth.role() = 'service_role');

-- Políticas RLS atualizadas para bancas (DROP antes de criar)
DROP POLICY IF EXISTS "Jornaleiros can manage own banca" ON bancas;
DROP POLICY IF EXISTS "Admins can manage all bancas" ON bancas;

CREATE POLICY "Jornaleiros can manage own banca" 
ON bancas FOR ALL 
USING (
    user_id = auth.uid() OR 
    EXISTS (
        SELECT 1 FROM user_profiles 
        WHERE id = auth.uid() AND banca_id = bancas.id
    )
);

CREATE POLICY "Admins can manage all bancas" 
ON bancas FOR ALL 
USING (
    EXISTS (
        SELECT 1 FROM user_profiles 
        WHERE id = auth.uid() AND role = 'admin'
    )
);

-- Função para criar perfil automaticamente após registro (DROP antes de criar)
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.user_profiles (id, role, full_name, email_verified)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'role', 'cliente'),
        COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
        NEW.email_confirmed_at IS NOT NULL
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para criar perfil automaticamente (DROP antes de criar)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Função para atualizar email_verified quando confirmado (DROP antes de criar)
DROP FUNCTION IF EXISTS public.handle_user_email_verified() CASCADE;
CREATE OR REPLACE FUNCTION public.handle_user_email_verified()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.email_confirmed_at IS NOT NULL AND OLD.email_confirmed_at IS NULL THEN
        UPDATE public.user_profiles
        SET email_verified = TRUE
        WHERE id = NEW.id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para atualizar email_verified (DROP antes de criar)
DROP TRIGGER IF EXISTS on_auth_user_email_verified ON auth.users;
CREATE TRIGGER on_auth_user_email_verified
AFTER UPDATE ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_user_email_verified();

-- Comentários para documentação
COMMENT ON TABLE user_profiles IS 'Perfis de usuários complementando auth.users do Supabase';
COMMENT ON COLUMN user_profiles.role IS 'Tipo de usuário: admin, jornaleiro ou cliente';
COMMENT ON COLUMN user_profiles.banca_id IS 'ID da banca associada (para jornaleiros)';
COMMENT ON COLUMN bancas.opening_hours IS 'Horários de funcionamento em formato JSON';
COMMENT ON COLUMN bancas.payment_methods IS 'Métodos de pagamento aceitos pela banca';
