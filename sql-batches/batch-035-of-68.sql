-- SQL para importar produtos Brancaleone
-- Gerado em: 2025-10-17T17:52:46.765Z
-- Total de produtos: 3363
-- Fonte: brancaleone-products-1760723254011.json

-- 1. Criar distribuidor (se não existir)

-- Distribuidor já criado no batch-001

-- Lote 35 de 68
-- Produtos: 3401 até 3500



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01701',
  'LIV.ILUST. ALBUM LUCCAS NETO 2025 (3)',
  'LIV.ILUST. ALBUM LUCCAS NETO 2025 (3)',
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
  'PROD-01702',
  'LIV.ILUST. ALBUM MEU MALVADO FAVORITO 4',
  'LIV.ILUST. ALBUM MEU MALVADO FAVORITO 4',
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
  'PROD-01703',
  'LIV.ILUST. ALBUM MOANA 2 MOVIE',
  'LIV.ILUST. ALBUM MOANA 2 MOVIE',
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
  'PROD-01704',
  'LIV.ILUST. ALBUM NATAN POR AI 2025',
  'LIV.ILUST. ALBUM NATAN POR AI 2025',
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
  'PROD-01705',
  'LIV.ILUST. ALBUM NFL FOOTBALL AM. US 2024/25',
  'LIV.ILUST. ALBUM NFL FOOTBALL AM. US 2024/25',
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
  'PROD-01706',
  'LIV.ILUST. ALBUM O SHOW DA LUNA 2025',
  'LIV.ILUST. ALBUM O SHOW DA LUNA 2025',
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
  'PROD-01707',
  'LIV.ILUST. ALBUM ONE PIECE ROAD TO ..',
  'LIV.ILUST. ALBUM ONE PIECE ROAD TO ..',
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
  'PROD-01708',
  'LIV.ILUST. ALBUM PALMEIRAS 2024',
  'LIV.ILUST. ALBUM PALMEIRAS 2024',
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
  'PROD-01709',
  'LIV.ILUST. ALBUM PANINI FIFA 365 2025 (10)',
  'LIV.ILUST. ALBUM PANINI FIFA 365 2025 (10)',
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
  'PROD-01710',
  'LIV.ILUST. ALBUM RAINBOW HIGH',
  'LIV.ILUST. ALBUM RAINBOW HIGH',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/Yu_dIozjGgv0dgYr5gZ_QI4qAAQ=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/6d5390e2-da9c-11ee-b415-da2490dbf0ff.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01711',
  'LIV.ILUST. ALBUM SNOOPY',
  'LIV.ILUST. ALBUM SNOOPY',
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
  'PROD-01712',
  'LIV.ILUST. ALBUM SONIC PRIME (NETFLIX)',
  'LIV.ILUST. ALBUM SONIC PRIME (NETFLIX)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/A4CxqG3N_xetPDxLsqM_3V-O8pI=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/d3c167dc-f616-11ef-b0f5-5ac998efac6d.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01713',
  'LIV.ILUST. ALBUM SQUISHMALLOWS',
  'LIV.ILUST. ALBUM SQUISHMALLOWS',
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
  'PROD-01714',
  'LIV.ILUST. ALBUM STITCH',
  'LIV.ILUST. ALBUM STITCH',
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
  'PROD-01715',
  'LIV.ILUST. ALBUM STITCH 2025 (2)',
  'LIV.ILUST. ALBUM STITCH 2025 (2)',
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
  'PROD-01716',
  'LIV.ILUST. ALBUM STUMBLE GUYS',
  'LIV.ILUST. ALBUM STUMBLE GUYS',
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
  'PROD-01717',
  'LIV.ILUST. ALBUM SUPER MARIO STK',
  'LIV.ILUST. ALBUM SUPER MARIO STK',
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
  'PROD-01718',
  'LIV.ILUST. ALBUM TURMA DA MONICA - CHICO BENTO MOVIE',
  'LIV.ILUST. ALBUM TURMA DA MONICA - CHICO BENTO MOVIE',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/4vkc2uUJ_Y6fQKGXdULBBTtxAuA=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/b96b3e08-f616-11ef-9832-9e7a01352361.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01719',
  'LIV.ILUST. ALBUM TURMA DA MONICA JOVEM MOVIE',
  'LIV.ILUST. ALBUM TURMA DA MONICA JOVEM MOVIE',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/nekL7g_XAzu9l5lQhH4wpgojMdY=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/1f8eee5e-de36-11ee-aae0-ca3362baf0a6.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01720',
  'LIV.POSTER COPA AMERICA 2024 WINNER',
  'LIV.POSTER COPA AMERICA 2024 WINNER',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/sxUOA2UdhycKyXvmssDS0-AGTeE=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/d2ca1824-f616-11ef-9a8d-7ac96e6ce187.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01721',
  'LIV.POSTER FOOTBALL BR 2024 WINNER POSTER',
  'LIV.POSTER FOOTBALL BR 2024 WINNER POSTER',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/COS0HTQ0igMY7pxBWwtzaMB0G5g=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/d4b839c2-f616-11ef-b583-1612b939ee2a.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01722',
  'LIVRARIA DE BEBIDAS MOON N.1',
  'LIVRARIA DE BEBIDAS MOON N.1',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/WANIbYdXUdy9sQq3cOsIb2THiJo=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/60e24302-5ea9-11f0-b926-022f8a1a6f0a.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01723',
  'LOBO SOLITARIO ED.LUXO - 2 [REB]',
  'LOBO SOLITARIO ED.LUXO - 2 [REB]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/54tibd66VdtV5BvFQRK3WdplA_w=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/fdbd4bf4-feb9-11ef-8685-6a791d69f614.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01724',
  'LOKI (MARVEL-VERSE)',
  'LOKI (MARVEL-VERSE)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/JPRtA1QLeRu2py4nt3mFrdBFNVA=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/299c695e-d818-11ee-a1cf-e2e54ed5f9f7.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01725',
  'LOKI: JORNADA AO MISTERIO',
  'LOKI: JORNADA AO MISTERIO',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/4oRdniBfqfO6Q5XDIOUUUY6W7oU=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/292d3c96-d818-11ee-82a8-e2697ce33d53.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01726',
  'LOOK BACK - 01 [REB]',
  'LOOK BACK - 01 [REB]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/-MTWxYwJ28UPiohWTRyGVVgHkoo=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/0367f508-98c6-11f0-924f-76f14c3851ed.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01727',
  'LOVE STAGE N.3',
  'LOVE STAGE N.3',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/oy7zlwC-7aqSzvJ448kJXizFABE=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/2ab5ef54-d818-11ee-82a8-e2697ce33d53.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01728',
  'LOVE STAGE!! - 01',
  'LOVE STAGE!! - 01',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/YcCPlo_0JyIbflzVkTC7HsNtKI8=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/66e45eb2-da9c-11ee-b415-da2490dbf0ff.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01729',
  'LOVE STAGE!! - 02',
  'LOVE STAGE!! - 02',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/rxZW5qT1zEZ_Ogpuo045uuJ5MVA=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/2a287340-d818-11ee-86d3-ce469b473a25.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01730',
  'LUCIFER  - EDICAO DE LUXO VOL. 03',
  'LUCIFER  - EDICAO DE LUXO VOL. 03',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/SVbwTHQ_O8-3wlBAiXOAdVrQkfI=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/5e38ff08-f111-11ee-b343-32bb54d24cd6.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01731',
  'LUCIFER  - EDICAO DE LUXO VOL. 04',
  'LUCIFER  - EDICAO DE LUXO VOL. 04',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/ZUMu8kbv5kVRx0KgCC4_aKYL5cw=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/af0da710-ee29-11ef-89f1-e29dc7e5f602.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01732',
  'LUCIFER  - EDICAO DE LUXO VOL. 05',
  'LUCIFER  - EDICAO DE LUXO VOL. 05',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/x2SnQytEv5g7CsJTmP9a2yyUr2g=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/e9e4579e-9031-11f0-82c8-4a06203c34dc.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01733',
  'LUTO POR UMA AMIGA: A MORTE DA MS. MARVEL N.1',
  'LUTO POR UMA AMIGA: A MORTE DA MS. MARVEL N.1',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/WCQfL9dhMFECcEvynMeBmQ4ydek=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/7da8fb4e-4e7d-11ef-a1a1-5acf4477aff6.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01734',
  'LYCORIS RECOIL -  REGULAR SERIES - 01',
  'LYCORIS RECOIL -  REGULAR SERIES - 01',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/pgjNrlQ5ASmmSJzMMmaXf2MwsG8=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/9bc76bd0-eb29-11ef-b1d3-def782e2bf12.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01735',
  'LYCORIS RECOIL -  REGULAR SERIES - 02',
  'LYCORIS RECOIL -  REGULAR SERIES - 02',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/BTk2IbtWAB1fCwk9ZsfZLHlu1o0=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/c421b3d6-f616-11ef-b3ee-b2b382130795.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01736',
  'LYCORIS RECOIL -  REGULAR SERIES - 03',
  'LYCORIS RECOIL -  REGULAR SERIES - 03',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/aP0GbQ6REDC_Csr3LGkzEAp6ZRU=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/5627ab70-2473-11f0-adf6-061a58ec2564.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01737',
  'LYCORIS RECOIL -  REGULAR SERIES - 04',
  'LYCORIS RECOIL -  REGULAR SERIES - 04',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/uoT87SEufEhgm9y168z1XsGLIvY=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/20d6fe4e-6f3c-11f0-9cf1-c2c01d897fb1.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01738',
  'LYCORIS RECOIL -  REGULAR SERIES - 05',
  'LYCORIS RECOIL -  REGULAR SERIES - 05',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/epvWF7poV4zfhgqnQ0VGkem1Rfg=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/039b8f9e-98c6-11f0-8505-daad91d7053f.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01739',
  'LYCORIS RECOIL -  RELOAD - 01',
  'LYCORIS RECOIL -  RELOAD - 01',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/oTo5U3T7hUJk5J94Fgi4McZvOwE=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/998e80c4-1941-11f0-a340-665f2a2839bf.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01740',
  'LYCORIS RECOIL -  RELOAD - 02',
  'LYCORIS RECOIL -  RELOAD - 02',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/jeAlOrFtRF6vdbFjkOfmUJlSBUc=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/c621874c-642a-11f0-b55e-2a081a9d92fa.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01741',
  'LYCORIS RECOIL -  RELOAD - 03',
  'LYCORIS RECOIL -  RELOAD - 03',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/cIrcaE9wMkahDYOacJKLg_nN98I=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/25ecbb3a-a4ac-11f0-a599-8e83af06c4a6.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01742',
  'LYCORIS RECOIL -  REPEAT - 01',
  'LYCORIS RECOIL -  REPEAT - 01',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/DN0isbLUEsQfpGCUsDWsmUkyK2c=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/8fcb6354-3692-11f0-b775-ca6651de2295.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01743',
  'LYCORIS RECOIL -  REPEAT - 02',
  'LYCORIS RECOIL -  REPEAT - 02',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/Wss1AmVr3-Wqywy5U9XU5THUAsE=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/48165dea-5ea9-11f0-bc5c-8a0b5d172c0d.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01744',
  'LYCORIS RECOIL - ANTOLOGY - REACT - 01',
  'LYCORIS RECOIL - ANTOLOGY - REACT - 01',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/st1C_-mGowjwIGP080MqjCxKQl4=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/f89f8178-feb9-11ef-b1c2-b22467446ac0.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01745',
  'LYCORIS RECOIL - NOVEL - 1',
  'LYCORIS RECOIL - NOVEL - 1',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/8QLr4dhMPRhwcfKWXtoSTDBhSrY=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/56165b40-2473-11f0-9552-3254c5e6fae0.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01746',
  'LYCORIS RECOIL - REPEAT - 03',
  'LYCORIS RECOIL - REPEAT - 03',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/NcC8BJruwB4d8T5ph7hZiXkoHuI=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/3a05b04a-7fd1-11f0-b894-2e1dcafaddd0.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01747',
  'MABATAKI YORI HAYAKU! NUM PISCAR DE OLHOS!! - 01',
  'MABATAKI YORI HAYAKU! NUM PISCAR DE OLHOS!! - 01',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/z95jfcYBnPp5YMTUy8x4Gmem0AU=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/f99bd224-d819-11ee-9cda-5a86bcbeb6e3.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01748',
  'MABATAKI YORI HAYAKU!! - NUM PISCAR DE OLHOS - 07',
  'MABATAKI YORI HAYAKU!! - NUM PISCAR DE OLHOS - 07',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/0vrLvF9MMJDVvHr4PgSo7ynlJyU=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/87bb3aa4-7fa9-11ef-b1d0-12caec0ea15c.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01749',
  'MABATAKI YORI HAYAKU!! - NUM PISCAR DE OLHOS - 08',
  'MABATAKI YORI HAYAKU!! - NUM PISCAR DE OLHOS - 08',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/d5s9vMr44bDJabVjI0vHvDTG8Lw=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/fa786ed8-eb4a-11ef-8230-fa812316df6c.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01750',
  'MABATAKI YORI HAYAKU!! - NUM PISCAR DE OLHOS - 09',
  'MABATAKI YORI HAYAKU!! - NUM PISCAR DE OLHOS - 09',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/JjEwCAdqN5m3EFkanejKeVXP3pc=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/a6e14ab8-eb29-11ef-b7b8-460343881edd.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();