-- Execute este SQL no Supabase Dashboard (SQL Editor)
-- URL: https://rgqlncxrzwgjreggrjcq.supabase.co/project/_/sql

-- Remover a constraint UNIQUE do user_id na tabela bancas
-- Isso permite que um mesmo user_id tenha múltiplas bancas

ALTER TABLE bancas DROP CONSTRAINT unique_bancas_user_id;

-- Verificar se foi removida (não deve retornar nenhuma linha)
SELECT conname 
FROM pg_constraint 
WHERE conrelid = 'bancas'::regclass 
AND conname = 'unique_bancas_user_id';
