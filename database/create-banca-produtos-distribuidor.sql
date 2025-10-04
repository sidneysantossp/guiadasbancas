-- Tabela para gerenciar produtos de distribuidor customizados por cada banca
CREATE TABLE IF NOT EXISTS banca_produtos_distribuidor (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  banca_id UUID NOT NULL REFERENCES bancas(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  
  -- Controles do jornaleiro
  enabled BOOLEAN DEFAULT true,
  custom_price DECIMAL(10, 2), -- Preço customizado pelo jornaleiro (null = usar preço do distribuidor)
  custom_description TEXT, -- Descrição adicional customizada
  custom_status VARCHAR(20) DEFAULT 'available' CHECK (custom_status IN ('available', 'unavailable', 'hidden')),
  custom_pronta_entrega BOOLEAN,
  custom_sob_encomenda BOOLEAN,
  custom_pre_venda BOOLEAN,
  
  -- Metadados
  modificado_em TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),
  
  -- Constraint: cada banca pode ter apenas uma customização por produto
  UNIQUE(banca_id, product_id)
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_banca_produtos_dist_banca ON banca_produtos_distribuidor(banca_id);
CREATE INDEX IF NOT EXISTS idx_banca_produtos_dist_product ON banca_produtos_distribuidor(product_id);
CREATE INDEX IF NOT EXISTS idx_banca_produtos_dist_enabled ON banca_produtos_distribuidor(enabled);

-- Trigger para atualizar modificado_em
CREATE OR REPLACE FUNCTION update_banca_produtos_distribuidor_modificado_em()
RETURNS TRIGGER AS $$
BEGIN
  NEW.modificado_em = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_banca_produtos_dist_modificado
BEFORE UPDATE ON banca_produtos_distribuidor
FOR EACH ROW
EXECUTE FUNCTION update_banca_produtos_distribuidor_modificado_em();

-- Desabilitar RLS (acesso via service role)
ALTER TABLE banca_produtos_distribuidor DISABLE ROW LEVEL SECURITY;

COMMENT ON TABLE banca_produtos_distribuidor IS 'Customizações de produtos de distribuidor por banca';
COMMENT ON COLUMN banca_produtos_distribuidor.enabled IS 'Se true, produto aparece no catálogo da banca';
COMMENT ON COLUMN banca_produtos_distribuidor.custom_price IS 'Preço customizado pelo jornaleiro (null = usar preço original do distribuidor)';
COMMENT ON COLUMN banca_produtos_distribuidor.custom_description IS 'Descrição adicional customizada pelo jornaleiro';
COMMENT ON COLUMN banca_produtos_distribuidor.modificado_em IS 'Última modificação feita pelo jornaleiro';
