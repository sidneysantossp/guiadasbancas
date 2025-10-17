-- SQL para importar produtos Brancaleone
-- Gerado em: 2025-10-17T17:52:46.765Z
-- Total de produtos: 3363
-- Fonte: brancaleone-products-1760723254011.json

-- 1. Criar distribuidor (se não existir)

-- Distribuidor já criado no batch-001

-- Lote 50 de 68
-- Produtos: 4901 até 5000



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02451',
  'PLUTO: EDICAO DE LUXO - 4',
  'PLUTO: EDICAO DE LUXO - 4',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/L4GG4c8f3wMTQhQ6sVCCZBp3dcY=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/ee3b2d68-0143-11f0-9602-e6e8567c501d.jpg"]'::jsonb,
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
  'PROD-02452',
  'PLUTO: EDICAO DE LUXO - 5',
  'PLUTO: EDICAO DE LUXO - 5',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/wmJAP1cLTBaVsAFG3hLw8D5mnG0=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/de748bca-3f2f-11f0-87b4-c2502d24ff3f.jpg"]'::jsonb,
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
  'PROD-02453',
  'PODER ABSOLUTO VOL.01',
  'PODER ABSOLUTO VOL.01',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/MAOdK4orfKfuqdbVJdGswjrPNuY=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/de74c482-3f2f-11f0-a17d-1ac4d5553c9e.jpg"]'::jsonb,
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
  'PROD-02454',
  'PODER ABSOLUTO VOL.03',
  'PODER ABSOLUTO VOL.03',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/q_4X5RJwIp1F9OKx-9h_nlBseXA=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/41593538-7fd1-11f0-a5af-de5e70a27ff7.jpg"]'::jsonb,
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
  'PROD-02455',
  'PODER ABSOLUTO VOL.04',
  'PODER ABSOLUTO VOL.04',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/6j0mG2WosQeTzEWW845C8OXx0ds=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/f4147ba4-9031-11f0-82c8-4a06203c34dc.jpg"]'::jsonb,
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
  'PROD-02456',
  'PODER ABSOLUTO: FORÇA TAREFA VII',
  'PODER ABSOLUTO: FORÇA TAREFA VII',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/V1eBzAOSaApjDrphqs-MMOMXDj0=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/cb0c8f5e-4daf-11f0-9750-c68fdf865aae.jpg"]'::jsonb,
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
  'PROD-02457',
  'PODER ABSOLUTO: MARCO ZERO',
  'PODER ABSOLUTO: MARCO ZERO',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/3y12Z2uEB6JiMdzYVkpev1L-qXk=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/5ad9952a-2473-11f0-b413-de5b603f9a23.jpg"]'::jsonb,
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
  'PROD-02458',
  'PODEROSA (2023) VOL.02',
  'PODEROSA (2023) VOL.02',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/4eQVaFCb48YwTYx0fPfA2ITKFos=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/ee316b02-0143-11f0-9a82-ca3c9ea74dec.jpg"]'::jsonb,
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
  'PROD-02459',
  'PODEROSA N.1',
  'PODEROSA N.1',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/hjKTvVdJeMQ8uBnvNZmvymN2sEI=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/261e4b6e-2ce4-11ef-b053-7e401dc39d73.jpg"]'::jsonb,
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
  'PROD-02460',
  'POKÉMON  X & Y - 02',
  'POKÉMON  X & Y - 02',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/wePty6Gb_yPWZdX0urLP4R1AoR4=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/05f2ea30-98c6-11f0-975a-9e31cae1851e.jpg"]'::jsonb,
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
  'PROD-02461',
  'POKÉMON  X & Y - 1',
  'POKÉMON  X & Y - 1',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/xAtz9PZomkhdmOJcYC0Zr5SxZII=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/625f73b2-5ea9-11f0-be82-febfa26cb361.jpg"]'::jsonb,
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
  'PROD-02462',
  'POKEMON BLACK & WHITE 2 - 01',
  'POKEMON BLACK & WHITE 2 - 01',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/LWfWZdKHB81boyTzstqWkRN94Dg=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/fc0886d4-eb4a-11ef-8230-fa812316df6c.jpg"]'::jsonb,
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
  'PROD-02463',
  'POKEMON BLACK 2 & WHITE 2 - 02',
  'POKEMON BLACK 2 & WHITE 2 - 02',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/zcfqimgQnfHJlisOCMb8Z10t3N4=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/a7723c08-eb29-11ef-a3b1-5681c2ac1d4b.jpg"]'::jsonb,
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
  'PROD-02464',
  'POKEMON BLACK 2 & WHITE 2 - 03',
  'POKEMON BLACK 2 & WHITE 2 - 03',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/skoZsTau9Q5a9nl480KwD7nhTG4=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/ae8acdae-ee29-11ef-bae9-4ad799f2e8c9.jpg"]'::jsonb,
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
  'PROD-02465',
  'POKÉMON DIAMOND AND PEARL - 04 [REB]',
  'POKÉMON DIAMOND AND PEARL - 04 [REB]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/MxnpAtMd46x4_MROwud0VVT4s9o=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/feecc504-eb4a-11ef-8230-fa812316df6c.jpg"]'::jsonb,
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
  'PROD-02466',
  'POKÉMON DIAMOND AND PEARL - 05 [REB]',
  'POKÉMON DIAMOND AND PEARL - 05 [REB]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/5WeGYj6jnO85FHS8kfeZbw9dGrA=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/a793681a-eb29-11ef-913d-52f5d450f8a6.jpg"]'::jsonb,
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
  'PROD-02467',
  'POKÉMON DIAMOND AND PEARL - 06 [REB]',
  'POKÉMON DIAMOND AND PEARL - 06 [REB]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/cTYExkGk_p8f2nWOnksZZvgOzos=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/a79ff5da-eb29-11ef-9e36-2a856f41baa0.jpg"]'::jsonb,
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
  'PROD-02468',
  'POKÉMON DIAMOND AND PEARL - 07 [REB]',
  'POKÉMON DIAMOND AND PEARL - 07 [REB]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/nwLW3IhPMQoORDD05i2RWeXVLZE=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/a7b27a84-eb29-11ef-a3b1-5681c2ac1d4b.jpg"]'::jsonb,
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
  'PROD-02469',
  'POKÉMON DIAMOND AND PEARL - 08 [REB]',
  'POKÉMON DIAMOND AND PEARL - 08 [REB]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/rT-9rGv_yg8q75qEP6QhCGWbOsQ=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/a7cb6fe4-eb29-11ef-913d-52f5d450f8a6.jpg"]'::jsonb,
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
  'PROD-02470',
  'POKÉMON EMERALD - 01 [REB]',
  'POKÉMON EMERALD - 01 [REB]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/8arHDT2YioN726Y1xJO_AhakUuQ=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/a7effd3c-eb29-11ef-8b75-5ac0f052206d.jpg"]'::jsonb,
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
  'PROD-02471',
  'POKÉMON EMERALD - 02 [REB]',
  'POKÉMON EMERALD - 02 [REB]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/S7ZiY552KDLAnQKJxtbCX-cQX8Q=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/feffff8e-eb4a-11ef-8230-fa812316df6c.jpg"]'::jsonb,
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
  'PROD-02472',
  'POKÉMON EMERALD - 03 [REB]',
  'POKÉMON EMERALD - 03 [REB]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/PUabndl7_izRIDvnCv5FcjZFexQ=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/ce6e8d28-f616-11ef-a478-c21ec36c6f62.jpg"]'::jsonb,
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
  'PROD-02473',
  'POKÉMON GOLD AND SILVER - 07 [REB]',
  'POKÉMON GOLD AND SILVER - 07 [REB]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/U-3iKgsFvj9Wql5pe7HrqN53p30=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/e8bf461c-eb4a-11ef-8230-fa812316df6c.jpg"]'::jsonb,
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
  'PROD-02474',
  'POKEMON HEARTGOLD & SOUL SILVER - N. 01',
  'POKEMON HEARTGOLD & SOUL SILVER - N. 01',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/7zErnYRbS0MeK88QNnncH1KIytA=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/263efb16-2ce4-11ef-a8b4-5a1a0672c527.jpg"]'::jsonb,
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
  'PROD-02475',
  'POKEMON HEARTGOLD & SOUL SILVER - N. 02',
  'POKEMON HEARTGOLD & SOUL SILVER - N. 02',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/vplOJ5NAyw4QU8ZSF64wmVeCEBE=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/8856b376-7fa9-11ef-b0bc-6e97175de7f7.jpg"]'::jsonb,
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
  'PROD-02476',
  'POKEMON N.1',
  'POKEMON N.1',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/SarpznjP6mHDE5Y9jKa9pwtim3E=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/84f35fd4-4e7d-11ef-8179-b2d60c13b884.jpg"]'::jsonb,
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
  'PROD-02477',
  'POKEMON N.2',
  'POKEMON N.2',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/v1JJ30uMIyWk_qUdzz7es4duFsg=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/8545d8cc-4e7d-11ef-93f5-0a914f96fc60.jpg"]'::jsonb,
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
  'PROD-02478',
  'POKEMON N.3',
  'POKEMON N.3',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/_rtkyHrga9bRfMTQcLNlwdEIsvg=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/8519eb54-4e7d-11ef-8897-0ec18585415d.jpg"]'::jsonb,
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
  'PROD-02479',
  'POKEMON N.4',
  'POKEMON N.4',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/D1qqHpzZJ36lXpfLYBSuAhM1MXo=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/8542fc2e-4e7d-11ef-9629-4a1bf48aa6ac.jpg"]'::jsonb,
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
  'PROD-02480',
  'POKEMON N.5',
  'POKEMON N.5',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/D61vFT8QmLoHXAlua_EGf4uU8DU=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/8573188c-4e7d-11ef-aed3-3a86ab418552.jpg"]'::jsonb,
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
  'PROD-02481',
  'POKÉMON PLATINUM N.2',
  'POKÉMON PLATINUM N.2',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/UB6ibsVfnQLvkcIU93HdhjxD8_E=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/52ca9b84-fb7c-11ee-9853-defb8f9ca9fa.jpg"]'::jsonb,
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
  'PROD-02482',
  'POKEMON RUBY AND SAPPHIRE - 05 [REB]',
  'POKEMON RUBY AND SAPPHIRE - 05 [REB]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/KKltBZP1xQxzpLXLXMSxM5cXw-k=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/e51362c8-eb4a-11ef-8230-fa812316df6c.jpg"]'::jsonb,
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
  'PROD-02483',
  'POKEMON RUBY AND SAPPHIRE - 06 [REB]',
  'POKEMON RUBY AND SAPPHIRE - 06 [REB]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/cNi1Lc7KJXf-qYLjXSnSJeLU_vE=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/e512c822-eb4a-11ef-8621-0ee70347c223.jpg"]'::jsonb,
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
  'PROD-02484',
  'POKEMON RUBY AND SAPPHIRE - 07 [REB]',
  'POKEMON RUBY AND SAPPHIRE - 07 [REB]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/jte3IMJTTllk9BuFLXXr9S0K0K0=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/e5ad3fc4-eb4a-11ef-8621-0ee70347c223.jpg"]'::jsonb,
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
  'PROD-02485',
  'POKEMON RUBY AND SAPPHIRE - 08 [REB]',
  'POKEMON RUBY AND SAPPHIRE - 08 [REB]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/0eWyubbzbvKLyQxHCMBccGFcnuY=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/e5c5ae7e-eb4a-11ef-8230-fa812316df6c.jpg"]'::jsonb,
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
  'PROD-02486',
  'PONTO DE INGNICAO (GRANDES EVENTOS DC)',
  'PONTO DE INGNICAO (GRANDES EVENTOS DC)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/-nIZSBgPzfOeSCKrmtjDawCpqbs=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/cdcd9a8a-f616-11ef-8a8b-4e2fbf8e6f25.jpg"]'::jsonb,
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
  'PROD-02487',
  'PORCO-ARANHA: GRANDES PODERES, NENHUMA RESPONSABILIDADE! (SC',
  'PORCO-ARANHA: GRANDES PODERES, NENHUMA RESPONSABILIDADE! (SC',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/QnIxPq2l9OIhD_C6GHBGKE6Bh98=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/00896a2e-d81a-11ee-a453-e2697ce33d53.jpg"]'::jsonb,
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
  'PROD-02488',
  'PORCO-ARANHA: UM PORCO NO TEMPO (SCHOLASTIC)',
  'PORCO-ARANHA: UM PORCO NO TEMPO (SCHOLASTIC)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/K7DNHxr1Oq3X54Jec-pfI0CwyZ0=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/88638754-7fa9-11ef-b1d0-12caec0ea15c.jpg"]'::jsonb,
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
  'PROD-02489',
  'PREDADOR VOL.01',
  'PREDADOR VOL.01',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/Jq_ZVy6LNsUcOKQTFwA3Bf1NQsg=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/5a861210-2473-11f0-afad-2e8d043f9b4b.jpg"]'::jsonb,
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
  'PROD-02490',
  'PREDADOR VOL.02',
  'PREDADOR VOL.02',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/KAKGhqydodYkYGjH02bY0I-a2Zs=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/1f3d7df2-69af-11f0-a796-ae0a374fc493.jpg"]'::jsonb,
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
  'PROD-02491',
  'PREDADOR VOL.03',
  'PREDADOR VOL.03',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/LJE2qBvm595HbqDIIlJ4J1_DTIU=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/92e115de-9d49-11f0-8c2e-46530ad93662.jpg"]'::jsonb,
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
  'PROD-02492',
  'PREDADOR VS. WOLVERINE',
  'PREDADOR VS. WOLVERINE',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/7b5fUXOqNcRhWFaUBp6cFPyEaZc=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/504e1808-8b5f-11f0-b3d9-165df9e621a1.jpg"]'::jsonb,
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
  'PROD-02493',
  'PRODIGIO VOL.02',
  'PRODIGIO VOL.02',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/0P2PeXC2rxQYm9kHdv9Fq46_0c4=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/8c31cd94-d817-11ee-9371-e2a33adec5cd.jpg"]'::jsonb,
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
  'PROD-02494',
  'PROMISED NEVERLAND - UMA CARTA DE NORMAN',
  'PROMISED NEVERLAND - UMA CARTA DE NORMAN',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/WEsjQOs1JE7uoVK55G1Ogv4rYco=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/02a386e2-eb4b-11ef-8230-fa812316df6c.jpg"]'::jsonb,
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
  'PROD-02495',
  'PROMISED NEVERLAND: CANÇÃO DE LEMBRANÇAS DAS MÃES  - 1',
  'PROMISED NEVERLAND: CANÇÃO DE LEMBRANÇAS DAS MÃES  - 1',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/Os9_WKjmGgb1FM9gfs2up-8WaNw=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/a7f76c5c-eb29-11ef-b1d3-def782e2bf12.jpg"]'::jsonb,
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
  'PROD-02496',
  'PUNHO DE FERRO: ESPECIAL DE 50 ANOS',
  'PUNHO DE FERRO: ESPECIAL DE 50 ANOS',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/W1y69UQaKkXPPKF_iyoF-_J6JvU=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/91531c80-3692-11f0-a555-0ab818bfd0ea.jpg"]'::jsonb,
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
  'PROD-02497',
  'QUARTETO FANTASTICO (2023) VOL.01 [REB]',
  'QUARTETO FANTASTICO (2023) VOL.01 [REB]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/v20kXW-u5-vMy0PiaNFGen7Xhzw=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/23def33a-6f3c-11f0-8f42-363abf455bbf.jpg"]'::jsonb,
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
  'PROD-02498',
  'QUARTETO FANTASTICO (2023) VOL.02',
  'QUARTETO FANTASTICO (2023) VOL.02',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/rhfnmUfExfC2meOfOkIn7hz-TAY=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/97ca39b6-2461-11ef-81c7-f2a69ad46e56.jpg"]'::jsonb,
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
  'PROD-02499',
  'QUARTETO FANTÁSTICO 1234 (MARVEL ESSENCIAIS)',
  'QUARTETO FANTÁSTICO 1234 (MARVEL ESSENCIAIS)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/Ey_uDk3IMex_ofjxbeHM0pbvO8c=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/cbbdcea4-4daf-11f0-9750-c68fdf865aae.jpg"]'::jsonb,
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
  'PROD-02500',
  'QUARTETO FANTASTICO POR JONATHAN HICKMAN VOL.02 (MARVEL OMNI',
  'QUARTETO FANTASTICO POR JONATHAN HICKMAN VOL.02 (MARVEL OMNI',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/m0BYz2H-hqpqPACiUyZ4V77TJo4=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/41e754ee-7fd1-11f0-b894-2e1dcafaddd0.jpg"]'::jsonb,
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