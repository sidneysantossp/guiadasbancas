-- Verificar se os campos do cotista existem na tabela bancas
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'bancas' 
AND column_name IN ('is_cotista', 'cotista_id', 'cotista_codigo', 'cotista_razao_social', 'cotista_cnpj_cpf')
ORDER BY column_name;

-- Verificar se há alguma banca com dados de cotista
SELECT id, name, is_cotista, cotista_razao_social, user_id 
FROM bancas 
WHERE is_cotista IS NOT NULL OR cotista_razao_social IS NOT NULL
LIMIT 5;
