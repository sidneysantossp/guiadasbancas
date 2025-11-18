-- Adicionar campo excluido à tabela products
-- Esse campo é usado para identificar se o produto foi excluído na Mercos

ALTER TABLE products ADD COLUMN IF NOT EXISTS excluido BOOLEAN DEFAULT FALSE;

-- Criar índice para melhorar performance de queries
CREATE INDEX IF NOT EXISTS idx_products_excluido ON products(excluido);

-- Criar índice composto para buscar produtos ativos não excluídos
CREATE INDEX IF NOT EXISTS idx_products_active_status ON products(distribuidor_id, ativo, excluido) WHERE excluido = FALSE;

-- Atualizar produtos existentes: se active=true, assumir que excluido=false
UPDATE products 
SET excluido = FALSE 
WHERE excluido IS NULL AND active = TRUE;

-- Atualizar produtos existentes: se active=false e ativo=true, significa que foi excluído
UPDATE products 
SET excluido = TRUE 
WHERE excluido IS NULL AND active = FALSE AND ativo = TRUE;

-- Atualizar produtos restantes (active=false e ativo=false) como não excluídos
UPDATE products 
SET excluido = FALSE 
WHERE excluido IS NULL;

-- Comentário da coluna
COMMENT ON COLUMN products.excluido IS 'Indica se o produto foi excluído na Mercos (campo excluido da API Mercos)';
