-- SQL para importar produtos Brancaleone
-- Gerado em: 2025-10-17T17:52:46.765Z
-- Total de produtos: 3363
-- Fonte: brancaleone-products-1760723254011.json

-- 1. Criar distribuidor (se não existir)

-- Distribuidor já criado no batch-001

-- Lote 47 de 68
-- Produtos: 4601 até 4700



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02301',
  'ONE PIECE - 32 [REB]',
  'ONE PIECE - 32 [REB]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/jchkq92fbkWIFJ_XDYYBRas-NAU=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/9e506f00-eb29-11ef-ba4b-0ee70347c223.jpg"]'::jsonb,
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
  'PROD-02302',
  'ONE PIECE - 33 [REB]',
  'ONE PIECE - 33 [REB]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/gY-WSee4NgJ2te96StjrIm_Ynww=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/9e62fd00-eb29-11ef-a3b1-5681c2ac1d4b.jpg"]'::jsonb,
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
  'PROD-02303',
  'ONE PIECE - 34 [REB]',
  'ONE PIECE - 34 [REB]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/675T7BbF8o8qLS0vgdXLOYbkiIw=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/9e802286-eb29-11ef-a3b1-5681c2ac1d4b.jpg"]'::jsonb,
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
  'PROD-02304',
  'ONE PIECE - 35 [REB]',
  'ONE PIECE - 35 [REB]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/W3bqSfhu22cL93mH4-P_7wfJesg=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/9e83f7c6-eb29-11ef-a4f3-5a40d84dae09.jpg"]'::jsonb,
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
  'PROD-02305',
  'ONE PIECE - 36 [REB]',
  'ONE PIECE - 36 [REB]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/myfwg_wsFIooTBglRutysas4x6k=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/9ea8e7a2-eb29-11ef-a31a-8ed8743505f0.jpg"]'::jsonb,
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
  'PROD-02306',
  'ONE PIECE - 37 [REB]',
  'ONE PIECE - 37 [REB]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/ImWgCrkU_Yao6IX82n2APscQ2MM=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/9eb52cba-eb29-11ef-8fb2-6696cc3e9cb3.jpg"]'::jsonb,
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
  'PROD-02307',
  'ONE PIECE - 38 [REB]',
  'ONE PIECE - 38 [REB]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/F3pJkTgEPG7xtYdFEskBWfJOQSE=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/9ed49b5e-eb29-11ef-89a1-ce85303a26c9.jpg"]'::jsonb,
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
  'PROD-02308',
  'ONE PIECE - 40 [REB]',
  'ONE PIECE - 40 [REB]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/SecmWM_mmUjXPam51QtEPpqQvhg=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/9f01bac6-eb29-11ef-9927-fa812316df6c.jpg"]'::jsonb,
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
  'PROD-02309',
  'ONE PIECE - 41 [REB]',
  'ONE PIECE - 41 [REB]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/O97s1R6CNGxiBXQwlBRz833DPsI=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/ae2fd8ae-ee29-11ef-b473-12dfeed80616.jpg"]'::jsonb,
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
  'PROD-02310',
  'ONE PIECE - 42 [REB]',
  'ONE PIECE - 42 [REB]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/uY1oldsgduyg3EEMNsm-iJ8v2f0=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/aed4e4f2-ee29-11ef-8407-02478a88c6f1.jpg"]'::jsonb,
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
  'PROD-02311',
  'ONE PIECE - 43 [REB]',
  'ONE PIECE - 43 [REB]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/lhenGDwTk8zL13LwRDYJgYn2m-g=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/f9ad4d98-feb9-11ef-8685-6a791d69f614.jpg"]'::jsonb,
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
  'PROD-02312',
  'ONE PIECE - 44 [REB]',
  'ONE PIECE - 44 [REB]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/Og767YxWcuD_o0f8UDl845_bVm0=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/f9dea38e-feb9-11ef-8685-6a791d69f614.jpg"]'::jsonb,
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
  'PROD-02313',
  'ONE PIECE - 45 [REB]',
  'ONE PIECE - 45 [REB]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/VXug8Be4f-XFIlovQgGGTeS23MM=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/fa134d64-feb9-11ef-a2f8-fe435435affc.jpg"]'::jsonb,
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
  'PROD-02314',
  'ONE PIECE BLUE DEEP  - 1',
  'ONE PIECE BLUE DEEP  - 1',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/0L1zssX4RzvFMGOlUU_GKClnic4=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/cf9541c2-0ea0-11f0-a222-6a36246aa4cc.jpg"]'::jsonb,
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
  'PROD-02315',
  'ONE PIECE N.107',
  'ONE PIECE N.107',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/9Ld6IlyV1fDwEWGRvAgWaHXOWOg=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/5a22dd4e-0cc8-11ef-8ff6-76f7089ef791.jpg"]'::jsonb,
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
  'PROD-02316',
  'ONE PIECE N.108',
  'ONE PIECE N.108',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/RT7bYT1KLlIY0gZHofuISlMgxsU=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/84e7eb56-7fa9-11ef-b1d0-12caec0ea15c.jpg"]'::jsonb,
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
  'PROD-02317',
  'ONE PIECE N.13',
  'ONE PIECE N.13',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/dah2uHFpJ3WeSMlVzhiol4OSPig=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/ca7cf4b2-63e4-11ef-82a2-5ee4edcac102.png"]'::jsonb,
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
  'PROD-02318',
  'ONE PIECE N.14',
  'ONE PIECE N.14',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/8TIPnFCnQPZ7NE3g0E2SyMwnYRs=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/caa2834e-63e4-11ef-9cd1-4e5286e17d7d.png"]'::jsonb,
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
  'PROD-02319',
  'ONE PIECE N.15',
  'ONE PIECE N.15',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/r8i7Xuqp4eQ9I7hukSIZcY7pMj0=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/cac40ec4-63e4-11ef-858c-be57bbf68619.png"]'::jsonb,
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
  'PROD-02320',
  'ONE PIECE RECEITAS PIRATAS - 01 [REB2]',
  'ONE PIECE RECEITAS PIRATAS - 01 [REB2]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/8JJniB42W7O2BqxTG1idsPEMUHw=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/92531ab2-08c6-11f0-9f37-f25ba50402e7.jpg"]'::jsonb,
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
  'PROD-02321',
  'ONE PIECE VOL.3- AMARELO',
  'ONE PIECE VOL.3- AMARELO',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/zgZoh-eHt9ZUQ_zX1nw6pEf9LSU=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/98dc12ae-1941-11f0-bcf5-aec50aea0e33.jpg"]'::jsonb,
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
  'PROD-02322',
  'ONE PIECE [3 EM 1] - 07 [REB2]',
  'ONE PIECE [3 EM 1] - 07 [REB2]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/q1zwKWRlDJFkDbSN5lheaygcp7g=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/92e7726c-9d49-11f0-a2a0-729545bf45f0.jpg"]'::jsonb,
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
  'PROD-02323',
  'ONE PIECE [3 EM 1] - 08 [REB2]',
  'ONE PIECE [3 EM 1] - 08 [REB2]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/kAdqXUn6Vdhav8ljqApDrVxZKhk=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/286b81ac-a4ac-11f0-8bce-3af03c92463f.jpg"]'::jsonb,
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
  'PROD-02324',
  'ONE PUNCH MAN - 01 [REB 3]',
  'ONE PUNCH MAN - 01 [REB 3]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/RuqSWIsCXU2R-jg3qde7KSdBCHs=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/8fcae2da-3692-11f0-a057-ba7311aaaadc.jpg"]'::jsonb,
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
  'PROD-02325',
  'ONE PUNCH MAN - 02 [REB 3]',
  'ONE PUNCH MAN - 02 [REB 3]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/-iXEmvW_4uWHaTkGpWinyIHfdy8=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/db081902-3f2f-11f0-87b4-c2502d24ff3f.jpg"]'::jsonb,
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
  'PROD-02326',
  'ONE PUNCH MAN - 03 [REB3]',
  'ONE PUNCH MAN - 03 [REB3]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/Utm-45OYZzfZ8rJdrhTkcZJxZzk=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/9ec81902-a7c0-11f0-8792-0ab376ee0ef4.jpg"]'::jsonb,
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
  'PROD-02327',
  'ONE PUNCH MAN - 05 [REB3]',
  'ONE PUNCH MAN - 05 [REB3]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/WIdcFgxxCykftIYhi3zcaGofFM4=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/eb328cc4-9031-11f0-82c8-4a06203c34dc.jpg"]'::jsonb,
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
  'PROD-02328',
  'ONE PUNCH MAN - 06 [REB3]',
  'ONE PUNCH MAN - 06 [REB3]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/OtkAhNp7KhkenYBGBQNSKmvthtA=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/eb4ee25c-9031-11f0-82c8-4a06203c34dc.jpg"]'::jsonb,
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
  'PROD-02329',
  'ONE PUNCH MAN - 07 [REB3]',
  'ONE PUNCH MAN - 07 [REB3]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/lXeJSySNww2dfvJEHihY-xr_M_g=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/ec6f1d82-9031-11f0-82c8-4a06203c34dc.jpg"]'::jsonb,
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
  'PROD-02330',
  'ONE PUNCH MAN - 08 [REB3]',
  'ONE PUNCH MAN - 08 [REB3]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/U9CqWfo33yayFhP3vioZ3ev3qps=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/ecd611fe-9031-11f0-9754-9a60b14b6cd5.jpg"]'::jsonb,
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
  'PROD-02331',
  'ONE PUNCH MAN - 28',
  'ONE PUNCH MAN - 28',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/2SRJKjo3ERg3DcJwAO3Zurwe908=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/3f159dbe-d818-11ee-86d3-ce469b473a25.jpg"]'::jsonb,
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
  'PROD-02332',
  'ONE PUNCH MAN - 30',
  'ONE PUNCH MAN - 30',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/ybJLDLcOSViW51mKAgIAtryUGUU=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/de5ebebe-eb4a-11ef-8621-0ee70347c223.jpg"]'::jsonb,
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
  'PROD-02333',
  'ONE PUNCH MAN - 32',
  'ONE PUNCH MAN - 32',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/U2eQHbczDm-sNLi2te7Tc5kcjaw=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/ed0f7f52-9031-11f0-9754-9a60b14b6cd5.jpg"]'::jsonb,
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
  'PROD-02334',
  'ONE PUNCH MAN N.29',
  'ONE PUNCH MAN N.29',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/jHMTm6MXQS7rZro1kONbznVdpoo=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/02847370-1ca6-11ef-b80c-228c440649c1.jpg"]'::jsonb,
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
  'PROD-02335',
  'ONE PUNCH MAN N.7',
  'ONE PUNCH MAN N.7',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/Vtse1pM0-S_GxNS4DUKX5lDB9qw=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/c82a6f3c-63e4-11ef-b08c-feee356726a9.png"]'::jsonb,
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
  'PROD-02336',
  'ORBE: SOBRE OS MOVIMENTOS DA TERRA - 01',
  'ORBE: SOBRE OS MOVIMENTOS DA TERRA - 01',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/wpOxS3P2a1moNvgqpuJoVkSa2vk=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/769b9e60-4e7d-11ef-9e73-0a4d9a837559.jpg"]'::jsonb,
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
  'PROD-02337',
  'ORBE: SOBRE OS MOVIMENTOS DA TERRA - 02',
  'ORBE: SOBRE OS MOVIMENTOS DA TERRA - 02',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/Rw64OgrNJmSqYgVbiIYGc7zhny0=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/76ca1d4e-4e7d-11ef-ad76-364e4b45dfa1.jpg"]'::jsonb,
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
  'PROD-02338',
  'ORBE: SOBRE OS MOVIMENTOS DA TERRA - 03',
  'ORBE: SOBRE OS MOVIMENTOS DA TERRA - 03',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/xrO-z84AM5gS_71xXJxyrClkp1g=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/c49b1c4a-63e4-11ef-9c41-c67e4ff8d839.png"]'::jsonb,
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
  'PROD-02339',
  'ORBE: SOBRE OS MOVIMENTOS DA TERRA - 04',
  'ORBE: SOBRE OS MOVIMENTOS DA TERRA - 04',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/zi8JMfIsPt6k_yW9Y2ck67FFiiI=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/d769d1f2-eb4a-11ef-8230-fa812316df6c.jpg"]'::jsonb,
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
  'PROD-02340',
  'ORBE: SOBRE OS MOVIMENTOS DA TERRA - 05',
  'ORBE: SOBRE OS MOVIMENTOS DA TERRA - 05',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/gRgExUxVXBl1qq1Njh4ZKDjNJ6I=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/7f097f2e-7fa9-11ef-b1d0-12caec0ea15c.jpg"]'::jsonb,
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
  'PROD-02341',
  'ORBE: SOBRE OS MOVIMENTOS DA TERRA - 06',
  'ORBE: SOBRE OS MOVIMENTOS DA TERRA - 06',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/sWWI56nWnoTPc_Uoi10uNTrfsDQ=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/d7919976-eb4a-11ef-8230-fa812316df6c.jpg"]'::jsonb,
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
  'PROD-02342',
  'ORBE: SOBRE OS MOVIMENTOS DA TERRA - 07',
  'ORBE: SOBRE OS MOVIMENTOS DA TERRA - 07',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/p2vbgFwQRNwYOEIsqGaAJO764AY=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/d7a7a4f0-eb4a-11ef-8230-fa812316df6c.jpg"]'::jsonb,
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
  'PROD-02343',
  'ORBE: SOBRE OS MOVIMENTOS DA TERRA - 08',
  'ORBE: SOBRE OS MOVIMENTOS DA TERRA - 08',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/dTRJHoZ6nvEEmjrbv1V5JBD-Esk=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/940f08f8-eb29-11ef-8fb2-6696cc3e9cb3.jpg"]'::jsonb,
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
  'PROD-02344',
  'ORGULHO DC (2023)',
  'ORGULHO DC (2023)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/aUe6AP_TQXKqsD-ZlZyO3J2HaeM=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/01b95af8-d81a-11ee-83df-e2e54ed5f9f7.jpg"]'::jsonb,
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
  'PROD-02345',
  'ORGULHO DC (2024)',
  'ORGULHO DC (2024)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/u82pYcUKi0u8XpuUury7Sq6gO7Y=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/8c70af28-4e7d-11ef-9629-4a1bf48aa6ac.jpg"]'::jsonb,
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
  'PROD-02346',
  'ORGULHO DC (2025)',
  'ORGULHO DC (2025)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/9a7LNnR8ZFkUiuegrZBhxJhdnDs=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/20366886-48b7-11f0-9d89-9eda44bc3e04.jpg"]'::jsonb,
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
  'PROD-02347',
  'OS DEFENSORES (2022) VOL. 02',
  'OS DEFENSORES (2022) VOL. 02',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/ckJrsaYnodgnkzB4xHqquOOw35o=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/788d6154-d817-11ee-9371-e2a33adec5cd.jpg"]'::jsonb,
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
  'PROD-02348',
  'OS DIAS DE FOLGA DO VILAO - 1',
  'OS DIAS DE FOLGA DO VILAO - 1',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/P9Tx3ig01pDLW0QfExNNSN2fyDs=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/7d4bcac8-4e7d-11ef-975d-86ce4d9bc0e0.jpg"]'::jsonb,
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
  'PROD-02349',
  'OS DIAS DE FOLGA DO VILAO - 2',
  'OS DIAS DE FOLGA DO VILAO - 2',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/UlXr_KEZLRWHMLE_4aQ10UBWtZY=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/81895198-7fa9-11ef-b0bc-6e97175de7f7.jpg"]'::jsonb,
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
  'PROD-02350',
  'OS DIAS DE FOLGA DO VILAO - 3',
  'OS DIAS DE FOLGA DO VILAO - 3',
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