-- Adicionar campo para destacar produtos de distribuidores em ofertas/promoções

ALTER TABLE banca_produtos_distribuidor
ADD COLUMN IF NOT EXISTS custom_featured BOOLEAN DEFAULT false;

COMMENT ON COLUMN banca_produtos_distribuidor.custom_featured 
IS 'Se true, produto aparece na galeria de ofertas e promoções da banca';

-- Exemplo: Marcar produto como destaque
-- UPDATE banca_produtos_distribuidor
-- SET custom_featured = true
-- WHERE banca_id = '[ID_BANCA]' AND product_id = '[ID_PRODUTO]';
