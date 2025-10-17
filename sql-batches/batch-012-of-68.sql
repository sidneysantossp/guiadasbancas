-- SQL para importar produtos Brancaleone
-- Gerado em: 2025-10-17T17:52:46.765Z
-- Total de produtos: 3363
-- Fonte: brancaleone-products-1760723254011.json

-- 1. Criar distribuidor (se não existir)

-- Distribuidor já criado no batch-001

-- Lote 12 de 68
-- Produtos: 1101 até 1200



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00551',
  'BERSERK - EDIÇÃO DE LUXO - 07 [REB5]',
  'BERSERK - EDIÇÃO DE LUXO - 07 [REB5]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/Yed15AkQruuAL0XHbajBLneZUlw=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/4a853c4e-8b5f-11f0-b3d9-165df9e621a1.jpg"]'::jsonb,
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
  'PROD-00552',
  'BERSERK - EDIÇÃO DE LUXO - 08 [REB5]',
  'BERSERK - EDIÇÃO DE LUXO - 08 [REB5]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/mTLcx43s5NS-AYQ0DmHFN82Emi8=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/4aaab32a-8b5f-11f0-ab6e-7e1ab2cbb1e5.jpg"]'::jsonb,
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
  'PROD-00553',
  'BERSERK - EDIÇÃO DE LUXO - 09 [REB5]',
  'BERSERK - EDIÇÃO DE LUXO - 09 [REB5]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/q8qk762i7Lip8UzXIyCCcH9Ea6M=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/4aa53314-8b5f-11f0-b3d9-165df9e621a1.jpg"]'::jsonb,
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
  'PROD-00554',
  'BERSERK - EDIÇÃO DE LUXO - 10 [REB5]',
  'BERSERK - EDIÇÃO DE LUXO - 10 [REB5]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/SvlWUg78Uokj16Z2wcsjc1j_D2g=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/4ac3306c-8b5f-11f0-b876-cef4535c59b2.jpg"]'::jsonb,
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
  'PROD-00555',
  'BERSERK - EDIÇÃO DE LUXO - 16 [REB 4]',
  'BERSERK - EDIÇÃO DE LUXO - 16 [REB 4]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/kTXTN5qR70pa4Yv89MYdOCY9FII=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/fc9f86b0-feb9-11ef-b6c6-4a91a624d386.jpg"]'::jsonb,
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
  'PROD-00556',
  'BERSERK - EDIÇÃO DE LUXO - 17 [REB 4]',
  'BERSERK - EDIÇÃO DE LUXO - 17 [REB 4]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/C4E7SFWRlpBC1gu7gW6Y0t7_B40=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/8eaef59e-22d9-11ef-a85e-c697234fbd13.jpg"]'::jsonb,
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
  'PROD-00557',
  'BERSERK - EDIÇÃO DE LUXO - 21 [REB 4]',
  'BERSERK - EDIÇÃO DE LUXO - 21 [REB 4]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/5rLCOunIFEaiVbFwkj-CxMRoPlY=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/fcf4d610-feb9-11ef-8ddf-8eaa2bb036c2.jpg"]'::jsonb,
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
  'PROD-00558',
  'BERSERK - EDIÇÃO DE LUXO - 22 [REB3]',
  'BERSERK - EDIÇÃO DE LUXO - 22 [REB3]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/_kNJUP6tG-e0LA1KswMcvkokdDw=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/a01f7196-eb29-11ef-b7b8-460343881edd.jpg"]'::jsonb,
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
  'PROD-00559',
  'BERSERK - EDIÇÃO DE LUXO - 23 [REB 4]',
  'BERSERK - EDIÇÃO DE LUXO - 23 [REB 4]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/z-8gu3JqBA6c1PvOy7Ae0zYoSj8=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/fcf0ef50-feb9-11ef-8685-6a791d69f614.jpg"]'::jsonb,
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
  'PROD-00560',
  'BERSERK - EDIÇÃO DE LUXO - 24 [REB 4]',
  'BERSERK - EDIÇÃO DE LUXO - 24 [REB 4]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/I-gLc_leiFsk1zPkgSH3anqAzy4=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/fd1f8298-feb9-11ef-a189-ea2ec8e8c791.jpg"]'::jsonb,
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
  'PROD-00561',
  'BERSERK - EDIÇÃO DE LUXO - 31 [REB2]',
  'BERSERK - EDIÇÃO DE LUXO - 31 [REB2]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/JiH28n8qS0bZvYL0-aDBbC23s2I=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/9b3afce0-1941-11f0-901b-ca0fbdcf3a7f.jpg"]'::jsonb,
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
  'PROD-00562',
  'BERSERK - EDIÇÃO DE LUXO - 32 [REB2]',
  'BERSERK - EDIÇÃO DE LUXO - 32 [REB2]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/PGE4kRF1PIBPg2PlO1Wae59thdQ=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/9b51e0f4-1941-11f0-85af-b67ae79b02ea.jpg"]'::jsonb,
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
  'PROD-00563',
  'BERSERK - EDIÇÃO DE LUXO - 42',
  'BERSERK - EDIÇÃO DE LUXO - 42',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/41fi8Zu48s06JD11XWXf6hC0Gro=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/ce30807a-eb47-11ef-9d0f-8a85576a563e.jpg"]'::jsonb,
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
  'PROD-00564',
  'BERSERK 42 - TAROT [REB]',
  'BERSERK 42 - TAROT [REB]',
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



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00565',
  'BERSERK N.83',
  'BERSERK N.83',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/JlycZqyUN0HCYl6v10dXD3TJTms=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/7578d836-4e7d-11ef-8b01-66fb588c5617.jpg"]'::jsonb,
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
  'PROD-00566',
  'BESOURO AZUL (TBD) N.1',
  'BESOURO AZUL (TBD) N.1',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/nU3yHofjzSG2oqcQvxv2eHhXMc4=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/daea34f4-7faa-11ef-92e2-6e97175de7f7.jpg"]'::jsonb,
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
  'PROD-00567',
  'BESOURO AZUL: DIA DA FORMATURA',
  'BESOURO AZUL: DIA DA FORMATURA',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/Kc1TMpDW8fQOrbcMQFxOMb1NlkY=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/6c52e9a0-da7d-11ee-9fe4-12792fd81a45.jpg"]'::jsonb,
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
  'PROD-00568',
  'BESOURO AZUL: PARA SEMPRE AZUL',
  'BESOURO AZUL: PARA SEMPRE AZUL',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/nX1M6tAsgdYjQ3ISz5l41_Zugwk=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/3cd6f232-2475-11f0-854d-ba327c171cd7.jpg"]'::jsonb,
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
  'PROD-00569',
  'BIBLIOTECA HISTÓRICA MAURICIO DE SOUSA - MAGALI: 1989',
  'BIBLIOTECA HISTÓRICA MAURICIO DE SOUSA - MAGALI: 1989',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/iSfhojs0sXkZO1gqkVriGbmT27s=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/ab9b801e-eb47-11ef-80c6-0ee70347c223.jpg"]'::jsonb,
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
  'PROD-00570',
  'BIBLIOTECA MAURICIO DE SOUSA - CEBOLINHA VOL.2 (1974)',
  'BIBLIOTECA MAURICIO DE SOUSA - CEBOLINHA VOL.2 (1974)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/QF9xGHNuaxWT7opl3ryMtjiueSI=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/1ab8c7be-3350-11ef-8e13-6206394e6409.jpg"]'::jsonb,
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
  'PROD-00571',
  'BIBLIOTECA MAURICIO DE SOUSA: CASCÃO VOL.01 - 1982',
  'BIBLIOTECA MAURICIO DE SOUSA: CASCÃO VOL.01 - 1982',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/ykO6BJCJMcxUsyJb1dNPlB1QVwk=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/d7ae105e-3f2f-11f0-87b4-c2502d24ff3f.jpg"]'::jsonb,
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
  'PROD-00572',
  'BIBLIOTECA TEX N.8',
  'BIBLIOTECA TEX N.8',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/l6swS9xYDapGg3j7g_13mEwrBRY=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/00466154-1ca6-11ef-bc32-def7b1441874.jpg"]'::jsonb,
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
  'PROD-00573',
  'BIDU: JUNTOS (GRAPHIC MSP VOL. 13) (CD) (REB)',
  'BIDU: JUNTOS (GRAPHIC MSP VOL. 13) (CD) (REB)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/bzPn0c-BQ_aXVlcfWFZ3gzZl2Jg=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/6a95d6ee-da9c-11ee-be2d-3226a44a89fc.jpg"]'::jsonb,
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
  'PROD-00574',
  'BILLY BAT - 01',
  'BILLY BAT - 01',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/XZvIw_cgjFr9QdDbg_nIdUpTVjw=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/b07827ec-ee29-11ef-b85d-021edfc7654f.jpg"]'::jsonb,
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
  'PROD-00575',
  'BILLY BAT - 02',
  'BILLY BAT - 02',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/yyYJmf8Tc00KXR4C6t262wCn09A=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/d1d40b94-0ea0-11f0-b6d9-5e5a8362666a.jpg"]'::jsonb,
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
  'PROD-00576',
  'BILLY BAT - 03',
  'BILLY BAT - 03',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/MMiaReUlbvJeFlihYaxjktwu_7k=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/d72041e8-3f2f-11f0-87b4-c2502d24ff3f.jpg"]'::jsonb,
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
  'PROD-00577',
  'BILLY BAT - 04',
  'BILLY BAT - 04',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/cRJ0rh7L2AUa81vYlXvXm_XhO4E=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/e5a53f2c-9031-11f0-9754-9a60b14b6cd5.jpg"]'::jsonb,
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
  'PROD-00578',
  'BIOGRAFIA MAURICIO EM QUADRINHOS 90 ANOS N.1',
  'BIOGRAFIA MAURICIO EM QUADRINHOS 90 ANOS N.1',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/gnRXkENZtZnroruO3OOC404UosE=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/2e5caa26-44b4-11f0-90fa-7e281e739724.jpg"]'::jsonb,
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
  'PROD-00579',
  'BLACK BUTLER - 32',
  'BLACK BUTLER - 32',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/FFzarkwTMVVXhNDwdC_IDY6vvGk=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/450a02a0-d818-11ee-82a8-e2697ce33d53.jpg"]'::jsonb,
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
  'PROD-00580',
  'BLACK BUTLER - 33',
  'BLACK BUTLER - 33',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/lxPK66ZLmTiNC-PPqF0l4Cx473A=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/45833738-d818-11ee-a4a8-5a86bcbeb6e3.jpg"]'::jsonb,
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
  'PROD-00581',
  'BLACK BUTLER - 34',
  'BLACK BUTLER - 34',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/MG0TTVOZ8duxT5OsXrs_L3VZ8TU=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/c6ff8c06-eb47-11ef-a496-fa812316df6c.jpg"]'::jsonb,
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
  'PROD-00582',
  'BLACK CLOVER - 08 [REB2]',
  'BLACK CLOVER - 08 [REB2]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/LgZ_Q2_5V3lfd39fxmn8QHb2HRA=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/ed7c0be0-9031-11f0-9754-9a60b14b6cd5.jpg"]'::jsonb,
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
  'PROD-00583',
  'BLACK CLOVER - 1 [REB 5]',
  'BLACK CLOVER - 1 [REB 5]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/ylITNcU_Lkhcc38a9z1NFMT3rqw=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/999e2718-1941-11f0-a070-52fdc73cc03d.jpg"]'::jsonb,
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
  'PROD-00584',
  'BLACK CLOVER - 2 [REB 4]',
  'BLACK CLOVER - 2 [REB 4]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/IDGqFGQUdrIrpbrvEiR38NhKfus=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/21780b72-6f3c-11f0-b5d2-36049232c238.jpg"]'::jsonb,
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
  'PROD-00585',
  'BLACK CLOVER - 3 [REB 3]',
  'BLACK CLOVER - 3 [REB 3]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/iQJh8xzBTvQ7J258WA6YF3O3BCA=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/8fed3da8-3692-11f0-b775-ca6651de2295.jpg"]'::jsonb,
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
  'PROD-00586',
  'BLACK CLOVER - 4 [REB3]',
  'BLACK CLOVER - 4 [REB3]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/3eL0R7hJnNxRjgj937oyD8TewLc=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/86c55e5a-4dac-11f0-869e-c68fdf865aae.jpg"]'::jsonb,
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
  'PROD-00587',
  'BLACK CLOVER - 6 [REB2]',
  'BLACK CLOVER - 6 [REB2]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/y_bp7sxIBZpSONkLDAyqbdTNM4I=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/3b4775ba-7fd1-11f0-a5af-de5e70a27ff7.jpg"]'::jsonb,
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
  'PROD-00588',
  'BLACK CLOVER N.5',
  'BLACK CLOVER N.5',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/sFSzOazntubD_TkbrugWBArsKmw=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/0a67a52a-f68c-11ee-942b-ae5dd6b4afa0.jpg"]'::jsonb,
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
  'PROD-00589',
  'BLEACH REMIX (2 EM 1) - 01 [REB3]',
  'BLEACH REMIX (2 EM 1) - 01 [REB3]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/DzplJS4B8c1y9KrXohkJZdagybw=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/b46407ea-ee29-11ef-8796-12951ae5d9d3.jpg"]'::jsonb,
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
  'PROD-00590',
  'BLEACH REMIX (2 EM 1) - 03 [REB2]',
  'BLEACH REMIX (2 EM 1) - 03 [REB2]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/sY0qPpluQzE-PFDLrd6923hBDPo=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/b4c5028e-ee29-11ef-bae9-4ad799f2e8c9.jpg"]'::jsonb,
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
  'PROD-00591',
  'BLEACH REMIX (2 EM 1) - 04 [REB2]',
  'BLEACH REMIX (2 EM 1) - 04 [REB2]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/z8LAPTWOH24ZgWiB1U4EnMSO_Tc=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/49e93f74-feba-11ef-b468-da66c594d682.jpg"]'::jsonb,
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
  'PROD-00592',
  'BLEACH REMIX (2 EM 1) - 05 [REB2]',
  'BLEACH REMIX (2 EM 1) - 05 [REB2]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/W4CXGxd7whScTD9c17dfxPJb000=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/49f47420-feba-11ef-a7cd-6a791d69f614.jpg"]'::jsonb,
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
  'PROD-00593',
  'BLEACH REMIX (2 EM 1) - 25',
  'BLEACH REMIX (2 EM 1) - 25',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/vFvq5ba9a9eLW71SKBVjYR5Hm1A=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/b205f81c-eb47-11ef-80c6-0ee70347c223.jpg"]'::jsonb,
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
  'PROD-00594',
  'BLISTER 10 ENV  MARVEL 24 - DEADPOOL',
  'BLISTER 10 ENV  MARVEL 24 - DEADPOOL',
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



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00595',
  'BLISTER 10 ENV 3 PALAVRINHAS',
  'BLISTER 10 ENV 3 PALAVRINHAS',
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



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00596',
  'BLISTER 10 ENV BARBIE 65TH ANNIVERSARY',
  'BLISTER 10 ENV BARBIE 65TH ANNIVERSARY',
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



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00597',
  'BLISTER 10 ENV CB 2024',
  'BLISTER 10 ENV CB 2024',
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



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00598',
  'BLISTER 10 ENV COMITE OLIMPICO DO BRASIL 2024',
  'BLISTER 10 ENV COMITE OLIMPICO DO BRASIL 2024',
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



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00599',
  'BLISTER 10 ENV CONMEBOL LIBERTADORES 2025',
  'BLISTER 10 ENV CONMEBOL LIBERTADORES 2025',
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



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00600',
  'BLISTER 10 ENV COPA LIBERTADORES 2024',
  'BLISTER 10 ENV COPA LIBERTADORES 2024',
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