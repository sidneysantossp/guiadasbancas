-- Script para adicionar APENAS dados faltantes no Supabase
-- MANTÉM todos os dados existentes (bancas, categorias, usuários)
-- Execute no SQL Editor do Supabase

-- 1. Verificar dados existentes ANTES
SELECT 'ANTES - Categorias:' as info, count(*) as total FROM categories
UNION ALL
SELECT 'ANTES - Bancas:' as info, count(*) as total FROM bancas
UNION ALL
SELECT 'ANTES - Produtos:' as info, count(*) as total FROM products
UNION ALL
SELECT 'ANTES - Pedidos:' as info, count(*) as total FROM orders
UNION ALL
SELECT 'ANTES - User Profiles:' as info, count(*) as total FROM user_profiles;

-- 2. Adicionar produtos APENAS para bancas que NÃO têm produtos
DO $$
DECLARE
    banca_record RECORD;
    cat_record RECORD;
    produto_count INTEGER;
BEGIN
    -- Para cada banca que não tem produtos
    FOR banca_record IN 
        SELECT b.id, b.name 
        FROM bancas b 
        LEFT JOIN products p ON b.id = p.banca_id 
        GROUP BY b.id, b.name 
        HAVING count(p.id) = 0 
    LOOP
        RAISE NOTICE 'Adicionando produtos para banca: %', banca_record.name;
        
        -- Categoria Revistas
        SELECT id INTO cat_record FROM categories WHERE name ILIKE '%revista%' LIMIT 1;
        IF FOUND THEN
            INSERT INTO products (name, description, price, category_id, banca_id, images) VALUES
            ('Revista Veja', 'Revista semanal de notícias e atualidades', 12.90, cat_record.id, banca_record.id, ARRAY['https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400']),
            ('Revista Época', 'Revista de informação e análise', 11.50, cat_record.id, banca_record.id, ARRAY['https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400']);
        END IF;
        
        -- Categoria Jornais
        SELECT id INTO cat_record FROM categories WHERE name ILIKE '%jornal%' LIMIT 1;
        IF FOUND THEN
            INSERT INTO products (name, description, price, category_id, banca_id, images) VALUES
            ('Folha de S.Paulo', 'Jornal diário de notícias', 4.50, cat_record.id, banca_record.id, ARRAY['https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400']),
            ('O Estado de S. Paulo', 'Jornal tradicional paulista', 4.00, cat_record.id, banca_record.id, ARRAY['https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400']);
        END IF;
        
        -- Categoria Papelaria
        SELECT id INTO cat_record FROM categories WHERE name ILIKE '%papelaria%' LIMIT 1;
        IF FOUND THEN
            INSERT INTO products (name, description, price, category_id, banca_id, images) VALUES
            ('Caneta Bic Azul', 'Caneta esferográfica azul', 2.50, cat_record.id, banca_record.id, ARRAY['https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400']),
            ('Caderno Universitário', 'Caderno 10 matérias 200 folhas', 15.90, cat_record.id, banca_record.id, ARRAY['https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400']);
        END IF;
        
    END LOOP;
    
    -- Se não há bancas, adicionar algumas de exemplo (apenas se a tabela estiver vazia)
    SELECT count(*) INTO produto_count FROM bancas;
    IF produto_count = 0 THEN
        RAISE NOTICE 'Tabela bancas vazia, adicionando bancas de exemplo...';
        INSERT INTO bancas (name, cep, address, lat, lng, rating, categories, cover_image) VALUES
        ('Banca Central Paulista', '01310-100', 'Av. Paulista, 1000 - Bela Vista, São Paulo - SP', -23.5618, -46.6565, 4.5, ARRAY['Revistas', 'Jornais', 'Papelaria'], 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800'),
        ('Jornaleiro da Vila', '04038-001', 'Rua Augusta, 500 - Consolação, São Paulo - SP', -23.5548, -46.6623, 4.2, ARRAY['Jornais', 'Revistas', 'Tabacaria'], 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800'),
        ('Banca do Centro', '01001-000', 'Praça da Sé, 100 - Sé, São Paulo - SP', -23.5505, -46.6333, 4.8, ARRAY['Jornais', 'Revistas', 'Bomboniere'], 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800');
    ELSE
        RAISE NOTICE 'Tabela bancas já tem % registros, mantendo dados existentes', produto_count;
    END IF;
END $$;

-- 3. Verificar dados DEPOIS
SELECT 'DEPOIS - Categorias:' as info, count(*) as total FROM categories
UNION ALL
SELECT 'DEPOIS - Bancas:' as info, count(*) as total FROM bancas
UNION ALL
SELECT 'DEPOIS - Produtos:' as info, count(*) as total FROM products
UNION ALL
SELECT 'DEPOIS - Pedidos:' as info, count(*) as total FROM orders;

-- 4. Mostrar resumo por banca (dados existentes + novos)
SELECT 
    b.name as banca,
    count(p.id) as produtos_total
FROM bancas b
LEFT JOIN products p ON b.id = p.banca_id
GROUP BY b.id, b.name
ORDER BY b.name;

-- 5. Verificar se há categorias sem produtos
SELECT 
    c.name as categoria,
    count(p.id) as produtos_nesta_categoria
FROM categories c
LEFT JOIN products p ON c.id = p.category_id
GROUP BY c.id, c.name
ORDER BY produtos_nesta_categoria DESC, c.name;
