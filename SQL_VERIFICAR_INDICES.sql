-- Execute este SQL no Supabase para ver TODOS os índices da tabela bancas
-- URL: https://rgqlncxrzwgjreggrjcq.supabase.co/project/_/sql

SELECT
    indexname,
    indexdef
FROM pg_indexes
WHERE tablename = 'bancas'
ORDER BY indexname;
