-- Migration: Adicionar campo codigo_mercos à tabela products
-- Data: 2024-11-17
-- Descrição: Campo para armazenar o código do produto da API Mercos
--            Necessário para vincular imagens por código

-- Adicionar coluna codigo_mercos
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS codigo_mercos TEXT;

-- Criar índice para melhorar performance de buscas por código
CREATE INDEX IF NOT EXISTS idx_products_codigo_mercos 
ON products(codigo_mercos) 
WHERE codigo_mercos IS NOT NULL;

-- Criar índice composto para busca por distribuidor + código
CREATE INDEX IF NOT EXISTS idx_products_distribuidor_codigo 
ON products(distribuidor_id, codigo_mercos) 
WHERE codigo_mercos IS NOT NULL;

-- Comentário na coluna
COMMENT ON COLUMN products.codigo_mercos IS 'Código do produto retornado pela API Mercos (campo "codigo")';
