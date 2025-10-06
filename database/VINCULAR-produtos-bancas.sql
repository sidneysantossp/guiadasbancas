-- ============================================
-- VINCULAR PRODUTOS ÀS BANCAS
-- ============================================
-- Torna os produtos criados pelo admin disponíveis para todas as bancas

-- 1. Inserir produtos na tabela de relacionamento banca-produtos
-- Isso fará os produtos aparecerem nos perfis das bancas
INSERT INTO banca_produtos_distribuidor (
  banca_id, 
  product_id, 
  active, 
  preco_personalizado,
  created_at,
  updated_at
)
SELECT 
  b.id as banca_id,
  p.id as product_id,
  true as active,
  p.price as preco_personalizado,
  NOW() as created_at,
  NOW() as updated_at
FROM bancas b
CROSS JOIN products p
WHERE p.codigo_mercos IS NOT NULL  -- Apenas produtos beta
AND b.active = true                -- Apenas bancas ativas
AND NOT EXISTS (
  -- Evitar duplicatas
  SELECT 1 FROM banca_produtos_distribuidor bpd 
  WHERE bpd.banca_id = b.id 
  AND bpd.product_id = p.id
);

-- 2. Verificar quantos relacionamentos foram criados
SELECT 
  COUNT(*) as total_relacionamentos_criados
FROM banca_produtos_distribuidor bpd
JOIN products p ON p.id = bpd.product_id
WHERE p.codigo_mercos IS NOT NULL;

-- 3. Ver produtos por banca
SELECT 
  b.name as banca_nome,
  COUNT(bpd.product_id) as total_produtos
FROM bancas b
LEFT JOIN banca_produtos_distribuidor bpd ON bpd.banca_id = b.id
LEFT JOIN products p ON p.id = bpd.product_id AND p.codigo_mercos IS NOT NULL
WHERE b.active = true
GROUP BY b.id, b.name
ORDER BY total_produtos DESC
LIMIT 10;

-- ============================================
-- RESULTADO ESPERADO: 
-- - Cada banca ativa deve ter 13 produtos beta
-- - Total relacionamentos = (bancas ativas × 13)
-- ============================================
