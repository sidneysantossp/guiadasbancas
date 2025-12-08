-- Script para mover produtos "Bateria" da categoria "Figurinhas" para "Acessórios"
-- Execute este script manualmente no seu banco de dados se necessário

DO $$
DECLARE
    figurinhas_id UUID;
    acessorios_id UUID;
    produtos_movidos INTEGER := 0;
BEGIN
    -- Buscar IDs das categorias
    SELECT id INTO figurinhas_id FROM categories WHERE name = 'Figurinhas';
    SELECT id INTO acessorios_id FROM categories WHERE name = 'Acessórios';
    
    IF figurinhas_id IS NULL THEN
        RAISE NOTICE 'Categoria "Figurinhas" não encontrada';
    ELSIF acessorios_id IS NULL THEN
        RAISE NOTICE 'Categoria "Acessórios" não encontrada';
    ELSE
        -- Atualizar produtos que correspondem ao padrão "Bateria"
        UPDATE products 
        SET category_id = acessorios_id 
        WHERE category_id = figurinhas_id 
        AND name ILIKE '%Bateria%';
        
        GET DIAGNOSTICS produtos_movidos = ROW_COUNT;
        
        RAISE NOTICE 'Movidos % produtos "Bateria" de "Figurinhas" para "Acessórios"', produtos_movidos;
    END IF;
END $$;

-- Verificação (opcional)
SELECT 
    p.name,
    c.name as category_name
FROM products p
JOIN categories c ON p.category_id = c.id
WHERE p.name ILIKE '%Bateria%'
ORDER BY p.name;
