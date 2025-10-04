-- Tornar banca_id opcional para permitir produtos de distribuidores sem banca
ALTER TABLE products 
ALTER COLUMN banca_id DROP NOT NULL;

-- Atualizar comentário
COMMENT ON COLUMN products.banca_id IS 'ID da banca (opcional para produtos de distribuidores)';
