-- ============================================
-- ADICIONAR IMAGENS DE EXEMPLO AOS PRODUTOS
-- ============================================
-- Adiciona URLs de imagens de exemplo para os produtos beta

-- Atualizar produtos com codigo_mercos com imagens de exemplo
UPDATE products 
SET images = ARRAY[
  'https://via.placeholder.com/400x600/ff5c00/ffffff?text=' || COALESCE(codigo_mercos, 'PRODUTO')
]
WHERE codigo_mercos IS NOT NULL 
AND (images IS NULL OR array_length(images, 1) IS NULL);

-- Verificar produtos atualizados
SELECT 
  name,
  codigo_mercos,
  array_length(images, 1) as total_imagens,
  images[1] as primeira_imagem
FROM products 
WHERE codigo_mercos IS NOT NULL
ORDER BY name
LIMIT 10;

-- ============================================
-- RESULTADO ESPERADO: 13 produtos com imagens
-- ============================================
