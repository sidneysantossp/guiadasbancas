-- Execute este SQL no Supabase Dashboard (SQL Editor)
-- URL: https://rgqlncxrzwgjreggrjcq.supabase.co/project/_/sql

-- Remover o índice UNIQUE que impede múltiplas bancas por user_id
DROP INDEX IF EXISTS unique_bancas_user_id;

-- Verificar se foi removido (não deve retornar nenhuma linha)
SELECT indexname 
FROM pg_indexes 
WHERE tablename = 'bancas' 
AND indexname = 'unique_bancas_user_id';
