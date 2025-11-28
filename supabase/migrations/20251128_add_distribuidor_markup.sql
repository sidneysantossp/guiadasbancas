-- Tabela de configuração de markup do distribuidor
-- O markup define a margem de lucro que o distribuidor adiciona ao preço base
-- para exibir ao jornaleiro no catálogo

-- Configuração global de markup do distribuidor
ALTER TABLE distribuidores 
ADD COLUMN IF NOT EXISTS markup_global_percentual DECIMAL(5,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS markup_global_fixo DECIMAL(10,2) DEFAULT 0;

-- Markup por categoria
CREATE TABLE IF NOT EXISTS distribuidor_markup_categorias (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  distribuidor_id UUID NOT NULL REFERENCES distribuidores(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  markup_percentual DECIMAL(5,2) DEFAULT 0,
  markup_fixo DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(distribuidor_id, category_id)
);

-- Markup por produto específico
CREATE TABLE IF NOT EXISTS distribuidor_markup_produtos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  distribuidor_id UUID NOT NULL REFERENCES distribuidores(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  markup_percentual DECIMAL(5,2) DEFAULT 0,
  markup_fixo DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(distribuidor_id, product_id)
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_markup_cat_distribuidor ON distribuidor_markup_categorias(distribuidor_id);
CREATE INDEX IF NOT EXISTS idx_markup_cat_category ON distribuidor_markup_categorias(category_id);
CREATE INDEX IF NOT EXISTS idx_markup_prod_distribuidor ON distribuidor_markup_produtos(distribuidor_id);
CREATE INDEX IF NOT EXISTS idx_markup_prod_product ON distribuidor_markup_produtos(product_id);

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_markup_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_markup_cat_updated_at ON distribuidor_markup_categorias;
CREATE TRIGGER trigger_markup_cat_updated_at
  BEFORE UPDATE ON distribuidor_markup_categorias
  FOR EACH ROW
  EXECUTE FUNCTION update_markup_updated_at();

DROP TRIGGER IF EXISTS trigger_markup_prod_updated_at ON distribuidor_markup_produtos;
CREATE TRIGGER trigger_markup_prod_updated_at
  BEFORE UPDATE ON distribuidor_markup_produtos
  FOR EACH ROW
  EXECUTE FUNCTION update_markup_updated_at();

-- Comentários explicativos
COMMENT ON COLUMN distribuidores.markup_global_percentual IS 'Percentual de markup aplicado a todos os produtos (ex: 30 = 30%)';
COMMENT ON COLUMN distribuidores.markup_global_fixo IS 'Valor fixo adicionado ao preço de todos os produtos (em reais)';
COMMENT ON TABLE distribuidor_markup_categorias IS 'Markup específico por categoria - sobrescreve o global';
COMMENT ON TABLE distribuidor_markup_produtos IS 'Markup específico por produto - sobrescreve categoria e global';
