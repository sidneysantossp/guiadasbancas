-- SQL para importar produtos Brancaleone
-- Gerado em: 2025-10-17T18:20:53.612Z
-- Total de produtos: 3363
-- Fonte: brancaleone-products-1760723254011.json

-- 1. Criar distribuidor (se não existir)

-- Distribuidor já criado no batch-001

-- Lote 14 de 68
-- Produtos: 1301 até 1400



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00651',
  'BLUE PERIOD - 05 [REB]',
  'BLUE PERIOD - 05 [REB]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/4B4JSheCuhdywoHxVgHbFijGJEk=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/d2197bd4-0ea0-11f0-b6d9-5e5a8362666a.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00652',
  'BLUE PERIOD - 06 [REB]',
  'BLUE PERIOD - 06 [REB]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/zgmCAeCM7ivtOIYRkh_N2skL_hc=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/cd824a7e-0ea0-11f0-8b42-eedf42219d7c.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00653',
  'BLUE PERIOD - 08',
  'BLUE PERIOD - 08',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/MmuW78TDlaME-jj94JQafn7G-is=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/e79457c0-d816-11ee-a1d7-e2a33adec5cd.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00654',
  'BLUE PERIOD - 09',
  'BLUE PERIOD - 09',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/zaF728Be5o1wn4SwU_M8Ms6waC8=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/e85f8b0c-d816-11ee-a7e4-ce469b473a25.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00655',
  'BLUE PERIOD - 10',
  'BLUE PERIOD - 10',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/DiYH4UQP7uOb5qTFMiJrvr8nklk=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/e8f38bfe-d816-11ee-b54b-e2697ce33d53.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00656',
  'BLUE PERIOD - 11',
  'BLUE PERIOD - 11',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/MYAmvCnnZ4Ow0r6j59oLcUMFALs=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/e97d352a-d816-11ee-a7e4-ce469b473a25.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00657',
  'BLUE PERIOD - 12',
  'BLUE PERIOD - 12',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/izrzLloKVPKfRFqhzawEVFsq4Xs=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/ea322f52-d816-11ee-9ac4-da2373bc7c0b.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00658',
  'BLUE PERIOD - 14',
  'BLUE PERIOD - 14',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/6auxxnUODLwXawkXRjpI837y3kk=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/eb86b8fa-d816-11ee-b54b-e2697ce33d53.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00659',
  'BLUE PERIOD N.13',
  'BLUE PERIOD N.13',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/YpGWHeV-SEmiP3NpUuBW_-AD-lU=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/eaca35b8-d816-11ee-b124-5a86bcbeb6e3.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00660',
  'BLUE PERIOD N.15',
  'BLUE PERIOD N.15',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/rnyGkb42k3Wa8kvZ046_Lh1Jvow=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/f65498fe-2930-11ef-8a49-928f61c71625.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00661',
  'BLUE PERIOD N.16',
  'BLUE PERIOD N.16',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/D-QX_cNOGnERqrtPtnRO9Emy7kE=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/548a0c24-8b5f-11f0-ab6e-7e1ab2cbb1e5.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00662',
  'BORUTO - 01 [REB 3]',
  'BORUTO - 01 [REB 3]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/NZvDQc0JD6hid7x3TvZ0iV5_XGo=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/dc1022ea-3f2f-11f0-87b4-c2502d24ff3f.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00663',
  'BORUTO - 2 [REB2]',
  'BORUTO - 2 [REB2]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/rUMEoXXO0zFb07gxve1bIbPa8hI=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/9f6acf94-a7c0-11f0-96ab-2e54fc51120d.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00664',
  'BORUTO - 20',
  'BORUTO - 20',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/0eFj9xTEXmzn9Ec96zG27oIacLY=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/7178e2a2-d818-11ee-82a8-e2697ce33d53.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00665',
  'BORUTO - 3 [REB3]',
  'BORUTO - 3 [REB3]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/cHJVSg-vQVsr0Oyq_sqXVGAoCZQ=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/86cea938-4dac-11f0-b840-c6f13973e51f.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00666',
  'BOX SAIBA MAIS - GRANDES GÊNIOS N.1',
  'BOX SAIBA MAIS - GRANDES GÊNIOS N.1',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/xNnEI8Rv0wD9jlJKuFLa1_dRn20=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/4938dac8-1705-11ef-950f-ea58bbef1786.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00667',
  'BRZRKR VOL.03 (DE 3)',
  'BRZRKR VOL.03 (DE 3)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/DJTMjfERkTbYPPdmKwCIVFQF6lg=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/f47ac776-d816-11ee-ae34-e2e54ed5f9f7.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00668',
  'BUNGO STRAY DOGS - 02 [REB4]',
  'BUNGO STRAY DOGS - 02 [REB4]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/ERBjQ_K4a8Z8TjS4-_oa_1lnLGw=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/3b8c12ba-7fd1-11f0-a5af-de5e70a27ff7.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00669',
  'BUNGO STRAY DOGS - 11 [REB]',
  'BUNGO STRAY DOGS - 11 [REB]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/1Im1WNvf0P753eLHd2HN9KLXtqY=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/1e76c13a-69af-11f0-a796-ae0a374fc493.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00670',
  'BUNGO STRAY DOGS - 12 [REB]',
  'BUNGO STRAY DOGS - 12 [REB]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/MxDHsOHF1heMb8Oqww81hExC8jI=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/52afc188-5ea9-11f0-bc5c-8a0b5d172c0d.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00671',
  'BUNGO STRAY DOGS - 13 [REB]',
  'BUNGO STRAY DOGS - 13 [REB]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/8EJ7kcfm4KAE4OG4-x7GRMBSH7s=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/53824f68-5ea9-11f0-bc5c-8a0b5d172c0d.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00672',
  'BUNGO STRAY DOGS - 14 [REB]',
  'BUNGO STRAY DOGS - 14 [REB]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/fav7Sa2a63Tdm2-wAzFOeYso0pg=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/1e76236a-69af-11f0-9a47-2e3660e82a7f.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00673',
  'BUNGO STRAY DOGS - 15 [REB]',
  'BUNGO STRAY DOGS - 15 [REB]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/cSbOr_pwgTpgn71lWoxoOw80kGk=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/53bb5984-5ea9-11f0-bc5c-8a0b5d172c0d.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00674',
  'BUNGO STRAY DOGS - 16 [REB]',
  'BUNGO STRAY DOGS - 16 [REB]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/GSpkXu3J9ZejciGr9uVjkXyS_Gs=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/54158a4e-5ea9-11f0-a034-4eae30e658d1.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00675',
  'BUNGO STRAY DOGS - 17 [REB]',
  'BUNGO STRAY DOGS - 17 [REB]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/TCsRQkktc7VeGmMAmrrCBvdtERI=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/547ea420-5ea9-11f0-a034-4eae30e658d1.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00676',
  'BUNGO STRAY DOGS - 18 [REB]',
  'BUNGO STRAY DOGS - 18 [REB]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/1asiGlvD7jpIKF2lVZGjj7XLvaI=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/5539d358-5ea9-11f0-bc5c-8a0b5d172c0d.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00677',
  'BUNGO STRAY DOGS - 19 [REB]',
  'BUNGO STRAY DOGS - 19 [REB]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/vBrWbcd41jE2mRGjtpeRKo5b5UA=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/55ade32e-5ea9-11f0-bc5c-8a0b5d172c0d.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00678',
  'BUNGO STRAY DOGS - 20 [REB]',
  'BUNGO STRAY DOGS - 20 [REB]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/Ec6RbVRFY690pehagMD6PMgc8QM=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/56600932-5ea9-11f0-bc5c-8a0b5d172c0d.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00679',
  'BUNGO STRAY DOGS - 21 [REB]',
  'BUNGO STRAY DOGS - 21 [REB]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/ZbYgk9ir-9swix_-l9tUiWv8Hvc=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/21edc10a-6f3c-11f0-b703-524c1decb601.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00680',
  'BUNGO STRAY DOGS - 22 [REB]',
  'BUNGO STRAY DOGS - 22 [REB]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/Xh8YNb2JylPkIGFtnGvvvYfqlKk=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/5620b48a-5ea9-11f0-a034-4eae30e658d1.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00681',
  'BUNGO STRAY DOGS - 25',
  'BUNGO STRAY DOGS - 25',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/P6_kA5uQNt6mIWBijRkteCDq8gI=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/9ccadec2-eb29-11ef-a31a-8ed8743505f0.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00682',
  'BUNGO STRAY DOGS N.10',
  'BUNGO STRAY DOGS N.10',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/ezXkqdgZ3pTLrSBx4AYo9dyLC7Q=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/493acdce-1705-11ef-a0bb-567d4742b137.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00683',
  'BUNGO STRAY DOGS N.24',
  'BUNGO STRAY DOGS N.24',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/AJK80NErZ3AYndNJX1T4cKdf1PY=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/2c7e361c-ebef-11ee-8810-22f5b7d93b6a.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00684',
  'BUNGO STRAY DOGS N.26',
  'BUNGO STRAY DOGS N.26',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/0K8pHaghCacoc2YRwifPC5qgXvE=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/48d6eb5e-8b5f-11f0-b3d9-165df9e621a1.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00685',
  'BUNGO STRAY DOGS N.3',
  'BUNGO STRAY DOGS N.3',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/bT6f4lRvaoxYmfSg0PgTL8ZC9eA=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/60345dd4-f111-11ee-b48a-2acd64fd8df5.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00686',
  'BUNGO STRAY DOGS N.6',
  'BUNGO STRAY DOGS N.6',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/rSht1yJR343yeLOPxIpGoWfRCDI=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/cc51401e-eb47-11ef-9cff-fa812316df6c.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00687',
  'BUNGO STRAY DOGS N.7',
  'BUNGO STRAY DOGS N.7',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/6sbaHMhv5ilEtPNwIZRZFLhmBFU=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/49712540-1705-11ef-a192-b27729de0ea6.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00688',
  'BUNGO STRAY DOGS N.8',
  'BUNGO STRAY DOGS N.8',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/ZxXUnKvXl9qHMWf9l1wT9Uemuo8=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/923a49a4-d818-11ee-a1cf-e2e54ed5f9f7.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00689',
  'BUNGO STRAY DOGS N.9',
  'BUNGO STRAY DOGS N.9',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/h0V9iJcYxcxclBlh4XNyJPofmsE=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/928b7cc0-d818-11ee-a11f-5a86bcbeb6e3.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00690',
  'CACADA SANGRENTA - TARJA VERMELHA N.01',
  'CACADA SANGRENTA - TARJA VERMELHA N.01',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/x07PCRTz59GQvDafyKZalNOccJY=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/9469e7a0-eb29-11ef-8b75-5ac0f052206d.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00691',
  'CACADA SANGRENTA - TARJA VERMELHA N.02',
  'CACADA SANGRENTA - TARJA VERMELHA N.02',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/Bpuj760mqD7LCrpEj8L5D_6L6tA=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/aaddb428-ee29-11ef-8407-02478a88c6f1.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00692',
  'CACADA SANGRENTA - TARJA VERMELHA N.03',
  'CACADA SANGRENTA - TARJA VERMELHA N.03',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/gtiuccmYgWzKY8ciP18bpxHvDD8=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/eb768078-0143-11f0-9a82-ca3c9ea74dec.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00693',
  'CACADA SANGRENTA N.01',
  'CACADA SANGRENTA N.01',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/fYauJe1v1XUKpUqtW7DH1nMX_rI=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/94446f48-eb29-11ef-a3b1-5681c2ac1d4b.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00694',
  'CACADA SANGRENTA N.02',
  'CACADA SANGRENTA N.02',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/1gdFrCG8GLC2nUkdVpDxtPMRXPA=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/945941c0-eb29-11ef-913d-52f5d450f8a6.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00695',
  'CACADA SANGRENTA N.03',
  'CACADA SANGRENTA N.03',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/oO_yKrtnBHIcaJ0Cnm1zXf84o8s=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/eb3180fe-0143-11f0-9a82-ca3c9ea74dec.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00696',
  'CACADA SANGRENTA: FILHOS DA MEIA-NOITE',
  'CACADA SANGRENTA: FILHOS DA MEIA-NOITE',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/ZafXhJoakEMVsCSNnKsu1X95nKU=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/eb1a7fa8-0143-11f0-9602-e6e8567c501d.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00697',
  'CACADA SANGRENTA: HOMEM-ARANHA',
  'CACADA SANGRENTA: HOMEM-ARANHA',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/SrTK2BFKyS0BI5U_dY_zhxG3nr4=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/eb61343e-0143-11f0-9a82-ca3c9ea74dec.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00698',
  'CACADA SANGRENTA: X-MEN',
  'CACADA SANGRENTA: X-MEN',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/Sje-RIzTkLhWU9J0ClU_8_S6VLo=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/9481a93a-eb29-11ef-b1d3-def782e2bf12.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00699',
  'CACANDO DRAGOES - 06 [REB]',
  'CACANDO DRAGOES - 06 [REB]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/WIwl9wZfEWgqqF-oD6Ku8kq2FyA=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/cbf10d48-eb47-11ef-9cff-fa812316df6c.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00700',
  'CACANDO DRAGOES - 07 [REB]',
  'CACANDO DRAGOES - 07 [REB]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/--qqGdF2I7-xw41-3ySW_lsWgWM=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/ccc957ac-eb47-11ef-80c6-0ee70347c223.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();