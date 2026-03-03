-- Execute este SQL no Supabase Dashboard (SQL Editor)
-- https://supabase.com/dashboard/project/YOUR_PROJECT/sql

-- 1. Adicionar campo mercos_id
ALTER TABLE categories ADD COLUMN IF NOT EXISTS mercos_id INTEGER;

-- 2. Adicionar campo parent_category_id (hierarquia)
ALTER TABLE categories ADD COLUMN IF NOT EXISTS parent_category_id UUID REFERENCES categories(id);

-- 3. Adicionar campo ultima_sincronizacao
ALTER TABLE categories ADD COLUMN IF NOT EXISTS ultima_sincronizacao TIMESTAMPTZ;

-- 4. Criar índices para performance
CREATE INDEX IF NOT EXISTS idx_categories_mercos_id ON categories(mercos_id);
CREATE INDEX IF NOT EXISTS idx_categories_parent ON categories(parent_category_id);
CREATE INDEX IF NOT EXISTS idx_dist_categories_mercos ON distribuidor_categories(mercos_id);

-- 5. Verificar resultado
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'categories' 
ORDER BY ordinal_position;
