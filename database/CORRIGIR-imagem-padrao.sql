-- ============================================
-- CORRIGIR IMAGEM PADRÃO COM URL ABSOLUTA
-- ============================================

-- 1. Atualizar produtos com imagem padrão para usar URL que funciona
UPDATE products 
SET images = ARRAY['https://via.placeholder.com/400x600/e5e7eb/6b7280?text=PRODUTO+SEM+IMAGEM']
WHERE images = ARRAY['/images/no-image.svg'];

-- 2. Verificar produtos atualizados
SELECT 
  name,
  codigo_mercos,
  images[1] as primeira_imagem
FROM products 
WHERE images[1] LIKE '%placeholder%'
ORDER BY name
LIMIT 10;

-- 3. Resumo final
SELECT 
  CASE 
    WHEN images[1] LIKE '%placeholder%' THEN 'Placeholder via.placeholder'
    WHEN images[1] LIKE '%no-image%' THEN 'Placeholder local'
    WHEN array_length(images, 1) > 0 THEN 'Tem imagens próprias'
    ELSE 'Sem imagem'
  END as tipo_imagem,
  COUNT(*) as quantidade
FROM products
GROUP BY 
  CASE 
    WHEN images[1] LIKE '%placeholder%' THEN 'Placeholder via.placeholder'
    WHEN images[1] LIKE '%no-image%' THEN 'Placeholder local'
    WHEN array_length(images, 1) > 0 THEN 'Tem imagens próprias'
    ELSE 'Sem imagem'
  END
ORDER BY quantidade DESC;

-- ============================================
-- RESULTADO: Imagem placeholder externa que funciona
-- ============================================
