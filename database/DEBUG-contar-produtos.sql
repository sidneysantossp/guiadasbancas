-- Verificar quantos produtos existem
SELECT COUNT(*) as total_produtos FROM products;

-- Ver primeiros 5 produtos
SELECT 
  id,
  name,
  distribuidor_id,
  price,
  stock_qty,
  created_at
FROM products 
ORDER BY created_at DESC
LIMIT 5;

-- Ver estrutura completa da tabela
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'products'
ORDER BY ordinal_position;
