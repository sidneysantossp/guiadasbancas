-- Script para popular tabelas vazias no Supabase
-- Execute no SQL Editor do Supabase

-- 1. Verificar dados existentes
SELECT 'Categorias:' as tabela, count(*) as total FROM categories
UNION ALL
SELECT 'Bancas:' as tabela, count(*) as total FROM bancas
UNION ALL
SELECT 'Produtos:' as tabela, count(*) as total FROM products
UNION ALL
SELECT 'Pedidos:' as tabela, count(*) as total FROM orders;

-- 2. Inserir bancas de teste (mantendo categorias existentes)
INSERT INTO bancas (name, cep, address, lat, lng, rating, categories, cover_image) VALUES
('Banca Central Paulista', '01310-100', 'Av. Paulista, 1000 - Bela Vista, São Paulo - SP', -23.5618, -46.6565, 4.5, ARRAY['Revistas', 'Jornais', 'Papelaria'], 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800'),
('Jornaleiro da Vila', '04038-001', 'Rua Augusta, 500 - Consolação, São Paulo - SP', -23.5548, -46.6623, 4.2, ARRAY['Jornais', 'Revistas', 'Tabacaria'], 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800'),
('Banca do Centro', '01001-000', 'Praça da Sé, 100 - Sé, São Paulo - SP', -23.5505, -46.6333, 4.8, ARRAY['Jornais', 'Revistas', 'Bomboniere'], 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800'),
('Newsstand Express', '22070-900', 'Av. Copacabana, 500 - Copacabana, Rio de Janeiro - RJ', -22.9711, -43.1822, 4.3, ARRAY['Revistas', 'Bebidas', 'Eletrônicos'], 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800'),
('Banca Universitária', '05508-000', 'Av. Prof. Luciano Gualberto, 315 - Cidade Universitária, São Paulo - SP', -23.5582, -46.7319, 4.6, ARRAY['Livros', 'Revistas', 'Papelaria'], 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800');

-- 3. Inserir produtos de teste para cada banca
DO $$
DECLARE
    banca_record RECORD;
    cat_record RECORD;
BEGIN
    -- Para cada banca, inserir alguns produtos
    FOR banca_record IN SELECT id, name FROM bancas LOOP
        -- Inserir produtos básicos
        
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
END $$;

-- 4. Verificar dados inseridos
SELECT 'Bancas inseridas:' as info, count(*) as total FROM bancas;
SELECT 'Produtos inseridos:' as info, count(*) as total FROM products;

-- 5. Mostrar resumo por banca
SELECT 
    b.name as banca,
    count(p.id) as produtos
FROM bancas b
LEFT JOIN products p ON b.id = p.banca_id
GROUP BY b.id, b.name
ORDER BY b.name;
