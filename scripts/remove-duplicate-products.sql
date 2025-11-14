-- Script para remover produtos duplicados
-- Mantém apenas o produto mais antigo (menor created_at) de cada grupo

-- 1. Identificar duplicatas (mesmo nome + mesmo distribuidor_id)
WITH duplicates AS (
  SELECT 
    id,
    name,
    distribuidor_id,
    created_at,
    ROW_NUMBER() OVER (
      PARTITION BY name, distribuidor_id 
      ORDER BY created_at ASC
    ) as rn
  FROM products
  WHERE distribuidor_id IS NOT NULL
)
-- 2. Selecionar IDs para deletar (mantém apenas rn = 1, que é o mais antigo)
SELECT 
  COUNT(*) as total_duplicatas,
  COUNT(DISTINCT name) as produtos_unicos_duplicados
FROM duplicates
WHERE rn > 1;

-- Para ver os produtos que serão deletados (EXECUTE PRIMEIRO PARA REVISAR):
WITH duplicates AS (
  SELECT 
    id,
    name,
    distribuidor_id,
    sku,
    created_at,
    ROW_NUMBER() OVER (
      PARTITION BY name, distribuidor_id 
      ORDER BY created_at ASC
    ) as rn
  FROM products
  WHERE distribuidor_id IS NOT NULL
)
SELECT 
  name,
  distribuidor_id,
  COUNT(*) as copias,
  array_agg(id ORDER BY created_at) as ids,
  array_agg(created_at ORDER BY created_at) as datas
FROM duplicates
WHERE name IN (
  SELECT name 
  FROM duplicates 
  GROUP BY name, distribuidor_id 
  HAVING COUNT(*) > 1
)
GROUP BY name, distribuidor_id
ORDER BY copias DESC, name
LIMIT 50;

-- ATENÇÃO: Execute este comando APENAS após revisar os resultados acima!
-- Para DELETAR as duplicatas (mantém o mais antigo):
/*
WITH duplicates AS (
  SELECT 
    id,
    ROW_NUMBER() OVER (
      PARTITION BY name, distribuidor_id 
      ORDER BY created_at ASC
    ) as rn
  FROM products
  WHERE distribuidor_id IS NOT NULL
)
DELETE FROM products
WHERE id IN (
  SELECT id FROM duplicates WHERE rn > 1
);
*/
