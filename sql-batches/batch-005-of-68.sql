-- SQL para importar produtos Brancaleone
-- Gerado em: 2025-10-17T18:20:53.612Z
-- Total de produtos: 3363
-- Fonte: brancaleone-products-1760723254011.json

-- 1. Criar distribuidor (se não existir)

-- Distribuidor já criado no batch-001

-- Lote 5 de 68
-- Produtos: 401 até 500



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00201',
  'ALMANAQUE DE HISTORIAS CURTAS DA TURMA DA MONICA N.16',
  'ALMANAQUE DE HISTORIAS CURTAS DA TURMA DA MONICA N.16',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/7Pkuq-JaNBXtGRp2Qk9kecMStWk=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/f005ae70-0143-11f0-9a82-ca3c9ea74dec.jpg"]'::jsonb,
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
  'PROD-00202',
  'ALMANAQUE DE HISTÓRIAS CURTAS DA TURMA DA MONICA N.17',
  'ALMANAQUE DE HISTÓRIAS CURTAS DA TURMA DA MONICA N.17',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/Xiq1f_4EgmrUzNTJDIP17k9YAhM=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/d6d5118c-3f2f-11f0-87b4-c2502d24ff3f.jpg"]'::jsonb,
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
  'PROD-00203',
  'ALMANAQUE DE HISTORIAS CURTAS DA TURMA DA MONICA N.18',
  'ALMANAQUE DE HISTORIAS CURTAS DA TURMA DA MONICA N.18',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/OgEI2hsvVHHwiZVkEkEcLNa-kEY=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/206ab578-69af-11f0-9136-d26b36de5d6c.jpg"]'::jsonb,
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
  'PROD-00204',
  'ALMANAQUE DE HISTÓRIAS CURTAS DA TURMA DA MÔNICA N.9',
  'ALMANAQUE DE HISTÓRIAS CURTAS DA TURMA DA MÔNICA N.9',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/sx1nLR11hSiseyytBGMD-4z9Z0I=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/6704c3c4-d816-11ee-b70a-e2697ce33d53.jpg"]'::jsonb,
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
  'PROD-00205',
  'ALMANAQUE DE HISTORIAS PARA COLORIR DA TURMA DA MÔNICA N.3',
  'ALMANAQUE DE HISTORIAS PARA COLORIR DA TURMA DA MÔNICA N.3',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/tJq5CVdfHyujn_HHupuKbmdHMbg=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/fd995b7c-9031-11f0-82c8-4a06203c34dc.jpg"]'::jsonb,
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
  'PROD-00206',
  'ALMANAQUE DE HISTÓRIAS SEM  PALAVRAS DA TURMA DA MONICA N.17',
  'ALMANAQUE DE HISTÓRIAS SEM  PALAVRAS DA TURMA DA MONICA N.17',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/pp0ad3-pmds9DXuGKQTQ2iWG_Mc=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/6b51d7f8-5ea9-11f0-be82-febfa26cb361.jpg"]'::jsonb,
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
  'PROD-00207',
  'ALMANAQUE DE HISTÓRIAS SEM  PALAVRAS N.15',
  'ALMANAQUE DE HISTÓRIAS SEM  PALAVRAS N.15',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/LxLaht3uw8jzhrwAi64APiiYww0=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/00848ed2-f2f9-11ef-9a4c-6e7871fdaf1f.jpg"]'::jsonb,
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
  'PROD-00208',
  'ALMANAQUE DE HISTÓRIAS SEM  PALAVRAS N.18',
  'ALMANAQUE DE HISTÓRIAS SEM  PALAVRAS N.18',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/_So0u8KWq_Iy6mOdmKRAoblweYk=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/53a392b2-8b5f-11f0-ab6e-7e1ab2cbb1e5.jpg"]'::jsonb,
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
  'PROD-00209',
  'ALMANAQUE DE HISTÓRIAS SEM PALAVRAS  N.14',
  'ALMANAQUE DE HISTÓRIAS SEM PALAVRAS  N.14',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/v5XMI-EME1RSbmJqfJNlWrHueWQ=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/8de6dbf4-eb29-11ef-a4f3-5a40d84dae09.jpg"]'::jsonb,
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
  'PROD-00210',
  'ALMANAQUE DE HISTÓRIAS SEM PALAVRAS N.16',
  'ALMANAQUE DE HISTÓRIAS SEM PALAVRAS N.16',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/0S-_sx6exi6M-aW4Xv2ZMcTgeZQ=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/41fcbfee-2475-11f0-b281-1e01f72415a5.jpg"]'::jsonb,
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
  'PROD-00211',
  'ALMANAQUE DO CASCAO (202 N.19',
  'ALMANAQUE DO CASCAO (202 N.19',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/sj0AerTsl-5b_iqAeV_CF-jUCZ8=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/8ca3213c-e583-11ee-b66f-62eaabe3d6ba.jpg"]'::jsonb,
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
  'PROD-00212',
  'ALMANAQUE DO CASCAO (2021) N.22',
  'ALMANAQUE DO CASCAO (2021) N.22',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/8q0t_ZTzMqHyFPzNKVviFPoy5x0=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/7cb76894-7fa9-11ef-b1d0-12caec0ea15c.jpg"]'::jsonb,
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
  'PROD-00213',
  'ALMANAQUE DO CASCAO N.23',
  'ALMANAQUE DO CASCAO N.23',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/6WkJUfqWqmVH1HsmoBmzt6Ae-20=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/a1247406-eb47-11ef-80c6-0ee70347c223.jpg"]'::jsonb,
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
  'PROD-00214',
  'ALMANAQUE DO CASCAO N.24',
  'ALMANAQUE DO CASCAO N.24',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/j27KXLZ25r3SaQzq8uE16jNO5rA=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/8e47a6fa-eb29-11ef-a31a-8ed8743505f0.jpg"]'::jsonb,
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
  'PROD-00215',
  'ALMANAQUE DO CASCAO N.25',
  'ALMANAQUE DO CASCAO N.25',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/bwB3v3uOG8i_y7NXq0f1XGrcoqE=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/45527e4c-7fd1-11f0-b894-2e1dcafaddd0.jpg"]'::jsonb,
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
  'PROD-00216',
  'ALMANAQUE DO CASCAO N.26',
  'ALMANAQUE DO CASCAO N.26',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/wV9IEYOz0B4eOhQVuEcv4R7vHOw=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/d6af7012-3f2f-11f0-a17d-1ac4d5553c9e.jpg"]'::jsonb,
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
  'PROD-00217',
  'ALMANAQUE DO CASCAO N.27',
  'ALMANAQUE DO CASCAO N.27',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/x_3Mv_4kQEzeJlA9-4Xt6QJ3SOA=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/204f009e-69af-11f0-9a47-2e3660e82a7f.jpg"]'::jsonb,
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
  'PROD-00218',
  'ALMANAQUE DO CASCAO N.28',
  'ALMANAQUE DO CASCAO N.28',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/P7eoCiwrmGcMJPyHnzcnZJRGAg4=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/32bccc10-a4ac-11f0-a72e-eecb83d78201.jpg"]'::jsonb,
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
  'PROD-00219',
  'ALMANAQUE DO CEBOLINHA ( N.18',
  'ALMANAQUE DO CEBOLINHA ( N.18',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/vkC-Ut-Ijk_NY7aLvnIGLl0HASQ=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/56df9640-d816-11ee-bb12-5a86bcbeb6e3.jpg"]'::jsonb,
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
  'PROD-00220',
  'ALMANAQUE DO CEBOLINHA ( N.19',
  'ALMANAQUE DO CEBOLINHA ( N.19',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/u-KIwhJOJx1DmHP_QVANSuJKAAs=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/8c9c873c-e583-11ee-9d7c-f2cdc5a9e7d5.jpg"]'::jsonb,
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
  'PROD-00221',
  'ALMANAQUE DO CEBOLINHA (2021) N.20',
  'ALMANAQUE DO CEBOLINHA (2021) N.20',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/tbRgrW90TKeLPolZWEm01qouAMs=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/d45605f6-119a-11ef-9c09-e6e3c151f638.jpg"]'::jsonb,
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
  'PROD-00222',
  'ALMANAQUE DO CEBOLINHA (2021) N.21',
  'ALMANAQUE DO CEBOLINHA (2021) N.21',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/bwkFFGRIbIMZNeWawvUf-pgBYgk=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/7458c22c-4e7d-11ef-9a7d-6ef807fbb3ad.jpg"]'::jsonb,
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
  'PROD-00223',
  'ALMANAQUE DO CEBOLINHA (2021) N.22',
  'ALMANAQUE DO CEBOLINHA (2021) N.22',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/SXSZuCDT1gjy6PfzVERcIpYOoAU=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/7cd35c52-7fa9-11ef-b1d0-12caec0ea15c.jpg"]'::jsonb,
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
  'PROD-00224',
  'ALMANAQUE DO CEBOLINHA N.23',
  'ALMANAQUE DO CEBOLINHA N.23',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/Qg4C-LuRq84rqIsOtXaXMSx_0mo=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/a3c86046-eb47-11ef-80c6-0ee70347c223.jpg"]'::jsonb,
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
  'PROD-00225',
  'ALMANAQUE DO CEBOLINHA N.24',
  'ALMANAQUE DO CEBOLINHA N.24',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/2-G-1T_7GddmQvVAwfzA1QarzGo=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/8e6b1f7c-eb29-11ef-8b75-5ac0f052206d.jpg"]'::jsonb,
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
  'PROD-00226',
  'ALMANAQUE DO CEBOLINHA N.26',
  'ALMANAQUE DO CEBOLINHA N.26',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/c3LmdxZu-nOq60DaZJtchexEC8g=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/d6cbc640-3f2f-11f0-a17d-1ac4d5553c9e.jpg"]'::jsonb,
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
  'PROD-00227',
  'ALMANAQUE DO CEBOLINHA N.27',
  'ALMANAQUE DO CEBOLINHA N.27',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/leQVsYUQEGcXfumzHal8HobW7MA=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/205141c4-69af-11f0-ae5d-0ebdcf797c5e.jpg"]'::jsonb,
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
  'PROD-00228',
  'ALMANAQUE DO CEBOLINHA N.28',
  'ALMANAQUE DO CEBOLINHA N.28',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/zfFJcGxgdmDbwe89J2f3WBSaQ7U=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/32d5c0c6-a4ac-11f0-a72e-eecb83d78201.jpg"]'::jsonb,
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
  'PROD-00229',
  'ALMANAQUE DO CHICO BENTO N.19',
  'ALMANAQUE DO CHICO BENTO N.19',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/j3HoaIQMQttl1AR5pEbvuOo3hwQ=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/05d440c2-f68c-11ee-b203-3e7d9dc455bb.jpg"]'::jsonb,
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
  'PROD-00230',
  'ALMANAQUE DO CHICO BENTO N.21',
  'ALMANAQUE DO CHICO BENTO N.21',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/FP9b23BXCt9gK0xH9COr_gYYKWg=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/c096ae70-63e4-11ef-807c-4e837066fdd4.png"]'::jsonb,
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
  'PROD-00231',
  'ALMANAQUE DO CHICO BENTO N.22',
  'ALMANAQUE DO CHICO BENTO N.22',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/g8DoimP0MxGQc9otd3hheooq0v0=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/7cdaf9d0-7fa9-11ef-b0bc-6e97175de7f7.jpg"]'::jsonb,
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
  'PROD-00232',
  'ALMANAQUE DO CHICO BENTO N.23',
  'ALMANAQUE DO CHICO BENTO N.23',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/CiiwdmzAdz6Ti6QkmxlwVpWO4jk=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/8e7e50f6-eb29-11ef-8fb2-6696cc3e9cb3.jpg"]'::jsonb,
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
  'PROD-00233',
  'ALMANAQUE DO CHICO BENTO N.24',
  'ALMANAQUE DO CHICO BENTO N.24',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/dr3lubC_Pt-qklftQgcTL-KjfDE=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/00a2a5ac-f2f9-11ef-a462-7a17e78776b8.jpg"]'::jsonb,
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
  'PROD-00234',
  'ALMANAQUE DO CHICO BENTO N.26',
  'ALMANAQUE DO CHICO BENTO N.26',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/8lQQWZt1ykNFQNHULM8NXEYC55U=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/6b921fd4-5ea9-11f0-a034-4eae30e658d1.jpg"]'::jsonb,
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
  'PROD-00235',
  'ALMANAQUE DO CHICO BENTO N.27',
  'ALMANAQUE DO CHICO BENTO N.27',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/7wuZk9UqpiME52wHAH6fsl2xK1A=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/53884322-8b5f-11f0-ab6e-7e1ab2cbb1e5.jpg"]'::jsonb,
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
  'PROD-00236',
  'ALMANAQUE DOS PETS DA TURMA DA MONICA N.1',
  'ALMANAQUE DOS PETS DA TURMA DA MONICA N.1',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/qZokKnzNAh6MLVcCWdQTTForISs=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/2c87e15c-44b4-11f0-a1ec-1a73b65bfa37.jpg"]'::jsonb,
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
  'PROD-00237',
  'ALMANAQUE HISTÓRIAS SEM  PALAVRAS DA TURMA DA MONICA N.13',
  'ALMANAQUE HISTÓRIAS SEM  PALAVRAS DA TURMA DA MONICA N.13',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/1gKjR8Hf_2TJaLsv5btOY9hKPYE=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/7c958774-7fa9-11ef-b0bc-6e97175de7f7.jpg"]'::jsonb,
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
  'PROD-00238',
  'ALMANAQUE HISTÓRIAS SEM PALAVRAS N.10',
  'ALMANAQUE HISTÓRIAS SEM PALAVRAS N.10',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/vHZk8GJzqiTPn8DqOCEPJUjU5lA=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/130cc778-f68c-11ee-b203-3e7d9dc455bb.jpg"]'::jsonb,
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
  'PROD-00239',
  'ALMANAQUE HISTÓRIAS SEM PALAVRAS N.11',
  'ALMANAQUE HISTÓRIAS SEM PALAVRAS N.11',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/n5cz4EXXItIo3vQFTw01caMqlBU=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/f90611a4-2930-11ef-93b8-4a187dfd8c76.jpg"]'::jsonb,
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
  'PROD-00240',
  'ALMANAQUE HISTÓRIAS SEM PALAVRAS N.12',
  'ALMANAQUE HISTÓRIAS SEM PALAVRAS N.12',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/LnwMoHDtNhz_sYQOJ0RomlVahlc=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/c095a37c-63e4-11ef-aad4-727f596e106b.png"]'::jsonb,
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
  'PROD-00241',
  'ALMANAQUE TEMATICO (2007 N.69',
  'ALMANAQUE TEMATICO (2007 N.69',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/a7bzrbQ3ZOt8CLwNgEdveS7ugy0=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/9236a7e4-d819-11ee-b57d-56e6c271e0a3.jpg"]'::jsonb,
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
  'PROD-00242',
  'ALMANAQUE TEMATICO (2007 N.71',
  'ALMANAQUE TEMATICO (2007 N.71',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/KAMyRpEH2zX9bHsujXRztyBG114=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/8a81f30c-4e7d-11ef-b438-b279561b7695.jpg"]'::jsonb,
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
  'PROD-00243',
  'ALMANAQUE TEMATICO (2007) N.70',
  'ALMANAQUE TEMATICO (2007) N.70',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/DAQgJxJK8kF6WGnU0agn_hf3QvA=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/5e85f57c-5ea9-11f0-bc5c-8a0b5d172c0d.jpg"]'::jsonb,
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
  'PROD-00244',
  'ALMANAQUE TEMATICO (2007) N.72',
  'ALMANAQUE TEMATICO (2007) N.72',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/MmmQyJf0FD2qaq3ymuKzpBbp9rU=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/cdd43ce8-eb47-11ef-80c6-0ee70347c223.jpg"]'::jsonb,
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
  'PROD-00245',
  'ALMANAQUE TEMATICO (2007) N.73',
  'ALMANAQUE TEMATICO (2007) N.73',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/KYtCEO5LkJg0OVpKSqUanxHO93s=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/a355813e-eb29-11ef-8b75-5ac0f052206d.jpg"]'::jsonb,
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
  'PROD-00246',
  'ALMANAQUE TEMATICO N.74',
  'ALMANAQUE TEMATICO N.74',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/hh-_Fy0CqpNscNKm0TcVZrzW5WU=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/59ff5126-2473-11f0-acc9-ba327c171cd7.jpg"]'::jsonb,
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
  'PROD-00247',
  'ALMANAQUE TEMATICO N.75',
  'ALMANAQUE TEMATICO N.75',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/FlDZd4atkpI5NdVSraY8Rii67bE=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/1ef6a788-69af-11f0-9a47-2e3660e82a7f.jpg"]'::jsonb,
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
  'PROD-00248',
  'ALMANAQUE TURMA DA MONICA N.19',
  'ALMANAQUE TURMA DA MONICA N.19',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/HKXZeQTzUxyrd_2r8N_6JFkMbxQ=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/093ffde6-f68c-11ee-b90d-1a433adb68bd.jpg"]'::jsonb,
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
  'PROD-00249',
  'ALMANAQUE TURMA DA MONICA N.20',
  'ALMANAQUE TURMA DA MONICA N.20',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/wM4LFjv8Io_Rh_FeryyWSjmtp0k=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/f6baa68a-2930-11ef-93b8-4a187dfd8c76.jpg"]'::jsonb,
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
  'PROD-00250',
  'ALMANAQUE TURMA DA MONICA N.21',
  'ALMANAQUE TURMA DA MONICA N.21',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/RdZuf4WA2EwFPqpoZ9210OMrLsA=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/c7bc572c-63e4-11ef-aad4-727f596e106b.png"]'::jsonb,
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