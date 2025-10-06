-- Adicionar campo codigo_mercos para vinculação de imagens
-- Este campo armazena o código único do produto na Mercos (ex: AKOTO001, ADBEM001)
-- Usado para vincular automaticamente imagens baixadas em massa

ALTER TABLE products
ADD COLUMN IF NOT EXISTS codigo_mercos VARCHAR(50) UNIQUE;

-- Adicionar índice para busca rápida por código
CREATE INDEX IF NOT EXISTS idx_products_codigo_mercos ON products(codigo_mercos);

-- Adicionar campos adicionais compatíveis com Mercos
ALTER TABLE products
ADD COLUMN IF NOT EXISTS unidade_medida VARCHAR(10) DEFAULT 'UN',
ADD COLUMN IF NOT EXISTS venda_multiplos DECIMAL(10,2) DEFAULT 1.00,
ADD COLUMN IF NOT EXISTS categoria_mercos VARCHAR(100),
ADD COLUMN IF NOT EXISTS disponivel_todas_bancas BOOLEAN DEFAULT false;

-- Comentários
COMMENT ON COLUMN products.codigo_mercos IS 'Código único do produto na Mercos (ex: AKOTO001)';
COMMENT ON COLUMN products.unidade_medida IS 'Unidade de medida (UN, CX, KG, etc)';
COMMENT ON COLUMN products.venda_multiplos IS 'Venda em múltiplos de (ex: 1.00, 2.00)';
COMMENT ON COLUMN products.categoria_mercos IS 'Categoria original da Mercos';
COMMENT ON COLUMN products.disponivel_todas_bancas IS 'Se true, produto fica disponível para todas as bancas automaticamente';
