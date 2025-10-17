-- SQL para importar produtos Brancaleone
-- Gerado em: 2025-10-17T17:52:46.765Z
-- Total de produtos: 3363
-- Fonte: brancaleone-products-1760723254011.json

-- 1. Criar distribuidor (se não existir)

-- Distribuidor já criado no batch-001

-- Lote 8 de 68
-- Produtos: 701 até 800



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00351',
  'ATAQUE DOS TITÃS - LUX E N.3',
  'ATAQUE DOS TITÃS - LUX E N.3',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/Vu_xpbAADRJhIBMoKiXXQeEMBSg=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/a8cd44a0-e583-11ee-acf8-7e6e8e2602ea.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00352',
  'ATAQUE DOS TITÃS - LUX E N.4',
  'ATAQUE DOS TITÃS - LUX E N.4',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/yd7v3p4De8V5t8NAGrkpE30uHLU=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/c2fdd93a-0125-11ef-9900-52ec7c1eeb4f.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00353',
  'ATAQUE DOS TITÃS - LUX E N.5',
  'ATAQUE DOS TITÃS - LUX E N.5',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/PYUmT5T9vgP2RZKaxpj_EAJlX4o=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/5bc3d86a-0cc8-11ef-8ff6-76f7089ef791.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00354',
  'ATAQUE DOS TITÃS - LUX E N.6',
  'ATAQUE DOS TITÃS - LUX E N.6',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/FqdEstgro9JyExWbdtpzjlmO5JQ=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/8f456ea2-22d9-11ef-8a6e-02c31119f10e.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00355',
  'ATAQUE DOS TITÃS - LUX E N.7',
  'ATAQUE DOS TITÃS - LUX E N.7',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/wHLX4_biYVSg-UD2kQKvLV7X9W0=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/710007bc-3fd1-11ef-ad89-5a355d509fb6.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00356',
  'ATAQUE DOS TITÃS - LUX E N.8',
  'ATAQUE DOS TITÃS - LUX E N.8',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/NOt-Pj9nafShSEzsQdPolXuwnTY=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/70fe07be-3fd1-11ef-9e50-eef13590f791.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00357',
  'ATAQUE DOS TITÃS - LUX EDITION  - 08 - BOX ESPECIAL',
  'ATAQUE DOS TITÃS - LUX EDITION  - 08 - BOX ESPECIAL',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/IOO9xF_2WSPHNbiNoR0hXMyODis=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/d1353634-63e4-11ef-9cd1-4e5286e17d7d.png"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00358',
  'ATAQUE DOS TITÃS - LUX EDITION N.9',
  'ATAQUE DOS TITÃS - LUX EDITION N.9',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/8YId9uFuBknSKL89FO247VAyJSo=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/8ab4bd52-7fa9-11ef-b1d0-12caec0ea15c.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00359',
  'ATAQUE DOS TITÃS - OUTSIDE',
  'ATAQUE DOS TITÃS - OUTSIDE',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/Ih866noYF8Pejr6ZNxVwNcJvc2k=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/0f1b770a-d818-11ee-a4a8-5a86bcbeb6e3.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00360',
  'ATAQUE DOS TITÃS N.23',
  'ATAQUE DOS TITÃS N.23',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/yr4UX5K5HZYudnufDxsD8AyHLlA=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/848a519c-4e7d-11ef-b438-b279561b7695.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00361',
  'ATAQUE DOS TITÃS N.34',
  'ATAQUE DOS TITÃS N.34',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/uhyVyk_nGpESVzHYKHescfY0NYs=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/847b4904-4e7d-11ef-8897-0ec18585415d.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00362',
  'ATAQUES ATLANTES (MARVEL OMNIBUS)',
  'ATAQUES ATLANTES (MARVEL OMNIBUS)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/MO5JkNyg3DSasF2gZqdHCuUgjaU=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/d0b1b0e4-eb47-11ef-9b12-caca51d8f271.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00363',
  'ATELIER OF WITCH HAT - 01 [REB 3]',
  'ATELIER OF WITCH HAT - 01 [REB 3]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/MonYdj03xru3GO4_rxkleC6V8AI=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/9da348fc-eb29-11ef-8b75-5ac0f052206d.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00364',
  'ATELIER OF WITCH HAT - 01 [REB 4]',
  'ATELIER OF WITCH HAT - 01 [REB 4]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/qJtFB6z-RQEc_b6Oimf-ij_KUDE=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/2ccbc1ce-44b4-11f0-90fa-7e281e739724.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00365',
  'ATELIER OF WITCH HAT - 02 [REB3]',
  'ATELIER OF WITCH HAT - 02 [REB3]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/z_I4YnM7jDYkily2Ey_S_gYKUaw=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/cfc14e20-0ea0-11f0-a3cc-368402dc316b.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00366',
  'ATELIER OF WITCH HAT - 03 [REB3]',
  'ATELIER OF WITCH HAT - 03 [REB3]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/n4a-GzCk-xyiwUh89o9NTl_IRFM=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/f06af866-9031-11f0-82c8-4a06203c34dc.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00367',
  'ATELIER OF WITCH HAT - 04 [REB4]',
  'ATELIER OF WITCH HAT - 04 [REB4]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/47GksXceBsH-SwYAKeo0HUekB3c=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/26ae435e-a4ac-11f0-84d7-06a1e9b2bf33.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00368',
  'ATELIER OF WITCH HAT - 06 [REB2]',
  'ATELIER OF WITCH HAT - 06 [REB2]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/LZ7iHDj7o1MuBQryg8qJ_8xb2jw=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/19b18d38-98c6-11f0-8324-461851874bd4.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00369',
  'ATOS DE VINGANCA (MARVEL OMNIBUS)',
  'ATOS DE VINGANCA (MARVEL OMNIBUS)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/KZxVsSA-nB3znd7vqfd7KP6B4K4=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/5dcc7374-0cc8-11ef-88d1-3619a1e0872c.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00370',
  'AVANTE VINGADORES (2022) N.14',
  'AVANTE VINGADORES (2022) N.14',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/RttUSEaDJT7ngnCpImMPCVncflI=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/b179e25e-d816-11ee-ae34-e2e54ed5f9f7.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00371',
  'AVANTE VINGADORES (2022) N.15',
  'AVANTE VINGADORES (2022) N.15',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/RgoN78lm7oHYL56LGCFXuG1lhCI=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/b2801060-d816-11ee-bb12-5a86bcbeb6e3.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00372',
  'AVANTE VINGADORES (2022) N.16',
  'AVANTE VINGADORES (2022) N.16',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/cmdcqCsk0lnf4gteMl2iHqCDdJk=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/b301cd30-d816-11ee-ae34-e2e54ed5f9f7.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00373',
  'AVANTE VINGADORES (2022) N.18',
  'AVANTE VINGADORES (2022) N.18',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/aPlKYX_DogQubNg6RS7oxONOckc=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/2ee617da-e497-11ee-83ff-7ee42cfe9644.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00374',
  'AVANTE VINGADORES (2022) N.19',
  'AVANTE VINGADORES (2022) N.19',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/80lf6HI7_QKMPgxRFFnS1AwMhgA=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/0677ff5a-f68c-11ee-9bed-06b95e62aa88.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00375',
  'AVANTE VINGADORES (2022) N.20',
  'AVANTE VINGADORES (2022) N.20',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/4R9MLYeQmlE3QJphuqwoAcgcyD8=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/03311cc8-069a-11ef-92f0-cafd48a576cd.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00376',
  'AVANTE VINGADORES (2022) N.21',
  'AVANTE VINGADORES (2022) N.21',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/g45MeJ3sRase9Xn530qby23oalY=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/8e260400-22d9-11ef-8d69-a628d09d11c2.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00377',
  'AVANTE VINGADORES (2022) N.22',
  'AVANTE VINGADORES (2022) N.22',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/iKq43J6o6z3qaLPsxRcEaN26InE=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/75029b6c-4e7d-11ef-b4c2-6e3d178325c8.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00378',
  'AVANTE VINGADORES (2022) N.23',
  'AVANTE VINGADORES (2022) N.23',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/wDlvcznm0TPvF6UfwUhP6GQoGOU=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/c10e9b9c-63e4-11ef-9c41-c67e4ff8d839.png"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00379',
  'AVANTE VINGADORES (2022) N.24',
  'AVANTE VINGADORES (2022) N.24',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/moUQkSs5B6r1kpTMDgo4TdDO1qM=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/c1476a94-63e4-11ef-a29c-e67413431efe.png"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00380',
  'AVANTE, VINGADORES (2022) N.25/07',
  'AVANTE, VINGADORES (2022) N.25/07',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/4Safnt8n3lS3Vtc_jySc2-Y3sNg=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/7d344cc4-7fa9-11ef-b1d0-12caec0ea15c.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00381',
  'AVANTE, VINGADORES (2022) N.26/08',
  'AVANTE, VINGADORES (2022) N.26/08',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/m3KZBHbpAQ-CCJYfdpM1HVwPo7o=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/a6d931a2-eb47-11ef-80c6-0ee70347c223.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00382',
  'AVANTE, VINGADORES (2022) N.27/09',
  'AVANTE, VINGADORES (2022) N.27/09',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/OZ-Fhpe_MsUj8quZsyjzabpyczE=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/a7883d3c-eb47-11ef-80c6-0ee70347c223.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00383',
  'AVANTE, VINGADORES (2022) N.28/10',
  'AVANTE, VINGADORES (2022) N.28/10',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/ocKcIva39VPOns-BU-AfThwnZUs=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/9062276c-eb29-11ef-a3b1-5681c2ac1d4b.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00384',
  'AVANTE, VINGADORES (2022) N.29/11',
  'AVANTE, VINGADORES (2022) N.29/11',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/vFL9XSUXCIyXlKYge1aGmn8ZDxA=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/907f67c8-eb29-11ef-913d-52f5d450f8a6.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00385',
  'AVANTE, VINGADORES (2022) N.30/12',
  'AVANTE, VINGADORES (2022) N.30/12',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/RTJusj14lBjE5w_DZZ62hdZmSrc=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/045dc406-f2f9-11ef-bcb5-dad79b85e12c.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00386',
  'AVANTE, VINGADORES (2022) N.31/13',
  'AVANTE, VINGADORES (2022) N.31/13',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/ruTzGiqh99lyrhRQOjBlG4y90mw=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/f044266e-0143-11f0-9602-e6e8567c501d.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00387',
  'AVANTE, VINGADORES (2022) N.32/14',
  'AVANTE, VINGADORES (2022) N.32/14',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/zY2F0XeBCXUo6BNwlKHx5GXzrGw=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/8dac2f54-3692-11f0-a057-ba7311aaaadc.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00388',
  'AVANTE, VINGADORES (2022) N.33/15',
  'AVANTE, VINGADORES (2022) N.33/15',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/v1SOYeULxKvKw0m-ZGeaHhMOdAg=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/d6fbdb82-3f2f-11f0-87b4-c2502d24ff3f.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00389',
  'AVANTE, VINGADORES (2022) N.34/16',
  'AVANTE, VINGADORES (2022) N.34/16',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/azLrXqXoFpU9M6SwbIjoukshaiI=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/307367d2-5ea9-11f0-885d-4eae30e658d1.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00390',
  'AVANTE, VINGADORES (2022) N.35/17',
  'AVANTE, VINGADORES (2022) N.35/17',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/e_BtXUjwwrPOyFTwLx8ujRLoJsI=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/20882932-69af-11f0-9a47-2e3660e82a7f.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00391',
  'AVANTE, VINGADORES (2022) N.36/18',
  'AVANTE, VINGADORES (2022) N.36/18',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/Pfu5ZZ_j5XvfDpkdeL8EuBmMbUc=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/45a93e76-7fd1-11f0-a5af-de5e70a27ff7.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00392',
  'AVANTE, VINGADORES (2022) N.37/19',
  'AVANTE, VINGADORES (2022) N.37/19',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/r8Q5wBp0LRGykWM_j97mkFPi52g=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/01013244-9032-11f0-ab2e-9a60b14b6cd5.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00393',
  'AVANTE, VINGADORES! (2022) N.12',
  'AVANTE, VINGADORES! (2022) N.12',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/MllExy8ekR0aKYTw_4qE7Jswd2U=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/af976060-d816-11ee-a833-6efcfa6dd7bd.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00394',
  'AVANTE, VINGADORES! (2022) N.13',
  'AVANTE, VINGADORES! (2022) N.13',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/hxuKv5Ty5HmccWU-DiV1AbyHF_8=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/b0740e66-d816-11ee-9ac4-da2373bc7c0b.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00395',
  'AVANTE, VINGADORES! (2022) N.17',
  'AVANTE, VINGADORES! (2022) N.17',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/NKmytDMlB_PsUum-oILZWM1EAbY=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/b3ed0c14-d816-11ee-9ac4-da2373bc7c0b.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00396',
  'AVENTURAS MARVEL (2023) N.08',
  'AVENTURAS MARVEL (2023) N.08',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/o3_WYmHHii3Pv0od56MIUkEydW4=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/480850ac-1705-11ef-a0bb-567d4742b137.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00397',
  'AVENTURAS MARVEL (2023) N.09',
  'AVENTURAS MARVEL (2023) N.09',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/sRd3q7Xn6d_0-k3Oin6rCp5M5nY=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/c15570bc-63e4-11ef-94a6-9a4f4e2cfd60.png"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00398',
  'AVENTURAS MARVEL (2023) N.10',
  'AVENTURAS MARVEL (2023) N.10',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/EPJRXt0ndNnrbGqoa1y6dCzBzt0=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/a96927ba-eb47-11ef-80c6-0ee70347c223.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00399',
  'AVENTURAS MARVEL (2023) N.11',
  'AVENTURAS MARVEL (2023) N.11',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/n12yWJF1w3qz9oiCLTOpW59PoFk=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/04d1466a-f2f9-11ef-a845-b2c26c8c0dcc.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00400',
  'AVENTURAS MARVEL (2023) N.12',
  'AVENTURAS MARVEL (2023) N.12',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/CaibQcee9DoJ03rqZxtGNmEb-04=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/b99e26d8-f616-11ef-bc96-4e2fbf8e6f25.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();