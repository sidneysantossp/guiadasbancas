-- Verificar constraint de origem
SELECT 
  conname as constraint_name,
  pg_get_constraintdef(oid) as constraint_definition
FROM pg_constraint 
WHERE conname = 'check_origem';

-- Ver valores de origem existentes
SELECT DISTINCT origem, COUNT(*) 
FROM products 
WHERE origem IS NOT NULL
GROUP BY origem;
