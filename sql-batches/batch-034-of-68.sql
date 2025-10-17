-- SQL para importar produtos Brancaleone
-- Gerado em: 2025-10-17T18:20:53.612Z
-- Total de produtos: 3363
-- Fonte: brancaleone-products-1760723254011.json

-- 1. Criar distribuidor (se não existir)

-- Distribuidor já criado no batch-001

-- Lote 34 de 68
-- Produtos: 3301 até 3400



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01651',
  'LANTERNA VERDE (2023) N.7',
  'LANTERNA VERDE (2023) N.7',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/kod52CTDLzVjvmp8GxMaLYv-Zac=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/c7b1adc2-63e4-11ef-9cd1-4e5286e17d7d.png"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01652',
  'LANTERNA VERDE (2025) N.01',
  'LANTERNA VERDE (2025) N.01',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/fO8YnJ9I5TVRAPvfxCziMyM3dQo=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/90d68418-9d49-11f0-a284-42a4673d0018.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01653',
  'LANTERNA VERDE - TROPA DOS LANTERNAS VERDES: FORCA DE VONTADE (DC DELUXE)',
  'LANTERNA VERDE - TROPA DOS LANTERNAS VERDES: FORCA DE VONTADE (DC DELUXE)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/s5zQCLO3rPfVPQ8LY84MBA83NGk=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/14de199a-d818-11ee-a4a8-5a86bcbeb6e3.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01654',
  'LANTERNA VERDE A NOITE MAIS DENSA (GRANDES EVENTOS DC)',
  'LANTERNA VERDE A NOITE MAIS DENSA (GRANDES EVENTOS DC)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/UdZ5gnwQgJc69tuMlryoqCvxn1A=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/cf27e38e-0ea0-11f0-a36e-d2c6f4bb5d37.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01655',
  'LANTERNA VERDE: MUNDO SURREAL (DC DELUXE) N.1',
  'LANTERNA VERDE: MUNDO SURREAL (DC DELUXE) N.1',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/NuN9vZrC8IuFhLOkonCUKDqpPNQ=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/4a9986fa-fb7c-11ee-8d43-76be7000d1e1.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01656',
  'LANTERNAS VERDES (DC DEL N.5',
  'LANTERNAS VERDES (DC DEL N.5',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/WHZiwTdGtDKkH4W3rRyUwD4noeI=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/14af7dce-d818-11ee-86d3-ce469b473a25.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01657',
  'LEGIAO DOS SUPER-HEROIS: A SAGA DAS TREVAS ETERNAS (DC VINTA',
  'LEGIAO DOS SUPER-HEROIS: A SAGA DAS TREVAS ETERNAS (DC VINTA',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/yrCS9L18b7-0Phy-MNmgq5kcQN0=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/fa612d44-d89b-11ee-ad97-ee1b80a1fcb2.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01658',
  'LEGIAO DOS SUPER-HEROIS: ANTES DAS TREVAS ETERNAS VOL. 02 (D',
  'LEGIAO DOS SUPER-HEROIS: ANTES DAS TREVAS ETERNAS VOL. 02 (D',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/dN8tvhSMlXKVL4tchpVHtVKAB64=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/dcb95f42-eb4a-11ef-8230-fa812316df6c.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01659',
  'LEGIAO DOS SUPER-HEROIS: N.1',
  'LEGIAO DOS SUPER-HEROIS: N.1',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/06xT3kchM1GMCg7kugATKLRkp-0=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/11ac446c-069a-11ef-92f0-cafd48a576cd.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01660',
  'LIGA DA JUSTICA DA AMERICA: ANO UM (DC VINTAGE)',
  'LIGA DA JUSTICA DA AMERICA: ANO UM (DC VINTAGE)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/c-KMK1_QoopUAbfL92UtEeGTN5g=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/24fba450-d818-11ee-a1cf-e2e54ed5f9f7.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01661',
  'LIGA DA JUSTICA INTERNACIONAL POR J.M. DEMATTEIS E KEITH GIF',
  'LIGA DA JUSTICA INTERNACIONAL POR J.M. DEMATTEIS E KEITH GIF',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/pkkMnZajaNJ0Wc3ACd13iKYv9hk=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/9b75fda4-eb29-11ef-a4f3-5a40d84dae09.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01662',
  'LIGA DA JUSTICA INTERNACIONAL POR J.M. DEMATTEIS E KEITH GIF',
  'LIGA DA JUSTICA INTERNACIONAL POR J.M. DEMATTEIS E KEITH GIF',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/N3XkRhWT1_Psbfce2Pj62lRPIyo=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/990e1786-1941-11f0-a9be-7a7afc96fac7.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01663',
  'LIGA DA JUSTICA SEM LIMITES N.01',
  'LIGA DA JUSTICA SEM LIMITES N.01',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/5_COvt0miLVlZSrMvIhg0bLrVDY=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/912a5dae-9d49-11f0-8c2e-46530ad93662.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01664',
  'LIGA DA JUSTICA VS. GODZILLA VS. KING KONG',
  'LIGA DA JUSTICA VS. GODZILLA VS. KING KONG',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/ZvN-OEjr0Jv423x8mUMJFCl0YCI=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/9b4cbdc2-eb29-11ef-a3b1-5681c2ac1d4b.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01665',
  'LIGA DA JUSTICA/NATHAN NEVER (DC/BONELLI)',
  'LIGA DA JUSTICA/NATHAN NEVER (DC/BONELLI)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/PMTBvfr-CCcfKRRGJ35pQ6oiFOQ=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/776c710c-4e7d-11ef-8ce0-1254abdb73f3.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01666',
  'LIGA DA JUSTICA: O PREGO (DC VINTAGE)',
  'LIGA DA JUSTICA: O PREGO (DC VINTAGE)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/wHeSlLJp1gl_GW1JJ6SL9df0n6U=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/014e0fe6-d81a-11ee-a453-e2697ce33d53.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01667',
  'LIGA JURASSICA',
  'LIGA JURASSICA',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/6HU998USa9jYlViDBGLaPbvihIE=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/e12e75a4-d817-11ee-9a1e-da2373bc7c0b.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01668',
  'LILI-MEN - 01',
  'LILI-MEN - 01',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/OF_sUoxH-o3HcA_CMyam7fLwmu0=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/cf51279e-0ea0-11f0-929c-bed3975d49ac.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01669',
  'LILI-MEN - 02',
  'LILI-MEN - 02',
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
  'PROD-01670',
  'LILI-MEN - 03',
  'LILI-MEN - 03',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/5Y9PvYfJuTb3PB0AUzVK3Uo8HHo=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/398599b4-7fd1-11f0-a5af-de5e70a27ff7.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01671',
  'LIV. ILUST. ALBUM PREMIUM PCSS PREMIUM FUTSAL BR 2025',
  'LIV. ILUST. ALBUM PREMIUM PCSS PREMIUM FUTSAL BR 2025',
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
  'PROD-01672',
  'LIV. POSTER LUCCAS NETO 3',
  'LIV. POSTER LUCCAS NETO 3',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/Zb5rj31uybaiZFpq9_mHC52ahxE=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/e74b9e38-d89b-11ee-9fe6-c2d9e886ee20.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01673',
  'LIV.ILUST. ALBUM  MARVEL 24 - DEADPOOL',
  'LIV.ILUST. ALBUM  MARVEL 24 - DEADPOOL',
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
  'PROD-01674',
  'LIV.ILUST. ALBUM + CARTA ADESIVA WISH MOVIE',
  'LIV.ILUST. ALBUM + CARTA ADESIVA WISH MOVIE',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/mOjJ3301x-Kx8Rls2J3fWR2z6Og=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/32c924ec-d816-11ee-ad94-5a86bcbeb6e3.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01675',
  'LIV.ILUST. ALBUM 3 PALAVRINHAS',
  'LIV.ILUST. ALBUM 3 PALAVRINHAS',
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
  'PROD-01676',
  'LIV.ILUST. ALBUM BARBIE 65TH ANNIVERSARY',
  'LIV.ILUST. ALBUM BARBIE 65TH ANNIVERSARY',
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
  'PROD-01677',
  'LIV.ILUST. ALBUM BLUEY',
  'LIV.ILUST. ALBUM BLUEY',
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
  'PROD-01678',
  'LIV.ILUST. ALBUM BLUEY 2',
  'LIV.ILUST. ALBUM BLUEY 2',
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
  'PROD-01679',
  'LIV.ILUST. ALBUM CAPA DURA CB 2024',
  'LIV.ILUST. ALBUM CAPA DURA CB 2024',
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
  'PROD-01680',
  'LIV.ILUST. ALBUM CAPA DURA CB 2025',
  'LIV.ILUST. ALBUM CAPA DURA CB 2025',
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
  'PROD-01681',
  'LIV.ILUST. ALBUM CAPA DURA CONMEBOL LIBERTADORES 2025',
  'LIV.ILUST. ALBUM CAPA DURA CONMEBOL LIBERTADORES 2025',
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
  'PROD-01682',
  'LIV.ILUST. ALBUM CAPA DURA COPA LIBERTADORES 2024',
  'LIV.ILUST. ALBUM CAPA DURA COPA LIBERTADORES 2024',
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
  'PROD-01683',
  'LIV.ILUST. ALBUM CAPA DURA FIFA CLUB WORLD CUP 2025',
  'LIV.ILUST. ALBUM CAPA DURA FIFA CLUB WORLD CUP 2025',
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
  'PROD-01684',
  'LIV.ILUST. ALBUM CAPA DURA FLUMINENSE 2024',
  'LIV.ILUST. ALBUM CAPA DURA FLUMINENSE 2024',
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
  'PROD-01685',
  'LIV.ILUST. ALBUM CAPA DURA ONE PIECE ROAD TO ..',
  'LIV.ILUST. ALBUM CAPA DURA ONE PIECE ROAD TO ..',
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
  'PROD-01686',
  'LIV.ILUST. ALBUM CAPA DURA PALMEIRAS 2024',
  'LIV.ILUST. ALBUM CAPA DURA PALMEIRAS 2024',
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
  'PROD-01687',
  'LIV.ILUST. ALBUM CB 2024',
  'LIV.ILUST. ALBUM CB 2024',
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
  'PROD-01688',
  'LIV.ILUST. ALBUM CB 2025',
  'LIV.ILUST. ALBUM CB 2025',
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
  'PROD-01689',
  'LIV.ILUST. ALBUM COMITE OLIMPICO DO BRASIL 2024',
  'LIV.ILUST. ALBUM COMITE OLIMPICO DO BRASIL 2024',
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
  'PROD-01690',
  'LIV.ILUST. ALBUM COPA LIBERTADORES 2024',
  'LIV.ILUST. ALBUM COPA LIBERTADORES 2024',
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
  'PROD-01691',
  'LIV.ILUST. ALBUM DOS ROSAS (EMILLY VICK)',
  'LIV.ILUST. ALBUM DOS ROSAS (EMILLY VICK)',
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
  'PROD-01692',
  'LIV.ILUST. ALBUM FIFA CLUB WORLD CUP 2025',
  'LIV.ILUST. ALBUM FIFA CLUB WORLD CUP 2025',
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
  'PROD-01693',
  'LIV.ILUST. ALBUM FIFA WORLD CLASS 2024',
  'LIV.ILUST. ALBUM FIFA WORLD CLASS 2024',
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
  'PROD-01694',
  'LIV.ILUST. ALBUM FLUMINENSE 2024',
  'LIV.ILUST. ALBUM FLUMINENSE 2024',
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
  'PROD-01695',
  'LIV.ILUST. ALBUM FOOTBALL ENG 2023 24',
  'LIV.ILUST. ALBUM FOOTBALL ENG 2023 24',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/aBCeM99gRD43wb_mnx1ZAX0pT00=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/2ff07eb4-d816-11ee-b70a-e2697ce33d53.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01696',
  'LIV.ILUST. ALBUM FOOTBALL ENG 2024/25',
  'LIV.ILUST. ALBUM FOOTBALL ENG 2024/25',
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
  'PROD-01697',
  'LIV.ILUST. ALBUM GABBY S DOLLHOUSE',
  'LIV.ILUST. ALBUM GABBY S DOLLHOUSE',
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
  'PROD-01698',
  'LIV.ILUST. ALBUM HELLO KITTY 2025 (10)',
  'LIV.ILUST. ALBUM HELLO KITTY 2025 (10)',
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
  'PROD-01699',
  'LIV.ILUST. ALBUM LADYBUG 2025',
  'LIV.ILUST. ALBUM LADYBUG 2025',
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
  'PROD-01700',
  'LIV.ILUST. ALBUM LIGA SANTANDER 23/24 FUT ES',
  'LIV.ILUST. ALBUM LIGA SANTANDER 23/24 FUT ES',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/15WvAN74Qf0ZsXNxCSfB-QozguY=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/1f208e3c-de36-11ee-b2b6-3e63d4f4f6bf.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();