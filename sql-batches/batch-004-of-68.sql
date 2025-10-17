-- SQL para importar produtos Brancaleone
-- Gerado em: 2025-10-17T18:20:53.612Z
-- Total de produtos: 3363
-- Fonte: brancaleone-products-1760723254011.json

-- 1. Criar distribuidor (se não existir)

-- Distribuidor já criado no batch-001

-- Lote 4 de 68
-- Produtos: 301 até 400



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00151',
  'ADEUS, ERI [REB]',
  'ADEUS, ERI [REB]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/LzDz7cLN5ainnD46btySQ5L-mFc=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/06cb4d6c-98c6-11f0-975a-9e31cae1851e.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00152',
  'AFTER GOD - 05',
  'AFTER GOD - 05',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/4haAfJqwuhOb0cwUs9nsBZhLFVA=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/8d4e6e1e-3692-11f0-a555-0ab818bfd0ea.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00153',
  'AFTER GOD - 06',
  'AFTER GOD - 06',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/WChUX8bkzZke6C9VxACCXvmOJDk=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/c85ff0b6-642a-11f0-9174-0aba59c16e94.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00154',
  'AFTER GOD - 2',
  'AFTER GOD - 2',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/oZ5vJyVVQVk2JQhCwq6BCvaO8Q0=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/7c4839c4-7fa9-11ef-b1d0-12caec0ea15c.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00155',
  'AFTER GOD - 3',
  'AFTER GOD - 3',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/J-Bhnjb-kUlyIaBZ78PCqMXUvPg=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/d10affc8-eb47-11ef-b2e7-02f306ed4817.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00156',
  'AFTER GOD - 4',
  'AFTER GOD - 4',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/xz2l5TTpbZIJvSK19H7MPd_Z8Dw=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/8daecc78-eb29-11ef-a4f3-5a40d84dae09.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00157',
  'AFTER GOD N.1',
  'AFTER GOD N.1',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/CvoRIf-hrtCgJ7Zyyr0RaUKbvAk=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/d2d18330-63e4-11ef-8888-36fc18488cf6.png"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00158',
  'AGENTE VENOM (MARVEL ESSENCIAIS)',
  'AGENTE VENOM (MARVEL ESSENCIAIS)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/-Bfn6y6EKHrVqoX85JJjwIrb3iE=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/a0c3658a-eb47-11ef-80c6-0ee70347c223.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00159',
  'ALAMANAQUE DO CASCAO (2021) N.20',
  'ALAMANAQUE DO CASCAO (2021) N.20',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/ACBHG5nwD1Vl9tyIRVy3A91Nv-A=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/d40140e8-119a-11ef-bfb2-36a257064742.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00160',
  'ALAMANAQUE DO CASCAO (2021) N.21',
  'ALAMANAQUE DO CASCAO (2021) N.21',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/R4IHFqNdBPA34ZVj6RmCEgQGzjA=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/91effc24-4e7d-11ef-8b01-66fb588c5617.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00161',
  'ALAN SCOTT: LANTERNA VERDE',
  'ALAN SCOTT: LANTERNA VERDE',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/QZPRaPJUyQR0R3B6Ecg3XXXRBq4=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/9b1b4ff8-eb29-11ef-89a1-ce85303a26c9.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00162',
  'ALIEN VOL.01',
  'ALIEN VOL.01',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/novR5kf6X8wwZnYMxqimRB6ijaU=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/8f99d4a6-eb29-11ef-913d-52f5d450f8a6.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00163',
  'ALIEN VOL.02',
  'ALIEN VOL.02',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/mXfU6vlLmvRKUPdVb0M33NzYqS0=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/8d557092-3692-11f0-8d7f-ba18af294916.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00164',
  'ALMANACAO DA TURMA DA MONICA N.21',
  'ALMANACAO DA TURMA DA MONICA N.21',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/XHhTpVXffJQDSz1IhS6ARc_g7zI=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/86fa249a-7fa9-11ef-b0bc-6e97175de7f7.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00165',
  'ALMANACAO DA TURMA DA MONICA N.22',
  'ALMANACAO DA TURMA DA MONICA N.22',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/bVRosgPzUXRzlPPxV9jU7C0xw8k=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/a3503b8e-eb29-11ef-9e36-2a856f41baa0.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00166',
  'ALMANACAO DA TURMA DA MONICA N.23',
  'ALMANACAO DA TURMA DA MONICA N.23',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/tsxlYMkdkCFEfhadtm9q8rTj0T8=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/8f0551be-08c5-11f0-be53-5e8a9da48498.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00167',
  'ALMANACAO DA TURMA DA MONICA N.24',
  'ALMANACAO DA TURMA DA MONICA N.24',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/BGzQO_Cjcm9K_bvTPLaD0WZjHzU=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/5f7d0740-5ea9-11f0-bc5c-8a0b5d172c0d.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00168',
  'ALMANACAO DA TURMA DA MONICA N.25',
  'ALMANACAO DA TURMA DA MONICA N.25',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/7-mSJsNGak3LwssBRPfWtbqdDOA=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/2a570e96-a4ac-11f0-a599-8e83af06c4a6.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00169',
  'ALMANAQUE DA MAGALI (202 N.19',
  'ALMANAQUE DA MAGALI (202 N.19',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/ZYivJyTEX4OJQIoKQgeprE4VpX4=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/05d404f4-f68c-11ee-85eb-96405b4b1de9.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00170',
  'ALMANAQUE DA MAGALI (202 N.20',
  'ALMANAQUE DA MAGALI (202 N.20',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/VAchQidNZQ20fkBQNvRgG_mUwb0=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/f5b0323c-2930-11ef-8a49-928f61c71625.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00171',
  'ALMANAQUE DA MAGALI (202 N.21',
  'ALMANAQUE DA MAGALI (202 N.21',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/AVvLO8PJuYDtmy-rZKcvGdfyroE=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/c0e2b8ec-63e4-11ef-9409-124bc7643d20.png"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00172',
  'ALMANAQUE DA MAGALI N.22',
  'ALMANAQUE DA MAGALI N.22',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/Dwat7kTFNHCW6ZXiqLn7uZLKveA=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/7d1503e6-7fa9-11ef-b1d0-12caec0ea15c.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00173',
  'ALMANAQUE DA MAGALI N.23',
  'ALMANAQUE DA MAGALI N.23',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/2vgwOT0nhycE6eu7JTwEVkrbHJY=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/8fcd48a4-eb29-11ef-b1d3-def782e2bf12.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00174',
  'ALMANAQUE DA MAGALI N.24',
  'ALMANAQUE DA MAGALI N.24',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/Z4BTdIuONiS-nYS6NQ1TgfKAlVw=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/01046044-f2f9-11ef-84b0-4a557680f2ea.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00175',
  'ALMANAQUE DA MAGALI N.25',
  'ALMANAQUE DA MAGALI N.25',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/VbyD4LZ4hP-OZMTSxIjIN7_rL0o=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/938c7ac8-9d49-11f0-8116-a621b6c207b0.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00176',
  'ALMANAQUE DA MAGALI N.26',
  'ALMANAQUE DA MAGALI N.26',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/1vRgaUPtlrGmH6lGThePe86cV6Q=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/6ca8abcc-5ea9-11f0-a1bd-66accccbd618.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00177',
  'ALMANAQUE DA MAGALI N.27',
  'ALMANAQUE DA MAGALI N.27',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/6vRidpme7PiKxMXACjDYDSiJJqk=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/53a811f2-8b5f-11f0-b3d9-165df9e621a1.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00178',
  'ALMANAQUE DA MONICA (202 N.18',
  'ALMANAQUE DA MONICA (202 N.18',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/J7s8KtDgmMttIxwe2iKhNz9tXFo=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/8503d0a4-d816-11ee-a1d7-e2a33adec5cd.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00179',
  'ALMANAQUE DA MONICA (202 N.19',
  'ALMANAQUE DA MONICA (202 N.19',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/C8hJymBNLN7FsIy7vMib1RrazzA=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/8de2ea46-e583-11ee-b66f-62eaabe3d6ba.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00180',
  'ALMANAQUE DA MONICA (2021) N.20',
  'ALMANAQUE DA MONICA (2021) N.20',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/J37eQepUrba1UBVdtQmkDKbkbAA=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/d42a6f2c-119a-11ef-9c09-e6e3c151f638.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00181',
  'ALMANAQUE DA MONICA (2021) N.21',
  'ALMANAQUE DA MONICA (2021) N.21',
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
  'PROD-00182',
  'ALMANAQUE DA MONICA (2021) N.22',
  'ALMANAQUE DA MONICA (2021) N.22',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/sHG9P3ox6g6aNpVvrg9pZw8kIJc=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/7d24a54e-7fa9-11ef-b0bc-6e97175de7f7.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00183',
  'ALMANAQUE DA MONICA N.23',
  'ALMANAQUE DA MONICA N.23',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/Ua1CMNr9rn1j5OmUO_PM3Ty3HQA=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/a569c048-eb47-11ef-80c6-0ee70347c223.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00184',
  'ALMANAQUE DA MONICA N.24',
  'ALMANAQUE DA MONICA N.24',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/JblfO4PHDXHPs79t08xmGPISDWA=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/900791f8-eb29-11ef-8fb2-6696cc3e9cb3.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00185',
  'ALMANAQUE DA MONICA N.25',
  'ALMANAQUE DA MONICA N.25',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/v741GDfZSbcGQ_bSTCUFE7MussY=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/f01ef8f8-0143-11f0-9a82-ca3c9ea74dec.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00186',
  'ALMANAQUE DA MONICA N.26',
  'ALMANAQUE DA MONICA N.26',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/9v1ATQpWQME1a1ZGd1t_mW0fqiM=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/d6e753a6-3f2f-11f0-a17d-1ac4d5553c9e.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00187',
  'ALMANAQUE DA MONICA N.27',
  'ALMANAQUE DA MONICA N.27',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/0pE4dCrVazJOD1sUwoDb8EeKuSk=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/206be31c-69af-11f0-ae5d-0ebdcf797c5e.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00188',
  'ALMANAQUE DA MONICA N.28',
  'ALMANAQUE DA MONICA N.28',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/yiI0FgP8IrtdCH8JMAgd0Am90V4=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/1fcf2422-a4ac-11f0-8b51-cad07a812184.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00189',
  'ALMANAQUE DA TINA (2022) N.5',
  'ALMANAQUE DA TINA (2022) N.5',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/HGq1EC7Y68q51M1NQscEArOJYXo=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/c1208cbc-63e4-11ef-aad4-727f596e106b.png"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00190',
  'ALMANAQUE DA TINA (2022) N.6',
  'ALMANAQUE DA TINA (2022) N.6',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/LPtAIzTIirgmuk-3i6wQcW4ODF0=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/035ff6be-f2f9-11ef-a845-b2c26c8c0dcc.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00191',
  'ALMANAQUE DA TINA (2022) N.7',
  'ALMANAQUE DA TINA (2022) N.7',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/ahGklsLKVJhth4TmiB0Ueca9104=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/53c9f86c-8b5f-11f0-b3d9-165df9e621a1.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00192',
  'ALMANAQUE DA TURMA DA MONICA PARA COLORIR N.04',
  'ALMANAQUE DA TURMA DA MONICA PARA COLORIR N.04',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/qCHAv2-fhB1Kn4udYRSClage1Jk=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/2b3bc806-a4ac-11f0-8687-a638114deac1.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00193',
  'ALMANAQUE DA TURMA DA MONICA PARA COLORIR N.1',
  'ALMANAQUE DA TURMA DA MONICA PARA COLORIR N.1',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/pG0BuwL-ysRF7Kudiab2vYR_NKs=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/81fdeedc-4dac-11f0-869e-c68fdf865aae.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00194',
  'ALMANAQUE DA TURMA DA MÔNICA PARA COLORIR N.2',
  'ALMANAQUE DA TURMA DA MÔNICA PARA COLORIR N.2',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/W4e45o7R-9RARONaUYYSkH79gbM=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/1fb2dade-69af-11f0-a796-ae0a374fc493.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00195',
  'ALMANAQUE DE HISTÓRIAS CURTAS DA TURMA DA MÔNICA N.10',
  'ALMANAQUE DE HISTÓRIAS CURTAS DA TURMA DA MÔNICA N.10',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/4AnzPc5-eMa0K_Az2BOvh0faQBY=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/8d329a10-e583-11ee-9d7c-f2cdc5a9e7d5.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00196',
  'ALMANAQUE DE HISTORIAS CURTAS DA TURMA DA MONICA N.11',
  'ALMANAQUE DE HISTORIAS CURTAS DA TURMA DA MONICA N.11',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/gF-uBqKzTM5X2yuadlGWIgZWaxE=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/d42ac17a-119a-11ef-a951-1a13f4f3a32a.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00197',
  'ALMANAQUE DE HISTÓRIAS CURTAS DA TURMA DA MÔNICA N.12',
  'ALMANAQUE DE HISTÓRIAS CURTAS DA TURMA DA MÔNICA N.12',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/XzNaLVy3hBYMmDmj3RijexxHDz8=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/745970f0-4e7d-11ef-8f2a-626adc132bdd.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00198',
  'ALMANAQUE DE HISTÓRIAS CURTAS DA TURMA DA MÔNICA N.13',
  'ALMANAQUE DE HISTÓRIAS CURTAS DA TURMA DA MÔNICA N.13',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/RBUxF4pjb3BmSI-YYdpDzL7OuJM=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/7cf2cdb2-7fa9-11ef-b1d0-12caec0ea15c.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00199',
  'ALMANAQUE DE HISTÓRIAS CURTAS DA TURMA DA MONICA N.14',
  'ALMANAQUE DE HISTÓRIAS CURTAS DA TURMA DA MONICA N.14',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/yWn6qyrH5jnBTaGdcbzVgCIX7Ok=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/a4235c26-eb47-11ef-80c6-0ee70347c223.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00200',
  'ALMANAQUE DE HISTORIAS CURTAS DA TURMA DA MONICA N.15',
  'ALMANAQUE DE HISTORIAS CURTAS DA TURMA DA MONICA N.15',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/Wtut_SgsHzcuflNA8Ep5WpgvMBA=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/8fa795e6-eb29-11ef-a31a-8ed8743505f0.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();