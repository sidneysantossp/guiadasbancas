-- SQL para importar produtos Brancaleone
-- Gerado em: 2025-10-17T18:20:53.612Z
-- Total de produtos: 3363
-- Fonte: brancaleone-products-1760723254011.json

-- 1. Criar distribuidor (se não existir)

-- Distribuidor já criado no batch-001

-- Lote 67 de 68
-- Produtos: 6601 até 6700



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-03301',
  'WOTAKOI: O AMOR É DIFÍCIL PARA OTAKUS - 08 [REB 2]',
  'WOTAKOI: O AMOR É DIFÍCIL PARA OTAKUS - 08 [REB 2]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/m8_tL8HBv4ZuWjrzDxK1emxgFq4=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/8e3b0992-d818-11ee-a1cf-e2e54ed5f9f7.jpg"]'::jsonb,
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
  'PROD-03302',
  'WOTAKOI: O AMOR É DIFÍCIL PARA OTAKUS - 09 [REB]',
  'WOTAKOI: O AMOR É DIFÍCIL PARA OTAKUS - 09 [REB]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/OlkG8qdajgoVOuaA4HK-6bmCWcw=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/8ed58ecc-d818-11ee-a11f-5a86bcbeb6e3.jpg"]'::jsonb,
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
  'PROD-03303',
  'X - 1',
  'X - 1',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/S7HHGkKYAUdCLJ2NYNY04nvm9jU=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/b2210e74-ee29-11ef-afd7-c684cf759fc8.jpg"]'::jsonb,
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
  'PROD-03304',
  'X - 2',
  'X - 2',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/u0Az3D-UZzI8gMdqlJsL8LL4VfY=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/5551271e-8b5f-11f0-b3d9-165df9e621a1.jpg"]'::jsonb,
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
  'PROD-03305',
  'X - 3',
  'X - 3',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/2qJPSdQyAuggWR8i6O2IMO9jg0U=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/a494c4a2-a7c0-11f0-96ab-2e54fc51120d.jpg"]'::jsonb,
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
  'PROD-03306',
  'X-FACTOR POR PETER DAVID (MARVEL OMNIBUS)',
  'X-FACTOR POR PETER DAVID (MARVEL OMNIBUS)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/FFCzF1hNtUGilPzHVl11JDRaoFc=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/2db51448-a4ac-11f0-ac43-c20d3852b6b7.jpg"]'::jsonb,
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
  'PROD-03307',
  'X-MEN ''92 VOL 1',
  'X-MEN ''92 VOL 1',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/Hx-gZ1ihLy9Tl2iBND-lW-2NLb8=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/913d0eb6-4e7d-11ef-acbf-3efedc1d37c9.jpg"]'::jsonb,
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
  'PROD-03308',
  'X-MEN ''92 VOL 2',
  'X-MEN ''92 VOL 2',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/EEj9e8y0VhD_-vF94zZq9fjLOo8=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/d1fdce0a-63e4-11ef-9e43-faeb4ca196ac.png"]'::jsonb,
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
  'PROD-03309',
  'X-MEN ''92 VOL.03',
  'X-MEN ''92 VOL.03',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/ivAZaWD-DGPp76yPVIpSNH-v2P8=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/d4d53b3e-eb4a-11ef-8230-fa812316df6c.jpg"]'::jsonb,
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
  'PROD-03310',
  'X-MEN ''92 VOL.04',
  'X-MEN ''92 VOL.04',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/g008j2BYpF_HZuqhJv41A2UPLVc=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/d50449ce-eb4a-11ef-8230-fa812316df6c.jpg"]'::jsonb,
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
  'PROD-03311',
  'X-MEN ''97',
  'X-MEN ''97',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/trztQODTmTNMx3ME_3dfBLWlGeE=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/d523ea04-eb4a-11ef-8621-0ee70347c223.jpg"]'::jsonb,
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
  'PROD-03312',
  'X-MEN (2020) N.70',
  'X-MEN (2020) N.70',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/dq7cUy17KjPbDaV1YRR8789NjuI=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/03bd0c8e-1ca6-11ef-bc32-def7b1441874.jpg"]'::jsonb,
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
  'PROD-03313',
  'X-MEN (2020) N.71',
  'X-MEN (2020) N.71',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/8MW6LQB6_z5H8kT67wZXKZ9Txpo=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/885e0a7a-4e7d-11ef-92ef-26e51fdcafe4.jpg"]'::jsonb,
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
  'PROD-03314',
  'X-MEN (2020) N.72',
  'X-MEN (2020) N.72',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/1L8SuM3LZcoux2rHwkXW5YD0Xas=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/cdcd0404-63e4-11ef-a01d-460951302070.png"]'::jsonb,
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
  'PROD-03315',
  'X-MEN (2020) N.74',
  'X-MEN (2020) N.74',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/wVOvnjjESccmoS4D_jwjk00BfqQ=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/866e5730-7fa9-11ef-b1d0-12caec0ea15c.jpg"]'::jsonb,
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
  'PROD-03316',
  'X-MEN (2020) N.75',
  'X-MEN (2020) N.75',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/QNIbL_MuRqajkFu3zVdbmGe4RnE=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/ea79ca54-eb4a-11ef-8621-0ee70347c223.jpg"]'::jsonb,
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
  'PROD-03317',
  'X-MEN (2020) N.76',
  'X-MEN (2020) N.76',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/NOS9NM57GT_nFOJwmzQVmF7uXBY=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/eb7b6be2-eb4a-11ef-8230-fa812316df6c.jpg"]'::jsonb,
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
  'PROD-03318',
  'X-MEN - LENDAS N.7',
  'X-MEN - LENDAS N.7',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/Yc7y2k1yZDvlk7mi0b8fZu9vfGU=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/55eb9818-fb7c-11ee-b174-aed4b192c71c.jpg"]'::jsonb,
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
  'PROD-03319',
  'X-MEN 2099 VOL.01 (MARVEL VINTAGE)',
  'X-MEN 2099 VOL.01 (MARVEL VINTAGE)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/tg2L4p_QWLxivrYPbLkPh2NCUB4=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/d4c24268-eb4a-11ef-8621-0ee70347c223.jpg"]'::jsonb,
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
  'PROD-03320',
  'X-MEN 2099 VOL.02 (MARVEL VINTAGE)',
  'X-MEN 2099 VOL.02 (MARVEL VINTAGE)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/NFzQIcU_2Bo-3epC1ysWBd6c4uU=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/d68617f8-3f2f-11f0-87b4-c2502d24ff3f.jpg"]'::jsonb,
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
  'PROD-03321',
  'X-MEN: A ERA DO APOCALIPSE OMNIBUS',
  'X-MEN: A ERA DO APOCALIPSE OMNIBUS',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/V3Yd-xUnXOaZL7zMxXGUkvvyr7g=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/3f190e72-5ea9-11f0-b8ff-8a0b5d172c0d.jpg"]'::jsonb,
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
  'PROD-03322',
  'X-MEN: A GUERRA MAGNETICA (X-MEN: AS MAIORES SAGAS)',
  'X-MEN: A GUERRA MAGNETICA (X-MEN: AS MAIORES SAGAS)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/6TuvfTljOazIiVVIKP6KmAfMf2U=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/551b11fe-2473-11f0-ae86-ee28d381db1d.jpg"]'::jsonb,
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
  'PROD-03323',
  'X-MEN: ATRACOES FATAIS (X-MEN: AS MAIORES SAGAS)',
  'X-MEN: ATRACOES FATAIS (X-MEN: AS MAIORES SAGAS)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/OICQI4V9gHxmPI7580v-zoDLu00=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/7c461572-7fa9-11ef-b0bc-6e97175de7f7.jpg"]'::jsonb,
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
  'PROD-03324',
  'X-MEN: CARRASCOS (2023) VOL.02',
  'X-MEN: CARRASCOS (2023) VOL.02',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/vt9X-IHFM6lKiYpZ4NfRgT-cyRk=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/cee98746-d81a-11ee-8b82-06e22cdb7792.jpg"]'::jsonb,
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
  'PROD-03325',
  'X-MEN: CARRASCOS VOL.01 N.1',
  'X-MEN: CARRASCOS VOL.01 N.1',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/nzZM_vdwcx2jT9Ns8azdWNyloYw=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/c72b6cfa-d8a0-11ee-82f3-be3c8dbb0cbf.jpg"]'::jsonb,
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
  'PROD-03326',
  'X-MEN: COMPLEXO DE MESSIAS (X-MEN: AS MAIORES SAGAS) [REB]',
  'X-MEN: COMPLEXO DE MESSIAS (X-MEN: AS MAIORES SAGAS) [REB]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/Nz86QhqDN1pU8LgVRhzBqZHor4s=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/9ed02628-1941-11f0-a494-3a4c16efbbdf.jpg"]'::jsonb,
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
  'PROD-03327',
  'X-MEN: GENESE MORTAL (X-MEN: AS MAIORES SAGAS)',
  'X-MEN: GENESE MORTAL (X-MEN: AS MAIORES SAGAS)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/ssQDGaT40NOWcDrlJHdgep7vD_s=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/024bd432-98c6-11f0-871f-3abc97b8de30.jpg"]'::jsonb,
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
  'PROD-03328',
  'X-MEN: LEGIAO DE X',
  'X-MEN: LEGIAO DE X',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/DHZtrT8GW_VDbmx2u-djkWMv1X4=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/c6fb53bc-d8a0-11ee-b8d0-26337c3739c7.jpg"]'::jsonb,
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
  'PROD-03329',
  'X-MEN: LENDAS VOL.05',
  'X-MEN: LENDAS VOL.05',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/SXYLF7hLJavMdLZYCu2C9YmD5jA=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/d07bfa6a-f616-11ef-941d-de9e7c6e4a26.jpg"]'::jsonb,
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
  'PROD-03330',
  'X-MEN: LENDAS VOL.09',
  'X-MEN: LENDAS VOL.09',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/08y4BdRKmAa-rs-CeAunIF3tJ5Y=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/ef8fad6a-0143-11f0-9a82-ca3c9ea74dec.jpg"]'::jsonb,
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
  'PROD-03331',
  'X-MEN: NECROSHA (X-MEN: AS MAIORES SAGAS) N.1',
  'X-MEN: NECROSHA (X-MEN: AS MAIORES SAGAS) N.1',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/LSjprLGs_f8AWbGNBkQ--L-EXBI=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/5265c222-fb7c-11ee-a932-f249d1132836.jpg"]'::jsonb,
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
  'PROD-03332',
  'X-MEN: O CISMA (MARVEL ESSENCIAIS)',
  'X-MEN: O CISMA (MARVEL ESSENCIAIS)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/bKG65N1OpQu0u9nY7ZZsPaY40z4=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/8f9e0994-da7d-11ee-b969-fe9018619bf2.jpg"]'::jsonb,
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
  'PROD-03333',
  'X-MEN: O CISMA (X-MEN: AS MAIORES SAGAS)',
  'X-MEN: O CISMA (X-MEN: AS MAIORES SAGAS)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/HgtLrJsSxZbdMinzoN3xaU56ZhE=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/a26ae48a-eb29-11ef-b1d3-def782e2bf12.jpg"]'::jsonb,
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
  'PROD-03334',
  'X-MEN: OPERACAO TOLERANCIA ZERO (X-MEN: AS MAIORES SAGAS) [R',
  'X-MEN: OPERACAO TOLERANCIA ZERO (X-MEN: AS MAIORES SAGAS) [R',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/H_tpck8yvg2oxV9nypRcnKeeehk=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/41d6fa2a-2475-11f0-8e86-de5b603f9a23.jpg"]'::jsonb,
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
  'PROD-03335',
  'X-MEN: OS FILHOS DO ATOMO',
  'X-MEN: OS FILHOS DO ATOMO',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/P6OsvZHo1da3UtmakAtaj3sX3-0=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/d13ee7f8-0ea0-11f0-9022-e6d175225f13.jpg"]'::jsonb,
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
  'PROD-03336',
  'X-TATICOS (MARVEL OMNIBUS) N.1',
  'X-TATICOS (MARVEL OMNIBUS) N.1',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/SYPajftHfOYUgRNZQDukp9kQTuU=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/d2152816-63e4-11ef-8888-36fc18488cf6.png"]'::jsonb,
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
  'PROD-03337',
  'X-TREME X-MEN (LENDAS MARVEL)',
  'X-TREME X-MEN (LENDAS MARVEL)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/oG-K7CvGi_4labJ8nWzbSz_QJO0=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/164aed08-d818-11ee-86d3-ce469b473a25.jpg"]'::jsonb,
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
  'PROD-03338',
  'X-TREME X-MEN POR CHRIS CLAREMONT VOL.1 (MARVEL OMNIBUS)',
  'X-TREME X-MEN POR CHRIS CLAREMONT VOL.1 (MARVEL OMNIBUS)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/xsBhoWAIJI32Zq_y1vp8ZYomCGA=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/b1cba8f6-eb29-11ef-9e36-2a856f41baa0.jpg"]'::jsonb,
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
  'PROD-03339',
  'XAVECO - VITÓRIA (GRAPHIC MSP N.38) BROCHURA',
  'XAVECO - VITÓRIA (GRAPHIC MSP N.38) BROCHURA',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/1VcQmCYvDbl13N9bpxfId7AnbEs=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/2d926c5e-a4ac-11f0-8bce-3af03c92463f.jpg"]'::jsonb,
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
  'PROD-03340',
  'YARICHIN BITCH CLUB - 03',
  'YARICHIN BITCH CLUB - 03',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/PHCaxfrReJTzQeTswUzG4Mmvv_I=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/c59b0c60-d8a0-11ee-98e4-5a86bcbeb6e3.jpg"]'::jsonb,
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
  'PROD-03341',
  'YARICHIN BITCH CLUB N.2',
  'YARICHIN BITCH CLUB N.2',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/YM6Y_7HM1jPAXg-2k7ybT0iA-Ys=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/d2be0c2a-d81a-11ee-98f1-c6f956d4b586.jpg"]'::jsonb,
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
  'PROD-03342',
  'YARICHIN BITCH CLUB N.4',
  'YARICHIN BITCH CLUB N.4',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/KrC78xpXtl5Kdm1lcynoSoErHMA=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/330c7b38-ebef-11ee-8810-22f5b7d93b6a.jpg"]'::jsonb,
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
  'PROD-03343',
  'YARICHIN BITCH CLUB N.5',
  'YARICHIN BITCH CLUB N.5',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/OAQWou3y12HTFkupZBB2AOvCTYw=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/28157028-2ce4-11ef-9af9-062ae0e3c489.jpg"]'::jsonb,
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
  'PROD-03344',
  'YOMOTSUHEGUI - O FRUTO DO MUNDO DOS MORTOS - 01',
  'YOMOTSUHEGUI - O FRUTO DO MUNDO DOS MORTOS - 01',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/7Umkf6WREW9iJv4kjC5Elnu19-k=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/4ef42a12-e497-11ee-b6a7-e2b250ff01a0.jpg"]'::jsonb,
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
  'PROD-03345',
  'YOMOTSUHEGUI - O FRUTO DO MUNDO DOS MORTOS - 02',
  'YOMOTSUHEGUI - O FRUTO DO MUNDO DOS MORTOS - 02',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/WbvkfyysmVgL_fj2OKBA5nNzsMQ=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/12b6dbe2-f68c-11ee-8ac8-7e15a8284984.jpg"]'::jsonb,
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
  'PROD-03346',
  'YOMOTSUHEGUI - O FRUTO DO MUNDO DOS MORTOS - 03',
  'YOMOTSUHEGUI - O FRUTO DO MUNDO DOS MORTOS - 03',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/a834DfKIxTiX4xqPnujst4JhGOc=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/c4517486-0125-11ef-9900-52ec7c1eeb4f.jpg"]'::jsonb,
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
  'PROD-03347',
  'YOUR LIE IN APRIL  BOX [1-11]',
  'YOUR LIE IN APRIL  BOX [1-11]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/hr7q1XSwSrYtauZErBIIy0-AmX0=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/edb3c0d0-9031-11f0-82c8-4a06203c34dc.jpg"]'::jsonb,
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
  'PROD-03348',
  'YUUNA E A PENSAO ASSOMBRADA - 01 [REB]',
  'YUUNA E A PENSAO ASSOMBRADA - 01 [REB]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/vkid37KWEpKWvgVwAODOB7-cDaw=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/9ccc9578-eb29-11ef-8b75-5ac0f052206d.jpg"]'::jsonb,
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
  'PROD-03349',
  'YUUNA E A PENSAO ASSOMBRADA - 02 [REB]',
  'YUUNA E A PENSAO ASSOMBRADA - 02 [REB]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/y5-i2Svnm73xdzc5drJndPTsJnE=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/9cf4c4ee-eb29-11ef-913d-52f5d450f8a6.jpg"]'::jsonb,
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
  'PROD-03350',
  'YUUNA E A PENSAO ASSOMBRADA - 03 [REB]',
  'YUUNA E A PENSAO ASSOMBRADA - 03 [REB]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/R2z4PbrOgYo0lwQNK2uuwRWCxDo=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/9cfe76f6-eb29-11ef-89a1-ce85303a26c9.jpg"]'::jsonb,
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