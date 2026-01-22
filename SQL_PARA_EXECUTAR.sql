-- Execute este SQL no Supabase Dashboard (SQL Editor)
-- URL: https://rgqlncxrzwgjreggrjcq.supabase.co/project/_/sql

-- Remover constraint de unicidade do CPF/CNPJ
ALTER TABLE cotistas DROP CONSTRAINT cotistas_cnpj_cpf_key;

-- Criar índice para performance (sem unicidade)
CREATE INDEX IF NOT EXISTS idx_cotistas_cnpj_cpf ON cotistas(cnpj_cpf);
