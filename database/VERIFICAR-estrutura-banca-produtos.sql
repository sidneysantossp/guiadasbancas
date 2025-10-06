-- Verificar estrutura da tabela banca_produtos_distribuidor
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'banca_produtos_distribuidor'
ORDER BY ordinal_position;
