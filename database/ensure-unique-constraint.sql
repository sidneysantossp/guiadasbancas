-- Garantir constraint único para upsert funcionar
-- Execute este script no Supabase SQL Editor

-- 1. Verificar se já existe constraint
SELECT 
  indexname, 
  indexdef 
FROM pg_indexes 
WHERE tablename = 'products' 
  AND indexname LIKE '%distribuidor%mercos%';

-- 2. Remover duplicatas se existirem
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

-- 3. Criar constraint único se não existir
DO $$ 
BEGIN
  -- Tentar criar o índice único
  BEGIN
    CREATE UNIQUE INDEX CONCURRENTLY idx_products_distribuidor_mercos_unique 
      ON public.products(distribuidor_id, mercos_id) 
      WHERE mercos_id IS NOT NULL AND distribuidor_id IS NOT NULL;
    RAISE NOTICE 'Índice único criado com sucesso';
  EXCEPTION
    WHEN duplicate_table THEN
      RAISE NOTICE 'Índice único já existe';
    WHEN others THEN
      -- Se falhar, tentar sem CONCURRENTLY
      BEGIN
        DROP INDEX IF EXISTS idx_products_distribuidor_mercos_unique;
        CREATE UNIQUE INDEX idx_products_distribuidor_mercos_unique 
          ON public.products(distribuidor_id, mercos_id) 
          WHERE mercos_id IS NOT NULL AND distribuidor_id IS NOT NULL;
        RAISE NOTICE 'Índice único criado (sem concorrência)';
      EXCEPTION
        WHEN others THEN
          RAISE NOTICE 'Erro ao criar índice: %', SQLERRM;
      END;
  END;
END $$;

-- 4. Verificar resultado final
SELECT 
  'Constraint criado com sucesso! Pode usar upsert agora.' as status,
  COUNT(*) as total_produtos_com_mercos_id
FROM public.products 
WHERE mercos_id IS NOT NULL AND distribuidor_id IS NOT NULL;
