-- SQL para importar produtos Brancaleone
-- Gerado em: 2025-10-17T18:20:53.612Z
-- Total de produtos: 3363
-- Fonte: brancaleone-products-1760723254011.json

-- 1. Criar distribuidor (se não existir)

-- Distribuidor já criado no batch-001

-- Lote 45 de 68
-- Produtos: 4401 até 4500



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02201',
  'O GUARDA-COSTAS DE HONEKO AKABANE - 07',
  'O GUARDA-COSTAS DE HONEKO AKABANE - 07',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/A0Qy63Dt5GGhVv-p5Rs8qLgM36s=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/f86932b2-feb9-11ef-8ddf-8eaa2bb036c2.jpg"]'::jsonb,
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
  'PROD-02202',
  'O GUARDA-COSTAS DE HONEKO AKABANE - 08',
  'O GUARDA-COSTAS DE HONEKO AKABANE - 08',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/QH6IfYlw4j-tRjTJy8ihXu8LvoA=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/8ef74ee8-3692-11f0-9bb2-62caa300e3a9.jpg"]'::jsonb,
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
  'PROD-02203',
  'O HOMEM DE GELO E SUA FRIA COLEGA DE TRABALHO - 01',
  'O HOMEM DE GELO E SUA FRIA COLEGA DE TRABALHO - 01',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/TJn8Tx5IKcg4zqpaR5WkqPRMhSc=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/147d885e-2791-11f0-acf6-1a50c6109233.jpg"]'::jsonb,
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
  'PROD-02204',
  'O HOMEM DE GELO E SUA FRIA COLEGA DE TRABALHO - 02',
  'O HOMEM DE GELO E SUA FRIA COLEGA DE TRABALHO - 02',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/eSDRKhiqB3B15gYe7IcQFKCfjp8=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/8f688eb4-3692-11f0-a555-0ab818bfd0ea.jpg"]'::jsonb,
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
  'PROD-02205',
  'O HOMEM DE GELO E SUA FRIA COLEGA DE TRABALHO - 03',
  'O HOMEM DE GELO E SUA FRIA COLEGA DE TRABALHO - 03',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/keFlcEDelNTFfN0-egb6mmkikiM=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/39570dce-7fd1-11f0-b894-2e1dcafaddd0.jpg"]'::jsonb,
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
  'PROD-02206',
  'O HOMEM DE GELO E SUA FRIA COLEGA DE TRABALHO - 04',
  'O HOMEM DE GELO E SUA FRIA COLEGA DE TRABALHO - 04',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/mYkKkExI75Kf6fRzj03ZyMZBy64=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/907f5bac-9d49-11f0-8058-ea3e6aa6a6aa.jpg"]'::jsonb,
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
  'PROD-02207',
  'O INCIDENTE DE DARWIN - 01',
  'O INCIDENTE DE DARWIN - 01',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/jznC6eE2Ed5E71XHQWv6flVE504=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/8fd57a72-d817-11ee-86d3-ce469b473a25.jpg"]'::jsonb,
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
  'PROD-02208',
  'O INCIDENTE DE DARWIN - 02',
  'O INCIDENTE DE DARWIN - 02',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/5eO2cP1u8eokES3I1Sh8KYohoSo=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/f2c089cc-d89b-11ee-815b-5a86bcbeb6e3.jpg"]'::jsonb,
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
  'PROD-02209',
  'O INCIDENTE DE DARWIN - 03',
  'O INCIDENTE DE DARWIN - 03',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/Zy9w9TQhwOPOhwyFlCTEZOfifqQ=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/902908e0-d817-11ee-9371-e2a33adec5cd.jpg"]'::jsonb,
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
  'PROD-02210',
  'O INCIDENTE DE DARWIN - 04',
  'O INCIDENTE DE DARWIN - 04',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/cR7AOCK5LseoI_Hnj4yil5wEzCE=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/9096e2ca-d817-11ee-86d3-ce469b473a25.jpg"]'::jsonb,
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
  'PROD-02211',
  'O INCIDENTE DE DARWIN - 05',
  'O INCIDENTE DE DARWIN - 05',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/czFf7nG3PGFcO_cBgkbwS_U8y0I=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/90dcf3fa-d817-11ee-9a1e-da2373bc7c0b.jpg"]'::jsonb,
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
  'PROD-02212',
  'O INCIDENTE DE DARWIN - 06',
  'O INCIDENTE DE DARWIN - 06',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/kcgpnL_u2g7Q_9ipretZFAwc4MU=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/7859cc2c-4e7d-11ef-8594-6e8213fe308c.jpg"]'::jsonb,
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
  'PROD-02213',
  'O INCIDENTE DE DARWIN - 07',
  'O INCIDENTE DE DARWIN - 07',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/oFcnYdIIF6p37gzNW1JAAW7RJTs=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/d98ea7e6-eb4a-11ef-8230-fa812316df6c.jpg"]'::jsonb,
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
  'PROD-02214',
  'O INCRIVEL HULK (2024) VOL.02',
  'O INCRIVEL HULK (2024) VOL.02',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/6yPY9TH43o33O0Vk_RUyprdzxI4=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/98edad16-eb29-11ef-9e36-2a856f41baa0.jpg"]'::jsonb,
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
  'PROD-02215',
  'O INCRIVEL HULK (2024) VOL.03',
  'O INCRIVEL HULK (2024) VOL.03',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/RAOnJS0QJaAC0MSxwfq7iTumy6M=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/c5a96898-642a-11f0-9174-0aba59c16e94.jpg"]'::jsonb,
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
  'PROD-02216',
  'O INCRIVEL HULK N.1',
  'O INCRIVEL HULK N.1',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/x5DGY4XukwGq18w2TcdjVquYKJk=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/7cc10708-4e7d-11ef-9e73-0a4d9a837559.jpg"]'::jsonb,
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
  'PROD-02217',
  'O INCRIVEL HULK POR PETER DAVID VOL.02 (MARVEL OMNIBUS)',
  'O INCRIVEL HULK POR PETER DAVID VOL.02 (MARVEL OMNIBUS)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/Q7xKMRP-yos7GZ9krTApYzhfK1Y=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/98fd08ec-eb29-11ef-9927-fa812316df6c.jpg"]'::jsonb,
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
  'PROD-02218',
  'O LONGO VERÃO DE 31 DE AGOSTO - 01',
  'O LONGO VERÃO DE 31 DE AGOSTO - 01',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/--wXoNrZFEkZ-W3Bv3oSTEl54kc=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/cef05248-0ea0-11f0-9433-6a2060da7b4c.jpg"]'::jsonb,
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
  'PROD-02219',
  'O LONGO VERÃO DE 31 DE AGOSTO - 02',
  'O LONGO VERÃO DE 31 DE AGOSTO - 02',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/koGyimTYj_SzAlr4SoE3o67uewU=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/8ebbfb68-3692-11f0-a81e-4229cd842ad5.jpg"]'::jsonb,
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
  'PROD-02220',
  'O LONGO VERÃO DE 31 DE AGOSTO - 03',
  'O LONGO VERÃO DE 31 DE AGOSTO - 03',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/atTvSppa7Dqky-odPc56UxZHCkQ=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/3fd5fcc6-5ea9-11f0-b8ff-8a0b5d172c0d.jpg"]'::jsonb,
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
  'PROD-02221',
  'O LONGO VERÃO DE 31 DE AGOSTO - 04',
  'O LONGO VERÃO DE 31 DE AGOSTO - 04',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/FZmOUcHEUtYEhZgg0KZGSp6uqRc=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/227893de-a4ac-11f0-a599-8e83af06c4a6.jpg"]'::jsonb,
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
  'PROD-02222',
  'O MARIDO DO MEU IRMÃO - 01 [REB]',
  'O MARIDO DO MEU IRMÃO - 01 [REB]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/qm97AGneNy4ArCVTojJYUUDDGzU=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/9f9f41fc-a7c0-11f0-8792-0ab376ee0ef4.jpg"]'::jsonb,
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
  'PROD-02223',
  'O PARAÍSO ILUSÓRIO - 03',
  'O PARAÍSO ILUSÓRIO - 03',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/ewBYgy6xaHB6nobkITXzaBIq378=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/bf73f038-d817-11ee-bce8-e2e54ed5f9f7.jpg"]'::jsonb,
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
  'PROD-02224',
  'O PARAÍSO ILUSÓRIO - 04',
  'O PARAÍSO ILUSÓRIO - 04',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/zFFnuPGfyOmJNl2xTPlWnKuK7kk=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/bfdea46e-d817-11ee-9371-e2a33adec5cd.jpg"]'::jsonb,
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
  'PROD-02225',
  'O PARAÍSO ILUSÓRIO - 05',
  'O PARAÍSO ILUSÓRIO - 05',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/g44LGe_LpLHyO4LWVgzlTGxsj9c=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/c075b1ce-d817-11ee-bce8-e2e54ed5f9f7.jpg"]'::jsonb,
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
  'PROD-02226',
  'O PARAÍSO ILUSÓRIO - 06',
  'O PARAÍSO ILUSÓRIO - 06',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/-0VMFqy28SzZPbf0D0tOnrNaOHI=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/c0c04bb2-d817-11ee-a3da-e2697ce33d53.jpg"]'::jsonb,
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
  'PROD-02227',
  'O PARAÍSO ILUSÓRIO - 11',
  'O PARAÍSO ILUSÓRIO - 11',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/WVpvxYwTWZ2_OrbLOlnz1nNmWaM=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/8ecd8658-3692-11f0-9555-620b1f10012d.jpg"]'::jsonb,
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
  'PROD-02228',
  'O PARAÍSO ILUSÓRIO - 9',
  'O PARAÍSO ILUSÓRIO - 9',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/LhJ_mIT2egIHvUjj9pZ8FBfy3Oc=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/c2428cc0-d817-11ee-9371-e2a33adec5cd.jpg"]'::jsonb,
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
  'PROD-02229',
  'O PARAÍSO ILUSÓRIO N.10',
  'O PARAÍSO ILUSÓRIO N.10',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/61_3I1FFUouREr5rC8UONMvLSMU=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/7c51cca8-4e7d-11ef-a6a6-6a75532b239b.jpg"]'::jsonb,
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
  'PROD-02230',
  'O PARAÍSO ILUSÓRIO N.7',
  'O PARAÍSO ILUSÓRIO N.7',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/senM31D4xZYqFsd0RYPZDuNcLpk=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/c14d1056-d817-11ee-9371-e2a33adec5cd.jpg"]'::jsonb,
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
  'PROD-02231',
  'O PARAÍSO ILUSÓRIO N.8',
  'O PARAÍSO ILUSÓRIO N.8',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/t_e0h56E-Fen8uDWJQAec7XOsJ4=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/c1d4cdf2-d817-11ee-9371-e2a33adec5cd.jpg"]'::jsonb,
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
  'PROD-02232',
  'O QUE ACONTECERIA SE...  PATO DONALD SE TORNASSE WOLVERINE',
  'O QUE ACONTECERIA SE...  PATO DONALD SE TORNASSE WOLVERINE',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/-fqvy-UILqcQBb-f-lgRaCYBjpk=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/a6360a18-eb29-11ef-9e36-2a856f41baa0.jpg"]'::jsonb,
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
  'PROD-02233',
  'O REINO (GRANDES EVENTOS N.1',
  'O REINO (GRANDES EVENTOS N.1',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/vmyZsZrH-KUozfNtLoK3VRAQkkc=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/58aadd54-0cc8-11ef-88d1-3619a1e0872c.jpg"]'::jsonb,
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
  'PROD-02234',
  'O SENTINELA: LEGADO',
  'O SENTINELA: LEGADO',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/UbBkrUvKvlUSlFxfq81DXG_js-Q=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/d0de78c8-0ea0-11f0-a8a8-aacd3c2773fd.jpg"]'::jsonb,
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
  'PROD-02235',
  'O UNIVERSO DE SANDMAN: GAROTOS DETETIVES MORTOS',
  'O UNIVERSO DE SANDMAN: GAROTOS DETETIVES MORTOS',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/fOP7eGruPaRjof1Q16wfNfT1wnw=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/d9289f9e-3f2f-11f0-87b4-c2502d24ff3f.jpg"]'::jsonb,
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
  'PROD-02236',
  'O VERÃO EM QUE HIKARU MORREU - 02 [REB2]',
  'O VERÃO EM QUE HIKARU MORREU - 02 [REB2]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/xpF-TOUpO2zUh1yUxrbAeEYOYAg=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/4394f0a6-5ea9-11f0-885d-4eae30e658d1.jpg"]'::jsonb,
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
  'PROD-02237',
  'O VERÃO EM QUE HIKARU MORREU - 03 [REB]',
  'O VERÃO EM QUE HIKARU MORREU - 03 [REB]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/NIVPk5cTHvaDlqndoq5NkT6kWrg=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/da1edfda-3f2f-11f0-87b4-c2502d24ff3f.jpg"]'::jsonb,
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
  'PROD-02238',
  'O VERÃO EM QUE HIKARU MORREU - 05 [REB]',
  'O VERÃO EM QUE HIKARU MORREU - 05 [REB]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/j-mPkzQF866_yuKrdvlIZSNIfn8=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/988074da-eb29-11ef-9e36-2a856f41baa0.jpg"]'::jsonb,
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
  'PROD-02239',
  'O VERÃO EM QUE HIKARU MORREU - 06',
  'O VERÃO EM QUE HIKARU MORREU - 06',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/J1wOM0cbx9Nui-9xAYcBm4VcnV8=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/37b56416-7fd1-11f0-b894-2e1dcafaddd0.jpg"]'::jsonb,
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
  'PROD-02240',
  'OFICINA DO ACO N.1',
  'OFICINA DO ACO N.1',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/zT7Bww3iDEbaT7bx2z9ch0IXbeM=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/8bf087e4-4e7d-11ef-b7f8-22eb38681e4f.jpg"]'::jsonb,
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
  'PROD-02241',
  'On/Off: Entre o profissional e o pessoal - 01',
  'On/Off: Entre o profissional e o pessoal - 01',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/PBXCQ4IoPapajkTCfAWhZwUPdDg=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/c5f45aba-642a-11f0-b55e-2a081a9d92fa.jpg"]'::jsonb,
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
  'PROD-02242',
  'ON/OFF: ENTRE O PROFISSIONAL E O PESSOAL - 02',
  'ON/OFF: ENTRE O PROFISSIONAL E O PESSOAL - 02',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/2Vvtcx_F8TW_r5T6TPolzrBpheo=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/e8f51fa8-9031-11f0-9754-9a60b14b6cd5.jpg"]'::jsonb,
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
  'PROD-02243',
  'ONE PIECE (3 EM 1) - 01 [REB5]',
  'ONE PIECE (3 EM 1) - 01 [REB5]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/dN5heQ4P79L5rz1zYwMfENz801w=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/f33c7cb8-9031-11f0-9754-9a60b14b6cd5.jpg"]'::jsonb,
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
  'PROD-02244',
  'ONE PIECE (3 EM 1) - 02 [REB5]',
  'ONE PIECE (3 EM 1) - 02 [REB5]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/ORsBrJooF9IDFeSMve6FYmWhDMg=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/f35222fc-9031-11f0-9754-9a60b14b6cd5.jpg"]'::jsonb,
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
  'PROD-02245',
  'ONE PIECE (3 EM 1) - 03 [REB3]',
  'ONE PIECE (3 EM 1) - 03 [REB3]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/qPy1ZO-O8F-3qfSnigNhcn9H9tk=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/b2324950-ee29-11ef-8f95-26a97ff90d5c.jpg"]'::jsonb,
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
  'PROD-02246',
  'ONE PIECE (3 EM 1) - 03 [REB4]',
  'ONE PIECE (3 EM 1) - 03 [REB4]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/R7HDFYCUx5xLQ_L4oq6rjePEPxU=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/4fe8d16e-8b5f-11f0-b3d9-165df9e621a1.jpg"]'::jsonb,
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
  'PROD-02247',
  'ONE PIECE (3 EM 1) - 04 [REB 2]',
  'ONE PIECE (3 EM 1) - 04 [REB 2]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/9exjVQFNc45ulgAkatOTU7lsONM=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/50125d4a-8b5f-11f0-b3d9-165df9e621a1.jpg"]'::jsonb,
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
  'PROD-02248',
  'ONE PIECE (3 EM 1) - 05 [REB2]',
  'ONE PIECE (3 EM 1) - 05 [REB2]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/avtbNH0IUXxmNpZl9hvyr0IngKc=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/284302fe-a4ac-11f0-8bce-3af03c92463f.jpg"]'::jsonb,
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
  'PROD-02249',
  'ONE PIECE (3 EM 1) - 06 [REB]',
  'ONE PIECE (3 EM 1) - 06 [REB]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/psa80fxqBL_Y9F0w0MZ6A5XvQvA=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/a5a15d82-eb29-11ef-9e36-2a856f41baa0.jpg"]'::jsonb,
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
  'PROD-02250',
  'ONE PIECE (3 EM 1) - 09 [REB2]',
  'ONE PIECE (3 EM 1) - 09 [REB2]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/9swJMnBSSUO-s5_zrNE48seYg-k=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/a1715efc-a7c0-11f0-8792-0ab376ee0ef4.jpg"]'::jsonb,
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