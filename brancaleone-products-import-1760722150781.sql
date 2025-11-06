-- SQL para importar produtos Brancaleone
-- Gerado em: 2025-10-17T17:29:10.784Z
-- Total de produtos: 0

-- 1. Criar distribuidor (se não existir)
INSERT INTO distribuidores (name, active, created_at)
VALUES ('Brancaleone Publicações', true, NOW())
ON CONFLICT (name) DO NOTHING;

-- 2. Inserir produtos
