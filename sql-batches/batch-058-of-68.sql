-- SQL para importar produtos Brancaleone
-- Gerado em: 2025-10-17T18:20:53.612Z
-- Total de produtos: 3363
-- Fonte: brancaleone-products-1760723254011.json

-- 1. Criar distribuidor (se não existir)

-- Distribuidor já criado no batch-001

-- Lote 58 de 68
-- Produtos: 5701 até 5800



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02851',
  'STRANGER THINGS N.6',
  'STRANGER THINGS N.6',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/CQJI9YLanNeyx_ESeHLZbakj58w=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/8f70ff70-4e7d-11ef-843b-e2b73938f46c.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02852',
  'STRANGER THINGS VOL.07: ESPECIAL DE FERIAS',
  'STRANGER THINGS VOL.07: ESPECIAL DE FERIAS',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/DK8_90yueS2SLgaO5jzmRVLA7eE=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/9e0ff4ba-08c6-11f0-bef2-5a37e2f27c8c.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02853',
  'STRANGER THINGS VOL.08: CONTOS DE HAWKINS',
  'STRANGER THINGS VOL.08: CONTOS DE HAWKINS',
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
  'PROD-02854',
  'STROBE EDGE - 03',
  'STROBE EDGE - 03',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/cGDaJFG0LBZLo3TR-qldhDirgSI=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/c7d9ad9e-642a-11f0-8bc5-aa2e25388802.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02855',
  'STROBE EDGE - 04',
  'STROBE EDGE - 04',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/1sYljme55JLCop15NYT2bnXpdA4=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/44380afe-7fd1-11f0-a5af-de5e70a27ff7.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02856',
  'STROBE EDGE - 05',
  'STROBE EDGE - 05',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/xWtOc-3UCf01G3y_yNPEoufIyks=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/5291f9ae-8b5f-11f0-b3d9-165df9e621a1.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02857',
  'STROBE EDGE - 06',
  'STROBE EDGE - 06',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/40dy-7Y4GzaatDFtViVmrocaGq0=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/2acb9e8c-a4ac-11f0-8bce-3af03c92463f.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02858',
  'STROBE EDGE - 1',
  'STROBE EDGE - 1',
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
  'PROD-02859',
  'STROBE EDGE - 2',
  'STROBE EDGE - 2',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/H3UD4p2SemqdrsIn6RedeKOYztA=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/d56943c2-3f2f-11f0-87b4-c2502d24ff3f.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02860',
  'SUPER ALMANAQUE TURMA DA MONICA N.17',
  'SUPER ALMANAQUE TURMA DA MONICA N.17',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/74h4KHuTCzXPsvEMWNMNQC7PEKo=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/1e74c86c-f2f9-11ef-87c9-c69faf7ce99e.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02861',
  'SUPER ALMANAQUE TURMA DA MONICA N.18',
  'SUPER ALMANAQUE TURMA DA MONICA N.18',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/uGSq9D76Rv0dUMCrgQZ9JPX4Lck=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/de0b41e2-3f2f-11f0-a17d-1ac4d5553c9e.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02862',
  'SUPER ALMANAQUE TURMA DA MONICA N.19',
  'SUPER ALMANAQUE TURMA DA MONICA N.19',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/riqif05MFhuDMfb_2rDCP6gbl6U=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/281da306-a4ac-11f0-aa03-16ade38a6d4b.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02863',
  'SUPER CHOQUE (2022) VOL. 04',
  'SUPER CHOQUE (2022) VOL. 04',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/KpuzHup7F57q4pDF6S_Scdhp02c=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/62479b0a-d81a-11ee-9cda-5a86bcbeb6e3.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02864',
  'SUPERBOY: O HOMEM DO AMANHA N.1',
  'SUPERBOY: O HOMEM DO AMANHA N.1',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/6pHMdM9nQE-7PdynKFJSF-GytME=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/8d9c16e4-4e7d-11ef-9e33-da9904c52884.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02865',
  'SUPERBOY: PROBLEMAS NO PARAISO (DC MAXIVINTAGE)',
  'SUPERBOY: PROBLEMAS NO PARAISO (DC MAXIVINTAGE)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/IWHvIbQcS1I-Q4sYjHLxFHVEjwc=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/20ec0b64-48b7-11f0-98d1-7a925bb2c122.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02866',
  'SUPERCHOQUE (2022) VOL. 02',
  'SUPERCHOQUE (2022) VOL. 02',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/m8Bmp2dS0JknMOa2vX_LhSucFac=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/615a7370-d81a-11ee-bd84-e2697ce33d53.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02867',
  'SUPERGIRL POR  PETER DAVID (DC VINTAGE) N.2',
  'SUPERGIRL POR  PETER DAVID (DC VINTAGE) N.2',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/VVaWHFrNe83bkdZF0APkkTOxBUY=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/792bcaf6-4e7d-11ef-a912-ae3b80f67920.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02868',
  'SUPERGIRL POR  PETER DAVID E GARY FRANK (DC VINTAGE)',
  'SUPERGIRL POR  PETER DAVID E GARY FRANK (DC VINTAGE)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/VkKEMcHdkhPHvUdkwRUCeSp1B2E=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/a65f1a64-d817-11ee-bce8-e2e54ed5f9f7.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02869',
  'SUPERGIRL POR  PETER DAVID E GARY FRANK VOL. 03 (DC VINTAGE)',
  'SUPERGIRL POR  PETER DAVID E GARY FRANK VOL. 03 (DC VINTAGE)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/stdgqbgDByALYoROQAJiR2laGNE=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/97a75bc8-eb29-11ef-9927-fa812316df6c.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02870',
  'SUPERGIRL POR  PETER DAVID E GARY FRANK VOL. 04 (DC VINTAGE)',
  'SUPERGIRL POR  PETER DAVID E GARY FRANK VOL. 04 (DC VINTAGE)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/4y2_V6f0oPi-knypqZwJFp6i6iU=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/1d77f06a-69af-11f0-9136-d26b36de5d6c.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02871',
  'SUPERGIRL: A MULHER DO AMANHA - EDICAO DE LUXO',
  'SUPERGIRL: A MULHER DO AMANHA - EDICAO DE LUXO',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/dpXLU7LQlayLoLg6EVEFnWZN6VI=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/ab04a158-eb29-11ef-a4f3-5a40d84dae09.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02872',
  'SUPERMAN (2017) N.01/78',
  'SUPERMAN (2017) N.01/78',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/wqKYUVjRO8afj_ikFpSTPfWZ5wQ=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/992d3d6a-a7c0-11f0-8792-0ab376ee0ef4.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02873',
  'SUPERMAN (2017) N.02/79',
  'SUPERMAN (2017) N.02/79',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/Ejq8JlvhHty6GffWepkrPt1jiTA=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/9460bece-d8a0-11ee-98e4-5a86bcbeb6e3.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02874',
  'SUPERMAN (2017) N.06/83',
  'SUPERMAN (2017) N.06/83',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/a7gejBc5moa-96hxHeggoTjTrMI=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/63461b2e-d817-11ee-a7e4-ce469b473a25.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02875',
  'SUPERMAN (2017) N.13/71',
  'SUPERMAN (2017) N.13/71',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/ek0aQxNRlpSkq-oLB6ETgDubuXk=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/6defceda-d89e-11ee-a553-5a86bcbeb6e3.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02876',
  'SUPERMAN (2017) N.13/90',
  'SUPERMAN (2017) N.13/90',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/lXC8R5e-4t-6smrif4-bw8mXd84=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/7fa8c7be-7fa9-11ef-b1d0-12caec0ea15c.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02877',
  'SUPERMAN (2017) N.14/72',
  'SUPERMAN (2017) N.14/72',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/B5FU0XoHTqHF8CiBah2Uc2A4gWk=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/6c3d0ef4-d89e-11ee-94f7-ee1b80a1fcb2.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02878',
  'SUPERMAN (2017) N.14/91',
  'SUPERMAN (2017) N.14/91',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/VJ4_3THORAsMsLxvAX5mdl-DP2Q=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/d851d6e6-eb4a-11ef-8230-fa812316df6c.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02879',
  'SUPERMAN (2017) N.15/92',
  'SUPERMAN (2017) N.15/92',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/owL1kQfUArtmqPJOouj_WKoExWk=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/9542b8d2-eb29-11ef-8b75-5ac0f052206d.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02880',
  'SUPERMAN (2017) N.16/74',
  'SUPERMAN (2017) N.16/74',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/W9lWj72yRbxqMpUa58aRxkYRZNM=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/59d44d22-d817-11ee-a7e4-ce469b473a25.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02881',
  'SUPERMAN (2017) N.16/93',
  'SUPERMAN (2017) N.16/93',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/XWcd-6bRhP7eaxf6OfVqIy0eG1A=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/9554e7aa-eb29-11ef-9e36-2a856f41baa0.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02882',
  'SUPERMAN (2017) N.17/75',
  'SUPERMAN (2017) N.17/75',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/xAk9NQoz0utDr2NR6N8_CSvZz5s=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/5ab1bf68-d817-11ee-a3da-e2697ce33d53.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02883',
  'SUPERMAN (2017) N.17/94',
  'SUPERMAN (2017) N.17/94',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/btIo4iSOq5phr5JM4vJYfpRBsZ0=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/956a8b6e-eb29-11ef-9927-fa812316df6c.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02884',
  'SUPERMAN (2017) N.18/76',
  'SUPERMAN (2017) N.18/76',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/lxV_-eaHayBFa5gXHtDmZ3IzB8g=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/cacdb496-d89e-11ee-b912-26337c3739c7.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02885',
  'SUPERMAN (2017) N.18/95',
  'SUPERMAN (2017) N.18/95',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/MsM1EUdn5_zbRfRNcltEsHAusvY=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/c0f92a68-f616-11ef-988d-b68eeb3470d5.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02886',
  'SUPERMAN (2017) N.19/77',
  'SUPERMAN (2017) N.19/77',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/wEHO-4HWft9HazSLyzmtXCbixqs=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/5badc8b2-d817-11ee-a3da-e2697ce33d53.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02887',
  'SUPERMAN (2017) N.19/96',
  'SUPERMAN (2017) N.19/96',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/D4RKZWWlHMRRtQc9_gcPcJEL3NY=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/7e27e212-08c5-11f0-82b3-aa6cc179f47d.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02888',
  'SUPERMAN (2017) N.20/97',
  'SUPERMAN (2017) N.20/97',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/y-0upe-Gna9wS97i1Uep49TDNtU=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/549530ac-2473-11f0-a45f-e6e875f51541.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02889',
  'SUPERMAN (2017) N.21/98',
  'SUPERMAN (2017) N.21/98',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/_Cq7awgFSf73jl37C_M4zO5Y278=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/d841a328-3f2f-11f0-a17d-1ac4d5553c9e.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02890',
  'SUPERMAN (2017) N.22/99',
  'SUPERMAN (2017) N.22/99',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/LY2WkCt5efDh3BB5TOlUAFGO2nY=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/3cc00a5e-5ea9-11f0-885d-4eae30e658d1.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02891',
  'SUPERMAN (2017) N.23/100',
  'SUPERMAN (2017) N.23/100',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/TLLWQPDFP4D6JCEMue1BHVIcVWU=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/36a4cc92-7fd1-11f0-b894-2e1dcafaddd0.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02892',
  'SUPERMAN (2017) N.23/100 - CAPA VARIANTE FILME SUPERMAN',
  'SUPERMAN (2017) N.23/100 - CAPA VARIANTE FILME SUPERMAN',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/svEyxTI6KczjCsVN93o6QMMnxKg=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/36bae9e6-7fd1-11f0-a5af-de5e70a27ff7.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02893',
  'SUPERMAN (2017) N.24/101',
  'SUPERMAN (2017) N.24/101',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/zGFSrlA-bRHcpsLt3ehwYHSyQ-I=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/5580e49a-8b5f-11f0-ab6e-7e1ab2cbb1e5.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02894',
  'SUPERMAN (2017) N.80',
  'SUPERMAN (2017) N.80',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/IbOzhU0MoqKmM8OkDYv0B9n1uyw=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/61191a7c-d817-11ee-a3da-e2697ce33d53.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02895',
  'SUPERMAN (2017) N.85',
  'SUPERMAN (2017) N.85',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/EAsWZfVN_sV8BFVYFjNUuNl433s=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/d2f07674-119a-11ef-bfb2-36a257064742.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02896',
  'SUPERMAN (2017) N.87',
  'SUPERMAN (2017) N.87',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/FHp47AMRf4b-0ymBx738xwFbJGM=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/23c21d82-2ce4-11ef-ae6b-6ab875123cf0.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02897',
  'SUPERMAN (2017) N.89',
  'SUPERMAN (2017) N.89',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/2nneMWEHbj_g6voC-8j-ppV-cvA=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/d80790ae-eb4a-11ef-8621-0ee70347c223.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02898',
  'SUPERMAN (2025) N.01',
  'SUPERMAN (2025) N.01',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/RQ3CBXB-bVBuGMB8IXxH2jZIjMw=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/075fc23a-98c6-11f0-a3a7-72005e3615ab.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02899',
  'SUPERMAN 78',
  'SUPERMAN 78',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/PWOMEBfG3RXjW6YLnSkINH4ObRQ=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/480b1100-de36-11ee-aae0-ca3362baf0a6.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02900',
  'SUPERMAN 78: A CORTINA DE FERRO',
  'SUPERMAN 78: A CORTINA DE FERRO',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/QKRoLOMw-tUtnQjuBLc6tmxqyGY=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/8c2a2532-3692-11f0-a9ef-e679d989cbbb.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();