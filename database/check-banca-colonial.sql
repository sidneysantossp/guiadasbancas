-- Script para verificar a Banca Colonial
-- Execute no SQL Editor do Supabase

-- Buscar por "Colonial" em diferentes variações
SELECT * FROM bancas 
WHERE name ILIKE '%colonial%' 
   OR name ILIKE '%colonical%'
   OR address ILIKE '%colonial%'
   OR address ILIKE '%colonical%';

-- Verificar todas as bancas para ver se há alguma similar
SELECT id, name, address, active, created_at 
FROM bancas 
ORDER BY name;

-- Contar total de bancas
SELECT COUNT(*) as total_bancas FROM bancas;

-- Verificar se há bancas inativas
SELECT COUNT(*) as bancas_inativas FROM bancas WHERE active = false;

-- Buscar por qualquer banca que contenha "banca" no nome
SELECT * FROM bancas 
WHERE name ILIKE '%banca%'
ORDER BY name;
