-- Tabela para rastrear eventos de analytics
CREATE TABLE IF NOT EXISTS analytics_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  banca_id UUID REFERENCES bancas(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  event_type VARCHAR(50) NOT NULL,
  session_id VARCHAR(100),
  user_identifier VARCHAR(255), -- pode ser user_id ou hash anônimo
  metadata JSONB DEFAULT '{}',
  ip_address VARCHAR(45),
  user_agent TEXT,
  referrer TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_analytics_banca_id ON analytics_events(banca_id);
CREATE INDEX IF NOT EXISTS idx_analytics_product_id ON analytics_events(product_id);
CREATE INDEX IF NOT EXISTS idx_analytics_event_type ON analytics_events(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_created_at ON analytics_events(created_at);
CREATE INDEX IF NOT EXISTS idx_analytics_banca_event_date ON analytics_events(banca_id, event_type, created_at);

-- Índice composto para queries de relatório
CREATE INDEX IF NOT EXISTS idx_analytics_reporting ON analytics_events(banca_id, event_type, created_at DESC);

-- Habilitar RLS
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

-- Política para inserção (qualquer um pode inserir)
CREATE POLICY "Allow insert analytics" ON analytics_events
  FOR INSERT WITH CHECK (true);

-- Política para leitura (jornaleiro vê apenas da sua banca, admin vê tudo)
CREATE POLICY "Allow read own analytics" ON analytics_events
  FOR SELECT USING (
    banca_id IN (
      SELECT id FROM bancas WHERE user_id = auth.uid()
    )
    OR
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Comentários na tabela
COMMENT ON TABLE analytics_events IS 'Tabela para rastrear eventos de analytics da plataforma';
COMMENT ON COLUMN analytics_events.event_type IS 'Tipos: page_view, product_view, product_click, add_to_cart, whatsapp_click, checkout_start, checkout_complete, search';
COMMENT ON COLUMN analytics_events.metadata IS 'Dados extras do evento em JSON (ex: termo de busca, quantidade, etc)';
