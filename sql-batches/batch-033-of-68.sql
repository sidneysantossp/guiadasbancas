-- SQL para importar produtos Brancaleone
-- Gerado em: 2025-10-17T17:52:46.765Z
-- Total de produtos: 3363
-- Fonte: brancaleone-products-1760723254011.json

-- 1. Criar distribuidor (se não existir)

-- Distribuidor já criado no batch-001

-- Lote 33 de 68
-- Produtos: 3201 até 3300



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01601',
  'KOMI NÃO CONSEGUE SE COMUNICAR - 15',
  'KOMI NÃO CONSEGUE SE COMUNICAR - 15',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/bUwKGvl7xLSFZqMfcU12Nefry4c=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/38de2a3a-7fd1-11f0-a5af-de5e70a27ff7.jpg"]'::jsonb,
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
  'PROD-01602',
  'KOMI NÃO CONSEGUE SE COMUNICAR - 18',
  'KOMI NÃO CONSEGUE SE COMUNICAR - 18',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/MwN2k6hYxkxwb8XfOULvjYQiGvQ=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/0c05397a-d818-11ee-a4a8-5a86bcbeb6e3.jpg"]'::jsonb,
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
  'PROD-01603',
  'KOMI NÃO CONSEGUE SE COMUNICAR - 19',
  'KOMI NÃO CONSEGUE SE COMUNICAR - 19',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/eRj15XdV9OcVN1e3pd6aoCMh3p4=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/0c4aef06-d818-11ee-a4a8-5a86bcbeb6e3.jpg"]'::jsonb,
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
  'PROD-01604',
  'KOMI NÃO CONSEGUE SE COMUNICAR - 20',
  'KOMI NÃO CONSEGUE SE COMUNICAR - 20',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/08G8Kz4Ap5XLkKwxueJbRbgsGU4=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/0ccd5752-d818-11ee-bce8-e2e54ed5f9f7.jpg"]'::jsonb,
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
  'PROD-01605',
  'KOMI NÃO CONSEGUE SE COMUNICAR - 21',
  'KOMI NÃO CONSEGUE SE COMUNICAR - 21',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/s_KHQsoA1oCrQ0Pw6f0Z-nFLTDA=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/0d1c5410-d818-11ee-a4a8-5a86bcbeb6e3.jpg"]'::jsonb,
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
  'PROD-01606',
  'KOMI NÃO CONSEGUE SE COMUNICAR - 22',
  'KOMI NÃO CONSEGUE SE COMUNICAR - 22',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/Sr_VlHP1TvMDVQK6FCjaVP4qjkQ=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/0da92066-d818-11ee-a3da-e2697ce33d53.jpg"]'::jsonb,
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
  'PROD-01607',
  'KOMI NÃO CONSEGUE SE COMUNICAR - 23',
  'KOMI NÃO CONSEGUE SE COMUNICAR - 23',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/pjPP0zwL1wT9pQ7GSQPpyvc5wTY=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/0dfeb72e-d818-11ee-86d3-ce469b473a25.jpg"]'::jsonb,
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
  'PROD-01608',
  'KOMI NÃO CONSEGUE SE COMUNICAR - 24',
  'KOMI NÃO CONSEGUE SE COMUNICAR - 24',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/RMjD4PLsN-lxKo6iytYkkLlcY-o=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/2addc41c-ebef-11ee-8810-22f5b7d93b6a.jpg"]'::jsonb,
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
  'PROD-01609',
  'KOMI NÃO CONSEGUE SE COMUNICAR - 25',
  'KOMI NÃO CONSEGUE SE COMUNICAR - 25',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/hSpuPvz9FKTCUMWZQPjROCpQdW8=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/4d6c72de-fb7c-11ee-a932-f249d1132836.jpg"]'::jsonb,
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
  'PROD-01610',
  'KOMI NÃO CONSEGUE SE COMUNICAR - 26',
  'KOMI NÃO CONSEGUE SE COMUNICAR - 26',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/X0EWjIIpVwG-BXuLIljwCBfENCA=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/4a635c16-1705-11ef-a192-b27729de0ea6.jpg"]'::jsonb,
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
  'PROD-01611',
  'KOMI NÃO CONSEGUE SE COMUNICAR - 27',
  'KOMI NÃO CONSEGUE SE COMUNICAR - 27',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/3Y4bgzqVloBeowD6mW6QczgjrHs=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/7d826fd8-4e7d-11ef-b438-b279561b7695.jpg"]'::jsonb,
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
  'PROD-01612',
  'KOMI NÃO CONSEGUE SE COMUNICAR - 28',
  'KOMI NÃO CONSEGUE SE COMUNICAR - 28',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/tvGvyf4C6mRQ9d9aY0xWSlEoArI=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/c775c9ba-63e4-11ef-b3ed-92cab3059871.png"]'::jsonb,
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
  'PROD-01613',
  'KOMI NÃO CONSEGUE SE COMUNICAR - 29',
  'KOMI NÃO CONSEGUE SE COMUNICAR - 29',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/V68MDc5wiALLcUh761ra1vCfIH0=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/816a5f0e-7fa9-11ef-b1d0-12caec0ea15c.jpg"]'::jsonb,
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
  'PROD-01614',
  'KOMI NÃO CONSEGUE SE COMUNICAR - 30',
  'KOMI NÃO CONSEGUE SE COMUNICAR - 30',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/k7hKv5NkpourJ2k2tUXddOOu_A4=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/db5be304-eb4a-11ef-8621-0ee70347c223.jpg"]'::jsonb,
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
  'PROD-01615',
  'KOMI NÃO CONSEGUE SE COMUNICAR - 31',
  'KOMI NÃO CONSEGUE SE COMUNICAR - 31',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/3q6l77KWqlUG2MXhSG2_9PRnzcE=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/db6d51c0-eb4a-11ef-8230-fa812316df6c.jpg"]'::jsonb,
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
  'PROD-01616',
  'KOMI NÃO CONSEGUE SE COMUNICAR - 32',
  'KOMI NÃO CONSEGUE SE COMUNICAR - 32',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/JHA-01i8CtP3Ie8LsTwSLvix900=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/9a3659fc-eb29-11ef-a31a-8ed8743505f0.jpg"]'::jsonb,
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
  'PROD-01617',
  'KOMI NÃO CONSEGUE SE COMUNICAR - 33',
  'KOMI NÃO CONSEGUE SE COMUNICAR - 33',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/ndjaxv7TebkOWFVOMcsNkVeFz5w=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/9a469722-eb29-11ef-89a1-ce85303a26c9.jpg"]'::jsonb,
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
  'PROD-01618',
  'KOMI NÃO CONSEGUE SE COMUNICAR - 34',
  'KOMI NÃO CONSEGUE SE COMUNICAR - 34',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/_HW3Z7COPn2vJ_X3dIVsNAfrPWQ=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/cf187a34-0ea0-11f0-b796-52490362e15f.jpg"]'::jsonb,
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
  'PROD-01619',
  'KOMI NÃO CONSEGUE SE COMUNICAR - 35',
  'KOMI NÃO CONSEGUE SE COMUNICAR - 35',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/VSUkzmLTxwEicnXcbNjowjhvKFk=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/393ddd4a-7fd1-11f0-a5af-de5e70a27ff7.jpg"]'::jsonb,
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
  'PROD-01620',
  'KONOSUBA: ABENÇOADO MUNDO MARAVILHOSO - 20',
  'KONOSUBA: ABENÇOADO MUNDO MARAVILHOSO - 20',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/UOfDTbiE3qG9J1gz2s_I1zb5Phw=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/c7f0acd8-642a-11f0-9174-0aba59c16e94.jpg"]'::jsonb,
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
  'PROD-01621',
  'KONOSUBA: ABENÇOADO MUNDO MARAVILHOSO! - 01',
  'KONOSUBA: ABENÇOADO MUNDO MARAVILHOSO! - 01',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/Gwy_iPC1zKFIbhpKayANpeHpez0=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/8f8dabde-4e7d-11ef-9629-4a1bf48aa6ac.jpg"]'::jsonb,
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
  'PROD-01622',
  'KONOSUBA: ABENÇOADO MUNDO MARAVILHOSO! - 15',
  'KONOSUBA: ABENÇOADO MUNDO MARAVILHOSO! - 15',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/cgLpOlnH6xJJ9m3O6JH6csw8R5I=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/5fcdeb2c-d81a-11ee-ae87-e2e54ed5f9f7.jpg"]'::jsonb,
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
  'PROD-01623',
  'KONOSUBA: ABENÇOADO MUNDO MARAVILHOSO! - 16',
  'KONOSUBA: ABENÇOADO MUNDO MARAVILHOSO! - 16',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/ozwa0UQjgEilXEYtfCzik2E22-c=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/605acb14-d81a-11ee-bd84-e2697ce33d53.jpg"]'::jsonb,
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
  'PROD-01624',
  'KONOSUBA: ABENÇOADO MUNDO MARAVILHOSO! - 17',
  'KONOSUBA: ABENÇOADO MUNDO MARAVILHOSO! - 17',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/8NJwemNjjDOv4dhfQVWD0H8Qajg=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/4be89696-e497-11ee-83ff-7ee42cfe9644.jpg"]'::jsonb,
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
  'PROD-01625',
  'KONOSUBA: ABENÇOADO MUNDO MARAVILHOSO! - 19',
  'KONOSUBA: ABENÇOADO MUNDO MARAVILHOSO! - 19',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/0eck5MyvctXBRhGqMtIcdrZmlZI=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/ac4d4f10-eb29-11ef-8cc5-0ee70347c223.jpg"]'::jsonb,
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
  'PROD-01626',
  'KONOSUBA: ABENÇOADO MUNDO MARAVILHOSO! -18',
  'KONOSUBA: ABENÇOADO MUNDO MARAVILHOSO! -18',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/np-mNVoYn27CfOp7A-IIbvuxWPQ=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/d0b6e8c4-63e4-11ef-b1cf-4e63865ab0a7.png"]'::jsonb,
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
  'PROD-01627',
  'KRAVEN, O CACADOR (MARVEL-VERSE)',
  'KRAVEN, O CACADOR (MARVEL-VERSE)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/tHviBMlhrkIbRrUO3xVAC4lXi8Y=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/db837432-eb4a-11ef-8230-fa812316df6c.jpg"]'::jsonb,
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
  'PROD-01628',
  'KULL, A ERA CLASSICA VOL.01 (OMNIBUS)',
  'KULL, A ERA CLASSICA VOL.01 (OMNIBUS)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/dtt1KyWZd5ZwKgZVtZtD1Vgb9AQ=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/3522f6de-de36-11ee-b2b6-3e63d4f4f6bf.jpg"]'::jsonb,
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
  'PROD-01629',
  'KULL, A ERA CLASSICA VOL.02 (OMNIBUS)',
  'KULL, A ERA CLASSICA VOL.02 (OMNIBUS)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/8FA72lBMGpak0gbN605l4x05ZSs=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/dc4e5c92-eb4a-11ef-8621-0ee70347c223.jpg"]'::jsonb,
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
  'PROD-01630',
  'KUSURIYA NO HITORIGOTO - DIARIOS DE UMA APOTECARIA - 03 [REB',
  'KUSURIYA NO HITORIGOTO - DIARIOS DE UMA APOTECARIA - 03 [REB',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/noiweuBDWwotQwW3-28AluFh6uM=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/25c0455a-a4ac-11f0-8687-a638114deac1.jpg"]'::jsonb,
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
  'PROD-01631',
  'KUSURIYA NO HITORIGOTO - DIARIOS DE UMA APOTECARIA - 04 [REB',
  'KUSURIYA NO HITORIGOTO - DIARIOS DE UMA APOTECARIA - 04 [REB',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/Mye3vXpGnQ5DLnO_X6PCcxL1ebc=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/25c62c90-a4ac-11f0-a599-8e83af06c4a6.jpg"]'::jsonb,
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
  'PROD-01632',
  'KUSURIYA NO HITORIGOTO - DIARIOS DE UMA APOTECARIA - 05 [REB',
  'KUSURIYA NO HITORIGOTO - DIARIOS DE UMA APOTECARIA - 05 [REB',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/9IrAU3Hv-yxtMpHn4WsX0kmxcRM=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/25e91c00-a4ac-11f0-9bb5-ee8f90996b43.jpg"]'::jsonb,
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
  'PROD-01633',
  'KUSURIYA NO HITORIGOTO - DIARIOS DE UMA APOTECARIA - 07 [REB',
  'KUSURIYA NO HITORIGOTO - DIARIOS DE UMA APOTECARIA - 07 [REB',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/_UF6Fg-LiEiMjmBJNRyrEFuPX7U=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/81706494-7fa9-11ef-b0bc-6e97175de7f7.jpg"]'::jsonb,
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
  'PROD-01634',
  'KUSURIYA NO HITORIGOTO - DIARIOS DE UMA APOTECARIA - 15',
  'KUSURIYA NO HITORIGOTO - DIARIOS DE UMA APOTECARIA - 15',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/iM8H4DikZ_yIjj-DrjVP3h4wS8w=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/9ee7beec-a7c0-11f0-96ab-2e54fc51120d.jpg"]'::jsonb,
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
  'PROD-01635',
  'LANTERNA VERDE (2023) N.08',
  'LANTERNA VERDE (2023) N.08',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/wsgkhadpKlAeB-G41YSrtwkLOII=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/81b007ca-7fa9-11ef-b0bc-6e97175de7f7.jpg"]'::jsonb,
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
  'PROD-01636',
  'LANTERNA VERDE (2023) N.09',
  'LANTERNA VERDE (2023) N.09',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/uY1oldsgduyg3EEMNsm-iJ8v2f0=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/aed4e4f2-ee29-11ef-8407-02478a88c6f1.jpg"]'::jsonb,
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
  'PROD-01637',
  'LANTERNA VERDE (2023) N.10',
  'LANTERNA VERDE (2023) N.10',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/eE40pnCktYlwBYGuN23QVff7ZLY=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/af0742f8-ee29-11ef-8f95-26a97ff90d5c.jpg"]'::jsonb,
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
  'PROD-01638',
  'LANTERNA VERDE (2023) N.11',
  'LANTERNA VERDE (2023) N.11',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/2rtMJtEB7LfONUE6ew-JlAUs8gU=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/9b9d1146-eb29-11ef-a31a-8ed8743505f0.jpg"]'::jsonb,
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
  'PROD-01639',
  'LANTERNA VERDE (2023) N.12',
  'LANTERNA VERDE (2023) N.12',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/kPLI-Xp4j6RMZCQO8kAlrJ0etGA=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/9baa3fba-eb29-11ef-ba4b-0ee70347c223.jpg"]'::jsonb,
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
  'PROD-01640',
  'LANTERNA VERDE (2023) N.13',
  'LANTERNA VERDE (2023) N.13',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/ZTyhvAmi_PhKfbOAxbjOHTajlao=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/1c40ad18-f2f9-11ef-aaca-2e8a5a0e18c7.jpg"]'::jsonb,
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
  'PROD-01641',
  'LANTERNA VERDE (2023) N.14',
  'LANTERNA VERDE (2023) N.14',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/eL1n4qfFFSHAyb2XraTjXe3EFf8=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/cf83a688-0ea0-11f0-9022-e6d175225f13.jpg"]'::jsonb,
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
  'PROD-01642',
  'LANTERNA VERDE (2023) N.15',
  'LANTERNA VERDE (2023) N.15',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/odGqUYgnibZL3CYc7tWonJvZYVg=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/55f9c278-2473-11f0-ba8e-c2e6fa9c5cc5.jpg"]'::jsonb,
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
  'PROD-01643',
  'LANTERNA VERDE (2023) N.16',
  'LANTERNA VERDE (2023) N.16',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/ujGuL1A9CrUkjHiI-mWYfQc0nWM=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/2c8a8826-44b4-11f0-90fa-7e281e739724.jpg"]'::jsonb,
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
  'PROD-01644',
  'LANTERNA VERDE (2023) N.17',
  'LANTERNA VERDE (2023) N.17',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/UPQw5SMieVy8ZA81CY9NfzHLzco=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/c616d400-642a-11f0-9174-0aba59c16e94.jpg"]'::jsonb,
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
  'PROD-01645',
  'LANTERNA VERDE (2023) N.18',
  'LANTERNA VERDE (2023) N.18',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/KFD90Mjza9DuRsy2Wwk7Tf7w7N4=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/39adf3d2-7fd1-11f0-a5af-de5e70a27ff7.jpg"]'::jsonb,
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
  'PROD-01646',
  'LANTERNA VERDE (2023) N.19',
  'LANTERNA VERDE (2023) N.19',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/bzfbzNke5dfIYz3Qv7Uf1C-bTjA=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/e9a79142-9031-11f0-9754-9a60b14b6cd5.jpg"]'::jsonb,
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
  'PROD-01647',
  'LANTERNA VERDE (2023) N.2',
  'LANTERNA VERDE (2023) N.2',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/gQBnZsQUU5We3DxXbkSxFv57Gzg=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/9774e5e6-e583-11ee-8165-7ec3420f8e17.jpg"]'::jsonb,
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
  'PROD-01648',
  'LANTERNA VERDE (2023) N.3',
  'LANTERNA VERDE (2023) N.3',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/VRBpXC1-42d7UcZthgVCWbz9a2g=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/09922152-f68c-11ee-9dfe-de35e72c1ed0.jpg"]'::jsonb,
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
  'PROD-01649',
  'LANTERNA VERDE (2023) N.4',
  'LANTERNA VERDE (2023) N.4',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/08yRqvgoaCqf04brVeN7ARH92ok=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/01defb3e-1ca6-11ef-bc32-def7b1441874.jpg"]'::jsonb,
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
  'PROD-01650',
  'LANTERNA VERDE (2023) N.6',
  'LANTERNA VERDE (2023) N.6',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/MifUBedA1aMEOHNHiNhSMwBUdSw=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/7db62b48-4e7d-11ef-b7f8-22eb38681e4f.jpg"]'::jsonb,
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