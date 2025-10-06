-- ============================================
-- DELETAR PRODUTOS INCORRETOS E INSERIR OS CORRETOS
-- ============================================

-- PASSO 1: Deletar os 13 produtos incorretos (com codigo_mercos atual)
DELETE FROM products WHERE codigo_mercos IS NOT NULL;

-- PASSO 2: Inserir os 13 produtos CORRETOS do print da Mercos
INSERT INTO products (name, description, price, category_id, images, stock_qty, codigo_mercos) VALUES
('10 COISAS PARA FAZER ANTES DOS 40 - 01', 'Mangá - Volume 01', 40.90, 'aaaaaaaa-0000-0000-0000-000000000001', '{}', 1327, 'AKOTO001'),
('100 BALAS: IRMAO LONO - EDICAO DE LUXO', 'HQ - Edição de Luxo', 90.90, 'aaaaaaaa-0000-0000-0000-000000000001', '{}', 492, 'ADBEM001'),
('20TH CENTURY BOYS ED. DEFINITIVA - 04', 'Mangá - Volume 04', 74.90, 'aaaaaaaa-0000-0000-0000-000000000001', '{}', 724, 'ACBKA004'),
('20TH CENTURY BOYS ED. DEFINITIVA - 2', 'Mangá - Volume 02', 69.90, 'aaaaaaaa-0000-0000-0000-000000000001', '{}', 165, 'ACBKA002'),
('20TH CENTURY BOYS ED. DEFINITIVA - 3', 'Mangá - Volume 03', 74.90, 'aaaaaaaa-0000-0000-0000-000000000001', '{}', 504, 'ACBKA003'),
('8 BILHOES DE GENIOS N.1', 'HQ - Número 1', 129.90, 'aaaaaaaa-0000-0000-0000-000000000001', '{}', 423, 'AOITO001'),
('A BELA CASA DE PRAIA VOL.01', 'HQ - Volume 01', 108.90, 'aaaaaaaa-0000-0000-0000-000000000001', '{}', 603, 'ABELC001'),
('A BELA CASA DO LAGO N.2', 'HQ - Número 2', 89.90, 'aaaaaaaa-0000-0000-0000-000000000001', '{}', 141, 'ABELA002'),
('A BRIGADA DOS ENCAPOTADOS N.1', 'HQ - Número 1', 144.90, 'aaaaaaaa-0000-0000-0000-000000000001', '{}', 829, 'ABRIG001'),
('A CANCAO DA FENIX: ECO', 'HQ - Eco', 34.90, 'aaaaaaaa-0000-0000-0000-000000000001', '{}', 292, 'AECOF001'),
('A CASA ESTRANHA - 02', 'HQ - Volume 02', 44.90, 'aaaaaaaa-0000-0000-0000-000000000001', '{}', 734, 'AHNIE002'),
('A ESPADA DE AZRAEL', 'HQ', 54.90, 'aaaaaaaa-0000-0000-0000-000000000001', '{}', 571, 'AZRAE001'),
('A ESPADA SELVAGENS DE CON N.12', 'HQ - Número 12', 54.90, 'aaaaaaaa-0000-0000-0000-000000000001', '{}', 87, 'HBRCO012');

-- PASSO 3: Verificar
SELECT 
  name, 
  codigo_mercos, 
  price, 
  stock_qty 
FROM products 
WHERE codigo_mercos IS NOT NULL 
ORDER BY name;

-- Deve retornar exatamente 13 produtos com os nomes e códigos corretos
