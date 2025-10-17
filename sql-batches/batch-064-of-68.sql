-- SQL para importar produtos Brancaleone
-- Gerado em: 2025-10-17T18:20:53.612Z
-- Total de produtos: 3363
-- Fonte: brancaleone-products-1760723254011.json

-- 1. Criar distribuidor (se não existir)

-- Distribuidor já criado no batch-001

-- Lote 64 de 68
-- Produtos: 6301 até 6400



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-03151',
  'UNDEAD UNLUCK - 9',
  'UNDEAD UNLUCK - 9',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/MnyoXWw_DQx_zKD2N4hUGfgniu0=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/d853e638-d819-11ee-9cda-5a86bcbeb6e3.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-03152',
  'UNDEAD UNLUCK N.11',
  'UNDEAD UNLUCK N.11',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/yY7P12RgtmkCzzVYIDGLw3q4yXE=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/d9333478-d819-11ee-9cda-5a86bcbeb6e3.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-03153',
  'UNDEAD UNLUCK N.12',
  'UNDEAD UNLUCK N.12',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/eBtKbECNAnHlqaMGFEuSj4SKNxw=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/d9b9c434-d819-11ee-9cda-5a86bcbeb6e3.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-03154',
  'UNDEAD UNLUCK N.14',
  'UNDEAD UNLUCK N.14',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/qV_YL4leABp3_jQeyI3ooAOACWM=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/4801c28c-e497-11ee-83ff-7ee42cfe9644.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-03155',
  'UNDEAD UNLUCK N.15',
  'UNDEAD UNLUCK N.15',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/1WhObcWhWBphCIUILEXK-pFrYq4=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/67044a8e-f111-11ee-8e05-1a42677a3e8d.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-03156',
  'UNDEAD UNLUCK N.16',
  'UNDEAD UNLUCK N.16',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/vuwsfKInRwX8aaA745m2MKtfzfs=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/d354365a-119a-11ef-a951-1a13f4f3a32a.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-03157',
  'UNDEAD UNLUCK N.17',
  'UNDEAD UNLUCK N.17',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/eQHz-BOJlYQzJj4-h3v_nUSO_t4=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/260a0eba-2ce4-11ef-b724-7e67d1c5424b.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-03158',
  'UNDEAD UNLUCK N.18',
  'UNDEAD UNLUCK N.18',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/4jeDQwpc3p52T_NPQt1tG6EHmKg=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/8bb16f8c-4e7d-11ef-b7f8-22eb38681e4f.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-03159',
  'UNIVERSO DC POR ALAN MOORE (DC VINTAGE)',
  'UNIVERSO DC POR ALAN MOORE (DC VINTAGE)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/8JsjPCtsPhdq6iKUYq0ZyJkqMAI=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/23e3b18c-48b7-11f0-955a-6e14298b474f.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-03160',
  'UNIVERSO DC POR MIKE MIGNOLA N.1',
  'UNIVERSO DC POR MIKE MIGNOLA N.1',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/3N7mVUOeqJTMBQBin_iB4xJZ6kU=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/a9681484-dd64-11ee-9e8a-16e8cd4fbffd.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-03161',
  'UNIVERSO DE SANDMAN: PAIS DOS PESADELOS VOL. 2',
  'UNIVERSO DE SANDMAN: PAIS DOS PESADELOS VOL. 2',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/kuJOrYlH7oMAggJJ-aeVuvTUak8=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/97aa6e38-2461-11ef-bf30-ee5794111ad8.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-03162',
  'UNIVERSO ULTIMATE (2024) N.1 [REB2]',
  'UNIVERSO ULTIMATE (2024) N.1 [REB2]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/Foj8Z-cEBGF3DM1cDcUeMzXj_fY=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/534bc870-8b5f-11f0-b3d9-165df9e621a1.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-03163',
  'VAGABOND - 04 (REB3)',
  'VAGABOND - 04 (REB3)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/t_RrfDG7ykEkzwhX4nVzuHI52FY=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/8fe56452-3692-11f0-8b35-7a3a9a708959.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-03164',
  'VAGABOND - 05 (REB3)',
  'VAGABOND - 05 (REB3)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/XNtB5vbnMoOm-ID28DdG6ji5H7M=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/3a91627a-7fd1-11f0-b894-2e1dcafaddd0.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-03165',
  'VAGABOND - 06 [REB3]',
  'VAGABOND - 06 [REB3]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/wBNlcL01qYSd4EdgAzGlE2yi_yQ=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/3aa2b822-7fd1-11f0-a5af-de5e70a27ff7.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-03166',
  'VAGABOND - 07 [REB2]',
  'VAGABOND - 07 [REB2]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/FySpJdTmVkfLfAtVm_zsvf-AZGs=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/de59e5c4-eb4a-11ef-8230-fa812316df6c.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-03167',
  'VALQUIRIA: JANE FOSTER VOL.05',
  'VALQUIRIA: JANE FOSTER VOL.05',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/8__oGyzahO6rTHEfzYnn7ZOZTsA=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/c2df6a20-d8a0-11ee-98e4-5a86bcbeb6e3.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-03168',
  'VAMPIRE KNIGHT MEMORIES N.1',
  'VAMPIRE KNIGHT MEMORIES N.1',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/G12KmnbKtWguAs_yzia7YA4e1sM=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/829456d2-7fa9-11ef-b0bc-6e97175de7f7.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-03169',
  'VAMPIRE KNIGHT MEMORIES N.2',
  'VAMPIRE KNIGHT MEMORIES N.2',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/9btdj9V3bETB6jGIvwRLU6ziXBo=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/82ab99a0-7fa9-11ef-b0bc-6e97175de7f7.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-03170',
  'VAMPIRE KNIGHT MEMORIES N.3',
  'VAMPIRE KNIGHT MEMORIES N.3',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/pGsAdP8X4UDEvxHDSxdltpsOy-c=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/82b549a0-7fa9-11ef-b1d0-12caec0ea15c.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-03171',
  'VAMPIRE KNIGHT MEMORIES N.4',
  'VAMPIRE KNIGHT MEMORIES N.4',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/lGl53kstLvdRdkNxP_2itlDtgI8=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/82ce4f36-7fa9-11ef-b1d0-12caec0ea15c.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-03172',
  'VAMPIRE KNIGHT MEMORIES N.5',
  'VAMPIRE KNIGHT MEMORIES N.5',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/rbDFhx_f4PBnoQ0hHayklKXzQN0=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/82d4ec88-7fa9-11ef-b0bc-6e97175de7f7.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-03173',
  'VAMPIRE KNIGHT MEMORIES N.6',
  'VAMPIRE KNIGHT MEMORIES N.6',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/qn5nyhaQ4CtuqE5rxhBy_jqqi3k=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/82eaaf5a-7fa9-11ef-b0bc-6e97175de7f7.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-03174',
  'VAMPIRE KNIGHT MEMORIES N.7',
  'VAMPIRE KNIGHT MEMORIES N.7',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/NvCiHuJgeB11PnNWpPrYDRM599E=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/82f29c6a-7fa9-11ef-b1d0-12caec0ea15c.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-03175',
  'VAMPIRE KNIGHT MEMORIES N.8',
  'VAMPIRE KNIGHT MEMORIES N.8',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/H1D3wUWzFGfP7FOOzRVbcV-2pY4=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/3c54432c-de36-11ee-b2b6-3e63d4f4f6bf.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-03176',
  'VAMPIRO AMERICANO EDICAO DE LUXO VOL. 1 (REB)',
  'VAMPIRO AMERICANO EDICAO DE LUXO VOL. 1 (REB)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/18dml0KUpokjkMnCT-7Fg8JZ5B0=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/abdbd152-ee29-11ef-b823-265cac193354.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-03177',
  'VAMPIRO AMERICANO EDICAO DE LUXO VOL.02',
  'VAMPIRO AMERICANO EDICAO DE LUXO VOL.02',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/mf2DyGhq5CrQg2XGaG9SGtSgZ9w=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/a0620dd0-d81a-11ee-ae87-e2e54ed5f9f7.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-03178',
  'VAMPIRO AMERICANO EDICAO DE LUXO VOL.03',
  'VAMPIRO AMERICANO EDICAO DE LUXO VOL.03',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/4OU1dS3GDdrlwLeg-aFtzVm8YqY=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/cb4383fe-d8a0-11ee-9406-061c358a76e0.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-03179',
  'VAMPIRO AMERICANO EDICAO DE LUXO VOL.04',
  'VAMPIRO AMERICANO EDICAO DE LUXO VOL.04',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/9vk5B1n6C9H0jBr7QJyLlGKr99Q=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/c988f5f8-d8a0-11ee-b8d0-26337c3739c7.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-03180',
  'VAMPIRO AMERICANO EDICAO DE LUXO VOL.05',
  'VAMPIRO AMERICANO EDICAO DE LUXO VOL.05',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/05yEvb9fC0VYhG9GuOT3wl8WBwo=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/5c7bb4a8-0cc8-11ef-abe3-e2e03e0af6ad.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-03181',
  'VENOM (2022) N.03',
  'VENOM (2022) N.03',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/qwF3bumopw3pnrgTg82VUHcRE5M=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/af79bd2c-d81a-11ee-9df9-5a86bcbeb6e3.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-03182',
  'VENOM (2022) N.10',
  'VENOM (2022) N.10',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/xhLpr0O3Tghb5Zf-rk1K9WrgoLo=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/27a24e36-2ce4-11ef-8984-a212f06ea47f.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-03183',
  'VENOM (2022) N.11',
  'VENOM (2022) N.11',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/N2waIvOrpPYJza3fOhqmpDbdbks=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/d19ef204-63e4-11ef-b08c-feee356726a9.png"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-03184',
  'VENOM (2022) N.12',
  'VENOM (2022) N.12',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/lbmT-Ru1i_OT72tWAuImKXQY5y0=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/d3103416-eb4a-11ef-8621-0ee70347c223.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-03185',
  'VENOM (2022) N.13',
  'VENOM (2022) N.13',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/Kly5jQi_daKp4ywUcRaZW4z2IQQ=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/afeff5d2-eb29-11ef-8d7f-eea3b61904a2.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-03186',
  'VENOM (2022) N.14',
  'VENOM (2022) N.14',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/PbmJdS20Xf7saFuwgR6SpXgAlrk=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/d03dbff2-f616-11ef-8e8f-2263951fa8a2.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-03187',
  'VENOM (2022) N.15',
  'VENOM (2022) N.15',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/ep2F1ZMDYrZpOjp1zNFk_H55cH0=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/ef7275ce-0143-11f0-9a82-ca3c9ea74dec.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-03188',
  'VENOM (2022) N.16',
  'VENOM (2022) N.16',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/0U-UR-sTJCaKyckwCPY-LbxiOJA=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/2dfb659a-44b4-11f0-90fa-7e281e739724.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-03189',
  'VENOM (2022) N.17',
  'VENOM (2022) N.17',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/jV3RP1u94Quqao2T69o1DIUW68o=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/200cdfd4-69af-11f0-ae5d-0ebdcf797c5e.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-03190',
  'VENOM (2022) N.8',
  'VENOM (2022) N.8',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/vKQSzTYejkTa7qsV9hQnOBeO7Zo=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/b16cbf30-d81a-11ee-9df9-5a86bcbeb6e3.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-03191',
  'VENOM (2022) N.9',
  'VENOM (2022) N.9',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/0j4Q9DYWnvMGc2WZRNJ7ZH7U7cc=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/4de3d9e2-e497-11ee-b6a7-e2b250ff01a0.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-03192',
  'VILOES N.1',
  'VILOES N.1',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/1Z1_mZTBzvBb1oUtofOLs07MEOI=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/4d6760d6-de36-11ee-b2b6-3e63d4f4f6bf.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-03193',
  'VINGADORES POR GEOFF JOHNS VOL.01',
  'VINGADORES POR GEOFF JOHNS VOL.01',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/zcvSOZ4Bn3xxysC4aJSgQbcEDs0=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/b015ffe8-eb29-11ef-8fb2-6696cc3e9cb3.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-03194',
  'VINGADORES POR GEOFF JOHNS VOL.02',
  'VINGADORES POR GEOFF JOHNS VOL.02',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/P62NbSiTh9Xegg0KuYPZ8eOa4BY=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/2e13d2e2-44b4-11f0-a1ec-1a73b65bfa37.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-03195',
  'VINGADORES POR KURT BUSIEK E GEORGE PEREZ VOL.01 (MARVEL OMN',
  'VINGADORES POR KURT BUSIEK E GEORGE PEREZ VOL.01 (MARVEL OMN',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/pgPyIh_6yVk6-rVs_QkqyVrLikQ=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/affd1c94-eb29-11ef-a4f3-5a40d84dae09.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-03196',
  'VINGADORES POR KURT BUSIEK E GEORGE PEREZ VOL.02 (MARVEL OMN',
  'VINGADORES POR KURT BUSIEK E GEORGE PEREZ VOL.02 (MARVEL OMN',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/Kjkt4OpIxodrYagzehP1_l-fTQg=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/d6267ff0-3f2f-11f0-87b4-c2502d24ff3f.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-03197',
  'VINGADORES POR MARK WAID VOL.04 (NOVA MARVEL DELUXE)',
  'VINGADORES POR MARK WAID VOL.04 (NOVA MARVEL DELUXE)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/G4l5T-xkkOzH-OULnvBQ8h0yWDI=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/b4559f6e-d81a-11ee-9df9-5a86bcbeb6e3.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-03198',
  'VINGADORES POR MARK WAID VOL.05 (MARVEL LEGADO DELUXE)',
  'VINGADORES POR MARK WAID VOL.05 (MARVEL LEGADO DELUXE)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/7Oa5bYsOvkA970xbzFYEplHUwnk=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/d38ed670-119a-11ef-ad89-8e32d0639719.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-03199',
  'VINGADORES SELVAGENS (2020) VOL.06',
  'VINGADORES SELVAGENS (2020) VOL.06',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/_GuwRwAuk7lnpsjA_HN4lLUbrOQ=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/65ec239e-d819-11ee-9467-e2e54ed5f9f7.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-03200',
  'VINGADORES SELVAGENS (2020) VOL.07',
  'VINGADORES SELVAGENS (2020) VOL.07',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/TTMhO0HbD7haGe0kjpiXgKtYhEg=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/6618ec44-d819-11ee-947a-32937b3ded24.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();