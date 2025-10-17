-- SQL para importar produtos Brancaleone
-- Gerado em: 2025-10-17T18:20:53.612Z
-- Total de produtos: 3363
-- Fonte: brancaleone-products-1760723254011.json

-- 1. Criar distribuidor (se não existir)

-- Distribuidor já criado no batch-001

-- Lote 56 de 68
-- Produtos: 5501 até 5600



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02751',
  'SPY X FAMILY FANBOOK - EYES ONLY - 01',
  'SPY X FAMILY FANBOOK - EYES ONLY - 01',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/vh18IGCiTLylIfCuZDndzIoti9U=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/184b6aa0-eb4b-11ef-8230-fa812316df6c.jpg"]'::jsonb,
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
  'PROD-02752',
  'SPY X FAMILY N.15',
  'SPY X FAMILY N.15',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/hwDpn4O_OfPdwoDVUgMiAu5T_Wo=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/52a1db6c-8b5f-11f0-819b-cef4535c59b2.jpg"]'::jsonb,
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
  'PROD-02753',
  'SPY X FAMILY: RETRATO DE FAMÍLIA',
  'SPY X FAMILY: RETRATO DE FAMÍLIA',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/bbSlTivCvA8kcGo4w8GOwu9pB7g=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/02c9797a-1ca6-11ef-b80c-228c440649c1.jpg"]'::jsonb,
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
  'PROD-02754',
  'SR. TIRA-TEIMA (LENDAS MARVEL)',
  'SR. TIRA-TEIMA (LENDAS MARVEL)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/PlRGHwx7gQNDgxd1T_16hLyn-UA=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/7d77748e-4e7d-11ef-acbf-3efedc1d37c9.jpg"]'::jsonb,
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
  'PROD-02755',
  'STAR WARS (2021) VOL.04: REINADO ESCARLATE',
  'STAR WARS (2021) VOL.04: REINADO ESCARLATE',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/RFL5z_Rr6p-y0d8qIq34_14dSNo=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/6df7d88e-d81a-11ee-bd84-e2697ce33d53.jpg"]'::jsonb,
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
  'PROD-02756',
  'STAR WARS (2021) VOL.05: O CAMINHO PARA A VITORIA',
  'STAR WARS (2021) VOL.05: O CAMINHO PARA A VITORIA',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/yGhZ88DjAyqYePsnUbrpRh_JaUA=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/bf4bf1a8-d8a0-11ee-b92d-d6162862a756.jpg"]'::jsonb,
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
  'PROD-02757',
  'STAR WARS (2021) VOL.06',
  'STAR WARS (2021) VOL.06',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/Uc6s5QdZWCzXRj-q2jVlGrSmQ2A=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/8905f11e-da7d-11ee-b95c-12792fd81a45.jpg"]'::jsonb,
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
  'PROD-02758',
  'STAR WARS (2021) VOL.07',
  'STAR WARS (2021) VOL.07',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/NXmdnAhlHxZuz9A_cpFkJm55YS0=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/19850b4c-eb4b-11ef-8ed2-eeedfdcff086.jpg"]'::jsonb,
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
  'PROD-02759',
  'STAR WARS (2021) VOL.08',
  'STAR WARS (2021) VOL.08',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/Q0cq1yVV5ryz3zDJ63rr1MboeTI=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/00829c86-feba-11ef-adb8-fac52ef86f93.jpg"]'::jsonb,
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
  'PROD-02760',
  'STAR WARS - AS ERAS DE STAR WARS (OMNIBUS)',
  'STAR WARS - AS ERAS DE STAR WARS (OMNIBUS)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/snlQ9rr1vxf5EPayvHJwv_bQ5e4=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/7374cd44-d81a-11ee-ae87-e2e54ed5f9f7.jpg"]'::jsonb,
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
  'PROD-02761',
  'STAR WARS - CACADORES DE RECOMPENSAS VOL.04',
  'STAR WARS - CACADORES DE RECOMPENSAS VOL.04',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/3EXlQfFx91C7aWbN2HiwLKzNs1g=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/f0b9cc16-0143-11f0-9a82-ca3c9ea74dec.jpg"]'::jsonb,
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
  'PROD-02762',
  'STAR WARS - CACADORES DE RECOMPENSAS VOL.05',
  'STAR WARS - CACADORES DE RECOMPENSAS VOL.05',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/09JJbCEofc-8RO4B5wfas7EUtSA=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/f3d2cf58-d816-11ee-a833-6efcfa6dd7bd.jpg"]'::jsonb,
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
  'PROD-02763',
  'STAR WARS - CACADORES DE RECOMPENSAS VOL.06',
  'STAR WARS - CACADORES DE RECOMPENSAS VOL.06',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/Gnq5CSB_TRmwIHbsJ9VyYizprG0=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/48b9b9ea-fb7c-11ee-9319-1236e160da75.jpg"]'::jsonb,
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
  'PROD-02764',
  'STAR WARS - CACADORES DE RECOMPENSAS VOL.07',
  'STAR WARS - CACADORES DE RECOMPENSAS VOL.07',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/7hp3Tq5nPxeZfje008L35mRAXv4=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/d6bd25d8-eb4a-11ef-8230-fa812316df6c.jpg"]'::jsonb,
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
  'PROD-02765',
  'STAR WARS - CANALHAS, REBELDES E O IMPERIO N.1',
  'STAR WARS - CANALHAS, REBELDES E O IMPERIO N.1',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/yRv8DByhcpVsl4Y1aLsB1BUFmwU=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/02ea38ae-1ca6-11ef-b80c-228c440649c1.jpg"]'::jsonb,
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
  'PROD-02766',
  'STAR WARS - DARTH VADER: PRETO, BRANCO E VERMELHO',
  'STAR WARS - DARTH VADER: PRETO, BRANCO E VERMELHO',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/uhgtuCKN9fGeoHnzL0QwsClx_jQ=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/f69b6662-2930-11ef-93b8-4a187dfd8c76.jpg"]'::jsonb,
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
  'PROD-02767',
  'STAR WARS - DOUTORA APHRA (2021) VOL.04',
  'STAR WARS - DOUTORA APHRA (2021) VOL.04',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/Kz7qKSuEhWuC9vjQTUMJzVvP91Q=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/6d2a383e-d81a-11ee-9df9-5a86bcbeb6e3.jpg"]'::jsonb,
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
  'PROD-02768',
  'STAR WARS - DOUTORA APHRA (2021) VOL.05',
  'STAR WARS - DOUTORA APHRA (2021) VOL.05',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/7YdlQlNUi73HtjEr4aeAJioLrgY=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/6d3d9b4a-d81a-11ee-bd84-e2697ce33d53.jpg"]'::jsonb,
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
  'PROD-02769',
  'STAR WARS - DOUTORA APHRA (2021) VOL.06',
  'STAR WARS - DOUTORA APHRA (2021) VOL.06',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/hwi_nROql5qDKcd4p0qwJBwq7ps=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/4afe6666-1705-11ef-b827-12fd167e2650.jpg"]'::jsonb,
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
  'PROD-02770',
  'STAR WARS - DOUTORA APHRA (2021) VOL.07',
  'STAR WARS - DOUTORA APHRA (2021) VOL.07',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/nuN5nhrCqw55SdOKWBtmGBH0QuQ=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/ac939236-eb29-11ef-a31a-8ed8743505f0.jpg"]'::jsonb,
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
  'PROD-02771',
  'STAR WARS - DROIDS SOMBRIOS N.1',
  'STAR WARS - DROIDS SOMBRIOS N.1',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/d1H_FVKsTWfdG5AqjyA6TRQXc0M=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/d0db1d66-63e4-11ef-89d3-c618b21ee28e.png"]'::jsonb,
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
  'PROD-02772',
  'STAR WARS - ESTRELAS PERDIDAS VOL.01 (STAR WARS MANGA)',
  'STAR WARS - ESTRELAS PERDIDAS VOL.01 (STAR WARS MANGA)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/FYwszXRNm4E5ZiWIYAyqqNE8Kow=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/6eb24bd8-d81a-11ee-ae87-e2e54ed5f9f7.jpg"]'::jsonb,
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
  'PROD-02773',
  'STAR WARS - ESTRELAS PERDIDAS VOL.02 (STAR WARS MANGA)',
  'STAR WARS - ESTRELAS PERDIDAS VOL.02 (STAR WARS MANGA)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/vA09JuS3Q9HbFj6XIzNRmFAddYQ=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/897f7d0e-da7d-11ee-b58c-b67307b9a4e9.jpg"]'::jsonb,
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
  'PROD-02774',
  'STAR WARS - ESTRELAS PERDIDAS VOL.03 (STAR WARS MANGA)',
  'STAR WARS - ESTRELAS PERDIDAS VOL.03 (STAR WARS MANGA)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/YiKWnmFpTXFCU7u9yzCbxuTvh9s=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/6ef6dd70-d81a-11ee-9df9-5a86bcbeb6e3.jpg"]'::jsonb,
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
  'PROD-02775',
  'STAR WARS - HAN SOLO & CHEWBACCA',
  'STAR WARS - HAN SOLO & CHEWBACCA',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/PryZClIXT1dSO7h_qLwfQePSS80=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/78c4fb9c-da7d-11ee-9fe4-12792fd81a45.jpg"]'::jsonb,
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
  'PROD-02776',
  'STAR WARS - HAN SOLO & CHEWBACCA VOL.02',
  'STAR WARS - HAN SOLO & CHEWBACCA VOL.02',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/ZTxVT6Ljdhd5Ou8C_UKd0T4q7JQ=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/f5c6fdf4-d89b-11ee-ad97-ee1b80a1fcb2.jpg"]'::jsonb,
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
  'PROD-02777',
  'STAR WARS - HAN SOLO: CADETE IMPERIAL',
  'STAR WARS - HAN SOLO: CADETE IMPERIAL',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/exmSYUfFxvXKIyPf2cua2XfkWHg=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/4b17ef76-de36-11ee-aae0-ca3362baf0a6.jpg"]'::jsonb,
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
  'PROD-02778',
  'STAR WARS - HIGH REPUBLIC ADVENTURES: TERROR SEM NOME',
  'STAR WARS - HIGH REPUBLIC ADVENTURES: TERROR SEM NOME',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/YbNH1LeItTW0ZnZpC6njEi6Rd00=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/1a3443b4-eb4b-11ef-8ed2-eeedfdcff086.jpg"]'::jsonb,
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
  'PROD-02779',
  'STAR WARS - IMPERIO OCULTO VOL. 01',
  'STAR WARS - IMPERIO OCULTO VOL. 01',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/VCVMRtoTiymt3TRWdWAWAn8mx2k=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/4c644d86-e497-11ee-83ff-7ee42cfe9644.jpg"]'::jsonb,
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
  'PROD-02780',
  'STAR WARS - JEDI FALLEN ORDER: TEMPLO DAS SOMBRAS  N.1',
  'STAR WARS - JEDI FALLEN ORDER: TEMPLO DAS SOMBRAS  N.1',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/kDLb_LhuOqoAIn95EoWquoiW16o=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/4b082502-1705-11ef-aada-fab3bf54036d.jpg"]'::jsonb,
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
  'PROD-02781',
  'STAR WARS - KANAN: O ULTIMO PADAWAN VOL.01',
  'STAR WARS - KANAN: O ULTIMO PADAWAN VOL.01',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/t4amfutNglNoG861hkzuh6Wh2S4=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/19fbb1d4-eb4b-11ef-b0d0-f6341ef53590.jpg"]'::jsonb,
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
  'PROD-02782',
  'STAR WARS - LANDO: TUDO OU NADA',
  'STAR WARS - LANDO: TUDO OU NADA',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/G7X4xRzlZ-iF_jVlE8PtmnPtDNs=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/ad3d7266-dd64-11ee-910a-0646bd7d4214.jpg"]'::jsonb,
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
  'PROD-02783',
  'STAR WARS - LEIA, PRINCESA DE ALDERAAN VOL.01',
  'STAR WARS - LEIA, PRINCESA DE ALDERAAN VOL.01',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/p0RNl-O8mhxKe_YHqT9hP7KEeiI=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/fa99208c-d89b-11ee-a7a9-4a8c2cd86418.jpg"]'::jsonb,
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
  'PROD-02784',
  'STAR WARS - LEIA, PRINCESA DE ALDERAAN VOL.02',
  'STAR WARS - LEIA, PRINCESA DE ALDERAAN VOL.02',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/sylB6mzC88RWvlNXZdIAPyM7HbU=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/fae091d8-d89b-11ee-a97f-26337c3739c7.jpg"]'::jsonb,
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
  'PROD-02785',
  'STAR WARS - O IMPÉRIO (P N.10',
  'STAR WARS - O IMPÉRIO (P N.10',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/EIs6aqbjQaxeFNtfpK6HqrQ01Rg=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/02f47e22-1ca6-11ef-bc32-def7b1441874.jpg"]'::jsonb,
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
  'PROD-02786',
  'STAR WARS - O IMPÉRIO (P N.11',
  'STAR WARS - O IMPÉRIO (P N.11',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/CPUnIVNS5CllYnSICEPvYltd05A=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/983efc10-2461-11ef-81c7-f2a69ad46e56.jpg"]'::jsonb,
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
  'PROD-02787',
  'STAR WARS - O IMPÉRIO (P N.13',
  'STAR WARS - O IMPÉRIO (P N.13',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/ZL3u-wQV9E8e18YOywao_U60V-0=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/d116a778-63e4-11ef-bb5f-feb6e0b40978.png"]'::jsonb,
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
  'PROD-02788',
  'STAR WARS - O IMPÉRIO (P N.14',
  'STAR WARS - O IMPÉRIO (P N.14',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/kqaktYzq7CyEIsP3pfc1RDksNZ8=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/db9dd6ee-7faa-11ef-92e2-6e97175de7f7.jpg"]'::jsonb,
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
  'PROD-02789',
  'STAR WARS - O IMPÉRIO (P N.15',
  'STAR WARS - O IMPÉRIO (P N.15',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/1Zubs_XMPJgTEbu_8zo1NJXPFzk=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/8a7a8998-7fa9-11ef-b1d0-12caec0ea15c.jpg"]'::jsonb,
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
  'PROD-02790',
  'STAR WARS - O IMPÉRIO (P N.16',
  'STAR WARS - O IMPÉRIO (P N.16',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/J6dQ9yQDCZM1Pd4CkEEgsnlEpU8=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/8a93cd9a-7fa9-11ef-b1d0-12caec0ea15c.jpg"]'::jsonb,
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
  'PROD-02791',
  'STAR WARS - O IMPÉRIO (P N.3',
  'STAR WARS - O IMPÉRIO (P N.3',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/zazKL5QGErsUHzWBFf7S6SaP5ac=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/70edb9f0-d81a-11ee-bd84-e2697ce33d53.jpg"]'::jsonb,
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
  'PROD-02792',
  'STAR WARS - O IMPÉRIO (P N.4',
  'STAR WARS - O IMPÉRIO (P N.4',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/1QVBNxOqQeM264zzrdLIq20dDzg=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/71b4fefc-d81a-11ee-9df9-5a86bcbeb6e3.jpg"]'::jsonb,
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
  'PROD-02793',
  'STAR WARS - O IMPÉRIO (P N.7',
  'STAR WARS - O IMPÉRIO (P N.7',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/2Kmcvk4zgCz9FWL2huXffPU4dMY=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/4c054106-e497-11ee-b6a7-e2b250ff01a0.jpg"]'::jsonb,
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
  'PROD-02794',
  'STAR WARS - O IMPÉRIO (P N.8',
  'STAR WARS - O IMPÉRIO (P N.8',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/ayh8UFlt9RQhEw-cNiWxVBnsJZc=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/a4338ea4-e583-11ee-8165-7ec3420f8e17.jpg"]'::jsonb,
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
  'PROD-02795',
  'STAR WARS - O IMPÉRIO (P N.9',
  'STAR WARS - O IMPÉRIO (P N.9',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/WUIXHDXmGlB4apyM716vkg6YHq4=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/0317ae10-1ca6-11ef-bc32-def7b1441874.jpg"]'::jsonb,
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
  'PROD-02796',
  'STAR WARS - O IMPÉRIO VOL. 12',
  'STAR WARS - O IMPÉRIO VOL. 12',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/y_5MmzFXp2MAtnb9KHDytJWAsJE=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/f89c7a50-2930-11ef-93b8-4a187dfd8c76.jpg"]'::jsonb,
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
  'PROD-02797',
  'STAR WARS - O IMPERIO VOL.05',
  'STAR WARS - O IMPERIO VOL.05',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/zsI4RFWzEg6X9i9UZtRBgmj7Hu0=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/7233207a-d81a-11ee-ae87-e2e54ed5f9f7.jpg"]'::jsonb,
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
  'PROD-02798',
  'STAR WARS - O IMPERIO VOL.06',
  'STAR WARS - O IMPERIO VOL.06',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/ZWruJAKVsHytDnazFrzOduVguuU=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/72568196-d81a-11ee-bd84-e2697ce33d53.jpg"]'::jsonb,
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
  'PROD-02799',
  'STAR WARS - O IMPERIO VOL.17',
  'STAR WARS - O IMPERIO VOL.17',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/jJ5x53Vv2ydTiiuHh2EPjiQFDmg=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/8a938b82-7fa9-11ef-b0bc-6e97175de7f7.jpg"]'::jsonb,
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
  'PROD-02800',
  'STAR WARS - O IMPÉRIO VOL.18',
  'STAR WARS - O IMPÉRIO VOL.18',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/9SeaoE9Gm8OhTgOAUqMJnoayz9s=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/8aac3222-7fa9-11ef-b0bc-6e97175de7f7.jpg"]'::jsonb,
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