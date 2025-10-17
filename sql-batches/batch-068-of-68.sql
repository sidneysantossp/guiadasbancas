-- SQL para importar produtos Brancaleone
-- Gerado em: 2025-10-17T17:52:46.765Z
-- Total de produtos: 3363
-- Fonte: brancaleone-products-1760723254011.json

-- 1. Criar distribuidor (se não existir)

-- Distribuidor já criado no batch-001

-- Lote 68 de 68
-- Produtos: 6701 até 6726



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-03351',
  'YUUNA E A PENSAO ASSOMBRADA - 04 [REB]',
  'YUUNA E A PENSAO ASSOMBRADA - 04 [REB]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/MTlleKF7YOpN-lUwyJQwcmjFdpQ=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/9d148284-eb29-11ef-9927-fa812316df6c.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-03352',
  'YUUNA E A PENSAO ASSOMBRADA - 05 [REB]',
  'YUUNA E A PENSAO ASSOMBRADA - 05 [REB]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/4Ady2rav9CM5p9GGSRB9ETaddCk=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/9d1ffed4-eb29-11ef-ba4b-0ee70347c223.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-03353',
  'YUUNA E A PENSÃO ASSOMBRADA 10 [REB]',
  'YUUNA E A PENSÃO ASSOMBRADA 10 [REB]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/A0-d3-vM6otH6OpnauWU5-OYmtw=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/e2ce5360-eb4a-11ef-8230-fa812316df6c.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-03354',
  'YUUNA E A PENSÃO ASSOMBRADA 6 [REB]',
  'YUUNA E A PENSÃO ASSOMBRADA 6 [REB]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/FYZZZ9pSFbUoMyDRiPI2PAPL9iY=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/e24496a2-eb4a-11ef-8230-fa812316df6c.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-03355',
  'YUUNA E A PENSÃO ASSOMBRADA 7 [REB]',
  'YUUNA E A PENSÃO ASSOMBRADA 7 [REB]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/sSYVRVyKbYgS3cLETYyyHxAMlEU=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/e256bd32-eb4a-11ef-8230-fa812316df6c.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-03356',
  'YUUNA E A PENSÃO ASSOMBRADA 8 [REB]',
  'YUUNA E A PENSÃO ASSOMBRADA 8 [REB]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/0bgOhxhgfAmE4jbgBLhPX0OxRhM=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/e269a956-eb4a-11ef-8230-fa812316df6c.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-03357',
  'YUUNA E A PENSÃO ASSOMBRADA 9 [REB]',
  'YUUNA E A PENSÃO ASSOMBRADA 9 [REB]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/D2tTyIbAoYy5YmJl5ENw9pPNrKA=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/e29e0250-eb4a-11ef-8621-0ee70347c223.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-03358',
  'ZAGOR: ODISSEIA AMERICANA (BIBLIOTECA ZAGOR)',
  'ZAGOR: ODISSEIA AMERICANA (BIBLIOTECA ZAGOR)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/jX0XNR2BKh0-BpDxBdfsRJlc4oo=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/d73f533c-eb4a-11ef-8230-fa812316df6c.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-03359',
  'ZATANNA: QUEBRANDO TUDO',
  'ZATANNA: QUEBRANDO TUDO',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/aWEpnrFEpLeSizzqBKMfTD2JB5I=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/2e438318-a4ac-11f0-84d7-06a1e9b2bf33.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-03360',
  'ZDM VOL. 01 (EDICAO DE LUXO)',
  'ZDM VOL. 01 (EDICAO DE LUXO)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/Uv33GArxVXMNpd8yHwnghh7Jv7Y=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/378d9098-e497-11ee-83ff-7ee42cfe9644.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-03361',
  'ZDM VOL. 02 - EDICAO DE LUXO',
  'ZDM VOL. 02 - EDICAO DE LUXO',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/DL0FgNLTCowxdBIMXwHqu1nVoLE=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/da01ff84-eb4a-11ef-8621-0ee70347c223.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-03362',
  'ZDM VOL. 03 - EDICAO DE LUXO',
  'ZDM VOL. 03 - EDICAO DE LUXO',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/RQPv7MjvK7xPlXYSgv89jeucquE=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/ebf3e8d8-0143-11f0-9602-e6e8567c501d.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-03363',
  'ZERO HORA: CRISE NO TEMPO (GRANDES EVENTOS DC)',
  'ZERO HORA: CRISE NO TEMPO (GRANDES EVENTOS DC)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/eQHz-BOJlYQzJj4-h3v_nUSO_t4=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/260a0eba-2ce4-11ef-b724-7e67d1c5424b.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();