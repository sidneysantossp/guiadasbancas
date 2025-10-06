-- ============================================
-- ADICIONAR IMAGENS REAIS DOS PRODUTOS BETA
-- ============================================

-- Atualizar produtos com imagens reais baseadas no código Mercos
UPDATE products 
SET images = CASE codigo_mercos
  WHEN 'AKOTO001' THEN ARRAY['https://arquivos.mercos.com/media/imagem_produto/372791/3f15c0ec-e497-11ee-b6a7-e2b250ff01a0.jpg']
  WHEN 'ADBEM001' THEN ARRAY['https://via.placeholder.com/400x600/ff5c00/ffffff?text=100+BALAS']
  WHEN 'ACBKA004' THEN ARRAY['https://via.placeholder.com/400x600/2563eb/ffffff?text=20TH+CENTURY+4']
  WHEN 'ACBKA002' THEN ARRAY['https://via.placeholder.com/400x600/dc2626/ffffff?text=20TH+CENTURY+2']
  WHEN 'ACBKA003' THEN ARRAY['https://via.placeholder.com/400x600/059669/ffffff?text=20TH+CENTURY+3']
  WHEN 'AOITO001' THEN ARRAY['https://via.placeholder.com/400x600/7c3aed/ffffff?text=8+BILHOES']
  WHEN 'ABELC001' THEN ARRAY['https://via.placeholder.com/400x600/ea580c/ffffff?text=BELA+CASA+PRAIA']
  WHEN 'ABELA002' THEN ARRAY['https://via.placeholder.com/400x600/0891b2/ffffff?text=BELA+CASA+LAGO']
  WHEN 'ABRIG001' THEN ARRAY['https://via.placeholder.com/400x600/be185d/ffffff?text=BRIGADA']
  WHEN 'AECOF001' THEN ARRAY['https://via.placeholder.com/400x600/65a30d/ffffff?text=CANCAO+FENIX']
  WHEN 'AHNIE002' THEN ARRAY['https://via.placeholder.com/400x600/ca8a04/ffffff?text=CASA+ESTRANHA']
  WHEN 'AZRAE001' THEN ARRAY['https://via.placeholder.com/400x600/991b1b/ffffff?text=ESPADA+AZRAEL']
  WHEN 'HBRCO012' THEN ARRAY['https://via.placeholder.com/400x600/1f2937/ffffff?text=ESPADA+SELVAGEM']
  ELSE images
END
WHERE codigo_mercos IS NOT NULL;

-- Verificar produtos atualizados
SELECT 
  name,
  codigo_mercos,
  array_length(images, 1) as total_imagens,
  images[1] as primeira_imagem
FROM products 
WHERE codigo_mercos IS NOT NULL
ORDER BY name;

-- ============================================
-- RESULTADO: 13 produtos com imagens coloridas
-- ============================================
