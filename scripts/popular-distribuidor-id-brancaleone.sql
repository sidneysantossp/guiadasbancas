-- Script seguro para popular distribuidor_id nos produtos da Brancaleone
-- Use em produção apenas após validar pré-condições. Sempre tenha backup.

-- Passo 0: validar ambiente
-- - Rodar primeiro o bloco de pré-check (dry-run) abaixo.
-- - Garantir que apenas 1 distribuidor corresponda ao filtro.
-- - Garantir que a contagem de produtos a atualizar faz sentido.

-- ------------------------------------------------------------
-- PRE-CHECK (somente leitura)
-- ------------------------------------------------------------
WITH dist AS (
  SELECT id, nome
  FROM distribuidores
  WHERE nome ILIKE '%brancaleone%'
  ORDER BY id
)
SELECT
  'DIST ENCONTRADOS' AS descricao,
  COUNT(*)           AS qtd,
  string_agg(id::text || ':' || nome, ', ') AS detalhes
FROM dist;

WITH dist AS (
  SELECT id FROM distribuidores WHERE nome ILIKE '%brancaleone%' ORDER BY id LIMIT 1
)
SELECT
  'PRODUTOS SEM distribuidor_id (origem Brancaleone)' AS descricao,
  COUNT(*) AS quantidade
FROM products
WHERE distribuidor_id IS NULL
  AND origem = 'Brancaleone';

-- ------------------------------------------------------------
-- EXECUÇÃO (faça dentro de transação)
-- ------------------------------------------------------------
-- BEGIN; -- descomente para executar em transação

DO $$
DECLARE
  v_dist RECORD;
  v_afetados INTEGER;
BEGIN
  SELECT id, nome INTO v_dist
  FROM distribuidores
  WHERE nome ILIKE '%brancaleone%'
  ORDER BY id
  LIMIT 1;

  IF v_dist IS NULL THEN
    RAISE EXCEPTION 'Nenhum distribuidor encontrado para %%brancaleone%%';
  END IF;

  UPDATE products p
  SET distribuidor_id = v_dist.id
  WHERE p.distribuidor_id IS NULL
    AND p.origem = 'Brancaleone';

  GET DIAGNOSTICS v_afetados = ROW_COUNT;

  RAISE NOTICE 'Atualizados % produtos para distribuidor % (%)', v_afetados, v_dist.id, v_dist.nome;
END $$;

-- Verificar resultado
WITH dist AS (
  SELECT id FROM distribuidores WHERE nome ILIKE '%brancaleone%' ORDER BY id LIMIT 1
)
SELECT
  'PRODUTOS ATUALIZADOS' AS descricao,
  COUNT(*) AS quantidade
FROM products
WHERE distribuidor_id = (SELECT id FROM dist)
  AND origem = 'Brancaleone';

WITH dist AS (
  SELECT id FROM distribuidores WHERE nome ILIKE '%brancaleone%' ORDER BY id LIMIT 1
)
SELECT
  active,
  COUNT(*) AS quantidade
FROM products
WHERE distribuidor_id = (SELECT id FROM dist)
GROUP BY active
ORDER BY active;

-- COMMIT; -- descomente após revisar os contadores
-- ROLLBACK; -- use se algo estiver errado
