-- Remover constraint de chave única do campo codigo_mercos
-- Isso permite que múltiplos produtos tenham o mesmo código (ex: variações, grades)

-- Verificar se a constraint existe
DO $$ 
BEGIN
    -- Tentar remover a constraint se ela existir
    IF EXISTS (
        SELECT 1 
        FROM pg_constraint 
        WHERE conname = 'products_codigo_mercos_key'
    ) THEN
        ALTER TABLE products DROP CONSTRAINT products_codigo_mercos_key;
        RAISE NOTICE 'Constraint products_codigo_mercos_key removida com sucesso';
    ELSE
        RAISE NOTICE 'Constraint products_codigo_mercos_key não existe';
    END IF;
END $$;

-- Criar índice não-único para manter a performance de busca
CREATE INDEX IF NOT EXISTS idx_products_codigo_mercos ON products(codigo_mercos) 
WHERE codigo_mercos IS NOT NULL;

-- Criar índice composto para busca por distribuidor + código
CREATE INDEX IF NOT EXISTS idx_products_distribuidor_codigo ON products(distribuidor_id, codigo_mercos) 
WHERE codigo_mercos IS NOT NULL;

-- Comentário
COMMENT ON INDEX idx_products_codigo_mercos IS 'Índice para busca rápida por codigo_mercos (não único, permite duplicatas)';
