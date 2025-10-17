-- SQL para importar produtos Brancaleone
-- Gerado em: 2025-10-17T18:20:53.612Z
-- Total de produtos: 3363
-- Fonte: brancaleone-products-1760723254011.json

-- 1. Criar distribuidor (se não existir)

-- Distribuidor já criado no batch-001

-- Lote 25 de 68
-- Produtos: 2401 até 2500



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01201',
  'FRIEREN E A JORNADA PARA O ALÉM - 04 [REB2]',
  'FRIEREN E A JORNADA PARA O ALÉM - 04 [REB2]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/ZRwDkwzXx_kibYdp2yRbCh0wxDM=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/51316e3c-8b5f-11f0-b3d9-165df9e621a1.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01202',
  'FRIEREN E A JORNADA PARA O ALÉM - 05 [REB]',
  'FRIEREN E A JORNADA PARA O ALÉM - 05 [REB]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/XSb5y4UVGg3AM0q0m3C-33Il7cY=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/5167ad26-8b5f-11f0-b3d9-165df9e621a1.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01203',
  'FRIEREN E A JORNADA PARA O ALÉM - 06 [REB]',
  'FRIEREN E A JORNADA PARA O ALÉM - 06 [REB]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/UyVrTaqSs0ppX5-NSrH98xDEJTw=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/51528252-8b5f-11f0-b3d9-165df9e621a1.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01204',
  'FRIEREN E A JORNADA PARA O ALÉM - 07 [REB]',
  'FRIEREN E A JORNADA PARA O ALÉM - 07 [REB]',
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
  'PROD-01205',
  'FRIEREN E A JORNADA PARA O ALÉM - 08 [REB]',
  'FRIEREN E A JORNADA PARA O ALÉM - 08 [REB]',
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
  'PROD-01206',
  'FRIEREN E A JORNADA PARA O ALÉM - 09 [REB2]',
  'FRIEREN E A JORNADA PARA O ALÉM - 09 [REB2]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/wF_kKNbjma-FNdxOekYoeWFaQ_c=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/06fa5530-98c6-11f0-af89-d2e8520fe6b7.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01207',
  'FRIEREN E A JORNADA PARA O ALÉM - 10 [REB]',
  'FRIEREN E A JORNADA PARA O ALÉM - 10 [REB]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/E9D0fWztKB4QNjGdv027ri_wrR4=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/298257e6-a4ac-11f0-aa03-16ade38a6d4b.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01208',
  'FRIEREN E A JORNADA PARA O ALÉM - 11 [REB]',
  'FRIEREN E A JORNADA PARA O ALÉM - 11 [REB]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/RTazxARPNN4bn79o04Du-cBaYdc=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/51725f6e-8b5f-11f0-ab6e-7e1ab2cbb1e5.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01209',
  'FRIEREN E A JORNADA PARA O ALÉM - 12 [REB]',
  'FRIEREN E A JORNADA PARA O ALÉM - 12 [REB]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/q3Z5JVt0CU2HE4fWEz4wPr6B7Mg=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/518931c6-8b5f-11f0-b3d9-165df9e621a1.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01210',
  'FUGITIVOS - A COLECAO N.6',
  'FUGITIVOS - A COLECAO N.6',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/nv03UvV6AZwutiNNAVXFY8bKccE=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/a0fdb4d6-d817-11ee-bce8-e2e54ed5f9f7.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01211',
  'FUGITIVOS - A COLECAO VOL. 05',
  'FUGITIVOS - A COLECAO VOL. 05',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/HkrUDh2lEViEBHMlEJfjEZvxEeo=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/a0a587a2-d817-11ee-a3da-e2697ce33d53.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01212',
  'FUGITIVOS - A COLECAO VOL. 07',
  'FUGITIVOS - A COLECAO VOL. 07',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/sQOLScsIMO3maaTZhK5NpE-243Y=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/a1733df0-d817-11ee-b124-5a86bcbeb6e3.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01213',
  'FUGITIVOS - A COLECAO VOL. 08',
  'FUGITIVOS - A COLECAO VOL. 08',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/VGi6o-8zv37aMP8tCw5May7CnVY=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/ac6ee4e2-ee29-11ef-b50b-52169ed8ea49.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01214',
  'FURY MAX POR GARTH ENNIS N.2',
  'FURY MAX POR GARTH ENNIS N.2',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/b-BadD7FkPav89tZTQdtEHZv07c=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/37cef22c-e497-11ee-83ff-7ee42cfe9644.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01215',
  'FURY MAX POR GARTH ENNIS VOL.01 (DE 02)',
  'FURY MAX POR GARTH ENNIS VOL.01 (DE 02)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/fdpPVLjAQBpVHtShI7u4KqdQhmw=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/a2334a46-d817-11ee-bce8-e2e54ed5f9f7.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01216',
  'GACHIAKUTA - 01 [REB2]',
  'GACHIAKUTA - 01 [REB2]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/NdCarIzH8ZnbrdiC6EPv6sKh4mo=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/9981bee4-a7c0-11f0-8792-0ab376ee0ef4.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01217',
  'GACHIAKUTA - 05',
  'GACHIAKUTA - 05',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/4VYRMSDtp4gHAeSHD0uQ8EXLCGU=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/acd0fd44-ee29-11ef-a5f9-962440bb65d0.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01218',
  'GACHIAKUTA - 10',
  'GACHIAKUTA - 10',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/epDL9c0IJ6ZcfCFlhL9NfrI4IAs=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/3742c708-7fd1-11f0-b894-2e1dcafaddd0.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01219',
  'GACHIAKUTA - 11',
  'GACHIAKUTA - 11',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/b_y8G-XO8pXT-Mljgsp_wKjXO1E=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/9ac87342-a7c0-11f0-8792-0ab376ee0ef4.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01220',
  'GACHIAKUTA N.2',
  'GACHIAKUTA N.2',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/L2uCJjoZ3geoQx4g1teyzpugLFg=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/3852338a-e497-11ee-b6a7-e2b250ff01a0.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01221',
  'GACHIAKUTA N.3',
  'GACHIAKUTA N.3',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/8c7U5rDgQRcnUYjuCtOaSCOgrjY=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/4b6e8de6-fb7c-11ee-b9a7-42c387d0d3d3.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01222',
  'GACHIAKUTA N.4',
  'GACHIAKUTA N.4',
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
  'PROD-01223',
  'GANTZ -  BOX 2',
  'GANTZ -  BOX 2',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/mekR8yq28qHAAGCMLwE8yV7PvcI=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/3c717332-7fd1-11f0-a5af-de5e70a27ff7.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01224',
  'GAROTO-ARANHA VOL.01',
  'GAROTO-ARANHA VOL.01',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/nGEzXX89XbSQrUli_-b4tGO1J0k=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/ad69512a-ee29-11ef-a2c1-c2c6f823c995.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01225',
  'GAROTO-ARANHA VOL.02',
  'GAROTO-ARANHA VOL.02',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/y0aM0_5OdHpXDWLvQgoMl2sjFFQ=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/8ea078a2-3692-11f0-8d7f-ba18af294916.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01226',
  'GAROTOS DETETIVES MORTOS (SANDMAN MANGA)',
  'GAROTOS DETETIVES MORTOS (SANDMAN MANGA)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/CzsCoY7GxlVRe9Mcl041pntwNsE=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/6e8b8056-da7d-11ee-9032-fe9018619bf2.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01227',
  'GATA DE FERRO (2024) N.1',
  'GATA DE FERRO (2024) N.1',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/NAWHx1u925I8HhsvZP1phBrICPA=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/bced6628-0125-11ef-9d9d-e2f1d4f1a152.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01228',
  'GAVIAO NEGRO POR GEOFF JOHNS VOL. 01  (DC VINTAGE)',
  'GAVIAO NEGRO POR GEOFF JOHNS VOL. 01  (DC VINTAGE)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/AEmonVsXqJPW8Z6fY0KbJhzsnAk=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/79369486-4e7d-11ef-8c92-9adb7952e04b.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01229',
  'GAVIAO NEGRO POR GEOFF JOHNS VOL.02 (DC VINTAGE)',
  'GAVIAO NEGRO POR GEOFF JOHNS VOL.02 (DC VINTAGE)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/rudJz9Z80eRFsJNjpzvxd-epCDk=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/975bf606-eb29-11ef-a31a-8ed8743505f0.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01230',
  'GEN 13 -  EDICAO DE LUXO',
  'GEN 13 -  EDICAO DE LUXO',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/8w4dcbDQrpLgfkwFHUxpcOtDDl4=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/37478dba-7fd1-11f0-a5af-de5e70a27ff7.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01231',
  'GENIS-VELL, CAPITAO MARVEL (LENDAS MARVEL) N.6',
  'GENIS-VELL, CAPITAO MARVEL (LENDAS MARVEL) N.6',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/MmdNiH18wQoqDK7nz_DNa7hbGaE=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/59edd4a0-0cc8-11ef-a5c2-9eafaa3ca1cb.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01232',
  'GOBLIN SLAYER - 13',
  'GOBLIN SLAYER - 13',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/AnP5TKa7AtL4Lw3XyOOGK0e9O9Y=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/461c65b0-d819-11ee-9467-e2e54ed5f9f7.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01233',
  'GOBLIN SLAYER - 15',
  'GOBLIN SLAYER - 15',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/wsWu_x3OhfwLhb-uSmhFMoDhJ5I=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/86056fcc-7fa9-11ef-b0bc-6e97175de7f7.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01234',
  'GOBLIN SLAYER - 16',
  'GOBLIN SLAYER - 16',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/ffWgTJ1B2zIIMMwcyrkwT6xKc1Q=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/3e4a06e2-7fd1-11f0-a5af-de5e70a27ff7.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01235',
  'GOBLIN SLAYER N.1',
  'GOBLIN SLAYER N.1',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/y8BsJ3efOTVVTkjLMr8m63R4DN4=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/50b77fec-fb7c-11ee-9319-1236e160da75.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01236',
  'GOBLIN SLAYER N.14',
  'GOBLIN SLAYER N.14',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/o3l6MlyW3z9R4kSRh0POAH6tYZ4=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/467a88d4-d819-11ee-bb5a-de7d367e92b3.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01237',
  'GOKURAKUGAI - 2',
  'GOKURAKUGAI - 2',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/nbkn0uo3zvgLCBiGL5L36i6rLGo=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/ad595004-ee29-11ef-b063-626bc6f24654.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01238',
  'GOKURAKUGAI - 3',
  'GOKURAKUGAI - 3',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/x15ytBMdW6Hsw5A8oo_9qk8fWD4=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/97ae6e22-eb29-11ef-a3b1-5681c2ac1d4b.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01239',
  'GOKURAKUGAI - 4',
  'GOKURAKUGAI - 4',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/rqy3txRy9Q1aCZQ0sUJZijClJTg=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/c2fc548e-f616-11ef-b0f5-5ac998efac6d.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01240',
  'GOKURAKUGAI N.1',
  'GOKURAKUGAI N.1',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/XpctxP3FC72TJlYT4ceF_-bXv3w=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/c68986fe-63e4-11ef-81e8-daba8f91e64c.png"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01241',
  'GOKUSHUFUDOU - TATSU IMORTAL - 01',
  'GOKUSHUFUDOU - TATSU IMORTAL - 01',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/LkZCNDjPR0MrFPcxtMuWhI22ssE=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/a69d06b2-d817-11ee-86d3-ce469b473a25.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01242',
  'GOKUSHUFUDOU - TATSU IMORTAL - 02',
  'GOKUSHUFUDOU - TATSU IMORTAL - 02',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/e5u3FSMqmQWueuRuSOeoDWtBHCk=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/a769be50-d817-11ee-b124-5a86bcbeb6e3.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01243',
  'GOKUSHUFUDOU - TATSU IMORTAL - 03',
  'GOKUSHUFUDOU - TATSU IMORTAL - 03',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/1dSO6ejWVmqHM6L74y4av2-KKB0=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/a7b2381a-d817-11ee-9a1e-da2373bc7c0b.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01244',
  'GOKUSHUFUDOU - TATSU IMORTAL - 04',
  'GOKUSHUFUDOU - TATSU IMORTAL - 04',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/P1-GS7rRgo1ujkIcBYZ-zdM_Yc0=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/a85e18c4-d817-11ee-a3da-e2697ce33d53.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01245',
  'GOKUSHUFUDOU - TATSU IMORTAL - 05',
  'GOKUSHUFUDOU - TATSU IMORTAL - 05',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/H_-IiD_16GTbpbvIcXVT1H-76WU=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/a8c8fa9a-d817-11ee-86d3-ce469b473a25.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01246',
  'GOKUSHUFUDOU - TATSU IMORTAL - 06',
  'GOKUSHUFUDOU - TATSU IMORTAL - 06',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/EksiCj1Kb1RUY8UFDiB4be6It_Q=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/a9b9ba66-d817-11ee-9371-e2a33adec5cd.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01247',
  'GOKUSHUFUDOU - TATSU IMORTAL - 07',
  'GOKUSHUFUDOU - TATSU IMORTAL - 07',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/TluSCQfWgB0GNgVmEsE8uVe-G-A=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/aa00cb22-d817-11ee-b124-5a86bcbeb6e3.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01248',
  'GOKUSHUFUDOU - TATSU IMORTAL - 08',
  'GOKUSHUFUDOU - TATSU IMORTAL - 08',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/kryBFM9IyaAdf7QAirjYBPO98xY=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/38e1126c-e497-11ee-b6a7-e2b250ff01a0.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01249',
  'GOKUSHUFUDOU - TATSU IMORTAL - 09',
  'GOKUSHUFUDOU - TATSU IMORTAL - 09',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/-VygvERfjgHdXEThkIxQSiTJndc=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/27f58b72-ebef-11ee-8810-22f5b7d93b6a.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01250',
  'GOKUSHUFUDOU - TATSU IMORTAL - 11',
  'GOKUSHUFUDOU - TATSU IMORTAL - 11',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/LAhvkBYfwYHXcA_Qum_gb0izTHA=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/d4d75778-119a-11ef-a951-1a13f4f3a32a.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();