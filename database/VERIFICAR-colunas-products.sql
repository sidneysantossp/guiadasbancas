-- Verificar todas as colunas da tabela products
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'products'
ORDER BY column_name;
