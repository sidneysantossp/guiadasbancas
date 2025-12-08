-- Script para mover 'A ORDEM MAGICA' da categoria 'Colecionáveis' para 'HQs e Comics'

DO $$
DECLARE
    v_colecionaveis_id UUID;
    v_hqs_id UUID;
    v_moved_count INTEGER;
BEGIN
    -- 1. Obter IDs das categorias
    SELECT id INTO v_colecionaveis_id FROM categories WHERE name = 'Colecionáveis' LIMIT 1;
    SELECT id INTO v_hqs_id FROM categories WHERE name = 'HQs e Comics' LIMIT 1;

    -- Verificar se categorias existem
    IF v_colecionaveis_id IS NULL OR v_hqs_id IS NULL THEN
        RAISE NOTICE 'Categorias não encontradas (Colecionáveis ou HQs e Comics). Verifique os nomes exatos.';
        RETURN;
    END IF;

    -- 2. Atualizar produtos
    WITH updated_rows AS (
        UPDATE products
        SET category_id = v_hqs_id
        WHERE category_id = v_colecionaveis_id
        AND name ILIKE '%A ORDEM MAGICA%'
        RETURNING id, name
    )
    SELECT COUNT(*) INTO v_moved_count FROM updated_rows;

    RAISE NOTICE 'Atualização concluída: % produtos movidos de Colecionáveis para HQs e Comics.', v_moved_count;
END $$;
