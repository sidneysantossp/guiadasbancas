-- Adicionar coluna cost_price na tabela products
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS cost_price DECIMAL(10,2);

-- Comentário na coluna
COMMENT ON COLUMN public.products.cost_price IS 'Preço de custo do produto (informativo para cálculo de margem)';
