-- Script para verificar e corrigir produtos da Banca Colonial
-- Execute no SQL Editor do Supabase

-- 1. Verificar produtos órfãos (sem banca válida)
SELECT 
    p.id, 
    p.name, 
    p.banca_id, 
    p.created_at,
    'ÓRFÃO - banca_id não existe' as status
FROM products p
LEFT JOIN bancas b ON p.banca_id = b.id
WHERE b.id IS NULL
ORDER BY p.created_at;

-- 2. Verificar produtos que podem ser da Banca Colonial pelo nome/descrição
SELECT 
    p.id, 
    p.name, 
    p.description,
    p.banca_id, 
    p.created_at,
    'POSSÍVEL COLONIAL' as status
FROM products p
WHERE (p.name ILIKE '%colonial%' 
       OR p.description ILIKE '%colonial%'
       OR p.name ILIKE '%colonical%' 
       OR p.description ILIKE '%colonical%')
ORDER BY p.created_at;

-- 3. Após executar o script add-banca-colonial.sql, execute este para associar produtos órfãos
-- DESCOMENTE AS LINHAS ABAIXO APENAS APÓS CRIAR A BANCA COLONIAL

/*
-- Associar produtos órfãos à Banca Colonial (execute apenas se tiver certeza)
UPDATE products 
SET banca_id = (SELECT id FROM bancas WHERE name = 'Banca Colonial' LIMIT 1),
    updated_at = NOW()
WHERE banca_id NOT IN (SELECT id FROM bancas)
   OR banca_id IS NULL;

-- Verificar resultado
SELECT 
    p.id, 
    p.name, 
    b.name as banca_name,
    p.updated_at
FROM products p
JOIN bancas b ON p.banca_id = b.id
WHERE b.name = 'Banca Colonial'
ORDER BY p.updated_at DESC;
*/
