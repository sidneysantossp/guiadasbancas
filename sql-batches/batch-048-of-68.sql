-- SQL para importar produtos Brancaleone
-- Gerado em: 2025-10-17T17:52:46.765Z
-- Total de produtos: 3363
-- Fonte: brancaleone-products-1760723254011.json

-- 1. Criar distribuidor (se não existir)

-- Distribuidor já criado no batch-001

-- Lote 48 de 68
-- Produtos: 4701 até 4800



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02351',
  'OS DIAS DE FOLGA DO VILAO - 4',
  'OS DIAS DE FOLGA DO VILAO - 4',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/rvjhjry6i4wd6Jax-met6LwQhtA=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/9af460f0-eb29-11ef-a4f3-5a40d84dae09.jpg"]'::jsonb,
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
  'PROD-02352',
  'OS DIAS DE FOLGA DO VILAO - 5',
  'OS DIAS DE FOLGA DO VILAO - 5',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/F2GnMTjFgqj4f8n3fI7_qJxfkj0=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/ec75c524-0143-11f0-9a82-ca3c9ea74dec.jpg"]'::jsonb,
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
  'PROD-02353',
  'OS DIAS DE FOLGA DO VILAO - 6',
  'OS DIAS DE FOLGA DO VILAO - 6',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/Z5iQuOSRS7Tn9cy_0kP6VvoCVEo=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/8f8b27da-3692-11f0-ab90-9a315decf800.jpg"]'::jsonb,
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
  'PROD-02354',
  'OS EMBAIXADORES',
  'OS EMBAIXADORES',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/uaTGM_Fuv2_EYLbFFqTqeyms_rU=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/9526b540-d817-11ee-9371-e2a33adec5cd.jpg"]'::jsonb,
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
  'PROD-02355',
  'OS ETERNOS (2021) VOL.03',
  'OS ETERNOS (2021) VOL.03',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/fMS-cIQRTpwosyf7B3N4ir3SmYY=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/834dde4e-da7d-11ee-b969-fe9018619bf2.jpg"]'::jsonb,
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
  'PROD-02356',
  'OS FABULOSOS X-MEN (2025) N.01',
  'OS FABULOSOS X-MEN (2025) N.01',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/CuQUyRDygY8N0kG-BPV8MOeL4gg=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/1d554ff6-69af-11f0-9136-d26b36de5d6c.jpg"]'::jsonb,
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
  'PROD-02357',
  'OS FABULOSOS X-MEN (2025) N.02',
  'OS FABULOSOS X-MEN (2025) N.02',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/AW0l0JrlGcuwk8iJXNUlWEJZDHI=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/370bd0e0-7fd1-11f0-a5af-de5e70a27ff7.jpg"]'::jsonb,
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
  'PROD-02358',
  'OS FABULOSOS X-MEN (2025) N.03',
  'OS FABULOSOS X-MEN (2025) N.03',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/QNVQD4xL6bh78ko7y-CY7zVZIu8=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/8e4f0abc-9d49-11f0-b01a-e29297f06f8a.jpg"]'::jsonb,
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
  'PROD-02359',
  'OS FABULOSOS X-MEN: EDICAO DEFINITIVA VOL.01 [REB]',
  'OS FABULOSOS X-MEN: EDICAO DEFINITIVA VOL.01 [REB]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/wDiekr1kp6AtwQh4eLRZdv6ZOEE=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/b1777a9c-eb29-11ef-b1d3-def782e2bf12.jpg"]'::jsonb,
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
  'PROD-02360',
  'OS FABULOSOS X-MEN: EDICAO DEFINITIVA VOL.02 [REB]',
  'OS FABULOSOS X-MEN: EDICAO DEFINITIVA VOL.02 [REB]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/4UwJiAVKtlpf-tncqtyDnBL0QSI=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/9ed4202a-1941-11f0-a9be-7a7afc96fac7.jpg"]'::jsonb,
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
  'PROD-02361',
  'OS FABULOSOS X-MEN: EDICAO DEFINITIVA VOL.03 [REB]',
  'OS FABULOSOS X-MEN: EDICAO DEFINITIVA VOL.03 [REB]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/ASwER9yxYgAt5TNCwJYOAn7yIvQ=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/d689bf5c-3f2f-11f0-a17d-1ac4d5553c9e.jpg"]'::jsonb,
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
  'PROD-02362',
  'OS FABULOSOS X-MEN: EDICAO DEFINITIVA VOL.04 [REB]',
  'OS FABULOSOS X-MEN: EDICAO DEFINITIVA VOL.04 [REB]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/gPLpdAwk8G2zEsr5fEoS89seW44=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/2dd1066c-a4ac-11f0-a599-8e83af06c4a6.jpg"]'::jsonb,
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
  'PROD-02363',
  'OS FABULOSOS X-MEN: EDICAO DEFINITIVA VOL.10',
  'OS FABULOSOS X-MEN: EDICAO DEFINITIVA VOL.10',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/AKbObUJ-wccQf5cdzjVXYjveAZY=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/9ef83410-1941-11f0-a340-665f2a2839bf.jpg"]'::jsonb,
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
  'PROD-02364',
  'OS FABULOSOS X-MEN: EDICAO DEFINITIVA VOL.11',
  'OS FABULOSOS X-MEN: EDICAO DEFINITIVA VOL.11',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/4mLlk0iQeD4av4Kf6Sr2lRv-XRg=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/2e096ff2-a4ac-11f0-8bce-3af03c92463f.jpg"]'::jsonb,
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
  'PROD-02365',
  'OS FILHOS DA FAMÍLIA SHIUNJI - 01',
  'OS FILHOS DA FAMÍLIA SHIUNJI - 01',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/nSDcu9bSmdj4Z7ynVPqHlTqWBKY=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/65222752-5ea9-11f0-b926-022f8a1a6f0a.jpg"]'::jsonb,
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
  'PROD-02366',
  'OS FILHOS DA FAMÍLIA SHIUNJI - 02',
  'OS FILHOS DA FAMÍLIA SHIUNJI - 02',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/pq_4UkfpLPo5ENzhrMKdn92Msiw=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/653bc3ec-5ea9-11f0-bc5c-8a0b5d172c0d.jpg"]'::jsonb,
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
  'PROD-02367',
  'OS FILHOS DA FAMÍLIA SHIUNJI - 03',
  'OS FILHOS DA FAMÍLIA SHIUNJI - 03',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/sIqbuQs192TY3WgVksj9sIQC5b4=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/43db5ff2-7fd1-11f0-a5af-de5e70a27ff7.jpg"]'::jsonb,
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
  'PROD-02368',
  'OS FILHOS SINISTROS (2024) N.1',
  'OS FILHOS SINISTROS (2024) N.1',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/4LL7mzITNosK7hjy2pAOFgdGi1w=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/9e00815c-1941-11f0-89d0-967dab4f0af5.jpg"]'::jsonb,
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
  'PROD-02369',
  'OS INVISIVEIS - EDICAO DE LUXO VOL.03',
  'OS INVISIVEIS - EDICAO DE LUXO VOL.03',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/ci2DMdZOpe79sUR7FCVkbzqCVU0=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/969c1228-eb29-11ef-8d7f-eea3b61904a2.jpg"]'::jsonb,
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
  'PROD-02370',
  'OS INVISIVEIS - EDICAO DE LUXO VOL.04',
  'OS INVISIVEIS - EDICAO DE LUXO VOL.04',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/ur5Rwaq75Bczgz9bzPWduljSfv4=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/d9079844-3f2f-11f0-a17d-1ac4d5553c9e.jpg"]'::jsonb,
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
  'PROD-02371',
  'OS INVISIVEIS VOL. 01 (E N.1',
  'OS INVISIVEIS VOL. 01 (E N.1',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/4Q_aO1o9rj4ywrfHzsESZG4GTwQ=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/f6a1403c-2930-11ef-8a49-928f61c71625.jpg"]'::jsonb,
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
  'PROD-02372',
  'OS INVISIVEIS VOL. 02 (EDICAO DE LUXO)',
  'OS INVISIVEIS VOL. 02 (EDICAO DE LUXO)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/iOmL6WaoWA5RwQPD-KVJkoE_9EY=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/8037c388-7fa9-11ef-b1d0-12caec0ea15c.jpg"]'::jsonb,
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
  'PROD-02373',
  'OS LIVROS DA MAGIA N.1',
  'OS LIVROS DA MAGIA N.1',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/NTKu87bPOb_6PE3fi8P83Wu4QUA=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/5e03bf1e-f111-11ee-b719-6645492b56b4.jpg"]'::jsonb,
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
  'PROD-02374',
  'OS MAIORES SUPER-HEROIS DO MUNDO (EDICAO ABSOLUTA)',
  'OS MAIORES SUPER-HEROIS DO MUNDO (EDICAO ABSOLUTA)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/tuy-HU8V9Vtn_LllyzhAxGHJ9DQ=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/49590c4c-8b5f-11f0-b876-cef4535c59b2.jpg"]'::jsonb,
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
  'PROD-02375',
  'OS MISTERIOS DE BATMAN E SCOOBY-DOO N.01',
  'OS MISTERIOS DE BATMAN E SCOOBY-DOO N.01',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/FixEWo5lZfaIH9w1LpBZhdHwKHs=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/ea8b8172-0143-11f0-9602-e6e8567c501d.jpg"]'::jsonb,
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
  'PROD-02376',
  'OS MISTERIOS DE BATMAN E SCOOBY-DOO N.02',
  'OS MISTERIOS DE BATMAN E SCOOBY-DOO N.02',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/F82LFn264nbNRxxiuWlnZWFQi2M=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/32fb3e46-7fd1-11f0-a5af-de5e70a27ff7.jpg"]'::jsonb,
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
  'PROD-02377',
  'OS SUPREMOS (2025) VOL.01',
  'OS SUPREMOS (2025) VOL.01',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/2J9rkFVhsig7rYGMPPuknTb5Trc=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/d606b3d2-3f2f-11f0-87b4-c2502d24ff3f.jpg"]'::jsonb,
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
  'PROD-02378',
  'OS SUPREMOS (MARVEL GRIMORIO)',
  'OS SUPREMOS (MARVEL GRIMORIO)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/SWPtnXaQXoQvW24-uen_0uy1hfQ=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/1d810506-69af-11f0-a796-ae0a374fc493.jpg"]'::jsonb,
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
  'PROD-02379',
  'OS VINGADORES (2019) N.50',
  'OS VINGADORES (2019) N.50',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/goI60kCAwQXLJnP0P8V4Rvc6EZQ=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/ad58b54e-d819-11ee-a453-e2697ce33d53.jpg"]'::jsonb,
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
  'PROD-02380',
  'OS VINGADORES (2019) N.51',
  'OS VINGADORES (2019) N.51',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/nBc3bOg5Oz9_EOvXkY-LcSedXQ4=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/ad9c1816-d819-11ee-83df-e2e54ed5f9f7.jpg"]'::jsonb,
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
  'PROD-02381',
  'OS VINGADORES (2019) N.52',
  'OS VINGADORES (2019) N.52',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/MbrOLs_She5-heU9SbPL-JW-xok=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/ae10e6fa-d819-11ee-b57d-56e6c271e0a3.jpg"]'::jsonb,
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
  'PROD-02382',
  'OS VINGADORES (2019) N.53',
  'OS VINGADORES (2019) N.53',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/SZG-d7LbGWZu7BYpTm65XnF-Q8M=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/ae470172-d819-11ee-83df-e2e54ed5f9f7.jpg"]'::jsonb,
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
  'PROD-02383',
  'OS VINGADORES (2019) N.54',
  'OS VINGADORES (2019) N.54',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/-TxoosJj0_riOKgYq9Q7q4rbf6g=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/aebbb6a2-d819-11ee-947a-32937b3ded24.jpg"]'::jsonb,
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
  'PROD-02384',
  'OS VINGADORES (2019) N.55',
  'OS VINGADORES (2019) N.55',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/SNi3j-1zFMrjxSL1WDsyLTS87Gg=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/af1a8f24-d819-11ee-9675-5a86bcbeb6e3.jpg"]'::jsonb,
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
  'PROD-02385',
  'OS VINGADORES (2019) N.56',
  'OS VINGADORES (2019) N.56',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/Tf9PetuHI87SoDas_RRgjCe4ybM=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/af7420f2-d819-11ee-b57d-56e6c271e0a3.jpg"]'::jsonb,
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
  'PROD-02386',
  'OS VINGADORES (2019) N.57',
  'OS VINGADORES (2019) N.57',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/13RYhwKXMOLq5RKXy1XiLYKGJkc=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/afe69d9e-d819-11ee-83df-e2e54ed5f9f7.jpg"]'::jsonb,
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
  'PROD-02387',
  'OS VINGADORES (2019) N.59',
  'OS VINGADORES (2019) N.59',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/SVQtEj9xYWAz8vS4EG6Ya7NvYNU=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/b09962b2-d819-11ee-947a-32937b3ded24.jpg"]'::jsonb,
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
  'PROD-02388',
  'OS VINGADORES (2019) N.60/03',
  'OS VINGADORES (2019) N.60/03',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/wd0b4YxYla809qKguRQVDKqtAQc=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/b0d2adf6-d819-11ee-83df-e2e54ed5f9f7.jpg"]'::jsonb,
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
  'PROD-02389',
  'OS VINGADORES (2019) N.61',
  'OS VINGADORES (2019) N.61',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/vL_QDYzZ-tTAK3fCzPXEdAkX-Do=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/457563b6-e497-11ee-b6a7-e2b250ff01a0.jpg"]'::jsonb,
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
  'PROD-02390',
  'OS VINGADORES (2019) N.62',
  'OS VINGADORES (2019) N.62',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/Cc7dtliyOlWZTFGNOehk6Y6xSL8=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/52089fd4-fb7c-11ee-b8cc-aa961ba07ae0.jpg"]'::jsonb,
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
  'PROD-02391',
  'OS VINGADORES (2019) N.63',
  'OS VINGADORES (2019) N.63',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/RLiHkIWRp4S1z11zUuY3ejiZ37w=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/5a7b9a7e-0cc8-11ef-abe3-e2e03e0af6ad.jpg"]'::jsonb,
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
  'PROD-02392',
  'OS VINGADORES (2019) N.64',
  'OS VINGADORES (2019) N.64',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/HeDYVgicZwcTuZHTex6XQnvUInI=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/97a69bf0-2461-11ef-81c7-f2a69ad46e56.jpg"]'::jsonb,
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
  'PROD-02393',
  'OS VINGADORES (2019) N.65',
  'OS VINGADORES (2019) N.65',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/XQ0kmeGgbFbnjralww1ufFoIjAY=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/8ae1eafa-4e7d-11ef-896f-5e025afe733a.jpg"]'::jsonb,
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
  'PROD-02394',
  'OS VINGADORES (2019) N.66',
  'OS VINGADORES (2019) N.66',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/SZYi-DWTVZqr1fIz8wQqgXH17XY=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/ced5746c-63e4-11ef-a01d-460951302070.png"]'::jsonb,
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
  'PROD-02395',
  'OS VINGADORES (2019) N.67/10',
  'OS VINGADORES (2019) N.67/10',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/zjrEM9PzaU9_MHZxrXgvWqjJzik=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/eee643ce-eb4a-11ef-8230-fa812316df6c.jpg"]'::jsonb,
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
  'PROD-02396',
  'OS VINGADORES (2019) N.68/11',
  'OS VINGADORES (2019) N.68/11',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/RhGWUcCF4vVbKrMSX_-ppqTSycE=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/eefee528-eb4a-11ef-8230-fa812316df6c.jpg"]'::jsonb,
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
  'PROD-02397',
  'OS VINGADORES (2019) N.69/12',
  'OS VINGADORES (2019) N.69/12',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/O-Ps9wP9nn1lHuAfWbG2NMFNYx0=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/f0476af4-eb4a-11ef-8230-fa812316df6c.jpg"]'::jsonb,
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
  'PROD-02398',
  'OS VINGADORES (2019) N.70/13',
  'OS VINGADORES (2019) N.70/13',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/LiRq7CoOKNQvpyJWWK_CqSCQUWU=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/a3da8b54-eb29-11ef-8b75-5ac0f052206d.jpg"]'::jsonb,
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
  'PROD-02399',
  'OS VINGADORES (2019) N.71/14',
  'OS VINGADORES (2019) N.71/14',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/buHT1I4yMpLA_3Ms3fcJKHi5oig=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/a40202a6-eb29-11ef-a4f3-5a40d84dae09.jpg"]'::jsonb,
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
  'PROD-02400',
  'OS VINGADORES (2019) N.72/15',
  'OS VINGADORES (2019) N.72/15',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/ES105N6ubDaAz49uciMhmeqJQBw=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/c8a0d8d8-f616-11ef-9565-f2e31ca8a769.jpg"]'::jsonb,
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