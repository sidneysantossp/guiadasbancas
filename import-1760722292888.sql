-- SQL para importar produtos Brancaleone
-- Gerado em: 2025-10-17T17:31:32.880Z
-- Total de produtos: 243
-- Fonte: brancaleone-products-1760721795284.json

-- 1. Criar distribuidor (se não existir)
INSERT INTO distribuidores (name, active, created_at)
VALUES ('Brancaleone Publicações', true, NOW())
ON CONFLICT (name) DO NOTHING;

-- 2. Inserir produtos

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
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
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
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
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
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
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
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
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
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
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
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
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
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
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
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
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
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
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
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
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
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
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
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
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
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
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
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
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
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
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
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
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
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
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
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
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
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
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
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
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
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
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
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
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
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
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
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
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
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
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
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
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
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
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
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
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
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
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
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
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
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
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
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
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
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
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
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
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
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
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
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
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
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
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
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
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
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
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
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
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
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
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
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
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
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
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
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
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
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
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
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
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
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
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
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
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
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
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
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
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
  'PROD-00051',
  'A GANCHO N.2',
  'A GANCHO N.2',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/zVZPP92SAs6N2Te0caOhIB1fry0=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/1a2bec7c-3350-11ef-8e13-6206394e6409.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
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
  'PROD-00052',
  'A GANCHO VOL. 01',
  'A GANCHO VOL. 01',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/-3ct2rybCtfFsL09kNWy8_Mlg_Q=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/62916968-da9c-11ee-b415-da2490dbf0ff.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
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
  'PROD-00053',
  'A ILHA DO TERROR (BD DISNEY)',
  'A ILHA DO TERROR (BD DISNEY)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/xYnFOlwRvHNQDNNab75ijcejzck=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/03beeea0-1ca6-11ef-b80c-228c440649c1.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
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
  'PROD-00054',
  'A INCONTROLAVEL PATRULHA DO DESTINO',
  'A INCONTROLAVEL PATRULHA DO DESTINO',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/6SehYK0pJRuinQVQN5izczbXqoA=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/8ef1f43e-3692-11f0-a9ef-e679d989cbbb.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
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
  'PROD-00055',
  'A JORNADA DO SUPER-HEROI',
  'A JORNADA DO SUPER-HEROI',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/f-hGo6lb7FjbMw1pZXkzs_ZMXCM=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/6eec8b2a-eb26-11ef-888a-2a856f41baa0.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
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
  'PROD-00056',
  'A JOVEM DIANA VOL.02',
  'A JOVEM DIANA VOL.02',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/c5LwHirUGmCyjCjziSVDFcOo1z8=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/6ebb0b2c-eb26-11ef-a139-0af602f41cb0.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
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
  'PROD-00057',
  'A JOVEM DIANA VOL.1',
  'A JOVEM DIANA VOL.1',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/nsEA0wut6FYiad3OxD1HJL99ZQ8=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/7cc4462a-4e7d-11ef-8b01-66fb588c5617.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
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
  'PROD-00058',
  'A JUVENTUDE DE MICKEY (BD DISNEY)',
  'A JUVENTUDE DE MICKEY (BD DISNEY)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/Rk-z7ZeUMAK9HJYwKqu7O4VFdlg=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/40f8c176-7fd1-11f0-a5af-de5e70a27ff7.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
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
  'PROD-00059',
  'A LANÇA LENDARIA E O ESCUDO IMPENETRAVEL - 1',
  'A LANÇA LENDARIA E O ESCUDO IMPENETRAVEL - 1',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/OcJg7OAztUfQf5j88iJLvIunGgY=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/c51c23d0-63e4-11ef-9cd1-4e5286e17d7d.png"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
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
  'PROD-00060',
  'A LANÇA LENDARIA E O ESCUDO IMPENETRAVEL - 2',
  'A LANÇA LENDARIA E O ESCUDO IMPENETRAVEL - 2',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/LmD0IacHfTXeVmkHY5gncuk1eac=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/6e7beab4-eb26-11ef-b309-de9e9a61a672.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
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
  'PROD-00061',
  'A LANÇA LENDARIA E O ESCUDO IMPENETRAVEL - 3',
  'A LANÇA LENDARIA E O ESCUDO IMPENETRAVEL - 3',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/NmShqIJNj8cdrxuu6zsWNmw6fmA=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/ae6fca5e-ee29-11ef-97c0-4eddcfde9ad5.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
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
  'PROD-00062',
  'A LANÇA LENDARIA E O ESCUDO IMPENETRAVEL - 4',
  'A LANÇA LENDARIA E O ESCUDO IMPENETRAVEL - 4',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/ep8YqTR-ZHKCZGHTt7LrkqVy_-g=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/8e93d7fa-3692-11f0-b6e7-d6897a03fa64.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
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
  'PROD-00063',
  'A LENDA DE LADY BYEOKSA',
  'A LENDA DE LADY BYEOKSA',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/-_GqgAiqK1K1-KndCWo6QtSczj0=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/6105eece-5ea9-11f0-a034-4eae30e658d1.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
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
  'PROD-00064',
  'A MISTERIOSA LOJA DE PENHORES',
  'A MISTERIOSA LOJA DE PENHORES',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/_mYkBamLzU07lF3nFbxSpPnc7D4=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/6161c906-5ea9-11f0-be82-febfa26cb361.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
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
  'PROD-00065',
  'A ODISSEIA (GRAPHICS DISNEY) N.1',
  'A ODISSEIA (GRAPHICS DISNEY) N.1',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/eof3ehbdUt-DGTCGNULUHkbb6I8=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/c644070a-63e4-11ef-858c-be57bbf68619.png"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
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
  'PROD-00066',
  'A ORDEM MAGICA VOL.03',
  'A ORDEM MAGICA VOL.03',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/2Ewtn9emoAEDdPnGO4nSklCK4M4=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/72dd097c-da7d-11ee-87ab-b67307b9a4e9.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
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
  'PROD-00067',
  'A PEQUENA LOJA DE CONVENIÊNCIAS  DA GALÁXIA',
  'A PEQUENA LOJA DE CONVENIÊNCIAS  DA GALÁXIA',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/R27SAp1EqNpzVmwnK3A3Zr36YEM=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/605c91da-5ea9-11f0-a034-4eae30e658d1.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
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
  'PROD-00068',
  'A QUEDA DE X ESPECIAL N. 01',
  'A QUEDA DE X ESPECIAL N. 01',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/EHApev9uLMD8ZoQfrYvMUEWeNQg=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/8d17504e-4e7d-11ef-8179-b2d60c13b884.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
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
  'PROD-00069',
  'A QUEDA DE X N.2',
  'A QUEDA DE X N.2',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/gyayVagUWDcPevqrjCaNMuUpscA=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/8878a95e-7fa9-11ef-b0bc-6e97175de7f7.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
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
  'PROD-00070',
  'A QUEDA DE X VOL. N.3',
  'A QUEDA DE X VOL. N.3',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/qdAkfpDV6XXCrPwxabKjItrM4dk=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/8884cdc4-7fa9-11ef-b1d0-12caec0ea15c.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
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
  'PROD-00071',
  'A SAGA DA LIGA DA JUSTICA VOL.01/24',
  'A SAGA DA LIGA DA JUSTICA VOL.01/24',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/kCewCplqF36HVyxg-C7xM7F7NGk=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/5b14ffac-2473-11f0-b868-ae6ee18ee784.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
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
  'PROD-00072',
  'A SAGA DA LIGA DA JUSTICA VOL.02/25',
  'A SAGA DA LIGA DA JUSTICA VOL.02/25',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/PwKctmfehBVyA3KNeeytlGPRXtw=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/1f639fdc-69af-11f0-ae5d-0ebdcf797c5e.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
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
  'PROD-00073',
  'A SAGA DA LIGA DA JUSTICA VOL.03/26',
  'A SAGA DA LIGA DA JUSTICA VOL.03/26',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/kyDTziZyoH0gtCDwZaW7vOhC7_s=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/50b2d9a0-8b5f-11f0-b3d9-165df9e621a1.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
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
  'PROD-00074',
  'A SAGA DA LIGA DA JUSTICA VOL.05/21',
  'A SAGA DA LIGA DA JUSTICA VOL.05/21',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/iJ3s1ZbAnWafdaNIhH9U4aUk4rk=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/6f993b68-eb26-11ef-95f7-fa812316df6c.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
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
  'PROD-00075',
  'A SAGA DA LIGA DA JUSTICA VOL.06/22',
  'A SAGA DA LIGA DA JUSTICA VOL.06/22',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/dDzp3seJk_gxSx5XI_N66eP4f7k=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/6f9f01ba-eb26-11ef-bb6e-e278ee2205e8.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
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
  'PROD-00076',
  'A SAGA DA LIGA DA JUSTICA VOL.07/23',
  'A SAGA DA LIGA DA JUSTICA VOL.07/23',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/FeqUF85A60IyTDeoAd4QRylzaDo=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/ff559570-feb9-11ef-b6c6-4a91a624d386.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
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
  'PROD-00077',
  'A SAGA DA LIGA DA JUSTICA VOL.17',
  'A SAGA DA LIGA DA JUSTICA VOL.17',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/hAM9TQNYsvHNvuORyxN-TyNXJYU=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/49f4be78-e497-11ee-83ff-7ee42cfe9644.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
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
  'PROD-00078',
  'A SAGA DA LIGA DA JUSTICA VOL.18',
  'A SAGA DA LIGA DA JUSTICA VOL.18',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/4szTrQBIBN-qyvkBayxS3qeLg9Y=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/03d5d58e-1ca6-11ef-b80c-228c440649c1.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
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
  'PROD-00079',
  'A SAGA DA LIGA DA JUSTICA VOL.19',
  'A SAGA DA LIGA DA JUSTICA VOL.19',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/jaAsAjOFSAv9l3PHx40KdSk9q-0=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/1a563360-3350-11ef-8e13-6206394e6409.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
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
  'PROD-00080',
  'A SAGA DA LIGA DA JUSTICA VOL.20',
  'A SAGA DA LIGA DA JUSTICA VOL.20',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/lJybLjLlunH0lTr_fTiA32U8ar8=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/896bad2a-7fa9-11ef-b1d0-12caec0ea15c.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
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
  'PROD-00081',
  'A SAGA DA MULHER-MARAVILHA N.3',
  'A SAGA DA MULHER-MARAVILHA N.3',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/a0uNEWPAyplVOjZYt1p7xnXlC2k=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/cfceeaec-63e4-11ef-8233-ba818e5f55ac.png"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
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
  'PROD-00082',
  'A SAGA DA MULHER-MARAVILHA VOL.04',
  'A SAGA DA MULHER-MARAVILHA VOL.04',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/3ysgkwbqxy4wwSZh7bdbvwsgwDo=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/6fd3d89a-eb26-11ef-8bd0-0ee70347c223.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
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
  'PROD-00083',
  'A SAGA DA MULHER-MARAVILHA VOL.05',
  'A SAGA DA MULHER-MARAVILHA VOL.05',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/FASqJ5MKFIQ-SzJt0jJAw9dvLbo=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/6fe8860a-eb26-11ef-b309-de9e9a61a672.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
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
  'PROD-00084',
  'A SAGA DA MULHER-MARAVILHA VOL.08/01',
  'A SAGA DA MULHER-MARAVILHA VOL.08/01',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/XcyJS47Ec6YI43YH0Qu7Kz1CRWY=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/433519d0-7fd1-11f0-a5af-de5e70a27ff7.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
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
  'PROD-00085',
  'A SAGA DO BATMAN N.38',
  'A SAGA DO BATMAN N.38',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/P-Ioni2I79lZnr3ACWjPbAMGHQ0=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/04063d64-1ca6-11ef-bc32-def7b1441874.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
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
  'PROD-00086',
  'A SAGA DO BATMAN N.41',
  'A SAGA DO BATMAN N.41',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/m4WEdaL4n6jpOAqBZ7y04tl3rZ0=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/6f1ee11a-eb26-11ef-b1a7-bea26c591a3a.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
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
  'PROD-00087',
  'A SAGA DO BATMAN VOL. 06/42',
  'A SAGA DO BATMAN VOL. 06/42',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/MAr6-oiP55xBndXssXlXViS3r7w=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/88d096fa-7fa9-11ef-b0bc-6e97175de7f7.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
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
  'PROD-00088',
  'A SAGA DO BATMAN VOL. 08/44',
  'A SAGA DO BATMAN VOL. 08/44',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/82jrI-V_PfJrJdT3M8hQYVZVaj8=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/6f55d3d2-eb26-11ef-888a-2a856f41baa0.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
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
  'PROD-00089',
  'A SAGA DO BATMAN VOL. 09/45',
  'A SAGA DO BATMAN VOL. 09/45',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/c_e1cwrHyHAkdrV_quDJoS0QPyY=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/6f76da0a-eb26-11ef-b1a7-bea26c591a3a.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
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
  'PROD-00090',
  'A SAGA DO BATMAN VOL. 10/46',
  'A SAGA DO BATMAN VOL. 10/46',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/Qx6eR5crtcSoiYqnXJmThZd-xYk=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/ce87e770-eb47-11ef-80c6-0ee70347c223.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
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
  'PROD-00091',
  'A SAGA DO BATMAN VOL. 11/47',
  'A SAGA DO BATMAN VOL. 11/47',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/5ThVX4andMsaC_omnGHPKs_0I-E=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/b1db78b4-ee29-11ef-9624-227a9b128a4e.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
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
  'PROD-00092',
  'A SAGA DO BATMAN VOL. 12/48',
  'A SAGA DO BATMAN VOL. 12/48',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/tC8tMoubMWHtWpSuBKFvjkYwdZk=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/d08faea0-0ea0-11f0-9ccc-5a780ec1dfef.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
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
  'PROD-00093',
  'A SAGA DO BATMAN VOL. 14/50',
  'A SAGA DO BATMAN VOL. 14/50',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/PS3AmV7_3YN0lKoHBhtjrOR7bVY=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/f443605e-9031-11f0-82c8-4a06203c34dc.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
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
  'PROD-00094',
  'A SAGA DO BATMAN VOL. 15/51',
  'A SAGA DO BATMAN VOL. 15/51',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/BJjvQCTJ9Nj8_83jAiuk_DG3vsM=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/f4838db4-9031-11f0-82c8-4a06203c34dc.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
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
  'PROD-00095',
  'A SAGA DO BATMAN VOL. 16/52',
  'A SAGA DO BATMAN VOL. 16/52',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/3fWDTe1_7xGhhStR2_kJKyfgYnI=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/42d88a62-7fd1-11f0-b894-2e1dcafaddd0.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
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
  'PROD-00096',
  'A SAGA DO BATMAN VOL. 17/53',
  'A SAGA DO BATMAN VOL. 17/53',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/EKEMzsFe72bFDSPts709shO1cDg=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/f49f7da8-9031-11f0-82c8-4a06203c34dc.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
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
  'PROD-00097',
  'A SAGA DO BATMAN VOL. 18/54',
  'A SAGA DO BATMAN VOL. 18/54',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/Jky0ElsBopmp0AQ6vnxk5Y2QkMQ=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/a22f4458-a7c0-11f0-96ab-2e54fc51120d.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
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
  'PROD-00098',
  'A SAGA DO FLASH VOL.09',
  'A SAGA DO FLASH VOL.09',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/KijuepZl-zf0tlXKX-B_ngDTc8E=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/88f39128-7fa9-11ef-b1d0-12caec0ea15c.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
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
  'PROD-00099',
  'A SAGA DO FLASH VOL.10',
  'A SAGA DO FLASH VOL.10',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/vv2vDoVeJhE3FVZ5LKaxsNbP5XY=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/b2f595b8-ee29-11ef-9ffd-5ecca552aa97.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
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
  'PROD-00100',
  'A SAGA DO FLASH VOL.11',
  'A SAGA DO FLASH VOL.11',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/35t-UJ9LcIfKdZjDGtb5uQ5-9_c=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/b2fd70e4-ee29-11ef-b823-265cac193354.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
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
  'PROD-00101',
  'A SAGA DO FLASH VOL.12',
  'A SAGA DO FLASH VOL.12',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/tiNHOdk9rB6iMJikvFdyFeoprQg=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/ff18f8a4-feb9-11ef-89d0-3a3131782535.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
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
  'PROD-00102',
  'A SAGA DO FLASH VOL.13',
  'A SAGA DO FLASH VOL.13',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/u-dT-QIjsftuGfJVfrnFX8zUO5Q=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/f4b5298c-9031-11f0-9754-9a60b14b6cd5.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
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
  'PROD-00103',
  'A SAGA DO FLASH VOL.14',
  'A SAGA DO FLASH VOL.14',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/Z0Rg2ez5bIYlbzhCnyC12fgZImY=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/f4d2d2ca-9031-11f0-82c8-4a06203c34dc.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
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
  'PROD-00104',
  'A SAGA DO HOMEM-ARANHA N.14',
  'A SAGA DO HOMEM-ARANHA N.14',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/egHx1UGNwRtGyq4Wg-oMs6bL7yQ=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/ffaee0fe-1ca5-11ef-b80c-228c440649c1.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
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
  'PROD-00105',
  'A SAGA DO HOMEM-ARANHA VOL.17',
  'A SAGA DO HOMEM-ARANHA VOL.17',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/NHLJg6NCoPTwgv19Gltkz_Kx6vs=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/89b4cb22-7fa9-11ef-b0bc-6e97175de7f7.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
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
  'PROD-00106',
  'A SAGA DO HOMEM-ARANHA VOL.18',
  'A SAGA DO HOMEM-ARANHA VOL.18',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/Qm4YE8O8rGwM-yTGozJQltDazzE=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/ab373fd2-eb29-11ef-b1d3-def782e2bf12.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
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
  'PROD-00107',
  'A SAGA DO HOMEM-ARANHA VOL.20',
  'A SAGA DO HOMEM-ARANHA VOL.20',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/EBIpHby_dTL6x0Ek46jxspoKHTM=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/cffacba4-eb47-11ef-b2e7-02f306ed4817.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
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
  'PROD-00108',
  'A SAGA DO HOMEM-ARANHA VOL.23',
  'A SAGA DO HOMEM-ARANHA VOL.23',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/__aa2mkjUTRqDBwQGSN9-wl8vx8=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/f9778582-9031-11f0-9754-9a60b14b6cd5.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
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
  'PROD-00109',
  'A SAGA DO HOMEM-ARANHA VOL.24',
  'A SAGA DO HOMEM-ARANHA VOL.24',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/SO0M6NOrF2jEkdpiOO0P-jNq-zA=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/eeb975e2-0143-11f0-9a82-ca3c9ea74dec.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
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
  'PROD-00110',
  'A SAGA DO HOMEM-ARANHA VOL.28/04',
  'A SAGA DO HOMEM-ARANHA VOL.28/04',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/lEqQxqXyGGRIBWREvgQ-DEX_qZs=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/674045c8-5ea9-11f0-bc5c-8a0b5d172c0d.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
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
  'PROD-00111',
  'A SAGA DO HOMEM-ARANHA VOL.29/05',
  'A SAGA DO HOMEM-ARANHA VOL.29/05',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/92kv0x66eliVc0zLmFNN-R2RQ6c=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/51cc2f62-8b5f-11f0-819b-cef4535c59b2.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
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
  'PROD-00112',
  'A SAGA DO HOMEM-ARANHA VOL.30/06',
  'A SAGA DO HOMEM-ARANHA VOL.30/06',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/gGUDO--giW_mlcKOpgxh3tLTE20=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/2a25c02a-a4ac-11f0-84d7-06a1e9b2bf33.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
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
  'PROD-00113',
  'A SAGA DO HULK VOL.01',
  'A SAGA DO HULK VOL.01',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/I9MB7hTLQz2qMahwXF_8feE18VI=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/d0416226-eb47-11ef-82bf-7a9c5276656c.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
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
  'PROD-00114',
  'A SAGA DO HULK VOL.03',
  'A SAGA DO HULK VOL.03',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/dRDVn3o33RCeJouv_IcZLcKXjTM=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/8bf9eda4-3692-11f0-a057-ba7311aaaadc.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
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
  'PROD-00115',
  'A SAGA DO HULK VOL.04',
  'A SAGA DO HULK VOL.04',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/9Sx_7THIcEv3GPTAqy78Lwa1O6M=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/c7af09ea-642a-11f0-8267-3613efe5cfce.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
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
  'PROD-00116',
  'A SAGA DO HULK VOL.05',
  'A SAGA DO HULK VOL.05',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/eDtr3j29dy2RqlCVaGQI4cozCPI=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/5210fd04-8b5f-11f0-b3d9-165df9e621a1.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
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
  'PROD-00117',
  'A SAGA DO LANTERNA VERDE VOL. 04',
  'A SAGA DO LANTERNA VERDE VOL. 04',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/Jftn8m-EI1RNDmZ9jP4XYgcBP9I=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/431d3a5e-7fd1-11f0-b894-2e1dcafaddd0.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
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
  'PROD-00118',
  'A SAGA DO SUPERMAN VOL.05/29',
  'A SAGA DO SUPERMAN VOL.05/29',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/_T-c4Uzk4pfGIGhGixg7yArRnPg=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/b3579a10-ee29-11ef-a605-7aa50978e4c8.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
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
  'PROD-00119',
  'A SAGA DO SUPERMAN VOL.08/32',
  'A SAGA DO SUPERMAN VOL.08/32',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/gLWJ7Vl2vqWHSH9ZLbOBrZBU878=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/f60793ba-9031-11f0-82c8-4a06203c34dc.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
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
  'PROD-00120',
  'A SAGA DO SUPERMAN VOL.10/34',
  'A SAGA DO SUPERMAN VOL.10/34',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/8P8fZvMkFU5PuhDMGGHG2-D95cc=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/f645b29e-9031-11f0-82c8-4a06203c34dc.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
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
  'PROD-00121',
  'A SAGA DO SUPERMAN VOL.11/35',
  'A SAGA DO SUPERMAN VOL.11/35',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/9iSy9lp9ewiV1YICvCz8Hz57xEI=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/f6de6e4e-9031-11f0-9754-9a60b14b6cd5.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
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
  'PROD-00122',
  'A SAGA DO WOLVERINE VOL.01 [REB]',
  'A SAGA DO WOLVERINE VOL.01 [REB]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/PszfUVMxKdmjPlEWPYoXwCaB-Yo=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/2d6039d0-44b4-11f0-aadf-ca2b21e04af3.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
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
  'PROD-00123',
  'A SAGA DO WOLVERINE VOL.02',
  'A SAGA DO WOLVERINE VOL.02',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/tOfkI586kQAP6oJ4lhCTB7Nn4dA=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/8d76f01c-4e7d-11ef-9629-4a1bf48aa6ac.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
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
  'PROD-00124',
  'A SAGA DO WOLVERINE VOL.05',
  'A SAGA DO WOLVERINE VOL.05',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/VrWpsJUNIiHaUcPF1doFR3DMvY4=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/f6f6d768-9031-11f0-9754-9a60b14b6cd5.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
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
  'PROD-00125',
  'A SAGA DO WOLVERINE VOL.06',
  'A SAGA DO WOLVERINE VOL.06',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/6Y__S438lMFn9brRET7DmsIcM6E=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/1538c358-2791-11f0-b7ea-e6389b69ff03.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
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
  'PROD-00126',
  'A SAGA DO WOLVERINE VOL.07',
  'A SAGA DO WOLVERINE VOL.07',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/H229KncsDfRahB3mlPfo6DLY-Xk=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/43a15208-7fd1-11f0-b894-2e1dcafaddd0.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
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
  'PROD-00127',
  'A SAGA DOS NOVOS TITAS V N.3',
  'A SAGA DOS NOVOS TITAS V N.3',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/9QHsIHngTFcm8IOoH3GuGj7DdTY=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/249167be-d81a-11ee-9cda-5a86bcbeb6e3.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
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
  'PROD-00128',
  'A SAGA DOS NOVOS TITAS VOL.04',
  'A SAGA DOS NOVOS TITAS VOL.04',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/TV66ik4vZ89gMhaHlraY-Z2tm64=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/2593ed62-d81a-11ee-a8da-56e6c271e0a3.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
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
  'PROD-00129',
  'A SAGA DOS NOVOS TITAS VOL.08',
  'A SAGA DOS NOVOS TITAS VOL.08',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/FZn9OxrR0ki3Glm3R3ZArn6xnOs=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/a9fa7d5a-eb29-11ef-a31a-8ed8743505f0.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
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
  'PROD-00130',
  'A SAGA DOS NOVOS TITAS VOL.10',
  'A SAGA DOS NOVOS TITAS VOL.10',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/Tiqpx9_3oR_QpEDrGNrmw6HhM6E=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/cedb38b2-eb47-11ef-80c6-0ee70347c223.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
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
  'PROD-00131',
  'A SAGA DOS NOVOS TITAS VOL.5',
  'A SAGA DOS NOVOS TITAS VOL.5',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/BQj7UNGCCpQ61fo_NuPsEJEloT4=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/a038768e-e583-11ee-b66f-62eaabe3d6ba.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
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
  'PROD-00132',
  'A SAGA DOS VINGADORES VOL.08',
  'A SAGA DOS VINGADORES VOL.08',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/6G73CHqEcQ0GQvdP3PbRu2wpioE=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/b3aa011a-ee29-11ef-a605-7aa50978e4c8.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
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
  'PROD-00133',
  'A SAGA DOS X-MEN VOL.26',
  'A SAGA DOS X-MEN VOL.26',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/izRMyAI0_76A2eFNPaGuxiitvpU=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/898f5d6a-7fa9-11ef-b0bc-6e97175de7f7.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
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
  'PROD-00134',
  'A SAGA DOS X-MEN VOL.30',
  'A SAGA DOS X-MEN VOL.30',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/yZmmE3_mcM-LiP8PyLwJtRU7zz0=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/aa65b2dc-eb29-11ef-a31a-8ed8743505f0.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
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
  'PROD-00135',
  'A SAGA DOS X-MEN VOL.31',
  'A SAGA DOS X-MEN VOL.31',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/gdJSvHk0KjPtCJrUKRR5GPbECi4=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/cf93175c-eb47-11ef-80c6-0ee70347c223.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
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
  'PROD-00136',
  'A SAGA DOS X-MEN VOL.32',
  'A SAGA DOS X-MEN VOL.32',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/ErANd5_h-KMmkFTmECk9b8DgrP4=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/cfafccb2-eb47-11ef-82bf-7a9c5276656c.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
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
  'PROD-00137',
  'A SAGA DOS X-MEN VOL.38/02',
  'A SAGA DOS X-MEN VOL.38/02',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/erYRsO6bgiGGBKa2QoMaZ6KsFjQ=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/50fa3da4-8b5f-11f0-b3d9-165df9e621a1.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
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
  'PROD-00138',
  'A SAGA DOS X-MEN VOL.39/03',
  'A SAGA DOS X-MEN VOL.39/03',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/sIQ3F8Osv009aV7chchjVaIfmrA=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/931870e2-9d49-11f0-916d-cee03b37ee33.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
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
  'PROD-00139',
  'A SENSACIONAL MULHER-HULK (2025) )VOL.01',
  'A SENSACIONAL MULHER-HULK (2025) )VOL.01',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/R5sY8Cg0e8Rccd-IBj3Z6A82654=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/5c2f124a-5ea9-11f0-bc5c-8a0b5d172c0d.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
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
  'PROD-00140',
  'A SUBSTITUTA',
  'A SUBSTITUTA',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/86XXUivRag-NTcKcDTbr8JrICqY=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/61c293f8-5ea9-11f0-a034-4eae30e658d1.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
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
  'PROD-00141',
  'A VIDA DO WOLVERINE',
  'A VIDA DO WOLVERINE',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/nGrFCRLw6Ikx-S8O_iZdquQxBoQ=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/d09e9036-eb47-11ef-82bf-7a9c5276656c.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
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
  'PROD-00142',
  'A VINGANÇA DO CAVALEIRO DA LUA VOL 02',
  'A VINGANÇA DO CAVALEIRO DA LUA VOL 02',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/ytIe2d5Adyhn6hkfCnfsS1389Gg=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/c82df4ee-642a-11f0-b55e-2a081a9d92fa.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
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
  'PROD-00143',
  'A VINGANÇA DO CAVALEIRO DA LUA VOL01',
  'A VINGANÇA DO CAVALEIRO DA LUA VOL01',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/d2cFMMILPW6r_ISsvhKqf4v7qA0=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/d079409c-eb47-11ef-82bf-7a9c5276656c.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
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
  'PROD-00144',
  'ABSOLUTE BATMAN N.01 [REB2]',
  'ABSOLUTE BATMAN N.01 [REB2]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/NTL786FDfT7LB49RLW8SV2_D74A=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/a4365f98-a7c0-11f0-96ab-2e54fc51120d.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
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
  'PROD-00145',
  'ACADEMIA DO ESTRANHO: ENCONTRE O X',
  'ACADEMIA DO ESTRANHO: ENCONTRE O X',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/D48EfG9sFtYgo5_ykB-oMGtehY4=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/7e1f2442-7fa9-11ef-b1d0-12caec0ea15c.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
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
  'PROD-00146',
  'ACHO QUE MEU FILHO E GAY N.1',
  'ACHO QUE MEU FILHO E GAY N.1',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/dV8DJXv0SQUFwq8siIgooskIiLk=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/11ddf4bc-f68c-11ee-b5c8-3a7739dfcdd7.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
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
  'PROD-00147',
  'ACHO QUE MEU FILHO E GAY N.2',
  'ACHO QUE MEU FILHO E GAY N.2',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/7A4lnUzSNT48M1F-0MkG3SG0_bo=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/5c4abd12-0cc8-11ef-9312-4e89173d1712.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
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
  'PROD-00148',
  'ACHO QUE MEU FILHO E GAY N.3',
  'ACHO QUE MEU FILHO E GAY N.3',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/jo9rLTNcfg9lGTJUuxWp_0FI9VM=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/27ee3bac-2ce4-11ef-b724-7e67d1c5424b.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
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
  'PROD-00149',
  'ACHO QUE MEU FILHO E GAY N.4',
  'ACHO QUE MEU FILHO E GAY N.4',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/BFA9JrLbYosXS5YXvSZUmeoXwsQ=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/711ab77e-3fd1-11ef-8385-ba8f13f2d55b.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
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
  'PROD-00150',
  'ACHO QUE MEU FILHO E GAY N.5',
  'ACHO QUE MEU FILHO E GAY N.5',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/7x_S_Vr80smys8iKxQgV1fMvvQo=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/8b311654-7fa9-11ef-b1d0-12caec0ea15c.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
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
  'PROD-00151',
  'ADEUS, ERI [REB]',
  'ADEUS, ERI [REB]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/LzDz7cLN5ainnD46btySQ5L-mFc=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/06cb4d6c-98c6-11f0-975a-9e31cae1851e.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
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
  'PROD-00152',
  'AFTER GOD - 05',
  'AFTER GOD - 05',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/4haAfJqwuhOb0cwUs9nsBZhLFVA=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/8d4e6e1e-3692-11f0-a555-0ab818bfd0ea.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
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
  'PROD-00153',
  'AFTER GOD - 06',
  'AFTER GOD - 06',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/WChUX8bkzZke6C9VxACCXvmOJDk=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/c85ff0b6-642a-11f0-9174-0aba59c16e94.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
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
  'PROD-00154',
  'AFTER GOD - 2',
  'AFTER GOD - 2',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/oZ5vJyVVQVk2JQhCwq6BCvaO8Q0=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/7c4839c4-7fa9-11ef-b1d0-12caec0ea15c.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
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
  'PROD-00155',
  'AFTER GOD - 3',
  'AFTER GOD - 3',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/J-Bhnjb-kUlyIaBZ78PCqMXUvPg=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/d10affc8-eb47-11ef-b2e7-02f306ed4817.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
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
  'PROD-00156',
  'AFTER GOD - 4',
  'AFTER GOD - 4',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/xz2l5TTpbZIJvSK19H7MPd_Z8Dw=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/8daecc78-eb29-11ef-a4f3-5a40d84dae09.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
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
  'PROD-00157',
  'AFTER GOD N.1',
  'AFTER GOD N.1',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/CvoRIf-hrtCgJ7Zyyr0RaUKbvAk=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/d2d18330-63e4-11ef-8888-36fc18488cf6.png"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
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
  'PROD-00158',
  'AGENTE VENOM (MARVEL ESSENCIAIS)',
  'AGENTE VENOM (MARVEL ESSENCIAIS)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/-Bfn6y6EKHrVqoX85JJjwIrb3iE=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/a0c3658a-eb47-11ef-80c6-0ee70347c223.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
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
  'PROD-00159',
  'ALAMANAQUE DO CASCAO (2021) N.20',
  'ALAMANAQUE DO CASCAO (2021) N.20',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/ACBHG5nwD1Vl9tyIRVy3A91Nv-A=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/d40140e8-119a-11ef-bfb2-36a257064742.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
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
  'PROD-00160',
  'ALAMANAQUE DO CASCAO (2021) N.21',
  'ALAMANAQUE DO CASCAO (2021) N.21',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/R4IHFqNdBPA34ZVj6RmCEgQGzjA=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/91effc24-4e7d-11ef-8b01-66fb588c5617.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
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
  'PROD-00161',
  'ALAN SCOTT: LANTERNA VERDE',
  'ALAN SCOTT: LANTERNA VERDE',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/QZPRaPJUyQR0R3B6Ecg3XXXRBq4=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/9b1b4ff8-eb29-11ef-89a1-ce85303a26c9.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
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
  'PROD-00162',
  'ALIEN VOL.01',
  'ALIEN VOL.01',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/novR5kf6X8wwZnYMxqimRB6ijaU=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/8f99d4a6-eb29-11ef-913d-52f5d450f8a6.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
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
  'PROD-00163',
  'ALIEN VOL.02',
  'ALIEN VOL.02',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/mXfU6vlLmvRKUPdVb0M33NzYqS0=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/8d557092-3692-11f0-8d7f-ba18af294916.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
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
  'PROD-00164',
  'ALMANACAO DA TURMA DA MONICA N.21',
  'ALMANACAO DA TURMA DA MONICA N.21',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/XHhTpVXffJQDSz1IhS6ARc_g7zI=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/86fa249a-7fa9-11ef-b0bc-6e97175de7f7.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
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
  'PROD-00165',
  'ALMANACAO DA TURMA DA MONICA N.22',
  'ALMANACAO DA TURMA DA MONICA N.22',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/bVRosgPzUXRzlPPxV9jU7C0xw8k=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/a3503b8e-eb29-11ef-9e36-2a856f41baa0.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
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
  'PROD-00166',
  'ALMANACAO DA TURMA DA MONICA N.23',
  'ALMANACAO DA TURMA DA MONICA N.23',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/tsxlYMkdkCFEfhadtm9q8rTj0T8=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/8f0551be-08c5-11f0-be53-5e8a9da48498.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
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
  'PROD-00167',
  'ALMANACAO DA TURMA DA MONICA N.24',
  'ALMANACAO DA TURMA DA MONICA N.24',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/BGzQO_Cjcm9K_bvTPLaD0WZjHzU=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/5f7d0740-5ea9-11f0-bc5c-8a0b5d172c0d.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
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
  'PROD-00168',
  'ALMANACAO DA TURMA DA MONICA N.25',
  'ALMANACAO DA TURMA DA MONICA N.25',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/7-mSJsNGak3LwssBRPfWtbqdDOA=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/2a570e96-a4ac-11f0-a599-8e83af06c4a6.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
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
  'PROD-00169',
  'ALMANAQUE DA MAGALI (202 N.19',
  'ALMANAQUE DA MAGALI (202 N.19',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/ZYivJyTEX4OJQIoKQgeprE4VpX4=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/05d404f4-f68c-11ee-85eb-96405b4b1de9.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
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
  'PROD-00170',
  'ALMANAQUE DA MAGALI (202 N.20',
  'ALMANAQUE DA MAGALI (202 N.20',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/VAchQidNZQ20fkBQNvRgG_mUwb0=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/f5b0323c-2930-11ef-8a49-928f61c71625.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
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
  'PROD-00171',
  'ALMANAQUE DA MAGALI (202 N.21',
  'ALMANAQUE DA MAGALI (202 N.21',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/AVvLO8PJuYDtmy-rZKcvGdfyroE=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/c0e2b8ec-63e4-11ef-9409-124bc7643d20.png"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
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
  'PROD-00172',
  'ALMANAQUE DA MAGALI N.22',
  'ALMANAQUE DA MAGALI N.22',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/Dwat7kTFNHCW6ZXiqLn7uZLKveA=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/7d1503e6-7fa9-11ef-b1d0-12caec0ea15c.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
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
  'PROD-00173',
  'ALMANAQUE DA MAGALI N.23',
  'ALMANAQUE DA MAGALI N.23',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/2vgwOT0nhycE6eu7JTwEVkrbHJY=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/8fcd48a4-eb29-11ef-b1d3-def782e2bf12.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
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
  'PROD-00174',
  'ALMANAQUE DA MAGALI N.24',
  'ALMANAQUE DA MAGALI N.24',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/Z4BTdIuONiS-nYS6NQ1TgfKAlVw=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/01046044-f2f9-11ef-84b0-4a557680f2ea.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
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
  'PROD-00175',
  'ALMANAQUE DA MAGALI N.25',
  'ALMANAQUE DA MAGALI N.25',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/VbyD4LZ4hP-OZMTSxIjIN7_rL0o=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/938c7ac8-9d49-11f0-8116-a621b6c207b0.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
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
  'PROD-00176',
  'ALMANAQUE DA MAGALI N.26',
  'ALMANAQUE DA MAGALI N.26',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/1vRgaUPtlrGmH6lGThePe86cV6Q=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/6ca8abcc-5ea9-11f0-a1bd-66accccbd618.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
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
  'PROD-00177',
  'ALMANAQUE DA MAGALI N.27',
  'ALMANAQUE DA MAGALI N.27',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/6vRidpme7PiKxMXACjDYDSiJJqk=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/53a811f2-8b5f-11f0-b3d9-165df9e621a1.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
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
  'PROD-00178',
  'ALMANAQUE DA MONICA (202 N.18',
  'ALMANAQUE DA MONICA (202 N.18',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/J7s8KtDgmMttIxwe2iKhNz9tXFo=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/8503d0a4-d816-11ee-a1d7-e2a33adec5cd.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
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
  'PROD-00179',
  'ALMANAQUE DA MONICA (202 N.19',
  'ALMANAQUE DA MONICA (202 N.19',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/C8hJymBNLN7FsIy7vMib1RrazzA=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/8de2ea46-e583-11ee-b66f-62eaabe3d6ba.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
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
  'PROD-00180',
  'ALMANAQUE DA MONICA (2021) N.20',
  'ALMANAQUE DA MONICA (2021) N.20',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/J37eQepUrba1UBVdtQmkDKbkbAA=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/d42a6f2c-119a-11ef-9c09-e6e3c151f638.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
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
  'PROD-00181',
  'ALMANAQUE DA MONICA (2021) N.21',
  'ALMANAQUE DA MONICA (2021) N.21',
  0.00,
  '["https://d1y59j9xdhixp0.cloudfront.net/2dede6cdcecb2ad9d5102618f5d141cd35e28c9a/images/dc6d5f0bf4b929fa80b9.svg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
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
  'PROD-00182',
  'ALMANAQUE DA MONICA (2021) N.22',
  'ALMANAQUE DA MONICA (2021) N.22',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/sHG9P3ox6g6aNpVvrg9pZw8kIJc=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/7d24a54e-7fa9-11ef-b0bc-6e97175de7f7.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
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
  'PROD-00183',
  'ALMANAQUE DA MONICA N.23',
  'ALMANAQUE DA MONICA N.23',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/Ua1CMNr9rn1j5OmUO_PM3Ty3HQA=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/a569c048-eb47-11ef-80c6-0ee70347c223.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
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
  'PROD-00184',
  'ALMANAQUE DA MONICA N.24',
  'ALMANAQUE DA MONICA N.24',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/JblfO4PHDXHPs79t08xmGPISDWA=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/900791f8-eb29-11ef-8fb2-6696cc3e9cb3.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
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
  'PROD-00185',
  'ALMANAQUE DA MONICA N.25',
  'ALMANAQUE DA MONICA N.25',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/v741GDfZSbcGQ_bSTCUFE7MussY=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/f01ef8f8-0143-11f0-9a82-ca3c9ea74dec.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
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
  'PROD-00186',
  'ALMANAQUE DA MONICA N.26',
  'ALMANAQUE DA MONICA N.26',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/9v1ATQpWQME1a1ZGd1t_mW0fqiM=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/d6e753a6-3f2f-11f0-a17d-1ac4d5553c9e.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
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
  'PROD-00187',
  'ALMANAQUE DA MONICA N.27',
  'ALMANAQUE DA MONICA N.27',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/0pE4dCrVazJOD1sUwoDb8EeKuSk=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/206be31c-69af-11f0-ae5d-0ebdcf797c5e.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
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
  'PROD-00188',
  'ALMANAQUE DA MONICA N.28',
  'ALMANAQUE DA MONICA N.28',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/yiI0FgP8IrtdCH8JMAgd0Am90V4=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/1fcf2422-a4ac-11f0-8b51-cad07a812184.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
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
  'PROD-00189',
  'ALMANAQUE DA TINA (2022) N.5',
  'ALMANAQUE DA TINA (2022) N.5',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/HGq1EC7Y68q51M1NQscEArOJYXo=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/c1208cbc-63e4-11ef-aad4-727f596e106b.png"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
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
  'PROD-00190',
  'ALMANAQUE DA TINA (2022) N.6',
  'ALMANAQUE DA TINA (2022) N.6',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/LPtAIzTIirgmuk-3i6wQcW4ODF0=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/035ff6be-f2f9-11ef-a845-b2c26c8c0dcc.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
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
  'PROD-00191',
  'ALMANAQUE DA TINA (2022) N.7',
  'ALMANAQUE DA TINA (2022) N.7',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/ahGklsLKVJhth4TmiB0Ueca9104=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/53c9f86c-8b5f-11f0-b3d9-165df9e621a1.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
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
  'PROD-00192',
  'ALMANAQUE DA TURMA DA MONICA PARA COLORIR N.04',
  'ALMANAQUE DA TURMA DA MONICA PARA COLORIR N.04',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/qCHAv2-fhB1Kn4udYRSClage1Jk=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/2b3bc806-a4ac-11f0-8687-a638114deac1.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
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
  'PROD-00193',
  'ALMANAQUE DA TURMA DA MONICA PARA COLORIR N.1',
  'ALMANAQUE DA TURMA DA MONICA PARA COLORIR N.1',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/pG0BuwL-ysRF7Kudiab2vYR_NKs=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/81fdeedc-4dac-11f0-869e-c68fdf865aae.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
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
  'PROD-00194',
  'ALMANAQUE DA TURMA DA MÔNICA PARA COLORIR N.2',
  'ALMANAQUE DA TURMA DA MÔNICA PARA COLORIR N.2',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/W4e45o7R-9RARONaUYYSkH79gbM=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/1fb2dade-69af-11f0-a796-ae0a374fc493.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
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
  'PROD-00195',
  'ALMANAQUE DE HISTÓRIAS CURTAS DA TURMA DA MÔNICA N.10',
  'ALMANAQUE DE HISTÓRIAS CURTAS DA TURMA DA MÔNICA N.10',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/4AnzPc5-eMa0K_Az2BOvh0faQBY=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/8d329a10-e583-11ee-9d7c-f2cdc5a9e7d5.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
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
  'PROD-00196',
  'ALMANAQUE DE HISTORIAS CURTAS DA TURMA DA MONICA N.11',
  'ALMANAQUE DE HISTORIAS CURTAS DA TURMA DA MONICA N.11',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/gF-uBqKzTM5X2yuadlGWIgZWaxE=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/d42ac17a-119a-11ef-a951-1a13f4f3a32a.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
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
  'PROD-00197',
  'ALMANAQUE DE HISTÓRIAS CURTAS DA TURMA DA MÔNICA N.12',
  'ALMANAQUE DE HISTÓRIAS CURTAS DA TURMA DA MÔNICA N.12',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/XzNaLVy3hBYMmDmj3RijexxHDz8=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/745970f0-4e7d-11ef-8f2a-626adc132bdd.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
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
  'PROD-00198',
  'ALMANAQUE DE HISTÓRIAS CURTAS DA TURMA DA MÔNICA N.13',
  'ALMANAQUE DE HISTÓRIAS CURTAS DA TURMA DA MÔNICA N.13',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/RBUxF4pjb3BmSI-YYdpDzL7OuJM=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/7cf2cdb2-7fa9-11ef-b1d0-12caec0ea15c.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
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
  'PROD-00199',
  'ALMANAQUE DE HISTÓRIAS CURTAS DA TURMA DA MONICA N.14',
  'ALMANAQUE DE HISTÓRIAS CURTAS DA TURMA DA MONICA N.14',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/yWn6qyrH5jnBTaGdcbzVgCIX7Ok=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/a4235c26-eb47-11ef-80c6-0ee70347c223.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
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
  'PROD-00200',
  'ALMANAQUE DE HISTORIAS CURTAS DA TURMA DA MONICA N.15',
  'ALMANAQUE DE HISTORIAS CURTAS DA TURMA DA MONICA N.15',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/Wtut_SgsHzcuflNA8Ep5WpgvMBA=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/8fa795e6-eb29-11ef-a31a-8ed8743505f0.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
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
  'PROD-00201',
  'ALMANAQUE DE HISTORIAS CURTAS DA TURMA DA MONICA N.16',
  'ALMANAQUE DE HISTORIAS CURTAS DA TURMA DA MONICA N.16',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/7Pkuq-JaNBXtGRp2Qk9kecMStWk=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/f005ae70-0143-11f0-9a82-ca3c9ea74dec.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
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
  'PROD-00202',
  'ALMANAQUE DE HISTÓRIAS CURTAS DA TURMA DA MONICA N.17',
  'ALMANAQUE DE HISTÓRIAS CURTAS DA TURMA DA MONICA N.17',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/Xiq1f_4EgmrUzNTJDIP17k9YAhM=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/d6d5118c-3f2f-11f0-87b4-c2502d24ff3f.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
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
  'PROD-00203',
  'ALMANAQUE DE HISTORIAS CURTAS DA TURMA DA MONICA N.18',
  'ALMANAQUE DE HISTORIAS CURTAS DA TURMA DA MONICA N.18',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/OgEI2hsvVHHwiZVkEkEcLNa-kEY=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/206ab578-69af-11f0-9136-d26b36de5d6c.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
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
  'PROD-00204',
  'ALMANAQUE DE HISTÓRIAS CURTAS DA TURMA DA MÔNICA N.9',
  'ALMANAQUE DE HISTÓRIAS CURTAS DA TURMA DA MÔNICA N.9',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/sx1nLR11hSiseyytBGMD-4z9Z0I=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/6704c3c4-d816-11ee-b70a-e2697ce33d53.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
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
  'PROD-00205',
  'ALMANAQUE DE HISTORIAS PARA COLORIR DA TURMA DA MÔNICA N.3',
  'ALMANAQUE DE HISTORIAS PARA COLORIR DA TURMA DA MÔNICA N.3',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/tJq5CVdfHyujn_HHupuKbmdHMbg=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/fd995b7c-9031-11f0-82c8-4a06203c34dc.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
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
  'PROD-00206',
  'ALMANAQUE DE HISTÓRIAS SEM  PALAVRAS DA TURMA DA MONICA N.17',
  'ALMANAQUE DE HISTÓRIAS SEM  PALAVRAS DA TURMA DA MONICA N.17',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/pp0ad3-pmds9DXuGKQTQ2iWG_Mc=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/6b51d7f8-5ea9-11f0-be82-febfa26cb361.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
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
  'PROD-00207',
  'ALMANAQUE DE HISTÓRIAS SEM  PALAVRAS N.15',
  'ALMANAQUE DE HISTÓRIAS SEM  PALAVRAS N.15',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/LxLaht3uw8jzhrwAi64APiiYww0=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/00848ed2-f2f9-11ef-9a4c-6e7871fdaf1f.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
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
  'PROD-00208',
  'ALMANAQUE DE HISTÓRIAS SEM  PALAVRAS N.18',
  'ALMANAQUE DE HISTÓRIAS SEM  PALAVRAS N.18',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/_So0u8KWq_Iy6mOdmKRAoblweYk=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/53a392b2-8b5f-11f0-ab6e-7e1ab2cbb1e5.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
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
  'PROD-00209',
  'ALMANAQUE DE HISTÓRIAS SEM PALAVRAS  N.14',
  'ALMANAQUE DE HISTÓRIAS SEM PALAVRAS  N.14',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/v5XMI-EME1RSbmJqfJNlWrHueWQ=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/8de6dbf4-eb29-11ef-a4f3-5a40d84dae09.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
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
  'PROD-00210',
  'ALMANAQUE DE HISTÓRIAS SEM PALAVRAS N.16',
  'ALMANAQUE DE HISTÓRIAS SEM PALAVRAS N.16',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/0S-_sx6exi6M-aW4Xv2ZMcTgeZQ=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/41fcbfee-2475-11f0-b281-1e01f72415a5.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
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
  'PROD-00211',
  'ALMANAQUE DO CASCAO (202 N.19',
  'ALMANAQUE DO CASCAO (202 N.19',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/sj0AerTsl-5b_iqAeV_CF-jUCZ8=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/8ca3213c-e583-11ee-b66f-62eaabe3d6ba.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
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
  'PROD-00212',
  'ALMANAQUE DO CASCAO (2021) N.22',
  'ALMANAQUE DO CASCAO (2021) N.22',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/8q0t_ZTzMqHyFPzNKVviFPoy5x0=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/7cb76894-7fa9-11ef-b1d0-12caec0ea15c.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
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
  'PROD-00213',
  'ALMANAQUE DO CASCAO N.23',
  'ALMANAQUE DO CASCAO N.23',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/6WkJUfqWqmVH1HsmoBmzt6Ae-20=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/a1247406-eb47-11ef-80c6-0ee70347c223.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
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
  'PROD-00214',
  'ALMANAQUE DO CASCAO N.24',
  'ALMANAQUE DO CASCAO N.24',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/j27KXLZ25r3SaQzq8uE16jNO5rA=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/8e47a6fa-eb29-11ef-a31a-8ed8743505f0.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
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
  'PROD-00215',
  'ALMANAQUE DO CASCAO N.25',
  'ALMANAQUE DO CASCAO N.25',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/bwB3v3uOG8i_y7NXq0f1XGrcoqE=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/45527e4c-7fd1-11f0-b894-2e1dcafaddd0.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
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
  'PROD-00216',
  'ALMANAQUE DO CASCAO N.26',
  'ALMANAQUE DO CASCAO N.26',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/wV9IEYOz0B4eOhQVuEcv4R7vHOw=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/d6af7012-3f2f-11f0-a17d-1ac4d5553c9e.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
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
  'PROD-00217',
  'ALMANAQUE DO CASCAO N.27',
  'ALMANAQUE DO CASCAO N.27',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/x_3Mv_4kQEzeJlA9-4Xt6QJ3SOA=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/204f009e-69af-11f0-9a47-2e3660e82a7f.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
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
  'PROD-00218',
  'ALMANAQUE DO CASCAO N.28',
  'ALMANAQUE DO CASCAO N.28',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/P7eoCiwrmGcMJPyHnzcnZJRGAg4=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/32bccc10-a4ac-11f0-a72e-eecb83d78201.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
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
  'PROD-00219',
  'ALMANAQUE DO CEBOLINHA ( N.18',
  'ALMANAQUE DO CEBOLINHA ( N.18',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/vkC-Ut-Ijk_NY7aLvnIGLl0HASQ=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/56df9640-d816-11ee-bb12-5a86bcbeb6e3.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
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
  'PROD-00220',
  'ALMANAQUE DO CEBOLINHA ( N.19',
  'ALMANAQUE DO CEBOLINHA ( N.19',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/u-KIwhJOJx1DmHP_QVANSuJKAAs=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/8c9c873c-e583-11ee-9d7c-f2cdc5a9e7d5.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
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
  'PROD-00221',
  'ALMANAQUE DO CEBOLINHA (2021) N.20',
  'ALMANAQUE DO CEBOLINHA (2021) N.20',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/tbRgrW90TKeLPolZWEm01qouAMs=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/d45605f6-119a-11ef-9c09-e6e3c151f638.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
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
  'PROD-00222',
  'ALMANAQUE DO CEBOLINHA (2021) N.21',
  'ALMANAQUE DO CEBOLINHA (2021) N.21',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/bwkFFGRIbIMZNeWawvUf-pgBYgk=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/7458c22c-4e7d-11ef-9a7d-6ef807fbb3ad.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
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
  'PROD-00223',
  'ALMANAQUE DO CEBOLINHA (2021) N.22',
  'ALMANAQUE DO CEBOLINHA (2021) N.22',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/SXSZuCDT1gjy6PfzVERcIpYOoAU=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/7cd35c52-7fa9-11ef-b1d0-12caec0ea15c.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
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
  'PROD-00224',
  'ALMANAQUE DO CEBOLINHA N.23',
  'ALMANAQUE DO CEBOLINHA N.23',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/Qg4C-LuRq84rqIsOtXaXMSx_0mo=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/a3c86046-eb47-11ef-80c6-0ee70347c223.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
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
  'PROD-00225',
  'ALMANAQUE DO CEBOLINHA N.24',
  'ALMANAQUE DO CEBOLINHA N.24',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/2-G-1T_7GddmQvVAwfzA1QarzGo=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/8e6b1f7c-eb29-11ef-8b75-5ac0f052206d.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
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
  'PROD-00226',
  'ALMANAQUE DO CEBOLINHA N.26',
  'ALMANAQUE DO CEBOLINHA N.26',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/c3LmdxZu-nOq60DaZJtchexEC8g=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/d6cbc640-3f2f-11f0-a17d-1ac4d5553c9e.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
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
  'PROD-00227',
  'ALMANAQUE DO CEBOLINHA N.27',
  'ALMANAQUE DO CEBOLINHA N.27',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/leQVsYUQEGcXfumzHal8HobW7MA=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/205141c4-69af-11f0-ae5d-0ebdcf797c5e.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
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
  'PROD-00228',
  'ALMANAQUE DO CEBOLINHA N.28',
  'ALMANAQUE DO CEBOLINHA N.28',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/zfFJcGxgdmDbwe89J2f3WBSaQ7U=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/32d5c0c6-a4ac-11f0-a72e-eecb83d78201.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
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
  'PROD-00229',
  'ALMANAQUE DO CHICO BENTO N.19',
  'ALMANAQUE DO CHICO BENTO N.19',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/j3HoaIQMQttl1AR5pEbvuOo3hwQ=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/05d440c2-f68c-11ee-b203-3e7d9dc455bb.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
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
  'PROD-00230',
  'ALMANAQUE DO CHICO BENTO N.21',
  'ALMANAQUE DO CHICO BENTO N.21',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/FP9b23BXCt9gK0xH9COr_gYYKWg=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/c096ae70-63e4-11ef-807c-4e837066fdd4.png"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
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
  'PROD-00231',
  'ALMANAQUE DO CHICO BENTO N.22',
  'ALMANAQUE DO CHICO BENTO N.22',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/g8DoimP0MxGQc9otd3hheooq0v0=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/7cdaf9d0-7fa9-11ef-b0bc-6e97175de7f7.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
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
  'PROD-00232',
  'ALMANAQUE DO CHICO BENTO N.23',
  'ALMANAQUE DO CHICO BENTO N.23',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/CiiwdmzAdz6Ti6QkmxlwVpWO4jk=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/8e7e50f6-eb29-11ef-8fb2-6696cc3e9cb3.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
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
  'PROD-00233',
  'ALMANAQUE DO CHICO BENTO N.24',
  'ALMANAQUE DO CHICO BENTO N.24',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/dr3lubC_Pt-qklftQgcTL-KjfDE=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/00a2a5ac-f2f9-11ef-a462-7a17e78776b8.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
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
  'PROD-00234',
  'ALMANAQUE DO CHICO BENTO N.26',
  'ALMANAQUE DO CHICO BENTO N.26',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/8lQQWZt1ykNFQNHULM8NXEYC55U=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/6b921fd4-5ea9-11f0-a034-4eae30e658d1.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
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
  'PROD-00235',
  'ALMANAQUE DO CHICO BENTO N.27',
  'ALMANAQUE DO CHICO BENTO N.27',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/7wuZk9UqpiME52wHAH6fsl2xK1A=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/53884322-8b5f-11f0-ab6e-7e1ab2cbb1e5.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
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
  'PROD-00236',
  'ALMANAQUE DOS PETS DA TURMA DA MONICA N.1',
  'ALMANAQUE DOS PETS DA TURMA DA MONICA N.1',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/qZokKnzNAh6MLVcCWdQTTForISs=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/2c87e15c-44b4-11f0-a1ec-1a73b65bfa37.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
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
  'PROD-00237',
  'ALMANAQUE HISTÓRIAS SEM  PALAVRAS DA TURMA DA MONICA N.13',
  'ALMANAQUE HISTÓRIAS SEM  PALAVRAS DA TURMA DA MONICA N.13',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/1gKjR8Hf_2TJaLsv5btOY9hKPYE=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/7c958774-7fa9-11ef-b0bc-6e97175de7f7.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
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
  'PROD-00238',
  'ALMANAQUE HISTÓRIAS SEM PALAVRAS N.10',
  'ALMANAQUE HISTÓRIAS SEM PALAVRAS N.10',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/vHZk8GJzqiTPn8DqOCEPJUjU5lA=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/130cc778-f68c-11ee-b203-3e7d9dc455bb.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
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
  'PROD-00239',
  'ALMANAQUE HISTÓRIAS SEM PALAVRAS N.11',
  'ALMANAQUE HISTÓRIAS SEM PALAVRAS N.11',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/n5cz4EXXItIo3vQFTw01caMqlBU=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/f90611a4-2930-11ef-93b8-4a187dfd8c76.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
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
  'PROD-00240',
  'ALMANAQUE HISTÓRIAS SEM PALAVRAS N.12',
  'ALMANAQUE HISTÓRIAS SEM PALAVRAS N.12',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/LnwMoHDtNhz_sYQOJ0RomlVahlc=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/c095a37c-63e4-11ef-aad4-727f596e106b.png"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
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
  'PROD-00241',
  'ALMANAQUE TEMATICO (2007 N.69',
  'ALMANAQUE TEMATICO (2007 N.69',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/a7bzrbQ3ZOt8CLwNgEdveS7ugy0=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/9236a7e4-d819-11ee-b57d-56e6c271e0a3.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
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
  'PROD-00242',
  'ALMANAQUE TEMATICO (2007 N.71',
  'ALMANAQUE TEMATICO (2007 N.71',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/KAMyRpEH2zX9bHsujXRztyBG114=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/8a81f30c-4e7d-11ef-b438-b279561b7695.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
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
  'PROD-00243',
  'ALMANAQUE TEMATICO (2007) N.70',
  'ALMANAQUE TEMATICO (2007) N.70',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/DAQgJxJK8kF6WGnU0agn_hf3QvA=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/5e85f57c-5ea9-11f0-bc5c-8a0b5d172c0d.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();
