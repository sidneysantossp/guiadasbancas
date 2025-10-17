-- SQL para importar produtos Brancaleone
-- Gerado em: 2025-10-17T18:20:53.612Z
-- Total de produtos: 3363
-- Fonte: brancaleone-products-1760723254011.json

-- 1. Criar distribuidor (se não existir)

INSERT INTO distribuidores (nome, application_token, company_token, ativo, created_at)
VALUES ('Brancaleone Publicações', 'brancaleone-catalog', 'brancaleone-pub', true, NOW())
ON CONFLICT (nome) DO NOTHING;

-- 2. Inserir produtos

-- Lote 1 de 68
-- Produtos: 1 até 100



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00001',
  'A ESPADA SELVAGEM DE CON N.22',
  'A ESPADA SELVAGEM DE CON N.22',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/9CAyaOWoE8YWhmGeqzykn_h3grg=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/d3cba7f8-119a-11ef-a951-1a13f4f3a32a.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00002',
  'O VERÃO EM QUE HIKARU MORREU - 05 [REB]',
  'O VERÃO EM QUE HIKARU MORREU - 05 [REB]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/j-mPkzQF866_yuKrdvlIZSNIfn8=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/988074da-eb29-11ef-9e36-2a856f41baa0.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00003',
  'SOLO LEVELING - 06 [REB]',
  'SOLO LEVELING - 06 [REB]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/Q3l1yClcyIjDn4uZSt-MzlF8W88=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/8cbf06f2-3692-11f0-9b5f-32c7a3eebbfc.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00004',
  '10 COISAS PARA FAZER ANTES DOS 40 - 01',
  '10 COISAS PARA FAZER ANTES DOS 40 - 01',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/S86wsJpNRrRIwrkr8xZ6A47j-FQ=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/3f15c0ec-e497-11ee-b6a7-e2b250ff01a0.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00005',
  '100 BALAS: IRMAO LONO -  EDICAO DE LUXO',
  '100 BALAS: IRMAO LONO -  EDICAO DE LUXO',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/9OcC1B4PHEKW_CRdhTQT0BCYuyo=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/45809a7e-d817-11ee-b3a2-6efcfa6dd7bd.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00006',
  '20TH CENTURY BOYS ED. DEFINITIVA - 04',
  '20TH CENTURY BOYS ED. DEFINITIVA - 04',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/9hMVPLXN75jqzNMhf2dcf9DaTxI=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/e6f10866-9031-11f0-9754-9a60b14b6cd5.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00007',
  '20TH CENTURY BOYS ED. DEFINITIVA - 2',
  '20TH CENTURY BOYS ED. DEFINITIVA - 2',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/Vhu57nWDwZRJwgzoEimjpU8iSik=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/958e0d96-1941-11f0-a707-ceedc1648097.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00008',
  '20TH CENTURY BOYS ED. DEFINITIVA - 3',
  '20TH CENTURY BOYS ED. DEFINITIVA - 3',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/8rBRuAE6joHg5dARp6FXTp8clAA=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/c49eb480-642a-11f0-855d-8e3a9156bfaa.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00009',
  '8 BILHOES DE GENIOS N.1',
  '8 BILHOES DE GENIOS N.1',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/o-DM2xSYNesBtDrA-UnJ3RGiOno=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/1f8b64a0-069a-11ef-92f0-cafd48a576cd.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00010',
  'A BELA CASA DE PRAIA VOL.01',
  'A BELA CASA DE PRAIA VOL.01',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/f5uccndBAcUFLurpNY2dosQSUsE=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/091dbbc2-98c6-11f0-b7db-860b112daa7f.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00011',
  'A BELA CASA DO LAGO N.2',
  'A BELA CASA DO LAGO N.2',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/npKxMHuADjaB0Ij6tP2j2w666-s=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/5d03434a-da9c-11ee-acb0-3226a44a89fc.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00012',
  'A BRIGADA DOS ENCAPOTADOS N.1',
  'A BRIGADA DOS ENCAPOTADOS N.1',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/Ux-Yb6-o-HkQH1zvwOCUZah5z-o=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/8e25e3b2-22d9-11ef-89ea-7a76248a948f.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00013',
  'A CANCAO DA FENIX: ECO',
  'A CANCAO DA FENIX: ECO',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/m6-0VIgL-jHRxCuaNMzFkfcIVbQ=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/915d2a48-d817-11ee-9371-e2a33adec5cd.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00014',
  'A CASA ESTRANHA - 02',
  'A CASA ESTRANHA - 02',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/wnQGOFmusTpzTQFv8mdMGWBq_DI=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/c581589e-642a-11f0-9174-0aba59c16e94.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00015',
  'A DEUSA DA VINGANÇA',
  'A DEUSA DA VINGANÇA',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/STZW2q7hhqYCOK8DJImw2Agg1j0=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/28c277a0-a4ac-11f0-a72e-eecb83d78201.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00016',
  'A ESPADA DE AZRAEL',
  'A ESPADA DE AZRAEL',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/jTpT0XFL6ff7CjrQXO2W7abUszw=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/de78b362-d81a-11ee-8b82-06e22cdb7792.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00017',
  'A ESPADA SELVAGEM DE CON N.10',
  'A ESPADA SELVAGEM DE CON N.10',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/_1ra98w-f2uRiLWo8FlZkLta2U4=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/2fe56c9a-a4ac-11f0-8bce-3af03c92463f.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00018',
  'A ESPADA SELVAGEM DE CON N.18',
  'A ESPADA SELVAGEM DE CON N.18',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/YzOOHim5dg5hJ3eFbeLK2xG9hvY=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/30120a52-a4ac-11f0-a72e-eecb83d78201.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00019',
  'A ESPADA SELVAGEM DE CON N.19',
  'A ESPADA SELVAGEM DE CON N.19',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/ggvDwziE02kNAJd2IeLIBrD6US8=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/302d68d8-a4ac-11f0-a599-8e83af06c4a6.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00020',
  'A ESPADA SELVAGEM DE CON N.2',
  'A ESPADA SELVAGEM DE CON N.2',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/Pt9RkGkSvLmZGNuRucd-soAxLXU=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/2fbaab18-a4ac-11f0-a72e-eecb83d78201.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00021',
  'A ESPADA SELVAGEM DE CON N.20',
  'A ESPADA SELVAGEM DE CON N.20',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/F2F_6EpEQ79UpJ5puqJOkv0-BIk=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/302f35fa-a4ac-11f0-84d7-06a1e9b2bf33.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00022',
  'A ESPADA SELVAGEM DE CON N.22',
  'A ESPADA SELVAGEM DE CON N.22',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/9CAyaOWoE8YWhmGeqzykn_h3grg=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/d3cba7f8-119a-11ef-a951-1a13f4f3a32a.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00023',
  'A ESPADA SELVAGEM DE CON N.24',
  'A ESPADA SELVAGEM DE CON N.24',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/0_sE55eq-d1ujmbcJH6sIygVeR4=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/30536524-a4ac-11f0-8bce-3af03c92463f.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00024',
  'A ESPADA SELVAGEM DE CON N.27',
  'A ESPADA SELVAGEM DE CON N.27',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/4Py8sm8OYjGr_nTdXGjzkKj-MoE=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/307ddf2a-a4ac-11f0-8bce-3af03c92463f.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00025',
  'A ESPADA SELVAGEM DE CON N.28',
  'A ESPADA SELVAGEM DE CON N.28',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/d47qxJI9OmA3AAkqaK-sBm4ICF4=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/d29e6ee6-63e4-11ef-8888-36fc18488cf6.png"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00026',
  'A ESPADA SELVAGEM DE CON N.29',
  'A ESPADA SELVAGEM DE CON N.29',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/CU--QB-C6Idq5Skc8DVQAjOTUDw=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/fa0e60a4-d81a-11ee-8b82-06e22cdb7792.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00027',
  'A ESPADA SELVAGEM DE CON N.30',
  'A ESPADA SELVAGEM DE CON N.30',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/hblKYZbli5Cd7IIiAP31rSs1o_I=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/fa759256-d81a-11ee-98f1-c6f956d4b586.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00028',
  'A ESPADA SELVAGEM DE CON N.31',
  'A ESPADA SELVAGEM DE CON N.31',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/2vyYGeCGAQU7MLtH5ddhseh-M-4=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/fa5917f2-d81a-11ee-8b82-06e22cdb7792.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00029',
  'A ESPADA SELVAGEM DE CON N.32',
  'A ESPADA SELVAGEM DE CON N.32',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/XeU5rQRDH5JiLI_oVJZCB8oNlW8=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/faf072e6-d81a-11ee-9df9-5a86bcbeb6e3.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00030',
  'A ESPADA SELVAGEM DE CON N.7',
  'A ESPADA SELVAGEM DE CON N.7',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/y1V6RymWjCHuiNFe-lX3BX4nyos=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/d0cfd590-f616-11ef-8bcd-4e33e7a5489c.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00031',
  'A ESPADA SELVAGEM DE CON N.8',
  'A ESPADA SELVAGEM DE CON N.8',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/rsp0plgoGyDbblm1FQ5CWSw_57I=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/f5908232-d81a-11ee-9df9-5a86bcbeb6e3.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00032',
  'A ESPADA SELVAGEM DE CONAN (2024) N.01',
  'A ESPADA SELVAGEM DE CONAN (2024) N.01',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/3BQK_Tabca0p7sj_eo30kr2EO1s=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/6e8088bc-eb26-11ef-b6db-ce85303a26c9.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00033',
  'A ESPADA SELVAGEM DE CONAN (2024) N.03',
  'A ESPADA SELVAGEM DE CONAN (2024) N.03',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/WR13cuB0-7y0Ze8ksNwWTnHplg0=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/c52e2976-642a-11f0-bfa0-6253877c6ac4.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00034',
  'A ESPADA SELVAGEM DE CONAN - A COLECAO  VOL.40',
  'A ESPADA SELVAGEM DE CONAN - A COLECAO  VOL.40',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/eLxvwqvtk8Ar1WZ5YgGctJq_Z84=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/fda3f530-d81a-11ee-98f1-c6f956d4b586.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00035',
  'A ESPADA SELVAGEM DE CONAN - A COLECAO N.34',
  'A ESPADA SELVAGEM DE CONAN - A COLECAO N.34',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/6CA1QXTvmH9hxse32hti8gn_bdY=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/fb8c8fd2-d81a-11ee-9df9-5a86bcbeb6e3.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00036',
  'A ESPADA SELVAGEM DE CONAN - A COLECAO N.35',
  'A ESPADA SELVAGEM DE CONAN - A COLECAO N.35',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/JJukj1Ke1aZiZEZ7xfHiOS-fnmg=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/fbc25036-d81a-11ee-98f1-c6f956d4b586.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00037',
  'A ESPADA SELVAGEM DE CONAN - A COLECAO N.36',
  'A ESPADA SELVAGEM DE CONAN - A COLECAO N.36',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/bmpHKMwmQLfyf3VB2HKeRl2ULvg=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/fc4d2e36-d81a-11ee-9df9-5a86bcbeb6e3.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00038',
  'A ESPADA SELVAGEM DE CONAN - A COLECAO N.42',
  'A ESPADA SELVAGEM DE CONAN - A COLECAO N.42',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/C36oKWUSAaju7qIaFEh72cXaAzk=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/fe4f24f0-d81a-11ee-98f1-c6f956d4b586.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00039',
  'A ESPADA SELVAGEM DE CONAN - A COLECAO VOL.05 (REB)',
  'A ESPADA SELVAGEM DE CONAN - A COLECAO VOL.05 (REB)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/xmE8gX4TpxU__8NwtL_YvLXgt_A=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/3d022156-0cc9-11ef-b164-e2e03e0af6ad.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00040',
  'A ESPADA SELVAGEM DE CONAN - A COLECAO VOL.11 (REB)',
  'A ESPADA SELVAGEM DE CONAN - A COLECAO VOL.11 (REB)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/guphC02oO3vkiC9UldYFhFyE60k=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/8bc6421a-7fa9-11ef-b0bc-6e97175de7f7.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00041',
  'A ESPADA SELVAGEM DE CONAN - A COLECAO VOL.37',
  'A ESPADA SELVAGEM DE CONAN - A COLECAO VOL.37',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/kCmrU2mOFWweFQJu4yHMHifg-6I=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/fc75b158-d81a-11ee-8f71-e2e54ed5f9f7.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00042',
  'A ESPADA SELVAGEM DE CONAN - A COLECAO VOL.38',
  'A ESPADA SELVAGEM DE CONAN - A COLECAO VOL.38',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/umfIFAsiSeF9kntrU8OV0iEzZYE=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/fd0511b8-d81a-11ee-98f1-c6f956d4b586.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00043',
  'A ESPADA SELVAGEM DE CONAN - A COLECAO VOL.39',
  'A ESPADA SELVAGEM DE CONAN - A COLECAO VOL.39',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/4U-_dW9BwDa88dajD3GdJ0nnoI0=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/fd3dc17a-d81a-11ee-8f71-e2e54ed5f9f7.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00044',
  'A ESPADA SELVAGEM DE CONAN - A COLECAO VOL.43',
  'A ESPADA SELVAGEM DE CONAN - A COLECAO VOL.43',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/Xl3zPJ7VDCsKIAWIvKxJCq8p0t8=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/fe72c0c2-d81a-11ee-9df9-5a86bcbeb6e3.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00045',
  'A ESPADA SELVAGEM DE CONAN - A COLECAO VOL.44',
  'A ESPADA SELVAGEM DE CONAN - A COLECAO VOL.44',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/1Io0nv9-oA5rEwlKoNBj3GHmI-U=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/ff0bc4b6-d81a-11ee-98f1-c6f956d4b586.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00046',
  'A ESPADA SELVAGEM DE CONAN - A COLECAO VOL.53',
  'A ESPADA SELVAGEM DE CONAN - A COLECAO VOL.53',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/WWibaRN2WC4ntWwbkPqn8DQe8iY=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/02081228-d81b-11ee-8b82-06e22cdb7792.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00047',
  'A ESPADA SELVAGEM DE CONAN - A COLECAO VOL.54',
  'A ESPADA SELVAGEM DE CONAN - A COLECAO VOL.54',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/BJiZyXJNdJr2LYdPcqUrhuxm5rg=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/02733a30-d81b-11ee-98f1-c6f956d4b586.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00048',
  'A ESPADA SELVAGEM DE CONAN - A COLECAO VOL.55',
  'A ESPADA SELVAGEM DE CONAN - A COLECAO VOL.55',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/dTCluhetEfYxIM0EknTjMZSJlkA=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/30a40006-a4ac-11f0-8bce-3af03c92463f.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00049',
  'A ESPADA SELVAGEM DE CONAN - A COLECAO VOL.58',
  'A ESPADA SELVAGEM DE CONAN - A COLECAO VOL.58',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/crliYH0mqKCD6kNfs75VXSKs27I=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/a41e3ecc-a7c0-11f0-8792-0ab376ee0ef4.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00050',
  'A ESSENCIA DO MEDO (MARVEL ESSENCIAIS)',
  'A ESSENCIA DO MEDO (MARVEL ESSENCIAIS)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/xfhQJE-t7nNlRYOTgLvJiN0zQgg=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/99347cda-d817-11ee-b124-5a86bcbeb6e3.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();