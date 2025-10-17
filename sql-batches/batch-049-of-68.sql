-- SQL para importar produtos Brancaleone
-- Gerado em: 2025-10-17T18:20:53.612Z
-- Total de produtos: 3363
-- Fonte: brancaleone-products-1760723254011.json

-- 1. Criar distribuidor (se não existir)

-- Distribuidor já criado no batch-001

-- Lote 49 de 68
-- Produtos: 4801 até 4900



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02401',
  'OS VINGADORES (2019) N.73/16',
  'OS VINGADORES (2019) N.73/16',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/r6Fw7VJOvfNO__zBwQudH7M-wRA=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/ee0c4070-0143-11f0-9602-e6e8567c501d.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02402',
  'OS VINGADORES (2019) N.74/17',
  'OS VINGADORES (2019) N.74/17',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/f4mNqU1vjV0QRD6ZYprx03sm8Bg=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/9c8d177c-1941-11f0-a9be-7a7afc96fac7.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02403',
  'OS VINGADORES (2019) N.75/18',
  'OS VINGADORES (2019) N.75/18',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/nKjhyUCdIXOO9Y8vMwosWCg_hYI=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/90edc9c0-3692-11f0-a9ef-e679d989cbbb.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02404',
  'OS VINGADORES (2019) N.76/19',
  'OS VINGADORES (2019) N.76/19',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/Z_Qychb1AS2OW-fJpTNbNsdmdFY=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/1f49a898-48b7-11f0-98d1-7a925bb2c122.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02405',
  'OS VINGADORES (2019) N.77/20',
  'OS VINGADORES (2019) N.77/20',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/4QBl5tajgcTD1fBcJtpG4ORXJcc=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/5f61778c-5ea9-11f0-bc5c-8a0b5d172c0d.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02406',
  'OS VINGADORES (2019) N.78/21',
  'OS VINGADORES (2019) N.78/21',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/FckWXpgWXsUPQNlZVSO6OXUvzrI=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/40bf5bde-7fd1-11f0-a5af-de5e70a27ff7.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02407',
  'OS VINGADORES (2019) N.79/22',
  'OS VINGADORES (2019) N.79/22',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/gSGuNfJriGeXx1PxzghISYwJR0k=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/f2f58e52-9031-11f0-9754-9a60b14b6cd5.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02408',
  'OSHI NO KO - MINHA ESTRELA PREFERIDA  - 03',
  'OSHI NO KO - MINHA ESTRELA PREFERIDA  - 03',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/wWwHsedPNpkudKA877ZP0sdlmuY=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/f231c46c-d819-11ee-83df-e2e54ed5f9f7.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02409',
  'OSHI NO KO - MINHA ESTRELA PREFERIDA - 10',
  'OSHI NO KO - MINHA ESTRELA PREFERIDA - 10',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/_a-1Qkl000LVsNUick74VsBYjoo=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/8788db68-7fa9-11ef-b0bc-6e97175de7f7.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02410',
  'OSHI NO KO - MINHA ESTRELA PREFERIDA - 11',
  'OSHI NO KO - MINHA ESTRELA PREFERIDA - 11',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/oFJbBUfPY9HzQp8T43px3cATngU=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/f7515102-eb4a-11ef-8230-fa812316df6c.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02411',
  'OSHI NO KO - MINHA ESTRELA PREFERIDA - 12',
  'OSHI NO KO - MINHA ESTRELA PREFERIDA - 12',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/z4ZV9MxAWGsDknGAtTCYpvSjojU=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/f84024d0-eb4a-11ef-8230-fa812316df6c.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02412',
  'OSHI NO KO - MINHA ESTRELA PREFERIDA - 13',
  'OSHI NO KO - MINHA ESTRELA PREFERIDA - 13',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/-WITuRbvLCKHj9eFJ16ol3okQzA=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/a65f954a-eb29-11ef-a3b1-5681c2ac1d4b.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02413',
  'OSHI NO KO - MINHA ESTRELA PREFERIDA - 14',
  'OSHI NO KO - MINHA ESTRELA PREFERIDA - 14',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/KJDVZLEnmpVqi1vm3ULcGGEpDCM=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/a660defa-eb29-11ef-a31a-8ed8743505f0.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02414',
  'OSHI NO KO - MINHA ESTRELA PREFERIDA - 15',
  'OSHI NO KO - MINHA ESTRELA PREFERIDA - 15',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/7v03i7qrQKRwHXYbwzQNloJABv4=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/93ed0428-08c6-11f0-9d4c-9add630305de.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02415',
  'OSHI NO KO - MINHA ESTRELA PREFERIDA - N. 07',
  'OSHI NO KO - MINHA ESTRELA PREFERIDA - N. 07',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/sM1vtDiZE10xSrApbqolpmfKEkI=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/2602c4b6-2ce4-11ef-89e8-ba14daa9e0da.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02416',
  'OSHI NO KO - MINHA ESTRELA PREFERIDA - N. 08',
  'OSHI NO KO - MINHA ESTRELA PREFERIDA - N. 08',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/DVgqSEG4_N12YjfgJG7B_AiY5Dc=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/8c36b44e-4e7d-11ef-9f68-7e82d78027a8.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02417',
  'OSHI NO KO - MINHA ESTRELA PREFERIDA - N. 09',
  'OSHI NO KO - MINHA ESTRELA PREFERIDA - N. 09',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/OtV4Ppzx2w9_AIq7swyuliTHIug=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/878208ba-7fa9-11ef-b1d0-12caec0ea15c.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02418',
  'OSHI NO KO N.2',
  'OSHI NO KO N.2',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/VBITGpEX8PYdgH00sA4pRQH_CMk=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/f20ac786-d819-11ee-a82e-32937b3ded24.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02419',
  'OSHI NO KO N.4',
  'OSHI NO KO N.4',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/4gilD0TT406FthdiqeANpfmT3ks=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/487d7396-e497-11ee-b6a7-e2b250ff01a0.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02420',
  'OSHI NO KO N.5',
  'OSHI NO KO N.5',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/669GToqdLz02HoUTx7UdW4FpHo8=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/30172126-ebef-11ee-963f-1e73add0c60b.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02421',
  'OSHI NO KO N.6',
  'OSHI NO KO N.6',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/hUMjXhnpRGXY-x3LR_qUwUkVt7I=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/5a98c798-0cc8-11ef-88d1-3619a1e0872c.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02422',
  'OZ VOL.06: A CIDADE ESMERALDA',
  'OZ VOL.06: A CIDADE ESMERALDA',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/SEfPc6jzw7UJnAQ8c1HK2cWF-CA=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/c551225c-d81a-11ee-ae87-e2e54ed5f9f7.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02423',
  'PACIFICADOR: UM DIA DE CAO',
  'PACIFICADOR: UM DIA DE CAO',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/iKUy445PIbjVsflqsd3IiyJshYA=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/a68b47bc-eb29-11ef-913d-52f5d450f8a6.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02424',
  'PARÓDIAS MSP N.12',
  'PARÓDIAS MSP N.12',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/zmTN1eZKg9RZ6OE6NFFU5tM3RMM=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/e8198682-9031-11f0-9754-9a60b14b6cd5.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02425',
  'PATO DONALD 90 ANOS',
  'PATO DONALD 90 ANOS',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/qEQDFZ9NT19z05b-gF4AQd0qPiU=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/f8570c72-eb4a-11ef-8230-fa812316df6c.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02426',
  'PATO DONALD E O VENTO LEVOU (GRAPHIC DISNEY)',
  'PATO DONALD E O VENTO LEVOU (GRAPHIC DISNEY)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/kgcSXJSSit-e1tUMIgk3twNqc4g=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/da5e0dc4-eb4a-11ef-8230-fa812316df6c.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02427',
  'PATRULHA DO DESTINO POR RACHEL POLLACK VOL. 01 - EDICAO DE L',
  'PATRULHA DO DESTINO POR RACHEL POLLACK VOL. 01 - EDICAO DE L',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/hHubEmJyzx5464Sm7scD2nzMIZ0=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/95bf2494-eb29-11ef-8b75-5ac0f052206d.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02428',
  'PATRULHA DO DESTINO POR RACHEL POLLACK VOL. 02 - EDICAO DE L',
  'PATRULHA DO DESTINO POR RACHEL POLLACK VOL. 02 - EDICAO DE L',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/Ai5kWIpLoapXPjg2crl_HCdX10k=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/45a95994-8b5f-11f0-ab6e-7e1ab2cbb1e5.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02429',
  'PEQUENOS HEROIS MARVEL N.01',
  'PEQUENOS HEROIS MARVEL N.01',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/X-5lLpIaak1_THSf2mW-bgc55wg=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/9d0eea36-1941-11f0-857d-1a640e6f5312.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02430',
  'PEQUENOS HEROIS MARVEL N.02',
  'PEQUENOS HEROIS MARVEL N.02',
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
  'PROD-02431',
  'PEQUENOS HEROIS MARVEL N.03',
  'PEQUENOS HEROIS MARVEL N.03',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/lMj0mRsulMxbjKog94TH5N6vXh8=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/de57e0d8-3f2f-11f0-a17d-1ac4d5553c9e.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02432',
  'PEQUENOS HEROIS MARVEL N.04',
  'PEQUENOS HEROIS MARVEL N.04',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/IxNTG3BRRCoOGqAj8t91i5x_yNg=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/23b979e8-6f3c-11f0-9cf1-c2c01d897fb1.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02433',
  'PEQUENOS HEROIS MARVEL N.05',
  'PEQUENOS HEROIS MARVEL N.05',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/IJZgPwvZgayKulYJnDictbrrsds=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/f3d1a54a-9031-11f0-9754-9a60b14b6cd5.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02434',
  'PEQUENOS HEROIS MARVEL N.06',
  'PEQUENOS HEROIS MARVEL N.06',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/n9L9xNioZXckjQU_zFYTk-XzdwU=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/28effae0-a4ac-11f0-9bb5-ee8f90996b43.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02435',
  'PINGUIM N.1',
  'PINGUIM N.1',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/ihPbd9CLAhpMbKe3lb9DiBX-3OE=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/0ec48f5c-f68c-11ee-95eb-568a0913e72e.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02436',
  'PINGUIM VOL. 02',
  'PINGUIM VOL. 02',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/GYdfOQQPfXRMmrUqLi26VmDIaSA=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/a6bfa4ee-eb29-11ef-89a1-ce85303a26c9.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02437',
  'PITECO: FOGO (GRAPHIC MSP VOL.23) (REB)',
  'PITECO: FOGO (GRAPHIC MSP VOL.23) (REB)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/fJOEM8-kNcLqglYk2ULtyvWRD40=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/7ef53658-da7d-11ee-999b-aaf7be4593ab.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02438',
  'PITECO: PRESAS  (GRAPHIC MSP VOL.31) (BROCHURA)',
  'PITECO: PRESAS  (GRAPHIC MSP VOL.31) (BROCHURA)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/7N9aFqjR79YThTEoA8kofWZflF4=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/a75f23c6-dd64-11ee-a2ee-8aa0fc000b53.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02439',
  'PLANETA DE LAZARO',
  'PLANETA DE LAZARO',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/2C4UwnuumK7-Lq020UGwD-g9vMI=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/fbecf88c-d819-11ee-a8da-56e6c271e0a3.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02440',
  'PLANETA DOS MACACOS VOL.01',
  'PLANETA DOS MACACOS VOL.01',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/I2iHWgjTuPTYPOVM06JIiDzsCLY=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/5a6ca0dc-2473-11f0-adf6-061a58ec2564.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02441',
  'PLANETA HULK: O QUEBRA-MUNDOS VOL.01',
  'PLANETA HULK: O QUEBRA-MUNDOS VOL.01',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/rrri-rZ-__3hcJMOYXuARB18z2g=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/46183f4e-de36-11ee-aae0-ca3362baf0a6.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02442',
  'PLANETES - 01 [REB]',
  'PLANETES - 01 [REB]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/QIVSofId0yiCDHdrYrSI-wewv2c=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/3a200490-7fd1-11f0-a5af-de5e70a27ff7.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02443',
  'PLANETES - 02 [REB]',
  'PLANETES - 02 [REB]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/ImbK4mFA_rKng4dweSTE0FBoGv4=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/3a412de6-7fd1-11f0-a5af-de5e70a27ff7.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02444',
  'PLANETES - 03 [REB]',
  'PLANETES - 03 [REB]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/5WVHhYodq1HTsRAEKb8UZo4uFM0=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/3a540d12-7fd1-11f0-b894-2e1dcafaddd0.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02445',
  'PLANETES - 04 [REB]',
  'PLANETES - 04 [REB]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/gQu4NbIOxViiC0m9sBvyiBS3pl0=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/3a786428-7fd1-11f0-a5af-de5e70a27ff7.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02446',
  'PLUTO - EDIÇÃO DE LUXO - 06',
  'PLUTO - EDIÇÃO DE LUXO - 06',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/zHYb07fSoZwPIsXbZ3zS-d4zKcw=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/40fa426c-7fd1-11f0-b894-2e1dcafaddd0.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02447',
  'PLUTO: EDIÇÃO DE LUXO - 07',
  'PLUTO: EDIÇÃO DE LUXO - 07',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/L-Y-yLCoft-wK7AnAEnXAM2mu9g=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/058eb1a0-98c6-11f0-aa8b-36a8c25a1d89.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02448',
  'PLUTO: EDICAO DE LUXO - 1',
  'PLUTO: EDICAO DE LUXO - 1',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/kreb0GcvZBcrNpw91w6PQTG76eM=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/87dd5bf2-7fa9-11ef-b0bc-6e97175de7f7.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02449',
  'PLUTO: EDICAO DE LUXO - 2',
  'PLUTO: EDICAO DE LUXO - 2',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/O-glaOWwwWLLea-iTwkCvbj9Xf4=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/a6e6996e-eb29-11ef-a3b1-5681c2ac1d4b.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02450',
  'PLUTO: EDICAO DE LUXO - 3',
  'PLUTO: EDICAO DE LUXO - 3',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/ZUMu8kbv5kVRx0KgCC4_aKYL5cw=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/af0da710-ee29-11ef-89f1-e29dc7e5f602.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();