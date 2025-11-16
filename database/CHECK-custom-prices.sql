-- Verificar preços customizados na tabela banca_produtos_distribuidor

-- 1. Ver todos os preços customizados
SELECT 
  b.name as banca_nome,
  p.name as produto_nome,
  p.price as preco_distribuidor,
  bpd.custom_price as preco_customizado,
  bpd.enabled,
  bpd.modificado_em
FROM banca_produtos_distribuidor bpd
JOIN bancas b ON b.id = bpd.banca_id
JOIN products p ON p.id = bpd.product_id
WHERE bpd.custom_price IS NOT NULL
ORDER BY b.name, p.name;

-- 2. Ver preços que parecem estar errados (muito baixos)
SELECT 
  b.name as banca_nome,
  p.name as produto_nome,
  p.codigo_mercos,
  p.price as preco_distribuidor,
  bpd.custom_price as preco_customizado,
  CASE 
    WHEN bpd.custom_price < 10 THEN '⚠️ SUSPEITO (muito baixo)'
    WHEN bpd.custom_price > p.price * 2 THEN '⚠️ SUSPEITO (muito alto)'
    ELSE '✅ OK'
  END as status
FROM banca_produtos_distribuidor bpd
JOIN bancas b ON b.id = bpd.banca_id
JOIN products p ON p.id = bpd.product_id
WHERE bpd.custom_price IS NOT NULL
ORDER BY bpd.custom_price ASC;

-- 3. Contar quantas bancas têm preços customizados
SELECT 
  COUNT(DISTINCT banca_id) as bancas_com_precos_customizados,
  COUNT(*) as total_produtos_customizados
FROM banca_produtos_distribuidor
WHERE custom_price IS NOT NULL;

-- 4. Ver produtos do ALMANAQUE DO CASCAO especificamente
SELECT 
  b.name as banca_nome,
  p.name as produto_nome,
  p.price as preco_distribuidor,
  bpd.custom_price as preco_customizado,
  bpd.enabled
FROM banca_produtos_distribuidor bpd
JOIN bancas b ON b.id = bpd.banca_id
JOIN products p ON p.id = bpd.product_id
WHERE p.name ILIKE '%ALMANAQUE%CASCAO%'
  OR p.name ILIKE '%INVENCIVEL%'
  OR p.name ILIKE '%SURFISTA%';
