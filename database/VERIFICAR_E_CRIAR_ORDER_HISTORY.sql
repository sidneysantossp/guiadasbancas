-- ========================================
-- SCRIPT DE VERIFICAÇÃO E CRIAÇÃO
-- Tabela: order_history
-- ========================================

-- 1. VERIFICAR SE A TABELA JÁ EXISTE
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT FROM pg_tables 
        WHERE schemaname = 'public' 
        AND tablename = 'order_history'
    ) THEN
        RAISE NOTICE '❌ Tabela order_history NÃO existe. Criando...';
        
        -- 2. CRIAR A TABELA
        CREATE TABLE order_history (
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

        -- 3. CRIAR ÍNDICES
        CREATE INDEX idx_order_history_order_id ON order_history(order_id);
        CREATE INDEX idx_order_history_created_at ON order_history(created_at DESC);
        CREATE INDEX idx_order_history_action ON order_history(action);

        -- 4. ADICIONAR COMENTÁRIOS
        COMMENT ON TABLE order_history IS 'Histórico completo de todas as ações e interações em pedidos';
        COMMENT ON COLUMN order_history.action IS 'Tipo de ação: created, status_change, note_added, delivery_updated, etc';
        COMMENT ON COLUMN order_history.old_value IS 'Valor anterior (para mudanças)';
        COMMENT ON COLUMN order_history.new_value IS 'Novo valor ou conteúdo da ação';
        COMMENT ON COLUMN order_history.user_role IS 'Papel do usuário: customer, vendor, admin, system';
        COMMENT ON COLUMN order_history.details IS 'Detalhes adicionais sobre a ação';

        RAISE NOTICE '✅ Tabela order_history criada com sucesso!';
    ELSE
        RAISE NOTICE '✅ Tabela order_history já existe.';
    END IF;
END $$;

-- 5. VERIFICAR DADOS NA TABELA
SELECT 
    COUNT(*) as total_entradas,
    COUNT(DISTINCT order_id) as pedidos_com_historico,
    MIN(created_at) as primeira_entrada,
    MAX(created_at) as ultima_entrada
FROM order_history;

-- 6. MOSTRAR ÚLTIMAS 5 ENTRADAS (SE EXISTIREM)
SELECT 
    id,
    order_id,
    action,
    new_value,
    user_name,
    created_at
FROM order_history
ORDER BY created_at DESC
LIMIT 5;
