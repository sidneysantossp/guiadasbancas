-- SQL para importar produtos Brancaleone
-- Gerado em: 2025-10-17T17:52:46.765Z
-- Total de produtos: 3363
-- Fonte: brancaleone-products-1760723254011.json

-- 1. Criar distribuidor (se não existir)

-- Distribuidor já criado no batch-001

-- Lote 55 de 68
-- Produtos: 5401 até 5500



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02701',
  'SONO BISQUE DOLL: MINHA ADORÁVEL COSPLAYER - 08',
  'SONO BISQUE DOLL: MINHA ADORÁVEL COSPLAYER - 08',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/d9B8L3yXKUszd6x8JO-AvMBuKKo=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/c264f666-0125-11ef-9d9d-e2f1d4f1a152.jpg"]'::jsonb,
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
  'PROD-02702',
  'SONO BISQUE DOLL: MINHA ADORÁVEL COSPLAYER - 08',
  'SONO BISQUE DOLL: MINHA ADORÁVEL COSPLAYER - 08',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/d9B8L3yXKUszd6x8JO-AvMBuKKo=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/c264f666-0125-11ef-9d9d-e2f1d4f1a152.jpg"]'::jsonb,
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
  'PROD-02703',
  'SONO BISQUE DOLL: MINHA ADORÁVEL COSPLAYER - 09',
  'SONO BISQUE DOLL: MINHA ADORÁVEL COSPLAYER - 09',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/3zfaZIcPkySfXIS5P8SARsYeO4c=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/c2e3994e-0125-11ef-9d9d-e2f1d4f1a152.jpg"]'::jsonb,
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
  'PROD-02704',
  'SONO BISQUE DOLL: MINHA ADORÁVEL COSPLAYER - 10',
  'SONO BISQUE DOLL: MINHA ADORÁVEL COSPLAYER - 10',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/HD6c6LzeCk7QDBl-IR40t1ciRFI=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/02cc8304-1ca6-11ef-bc32-def7b1441874.jpg"]'::jsonb,
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
  'PROD-02705',
  'SONO BISQUE DOLL: MINHA ADORÁVEL COSPLAYER - 11',
  'SONO BISQUE DOLL: MINHA ADORÁVEL COSPLAYER - 11',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/ZTIA0uxY6j1hezztxAaVgwV_A_E=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/8eb46e14-4e7d-11ef-80be-5acf4477aff6.jpg"]'::jsonb,
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
  'PROD-02706',
  'SONO BISQUE DOLL: MINHA ADORÁVEL COSPLAYER - 12',
  'SONO BISQUE DOLL: MINHA ADORÁVEL COSPLAYER - 12',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/a56pN-neEmJeW4m-9J4pc_KAOoE=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/d070d230-63e4-11ef-b225-d27112a10133.png"]'::jsonb,
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
  'PROD-02707',
  'SONO BISQUE DOLL: MINHA ADORÁVEL COSPLAYER - 13',
  'SONO BISQUE DOLL: MINHA ADORÁVEL COSPLAYER - 13',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/TnV7MX5mOIdlE_5JTuxAOhSylSI=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/abc52d56-eb29-11ef-a31a-8ed8743505f0.jpg"]'::jsonb,
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
  'PROD-02708',
  'SONO BISQUE DOLL: MINHA ADORÁVEL COSPLAYER - 14',
  'SONO BISQUE DOLL: MINHA ADORÁVEL COSPLAYER - 14',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/ZtUg9Rkw3aoxrfZDt85hTBKwGIM=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/c7cf5c4a-642a-11f0-b55e-2a081a9d92fa.jpg"]'::jsonb,
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
  'PROD-02709',
  'SPAWN APRESENTA: OS CONDENADOS VOL.01',
  'SPAWN APRESENTA: OS CONDENADOS VOL.01',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/ojgXIKnBN_swG21yp8vr9Q4bIxA=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/8b672564-3692-11f0-a81e-4229cd842ad5.jpg"]'::jsonb,
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
  'PROD-02710',
  'SPAWN APRESENTA: SAM E TWITCH VOL.01',
  'SPAWN APRESENTA: SAM E TWITCH VOL.01',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/pUwXJHkAzpCnJmMNnLiCIK9l19s=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/06665bfa-98c6-11f0-bdc9-b6c5438103c7.jpg"]'::jsonb,
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
  'PROD-02711',
  'SPAWN ESPECIAL VOL.01: VIOLADOR',
  'SPAWN ESPECIAL VOL.01: VIOLADOR',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/b_4_YKviYK_va875nhKywaH2AgM=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/d05b82ea-63e4-11ef-b428-a2b2aa9ce723.png"]'::jsonb,
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
  'PROD-02712',
  'SPAWN ESPECIAL VOL.02: FEUDO DE SANGUE',
  'SPAWN ESPECIAL VOL.02: FEUDO DE SANGUE',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/dWGj6qT3OQBQfFF8j5gcQ5b5rIY=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/1522979a-eb4b-11ef-8230-fa812316df6c.jpg"]'::jsonb,
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
  'PROD-02713',
  'SPAWN N.1',
  'SPAWN N.1',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/HvXVFFJ_0fZip4eLLbOmeqUPzeE=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/5b9f99be-0cc8-11ef-88d1-3619a1e0872c.jpg"]'::jsonb,
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
  'PROD-02714',
  'SPAWN N.2',
  'SPAWN N.2',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/jMKLYvklVaa9n_qwBh10DwC3xMA=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/d0966842-63e4-11ef-b08c-feee356726a9.png"]'::jsonb,
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
  'PROD-02715',
  'SPAWN PISTOLEIRO VOL.01',
  'SPAWN PISTOLEIRO VOL.01',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/UPowkkkKDD71L0ZQfBQ-1anl6Do=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/9e121480-1941-11f0-a9be-7a7afc96fac7.jpg"]'::jsonb,
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
  'PROD-02716',
  'SPAWN VOL.03',
  'SPAWN VOL.03',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/eoUc7tdELmEsXjr8mRaa_E6D1Ao=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/8a1dae62-7fa9-11ef-b0bc-6e97175de7f7.jpg"]'::jsonb,
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
  'PROD-02717',
  'SPAWN VOL.04',
  'SPAWN VOL.04',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/0mzMXU4EwnNxbk9qSOojaduuAi4=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/17eb6bdc-eb4b-11ef-8230-fa812316df6c.jpg"]'::jsonb,
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
  'PROD-02718',
  'SPAWN VOL.05',
  'SPAWN VOL.05',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/HCC_Om47Lw-wi0eFsUgIml6ChSI=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/9e31b6f0-1941-11f0-b216-e656abf73baf.jpg"]'::jsonb,
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
  'PROD-02719',
  'SPAWN VOL.06',
  'SPAWN VOL.06',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/M3QCn3l1J_cIiMV9OMWW6HFzVRI=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/2180bc00-48b7-11f0-98d1-7a925bb2c122.jpg"]'::jsonb,
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
  'PROD-02720',
  'SPAWN VOL.07',
  'SPAWN VOL.07',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/6X6_RN7p23lu2uAFq-vNQIcMauw=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/681eef9e-5ea9-11f0-bc5c-8a0b5d172c0d.jpg"]'::jsonb,
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
  'PROD-02721',
  'SPAWN VOL.08',
  'SPAWN VOL.08',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/n4Scykwxk-rbE5poSVahD7xueLw=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/526d7020-8b5f-11f0-ab6e-7e1ab2cbb1e5.jpg"]'::jsonb,
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
  'PROD-02722',
  'SPAWN: ORIGENS VOL. 09',
  'SPAWN: ORIGENS VOL. 09',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/Uk-TeBVKFbTAWdFEcsJvtvDkYss=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/3218e3b6-a4ac-11f0-a599-8e83af06c4a6.jpg"]'::jsonb,
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
  'PROD-02723',
  'SPAWN: ORIGENS VOL. 10',
  'SPAWN: ORIGENS VOL. 10',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/mfEb9yjyO5s-3PJ_9ZHjS82lJKY=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/2b870d96-44b4-11f0-90fa-7e281e739724.jpg"]'::jsonb,
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
  'PROD-02724',
  'SPAWN: ORIGENS VOL.01 [REB2]',
  'SPAWN: ORIGENS VOL.01 [REB2]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/orBLM8oioY5UcCFsulygP_S89WQ=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/31b46bde-a4ac-11f0-9f2b-b616a40784ef.jpg"]'::jsonb,
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
  'PROD-02725',
  'SPAWN: ORIGENS VOL.02',
  'SPAWN: ORIGENS VOL.02',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/08kprh2BmVIJdVzuOFSPyden5dk=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/918e4006-4e7d-11ef-8897-0ec18585415d.jpg"]'::jsonb,
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
  'PROD-02726',
  'SPAWN: ORIGENS VOL.04 [REB]',
  'SPAWN: ORIGENS VOL.04 [REB]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/OCUaMcs6gqZgtK92X5iUaygdwKc=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/31d7d4c0-a4ac-11f0-a72e-eecb83d78201.jpg"]'::jsonb,
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
  'PROD-02727',
  'SPAWN: ORIGENS VOL.06',
  'SPAWN: ORIGENS VOL.06',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/2sA4QivVmAXjuT-8-JGwUv_JFRw=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/b2cd2fae-eb29-11ef-8cc5-0ee70347c223.jpg"]'::jsonb,
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
  'PROD-02728',
  'SPAWN: ORIGENS VOL.07',
  'SPAWN: ORIGENS VOL.07',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/hp2wWBwTYPhlZ3EBsQeR3gJKC8g=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/d13a712a-f616-11ef-988d-b68eeb3470d5.jpg"]'::jsonb,
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
  'PROD-02729',
  'SPAWN: ORIGENS VOL.08',
  'SPAWN: ORIGENS VOL.08',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/QG8lUh_rVbTh-LFQa3yq8sYmz_U=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/321164ce-a4ac-11f0-8687-a638114deac1.jpg"]'::jsonb,
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
  'PROD-02730',
  'SPAWN: ORIGENS VOL.11',
  'SPAWN: ORIGENS VOL.11',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/eJ6GP7QVsfvQIO_rX_eHtM7F1Hk=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/3510e6fc-5ea9-11f0-885d-4eae30e658d1.jpg"]'::jsonb,
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
  'PROD-02731',
  'SPAWN: ORIGENS VOL.12',
  'SPAWN: ORIGENS VOL.12',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/brXItmMb6711xDv6-a3bVwWsqIA=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/34e0b342-5ea9-11f0-885d-4eae30e658d1.jpg"]'::jsonb,
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
  'PROD-02732',
  'SPAWN: ORIGENS VOL.13',
  'SPAWN: ORIGENS VOL.13',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/m-ZB3Po0D2ZURI2epuSzVcpW-9g=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/54a8ef90-8b5f-11f0-b3d9-165df9e621a1.jpg"]'::jsonb,
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
  'PROD-02733',
  'SPAWN: ORIGENS VOL.14',
  'SPAWN: ORIGENS VOL.14',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/Cpc5dvMX2T_QxPndv4OpcoovUFc=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/e67a9afa-9031-11f0-82c8-4a06203c34dc.jpg"]'::jsonb,
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
  'PROD-02734',
  'SPAWN: ORIGENS VOL.15',
  'SPAWN: ORIGENS VOL.15',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/5x1BmZv-Fuhvp1Srg7J7h0V-afo=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/208d9fba-a4ac-11f0-8bce-3af03c92463f.jpg"]'::jsonb,
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
  'PROD-02735',
  'SPY VS SPY POR ANTONIO PROHIAS (DC VINTAGE)',
  'SPY VS SPY POR ANTONIO PROHIAS (DC VINTAGE)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/8TBTgOGKX0U-Hmc31lXj274Z0gM=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/9e3f3316-1941-11f0-a070-52fdc73cc03d.jpg"]'::jsonb,
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
  'PROD-02736',
  'SPY X FAMILY - 01 [REB7]',
  'SPY X FAMILY - 01 [REB7]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/lvz2Wl2xNrF7cwGrQ3K1iZD1pLY=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/243973b4-6f3c-11f0-9c6d-ca4ee6a64eef.jpg"]'::jsonb,
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
  'PROD-02737',
  'SPY X FAMILY - 02 [REB6]',
  'SPY X FAMILY - 02 [REB6]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/f5yd7X3wqUYMfNUkYBn6KeTJGuw=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/243cb498-6f3c-11f0-ac4b-2a24a967b96c.jpg"]'::jsonb,
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
  'PROD-02738',
  'SPY X FAMILY - 03 [REB5]',
  'SPY X FAMILY - 03 [REB5]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/m2XUVcqBXsk9wGZq050l0N5OBgo=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/246b2a9e-6f3c-11f0-b5d2-36049232c238.jpg"]'::jsonb,
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
  'PROD-02739',
  'SPY X FAMILY - 04 [REB4]',
  'SPY X FAMILY - 04 [REB4]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/CgOGaTdzdt610plyvtXfglnf5Y4=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/1f302738-f2f9-11ef-a0d3-6e7871fdaf1f.jpg"]'::jsonb,
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
  'PROD-02740',
  'SPY X FAMILY - 05 [REB4]',
  'SPY X FAMILY - 05 [REB4]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/yMWCMG3WJH-wNpjHKC-IqL1mxT4=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/1f5b96d4-f2f9-11ef-aaca-2e8a5a0e18c7.jpg"]'::jsonb,
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
  'PROD-02741',
  'SPY X FAMILY - 06 [REB4]',
  'SPY X FAMILY - 06 [REB4]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/PI1IPl83ZJOwl8YCMbEXYn0RheU=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/26a9220c-2ce4-11ef-8ab0-0eee853c412c.jpg"]'::jsonb,
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
  'PROD-02742',
  'SPY X FAMILY - 07 [REB4]',
  'SPY X FAMILY - 07 [REB4]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/MO8otLLEZdKSuzSWpbjhZdEKS5M=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/ac104156-eb29-11ef-8cc5-0ee70347c223.jpg"]'::jsonb,
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
  'PROD-02743',
  'SPY X FAMILY - 08 [REB 2]',
  'SPY X FAMILY - 08 [REB 2]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/GEBvous-aibnvUeCsus43AKkru0=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/26cde9b6-2ce4-11ef-a9d6-52a12b2a7219.jpg"]'::jsonb,
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
  'PROD-02744',
  'SPY X FAMILY - 09 [REB 2]',
  'SPY X FAMILY - 09 [REB 2]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/3aF35Y4fYOgmpIXQ6qrqZETONxs=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/26f6e0dc-2ce4-11ef-8cd5-1a1779068424.jpg"]'::jsonb,
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
  'PROD-02745',
  'SPY X FAMILY - 10 [REB2]',
  'SPY X FAMILY - 10 [REB2]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/SMq-N7u10LMznnLXkTLexXZrKaI=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/8011d70a-4dac-11f0-869e-c68fdf865aae.jpg"]'::jsonb,
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
  'PROD-02746',
  'SPY X FAMILY - 11 [REB3]',
  'SPY X FAMILY - 11 [REB3]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/gPjr60wzizgjI-y9NlB42vBX-7A=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/fb1ea0f0-9031-11f0-82c8-4a06203c34dc.jpg"]'::jsonb,
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
  'PROD-02747',
  'SPY X FAMILY - 12 [REB2]',
  'SPY X FAMILY - 12 [REB2]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/SZtla9QKlXyWiIZxVV1hzWBBmgI=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/fc985714-9031-11f0-82c8-4a06203c34dc.jpg"]'::jsonb,
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
  'PROD-02748',
  'SPY X FAMILY - 12 [REB]',
  'SPY X FAMILY - 12 [REB]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/RanBOubKveyowNueG9Gl5tlvZ-s=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/8155cc8e-4dac-11f0-b840-c6f13973e51f.jpg"]'::jsonb,
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
  'PROD-02749',
  'SPY X FAMILY - 13',
  'SPY X FAMILY - 13',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/uzPHH5qQHmmC_16sY4mrftldkws=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/16786494-eb4b-11ef-8230-fa812316df6c.jpg"]'::jsonb,
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
  'PROD-02750',
  'SPY X FAMILY - 14',
  'SPY X FAMILY - 14',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/w-ynZtm0mR6u2H_AAjJ7v_e97LI=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/eeba60ba-0143-11f0-9602-e6e8567c501d.jpg"]'::jsonb,
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