-- Adicionar campo base_url na tabela distribuidores
ALTER TABLE distribuidores 
ADD COLUMN IF NOT EXISTS base_url VARCHAR(200) DEFAULT 'https://app.mercos.com/api/v1';

-- Atualizar registros existentes para usar sandbox (se houver)
UPDATE distribuidores 
SET base_url = 'https://sandbox.mercos.com/api/v1'
WHERE base_url IS NULL OR base_url = '';

COMMENT ON COLUMN distribuidores.base_url IS 'URL base da API Mercos (sandbox ou produção)';
