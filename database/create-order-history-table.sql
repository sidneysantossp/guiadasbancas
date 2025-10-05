-- Tabela para registrar histórico completo de pedidos
CREATE TABLE IF NOT EXISTS order_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL,
  action VARCHAR(50) NOT NULL CHECK (action IN ('created', 'status_change', 'note_added', 'delivery_updated', 'payment_updated', 'customer_message', 'vendor_message', 'item_added', 'item_removed', 'price_adjusted')),
  old_value TEXT,
  new_value TEXT NOT NULL,
  user_id UUID,
  user_name VARCHAR(255) NOT NULL,
  user_role VARCHAR(50) CHECK (user_role IN ('customer', 'vendor', 'admin', 'system')),
  details TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_order_history_order_id ON order_history(order_id);
CREATE INDEX IF NOT EXISTS idx_order_history_created_at ON order_history(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_order_history_action ON order_history(action);

-- Comentários
COMMENT ON TABLE order_history IS 'Histórico completo de todas as ações e interações em pedidos';
COMMENT ON COLUMN order_history.action IS 'Tipo de ação: created, status_change, note_added, delivery_updated, etc';
COMMENT ON COLUMN order_history.old_value IS 'Valor anterior (para mudanças)';
COMMENT ON COLUMN order_history.new_value IS 'Novo valor ou conteúdo da ação';
COMMENT ON COLUMN order_history.user_role IS 'Papel do usuário: customer, vendor, admin, system';
COMMENT ON COLUMN order_history.details IS 'Detalhes adicionais sobre a ação';
