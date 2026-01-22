-- Migration: Permitir múltiplas cotas com o mesmo CPF/CNPJ
-- Data: 2026-01-22
-- Motivo: Uma mesma pessoa pode ter múltiplas cotas ativas (ex: 2311 e 2031 para o mesmo CPF)

-- Remover a constraint de unicidade do CPF/CNPJ
ALTER TABLE cotistas DROP CONSTRAINT IF EXISTS cotista_cnpj_cpf_key;

-- Adicionar índice para performance (sem unicidade)
CREATE INDEX IF NOT EXISTS idx_cotistas_cnpj_cpf ON cotistas(cnpj_cpf);

-- Comentário explicativo
COMMENT ON TABLE cotistas IS 'Tabela de cotistas - permite múltiplas cotas por CPF/CNPJ';
