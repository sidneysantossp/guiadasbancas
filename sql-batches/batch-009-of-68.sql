-- SQL para importar produtos Brancaleone
-- Gerado em: 2025-10-17T17:52:46.765Z
-- Total de produtos: 3363
-- Fonte: brancaleone-products-1760723254011.json

-- 1. Criar distribuidor (se não existir)

-- Distribuidor já criado no batch-001

-- Lote 9 de 68
-- Produtos: 801 até 900



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00401',
  'AVENTURAS MARVEL (2023) N.13',
  'AVENTURAS MARVEL (2023) N.13',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/Ql8iPFkW_Ts9pWljqGxzCk-qUNA=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/d7105c92-3f2f-11f0-a17d-1ac4d5553c9e.jpg"]'::jsonb,
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
  'PROD-00402',
  'AVENTURAS MARVEL (2023) N.14',
  'AVENTURAS MARVEL (2023) N.14',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/W9BPslwbyePtFv4K_crfPWoYcUc=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/c8779e82-642a-11f0-bfa0-6253877c6ac4.jpg"]'::jsonb,
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
  'PROD-00403',
  'AVENTURAS MARVEL (2023) N.7',
  'AVENTURAS MARVEL (2023) N.7',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/_WmMeKxtCjXsG0HkahRoSYyxIHM=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/2faf6c02-e497-11ee-b6a7-e2b250ff01a0.jpg"]'::jsonb,
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
  'PROD-00404',
  'AVES DE RAPINA VOL. 01',
  'AVES DE RAPINA VOL. 01',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/Wao2v-ETcINGWYh6-TX6e3H0NJo=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/5d2c496c-2473-11f0-afad-2e8d043f9b4b.jpg"]'::jsonb,
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
  'PROD-00405',
  'AYASHIMON - 01',
  'AYASHIMON - 01',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/a2cYQoffVuna9PRS8jWwdZYvzA8=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/c5ea3826-d8a0-11ee-82f3-be3c8dbb0cbf.jpg"]'::jsonb,
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
  'PROD-00406',
  'AYASHIMON - 02',
  'AYASHIMON - 02',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/9vBsuQEECNJturBVIRoOsSPbQbo=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/d35a46bc-d81a-11ee-8b82-06e22cdb7792.jpg"]'::jsonb,
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
  'PROD-00407',
  'AYASHIMON - 03',
  'AYASHIMON - 03',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/Cimrr409Q6i6WL32ttrBEtVMqJM=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/c5ff75e2-d8a0-11ee-b92d-d6162862a756.jpg"]'::jsonb,
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
  'PROD-00408',
  'AYASHIMON - BOX',
  'AYASHIMON - BOX',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/3WXpBuusO2tE6Q3dyocPoiHnaHo=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/d3322bd2-d81a-11ee-9df9-5a86bcbeb6e3.jpg"]'::jsonb,
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
  'PROD-00409',
  'AZUL E DOURADO',
  'AZUL E DOURADO',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/FexkeCbBsk5ZVpN84KbcaNfjpdI=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/214e0446-de36-11ee-831d-e63691a02f25.jpg"]'::jsonb,
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
  'PROD-00410',
  'BAKEMONOGATARI - 17',
  'BAKEMONOGATARI - 17',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/qibbVjN4IQDOkwkQhGb8vQBXmA0=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/a5c81eb0-d818-11ee-a1cf-e2e54ed5f9f7.jpg"]'::jsonb,
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
  'PROD-00411',
  'BAKEMONOGATARI - 18',
  'BAKEMONOGATARI - 18',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/cMIQ49OnfE7l8sDKm88kzAkCgDA=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/a65f5e56-d818-11ee-a11f-5a86bcbeb6e3.jpg"]'::jsonb,
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
  'PROD-00412',
  'BAKEMONOGATARI - 21',
  'BAKEMONOGATARI - 21',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/RbdxS0o9s5vOvBnv1j8thdKUDC0=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/a78a372e-d818-11ee-a11f-5a86bcbeb6e3.jpg"]'::jsonb,
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
  'PROD-00413',
  'BAKEMONOGATARI N.2',
  'BAKEMONOGATARI N.2',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/YKrEKpY2z_wl2J4J0vulArPEUeg=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/6f324fee-3fd1-11ef-9d39-e2053fdf584c.jpg"]'::jsonb,
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
  'PROD-00414',
  'BAKEMONOGATARI N.20',
  'BAKEMONOGATARI N.20',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/uTcSGraKpHveDx5ge3gEZLhr39E=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/a71a57b0-d818-11ee-82a8-e2697ce33d53.jpg"]'::jsonb,
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
  'PROD-00415',
  'BAKEMONOGATARI N.22',
  'BAKEMONOGATARI N.22',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/5qaY1BvAs3CD8deqCHn1fFpBAkI=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/9b1c9554-e583-11ee-8165-7ec3420f8e17.jpg"]'::jsonb,
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
  'PROD-00416',
  'BAKEMONOGATARI N.3',
  'BAKEMONOGATARI N.3',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/gHcLnI8nV1-bI_3vSF-dN0kk3Go=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/6f63ead6-3fd1-11ef-b3a6-d61c9c955b83.jpg"]'::jsonb,
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
  'PROD-00417',
  'BAKEMONOGATARI N.4',
  'BAKEMONOGATARI N.4',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/0ZRm6hi9CXCkaSHt5nmsfLM8hBI=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/811f406c-4e7d-11ef-9b64-0a2a8c62a641.jpg"]'::jsonb,
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
  'PROD-00418',
  'BAKEMONOGATARI N.5',
  'BAKEMONOGATARI N.5',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/5tq0ySc6KdeETDVw4ojdCYvwfxM=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/6f741014-3fd1-11ef-9d39-e2053fdf584c.jpg"]'::jsonb,
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
  'PROD-00419',
  'BAKEMONOGATARI N.6',
  'BAKEMONOGATARI N.6',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/I2rOF2By7Am-UsfTpQvzyEIDpXc=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/6f86b05c-3fd1-11ef-9d39-e2053fdf584c.jpg"]'::jsonb,
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
  'PROD-00420',
  'BAKEMONOGATARI N.7',
  'BAKEMONOGATARI N.7',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/iqNIknpnVkEScm2P7qWHPRXG5yk=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/6f9a5c38-3fd1-11ef-9d39-e2053fdf584c.jpg"]'::jsonb,
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
  'PROD-00421',
  'BAKEMONOGATARI N.8',
  'BAKEMONOGATARI N.8',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/oDRCks4i6bHehr82GxnpHCyZvtw=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/6fb71dfa-3fd1-11ef-89d8-0a2724a6fb9b.jpg"]'::jsonb,
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
  'PROD-00422',
  'BAKEMONOGATARI N.9',
  'BAKEMONOGATARI N.9',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/_fDbCCqCLZ6jtUSkgip2ssaeHFY=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/6fbd8f78-3fd1-11ef-ad89-5a355d509fb6.jpg"]'::jsonb,
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
  'PROD-00423',
  'BANANA FISH - 02 [REB3]',
  'BANANA FISH - 02 [REB3]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/vTqFlhs8oG1gPp1X1V_bUVokcL4=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/a1624a38-eb29-11ef-9927-fa812316df6c.jpg"]'::jsonb,
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
  'PROD-00424',
  'BANANA FISH - 03 [REB3]',
  'BANANA FISH - 03 [REB3]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/7aoFt0WpYK4QkqKOwP7malmndzc=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/1ddc9f42-f2f9-11ef-bcb5-dad79b85e12c.jpg"]'::jsonb,
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
  'PROD-00425',
  'BANANA FISH - 04 [REB3]',
  'BANANA FISH - 04 [REB3]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/zUawJCxAEtrL98LOaiiBpRK5jxM=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/dd323866-3f2f-11f0-87b4-c2502d24ff3f.jpg"]'::jsonb,
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
  'PROD-00426',
  'BANANA FISH N.1 [REB4]',
  'BANANA FISH N.1 [REB4]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/QARjt9Rnt5xLB_bwXMygVpXg6oU=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/a15bfa20-eb29-11ef-a4f3-5a40d84dae09.jpg"]'::jsonb,
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
  'PROD-00427',
  'BANNER (MARVEL VINTAGE)',
  'BANNER (MARVEL VINTAGE)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/cVK1js_lLmUPS2jPBa8wmw2VTKE=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/5e102fba-0cc8-11ef-8551-ea183cfe9a00.jpg"]'::jsonb,
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
  'PROD-00428',
  'BAOH N.1',
  'BAOH N.1',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/6nnQLWEbFYYGWHIjx3nmsW4tkNA=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/01f21f7e-9032-11f0-82c8-4a06203c34dc.jpg"]'::jsonb,
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
  'PROD-00429',
  'BATGIRL: ANO UM N.1',
  'BATGIRL: ANO UM N.1',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/RY1OG1j-V0m6rmkV018duf1_jkI=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/f5f08df0-2930-11ef-93b8-4a187dfd8c76.jpg"]'::jsonb,
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
  'PROD-00430',
  'BATGIRLS N.1',
  'BATGIRLS N.1',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/WmtyBSSMwLqKNnBTCPNVxHRfAt0=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/482b4b5c-1705-11ef-a0bb-567d4742b137.jpg"]'::jsonb,
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
  'PROD-00431',
  'BATGIRLS VOL.02',
  'BATGIRLS VOL.02',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/R29pqfrY2GyVkGzA_5Oy-gUEnSM=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/909e825c-eb29-11ef-b1d3-def782e2bf12.jpg"]'::jsonb,
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
  'PROD-00432',
  'BATMAN (2017) N.100',
  'BATMAN (2017) N.100',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/zIAA4xAPfSuXQz9hVdElv_jo8Tg=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/c4e0ec7a-63e4-11ef-8da1-f6206878cf7b.png"]'::jsonb,
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
  'PROD-00433',
  'BATMAN (2017) N.101',
  'BATMAN (2017) N.101',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/3OlneEFDgLfzsGZxpvzjYUhZ8U0=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/7f8c8ba8-7fa9-11ef-b1d0-12caec0ea15c.jpg"]'::jsonb,
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
  'PROD-00434',
  'BATMAN (2017) N.12/94',
  'BATMAN (2017) N.12/94',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/Daa1HEegO71B2oSbilXrGBs1jKY=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/546a6c40-d817-11ee-a7e4-ce469b473a25.jpg"]'::jsonb,
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
  'PROD-00435',
  'BATMAN (2017) N.20/102',
  'BATMAN (2017) N.20/102',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/8u5QmJurqE5z57AP1Els-Mtm-ug=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/c5a92b00-eb47-11ef-a496-fa812316df6c.jpg"]'::jsonb,
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
  'PROD-00436',
  'BATMAN (2017) N.22/104',
  'BATMAN (2017) N.22/104',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/WZct4Zueue1SesAt1ObVm1LjJM4=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/951d5e3e-eb29-11ef-913d-52f5d450f8a6.jpg"]'::jsonb,
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
  'PROD-00437',
  'BATMAN (2017) N.23/105',
  'BATMAN (2017) N.23/105',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/uoCGRIAvmB3mYik_J_NT3og9VZM=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/9533ff54-eb29-11ef-913d-52f5d450f8a6.jpg"]'::jsonb,
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
  'PROD-00438',
  'BATMAN (2017) N.24/106',
  'BATMAN (2017) N.24/106',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/aLue_9D6EiTZFFdfHefuJo9axLA=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/14a093a2-f2f9-11ef-a462-7a17e78776b8.jpg"]'::jsonb,
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
  'PROD-00439',
  'BATMAN (2017) N.25/107',
  'BATMAN (2017) N.25/107',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/nbkn0uo3zvgLCBiGL5L36i6rLGo=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/ad595004-ee29-11ef-b063-626bc6f24654.jpg"]'::jsonb,
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
  'PROD-00440',
  'BATMAN (2017) N.26/108',
  'BATMAN (2017) N.26/108',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/9EJd5-C5PlvPmlc3rUvt2P7aiSc=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/cde3a184-0ea0-11f0-9866-428e228ef4a2.jpg"]'::jsonb,
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
  'PROD-00441',
  'BATMAN (2017) N.27/109',
  'BATMAN (2017) N.27/109',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/jVmNSU_1k45zhqoc6SDDYmOphhg=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/548d0c10-2473-11f0-af25-0ae0ff1b9b8d.jpg"]'::jsonb,
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
  'PROD-00442',
  'BATMAN (2017) N.28/110',
  'BATMAN (2017) N.28/110',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/zqEnuBKc_Yq8RU5YTI4nC07_XGc=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/d81c4952-3f2f-11f0-a17d-1ac4d5553c9e.jpg"]'::jsonb,
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
  'PROD-00443',
  'BATMAN (2017) N.29/111',
  'BATMAN (2017) N.29/111',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/i8-AL3q1aNFepJdy7KITw5BCGJI=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/3c7d3558-5ea9-11f0-b8ff-8a0b5d172c0d.jpg"]'::jsonb,
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
  'PROD-00444',
  'BATMAN (2017) N.30/112',
  'BATMAN (2017) N.30/112',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/Qc9gWzeZG1uP4A0o0GpX_6VQMuQ=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/368be830-7fd1-11f0-a5af-de5e70a27ff7.jpg"]'::jsonb,
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
  'PROD-00445',
  'BATMAN (2017) N.31/113',
  'BATMAN (2017) N.31/113',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/eT8Yaamk7gtRlSgnnkZxXY7rWx4=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/01ed1b22-98c6-11f0-bb75-923f72ea5284.jpg"]'::jsonb,
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
  'PROD-00446',
  'BATMAN (2017) N.32/114',
  'BATMAN (2017) N.32/114',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/4WRyNLbJ7aQxl65CBotDT_QTy14=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/8da8643c-9d49-11f0-8c2e-46530ad93662.jpg"]'::jsonb,
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
  'PROD-00447',
  'BATMAN (2017) N.99',
  'BATMAN (2017) N.99',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/AjbQwAGblT12lfWsWxLqHqM-fQI=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/77548c04-4e7d-11ef-8f2a-626adc132bdd.jpg"]'::jsonb,
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
  'PROD-00448',
  'BATMAN DO FUTURO: AMEACA HOLOGRAFICA',
  'BATMAN DO FUTURO: AMEACA HOLOGRAFICA',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/l-KR-SUMGRS11xiIsR7VNvjEgYc=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/d3268524-d816-11ee-a833-6efcfa6dd7bd.jpg"]'::jsonb,
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
  'PROD-00449',
  'BATMAN DO FUTURO: AMEACA SUBTERRANEA',
  'BATMAN DO FUTURO: AMEACA SUBTERRANEA',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/t3HqdFdSpQsBFkQ_lW2-omi2DE8=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/8a2541a4-7fa9-11ef-b1d0-12caec0ea15c.jpg"]'::jsonb,
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
  'PROD-00450',
  'BATMAN E CORINGA: DUPLA LETAL VOL.02 (DE 3)',
  'BATMAN E CORINGA: DUPLA LETAL VOL.02 (DE 3)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/rIvC_cMggTlcnIElgMquPjg8_GI=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/0538ef68-f2f9-11ef-87c9-c69faf7ce99e.jpg"]'::jsonb,
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