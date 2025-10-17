-- SQL para importar produtos Brancaleone
-- Gerado em: 2025-10-17T17:52:46.765Z
-- Total de produtos: 3363
-- Fonte: brancaleone-products-1760723254011.json

-- 1. Criar distribuidor (se não existir)

-- Distribuidor já criado no batch-001

-- Lote 44 de 68
-- Produtos: 4301 até 4400



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02151',
  'O ASILO DO CORINGA',
  'O ASILO DO CORINGA',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/wflCfT_zYF16nAB_Jjygd32WYQ0=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/10e77484-eb4b-11ef-8230-fa812316df6c.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02152',
  'O ATERRORIZANTE HOMEM-ARANHA',
  'O ATERRORIZANTE HOMEM-ARANHA',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/_Nby3DsQp5rYUhbT6deycM3OZ-o=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/d67b21c4-eb4a-11ef-a198-2a5f63e8aebc.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02153',
  'O BRAVO E O AUDAZ POR JM N.1',
  'O BRAVO E O AUDAZ POR JM N.1',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/lI_wiaKCBQDRJNZtYXHRVuvQsAQ=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/75c21c76-4e7d-11ef-8179-b2d60c13b884.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02154',
  'O COISA (2024)',
  'O COISA (2024)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/lR_CyBngVgSUuckFCPN_G-snKuw=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/528d3b2c-f032-11ee-a8f4-d25be7f27056.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02155',
  'O DESTINO DO TIO PATINHAS (GRAPHICS DISNEY) N.1',
  'O DESTINO DO TIO PATINHAS (GRAPHICS DISNEY) N.1',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/dAnR3t6jwXigdbbY_OauumkG9B4=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/5cf60528-f111-11ee-85c5-aa53207b786b.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02156',
  'O ESPETACULAR HOMEM-ARAN N.55',
  'O ESPETACULAR HOMEM-ARAN N.55',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/Wngef34dVB_oQPXg78F5h6VAuYw=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/baefc012-d819-11ee-a82e-32937b3ded24.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02157',
  'O ESPETACULAR HOMEM-ARAN N.60',
  'O ESPETACULAR HOMEM-ARAN N.60',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/7UsVGee-QHE0X93NDoYZStZWInU=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/2ff5f9c4-ebef-11ee-8810-22f5b7d93b6a.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02158',
  'O ESPETACULAR HOMEM-ARANHA (2019) N.09/53',
  'O ESPETACULAR HOMEM-ARANHA (2019) N.09/53',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/mUyxIWZG1blFbzQkiS33yRgascg=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/b9a136fa-d819-11ee-a453-e2697ce33d53.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02159',
  'O ESPETACULAR HOMEM-ARANHA (2019) N.11/55',
  'O ESPETACULAR HOMEM-ARANHA (2019) N.11/55',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/agqP3i-zYBw_lwaJWjpAnF4jgzQ=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/ba61120e-d819-11ee-a453-e2697ce33d53.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02160',
  'O ESPETACULAR HOMEM-ARANHA (2019) N.56/12 CAPA VARIANTE',
  'O ESPETACULAR HOMEM-ARANHA (2019) N.56/12 CAPA VARIANTE',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/CRtITGW0JBPaCYbnil1nfEgo_50=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/bbd2bff2-d819-11ee-9cda-5a86bcbeb6e3.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02161',
  'O ESPETACULAR HOMEM-ARANHA (2019) N.57/13 - CAPA VARIANTE',
  'O ESPETACULAR HOMEM-ARANHA (2019) N.57/13 - CAPA VARIANTE',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/6WZ3HTZNLtA-zC2ywEUYfyFQIg8=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/c2ea8bda-d8a0-11ee-82f3-be3c8dbb0cbf.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02162',
  'O ESPETACULAR HOMEM-ARANHA (2019) N.65/21',
  'O ESPETACULAR HOMEM-ARANHA (2019) N.65/21',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/2j3NwAp3jghoyylZRenBN5CtxHc=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/872868be-7fa9-11ef-b1d0-12caec0ea15c.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02163',
  'O ESPETACULAR HOMEM-ARANHA (2019) N.65/21 - CAPA VARIANTE',
  'O ESPETACULAR HOMEM-ARANHA (2019) N.65/21 - CAPA VARIANTE',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/teRoE4_vIeT0wGdw6Y4hkfzt2ks=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/874227ea-7fa9-11ef-b1d0-12caec0ea15c.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02164',
  'O ESPETACULAR HOMEM-ARANHA (2019) N.66/22 - CAPA VARIANTE',
  'O ESPETACULAR HOMEM-ARANHA (2019) N.66/22 - CAPA VARIANTE',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/7K4pRjV0PjXcUPCsU07eYms6f78=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/a49b8c78-eb29-11ef-913d-52f5d450f8a6.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02165',
  'O ESPETACULAR HOMEM-ARANHA (2019) N.67/23',
  'O ESPETACULAR HOMEM-ARANHA (2019) N.67/23',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/0CdQmnpOgJu0Y7LHr_Zu5UT70ls=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/a4a5738c-eb29-11ef-89a1-ce85303a26c9.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02166',
  'O ESPETACULAR HOMEM-ARANHA (2019) N.67/23 - CAPA VARIANTE 1',
  'O ESPETACULAR HOMEM-ARANHA (2019) N.67/23 - CAPA VARIANTE 1',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/4u6QX2h7cEbNmAbOK_ot9TQkoo0=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/a4ca74e8-eb29-11ef-9e36-2a856f41baa0.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02167',
  'O ESPETACULAR HOMEM-ARANHA (2019) N.67/23 - CAPA VARIANTE 2',
  'O ESPETACULAR HOMEM-ARANHA (2019) N.67/23 - CAPA VARIANTE 2',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/ibcdtW3uA9Sq3vj9meWohAwZB4U=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/a4d3714c-eb29-11ef-9927-fa812316df6c.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02168',
  'O ESPETACULAR HOMEM-ARANHA (2019) N.68/24',
  'O ESPETACULAR HOMEM-ARANHA (2019) N.68/24',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/ZAw00SUF2JA9Ry_DsndTlOOyL8U=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/fe2a58c0-feb9-11ef-a5f7-064ccc2c3bb9.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02169',
  'O ESPETACULAR HOMEM-ARANHA (2019) N.68/24 - CAPA VARIANTE 1',
  'O ESPETACULAR HOMEM-ARANHA (2019) N.68/24 - CAPA VARIANTE 1',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/e7VBSFMrzNRM_95Gmkb-ur_VgUg=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/fe44f91e-feb9-11ef-b81f-9246b5a3d333.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02170',
  'O ESPETACULAR HOMEM-ARANHA (2019) N.68/24 - CAPA VARIANTE 2',
  'O ESPETACULAR HOMEM-ARANHA (2019) N.68/24 - CAPA VARIANTE 2',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/mBzqOPL_NvjIvMYTPUY0gd95BzU=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/fe628786-feb9-11ef-89d0-3a3131782535.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02171',
  'O ESPETACULAR HOMEM-ARANHA (2019) N.69/25',
  'O ESPETACULAR HOMEM-ARANHA (2019) N.69/25',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/IsY39FUC1bsXlmq_frrjru39354=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/edd1b55e-0143-11f0-9a82-ca3c9ea74dec.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02172',
  'O ESPETACULAR HOMEM-ARANHA (2019) N.69/25 - CAPA VARIANTE 1',
  'O ESPETACULAR HOMEM-ARANHA (2019) N.69/25 - CAPA VARIANTE 1',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/fzRxhYkpyRqFZ_Epgi-KBwfDAfk=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/edf0cc6e-0143-11f0-9a82-ca3c9ea74dec.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02173',
  'O ESPETACULAR HOMEM-ARANHA (2019) N.69/25 - CAPA VARIANTE 2',
  'O ESPETACULAR HOMEM-ARANHA (2019) N.69/25 - CAPA VARIANTE 2',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/NzGnhPAm1QC99UbTp6ePwvVkLng=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/ee12cb70-0143-11f0-9a82-ca3c9ea74dec.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02174',
  'O ESPETACULAR HOMEM-ARANHA (2019) N.70/26',
  'O ESPETACULAR HOMEM-ARANHA (2019) N.70/26',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/n2OD4YhSvE1ZtwmJplvrd8xxzXY=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/90d2d43e-08c6-11f0-b869-1ee56e5e8e6d.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02175',
  'O ESPETACULAR HOMEM-ARANHA (2019) N.70/26 - CAPA VARIANTE',
  'O ESPETACULAR HOMEM-ARANHA (2019) N.70/26 - CAPA VARIANTE',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/379GnA1_o2p7RzTIv3Hv_jLw05w=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/919fc2fa-08c6-11f0-b869-1ee56e5e8e6d.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02176',
  'O ESPETACULAR HOMEM-ARANHA (2019) N.71/27',
  'O ESPETACULAR HOMEM-ARANHA (2019) N.71/27',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/hf5fDyrVXs2JCGHN_hdBMyrgcTs=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/9cb087c0-1941-11f0-b10c-622de037868f.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02177',
  'O ESPETACULAR HOMEM-ARANHA (2019) N.71/27 - CAPA VARIANTE',
  'O ESPETACULAR HOMEM-ARANHA (2019) N.71/27 - CAPA VARIANTE',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/IdCixo4WGi4YrmX1Ov9Lvey3ThE=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/9cff8a78-1941-11f0-a070-52fdc73cc03d.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02178',
  'O ESPETACULAR HOMEM-ARANHA (2019) N.72/28',
  'O ESPETACULAR HOMEM-ARANHA (2019) N.72/28',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/9Q-121fg5BrxfcMAbFi5JpAQ7Ns=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/14b360e6-2791-11f0-ba21-669ac0b6e7cf.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02179',
  'O ESPETACULAR HOMEM-ARANHA (2019) N.72/28 - CAPA VARIANTE',
  'O ESPETACULAR HOMEM-ARANHA (2019) N.72/28 - CAPA VARIANTE',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/92NRVi7Vq0YObibdy8M3CACjWCs=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/14b38e68-2791-11f0-9e89-c2f6699f8815.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02180',
  'O ESPETACULAR HOMEM-ARANHA (2019) N.73/29',
  'O ESPETACULAR HOMEM-ARANHA (2019) N.73/29',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/ej_W7svD69W_KKZBOo5drNz3cW4=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/2d442916-44b4-11f0-aadf-ca2b21e04af3.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02181',
  'O ESPETACULAR HOMEM-ARANHA (2019) N.74/30',
  'O ESPETACULAR HOMEM-ARANHA (2019) N.74/30',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/NFil07WL0tPvQJU3JgyhQ7SnfaU=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/5fdcf79a-5ea9-11f0-a034-4eae30e658d1.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02182',
  'O ESPETACULAR HOMEM-ARANHA (2019) N.75/31',
  'O ESPETACULAR HOMEM-ARANHA (2019) N.75/31',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/hIetdO-hjRw8_eik2WR8iURCigA=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/235dd91c-6f3c-11f0-b5d2-36049232c238.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02183',
  'O ESPETACULAR HOMEM-ARANHA (2019) N.76/32',
  'O ESPETACULAR HOMEM-ARANHA (2019) N.76/32',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/e_7J-WelvvF6rMY7eiBNhTbPm1s=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/4f72f0f2-8b5f-11f0-b3d9-165df9e621a1.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02184',
  'O ESPETACULAR HOMEM-ARANHA (2019) N.77/33',
  'O ESPETACULAR HOMEM-ARANHA (2019) N.77/33',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/JLsVofB-5-bX3-ghXIfhejb2O58=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/f3257220-9031-11f0-9754-9a60b14b6cd5.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02185',
  'O ESPETACULAR HOMEM-ARANHA N.59',
  'O ESPETACULAR HOMEM-ARANHA N.59',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/cqDZQA-k6YRWR2UQkmYFYY8xuMg=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/43e0ac52-de36-11ee-9846-6255a87f72d4.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02186',
  'O ESPETACULAR HOMEM-ARANHA N.62',
  'O ESPETACULAR HOMEM-ARANHA N.62',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/-1ytTFiGStiemVnJGz_OgFogw58=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/d29f8e6c-119a-11ef-bcb1-8607d1df3044.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02187',
  'O ESPETACULAR HOMEM-ARANHA N.63',
  'O ESPETACULAR HOMEM-ARANHA N.63',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/MZvA6boPlW6rJozFifpUChrwOg4=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/25a7e622-2ce4-11ef-b5ff-6292e5e0d832.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02188',
  'O ESPETACULAR HOMEM-ARANHA N.64',
  'O ESPETACULAR HOMEM-ARANHA N.64',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/pnyfOjtPyW_lgy1sE7-IWYyvH4c=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/8b16f844-4e7d-11ef-8a79-626adc132bdd.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02189',
  'O ESPETACULAR HOMEM-ARANHA N.64',
  'O ESPETACULAR HOMEM-ARANHA N.64',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/ziEcJ31H_fZzGFIRcSOcIObFHlA=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/8b71230a-4e7d-11ef-93f5-0a914f96fc60.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02190',
  'O ESPETACULAR HOMEM-ARANHA: EDICAO DEFINITIVA VOL.02 [REB]',
  'O ESPETACULAR HOMEM-ARANHA: EDICAO DEFINITIVA VOL.02 [REB]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/DBef41IWnyiKFYwSJM7BhULAYyU=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/98fcd958-1941-11f0-841e-32c81c05dd9b.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02191',
  'O ESPETACULAR HOMEM-ARANHA: EDICAO DEFINITIVA VOL.03 (REB2)',
  'O ESPETACULAR HOMEM-ARANHA: EDICAO DEFINITIVA VOL.03 (REB2)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/lRx97zEQAksbdTk-YmWcfRf16Aw=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/8faca810-3692-11f0-9555-620b1f10012d.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02192',
  'O ESPETACULAR HOMEM-ARANHA: EDICAO DEFINITIVA VOL.13',
  'O ESPETACULAR HOMEM-ARANHA: EDICAO DEFINITIVA VOL.13',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/zuH4TidBPY7l0Qoh1YSjxXiUfEQ=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/81f04bbe-08c5-11f0-a2cf-7e024f525d71.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02193',
  'O ESPETACULAR HOMEM-ARANHA: EDICAO DEFINITIVA VOL.14',
  'O ESPETACULAR HOMEM-ARANHA: EDICAO DEFINITIVA VOL.14',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/0eyFj4HbMafD3zL0t25glXio7CY=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/818f4972-7fa9-11ef-b1d0-12caec0ea15c.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02194',
  'O ESPETACULAR HOMEM-ARANHA: EDICAO DEFINITIVA VOL.15',
  'O ESPETACULAR HOMEM-ARANHA: EDICAO DEFINITIVA VOL.15',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/L_rB-CJfunuD8p0KRDaTfWj16Ow=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/20984208-6f3c-11f0-b5d2-36049232c238.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02195',
  'O GUARDA-COSTAS DE HONEKO AKABANE - 01',
  'O GUARDA-COSTAS DE HONEKO AKABANE - 01',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/IIYiL-zwc2rcQJ_ZO377MMrOkB8=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/4cae0ea2-fb7c-11ee-bf53-e27a9dd5d6a4.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02196',
  'O GUARDA-COSTAS DE HONEKO AKABANE - 02',
  'O GUARDA-COSTAS DE HONEKO AKABANE - 02',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/QBW5EJU6mZdFC2cSFp1QUkjszRQ=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/4ad95f6a-1705-11ef-aada-fab3bf54036d.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02197',
  'O GUARDA-COSTAS DE HONEKO AKABANE - 03',
  'O GUARDA-COSTAS DE HONEKO AKABANE - 03',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/VhpwWevClnW-BX-Tk85oqtnVzc4=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/c74f9074-63e4-11ef-82a2-5ee4edcac102.png"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02198',
  'O GUARDA-COSTAS DE HONEKO AKABANE - 04',
  'O GUARDA-COSTAS DE HONEKO AKABANE - 04',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/1Lie6VHdq0CiPBfccRFkIJHVQyg=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/8111619c-7fa9-11ef-b0bc-6e97175de7f7.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02199',
  'O GUARDA-COSTAS DE HONEKO AKABANE - 05',
  'O GUARDA-COSTAS DE HONEKO AKABANE - 05',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/8ebe8YMr2MNuQu1Ee5myYu0KU5M=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/db42584e-eb4a-11ef-8230-fa812316df6c.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02200',
  'O GUARDA-COSTAS DE HONEKO AKABANE - 06',
  'O GUARDA-COSTAS DE HONEKO AKABANE - 06',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/WgQDV_YnMJSNDxntCHqhyVGSlkQ=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/99a723b8-eb29-11ef-9927-fa812316df6c.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();