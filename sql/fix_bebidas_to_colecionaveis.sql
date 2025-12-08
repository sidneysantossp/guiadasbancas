-- Script para mover produtos (Fichários e Miniaturas) da categoria 'Bebidas' para 'Colecionáveis'

DO $$
DECLARE
    v_bebidas_id UUID;
    v_colecionaveis_id UUID;
    v_moved_count INTEGER;
BEGIN
    -- 1. Obter IDs das categorias
    SELECT id INTO v_bebidas_id FROM categories WHERE name = 'Bebidas' LIMIT 1;
    SELECT id INTO v_colecionaveis_id FROM categories WHERE name = 'Colecionáveis' LIMIT 1;

    -- Verificar se categorias existem
    IF v_bebidas_id IS NULL OR v_colecionaveis_id IS NULL THEN
        RAISE NOTICE 'Categorias não encontradas (Bebidas ou Colecionáveis). Verifique os nomes exatos.';
        RETURN;
    END IF;

    -- 2. Atualizar produtos
    WITH updated_rows AS (
        UPDATE products
        SET category_id = v_colecionaveis_id
        WHERE category_id = v_bebidas_id
        AND (
            name ILIKE '%Fichário Para Cards%' OR
            name ILIKE '%Miniatura Fusca%'
        )
        RETURNING id, name
    )
    SELECT COUNT(*) INTO v_moved_count FROM updated_rows;

    RAISE NOTICE 'Atualização concluída: % produtos movidos de Bebidas para Colecionáveis.', v_moved_count;
END $$;
