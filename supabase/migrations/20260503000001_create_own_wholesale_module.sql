-- =============================================
-- ATACADO PROPRIO GUIA DAS BANCAS
-- =============================================

CREATE TABLE IF NOT EXISTS own_wholesale_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sku TEXT,
  name TEXT NOT NULL,
  description TEXT,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  image_url TEXT,
  images JSONB NOT NULL DEFAULT '[]'::jsonb,
  cost_price DECIMAL(10,2) NOT NULL DEFAULT 0,
  price DECIMAL(10,2) NOT NULL DEFAULT 0,
  compare_at_price DECIMAL(10,2),
  stock_quantity INTEGER NOT NULL DEFAULT 0,
  reserved_quantity INTEGER NOT NULL DEFAULT 0,
  track_stock BOOLEAN NOT NULL DEFAULT true,
  availability_status TEXT NOT NULL DEFAULT 'in_stock'
    CHECK (availability_status IN ('in_stock', 'on_demand', 'quote')),
  min_order_quantity INTEGER NOT NULL DEFAULT 1,
  pack_size INTEGER NOT NULL DEFAULT 1,
  delivery_lead_time TEXT,
  active BOOLEAN NOT NULL DEFAULT true,
  visible BOOLEAN NOT NULL DEFAULT true,
  visible_jornaleiro BOOLEAN NOT NULL DEFAULT true,
  visible_banca BOOLEAN NOT NULL DEFAULT false,
  supplier_reference TEXT,
  admin_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_own_wholesale_products_active_visible
  ON own_wholesale_products (active, visible);

CREATE INDEX IF NOT EXISTS idx_own_wholesale_products_visibility_scopes
  ON own_wholesale_products (active, visible, visible_jornaleiro, visible_banca);

CREATE INDEX IF NOT EXISTS idx_own_wholesale_products_category_id
  ON own_wholesale_products (category_id);

CREATE INDEX IF NOT EXISTS idx_own_wholesale_products_name
  ON own_wholesale_products USING gin (to_tsvector('portuguese', COALESCE(name, '') || ' ' || COALESCE(description, '')));

DROP TRIGGER IF EXISTS update_own_wholesale_products_updated_at ON own_wholesale_products;
CREATE TRIGGER update_own_wholesale_products_updated_at
  BEFORE UPDATE ON own_wholesale_products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TABLE IF NOT EXISTS own_wholesale_visibility_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  scope TEXT NOT NULL DEFAULT 'banca'
    CHECK (scope IN ('all', 'banca', 'state', 'city')),
  banca_id UUID REFERENCES bancas(id) ON DELETE CASCADE,
  state_code CHAR(2),
  city TEXT,
  enabled BOOLEAN NOT NULL DEFAULT true,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_own_wholesale_visibility_all
  ON own_wholesale_visibility_rules (scope)
  WHERE scope = 'all';

CREATE UNIQUE INDEX IF NOT EXISTS idx_own_wholesale_visibility_banca
  ON own_wholesale_visibility_rules (banca_id)
  WHERE scope = 'banca' AND banca_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_own_wholesale_visibility_state_city
  ON own_wholesale_visibility_rules (scope, state_code, city);

DROP TRIGGER IF EXISTS update_own_wholesale_visibility_rules_updated_at ON own_wholesale_visibility_rules;
CREATE TRIGGER update_own_wholesale_visibility_rules_updated_at
  BEFORE UPDATE ON own_wholesale_visibility_rules
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TABLE IF NOT EXISTS own_wholesale_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT UNIQUE NOT NULL,
  banca_id UUID NOT NULL REFERENCES bancas(id) ON DELETE RESTRICT,
  user_id UUID REFERENCES user_profiles(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT,
  customer_phone TEXT,
  shipping_address TEXT,
  shipping_city TEXT,
  shipping_state CHAR(2),
  shipping_cep TEXT,
  subtotal DECIMAL(10,2) NOT NULL DEFAULT 0,
  shipping_fee DECIMAL(10,2) NOT NULL DEFAULT 0,
  discount DECIMAL(10,2) NOT NULL DEFAULT 0,
  total DECIMAL(10,2) NOT NULL DEFAULT 0,
  payment_method TEXT NOT NULL DEFAULT 'pix'
    CHECK (payment_method IN ('pix', 'credit_card', 'manual')),
  payment_status TEXT NOT NULL DEFAULT 'pending'
    CHECK (payment_status IN ('pending', 'confirmed', 'overdue', 'refunded', 'cancelled', 'failed')),
  status TEXT NOT NULL DEFAULT 'pending_payment'
    CHECK (status IN ('draft', 'pending_payment', 'paid', 'purchasing', 'separating', 'ready_to_ship', 'shipped', 'delivered', 'cancelled')),
  asaas_payment_id TEXT,
  asaas_invoice_url TEXT,
  asaas_pix_payload TEXT,
  asaas_pix_encoded_image TEXT,
  asaas_due_date DATE,
  shipping_method TEXT,
  tracking_code TEXT,
  notes TEXT,
  admin_notes TEXT,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_own_wholesale_orders_banca_id
  ON own_wholesale_orders (banca_id);

CREATE INDEX IF NOT EXISTS idx_own_wholesale_orders_status
  ON own_wholesale_orders (status, payment_status);

CREATE INDEX IF NOT EXISTS idx_own_wholesale_orders_asaas_payment_id
  ON own_wholesale_orders (asaas_payment_id)
  WHERE asaas_payment_id IS NOT NULL;

DROP TRIGGER IF EXISTS update_own_wholesale_orders_updated_at ON own_wholesale_orders;
CREATE TRIGGER update_own_wholesale_orders_updated_at
  BEFORE UPDATE ON own_wholesale_orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TABLE IF NOT EXISTS own_wholesale_order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES own_wholesale_orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES own_wholesale_products(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,
  product_sku TEXT,
  product_image TEXT,
  availability_status TEXT NOT NULL DEFAULT 'in_stock',
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price DECIMAL(10,2) NOT NULL DEFAULT 0,
  total_price DECIMAL(10,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_own_wholesale_order_items_order_id
  ON own_wholesale_order_items (order_id);

CREATE INDEX IF NOT EXISTS idx_own_wholesale_order_items_product_id
  ON own_wholesale_order_items (product_id);

ALTER TABLE own_wholesale_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE own_wholesale_visibility_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE own_wholesale_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE own_wholesale_order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Own wholesale products editable by service role"
  ON own_wholesale_products FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Own wholesale visibility editable by service role"
  ON own_wholesale_visibility_rules FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Own wholesale orders editable by service role"
  ON own_wholesale_orders FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Own wholesale order items editable by service role"
  ON own_wholesale_order_items FOR ALL USING (auth.role() = 'service_role');

INSERT INTO own_wholesale_visibility_rules (scope, enabled, notes)
VALUES ('all', false, 'Atacado proprio oculto por padrao ate liberacao administrativa')
ON CONFLICT DO NOTHING;
