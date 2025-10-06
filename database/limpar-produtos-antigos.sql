-- ============================================
-- LIMPAR PRODUTOS ANTIGOS (MANTER APENAS OS 13 BETA)
-- ============================================
-- ⚠️ CUIDADO: Isso vai deletar TODOS os produtos SEM codigo_mercos
-- Execute apenas se tiver certeza!
-- ============================================

-- 1. Ver quantos produtos serão deletados
SELECT COUNT(*) as produtos_a_deletar 
FROM products 
WHERE codigo_mercos IS NULL;

-- 2. Ver quais produtos serão deletados (preview)
SELECT id, name, created_at 
FROM products 
WHERE codigo_mercos IS NULL
ORDER BY created_at DESC
LIMIT 20;

-- 3. DELETAR produtos antigos (descomente para executar)
-- DELETE FROM products WHERE codigo_mercos IS NULL;

-- 4. Verificar apenas produtos beta restantes
SELECT COUNT(*) as produtos_beta 
FROM products 
WHERE codigo_mercos IS NOT NULL;

-- ============================================
-- ALTERNATIVA: Marcar como inativos ao invés de deletar
-- ============================================
-- UPDATE products 
-- SET active = false 
-- WHERE codigo_mercos IS NULL;
