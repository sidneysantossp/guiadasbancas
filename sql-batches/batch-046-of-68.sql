-- SQL para importar produtos Brancaleone
-- Gerado em: 2025-10-17T18:20:53.612Z
-- Total de produtos: 3363
-- Fonte: brancaleone-products-1760723254011.json

-- 1. Criar distribuidor (se não existir)

-- Distribuidor já criado no batch-001

-- Lote 46 de 68
-- Produtos: 4501 até 4600



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02251',
  'ONE PIECE (3 EM 1) - 10 [REB2]',
  'ONE PIECE (3 EM 1) - 10 [REB2]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/Ckoba_ALONZUusZQCKLsqmI2G3w=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/a1540cd0-a7c0-11f0-8792-0ab376ee0ef4.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02252',
  'ONE PIECE (3 EM 1) - 10 [REB]',
  'ONE PIECE (3 EM 1) - 10 [REB]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/KYv7siOtuYIJHnbXwKN1zF9n9pw=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/9cd7cca4-1941-11f0-ab25-7e3d31f80894.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02253',
  'ONE PIECE (3 EM 1) - 11 [REB]',
  'ONE PIECE (3 EM 1) - 11 [REB]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/qUKCFTX2vMEZ2n7Z66FBHtTYVww=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/caef522c-f616-11ef-9832-9e7a01352361.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02254',
  'ONE PIECE (3 EM 1) - 12 [REB]',
  'ONE PIECE (3 EM 1) - 12 [REB]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/3h76iy69qcIMuMDGcOUink-97dI=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/cba1b0ac-f616-11ef-941b-9e5e2bda4253.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02255',
  'ONE PIECE (3 EM 1) - 13 [REB]',
  'ONE PIECE (3 EM 1) - 13 [REB]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/NDOGCrgW08HOLUdQYOMMD9gUzPk=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/fe9b85d6-feb9-11ef-b1c2-b22467446ac0.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02256',
  'ONE PIECE (3 EM 1) - 14 [REB]',
  'ONE PIECE (3 EM 1) - 14 [REB]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/bdtqa1hshMmpFfHfwiGtL7ZO-gc=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/fedf87c2-feb9-11ef-8ddf-8eaa2bb036c2.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02257',
  'ONE PIECE (3 EM 1) - 15 [REB]',
  'ONE PIECE (3 EM 1) - 15 [REB]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/_0dG6nKBvWWC0MFrN2MPP7szHzk=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/a1d49f62-a7c0-11f0-96ab-2e54fc51120d.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02258',
  'ONE PIECE (3 EM 1) - 16 [REB]',
  'ONE PIECE (3 EM 1) - 16 [REB]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/8m71wZ4i1Ybp0cDDdqzMR-DN7X0=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/a1f85d08-a7c0-11f0-8792-0ab376ee0ef4.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02259',
  'ONE PIECE (3 EM 1) - 22',
  'ONE PIECE (3 EM 1) - 22',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/FtwhoXF9jzWHUswyQbnCNPu7x5A=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/0559e4c0-98c6-11f0-a1e5-96752bc1e838.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02260',
  'ONE PIECE (3 EM 1) - 28',
  'ONE PIECE (3 EM 1) - 28',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/e2csiDbhD5yBWpPPVNRdLLL6EMo=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/f826bd92-eb4a-11ef-8230-fa812316df6c.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02261',
  'ONE PIECE (3 EM 1) - 29',
  'ONE PIECE (3 EM 1) - 29',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/1VbnfzmbLbbRNAssVJ-K8ZRrrTo=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/f6863df0-eb4a-11ef-8230-fa812316df6c.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02262',
  'ONE PIECE (3 EM 1) - 30',
  'ONE PIECE (3 EM 1) - 30',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/YT6bgFF8YVY_h1IbvORYP36igjI=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/a5cb1faa-eb29-11ef-a4f3-5a40d84dae09.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02263',
  'ONE PIECE (3 EM 1) - 31',
  'ONE PIECE (3 EM 1) - 31',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/h3S7kNOT1tnxzG6bmzbfW0kh9Ok=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/a5fed16a-eb29-11ef-8b75-5ac0f052206d.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02264',
  'ONE PIECE (3 EM 1) - 32',
  'ONE PIECE (3 EM 1) - 32',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/sj3NT2Eg_6yIRK0RAus_qGKStlM=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/cc5d5050-f616-11ef-941b-9e5e2bda4253.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02265',
  'ONE PIECE (3 EM 1) - 33',
  'ONE PIECE (3 EM 1) - 33',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/42oI8imUbj8Od6SUVlX5EIPKiac=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/92ff56ce-08c6-11f0-a62c-dee35fb4301a.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02266',
  'ONE PIECE (3 EM 1) - 34',
  'ONE PIECE (3 EM 1) - 34',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/9sigZvo2kSv359C8RiIYty-4VWQ=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/5a4eb068-2473-11f0-adf6-061a58ec2564.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02267',
  'ONE PIECE (3 EM 1) - 35',
  'ONE PIECE (3 EM 1) - 35',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/4dBUP1DLIj9QKcQAh6aorF_KfHI=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/912a3c70-3692-11f0-b775-ca6651de2295.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02268',
  'ONE PIECE (3 EM 1) - 36',
  'ONE PIECE (3 EM 1) - 36',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/izj_6geyf0xg7DqNhQfbyTwUcUw=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/1f15544e-69af-11f0-a796-ae0a374fc493.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02269',
  'ONE PIECE (3 IN 1 EDITION) N.27',
  'ONE PIECE (3 IN 1 EDITION) N.27',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/R1e-O9H-CW-267dHQPrYCLo5s6A=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/87654720-7fa9-11ef-b1d0-12caec0ea15c.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02270',
  'ONE PIECE - 01 (REB4)',
  'ONE PIECE - 01 (REB4)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/1HJV814S4RUkdi56fc_CXm8Zu7c=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/f928a7aa-feb9-11ef-bc0a-5e7da1f62926.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02271',
  'ONE PIECE - 02 (REB4)',
  'ONE PIECE - 02 (REB4)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/1OFs3isj7lRfDc4fvZ1BPNLYZhc=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/96d83d8c-2461-11ef-a07c-c63aa4de974e.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02272',
  'ONE PIECE - 03 (REB4)',
  'ONE PIECE - 03 (REB4)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/57c0IoEE_FEfY-rJaSKEYTgL_Qc=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/f95bd8a0-feb9-11ef-a189-ea2ec8e8c791.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02273',
  'ONE PIECE - 04 (REB4)',
  'ONE PIECE - 04 (REB4)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/lCFmobOzur7IKSaUxS1OBeygCWk=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/f97edabc-feb9-11ef-89d0-3a3131782535.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02274',
  'ONE PIECE - 05 (REB4)',
  'ONE PIECE - 05 (REB4)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/FZZGrGM8B-LmHbRbjaM59nlmyM4=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/f9ccd712-feb9-11ef-a5f7-064ccc2c3bb9.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02275',
  'ONE PIECE - 06 (REB3)',
  'ONE PIECE - 06 (REB3)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/lcD9mnQutOx1B_o6dt4I-KOgLfc=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/99e6c13a-1941-11f0-892a-e60d4a019210.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02276',
  'ONE PIECE - 07 (REB3)',
  'ONE PIECE - 07 (REB3)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/GwlEQnERhEJlOAhthbbhZA3ZbU0=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/99f76f1c-1941-11f0-85af-b67ae79b02ea.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02277',
  'ONE PIECE - 08 (REB3)',
  'ONE PIECE - 08 (REB3)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/SfPR81RtJ-M4CK1QJgaLc5PJmvM=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/9a076b88-1941-11f0-b10c-622de037868f.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02278',
  'ONE PIECE - 09 (REB3)',
  'ONE PIECE - 09 (REB3)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/SpSmVrEdfeFJWChgoIX2szFrFec=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/9a221532-1941-11f0-aa5f-0aa6513a3731.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02279',
  'ONE PIECE - 10 (REB3)',
  'ONE PIECE - 10 (REB3)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/jwZ_FxPTSYxO0dyeqZtDqdKrR84=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/9a683abc-1941-11f0-aa5f-0aa6513a3731.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02280',
  'ONE PIECE - 106',
  'ONE PIECE - 106',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/ol5d_P44PM4ZofOB7F7gD2sHNuc=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/d63c470c-4daf-11f0-9750-c68fdf865aae.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02281',
  'ONE PIECE - 11 (REB 3)',
  'ONE PIECE - 11 (REB 3)',
  0.00,
  '["https://d1y59j9xdhixp0.cloudfront.net/2dede6cdcecb2ad9d5102618f5d141cd35e28c9a/images/dc6d5f0bf4b929fa80b9.svg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02282',
  'ONE PIECE - 110 [REB]',
  'ONE PIECE - 110 [REB]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/hpRis2HESnRwGTNekCdKcw94C1A=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/5852f0f6-5ea9-11f0-bc5c-8a0b5d172c0d.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02283',
  'ONE PIECE - 12 (REB 3)',
  'ONE PIECE - 12 (REB 3)',
  0.00,
  '["https://d1y59j9xdhixp0.cloudfront.net/2dede6cdcecb2ad9d5102618f5d141cd35e28c9a/images/dc6d5f0bf4b929fa80b9.svg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02284',
  'ONE PIECE - 15 [REB3]',
  'ONE PIECE - 15 [REB3]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/OK_zq7nSvnZt5SN_s7QnuKimpe8=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/497c3a14-8b5f-11f0-b3d9-165df9e621a1.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02285',
  'ONE PIECE - 16 [REB2]',
  'ONE PIECE - 16 [REB2]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/nAQ_EVjRDVkO08cdF_z7-lnyVuU=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/9dce7dba-eb29-11ef-a3b1-5681c2ac1d4b.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02286',
  'ONE PIECE - 16 [REB3]',
  'ONE PIECE - 16 [REB3]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/qeayiimxYDpOuteCEcGLTmp_ZzQ=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/3cb72e2c-7fd1-11f0-b894-2e1dcafaddd0.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02287',
  'ONE PIECE - 17 [REB3]',
  'ONE PIECE - 17 [REB3]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/HZBOqM5oy26ZNg59_GebGPuFueI=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/3cc390c2-7fd1-11f0-a5af-de5e70a27ff7.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02288',
  'ONE PIECE - 18 [REB3]',
  'ONE PIECE - 18 [REB3]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/q7gpfcaqA54IUSCAe9LCeB57Dzg=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/3cfaf558-7fd1-11f0-b894-2e1dcafaddd0.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02289',
  'ONE PIECE - 20 [REB2]',
  'ONE PIECE - 20 [REB2]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/Mhl4aiZffmENafwbmcVpWdey-Zs=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/9e19ea7a-eb29-11ef-8b75-5ac0f052206d.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02290',
  'ONE PIECE - 21 [REB3]',
  'ONE PIECE - 21 [REB3]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/lQObnpk-awZnQf1r3ReNpDAnWsI=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/26ec4e7e-a4ac-11f0-8687-a638114deac1.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02291',
  'ONE PIECE - 22 [REB3]',
  'ONE PIECE - 22 [REB3]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/zQ3gCNb_8M_yt-hVSdSvJ_BBLXs=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/26eba320-a4ac-11f0-8bce-3af03c92463f.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02292',
  'ONE PIECE - 23 [REB]',
  'ONE PIECE - 23 [REB]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/gTehwjCsmGC5eTNZBoMi0hpB_E0=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/a00a2990-a7c0-11f0-8792-0ab376ee0ef4.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02293',
  'ONE PIECE - 24 [REB]',
  'ONE PIECE - 24 [REB]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/lCubAF1mM999aTvpW9ciTyAnzsc=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/498b6e26-8b5f-11f0-b876-cef4535c59b2.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02294',
  'ONE PIECE - 24 [REB]',
  'ONE PIECE - 24 [REB]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/w6LRFv6kaiY-MNXkmj-JV8ysGEs=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/a053b1f0-a7c0-11f0-8792-0ab376ee0ef4.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02295',
  'ONE PIECE - 26 [REB]',
  'ONE PIECE - 26 [REB]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/5E96tKifZmdLaocU1wFgTI6Dmbo=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/e6760e22-eb4a-11ef-8621-0ee70347c223.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02296',
  'ONE PIECE - 27 [REB]',
  'ONE PIECE - 27 [REB]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/CPy7V5827NLX1N2myetBlyCEE3M=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/e6a76ec2-eb4a-11ef-8230-fa812316df6c.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02297',
  'ONE PIECE - 28 [REB]',
  'ONE PIECE - 28 [REB]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/qRgJ7IXYIoHoPQ1A9iXsc8ym15Q=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/e712c65e-eb4a-11ef-8230-fa812316df6c.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02298',
  'ONE PIECE - 29 [REB]',
  'ONE PIECE - 29 [REB]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/UpqAF8A41q1I9NCNnIYegKSJPwk=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/e715a7e8-eb4a-11ef-8621-0ee70347c223.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02299',
  'ONE PIECE - 30 [REB]',
  'ONE PIECE - 30 [REB]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/6vq6ISRRbSadmiaemiOz-WQdKmA=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/e77c746e-eb4a-11ef-8621-0ee70347c223.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02300',
  'ONE PIECE - 31 [REB]',
  'ONE PIECE - 31 [REB]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/YwfpGd4lLbSodywyl6iQj-ls8h4=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/9e346058-eb29-11ef-913d-52f5d450f8a6.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();