-- Execute este SQL no Supabase para ver TODAS as constraints da tabela bancas
-- URL: https://rgqlncxrzwgjreggrjcq.supabase.co/project/_/sql

SELECT 
    conname AS constraint_name,
    contype AS constraint_type,
    pg_get_constraintdef(oid) AS constraint_definition
FROM pg_constraint 
WHERE conrelid = 'bancas'::regclass
ORDER BY conname;
