-- Remover constraint que impede múltiplas bancas por usuário
-- Erro: duplicate key value violates unique constraint "unique_bancas_user_id"
-- Data: 2026-01-22

-- Remover a constraint de unicidade do user_id
ALTER TABLE bancas DROP CONSTRAINT IF EXISTS unique_bancas_user_id;

-- Comentário explicativo
COMMENT ON TABLE bancas IS 'Tabela de bancas - permite múltiplas bancas por user_id (jornaleiro pode ter várias bancas)';

-- Verificar se a constraint foi removida
SELECT conname, contype, pg_get_constraintdef(oid) 
FROM pg_constraint 
WHERE conrelid = 'bancas'::regclass 
AND conname LIKE '%user_id%';
