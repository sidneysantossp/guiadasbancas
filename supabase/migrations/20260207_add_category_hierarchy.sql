-- Adicionar campo parent_id para hierarquia de categorias
ALTER TABLE public.categories 
ADD COLUMN IF NOT EXISTS parent_id UUID REFERENCES public.categories(id) ON DELETE SET NULL;

-- Índice para busca por parent_id
CREATE INDEX IF NOT EXISTS idx_categories_parent_id ON public.categories(parent_id);

-- Comentários
COMMENT ON COLUMN public.categories.parent_id IS 'ID da categoria pai para hierarquia (NULL = categoria raiz)';
