-- Adicionar coluna featured na tabela products para permitir destaque de produtos
-- Esta coluna permite que jornaleiros destaquem produtos próprios na seção "Ofertas e Promoções"

ALTER TABLE products ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT FALSE;

-- Criar índice para busca rápida de produtos em destaque
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(featured) WHERE featured = TRUE;

-- Comentário na coluna
COMMENT ON COLUMN products.featured IS 'Indica se o produto está em destaque na seção de ofertas e promoções da banca';
