-- =============================================
-- SISTEMA DE PLANOS E ASSINATURAS
-- =============================================

-- Tabela de Planos
CREATE TABLE IF NOT EXISTS plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  type VARCHAR(20) NOT NULL DEFAULT 'premium' CHECK (type IN ('free', 'premium')),
  price DECIMAL(10,2) NOT NULL DEFAULT 0,
  billing_cycle VARCHAR(20) NOT NULL DEFAULT 'monthly' CHECK (billing_cycle IN ('monthly', 'quarterly', 'semiannual', 'annual')),
  features JSONB DEFAULT '[]'::jsonb,
  limits JSONB DEFAULT '{}'::jsonb,
  is_active BOOLEAN DEFAULT true,
  is_default BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de Assinaturas
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  banca_id UUID NOT NULL REFERENCES bancas(id) ON DELETE CASCADE,
  plan_id UUID NOT NULL REFERENCES plans(id),
  status VARCHAR(30) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'overdue', 'cancelled', 'expired', 'trial')),
  asaas_subscription_id VARCHAR(100),
  asaas_customer_id VARCHAR(100),
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  trial_ends_at TIMESTAMPTZ,
  cancelled_at TIMESTAMPTZ,
  cancel_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de Pagamentos
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id UUID REFERENCES subscriptions(id) ON DELETE SET NULL,
  banca_id UUID NOT NULL REFERENCES bancas(id) ON DELETE CASCADE,
  asaas_payment_id VARCHAR(100),
  asaas_invoice_url TEXT,
  asaas_bank_slip_url TEXT,
  asaas_pix_qrcode TEXT,
  asaas_pix_code TEXT,
  amount DECIMAL(10,2) NOT NULL,
  net_amount DECIMAL(10,2),
  status VARCHAR(30) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'received', 'overdue', 'refunded', 'cancelled', 'failed')),
  payment_method VARCHAR(30) CHECK (payment_method IN ('pix', 'boleto', 'credit_card', 'debit_card')),
  due_date DATE,
  paid_at TIMESTAMPTZ,
  description TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de Notificações
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  banca_id UUID REFERENCES bancas(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT,
  data JSONB DEFAULT '{}'::jsonb,
  read_at TIMESTAMPTZ,
  sent_email BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de Configurações do Sistema (para API keys, etc)
CREATE TABLE IF NOT EXISTS system_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key VARCHAR(100) UNIQUE NOT NULL,
  value TEXT,
  description TEXT,
  is_secret BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_subscriptions_banca_id ON subscriptions(banca_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_payments_banca_id ON payments(banca_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_due_date ON payments(due_date);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_banca_id ON notifications(banca_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read_at ON notifications(read_at);

-- Trigger para updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_plans_updated_at ON plans;
CREATE TRIGGER update_plans_updated_at
  BEFORE UPDATE ON plans
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_subscriptions_updated_at ON subscriptions;
CREATE TRIGGER update_subscriptions_updated_at
  BEFORE UPDATE ON subscriptions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_payments_updated_at ON payments;
CREATE TRIGGER update_payments_updated_at
  BEFORE UPDATE ON payments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_system_settings_updated_at ON system_settings;
CREATE TRIGGER update_system_settings_updated_at
  BEFORE UPDATE ON system_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- RLS
ALTER TABLE plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;

-- Políticas: Plans (leitura pública, escrita admin)
CREATE POLICY "Plans are viewable by everyone" ON plans FOR SELECT USING (true);
CREATE POLICY "Plans are editable by service role" ON plans FOR ALL USING (auth.role() = 'service_role');

-- Políticas: Subscriptions (jornaleiro vê suas próprias)
CREATE POLICY "Users can view own subscriptions" ON subscriptions FOR SELECT 
  USING (banca_id IN (SELECT id FROM bancas WHERE user_id = auth.uid()));
CREATE POLICY "Subscriptions editable by service role" ON subscriptions FOR ALL USING (auth.role() = 'service_role');

-- Políticas: Payments (jornaleiro vê seus próprios)
CREATE POLICY "Users can view own payments" ON payments FOR SELECT 
  USING (banca_id IN (SELECT id FROM bancas WHERE user_id = auth.uid()));
CREATE POLICY "Payments editable by service role" ON payments FOR ALL USING (auth.role() = 'service_role');

-- Políticas: Notifications (usuário vê suas próprias)
CREATE POLICY "Users can view own notifications" ON notifications FOR SELECT 
  USING (user_id = auth.uid() OR banca_id IN (SELECT id FROM bancas WHERE user_id = auth.uid()));
CREATE POLICY "Users can update own notifications" ON notifications FOR UPDATE 
  USING (user_id = auth.uid() OR banca_id IN (SELECT id FROM bancas WHERE user_id = auth.uid()));
CREATE POLICY "Notifications editable by service role" ON notifications FOR ALL USING (auth.role() = 'service_role');

-- Políticas: System Settings (apenas service role)
CREATE POLICY "System settings viewable by service role" ON system_settings FOR SELECT USING (auth.role() = 'service_role');
CREATE POLICY "System settings editable by service role" ON system_settings FOR ALL USING (auth.role() = 'service_role');

-- Inserir plano Free padrão
INSERT INTO plans (name, slug, description, type, price, billing_cycle, features, limits, is_active, is_default, sort_order)
VALUES (
  'Gratuito',
  'free',
  'Plano básico para começar',
  'free',
  0,
  'monthly',
  '["Cadastro de até 10 produtos", "Página da banca", "Atendimento via WhatsApp"]'::jsonb,
  '{"max_products": 10, "max_images_per_product": 3}'::jsonb,
  true,
  true,
  0
) ON CONFLICT (slug) DO NOTHING;

-- Inserir configuração padrão do Asaas
INSERT INTO system_settings (key, value, description, is_secret)
VALUES 
  ('asaas_api_key', '', 'API Key do Asaas para integração de pagamentos', true),
  ('asaas_environment', 'sandbox', 'Ambiente do Asaas: sandbox ou production', false)
ON CONFLICT (key) DO NOTHING;
