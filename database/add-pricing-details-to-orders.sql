-- Adicionar campos de detalhamento de preços à tabela orders
-- Executar no Supabase SQL Editor

-- Adicionar coluna de desconto geral
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS discount DECIMAL(10,2) DEFAULT 0;

-- Adicionar coluna de código do cupom
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS coupon_code TEXT;

-- Adicionar coluna de desconto do cupom
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS coupon_discount DECIMAL(10,2) DEFAULT 0;

-- Adicionar coluna de total de adicionais
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS addons_total DECIMAL(10,2) DEFAULT 0;

-- Comentários nas colunas para documentação
COMMENT ON COLUMN orders.discount IS 'Desconto geral aplicado ao pedido (não cupom)';
COMMENT ON COLUMN orders.coupon_code IS 'Código do cupom utilizado';
COMMENT ON COLUMN orders.coupon_discount IS 'Valor do desconto do cupom';
COMMENT ON COLUMN orders.addons_total IS 'Total de adicionais dos produtos';
