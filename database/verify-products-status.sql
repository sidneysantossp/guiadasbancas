-- Script para verificar status dos produtos
-- Execute no Supabase SQL Editor

-- 1. Verificar total de produtos
SELECT COUNT(*) as total_produtos FROM products;

-- 2. Verificar produtos ativos
SELECT COUNT(*) as produtos_ativos FROM products WHERE active = true;

-- 3. Verificar produtos com imagens
SELECT COUNT(*) as produtos_com_imagens FROM products WHERE images IS NOT NULL AND array_length(images, 1) > 0;

-- 4. Verificar produtos ativos com imagens
SELECT COUNT(*) as produtos_ativos_com_imagens 
FROM products 
WHERE active = true AND images IS NOT NULL AND array_length(images, 1) > 0;

-- 5. Listar primeiros 10 produtos ativos (para debug)
SELECT 
    id,
    name,
    price,
    active,
    CASE 
        WHEN images IS NULL THEN 'null'
        WHEN array_length(images, 1) IS NULL THEN 'array vazio'
        ELSE array_length(images, 1)::text || ' imagem(ns)'
    END as status_imagens,
    created_at
FROM products
WHERE active = true
ORDER BY created_at DESC
LIMIT 10;

-- 6. Se não houver produtos ativos, ativar os primeiros 20
UPDATE products
SET active = true
WHERE id IN (
    SELECT id FROM products
    ORDER BY created_at DESC
    LIMIT 20
);
