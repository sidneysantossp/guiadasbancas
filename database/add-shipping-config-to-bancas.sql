-- Adicionar configurações de frete/entrega à tabela bancas

-- Coluna para habilitar/desabilitar entrega
ALTER TABLE bancas 
ADD COLUMN IF NOT EXISTS delivery_enabled BOOLEAN DEFAULT false;

-- Coluna para valor mínimo de frete grátis
ALTER TABLE bancas 
ADD COLUMN IF NOT EXISTS free_shipping_threshold DECIMAL(10,2) DEFAULT 120.00;

-- Coluna para CEP de origem (para cálculo de frete)
ALTER TABLE bancas 
ADD COLUMN IF NOT EXISTS origin_cep VARCHAR(9);

-- Comentários
COMMENT ON COLUMN bancas.delivery_enabled IS 'Indica se a banca trabalha com entrega/frete';
COMMENT ON COLUMN bancas.free_shipping_threshold IS 'Valor mínimo para frete grátis em R$';
COMMENT ON COLUMN bancas.origin_cep IS 'CEP de origem da banca para cálculo de frete';

-- Índice para melhor performance nas queries
CREATE INDEX IF NOT EXISTS idx_bancas_delivery_enabled ON bancas(delivery_enabled);
