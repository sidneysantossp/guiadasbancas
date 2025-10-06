-- Verificar estrutura da tabela distribuidores
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'distribuidores'
ORDER BY ordinal_position;

-- Ver se existem distribuidores
SELECT * FROM distribuidores LIMIT 3;
