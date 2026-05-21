-- Customizacoes dos produtos do Fornecedor Guia por banca.
-- Mantem os valores definidos pelo jornaleiro separados do cadastro padrao do fornecedor.

CREATE TABLE IF NOT EXISTS banca_produtos_fornecedor (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  banca_id UUID NOT NULL REFERENCES bancas(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES own_wholesale_products(id) ON DELETE CASCADE,
  enabled BOOLEAN NOT NULL DEFAULT true,
  custom_name TEXT,
  custom_description TEXT,
  custom_category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  custom_image_url TEXT,
  custom_images JSONB,
  custom_price DECIMAL(10,2),
  custom_stock_enabled BOOLEAN,
  custom_stock_qty INTEGER,
  custom_track_stock BOOLEAN,
  custom_availability_status TEXT
    CHECK (custom_availability_status IS NULL OR custom_availability_status IN ('in_stock', 'on_demand', 'quote')),
  custom_delivery_lead_time TEXT,
  custom_min_order_quantity INTEGER,
  custom_pack_size INTEGER,
  custom_featured BOOLEAN,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (banca_id, product_id)
);

CREATE INDEX IF NOT EXISTS idx_banca_produtos_fornecedor_banca
  ON banca_produtos_fornecedor (banca_id);

CREATE INDEX IF NOT EXISTS idx_banca_produtos_fornecedor_product
  ON banca_produtos_fornecedor (product_id);

CREATE INDEX IF NOT EXISTS idx_banca_produtos_fornecedor_enabled
  ON banca_produtos_fornecedor (enabled);

DROP TRIGGER IF EXISTS update_banca_produtos_fornecedor_updated_at ON banca_produtos_fornecedor;
CREATE TRIGGER update_banca_produtos_fornecedor_updated_at
  BEFORE UPDATE ON banca_produtos_fornecedor
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

ALTER TABLE banca_produtos_fornecedor ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Fornecedor product customizations editable by service role"
  ON banca_produtos_fornecedor;
CREATE POLICY "Fornecedor product customizations editable by service role"
  ON banca_produtos_fornecedor FOR ALL USING (auth.role() = 'service_role');

COMMENT ON TABLE banca_produtos_fornecedor IS 'Customizacoes de produtos do Fornecedor Guia por banca';
COMMENT ON COLUMN banca_produtos_fornecedor.custom_price IS 'Preco de venda definido pelo jornaleiro. NULL usa a regra padrao do fornecedor.';
