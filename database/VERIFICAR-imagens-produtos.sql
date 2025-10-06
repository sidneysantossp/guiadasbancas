-- Verificar se as imagens estão salvas no banco
SELECT 
  id,
  name,
  codigo_mercos,
  images,
  array_length(images, 1) as total_imagens
FROM products 
WHERE codigo_mercos = 'AKOTO001'
OR name ILIKE '%10 COISAS%'
LIMIT 5;

-- Ver todos os produtos com imagens
SELECT 
  name,
  codigo_mercos,
  array_length(images, 1) as total_imagens,
  images[1] as primeira_imagem
FROM products 
WHERE images IS NOT NULL 
AND array_length(images, 1) > 0
ORDER BY name
LIMIT 10;
