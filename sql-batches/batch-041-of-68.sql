-- SQL para importar produtos Brancaleone
-- Gerado em: 2025-10-17T18:20:53.612Z
-- Total de produtos: 3363
-- Fonte: brancaleone-products-1760723254011.json

-- 1. Criar distribuidor (se não existir)

-- Distribuidor já criado no batch-001

-- Lote 41 de 68
-- Produtos: 4001 até 4100



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02001',
  'MULHER MARAVILHA / FLASH N.16',
  'MULHER MARAVILHA / FLASH N.16',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/ZoC45LkZie1qglCaZkiDkgVO5xE=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/404f0492-7fd1-11f0-a5af-de5e70a27ff7.jpg"]'::jsonb,
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
  'PROD-02002',
  'MULHER MARAVILHA / FLASH N.17',
  'MULHER MARAVILHA / FLASH N.17',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/xwyh4krWeNg6BSbPBeUQ7GkNvxc=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/f2d17f58-9031-11f0-9754-9a60b14b6cd5.jpg"]'::jsonb,
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
  'PROD-02003',
  'MULHER MARAVILHA / FLASH N.2',
  'MULHER MARAVILHA / FLASH N.2',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/diYHf5dCMQULxhcVsrV16MDj0TE=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/0240b540-1ca6-11ef-bc32-def7b1441874.jpg"]'::jsonb,
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
  'PROD-02004',
  'MULHER MARAVILHA / FLASH N.3',
  'MULHER MARAVILHA / FLASH N.3',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/RssvWCj7EjtoV-y4I47qZiuvI34=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/8ac0ebe8-4e7d-11ef-9e73-0a4d9a837559.jpg"]'::jsonb,
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
  'PROD-02005',
  'MULHER MARAVILHA / FLASH N.4',
  'MULHER MARAVILHA / FLASH N.4',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/ZXxcLILmiT5lVrchkwtrpzocnAE=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/ce97f0b0-63e4-11ef-9e43-faeb4ca196ac.png"]'::jsonb,
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
  'PROD-02006',
  'MULHER MARAVILHA / FLASH N.5',
  'MULHER MARAVILHA / FLASH N.5',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/pz59PWbzT76XMFKSDFlGDvlLUbI=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/870d80ee-7fa9-11ef-b0bc-6e97175de7f7.jpg"]'::jsonb,
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
  'PROD-02007',
  'MULHER MARAVILHA / FLASH N.6',
  'MULHER MARAVILHA / FLASH N.6',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/lOBFlO2FDYjnbk_-g_hgyLpKP5M=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/edc080e0-eb4a-11ef-8230-fa812316df6c.jpg"]'::jsonb,
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
  'PROD-02008',
  'MULHER MARAVILHA / FLASH N.7',
  'MULHER MARAVILHA / FLASH N.7',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/X4ZKnUN2-KmCwZ6iquCnFvjNb-8=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/ee39b564-eb4a-11ef-8230-fa812316df6c.jpg"]'::jsonb,
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
  'PROD-02009',
  'MULHER MARAVILHA / FLASH N.8',
  'MULHER MARAVILHA / FLASH N.8',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/gWGVXiTMwtdO7q8qVHeAcdgla7I=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/a374e09c-eb29-11ef-a3b1-5681c2ac1d4b.jpg"]'::jsonb,
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
  'PROD-02010',
  'MULHER MARAVILHA / FLASH N.9',
  'MULHER MARAVILHA / FLASH N.9',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/oo4QFEVwRQD7mXjJH2028oPLWp0=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/a3852146-eb29-11ef-b1d3-def782e2bf12.jpg"]'::jsonb,
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
  'PROD-02011',
  'MULHER-ARANHA (2021) VOL.03',
  'MULHER-ARANHA (2021) VOL.03',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/QExEjNSbJfFH_hhuM7w4yvQPG4w=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/9b4ede82-d819-11ee-a453-e2697ce33d53.jpg"]'::jsonb,
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
  'PROD-02012',
  'MULHER-ARANHA (2025) VOL.01',
  'MULHER-ARANHA (2025) VOL.01',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/-5_bmFEGUR86OnhubCp8SFlCb4A=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/a3b658e2-eb29-11ef-a3b1-5681c2ac1d4b.jpg"]'::jsonb,
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
  'PROD-02013',
  'MULHER-GATO (2023) VOL.0 N.1',
  'MULHER-GATO (2023) VOL.0 N.1',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/GDBcgwdOBr8Ydrc86tTa1vUzwE4=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/9b70058a-d819-11ee-947a-32937b3ded24.jpg"]'::jsonb,
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
  'PROD-02014',
  'MULHER-GATO (2023) VOL.02',
  'MULHER-GATO (2023) VOL.02',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/rhcAXEyCi0KF-yV0y30FL2eCKAA=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/9bef51a0-d819-11ee-b57d-56e6c271e0a3.jpg"]'::jsonb,
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
  'PROD-02015',
  'MULHER-GATO (2023) VOL.03',
  'MULHER-GATO (2023) VOL.03',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/ZPh00gZty-4YmBUi7YP_26EEihk=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/c1033b0c-0125-11ef-9900-52ec7c1eeb4f.jpg"]'::jsonb,
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
  'PROD-02016',
  'MULHER-GATO (2023) VOL.04',
  'MULHER-GATO (2023) VOL.04',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/yk9P5pFGoLX94JG_GDmfCI6l6bs=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/a3a5de68-eb29-11ef-9e36-2a856f41baa0.jpg"]'::jsonb,
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
  'PROD-02017',
  'MULHER-GATO (2023) VOL.05',
  'MULHER-GATO (2023) VOL.05',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/heAw2mAsQTtWxAOgptjt-Xu9Rk4=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/8fccca68-08c6-11f0-8e32-0e7787c15de6.jpg"]'::jsonb,
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
  'PROD-02018',
  'MULHER-GATO: ANO UM',
  'MULHER-GATO: ANO UM',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/dtrY0UQw1tW9395Ztpwk8dz0a94=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/a1ac1e74-eb29-11ef-913d-52f5d450f8a6.jpg"]'::jsonb,
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
  'PROD-02019',
  'MULHER-GATO: CIDADE SOLITARIA',
  'MULHER-GATO: CIDADE SOLITARIA',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/CCLnbNUB80r6wF6fIhclKI9cW_Y=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/f422ae6c-d89b-11ee-8d35-d6162862a756.jpg"]'::jsonb,
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
  'PROD-02020',
  'MULHER-MARAVILHA POR GEORGE PEREZ VOL. 02 (DC OMNIBUS)',
  'MULHER-MARAVILHA POR GEORGE PEREZ VOL. 02 (DC OMNIBUS)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/aCF4dNLCaQKlQZnXOsDs7tpuu2k=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/1f28b098-69af-11f0-9a47-2e3660e82a7f.jpg"]'::jsonb,
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
  'PROD-02021',
  'MULHER-MARAVILHA/FLASH (2025) N.01',
  'MULHER-MARAVILHA/FLASH (2025) N.01',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/Wr9XyuiVTukbgYe8yI2RTCNDUNs=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/926d5450-9d49-11f0-8116-a621b6c207b0.jpg"]'::jsonb,
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
  'PROD-02022',
  'MULHER-MARAVILHA: EVOLUCAO',
  'MULHER-MARAVILHA: EVOLUCAO',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/4yn3TZI32O8D1lT6AAKKwAYNfn8=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/1a017b9e-d89d-11ee-8891-7e22084f6fbf.jpg"]'::jsonb,
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
  'PROD-02023',
  'MULHER-MARAVILHA: HIKETEIA [REB]',
  'MULHER-MARAVILHA: HIKETEIA [REB]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/X5K0eFlIH5cN756onP6Db4EEgVk=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/c86496de-f616-11ef-9565-f2e31ca8a769.jpg"]'::jsonb,
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
  'PROD-02024',
  'MULHER-MARAVILHA: TERRA UM (DC DE BOLSO)',
  'MULHER-MARAVILHA: TERRA UM (DC DE BOLSO)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/lebHuHLdCz3qrbTN8Unpv43n8xM=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/54bdca6c-2473-11f0-ae86-ee28d381db1d.jpg"]'::jsonb,
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
  'PROD-02025',
  'MUSHOKU TENSEI - 08',
  'MUSHOKU TENSEI - 08',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/v--hvT6GBiPAwnoEHZmGides3FI=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/9ea68378-d819-11ee-83df-e2e54ed5f9f7.jpg"]'::jsonb,
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
  'PROD-02026',
  'MUSHOKU TENSEI - 13',
  'MUSHOKU TENSEI - 13',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/yeAv9U5YVe8z5QawkJLN15gUW4w=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/a5276bfe-d819-11ee-b57d-56e6c271e0a3.jpg"]'::jsonb,
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
  'PROD-02027',
  'MUSHOKU TENSEI - 14',
  'MUSHOKU TENSEI - 14',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/yhDIsnN_EA1tahk73nGKb4ex2QM=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/a575bd40-d819-11ee-a453-e2697ce33d53.jpg"]'::jsonb,
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
  'PROD-02028',
  'MUSHOKU TENSEI - 21',
  'MUSHOKU TENSEI - 21',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/Sko5Sy8ZnH3dPrLC1B8JVYXDRJg=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/9045d188-08c6-11f0-b832-fac9a3e7e647.jpg"]'::jsonb,
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
  'PROD-02029',
  'MUSHOKU TENSEI: UMA SEGU N.17',
  'MUSHOKU TENSEI: UMA SEGU N.17',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/UREgtSBJl50Fs8GiqkpkW2ytHnY=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/a67ef490-d819-11ee-83df-e2e54ed5f9f7.jpg"]'::jsonb,
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
  'PROD-02030',
  'MUSHOKU TENSEI: UMA SEGUNDA CHANCE N.19',
  'MUSHOKU TENSEI: UMA SEGUNDA CHANCE N.19',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/MeE_gT-vNpMqxFBYZiptErlYS9o=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/02613b80-1ca6-11ef-bc32-def7b1441874.jpg"]'::jsonb,
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
  'PROD-02031',
  'MUSHOKU TENSEI: UMA SEGUNDA CHANCE N.20',
  'MUSHOKU TENSEI: UMA SEGUNDA CHANCE N.20',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/5wIzg2eUJxSz5dLIVzoVCHMXbuE=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/87209bfc-7fa9-11ef-b0bc-6e97175de7f7.jpg"]'::jsonb,
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
  'PROD-02032',
  'MUSHOKU TENSEI: UMA SEGUNDA CHANCE VOL. 1 INFANCIA',
  'MUSHOKU TENSEI: UMA SEGUNDA CHANCE VOL. 1 INFANCIA',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/Kl7CHORMk1T6wetgTsjMaDmFDKI=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/1e479208-069a-11ef-8901-2a9a18647563.jpg"]'::jsonb,
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
  'PROD-02033',
  'MUSHOKU TENSEI: UMA SEGUNDA CHANCE VOL. 2 - TUTOR',
  'MUSHOKU TENSEI: UMA SEGUNDA CHANCE VOL. 2 - TUTOR',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/IYfnIoHtLHsdDBPjjEtdSj6cSuI=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/978b4bac-2461-11ef-bf30-ee5794111ad8.jpg"]'::jsonb,
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
  'PROD-02034',
  'MUSHOKU TENSEI: UMA SEGUNDA CHANCE VOL. 4 - VIAJANTE',
  'MUSHOKU TENSEI: UMA SEGUNDA CHANCE VOL. 4 - VIAJANTE',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/3bKnVLz25YMRv4iC3d8sLhZYFFA=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/ee57b9e2-eb4a-11ef-8230-fa812316df6c.jpg"]'::jsonb,
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
  'PROD-02035',
  'MUSHOKU TENSEI: UMA SEGUNDA CHANCE VOL. 5 - REUNIÃO',
  'MUSHOKU TENSEI: UMA SEGUNDA CHANCE VOL. 5 - REUNIÃO',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/suh3bBeJaaTXhKCZ2MvxSZjqW1I=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/ee6e68a4-eb4a-11ef-8230-fa812316df6c.jpg"]'::jsonb,
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
  'PROD-02036',
  'MUSHOKU TENSEI: UMA SEGUNDA CHANCE VOL. 6 - RETORNO',
  'MUSHOKU TENSEI: UMA SEGUNDA CHANCE VOL. 6 - RETORNO',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/EKXzwLQowAueYEtJfbH-fe5KxNs=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/a44d9d92-eb29-11ef-8d7f-eea3b61904a2.jpg"]'::jsonb,
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
  'PROD-02037',
  'MUSHOKU TENSEI: UMA SEGUNDA CHANCE VOL.3 AVENTUREIRO',
  'MUSHOKU TENSEI: UMA SEGUNDA CHANCE VOL.3 AVENTUREIRO',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/grtEy32fLScuoIcv9xxhjlt31Aw=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/cea30fd6-63e4-11ef-97a5-2edb7d2ff874.png"]'::jsonb,
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
  'PROD-02038',
  'MY DRESS-UP DARLING - FANBOOK OFICIAL DO ANIMÊ - ARTBOOK 01',
  'MY DRESS-UP DARLING - FANBOOK OFICIAL DO ANIMÊ - ARTBOOK 01',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/h4batx90nBqhAN7mr-Fl0NIJR8Q=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/4013fbb0-eb4b-11ef-b0d0-f6341ef53590.jpg"]'::jsonb,
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
  'PROD-02039',
  'NAMOR (2023) VOL.01',
  'NAMOR (2023) VOL.01',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/1ZqJdX3ViUTTeLFCyUD1LtrVj7Y=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/d2ef7ad6-d819-11ee-9cda-5a86bcbeb6e3.jpg"]'::jsonb,
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
  'PROD-02040',
  'NAMOR POR JOHN BYRNE (MARVEL OMNIBUS)',
  'NAMOR POR JOHN BYRNE (MARVEL OMNIBUS)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/xnMivpl3dfQgpkkXhxGifCiDQXc=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/fe7d1a4c-feb9-11ef-b0b8-be00b4f9a4bc.jpg"]'::jsonb,
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
  'PROD-02041',
  'NAMORADA DE ALUGUEL - 20',
  'NAMORADA DE ALUGUEL - 20',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/jRjivNAZsIxDP2zos7sdbOLQgFw=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/cf46e3ba-d819-11ee-a8da-56e6c271e0a3.jpg"]'::jsonb,
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
  'PROD-02042',
  'NAMORADA DE ALUGUEL - 21',
  'NAMORADA DE ALUGUEL - 21',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/dQkEJ_4GxROpbYrI6uMtSnl6Vss=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/cf7c36be-d819-11ee-a453-e2697ce33d53.jpg"]'::jsonb,
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
  'PROD-02043',
  'NAMORADA DE ALUGUEL - 22',
  'NAMORADA DE ALUGUEL - 22',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/PSg8YEYE_pArK9swt3xq9sKjWJA=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/cfe1de4c-d819-11ee-a8da-56e6c271e0a3.jpg"]'::jsonb,
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
  'PROD-02044',
  'NAMORADA DE ALUGUEL - 23',
  'NAMORADA DE ALUGUEL - 23',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/gYPf6sxnh4D1nz7Ac5WSfNo48_g=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/d016d6ce-d819-11ee-a82e-32937b3ded24.jpg"]'::jsonb,
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
  'PROD-02045',
  'NAMORADA DE ALUGUEL - 24',
  'NAMORADA DE ALUGUEL - 24',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/8bSODbjrJAeKdqHn8XCvUNwrhrA=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/d07e1c4e-d819-11ee-a8da-56e6c271e0a3.jpg"]'::jsonb,
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
  'PROD-02046',
  'NAMORADA DE ALUGUEL - 25',
  'NAMORADA DE ALUGUEL - 25',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/0BoS9jNF0YiQ1uSmYQpKeHK2lQo=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/d0b5881e-d819-11ee-a453-e2697ce33d53.jpg"]'::jsonb,
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
  'PROD-02047',
  'NAMORADA DE ALUGUEL - 26',
  'NAMORADA DE ALUGUEL - 26',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/Fo9Isu6k0f1Bu9LAJFaV4N_uoVY=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/d11b3aba-d819-11ee-9cda-5a86bcbeb6e3.jpg"]'::jsonb,
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
  'PROD-02048',
  'NAMORADA DE ALUGUEL - 27',
  'NAMORADA DE ALUGUEL - 27',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/csssgEf8bQlLYVV4nT60xMS8C3Q=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/d13e36c8-d819-11ee-a8da-56e6c271e0a3.jpg"]'::jsonb,
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
  'PROD-02049',
  'NAMORADA DE ALUGUEL - 28',
  'NAMORADA DE ALUGUEL - 28',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/0WpgNPj1EBwPkOK-6QnWgn7zDDc=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/d1c39156-d819-11ee-a82e-32937b3ded24.jpg"]'::jsonb,
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
  'PROD-02050',
  'NAMORADA DE ALUGUEL - 31',
  'NAMORADA DE ALUGUEL - 31',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/bRMSv2Nlgu1WfHwCkWDNyz5XuPs=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/d26c369e-d819-11ee-83df-e2e54ed5f9f7.jpg"]'::jsonb,
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