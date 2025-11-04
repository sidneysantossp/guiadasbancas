-- Migration: Adicionar campos de tokens da Mercos na tabela distribuidores
-- Data: 2025-11-01

-- Adicionar colunas de tokens da API Mercos
ALTER TABLE distribuidores
ADD COLUMN IF NOT EXISTS mercos_application_token TEXT,
ADD COLUMN IF NOT EXISTS mercos_company_token TEXT;

-- Criar índice para buscar por tokens (útil para debug)
CREATE INDEX IF NOT EXISTS idx_distribuidores_tokens 
ON distribuidores(mercos_application_token, mercos_company_token)
WHERE mercos_application_token IS NOT NULL;

-- Adicionar comentários
COMMENT ON COLUMN distribuidores.mercos_application_token IS 'Token de aplicação da API Mercos';
COMMENT ON COLUMN distribuidores.mercos_company_token IS 'Token da empresa na API Mercos';
