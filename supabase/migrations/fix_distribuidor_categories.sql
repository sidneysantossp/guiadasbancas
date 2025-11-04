-- Script seguro para criar/atualizar estrutura de categorias
-- Pode ser executado múltiplas vezes sem erro

-- 1. Criar tabela se não existir
CREATE TABLE IF NOT EXISTS public.distribuidor_categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  distribuidor_id UUID NOT NULL REFERENCES public.distribuidores(id) ON DELETE CASCADE,
  mercos_id INTEGER NOT NULL,
  nome TEXT NOT NULL,
  categoria_pai_id INTEGER,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Criar constraint único (ignora se já existir)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'unique_distribuidor_mercos_categoria'
  ) THEN
    ALTER TABLE public.distribuidor_categories 
      ADD CONSTRAINT unique_distribuidor_mercos_categoria 
      UNIQUE (distribuidor_id, mercos_id);
  END IF;
END $$;

-- 3. Criar índices se não existirem
CREATE INDEX IF NOT EXISTS idx_dist_categories_distribuidor_id 
  ON public.distribuidor_categories(distribuidor_id);

CREATE INDEX IF NOT EXISTS idx_dist_categories_mercos_id 
  ON public.distribuidor_categories(mercos_id);

CREATE INDEX IF NOT EXISTS idx_dist_categories_nome 
  ON public.distribuidor_categories(nome);

CREATE INDEX IF NOT EXISTS idx_products_category_id 
  ON public.products(category_id);

-- 4. Habilitar RLS
ALTER TABLE public.distribuidor_categories ENABLE ROW LEVEL SECURITY;

-- 5. Criar policies (drop e recria para evitar erro de duplicata)
DROP POLICY IF EXISTS "Permitir leitura de categorias para todos" 
  ON public.distribuidor_categories;

CREATE POLICY "Permitir leitura de categorias para todos" 
  ON public.distribuidor_categories
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Permitir escrita de categorias para service_role" 
  ON public.distribuidor_categories;

CREATE POLICY "Permitir escrita de categorias para service_role" 
  ON public.distribuidor_categories
  FOR ALL USING (auth.role() = 'service_role');

-- 6. Comentários
COMMENT ON TABLE public.distribuidor_categories IS 
  'Categorias de produtos sincronizadas da Mercos por distribuidor';

COMMENT ON COLUMN public.distribuidor_categories.mercos_id IS 
  'ID da categoria na API Mercos';

COMMENT ON COLUMN public.distribuidor_categories.categoria_pai_id IS 
  'ID da categoria pai (hierarquia) na Mercos';

COMMENT ON COLUMN public.products.category_id IS 
  'ID da categoria - pode ser de categories (bancas) ou distribuidor_categories (distribuidores)';

-- Confirmar criação
SELECT 'Tabela distribuidor_categories criada/atualizada com sucesso!' as status;
