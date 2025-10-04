-- Adicionar campo customer_address na tabela orders
ALTER TABLE orders ADD COLUMN IF NOT EXISTS customer_address TEXT;

-- Comentário
COMMENT ON COLUMN orders.customer_address IS 'Endereço completo do cliente para entrega';
