-- SQL para importar produtos Brancaleone
-- Gerado em: 2025-10-17T18:20:53.612Z
-- Total de produtos: 3363
-- Fonte: brancaleone-products-1760723254011.json

-- 1. Criar distribuidor (se não existir)

-- Distribuidor já criado no batch-001

-- Lote 40 de 68
-- Produtos: 3901 até 4000



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01951',
  'MONSTER KANZENBAN N.2',
  'MONSTER KANZENBAN N.2',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/VOb0fony3LvmqSsMsgo_WxeBljY=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/8b513450-4e7d-11ef-8c80-c6fee06b850e.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01952',
  'MONSTER KANZENBAN N.5',
  'MONSTER KANZENBAN N.5',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/cEQjEhS8euzV6qTczn1ylNMenYY=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/88c84db8-4e7d-11ef-8b01-66fb588c5617.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01953',
  'MONSTER KANZENBAN N.6',
  'MONSTER KANZENBAN N.6',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/N86G2ByKLMJ68Q0w6as2J7ayQOs=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/8901ac48-4e7d-11ef-9a7d-6ef807fbb3ad.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01954',
  'MONSTER KANZENBAN N.7',
  'MONSTER KANZENBAN N.7',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/3hgfv813DtGxhw0mXdGt1_YnXNk=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/89487cb8-4e7d-11ef-ad60-86ce4d9bc0e0.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01955',
  'MONSTRO DO PANTANO (2022) VOL.02 (DE 2)',
  'MONSTRO DO PANTANO (2022) VOL.02 (DE 2)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/j5HUvFE4HgBR9Qm20gXRzFmWtE8=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/825673f4-d819-11ee-bb5a-de7d367e92b3.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01956',
  'MONSTRO DO PANTANO POR LEIN WEIN E BERNIE WRIGHTSON - EDICAO',
  'MONSTRO DO PANTANO POR LEIN WEIN E BERNIE WRIGHTSON - EDICAO',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/rz8cNgOBq3d-GXqcaBHDUeI9TnQ=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/6ca2f228-da9c-11ee-b415-da2490dbf0ff.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01957',
  'MONSTRO DO PANTANO: INFERNO VERDE',
  'MONSTRO DO PANTANO: INFERNO VERDE',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/jM_judOAdTzuDAZoD58AnuEhlRM=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/798cdc48-da7d-11ee-9032-fe9018619bf2.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01958',
  'MORIARTY O PATRIOTA - 1 [REB2]',
  'MORIARTY O PATRIOTA - 1 [REB2]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/1didkhsjmxwHMBLUUfjHc3NneT0=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/8142f912-4e7d-11ef-9a7d-6ef807fbb3ad.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01959',
  'MORIARTY O PATRIOTA N.10',
  'MORIARTY O PATRIOTA N.10',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/bqLWZBWCI4QwGbn5wOdqoJPLQ_s=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/83c8ff8a-7fa9-11ef-b1d0-12caec0ea15c.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01960',
  'MORIARTY O PATRIOTA N.11',
  'MORIARTY O PATRIOTA N.11',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/ImtafxyjbyMxVDffVfAbLZ1870A=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/83cccc0a-7fa9-11ef-b0bc-6e97175de7f7.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01961',
  'MORIARTY O PATRIOTA N.12',
  'MORIARTY O PATRIOTA N.12',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/AS9PSMaPj2Q9MxxRmu7mbXmNeAA=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/83e42972-7fa9-11ef-b0bc-6e97175de7f7.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01962',
  'MORIARTY O PATRIOTA N.2',
  'MORIARTY O PATRIOTA N.2',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/PgRB4C7bmDxu-Wn8G8sUDFm_jU0=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/f8537954-2930-11ef-93b8-4a187dfd8c76.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01963',
  'MORIARTY O PATRIOTA N.3',
  'MORIARTY O PATRIOTA N.3',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/Ub9RrwzlnrySJkWJEV3vFtulLJk=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/8182121e-4e7d-11ef-b6fd-42ec70ffd9b9.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01964',
  'MORIARTY O PATRIOTA N.4',
  'MORIARTY O PATRIOTA N.4',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/UiK_NXR7BMoZsimASLH4DLc8gf0=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/816907ec-4e7d-11ef-876a-e24de145a09c.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01965',
  'MORIARTY O PATRIOTA N.5',
  'MORIARTY O PATRIOTA N.5',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/tiched-md-8HpOh9t-x5_Jwce0g=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/81a253da-4e7d-11ef-ad60-86ce4d9bc0e0.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01966',
  'MORIARTY O PATRIOTA N.6',
  'MORIARTY O PATRIOTA N.6',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/L6wzj7355Ofjbz-4Q4CRw6ErG1k=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/81b87e3a-4e7d-11ef-b6ff-da43772e5616.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01967',
  'MORIARTY O PATRIOTA N.7',
  'MORIARTY O PATRIOTA N.7',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/EnOpx9_5z-bM4DQHH04liorPSgk=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/81e3b726-4e7d-11ef-93f5-0a914f96fc60.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01968',
  'MORIARTY O PATRIOTA N.8',
  'MORIARTY O PATRIOTA N.8',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/euX1l5KujXQg2CZjOP8Y4ijjYDk=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/8201d184-4e7d-11ef-8063-de10c0ad3180.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01969',
  'MORIARTY O PATRIOTA N.9',
  'MORIARTY O PATRIOTA N.9',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/k1ahT0PiBVDC6Z-gpdL6c4M17RA=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/822ea862-4e7d-11ef-896f-5e025afe733a.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01970',
  'MORIARTY: O PATRIOTA - 13 [REB]',
  'MORIARTY: O PATRIOTA - 13 [REB]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/A1XPtdgfLZGR06wRZh5y6YdQW1U=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/e2c1a106-eb4a-11ef-8621-0ee70347c223.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01971',
  'MORIARTY: O PATRIOTA - 14 [REB]',
  'MORIARTY: O PATRIOTA - 14 [REB]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/U0fYMQPzs6zx6JFNlHKRLm0AECU=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/e2e1d728-eb4a-11ef-8230-fa812316df6c.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01972',
  'MORIARTY: O PATRIOTA - 15 [REB]',
  'MORIARTY: O PATRIOTA - 15 [REB]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/g7KtvRoU-m5ZEGYJ9inPyZclbtY=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/e32dab62-eb4a-11ef-8621-0ee70347c223.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01973',
  'MORIARTY: O PATRIOTA - 16 [REB]',
  'MORIARTY: O PATRIOTA - 16 [REB]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/KpggJsM15sns1f6k6WNJQecbGvM=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/e308d346-eb4a-11ef-8230-fa812316df6c.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01974',
  'MORIARTY: O PATRIOTA - 17 [REB]',
  'MORIARTY: O PATRIOTA - 17 [REB]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/c6gyk5Hm1nurmmT14XFDzBYXHGs=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/e36b4008-eb4a-11ef-8230-fa812316df6c.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01975',
  'MORIARTY: O PATRIOTA - 18 [REB]',
  'MORIARTY: O PATRIOTA - 18 [REB]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/fbnxfduJXKjemntcSIOrLagkDyM=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/e3490240-eb4a-11ef-8621-0ee70347c223.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01976',
  'MORIARTY: O PATRIOTA - 19 [REB]',
  'MORIARTY: O PATRIOTA - 19 [REB]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/y8C4aeiREf1tBtQzoS1LYM1K2rw=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/e382a202-eb4a-11ef-8230-fa812316df6c.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01977',
  'MORTE: AS PORTAS DA MORTE',
  'MORTE: AS PORTAS DA MORTE',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/IoBnp0krFkdfcRvJEeKChITKfV8=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/830b290c-d819-11ee-9675-5a86bcbeb6e3.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01978',
  'MOTOQUEIRO FANTASMA (2023) VOL.02',
  'MOTOQUEIRO FANTASMA (2023) VOL.02',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/jWy7CgEu2s_YIxabvhwr5Lpbik4=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/841b4048-d819-11ee-bb5a-de7d367e92b3.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01979',
  'MOTOQUEIRO FANTASMA (2023) VOL.03',
  'MOTOQUEIRO FANTASMA (2023) VOL.03',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/JIFHv-JzZfH3O5sWDqBoRXzUXuo=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/4490caa8-e497-11ee-83ff-7ee42cfe9644.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01980',
  'MOTOQUEIRO FANTASMA (2023) VOL.04',
  'MOTOQUEIRO FANTASMA (2023) VOL.04',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/NT77LNlSeasIz7SGi3FRF83a6jE=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/86defa08-7fa9-11ef-b0bc-6e97175de7f7.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01981',
  'MS. MARVEL VOL.03 (MARVEL TEENS)',
  'MS. MARVEL VOL.03 (MARVEL TEENS)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/_AQ58bLq4eRlHPeXCtgmE2zopaY=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/a3148f80-eb29-11ef-913d-52f5d450f8a6.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01982',
  'MS. MARVEL: NADA NORMAL  N.1',
  'MS. MARVEL: NADA NORMAL  N.1',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/ynPgZzuFwGeQbRYJQPiFKj8BDxQ=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/e6737558-d819-11ee-a453-e2697ce33d53.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01983',
  'MS. MARVEL: OS PUNHOS DA JUSTICA N.1',
  'MS. MARVEL: OS PUNHOS DA JUSTICA N.1',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/9lLH6oAqD1VIsYcm7am6eyci7DU=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/6e7c359e-d819-11ee-9675-5a86bcbeb6e3.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01984',
  'MSP 90',
  'MSP 90',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/TgY7T1gavHEHTP2h5PQkTfDccrY=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/a09f79fa-a7c0-11f0-96ab-2e54fc51120d.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01985',
  'MSP 90 N.1 [CAPA CARTÃO]',
  'MSP 90 N.1 [CAPA CARTÃO]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/TgY7T1gavHEHTP2h5PQkTfDccrY=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/a09f79fa-a7c0-11f0-96ab-2e54fc51120d.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01986',
  'MULHER MARAVILHA (2017) N.07/57',
  'MULHER MARAVILHA (2017) N.07/57',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/IAfwOfQe1j9c4Oyrt_92Y3F_1mI=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/67772878-d817-11ee-a7e4-ce469b473a25.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01987',
  'MULHER MARAVILHA (2017) N.11/61',
  'MULHER MARAVILHA (2017) N.11/61',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/EDJUsddO80xvoOtCBVbOQ4pvL5k=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/690e9fe0-d817-11ee-a7e4-ce469b473a25.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01988',
  'MULHER MARAVILHA (2017) N.12/62',
  'MULHER MARAVILHA (2017) N.12/62',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/LtMQKZhb4Jsqz-UeM53DsCRaVnI=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/692ffeec-d817-11ee-bce8-e2e54ed5f9f7.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01989',
  'MULHER MARAVILHA (2017) N.13/63',
  'MULHER MARAVILHA (2017) N.13/63',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/e505g8S3qsp-0Rm35AHD034ci28=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/69d9b1f8-d817-11ee-b124-5a86bcbeb6e3.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01990',
  'MULHER MARAVILHA (2017) N.14/64',
  'MULHER MARAVILHA (2017) N.14/64',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/Rb2pf7RkvAif4Qrjlys46u0RmxM=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/6a1158f6-d817-11ee-b3a2-6efcfa6dd7bd.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01991',
  'MULHER MARAVILHA (2017) N.15/65',
  'MULHER MARAVILHA (2017) N.15/65',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/F90q7rvaiiHQWpaDTbZvd59sT_U=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/6a97c044-d817-11ee-bce8-e2e54ed5f9f7.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01992',
  'MULHER MARAVILHA (2017) N.16/66',
  'MULHER MARAVILHA (2017) N.16/66',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/z3ZojJdmSkcF_szViHwzQMNbEi0=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/6b16ede2-d817-11ee-a7e4-ce469b473a25.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01993',
  'MULHER MARAVILHA (2017) N.67',
  'MULHER MARAVILHA (2017) N.67',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/vmuI8CplT_AXafXY-k54e3W1ayQ=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/6b85cc58-d817-11ee-a3da-e2697ce33d53.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01994',
  'MULHER MARAVILHA / FLASH N.1',
  'MULHER MARAVILHA / FLASH N.1',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/dy6THqFZO1P8zYo0txGIpuE8vnQ=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/4abde6d6-1705-11ef-a192-b27729de0ea6.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01995',
  'MULHER MARAVILHA / FLASH N.10',
  'MULHER MARAVILHA / FLASH N.10',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/4W5Ec_HV3mQAI3nCQQqH79uGtfQ=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/a394ac92-eb29-11ef-913d-52f5d450f8a6.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01996',
  'MULHER MARAVILHA / FLASH N.11',
  'MULHER MARAVILHA / FLASH N.11',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/jWmhNzqvJne4i5nVWzMskpQV7ZM=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/c85bc928-f616-11ef-8a8b-4e2fbf8e6f25.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01997',
  'MULHER MARAVILHA / FLASH N.12',
  'MULHER MARAVILHA / FLASH N.12',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/UeltfGD7R0eYLGpiKjxhn3nASkA=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/d065269e-0ea0-11f0-8b42-eedf42219d7c.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01998',
  'MULHER MARAVILHA / FLASH N.13',
  'MULHER MARAVILHA / FLASH N.13',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/vkc7AHe5otvoHjo9buZ86Y9vd0c=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/5a1edcda-2473-11f0-adf6-061a58ec2564.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01999',
  'MULHER MARAVILHA / FLASH N.14',
  'MULHER MARAVILHA / FLASH N.14',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/ZQyR8tmLp8VQDma2qcReaXXzI40=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/2d3dda84-44b4-11f0-a1ec-1a73b65bfa37.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02000',
  'MULHER MARAVILHA / FLASH N.15',
  'MULHER MARAVILHA / FLASH N.15',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/mKGuvl0lR6OoOHY1P2j6a_KsHwg=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/1f09f7ca-69af-11f0-ae5d-0ebdcf797c5e.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();