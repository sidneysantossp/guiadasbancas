-- SQL para importar produtos Brancaleone
-- Gerado em: 2025-10-17T17:52:46.765Z
-- Total de produtos: 3363
-- Fonte: brancaleone-products-1760723254011.json

-- 1. Criar distribuidor (se não existir)

-- Distribuidor já criado no batch-001

-- Lote 62 de 68
-- Produtos: 6101 até 6200



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-03051',
  'TOKYO GHOUL - 09 [REB3]',
  'TOKYO GHOUL - 09 [REB3]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/iFMLZeHPhkMJjosY-5BaONDlkGA=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/dda469b0-eb4a-11ef-8621-0ee70347c223.jpg"]'::jsonb,
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
  'PROD-03052',
  'TOKYO GHOUL - 10 [REB3]',
  'TOKYO GHOUL - 10 [REB3]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/jXA0llM-VEPT4mElIbYx-LKsLbY=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/dda9ecb4-eb4a-11ef-8230-fa812316df6c.jpg"]'::jsonb,
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
  'PROD-03053',
  'TOKYO GHOUL - 11 [REB3]',
  'TOKYO GHOUL - 11 [REB3]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/-bsKsIxb0x7CtXfNPGJ01LZoVqQ=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/dddc3336-eb4a-11ef-8230-fa812316df6c.jpg"]'::jsonb,
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
  'PROD-03054',
  'TOKYO GHOUL - 12 [REB3]',
  'TOKYO GHOUL - 12 [REB3]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/oUhuyo6z_XsYaPVi1rz3zKsSxO4=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/dddebaa2-eb4a-11ef-8621-0ee70347c223.jpg"]'::jsonb,
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
  'PROD-03055',
  'TOKYO GHOUL - BOX [1-14] [REB]',
  'TOKYO GHOUL - BOX [1-14] [REB]',
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
  'PROD-03056',
  'TOKYO GHOUL N.3',
  'TOKYO GHOUL N.3',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/K06OSVqwmdvGsfQHKaKCJvxCFXs=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/c7ecb1ce-63e4-11ef-82a2-5ee4edcac102.png"]'::jsonb,
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
  'PROD-03057',
  'TOKYO GHOUL N.4',
  'TOKYO GHOUL N.4',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/0sbxdb9g3i7gXuofeuZqtzePHW8=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/8234e760-7fa9-11ef-b0bc-6e97175de7f7.jpg"]'::jsonb,
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
  'PROD-03058',
  'TOKYO GHOUL N.5',
  'TOKYO GHOUL N.5',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/agE7MQGx_d3UT1tlt4EpF-XMN0Q=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/c80ab2a0-63e4-11ef-81e8-daba8f91e64c.png"]'::jsonb,
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
  'PROD-03059',
  'TOM STRONG VOL. 01- EDICAO DEFINITIVA',
  'TOM STRONG VOL. 01- EDICAO DEFINITIVA',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/zI92KUSXL1kFiytYzEWbm9QkWrc=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/8a3aaa12-d81a-11ee-9df9-5a86bcbeb6e3.jpg"]'::jsonb,
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
  'PROD-03060',
  'TOM STRONG VOL. 02- EDICAO DEFINITIVA',
  'TOM STRONG VOL. 02- EDICAO DEFINITIVA',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/QhCuysTkIbUQaBdmngpw6XJtchw=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/d2ef5ca8-119a-11ef-a951-1a13f4f3a32a.jpg"]'::jsonb,
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
  'PROD-03061',
  'TOM STRONG VOL.03 - EDICAO DEFINITIVA',
  'TOM STRONG VOL.03 - EDICAO DEFINITIVA',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/LFjJpRNyJOngjPwJtWhj85uTDK4=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/1b58709e-eb4b-11ef-b0d0-f6341ef53590.jpg"]'::jsonb,
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
  'PROD-03062',
  'TOMORROW STORIES: CONTOS DO AMANHA',
  'TOMORROW STORIES: CONTOS DO AMANHA',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/l06OjnHJuOk2EWuWwQYIdHk8V30=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/2bb3b172-a4ac-11f0-9f2b-b616a40784ef.jpg"]'::jsonb,
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
  'PROD-03063',
  'TOP TEN POR ALAN MOORE - EDICAO DEFINITIVA',
  'TOP TEN POR ALAN MOORE - EDICAO DEFINITIVA',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/SigwhQg2fPAKJoSfO7wDcsUlfbg=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/6a4d2524-5ea9-11f0-bc5c-8a0b5d172c0d.jpg"]'::jsonb,
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
  'PROD-03064',
  'TORIKO - 1 [REB]',
  'TORIKO - 1 [REB]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/0QHkPnn6H8dbn_94C4-wv_cmbTg=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/81ceaf04-7fa9-11ef-b0bc-6e97175de7f7.jpg"]'::jsonb,
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
  'PROD-03065',
  'TORIKO - 10 [REB]',
  'TORIKO - 10 [REB]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/o6t942AWD0XbZ3dVvUJZyoO_wMk=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/c4b106e4-f616-11ef-941b-9e5e2bda4253.jpg"]'::jsonb,
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
  'PROD-03066',
  'TORIKO - 2 [REB]',
  'TORIKO - 2 [REB]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/rHpWhYAFBflpGUEdg83yIXr1Msg=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/81e86bba-7fa9-11ef-b0bc-6e97175de7f7.jpg"]'::jsonb,
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
  'PROD-03067',
  'TORIKO - 3 [REB]',
  'TORIKO - 3 [REB]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/ZnzfJSa8530ZNnOc8BhFrY6zOh4=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/81f9db48-7fa9-11ef-b1d0-12caec0ea15c.jpg"]'::jsonb,
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
  'PROD-03068',
  'TORIKO - 36',
  'TORIKO - 36',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/ThSGZmGAVPXL6QU6gAGsDtGZ4AU=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/53470dae-f032-11ee-813f-7a75e704c245.jpg"]'::jsonb,
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
  'PROD-03069',
  'TORIKO - 37',
  'TORIKO - 37',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/vBAwiWd5ZalxJiGkhxvZoUqiaBg=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/5358acbc-f032-11ee-8b40-b215d626f2af.jpg"]'::jsonb,
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
  'PROD-03070',
  'TORIKO - 38',
  'TORIKO - 38',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/evLulxOtWq-KsLT1NeS8xdqPaPo=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/5391dc8a-f032-11ee-9a7b-e249587ad44a.jpg"]'::jsonb,
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
  'PROD-03071',
  'TORIKO - 39',
  'TORIKO - 39',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/L1at7ouIatzmpgZTFsG722pVskw=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/53c85558-f032-11ee-9b22-9ec12c02710b.jpg"]'::jsonb,
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
  'PROD-03072',
  'TORIKO - 4 [REB]',
  'TORIKO - 4 [REB]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/kVHM22TkiPu62YF9BkdSCrS0w0c=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/82137314-7fa9-11ef-b1d0-12caec0ea15c.jpg"]'::jsonb,
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
  'PROD-03073',
  'TORIKO - 40',
  'TORIKO - 40',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/iS9B_PQVfGk7N3nEmtCqPbj9j6E=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/53cddcb2-f032-11ee-bb6c-fa9609a33a3f.jpg"]'::jsonb,
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
  'PROD-03074',
  'TORIKO - 41',
  'TORIKO - 41',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/oCIEDcl6Tg_gxC-JoNzawRd7XcA=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/541f1aaa-f032-11ee-b94b-22ddd17978de.jpg"]'::jsonb,
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
  'PROD-03075',
  'TORIKO - 42',
  'TORIKO - 42',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/pmDEAj6ljwNFN-hRs_JY1dgjLC8=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/547e80a8-f032-11ee-9b22-9ec12c02710b.jpg"]'::jsonb,
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
  'PROD-03076',
  'TORIKO - 43',
  'TORIKO - 43',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/ikghgUjjrrrK-PgeMwXrHlGBNHw=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/5465c40a-f032-11ee-af14-a208555c6c2c.jpg"]'::jsonb,
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
  'PROD-03077',
  'TORIKO - 5 [REB]',
  'TORIKO - 5 [REB]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/lnrctr_tXP-F3QtgkpS5m_25CJU=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/821b0d40-7fa9-11ef-b0bc-6e97175de7f7.jpg"]'::jsonb,
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
  'PROD-03078',
  'TORIKO - 6 [REB]',
  'TORIKO - 6 [REB]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/sx29WIIvC0kwEVWNDY2nXJ-hgyI=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/9be6c0ac-eb29-11ef-89a1-ce85303a26c9.jpg"]'::jsonb,
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
  'PROD-03079',
  'TORIKO - 7 [REB]',
  'TORIKO - 7 [REB]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/gTAuPVgsx3mrYW30JrkYXoDWn18=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/dcfff862-eb4a-11ef-8621-0ee70347c223.jpg"]'::jsonb,
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
  'PROD-03080',
  'TORIKO - 8 [REB]',
  'TORIKO - 8 [REB]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/T8lrnkwMhRiPZ9vlcnPlRfUEtbc=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/c442f302-f616-11ef-aca5-de7ac4d61988.jpg"]'::jsonb,
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
  'PROD-03081',
  'TORIKO - 9 [REB]',
  'TORIKO - 9 [REB]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/AuHj512Op1UBJ9GfnlnAhokjhCY=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/9bf6620a-eb29-11ef-a31a-8ed8743505f0.jpg"]'::jsonb,
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
  'PROD-03082',
  'TOWER OF GOD - 10',
  'TOWER OF GOD - 10',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/9UnLgQpypARbxLwX3nwmE7tYa10=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/af0f8fe2-eb29-11ef-8cc5-0ee70347c223.jpg"]'::jsonb,
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
  'PROD-03083',
  'TOWER OF GOD - 12',
  'TOWER OF GOD - 12',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/uXQvlA2cCslnQ4AOBCmWFPafkIU=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/9e8a2b28-1941-11f0-857d-1a640e6f5312.jpg"]'::jsonb,
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
  'PROD-03084',
  'TOWER OF GOD - 13',
  'TOWER OF GOD - 13',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/CNnT17pAh1owpTZoVCjFbwtioP4=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/52f90aa4-8b5f-11f0-b3d9-165df9e621a1.jpg"]'::jsonb,
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
  'PROD-03085',
  'TOWER OF GOD - 9',
  'TOWER OF GOD - 9',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/ZsLPnwnu1PUtXV5DZJm-N9Sobkc=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/1b2e8914-eb4b-11ef-9da2-4af6893572b2.jpg"]'::jsonb,
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
  'PROD-03086',
  'TOWER OF GOD 11',
  'TOWER OF GOD 11',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/dVOs8L-hoAu0NJa7v0GERh5ILKA=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/af23766a-eb29-11ef-89a1-ce85303a26c9.jpg"]'::jsonb,
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
  'PROD-03087',
  'TURMA DA MONICA (2021-) N.68',
  'TURMA DA MONICA (2021-) N.68',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/MA1CLv2vAC2F0lbtHmn1WGloUIE=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/af704602-eb29-11ef-b7b8-460343881edd.jpg"]'::jsonb,
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
  'PROD-03088',
  'TURMA DA MONICA (2021-) N.71',
  'TURMA DA MONICA (2021-) N.71',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/w5RjtGoJcqzm1cTivS5d-UdIIcs=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/af913c22-eb29-11ef-b1d3-def782e2bf12.jpg"]'::jsonb,
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
  'PROD-03089',
  'TURMA DA MONICA (2021-) N.72',
  'TURMA DA MONICA (2021-) N.72',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/xcGGc6nRan2xqz7UiW6Ug2y79J4=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/afa08e20-eb29-11ef-89a1-ce85303a26c9.jpg"]'::jsonb,
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
  'PROD-03090',
  'TURMA DA MONICA (2021-) N.73',
  'TURMA DA MONICA (2021-) N.73',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/zMRMDlkBvp5eJIPz19mpI34Jo84=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/2017fd1a-f2f9-11ef-b4d2-824ddcc154a5.jpg"]'::jsonb,
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
  'PROD-03091',
  'TURMA DA MONICA (2021-) N.74',
  'TURMA DA MONICA (2021-) N.74',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/MVbWCidVOL6IE7kshYpdditE9MY=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/07cf1fa4-98c6-11f0-af89-d2e8520fe6b7.jpg"]'::jsonb,
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
  'PROD-03092',
  'TURMA DA MONICA (2021-) N.75',
  'TURMA DA MONICA (2021-) N.75',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/q_NBrB6ZF0k2zpjYUIRRKzjFZNg=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/a3c1f162-a7c0-11f0-96ab-2e54fc51120d.jpg"]'::jsonb,
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
  'PROD-03093',
  'TURMA DA MONICA (2021-) N.76',
  'TURMA DA MONICA (2021-) N.76',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/0tQ38ExTk4IjnbkDKmjwxnmnohY=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/9eaddfdc-1941-11f0-a494-3a4c16efbbdf.jpg"]'::jsonb,
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
  'PROD-03094',
  'TURMA DA MONICA (2021-) N.78',
  'TURMA DA MONICA (2021-) N.78',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/bUMm5lJG6vcobzenbDyli0Hw32o=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/5c3207ae-2473-11f0-afad-2e8d043f9b4b.jpg"]'::jsonb,
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
  'PROD-03095',
  'TURMA DA MONICA (2021-) N.79',
  'TURMA DA MONICA (2021-) N.79',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/w7XxvFALsiC0Yl9rE_PFWX60LUs=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/8cd3c484-3692-11f0-9bb2-62caa300e3a9.jpg"]'::jsonb,
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
  'PROD-03096',
  'TURMA DA MONICA (2021-) N.80',
  'TURMA DA MONICA (2021-) N.80',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/D9pa9rpGJyyXkEwfzsIH44CEt-M=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/d5e7d200-3f2f-11f0-87b4-c2502d24ff3f.jpg"]'::jsonb,
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
  'PROD-03097',
  'TURMA DA MONICA (2021-) N.81',
  'TURMA DA MONICA (2021-) N.81',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/Ov_u1mX-0JvbTRmeT5LOI0Qyr50=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/22a34c92-48b7-11f0-98d1-7a925bb2c122.jpg"]'::jsonb,
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
  'PROD-03098',
  'TURMA DA MONICA (2021-) N.82',
  'TURMA DA MONICA (2021-) N.82',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/yv1ngM8X21Nvz2ia1ud4iy7A6NE=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/6abf6260-5ea9-11f0-b926-022f8a1a6f0a.jpg"]'::jsonb,
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
  'PROD-03099',
  'TURMA DA MONICA (2021-) N.83',
  'TURMA DA MONICA (2021-) N.83',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/vfqxvIZopQsDbJ6v9lqZnkhnKK8=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/6adc71d4-5ea9-11f0-bc5c-8a0b5d172c0d.jpg"]'::jsonb,
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
  'PROD-03100',
  'TURMA DA MONICA (2021-) N.84',
  'TURMA DA MONICA (2021-) N.84',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/yv1ngM8X21Nvz2ia1ud4iy7A6NE=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/6abf6260-5ea9-11f0-b926-022f8a1a6f0a.jpg"]'::jsonb,
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