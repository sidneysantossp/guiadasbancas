-- SQL para importar produtos Brancaleone
-- Gerado em: 2025-10-17T17:52:46.765Z
-- Total de produtos: 3363
-- Fonte: brancaleone-products-1760723254011.json

-- 1. Criar distribuidor (se não existir)

-- Distribuidor já criado no batch-001

-- Lote 27 de 68
-- Produtos: 2601 até 2700



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01301',
  'GRANDES SAGAS DISNEY N.3',
  'GRANDES SAGAS DISNEY N.3',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/ehka03XXKpZa-w8EU9dED_sS-ek=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/5d997690-0cc8-11ef-a93f-8e4a61da3cfa.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01302',
  'GRANDES SAGAS DISNEY N.4',
  'GRANDES SAGAS DISNEY N.4',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/hOBmoxJnlHhR8-LRoT8HeU_8Ffw=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/014b4eb6-1ca6-11ef-bc32-def7b1441874.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01303',
  'GRANDES SAGAS DISNEY N.5',
  'GRANDES SAGAS DISNEY N.5',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/m0svBMdWviqeGrp9ptzbN2Ydy2E=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/0148d4ba-1ca6-11ef-b80c-228c440649c1.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01304',
  'GRANDES SAGAS DISNEY N.6',
  'GRANDES SAGAS DISNEY N.6',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/exFsz3emFXuzhJpBpKa_s0kRrR0=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/98885cac-2461-11ef-81c7-f2a69ad46e56.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01305',
  'GRANDES SAGAS DISNEY N.7',
  'GRANDES SAGAS DISNEY N.7',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/jtPQf6hwD5ydJQdImUs32KwUrtQ=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/d27ab83e-63e4-11ef-9c41-c67e4ff8d839.png"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01306',
  'GRANDES SAGAS DISNEY N.8',
  'GRANDES SAGAS DISNEY N.8',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/t37p8SsUVJefO8iJi7WyuS-jLx0=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/d2a9f716-63e4-11ef-9cd1-4e5286e17d7d.png"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01307',
  'GRANDES SAGAS DISNEY N.9',
  'GRANDES SAGAS DISNEY N.9',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/jLGeuRhoo-BgBm5eo5eEVJwnVAs=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/db59910a-7faa-11ef-92e2-6e97175de7f7.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01308',
  'GRANDES SAGAS DISNEY VOL.11',
  'GRANDES SAGAS DISNEY VOL.11',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/Xe-qO2qGpgER7CEMUOZGd6KWFKo=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/d595b738-eb4a-11ef-a198-2a5f63e8aebc.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01309',
  'GRANDES SAGAS DISNEY VOL.12',
  'GRANDES SAGAS DISNEY VOL.12',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/98eOowoTMT3_4UVwMMd1WVUIb-4=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/b4231da2-ee29-11ef-a605-7aa50978e4c8.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01310',
  'GRANDES SAGAS DISNEY VOL.13',
  'GRANDES SAGAS DISNEY VOL.13',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/GlGm4Qx_i7PYvGfTv8zo3Mx8uQg=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/d5d71700-eb4a-11ef-8621-0ee70347c223.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01311',
  'GRANDES SAGAS DISNEY VOL.14',
  'GRANDES SAGAS DISNEY VOL.14',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/3niuifUsjIFwpaIaQpSVRD67yvM=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/b2856782-eb29-11ef-a31a-8ed8743505f0.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01312',
  'GRANDES SAGAS DISNEY VOL.15',
  'GRANDES SAGAS DISNEY VOL.15',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/st8J0IFdMVFLhKsDGrf_yz_bH7I=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/b29386be-eb29-11ef-8fb2-6696cc3e9cb3.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01313',
  'GRANDES SAGAS DISNEY VOL.16',
  'GRANDES SAGAS DISNEY VOL.16',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/OfiipEtydNVjArTNSiRohGPhMqI=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/b2ad5094-eb29-11ef-a4f3-5a40d84dae09.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01314',
  'GRANDES SAGAS DISNEY VOL.17',
  'GRANDES SAGAS DISNEY VOL.17',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/AIAGNs4xMKq3PmlKuKCGKFhmLns=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/b0b34b24-ee29-11ef-89c5-b69feadf25d0.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01315',
  'GRANDES SAGAS DISNEY VOL.18',
  'GRANDES SAGAS DISNEY VOL.18',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/98eOowoTMT3_4UVwMMd1WVUIb-4=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/b4231da2-ee29-11ef-a605-7aa50978e4c8.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01316',
  'GRANDES SAGAS DISNEY VOL.19',
  'GRANDES SAGAS DISNEY VOL.19',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/nOtgDjXjTxAFh3SCPm9TVjcg424=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/d108de6c-f616-11ef-aca5-de7ac4d61988.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01317',
  'GRANDES SAGAS DISNEY VOL.20',
  'GRANDES SAGAS DISNEY VOL.20',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/uFb_IOJiJLrLsNvQLKAUEuXoopM=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/efa4dd02-0143-11f0-9a82-ca3c9ea74dec.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01318',
  'GRANDES SAGAS DISNEY VOL.21',
  'GRANDES SAGAS DISNEY VOL.21',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/7ZoLp6FYrt_Tw3fXbVHI8AyzeuM=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/a246b4ec-08c6-11f0-8fce-42d48cc2b562.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01319',
  'GRANDES SAGAS DISNEY VOL.22',
  'GRANDES SAGAS DISNEY VOL.22',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/ZvRzHHhudnMCIPHLF-UvEozva08=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/a2716d40-08c6-11f0-ac22-660c4bd9985d.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01320',
  'GRANDES SAGAS DISNEY VOL.23',
  'GRANDES SAGAS DISNEY VOL.23',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/guk9exa0i93RF1dDa2nBeYIy3LI=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/3106454a-a4ac-11f0-aa03-16ade38a6d4b.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01321',
  'GRANDES SAGAS DISNEY VOL.24',
  'GRANDES SAGAS DISNEY VOL.24',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/25ITFISKrIV3LQZE6MSA7wU-stQ=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/3108faf6-a4ac-11f0-9f2b-b616a40784ef.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01322',
  'GRANDES SAGAS DISNEY VOL.25',
  'GRANDES SAGAS DISNEY VOL.25',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/0Bm1lIPheDOPHOTrPmehXFUeeKA=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/31365e60-a4ac-11f0-9bb5-ee8f90996b43.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01323',
  'GRANDES SAGAS DISNEY VOL.26',
  'GRANDES SAGAS DISNEY VOL.26',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/JenbiecDDds0mwUfJconMksevJo=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/3137917c-a4ac-11f0-a599-8e83af06c4a6.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01324',
  'GRANDES SAGAS DISNEY VOL.27',
  'GRANDES SAGAS DISNEY VOL.27',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/xpayipW2QKGTxI7kOLI7GBJvetw=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/315d6604-a4ac-11f0-8bce-3af03c92463f.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01325',
  'GRANDES SAGAS DISNEY VOL.28',
  'GRANDES SAGAS DISNEY VOL.28',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/svw_44kL5QoDWiIk2k9Ntvi-1XQ=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/31610430-a4ac-11f0-aa03-16ade38a6d4b.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01326',
  'GRANDES SAGAS DISNEY VOL.29',
  'GRANDES SAGAS DISNEY VOL.29',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/CXzFYS2nZes1VgYdxZNaAEzw2Zg=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/318bf6f4-a4ac-11f0-aa03-16ade38a6d4b.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01327',
  'GRANDES SAGAS DISNEY VOL.30',
  'GRANDES SAGAS DISNEY VOL.30',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/Wir5tR5y9P_1MyYIHnACz_P_WdQ=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/318b8d04-a4ac-11f0-ac43-c20d3852b6b7.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01328',
  'GRAPHIC MSP (CAPA DURA)  N.1',
  'GRAPHIC MSP (CAPA DURA)  N.1',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/RknGLtZ512aGwi4ipAMRgokGA5k=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/80865caa-7fa9-11ef-b0bc-6e97175de7f7.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01329',
  'GRAPHIC MSP VL 27 - PENA N.1',
  'GRAPHIC MSP VL 27 - PENA N.1',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/ga4lMqKOAKYrxTa1ktppqxTCb2s=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/abae0b7e-d817-11ee-b124-5a86bcbeb6e3.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01330',
  'GRAPHIC MSP VL 28 - ASTR N.1',
  'GRAPHIC MSP VL 28 - ASTR N.1',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/kauRre68rAuahT-hC6JoIMk5yb8=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/2ed22534-de36-11ee-aae0-ca3362baf0a6.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01331',
  'GRAPHIC MSP VL.25-CAPITAO FEIO BROC',
  'GRAPHIC MSP VL.25-CAPITAO FEIO BROC',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/P013IUxyFl5rAp1rGyjgpx4PnEY=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/8020c2c2-da7d-11ee-999b-aaf7be4593ab.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01332',
  'GRAPHIC MSP VOL 28 - ASTRONAUTA: PARALLAX (REB)',
  'GRAPHIC MSP VOL 28 - ASTRONAUTA: PARALLAX (REB)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/JlYAYhyYyVzvSZp4pCGYn3QswWs=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/2032e336-6f3c-11f0-b703-524c1decb601.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01333',
  'GRAPHIC MSP VOL. 03 - CHICO BENTO: PARVOR ESPACIAR CD (REB)',
  'GRAPHIC MSP VOL. 03 - CHICO BENTO: PARVOR ESPACIAR CD (REB)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/7DbDzsGWS6Heuk2h6Hqs39NS3BQ=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/7e5ae030-da7d-11ee-999b-aaf7be4593ab.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01334',
  'GRAPHIC MSP VOL. 04 - PITECO: INGA CD (REB)',
  'GRAPHIC MSP VOL. 04 - PITECO: INGA CD (REB)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/gDpZ5LTFbMO5OIBn8-3EazAvkCs=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/8675dd94-d819-11ee-9675-5a86bcbeb6e3.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01335',
  'GRAPHIC MSP VOL. 06 - ASTRONAUTA: SINGULARIDADE CC',
  'GRAPHIC MSP VOL. 06 - ASTRONAUTA: SINGULARIDADE CC',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/Svd4sebaLGVdTCr6DrOsfjLqpN4=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/dcce0e6a-eb4a-11ef-8230-fa812316df6c.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01336',
  'GRAPHIC MSP VOL. 06 - ASTRONAUTA: SINGULARIDADE CD (REB)',
  'GRAPHIC MSP VOL. 06 - ASTRONAUTA: SINGULARIDADE CD (REB)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/RDA_-nnw_PM8lWD61nl-GJaj_bA=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/4689f7ca-5ea9-11f0-885d-4eae30e658d1.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01337',
  'GRAPHIC MSP VOL. 07 - PENADINHO: VIDA CD (REB 2)',
  'GRAPHIC MSP VOL. 07 - PENADINHO: VIDA CD (REB 2)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/IzKiAena99FmwzrSfuhBHg3B-SA=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/236ba252-d818-11ee-a1cf-e2e54ed5f9f7.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01338',
  'GRAPHIC MSP VOL. 10 - LOUCO: FUGA CD',
  'GRAPHIC MSP VOL. 10 - LOUCO: FUGA CD',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/got77dbaMIXHr6L9-JCCcbuFKz0=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/ce5e9194-63e4-11ef-a29c-e67413431efe.png"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01339',
  'GRAPHIC MSP VOL. 11 - PAPA CAPIM: NOITE BRANCA CD',
  'GRAPHIC MSP VOL. 11 - PAPA CAPIM: NOITE BRANCA CD',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/bpGkEIMnUKlC-mainDWT3fmWkLQ=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/ce6fb816-63e4-11ef-9c41-c67e4ff8d839.png"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01340',
  'GRAPHIC MSP VOL. 14 - ASTRONAUTA: ASSIMETRIA CD',
  'GRAPHIC MSP VOL. 14 - ASTRONAUTA: ASSIMETRIA CD',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/2lKHwcgtAv2UK4zfIriJTyurJPE=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/5d3586e2-5ea9-11f0-bc5c-8a0b5d172c0d.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01341',
  'GRAPHIC MSP VOL. 18 - JEREMIAS: PELE CD (REB4)',
  'GRAPHIC MSP VOL. 18 - JEREMIAS: PELE CD (REB4)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/DY1oQFLJu5IP-z9vdShq7YBsVUw=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/5d6c0258-5ea9-11f0-bc5c-8a0b5d172c0d.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01342',
  'GRAPHIC MSP VOL. 20 - CEBOLINHA: RECUPERACAO CD (REB2)',
  'GRAPHIC MSP VOL. 20 - CEBOLINHA: RECUPERACAO CD (REB2)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/4cwFDubrCAdVTffYN728OVzWQVY=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/2d215620-44b4-11f0-a1ec-1a73b65bfa37.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01343',
  'GRAPHIC MSP VOL. 23 - PITECO: FOGO CC',
  'GRAPHIC MSP VOL. 23 - PITECO: FOGO CC',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/Y8pFIdak9l5KBu5R1h-YrtE1I_M=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/04db26bc-98c6-11f0-a0a7-562d7a91d4d4.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01344',
  'GRAPHIC MSP VOL. 26 - CASCAO: TEMPORAL CD',
  'GRAPHIC MSP VOL. 26 - CASCAO: TEMPORAL CD',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/qTlNs3FyGTmn60qrHB49FJNZmcg=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/c6a56e64-63e4-11ef-a6a5-4248f5425adc.png"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01345',
  'GRAPHIC MSP VOL. 29 - JEREMIAS: ALMA CD',
  'GRAPHIC MSP VOL. 29 - JEREMIAS: ALMA CD',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/ar68d9tEBM1l3FJsdEp363JwwQE=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/ab67ffa8-d817-11ee-9a1e-da2373bc7c0b.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01346',
  'GRAPHIC MSP VOL. 36 - MINGAU: APEGO (REB)',
  'GRAPHIC MSP VOL. 36 - MINGAU: APEGO (REB)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/Hs1_3yOh4xawOv67AXSFl73gTks=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/22adc6e4-6f3c-11f0-a0bf-1abfc156ef81.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01347',
  'GRAPHIC MSP VOL. 39 - JEREMIAS: ESTRELA CD (REB)',
  'GRAPHIC MSP VOL. 39 - JEREMIAS: ESTRELA CD (REB)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/HFcdgnKkwkpEUf0z6JmSOyNTYQ4=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/dc5d2f98-d817-11ee-a3da-e2697ce33d53.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01348',
  'GRAPHIC MSP VOL. 42 - MARINA CC',
  'GRAPHIC MSP VOL. 42 - MARINA CC',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/AIAGNs4xMKq3PmlKuKCGKFhmLns=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/b0b34b24-ee29-11ef-89c5-b69feadf25d0.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01349',
  'GRAPHIC MSP VOL. 42 - MARINA CD',
  'GRAPHIC MSP VOL. 42 - MARINA CD',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/i9Q5wy_7BXB-aE4jak3gVfcwQ-4=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/e9072162-eb4a-11ef-8230-fa812316df6c.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01350',
  'GRAPHIC MSP VOL. 42 - XAVECO - VITÓRIA CD (REIMPRESSÃO)',
  'GRAPHIC MSP VOL. 42 - XAVECO - VITÓRIA CD (REIMPRESSÃO)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/6kDyf5wQFaeqk3xkSEP1ie24mOg=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/91037aac-4e7d-11ef-b7f8-22eb38681e4f.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();