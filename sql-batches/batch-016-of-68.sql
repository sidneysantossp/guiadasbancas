-- SQL para importar produtos Brancaleone
-- Gerado em: 2025-10-17T18:20:53.612Z
-- Total de produtos: 3363
-- Fonte: brancaleone-products-1760723254011.json

-- 1. Criar distribuidor (se não existir)

-- Distribuidor já criado no batch-001

-- Lote 16 de 68
-- Produtos: 1501 até 1600



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00751',
  'CASCAO (2021-) N.76',
  'CASCAO (2021-) N.76',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/g_nnKdiKRb7Np3qJLtbYaTij3rg=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/9f5d2a6e-1941-11f0-a070-52fdc73cc03d.jpg"]'::jsonb,
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
  'PROD-00752',
  'CASCAO (2021-) N.77',
  'CASCAO (2021-) N.77',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/3ZQpMKVYSkA5P2En5i2Ccic3Oec=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/3d9dbe30-2475-11f0-8d00-e6e875f51541.jpg"]'::jsonb,
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
  'PROD-00753',
  'CASCAO (2021-) N.78',
  'CASCAO (2021-) N.78',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/RkH2BKyqoVFFKWxbJlxRngLY7mc=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/53b21e2a-2473-11f0-a596-1e01f72415a5.jpg"]'::jsonb,
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
  'PROD-00754',
  'CASCAO (2021-) N.79',
  'CASCAO (2021-) N.79',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/XBAhX_MPW6NBohdPHro1_Knrhh4=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/8deeaea6-3692-11f0-ab90-9a315decf800.jpg"]'::jsonb,
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
  'PROD-00755',
  'CASCAO (2021-) N.80',
  'CASCAO (2021-) N.80',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/5NiHGsCZLuShqZxSE8SLA1jyqLE=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/d791de70-3f2f-11f0-a17d-1ac4d5553c9e.jpg"]'::jsonb,
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
  'PROD-00756',
  'CASCAO (2021-) N.81',
  'CASCAO (2021-) N.81',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/YPBn4roRNLb6BUD1WfbAEfbjbJA=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/233e83d8-48b7-11f0-9d89-9eda44bc3e04.jpg"]'::jsonb,
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
  'PROD-00757',
  'CASCAO (2021-) N.82',
  'CASCAO (2021-) N.82',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/_aI-PlKG9WQJOapdtLeGXP9HokM=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/362a37aa-5ea9-11f0-885d-4eae30e658d1.jpg"]'::jsonb,
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
  'PROD-00758',
  'CASCAO (2021-) N.83',
  'CASCAO (2021-) N.83',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/N3MCh8LewZM6o0t_YphxaRd5h-U=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/365b6406-5ea9-11f0-885d-4eae30e658d1.jpg"]'::jsonb,
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
  'PROD-00759',
  'CASCAO (2021-) N.84',
  'CASCAO (2021-) N.84',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/_aI-PlKG9WQJOapdtLeGXP9HokM=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/362a37aa-5ea9-11f0-885d-4eae30e658d1.jpg"]'::jsonb,
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
  'PROD-00760',
  'CASCAO (2021-) N.85',
  'CASCAO (2021-) N.85',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/2BkeTXx2GzVr6TokrlmQU3Cfn6w=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/336a6118-7fd1-11f0-a5af-de5e70a27ff7.jpg"]'::jsonb,
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
  'PROD-00761',
  'CASCAO (2021-) N.86',
  'CASCAO (2021-) N.86',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/3sS-Di5uH0vZq6UceXlafdDum8c=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/338dedf4-7fd1-11f0-a5af-de5e70a27ff7.jpg"]'::jsonb,
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
  'PROD-00762',
  'CASCAO (2021-) N.87',
  'CASCAO (2021-) N.87',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/GKLfF1rg5CJa2PEZCJoxyBLhWOU=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/012802b0-98c6-11f0-a07b-7a8d79504171.jpg"]'::jsonb,
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
  'PROD-00763',
  'CASCAO (2021-) N.88',
  'CASCAO (2021-) N.88',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/acvWhe8WDsQRiYvqRxJdoIO5V2Y=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/20ea8f90-a4ac-11f0-a72e-eecb83d78201.jpg"]'::jsonb,
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
  'PROD-00764',
  'CAVALEIRO DA LUA (2022)  N.5',
  'CAVALEIRO DA LUA (2022)  N.5',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/9cxYSYfEo5GJWZVyK9vWOF96lKo=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/c4214cda-63e4-11ef-9c41-c67e4ff8d839.png"]'::jsonb,
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
  'PROD-00765',
  'CAVALEIRO DA LUA (2022)  VOL.04',
  'CAVALEIRO DA LUA (2022)  VOL.04',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/48geiG-jhfccXmVXYMkWOvbVFQg=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/10d03992-d817-11ee-a833-6efcfa6dd7bd.jpg"]'::jsonb,
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
  'PROD-00766',
  'CAVALEIRO DA LUA: PRETO, BRANCO E SANGUE',
  'CAVALEIRO DA LUA: PRETO, BRANCO E SANGUE',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/K2NCfjBe5TMqLExu2UCkSl_TPlo=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/383e27f0-d817-11ee-b124-5a86bcbeb6e3.jpg"]'::jsonb,
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
  'PROD-00767',
  'CAVALEIRO DOS PESADELOS VOL.1',
  'CAVALEIRO DOS PESADELOS VOL.1',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/qExxn-Z5La1xWujcrUAFXlX3xGI=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/29f4e0e4-ebef-11ee-8810-22f5b7d93b6a.jpg"]'::jsonb,
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
  'PROD-00768',
  'CAVALEIRO DOS PESADELOS VOL.2',
  'CAVALEIRO DOS PESADELOS VOL.2',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/UGJIs2wgqZ4eyhDFDkQx6A4Vr3s=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/49a06b66-1705-11ef-abc5-2e56742d26c4.jpg"]'::jsonb,
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
  'PROD-00769',
  'CAVALEIRO DOS PESADELOS: CONTOS SOMBRIOS VOL.1',
  'CAVALEIRO DOS PESADELOS: CONTOS SOMBRIOS VOL.1',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/qgFCtedTS92fQBFROU7PR8x-Qr4=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/5d4da54e-f111-11ee-acb2-c2c92ce95e2a.jpg"]'::jsonb,
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
  'PROD-00770',
  'CAVALEIRO DOS PESADELOS: CONTOS SOMBRIOS VOL.2',
  'CAVALEIRO DOS PESADELOS: CONTOS SOMBRIOS VOL.2',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/8LI6jpxL1rxv3oYdoHMwX-vX19o=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/599b3326-0cc8-11ef-a5c2-9eafaa3ca1cb.jpg"]'::jsonb,
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
  'PROD-00771',
  'CAVALEIROS DAS TREVAS DE ACO: SEGREDOS DO INVERNO',
  'CAVALEIROS DAS TREVAS DE ACO: SEGREDOS DO INVERNO',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/V9ChtRfFAlNpMfSms7j005pXiUA=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/202c3686-69af-11f0-9136-d26b36de5d6c.jpg"]'::jsonb,
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
  'PROD-00772',
  'CBF - 30 ANOS DO TETRA',
  'CBF - 30 ANOS DO TETRA',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/QTzRlDfTzCvrvHC0hID-VWGT2LA=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/c4bfb190-63e4-11ef-8233-ba818e5f55ac.png"]'::jsonb,
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
  'PROD-00773',
  'CEBOLINHA (2021-) N.63',
  'CEBOLINHA (2021-) N.63',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/vQdjY21HokITQxZDNXTRzr2Pkqk=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/7e440280-7fa9-11ef-b0bc-6e97175de7f7.jpg"]'::jsonb,
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
  'PROD-00774',
  'CEBOLINHA (2021-) N.65',
  'CEBOLINHA (2021-) N.65',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/kP0ZsYhRn1ASbca4fsXsZ3l9Euk=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/33d4e858-7fd1-11f0-a5af-de5e70a27ff7.jpg"]'::jsonb,
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
  'PROD-00775',
  'CEBOLINHA (2021-) N.71',
  'CEBOLINHA (2021-) N.71',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/glO76Z8uCNHemEg1O1dOWJAWfrA=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/935da194-eb29-11ef-8fb2-6696cc3e9cb3.jpg"]'::jsonb,
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
  'PROD-00776',
  'CEBOLINHA (2021-) N.73',
  'CEBOLINHA (2021-) N.73',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/yx8lLmqg_c4IWECGgWNGNSV_ikM=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/1079c924-f2f9-11ef-84b0-4a557680f2ea.jpg"]'::jsonb,
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
  'PROD-00777',
  'CEBOLINHA (2021-) N.75',
  'CEBOLINHA (2021-) N.75',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/4Y1MkG0Prk9te0jOdVxQVphIA6w=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/845ba096-08c6-11f0-8e32-0e7787c15de6.jpg"]'::jsonb,
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
  'PROD-00778',
  'CEBOLINHA (2021-) N.76',
  'CEBOLINHA (2021-) N.76',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/SeKQaYWgq7Klb4BhiqILkVuST6A=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/9596dcf0-1941-11f0-a9be-7a7afc96fac7.jpg"]'::jsonb,
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
  'PROD-00779',
  'CEBOLINHA (2021-) N.77',
  'CEBOLINHA (2021-) N.77',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/nAP3PVmQmeAyJ4RHmsVqJYeF_rg=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/213c5c4e-a4ac-11f0-aa03-16ade38a6d4b.jpg"]'::jsonb,
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
  'PROD-00780',
  'CEBOLINHA (2021-) N.78',
  'CEBOLINHA (2021-) N.78',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/ut9ngroFClhkaVk1YcmTWzfp_Bw=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/33f8b0e4-7fd1-11f0-b894-2e1dcafaddd0.jpg"]'::jsonb,
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
  'PROD-00781',
  'CEBOLINHA (2021-) N.79',
  'CEBOLINHA (2021-) N.79',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/kByGBhwyClqJIaVo5pCVzDLf8YI=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/8dfe1328-3692-11f0-b775-ca6651de2295.jpg"]'::jsonb,
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
  'PROD-00782',
  'CEBOLINHA (2021-) N.80',
  'CEBOLINHA (2021-) N.80',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/2TyW7vlWlqb0A9DuhVogGiewLdo=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/d7d25fb8-3f2f-11f0-87b4-c2502d24ff3f.jpg"]'::jsonb,
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
  'PROD-00783',
  'CEBOLINHA (2021-) N.82',
  'CEBOLINHA (2021-) N.82',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/pWEQx4IlLiJOS34IF9r-k52AUOw=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/370a63ac-5ea9-11f0-885d-4eae30e658d1.jpg"]'::jsonb,
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
  'PROD-00784',
  'CEBOLINHA (2021-) N.83',
  'CEBOLINHA (2021-) N.83',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/2XV_XbI58CMgJUNq6HCoU8BlnUQ=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/375a3512-5ea9-11f0-b8ff-8a0b5d172c0d.jpg"]'::jsonb,
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
  'PROD-00785',
  'CEBOLINHA (2021-) N.84',
  'CEBOLINHA (2021-) N.84',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/pWEQx4IlLiJOS34IF9r-k52AUOw=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/370a63ac-5ea9-11f0-885d-4eae30e658d1.jpg"]'::jsonb,
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
  'PROD-00786',
  'CEBOLINHA (2021-) N.85',
  'CEBOLINHA (2021-) N.85',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/dQ4OtlqTMB-M2auXKA7Is6H4Zjc=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/34070392-7fd1-11f0-a5af-de5e70a27ff7.jpg"]'::jsonb,
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
  'PROD-00787',
  'CEBOLINHA (2021-) N.86',
  'CEBOLINHA (2021-) N.86',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/MfSCLS_K2oy5256gB-t2fj6zyag=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/3459684e-7fd1-11f0-b894-2e1dcafaddd0.jpg"]'::jsonb,
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
  'PROD-00788',
  'CEBOLINHA (2021-) N.87',
  'CEBOLINHA (2021-) N.87',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/s_P6WPYZ43hjjr437iqwd3px4yk=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/018b8ec0-98c6-11f0-af89-d2e8520fe6b7.jpg"]'::jsonb,
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
  'PROD-00789',
  'CEBOLINHA (2021-) N.88',
  'CEBOLINHA (2021-) N.88',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/QVFwTPKflXd1HYb4Mu5MHLtxbpg=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/216b9388-a4ac-11f0-aa03-16ade38a6d4b.jpg"]'::jsonb,
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
  'PROD-00790',
  'CHAIN SAW MAN - 01 [REB6]',
  'CHAIN SAW MAN - 01 [REB6]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/LAHVxxFa_RAqrFNd59Y5NXU7k7A=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/3dba6fd6-0cc9-11ef-9bfa-3619a1e0872c.jpg"]'::jsonb,
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
  'PROD-00791',
  'CHAINSAW MAN - 02 [REB6]',
  'CHAINSAW MAN - 02 [REB6]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/KLYqZijN34SQq40ephbD8WlaNkk=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/34aa651e-7fd1-11f0-a5af-de5e70a27ff7.jpg"]'::jsonb,
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
  'PROD-00792',
  'CHAINSAW MAN - 03 [REB7]',
  'CHAINSAW MAN - 03 [REB7]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/JjD08NNMfMI7GjzM7n0D3dlNCJ0=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/34d87c7e-7fd1-11f0-b894-2e1dcafaddd0.jpg"]'::jsonb,
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
  'PROD-00793',
  'CHAINSAW MAN - 04 [REB4]',
  'CHAINSAW MAN - 04 [REB4]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/1fGTyHM3HfjV9-hEJ4pxX-jlxT0=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/34eb5eac-7fd1-11f0-a5af-de5e70a27ff7.jpg"]'::jsonb,
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
  'PROD-00794',
  'CHAINSAW MAN - 04 [REB6]',
  'CHAINSAW MAN - 04 [REB6]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/l_nQT8wW8k_RACCcUZl0cap-u4w=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/350b9a0a-7fd1-11f0-b894-2e1dcafaddd0.jpg"]'::jsonb,
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
  'PROD-00795',
  'CHAINSAW MAN - 05 [REB5]',
  'CHAINSAW MAN - 05 [REB5]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/YdrQ_S4UiXBFIQOdien5sM9ZXLw=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/3551816e-7fd1-11f0-b894-2e1dcafaddd0.jpg"]'::jsonb,
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
  'PROD-00796',
  'CHAINSAW MAN - 06 [REB5]',
  'CHAINSAW MAN - 06 [REB5]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/ME8TDacebC5ZRnnN169icNmEOSY=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/5522d44a-8b5f-11f0-b3d9-165df9e621a1.jpg"]'::jsonb,
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
  'PROD-00797',
  'CHAINSAW MAN - 07 [REB4]',
  'CHAINSAW MAN - 07 [REB4]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/NT95MHboYnT413yZjBxZfwQFvMk=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/355a28dc-7fd1-11f0-a5af-de5e70a27ff7.jpg"]'::jsonb,
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
  'PROD-00798',
  'CHAINSAW MAN - 08 [REB5]',
  'CHAINSAW MAN - 08 [REB5]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/up-tqJdI0QWrlYgJDAXrb_RnDLI=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/357f60c0-7fd1-11f0-b894-2e1dcafaddd0.jpg"]'::jsonb,
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
  'PROD-00799',
  'CHAINSAW MAN - 09 [REB5]',
  'CHAINSAW MAN - 09 [REB5]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/rEsxFoLZe3yTgeM7zYY9mBMGkag=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/358c691e-7fd1-11f0-a5af-de5e70a27ff7.jpg"]'::jsonb,
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
  'PROD-00800',
  'CHAINSAW MAN - 10 [REB5]',
  'CHAINSAW MAN - 10 [REB5]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/uM6LsPUSM_Mj6IBLiiIeMYTueOY=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/35b33b8e-7fd1-11f0-b894-2e1dcafaddd0.jpg"]'::jsonb,
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