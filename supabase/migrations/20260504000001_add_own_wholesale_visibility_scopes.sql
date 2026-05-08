-- Escopos de exposicao para produtos do Fornecedor Guia.
-- visible continua sendo o controle global do produto.
-- visible_jornaleiro controla o catalogo/pedido no painel do jornaleiro.
-- visible_banca controla a vitrine publica do perfil da banca liberada.

ALTER TABLE own_wholesale_products
  ADD COLUMN IF NOT EXISTS visible_jornaleiro BOOLEAN NOT NULL DEFAULT true;

ALTER TABLE own_wholesale_products
  ADD COLUMN IF NOT EXISTS visible_banca BOOLEAN NOT NULL DEFAULT false;

UPDATE own_wholesale_products
SET
  visible_jornaleiro = COALESCE(visible_jornaleiro, true),
  visible_banca = COALESCE(visible_banca, false);

CREATE INDEX IF NOT EXISTS idx_own_wholesale_products_visibility_scopes
  ON own_wholesale_products (active, visible, visible_jornaleiro, visible_banca);
