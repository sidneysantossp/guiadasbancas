-- ============================================
-- ADICIONAR IMAGEM PADRÃO PARA PRODUTOS SEM IMAGEM
-- ============================================

-- 1. Ver produtos sem imagem
SELECT 
  name,
  codigo_mercos,
  CASE 
    WHEN images IS NULL THEN 'NULL'
    WHEN array_length(images, 1) IS NULL THEN 'Array vazio'
    ELSE 'Tem imagens: ' || array_length(images, 1)::text
  END as status_imagem
FROM products 
WHERE images IS NULL 
   OR array_length(images, 1) IS NULL 
   OR array_length(images, 1) = 0
ORDER BY name;

-- 2. Atualizar produtos sem imagem com a imagem padrão
UPDATE products 
SET images = ARRAY['/images/no-image.svg']
WHERE images IS NULL 
   OR array_length(images, 1) IS NULL 
   OR array_length(images, 1) = 0;

-- 3. Verificar produtos atualizados
SELECT 
  name,
  codigo_mercos,
  array_length(images, 1) as total_imagens,
  images[1] as primeira_imagem
FROM products 
WHERE images[1] = '/images/no-image.svg'
ORDER BY name;

-- 4. Resumo final
SELECT 
  CASE 
    WHEN images[1] = '/images/no-image.svg' THEN 'Imagem padrão'
    WHEN array_length(images, 1) > 0 THEN 'Tem imagens próprias'
    ELSE 'Sem imagem'
  END as tipo_imagem,
  COUNT(*) as quantidade
FROM products
GROUP BY 
  CASE 
    WHEN images[1] = '/images/no-image.svg' THEN 'Imagem padrão'
    WHEN array_length(images, 1) > 0 THEN 'Tem imagens próprias'
    ELSE 'Sem imagem'
  END
ORDER BY quantidade DESC;

-- ============================================
-- RESULTADO ESPERADO:
-- - Produtos sem imagem agora têm /images/no-image.svg
-- - Placeholder aparece nos cards dos produtos
-- ============================================
