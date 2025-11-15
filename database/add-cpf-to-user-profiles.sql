-- Adicionar coluna CPF à tabela user_profiles
-- Execute este SQL no Supabase SQL Editor

ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS cpf VARCHAR(14);

-- Índice para busca por CPF (útil para validação de unicidade se necessário)
CREATE INDEX IF NOT EXISTS idx_user_profiles_cpf ON user_profiles(cpf);

-- Comentário para documentação
COMMENT ON COLUMN user_profiles.cpf IS 'CPF do usuário (formato: XXX.XXX.XXX-XX ou apenas números)';
