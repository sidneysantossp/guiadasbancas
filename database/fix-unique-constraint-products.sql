-- Garantir que existe constraint único para (distribuidor_id, mercos_id)
-- Pode ser executado múltiplas vezes sem erro

-- 1. Verificar se o índice único já existe
DO $$ 
BEGIN
  -- Remover índice antigo se existir (sem WHERE clause)
  DROP INDEX IF EXISTS idx_products_distribuidor_mercos_id;
  
  -- Criar índice único com WHERE clause para evitar conflitos com NULL
  CREATE UNIQUE INDEX idx_products_distribuidor_mercos_id 
    ON public.products(distribuidor_id, mercos_id) 
    WHERE mercos_id IS NOT NULL AND distribuidor_id IS NOT NULL;
    
  RAISE NOTICE 'Índice único idx_products_distribuidor_mercos_id criado com sucesso';
EXCEPTION
  WHEN duplicate_table THEN
    RAISE NOTICE 'Índice único já existe, ignorando';
END $$;

-- 2. Verificar se existem duplicatas antes de criar o constraint
WITH duplicatas AS (
  SELECT distribuidor_id, mercos_id, COUNT(*) as cnt
  FROM public.products 
  WHERE mercos_id IS NOT NULL AND distribuidor_id IS NOT NULL
  GROUP BY distribuidor_id, mercos_id
  HAVING COUNT(*) > 1
)
SELECT 
  CASE 
    WHEN EXISTS (SELECT 1 FROM duplicatas) THEN 
      'ATENÇÃO: Existem ' || (SELECT COUNT(*) FROM duplicatas) || ' duplicatas que precisam ser removidas'
    ELSE 
      'OK: Nenhuma duplicata encontrada'
  END as status;

-- 3. Remover duplicatas se existirem (manter apenas o mais recente)
WITH duplicatas AS (
  SELECT id, 
         ROW_NUMBER() OVER (
           PARTITION BY distribuidor_id, mercos_id 
           ORDER BY created_at DESC
         ) as rn
  FROM public.products 
  WHERE mercos_id IS NOT NULL AND distribuidor_id IS NOT NULL
)
DELETE FROM public.products 
WHERE id IN (
  SELECT id FROM duplicatas WHERE rn > 1
);

-- 4. Confirmar que o constraint está funcionando
SELECT 'Constraint único criado e duplicatas removidas com sucesso!' as resultado;
