-- Script para garantir que a tabela products está pronta para homologação Mercos
-- Execute este SQL no Supabase SQL Editor antes de criar produtos

-- 1. Tornar banca_id opcional
ALTER TABLE products 
ALTER COLUMN banca_id DROP NOT NULL;

-- 2. Adicionar campos Mercos se não existirem
ALTER TABLE products
ADD COLUMN IF NOT EXISTS codigo_mercos VARCHAR(50) UNIQUE,
ADD COLUMN IF NOT EXISTS unidade_medida VARCHAR(10) DEFAULT 'UN',
ADD COLUMN IF NOT EXISTS venda_multiplos DECIMAL(10,2) DEFAULT 1.00,
ADD COLUMN IF NOT EXISTS categoria_mercos VARCHAR(100),
ADD COLUMN IF NOT EXISTS disponivel_todas_bancas BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS distribuidor_id UUID REFERENCES distribuidores(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS mercos_id INTEGER,
ADD COLUMN IF NOT EXISTS sincronizado_em TIMESTAMP;

-- 3. Criar índices para performance
CREATE INDEX IF NOT EXISTS idx_products_codigo_mercos ON products(codigo_mercos);
CREATE INDEX IF NOT EXISTS idx_products_mercos_id ON products(mercos_id);
CREATE INDEX IF NOT EXISTS idx_products_distribuidor_id ON products(distribuidor_id);

-- 4. Tornar category_id opcional se necessário
ALTER TABLE products 
ALTER COLUMN category_id DROP NOT NULL;

-- 5. Verificar estrutura final
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'products'
AND column_name IN (
  'banca_id', 'category_id', 'codigo_mercos', 'unidade_medida', 
  'venda_multiplos', 'categoria_mercos', 'disponivel_todas_bancas',
  'distribuidor_id', 'mercos_id', 'sincronizado_em'
)
ORDER BY column_name;
