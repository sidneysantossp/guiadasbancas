-- SQL para importar produtos Brancaleone
-- Gerado em: 2025-10-17T17:52:46.765Z
-- Total de produtos: 3363
-- Fonte: brancaleone-products-1760723254011.json

-- 1. Criar distribuidor (se não existir)

-- Distribuidor já criado no batch-001

-- Lote 17 de 68
-- Produtos: 1601 até 1700



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00801',
  'CHAINSAW MAN - 11 [REB4]',
  'CHAINSAW MAN - 11 [REB4]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/zFaJ7dGQOcU8DeFpW5idZCNoSKo=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/552f8938-8b5f-11f0-ab6e-7e1ab2cbb1e5.jpg"]'::jsonb,
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
  'PROD-00802',
  'CHAINSAW MAN - 12 [REB4]',
  'CHAINSAW MAN - 12 [REB4]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/59ZLjTC0uVI-tBGG1WAggp_sroQ=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/553d1d0a-8b5f-11f0-b3d9-165df9e621a1.jpg"]'::jsonb,
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
  'PROD-00803',
  'CHAINSAW MAN - 17',
  'CHAINSAW MAN - 17',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/39DjX4W1_MdD1Y3mGAJKqHEcp1c=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/bd3a4c2e-eb47-11ef-80c6-0ee70347c223.jpg"]'::jsonb,
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
  'PROD-00804',
  'CHAINSAW MAN - 18',
  'CHAINSAW MAN - 18',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/zsDfQ30NJy7pscoPee69GjGZXcE=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/ba4a0d36-f616-11ef-8bcd-4e33e7a5489c.jpg"]'::jsonb,
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
  'PROD-00805',
  'CHAINSAW MAN - 19',
  'CHAINSAW MAN - 19',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/vZMs3ivResa124jVl66XtbVX764=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/8e0fe2b0-3692-11f0-9bb2-62caa300e3a9.jpg"]'::jsonb,
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
  'PROD-00806',
  'CHAINSAW MAN - 20',
  'CHAINSAW MAN - 20',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/NlrpvWzw1vFNoTTKCWMb6O0O0NE=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/216fe0e6-a4ac-11f0-9bb5-ee8f90996b43.jpg"]'::jsonb,
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
  'PROD-00807',
  'CHAINSAW MAN N.16',
  'CHAINSAW MAN N.16',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/rc92gpHvCOr91JJt6Bvc4gXAukQ=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/762b6f96-4e7d-11ef-b144-4a1bf48aa6ac.jpg"]'::jsonb,
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
  'PROD-00808',
  'CHAOS GAME - 03',
  'CHAOS GAME - 03',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/ZSnLUdj9mOQSlmzHyoxorXjpyj0=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/7ebd8312-7fa9-11ef-b0bc-6e97175de7f7.jpg"]'::jsonb,
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
  'PROD-00809',
  'CHAOS GAME - 04',
  'CHAOS GAME - 04',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/CRR3dQ-QL0DVa4-vFTsh913dbwk=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/939a0efe-eb29-11ef-8d7f-eea3b61904a2.jpg"]'::jsonb,
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
  'PROD-00810',
  'CHAOS GAME - 05',
  'CHAOS GAME - 05',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/cLBuM-zPIKOiiLvjsZ7YP1AoeCU=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/ea96890a-0143-11f0-9a82-ca3c9ea74dec.jpg"]'::jsonb,
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
  'PROD-00811',
  'CHAOS GAME N.1',
  'CHAOS GAME N.1',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/TmHb2zgeskVpzpBLB6zEEuILGq0=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/93b029d0-2461-11ef-81c7-f2a69ad46e56.jpg"]'::jsonb,
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
  'PROD-00812',
  'CHAOS GAME N.2',
  'CHAOS GAME N.2',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/53jxzbQalyeAIzBZYFOyfOLc8e4=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/764c68b8-4e7d-11ef-843b-e2b73938f46c.jpg"]'::jsonb,
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
  'PROD-00813',
  'CHICO BENTO (2021-) N.69',
  'CHICO BENTO (2021-) N.69',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/JX_5lt-jBzBdGDgKqYtg2_gVyYc=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/c4003924-eb47-11ef-80c6-0ee70347c223.jpg"]'::jsonb,
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
  'PROD-00814',
  'CHICO BENTO (2021-) N.73',
  'CHICO BENTO (2021-) N.73',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/dcffW9gVZuvNIimc9UysqzNef7E=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/151d845c-f2f9-11ef-bcb5-dad79b85e12c.jpg"]'::jsonb,
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
  'PROD-00815',
  'CHICO BENTO (2021-) N.74',
  'CHICO BENTO (2021-) N.74',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/AkmJ8YhBVqhahJax2G_6_uPR0W4=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/f7507de0-feb9-11ef-8946-fac52ef86f93.jpg"]'::jsonb,
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
  'PROD-00816',
  'CHICO BENTO (2021-) N.75',
  'CHICO BENTO (2021-) N.75',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/6Jc43dtg-Ics5iBQjvkDANJ6grE=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/84e2f028-08c6-11f0-9f35-4602cccad65b.jpg"]'::jsonb,
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
  'PROD-00817',
  'CHICO BENTO (2021-) N.76',
  'CHICO BENTO (2021-) N.76',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/F-YuT4fvxDIVLJrqPlzBFvKfmI8=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/95dfa836-1941-11f0-857d-1a640e6f5312.jpg"]'::jsonb,
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
  'PROD-00818',
  'CHICO BENTO (2021-) N.77',
  'CHICO BENTO (2021-) N.77',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/kaSoN2PGHiZ0f8XfGOrPoIG396k=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/35cdff14-7fd1-11f0-a5af-de5e70a27ff7.jpg"]'::jsonb,
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
  'PROD-00819',
  'CHICO BENTO (2021-) N.78',
  'CHICO BENTO (2021-) N.78',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/iCqHUe-XMnjP0FMGRRDYHtxJ-CE=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/54275f0a-2473-11f0-b18c-baa1f40e9fb8.jpg"]'::jsonb,
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
  'PROD-00820',
  'CHICO BENTO (2021-) N.79',
  'CHICO BENTO (2021-) N.79',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/yxlBRCe36nzhSioEFJ_i2UlzK04=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/8d3e4bb0-9d49-11f0-b28c-5e39260dda1f.jpg"]'::jsonb,
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
  'PROD-00821',
  'CHICO BENTO (2021-) N.80',
  'CHICO BENTO (2021-) N.80',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/H-LLt2SWszoxtyKtvqVIO5BppUA=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/d7e4a9d4-3f2f-11f0-a17d-1ac4d5553c9e.jpg"]'::jsonb,
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
  'PROD-00822',
  'CHICO BENTO (2021-) N.81',
  'CHICO BENTO (2021-) N.81',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/A7iBUoJySci_dfNhDWyr3nmbcoU=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/23ad1898-48b7-11f0-9d89-9eda44bc3e04.jpg"]'::jsonb,
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
  'PROD-00823',
  'CHICO BENTO (2021-) N.82',
  'CHICO BENTO (2021-) N.82',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/uMSL5pjHO2YozeGE7IG8ONedKxg=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/37b637fe-5ea9-11f0-b8ff-8a0b5d172c0d.jpg"]'::jsonb,
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
  'PROD-00824',
  'CHICO BENTO (2021-) N.83',
  'CHICO BENTO (2021-) N.83',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/7eGT8eYJL9M1Vn66aUAhkCm0FYg=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/3820a6d4-5ea9-11f0-885d-4eae30e658d1.jpg"]'::jsonb,
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
  'PROD-00825',
  'CHICO BENTO (2021-) N.84',
  'CHICO BENTO (2021-) N.84',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/uMSL5pjHO2YozeGE7IG8ONedKxg=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/37b637fe-5ea9-11f0-b8ff-8a0b5d172c0d.jpg"]'::jsonb,
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
  'PROD-00826',
  'CHICO BENTO (2021-) N.85',
  'CHICO BENTO (2021-) N.85',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/eCUCtJ5bWDqtjZ0nbrqFgzxVSWQ=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/35e3925c-7fd1-11f0-b894-2e1dcafaddd0.jpg"]'::jsonb,
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
  'PROD-00827',
  'CHICO BENTO (2021-) N.86',
  'CHICO BENTO (2021-) N.86',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/VrJOLVGDm_DxOPN68Kp5gkf_IKg=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/3600f0c2-7fd1-11f0-a5af-de5e70a27ff7.jpg"]'::jsonb,
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
  'PROD-00828',
  'CHICO BENTO (2021-) N.87',
  'CHICO BENTO (2021-) N.87',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/lGYlQO_5ZCGRYyGIvg6exqUhd1Y=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/01b3e7da-98c6-11f0-8dc7-d2abfc04e1e1.jpg"]'::jsonb,
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
  'PROD-00829',
  'CHICO BENTO (2021-) N.88',
  'CHICO BENTO (2021-) N.88',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/0PRuMTMdjKmJvpqxztUCXj6uYB8=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/21bd243c-a4ac-11f0-a72e-eecb83d78201.jpg"]'::jsonb,
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
  'PROD-00830',
  'CHICO BENTO: ARVORADA (GRAPHIC MSP VOL.15) (REB)',
  'CHICO BENTO: ARVORADA (GRAPHIC MSP VOL.15) (REB)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/oKYjqMXNLNkge1BaJT-TdyshKG4=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/8cb12b50-d819-11ee-83df-e2e54ed5f9f7.jpg"]'::jsonb,
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
  'PROD-00831',
  'CHICO BENTO: VERDADE (GRAPHIC MSP VOL. 30) (REB)',
  'CHICO BENTO: VERDADE (GRAPHIC MSP VOL. 30) (REB)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/zSwlyFAEzxq0cB3leAfUOxcHIvo=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/f4b5771a-d89b-11ee-a97f-26337c3739c7.jpg"]'::jsonb,
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
  'PROD-00832',
  'CHOUJIN X - 01',
  'CHOUJIN X - 01',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/yOwmIu3jSPui6PV_uAXSuBohbdM=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/354fa258-d817-11ee-9ac4-da2373bc7c0b.jpg"]'::jsonb,
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
  'PROD-00833',
  'CHOUJIN X - 01 N.2',
  'CHOUJIN X - 01 N.2',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/qSHZNZpswleNxKf3uIFkaZek2xw=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/35f03ec0-d817-11ee-ae34-e2e54ed5f9f7.jpg"]'::jsonb,
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
  'PROD-00834',
  'CHOUJIN X - 03',
  'CHOUJIN X - 03',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/T1WaPsfSpRZEk-_BmgDLvfoZEc0=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/36359d3a-d817-11ee-b3a2-6efcfa6dd7bd.jpg"]'::jsonb,
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
  'PROD-00835',
  'CHOUJIN X - 07',
  'CHOUJIN X - 07',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/uSyZ6dU3OKzPfqDNUJ1y5Nkpy8k=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/7f221c0a-7fa9-11ef-b1d0-12caec0ea15c.jpg"]'::jsonb,
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
  'PROD-00836',
  'CHOUJIN X - 08',
  'CHOUJIN X - 08',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/YOwVJbmY9jlC36k-DYDcEaQeu2c=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/c8bcf556-eb47-11ef-a496-fa812316df6c.jpg"]'::jsonb,
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
  'PROD-00837',
  'CHOUJIN X - 09',
  'CHOUJIN X - 09',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/tdMkCilbnUEIBv9CR6MKy4zjxpE=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/eace4d4a-0143-11f0-9a82-ca3c9ea74dec.jpg"]'::jsonb,
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
  'PROD-00838',
  'CHOUJIN X - 10',
  'CHOUJIN X - 10',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/nKFc5gFBracYcMvyDr0UBnB818U=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/95f042b8-1941-11f0-9755-4e41bd18146f.jpg"]'::jsonb,
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
  'PROD-00839',
  'CHOUJIN X - 11',
  'CHOUJIN X - 11',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/ElzKNA0xl_wGyprhqRKiGNcOCGo=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/d7fcb07e-3f2f-11f0-a17d-1ac4d5553c9e.jpg"]'::jsonb,
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
  'PROD-00840',
  'CHOUJIN X N.4',
  'CHOUJIN X N.4',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/im5Y2J4ML8ON6k2DK21tOHLw7eA=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/276eb296-ebef-11ee-963f-1e73add0c60b.jpg"]'::jsonb,
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
  'PROD-00841',
  'CHOUJIN X N.5',
  'CHOUJIN X N.5',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/TSe0VZFi8GZgNGX5BVGOIwpnKqA=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/d484b73e-119a-11ef-bcb1-8607d1df3044.jpg"]'::jsonb,
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
  'PROD-00842',
  'CHOUJIN X N.6',
  'CHOUJIN X N.6',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/zUrXoppuy78XklfQU-mFSCM-GNk=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/c4d4bcde-63e4-11ef-b225-d27112a10133.png"]'::jsonb,
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
  'PROD-00843',
  'CLASSICOS X-MEN (MARVEL OMNIBUS)',
  'CLASSICOS X-MEN (MARVEL OMNIBUS)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/Ll1PxTl4BnpU-mZMWq9Otgptdjs=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/91258e76-4e7d-11ef-8b01-66fb588c5617.jpg"]'::jsonb,
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
  'PROD-00844',
  'COLECAO CLASSICA MARVEL VOL.03 - X-MEN VOL.01',
  'COLECAO CLASSICA MARVEL VOL.03 - X-MEN VOL.01',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/m6U0C3prqPyN33z8CJWQGYSHsdM=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/2e882f68-a4ac-11f0-9f2b-b616a40784ef.jpg"]'::jsonb,
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
  'PROD-00845',
  'COLECAO CLASSICA MARVEL VOL.04 - VINGADORES VOL.01',
  'COLECAO CLASSICA MARVEL VOL.04 - VINGADORES VOL.01',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/sHWHwI_hgTChfuo59G2MHUsbDF4=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/2e8e9e2a-a4ac-11f0-a599-8e83af06c4a6.jpg"]'::jsonb,
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
  'PROD-00846',
  'COLECAO CLASSICA MARVEL VOL.11 - QUARTETO FANTASTICO VOL.02',
  'COLECAO CLASSICA MARVEL VOL.11 - QUARTETO FANTASTICO VOL.02',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/OFpBZTaKQBz7-CR8ydIRoH60sNo=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/e1569c02-d81a-11ee-98f1-c6f956d4b586.jpg"]'::jsonb,
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
  'PROD-00847',
  'COLECAO CLASSICA MARVEL VOL.12 - THOR VOL.02',
  'COLECAO CLASSICA MARVEL VOL.12 - THOR VOL.02',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/6IujDAM56kWk5mw8y7RrYg7mqdc=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/e1ce5846-d81a-11ee-98f1-c6f956d4b586.jpg"]'::jsonb,
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
  'PROD-00848',
  'COLECAO CLASSICA MARVEL VOL.13 - HOMEM DE FERRO VOL.02',
  'COLECAO CLASSICA MARVEL VOL.13 - HOMEM DE FERRO VOL.02',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/BY0Ih3tAsDjrSU_QHFqJEjGJ68s=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/e20309ce-d81a-11ee-8b82-06e22cdb7792.jpg"]'::jsonb,
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
  'PROD-00849',
  'COLECAO CLASSICA MARVEL VOL.14 - HOMEM-ARANHA VOL.03',
  'COLECAO CLASSICA MARVEL VOL.14 - HOMEM-ARANHA VOL.03',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/eoc6BjpCrZWFBdClb1MajTnFoQg=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/e26de424-d81a-11ee-8f71-e2e54ed5f9f7.jpg"]'::jsonb,
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
  'PROD-00850',
  'COLECAO CLASSICA MARVEL VOL.15 - VINGADORES VOL.02',
  'COLECAO CLASSICA MARVEL VOL.15 - VINGADORES VOL.02',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/dHo66SrDrewAVJSNkZqXAxXs5T0=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/e2aaadaa-d81a-11ee-9df9-5a86bcbeb6e3.jpg"]'::jsonb,
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