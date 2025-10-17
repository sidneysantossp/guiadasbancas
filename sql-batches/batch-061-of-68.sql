-- SQL para importar produtos Brancaleone
-- Gerado em: 2025-10-17T18:20:53.612Z
-- Total de produtos: 3363
-- Fonte: brancaleone-products-1760723254011.json

-- 1. Criar distribuidor (se não existir)

-- Distribuidor já criado no batch-001

-- Lote 61 de 68
-- Produtos: 6001 até 6100



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-03001',
  'THE WALKING DEAD VOL 09',
  'THE WALKING DEAD VOL 09',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/e3MaIJifiAWCFuHlsGQdtPj4ShA=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/23ca68d6-069a-11ef-be5a-c64e4ff3ecc9.jpg"]'::jsonb,
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
  'PROD-03002',
  'THE WALKING DEAD VOL 10',
  'THE WALKING DEAD VOL 10',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/B1srGK7Y_Wtl5vnwhCxPwZ79Xqc=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/c515c890-0125-11ef-9d9d-e2f1d4f1a152.jpg"]'::jsonb,
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
  'PROD-03003',
  'THE WALKING DEAD VOL 11',
  'THE WALKING DEAD VOL 11',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/P8Ra2nh182-z5rt1uKhiHFalMDU=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/03528c1a-1ca6-11ef-b80c-228c440649c1.jpg"]'::jsonb,
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
  'PROD-03004',
  'THE WALKING DEAD VOL 13',
  'THE WALKING DEAD VOL 13',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/GEBvous-aibnvUeCsus43AKkru0=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/26cde9b6-2ce4-11ef-a9d6-52a12b2a7219.jpg"]'::jsonb,
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
  'PROD-03005',
  'THE WALKING DEAD VOL 14',
  'THE WALKING DEAD VOL 14',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/aJ6U_MBu8xM_0-0mADKkAktCAYY=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/d6098820-eb4a-11ef-8230-fa812316df6c.jpg"]'::jsonb,
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
  'PROD-03006',
  'THE WALKING DEAD VOL 15',
  'THE WALKING DEAD VOL 15',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/HB6YqQ7tPPbGAVOLWlJncJZdq1M=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/91af4788-4e7d-11ef-84e5-52cebc2dd4d3.jpg"]'::jsonb,
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
  'PROD-03007',
  'THE WALKING DEAD VOL.04',
  'THE WALKING DEAD VOL.04',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/nnJovnghNCM8y8s9Fmeqr7AeakA=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/0d2c2734-d81b-11ee-98f1-c6f956d4b586.jpg"]'::jsonb,
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
  'PROD-03008',
  'THE WALKING DEAD VOL.16',
  'THE WALKING DEAD VOL.16',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/pHCAWZ3upIYIl2krlWT2l-GSBtI=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/91ba02ea-4e7d-11ef-9e33-da9904c52884.jpg"]'::jsonb,
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
  'PROD-03009',
  'THE WALKING DEAD VOL.17',
  'THE WALKING DEAD VOL.17',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/OBEOAE7knTfMRukzgpI02T-qUyo=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/8be1191e-7fa9-11ef-b0bc-6e97175de7f7.jpg"]'::jsonb,
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
  'PROD-03010',
  'THE WALKING DEAD VOL.18',
  'THE WALKING DEAD VOL.18',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/XXRvWMzIMudNY7G2K5Su5JAV6K4=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/8beec8f2-7fa9-11ef-b1d0-12caec0ea15c.jpg"]'::jsonb,
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
  'PROD-03011',
  'THE WALKING DEAD VOL.19',
  'THE WALKING DEAD VOL.19',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/JqzyWjcGdS_Lgxsr90SxoHjB8gg=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/8c06f3f0-7fa9-11ef-b1d0-12caec0ea15c.jpg"]'::jsonb,
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
  'PROD-03012',
  'THE WALKING DEAD VOL.21',
  'THE WALKING DEAD VOL.21',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/tEenxq0TYVM9EkY1QWraVZaCFtQ=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/d61cde16-eb4a-11ef-a198-2a5f63e8aebc.jpg"]'::jsonb,
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
  'PROD-03013',
  'THE WALKING DEAD VOL.22',
  'THE WALKING DEAD VOL.22',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/gImlzjfspiaHQ3_b1njSfJD1o5w=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/d65f02f0-eb4a-11ef-8230-fa812316df6c.jpg"]'::jsonb,
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
  'PROD-03014',
  'THE WALKING DEAD VOL.23',
  'THE WALKING DEAD VOL.23',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/LVIgNZazcKbwiH7uHR3fqpej_6w=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/b2dd19c8-eb29-11ef-a3b1-5681c2ac1d4b.jpg"]'::jsonb,
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
  'PROD-03015',
  'THE WALKING DEAD VOL.30',
  'THE WALKING DEAD VOL.30',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/M87xFFYpQnvgIRRyRBs7Sp9XqcY=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/01a02b92-feba-11ef-bc0a-5e7da1f62926.jpg"]'::jsonb,
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
  'PROD-03016',
  'THE WALKING DEAD VOL.31',
  'THE WALKING DEAD VOL.31',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/ZW2nNETehvtf2fuHFp4qb_aQRwU=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/d18854ec-0ea0-11f0-ba82-ae00d88ec213.jpg"]'::jsonb,
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
  'PROD-03017',
  'THE WALKING DEAD VOL.32',
  'THE WALKING DEAD VOL.32',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/g7m0np9yL6S5brLQqKnjVQAQG2s=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/d1a6df7a-0ea0-11f0-8b42-eedf42219d7c.jpg"]'::jsonb,
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
  'PROD-03018',
  'THE WALKING DEAD: O NEGAN CHEGOU E OUTRAS HISTORIAS',
  'THE WALKING DEAD: O NEGAN CHEGOU E OUTRAS HISTORIAS',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/p0Jy4tIlkee2Z4vVxe5X3nArbEU=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/e3d2d8e8-d819-11ee-a82e-32937b3ded24.jpg"]'::jsonb,
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
  'PROD-03019',
  'THOR E LOKI: IRMAOS DE SANGUE (MARVEL VINTAGE)',
  'THOR E LOKI: IRMAOS DE SANGUE (MARVEL VINTAGE)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/DZ2OVvgXOwKK5nRnEP-onx11N80=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/ca15b4ac-d8a0-11ee-b8d0-26337c3739c7.jpg"]'::jsonb,
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
  'PROD-03020',
  'THOR: FILHO DE ASGARD VOL.01',
  'THOR: FILHO DE ASGARD VOL.01',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/9IinYCxUnfaAGEhREbc1on_IRb0=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/ef36a1d4-0143-11f0-9a82-ca3c9ea74dec.jpg"]'::jsonb,
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
  'PROD-03021',
  'THOR: O DEUS DO TROVAO RENASCE',
  'THOR: O DEUS DO TROVAO RENASCE',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/KdI53h12Q-QhqvRSL232wiY1_WU=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/aeefb28a-eb29-11ef-89a1-ce85303a26c9.jpg"]'::jsonb,
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
  'PROD-03022',
  'THOR: VIKINGS',
  'THOR: VIKINGS',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/_Y6WiznYP4qvam4O3CAnVsQrMIU=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/8b281784-7fa9-11ef-b0bc-6e97175de7f7.jpg"]'::jsonb,
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
  'PROD-03023',
  'THUNDER 3 - 3',
  'THUNDER 3 - 3',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/h_gMCYJynIIArUUlENKzvpDMG6I=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/1acbe764-eb4b-11ef-8621-0ee70347c223.jpg"]'::jsonb,
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
  'PROD-03024',
  'THUNDER 3 - 4',
  'THUNDER 3 - 4',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/c21lqbCyqLef3yYPVPqZiNwzzCw=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/aebe8a2a-eb29-11ef-a31a-8ed8743505f0.jpg"]'::jsonb,
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
  'PROD-03025',
  'THUNDER 3 - 5',
  'THUNDER 3 - 5',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/B8-K6xLerJEE_D30Ck57IsVDtXo=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/cf6ad20e-f616-11ef-a478-c21ec36c6f62.jpg"]'::jsonb,
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
  'PROD-03026',
  'THUNDER 3 - 6',
  'THUNDER 3 - 6',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/f-gITBtrrCrdFpc1dEVuTIi4vac=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/9e7c8ae0-1941-11f0-a707-ceedc1648097.jpg"]'::jsonb,
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
  'PROD-03027',
  'THUNDER 3 - 7',
  'THUNDER 3 - 7',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/1NOSiUlBRf2b2Zi_fJs-KbBtz48=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/c8104160-642a-11f0-9174-0aba59c16e94.jpg"]'::jsonb,
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
  'PROD-03028',
  'THUNDER 3 N.1',
  'THUNDER 3 N.1',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/d19Zey0Olxa81P7tv5GcNDOBoHw=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/902c897a-4e7d-11ef-b6e1-6e3d178325c8.jpg"]'::jsonb,
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
  'PROD-03029',
  'THUNDER 3 N.2',
  'THUNDER 3 N.2',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/5MIxZSxBQCMiGDcQvyZOsTYx6LI=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/8ad6cd0c-7fa9-11ef-b0bc-6e97175de7f7.jpg"]'::jsonb,
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
  'PROD-03030',
  'THUNDERBOLTS (2024) VOL. 01',
  'THUNDERBOLTS (2024) VOL. 01',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/9tNvv_m7OiDPxgoq-CvGv-XiYfY=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/47563228-1705-11ef-9457-c2bd50076807.jpg"]'::jsonb,
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
  'PROD-03031',
  'THUNDERBOLTS POR WARREN ELLIS E MIKE DEODATO JR.',
  'THUNDERBOLTS POR WARREN ELLIS E MIKE DEODATO JR.',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/HI4VyvDMrAJ4vETP7B8i50tDTCY=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/448941c6-7fd1-11f0-b894-2e1dcafaddd0.jpg"]'::jsonb,
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
  'PROD-03032',
  'TIM DRAKE: ROBIN N.2',
  'TIM DRAKE: ROBIN N.2',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/OZ7wMZk1Lt6lX8VkzBn5XNVDiJE=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/05a01acc-eb4b-11ef-8230-fa812316df6c.jpg"]'::jsonb,
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
  'PROD-03033',
  'TIM DRAKE: ROBIN VOL. 01',
  'TIM DRAKE: ROBIN VOL. 01',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/wW8IFZbFvFsRJKzvOo-AxCNiG9o=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/0ccf6a68-d81a-11ee-83df-e2e54ed5f9f7.jpg"]'::jsonb,
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
  'PROD-03034',
  'TINA E OS CAÇADORES DE ENIGMA N.2',
  'TINA E OS CAÇADORES DE ENIGMA N.2',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/fi5niK0o7yAyTwmv1uswJ5G2fsI=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/449d0292-7fd1-11f0-a5af-de5e70a27ff7.jpg"]'::jsonb,
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
  'PROD-03035',
  'TINA E OS CAÇADORES DE ENIGMAS N.1',
  'TINA E OS CAÇADORES DE ENIGMAS N.1',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/t3XXL5SEd6ZCnv0CrgwqxnU55BU=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/6a0465aa-5ea9-11f0-be82-febfa26cb361.jpg"]'::jsonb,
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
  'PROD-03036',
  'TINA E OS CAÇADORES DE ENIGMAS N.3',
  'TINA E OS CAÇADORES DE ENIGMAS N.3',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/XLlpUl9O3WHVvXvYI_GovNKNKpU=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/52f9737c-8b5f-11f0-ab6e-7e1ab2cbb1e5.jpg"]'::jsonb,
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
  'PROD-03037',
  'TINA: RESPEITO (GRAPHIC MSP VOL. 24) (REB)',
  'TINA: RESPEITO (GRAPHIC MSP VOL. 24) (REB)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/sRZqhmFVZ2xgvd2gxrEWa98bFh0=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/42abbea8-de36-11ee-b2b6-3e63d4f4f6bf.jpg"]'::jsonb,
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
  'PROD-03038',
  'TIO PATINHAS E A MOEDINHA DO INFINITO - BLIND PACK',
  'TIO PATINHAS E A MOEDINHA DO INFINITO - BLIND PACK',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/PG0gc48hZIL0mNTG7yQOSTAutOc=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/1b5b779e-eb4b-11ef-9da2-4af6893572b2.jpg"]'::jsonb,
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
  'PROD-03039',
  'TIO PATINHAS E A MOEDINHA DO INFINITO - CAPA DURA',
  'TIO PATINHAS E A MOEDINHA DO INFINITO - CAPA DURA',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/6iRZn2eS0iTRYL7SAh8aWOO37hc=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/a73f4eb0-eb29-11ef-a4f3-5a40d84dae09.jpg"]'::jsonb,
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
  'PROD-03040',
  'TIO PATINHAS E A ULTIMA AVENTURA (GRAPHIC DISNEY)',
  'TIO PATINHAS E A ULTIMA AVENTURA (GRAPHIC DISNEY)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/J7YeEdFe_OhAPxiWy2ZudPap3OM=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/de38281a-3f2f-11f0-a17d-1ac4d5553c9e.jpg"]'::jsonb,
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
  'PROD-03041',
  'TIO PATINHAS: O NAVIO DE OURO (COLECAO CARL BARKS)',
  'TIO PATINHAS: O NAVIO DE OURO (COLECAO CARL BARKS)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/Wv7a9JCKpL5PMR9T10fmEo-3COY=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/08250ab4-f68c-11ee-af0e-526bf2366cde.jpg"]'::jsonb,
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
  'PROD-03042',
  'TIRAS CLÁSSICAS DA TURMA DA MONICA N.1',
  'TIRAS CLÁSSICAS DA TURMA DA MONICA N.1',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/sx5-HRy7mq5SSdm3RA6YXFVZBCw=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/2b4515fa-a4ac-11f0-8b51-cad07a812184.jpg"]'::jsonb,
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
  'PROD-03043',
  'TITAS (2023) VOL. 01',
  'TITAS (2023) VOL. 01',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/Wez96BblJ0DUzQVQK0IqKN0UlgQ=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/278f2586-2ce4-11ef-a9d6-52a12b2a7219.jpg"]'::jsonb,
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
  'PROD-03044',
  'TITAS (2023) VOL.03',
  'TITAS (2023) VOL.03',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/K_BrBT4TygqKfSHj_OrYnBa9FPM=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/d5ae485a-3f2f-11f0-a17d-1ac4d5553c9e.jpg"]'::jsonb,
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
  'PROD-03045',
  'TITAS: VIAGEM PELO MUNDO DAS FERAS',
  'TITAS: VIAGEM PELO MUNDO DAS FERAS',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/RO_uBzPspzjKfkEozyzTGNJbQ9M=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/b9fa5804-f616-11ef-9a8d-7ac96e6ce187.jpg"]'::jsonb,
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
  'PROD-03046',
  'TOKYO BABYLON - 02',
  'TOKYO BABYLON - 02',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/N9wCV4NpKyxo9TDHMM6QwYSNr7Y=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/fede2116-9031-11f0-82c8-4a06203c34dc.jpg"]'::jsonb,
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
  'PROD-03047',
  'TOKYO BABYLON - 1',
  'TOKYO BABYLON - 1',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/MuP-l7NiOVdtW719t66acB1XcPg=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/af065760-eb29-11ef-b1d3-def782e2bf12.jpg"]'::jsonb,
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
  'PROD-03048',
  'TOKYO GHOUL - 06 [REB3]',
  'TOKYO GHOUL - 06 [REB3]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/X06ZspHoQnxb_EE6CZ0W6ND9fNs=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/dd6a1d3c-eb4a-11ef-8621-0ee70347c223.jpg"]'::jsonb,
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
  'PROD-03049',
  'TOKYO GHOUL - 07 [REB3]',
  'TOKYO GHOUL - 07 [REB3]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/VVVNrJzc9X0O0CRQnJg3KhuOKMg=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/dd867950-eb4a-11ef-8230-fa812316df6c.jpg"]'::jsonb,
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
  'PROD-03050',
  'TOKYO GHOUL - 08 [REB3]',
  'TOKYO GHOUL - 08 [REB3]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/qQn6YLwqZ1229_JpI0gKijiIaYU=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/dd8bdc6a-eb4a-11ef-8621-0ee70347c223.jpg"]'::jsonb,
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