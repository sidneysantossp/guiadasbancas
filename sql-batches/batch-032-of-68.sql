-- SQL para importar produtos Brancaleone
-- Gerado em: 2025-10-17T18:20:53.612Z
-- Total de produtos: 3363
-- Fonte: brancaleone-products-1760723254011.json

-- 1. Criar distribuidor (se não existir)

-- Distribuidor já criado no batch-001

-- Lote 32 de 68
-- Produtos: 3101 até 3200



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01551',
  'KAIJU 8 - 13',
  'KAIJU 8 - 13',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/s6F_4My4dIeKcqP7JfsyA0hrjFk=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/99f8e450-eb29-11ef-a3b1-5681c2ac1d4b.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01552',
  'KAIJU 8 - 14',
  'KAIJU 8 - 14',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/hBDPoRWXQ9It-uTOBjOQ31RrzIg=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/84e5e960-4dac-11f0-b840-c6f13973e51f.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01553',
  'KAIJU 8 - 15',
  'KAIJU 8 - 15',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/4gXWGHeAj85F0DYVIrVTBy6tAOc=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/256f51cc-a4ac-11f0-84d7-06a1e9b2bf33.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01554',
  'KAIJU N.° 8 - 01 [REB 2]',
  'KAIJU N.° 8 - 01 [REB 2]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/84XkKn63uRx1ww26tN-Bzj-LYa0=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/2c3b5bd4-44b4-11f0-aadf-ca2b21e04af3.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01555',
  'KAIJU Nº 8 - 01 [REB3]',
  'KAIJU Nº 8 - 01 [REB3]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/ZM7JJfiZkyc1SRWvu9qtpLg1Irg=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/8fc70fca-9d49-11f0-aa76-a269c7cd0ff8.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01556',
  'KAIJU Nº 8 - 02 [REB3]',
  'KAIJU Nº 8 - 02 [REB3]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/x-Vc_GSKxt5zX-KAFFcKHJI1Pb8=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/900d2d52-9d49-11f0-b41f-021fbb39d696.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01557',
  'KANOJO MO KANOJO - CONFISSÕES E NAMORADAS - 05',
  'KANOJO MO KANOJO - CONFISSÕES E NAMORADAS - 05',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/S-UbEC5vzkTMf6pa8oB0YFH2Bzg=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/a8b2af0e-dd64-11ee-ada2-5ac55e249383.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01558',
  'KANOJO MO KANOJO - CONFISSÕES E NAMORADAS - 06',
  'KANOJO MO KANOJO - CONFISSÕES E NAMORADAS - 06',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/0HIMNgVpn3-39ZnotUYfCahoKrk=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/01bb7948-d818-11ee-a4a8-5a86bcbeb6e3.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01559',
  'KANOJO MO KANOJO - CONFISSÕES E NAMORADAS - 07',
  'KANOJO MO KANOJO - CONFISSÕES E NAMORADAS - 07',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/4HbPstrbTvrvhzO1K--et0Q6bVo=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/01ee8216-d818-11ee-bce8-e2e54ed5f9f7.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01560',
  'KANOJO MO KANOJO - CONFISSÕES E NAMORADAS - 08',
  'KANOJO MO KANOJO - CONFISSÕES E NAMORADAS - 08',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/ZkrqOz0il9lE5qq4PuJ_4gp9BJg=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/0281acf8-d818-11ee-86d3-ce469b473a25.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01561',
  'KANOJO MO KANOJO - CONFISSÕES E NAMORADAS - 09',
  'KANOJO MO KANOJO - CONFISSÕES E NAMORADAS - 09',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/6gPlBtxFWTQs4LuQcNw0-prZoC4=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/f874c5d6-d89b-11ee-a97f-26337c3739c7.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01562',
  'KANOJO MO KANOJO - CONFISSÕES E NAMORADAS - 10',
  'KANOJO MO KANOJO - CONFISSÕES E NAMORADAS - 10',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/TS0ct9Dj4WuFKCjI4L5vbLpmvhk=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/8f1dfa8e-3692-11f0-b6e7-d6897a03fa64.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01563',
  'KANOJO MO KANOJO - CONFISSÕES E NAMORADAS - 11',
  'KANOJO MO KANOJO - CONFISSÕES E NAMORADAS - 11',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/1Kj5Ve-0JUkdudd4br3hlc-OfHU=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/f8f36be8-d89b-11ee-8d35-d6162862a756.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01564',
  'KANOJO MO KANOJO - CONFISSÕES E NAMORADAS - 12',
  'KANOJO MO KANOJO - CONFISSÕES E NAMORADAS - 12',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/Dp_YSQ_D6Z83gGWtvrk-ixJDMWc=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/f9653ed0-d89b-11ee-ad97-ee1b80a1fcb2.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01565',
  'KANOJO MO KANOJO - CONFISSÕES E NAMORADAS - 13',
  'KANOJO MO KANOJO - CONFISSÕES E NAMORADAS - 13',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/cxFGgvfkEFo7pXYz9wW7CaE8eYw=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/02c92722-d818-11ee-a3da-e2697ce33d53.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01566',
  'KANOJO MO KANOJO - CONFISSÕES E NAMORADAS - 14',
  'KANOJO MO KANOJO - CONFISSÕES E NAMORADAS - 14',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/IpRSUFmF8UAtK9bnpsmS1dOSzVE=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/033bbda0-d818-11ee-86d3-ce469b473a25.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01567',
  'KANOJO MO KANOJO - CONFISSÕES E NAMORADAS - 15',
  'KANOJO MO KANOJO - CONFISSÕES E NAMORADAS - 15',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/TgXczP9Jwv8G9zr5AVOQIUHeEjY=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/0387dbc2-d818-11ee-a4a8-5a86bcbeb6e3.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01568',
  'KANOJO MO KANOJO - CONFISSÕES E NAMORADAS - 16',
  'KANOJO MO KANOJO - CONFISSÕES E NAMORADAS - 16',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/Roj8gJt10gBj1-MQhyyuPC5eY18=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/03f88db8-d818-11ee-9a1e-da2373bc7c0b.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01569',
  'KATANA BEAST - 01',
  'KATANA BEAST - 01',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/Nh0wvr5_kqBXH-s189WLm_KrzSc=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/847aed2c-4dac-11f0-869e-c68fdf865aae.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01570',
  'KATANA BEAST - 02',
  'KATANA BEAST - 02',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/Z6THHKvY-kXWJ3guNX32lJ8lAK0=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/48284d2e-8b5f-11f0-b876-cef4535c59b2.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01571',
  'KEMONO JIHEN: INCIDENTES N.17',
  'KEMONO JIHEN: INCIDENTES N.17',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/bQQyllmK1u_bU8_S5XPYHB8Hbv0=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/3e5e4f0c-e497-11ee-b6a7-e2b250ff01a0.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01572',
  'KEMONO JIHEN: INCIDENTES N.18',
  'KEMONO JIHEN: INCIDENTES N.18',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/3fcsn0dLC9PCsKsdRNH1j3cuIsI=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/2a5df3d6-ebef-11ee-8810-22f5b7d93b6a.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01573',
  'KEMONO JIHEN: INCIDENTES SOBRENATURAIS - 03',
  'KEMONO JIHEN: INCIDENTES SOBRENATURAIS - 03',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/Ht_VL93fmVEGHwRH8J6mbK5KefM=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/f060cf40-d817-11ee-a4a8-5a86bcbeb6e3.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01574',
  'KEMONO JIHEN: INCIDENTES SOBRENATURAIS - 04',
  'KEMONO JIHEN: INCIDENTES SOBRENATURAIS - 04',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/siLHWtCg82xrEGwYTakLsSeDN2w=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/f085c53e-d817-11ee-86d3-ce469b473a25.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01575',
  'KEMONO JIHEN: INCIDENTES SOBRENATURAIS - 05',
  'KEMONO JIHEN: INCIDENTES SOBRENATURAIS - 05',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/0RHLu9MoGP7Ct0k3mUpy-PiQH2s=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/f107f612-d817-11ee-86d3-ce469b473a25.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01576',
  'KEMONO JIHEN: INCIDENTES SOBRENATURAIS - 06',
  'KEMONO JIHEN: INCIDENTES SOBRENATURAIS - 06',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/vn1Y1qX8kda8orZJe2CJOMZaU8A=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/f12e27b0-d817-11ee-a4a8-5a86bcbeb6e3.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01577',
  'KEMONO JIHEN: INCIDENTES SOBRENATURAIS - 07',
  'KEMONO JIHEN: INCIDENTES SOBRENATURAIS - 07',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/6TxtOZK8WfDaSanLCCE6bspn0Pw=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/98cc4306-1941-11f0-b283-1e5c1e943676.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01578',
  'KEMONO JIHEN: INCIDENTES SOBRENATURAIS - 08',
  'KEMONO JIHEN: INCIDENTES SOBRENATURAIS - 08',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/gE3J1d9LkgfPzBMFOWSbMujSrFg=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/f1e0a584-d817-11ee-a3da-e2697ce33d53.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01579',
  'KEMONO JIHEN: INCIDENTES SOBRENATURAIS - 09',
  'KEMONO JIHEN: INCIDENTES SOBRENATURAIS - 09',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/i32Et8hGJvQ1RpMvlktdB-EktyE=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/f2746332-d817-11ee-86d3-ce469b473a25.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01580',
  'KEMONO JIHEN: INCIDENTES SOBRENATURAIS - 10',
  'KEMONO JIHEN: INCIDENTES SOBRENATURAIS - 10',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/4Fjr6qykqWJyUY12d6kP_iD16Dw=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/f2a1a824-d817-11ee-9a1e-da2373bc7c0b.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01581',
  'KEMONO JIHEN: INCIDENTES SOBRENATURAIS - 11',
  'KEMONO JIHEN: INCIDENTES SOBRENATURAIS - 11',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/jGMMNCgPyaoROMLKebbXa11fxNs=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/f317dd32-d817-11ee-bce8-e2e54ed5f9f7.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01582',
  'KEMONO JIHEN: INCIDENTES SOBRENATURAIS - 12',
  'KEMONO JIHEN: INCIDENTES SOBRENATURAIS - 12',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/AGR9pt5a3Z8RLBo9QC2EjhwQ99M=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/f352e0d0-d817-11ee-a3da-e2697ce33d53.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01583',
  'KEMONO JIHEN: INCIDENTES SOBRENATURAIS - 13',
  'KEMONO JIHEN: INCIDENTES SOBRENATURAIS - 13',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/m9I0FgYMOgNqeLMk7Yvs3eQm5Js=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/f3e0a92e-d817-11ee-a4a8-5a86bcbeb6e3.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01584',
  'KEMONO JIHEN: INCIDENTES SOBRENATURAIS - 14',
  'KEMONO JIHEN: INCIDENTES SOBRENATURAIS - 14',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/lINL2oS6FSx_4RIi5WYemmyyPnI=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/f4036356-d817-11ee-86d3-ce469b473a25.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01585',
  'KEMONO JIHEN: INCIDENTES SOBRENATURAIS - 15',
  'KEMONO JIHEN: INCIDENTES SOBRENATURAIS - 15',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/nk94B88XkPd9xZ0bNrtslseMDYw=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/f588e750-d817-11ee-86d3-ce469b473a25.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01586',
  'KEMONO JIHEN: INCIDENTES SOBRENATURAIS - 16',
  'KEMONO JIHEN: INCIDENTES SOBRENATURAIS - 16',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/PsNvBHGQhg8qtWMOvlb4gnIqaBc=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/f5a53590-d817-11ee-a4a8-5a86bcbeb6e3.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01587',
  'KEMONO JIHEN: INCIDENTES SOBRENATURAIS - 20',
  'KEMONO JIHEN: INCIDENTES SOBRENATURAIS - 20',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/y0CCF6Lqp7w52uY5A9gmp_pKtVA=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/7d149080-4e7d-11ef-9b64-0a2a8c62a641.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01588',
  'KEMONO JIHEN: INCIDENTES SOBRENATURAIS -19',
  'KEMONO JIHEN: INCIDENTES SOBRENATURAIS -19',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/mEQ7PQUOj9YHRlfGngd0D0Ji0XQ=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/bdb686ca-0125-11ef-9900-52ec7c1eeb4f.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01589',
  'KINGDOM HEARTS II VOL.02 (KINGDOM HEARTS VOL. 08)',
  'KINGDOM HEARTS II VOL.02 (KINGDOM HEARTS VOL. 08)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/gr9aQX2wC_mm8iXfNPK5KHQlpPY=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/84ff4ab0-d817-11ee-a3da-e2697ce33d53.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01590',
  'KINGDOM HEARTS II VOL.03 (KINGDOM HEARTS VOL.09)',
  'KINGDOM HEARTS II VOL.03 (KINGDOM HEARTS VOL.09)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/f3_thBAU4BQuSU2n36G4KtcxB9Y=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/85890156-d817-11ee-b124-5a86bcbeb6e3.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01591',
  'KINGDOM HEARTS II VOL.04 (KINGDOM HEARTS VOL.10)',
  'KINGDOM HEARTS II VOL.04 (KINGDOM HEARTS VOL.10)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/4pd1qDIa37Vq2g5Jve7BIx7UrIY=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/85da098e-d817-11ee-a3da-e2697ce33d53.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01592',
  'KINGDOM HEARTS II VOL.05 (KINGDOM HEARTS VOL.11)',
  'KINGDOM HEARTS II VOL.05 (KINGDOM HEARTS VOL.11)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/QEwNbi7ow9kMRjb2hXk_DPhu-AA=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/86618634-d817-11ee-a7e4-ce469b473a25.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01593',
  'KIT 1LIV+29 QUAD.DE 20 CROMOS+TAB. FOOTBALL AM. US 2025/26',
  'KIT 1LIV+29 QUAD.DE 20 CROMOS+TAB. FOOTBALL AM. US 2025/26',
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
  'PROD-01594',
  'KIT PLANETES',
  'KIT PLANETES',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/hMgWv8oYtX79caIf5msROiTiptY=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/4871a1a4-8b5f-11f0-b3d9-165df9e621a1.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01595',
  'KOKORO NO PROGRAM N.1',
  'KOKORO NO PROGRAM N.1',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/QOZsz9T8Kvadyvry1u5K0fMT6zE=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/047a6720-d818-11ee-86d3-ce469b473a25.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01596',
  'KOKORO NO PROGRAM N.2',
  'KOKORO NO PROGRAM N.2',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/gLUrX_M_FDa-NW0vp6S8nZrcpik=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/3efce20c-e497-11ee-83ff-7ee42cfe9644.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01597',
  'KOKORO NO PROGRAM N.3',
  'KOKORO NO PROGRAM N.3',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/-1XqBDunr_o3bT-ozhecza3O5AU=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/01abdfba-1ca6-11ef-b80c-228c440649c1.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01598',
  'KOKORO NO PROGRAM: O CODIGO DO CORACAO - 04',
  'KOKORO NO PROGRAM: O CODIGO DO CORACAO - 04',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/9f8OrxaSdEXi6cUKiitlsoFKS9U=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/274530d4-2ce4-11ef-a9d6-52a12b2a7219.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01599',
  'KOMI NÃO CONSEGUE SE COMUNICAR - 11',
  'KOMI NÃO CONSEGUE SE COMUNICAR - 11',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/0S__tVTMLwIa9r4WFVPUrSwOidk=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/08d1f108-d818-11ee-a4a8-5a86bcbeb6e3.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01600',
  'KOMI NÃO CONSEGUE SE COMUNICAR - 12',
  'KOMI NÃO CONSEGUE SE COMUNICAR - 12',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/Fr65n_XBOOcIifPFdYLAzgw2TJM=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/095176c6-d818-11ee-bce8-e2e54ed5f9f7.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();