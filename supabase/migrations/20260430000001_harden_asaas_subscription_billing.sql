-- =============================================
-- HARDENING DO BILLING ASAAS
-- =============================================

-- Garante que exista apenas uma assinatura "aberta" por banca.
-- Se houver duplicadas antigas, preserva a mais recente e cancela as anteriores.
WITH ranked_open_subscriptions AS (
  SELECT
    id,
    ROW_NUMBER() OVER (
      PARTITION BY banca_id
      ORDER BY created_at DESC NULLS LAST, updated_at DESC NULLS LAST, id DESC
    ) AS row_number
  FROM subscriptions
  WHERE status IN ('pending', 'active', 'overdue', 'trial')
)
UPDATE subscriptions
SET
  status = 'cancelled',
  cancelled_at = COALESCE(cancelled_at, NOW()),
  current_period_end = COALESCE(current_period_end, NOW()),
  cancel_reason = COALESCE(cancel_reason, 'Assinatura aberta duplicada encerrada por migração de billing')
WHERE id IN (
  SELECT id
  FROM ranked_open_subscriptions
  WHERE row_number > 1
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_subscriptions_one_open_per_banca
  ON subscriptions (banca_id)
  WHERE status IN ('pending', 'active', 'overdue', 'trial');

CREATE UNIQUE INDEX IF NOT EXISTS idx_subscriptions_asaas_subscription_id
  ON subscriptions (asaas_subscription_id)
  WHERE asaas_subscription_id IS NOT NULL
    AND status IN ('pending', 'active', 'overdue', 'trial');

-- Vínculo atual entre assinatura local e assinatura no provedor.
CREATE TABLE IF NOT EXISTS subscription_provider_bindings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id UUID NOT NULL REFERENCES subscriptions(id) ON DELETE CASCADE,
  banca_id UUID NOT NULL REFERENCES bancas(id) ON DELETE CASCADE,
  plan_id UUID REFERENCES plans(id) ON DELETE SET NULL,
  provider VARCHAR(30) NOT NULL DEFAULT 'asaas',
  provider_subscription_id VARCHAR(100) NOT NULL,
  provider_customer_id VARCHAR(100),
  billing_type VARCHAR(30),
  status VARCHAR(40) NOT NULL DEFAULT 'active',
  effective_price DECIMAL(10,2),
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_subscription_provider_bindings_provider_subscription
  ON subscription_provider_bindings (provider, provider_subscription_id);

CREATE UNIQUE INDEX IF NOT EXISTS idx_subscription_provider_bindings_provider_banca
  ON subscription_provider_bindings (provider, banca_id);

CREATE INDEX IF NOT EXISTS idx_subscription_provider_bindings_subscription_id
  ON subscription_provider_bindings (subscription_id);

DROP TRIGGER IF EXISTS update_subscription_provider_bindings_updated_at ON subscription_provider_bindings;
CREATE TRIGGER update_subscription_provider_bindings_updated_at
  BEFORE UPDATE ON subscription_provider_bindings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Contrato comercial vigente por banca. Evita salvar preço contratado em JSON solto.
CREATE TABLE IF NOT EXISTS banca_subscription_pricing_contracts (
  banca_id UUID PRIMARY KEY REFERENCES bancas(id) ON DELETE CASCADE,
  plan_id UUID NOT NULL REFERENCES plans(id) ON DELETE CASCADE,
  provider VARCHAR(30) NOT NULL DEFAULT 'asaas',
  provider_subscription_id VARCHAR(100),
  effective_price DECIMAL(10,2) NOT NULL,
  original_price DECIMAL(10,2),
  promo_applied BOOLEAN NOT NULL DEFAULT false,
  promotion_label TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_banca_subscription_pricing_contracts_plan_id
  ON banca_subscription_pricing_contracts (plan_id);

DROP TRIGGER IF EXISTS update_banca_subscription_pricing_contracts_updated_at ON banca_subscription_pricing_contracts;
CREATE TRIGGER update_banca_subscription_pricing_contracts_updated_at
  BEFORE UPDATE ON banca_subscription_pricing_contracts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Claims de trial normalizados. A constraint impede corrida de duplo trial por banca.
CREATE TABLE IF NOT EXISTS subscription_trial_claims (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  banca_id UUID NOT NULL REFERENCES bancas(id) ON DELETE CASCADE,
  claim_key VARCHAR(80) NOT NULL DEFAULT 'paid_plan_trial',
  claimed_at TIMESTAMPTZ DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'::jsonb,
  UNIQUE (banca_id, claim_key)
);

CREATE INDEX IF NOT EXISTS idx_subscription_trial_claims_claim_key
  ON subscription_trial_claims (claim_key);

-- Claims de oferta de lançamento normalizados.
CREATE TABLE IF NOT EXISTS premium_launch_offer_claims (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  banca_id UUID NOT NULL REFERENCES bancas(id) ON DELETE CASCADE,
  claimed_at TIMESTAMPTZ DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'::jsonb,
  UNIQUE (banca_id)
);

-- Eventos de webhook. Esta tabela é a trava de idempotência.
CREATE TABLE IF NOT EXISTS billing_webhook_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider VARCHAR(30) NOT NULL DEFAULT 'asaas',
  event_key TEXT NOT NULL,
  event_type VARCHAR(100),
  provider_payment_id VARCHAR(100),
  provider_subscription_id VARCHAR(100),
  subscription_id UUID REFERENCES subscriptions(id) ON DELETE SET NULL,
  banca_id UUID REFERENCES bancas(id) ON DELETE SET NULL,
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  processing_status VARCHAR(30) NOT NULL DEFAULT 'received'
    CHECK (processing_status IN ('received', 'processing', 'processed', 'failed')),
  processed_at TIMESTAMPTZ,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (provider, event_key)
);

CREATE INDEX IF NOT EXISTS idx_billing_webhook_events_provider_payment_id
  ON billing_webhook_events (provider_payment_id);

CREATE INDEX IF NOT EXISTS idx_billing_webhook_events_provider_subscription_id
  ON billing_webhook_events (provider_subscription_id);

DROP TRIGGER IF EXISTS update_billing_webhook_events_updated_at ON billing_webhook_events;
CREATE TRIGGER update_billing_webhook_events_updated_at
  BEFORE UPDATE ON billing_webhook_events
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

ALTER TABLE subscription_provider_bindings ENABLE ROW LEVEL SECURITY;
ALTER TABLE banca_subscription_pricing_contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscription_trial_claims ENABLE ROW LEVEL SECURITY;
ALTER TABLE premium_launch_offer_claims ENABLE ROW LEVEL SECURITY;
ALTER TABLE billing_webhook_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Subscription provider bindings editable by service role"
  ON subscription_provider_bindings FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Pricing contracts editable by service role"
  ON banca_subscription_pricing_contracts FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Trial claims editable by service role"
  ON subscription_trial_claims FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Premium launch claims editable by service role"
  ON premium_launch_offer_claims FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Billing webhook events editable by service role"
  ON billing_webhook_events FOR ALL USING (auth.role() = 'service_role');

INSERT INTO system_settings (key, value, description, is_secret)
VALUES ('asaas_webhook_token_configured', 'false', 'Indicador operacional: configure ASAAS_WEBHOOK_TOKEN no ambiente de produção', false)
ON CONFLICT (key) DO NOTHING;
