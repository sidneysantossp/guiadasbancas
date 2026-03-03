-- Adiciona campos para integração com Mercos na tabela categories
-- Permite vincular categorias globais com categorias da Mercos

-- Adicionar campo mercos_id para vincular com categorias da Mercos
ALTER TABLE categories ADD COLUMN IF NOT EXISTS mercos_id INTEGER;

-- Adicionar campo categoria_pai_id para hierarquia de categorias
ALTER TABLE categories ADD COLUMN IF NOT EXISTS parent_category_id UUID REFERENCES categories(id);

-- Adicionar campo ultima_sincronizacao para rastrear atualizações
ALTER TABLE categories ADD COLUMN IF NOT EXISTS ultima_sincronizacao TIMESTAMP WITH TIME ZONE;

-- Criar índices para melhorar performance
CREATE INDEX IF NOT EXISTS idx_categories_mercos_id ON categories(mercos_id);
CREATE INDEX IF NOT EXISTS idx_categories_parent ON categories(parent_category_id);
CREATE INDEX IF NOT EXISTS idx_dist_categories_mercos ON distribuidor_categories(mercos_id);

-- Comentários para documentação
COMMENT ON COLUMN categories.mercos_id IS 'ID da categoria na API Mercos (permite vincular com distribuidor_categories)';
COMMENT ON COLUMN categories.parent_category_id IS 'Categoria pai para hierarquia (ex: Bebidas > Refrigerantes)';
COMMENT ON COLUMN categories.ultima_sincronizacao IS 'Timestamp da última sincronização com dados da Mercos';
