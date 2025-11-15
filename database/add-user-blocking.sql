-- Adicionar campos para bloqueio de usuários
-- Execute este SQL no Supabase SQL Editor

ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS blocked BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS blocked_reason TEXT,
ADD COLUMN IF NOT EXISTS blocked_at TIMESTAMPTZ;

-- Índice para busca rápida de usuários bloqueados
CREATE INDEX IF NOT EXISTS idx_user_profiles_blocked ON user_profiles(blocked) WHERE blocked = true;

-- Comentários para documentação
COMMENT ON COLUMN user_profiles.blocked IS 'Indica se o usuário está bloqueado pelo admin';
COMMENT ON COLUMN user_profiles.blocked_reason IS 'Motivo do bloqueio';
COMMENT ON COLUMN user_profiles.blocked_at IS 'Data e hora do bloqueio';
