-- Adicionar campo order_number na tabela orders
-- Este campo armazena o número do pedido no formato "ORD-timestamp"
-- enquanto o id permanece como UUID (chave primária)

ALTER TABLE orders ADD COLUMN IF NOT EXISTS order_number VARCHAR(50) UNIQUE;

-- Criar índice para busca rápida por order_number
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON orders(order_number);

-- Comentário
COMMENT ON COLUMN orders.order_number IS 'Número do pedido no formato ORD-timestamp (ex: ORD-1759613705412)';
