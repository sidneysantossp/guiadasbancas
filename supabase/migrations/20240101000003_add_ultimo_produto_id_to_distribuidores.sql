-- Adicionar campo para rastrear progresso da sincronização

ALTER TABLE public.distribuidores 
  ADD COLUMN IF NOT EXISTS ultimo_produto_id INTEGER;

-- Adicionar comentário
COMMENT ON COLUMN public.distribuidores.ultimo_produto_id IS 'Último ID de produto processado (para continuar sincronização de onde parou)';

-- Índice para melhor performance
CREATE INDEX IF NOT EXISTS idx_distribuidores_ultimo_produto_id ON public.distribuidores(ultimo_produto_id);
