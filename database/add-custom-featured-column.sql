-- Adicionar coluna custom_featured na tabela banca_produtos_distribuidor
ALTER TABLE banca_produtos_distribuidor 
ADD COLUMN IF NOT EXISTS custom_featured BOOLEAN DEFAULT false;

-- Comentário da nova coluna
COMMENT ON COLUMN banca_produtos_distribuidor.custom_featured IS 'Se true, produto aparece em destaque na banca (ofertas e promoções)';

-- Índice para performance nas consultas de produtos em destaque
CREATE INDEX IF NOT EXISTS idx_banca_produtos_dist_featured ON banca_produtos_distribuidor(custom_featured) WHERE custom_featured = true;
