-- SQL para importar produtos Brancaleone
-- Gerado em: 2025-10-17T18:20:53.612Z
-- Total de produtos: 3363
-- Fonte: brancaleone-products-1760723254011.json

-- 1. Criar distribuidor (se não existir)

-- Distribuidor já criado no batch-001

-- Lote 54 de 68
-- Produtos: 5301 até 5400



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02651',
  'SERAPH OF THE END N.9',
  'SERAPH OF THE END N.9',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/tflExwBh0yg5QurlZcOyg6JxVKw=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/7f36c8a6-4e7d-11ef-9b64-0a2a8c62a641.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02652',
  'SGT. ROCK VS. O EXERCITO DE ZUMBIS',
  'SGT. ROCK VS. O EXERCITO DE ZUMBIS',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/AOYXF8ECb-Ts8hooMKLc6lIEck8=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/85ef6460-da7d-11ee-b95c-12792fd81a45.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02653',
  'SHANG-CHI VOL.04',
  'SHANG-CHI VOL.04',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/-gIanGFOx_REnZHIsCmblbTE8Kw=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/47f55f6c-d81a-11ee-a8da-56e6c271e0a3.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02654',
  'SHANGRI-LA FRONTIER - 12',
  'SHANGRI-LA FRONTIER - 12',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/258s87FE0PbQ8zFxUyjX_qGE5KY=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/c34873ee-d8a0-11ee-b8d0-26337c3739c7.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02655',
  'SHANGRI-LA FRONTIER - 15',
  'SHANGRI-LA FRONTIER - 15',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/L_b2nQie-8L3IHEdi6QTefh9-Ls=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/0c489f8e-eb4b-11ef-8230-fa812316df6c.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02656',
  'SHANGRI-LA FRONTIER - 16',
  'SHANGRI-LA FRONTIER - 16',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/6tKB-pnM0Tiv8QGsCVf9Vd7YYOk=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/ab0dd2a0-eb29-11ef-a31a-8ed8743505f0.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02657',
  'SHANGRI-LA FRONTIER - 17',
  'SHANGRI-LA FRONTIER - 17',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/1BLlcOq3C1cc4j5Bi3nHtePsbQE=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/ab280ca6-eb29-11ef-8b75-5ac0f052206d.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02658',
  'SHANGRI-LA FRONTIER - 18',
  'SHANGRI-LA FRONTIER - 18',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/XmQ9TVeFiPmpF1lDmYoQgNNiLDg=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/9d960f7e-08c6-11f0-9f37-f25ba50402e7.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02659',
  'SHANGRI-LA FRONTIER - 19',
  'SHANGRI-LA FRONTIER - 19',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/6TdQlrhguUBp4AgIizNCMDCS_fo=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/8b9a856c-3692-11f0-b775-ca6651de2295.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02660',
  'SHANGRI-LA FRONTIER - 20',
  'SHANGRI-LA FRONTIER - 20',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/qUSWBSJZkLdssGhq6w6F3XFhkAc=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/51a1358c-8b5f-11f0-b3d9-165df9e621a1.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02661',
  'SHANGRI-LA FRONTIER - 9',
  'SHANGRI-LA FRONTIER - 9',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/bhstqW0qj7lpYy4d0X8MMRJcuuI=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/460689e2-d81a-11ee-9cda-5a86bcbeb6e3.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02662',
  'SHANGRI-LA FRONTIER N.1',
  'SHANGRI-LA FRONTIER N.1',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/YPwS0B7NTOTHqsBXBp3eaSlUhFU=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/8da9677c-4e7d-11ef-8179-b2d60c13b884.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02663',
  'SHANGRI-LA FRONTIER N.10',
  'SHANGRI-LA FRONTIER N.10',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/H0ZxFfH3qIrYS5g2cdtQhRfG7pw=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/4657afac-d81a-11ee-bd84-e2697ce33d53.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02664',
  'SHANGRI-LA FRONTIER N.11',
  'SHANGRI-LA FRONTIER N.11',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/0PthMoHS54nD0i1u2Y1X5bHrjrQ=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/46c5c3e8-d81a-11ee-ae87-e2e54ed5f9f7.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02665',
  'SHANGRI-LA FRONTIER N.13',
  'SHANGRI-LA FRONTIER N.13',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/Dcw-3Tq0QIjB21Hv2m4EcvjOHXM=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/d2c1a862-119a-11ef-9c09-e6e3c151f638.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02666',
  'SHANGRI-LA FRONTIER N.14',
  'SHANGRI-LA FRONTIER N.14',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/-Nrsen4daUF3Yhh4SetiVhEud7Y=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/8dd125aa-4e7d-11ef-8063-de10c0ad3180.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02667',
  'SHANGRI-LA FRONTIER N.2',
  'SHANGRI-LA FRONTIER N.2',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/xk3Bm55lSm2Hq32W99e-WiIHh-Y=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/8dc647ac-4e7d-11ef-8594-6e8213fe308c.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02668',
  'SHANGRI-LA FRONTIER N.8',
  'SHANGRI-LA FRONTIER N.8',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/9i_CNa0osepvE8D9IKX2Jc5D3NM=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/45a9fbfa-d81a-11ee-bd84-e2697ce33d53.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02669',
  'SHANNA, A MULHER-DEMONIO (MARVEL VINTAGE) N.1',
  'SHANNA, A MULHER-DEMONIO (MARVEL VINTAGE) N.1',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/5e06gxcSyEhsXA7hSnFfF_GZUeI=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/0f8370ac-f68c-11ee-a436-7eaf4107e4f6.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02670',
  'SHAZAM (2023) N.1',
  'SHAZAM (2023) N.1',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/XsJamL1HwQbzZiTP6kDgR84hQ7Y=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/8e258fa0-4e7d-11ef-93f5-0a914f96fc60.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02671',
  'SHAZAM (2023) VOL.02',
  'SHAZAM (2023) VOL.02',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/vuQTnOtfWdoduvx4wDUbZ2Vfpqw=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/fffe77d0-feb9-11ef-b6c6-4a91a624d386.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02672',
  'SHAZAM E OS SETE REINOS MAGICOS (DC DELUXE)',
  'SHAZAM E OS SETE REINOS MAGICOS (DC DELUXE)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/MpoiDWg6LGmZ0EWNCThI9FbapCY=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/c44fe240-d8a0-11ee-82f3-be3c8dbb0cbf.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02673',
  'SHAZAM: COM UMA PALAVRA MAGICA (DC DELUXE)',
  'SHAZAM: COM UMA PALAVRA MAGICA (DC DELUXE)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/cuuEnOx7SwcXwbV2TyigTB1aSXk=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/ae69d74c-dd64-11ee-b24e-1610a00c4b23.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02674',
  'SHE IS SO BEAUTIFUL - 01',
  'SHE IS SO BEAUTIFUL - 01',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/HNwqkfArWyTnrYfT3ad4hjSv8V8=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/c7992eb8-642a-11f0-bfa0-6253877c6ac4.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02675',
  'SLAM DUNK - 06 [REB2]',
  'SLAM DUNK - 06 [REB2]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/mLzS0cTPitUz_kxh_VxCq7vI4g8=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/c867eefc-63e4-11ef-9c41-c67e4ff8d839.png"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02676',
  'SLAM DUNK - 07 [REB2]',
  'SLAM DUNK - 07 [REB2]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/lC8s7C8fiaV7tuKe1iVn-yswX0g=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/c88709b8-63e4-11ef-b3ed-92cab3059871.png"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02677',
  'SLAM DUNK - 15 [REB.]',
  'SLAM DUNK - 15 [REB.]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/heNzcQvMhbkSMnrSu2XS_-1PfVU=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/3aea1528-7fd1-11f0-a5af-de5e70a27ff7.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02678',
  'SLAM DUNK N.2',
  'SLAM DUNK N.2',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/rckYu7oIOrIle5-mG-bNhXXVLzw=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/c4df5314-f616-11ef-aa08-9af237dc8f86.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02679',
  'SLAM DUNK N.3',
  'SLAM DUNK N.3',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/-AKQb2-tFwy2oQ6mhWHVTO1H68k=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/7e2cf49e-4e7d-11ef-9e33-da9904c52884.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02680',
  'SLAM DUNK N.4',
  'SLAM DUNK N.4',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/CukMZbDCOyVXVfOqsltGnwaFaX4=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/7e3c7a7c-4e7d-11ef-9b64-0a2a8c62a641.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02681',
  'SLAM DUNK N.5',
  'SLAM DUNK N.5',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/UEe8WTOVSEua5CbZFebVgPkuHd0=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/7e841bb6-4e7d-11ef-b438-b279561b7695.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02682',
  'SLEEPER: ESPIONAGEM DE ALTO RISCO VOL. 01 - EDICAO DE LUXO',
  'SLEEPER: ESPIONAGEM DE ALTO RISCO VOL. 01 - EDICAO DE LUXO',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/hQVPuzyt2BPvxNQvBUftTj-xuEc=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/4e153da4-d81a-11ee-ae87-e2e54ed5f9f7.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02683',
  'SLEEPER: ESPIONAGEM DE ALTO RISCO VOL. 02 - EDICAO DE LUXO',
  'SLEEPER: ESPIONAGEM DE ALTO RISCO VOL. 02 - EDICAO DE LUXO',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/AzGtT5s9DmT5ZKYU2_IoLTJoXuo=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/4e58d3f2-d81a-11ee-bd84-e2697ce33d53.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02684',
  'SOCIEDADE DA JUSTICA DA AMERICA POR GEOFF JOHNS VOL. 02 (DC',
  'SOCIEDADE DA JUSTICA DA AMERICA POR GEOFF JOHNS VOL. 02 (DC',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/rQrmrW8_yNNp6FxRrQwbsN-MTGA=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/c7b67d38-642a-11f0-855d-8e3a9156bfaa.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02685',
  'SOCIEDADE DA JUSTICA DA AMÉRICA: A NOVA ERA DE OURO VOL. 01',
  'SOCIEDADE DA JUSTICA DA AMÉRICA: A NOVA ERA DE OURO VOL. 01',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/l4p49dirzMe4oZtLOVBAq-WTnls=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/4ef0ca36-d81a-11ee-ae87-e2e54ed5f9f7.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02686',
  'SOCIEDADE ESPORTIVA PALMEIRAS - 1914-2024 (INGLES)',
  'SOCIEDADE ESPORTIVA PALMEIRAS - 1914-2024 (INGLES)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/guCtD1-IVvz1QMxQK6-q6wrblw0=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/aa6a05d0-eb29-11ef-913d-52f5d450f8a6.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02687',
  'SOLO LEVELING - 02 [REB]',
  'SOLO LEVELING - 02 [REB]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/HVaWWJgIkaGeCVZMMMfWfOCxSA4=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/2d8ad122-44b4-11f0-aadf-ca2b21e04af3.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02688',
  'SOLO LEVELING - 03 [REB]',
  'SOLO LEVELING - 03 [REB]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/lsxt5DTtU3_a4eI00YAVriB8-kg=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/2dac5a90-44b4-11f0-90fa-7e281e739724.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02689',
  'SOLO LEVELING - 04 [REB]',
  'SOLO LEVELING - 04 [REB]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/93ys4ACBCkENsvzhjgKgq-mZ6k8=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/aba1799c-eb29-11ef-913d-52f5d450f8a6.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02690',
  'SOLO LEVELING - 05 [REB]',
  'SOLO LEVELING - 05 [REB]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/HcATFUEaaqtuKkXWMm7-YklldA8=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/005167e2-feba-11ef-a18c-ea0d7fffd497.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02691',
  'SOLO LEVELING - 06 [REB]',
  'SOLO LEVELING - 06 [REB]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/Q3l1yClcyIjDn4uZSt-MzlF8W88=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/8cbf06f2-3692-11f0-9b5f-32c7a3eebbfc.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02692',
  'SOLO LEVELING - 08',
  'SOLO LEVELING - 08',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/M_mRHn_IlhchsSVRxTzAtdcFwpo=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/fac1d262-9031-11f0-9754-9a60b14b6cd5.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02693',
  'SOLO LEVELING NOVEL - 03',
  'SOLO LEVELING NOVEL - 03',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/fx2lrdp_58nGqyJoigOcpo5XRlk=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/1402da1e-eb4b-11ef-8230-fa812316df6c.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02694',
  'SOLO LEVELING NOVEL - 05',
  'SOLO LEVELING NOVEL - 05',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/MP1NRD3DHuZUilXsJ3o2KxbmzRo=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/a304b6a6-a7c0-11f0-8792-0ab376ee0ef4.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02695',
  'SOLO LEVELING NOVEL N.2',
  'SOLO LEVELING NOVEL N.2',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/gKOougxjo5Q28OKGqnsS92_RUHU=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/8e6c2abe-4e7d-11ef-8897-0ec18585415d.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02696',
  'SONO BISQUE DOLL: MINHA ADORÁVEL COSPLAYER - 02',
  'SONO BISQUE DOLL: MINHA ADORÁVEL COSPLAYER - 02',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/zq1znrH8Xr2smddD9ycS5ThasMo=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/c0fb8932-d8a0-11ee-b8d0-26337c3739c7.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02697',
  'SONO BISQUE DOLL: MINHA ADORÁVEL COSPLAYER - 04',
  'SONO BISQUE DOLL: MINHA ADORÁVEL COSPLAYER - 04',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/vFysbo75CJEqtUQIU-ehzvbPqiY=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/50298370-d81a-11ee-bd84-e2697ce33d53.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02698',
  'SONO BISQUE DOLL: MINHA ADORÁVEL COSPLAYER - 05',
  'SONO BISQUE DOLL: MINHA ADORÁVEL COSPLAYER - 05',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/fXieB_d3qopFZLZe7rfSkK5M914=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/ab628f62-dd64-11ee-acab-aa9ab6aaa2c8.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02699',
  'SONO BISQUE DOLL: MINHA ADORÁVEL COSPLAYER - 06',
  'SONO BISQUE DOLL: MINHA ADORÁVEL COSPLAYER - 06',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/E8Vx2YYFygj5R9oLxXyx2yA_V34=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/505a24f8-d81a-11ee-ae87-e2e54ed5f9f7.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02700',
  'SONO BISQUE DOLL: MINHA ADORÁVEL COSPLAYER - 07',
  'SONO BISQUE DOLL: MINHA ADORÁVEL COSPLAYER - 07',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/JlB3OPscrPXiqRGZr4aPxldCHq0=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/cd6ab2c4-d8a0-11ee-9406-061c358a76e0.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();