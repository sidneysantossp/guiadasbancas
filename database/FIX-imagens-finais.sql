-- ============================================
-- FIX FINAL: Imagens que funcionam SEMPRE
-- ============================================

-- 1. Atualizar produto com imagem real da Mercos (AKOTO001)
UPDATE products 
SET images = ARRAY['https://arquivos.mercos.com/media/imagem_produto/372791/3f15c0ec-e497-11ee-b6a7-e2b250ff01a0.jpg']
WHERE codigo_mercos = 'AKOTO001';

-- 2. Para os demais produtos, usar URL de placeholder SIMPLES (sem texto customizado)
UPDATE products 
SET images = ARRAY['https://placehold.co/400x600/e5e7eb/6b7280.png']
WHERE codigo_mercos IS NOT NULL
AND codigo_mercos != 'AKOTO001'
AND (images IS NULL OR array_length(images, 1) = 0 OR images[1] LIKE '%placeholder%text%');

-- 3. Verificar resultado
SELECT 
  name,
  codigo_mercos,
  images[1] as imagem_url,
  CASE 
    WHEN images[1] LIKE '%mercos%' THEN '✅ Imagem real Mercos'
    WHEN images[1] LIKE '%placehold.co%' THEN '📦 Placeholder simples'
    ELSE '❌ Outro'
  END as tipo
FROM products 
WHERE codigo_mercos IS NOT NULL
ORDER BY tipo, name;

-- 4. Contar por tipo
SELECT 
  CASE 
    WHEN images[1] LIKE '%mercos%' THEN 'Imagem real'
    WHEN images[1] LIKE '%placehold%' THEN 'Placeholder'
    ELSE 'Outro'
  END as tipo,
  COUNT(*) as quantidade
FROM products 
WHERE codigo_mercos IS NOT NULL
GROUP BY 
  CASE 
    WHEN images[1] LIKE '%mercos%' THEN 'Imagem real'
    WHEN images[1] LIKE '%placehold%' THEN 'Placeholder'
    ELSE 'Outro'
  END;

-- ============================================
-- RESULTADO ESPERADO:
-- - 1 produto com imagem real da Mercos
-- - 12 produtos com placeholder simples
-- ============================================
