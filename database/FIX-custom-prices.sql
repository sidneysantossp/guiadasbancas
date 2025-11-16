-- Script para corrigir preços customizados que foram salvos incorretamente
-- 
-- PROBLEMA: Versão antiga do código salvava valores divididos por 10
-- Exemplo: R$ 13,90 era salvo como 1.39 ao invés de 13.9
--
-- SOLUÇÃO: Multiplicar por 10 os valores que estão muito baixos

-- ⚠️ IMPORTANTE: Execute este script APENAS UMA VEZ!
-- Se executar múltiplas vezes, vai multiplicar os valores novamente

-- PASSO 1: Ver quais preços serão corrigidos (PREVIEW)
SELECT 
  b.name as banca_nome,
  p.name as produto_nome,
  p.price as preco_distribuidor,
  bpd.custom_price as preco_atual,
  bpd.custom_price * 10 as preco_corrigido,
  'Será multiplicado por 10' as acao
FROM banca_produtos_distribuidor bpd
JOIN bancas b ON b.id = bpd.banca_id
JOIN products p ON p.id = bpd.product_id
WHERE bpd.custom_price IS NOT NULL
  AND bpd.custom_price < 10  -- Preços muito baixos (suspeitos)
  AND bpd.custom_price > 0;

-- PASSO 2: Fazer backup dos valores atuais (SEGURANÇA)
CREATE TABLE IF NOT EXISTS banca_produtos_distribuidor_backup_prices AS
SELECT 
  id,
  banca_id,
  product_id,
  custom_price,
  NOW() as backup_em
FROM banca_produtos_distribuidor
WHERE custom_price IS NOT NULL;

-- PASSO 3: Corrigir os preços (EXECUTAR APENAS UMA VEZ!)
-- Descomente as linhas abaixo para executar a correção:

/*
UPDATE banca_produtos_distribuidor
SET custom_price = custom_price * 10
WHERE custom_price IS NOT NULL
  AND custom_price < 10  -- Apenas preços muito baixos
  AND custom_price > 0;  -- Não mexer em preços zerados
*/

-- PASSO 4: Verificar resultado
SELECT 
  b.name as banca_nome,
  p.name as produto_nome,
  p.price as preco_distribuidor,
  bpd.custom_price as preco_customizado,
  CASE 
    WHEN bpd.custom_price < 10 THEN '⚠️ Ainda baixo'
    WHEN bpd.custom_price > p.price * 3 THEN '⚠️ Muito alto'
    ELSE '✅ OK'
  END as status
FROM banca_produtos_distribuidor bpd
JOIN bancas b ON b.id = bpd.banca_id
JOIN products p ON p.id = bpd.product_id
WHERE bpd.custom_price IS NOT NULL
ORDER BY bpd.custom_price ASC;

-- PASSO 5: Se algo der errado, restaurar do backup
-- Descomente para restaurar:

/*
UPDATE banca_produtos_distribuidor bpd
SET custom_price = backup.custom_price
FROM banca_produtos_distribuidor_backup_prices backup
WHERE bpd.id = backup.id;
*/
