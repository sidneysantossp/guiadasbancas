-- SQL para importar produtos Brancaleone
-- Gerado em: 2025-10-17T18:20:53.612Z
-- Total de produtos: 3363
-- Fonte: brancaleone-products-1760723254011.json

-- 1. Criar distribuidor (se não existir)

-- Distribuidor já criado no batch-001

-- Lote 36 de 68
-- Produtos: 3501 até 3600



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01751',
  'MABATAKI YORI HAYAKU!! - NUM PISCAR DE OLHOS - 10',
  'MABATAKI YORI HAYAKU!! - NUM PISCAR DE OLHOS - 10',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/ShEzKHeSbrq736rMIIvHsTyoR9o=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/95999e9e-08c6-11f0-ac22-660c4bd9985d.jpg"]'::jsonb,
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
  'PROD-01752',
  'MABATAKI YORI HAYAKU!! - NUM PISCAR DE OLHOS - 11',
  'MABATAKI YORI HAYAKU!! - NUM PISCAR DE OLHOS - 11',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/8vBEc7h0tpXYeaYv8US4GUVD_RI=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/9137840c-3692-11f0-a81e-4229cd842ad5.jpg"]'::jsonb,
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
  'PROD-01753',
  'MABATAKI YORI HAYAKU!! NUM PISCAR DE OLHOS!! - 02',
  'MABATAKI YORI HAYAKU!! NUM PISCAR DE OLHOS!! - 02',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/Dd30DNPWBdqTVS-AhbY2zQrMb6s=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/fa73ee0c-d819-11ee-a8da-56e6c271e0a3.jpg"]'::jsonb,
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
  'PROD-01754',
  'MABATAKI YORI HAYAKU!! NUM PISCAR DE OLHOS!! - 03',
  'MABATAKI YORI HAYAKU!! NUM PISCAR DE OLHOS!! - 03',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/_IKqYXr1zcrh8qosXDE8V3iChKg=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/fabe7008-d819-11ee-83df-e2e54ed5f9f7.jpg"]'::jsonb,
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
  'PROD-01755',
  'MABATAKI YORI HAYAKU!! NUM PISCAR DE OLHOS!! - 04',
  'MABATAKI YORI HAYAKU!! NUM PISCAR DE OLHOS!! - 04',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/K2qjl1U8TJOeYzhmQjog6VXAlfA=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/fb28c782-d819-11ee-a8da-56e6c271e0a3.jpg"]'::jsonb,
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
  'PROD-01756',
  'MABATAKI YORI HAYAKU!! NUM PISCAR DE OLHOS!! - 05',
  'MABATAKI YORI HAYAKU!! NUM PISCAR DE OLHOS!! - 05',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/XdwcpKG8Bi5Sf9KoCl-Sc9NYCWU=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/d51841b6-119a-11ef-ad89-8e32d0639719.jpg"]'::jsonb,
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
  'PROD-01757',
  'MABATAKI YORI HAYAKU!! NUM PISCAR DE OLHOS!! - 06',
  'MABATAKI YORI HAYAKU!! NUM PISCAR DE OLHOS!! - 06',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/h_xS5UMDIfCOiAahJAm9fE_hocA=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/8c78a098-4e7d-11ef-ac42-beb74448c7ce.jpg"]'::jsonb,
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
  'PROD-01758',
  'MAGALI (2021-) N.71',
  'MAGALI (2021-) N.71',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/QL0jkJU7pxbakvu9N3Q6mH7bg_o=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/9d6c2e80-eb29-11ef-b7b8-460343881edd.jpg"]'::jsonb,
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
  'PROD-01759',
  'MAGALI (2021-) N.72',
  'MAGALI (2021-) N.72',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/xkUSEyJrehTE9H-Mt9JYTtstHwU=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/9d955896-eb29-11ef-a3b1-5681c2ac1d4b.jpg"]'::jsonb,
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
  'PROD-01760',
  'MAGALI (2021-) N.73',
  'MAGALI (2021-) N.73',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/X1-LUp5ZPXVGvcUxykvgP0Tgvp8=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/1d9ae084-f2f9-11ef-87c9-c69faf7ce99e.jpg"]'::jsonb,
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
  'PROD-01761',
  'MAGALI (2021-) N.74',
  'MAGALI (2021-) N.74',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/n9XmfFSun8d2nKtdE8fcWOc8xC4=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/03e3df60-98c6-11f0-959d-7613bb286ee1.jpg"]'::jsonb,
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
  'PROD-01762',
  'MAGALI (2021-) N.75',
  'MAGALI (2021-) N.75',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/qTMdHaPRP1XP5CIUNLU0XEmia78=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/8340c4e4-08c5-11f0-8cf7-7a78406af7b7.jpg"]'::jsonb,
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
  'PROD-01763',
  'MAGALI (2021-) N.76',
  'MAGALI (2021-) N.76',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/hcul6lme9PvGnAsr_8Q4r97N8lQ=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/99c0264c-1941-11f0-89d0-967dab4f0af5.jpg"]'::jsonb,
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
  'PROD-01764',
  'MAGALI (2021-) N.77',
  'MAGALI (2021-) N.77',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/3JedrBV2bxAJsjRPWcjrrpQJ-hk=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/268815d0-a4ac-11f0-9bb5-ee8f90996b43.jpg"]'::jsonb,
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
  'PROD-01765',
  'MAGALI (2021-) N.78',
  'MAGALI (2021-) N.78',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/R8AyC4k2B9ffaKF1sYw0dmyXBCI=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/59585f10-2473-11f0-b202-e6e875f51541.jpg"]'::jsonb,
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
  'PROD-01766',
  'MAGALI (2021-) N.79',
  'MAGALI (2021-) N.79',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/iAtEs87zs6dEYdYOjmye_kDnjZU=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/56833b8c-5ea9-11f0-a034-4eae30e658d1.jpg"]'::jsonb,
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
  'PROD-01767',
  'MAGALI (2021-) N.80',
  'MAGALI (2021-) N.80',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/IskX4-fSUEjwv7b-EOuo2DhM-RY=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/dc823f9c-3f2f-11f0-a17d-1ac4d5553c9e.jpg"]'::jsonb,
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
  'PROD-01768',
  'MAGALI (2021-) N.82',
  'MAGALI (2021-) N.82',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/abOarzOLl-SSW7ftvsd8-iBl4uA=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/d51bea30-4daf-11f0-9750-c68fdf865aae.jpg"]'::jsonb,
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
  'PROD-01769',
  'MAGALI (2021-) N.83',
  'MAGALI (2021-) N.83',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/T231kjd2vK56jX33waz0JUqOuWs=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/56c522fe-5ea9-11f0-bc5c-8a0b5d172c0d.jpg"]'::jsonb,
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
  'PROD-01770',
  'MAGALI (2021-) N.84',
  'MAGALI (2021-) N.84',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/abOarzOLl-SSW7ftvsd8-iBl4uA=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/d51bea30-4daf-11f0-9750-c68fdf865aae.jpg"]'::jsonb,
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
  'PROD-01771',
  'MAGALI (2021-) N.85',
  'MAGALI (2021-) N.85',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/MUwDXblkrgx6nkWNuFQcMkQbwuM=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/3c1653da-7fd1-11f0-b894-2e1dcafaddd0.jpg"]'::jsonb,
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
  'PROD-01772',
  'MAGALI (2021-) N.86',
  'MAGALI (2021-) N.86',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/ZmSlQCo9kfr3nBFrip0RAlwGD2g=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/3c2155aa-7fd1-11f0-a5af-de5e70a27ff7.jpg"]'::jsonb,
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
  'PROD-01773',
  'MAGALI (2021-) N.87',
  'MAGALI (2021-) N.87',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/ZqCLspWLgtF0yMMaH-TBPwowjD4=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/03e563bc-98c6-11f0-8284-c616cd2f5b48.jpg"]'::jsonb,
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
  'PROD-01774',
  'MAGALI (2021-) N.88',
  'MAGALI (2021-) N.88',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/Jq0NT4kkQR4pfjyDnM76ksZF_PA=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/26a97018-a4ac-11f0-a599-8e83af06c4a6.jpg"]'::jsonb,
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
  'PROD-01775',
  'MAGALI 60 ANOS N.1',
  'MAGALI 60 ANOS N.1',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/CpxywrWO0QBorT5S5ct9JPMqNqo=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/e995b8dc-eb4a-11ef-8230-fa812316df6c.jpg"]'::jsonb,
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
  'PROD-01776',
  'MAGALI RECEITA (GRAPHIC MSP N. 40) BROCHURA',
  'MAGALI RECEITA (GRAPHIC MSP N. 40) BROCHURA',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/ewR2it5FC0eqe4uMGFeeXcQZAxw=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/12a72ada-d819-11ee-b57d-56e6c271e0a3.jpg"]'::jsonb,
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
  'PROD-01777',
  'MAGALI RECEITA (GRAPHIC MSP N. 40) CAPA DURA',
  'MAGALI RECEITA (GRAPHIC MSP N. 40) CAPA DURA',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/lPa3GwEEM98FJRkknFLnmcsTh6c=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/c6a7feee-642a-11f0-855d-8e3a9156bfaa.jpg"]'::jsonb,
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
  'PROD-01778',
  'MAGILUMIERE - 08',
  'MAGILUMIERE - 08',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/mre_Pp5GOVOoToNrU48Ttj8yKHQ=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/cfb52596-0ea0-11f0-92cd-7a93fae60ab5.jpg"]'::jsonb,
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
  'PROD-01779',
  'MAGILUMIERE - 09',
  'MAGILUMIERE - 09',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/KziHscIuQiNdTpV3rFFEQV0y2dg=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/90025e68-3692-11f0-9555-620b1f10012d.jpg"]'::jsonb,
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
  'PROD-01780',
  'MAGILUMIERE - 10',
  'MAGILUMIERE - 10',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/X4yfuoKoZWjZi4b6r3KycZ64n6I=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/491cdbd2-8b5f-11f0-b3d9-165df9e621a1.jpg"]'::jsonb,
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
  'PROD-01781',
  'MAGILUMIERE - 5',
  'MAGILUMIERE - 5',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/HkmZUpD91UnBD5Av8WqFUb6mNcg=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/840a8298-7fa9-11ef-b1d0-12caec0ea15c.jpg"]'::jsonb,
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
  'PROD-01782',
  'MAGILUMIERE N.3',
  'MAGILUMIERE N.3',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/iS29zXvowRQoxK_2F1V2NvM3jVA=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/1b132656-069a-11ef-a94b-3e276098a5a4.jpg"]'::jsonb,
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
  'PROD-01783',
  'MAGILUMIERE N.4',
  'MAGILUMIERE N.4',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/YqsusFk1qbDMQzeqdQeIZHmmSdU=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/823ab68e-4e7d-11ef-84e5-52cebc2dd4d3.jpg"]'::jsonb,
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
  'PROD-01784',
  'MAGILUMIERE: COMPANHIA DAS GAROTAS MAGICAS - 01',
  'MAGILUMIERE: COMPANHIA DAS GAROTAS MAGICAS - 01',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/SM7cQN_JsPoFCecaN6hhq-FBcKs=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/2641cfa8-a4ac-11f0-ac43-c20d3852b6b7.jpg"]'::jsonb,
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
  'PROD-01785',
  'MAGILUMIERE: COMPANHIA DAS GAROTAS MAGICAS - 06',
  'MAGILUMIERE: COMPANHIA DAS GAROTAS MAGICAS - 06',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/J522BfrJet3VmWjnaoqb-uBqnw4=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/e3ba355a-eb4a-11ef-8621-0ee70347c223.jpg"]'::jsonb,
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
  'PROD-01786',
  'MAGILUMIERE: COMPANHIA DAS GAROTAS MAGICAS - 07',
  'MAGILUMIERE: COMPANHIA DAS GAROTAS MAGICAS - 07',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/F0XNp820n4Bg2thI5pADH6y0Y_Q=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/9d3ef2e4-eb29-11ef-8d7f-eea3b61904a2.jpg"]'::jsonb,
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
  'PROD-01787',
  'MANGA THEATER - 01',
  'MANGA THEATER - 01',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/y4JB1qU35FZjh0d-f-nByy3AWn0=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/969f48d6-d819-11ee-b57d-56e6c271e0a3.jpg"]'::jsonb,
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
  'PROD-01788',
  'MANGA THEATER - 02',
  'MANGA THEATER - 02',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/3JUug73ld-xGjMAf8HH8qNU9FvY=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/c4a02f7a-d8a0-11ee-82f3-be3c8dbb0cbf.jpg"]'::jsonb,
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
  'PROD-01789',
  'MANGA THEATER - 03',
  'MANGA THEATER - 03',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/1776LMMsC6vJo3sCg1O55NGPKrY=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/96fe0cb8-d819-11ee-947a-32937b3ded24.jpg"]'::jsonb,
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
  'PROD-01790',
  'MANGAKÁ DA FAVELA - 01',
  'MANGAKÁ DA FAVELA - 01',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/70OA9LJgTq6hIxrSAunJQyE_T-w=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/56596e8a-2473-11f0-ba8e-c2e6fa9c5cc5.jpg"]'::jsonb,
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
  'PROD-01791',
  'MAO - 07',
  'MAO - 07',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/dJhHdaJctBnYrW7S0Xq0srA7hrM=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/f8b09cd8-2930-11ef-93b8-4a187dfd8c76.jpg"]'::jsonb,
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
  'PROD-01792',
  'MAO - 13',
  'MAO - 13',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/NXrnwGVNQ8U5hI3CIMtOCPQLHpU=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/f1bdac72-d818-11ee-bb5a-de7d367e92b3.jpg"]'::jsonb,
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
  'PROD-01793',
  'MAO - 14',
  'MAO - 14',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/1i-yLJJVutFiXyX-XhVVeGU721I=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/f26b2456-d818-11ee-89ed-e2697ce33d53.jpg"]'::jsonb,
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
  'PROD-01794',
  'MAO - 16',
  'MAO - 16',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/wQuhBAgG5kEzD-hzh1AXSJcbSo4=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/f3631af8-d818-11ee-947a-32937b3ded24.jpg"]'::jsonb,
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
  'PROD-01795',
  'MAO - 19',
  'MAO - 19',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/5QcQhvM0-_gm-VxZgpO71a-SlEA=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/e6244272-eb4a-11ef-8621-0ee70347c223.jpg"]'::jsonb,
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
  'PROD-01796',
  'MAO - 20',
  'MAO - 20',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/Y4q1VcYWBdWg2lzKRCSPfC6Tte8=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/9e026fc6-eb29-11ef-913d-52f5d450f8a6.jpg"]'::jsonb,
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
  'PROD-01797',
  'MAO - 21',
  'MAO - 21',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/dlMr2KSdELVgvIK5hgXd9CqiHYc=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/8392f2dc-08c5-11f0-adfa-9add630305de.jpg"]'::jsonb,
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
  'PROD-01798',
  'MAO - 22',
  'MAO - 22',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/zFgPza7mCvRlES15S0kSPR7DDnU=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/3c7433a6-7fd1-11f0-b894-2e1dcafaddd0.jpg"]'::jsonb,
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
  'PROD-01799',
  'MAO N.15',
  'MAO N.15',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/2GPj9AmHs1zQdnL1V8bQgwbZIP8=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/f2af8344-d818-11ee-bb5a-de7d367e92b3.jpg"]'::jsonb,
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
  'PROD-01800',
  'MAO N.17',
  'MAO N.17',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/2du-pKt6JFqa5T5P50KN_Jihkz4=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/2e76aada-ebef-11ee-8810-22f5b7d93b6a.jpg"]'::jsonb,
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