-- SQL para importar produtos Brancaleone
-- Gerado em: 2025-10-17T18:20:53.612Z
-- Total de produtos: 3363
-- Fonte: brancaleone-products-1760723254011.json

-- 1. Criar distribuidor (se não existir)

-- Distribuidor já criado no batch-001

-- Lote 66 de 68
-- Produtos: 6501 até 6600



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-03251',
  'WHAT IF...? MILES MORALES',
  'WHAT IF...? MILES MORALES',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/WNlF472OEqRZbtEM4Recnhdvfcs=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/c7bab1da-d8a0-11ee-82f3-be3c8dbb0cbf.jpg"]'::jsonb,
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
  'PROD-03252',
  'WILD STRAWBERRY - 01',
  'WILD STRAWBERRY - 01',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/6JeSbDfu-zwrK9EyOEtprqAUZcI=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/22ca44b4-48b7-11f0-955a-6e14298b474f.jpg"]'::jsonb,
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
  'PROD-03253',
  'WILD STRAWBERRY - 2',
  'WILD STRAWBERRY - 2',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/ggXXTFSqFPJ24Wi5NVYx2rSlBAA=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/2d5e9b9a-a4ac-11f0-a72e-eecb83d78201.jpg"]'::jsonb,
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
  'PROD-03254',
  'WILDCATS POR JIM LEE - EDICAO ABSOLUTA',
  'WILDCATS POR JIM LEE - EDICAO ABSOLUTA',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/1QQiMo-YffUCauje8grXoDGGHpE=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/4e987aee-de36-11ee-b2b6-3e63d4f4f6bf.jpg"]'::jsonb,
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
  'PROD-03255',
  'WIND BREAKER - 02',
  'WIND BREAKER - 02',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/eaQ2DeoWMhMeIt8AOBqm3rtoWcM=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/be9aaed8-d81a-11ee-9df9-5a86bcbeb6e3.jpg"]'::jsonb,
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
  'PROD-03256',
  'WIND BREAKER - 03',
  'WIND BREAKER - 03',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/NLFqOxBp0z8sbONepNYmZ7Bihns=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/beed8cc0-d81a-11ee-ae87-e2e54ed5f9f7.jpg"]'::jsonb,
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
  'PROD-03257',
  'WIND BREAKER - 07',
  'WIND BREAKER - 07',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/f9eBQkvYdzNzjQoMX_7eJ3E9Pfg=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/c1ea0246-d81a-11ee-ae87-e2e54ed5f9f7.jpg"]'::jsonb,
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
  'PROD-03258',
  'WIND BREAKER - 14',
  'WIND BREAKER - 14',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/-eeZDyHlSIBcWvhNBSpAs9HczzQ=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/d414d65a-eb4a-11ef-8621-0ee70347c223.jpg"]'::jsonb,
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
  'PROD-03259',
  'WIND BREAKER - 15',
  'WIND BREAKER - 15',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/qaosHdJGqCyaXpoVqd7BEy7y2nk=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/b103a1da-eb29-11ef-9e36-2a856f41baa0.jpg"]'::jsonb,
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
  'PROD-03260',
  'WIND BREAKER - 16',
  'WIND BREAKER - 16',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/5AJJTwaVy4dTnGvYo70eTb3H65s=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/d0638070-f616-11ef-b0f5-5ac998efac6d.jpg"]'::jsonb,
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
  'PROD-03261',
  'WIND BREAKER - 17',
  'WIND BREAKER - 17',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/kRZMMxlZmsTcSLOGDxoJHd-JXSE=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/d160c044-0ea0-11f0-a36e-d2c6f4bb5d37.jpg"]'::jsonb,
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
  'PROD-03262',
  'WIND BREAKER - 18',
  'WIND BREAKER - 18',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/wXttlPG82AtWWoSVRXJotVfka3M=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/5d2e5b76-2473-11f0-9f5d-3a5555ec2c23.jpg"]'::jsonb,
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
  'PROD-03263',
  'WIND BREAKER - 19',
  'WIND BREAKER - 19',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/HM8dXGFF0SIP48f-NReVEe9-As4=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/2c844300-a4ac-11f0-9bb5-ee8f90996b43.jpg"]'::jsonb,
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
  'PROD-03264',
  'WIND BREAKER - 20',
  'WIND BREAKER - 20',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/-i2e3WRAlbmdu1X7Z9rrf7YA218=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/2c6fae0e-a4ac-11f0-8687-a638114deac1.jpg"]'::jsonb,
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
  'PROD-03265',
  'WIND BREAKER N.10',
  'WIND BREAKER N.10',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/AOXj02vF6vR7xfPdq_OL-lOYnQQ=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/281742ea-2ce4-11ef-85d7-fe958ee5f17f.jpg"]'::jsonb,
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
  'PROD-03266',
  'WIND BREAKER N.11',
  'WIND BREAKER N.11',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/rrhS14XT2JSvWpOHOWkWPUJ_xLI=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/90db5ba8-4e7d-11ef-8897-0ec18585415d.jpg"]'::jsonb,
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
  'PROD-03267',
  'WIND BREAKER N.12',
  'WIND BREAKER N.12',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/qppt--9wilZiV0mzS53Qps1lHXY=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/8b839dca-7fa9-11ef-b1d0-12caec0ea15c.jpg"]'::jsonb,
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
  'PROD-03268',
  'WIND BREAKER N.13',
  'WIND BREAKER N.13',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/WV7iXehHnV7T33IpfpMgby8Q-zk=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/8b8906e8-7fa9-11ef-b0bc-6e97175de7f7.jpg"]'::jsonb,
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
  'PROD-03269',
  'WIND BREAKER N.4',
  'WIND BREAKER N.4',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/5DF3qFIftVJz5xU5ImVxlNeKLpA=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/c0df6634-d81a-11ee-ae87-e2e54ed5f9f7.jpg"]'::jsonb,
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
  'PROD-03270',
  'WIND BREAKER N.5',
  'WIND BREAKER N.5',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/hyp62wzCpLzyJU4wljiB1a6UKUk=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/c11b6102-d81a-11ee-9df9-5a86bcbeb6e3.jpg"]'::jsonb,
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
  'PROD-03271',
  'WIND BREAKER N.6',
  'WIND BREAKER N.6',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/BYvUlUnhNj51aroqyXgKpY1GQkk=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/c1bcdda2-d81a-11ee-9df9-5a86bcbeb6e3.jpg"]'::jsonb,
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
  'PROD-03272',
  'WIND BREAKER N.8',
  'WIND BREAKER N.8',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/SVX3SGVgr77CkF90V1JqhmRjtrM=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/4e7a396e-e497-11ee-b6a7-e2b250ff01a0.jpg"]'::jsonb,
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
  'PROD-03273',
  'WIND BREAKER N.9',
  'WIND BREAKER N.9',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/wjVDaR4G1pPKcLsZJ4chcgmo7U0=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/553b898c-fb7c-11ee-a932-f249d1132836.jpg"]'::jsonb,
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
  'PROD-03274',
  'WOLVERINE & NICK FURY: CONEXAO SCORPIO (MARVEL GRAPHIC NOVEL',
  'WOLVERINE & NICK FURY: CONEXAO SCORPIO (MARVEL GRAPHIC NOVEL',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/kYnCeO9x9ib7WGj8-bR_tFhOoSM=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/ccb64a70-d817-11ee-86d3-ce469b473a25.jpg"]'::jsonb,
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
  'PROD-03275',
  'WOLVERINE (2022) N.02',
  'WOLVERINE (2022) N.02',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/-HR5-Frf_JwEwH2LwtdeHXCACR0=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/c7faf8ca-d81a-11ee-9df9-5a86bcbeb6e3.jpg"]'::jsonb,
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
  'PROD-03276',
  'WOLVERINE (2022) N.07',
  'WOLVERINE (2022) N.07',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/3qtv3jhfUSkcPJu8u8qf0KprL5Y=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/cb001aaa-d81a-11ee-8b82-06e22cdb7792.jpg"]'::jsonb,
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
  'PROD-03277',
  'WOLVERINE (2022) N.09',
  'WOLVERINE (2022) N.09',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/sdvykY9cO0BjvfbqL64MzUQTixo=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/cbca1ac6-d81a-11ee-9df9-5a86bcbeb6e3.jpg"]'::jsonb,
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
  'PROD-03278',
  'WOLVERINE (2022) N.10',
  'WOLVERINE (2022) N.10',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/wVtmV-QIh2nhNoNs5tMOMmYWc5M=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/cc3dccb4-d81a-11ee-98f1-c6f956d4b586.jpg"]'::jsonb,
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
  'PROD-03279',
  'WOLVERINE (2022) N.11',
  'WOLVERINE (2022) N.11',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/YF3PlSRH3ZWFDxx25piHPcVTXBA=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/ccaae8d0-d81a-11ee-8b82-06e22cdb7792.jpg"]'::jsonb,
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
  'PROD-03280',
  'WOLVERINE (2022) N.12',
  'WOLVERINE (2022) N.12',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/IJ-Uud0yPJnVLEd3lS66WAs4xgs=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/ccdaad40-d81a-11ee-98f1-c6f956d4b586.jpg"]'::jsonb,
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
  'PROD-03281',
  'WOLVERINE (2022) N.13',
  'WOLVERINE (2022) N.13',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/H0XGl_gcvyY2x5Fgc1PQRo0td4s=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/c826d018-d8a0-11ee-b8d0-26337c3739c7.jpg"]'::jsonb,
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
  'PROD-03282',
  'WOLVERINE (2022) N.17',
  'WOLVERINE (2022) N.17',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/GBztbxPTJ8v66uzmUzHL3-E_PYE=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/5cdd98a8-0cc8-11ef-88d1-3619a1e0872c.jpg"]'::jsonb,
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
  'PROD-03283',
  'WOLVERINE (2022) N.18',
  'WOLVERINE (2022) N.18',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/8Alw5Y7_1lCWxKIQrKx6bHZSORI=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/2ccdb166-a4ac-11f0-a72e-eecb83d78201.jpg"]'::jsonb,
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
  'PROD-03284',
  'WOLVERINE (2022) N.19',
  'WOLVERINE (2022) N.19',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/5GhHz3L63qJg-49PKieIO31CebI=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/90f3544c-4e7d-11ef-8c92-9adb7952e04b.jpg"]'::jsonb,
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
  'PROD-03285',
  'WOLVERINE (2022) N.22',
  'WOLVERINE (2022) N.22',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/IJU5MqGZSimExacWorynYcFYHEg=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/d47e6d0e-eb4a-11ef-a198-2a5f63e8aebc.jpg"]'::jsonb,
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
  'PROD-03286',
  'WOLVERINE (2022) N.24',
  'WOLVERINE (2022) N.24',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/euCemDIhdX1tQmaWesERT1chw6A=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/b130dc86-eb29-11ef-a31a-8ed8743505f0.jpg"]'::jsonb,
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
  'PROD-03287',
  'WOLVERINE (2022) N.25',
  'WOLVERINE (2022) N.25',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/4qF6r4cvTaDnuArSvctaJ-JqZ-E=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/b14ae0b8-eb29-11ef-b7b8-460343881edd.jpg"]'::jsonb,
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
  'PROD-03288',
  'WOLVERINE (2022) N.27',
  'WOLVERINE (2022) N.27',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/3ClcH7gk5No-2cwv0E5qtI_g06Y=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/014ba220-feba-11ef-a189-ea2ec8e8c791.jpg"]'::jsonb,
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
  'PROD-03289',
  'WOLVERINE (2022) N.28',
  'WOLVERINE (2022) N.28',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/XxmvXG6D0MVQBgKTJeDCyfvdKfw=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/2d36fc66-a4ac-11f0-8bce-3af03c92463f.jpg"]'::jsonb,
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
  'PROD-03290',
  'WOLVERINE (2022) N.29',
  'WOLVERINE (2022) N.29',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/A9U4OaUOBLMZdBz02HGxgKJKU34=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/8d2c4f96-3692-11f0-b775-ca6651de2295.jpg"]'::jsonb,
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
  'PROD-03291',
  'WOLVERINE (2025) N.01',
  'WOLVERINE (2025) N.01',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/__1EqhrFTGCu6qymSjnqS6xa-5E=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/2025de9e-69af-11f0-a796-ae0a374fc493.jpg"]'::jsonb,
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
  'PROD-03292',
  'WOLVERINE (2025) N.02',
  'WOLVERINE (2025) N.02',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/ccCIgQyU3-16tMR2eP3smco0br4=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/2c9b3b5a-a4ac-11f0-8687-a638114deac1.jpg"]'::jsonb,
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
  'PROD-03293',
  'WOLVERINE (2025) N.03',
  'WOLVERINE (2025) N.03',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/iNybNBct-2j_ghSRnQBvhgI2gzw=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/2d10ea9e-a4ac-11f0-aa03-16ade38a6d4b.jpg"]'::jsonb,
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
  'PROD-03294',
  'WOLVERINE: AVENTURA NA SELVA E OUTRAS HISTORIAS (MARVEL VINT',
  'WOLVERINE: AVENTURA NA SELVA E OUTRAS HISTORIAS (MARVEL VINT',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/Y95JngqhVIxl4JSeUTlunGZ_Kbk=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/4f40de50-de36-11ee-9846-6255a87f72d4.jpg"]'::jsonb,
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
  'PROD-03295',
  'WOLVERINE: DURO DE MATAR (MARVEL ESSENCIAIS)',
  'WOLVERINE: DURO DE MATAR (MARVEL ESSENCIAIS)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/R-Lb5OHy_R3LhKfDkcT3ckEFtvs=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/41c427f6-2475-11f0-97b4-baa1f40e9fb8.jpg"]'::jsonb,
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
  'PROD-03296',
  'WOLVERINE: INIMIGO DO ESTADO (MARVEL ESSENCIAIS)',
  'WOLVERINE: INIMIGO DO ESTADO (MARVEL ESSENCIAIS)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/n3-_MSAXq1NaMzJnnyQq32Q9d6k=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/d631d0c4-d817-11ee-9a1e-da2373bc7c0b.jpg"]'::jsonb,
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
  'PROD-03297',
  'WOLVERINE: LOGAN N.1',
  'WOLVERINE: LOGAN N.1',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/5_j2-pHErExhk0YuO_qFMzWwCe0=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/d39a0950-119a-11ef-bcb1-8607d1df3044.jpg"]'::jsonb,
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
  'PROD-03298',
  'WOLVERINE: O VELHO LOGAN N.1',
  'WOLVERINE: O VELHO LOGAN N.1',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/XGO9rdEBpkT8wADupjV5FFEkotI=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/47d08186-1705-11ef-a0bb-567d4742b137.jpg"]'::jsonb,
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
  'PROD-03299',
  'WOLVERINE: SEXO E VIOLENCIA N.6',
  'WOLVERINE: SEXO E VIOLENCIA N.6',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/Stct14zIuMe7wohxrAquHupQdUA=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/e9703a1c-3ec0-11ef-aeea-dedc6e01507c.jpeg"]'::jsonb,
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
  'PROD-03300',
  'WOTAKOI: O AMOR É DIFÍCIL PARA OTAKUS - 05 [REB2]',
  'WOTAKOI: O AMOR É DIFÍCIL PARA OTAKUS - 05 [REB2]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/NMsR-LDfjKD6zybTx9ajOQvmeqU=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/8cbfd8d6-d818-11ee-82a8-e2697ce33d53.jpg"]'::jsonb,
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