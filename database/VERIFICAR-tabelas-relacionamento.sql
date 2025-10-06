-- Verificar se as tabelas de relacionamento existem
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name LIKE '%banca%produto%'
OR table_name LIKE '%produto%banca%';

-- Verificar todas as tabelas relacionadas a produtos
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND (table_name LIKE '%product%' OR table_name LIKE '%produto%')
ORDER BY table_name;
