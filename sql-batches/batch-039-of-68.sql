-- SQL para importar produtos Brancaleone
-- Gerado em: 2025-10-17T17:52:46.765Z
-- Total de produtos: 3363
-- Fonte: brancaleone-products-1760723254011.json

-- 1. Criar distribuidor (se não existir)

-- Distribuidor já criado no batch-001

-- Lote 39 de 68
-- Produtos: 3801 até 3900



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01901',
  'MITOS MARVEL (MARVEL ESSENCIAIS)',
  'MITOS MARVEL (MARVEL ESSENCIAIS)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/2tXk-N-dbNIt1umXLPkky0a20ro=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/c809edc4-f616-11ef-8e8f-2263951fa8a2.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01902',
  'MOB PSYCHO 100 (2 EM 1) - 07',
  'MOB PSYCHO 100 (2 EM 1) - 07',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/WQ5B02A00os79nTq3taEQUodclk=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/eb35661a-eb4a-11ef-8230-fa812316df6c.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01903',
  'MOB PSYCHO 100 (2 EM 1) - 08',
  'MOB PSYCHO 100 (2 EM 1) - 08',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/tqGJgGmUS1k1HU6dHZQyvRFtBEw=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/a2728b04-eb29-11ef-b7b8-460343881edd.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01904',
  'MOB PSYCHO 100 (2 IN 1) N.2',
  'MOB PSYCHO 100 (2 IN 1) N.2',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/CZCGz7Af814exHlDJLuGJ1RI0-s=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/4a9ddb52-1705-11ef-a0bb-567d4742b137.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01905',
  'MOB PSYCHO 100 (2 IN 1) N.3',
  'MOB PSYCHO 100 (2 IN 1) N.3',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/TrxNb7i7H5GzfS7HmpqqWCpvoZk=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/97327662-2461-11ef-b00f-3eff3e6e8cf3.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01906',
  'MOB PSYCHO 100 (2 IN 1) N.4',
  'MOB PSYCHO 100 (2 IN 1) N.4',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/tUKczQsYtuPBaFeN2xO7zEon38w=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/89bed476-4e7d-11ef-b7f8-22eb38681e4f.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01907',
  'MOB PSYCHO 100 (2 IN 1) N.5',
  'MOB PSYCHO 100 (2 IN 1) N.5',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/DFvbOOF01iOsAezNllfM68YrTx0=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/db764fb6-7faa-11ef-92e2-6e97175de7f7.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01908',
  'MOB PSYCHO 100 (2 IN 1) N.6',
  'MOB PSYCHO 100 (2 IN 1) N.6',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/hV1UYUZlKKMrB1f4A6kmeDOVlqs=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/868657f4-7fa9-11ef-b1d0-12caec0ea15c.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01909',
  'MOB PSYCHO 100 N.3',
  'MOB PSYCHO 100 N.3',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/nVeFFIXTVWB495Dwqbdl_RK5Ea0=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/7f91f3b6-4e7d-11ef-8063-de10c0ad3180.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01910',
  'MOCA-GAVIAO: ERA UMA VEZ NA GALAXIA',
  'MOCA-GAVIAO: ERA UMA VEZ NA GALAXIA',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/BlQA42t8Yg6_PQnq_JDLMwR_rSI=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/eb672646-eb4a-11ef-8230-fa812316df6c.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01911',
  'MONICA (2021-) N.71',
  'MONICA (2021-) N.71',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/J3-Miac-c4meFKZc1RBhBYHplaE=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/a2bb6ad6-eb29-11ef-89a1-ce85303a26c9.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01912',
  'MONICA (2021-) N.73',
  'MONICA (2021-) N.73',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/207qhLli8nJLkJG9p7I4cqS8lDE=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/1ea7b2ea-f2f9-11ef-b4d2-824ddcc154a5.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01913',
  'MONICA (2021-) N.74',
  'MONICA (2021-) N.74',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/RqLIGbUjpw8ituttvGq601RwZD0=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/04670b56-98c6-11f0-a1e5-96752bc1e838.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01914',
  'MONICA (2021-) N.75',
  'MONICA (2021-) N.75',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/_YYjS8UF4AKfQv0AnHTgC38lBGA=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/8ddef722-08c5-11f0-929e-b63aa6c6321e.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01915',
  'MONICA (2021-) N.77',
  'MONICA (2021-) N.77',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/SdtFpidz29cHi77XDH_VvF-wn1Q=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/c6ca976a-642a-11f0-8267-3613efe5cfce.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01916',
  'MONICA (2021-) N.78',
  'MONICA (2021-) N.78',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/ypdrCFSji_65dsWkv_ikYBJn4E4=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/59d53012-2473-11f0-ae86-ee28d381db1d.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01917',
  'MONICA (2021-) N.79',
  'MONICA (2021-) N.79',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/XWQaM6FInOG-aWM1S7_ICpFg-Rc=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/90f07f1c-3692-11f0-8d7f-ba18af294916.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01918',
  'MONICA (2021-) N.80',
  'MONICA (2021-) N.80',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/aZtiYUIR4dwg9xyP8jvEoMmIMGw=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/dd926c72-3f2f-11f0-87b4-c2502d24ff3f.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01919',
  'MONICA (2021-) N.81',
  'MONICA (2021-) N.81',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/OovqdkdTsflrVVHfiJ90y8Z39vs=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/1f2f6fc8-48b7-11f0-98d1-7a925bb2c122.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01920',
  'MONICA (2021-) N.82',
  'MONICA (2021-) N.82',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/JZNWoRmVoIgodPl24_JMJNi4-HA=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/5cfab76a-5ea9-11f0-bc5c-8a0b5d172c0d.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01921',
  'MONICA (2021-) N.83',
  'MONICA (2021-) N.83',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/KUde903GxkFXEQzhJvsyEnVLJu8=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/5d1db3fa-5ea9-11f0-a034-4eae30e658d1.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01922',
  'MONICA (2021-) N.84',
  'MONICA (2021-) N.84',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/JZNWoRmVoIgodPl24_JMJNi4-HA=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/5cfab76a-5ea9-11f0-bc5c-8a0b5d172c0d.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01923',
  'MONICA (2021-) N.85',
  'MONICA (2021-) N.85',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/DzaMvBmW9CHCANhcKnzUCtLFSTA=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/3ff7332a-7fd1-11f0-b894-2e1dcafaddd0.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01924',
  'MONICA (2021-) N.86',
  'MONICA (2021-) N.86',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/0NbJsu0q4XEwBH4PMvbNEAFkZbw=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/40117d52-7fd1-11f0-b894-2e1dcafaddd0.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01925',
  'MONICA (2021-) N.87',
  'MONICA (2021-) N.87',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/ITRYklkQK8mSEUEWvd4m-aeELkU=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/04a75af8-98c6-11f0-8505-daad91d7053f.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01926',
  'MONICA (2021-) N.88',
  'MONICA (2021-) N.88',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/FChrFCUATs1yQJIH7VxKj6z-rno=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/27ed6a74-a4ac-11f0-8b51-cad07a812184.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01927',
  'MÔNICA 60 ANOS',
  'MÔNICA 60 ANOS',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/FA-5Pm7f674D1kw3nvDdBvcZOLg=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/40797210-de36-11ee-aae0-ca3362baf0a6.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01928',
  'MONICA ESPECIAL DE NATAL N.18',
  'MONICA ESPECIAL DE NATAL N.18',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/mjumfeLcwc--SIFVUlFZTUB3kJc=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/ed87856a-eb4a-11ef-8230-fa812316df6c.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01929',
  'MONICA RAMBEAU, FÓTON (2024) N.1',
  'MONICA RAMBEAU, FÓTON (2024) N.1',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/tP4o_1tBaVKRWdecSr4a5O89ew4=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/08c4cfd6-f68c-11ee-83aa-7e15a8284984.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01930',
  'MÔNICA VOL.02: 1971 (BIBLIOTECA MAURICIO DE SOUSA) (REB)',
  'MÔNICA VOL.02: 1971 (BIBLIOTECA MAURICIO DE SOUSA) (REB)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/ji3i2nzBOfNPgbE2-H6nbemV6ko=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/8e2a5abe-3692-11f0-8b35-7a3a9a708959.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01931',
  'MONICA VOL.04: 1973 (BIBLIOTECA MAURICIO DE SOUSA)',
  'MONICA VOL.04: 1973 (BIBLIOTECA MAURICIO DE SOUSA)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/A6zI8_7jG9_iQqLhulGoN1R6I8c=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/ed6843ac-d89b-11ee-9200-42b2dff02d11.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01932',
  'MÔNICA: FORÇA (GRAPHIC MSP VOL.12) (REB)',
  'MÔNICA: FORÇA (GRAPHIC MSP VOL.12) (REB)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/qs0djK_nXCwDy_CnPcR7RyjHv4k=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/ddef71a6-3f2f-11f0-87b4-c2502d24ff3f.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01933',
  'MONICA: TESOUROS (GRAPHIC MSP VOL. 22) (REB)',
  'MONICA: TESOUROS (GRAPHIC MSP VOL. 22) (REB)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/XQ-GGVKXp4jas8-QGxWKvCTP1Q8=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/8dfd597a-d819-11ee-9675-5a86bcbeb6e3.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01934',
  'MONONOGATARI: ESPIRITOS POSSESSORES VOL.01',
  'MONONOGATARI: ESPIRITOS POSSESSORES VOL.01',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/ev1ucNjQ08Av5V_YbGYlZZMMFb0=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/7f036d60-d819-11ee-947a-32937b3ded24.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01935',
  'MONONOGATARI: ESPIRITOS POSSESSORES VOL.02',
  'MONONOGATARI: ESPIRITOS POSSESSORES VOL.02',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/tQosZYIint06aNU-I0l5Pp3zlLA=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/7f2a2bbc-d819-11ee-83df-e2e54ed5f9f7.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01936',
  'MONONOGATARI: ESPIRITOS POSSESSORES VOL.03',
  'MONONOGATARI: ESPIRITOS POSSESSORES VOL.03',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/Wwvzm3T0I7WFgGLB4eSmsGwS7Wo=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/7facab82-d819-11ee-bb5a-de7d367e92b3.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01937',
  'MONONOGATARI: ESPIRITOS POSSESSORES VOL.04',
  'MONONOGATARI: ESPIRITOS POSSESSORES VOL.04',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/c5QE9COlBjUtSu6Itnqln9p_ag4=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/7fea5dd8-d819-11ee-83df-e2e54ed5f9f7.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01938',
  'MONONOGATARI: ESPIRITOS POSSESSORES VOL.05',
  'MONONOGATARI: ESPIRITOS POSSESSORES VOL.05',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/hSKCvPTO_RVyNQQp1iBx3hOT1lg=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/806c43ca-d819-11ee-bb5a-de7d367e92b3.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01939',
  'MONONOGATARI: ESPIRITOS POSSESSORES VOL.06',
  'MONONOGATARI: ESPIRITOS POSSESSORES VOL.06',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/lJX8yvpLyxwH_Q2sZOGCYb-osnE=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/8097036c-d819-11ee-9675-5a86bcbeb6e3.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01940',
  'MONONOGATARI: ESPIRITOS POSSESSORES VOL.07',
  'MONONOGATARI: ESPIRITOS POSSESSORES VOL.07',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/0b2qO7jJjU1qBk1LXiD42eXLsYA=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/8140c636-d819-11ee-947a-32937b3ded24.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01941',
  'MONONOGATARI: ESPIRITOS POSSESSORES VOL.08',
  'MONONOGATARI: ESPIRITOS POSSESSORES VOL.08',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/UPvYx1nh-h4KhGxcPhHc8FXhJP8=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/81ae8356-d819-11ee-947a-32937b3ded24.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01942',
  'MONONOGATARI: ESPIRITOS POSSESSORES VOL.09',
  'MONONOGATARI: ESPIRITOS POSSESSORES VOL.09',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/_El7dWAzdx0iBWVUCfAQPXzKGy0=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/1863961e-d89d-11ee-aa2c-d6162862a756.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01943',
  'MONONOGATARI: ESPIRITOS POSSESSORES VOL.10',
  'MONONOGATARI: ESPIRITOS POSSESSORES VOL.10',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/9miYp2g5iioKeZ0VLhHQ6KKv53I=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/2f97679c-ebef-11ee-963f-1e73add0c60b.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01944',
  'MONONOGATARI: ESPIRITOS POSSESSORES VOL.11',
  'MONONOGATARI: ESPIRITOS POSSESSORES VOL.11',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/E7weWD0Rfa7wUTHgHWMB1p_2nf0=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/1dd77b8a-069a-11ef-92f0-cafd48a576cd.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01945',
  'MONONOGATARI: ESPIRITOS POSSESSORES VOL.12',
  'MONONOGATARI: ESPIRITOS POSSESSORES VOL.12',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/KKFjxQHR5kPpT9VRwjnD0N2XjfY=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/255e346e-2ce4-11ef-b5ff-6292e5e0d832.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01946',
  'MONONOGATARI: ESPIRITOS POSSESSORES VOL.13',
  'MONONOGATARI: ESPIRITOS POSSESSORES VOL.13',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/B9QcGoFdxZRX3hSAiHMwg1RbjTU=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/8a559cee-4e7d-11ef-843b-e2b73938f46c.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01947',
  'MONONOGATARI: ESPIRITOS POSSESSORES VOL.14',
  'MONONOGATARI: ESPIRITOS POSSESSORES VOL.14',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/kv8JBxJJAhid3iKFr3gxr_WJNIo=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/86de2ef2-7fa9-11ef-b1d0-12caec0ea15c.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01948',
  'MONONOGATARI: ESPIRITOS POSSESSORES VOL.15',
  'MONONOGATARI: ESPIRITOS POSSESSORES VOL.15',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/pZYijm9FQqKAgyAMWYkCcIhqDNc=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/ed027a82-eb4a-11ef-8621-0ee70347c223.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01949',
  'MONONOGATARI: ESPIRITOS POSSESSORES VOL.16',
  'MONONOGATARI: ESPIRITOS POSSESSORES VOL.16',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/NssbhhCpQMosfibtJelS6H6Vx7M=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/59e7029c-2473-11f0-9552-3254c5e6fae0.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01950',
  'MONSTER KANZENBAN - 01 [REB5]',
  'MONSTER KANZENBAN - 01 [REB5]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/LavG4XYR75NZxMR4x7soTnDD2Ek=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/231f32c0-6f3c-11f0-8769-2eac7e5777cf.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();