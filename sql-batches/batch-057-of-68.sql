-- SQL para importar produtos Brancaleone
-- Gerado em: 2025-10-17T17:52:46.765Z
-- Total de produtos: 3363
-- Fonte: brancaleone-products-1760723254011.json

-- 1. Criar distribuidor (se não existir)

-- Distribuidor já criado no batch-001

-- Lote 57 de 68
-- Produtos: 5601 até 5700



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02801',
  'STAR WARS - O IMPÉRIO VOL.19',
  'STAR WARS - O IMPÉRIO VOL.19',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/7-vP5TArkuwFpjMx7OWW8zT4ZAk=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/19a97a86-eb4b-11ef-b0d0-f6341ef53590.jpg"]'::jsonb,
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
  'PROD-02802',
  'STAR WARS - O IMPÉRIO VOL.20',
  'STAR WARS - O IMPÉRIO VOL.20',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/o__ZJR7Ll_hTOJ07CKjYC4oD08Q=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/19b3034e-eb4b-11ef-8230-fa812316df6c.jpg"]'::jsonb,
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
  'PROD-02803',
  'STAR WARS - O IMPÉRIO VOL.21',
  'STAR WARS - O IMPÉRIO VOL.21',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/q5kl-VHpSQI3jKjyehxi787LTJE=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/19da70d2-eb4b-11ef-b0d0-f6341ef53590.jpg"]'::jsonb,
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
  'PROD-02804',
  'STAR WARS - O IMPÉRIO VOL.22',
  'STAR WARS - O IMPÉRIO VOL.22',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/8gnDxuLDK_x4QaPQszD87rfW5-0=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/acc229c0-eb29-11ef-89a1-ce85303a26c9.jpg"]'::jsonb,
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
  'PROD-02805',
  'STAR WARS - O IMPÉRIO VOL.23',
  'STAR WARS - O IMPÉRIO VOL.23',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/nXTP5CA1Fn93PsvrLX_TXcDyQ1Y=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/acbed392-eb29-11ef-9e36-2a856f41baa0.jpg"]'::jsonb,
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
  'PROD-02806',
  'STAR WARS - O IMPÉRIO VOL.24',
  'STAR WARS - O IMPÉRIO VOL.24',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/7BzAj_Zh7j7RMUbJs8r52JueRVc=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/ef11080c-0143-11f0-9602-e6e8567c501d.jpg"]'::jsonb,
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
  'PROD-02807',
  'STAR WARS - REBELDES VOL.01 (DE 03) (STAR WARS MANGA)',
  'STAR WARS - REBELDES VOL.01 (DE 03) (STAR WARS MANGA)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/dUzJxgnt6SaN-Hf_SQXHnPYNgOs=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/755b6bd6-d81a-11ee-bd84-e2697ce33d53.jpg"]'::jsonb,
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
  'PROD-02808',
  'STAR WARS - REBELDES VOL.02 (DE 03) (STAR WARS MANGA)',
  'STAR WARS - REBELDES VOL.02 (DE 03) (STAR WARS MANGA)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/AiWnBIZzygwKBQ_UX2d93dCxK34=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/75ee24b2-d81a-11ee-bd84-e2697ce33d53.jpg"]'::jsonb,
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
  'PROD-02809',
  'STAR WARS - REBELDES VOL.03 (DE 03) (STAR WARS MANGA)',
  'STAR WARS - REBELDES VOL.03 (DE 03) (STAR WARS MANGA)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/BX8rJ4wv0ymbGOdNJDkCuYGSpk8=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/762dbd5c-d81a-11ee-ae87-e2e54ed5f9f7.jpg"]'::jsonb,
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
  'PROD-02810',
  'STAR WARS - SANA STARROS',
  'STAR WARS - SANA STARROS',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/ADjvWOE35dO4CdKv2qPIMxRO4Ls=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/238d26b4-d81a-11ee-83df-e2e54ed5f9f7.jpg"]'::jsonb,
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
  'PROD-02811',
  'STAR WARS - THE HIGH REP N.1',
  'STAR WARS - THE HIGH REP N.1',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/leCXemfLYIevpdxSwpbjNhjLCrI=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/72d837fe-d81a-11ee-ae87-e2e54ed5f9f7.jpg"]'::jsonb,
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
  'PROD-02812',
  'STAR WARS - THE HIGH REPUBLIC (2023) VOL.01',
  'STAR WARS - THE HIGH REPUBLIC (2023) VOL.01',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/0hba6fXqeH1eta5V8ayheGTygIc=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/74f0e1ee-d81a-11ee-bd84-e2697ce33d53.jpg"]'::jsonb,
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
  'PROD-02813',
  'STAR WARS - THE HIGH REPUBLIC (2023) VOL.02',
  'STAR WARS - THE HIGH REPUBLIC (2023) VOL.02',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/7LT7SQ7xzqYXlJ9p7EC2SY_Jzjk=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/8a1e0da2-da7d-11ee-b58c-b67307b9a4e9.jpg"]'::jsonb,
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
  'PROD-02814',
  'STAR WARS - THE HIGH REPUBLIC ADVENTURES VOL. 01',
  'STAR WARS - THE HIGH REPUBLIC ADVENTURES VOL. 01',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/Wez96BblJ0DUzQVQK0IqKN0UlgQ=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/278f2586-2ce4-11ef-a9d6-52a12b2a7219.jpg"]'::jsonb,
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
  'PROD-02815',
  'STAR WARS - THE HIGH REPUBLIC: O LIMITE DO EQUILIBRIO VOL.03',
  'STAR WARS - THE HIGH REPUBLIC: O LIMITE DO EQUILIBRIO VOL.03',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/WEPZikCtc6GychUh5zxGCyouPFM=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/ac9bf930-eb29-11ef-b7b8-460343881edd.jpg"]'::jsonb,
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
  'PROD-02816',
  'STAR WARS - THE MANDALORIAN (2023) VOL.02',
  'STAR WARS - THE MANDALORIAN (2023) VOL.02',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/BIZdTXZEFDGtjCapA2JMz6DrT_M=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/ee647bdc-d818-11ee-9467-e2e54ed5f9f7.jpg"]'::jsonb,
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
  'PROD-02817',
  'STAR WARS - THE MANDALORIAN (MANGA) VOL.01',
  'STAR WARS - THE MANDALORIAN (MANGA) VOL.01',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/hwdNglj1qm81gTcDyGI4FR5S3yQ=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/ee07c7f2-d818-11ee-947a-32937b3ded24.jpg"]'::jsonb,
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
  'PROD-02818',
  'STAR WARS - THE MANDALORIAN: A SEGUNDA TEMPORADA',
  'STAR WARS - THE MANDALORIAN: A SEGUNDA TEMPORADA',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/_7jtqO-Aj89HdxvuM0U5kWeaqYE=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/70e0787c-d819-11ee-89ed-e2697ce33d53.jpg"]'::jsonb,
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
  'PROD-02819',
  'STAR WARS - THRAWN: ALIANCAS',
  'STAR WARS - THRAWN: ALIANCAS',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/ADF6eT80oy88sc_iOFTiBxuo6ic=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/cefa6b5e-f616-11ef-a478-c21ec36c6f62.jpg"]'::jsonb,
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
  'PROD-02820',
  'STAR WARS - TIE FIGHTER N.1',
  'STAR WARS - TIE FIGHTER N.1',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/M2Z68snYrdMoBvsQkqwJ9J4im-I=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/d1149064-63e4-11ef-9b86-aec3f1ed24b8.png"]'::jsonb,
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
  'PROD-02821',
  'STAR WARS - YODA N.2',
  'STAR WARS - YODA N.2',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/fZKwLhVlozoNDU1uga_Q-pBspZM=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/d2321c3c-63e4-11ef-ae80-a27a78b28783.png"]'::jsonb,
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
  'PROD-02822',
  'STAR WARS POR KIERON GILLEN E GREG PAK (OMNIBUS)',
  'STAR WARS POR KIERON GILLEN E GREG PAK (OMNIBUS)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/-bLPL3zUxWlrihnV8xUjHqR7M2g=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/8c703694-3692-11f0-a057-ba7311aaaadc.jpg"]'::jsonb,
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
  'PROD-02823',
  'STAR WARS:  A ERA CLASSICA VOL.01 (OMNIBUS)',
  'STAR WARS:  A ERA CLASSICA VOL.01 (OMNIBUS)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/-QlAvfIP959pP-sUB8j8FMAatdU=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/4cf60abe-e497-11ee-b6a7-e2b250ff01a0.jpg"]'::jsonb,
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
  'PROD-02824',
  'STAR WARS: DARTH VADER   N.5',
  'STAR WARS: DARTH VADER   N.5',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/6w9ZY4Bq-W9a8iZUSR7VFp95XMg=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/441693b4-d817-11ee-b124-5a86bcbeb6e3.jpg"]'::jsonb,
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
  'PROD-02825',
  'STAR WARS: DARTH VADER   N.6',
  'STAR WARS: DARTH VADER   N.6',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/9sMORniWTadKNBfiOZDIjcXiZHQ=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/8825abae-f111-11ee-994b-2acd64fd8df5.jpg"]'::jsonb,
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
  'PROD-02826',
  'STAR WARS: DARTH VADER (2021) VOL.04 - REINADO ESCARLATE',
  'STAR WARS: DARTH VADER (2021) VOL.04 - REINADO ESCARLATE',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/eGVedNAeqsJnjP-4z7qGW-D-tZM=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/43a2392e-d817-11ee-a7e4-ce469b473a25.jpg"]'::jsonb,
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
  'PROD-02827',
  'STAR WARS: DARTH VADER (2021) VOL.07',
  'STAR WARS: DARTH VADER (2021) VOL.07',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/6v-qITFNtDPggmQpwj5wONn4bTo=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/d7d1323e-eb4a-11ef-8621-0ee70347c223.jpg"]'::jsonb,
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
  'PROD-02828',
  'STAR WARS: DARTH VADER (2021) VOL.08',
  'STAR WARS: DARTH VADER (2021) VOL.08',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/sVT9auyQXDbuTu26hOB12kQHoYY=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/96c15952-1941-11f0-9755-4e41bd18146f.jpg"]'::jsonb,
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
  'PROD-02829',
  'STAR WARS: DROIDS SOMBRIOS - D-SQUAD',
  'STAR WARS: DROIDS SOMBRIOS - D-SQUAD',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/UZN642eT4nYWgoXYwNQCAZEiX20=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/d92f387e-eb4a-11ef-8230-fa812316df6c.jpg"]'::jsonb,
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
  'PROD-02830',
  'STAR WARS: HIGH REPUBLIC - SOMBRAS DA LUZ ESTELAR',
  'STAR WARS: HIGH REPUBLIC - SOMBRAS DA LUZ ESTELAR',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/wWkat63u7FDxwLC2XuhlrPDeI5Y=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/cee30cc0-f616-11ef-b6dd-2607ec7077ba.jpg"]'::jsonb,
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
  'PROD-02831',
  'STAR WARS: INQUISIDORES',
  'STAR WARS: INQUISIDORES',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/GB__hd6kG3PyYlx-OoxK04oXRok=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/444693bc-7fd1-11f0-b894-2e1dcafaddd0.jpg"]'::jsonb,
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
  'PROD-02832',
  'STAR WARS: JANGO FETT',
  'STAR WARS: JANGO FETT',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/Hi-23hNGnLAl7ehrRAoxOwyWS6c=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/9e672894-1941-11f0-9755-4e41bd18146f.jpg"]'::jsonb,
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
  'PROD-02833',
  'STAR WARS: MACE WINDU',
  'STAR WARS: MACE WINDU',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/nGEzXX89XbSQrUli_-b4tGO1J0k=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/ad69512a-ee29-11ef-a2c1-c2c6f823c995.jpg"]'::jsonb,
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
  'PROD-02834',
  'STAR WARS: VISIONS',
  'STAR WARS: VISIONS',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/WLa7_7jf4sSyCdsv0fsE2f53CWM=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/21ea999a-48b7-11f0-955a-6e14298b474f.jpg"]'::jsonb,
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
  'PROD-02835',
  'STARDUST (EDICAO DE LUXO) N.1',
  'STARDUST (EDICAO DE LUXO) N.1',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/NlGc1QCU8DcHbnYO-s32q7KYmAE=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/c5e55cdc-63e4-11ef-8b09-aec3f1ed24b8.png"]'::jsonb,
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
  'PROD-02836',
  'STARGIRL POR GEOFF JOHNS (DC VINTAGE)',
  'STARGIRL POR GEOFF JOHNS (DC VINTAGE)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/C6lDq7iEJ6MzyyC_8TmzWIHhT6c=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/ab7b8044-dd64-11ee-9e0c-221fb33d9142.jpg"]'::jsonb,
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
  'PROD-02837',
  'STARGIRL: AS CRIANCAS PE N.1',
  'STARGIRL: AS CRIANCAS PE N.1',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/X_b1_tS_FsCoprIIz5ZQ1ASFcjU=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/53d42462-d81a-11ee-ae87-e2e54ed5f9f7.jpg"]'::jsonb,
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
  'PROD-02838',
  'STARMAN: EDICAO DE LUXO N.6',
  'STARMAN: EDICAO DE LUXO N.6',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/L_2hqZmXcEUNp_FRBkpvKcyWMxE=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/8f451f2c-4e7d-11ef-ad60-86ce4d9bc0e0.jpg"]'::jsonb,
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
  'PROD-02839',
  'STARMAN: EDICAO DE LUXO VOL.02 [REB]',
  'STARMAN: EDICAO DE LUXO VOL.02 [REB]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/Lrax9xkJ4tfrxOMyjVSNlQSTeWA=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/2477c6aa-6f3c-11f0-ac4b-2a24a967b96c.jpg"]'::jsonb,
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
  'PROD-02840',
  'STARMAN: EDICAO DE LUXO VOL.1 (REB)',
  'STARMAN: EDICAO DE LUXO VOL.1 (REB)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/qGu3s4UNgYLh7qZlUxW9GKcm1VY=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/2db89440-44b4-11f0-aadf-ca2b21e04af3.jpg"]'::jsonb,
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
  'PROD-02841',
  'STARTERPACK  BOX 1LIV + 50 ENV + LATA STITCH 2025 (2)',
  'STARTERPACK  BOX 1LIV + 50 ENV + LATA STITCH 2025 (2)',
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
  'PROD-02842',
  'STARTERPACK KIT 1LIV+ 6 ENV NFL FOOTBALL AM. US 2024/25',
  'STARTERPACK KIT 1LIV+ 6 ENV NFL FOOTBALL AM. US 2024/25',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/6U9ht5dpo4NQWDGlfhQ-iAYcFV0=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/b9717e76-f616-11ef-9850-2607ec7077ba.jpg"]'::jsonb,
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
  'PROD-02843',
  'STARTERPACK KIT 1LIV+ 8 ENV C COMP. PAW PATROL - MY 1ST',
  'STARTERPACK KIT 1LIV+ 8 ENV C COMP. PAW PATROL - MY 1ST',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/tAelf32nokuk_3ILmfIUoXx84tE=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/d1bdd786-f616-11ef-afc5-62a059094c64.jpg"]'::jsonb,
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
  'PROD-02844',
  'STARTERPACK KIT 4 ENV. + 4 CARD ED. LIM + BINDER + LIV GUIA',
  'STARTERPACK KIT 4 ENV. + 4 CARD ED. LIM + BINDER + LIV GUIA',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/iEhd42a1V2vo0b15NOUdPZZ1PPE=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/d36ee656-f616-11ef-aca5-de7ac4d61988.jpg"]'::jsonb,
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
  'PROD-02845',
  'STARTERPACK KIT 4 ENV. + 4 CARD ED. LIM + BINDER + LIV GUIA',
  'STARTERPACK KIT 4 ENV. + 4 CARD ED. LIM + BINDER + LIV GUIA',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/LTZjCkTZLjGiy-QP-ArBBRQ1tg4=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/b644bd9e-f616-11ef-a478-c21ec36c6f62.jpg"]'::jsonb,
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
  'PROD-02846',
  'STARTERPACK KIT BOX 1LIV C.D PRATA + 30 ENV CB 2024',
  'STARTERPACK KIT BOX 1LIV C.D PRATA + 30 ENV CB 2024',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/vgTWt6jcWxw8XeD3SEVDMqdcHV4=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/d3177ca4-f616-11ef-941d-de9e7c6e4a26.jpg"]'::jsonb,
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
  'PROD-02847',
  'STARTERPACK KIT BOX 1LIV CD + 30 ENV COPA AMERICA 2024',
  'STARTERPACK KIT BOX 1LIV CD + 30 ENV COPA AMERICA 2024',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/huA_Q6J5d1WyfBXZijbUbqF0Q4s=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/85ef6136-f111-11ee-87d9-ba040f914551.jpg"]'::jsonb,
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
  'PROD-02848',
  'STARTERPACK KIT BOX 1LIV CD PRA  + 30 ENV COPA LIBERTA 2024',
  'STARTERPACK KIT BOX 1LIV CD PRA  + 30 ENV COPA LIBERTA 2024',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/3XF4Ms5Bg2CSGI-Bbeg6EsDnUrI=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/b7222e40-f616-11ef-b0f5-5ac998efac6d.jpg"]'::jsonb,
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
  'PROD-02849',
  'STARTERPACK KIT BOX 1LIV CD PRATA + 30 ENV COPA AMERICA 2024',
  'STARTERPACK KIT BOX 1LIV CD PRATA + 30 ENV COPA AMERICA 2024',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/WC6Fnu2BsdHHqrr21_nLtHHomd0=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/86089d22-f111-11ee-bad0-1a42677a3e8d.jpg"]'::jsonb,
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
  'PROD-02850',
  'STRANGER THINGS E DUNGEONS & DRAGONS',
  'STRANGER THINGS E DUNGEONS & DRAGONS',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/MImMGwpA9s05oXs1Yb8pQh_oSV8=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/ac36b75a-eb29-11ef-9927-fa812316df6c.jpg"]'::jsonb,
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