-- SQL para importar produtos Brancaleone
-- Gerado em: 2025-10-17T17:52:46.765Z
-- Total de produtos: 3363
-- Fonte: brancaleone-products-1760723254011.json

-- 1. Criar distribuidor (se não existir)

-- Distribuidor já criado no batch-001

-- Lote 38 de 68
-- Produtos: 3701 até 3800



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01851',
  'MICKEY E OS MIL BAFOS (BD DISNEY)',
  'MICKEY E OS MIL BAFOS (BD DISNEY)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/jjJNX9UayPuMFDeCXEtA4uhbc4I=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/a690fe8c-eb29-11ef-8fb2-6696cc3e9cb3.jpg"]'::jsonb,
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
  'PROD-01852',
  'MICKEY MOUSE: CAFÉ ZUMBI (BD DISNEY)',
  'MICKEY MOUSE: CAFÉ ZUMBI (BD DISNEY)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/ruqIdlKDkM1SeCxpaJimjJurpSo=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/cf31f87c-63e4-11ef-aad4-727f596e106b.png"]'::jsonb,
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
  'PROD-01853',
  'MIDNIGHT SUNS',
  'MIDNIGHT SUNS',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/XriTRk8tuv5E7jlVMv8zs6Kh_hA=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/69c42c3e-da9c-11ee-be2d-3226a44a89fc.jpg"]'::jsonb,
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
  'PROD-01854',
  'MIERUKO-CHAN - 06',
  'MIERUKO-CHAN - 06',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/hEFYvOTgXHdXXikle_viIS_c798=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/5b0e0c94-d819-11ee-947a-32937b3ded24.jpg"]'::jsonb,
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
  'PROD-01855',
  'MIERUKO-CHAN - 07',
  'MIERUKO-CHAN - 07',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/5-K6XjCUckjDOIpeY2LNuH9M7lc=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/5b731486-d819-11ee-9675-5a86bcbeb6e3.jpg"]'::jsonb,
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
  'PROD-01856',
  'MIERUKO-CHAN - 08',
  'MIERUKO-CHAN - 08',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/wcqbGx2UvyInE9bKFXMdcfS9AxE=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/5beff410-d819-11ee-947a-32937b3ded24.jpg"]'::jsonb,
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
  'PROD-01857',
  'MIERUKO-CHAN - 09',
  'MIERUKO-CHAN - 09',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/ax_wh-RPbuyCdq7EUDpvq8DbuCI=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/5c34d5a8-d819-11ee-89ed-e2697ce33d53.jpg"]'::jsonb,
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
  'PROD-01858',
  'MIERUKO-CHAN - 10',
  'MIERUKO-CHAN - 10',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/l5wDZVisOsUZu806uQbHJM2hmvg=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/864c03f6-7fa9-11ef-b0bc-6e97175de7f7.jpg"]'::jsonb,
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
  'PROD-01859',
  'MIERUKO-CHAN - 11',
  'MIERUKO-CHAN - 11',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/gD4lnAk1amsUJHxIlnZfEZP6KzU=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/9089d398-3692-11f0-8d7f-ba18af294916.jpg"]'::jsonb,
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
  'PROD-01860',
  'MIGI E DALI N. 2',
  'MIGI E DALI N. 2',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/cXGVLu2Uq4VX3KK7YWacl2PhBlc=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/55b3d7ca-f032-11ee-8c9c-2251f050ef23.jpg"]'::jsonb,
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
  'PROD-01861',
  'MIGI E DALI N. 3',
  'MIGI E DALI N. 3',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/LSlzf2TyFBN92c5idLp0wsAD2Tw=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/55aa8b5c-f032-11ee-9b22-9ec12c02710b.jpg"]'::jsonb,
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
  'PROD-01862',
  'MIGI E DALI N. 4',
  'MIGI E DALI N. 4',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/KLU7HtFCoYhSIfMxLW3EAsrm64g=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/5144f728-fb7c-11ee-b9a7-42c387d0d3d3.jpg"]'::jsonb,
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
  'PROD-01863',
  'MIGI E DALI N. 5',
  'MIGI E DALI N. 5',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/ofkoTpLw7ZycE90Yo-WMDFDMx6I=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/0220c3a2-1ca6-11ef-bc32-def7b1441874.jpg"]'::jsonb,
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
  'PROD-01864',
  'MIGI E DALI N. 6',
  'MIGI E DALI N. 6',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/4Zg0s-22DrWl4n_cP66tWqkd9KM=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/86388b76-4e7d-11ef-b7f8-22eb38681e4f.jpg"]'::jsonb,
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
  'PROD-01865',
  'MIGI E DALI N. 7',
  'MIGI E DALI N. 7',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/a6EEQwc-kzWEE2PnqMY3xb_IcGo=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/db70f642-7faa-11ef-8130-12caec0ea15c.jpg"]'::jsonb,
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
  'PROD-01866',
  'MIGI TO DALI - 1',
  'MIGI TO DALI - 1',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/hKrwUZyeVZSSkAEr1qhHkqDNRqg=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/1b65bf54-d89d-11ee-bc8e-8205a402726e.jpg"]'::jsonb,
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
  'PROD-01867',
  'MILES MORALES (MARVEL TEENS) VOL.04',
  'MILES MORALES (MARVEL TEENS) VOL.04',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/W5odWIqx4C1_n15dKc2phE8U6H0=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/276c8abe-d819-11ee-947a-32937b3ded24.jpg"]'::jsonb,
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
  'PROD-01868',
  'MILES MORALES (MARVEL TEENS) VOL.05',
  'MILES MORALES (MARVEL TEENS) VOL.05',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/RwGBhJHz2DTBy-VB26aWnLbENwQ=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/f17ddbce-9031-11f0-82c8-4a06203c34dc.jpg"]'::jsonb,
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
  'PROD-01869',
  'MILES MORALES (MARVEL TEENS) VOL.06',
  'MILES MORALES (MARVEL TEENS) VOL.06',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/3UZ_9cEs7A_x5_U9WAkn53ZhR-M=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/49d911bc-8b5f-11f0-b876-cef4535c59b2.jpg"]'::jsonb,
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
  'PROD-01870',
  'MILES MORALES (MARVEL TEENS) VOL.07',
  'MILES MORALES (MARVEL TEENS) VOL.07',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/f1NVHMEKAn_5ClbL-4Vo6PMf-5c=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/853c5880-7fa9-11ef-b1d0-12caec0ea15c.jpg"]'::jsonb,
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
  'PROD-01871',
  'MILES MORALES: HOMEM-ARA N.2',
  'MILES MORALES: HOMEM-ARA N.2',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/_udf0wmSkkCs-Zg4TmhFcg-SjMg=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/667b81ae-f111-11ee-9d0a-7ad7f1bb2b41.jpg"]'::jsonb,
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
  'PROD-01872',
  'MILES MORALES: HOMEM-ARANHA (2023) VOL.04',
  'MILES MORALES: HOMEM-ARANHA (2023) VOL.04',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/BbWEGMBy4nVcUyingHc4Ty13F9U=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/a24d9c54-eb29-11ef-913d-52f5d450f8a6.jpg"]'::jsonb,
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
  'PROD-01873',
  'MILES MORALES: HOMEM-ARANHA (2023) VOL.05',
  'MILES MORALES: HOMEM-ARANHA (2023) VOL.05',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/KXa7_lj3vctHQRJtjFpK_NnPkMs=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/8dac2630-08c5-11f0-85a1-b2e99305fa63.jpg"]'::jsonb,
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
  'PROD-01874',
  'MILES MORALES: HOMEM-ARANHA (2023) VOL.06',
  'MILES MORALES: HOMEM-ARANHA (2023) VOL.06',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/6-Vi8cFWGKyMag564PMqrmzS4R4=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/1eb07948-69af-11f0-ae5d-0ebdcf797c5e.jpg"]'::jsonb,
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
  'PROD-01875',
  'MILES MORALES: HOMEM-ARANHA VOL. 03',
  'MILES MORALES: HOMEM-ARANHA VOL. 03',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/6Sdm6eGMm6PPcQPlTESsH0v14ZQ=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/885d8802-4e7d-11ef-a6a6-6a75532b239b.jpg"]'::jsonb,
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
  'PROD-01876',
  'MILES MORALES: HOMEM-ARANHA VOL.07',
  'MILES MORALES: HOMEM-ARANHA VOL.07',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/Ygar2NdEV35kve4QH6ZUhIdmnZY=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/bff6cc22-d819-11ee-9cda-5a86bcbeb6e3.jpg"]'::jsonb,
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
  'PROD-01877',
  'MILES MORALES: MARE DE AZAR (SCHOLASTIC)',
  'MILES MORALES: MARE DE AZAR (SCHOLASTIC)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/8MN2zkg8Jp2zdnQ0W4sJvI6AQ_A=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/6ff0f3f6-d819-11ee-89ed-e2697ce33d53.jpg"]'::jsonb,
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
  'PROD-01878',
  'MINNIE E O SEGREDO DA TIA MIRANDA (BD DISNEY)',
  'MINNIE E O SEGREDO DA TIA MIRANDA (BD DISNEY)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/PQUEOFlsylk9RT2dE08eEb7JVek=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/f7cb15cc-d819-11ee-83df-e2e54ed5f9f7.jpg"]'::jsonb,
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
  'PROD-01879',
  'MIRACLEMAN POR NEIL GAIMAN E MARK BUCKINGHAM VOL.2',
  'MIRACLEMAN POR NEIL GAIMAN E MARK BUCKINGHAM VOL.2',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/Rd6aSWboua9d72F2O39t4unmImE=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/ecf0d2aa-0143-11f0-9a82-ca3c9ea74dec.jpg"]'::jsonb,
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
  'PROD-01880',
  'MIRACULOUS: LADYBUG & CAT NOIR - 01 [REB]',
  'MIRACULOUS: LADYBUG & CAT NOIR - 01 [REB]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/Tlntuw922dcZtNH_kXntgx0QoMk=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/dad47570-3f2f-11f0-87b4-c2502d24ff3f.jpg"]'::jsonb,
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
  'PROD-01881',
  'MIRACULOUS: LADYBUG & CAT NOIR - 02 [REB]',
  'MIRACULOUS: LADYBUG & CAT NOIR - 02 [REB]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/9lweC8OzXEBW-MP3UZcen369JWo=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/45cb35b0-5ea9-11f0-885d-4eae30e658d1.jpg"]'::jsonb,
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
  'PROD-01882',
  'MIRACULOUS: LADYBUG & CAT NOIR - 03 [REB]',
  'MIRACULOUS: LADYBUG & CAT NOIR - 03 [REB]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/ZLxbVUOEmrWLBlchKFnq0PFlkf4=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/dae593b4-3f2f-11f0-a17d-1ac4d5553c9e.jpg"]'::jsonb,
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
  'PROD-01883',
  'MISSÃO FAMÍLIA YOZAKURA - 08',
  'MISSÃO FAMÍLIA YOZAKURA - 08',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/frNTsBYj0c5SfqU3OKj_-X4eTXg=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/dabebbc2-d81a-11ee-9df9-5a86bcbeb6e3.jpg"]'::jsonb,
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
  'PROD-01884',
  'MISSÃO FAMÍLIA YOZAKURA - 09',
  'MISSÃO FAMÍLIA YOZAKURA - 09',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/hYK5-bYdWoVk9ri1LsaKidhPip8=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/db5811fa-d81a-11ee-8f71-e2e54ed5f9f7.jpg"]'::jsonb,
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
  'PROD-01885',
  'MISSÃO FAMÍLIA YOZAKURA - 10',
  'MISSÃO FAMÍLIA YOZAKURA - 10',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/KXBKvS1knLnUI2v4g1TDHGP7Ub4=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/dba679bc-d81a-11ee-8b82-06e22cdb7792.jpg"]'::jsonb,
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
  'PROD-01886',
  'MISSÃO FAMÍLIA YOZAKURA - 11',
  'MISSÃO FAMÍLIA YOZAKURA - 11',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/EduKZKbkh2cOTPONBtyt5mFDCa4=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/dbecc606-d81a-11ee-8f71-e2e54ed5f9f7.jpg"]'::jsonb,
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
  'PROD-01887',
  'MISSÃO FAMÍLIA YOZAKURA - 12',
  'MISSÃO FAMÍLIA YOZAKURA - 12',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/nWfxbYEyuUR4mF0BZAhOLEHKHfo=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/dc84534a-d81a-11ee-9df9-5a86bcbeb6e3.jpg"]'::jsonb,
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
  'PROD-01888',
  'MISSÃO FAMÍLIA YOZAKURA - 13',
  'MISSÃO FAMÍLIA YOZAKURA - 13',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/c5pjnXAHJBSSCHftfPxbjLuvuBs=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/dce331a8-d81a-11ee-98f1-c6f956d4b586.jpg"]'::jsonb,
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
  'PROD-01889',
  'MISSÃO FAMÍLIA YOZAKURA - 14',
  'MISSÃO FAMÍLIA YOZAKURA - 14',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/QAZLEhloLgxKuzyCXDld4XMFe8A=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/dd119048-d81a-11ee-9df9-5a86bcbeb6e3.jpg"]'::jsonb,
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
  'PROD-01890',
  'MISSÃO FAMÍLIA YOZAKURA - 15',
  'MISSÃO FAMÍLIA YOZAKURA - 15',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/36xF7prFwmo24Wb3ORDm4sXQBBo=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/dd931406-d81a-11ee-8f71-e2e54ed5f9f7.jpg"]'::jsonb,
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
  'PROD-01891',
  'MISSÃO FAMÍLIA YOZAKURA - 16',
  'MISSÃO FAMÍLIA YOZAKURA - 16',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/bwRAqLBsKGVKwN-Pm08LQaSttak=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/ddc6ee70-d81a-11ee-9df9-5a86bcbeb6e3.jpg"]'::jsonb,
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
  'PROD-01892',
  'MISSÃO FAMÍLIA YOZAKURA - 21',
  'MISSÃO FAMÍLIA YOZAKURA - 21',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/jnPAwOhJo7-8ocveIhRvsqDpqV8=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/d5619b7e-eb4a-11ef-8230-fa812316df6c.jpg"]'::jsonb,
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
  'PROD-01893',
  'MISSÃO FAMÍLIA YOZAKURA - 22',
  'MISSÃO FAMÍLIA YOZAKURA - 22',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/xiXLyluWhm6ywFnFJa8wRpcemjQ=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/d0bb8a0e-f616-11ef-9565-f2e31ca8a769.jpg"]'::jsonb,
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
  'PROD-01894',
  'MISSÃO FAMÍLIA YOZAKURA - 23',
  'MISSÃO FAMÍLIA YOZAKURA - 23',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/EEKuJdKxblnbHieKWpeLVHBgIRk=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/9f037208-1941-11f0-a707-ceedc1648097.jpg"]'::jsonb,
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
  'PROD-01895',
  'MISSÃO FAMÍLIA YOZAKURA - 24',
  'MISSÃO FAMÍLIA YOZAKURA - 24',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/LI2kwhx-E7gMsTZI18CCwwtawhg=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/2e29b2e4-a4ac-11f0-aa03-16ade38a6d4b.jpg"]'::jsonb,
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
  'PROD-01896',
  'MISSÃO FAMÍLIA YOZAKURA N.17',
  'MISSÃO FAMÍLIA YOZAKURA N.17',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/rvt-bWNOm_OpGa4kSGxXa0Ld9sA=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/de47880a-d81a-11ee-98f1-c6f956d4b586.jpg"]'::jsonb,
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
  'PROD-01897',
  'MISSÃO FAMÍLIA YOZAKURA N.18',
  'MISSÃO FAMÍLIA YOZAKURA N.18',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/C3gAqakoGlfxGtd4FWsDXHxIC1g=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/c50ebbac-d8a0-11ee-9406-061c358a76e0.jpg"]'::jsonb,
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
  'PROD-01898',
  'MISSÃO FAMÍLIA YOZAKURA N.19',
  'MISSÃO FAMÍLIA YOZAKURA N.19',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/zXXCoSCTyeTdhw3G0I7zgQPxOKU=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/4f50bd54-e497-11ee-83ff-7ee42cfe9644.jpg"]'::jsonb,
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
  'PROD-01899',
  'MISSÃO FAMÍLIA YOZAKURA N.20',
  'MISSÃO FAMÍLIA YOZAKURA N.20',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/d_mDq210t-lVgXCfdF7LU7UU50M=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/d24b6fca-63e4-11ef-a6a5-4248f5425adc.png"]'::jsonb,
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
  'PROD-01900',
  'MISTER NO: REVOLUCAO (OMNIBUS)',
  'MISTER NO: REVOLUCAO (OMNIBUS)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/7RznxiZcIG2oPPI6_i61k9pOV60=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/3f850e6c-7fd1-11f0-a5af-de5e70a27ff7.jpg"]'::jsonb,
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