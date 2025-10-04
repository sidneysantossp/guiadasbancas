-- Adicionar campos de gestão de estoque próprio do jornaleiro
-- Permite que o jornaleiro gerencie seu próprio estoque de produtos de distribuidores

ALTER TABLE banca_produtos_distribuidor
ADD COLUMN IF NOT EXISTS custom_stock_enabled BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS custom_stock_qty INTEGER DEFAULT NULL;

COMMENT ON COLUMN banca_produtos_distribuidor.custom_stock_enabled IS 'Se true, usa estoque próprio do jornaleiro ao invés do estoque do distribuidor';
COMMENT ON COLUMN banca_produtos_distribuidor.custom_stock_qty IS 'Quantidade de estoque gerenciada pelo jornaleiro (null = usa estoque do distribuidor)';

-- Exemplo de uso:
-- 1. Jornaleiro ativa "Gerenciar meu próprio estoque"
-- 2. Define custom_stock_qty = 10
-- 3. Mesmo se distribuidor tiver stock_qty = 0, o produto fica disponível na banca do jornaleiro
-- 4. Quando custom_stock_enabled = false, usa stock_qty do distribuidor
