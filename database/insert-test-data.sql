-- Inserir dados de teste no Supabase
-- Execute este SQL no painel do Supabase → SQL Editor

-- Limpar dados existentes (opcional)
TRUNCATE TABLE products, orders, bancas, categories, branding RESTART IDENTITY CASCADE;

-- Inserir categorias de teste
INSERT INTO categories (name, image, link, active, "order") VALUES
('Revistas', '/images/categories/revistas.jpg', '/categoria/revistas', true, 1),
('Jornais', '/images/categories/jornais.jpg', '/categoria/jornais', true, 2),
('Livros', '/images/categories/livros.jpg', '/categoria/livros', true, 3),
('Quadrinhos', '/images/categories/quadrinhos.jpg', '/categoria/quadrinhos', true, 4),
('Doces', '/images/categories/doces.jpg', '/categoria/doces', true, 5);

-- Inserir bancas de teste
INSERT INTO bancas (name, cep, address, lat, lng, rating, categories, cover_image) VALUES
('Banca do João', '01310-100', 'Av. Paulista, 1000 - Bela Vista, São Paulo - SP', -23.5618, -46.6565, 4.5, ARRAY['Revistas', 'Jornais', 'Livros'], '/images/bancas/banca1.jpg'),
('Jornaleiro Central', '01310-200', 'Av. Paulista, 1500 - Bela Vista, São Paulo - SP', -23.5628, -46.6575, 4.2, ARRAY['Revistas', 'Jornais', 'Quadrinhos'], '/images/bancas/banca2.jpg'),
('Banca da Esquina', '04038-001', 'Rua Augusta, 500 - Consolação, São Paulo - SP', -23.5548, -46.6623, 4.8, ARRAY['Revistas', 'Jornais', 'Livros', 'Doces'], '/images/bancas/banca3.jpg');

-- Inserir produtos de teste (usando subconsultas para pegar os IDs)
DO $$
DECLARE
    cat_revistas_id UUID;
    cat_jornais_id UUID;
    cat_quadrinhos_id UUID;
    cat_doces_id UUID;
    banca1_id UUID;
    banca2_id UUID;
    banca3_id UUID;
BEGIN
    -- Buscar IDs das categorias
    SELECT id INTO cat_revistas_id FROM categories WHERE name = 'Revistas';
    SELECT id INTO cat_jornais_id FROM categories WHERE name = 'Jornais';
    SELECT id INTO cat_quadrinhos_id FROM categories WHERE name = 'Quadrinhos';
    SELECT id INTO cat_doces_id FROM categories WHERE name = 'Doces';
    
    -- Buscar IDs das bancas
    SELECT id INTO banca1_id FROM bancas WHERE name = 'Banca do João';
    SELECT id INTO banca2_id FROM bancas WHERE name = 'Jornaleiro Central';
    SELECT id INTO banca3_id FROM bancas WHERE name = 'Banca da Esquina';
    
    -- Inserir produtos
    INSERT INTO products (name, description, description_full, price, price_original, discount_percent, category_id, banca_id, images, gallery_images, specifications, rating_avg, reviews_count, stock_qty, track_stock, sob_encomenda, pre_venda, pronta_entrega) VALUES
    ('Revista Veja', 'Revista semanal de notícias', 'A revista Veja é uma publicação semanal brasileira de notícias, política, economia e cultura.', 12.90, 15.90, 19, cat_revistas_id, banca1_id, 
     ARRAY['/images/products/veja1.jpg'], 
     ARRAY['/images/products/veja1.jpg', '/images/products/veja2.jpg'], 
     '{"paginas": 120, "editora": "Abril", "periodicidade": "Semanal"}', 
     4.3, 25, 10, true, false, false, true),
    
    ('Folha de S.Paulo', 'Jornal diário de notícias', 'Principal jornal brasileiro com cobertura completa de notícias nacionais e internacionais.', 3.50, null, null, cat_jornais_id, banca1_id, 
     ARRAY['/images/products/folha1.jpg'], 
     ARRAY['/images/products/folha1.jpg'], 
     '{"paginas": 48, "editora": "Folha", "periodicidade": "Diário"}', 
     4.1, 15, 20, true, false, false, true),
    
    ('Turma da Mônica', 'Gibi da Turma da Mônica', 'Histórias em quadrinhos da Turma da Mônica com aventuras divertidas para toda a família.', 8.90, 9.90, 10, cat_quadrinhos_id, banca2_id, 
     ARRAY['/images/products/monica1.jpg'], 
     ARRAY['/images/products/monica1.jpg', '/images/products/monica2.jpg'], 
     '{"paginas": 32, "editora": "Panini", "faixa_etaria": "Livre"}', 
     4.7, 42, 15, true, false, false, true),
    
    ('Chocolate Bis', 'Chocolate Bis sortido', 'Delicioso chocolate Bis com diversos sabores para adoçar seu dia.', 4.50, null, null, cat_doces_id, banca3_id, 
     ARRAY['/images/products/bis1.jpg'], 
     ARRAY['/images/products/bis1.jpg'], 
     '{"peso": "126g", "marca": "Lacta", "sabores": ["Ao Leite", "Branco", "Oreo"]}', 
     4.6, 38, 25, true, false, false, true),
    
    ('O Globo', 'Jornal O Globo', 'Jornal carioca com ampla cobertura nacional e internacional.', 3.00, null, null, cat_jornais_id, banca2_id, 
     ARRAY['/images/products/globo1.jpg'], 
     ARRAY['/images/products/globo1.jpg'], 
     '{"paginas": 40, "editora": "Globo", "periodicidade": "Diário"}', 
     4.0, 12, 8, true, false, false, true)
    ;
END $$;

-- Inserir configurações de branding
INSERT INTO branding (logo_url, logo_alt, site_name, primary_color, secondary_color, favicon)
VALUES (null, 'Guia das Bancas', 'Guia das Bancas', '#ff5c00', '#ff7a33', '/favicon.svg');

-- Verificar dados inseridos
SELECT 'Categorias inseridas:' as info, count(*) as total FROM categories;
SELECT 'Bancas inseridas:' as info, count(*) as total FROM bancas;
SELECT 'Produtos inseridos:' as info, count(*) as total FROM products;
SELECT 'Branding configurado:' as info, count(*) as total FROM branding;
