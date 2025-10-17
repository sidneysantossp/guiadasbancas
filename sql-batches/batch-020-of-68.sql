-- SQL para importar produtos Brancaleone
-- Gerado em: 2025-10-17T18:20:53.612Z
-- Total de produtos: 3363
-- Fonte: brancaleone-products-1760723254011.json

-- 1. Criar distribuidor (se não existir)

-- Distribuidor já criado no batch-001

-- Lote 20 de 68
-- Produtos: 1901 até 2000



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00951',
  'DC VS. VAMPIROS VOL. 1',
  'DC VS. VAMPIROS VOL. 1',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/h3fYZLntP2BP1HwAW9bskGUoi-U=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/eeb424a6-d89b-11ee-8d35-d6162862a756.jpg"]'::jsonb,
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
  'PROD-00952',
  'DC VS. VAMPIROS VOL. 3',
  'DC VS. VAMPIROS VOL. 3',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/ORiUZAk0gc5E5jXZqwMlXjgzaAk=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/74268a82-d817-11ee-b124-5a86bcbeb6e3.jpg"]'::jsonb,
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
  'PROD-00953',
  'DCOMPOSICAO VOL. 5 : GUERRA DOS DEUSES DESMORTOS',
  'DCOMPOSICAO VOL. 5 : GUERRA DOS DEUSES DESMORTOS',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/sO0yYFXKbrJV2IKFGpC6vWokHfw=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/77d81448-d817-11ee-a7e4-ce469b473a25.jpg"]'::jsonb,
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
  'PROD-00954',
  'DEADPOOL (2023) VOL.01',
  'DEADPOOL (2023) VOL.01',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/81SBItOW-7MMxQa7PGsn-USOm40=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/c512bb56-63e4-11ef-afd1-a2b2aa9ce723.png"]'::jsonb,
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
  'PROD-00955',
  'DEADPOOL (2025)  N.01',
  'DEADPOOL (2025)  N.01',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/sKGMhAq0UKu5-DTIokgQHsukpJo=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/36d216d4-7fd1-11f0-b894-2e1dcafaddd0.jpg"]'::jsonb,
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
  'PROD-00956',
  'DEADPOOL (2025)  N.02',
  'DEADPOOL (2025)  N.02',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/zexXjGgK-6MVnsHQ8bcQQLnXs7s=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/468f6f10-8b5f-11f0-ab6e-7e1ab2cbb1e5.jpg"]'::jsonb,
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
  'PROD-00957',
  'DEADPOOL (2025)  N.03',
  'DEADPOOL (2025)  N.03',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/1i1NufpJ1OJoO7aLM9l__Y1AiEM=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/22171f96-a4ac-11f0-9bb5-ee8f90996b43.jpg"]'::jsonb,
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
  'PROD-00958',
  'DEADPOOL E WOLVERINE (MARVEL-VERSE) N.1',
  'DEADPOOL E WOLVERINE (MARVEL-VERSE) N.1',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/1rXVWjYOCTUsHwHAygk3bfs8b84=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/2430250c-2ce4-11ef-ae6b-6ab875123cf0.jpg"]'::jsonb,
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
  'PROD-00959',
  'DEADPOOL VS. WOLVERINE N.1',
  'DEADPOOL VS. WOLVERINE N.1',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/JZKpBV8WoELgfyaSYvNmxwNehik=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/c52f9302-63e4-11ef-8b09-aec3f1ed24b8.png"]'::jsonb,
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
  'PROD-00960',
  'DEADPOOL: AINDA MAIS SANGUE RUIM',
  'DEADPOOL: AINDA MAIS SANGUE RUIM',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/s1mZ5IWUvPIbXNlQunhriZ6i4mg=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/584b7364-0cc8-11ef-88d1-3619a1e0872c.jpg"]'::jsonb,
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
  'PROD-00961',
  'DEADPOOL: CACA AO TESOURO (MARVEL ESSENCIAIS)',
  'DEADPOOL: CACA AO TESOURO (MARVEL ESSENCIAIS)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/N8F3H0iakMooJXrKbe1YXAiGywY=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/809e2ad8-08c5-11f0-8283-fac9a3e7e647.jpg"]'::jsonb,
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
  'PROD-00962',
  'DECK 20 CARDS + 20 CARDS ESP + 1 CARD PELE SANTOS 23',
  'DECK 20 CARDS + 20 CARDS ESP + 1 CARD PELE SANTOS 23',
  0.00,
  '["https://d1y59j9xdhixp0.cloudfront.net/2dede6cdcecb2ad9d5102618f5d141cd35e28c9a/images/dc6d5f0bf4b929fa80b9.svg"]'::jsonb,
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
  'PROD-00963',
  'DECK 25 CARDS + 25 CARDS ESP + 1 CARD ESP ATLETICO MINEIRO',
  'DECK 25 CARDS + 25 CARDS ESP + 1 CARD ESP ATLETICO MINEIRO',
  0.00,
  '["https://d1y59j9xdhixp0.cloudfront.net/2dede6cdcecb2ad9d5102618f5d141cd35e28c9a/images/dc6d5f0bf4b929fa80b9.svg"]'::jsonb,
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
  'PROD-00964',
  'DECK 25 CARDS + 25 CARDS ESP + 1 CARD ESP CORINTHIANS',
  'DECK 25 CARDS + 25 CARDS ESP + 1 CARD ESP CORINTHIANS',
  0.00,
  '["https://d1y59j9xdhixp0.cloudfront.net/2dede6cdcecb2ad9d5102618f5d141cd35e28c9a/images/dc6d5f0bf4b929fa80b9.svg"]'::jsonb,
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
  'PROD-00965',
  'DECK 25 CARDS + 25 CARDS ESP + 1 CARD ESP PALMEIRAS',
  'DECK 25 CARDS + 25 CARDS ESP + 1 CARD ESP PALMEIRAS',
  0.00,
  '["https://d1y59j9xdhixp0.cloudfront.net/2dede6cdcecb2ad9d5102618f5d141cd35e28c9a/images/dc6d5f0bf4b929fa80b9.svg"]'::jsonb,
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
  'PROD-00966',
  'DECK 25 CARDS + 25 CARDS ESP + 1 CARD SAO PAULO 2024 TRIBUTE',
  'DECK 25 CARDS + 25 CARDS ESP + 1 CARD SAO PAULO 2024 TRIBUTE',
  0.00,
  '["https://d1y59j9xdhixp0.cloudfront.net/2dede6cdcecb2ad9d5102618f5d141cd35e28c9a/images/dc6d5f0bf4b929fa80b9.svg"]'::jsonb,
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
  'PROD-00967',
  'DECK 30 CARDS BRASILEIRAO ADRENALYN 2024 TCG',
  'DECK 30 CARDS BRASILEIRAO ADRENALYN 2024 TCG',
  0.00,
  '["https://d1y59j9xdhixp0.cloudfront.net/2dede6cdcecb2ad9d5102618f5d141cd35e28c9a/images/dc6d5f0bf4b929fa80b9.svg"]'::jsonb,
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
  'PROD-00968',
  'DECK 35 CARDS + 15 CARDS ESP + 1 CARD ESP ATHLETICO PR',
  'DECK 35 CARDS + 15 CARDS ESP + 1 CARD ESP ATHLETICO PR',
  0.00,
  '["https://d1y59j9xdhixp0.cloudfront.net/2dede6cdcecb2ad9d5102618f5d141cd35e28c9a/images/dc6d5f0bf4b929fa80b9.svg"]'::jsonb,
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
  'PROD-00969',
  'DECK 35 CARDS + 25 CARDS ESPECIAIS SELE BRASILEIRA',
  'DECK 35 CARDS + 25 CARDS ESPECIAIS SELE BRASILEIRA',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/lMa7YVPlwk7LBO_5nq-T4MhzS7w=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/e6ce0180-d89b-11ee-a97f-26337c3739c7.jpg"]'::jsonb,
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
  'PROD-00970',
  'DECK 48 CROMOS + 50 CARDS COPA AMERICA 2024 - UPGRADE SET',
  'DECK 48 CROMOS + 50 CARDS COPA AMERICA 2024 - UPGRADE SET',
  0.00,
  '["https://d1y59j9xdhixp0.cloudfront.net/2dede6cdcecb2ad9d5102618f5d141cd35e28c9a/images/dc6d5f0bf4b929fa80b9.svg"]'::jsonb,
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
  'PROD-00971',
  'DECK 50 CARDS CONMEBOL LIBERTADORES 2024 FINAL BOX SET',
  'DECK 50 CARDS CONMEBOL LIBERTADORES 2024 FINAL BOX SET',
  0.00,
  '["https://d1y59j9xdhixp0.cloudfront.net/2dede6cdcecb2ad9d5102618f5d141cd35e28c9a/images/dc6d5f0bf4b929fa80b9.svg"]'::jsonb,
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
  'PROD-00972',
  'DECK 60 CROMOS CB 2024 STK UPGRADE SET',
  'DECK 60 CROMOS CB 2024 STK UPGRADE SET',
  0.00,
  '["https://d1y59j9xdhixp0.cloudfront.net/2dede6cdcecb2ad9d5102618f5d141cd35e28c9a/images/dc6d5f0bf4b929fa80b9.svg"]'::jsonb,
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
  'PROD-00973',
  'DECK 70 CROMOS CB 2024 STK UPGRADE SET',
  'DECK 70 CROMOS CB 2024 STK UPGRADE SET',
  0.00,
  '["https://d1y59j9xdhixp0.cloudfront.net/2dede6cdcecb2ad9d5102618f5d141cd35e28c9a/images/dc6d5f0bf4b929fa80b9.svg"]'::jsonb,
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
  'PROD-00974',
  'DELICIOUS IN DUNGEON - 02',
  'DELICIOUS IN DUNGEON - 02',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/ddquqsb1iD91zEy4lb4qXpFlOlc=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/45d1c546-8b5f-11f0-b876-cef4535c59b2.jpg"]'::jsonb,
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
  'PROD-00975',
  'DELICIOUS IN DUNGEON - 08',
  'DELICIOUS IN DUNGEON - 08',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/7WTxLZyAH7SxFdeRFDmPYo2bWTU=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/aba0f866-ee29-11ef-8407-02478a88c6f1.jpg"]'::jsonb,
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
  'PROD-00976',
  'DELICIOUS IN DUNGEON - 09',
  'DELICIOUS IN DUNGEON - 09',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/BMqnrbQoXP2GlgWcm8Zvl2sURsI=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/d885ddf6-eb4a-11ef-8230-fa812316df6c.jpg"]'::jsonb,
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
  'PROD-00977',
  'DELICIOUS IN DUNGEON - 10',
  'DELICIOUS IN DUNGEON - 10',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/3_0SSsOhCEqnV_-uovAaml9oKag=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/95c56a98-eb29-11ef-a31a-8ed8743505f0.jpg"]'::jsonb,
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
  'PROD-00978',
  'DELICIOUS IN DUNGEON - 11',
  'DELICIOUS IN DUNGEON - 11',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/n5YFPowXW069CIsHQmfEE4F4cUE=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/96195f90-eb29-11ef-b1d3-def782e2bf12.jpg"]'::jsonb,
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
  'PROD-00979',
  'DELICIOUS IN DUNGEON - 14',
  'DELICIOUS IN DUNGEON - 14',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/wrguxtr9QGYJbW9X8FMkIAQzWXw=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/54d2b7a6-2473-11f0-b18c-baa1f40e9fb8.jpg"]'::jsonb,
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
  'PROD-00980',
  'DELICIOUS IN DUNGEON N.3',
  'DELICIOUS IN DUNGEON N.3',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/1M-2DBYjQ-PlTe10rCDm0FXlyLE=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/58166eee-0cc8-11ef-9312-4e89173d1712.jpg"]'::jsonb,
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
  'PROD-00981',
  'DELICIOUS IN DUNGEON N.4',
  'DELICIOUS IN DUNGEON N.4',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/NeKSsuE3hcX713ylXMpMsSZoCNU=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/00b9342c-1ca6-11ef-bc32-def7b1441874.jpg"]'::jsonb,
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
  'PROD-00982',
  'DELICIOUS IN DUNGEON N.5',
  'DELICIOUS IN DUNGEON N.5',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/BOAKPu1U3wkqKn7b-6umYHQP6M4=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/77f8aee2-4e7d-11ef-8f2a-626adc132bdd.jpg"]'::jsonb,
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
  'PROD-00983',
  'DELICIOUS IN DUNGEON N.6',
  'DELICIOUS IN DUNGEON N.6',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/1EyYdJU2dj8Ybns5aPKhc1oHSzU=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/c5049d46-63e4-11ef-9c41-c67e4ff8d839.png"]'::jsonb,
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
  'PROD-00984',
  'DELICIOUS IN DUNGEON N.7',
  'DELICIOUS IN DUNGEON N.7',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/01kWNw6mfvpB7AOPNGqpR_gDzjY=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/7fe50e4a-7fa9-11ef-b0bc-6e97175de7f7.jpg"]'::jsonb,
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
  'PROD-00985',
  'DEMOLIDOR (2020) N.11',
  'DEMOLIDOR (2020) N.11',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/C99B7MOf8n-3u9NEx1ix8Vfskeg=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/00b6afa4-1ca6-11ef-b80c-228c440649c1.jpg"]'::jsonb,
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
  'PROD-00986',
  'DEMOLIDOR (2020) VOL.09',
  'DEMOLIDOR (2020) VOL.09',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/WRfsNErLDUy1DYJ3_fSoUkAlMQ4=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/ebc97eae-0143-11f0-9a82-ca3c9ea74dec.jpg"]'::jsonb,
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
  'PROD-00987',
  'DEMOLIDOR (2024) VOL.01',
  'DEMOLIDOR (2024) VOL.01',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/Xm-iVkyZhxq2nPsdo6BXQoa5yXc=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/ae2b1670-ee29-11ef-8ad2-fe0cb56c9a3d.jpg"]'::jsonb,
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
  'PROD-00988',
  'DEMOLIDOR (2024) VOL.02',
  'DEMOLIDOR (2024) VOL.02',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/UZgdhd-HxWvFcta1z9BxGz3bb50=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/3dc43362-5ea9-11f0-b8ff-8a0b5d172c0d.jpg"]'::jsonb,
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
  'PROD-00989',
  'DEMOLIDOR (MARVEL-VERSE)',
  'DEMOLIDOR (MARVEL-VERSE)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/lZ06HnMexLD3sOsCdGqhePHSHTE=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/83558600-4dac-11f0-b840-c6f13973e51f.jpg"]'::jsonb,
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
  'PROD-00990',
  'DEMOLIDOR E PALADINOS MARVEL: FUGINDO DO MUNDO',
  'DEMOLIDOR E PALADINOS MARVEL: FUGINDO DO MUNDO',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/rVtG083rpMlodkhj8mJh_kuy3Zs=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/60098748-da9c-11ee-acb0-3226a44a89fc.jpg"]'::jsonb,
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
  'PROD-00991',
  'DEMOLIDOR POR MARK WAID VOL. 04 (MARVEL SAGA)',
  'DEMOLIDOR POR MARK WAID VOL. 04 (MARVEL SAGA)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/f18mQrY0nc9xbPvfKXi-VALzYpQ=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/918dfa2e-4e7d-11ef-ac42-beb74448c7ce.jpg"]'::jsonb,
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
  'PROD-00992',
  'DEMOLIDOR POR MARK WAID VOL. 05 (MARVEL SAGA)',
  'DEMOLIDOR POR MARK WAID VOL. 05 (MARVEL SAGA)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/KJ4W-1-PZSgUMKXdsaFICZ9lcEw=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/91732820-4e7d-11ef-8179-b2d60c13b884.jpg"]'::jsonb,
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
  'PROD-00993',
  'DEMOLIDOR POR MARK WAID VOL. 06 (MARVEL SAGA)',
  'DEMOLIDOR POR MARK WAID VOL. 06 (MARVEL SAGA)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/_eFAcLC2z-5TVuxGySCl4d-JozY=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/8bd3456e-7fa9-11ef-b1d0-12caec0ea15c.jpg"]'::jsonb,
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
  'PROD-00994',
  'DEMOLIDOR POR MARK WAID VOL.01 (MARVEL SAGA)',
  'DEMOLIDOR POR MARK WAID VOL.01 (MARVEL SAGA)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/mM_ewVQu9g9jnsdaFSIrBQlk3qw=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/30c7072c-a4ac-11f0-9f2b-b616a40784ef.jpg"]'::jsonb,
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
  'PROD-00995',
  'DEMOLIDOR POR MARK WAID VOL.02 (MARVEL SAGA)',
  'DEMOLIDOR POR MARK WAID VOL.02 (MARVEL SAGA)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/ziy3r7BC_l-p6bWfORNc9vdtcUE=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/5d6401f4-0cc8-11ef-8551-ea183cfe9a00.jpg"]'::jsonb,
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
  'PROD-00996',
  'DEMOLIDOR POR MARK WAID VOL.03 (MARVEL SAGA)',
  'DEMOLIDOR POR MARK WAID VOL.03 (MARVEL SAGA)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/W5MfxehZuKrrEgkUUPTXGGVCNZ4=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/49fcf17e-1705-11ef-950f-ea58bbef1786.jpg"]'::jsonb,
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
  'PROD-00997',
  'DEMOLIDOR POR MARK WAID VOL.07 (MARVEL SAGA)',
  'DEMOLIDOR POR MARK WAID VOL.07 (MARVEL SAGA)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/rAMSfgDSqp4OcDjlShnUznqIFII=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/d55cfa1a-eb4a-11ef-8621-0ee70347c223.jpg"]'::jsonb,
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
  'PROD-00998',
  'DEMOLIDOR POR MARK WAID VOL.08 (MARVEL SAGA)',
  'DEMOLIDOR POR MARK WAID VOL.08 (MARVEL SAGA)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/p8M0bZGJmtd4EiHHTSx8qBHTVrI=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/b230896a-eb29-11ef-89a1-ce85303a26c9.jpg"]'::jsonb,
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
  'PROD-00999',
  'DEMOLIDOR POR MARK WAID VOL.09 (MARVEL SAGA)',
  'DEMOLIDOR POR MARK WAID VOL.09 (MARVEL SAGA)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/t8mEYCCmx_v2OK16od0pBztNjyU=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/b23af33c-eb29-11ef-9e36-2a856f41baa0.jpg"]'::jsonb,
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
  'PROD-01000',
  'DEMOLIDOR POR MARK WAID VOL.10 (MARVEL SAGA)',
  'DEMOLIDOR POR MARK WAID VOL.10 (MARVEL SAGA)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/Pu7bQifuoOifwESkN5-YsYC0-Jo=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/b26101b2-eb29-11ef-8cc5-0ee70347c223.jpg"]'::jsonb,
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