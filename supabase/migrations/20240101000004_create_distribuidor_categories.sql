-- Criar tabela de categorias dos distribuidores
CREATE TABLE IF NOT EXISTS public.distribuidor_categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  distribuidor_id UUID NOT NULL REFERENCES public.distribuidores(id) ON DELETE CASCADE,
  mercos_id INTEGER NOT NULL,
  nome TEXT NOT NULL,
  categoria_pai_id INTEGER,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Índice único para evitar duplicatas
  CONSTRAINT unique_distribuidor_mercos_categoria UNIQUE (distribuidor_id, mercos_id)
);

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_dist_categories_distribuidor_id ON public.distribuidor_categories(distribuidor_id);
CREATE INDEX IF NOT EXISTS idx_dist_categories_mercos_id ON public.distribuidor_categories(mercos_id);
CREATE INDEX IF NOT EXISTS idx_dist_categories_nome ON public.distribuidor_categories(nome);

-- Comentários
COMMENT ON TABLE public.distribuidor_categories IS 'Categorias de produtos sincronizadas da Mercos por distribuidor';
COMMENT ON COLUMN public.distribuidor_categories.mercos_id IS 'ID da categoria na API Mercos';
COMMENT ON COLUMN public.distribuidor_categories.categoria_pai_id IS 'ID da categoria pai (hierarquia) na Mercos';

-- Habilitar RLS (Row Level Security)
ALTER TABLE public.distribuidor_categories ENABLE ROW LEVEL SECURITY;

-- Políticas de acesso
CREATE POLICY "Permitir leitura de categorias para todos" ON public.distribuidor_categories
  FOR SELECT USING (true);

CREATE POLICY "Permitir escrita de categorias para service_role" ON public.distribuidor_categories
  FOR ALL USING (auth.role() = 'service_role');
