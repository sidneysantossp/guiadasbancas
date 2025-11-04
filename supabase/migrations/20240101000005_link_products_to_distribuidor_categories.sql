-- Adicionar foreign key entre products.category_id e distribuidor_categories.id
-- Isso permite fazer JOIN para buscar o nome da categoria

-- Nota: category_id em products pode referenciar tanto categories (bancas)
-- quanto distribuidor_categories (distribuidores). Por isso não vamos criar
-- uma FK hard constraint, mas vamos adicionar um índice para performance

-- Criar índice para melhorar performance do JOIN
CREATE INDEX IF NOT EXISTS idx_products_category_id ON public.products(category_id);

-- Comentário explicando a relação
COMMENT ON COLUMN public.products.category_id IS 'ID da categoria - pode ser de categories (bancas) ou distribuidor_categories (distribuidores)';
