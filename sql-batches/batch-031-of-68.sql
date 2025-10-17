-- SQL para importar produtos Brancaleone
-- Gerado em: 2025-10-17T17:52:46.765Z
-- Total de produtos: 3363
-- Fonte: brancaleone-products-1760723254011.json

-- 1. Criar distribuidor (se não existir)

-- Distribuidor já criado no batch-001

-- Lote 31 de 68
-- Produtos: 3001 até 3100



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01501',
  'JOVENS TITANS: MUTANO (DC TEEN) - CAPA VARIANTE',
  'JOVENS TITANS: MUTANO (DC TEEN) - CAPA VARIANTE',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/3ywAe_CeO7Fv8K7SXN9U_j6HqBE=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/d941befe-eb4a-11ef-a198-2a5f63e8aebc.jpg"]'::jsonb,
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
  'PROD-01502',
  'JOVENS TITAS EM ACAO VOL. 02',
  'JOVENS TITAS EM ACAO VOL. 02',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/cYWYBMPxQuhbINX3JhbVptFlOUU=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/019358d2-1ca6-11ef-bc32-def7b1441874.jpg"]'::jsonb,
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
  'PROD-01503',
  'JOVENS TITAS EM ACAO VOL. 03',
  'JOVENS TITAS EM ACAO VOL. 03',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/q-h6C1vtjwyKcAVBOmdl-j-p_no=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/90363e66-4e7d-11ef-b9d4-b2ff09f00306.jpg"]'::jsonb,
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
  'PROD-01504',
  'JOVENS TITAS EM ACAO VOL.04',
  'JOVENS TITAS EM ACAO VOL.04',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/aZkzC0eG_Sw31hkegHAU3rs81_Q=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/1b7b9e3e-eb4b-11ef-8621-0ee70347c223.jpg"]'::jsonb,
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
  'PROD-01505',
  'JOVENS TITAS EM ACAO VOL.05',
  'JOVENS TITAS EM ACAO VOL.05',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/WRUVcKjDcnqyqOIoX5F3D3Txg8s=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/af31b3d8-eb29-11ef-8b75-5ac0f052206d.jpg"]'::jsonb,
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
  'PROD-01506',
  'JOVENS TITAS EM ACAO VOL.06',
  'JOVENS TITAS EM ACAO VOL.06',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/ljzZ4f-N-HihPo5hWMjnO4K0lzY=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/5bb2b4a4-2473-11f0-b171-7a639e1da89c.jpg"]'::jsonb,
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
  'PROD-01507',
  'JOVENS TITAS EM ACAO VOL.07',
  'JOVENS TITAS EM ACAO VOL.07',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/tSRCl9sUTHyYYXFYLxybJmbopqY=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/1fb81008-69af-11f0-ae5d-0ebdcf797c5e.jpg"]'::jsonb,
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
  'PROD-01508',
  'JOVENS TITAS EM ACAO VOL.08',
  'JOVENS TITAS EM ACAO VOL.08',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/UTj_oFbNYzHm-pbm_ywUvIkhpGI=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/531718dc-8b5f-11f0-b3d9-165df9e621a1.jpg"]'::jsonb,
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
  'PROD-01509',
  'JOVENS TITAS: MUTANO AMA RAVENA (DC TEENS) - CAPA VARIANTE',
  'JOVENS TITAS: MUTANO AMA RAVENA (DC TEENS) - CAPA VARIANTE',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/eFce-cZVvP9ejXrlc85eKd-2dOk=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/ee24d324-eb4a-11ef-8230-fa812316df6c.jpg"]'::jsonb,
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
  'PROD-01510',
  'JOVENS TITAS: RAVENA (DC TEEN) - CAPA VARIANTE',
  'JOVENS TITAS: RAVENA (DC TEEN) - CAPA VARIANTE',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/18dml0KUpokjkMnCT-7Fg8JZ5B0=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/abdbd152-ee29-11ef-b823-265cac193354.jpg"]'::jsonb,
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
  'PROD-01511',
  'JOVENS TITAS: ROBIN (DC TEENS) - CAPA VARIANTE',
  'JOVENS TITAS: ROBIN (DC TEENS) - CAPA VARIANTE',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/tbFEj6rOwsFZEZj8svr9R6pAhwU=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/db066028-eb4a-11ef-8230-fa812316df6c.jpg"]'::jsonb,
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
  'PROD-01512',
  'JUJUTSU KAISEN - 11 [REB 2]',
  'JUJUTSU KAISEN - 11 [REB 2]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/LdwIQ-pEyJvTTpD6L347l3h121Y=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/90b02cd2-3692-11f0-a81e-4229cd842ad5.jpg"]'::jsonb,
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
  'PROD-01513',
  'JUJUTSU KAISEN - 13 [REB]',
  'JUJUTSU KAISEN - 13 [REB]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/KWVHmjJagswZPj7k6HI7aOgskI0=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/3ef71c1a-7fd1-11f0-b894-2e1dcafaddd0.jpg"]'::jsonb,
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
  'PROD-01514',
  'JUJUTSU KAISEN - 14 [REB]',
  'JUJUTSU KAISEN - 14 [REB]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/4mvJKH8enVOSzBzA3kTAGQORS2k=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/3f1fe3de-7fd1-11f0-a5af-de5e70a27ff7.jpg"]'::jsonb,
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
  'PROD-01515',
  'JUJUTSU KAISEN - A PASSAGEM DO VERÃO E O RETORNO DO OUTONO',
  'JUJUTSU KAISEN - A PASSAGEM DO VERÃO E O RETORNO DO OUTONO',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/HfF3Nv_A97S38Nyxj_zEkcAO6dQ=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/3ecab4f4-7fd1-11f0-a5af-de5e70a27ff7.jpg"]'::jsonb,
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
  'PROD-01516',
  'JUJUTSU KAISEN - BATALHA DE FEITICEIROS - 02 [REB6]',
  'JUJUTSU KAISEN - BATALHA DE FEITICEIROS - 02 [REB6]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/p74w-hFo_GoWRZKI8uWNCfzTA_c=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/ecfdd36a-0143-11f0-9602-e6e8567c501d.jpg"]'::jsonb,
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
  'PROD-01517',
  'JUJUTSU KAISEN - BATALHA DE FEITICEIROS - 03 [REB6]',
  'JUJUTSU KAISEN - BATALHA DE FEITICEIROS - 03 [REB6]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/UXveK1yQGQm9WFWEHNp1DoaBGiQ=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/ed3e9bc0-0143-11f0-9602-e6e8567c501d.jpg"]'::jsonb,
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
  'PROD-01518',
  'JUJUTSU KAISEN - BATALHA DE FEITICEIROS - 04 [REB4]',
  'JUJUTSU KAISEN - BATALHA DE FEITICEIROS - 04 [REB4]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/7iQzRpOhi8wT61tTp2RrlxiOt7w=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/ed7578de-0143-11f0-9a82-ca3c9ea74dec.jpg"]'::jsonb,
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
  'PROD-01519',
  'JUJUTSU KAISEN - BATALHA DE FEITICEIROS - 05 [REB4]',
  'JUJUTSU KAISEN - BATALHA DE FEITICEIROS - 05 [REB4]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/1c55XIS8v2QJQudFn7GlUB7NiXk=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/ed74661a-0143-11f0-9602-e6e8567c501d.jpg"]'::jsonb,
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
  'PROD-01520',
  'JUJUTSU KAISEN - BATALHA DE FEITICEIROS - 06 [REB3]',
  'JUJUTSU KAISEN - BATALHA DE FEITICEIROS - 06 [REB3]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/H9aDsVO2Btw88hts9hIdVrVZSok=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/90945ad4-3692-11f0-9b5f-32c7a3eebbfc.jpg"]'::jsonb,
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
  'PROD-01521',
  'JUJUTSU KAISEN - BATALHA DE FEITICEIROS - 07 [REB3]',
  'JUJUTSU KAISEN - BATALHA DE FEITICEIROS - 07 [REB3]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/p78HktErnxWS_33hF4A8Zat8_nY=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/9b963a7e-1941-11f0-a070-52fdc73cc03d.jpg"]'::jsonb,
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
  'PROD-01522',
  'JUJUTSU KAISEN - BATALHA DE FEITICEIROS - 08 [REB3]',
  'JUJUTSU KAISEN - BATALHA DE FEITICEIROS - 08 [REB3]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/92dtQgzVUpF0PXB_29Byhe4tTGM=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/9baa9280-1941-11f0-a05d-0653d0a19010.jpg"]'::jsonb,
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
  'PROD-01523',
  'JUJUTSU KAISEN - BATALHA DE FEITICEIROS - 09 [REB3]',
  'JUJUTSU KAISEN - BATALHA DE FEITICEIROS - 09 [REB3]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/vLEebE-Zh_PCKBzp542oboqEe4c=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/9bb5eb76-1941-11f0-b216-e656abf73baf.jpg"]'::jsonb,
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
  'PROD-01524',
  'JUJUTSU KAISEN - BATALHA DE FEITICEIROS - 10 [REB3]',
  'JUJUTSU KAISEN - BATALHA DE FEITICEIROS - 10 [REB3]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/NoUS0iqOkgBG20_Kdm_OLgSqrMA=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/9bd98e32-1941-11f0-ab25-7e3d31f80894.jpg"]'::jsonb,
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
  'PROD-01525',
  'JUJUTSU KAISEN - BATALHA DE FEITICEIROS - 27',
  'JUJUTSU KAISEN - BATALHA DE FEITICEIROS - 27',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/I9N7fJPL8d6qY1nYhMnUTEF4ymo=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/a214656a-eb29-11ef-8d7f-eea3b61904a2.jpg"]'::jsonb,
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
  'PROD-01526',
  'JUJUTSU KAISEN - BATALHA DE FEITICEIROS - 28',
  'JUJUTSU KAISEN - BATALHA DE FEITICEIROS - 28',
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
  'PROD-01527',
  'JUJUTSU KAISEN 0 - 01 [REB5]',
  'JUJUTSU KAISEN 0 - 01 [REB5]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/23aDjVfVJ8FMUtVXuxLGedF7r30=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/f832e40a-feb9-11ef-b916-4e63db6211ed.jpg"]'::jsonb,
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
  'PROD-01528',
  'JUJUTSU KAISEN N.29',
  'JUJUTSU KAISEN N.29',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/zWGLXtku9QBgtuSVIvfba-B6EsE=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/f20c1c86-9031-11f0-9754-9a60b14b6cd5.jpg"]'::jsonb,
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
  'PROD-01529',
  'JUJUTSU KAISEN N.30',
  'JUJUTSU KAISEN N.30',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/WfLnpE2TD8U63BLekl9DPYL7Q3g=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/4efc82a0-8b5f-11f0-819b-cef4535c59b2.jpg"]'::jsonb,
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
  'PROD-01530',
  'JUJUTSU KAISEN: BATALHA DE FEITICEIROS - 16 [REB2]',
  'JUJUTSU KAISEN: BATALHA DE FEITICEIROS - 16 [REB2]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/fLW8LKtPVlc525OTdOqxpKLVQRo=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/924e3958-9d49-11f0-916d-cee03b37ee33.jpg"]'::jsonb,
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
  'PROD-01531',
  'JUSTICEIRO (2023) VOL.01',
  'JUSTICEIRO (2023) VOL.01',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/s7S9gcVMd9alnXMjjQ9OaYqrg48=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/7992331e-da7d-11ee-9fe4-12792fd81a45.jpg"]'::jsonb,
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
  'PROD-01532',
  'JUSTICEIRO (2023) VOL.02',
  'JUSTICEIRO (2023) VOL.02',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/PP20gkFIu4s7SjKtex58tY3Kf4s=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/dd532b46-d817-11ee-bce8-e2e54ed5f9f7.jpg"]'::jsonb,
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
  'PROD-01533',
  'JUSTICEIRO (2023) VOL.03',
  'JUSTICEIRO (2023) VOL.03',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/jC5kKKrPKeeMVWX9jbiyZhzNg2w=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/dde969a8-d817-11ee-86d3-ce469b473a25.jpg"]'::jsonb,
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
  'PROD-01534',
  'JUSTICEIRO (2023) VOL.04',
  'JUSTICEIRO (2023) VOL.04',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/cLO_CFhLel4R-cb2aFXtEmkZ91o=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/96f4a714-e583-11ee-9d7c-f2cdc5a9e7d5.jpg"]'::jsonb,
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
  'PROD-01535',
  'JUSTICEIRO POR BARON & JANSON (MARVEL VINTAGE) N.1',
  'JUSTICEIRO POR BARON & JANSON (MARVEL VINTAGE) N.1',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/Fy_nt8-aVE1QfoS8czRr47XW5uM=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/3d4acad2-e497-11ee-b6a7-e2b250ff01a0.jpg"]'::jsonb,
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
  'PROD-01536',
  'JUSTICEIRO POR GREG RUCKA N.1',
  'JUSTICEIRO POR GREG RUCKA N.1',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/zT1OdkEZrHIucDTTBqfrWaktQxI=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/594eb1ea-0cc8-11ef-9312-4e89173d1712.jpg"]'::jsonb,
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
  'PROD-01537',
  'JUSTICEIRO POR GREG RUCKA VOL.02',
  'JUSTICEIRO POR GREG RUCKA VOL.02',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/qPSgT_rQWWLoZA-Dugi3ttY7wyo=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/989c871a-1941-11f0-a05d-0653d0a19010.jpg"]'::jsonb,
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
  'PROD-01538',
  'JUSTICEIRO: O PRÓXIMO TIRO',
  'JUSTICEIRO: O PRÓXIMO TIRO',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/EtGEWa_-RMa0HXYRfVZ5fPFfT8s=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/99896ea4-eb29-11ef-8fb2-6696cc3e9cb3.jpg"]'::jsonb,
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
  'PROD-01539',
  'KAGURABACHI - 01',
  'KAGURABACHI - 01',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/vGknJOun3Zek3gpYO8Cf13QNOIk=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/1b9df348-48b7-11f0-9d89-9eda44bc3e04.jpg"]'::jsonb,
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
  'PROD-01540',
  'KAGURABACHI - 02',
  'KAGURABACHI - 02',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/zJKGaJrKQI-ViaMywFI-aPleOB8=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/3823ed00-7fd1-11f0-a5af-de5e70a27ff7.jpg"]'::jsonb,
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
  'PROD-01541',
  'KAGURABACHI - 03',
  'KAGURABACHI - 03',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/kx8WyVKqxA3PkwCLOCFBhpt4HkY=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/03114bea-98c6-11f0-9174-8281520868be.jpg"]'::jsonb,
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
  'PROD-01542',
  'KAGUYA SAMA - LOVE IS WAR - 5 [REB]',
  'KAGUYA SAMA - LOVE IS WAR - 5 [REB]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/l70BElsLcNxCm2qJVrFrKYyp_OU=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/254c5fd2-a4ac-11f0-a599-8e83af06c4a6.jpg"]'::jsonb,
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
  'PROD-01543',
  'KAGUYA SAMA - LOVE IS WAR N.1',
  'KAGUYA SAMA - LOVE IS WAR N.1',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/nh73GxhADkox-A6sgGIAHU_fPYc=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/287b9118-ebef-11ee-8810-22f5b7d93b6a.jpg"]'::jsonb,
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
  'PROD-01544',
  'KAGUYA SAMA - LOVE IS WAR N.2',
  'KAGUYA SAMA - LOVE IS WAR N.2',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/zaivMbO8jCxmTX2154Ra9eMSF0g=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/e2869c10-d817-11ee-bce8-e2e54ed5f9f7.jpg"]'::jsonb,
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
  'PROD-01545',
  'KAGUYA SAMA - LOVE IS WAR N.3',
  'KAGUYA SAMA - LOVE IS WAR N.3',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/Wl8kIYS6yNtEUCNJQW72oLbIEtA=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/0909f052-f68c-11ee-bcc4-ca08cc7c0fbc.jpg"]'::jsonb,
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
  'PROD-01546',
  'KAGUYA SAMA - LOVE IS WAR N.4',
  'KAGUYA SAMA - LOVE IS WAR N.4',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/cN0_mMHaU4gDG9ZDNRWqdsaEhfo=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/e2b2f13e-d817-11ee-a3da-e2697ce33d53.jpg"]'::jsonb,
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
  'PROD-01547',
  'KAIJU 8 - 02 [REB]',
  'KAIJU 8 - 02 [REB]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/JqUsPJGMSs-JdhnLqr3m3rle9BM=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/98b7a068-1941-11f0-901b-ca0fbdcf3a7f.jpg"]'::jsonb,
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
  'PROD-01548',
  'KAIJU 8 - 03 [REB3]',
  'KAIJU 8 - 03 [REB3]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/YXuxwgvG6joq1li_Mk8kMzIriTI=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/4834c5cc-8b5f-11f0-ab6e-7e1ab2cbb1e5.jpg"]'::jsonb,
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
  'PROD-01549',
  'KAIJU 8 - 03 [REB]',
  'KAIJU 8 - 03 [REB]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/s6WCL6hVQz3rZKwTyFROy2mzHFg=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/f892dc98-feb9-11ef-8ddf-8eaa2bb036c2.jpg"]'::jsonb,
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
  'PROD-01550',
  'KAIJU 8 - 04 [REB3]',
  'KAIJU 8 - 04 [REB3]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/uP_59usePVC66_aDvSdHcXeul9g=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/484527dc-8b5f-11f0-b3d9-165df9e621a1.jpg"]'::jsonb,
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