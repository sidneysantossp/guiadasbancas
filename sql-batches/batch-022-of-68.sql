-- SQL para importar produtos Brancaleone
-- Gerado em: 2025-10-17T18:20:53.612Z
-- Total de produtos: 3363
-- Fonte: brancaleone-products-1760723254011.json

-- 1. Criar distribuidor (se não existir)

-- Distribuidor já criado no batch-001

-- Lote 22 de 68
-- Produtos: 2101 até 2200



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01051',
  'DONZELAS À FLOR DA PELE - 05',
  'DONZELAS À FLOR DA PELE - 05',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/AM6_jd72bAGBOZfiOms_H1HchtY=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/99ae0f12-d819-11ee-bb5a-de7d367e92b3.jpg"]'::jsonb,
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
  'PROD-01052',
  'DONZELAS À FLOR DA PELE - 06',
  'DONZELAS À FLOR DA PELE - 06',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/UjZeIGn9HWhmXXGoea3gNtuh9dc=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/99f1117c-d819-11ee-83df-e2e54ed5f9f7.jpg"]'::jsonb,
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
  'PROD-01053',
  'DONZELAS À FLOR DA PELE - 07',
  'DONZELAS À FLOR DA PELE - 07',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/pHzdnUbcMpVmMZaMOVQQeWJ_6sI=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/9a7c42ba-d819-11ee-947a-32937b3ded24.jpg"]'::jsonb,
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
  'PROD-01054',
  'DONZELAS À FLOR DA PELE - 08',
  'DONZELAS À FLOR DA PELE - 08',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/XzhOD1xVImm8FOblw5AR9V5rvEk=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/9aab0cc6-d819-11ee-83df-e2e54ed5f9f7.jpg"]'::jsonb,
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
  'PROD-01055',
  'DOROHEDORO - 18',
  'DOROHEDORO - 18',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/4cg5KK5ZEPferatDZqPHlP0inDw=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/274bd0ba-a4ac-11f0-8b51-cad07a812184.jpg"]'::jsonb,
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
  'PROD-01056',
  'DOROHEDORO - 19',
  'DOROHEDORO - 19',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/bHfFpsypbXDRcRAn6IYOGhp2p5w=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/4d8c530a-d819-11ee-89ed-e2697ce33d53.jpg"]'::jsonb,
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
  'PROD-01057',
  'DOUTOR ESTRANHO (2023) VOL.01',
  'DOUTOR ESTRANHO (2023) VOL.01',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/FjTfbJzfKRsSsi8i3AAAEd83r8k=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/cdd3978a-d8a0-11ee-98e4-5a86bcbeb6e3.jpg"]'::jsonb,
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
  'PROD-01058',
  'DOUTOR ESTRANHO (2023) VOL.02',
  'DOUTOR ESTRANHO (2023) VOL.02',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/vKQYzcoyDD42muESiNHDfcEUfxo=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/5658d1b0-d81a-11ee-9cda-5a86bcbeb6e3.jpg"]'::jsonb,
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
  'PROD-01059',
  'DOUTOR ESTRANHO (2024) N.1',
  'DOUTOR ESTRANHO (2024) N.1',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/dgIkqk96tFfzDaSYKxAJOnvLlRo=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/357110c8-e497-11ee-83ff-7ee42cfe9644.jpg"]'::jsonb,
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
  'PROD-01060',
  'DOUTOR ESTRANHO (2024) VOL.02',
  'DOUTOR ESTRANHO (2024) VOL.02',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/rMbPxWN9waA6bEO3hTzPZ5ELQSs=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/aba7a878-ee29-11ef-be57-cecd8a9fcaf0.jpg"]'::jsonb,
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
  'PROD-01061',
  'DOUTOR ESTRANHO (2024) VOL.03',
  'DOUTOR ESTRANHO (2024) VOL.03',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/SDCa9EHddFHwLToOHJynSdnmPJM=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/9675d2d4-eb29-11ef-8fb2-6696cc3e9cb3.jpg"]'::jsonb,
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
  'PROD-01062',
  'DOUTOR ESTRANHO (2024) VOL.04',
  'DOUTOR ESTRANHO (2024) VOL.04',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/SXsWATX5owU8HXUGwEpydCJjDOA=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/ebde072a-0143-11f0-9a82-ca3c9ea74dec.jpg"]'::jsonb,
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
  'PROD-01063',
  'DOUTOR ESTRANHO DEUS DA MAGIA (MARVEL LEGADO DELUXE)',
  'DOUTOR ESTRANHO DEUS DA MAGIA (MARVEL LEGADO DELUXE)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/WcTZxHKY5NlLCKk1j-lH9ohFWDE=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/7833f16e-4e7d-11ef-876a-e24de145a09c.jpg"]'::jsonb,
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
  'PROD-01064',
  'DOUTOR ESTRANHO POR J. MICHAEL STRACZYNSKI (MARVEL VINTAGE)',
  'DOUTOR ESTRANHO POR J. MICHAEL STRACZYNSKI (MARVEL VINTAGE)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/Jo9cbUzkFZNRZaXjkWJhmNyeXB4=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/800f8e0e-7fa9-11ef-b0bc-6e97175de7f7.jpg"]'::jsonb,
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
  'PROD-01065',
  'DPGC: VISTA GROSSA',
  'DPGC: VISTA GROSSA',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/cuACqEWlCdTbnnUZiGfJp1PHoPY=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/6fabb032-da7d-11ee-87ab-b67307b9a4e9.jpg"]'::jsonb,
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
  'PROD-01066',
  'DR. SLUMP BOX',
  'DR. SLUMP BOX',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/S9zM6w1hppRBsCpV_QmGq8yPEU8=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/df757ac2-eb4a-11ef-8230-fa812316df6c.jpg"]'::jsonb,
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
  'PROD-01067',
  'DR. STONE - 27',
  'DR. STONE - 27',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/fWBBDl8qJ9chXPqy3fuWCQ3gnUk=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/9c47dbbc-eb29-11ef-b1d3-def782e2bf12.jpg"]'::jsonb,
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
  'PROD-01068',
  'DR. STONE - REBOOT',
  'DR. STONE - REBOOT',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/RXxvD-9_dhIOU2JejeE3SObc_uM=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/9f5246d0-eb29-11ef-b7b8-460343881edd.jpg"]'::jsonb,
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
  'PROD-01069',
  'DR. STONE N.10',
  'DR. STONE N.10',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/h9mZHtt4lwF5UQ9WA0WKJH9l3Jk=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/80ac7bc2-4e7d-11ef-9f68-7e82d78027a8.jpg"]'::jsonb,
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
  'PROD-01070',
  'DR. STONE N.2',
  'DR. STONE N.2',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/qTKoulkkASjsk7UqzDOkTlijAEw=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/99dbc3fe-e583-11ee-b66f-62eaabe3d6ba.jpg"]'::jsonb,
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
  'PROD-01071',
  'DR. STONE N.3',
  'DR. STONE N.3',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/_TFFmEVqFdkaM107nslAGfas8Lk=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/68a5bd30-d818-11ee-9412-ce469b473a25.jpg"]'::jsonb,
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
  'PROD-01072',
  'DR. STONE N.4',
  'DR. STONE N.4',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/acIg7B1ysiinyye4FIF4Mpbk2lk=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/9ab2a93c-e583-11ee-9d7c-f2cdc5a9e7d5.jpg"]'::jsonb,
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
  'PROD-01073',
  'DR. STONE N.5',
  'DR. STONE N.5',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/91ui853zQ2XNPHcHPzMItdTvpeQ=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/2c084a10-ebef-11ee-963f-1e73add0c60b.jpg"]'::jsonb,
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
  'PROD-01074',
  'DR. STONE N.6',
  'DR. STONE N.6',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/gv26nmKtjLH7RSCdH9u21sGHVm0=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/80704a76-4e7d-11ef-9e73-0a4d9a837559.jpg"]'::jsonb,
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
  'PROD-01075',
  'DR. STONE N.7',
  'DR. STONE N.7',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/EhbmPkBIvC4M74OH2KEYllP_v-4=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/8076cefa-4e7d-11ef-9a7d-6ef807fbb3ad.jpg"]'::jsonb,
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
  'PROD-01076',
  'DR. STONE N.8',
  'DR. STONE N.8',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/pUQD4Ksyz-Q9oDxrAF6j8Q51ffA=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/808e8928-4e7d-11ef-8063-de10c0ad3180.jpg"]'::jsonb,
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
  'PROD-01077',
  'DR. STONE N.9',
  'DR. STONE N.9',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/EaHLLnukxAB2iUT_lx4a5V5LHbg=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/8091d768-4e7d-11ef-9347-aac1f48a1fd2.jpg"]'::jsonb,
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
  'PROD-01078',
  'DRAGON BALL - 02 [REB6]',
  'DRAGON BALL - 02 [REB6]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/heGbI0Yj_NwByL9CsKNZfG5JP8M=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/48e105d6-5ea9-11f0-885d-4eae30e658d1.jpg"]'::jsonb,
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
  'PROD-01079',
  'DRAGON BALL - 03 [REB5]',
  'DRAGON BALL - 03 [REB5]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/eASLkwOe9iAPkCMXA7xDYl0cX_M=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/4997142a-5ea9-11f0-bc5c-8a0b5d172c0d.jpg"]'::jsonb,
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
  'PROD-01080',
  'DRAGON BALL - 04 [REB5]',
  'DRAGON BALL - 04 [REB5]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/OZy_jZ9olKzrx6n5vA6zdiT9tNY=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/4a18ac6a-5ea9-11f0-bc5c-8a0b5d172c0d.jpg"]'::jsonb,
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
  'PROD-01081',
  'DRAGON BALL - 05 [REB5]',
  'DRAGON BALL - 05 [REB5]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/P8ZE65sqwR5ip32fyP9_0LeP08k=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/4a52602c-5ea9-11f0-bc5c-8a0b5d172c0d.jpg"]'::jsonb,
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
  'PROD-01082',
  'DRAGON BALL - 06 [REB3]',
  'DRAGON BALL - 06 [REB3]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/6KLRMb6P7rcEQK5bjHVveeBL2Cs=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/4a52ef6a-5ea9-11f0-885d-4eae30e658d1.jpg"]'::jsonb,
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
  'PROD-01083',
  'DRAGON BALL - 07 [REB3]',
  'DRAGON BALL - 07 [REB3]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/sIg0Zdx_id_IZjJrd2krOWuUFrI=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/4b845414-5ea9-11f0-bc5c-8a0b5d172c0d.jpg"]'::jsonb,
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
  'PROD-01084',
  'DRAGON BALL - 08 [REB3]',
  'DRAGON BALL - 08 [REB3]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/fBiLxL92ToGmS6W3QggLwWtexCc=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/4acf97fe-5ea9-11f0-bc5c-8a0b5d172c0d.jpg"]'::jsonb,
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
  'PROD-01085',
  'DRAGON BALL - 09 [REB3]',
  'DRAGON BALL - 09 [REB3]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/26mSsMVFxD-2KAdOTB_oB6ooeM0=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/4b6589bc-5ea9-11f0-bc5c-8a0b5d172c0d.jpg"]'::jsonb,
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
  'PROD-01086',
  'DRAGON BALL - 10 [REB2]',
  'DRAGON BALL - 10 [REB2]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/lvrzKbhGSgiQFD42V7HgmgU3PNM=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/4cb35d9e-5ea9-11f0-885d-4eae30e658d1.jpg"]'::jsonb,
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
  'PROD-01087',
  'DRAGON BALL - 11 [REB3]',
  'DRAGON BALL - 11 [REB3]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/pBvrmCneiB6TZeI5xlVqnY7kzys=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/4c23ebfa-5ea9-11f0-885d-4eae30e658d1.jpg"]'::jsonb,
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
  'PROD-01088',
  'DRAGON BALL - 12 [REB3]',
  'DRAGON BALL - 12 [REB3]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/nobSgTxh1jTSEyKA6fv3qkzIsoM=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/4da93598-5ea9-11f0-885d-4eae30e658d1.jpg"]'::jsonb,
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
  'PROD-01089',
  'DRAGON BALL - 13 [REB3]',
  'DRAGON BALL - 13 [REB3]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/cXNVwhykxCVwQ7Go7AgrtSyNJHA=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/4d37e8d4-5ea9-11f0-bc5c-8a0b5d172c0d.jpg"]'::jsonb,
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
  'PROD-01090',
  'DRAGON BALL - 14 [REB3]',
  'DRAGON BALL - 14 [REB3]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/m9vXKdb1-RqX8wqnEy5OlisxYR8=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/4e1a31da-5ea9-11f0-885d-4eae30e658d1.jpg"]'::jsonb,
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
  'PROD-01091',
  'DRAGON BALL - 15 [REB3]',
  'DRAGON BALL - 15 [REB3]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/t0ZJhSSB7nPP-dZrYRCCsYSNYlA=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/4ddf06f0-5ea9-11f0-885d-4eae30e658d1.jpg"]'::jsonb,
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
  'PROD-01092',
  'DRAGON BALL - 16 [REB3]',
  'DRAGON BALL - 16 [REB3]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/S4NFeCJckNL7PTq2JN1YJp0H4Ac=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/4e3ccd08-5ea9-11f0-bc5c-8a0b5d172c0d.jpg"]'::jsonb,
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
  'PROD-01093',
  'DRAGON BALL - 17 [REB3]',
  'DRAGON BALL - 17 [REB3]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/HTfly75pqm9CHO7b6XTUF-Va5wc=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/4f007db6-5ea9-11f0-bc5c-8a0b5d172c0d.jpg"]'::jsonb,
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
  'PROD-01094',
  'DRAGON BALL - 18 [REB3]',
  'DRAGON BALL - 18 [REB3]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/hKgnVhHaDdkTCYN47eMy2fERrVQ=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/4f57d3b8-5ea9-11f0-885d-4eae30e658d1.jpg"]'::jsonb,
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
  'PROD-01095',
  'DRAGON BALL - 19 [REB3]',
  'DRAGON BALL - 19 [REB3]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/oN3mvN9y2W5vVskWnVQmRdbjBgE=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/4fa57dac-5ea9-11f0-bc5c-8a0b5d172c0d.jpg"]'::jsonb,
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
  'PROD-01096',
  'DRAGON BALL - 20 [REB3]',
  'DRAGON BALL - 20 [REB3]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/aCi1CtHg4dke4RYYpR4cRVfbX1M=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/5029267a-5ea9-11f0-bc5c-8a0b5d172c0d.jpg"]'::jsonb,
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
  'PROD-01097',
  'DRAGON BALL - 21 [REB2]',
  'DRAGON BALL - 21 [REB2]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/U1aAbtVCCMrx6N8kacXrQEz05Hs=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/507207a0-5ea9-11f0-bc5c-8a0b5d172c0d.jpg"]'::jsonb,
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
  'PROD-01098',
  'DRAGON BALL BOX 1-21',
  'DRAGON BALL BOX 1-21',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/W_L0I7At5ENQYErGc-d3DRl2Rmg=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/488fc864-8b5f-11f0-b876-cef4535c59b2.jpg"]'::jsonb,
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
  'PROD-01099',
  'DRAGON BALL EDIÇÃO DEFINITIVA - 03 (REB2)',
  'DRAGON BALL EDIÇÃO DEFINITIVA - 03 (REB2)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/T3avNLiqW3Wd9afg7MJKhO8mIpg=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/95370c7e-2461-11ef-81c7-f2a69ad46e56.jpg"]'::jsonb,
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
  'PROD-01100',
  'DRAGON BALL EDIÇÃO DEFINITIVA - 04 (REB)',
  'DRAGON BALL EDIÇÃO DEFINITIVA - 04 (REB)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/rZmZLe316Yrn0SdTsN0xIu9kKbc=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/9661f9a6-2461-11ef-bf30-ee5794111ad8.jpg"]'::jsonb,
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