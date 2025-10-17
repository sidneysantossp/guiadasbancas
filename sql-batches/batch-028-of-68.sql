-- SQL para importar produtos Brancaleone
-- Gerado em: 2025-10-17T17:52:46.765Z
-- Total de produtos: 3363
-- Fonte: brancaleone-products-1760723254011.json

-- 1. Criar distribuidor (se não existir)

-- Distribuidor já criado no batch-001

-- Lote 28 de 68
-- Produtos: 2701 até 2800



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01351',
  'GRAPHIC MSP VOL. 43 - CAPITAO FEIO N.3 (BROCHURA)',
  'GRAPHIC MSP VOL. 43 - CAPITAO FEIO N.3 (BROCHURA)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/RdlWJeD8d6TuyMfyiGXaTN7-Uvk=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/a2eb64de-eb29-11ef-8fb2-6696cc3e9cb3.jpg"]'::jsonb,
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
  'PROD-01352',
  'GRAPHIC MSP VOL. 43 - CAPITÃO FEIO N.3 (CAPA DURA)',
  'GRAPHIC MSP VOL. 43 - CAPITÃO FEIO N.3 (CAPA DURA)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/CN1fwgqRGzUsL5c3siS-bDdvpCA=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/a30cfdc4-eb29-11ef-8d7f-eea3b61904a2.jpg"]'::jsonb,
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
  'PROD-01353',
  'GRAPHIC MSP VOL. 44 - CHICO BENTO: VIOLA (CAPA CARTAO)',
  'GRAPHIC MSP VOL. 44 - CHICO BENTO: VIOLA (CAPA CARTAO)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/LOGjxLWTDjyKgGBF8Jtq0ShfSDk=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/3ff5a756-5ea9-11f0-885d-4eae30e658d1.jpg"]'::jsonb,
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
  'PROD-01354',
  'GRAPHIC MSP VOL. 44 - CHICO BENTO: VIOLA (CAPA DURA)',
  'GRAPHIC MSP VOL. 44 - CHICO BENTO: VIOLA (CAPA DURA)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/LOGjxLWTDjyKgGBF8Jtq0ShfSDk=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/3ff5a756-5ea9-11f0-885d-4eae30e658d1.jpg"]'::jsonb,
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
  'PROD-01355',
  'GRAPHIC MSP VOL. 45 - PENADINHO: LUZ (BROCHURA)',
  'GRAPHIC MSP VOL. 45 - PENADINHO: LUZ (BROCHURA)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/NlgWr8yNpc8mYGw2tVCtLM2yR3k=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/8ec8d68a-9d49-11f0-9da2-224f3a7b8ebb.jpg"]'::jsonb,
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
  'PROD-01356',
  'GRAPHIC MSP VOL. 45 - PENADINHO: LUZ (CAPA DURA)',
  'GRAPHIC MSP VOL. 45 - PENADINHO: LUZ (CAPA DURA)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/NlgWr8yNpc8mYGw2tVCtLM2yR3k=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/8ec8d68a-9d49-11f0-9da2-224f3a7b8ebb.jpg"]'::jsonb,
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
  'PROD-01357',
  'GRAPHIC MSP VOL.08 - TURMA DA MONICA: LICOES CD (REB)',
  'GRAPHIC MSP VOL.08 - TURMA DA MONICA: LICOES CD (REB)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/ce9dStWDMqbm61JHRVFhq2SdhkI=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/4221da9e-de36-11ee-831d-e63691a02f25.jpg"]'::jsonb,
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
  'PROD-01358',
  'GRAPHIC MSP VOL.17 (CD) N.1',
  'GRAPHIC MSP VOL.17 (CD) N.1',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/AuiA0CShDrPW2SJDj-Qvyyx_d3E=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/8d14b030-d819-11ee-a453-e2697ce33d53.jpg"]'::jsonb,
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
  'PROD-01359',
  'GRAPHIC MSP VOL.17 - JEREMIAS: PELE (REB)',
  'GRAPHIC MSP VOL.17 - JEREMIAS: PELE (REB)',
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
  'PROD-01360',
  'GRAPHIC MSP VOL.21 BROCH N.1',
  'GRAPHIC MSP VOL.21 BROCH N.1',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/ifk4gJw87FdXpfi21roXIodoFs8=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/8e26c90e-d819-11ee-a453-e2697ce33d53.jpg"]'::jsonb,
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
  'PROD-01361',
  'GRAPHIC MSP VOL.25 - CAPITAO FEIO: TORMENTA CD (REB)',
  'GRAPHIC MSP VOL.25 - CAPITAO FEIO: TORMENTA CD (REB)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/0cZ4DbPCOu51xvcJ38OcZX3ka7M=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/9503e126-d819-11ee-83df-e2e54ed5f9f7.jpg"]'::jsonb,
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
  'PROD-01362',
  'GROOT (2024)',
  'GROOT (2024)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/c5avxsa6lTqVlSFmGed_krvjXX4=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/30758cdc-de36-11ee-aae0-ca3362baf0a6.jpg"]'::jsonb,
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
  'PROD-01363',
  'GUARDIOES DA GALAXIA (2024) VOL. 01',
  'GUARDIOES DA GALAXIA (2024) VOL. 01',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/oUAm-AwIZOraNR946CgHc_7AsUw=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/4b86c140-fb7c-11ee-a932-f249d1132836.jpg"]'::jsonb,
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
  'PROD-01364',
  'GUARDIOES DA GALAXIA (2024) VOL.02',
  'GUARDIOES DA GALAXIA (2024) VOL.02',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/3-Nbo5x7Y2OLRWcANB9QqB26_1c=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/da7c4618-eb4a-11ef-8230-fa812316df6c.jpg"]'::jsonb,
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
  'PROD-01365',
  'GUARDIOES DA GALAXIA VOL.01: IMPERADOR QUILL (NOVA MARVEL DE',
  'GUARDIOES DA GALAXIA VOL.01: IMPERADOR QUILL (NOVA MARVEL DE',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/6l7vQwjiGhj4dYH_xfDV7QS0B-g=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/77c2146e-da7d-11ee-9fe4-12792fd81a45.jpg"]'::jsonb,
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
  'PROD-01366',
  'GUARDIOES DA GALAXIA VOL.02: GUERRA CIVIL II (NOVA MARVEL DE',
  'GUARDIOES DA GALAXIA VOL.02: GUERRA CIVIL II (NOVA MARVEL DE',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/0ophMOIYd1fVdrnYpOoFhjql_fo=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/a7ebe860-dd64-11ee-96de-1ab607e382e6.jpg"]'::jsonb,
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
  'PROD-01367',
  'GUARDIOES DA GALAXIA: CONTOS DO COSMO',
  'GUARDIOES DA GALAXIA: CONTOS DO COSMO',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/G5JJIiodiU9T9Of897PsbEJtUB4=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/6223d6b4-da9c-11ee-b415-da2490dbf0ff.jpg"]'::jsonb,
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
  'PROD-01368',
  'GUARDIOES DA GALAXIA: VINGADORES COSMICOS (MARVEL ESSENCIAIS',
  'GUARDIOES DA GALAXIA: VINGADORES COSMICOS (MARVEL ESSENCIAIS',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/fZi6yL7BZJQ0byAs_zoZBudKNe4=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/a73b910e-dd64-11ee-9e0c-221fb33d9142.jpg"]'::jsonb,
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
  'PROD-01369',
  'GUERRA DE GANGUES: DEMOLIDOR & LUKE CAGE',
  'GUERRA DE GANGUES: DEMOLIDOR & LUKE CAGE',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/76LMz767HY6q36b03aNcy9d54Y8=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/c27ed59a-f616-11ef-9565-f2e31ca8a769.jpg"]'::jsonb,
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
  'PROD-01370',
  'GUERRA VINGADORES VS DEFENSORES (MARVEL ESSENCIAIS)',
  'GUERRA VINGADORES VS DEFENSORES (MARVEL ESSENCIAIS)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/UJ3hYyZ283UPszuc07lHH24IaTA=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/8d111ad2-3692-11f0-a81e-4229cd842ad5.jpg"]'::jsonb,
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
  'PROD-01371',
  'GUERRAS DEMONIACAS N.1',
  'GUERRAS DEMONIACAS N.1',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/vYnekYas4Cy_5PPWbGmWmLSz_IU=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/a39f92b8-d817-11ee-b124-5a86bcbeb6e3.jpg"]'::jsonb,
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
  'PROD-01372',
  'GUERRAS SECRETAS: MUNDO BELICO (LENDAS MARVEL)',
  'GUERRAS SECRETAS: MUNDO BELICO (LENDAS MARVEL)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/H0N_19bU6V6TyBj8nXAQX5UJY6s=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/8fa74410-3692-11f0-ab90-9a315decf800.jpg"]'::jsonb,
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
  'PROD-01373',
  'GWEN-ARANHA ESMAGA',
  'GWEN-ARANHA ESMAGA',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/dyqSMrhs6_OyWHEl1w_HCV2yJuA=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/3f8beac8-5ea9-11f0-885d-4eae30e658d1.jpg"]'::jsonb,
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
  'PROD-01374',
  'GWEN-ARANHA: CLONES DAS SOMBRAS N.1',
  'GWEN-ARANHA: CLONES DAS SOMBRAS N.1',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/GLLUNgDsK-SHe6afe9-Y_9bRT_g=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/01671916-1ca6-11ef-b80c-228c440649c1.jpg"]'::jsonb,
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
  'PROD-01375',
  'HANAKO-KUN DEPOIS DA ESCOLA - 01',
  'HANAKO-KUN DEPOIS DA ESCOLA - 01',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/I9OcpV-lalJlGg1occJKbDRIdRo=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/7991c59a-4e7d-11ef-aed3-3a86ab418552.jpg"]'::jsonb,
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
  'PROD-01376',
  'HANAKO-KUN E OS MISTÉRIOS DO COLÉGIO KAMOME - 21',
  'HANAKO-KUN E OS MISTÉRIOS DO COLÉGIO KAMOME - 21',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/jNaG7uzcjUJ19FmWWYSn6Dc90Qw=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/c6ef6992-63e4-11ef-afd1-a2b2aa9ce723.png"]'::jsonb,
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
  'PROD-01377',
  'HANAKO-KUN E OS MISTÉRIOS DO COLÉGIO KAMOME - 23',
  'HANAKO-KUN E OS MISTÉRIOS DO COLÉGIO KAMOME - 23',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/jwXxbZw5vYUsneb9WMAHbfhtfhY=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/47680474-8b5f-11f0-b876-cef4535c59b2.jpg"]'::jsonb,
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
  'PROD-01378',
  'HANAKO-KUN E OS MISTÉRIOS DO COLÉGIO KAMOME N.5',
  'HANAKO-KUN E OS MISTÉRIOS DO COLÉGIO KAMOME N.5',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/QSwyN1pBnrKIvbugmzMgQ4blGJ0=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/7a0a3cfa-4e7d-11ef-ad76-364e4b45dfa1.jpg"]'::jsonb,
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
  'PROD-01379',
  'HARA HARA SENSEI - A PROFESSORA BOMBA-RELÓGIO - 01',
  'HARA HARA SENSEI - A PROFESSORA BOMBA-RELÓGIO - 01',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/mRrQ51p0i5hnEaajZx78YBHB-FU=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/9851a542-eb29-11ef-89a1-ce85303a26c9.jpg"]'::jsonb,
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
  'PROD-01380',
  'HARA HARA SENSEI - A PROFESSORA BOMBA-RELÓGIO - 02',
  'HARA HARA SENSEI - A PROFESSORA BOMBA-RELÓGIO - 02',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/d5bAJ7yCrB4boMSZFEG4KSMD-C4=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/983ff0e0-1941-11f0-ab25-7e3d31f80894.jpg"]'::jsonb,
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
  'PROD-01381',
  'HARA HARA SENSEI - A PROFESSORA BOMBA-RELÓGIO - 03',
  'HARA HARA SENSEI - A PROFESSORA BOMBA-RELÓGIO - 03',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/DqEEoseD2OTwqVkfj5qq2_Mi_gs=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/379a7a7a-7fd1-11f0-b894-2e1dcafaddd0.jpg"]'::jsonb,
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
  'PROD-01382',
  'HARA HARA SENSEI - A PROFESSORA BOMBA-RELÓGIO - 04',
  'HARA HARA SENSEI - A PROFESSORA BOMBA-RELÓGIO - 04',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/ltkBP0yDmwK89h4ay1SlRgotqaw=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/4767faba-8b5f-11f0-ab6e-7e1ab2cbb1e5.jpg"]'::jsonb,
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
  'PROD-01383',
  'HELLBLAZER VOL. 07 -  EDICAO DE LUXO',
  'HELLBLAZER VOL. 07 -  EDICAO DE LUXO',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/RvAwlnbfjGCEdOSruAoH6moOmzI=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/c70ff9b4-63e4-11ef-8233-ba818e5f55ac.png"]'::jsonb,
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
  'PROD-01384',
  'HELLBLAZER VOL. 08 -  EDICAO DE LUXO',
  'HELLBLAZER VOL. 08 -  EDICAO DE LUXO',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/0l8PQaHcsP1fbZhQ34C1q4GgP4M=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/ad9d83aa-ee29-11ef-b50b-52169ed8ea49.jpg"]'::jsonb,
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
  'PROD-01385',
  'HELLBLAZER VOL. 09 -  EDICAO DE LUXO',
  'HELLBLAZER VOL. 09 -  EDICAO DE LUXO',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/78qB4iojNIJnX2sTZxu05C9v8Ok=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/f7b9da10-feb9-11ef-b81f-9246b5a3d333.jpg"]'::jsonb,
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
  'PROD-01386',
  'HELLBLAZER VOL. 1 -  EDICAO DE LUXO (REB)',
  'HELLBLAZER VOL. 1 -  EDICAO DE LUXO (REB)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/BZjmWdc89TC_kSnElYcbdRWUDdY=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/426b6548-5ea9-11f0-885d-4eae30e658d1.jpg"]'::jsonb,
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
  'PROD-01387',
  'HELLBLAZER VOL. 10 -  EDICAO DE LUXO',
  'HELLBLAZER VOL. 10 -  EDICAO DE LUXO',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/3_9klliGe14d4iNPPFJHT3a2WuY=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/550cf736-2473-11f0-9f5d-3a5555ec2c23.jpg"]'::jsonb,
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
  'PROD-01388',
  'HELLBLAZER VOL. 11 -  EDICAO DE LUXO',
  'HELLBLAZER VOL. 11 -  EDICAO DE LUXO',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/JVHu6MpDj_KeUeQ9aYS3jtglOGY=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/478f71e4-8b5f-11f0-b3d9-165df9e621a1.jpg"]'::jsonb,
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
  'PROD-01389',
  'HELLBLAZER VOL. 2 -  EDICAO DE LUXO (REB)',
  'HELLBLAZER VOL. 2 -  EDICAO DE LUXO (REB)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/s7cJRMhuiVRyA37QBt24qi94-PM=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/985aa778-eb29-11ef-a3b1-5681c2ac1d4b.jpg"]'::jsonb,
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
  'PROD-01390',
  'HELLBLAZER VOL. 3 -  EDICAO DE LUXO (REB)',
  'HELLBLAZER VOL. 3 -  EDICAO DE LUXO (REB)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/eE40pnCktYlwBYGuN23QVff7ZLY=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/af0742f8-ee29-11ef-8f95-26a97ff90d5c.jpg"]'::jsonb,
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
  'PROD-01391',
  'HELLBLAZER VOL. 4 -  EDICAO DE LUXO',
  'HELLBLAZER VOL. 4 -  EDICAO DE LUXO',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/nURPU9D868b-bRRgtSzGnUC_4KI=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/985cca58-1941-11f0-85af-b67ae79b02ea.jpg"]'::jsonb,
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
  'PROD-01392',
  'HELL´S PARADISE N.1',
  'HELL´S PARADISE N.1',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/V3m5Ym8HU73JUjAgqzNpyxpBogE=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/7c232d80-4e7d-11ef-9a7d-6ef807fbb3ad.jpg"]'::jsonb,
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
  'PROD-01393',
  'HEN NA IE - 01',
  'HEN NA IE - 01',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/w5q7sMHRrsA85IonTydnd6znlbM=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/1b1bf730-48b7-11f0-9d89-9eda44bc3e04.jpg"]'::jsonb,
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
  'PROD-01394',
  'HERA VENENOSA (2022) VOL.04',
  'HERA VENENOSA (2022) VOL.04',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/-D4fPGJfF_Fm0JntMPp80VzSGDc=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/db12b54e-eb4a-11ef-a198-2a5f63e8aebc.jpg"]'::jsonb,
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
  'PROD-01395',
  'HERA VENENOSA N.3',
  'HERA VENENOSA N.3',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/6K1IamJWg7z7K4lpkxQT5y8s4u0=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/285a3a22-ebef-11ee-963f-1e73add0c60b.jpg"]'::jsonb,
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
  'PROD-01396',
  'HIRAYASUMI - 02',
  'HIRAYASUMI - 02',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/Xm-iVkyZhxq2nPsdo6BXQoa5yXc=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/ae2b1670-ee29-11ef-8ad2-fe0cb56c9a3d.jpg"]'::jsonb,
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
  'PROD-01397',
  'HIRAYASUMI - 03',
  'HIRAYASUMI - 03',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/dHXHaTbb14FcbDwWcUP6-QljjXE=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/98967c58-eb29-11ef-a3b1-5681c2ac1d4b.jpg"]'::jsonb,
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
  'PROD-01398',
  'HIRAYASUMI - 04',
  'HIRAYASUMI - 04',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/2S4TBPnhRsdW1RhEcRrNAuJk9-o=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/98a9abfc-eb29-11ef-b1d3-def782e2bf12.jpg"]'::jsonb,
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
  'PROD-01399',
  'HIRAYASUMI - 05',
  'HIRAYASUMI - 05',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/ZXt3JmI64jUzB6zq0HMBg6sqjho=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/9877a5bc-1941-11f0-a130-225e61b3373a.jpg"]'::jsonb,
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
  'PROD-01400',
  'HIRAYASUMI - 06',
  'HIRAYASUMI - 06',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/OA3P6OpofcZ-NkXBnqWlYY_-h4k=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/445aa774-5ea9-11f0-885d-4eae30e658d1.jpg"]'::jsonb,
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