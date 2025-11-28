-- Adicionar campos de autenticação na tabela distribuidores

-- Adicionar campo email
ALTER TABLE distribuidores 
ADD COLUMN IF NOT EXISTS email VARCHAR(255) UNIQUE;

-- Adicionar campo senha
ALTER TABLE distribuidores 
ADD COLUMN IF NOT EXISTS senha VARCHAR(255);

-- Adicionar índice no email para performance
CREATE INDEX IF NOT EXISTS idx_distribuidores_email ON distribuidores(email);

-- Comentários
COMMENT ON COLUMN distribuidores.email IS 'E-mail de acesso do distribuidor ao portal';
COMMENT ON COLUMN distribuidores.senha IS 'Senha de acesso (hash em produção)';

-- Exemplo: Atualizar distribuidor existente com email
-- UPDATE distribuidores SET email = 'bambino@guiadasbancas.com', senha = 'dist123' WHERE nome ILIKE '%bambino%';
-- UPDATE distribuidores SET email = 'brancaleone@guiadasbancas.com', senha = 'dist123' WHERE nome ILIKE '%brancaleone%';
