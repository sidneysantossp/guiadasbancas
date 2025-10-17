-- SQL para importar produtos Brancaleone
-- Gerado em: 2025-10-17T18:20:53.612Z
-- Total de produtos: 3363
-- Fonte: brancaleone-products-1760723254011.json

-- 1. Criar distribuidor (se não existir)

-- Distribuidor já criado no batch-001

-- Lote 6 de 68
-- Produtos: 501 até 600



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00251',
  'ALMANAQUE TURMA DA MONICA N.22',
  'ALMANAQUE TURMA DA MONICA N.22',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/-EtSKprKruF3maKfeArKWKiE03M=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/81a71e62-7fa9-11ef-b1d0-12caec0ea15c.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00252',
  'ALMANAQUE TURMA DA MONICA N.23',
  'ALMANAQUE TURMA DA MONICA N.23',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/48pDlYkKb1pM22RGRxKk1A_Cjw8=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/9b7cec4a-eb29-11ef-9e36-2a856f41baa0.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00253',
  'ALMANAQUE TURMA DA MONICA N.24',
  'ALMANAQUE TURMA DA MONICA N.24',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/oLkElVKno3YJF6-6K-6ZsSOTJkk=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/1c13dbe4-f2f9-11ef-a0d3-6e7871fdaf1f.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00254',
  'ALMANAQUE TURMA DA MONICA N.25',
  'ALMANAQUE TURMA DA MONICA N.25',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/9QAJ8TfomQ5i6ubYwz5YYO4r28M=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/477fe93c-5ea9-11f0-885d-4eae30e658d1.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00255',
  'ALMANAQUE TURMA DA MONICA N.26',
  'ALMANAQUE TURMA DA MONICA N.26',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/eh3Nr5ss0QHzMNgUv3dl-TvqT1g=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/47b48b24-5ea9-11f0-bc5c-8a0b5d172c0d.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00256',
  'ALMANAQUE TURMA DA MONICA N.27',
  'ALMANAQUE TURMA DA MONICA N.27',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/prz1Qz5l4fSR3lJleZgtSpH8ahU=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/48666fd2-8b5f-11f0-b876-cef4535c59b2.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00257',
  'ALVO HUMANO POR PETER MILLIGAN (EDICAO DE LUXO) N.1',
  'ALVO HUMANO POR PETER MILLIGAN (EDICAO DE LUXO) N.1',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/ilYgBEq78d8MhUoT_9ckvZlAong=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/27d8c7a8-ebef-11ee-963f-1e73add0c60b.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00258',
  'AMAOI N.4',
  'AMAOI N.4',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/yLwRg2-v9Rpb0Z39TXljIm44hBY=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/8e5415d4-22d9-11ef-ada4-8af8f1198647.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00259',
  'AMAOI N.5',
  'AMAOI N.5',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/3RAPTcTAuVNAEuunXiVUL64JH-U=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/8e78f098-22d9-11ef-a85e-c697234fbd13.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00260',
  'AMERICAN JESUS: REVELACAO',
  'AMERICAN JESUS: REVELACAO',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/6o1_EDAmk1Nw2BjxvhmpoCZPjKQ=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/8e0c86d6-d817-11ee-86d3-ce469b473a25.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00261',
  'ANJINHO: ALEM (GRAPHIC MSP VOL. 32) (REB)',
  'ANJINHO: ALEM (GRAPHIC MSP VOL. 32) (REB)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/uonag4RTt1R2fhswqDpGbNwEeVI=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/924966b6-d816-11ee-bb12-5a86bcbeb6e3.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00262',
  'ANOS 2000: O RENASCIMENTO DA MARVEL VOL.02 (DE 10) - PANTERA',
  'ANOS 2000: O RENASCIMENTO DA MARVEL VOL.02 (DE 10) - PANTERA',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/_DEO5CFSViHIv5yhNYtx7i50Av4=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/b3be2d0e-026e-11ef-b30e-3226f5afd939.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00263',
  'ANOS 2000: O RENASCIMENTO DA MARVEL VOL.03 (DE 10) - VIUVA-N',
  'ANOS 2000: O RENASCIMENTO DA MARVEL VOL.03 (DE 10) - VIUVA-N',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/SiEnRCH8ZUvUTCD7MPVQ71EtTfQ=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/b40f79a2-026e-11ef-bb9a-92726b4fd51d.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00264',
  'ANOS 2000: O RENASCIMENTO DA MARVEL VOL.04 (DE 10) - CAPITAO',
  'ANOS 2000: O RENASCIMENTO DA MARVEL VOL.04 (DE 10) - CAPITAO',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/jEWbTUhAneBoY-Z30mwFiARCyG0=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/b4949358-026e-11ef-92a6-9a544210a314.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00265',
  'ANOS 2000: O RENASCIMENTO DA MARVEL VOL.05 (DE 10) - DEADPOO',
  'ANOS 2000: O RENASCIMENTO DA MARVEL VOL.05 (DE 10) - DEADPOO',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/IX1TlNay72CNgWGiSMHAcbXvhDU=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/b0a6b26c-026e-11ef-9440-82c526af331f.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00266',
  'ANOS 2000: O RENASCIMENTO DA MARVEL VOL.06 (DE 10) - HOMEM D',
  'ANOS 2000: O RENASCIMENTO DA MARVEL VOL.06 (DE 10) - HOMEM D',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/RKzj-sjBTgjdbSXt1oP_XFNEsm8=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/b0b3f652-026e-11ef-8268-ca978140a0f4.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00267',
  'ANOS 2000: O RENASCIMENTO DA MARVEL VOL.07 (DE 10) - FENIX',
  'ANOS 2000: O RENASCIMENTO DA MARVEL VOL.07 (DE 10) - FENIX',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/pMFU8eqvFPLyXcInWUXvoaag6i8=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/2e4e73fe-a4ac-11f0-9bb5-ee8f90996b43.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00268',
  'ANOS 2000: O RENASCIMENTO DA MARVEL VOL.08 (DE 10) - HOMEM-A',
  'ANOS 2000: O RENASCIMENTO DA MARVEL VOL.08 (DE 10) - HOMEM-A',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/8IKCl4W_U9RIveidC1IlHpOaUz0=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/a3ed3a70-a7c0-11f0-8792-0ab376ee0ef4.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00269',
  'ANOS 2000: O RENASCIMENTO DA MARVEL VOL.09 (DE 10) - WOLVERI',
  'ANOS 2000: O RENASCIMENTO DA MARVEL VOL.09 (DE 10) - WOLVERI',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/FFnb-le_l7BYnbZzqyh_rpJ5df4=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/2e63f5bc-a4ac-11f0-a72e-eecb83d78201.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00270',
  'ANOS 2000: O RENASCIMENTO DA MARVEL VOL.10 (DE 10) - X-MEN',
  'ANOS 2000: O RENASCIMENTO DA MARVEL VOL.10 (DE 10) - X-MEN',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/_o8p5jpVEw_oMTHE8iMzSVM8_44=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/2e747144-a4ac-11f0-84d7-06a1e9b2bf33.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00271',
  'AO NO FLAG - 01 [REB]',
  'AO NO FLAG - 01 [REB]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/yjD_q0-EYf4gqku533x3Ck7i1YU=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/950f62b0-d816-11ee-b54b-e2697ce33d53.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00272',
  'AO NO FLAG N.2',
  'AO NO FLAG N.2',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/96HvX96DAeld2M_A5z3v3tFv_8A=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/981289ce-d816-11ee-a833-6efcfa6dd7bd.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00273',
  'AO NO FLAG N.3',
  'AO NO FLAG N.3',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/Xkdf65cuzbwL1cqwmTTog1-CySM=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/9af1b05c-d816-11ee-b54b-e2697ce33d53.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00274',
  'AQUAMAN POR GEOFF JOHNS  (DC OMNIBUS)',
  'AQUAMAN POR GEOFF JOHNS  (DC OMNIBUS)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/N94MgG9EiUhAvBrvKoyyvK_5-nk=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/03324d72-d81a-11ee-a453-e2697ce33d53.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00275',
  'AQUAMAN POR PETER DAVID VOL.01',
  'AQUAMAN POR PETER DAVID VOL.01',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/vl-Ebfq_ANZODStUiJgCN4vyVf8=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/ce4b49da-f616-11ef-b0f5-5ac998efac6d.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00276',
  'AQUAMAN: A BUSCA POR MERA (DC VINTAGE)',
  'AQUAMAN: A BUSCA POR MERA (DC VINTAGE)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/_7rbWgwNys8ngX-igiUYXRsOlg0=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/208e2090-de36-11ee-aae0-ca3362baf0a6.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00277',
  'AQUAMAN: A ESPADA DA ATLANTIDA (DC DELUXE)',
  'AQUAMAN: A ESPADA DA ATLANTIDA (DC DELUXE)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/uMsF4g364UY-Gef98Uw_4FTz9qk=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/9f389a22-d816-11ee-9ac4-da2373bc7c0b.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00278',
  'AQUAMAN: ANDROMEDA N.1',
  'AQUAMAN: ANDROMEDA N.1',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/DypneHzcxTGtld4hG2-Ln7QQ2UI=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/90adcb80-d816-11ee-a0ea-ae32267467a8.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00279',
  'ARAKAWA UNDER THE BRIDGE - 03 [REB3]',
  'ARAKAWA UNDER THE BRIDGE - 03 [REB3]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/4Ad5brgdMrUG4R0sL3WzmsUF6Ro=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/708d5604-3fd1-11ef-b3a6-d61c9c955b83.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00280',
  'ARAKAWA UNDER THE BRIDGE - 04 [REB3]',
  'ARAKAWA UNDER THE BRIDGE - 04 [REB3]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/PvJlTlrJJY6eRxHBUaePeaKxCRg=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/70479362-3fd1-11ef-9e50-eef13590f791.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00281',
  'ARAKAWA UNDER THE BRIDGE - 05 [REB3]',
  'ARAKAWA UNDER THE BRIDGE - 05 [REB3]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/mxzZYIiynCahwEwP_lQ8LUUbeXQ=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/706f9358-3fd1-11ef-ad89-5a355d509fb6.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00282',
  'ARQUEIRO VERDE (2024) VOL. 01',
  'ARQUEIRO VERDE (2024) VOL. 01',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/f10-teih6SU0YXOjrYplVRH5Yog=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/9e201af0-e583-11ee-b66f-62eaabe3d6ba.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00283',
  'ARQUEIRO VERDE (2024) VOL. 02',
  'ARQUEIRO VERDE (2024) VOL. 02',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/N49E8PaBJsFavxAsX_kfT5f1sG0=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/ce9ef88c-f616-11ef-9a8d-7ac96e6ce187.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00284',
  'ARQUEIRO VERDE (2024) VOL. 03',
  'ARQUEIRO VERDE (2024) VOL. 03',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/crxrIin7SgEZfEJDFi4yHQXiMKc=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/506ecf8a-8b5f-11f0-b3d9-165df9e621a1.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00285',
  'ARQUEIRO VERDE POR MIKE GRELL VOL. 1 (DC OMNIBUS)',
  'ARQUEIRO VERDE POR MIKE GRELL VOL. 1 (DC OMNIBUS)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/vFLJxl7lOFXGpTpLkKBGleiUvcs=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/206b5e00-6f3c-11f0-ac4b-2a24a967b96c.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00286',
  'ARQUEIRO VERDE POR MIKE GRELL VOL. 2 (DC OMNIBUS)',
  'ARQUEIRO VERDE POR MIKE GRELL VOL. 2 (DC OMNIBUS)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/McWEuX2g8jQu-N9c9pyG6FGxNWc=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/40ae8884-5ea9-11f0-885d-4eae30e658d1.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00287',
  'AS GRANDES PARÓDIAS DA TURMA DA MÔNICA - TRECOS ESTRANHOS (C',
  'AS GRANDES PARÓDIAS DA TURMA DA MÔNICA - TRECOS ESTRANHOS (C',
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
  'PROD-00288',
  'AS GRANDES PARÓDIAS DA TURMA DA MONICA N.10',
  'AS GRANDES PARÓDIAS DA TURMA DA MONICA N.10',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/J5d3WA_9owej9x1wgx4uCVpw7oQ=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/9831851e-eb29-11ef-8b75-5ac0f052206d.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00289',
  'AS GRANDES PARÓDIAS DA TURMA DA MONICA N.11',
  'AS GRANDES PARÓDIAS DA TURMA DA MONICA N.11',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/RcBc4ousR9txFPtL1353cHz1jPo=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/d974f8da-3f2f-11f0-87b4-c2502d24ff3f.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00290',
  'AS GRANDES PARÓDIAS DA TURMA DA MONICA N.7',
  'AS GRANDES PARÓDIAS DA TURMA DA MONICA N.7',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/U8ZZGyFW_Xyse7LxRWNbaRr-y0g=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/47fdc6c8-1705-11ef-9457-c2bd50076807.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00291',
  'AS GRANDES PARÓDIAS DA TURMA DA MONICA N.8',
  'AS GRANDES PARÓDIAS DA TURMA DA MONICA N.8',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/Q_SLUcLfAIRAyGg4o9Tp-r3G5IA=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/3775b6d6-7fd1-11f0-b894-2e1dcafaddd0.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00292',
  'AS GRANDES SAGAS DA TURMA DA MONICA N.1',
  'AS GRANDES SAGAS DA TURMA DA MONICA N.1',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/jNzSqreSQojLb8XjFo9Hiog1SnA=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/377f3526-7fd1-11f0-a5af-de5e70a27ff7.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00293',
  'AS GRANDES SAGAS DA TURMA DA MONICA N.2',
  'AS GRANDES SAGAS DA TURMA DA MONICA N.2',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/Ueyzk3xq1vKTPiFMRzUN6CY0_G0=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/24e9df1a-a4ac-11f0-8687-a638114deac1.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00294',
  'AS MAIS BELAS FABULAS - EDICAO DE LUXO VOL.02',
  'AS MAIS BELAS FABULAS - EDICAO DE LUXO VOL.02',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/kizqDtxxh9SRJFOvaipPsJiinpM=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/968ea566-eb29-11ef-a4f3-5a40d84dae09.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00295',
  'AS MAIS BELAS FABULAS VOL. 01 (EDICAO DE LUXO)',
  'AS MAIS BELAS FABULAS VOL. 01 (EDICAO DE LUXO)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/M1frMVFE_sC1nhnwapi8SzZzNAs=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/788ff090-4e7d-11ef-b438-b279561b7695.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00296',
  'AS MELHORES HISTÓRIAS DA MAGALI N.1 - BOX',
  'AS MELHORES HISTÓRIAS DA MAGALI N.1 - BOX',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/LjgqF-036socdLIP_40jZikcS3U=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/924f200c-eb29-11ef-89a1-ce85303a26c9.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00297',
  'AS MELHORES HISTÓRIAS DA MAGALI N.2',
  'AS MELHORES HISTÓRIAS DA MAGALI N.2',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/fCWVUsTfqpmNG0KgGVgsMP9KZnU=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/9268e924-eb29-11ef-a31a-8ed8743505f0.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00298',
  'AS MELHORES HISTÓRIAS DA MAGALI N.3',
  'AS MELHORES HISTÓRIAS DA MAGALI N.3',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/CfrPCIm2j975ksnA34Ujm58VZIo=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/a40d1910-08c6-11f0-847d-5e8a9da48498.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00299',
  'AS MELHORES HISTÓRIAS DA MAGALI N.4',
  'AS MELHORES HISTÓRIAS DA MAGALI N.4',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/Rb14Js6YUTaCw_iKB39730V021c=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/3d33299e-2475-11f0-9041-061a58ec2564.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00300',
  'AS MELHORES HISTORIAS DA MONICA N.1 (BOX)',
  'AS MELHORES HISTORIAS DA MONICA N.1 (BOX)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/n61ruZAHGKMcEuM51pPJLAMsYjQ=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/d0d87418-eb47-11ef-80c6-0ee70347c223.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();