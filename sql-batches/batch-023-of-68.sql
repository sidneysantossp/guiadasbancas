-- SQL para importar produtos Brancaleone
-- Gerado em: 2025-10-17T18:20:53.612Z
-- Total de produtos: 3363
-- Fonte: brancaleone-products-1760723254011.json

-- 1. Criar distribuidor (se não existir)

-- Distribuidor já criado no batch-001

-- Lote 23 de 68
-- Produtos: 2201 até 2300



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01101',
  'DRAGON BALL EDIÇÃO DEFINITIVA - 05 (REB2)',
  'DRAGON BALL EDIÇÃO DEFINITIVA - 05 (REB2)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/hJNqNTJvFZ1SztG4hMZhdPM97nY=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/9661154a-2461-11ef-b00f-3eff3e6e8cf3.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01102',
  'DRAGON BALL EDIÇÃO DEFINITIVA - 06 [REB]',
  'DRAGON BALL EDIÇÃO DEFINITIVA - 06 [REB]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/nPDZ1KU36o_hoHvZdkhKLXfO5FU=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/c5771dfc-f616-11ef-9850-2607ec7077ba.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01103',
  'DRAGON BALL EDIÇÃO DEFINITIVA - 07 [REB]',
  'DRAGON BALL EDIÇÃO DEFINITIVA - 07 [REB]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/2EYPyX_JoEfDTQ_U8UTHaNoVQEk=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/c5971b66-f616-11ef-941d-de9e7c6e4a26.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01104',
  'DRAGON BALL EDIÇÃO DEFINITIVA - 08 [REB]',
  'DRAGON BALL EDIÇÃO DEFINITIVA - 08 [REB]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/FIySsYrUtqo222ix8TZ_9Ixn3fQ=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/ec93030a-0143-11f0-9a82-ca3c9ea74dec.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01105',
  'DRAGON BALL EDIÇÃO DEFINITIVA - 09 [REB]',
  'DRAGON BALL EDIÇÃO DEFINITIVA - 09 [REB]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/_RFp4k3XnKTdkJMMI1D2ihq3jq8=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/eca58e44-0143-11f0-9a82-ca3c9ea74dec.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01106',
  'DRAGON BALL EDIÇÃO DEFINITIVA - 10 [REB]',
  'DRAGON BALL EDIÇÃO DEFINITIVA - 10 [REB]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/F5tLkA9LGkktyxQMXIluQ2nYht0=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/c6510da0-642a-11f0-8bc5-aa2e25388802.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01107',
  'DRAGON BALL EDIÇÃO DEFINITIVA - 11 [REB]',
  'DRAGON BALL EDIÇÃO DEFINITIVA - 11 [REB]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/ioEJGSToWYi18pSVW76dyoGFzeI=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/1e533f94-69af-11f0-a796-ae0a374fc493.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01108',
  'DRAGON BALL EDIÇÃO DEFINITIVA - 12 [REB]',
  'DRAGON BALL EDIÇÃO DEFINITIVA - 12 [REB]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/GsrPRLlzVwr3hUi3lRVjAxuJ_WA=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/219142cc-6f3c-11f0-a26d-9a5fb41f8b80.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01109',
  'DRAGON BALL EDIÇÃO DEFINITIVA - 13 [REB]',
  'DRAGON BALL EDIÇÃO DEFINITIVA - 13 [REB]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/9fiwcdl-RXul1IZlE2fP08T6U2k=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/21a2abf2-6f3c-11f0-b1c7-ee865bcff8a6.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01110',
  'DRAGON BALL EDIÇÃO DEFINITIVA - 14 [REB]',
  'DRAGON BALL EDIÇÃO DEFINITIVA - 14 [REB]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/MLcO1iWdH5W9GCj_5VPFkx89jaU=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/21cf8064-6f3c-11f0-9cf1-c2c01d897fb1.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01111',
  'DRAGON BALL EDIÇÃO DEFINITIVA - 15 [REB]',
  'DRAGON BALL EDIÇÃO DEFINITIVA - 15 [REB]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/tGEMklmah7-7Yy7QFOC-oXWWTtI=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/48ae0c48-8b5f-11f0-ab6e-7e1ab2cbb1e5.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01112',
  'DRAGON BALL EDIÇÃO DEFINITIVA - 16 [REB]',
  'DRAGON BALL EDIÇÃO DEFINITIVA - 16 [REB]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/faV_LMXjhWp-aHreP9LR5uejgaU=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/48b8403c-8b5f-11f0-b876-cef4535c59b2.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01113',
  'DRAGON BALL EDIÇÃO DEFINITIVA - 17 [REB]',
  'DRAGON BALL EDIÇÃO DEFINITIVA - 17 [REB]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/INy6iqDo43BCH1R0lwsGGOZQ6tk=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/48d2229a-8b5f-11f0-ab6e-7e1ab2cbb1e5.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01114',
  'DRAGON BALL EDIÇÃO DEFINITIVA -02 [REB2]',
  'DRAGON BALL EDIÇÃO DEFINITIVA -02 [REB2]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/roMdEkx8YdWvaj7F_DFREu6VC5w=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/953adc32-2461-11ef-a07c-c63aa4de974e.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01115',
  'DRAGON BALL SUPER - 03 [REB5]',
  'DRAGON BALL SUPER - 03 [REB5]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/7Y62TycvNudx9dwHdN_TiEfOSbY=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/dc172e8c-3f2f-11f0-a17d-1ac4d5553c9e.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01116',
  'DRAGON BALL SUPER - 04 [REB4]',
  'DRAGON BALL SUPER - 04 [REB4]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/5Ab_IkKdu280igoNuYZ-eHB_wuw=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/91b34d1c-9d49-11f0-b28c-5e39260dda1f.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01117',
  'DRAGON BALL SUPER - 05 [REB4]',
  'DRAGON BALL SUPER - 05 [REB4]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/yaOKhQd4UquWeadkaOP_iccYj0g=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/91d7a3d8-9d49-11f0-916d-cee03b37ee33.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01118',
  'DRAGON BALL SUPER - 06 [REB3]',
  'DRAGON BALL SUPER - 06 [REB3]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/IhPwJlhxeE0RC1_UGdJsBAOzhrA=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/26226064-a4ac-11f0-84d7-06a1e9b2bf33.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01119',
  'DRAGON BALL SUPER - 21 [REB]',
  'DRAGON BALL SUPER - 21 [REB]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/Q3wRZ1ETIsQG-gKDuNCdqthOODU=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/9c7e744c-eb29-11ef-8fb2-6696cc3e9cb3.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01120',
  'DRAGON BALL SUPER - 22 [REB]',
  'DRAGON BALL SUPER - 22 [REB]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/tRY1J2VR5hegMPv10tAdRBbTZjo=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/9c853048-eb29-11ef-a3b1-5681c2ac1d4b.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01121',
  'DRAGON BALL SUPER - 23 [REB]',
  'DRAGON BALL SUPER - 23 [REB]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/UBCqy_UIOg4kIbFLTdOoR9S0p0o=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/9c9f16a2-eb29-11ef-8d7f-eea3b61904a2.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01122',
  'DRAGON BALL SUPER N.6',
  'DRAGON BALL SUPER N.6',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/ZKjnSeUNDNSdJgOrYjaxCJcvTeo=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/94748f8c-2461-11ef-a07c-c63aa4de974e.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01123',
  'DRAGONERO: A ORIGEM  N.1',
  'DRAGONERO: A ORIGEM  N.1',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/y3HcLpE5HVRQQSMMpu6H8A29UBA=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/5872a268-0cc8-11ef-a93f-8e4a61da3cfa.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01124',
  'DRCL MIDNIGHT CHILDREN - 02',
  'DRCL MIDNIGHT CHILDREN - 02',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/2-xFpbSmkQTUZGJuK0Sh5yPMxqY=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/8e8647e8-3692-11f0-b775-ca6651de2295.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01125',
  'DRCL MIDNIGHT CHILDREN - 03',
  'DRCL MIDNIGHT CHILDREN - 03',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/Fzh0S5lwzi-w_x6AGqOLwcRNVZ4=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/c514be46-642a-11f0-bfa0-6253877c6ac4.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01126',
  'DRCL MIDNIGHT CHILDREN - 1',
  'DRCL MIDNIGHT CHILDREN - 1',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/YnbvS-fqn_K_mmBgD4401dekv-4=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/ce442af4-0ea0-11f0-9433-6a2060da7b4c.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01127',
  'DUENDE VERMELHO (2024) VOL.01',
  'DUENDE VERMELHO (2024) VOL.01',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/5T08aHsR_j_dfYP4pHBb6-zuZ9w=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/7241603a-da7d-11ee-9032-fe9018619bf2.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01128',
  'DUENDE VERMELHO (2024) VOL.02',
  'DUENDE VERMELHO (2024) VOL.02',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/SIGqeOTS-sX7Oq7XiULAqS84pR8=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/abf225f6-ee29-11ef-b063-626bc6f24654.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01129',
  'DURANKI - 01',
  'DURANKI - 01',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/lWTzas2oC_RsOqmmGapl8gwzx_Q=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/2ad7a1e8-de36-11ee-aae0-ca3362baf0a6.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01130',
  'DYLAN DOG: A ZONA DO CREPUSCULO',
  'DYLAN DOG: A ZONA DO CREPUSCULO',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/DgZBF-f7q__vfoaD8Ju86UfR4KA=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/d6a5011a-eb4a-11ef-8230-fa812316df6c.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01131',
  'DYLAN DOG: JOHNNY FREAK (BIBLIOTECA DYLAN DOG)',
  'DYLAN DOG: JOHNNY FREAK (BIBLIOTECA DYLAN DOG)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/6GExmC9cjZksCwPO13F0RLP0Cgc=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/8e4486de-e583-11ee-b66f-62eaabe3d6ba.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01132',
  'DYLAN DOG: O PLANETA DOS MORTOS (BIBLIOTECA DYLAN DOG)',
  'DYLAN DOG: O PLANETA DOS MORTOS (BIBLIOTECA DYLAN DOG)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/ilDp8a71KcN_Q8bukiZPkUYQ5aQ=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/7568f8ee-4e7d-11ef-a1a1-5acf4477aff6.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01133',
  'DYLAN DOG: O PLANETA DOS MORTOS VOL.02 (BIBLIOTECA DYLAN DOG',
  'DYLAN DOG: O PLANETA DOS MORTOS VOL.02 (BIBLIOTECA DYLAN DOG',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/9awfaUh55rgBh5hQM2HU2ljb0co=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/ba1a8098-f616-11ef-aa08-9af237dc8f86.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01134',
  'ELDEN RING - 03',
  'ELDEN RING - 03',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/U8H_SMZfui5qSzBnkGPAGp81-8w=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/37015e76-7fd1-11f0-b894-2e1dcafaddd0.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01135',
  'ELDEN RING - 05',
  'ELDEN RING - 05',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/5t2AYssLDHBHvoCXYmXhtE1ocN4=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/ac39265e-ee29-11ef-9fcc-be91c53273e3.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01136',
  'ELDEN RING - 06',
  'ELDEN RING - 06',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/lhx_7cp5tetuScqh4Kljm8h5T5M=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/1442be40-2791-11f0-a73d-267bdd5b5208.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01137',
  'ELDEN RING - 07',
  'ELDEN RING - 07',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/kCR48GxqRZ7KYHqF9oSXvAA58OQ=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/470c3ab8-8b5f-11f0-b876-cef4535c59b2.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01138',
  'ELDEN RING ARTBOOK VOL.01',
  'ELDEN RING ARTBOOK VOL.01',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/NUWNXDsxw_icjOa0N6SsXwFDC9U=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/94d6d750-d817-11ee-bce8-e2e54ed5f9f7.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01139',
  'ELDEN RING ARTBOOK VOL.02',
  'ELDEN RING ARTBOOK VOL.02',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/fMAm1oIyILMvD1PbsmX68XuVC4A=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/95b1211c-d817-11ee-86d3-ce469b473a25.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01140',
  'ELDEN RING BECOME LORD - 01',
  'ELDEN RING BECOME LORD - 01',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/GB7SHJad4ZI598OAkQ1w9BitjwM=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/3ec94266-5ea9-11f0-885d-4eae30e658d1.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01141',
  'ELDEN RING BECOME LORD - 02',
  'ELDEN RING BECOME LORD - 02',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/1eYzF6E1jbQ6RkprhBpWP4XdH40=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/46f9bd84-8b5f-11f0-ab6e-7e1ab2cbb1e5.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01142',
  'ELDER RING N.4',
  'ELDER RING N.4',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/g_P1B-V5yPfrLxU28WcBpghJ9Sw=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/78b73006-4e7d-11ef-b831-22eb38681e4f.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01143',
  'ELEKTRA VIVE (MARVEL GRAPHIC NOVEL)',
  'ELEKTRA VIVE (MARVEL GRAPHIC NOVEL)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/qZI-S-avsf7syFy9qbZQZpKihB0=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/97d1552c-1941-11f0-a707-ceedc1648097.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01144',
  'ELEKTRA: PRETO, BRANCO E SANGUE',
  'ELEKTRA: PRETO, BRANCO E SANGUE',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/nRk5_6dxBxL19-dg8MWN9fiIQ-Q=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/739a84d4-da7d-11ee-9fe4-12792fd81a45.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01145',
  'ENV.C/ 4 CARDS CB 24 TCG',
  'ENV.C/ 4 CARDS CB 24 TCG',
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
  'PROD-01146',
  'ENV.C/ 6 CARDS BASE CB 25 TCG',
  'ENV.C/ 6 CARDS BASE CB 25 TCG',
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
  'PROD-01147',
  'ENV.C/ 6 CARDS HOT WHELLS',
  'ENV.C/ 6 CARDS HOT WHELLS',
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
  'PROD-01148',
  'ENVELOPE 5 CROMOS BLUEY 2 CAIXINHA 25',
  'ENVELOPE 5 CROMOS BLUEY 2 CAIXINHA 25',
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
  'PROD-01149',
  'ENVELOPE 6 CARDS+1 LEAF SAQUINHO DE 24',
  'ENVELOPE 6 CARDS+1 LEAF SAQUINHO DE 24',
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
  'PROD-01150',
  'ENVELOPE C/ 5 CROMOS PREMIUM FUTSAL BR 2025',
  'ENVELOPE C/ 5 CROMOS PREMIUM FUTSAL BR 2025',
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