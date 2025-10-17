-- SQL para importar produtos Brancaleone
-- Gerado em: 2025-10-17T18:20:53.612Z
-- Total de produtos: 3363
-- Fonte: brancaleone-products-1760723254011.json

-- 1. Criar distribuidor (se não existir)

-- Distribuidor já criado no batch-001

-- Lote 7 de 68
-- Produtos: 601 até 700



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00301',
  'AS MELHORES HISTORIAS DA MONICA N.2',
  'AS MELHORES HISTORIAS DA MONICA N.2',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/assSVNSuEhRIhLXeoTNCRiKyN6s=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/aa5487e8-e583-11ee-8165-7ec3420f8e17.jpg"]'::jsonb,
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
  'PROD-00302',
  'AS MELHORES HISTORIAS DA MONICA N.3',
  'AS MELHORES HISTORIAS DA MONICA N.3',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/sjMNQ1rCzFi_FOzavek260S8QnY=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/573cb620-fb7c-11ee-bf53-e27a9dd5d6a4.jpg"]'::jsonb,
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
  'PROD-00303',
  'AS MELHORES HISTORIAS DA MONICA N.4',
  'AS MELHORES HISTORIAS DA MONICA N.4',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/vPXNa4jEZrHByTxEqEd6JtYb4xc=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/1acfd17a-3350-11ef-a4d4-c22e1cdb1c4a.jpg"]'::jsonb,
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
  'PROD-00304',
  'AS MELHORES HISTORIAS DO CASCAO N.1 BOX',
  'AS MELHORES HISTORIAS DO CASCAO N.1 BOX',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/XPdlMv8LZ-RyAnyCr782bH1iuas=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/aa3bf566-ee29-11ef-8407-02478a88c6f1.jpg"]'::jsonb,
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
  'PROD-00305',
  'AS MELHORES HISTORIAS DO CASCAO N.2',
  'AS MELHORES HISTORIAS DO CASCAO N.2',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/s51sBW3bAGnyVtE8wiFb9iGU67k=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/b2cb800a-eb47-11ef-80c6-0ee70347c223.jpg"]'::jsonb,
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
  'PROD-00306',
  'AS MELHORES HISTORIAS DO CASCAO N.3',
  'AS MELHORES HISTORIAS DO CASCAO N.3',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/EhGdVOvi5Q2jOjkXBrurDB-3KOw=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/aa4186a2-ee29-11ef-9624-227a9b128a4e.jpg"]'::jsonb,
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
  'PROD-00307',
  'AS MELHORES HISTORIAS DO CASCAO N.4',
  'AS MELHORES HISTORIAS DO CASCAO N.4',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/arxwy1IYKegrn2F9xd4aIcIhNJI=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/9241f1d4-eb29-11ef-913d-52f5d450f8a6.jpg"]'::jsonb,
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
  'PROD-00308',
  'AS MELHORES HISTÓRIAS DO CEBOLINHA N. 1 (BOX)',
  'AS MELHORES HISTÓRIAS DO CEBOLINHA N. 1 (BOX)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/XkD4o4XS-xfppVuA5tQOcw_cGKU=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/c292f26a-63e4-11ef-a28d-a27a78b28783.png"]'::jsonb,
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
  'PROD-00309',
  'AS MELHORES HISTÓRIAS DO CEBOLINHA N. 2',
  'AS MELHORES HISTÓRIAS DO CEBOLINHA N. 2',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/LXJmIX0aaMHY6lLIJ4SedVatwY8=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/c2bd51a4-63e4-11ef-8a5f-725421d97a78.png"]'::jsonb,
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
  'PROD-00310',
  'AS MELHORES HISTÓRIAS DO CEBOLINHA N. 3',
  'AS MELHORES HISTÓRIAS DO CEBOLINHA N. 3',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/0h7YZeDTUZ-tqFhc9bc4FOXAWq0=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/c2c760cc-63e4-11ef-afd1-a2b2aa9ce723.png"]'::jsonb,
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
  'PROD-00311',
  'AS MELHORES HISTÓRIAS DO CEBOLINHA N. 4',
  'AS MELHORES HISTÓRIAS DO CEBOLINHA N. 4',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/HhTFU8KT8PTOCv5g1EnhjA1Tr7I=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/7da61322-7fa9-11ef-b0bc-6e97175de7f7.jpg"]'::jsonb,
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
  'PROD-00312',
  'AS MELHORES HISTORIAS DO CHICO BENTO ESCOLHIDAS POR MAURICIO',
  'AS MELHORES HISTORIAS DO CHICO BENTO ESCOLHIDAS POR MAURICIO',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/w2pVyxphG4BTFxEbP3qzWL16sDE=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/936432a2-eb29-11ef-a31a-8ed8743505f0.jpg"]'::jsonb,
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
  'PROD-00313',
  'AS MELHORES HISTÓRIAS DO CHICO BENTO N.1 - BOX',
  'AS MELHORES HISTÓRIAS DO CHICO BENTO N.1 - BOX',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/dpsT1N_UNBXnqfka3YrwaMxs1F8=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/d768e02e-3f2f-11f0-87b4-c2502d24ff3f.jpg"]'::jsonb,
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
  'PROD-00314',
  'AS MELHORES HISTÓRIAS DO CHICO BENTO N.2',
  'AS MELHORES HISTÓRIAS DO CHICO BENTO N.2',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/39jw8aSRAsrKrJNygZPoNmmSYWs=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/329be764-5ea9-11f0-885d-4eae30e658d1.jpg"]'::jsonb,
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
  'PROD-00315',
  'AS MELHORES HISTÓRIAS DO CHICO BENTO N.3',
  'AS MELHORES HISTÓRIAS DO CHICO BENTO N.3',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/WreM5tWRmatr92kB06D5RNdZJ7Q=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/20bacdc4-69af-11f0-a796-ae0a374fc493.jpg"]'::jsonb,
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
  'PROD-00316',
  'AS MELHORES HISTÓRIAS DO CHICO BENTO N.4',
  'AS MELHORES HISTÓRIAS DO CHICO BENTO N.4',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/cX-Snkqrq3qJOU0xnhNYl4mFcYA=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/e601da7a-9031-11f0-9754-9a60b14b6cd5.jpg"]'::jsonb,
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
  'PROD-00317',
  'AS MEMÓRIAS DE VANITAS - 01 [REB]',
  'AS MEMÓRIAS DE VANITAS - 01 [REB]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/dyFGruR3Hj1qkjuC7ZCOwZ4B3kQ=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/24a6c1da-6f3c-11f0-8769-2eac7e5777cf.jpg"]'::jsonb,
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
  'PROD-00318',
  'AS MEMÓRIAS DE VANITAS - 02',
  'AS MEMÓRIAS DE VANITAS - 02',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/rcWBXVpzIKbDMzXjU9SHIB0TbWg=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/a10243b8-d81a-11ee-ae87-e2e54ed5f9f7.jpg"]'::jsonb,
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
  'PROD-00319',
  'AS MEMÓRIAS DE VANITAS - 03',
  'AS MEMÓRIAS DE VANITAS - 03',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/aBPHSc6tnGu1l6ihiYoIpPbAfPw=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/a14c16f0-d81a-11ee-9df9-5a86bcbeb6e3.jpg"]'::jsonb,
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
  'PROD-00320',
  'AS MEMÓRIAS DE VANITAS - 04',
  'AS MEMÓRIAS DE VANITAS - 04',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/9BYNCghWk2qguUZfIAnUMZ94kuQ=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/a1b090b2-d81a-11ee-ae87-e2e54ed5f9f7.jpg"]'::jsonb,
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
  'PROD-00321',
  'AS MEMÓRIAS DE VANITAS - 05',
  'AS MEMÓRIAS DE VANITAS - 05',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/Y82iZCoDaXCdSN44EZj33czF8q0=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/a1efe0f0-d81a-11ee-9df9-5a86bcbeb6e3.jpg"]'::jsonb,
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
  'PROD-00322',
  'AS MEMÓRIAS DE VANITAS - 06',
  'AS MEMÓRIAS DE VANITAS - 06',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/STbPLgxuPRmvo4aLAEWWT8JTtuY=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/a2446f1c-d81a-11ee-bd84-e2697ce33d53.jpg"]'::jsonb,
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
  'PROD-00323',
  'AS MEMÓRIAS DE VANITAS - 07',
  'AS MEMÓRIAS DE VANITAS - 07',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/Q5FAa358TXwxhfX2Y-nDvWSsNUs=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/a2892332-d81a-11ee-9df9-5a86bcbeb6e3.jpg"]'::jsonb,
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
  'PROD-00324',
  'AS MEMÓRIAS DE VANITAS - 08',
  'AS MEMÓRIAS DE VANITAS - 08',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/Rz2l9aJ3n_cGbDveN0gxi5FyoMU=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/a2eb98f0-d81a-11ee-ae87-e2e54ed5f9f7.jpg"]'::jsonb,
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
  'PROD-00325',
  'AS MEMÓRIAS DE VANITAS - 09',
  'AS MEMÓRIAS DE VANITAS - 09',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/FjF7dI8cOXxQCFcHy0x3XSS7j14=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/a3267e7a-d81a-11ee-bd84-e2697ce33d53.jpg"]'::jsonb,
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
  'PROD-00326',
  'AS MEMÓRIAS DE VANITAS - 10',
  'AS MEMÓRIAS DE VANITAS - 10',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/T2h4ovG7lK-bZoP-3lkGB2YdAAs=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/a37fd0b0-d81a-11ee-ae87-e2e54ed5f9f7.jpg"]'::jsonb,
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
  'PROD-00327',
  'AS MEMÓRIAS DE VANITAS - 11',
  'AS MEMÓRIAS DE VANITAS - 11',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/jLS6kkfO824IG9Bqpz3ZlFbPzQU=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/b424af50-ee29-11ef-9ffd-5ecca552aa97.jpg"]'::jsonb,
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
  'PROD-00328',
  'AS MINHAS AVENTURAS COM O SUPERMAN VOL. 01',
  'AS MINHAS AVENTURAS COM O SUPERMAN VOL. 01',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/kXw6sz3-qmUSnXvBMOv_ex64Bn4=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/de1a5a88-3f2f-11f0-87b4-c2502d24ff3f.jpg"]'::jsonb,
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
  'PROD-00329',
  'AS VARIANTES N.1',
  'AS VARIANTES N.1',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/U5_TDxjSLFzE1Cxuxmp12HIQnIE=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/a40b7534-d81a-11ee-9df9-5a86bcbeb6e3.jpg"]'::jsonb,
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
  'PROD-00330',
  'ASA NOTURNA (2022) N.7',
  'ASA NOTURNA (2022) N.7',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/uE0kd_fI6bTfhUDir_A-ucZElHs=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/f5cb8a1e-2930-11ef-93b8-4a187dfd8c76.jpg"]'::jsonb,
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
  'PROD-00331',
  'ASA NOTURNA (2022) VOL.1 [REB3]',
  'ASA NOTURNA (2022) VOL.1 [REB3]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/Yo5FpmytW4KsOBmII5Xbg25QjL8=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/2e357e38-44b4-11f0-a1ec-1a73b65bfa37.jpg"]'::jsonb,
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
  'PROD-00332',
  'ASA NOTURNA (2022) VOL.2',
  'ASA NOTURNA (2022) VOL.2',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/XGo8SuBzNBGakjguVlYBJaQ0AKo=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/902b65a6-eb29-11ef-a31a-8ed8743505f0.jpg"]'::jsonb,
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
  'PROD-00333',
  'ASA NOTURNA (2022) VOL.3 [REB]',
  'ASA NOTURNA (2022) VOL.3 [REB]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/DsxCheNl0JmgjjpDDWFNPDMv90E=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/08e1453e-98c6-11f0-8505-daad91d7053f.jpg"]'::jsonb,
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
  'PROD-00334',
  'ASA NOTURNA (2022) VOL.9',
  'ASA NOTURNA (2022) VOL.9',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/gLP824XRC5g7pvRd294x3BIH2xU=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/24e09752-6f3c-11f0-a0bf-1abfc156ef81.jpg"]'::jsonb,
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
  'PROD-00335',
  'ASADORA! - 01',
  'ASADORA! - 01',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/X01wGktsuGqDoAOzvHv-kB0gknU=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/86e81692-9d49-11f0-a7d5-525cfeff5d31.jpg"]'::jsonb,
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
  'PROD-00336',
  'ASTRONAUTA  CONVERGÊNCIA (BROCHURA)',
  'ASTRONAUTA  CONVERGÊNCIA (BROCHURA)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/WnQaViBFacNkvazDj0Fc-Secek0=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/a4b54d9c-d816-11ee-b54b-e2697ce33d53.jpg"]'::jsonb,
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
  'PROD-00337',
  'ASTRONAUTA: ENTROPIA (GRAPHIC MSP VOL.21) (REB)',
  'ASTRONAUTA: ENTROPIA (GRAPHIC MSP VOL.21) (REB)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/R-QaBGuPmNr8ztRWU7cPhQBOqSQ=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/8d721568-d819-11ee-9675-5a86bcbeb6e3.jpg"]'::jsonb,
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
  'PROD-00338',
  'ASTRONAUTA: INTEGRAL VOL. 01 (GRAPHIC MSP)',
  'ASTRONAUTA: INTEGRAL VOL. 01 (GRAPHIC MSP)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/2L-2-0LhJ5mpwijSmEbH3S3VLfs=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/24c1e6b0-de36-11ee-b2b6-3e63d4f4f6bf.jpg"]'::jsonb,
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
  'PROD-00339',
  'ATAQUE DOS TITAS (2 EM 1) - 02',
  'ATAQUE DOS TITAS (2 EM 1) - 02',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/RBAA9uyIAs8WP0ObJcJSqWyDpnU=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/7df76e16-d81a-11ee-9df9-5a86bcbeb6e3.jpg"]'::jsonb,
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
  'PROD-00340',
  'ATAQUE DOS TITAS (2 EM 1) - 10',
  'ATAQUE DOS TITAS (2 EM 1) - 10',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/dnvdkmxx2d1WuqS1GnZCAXXFyro=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/b3e360b8-ee29-11ef-975b-c638c3b0d24f.jpg"]'::jsonb,
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
  'PROD-00341',
  'ATAQUE DOS TITAS (2 EM 1) - 11',
  'ATAQUE DOS TITAS (2 EM 1) - 11',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/iG_-GpC8HIQmIVW7CSWK3O_ikAI=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/d05c2ba6-eb47-11ef-82bf-7a9c5276656c.jpg"]'::jsonb,
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
  'PROD-00342',
  'ATAQUE DOS TITAS (2 EM 1) - 12',
  'ATAQUE DOS TITAS (2 EM 1) - 12',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/h5wr4xAsW7dt-I7zFG7ieh2Tm4o=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/acfd6d46-eb29-11ef-9e36-2a856f41baa0.jpg"]'::jsonb,
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
  'PROD-00343',
  'ATAQUE DOS TITAS (2 EM 1) - 13',
  'ATAQUE DOS TITAS (2 EM 1) - 13',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/Qom7dd_dbTOKswzKmIP16qbSp3M=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/ad473ac0-eb29-11ef-8fb2-6696cc3e9cb3.jpg"]'::jsonb,
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
  'PROD-00344',
  'ATAQUE DOS TITAS (2 EM 1) - 14',
  'ATAQUE DOS TITAS (2 EM 1) - 14',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/-Xwnyk3gN6Nt4F__rOLyAwhpiiE=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/ad21ba5c-eb29-11ef-a3b1-5681c2ac1d4b.jpg"]'::jsonb,
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
  'PROD-00345',
  'ATAQUE DOS TITAS (2 EM 1) - 15',
  'ATAQUE DOS TITAS (2 EM 1) - 15',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/ZDLxI8EeNeECY-7HttfNl0gXmXI=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/b0f47a4a-ee29-11ef-b85d-021edfc7654f.jpg"]'::jsonb,
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
  'PROD-00346',
  'ATAQUE DOS TITAS (2 EM 1) - 16',
  'ATAQUE DOS TITAS (2 EM 1) - 16',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/fPV-7ukUQUDuqzC22b34mca0hr4=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/5b8b3456-2473-11f0-824c-b6791219cd2e.jpg"]'::jsonb,
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
  'PROD-00347',
  'ATAQUE DOS TITAS (2 EM 1) - 17',
  'ATAQUE DOS TITAS (2 EM 1) - 17',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/89TJDA9GmKL4398j-q8vIciYzHo=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/8c959a24-3692-11f0-a9ef-e679d989cbbb.jpg"]'::jsonb,
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
  'PROD-00348',
  'ATAQUE DOS TITAS - 02 [REB3]',
  'ATAQUE DOS TITAS - 02 [REB3]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/Qx0ev4-iSsF_Wc3Y1b3FJ_jsaow=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/843e510c-4e7d-11ef-8897-0ec18585415d.jpg"]'::jsonb,
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
  'PROD-00349',
  'ATAQUE DOS TITÃS - ANSWERS',
  'ATAQUE DOS TITÃS - ANSWERS',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/559PfqZNmlH_LAgQYV-9qB9b8vQ=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/0f5c36fa-d818-11ee-86d3-ce469b473a25.jpg"]'::jsonb,
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
  'PROD-00350',
  'ATAQUE DOS TITÃS - INSIDE',
  'ATAQUE DOS TITÃS - INSIDE',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/yjyvI30s2ecOY72YVLkMLRExJJ0=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/0ea48532-d818-11ee-a3e7-da2373bc7c0b.jpg"]'::jsonb,
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