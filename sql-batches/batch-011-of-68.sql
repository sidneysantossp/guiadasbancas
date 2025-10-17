-- SQL para importar produtos Brancaleone
-- Gerado em: 2025-10-17T17:52:46.765Z
-- Total de produtos: 3363
-- Fonte: brancaleone-products-1760723254011.json

-- 1. Criar distribuidor (se não existir)

-- Distribuidor já criado no batch-001

-- Lote 11 de 68
-- Produtos: 1001 até 1100



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00501',
  'BATMAN: AS AVENTURAS DA FAMILIA WAYNE VOL.02',
  'BATMAN: AS AVENTURAS DA FAMILIA WAYNE VOL.02',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/WBhAiPJqLhlDkG6OEE0Ff7hkNss=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/171b9b7c-f2f9-11ef-87c9-c69faf7ce99e.jpg"]'::jsonb,
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
  'PROD-00502',
  'BATMAN: AS AVENTURAS DA FAMILIA WAYNE VOL.1',
  'BATMAN: AS AVENTURAS DA FAMILIA WAYNE VOL.1',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/MvjfVETGa6S1pRqbGoS61u4Uw1E=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/c61fc886-63e4-11ef-8da1-f6206878cf7b.png"]'::jsonb,
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
  'PROD-00503',
  'BATMAN: AS DUAS FACES DO CRIME',
  'BATMAN: AS DUAS FACES DO CRIME',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/Yj87J1HAgUkdV8zKnsBZgFFooEI=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/8dcb36ce-3692-11f0-a555-0ab818bfd0ea.jpg"]'::jsonb,
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
  'PROD-00504',
  'BATMAN: ASAS E DEVOCAO N.1',
  'BATMAN: ASAS E DEVOCAO N.1',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/4wsu6so9sT2HSHrjybZhUO_PGf4=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/eeb53e16-d816-11ee-ae34-e2e54ed5f9f7.jpg"]'::jsonb,
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
  'PROD-00505',
  'BATMAN: ASILO ARKHAM (DC DE BOLSO)',
  'BATMAN: ASILO ARKHAM (DC DE BOLSO)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/zkffRORZmYcky1KKGllFZOOgAUo=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/e7d17ae0-9031-11f0-9754-9a60b14b6cd5.jpg"]'::jsonb,
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
  'PROD-00506',
  'BATMAN: BOA NOITE, BOM CAVALEIRO',
  'BATMAN: BOA NOITE, BOM CAVALEIRO',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/hOyFsNDEDyVagcvMrPBYHd-1li4=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/ef86bf72-d816-11ee-ae34-e2e54ed5f9f7.jpg"]'::jsonb,
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
  'PROD-00507',
  'BATMAN: BRUCE WAYNE: ASSASSINO? VOL. 01 (DC VINTAGE)',
  'BATMAN: BRUCE WAYNE: ASSASSINO? VOL. 01 (DC VINTAGE)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/1AOshMVV9j-BfgwGot7l1X-3eik=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/8f93dd0a-e583-11ee-b66f-62eaabe3d6ba.jpg"]'::jsonb,
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
  'PROD-00508',
  'BATMAN: CARO DETETIVE N.1',
  'BATMAN: CARO DETETIVE N.1',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/jTNVoFn5a9BtLnQZF-urhxEFkGU=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/90548f96-e583-11ee-8165-7ec3420f8e17.jpg"]'::jsonb,
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
  'PROD-00509',
  'BATMAN: CAVALEIRO BRANCO N.1',
  'BATMAN: CAVALEIRO BRANCO N.1',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/NvJLeqv6aRJxnXhizclY22WRVUo=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/8057c066-7fa9-11ef-b0bc-6e97175de7f7.jpg"]'::jsonb,
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
  'PROD-00510',
  'BATMAN: CLUBE ASSASSINO E OUTRAS HISTORIAS',
  'BATMAN: CLUBE ASSASSINO E OUTRAS HISTORIAS',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/GE7_JcDpxFO7vlf5I20gk3qHt60=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/38ab23aa-d817-11ee-ae34-e2e54ed5f9f7.jpg"]'::jsonb,
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
  'PROD-00511',
  'BATMAN: CONTAGIO VOL. 1 (GRANDES EVENTOS DC)',
  'BATMAN: CONTAGIO VOL. 1 (GRANDES EVENTOS DC)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/lOQBFwgS5VGxjakvH1ni_IBlCxA=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/83573ade-08c6-11f0-bd36-42d48cc2b562.jpg"]'::jsonb,
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
  'PROD-00512',
  'BATMAN: CONTAGIO VOL. 2 (GRANDES EVENTOS DC)',
  'BATMAN: CONTAGIO VOL. 2 (GRANDES EVENTOS DC)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/fHj4FEffPzaGsMg-qLgSQygaYDs=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/20a8927a-a4ac-11f0-84d7-06a1e9b2bf33.jpg"]'::jsonb,
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
  'PROD-00513',
  'BATMAN: ESPANTALHO / DUAS-CARAS: ANO UM',
  'BATMAN: ESPANTALHO / DUAS-CARAS: ANO UM',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/pEc8Xia3wNpnRBeaCD0Y-DG7MVE=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/96c8b2b0-eb29-11ef-8b75-5ac0f052206d.jpg"]'::jsonb,
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
  'PROD-00514',
  'BATMAN: EUROPA -  EDICAO DE LUXO',
  'BATMAN: EUROPA -  EDICAO DE LUXO',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/908jnegmX9GIHzLOSv5jAkMZgKc=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/c64a1dc6-eb47-11ef-a496-fa812316df6c.jpg"]'::jsonb,
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
  'PROD-00515',
  'BATMAN: FORTALEZA',
  'BATMAN: FORTALEZA',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/ynX5lQu2bx8nMxS5NqUAcAp4Jik=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/d2758602-d816-11ee-a0ea-ae32267467a8.jpg"]'::jsonb,
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
  'PROD-00516',
  'BATMAN: GOTHAM 1889 - EDICAO DE LUXO',
  'BATMAN: GOTHAM 1889 - EDICAO DE LUXO',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/KR2F3DSlKTctSa_E1ifmgVzdVDU=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/3d4c8088-5ea9-11f0-885d-4eae30e658d1.jpg"]'::jsonb,
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
  'PROD-00517',
  'BATMAN: GOTHAM 1893 - A ERA KRYPTONIANA',
  'BATMAN: GOTHAM 1893 - A ERA KRYPTONIANA',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/NX27r-lyt4_jLHWG1btoUSPo6H0=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/2c65a7cc-44b4-11f0-aadf-ca2b21e04af3.jpg"]'::jsonb,
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
  'PROD-00518',
  'BATMAN: GOTHAM KNIGHTS - A CIDADE DOURADA N.06 (DE 6)',
  'BATMAN: GOTHAM KNIGHTS - A CIDADE DOURADA N.06 (DE 6)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/WqrNBL9U0RQD3mHX2AX9fnZdODA=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/afd833fa-d817-11ee-9371-e2a33adec5cd.jpg"]'::jsonb,
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
  'PROD-00519',
  'BATMAN: GOTHAM KNIGHTS - A CIDADE DOURADA VOL.1',
  'BATMAN: GOTHAM KNIGHTS - A CIDADE DOURADA VOL.1',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/m7A6ujFK47L_DY96k6yZZR_4pFQ=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/ac6c1ef2-d817-11ee-9a1e-da2373bc7c0b.jpg"]'::jsonb,
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
  'PROD-00520',
  'BATMAN: GOTICO (BIBLIOTECA BATMAN) N.2',
  'BATMAN: GOTICO (BIBLIOTECA BATMAN) N.2',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/xDXQJHzlJd3DBhANuqVpJvCqlEw=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/47961aea-fb7c-11ee-8d43-76be7000d1e1.jpg"]'::jsonb,
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
  'PROD-00521',
  'BATMAN: JOGOS DE GUERRA VOL. 01',
  'BATMAN: JOGOS DE GUERRA VOL. 01',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/5_vM9j8c_YQoOSBIJ56uY_7Bs_I=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/488b73b4-fb7c-11ee-8eb3-aa961ba07ae0.jpg"]'::jsonb,
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
  'PROD-00522',
  'BATMAN: JOGOS DE GUERRA VOL. 02 (DC MAXIVINTAGE)',
  'BATMAN: JOGOS DE GUERRA VOL. 02 (DC MAXIVINTAGE)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/EG-yQJHfmzVqVgDIGJeq06b9MXE=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/b2ae91de-eb47-11ef-80c6-0ee70347c223.jpg"]'::jsonb,
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
  'PROD-00523',
  'BATMAN: JUSTICA PRESENTE - 01',
  'BATMAN: JUSTICA PRESENTE - 01',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/nbLaZWAuK_QJdAnqI8SfgCxksew=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/cc6ec30e-d816-11ee-a7e4-ce469b473a25.jpg"]'::jsonb,
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
  'PROD-00524',
  'BATMAN: JUSTICA PRESENTE - 02',
  'BATMAN: JUSTICA PRESENTE - 02',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/9aMDZCW9qUcUaCeyBNiG9lLn2Dw=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/ccf309c0-d816-11ee-bb12-5a86bcbeb6e3.jpg"]'::jsonb,
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
  'PROD-00525',
  'BATMAN: JUSTICA PRESENTE - 03',
  'BATMAN: JUSTICA PRESENTE - 03',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/UHWhTzxrcMY-z0Dsand-u2ABbzA=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/30d39ff4-e497-11ee-83ff-7ee42cfe9644.jpg"]'::jsonb,
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
  'PROD-00526',
  'BATMAN: LOUCO AMOR - EDICAO DE LUXO',
  'BATMAN: LOUCO AMOR - EDICAO DE LUXO',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/20M2zPanR0oBb3gDzS3_TNDGOYE=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/7fe057a6-7fa9-11ef-b1d0-12caec0ea15c.jpg"]'::jsonb,
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
  'PROD-00527',
  'BATMAN: MASCARA E OUTRAS LENDAS DAS TREVAS',
  'BATMAN: MASCARA E OUTRAS LENDAS DAS TREVAS',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/AI3vlZ0VKblN3PaSTNby4Q9R7yU=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/ef2d261a-d816-11ee-a7e4-ce469b473a25.jpg"]'::jsonb,
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
  'PROD-00528',
  'BATMAN: MORTE EM FAMÍLIA - ROBIN VIVE',
  'BATMAN: MORTE EM FAMÍLIA - ROBIN VIVE',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/FXBuSzWS794t6pxA7oy2os7HSGY=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/14fe8986-2791-11f0-98b7-1aa9445fa3e2.jpg"]'::jsonb,
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
  'PROD-00529',
  'BATMAN: NOITES DE TREVAS - METAL (OMNIBUS)',
  'BATMAN: NOITES DE TREVAS - METAL (OMNIBUS)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/Ug2X9A4vbesuPOOpzBD2PW3pHo0=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/86346f66-7fa9-11ef-b1d0-12caec0ea15c.jpg"]'::jsonb,
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
  'PROD-00530',
  'BATMAN: O CAVALEIRO VOL.01',
  'BATMAN: O CAVALEIRO VOL.01',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/LI-6N2LN5BKyG4R5Z_--HVPvWZQ=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/3d8be454-d817-11ee-ae34-e2e54ed5f9f7.jpg"]'::jsonb,
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
  'PROD-00531',
  'BATMAN: O CAVALEIRO VOL.02',
  'BATMAN: O CAVALEIRO VOL.02',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/50t6qtKUEQpp0Sfmu4tFZuU_Ocs=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/3dd980c4-d817-11ee-9a1e-da2373bc7c0b.jpg"]'::jsonb,
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
  'PROD-00532',
  'BATMAN: O MONGE LOUCO',
  'BATMAN: O MONGE LOUCO',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/MTudqIOlpt0CFDAxHt3OzPA2F7c=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/a2a351b2-eb29-11ef-8b75-5ac0f052206d.jpg"]'::jsonb,
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
  'PROD-00533',
  'BATMAN: O QUE E O QUE E',
  'BATMAN: O QUE E O QUE E',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/60SzkW9lv6R_F2IzL9pE_40D8ro=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/92b428c6-eb29-11ef-8b75-5ac0f052206d.jpg"]'::jsonb,
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
  'PROD-00534',
  'BATMAN: OS PORTOES DE GOTHAM - EDICAO DE LUXO',
  'BATMAN: OS PORTOES DE GOTHAM - EDICAO DE LUXO',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/DAgPrCH6bhOHfO4It_MU9jo8pdo=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/23eda2b8-2ce4-11ef-be32-e29a78b97fe9.jpg"]'::jsonb,
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
  'PROD-00535',
  'BATMAN: SINA MACABRA N.4',
  'BATMAN: SINA MACABRA N.4',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/VowKSVEJx7622n-tS0eF-0qdxeo=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/c28471f4-63e4-11ef-afd1-a2b2aa9ce723.png"]'::jsonb,
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
  'PROD-00536',
  'BATMAN: UM DIA RUIM VOL.08 RA S AL GHUL',
  'BATMAN: UM DIA RUIM VOL.08 RA S AL GHUL',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/4B-yrjX3OjPrDIwmoXOD311m2Io=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/9ba439da-d81a-11ee-ae87-e2e54ed5f9f7.jpg"]'::jsonb,
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
  'PROD-00537',
  'BATMAN: VENENO (REB)',
  'BATMAN: VENENO (REB)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/6VqUvkWBMgxQHijDKBUv6-OzCPk=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/9148d96e-eb29-11ef-a3b1-5681c2ac1d4b.jpg"]'::jsonb,
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
  'PROD-00538',
  'BATMAN: ZATANNA E OS SUPERPETS',
  'BATMAN: ZATANNA E OS SUPERPETS',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/x8D1U7T67YGYpJRfW-nWb3Jwx7Q=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/f0a6c404-0143-11f0-9602-e6e8567c501d.jpg"]'::jsonb,
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
  'PROD-00539',
  'BATMANGA DE JIRO KUWATA VOL.03 (DE 3)',
  'BATMANGA DE JIRO KUWATA VOL.03 (DE 3)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/3wXGE6Pc6kByTSWHNC4fOQwSpYQ=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/cbfd01d8-d816-11ee-a0ea-ae32267467a8.jpg"]'::jsonb,
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
  'PROD-00540',
  'BEAST COMPLEX - 02',
  'BEAST COMPLEX - 02',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/PNsjdVIIjeSriULuVZrMJk23r7Y=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/f5af54fe-d816-11ee-b54b-e2697ce33d53.jpg"]'::jsonb,
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
  'PROD-00541',
  'BEAST COMPLEX - 03',
  'BEAST COMPLEX - 03',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/AOmv9onwSN62evXRmVkLHYmWeOY=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/f625e588-d816-11ee-9ac4-da2373bc7c0b.jpg"]'::jsonb,
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
  'PROD-00542',
  'BEASTARS + BEAST COMPLEX - BOX',
  'BEASTARS + BEAST COMPLEX - BOX',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/8b_z3laot3OYWx_u8zWjRT0mizY=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/489a1120-8b5f-11f0-b3d9-165df9e621a1.jpg"]'::jsonb,
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
  'PROD-00543',
  'BELLE - 01',
  'BELLE - 01',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/j6ZHxgVWcwV-YbGHrbFugZPBgJs=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/5ce26b7a-da9c-11ee-b415-da2490dbf0ff.jpg"]'::jsonb,
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
  'PROD-00544',
  'BERSERK - 84',
  'BERSERK - 84',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/YoBlvNSry9JDGQ0I_fNLeeq1FWQ=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/714a3328-3fd1-11ef-ad89-5a355d509fb6.jpg"]'::jsonb,
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
  'PROD-00545',
  'BERSERK - EDIÇÃO DE LUXO - 01 [REB7]',
  'BERSERK - EDIÇÃO DE LUXO - 01 [REB7]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/iH9gG6feYjdWRaKcTIHeCUxhYeA=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/3d82456c-7fd1-11f0-a5af-de5e70a27ff7.jpg"]'::jsonb,
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
  'PROD-00546',
  'BERSERK - EDIÇÃO DE LUXO - 02 [REB7]',
  'BERSERK - EDIÇÃO DE LUXO - 02 [REB7]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/yMUGSjrQCAHECNPUC4aOTKFddbw=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/3da29542-7fd1-11f0-b894-2e1dcafaddd0.jpg"]'::jsonb,
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
  'PROD-00547',
  'BERSERK - EDIÇÃO DE LUXO - 03 [REB5]',
  'BERSERK - EDIÇÃO DE LUXO - 03 [REB5]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/6DvQCWgaAzBJ7u2Jclku94LHPmk=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/3ddd662c-7fd1-11f0-a5af-de5e70a27ff7.jpg"]'::jsonb,
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
  'PROD-00548',
  'BERSERK - EDIÇÃO DE LUXO - 04 [REB6]',
  'BERSERK - EDIÇÃO DE LUXO - 04 [REB6]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/WSy85Ywha0j07kkeZZXIdGfI7F0=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/3dfad5c2-7fd1-11f0-b894-2e1dcafaddd0.jpg"]'::jsonb,
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
  'PROD-00549',
  'BERSERK - EDIÇÃO DE LUXO - 05 [REB6]',
  'BERSERK - EDIÇÃO DE LUXO - 05 [REB6]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/NNAYEFIW1D6Yzk1maDTAJT3ncgI=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/3e0f5dda-7fd1-11f0-a5af-de5e70a27ff7.jpg"]'::jsonb,
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
  'PROD-00550',
  'BERSERK - EDIÇÃO DE LUXO - 06 [REB5]',
  'BERSERK - EDIÇÃO DE LUXO - 06 [REB5]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/NWgGG1wqfKZRo_3GV6ULa9pnGzc=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/4a6d785c-8b5f-11f0-b3d9-165df9e621a1.jpg"]'::jsonb,
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