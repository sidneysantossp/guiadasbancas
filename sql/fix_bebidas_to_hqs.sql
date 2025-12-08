-- Script para mover produtos de gibis da categoria 'Bebidas' para 'HQs e Comics'

DO $$
DECLARE
    v_bebidas_id UUID;
    v_hqs_id UUID;
    v_moved_count INTEGER;
BEGIN
    -- 1. Obter IDs das categorias
    SELECT id INTO v_bebidas_id FROM categories WHERE name = 'Bebidas' LIMIT 1;
    SELECT id INTO v_hqs_id FROM categories WHERE name = 'HQs e Comics' LIMIT 1;

    -- Verificar se categorias existem
    IF v_bebidas_id IS NULL OR v_hqs_id IS NULL THEN
        RAISE NOTICE 'Categorias não encontradas. Verifique os nomes exatos.';
        RETURN;
    END IF;

    -- 2. Atualizar produtos
    WITH updated_rows AS (
        UPDATE products
        SET category_id = v_hqs_id
        WHERE category_id = v_bebidas_id
        AND (
            name ILIKE '%CHAIN SAW MAN%' OR
            name ILIKE '%CHAINSAW MAN%' OR
            name ILIKE '%CHAOS GAME%' OR
            name ILIKE '%HOMEM-BORRACHA%' OR
            name ILIKE '%MIERUKO-CHAN%' OR
            name ILIKE '%MICKEY MOUSE%' OR
            name ILIKE '%MUSHOKU TENSEI%'
        )
        RETURNING id, name
    )
    SELECT COUNT(*) INTO v_moved_count FROM updated_rows;

    RAISE NOTICE 'Atualização concluída: % produtos movidos de Bebidas para HQs e Comics.', v_moved_count;
END $$;
