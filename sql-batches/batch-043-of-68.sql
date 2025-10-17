-- SQL para importar produtos Brancaleone
-- Gerado em: 2025-10-17T18:20:53.612Z
-- Total de produtos: 3363
-- Fonte: brancaleone-products-1760723254011.json

-- 1. Criar distribuidor (se não existir)

-- Distribuidor já criado no batch-001

-- Lote 43 de 68
-- Produtos: 4201 até 4300



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02101',
  'NARUTO GOLD EDITION N.12',
  'NARUTO GOLD EDITION N.12',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/XklEqUdC68fbd-FR12yYF2AFdIk=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/3456843c-d819-11ee-b57d-56e6c271e0a3.jpg"]'::jsonb,
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
  'PROD-02102',
  'NARUTO GOLD EDITION N.20',
  'NARUTO GOLD EDITION N.20',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/EvWgNNCIcX_QXgQRsqSxlIUNVQY=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/85a6c1de-7fa9-11ef-b1d0-12caec0ea15c.jpg"]'::jsonb,
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
  'PROD-02103',
  'NARUTO GOLD EDITION N.21',
  'NARUTO GOLD EDITION N.21',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/OnGgy_u6ySEZbNQHrMQ7bkXC03w=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/85b938c8-7fa9-11ef-b0bc-6e97175de7f7.jpg"]'::jsonb,
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
  'PROD-02104',
  'NARUTO GOLD EDITION N.22',
  'NARUTO GOLD EDITION N.22',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/qIMZZUjvD19pz21gf38KX0kqM-U=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/85ca9712-7fa9-11ef-b1d0-12caec0ea15c.jpg"]'::jsonb,
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
  'PROD-02105',
  'NARUTO GOLD EDITION N.23',
  'NARUTO GOLD EDITION N.23',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/XLWfxjjNETrJugjSzSBLpZT1NIs=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/85e36422-7fa9-11ef-b1d0-12caec0ea15c.jpg"]'::jsonb,
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
  'PROD-02106',
  'NEMESIS (REB) N.2',
  'NEMESIS (REB) N.2',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/3-hvx6bTLsRXoeNIyvEmzYr_H_o=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/3ba13886-de36-11ee-b2b6-3e63d4f4f6bf.jpg"]'::jsonb,
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
  'PROD-02107',
  'NIGHT CLUB: O CLUBE NOTURNO',
  'NIGHT CLUB: O CLUBE NOTURNO',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/SjbZsdCXPM7rV_-qto8JdWfoEg8=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/2691d306-de36-11ee-aae0-ca3362baf0a6.jpg"]'::jsonb,
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
  'PROD-02108',
  'NISEKOI - 06 [REB2]',
  'NISEKOI - 06 [REB2]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/xTkwx4iNgrIUaom5lQxiRDxXB1A=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/dee4e912-eb4a-11ef-8621-0ee70347c223.jpg"]'::jsonb,
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
  'PROD-02109',
  'NISEKOI - 07 [REB2]',
  'NISEKOI - 07 [REB2]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/XF54US_UnWIu7bxVsOP5LuUtN1g=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/def8696a-eb4a-11ef-8621-0ee70347c223.jpg"]'::jsonb,
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
  'PROD-02110',
  'NISEKOI - 08 [REB2]',
  'NISEKOI - 08 [REB2]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/uTf62ELVZXxS5mZWcVn6KephcgM=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/7e75246c-4e7d-11ef-93f5-0a914f96fc60.jpg"]'::jsonb,
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
  'PROD-02111',
  'NISEKOI - 10 [REB2]',
  'NISEKOI - 10 [REB2]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/PqKTlzvIraIL6UkEFP7Yo1UxuHQ=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/7ea6a2e4-4e7d-11ef-b144-4a1bf48aa6ac.jpg"]'::jsonb,
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
  'PROD-02112',
  'NISEKOI - 15 [REB2]',
  'NISEKOI - 15 [REB2]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/p6HpQZj35_69srMlUSt7HMJ5vX8=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/828fd1d4-7fa9-11ef-b1d0-12caec0ea15c.jpg"]'::jsonb,
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
  'PROD-02113',
  'NISEKOI - 16 [REB2]',
  'NISEKOI - 16 [REB2]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/D6bheRL5VAclq1GSufYJwxUQ33k=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/df022338-eb4a-11ef-8230-fa812316df6c.jpg"]'::jsonb,
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
  'PROD-02114',
  'NISEKOI - 17 [REB2]',
  'NISEKOI - 17 [REB2]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/Or0ahkv2CjXsMfQChFMdS3PhjrE=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/df16dc6a-eb4a-11ef-8230-fa812316df6c.jpg"]'::jsonb,
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
  'PROD-02115',
  'NISEKOI - 18 [REB2]',
  'NISEKOI - 18 [REB2]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/jckcM3vj0gAqP3068zHmrwls0Mw=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/df2924d8-eb4a-11ef-8230-fa812316df6c.jpg"]'::jsonb,
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
  'PROD-02116',
  'NISEKOI - 19 [REB2]',
  'NISEKOI - 19 [REB2]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/s-wt_bsGVufGTfXKhopfuxrmzmA=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/df3dde32-eb4a-11ef-8230-fa812316df6c.jpg"]'::jsonb,
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
  'PROD-02117',
  'NISEKOI - 20 [REB2]',
  'NISEKOI - 20 [REB2]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/2hHCwpBpSDBRXD-za9a1JmKxvw8=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/df772534-eb4a-11ef-8621-0ee70347c223.jpg"]'::jsonb,
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
  'PROD-02118',
  'NISEKOI - 21 [REB2]',
  'NISEKOI - 21 [REB2]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/XXig0XR3LaRjLybSNqm5d_IQiwo=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/20e27184-6f3c-11f0-b703-524c1decb601.jpg"]'::jsonb,
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
  'PROD-02119',
  'NISEKOI - 22 [REB2]',
  'NISEKOI - 22 [REB2]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/wN8MABSx1FiAnFjadBaHh0ud8kE=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/21148f98-6f3c-11f0-b1c7-ee865bcff8a6.jpg"]'::jsonb,
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
  'PROD-02120',
  'NISEKOI - 23 [REB2]',
  'NISEKOI - 23 [REB2]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/jHNWoq85i5Guymi4ljm-IlN8oEA=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/2114887c-6f3c-11f0-a0bf-1abfc156ef81.jpg"]'::jsonb,
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
  'PROD-02121',
  'NISEKOI - 24 [REB2]',
  'NISEKOI - 24 [REB2]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/lypA1nnB6UQRwghKMvDLz2-i4w4=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/214ada8a-6f3c-11f0-ac4b-2a24a967b96c.jpg"]'::jsonb,
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
  'PROD-02122',
  'NISEKOI - 25 [REB2]',
  'NISEKOI - 25 [REB2]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/ePeixbrdUJu_doGKiCcwL8wljZ0=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/2150876e-6f3c-11f0-9c6d-ca4ee6a64eef.jpg"]'::jsonb,
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
  'PROD-02123',
  'NISEKOI N.11',
  'NISEKOI N.11',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/oGa6whXYB7kW4GvnjYzGANix8y4=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/823d6084-7fa9-11ef-b1d0-12caec0ea15c.jpg"]'::jsonb,
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
  'PROD-02124',
  'NISEKOI N.12',
  'NISEKOI N.12',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/CAQuWuzJbsq-zKH7_Dyz2U64jbE=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/82573b8a-7fa9-11ef-b1d0-12caec0ea15c.jpg"]'::jsonb,
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
  'PROD-02125',
  'NISEKOI N.13',
  'NISEKOI N.13',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/zFxcAlB8yiQj_FbhckgHXkeeCUA=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/825ff734-7fa9-11ef-b0bc-6e97175de7f7.jpg"]'::jsonb,
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
  'PROD-02126',
  'NISEKOI N.14',
  'NISEKOI N.14',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/0wtAhUnHlVyGcpBJ27ld3AUPKNQ=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/8276cef0-7fa9-11ef-b1d0-12caec0ea15c.jpg"]'::jsonb,
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
  'PROD-02127',
  'NISEKOI N.9',
  'NISEKOI N.9',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/6Me1bzAIwwj3u962fZw_y_se_fc=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/7e9bdb48-4e7d-11ef-8063-de10c0ad3180.jpg"]'::jsonb,
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
  'PROD-02128',
  'NOITE DE TREVAS: UMA HISTORIA REAL DO BATMAN - EDI',
  'NOITE DE TREVAS: UMA HISTORIA REAL DO BATMAN - EDI',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/p-x8DIx8HCKVHbBiJIVXiTBGE60=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/e5a6718e-d819-11ee-a453-e2697ce33d53.jpg"]'::jsonb,
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
  'PROD-02129',
  'NORAGAMI - 01 [REB2]',
  'NORAGAMI - 01 [REB2]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/ilTrdpQyNt7GTvXMSDFEYCrvMx8=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/22a62eb6-6f3c-11f0-b1c7-ee865bcff8a6.jpg"]'::jsonb,
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
  'PROD-02130',
  'NORAGAMI - 09 [REB2]',
  'NORAGAMI - 09 [REB2]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/MQJ42mdK2LAlXFUGaHKHrgpFMVU=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/2bafc65e-d819-11ee-89ed-e2697ce33d53.jpg"]'::jsonb,
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
  'PROD-02131',
  'NORAGAMI - 10 [REB2]',
  'NORAGAMI - 10 [REB2]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/K_ShKVQK9WwyTN-VBBLnb2kF6gI=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/2bd8764e-d819-11ee-b57d-56e6c271e0a3.jpg"]'::jsonb,
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
  'PROD-02132',
  'NORAGAMI - 11 [REB 2]',
  'NORAGAMI - 11 [REB 2]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/bHlfaAUyB5Y3MU1qKKPH6fpIUUA=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/2c7fa69e-d819-11ee-89ed-e2697ce33d53.jpg"]'::jsonb,
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
  'PROD-02133',
  'NORAGAMI - 15 [REB2]',
  'NORAGAMI - 15 [REB2]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/WiPfA95jdAAZqt0gDbLmuBBaOpw=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/9fd82f84-eb29-11ef-9927-fa812316df6c.jpg"]'::jsonb,
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
  'PROD-02134',
  'NORAGAMI - 22 [REB]',
  'NORAGAMI - 22 [REB]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/6e8ma05-TlAeSOZSKUhjdBJfxew=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/e932667e-eb4a-11ef-8230-fa812316df6c.jpg"]'::jsonb,
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
  'PROD-02135',
  'NORAGAMI N.12',
  'NORAGAMI N.12',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/M1XjVPyRmw5R33t2_AOGPGRpPhI=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/2cbbcfd4-d819-11ee-947a-32937b3ded24.jpg"]'::jsonb,
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
  'PROD-02136',
  'NORAGAMI N.13',
  'NORAGAMI N.13',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/v77EXcT4TsBiTwRlxKzSQvwL9Eo=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/2d417d64-d819-11ee-bb5a-de7d367e92b3.jpg"]'::jsonb,
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
  'PROD-02137',
  'NORAGAMI N.19',
  'NORAGAMI N.19',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/cLanLOIcze_MDjf1HDWi0Q9SZYk=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/84c5021a-4e7d-11ef-b6fd-42ec70ffd9b9.jpg"]'::jsonb,
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
  'PROD-02138',
  'NORAGAMI N.20',
  'NORAGAMI N.20',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/zEpziW143ZwyJwgXIfr7-2W64gc=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/84b2a76e-4e7d-11ef-a6a6-6a75532b239b.jpg"]'::jsonb,
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
  'PROD-02139',
  'NORAGAMI N.21',
  'NORAGAMI N.21',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/h9kN5cccZi3hLgtV-ic9_1JTUj0=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/84cf06c0-4e7d-11ef-8063-de10c0ad3180.jpg"]'::jsonb,
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
  'PROD-02140',
  'NORAGAMI N.23',
  'NORAGAMI N.23',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/YInPLIBdDSKkF2NAj4G6zyT7gjg=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/84e87998-4e7d-11ef-92ef-26e51fdcafe4.jpg"]'::jsonb,
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
  'PROD-02141',
  'NORAGAMI N.27',
  'NORAGAMI N.27',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/s36lo6yxmFSfR8LxYW7JrBULJh8=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/854381be-7fa9-11ef-b0bc-6e97175de7f7.jpg"]'::jsonb,
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
  'PROD-02142',
  'NOSSAS CORES - 01',
  'NOSSAS CORES - 01',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/vMtiQT06YgVCJQCd-i5aUBkQK8Q=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/f0d9a1be-d816-11ee-ae34-e2e54ed5f9f7.jpg"]'::jsonb,
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
  'PROD-02143',
  'NOSSAS CORES - 02',
  'NOSSAS CORES - 02',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/4yAAMZrZYZ8v9rLkPPA-rDj4__E=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/f13434f8-d816-11ee-b54b-e2697ce33d53.jpg"]'::jsonb,
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
  'PROD-02144',
  'NOVISSIMA WOLVERINE (NOVA MARVEL DELUXE)',
  'NOVISSIMA WOLVERINE (NOVA MARVEL DELUXE)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/CT_APs-CJJlugVkBv_eYuETeHeU=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/c60d9e14-d81a-11ee-9df9-5a86bcbeb6e3.jpg"]'::jsonb,
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
  'PROD-02145',
  'NOVISSIMA WOLVERINE VOL.02 (NOVA MARVEL DELUXE)',
  'NOVISSIMA WOLVERINE VOL.02 (NOVA MARVEL DELUXE)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/jfUxGtUO03QIDg0rvtPGgpJtJDI=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/b107050a-eb29-11ef-8cc5-0ee70347c223.jpg"]'::jsonb,
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
  'PROD-02146',
  'NOVISSIMO CAPITÃO AMERICA: SAM WILSON',
  'NOVISSIMO CAPITÃO AMERICA: SAM WILSON',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/fDOwPYJ8jh60ukeutHQNVzZu6yA=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/a53c4f14-eb29-11ef-8b75-5ac0f052206d.jpg"]'::jsonb,
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
  'PROD-02147',
  'NOVO QUARTETO FANTASTICO (LENDAS MARVEL)',
  'NOVO QUARTETO FANTASTICO (LENDAS MARVEL)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/9sK2cr9iqCyLa6CaGuQ7szHlynU=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/15feccfc-d818-11ee-86d3-ce469b473a25.jpg"]'::jsonb,
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
  'PROD-02148',
  'NOVOS MUTANTES (2023) N.1',
  'NOVOS MUTANTES (2023) N.1',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/-WzIXJyyQihaU9tSEmaxMaZVQ7c=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/44d09dac-de36-11ee-831d-e63691a02f25.jpg"]'::jsonb,
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
  'PROD-02149',
  'NOVOS MUTANTES: LEGIAO LETAL N.1',
  'NOVOS MUTANTES: LEGIAO LETAL N.1',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/OFeRFSsA038aoCFmZoApcYgw_Gg=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/8bd7dba4-4e7d-11ef-ac80-aac1f48a1fd2.jpg"]'::jsonb,
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
  'PROD-02150',
  'O ALVO HUMANO VOL. 02',
  'O ALVO HUMANO VOL. 02',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/b39j6HpDoiWKtMS0DSTsi9ozo7g=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/8eb3c7e4-d816-11ee-a1d7-e2a33adec5cd.jpg"]'::jsonb,
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