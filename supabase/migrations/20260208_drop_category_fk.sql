-- Drop FK constraint on products.category_id que referencia apenas a tabela 'categories'
-- Isso permite que products.category_id referencie tanto 'categories' quanto 'distribuidor_categories'
-- Necessário para que produtos de distribuidores (Mercos) possam ter category_id apontando
-- para distribuidor_categories (ex: "Tabaco e Seda", "Bebidas", etc.)

ALTER TABLE public.products DROP CONSTRAINT IF EXISTS products_category_id_fkey;

-- Criar índice para performance (se não existir)
CREATE INDEX IF NOT EXISTS idx_products_category_id ON public.products(category_id);
