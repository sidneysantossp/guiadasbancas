-- SQL para importar produtos Brancaleone
-- Gerado em: 2025-10-17T18:20:53.612Z
-- Total de produtos: 3363
-- Fonte: brancaleone-products-1760723254011.json

-- 1. Criar distribuidor (se não existir)

-- Distribuidor já criado no batch-001

-- Lote 3 de 68
-- Produtos: 201 até 300



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00101',
  'A SAGA DO FLASH VOL.12',
  'A SAGA DO FLASH VOL.12',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/tiNHOdk9rB6iMJikvFdyFeoprQg=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/ff18f8a4-feb9-11ef-89d0-3a3131782535.jpg"]'::jsonb,
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
  'PROD-00102',
  'A SAGA DO FLASH VOL.13',
  'A SAGA DO FLASH VOL.13',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/u-dT-QIjsftuGfJVfrnFX8zUO5Q=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/f4b5298c-9031-11f0-9754-9a60b14b6cd5.jpg"]'::jsonb,
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
  'PROD-00103',
  'A SAGA DO FLASH VOL.14',
  'A SAGA DO FLASH VOL.14',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/Z0Rg2ez5bIYlbzhCnyC12fgZImY=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/f4d2d2ca-9031-11f0-82c8-4a06203c34dc.jpg"]'::jsonb,
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
  'PROD-00104',
  'A SAGA DO HOMEM-ARANHA N.14',
  'A SAGA DO HOMEM-ARANHA N.14',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/egHx1UGNwRtGyq4Wg-oMs6bL7yQ=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/ffaee0fe-1ca5-11ef-b80c-228c440649c1.jpg"]'::jsonb,
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
  'PROD-00105',
  'A SAGA DO HOMEM-ARANHA VOL.17',
  'A SAGA DO HOMEM-ARANHA VOL.17',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/NHLJg6NCoPTwgv19Gltkz_Kx6vs=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/89b4cb22-7fa9-11ef-b0bc-6e97175de7f7.jpg"]'::jsonb,
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
  'PROD-00106',
  'A SAGA DO HOMEM-ARANHA VOL.18',
  'A SAGA DO HOMEM-ARANHA VOL.18',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/Qm4YE8O8rGwM-yTGozJQltDazzE=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/ab373fd2-eb29-11ef-b1d3-def782e2bf12.jpg"]'::jsonb,
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
  'PROD-00107',
  'A SAGA DO HOMEM-ARANHA VOL.20',
  'A SAGA DO HOMEM-ARANHA VOL.20',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/EBIpHby_dTL6x0Ek46jxspoKHTM=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/cffacba4-eb47-11ef-b2e7-02f306ed4817.jpg"]'::jsonb,
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
  'PROD-00108',
  'A SAGA DO HOMEM-ARANHA VOL.23',
  'A SAGA DO HOMEM-ARANHA VOL.23',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/__aa2mkjUTRqDBwQGSN9-wl8vx8=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/f9778582-9031-11f0-9754-9a60b14b6cd5.jpg"]'::jsonb,
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
  'PROD-00109',
  'A SAGA DO HOMEM-ARANHA VOL.24',
  'A SAGA DO HOMEM-ARANHA VOL.24',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/SO0M6NOrF2jEkdpiOO0P-jNq-zA=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/eeb975e2-0143-11f0-9a82-ca3c9ea74dec.jpg"]'::jsonb,
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
  'PROD-00110',
  'A SAGA DO HOMEM-ARANHA VOL.28/04',
  'A SAGA DO HOMEM-ARANHA VOL.28/04',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/lEqQxqXyGGRIBWREvgQ-DEX_qZs=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/674045c8-5ea9-11f0-bc5c-8a0b5d172c0d.jpg"]'::jsonb,
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
  'PROD-00111',
  'A SAGA DO HOMEM-ARANHA VOL.29/05',
  'A SAGA DO HOMEM-ARANHA VOL.29/05',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/92kv0x66eliVc0zLmFNN-R2RQ6c=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/51cc2f62-8b5f-11f0-819b-cef4535c59b2.jpg"]'::jsonb,
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
  'PROD-00112',
  'A SAGA DO HOMEM-ARANHA VOL.30/06',
  'A SAGA DO HOMEM-ARANHA VOL.30/06',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/gGUDO--giW_mlcKOpgxh3tLTE20=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/2a25c02a-a4ac-11f0-84d7-06a1e9b2bf33.jpg"]'::jsonb,
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
  'PROD-00113',
  'A SAGA DO HULK VOL.01',
  'A SAGA DO HULK VOL.01',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/I9MB7hTLQz2qMahwXF_8feE18VI=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/d0416226-eb47-11ef-82bf-7a9c5276656c.jpg"]'::jsonb,
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
  'PROD-00114',
  'A SAGA DO HULK VOL.03',
  'A SAGA DO HULK VOL.03',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/dRDVn3o33RCeJouv_IcZLcKXjTM=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/8bf9eda4-3692-11f0-a057-ba7311aaaadc.jpg"]'::jsonb,
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
  'PROD-00115',
  'A SAGA DO HULK VOL.04',
  'A SAGA DO HULK VOL.04',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/9Sx_7THIcEv3GPTAqy78Lwa1O6M=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/c7af09ea-642a-11f0-8267-3613efe5cfce.jpg"]'::jsonb,
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
  'PROD-00116',
  'A SAGA DO HULK VOL.05',
  'A SAGA DO HULK VOL.05',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/eDtr3j29dy2RqlCVaGQI4cozCPI=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/5210fd04-8b5f-11f0-b3d9-165df9e621a1.jpg"]'::jsonb,
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
  'PROD-00117',
  'A SAGA DO LANTERNA VERDE VOL. 04',
  'A SAGA DO LANTERNA VERDE VOL. 04',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/Jftn8m-EI1RNDmZ9jP4XYgcBP9I=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/431d3a5e-7fd1-11f0-b894-2e1dcafaddd0.jpg"]'::jsonb,
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
  'PROD-00118',
  'A SAGA DO SUPERMAN VOL.05/29',
  'A SAGA DO SUPERMAN VOL.05/29',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/_T-c4Uzk4pfGIGhGixg7yArRnPg=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/b3579a10-ee29-11ef-a605-7aa50978e4c8.jpg"]'::jsonb,
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
  'PROD-00119',
  'A SAGA DO SUPERMAN VOL.08/32',
  'A SAGA DO SUPERMAN VOL.08/32',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/gLWJ7Vl2vqWHSH9ZLbOBrZBU878=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/f60793ba-9031-11f0-82c8-4a06203c34dc.jpg"]'::jsonb,
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
  'PROD-00120',
  'A SAGA DO SUPERMAN VOL.10/34',
  'A SAGA DO SUPERMAN VOL.10/34',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/8P8fZvMkFU5PuhDMGGHG2-D95cc=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/f645b29e-9031-11f0-82c8-4a06203c34dc.jpg"]'::jsonb,
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
  'PROD-00121',
  'A SAGA DO SUPERMAN VOL.11/35',
  'A SAGA DO SUPERMAN VOL.11/35',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/9iSy9lp9ewiV1YICvCz8Hz57xEI=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/f6de6e4e-9031-11f0-9754-9a60b14b6cd5.jpg"]'::jsonb,
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
  'PROD-00122',
  'A SAGA DO WOLVERINE VOL.01 [REB]',
  'A SAGA DO WOLVERINE VOL.01 [REB]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/PszfUVMxKdmjPlEWPYoXwCaB-Yo=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/2d6039d0-44b4-11f0-aadf-ca2b21e04af3.jpg"]'::jsonb,
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
  'PROD-00123',
  'A SAGA DO WOLVERINE VOL.02',
  'A SAGA DO WOLVERINE VOL.02',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/tOfkI586kQAP6oJ4lhCTB7Nn4dA=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/8d76f01c-4e7d-11ef-9629-4a1bf48aa6ac.jpg"]'::jsonb,
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
  'PROD-00124',
  'A SAGA DO WOLVERINE VOL.05',
  'A SAGA DO WOLVERINE VOL.05',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/VrWpsJUNIiHaUcPF1doFR3DMvY4=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/f6f6d768-9031-11f0-9754-9a60b14b6cd5.jpg"]'::jsonb,
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
  'PROD-00125',
  'A SAGA DO WOLVERINE VOL.06',
  'A SAGA DO WOLVERINE VOL.06',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/6Y__S438lMFn9brRET7DmsIcM6E=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/1538c358-2791-11f0-b7ea-e6389b69ff03.jpg"]'::jsonb,
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
  'PROD-00126',
  'A SAGA DO WOLVERINE VOL.07',
  'A SAGA DO WOLVERINE VOL.07',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/H229KncsDfRahB3mlPfo6DLY-Xk=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/43a15208-7fd1-11f0-b894-2e1dcafaddd0.jpg"]'::jsonb,
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
  'PROD-00127',
  'A SAGA DOS NOVOS TITAS V N.3',
  'A SAGA DOS NOVOS TITAS V N.3',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/9QHsIHngTFcm8IOoH3GuGj7DdTY=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/249167be-d81a-11ee-9cda-5a86bcbeb6e3.jpg"]'::jsonb,
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
  'PROD-00128',
  'A SAGA DOS NOVOS TITAS VOL.04',
  'A SAGA DOS NOVOS TITAS VOL.04',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/TV66ik4vZ89gMhaHlraY-Z2tm64=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/2593ed62-d81a-11ee-a8da-56e6c271e0a3.jpg"]'::jsonb,
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
  'PROD-00129',
  'A SAGA DOS NOVOS TITAS VOL.08',
  'A SAGA DOS NOVOS TITAS VOL.08',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/FZn9OxrR0ki3Glm3R3ZArn6xnOs=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/a9fa7d5a-eb29-11ef-a31a-8ed8743505f0.jpg"]'::jsonb,
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
  'PROD-00130',
  'A SAGA DOS NOVOS TITAS VOL.10',
  'A SAGA DOS NOVOS TITAS VOL.10',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/Tiqpx9_3oR_QpEDrGNrmw6HhM6E=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/cedb38b2-eb47-11ef-80c6-0ee70347c223.jpg"]'::jsonb,
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
  'PROD-00131',
  'A SAGA DOS NOVOS TITAS VOL.5',
  'A SAGA DOS NOVOS TITAS VOL.5',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/BQj7UNGCCpQ61fo_NuPsEJEloT4=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/a038768e-e583-11ee-b66f-62eaabe3d6ba.jpg"]'::jsonb,
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
  'PROD-00132',
  'A SAGA DOS VINGADORES VOL.08',
  'A SAGA DOS VINGADORES VOL.08',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/6G73CHqEcQ0GQvdP3PbRu2wpioE=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/b3aa011a-ee29-11ef-a605-7aa50978e4c8.jpg"]'::jsonb,
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
  'PROD-00133',
  'A SAGA DOS X-MEN VOL.26',
  'A SAGA DOS X-MEN VOL.26',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/izRMyAI0_76A2eFNPaGuxiitvpU=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/898f5d6a-7fa9-11ef-b0bc-6e97175de7f7.jpg"]'::jsonb,
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
  'PROD-00134',
  'A SAGA DOS X-MEN VOL.30',
  'A SAGA DOS X-MEN VOL.30',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/yZmmE3_mcM-LiP8PyLwJtRU7zz0=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/aa65b2dc-eb29-11ef-a31a-8ed8743505f0.jpg"]'::jsonb,
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
  'PROD-00135',
  'A SAGA DOS X-MEN VOL.31',
  'A SAGA DOS X-MEN VOL.31',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/gdJSvHk0KjPtCJrUKRR5GPbECi4=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/cf93175c-eb47-11ef-80c6-0ee70347c223.jpg"]'::jsonb,
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
  'PROD-00136',
  'A SAGA DOS X-MEN VOL.32',
  'A SAGA DOS X-MEN VOL.32',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/ErANd5_h-KMmkFTmECk9b8DgrP4=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/cfafccb2-eb47-11ef-82bf-7a9c5276656c.jpg"]'::jsonb,
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
  'PROD-00137',
  'A SAGA DOS X-MEN VOL.38/02',
  'A SAGA DOS X-MEN VOL.38/02',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/erYRsO6bgiGGBKa2QoMaZ6KsFjQ=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/50fa3da4-8b5f-11f0-b3d9-165df9e621a1.jpg"]'::jsonb,
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
  'PROD-00138',
  'A SAGA DOS X-MEN VOL.39/03',
  'A SAGA DOS X-MEN VOL.39/03',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/sIQ3F8Osv009aV7chchjVaIfmrA=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/931870e2-9d49-11f0-916d-cee03b37ee33.jpg"]'::jsonb,
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
  'PROD-00139',
  'A SENSACIONAL MULHER-HULK (2025) )VOL.01',
  'A SENSACIONAL MULHER-HULK (2025) )VOL.01',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/R5sY8Cg0e8Rccd-IBj3Z6A82654=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/5c2f124a-5ea9-11f0-bc5c-8a0b5d172c0d.jpg"]'::jsonb,
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
  'PROD-00140',
  'A SUBSTITUTA',
  'A SUBSTITUTA',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/86XXUivRag-NTcKcDTbr8JrICqY=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/61c293f8-5ea9-11f0-a034-4eae30e658d1.jpg"]'::jsonb,
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
  'PROD-00141',
  'A VIDA DO WOLVERINE',
  'A VIDA DO WOLVERINE',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/nGrFCRLw6Ikx-S8O_iZdquQxBoQ=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/d09e9036-eb47-11ef-82bf-7a9c5276656c.jpg"]'::jsonb,
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
  'PROD-00142',
  'A VINGANÇA DO CAVALEIRO DA LUA VOL 02',
  'A VINGANÇA DO CAVALEIRO DA LUA VOL 02',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/ytIe2d5Adyhn6hkfCnfsS1389Gg=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/c82df4ee-642a-11f0-b55e-2a081a9d92fa.jpg"]'::jsonb,
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
  'PROD-00143',
  'A VINGANÇA DO CAVALEIRO DA LUA VOL01',
  'A VINGANÇA DO CAVALEIRO DA LUA VOL01',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/d2cFMMILPW6r_ISsvhKqf4v7qA0=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/d079409c-eb47-11ef-82bf-7a9c5276656c.jpg"]'::jsonb,
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
  'PROD-00144',
  'ABSOLUTE BATMAN N.01 [REB2]',
  'ABSOLUTE BATMAN N.01 [REB2]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/NTL786FDfT7LB49RLW8SV2_D74A=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/a4365f98-a7c0-11f0-96ab-2e54fc51120d.jpg"]'::jsonb,
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
  'PROD-00145',
  'ACADEMIA DO ESTRANHO: ENCONTRE O X',
  'ACADEMIA DO ESTRANHO: ENCONTRE O X',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/D48EfG9sFtYgo5_ykB-oMGtehY4=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/7e1f2442-7fa9-11ef-b1d0-12caec0ea15c.jpg"]'::jsonb,
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
  'PROD-00146',
  'ACHO QUE MEU FILHO E GAY N.1',
  'ACHO QUE MEU FILHO E GAY N.1',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/dV8DJXv0SQUFwq8siIgooskIiLk=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/11ddf4bc-f68c-11ee-b5c8-3a7739dfcdd7.jpg"]'::jsonb,
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
  'PROD-00147',
  'ACHO QUE MEU FILHO E GAY N.2',
  'ACHO QUE MEU FILHO E GAY N.2',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/7A4lnUzSNT48M1F-0MkG3SG0_bo=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/5c4abd12-0cc8-11ef-9312-4e89173d1712.jpg"]'::jsonb,
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
  'PROD-00148',
  'ACHO QUE MEU FILHO E GAY N.3',
  'ACHO QUE MEU FILHO E GAY N.3',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/jo9rLTNcfg9lGTJUuxWp_0FI9VM=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/27ee3bac-2ce4-11ef-b724-7e67d1c5424b.jpg"]'::jsonb,
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
  'PROD-00149',
  'ACHO QUE MEU FILHO E GAY N.4',
  'ACHO QUE MEU FILHO E GAY N.4',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/BFA9JrLbYosXS5YXvSZUmeoXwsQ=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/711ab77e-3fd1-11ef-8385-ba8f13f2d55b.jpg"]'::jsonb,
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
  'PROD-00150',
  'ACHO QUE MEU FILHO E GAY N.5',
  'ACHO QUE MEU FILHO E GAY N.5',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/7x_S_Vr80smys8iKxQgV1fMvvQo=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/8b311654-7fa9-11ef-b1d0-12caec0ea15c.jpg"]'::jsonb,
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