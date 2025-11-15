-- Adicionar coluna addressObj à tabela bancas
-- Execute este SQL no Supabase SQL Editor

ALTER TABLE bancas 
ADD COLUMN IF NOT EXISTS addressObj JSONB;

-- Índice para busca no JSON se necessário
CREATE INDEX IF NOT EXISTS idx_bancas_addressobj ON bancas USING gin (addressObj);

-- Comentário para documentação
COMMENT ON COLUMN bancas.addressObj IS 'Objeto JSON com campos estruturados do endereço: {cep, street, number, complement, neighborhood, city, uf}';
