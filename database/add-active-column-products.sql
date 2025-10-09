-- Script para adicionar coluna 'active' na tabela products
-- Execute no Supabase SQL Editor

-- 1. Verificar estrutura atual da tabela products
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'products'
ORDER BY ordinal_position;

-- 2. Adicionar coluna 'active' se não existir
ALTER TABLE products 
  ADD COLUMN IF NOT EXISTS active BOOLEAN DEFAULT true;

-- 3. Atualizar produtos existentes para ativo
UPDATE products 
SET active = true 
WHERE active IS NULL;

-- 4. Verificar produtos agora
SELECT COUNT(*) as total_produtos FROM products;
SELECT COUNT(*) as produtos_ativos FROM products WHERE active = true;

-- 5. Listar primeiros 10 produtos
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
ORDER BY created_at DESC
LIMIT 10;
