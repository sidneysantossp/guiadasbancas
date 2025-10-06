-- Verificar URLs de imagens dos produtos
SELECT 
  name,
  codigo_mercos,
  images[1] as primeira_imagem,
  CASE 
    WHEN images[1] LIKE 'http%' THEN 'URL válida'
    WHEN images[1] LIKE '/%' THEN 'Caminho relativo'
    ELSE 'Formato desconhecido'
  END as tipo_url,
  char_length(images[1]) as tamanho_url
FROM products 
WHERE codigo_mercos IS NOT NULL
ORDER BY name
LIMIT 15;
