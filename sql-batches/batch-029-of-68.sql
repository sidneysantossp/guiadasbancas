-- SQL para importar produtos Brancaleone
-- Gerado em: 2025-10-17T17:52:46.765Z
-- Total de produtos: 3363
-- Fonte: brancaleone-products-1760723254011.json

-- 1. Criar distribuidor (se não existir)

-- Distribuidor já criado no batch-001

-- Lote 29 de 68
-- Produtos: 2801 até 2900



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01401',
  'HIRAYASUMI - 07',
  'HIRAYASUMI - 07',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/eR3-wC-FAODFFJtq-FaR_wH4sx4=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/02add358-98c6-11f0-bdc9-b6c5438103c7.jpg"]'::jsonb,
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
  'PROD-01402',
  'HIRAYASUMI N.1',
  'HIRAYASUMI N.1',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/WX_rltbheto_IjQeo5gLNWsRrWE=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/80e117c6-7fa9-11ef-b0bc-6e97175de7f7.jpg"]'::jsonb,
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
  'PROD-01403',
  'HITMAN - EDICAO DE LUXO VOL. 1 (REB)',
  'HITMAN - EDICAO DE LUXO VOL. 1 (REB)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/4eWVhra-nLd9tz0SKIw6_KnXiDk=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/98bd0a4e-eb29-11ef-a4f3-5a40d84dae09.jpg"]'::jsonb,
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
  'PROD-01404',
  'HOMEM DE FERRO: O DEMONIO NA GARRAFA (MARVEL ESSENCIAIS)',
  'HOMEM DE FERRO: O DEMONIO NA GARRAFA (MARVEL ESSENCIAIS)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/7RVrF1DTB9mUVTLQ1iDKeQZbuCA=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/250116ee-a4ac-11f0-8b51-cad07a812184.jpg"]'::jsonb,
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
  'PROD-01405',
  'HOMEM DE FERRO: OS CINCO PESADELOS (MARVEL ESSENCIAIS)',
  'HOMEM DE FERRO: OS CINCO PESADELOS (MARVEL ESSENCIAIS)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/m5lN-cGwmwQDH666WLWudfiePCk=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/641775de-da9c-11ee-b415-da2490dbf0ff.jpg"]'::jsonb,
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
  'PROD-01406',
  'HOMEM-ARANHA 2099 (2023) N.2',
  'HOMEM-ARANHA 2099 (2023) N.2',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/14ihrpc-pzSQc2FixcHl9JAeVVU=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/d4dbfe5e-119a-11ef-bfb2-36a257064742.jpg"]'::jsonb,
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
  'PROD-01407',
  'HOMEM-ARANHA 2099 (MARVEL VINTAGE) N.3',
  'HOMEM-ARANHA 2099 (MARVEL VINTAGE) N.3',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/M6l0WKidFgQqjzGXrIxgDZQmb3c=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/80ac7e44-7fa9-11ef-b1d0-12caec0ea15c.jpg"]'::jsonb,
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
  'PROD-01408',
  'HOMEM-ARANHA 2099 VOL.04 (MARVEL VINTAGE)',
  'HOMEM-ARANHA 2099 VOL.04 (MARVEL VINTAGE)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/pw81g6CtVmZuE0NHxp8zhv42vX8=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/98004cf6-1941-11f0-901b-ca0fbdcf3a7f.jpg"]'::jsonb,
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
  'PROD-01409',
  'HOMEM-ARANHA 2099: TERROR ATEMPORAL',
  'HOMEM-ARANHA 2099: TERROR ATEMPORAL',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/hLgG2Uiu2NXHyAzsV2z2bnMFry8=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/ec29eb2c-eb4a-11ef-8621-0ee70347c223.jpg"]'::jsonb,
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
  'PROD-01410',
  'HOMEM-ARANHA AMA MARY JANE VOL.03 (MARVEL TEENS)',
  'HOMEM-ARANHA AMA MARY JANE VOL.03 (MARVEL TEENS)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/mBMtdK-_8wQTcu9VluOZ3WigUYQ=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/9fa8bd76-eb29-11ef-9e36-2a856f41baa0.jpg"]'::jsonb,
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
  'PROD-01411',
  'HOMEM-ARANHA NOIR (MARVEL N.1',
  'HOMEM-ARANHA NOIR (MARVEL N.1',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/zH3U4YnEk7uXTzcqVczpkYb4l3k=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/567a286c-f032-11ee-a970-b6e36e15f24a.jpg"]'::jsonb,
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
  'PROD-01412',
  'HOMEM-ARANHA SUPERIOR (2024) VOL.01',
  'HOMEM-ARANHA SUPERIOR (2024) VOL.01',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/4VYRMSDtp4gHAeSHD0uQ8EXLCGU=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/acd0fd44-ee29-11ef-a5f9-962440bb65d0.jpg"]'::jsonb,
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
  'PROD-01413',
  'HOMEM-ARANHA SUPERIOR (2024) VOL.02',
  'HOMEM-ARANHA SUPERIOR (2024) VOL.02',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/WwroLXpOmshdx8TtJVxgMBOySAw=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/c562c7ee-642a-11f0-855d-8e3a9156bfaa.jpg"]'::jsonb,
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
  'PROD-01414',
  'HOMEM-ARANHA: A SAGA DO CLONE VOL.03',
  'HOMEM-ARANHA: A SAGA DO CLONE VOL.03',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/UdSxETJGFAbnnZFY1Qfiv9fTGns=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/c33e473c-63e4-11ef-a28d-a27a78b28783.png"]'::jsonb,
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
  'PROD-01415',
  'HOMEM-ARANHA: A SAGA DO CLONE VOL.05',
  'HOMEM-ARANHA: A SAGA DO CLONE VOL.05',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/DOS-HQcOT4BO7EnSA9CKKkjNnlA=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/aa716372-ee29-11ef-be57-cecd8a9fcaf0.jpg"]'::jsonb,
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
  'PROD-01416',
  'HOMEM-ARANHA: A SAGA DO CLONE VOL.06',
  'HOMEM-ARANHA: A SAGA DO CLONE VOL.06',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/aSHzJQWImhUPdyJWpmCEJ0hsl1s=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/d6e70100-eb4a-11ef-a198-2a5f63e8aebc.jpg"]'::jsonb,
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
  'PROD-01417',
  'HOMEM-ARANHA: A SAGA DO CLONE VOL.07',
  'HOMEM-ARANHA: A SAGA DO CLONE VOL.07',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/XOY9Ww7oA8pxPcARctdtHTLSdxU=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/927e3b1c-eb29-11ef-9927-fa812316df6c.jpg"]'::jsonb,
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
  'PROD-01418',
  'HOMEM-ARANHA: A SAGA DO CLONE VOL.08',
  'HOMEM-ARANHA: A SAGA DO CLONE VOL.08',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/IZ8nNacc04u0LzCuZ7gu5JQ9vKY=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/92a8c9a4-eb29-11ef-a3b1-5681c2ac1d4b.jpg"]'::jsonb,
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
  'PROD-01419',
  'HOMEM-ARANHA: A SAGA DO CLONE VOL.09',
  'HOMEM-ARANHA: A SAGA DO CLONE VOL.09',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/VfNDSvneIyfdnGH08MNgvcuTFF4=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/f0e43492-0143-11f0-9602-e6e8567c501d.jpg"]'::jsonb,
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
  'PROD-01420',
  'HOMEM-ARANHA: A SAGA DO CLONE VOL.11',
  'HOMEM-ARANHA: A SAGA DO CLONE VOL.11',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/la0sM3C7TTrXBAh1MHyEAA2B0l4=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/d787799e-3f2f-11f0-87b4-c2502d24ff3f.jpg"]'::jsonb,
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
  'PROD-01421',
  'HOMEM-ARANHA: A SAGA DO CLONE VOL.12',
  'HOMEM-ARANHA: A SAGA DO CLONE VOL.12',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/bx4jFgI62kSdbRQI5XcqaHiXI7c=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/2b38f304-44b4-11f0-90fa-7e281e739724.jpg"]'::jsonb,
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
  'PROD-01422',
  'HOMEM-ARANHA: A SAGA DO CLONE VOL.13',
  'HOMEM-ARANHA: A SAGA DO CLONE VOL.13',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/cvNFBjR-oKNmAsM50WmKAcNC6D4=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/1d19f4e2-69af-11f0-9a47-2e3660e82a7f.jpg"]'::jsonb,
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
  'PROD-01423',
  'HOMEM-ARANHA: A SAGA DO CLONE VOL.14',
  'HOMEM-ARANHA: A SAGA DO CLONE VOL.14',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/ROChKHLWulGRA4lyCBsVuagwlAQ=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/5495a32c-8b5f-11f0-819b-cef4535c59b2.jpg"]'::jsonb,
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
  'PROD-01424',
  'HOMEM-ARANHA: A SAGA DO CLONE VOL.15',
  'HOMEM-ARANHA: A SAGA DO CLONE VOL.15',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/4gCIC8FlLkjV5SPr1l6HXF2NCVg=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/e69e4f5e-9031-11f0-9754-9a60b14b6cd5.jpg"]'::jsonb,
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
  'PROD-01425',
  'HOMEM-ARANHA: AS TIRAS VOL.05 (1985-1986) - ED. DEFINITIVA',
  'HOMEM-ARANHA: AS TIRAS VOL.05 (1985-1986) - ED. DEFINITIVA',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/qmzeI2gZs07zg5rFlNEqDylGxGg=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/bd8773c6-d817-11ee-a4a8-5a86bcbeb6e3.jpg"]'::jsonb,
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
  'PROD-01426',
  'HOMEM-ARANHA: CORREDOR POLONES VOL. 1 + CAIXA',
  'HOMEM-ARANHA: CORREDOR POLONES VOL. 1 + CAIXA',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/GMYk3UsChGUS-_NyzJNHFa3F8As=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/8093a464-7fa9-11ef-b1d0-12caec0ea15c.jpg"]'::jsonb,
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
  'PROD-01427',
  'HOMEM-ARANHA: CORREDOR POLONES VOL. 2',
  'HOMEM-ARANHA: CORREDOR POLONES VOL. 2',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/zH1G-qkmKm-97QRFDSPlt4yy1Pw=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/dadf885e-eb4a-11ef-8621-0ee70347c223.jpg"]'::jsonb,
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
  'PROD-01428',
  'HOMEM-ARANHA: INDIA (MARVEL VINTAGE)',
  'HOMEM-ARANHA: INDIA (MARVEL VINTAGE)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/vXRMGme7ywb23lTu1P89IEcOBHg=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/b5936314-d817-11ee-a3da-e2697ce33d53.jpg"]'::jsonb,
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
  'PROD-01429',
  'HOMEM-ARANHA: O IMPOSTOR N.1',
  'HOMEM-ARANHA: O IMPOSTOR N.1',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/66Tbsa_KPvorihNPOZFbUO7acz8=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/591eafcc-0cc8-11ef-a93f-8e4a61da3cfa.jpg"]'::jsonb,
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
  'PROD-01430',
  'HOMEM-ARANHA: POTESTADE',
  'HOMEM-ARANHA: POTESTADE',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/qZd5yJlXlM4N_4rEjL2Q6hgWPZY=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/98363fb4-1941-11f0-85af-b67ae79b02ea.jpg"]'::jsonb,
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
  'PROD-01431',
  'HOMEM-ARANHA: POTESTADE 2',
  'HOMEM-ARANHA: POTESTADE 2',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/D7gSIN_0e04bPsMJZurN8VkbMFo=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/d995256a-3f2f-11f0-87b4-c2502d24ff3f.jpg"]'::jsonb,
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
  'PROD-01432',
  'HOMEM-BORRACHA POR KYLE BAKER -  EDICAO EMBORRACHADA DE LUXO',
  'HOMEM-BORRACHA POR KYLE BAKER -  EDICAO EMBORRACHADA DE LUXO',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/Ft90qdz2N_r8LBAr9zvSBNIU7d4=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/7fc730c8-7fa9-11ef-b1d0-12caec0ea15c.jpg"]'::jsonb,
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
  'PROD-01433',
  'HOMEM-FORMIGA & VESPA (2023)',
  'HOMEM-FORMIGA & VESPA (2023)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/Al0u6CVBo4lpSVFScpuj2OJAFjY=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/78c9b84e-da7d-11ee-9032-fe9018619bf2.jpg"]'::jsonb,
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
  'PROD-01434',
  'HOMENS-ARANHA: MUNDOS COLIDEM',
  'HOMENS-ARANHA: MUNDOS COLIDEM',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/qx6u7VggyxyZ4u4pyNE107xTeOk=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/b5cf6f1c-d817-11ee-a4a8-5a86bcbeb6e3.jpg"]'::jsonb,
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
  'PROD-01435',
  'HONEY LEMON SODA - 01',
  'HONEY LEMON SODA - 01',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/COM9DjI-z2jJSO0ca6skGs2EZj8=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/da52be90-3f2f-11f0-a17d-1ac4d5553c9e.jpg"]'::jsonb,
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
  'PROD-01436',
  'HONEY LEMON SODA - 03',
  'HONEY LEMON SODA - 03',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/yMM9LjobVTb27ZOAjfKBVmpht6Q=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/47c653da-8b5f-11f0-b3d9-165df9e621a1.jpg"]'::jsonb,
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
  'PROD-01437',
  'HONEY LEMON SODA N.2',
  'HONEY LEMON SODA N.2',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/FzJFPgG9e0q4Oycu_z2tY4kVk2A=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/c581ad3a-642a-11f0-8bc5-aa2e25388802.jpg"]'::jsonb,
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
  'PROD-01438',
  'HORIMIYA - 01 [REB]',
  'HORIMIYA - 01 [REB]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/-5Xk66LWZklBTQdmxxoYlR9HjeQ=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/37c99698-7fd1-11f0-a5af-de5e70a27ff7.jpg"]'::jsonb,
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
  'PROD-01439',
  'HORIMIYA - 14',
  'HORIMIYA - 14',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/c3pgmOGNrmGbkYf9dWhRNIEphrE=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/d34205dc-d817-11ee-a3da-e2697ce33d53.jpg"]'::jsonb,
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
  'PROD-01440',
  'HORIMIYA N.17',
  'HORIMIYA N.17',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/zqd4St7hV_sbE50TBlIzL5Q5oGw=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/95f685b2-e583-11ee-9d7c-f2cdc5a9e7d5.jpg"]'::jsonb,
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
  'PROD-01441',
  'HORIMIYA N.17',
  'HORIMIYA N.17',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/zqd4St7hV_sbE50TBlIzL5Q5oGw=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/95f685b2-e583-11ee-9d7c-f2cdc5a9e7d5.jpg"]'::jsonb,
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
  'PROD-01442',
  'HORIMIYA N.2',
  'HORIMIYA N.2',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/5RU0GBhgg_AN3jFz1M3YUMo7bdA=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/cf46a8a2-d817-11ee-9a1e-da2373bc7c0b.jpg"]'::jsonb,
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
  'PROD-01443',
  'HORIMIYA N.3',
  'HORIMIYA N.3',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/v7L48Ft5rh0ZMmdChNiBrKI_-YE=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/cf69cb98-d817-11ee-86d3-ce469b473a25.jpg"]'::jsonb,
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
  'PROD-01444',
  'HULK: CINZA (MARVEL ESSENCIAIS) N.1',
  'HULK: CINZA (MARVEL ESSENCIAIS) N.1',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/XolQ3rsLBPF3_zKeZW_ds7qf-qs=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/76d71ada-4e7d-11ef-975d-86ce4d9bc0e0.jpg"]'::jsonb,
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
  'PROD-01445',
  'HULK: GRAND DESIGN',
  'HULK: GRAND DESIGN',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/fa4nzyn3FdcQ1XwRohv608fsq2w=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/d4a6d128-d817-11ee-a3da-e2697ce33d53.jpg"]'::jsonb,
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
  'PROD-01446',
  'ILIADA (GRAPHIC DISNEY)',
  'ILIADA (GRAPHIC DISNEY)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/dln0vhP18-WJ_rb9nD0kGnXO6Gw=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/c5ce46f4-642a-11f0-b55e-2a081a9d92fa.jpg"]'::jsonb,
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
  'PROD-01447',
  'IMPERIO SECRETO (NOVA MARVEL DELUXE)',
  'IMPERIO SECRETO (NOVA MARVEL DELUXE)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/B8LhP59MTFQit1MX8oHYq5D3M44=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/d57c73b4-d817-11ee-a3da-e2697ce33d53.jpg"]'::jsonb,
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
  'PROD-01448',
  'INITIAL D - 01',
  'INITIAL D - 01',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/nRNCSrf0kLqBO8erLrI5taKoYAo=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/99214342-eb29-11ef-913d-52f5d450f8a6.jpg"]'::jsonb,
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
  'PROD-01449',
  'INITIAL D - 02',
  'INITIAL D - 02',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/KL6nhFoLbGucQ_k3iR38MoJ2QVw=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/9936e2b0-eb29-11ef-a3b1-5681c2ac1d4b.jpg"]'::jsonb,
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
  'PROD-01450',
  'INITIAL D - 03',
  'INITIAL D - 03',
  0.00,
  '["https://d1y59j9xdhixp0.cloudfront.net/2dede6cdcecb2ad9d5102618f5d141cd35e28c9a/images/dc6d5f0bf4b929fa80b9.svg"]'::jsonb,
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