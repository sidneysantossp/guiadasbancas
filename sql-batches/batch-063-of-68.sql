-- SQL para importar produtos Brancaleone
-- Gerado em: 2025-10-17T18:20:53.612Z
-- Total de produtos: 3363
-- Fonte: brancaleone-products-1760723254011.json

-- 1. Criar distribuidor (se não existir)

-- Distribuidor já criado no batch-001

-- Lote 63 de 68
-- Produtos: 6201 até 6300



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-03101',
  'TURMA DA MONICA (2021-) N.85',
  'TURMA DA MONICA (2021-) N.85',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/qEaNkMeSj90kMLgqx1xD2fQn5pQ=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/44f98134-7fd1-11f0-b894-2e1dcafaddd0.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-03102',
  'TURMA DA MONICA (2021-) N.86',
  'TURMA DA MONICA (2021-) N.86',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/4L6hp3k8qubbWsDpSDlfVYrB4hM=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/4511eb16-7fd1-11f0-a5af-de5e70a27ff7.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-03103',
  'TURMA DA MONICA (2021-) N.87',
  'TURMA DA MONICA (2021-) N.87',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/2AuWwD7i-TNzzRatMqMLUKhuZ-w=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/08ae111e-98c6-11f0-af89-d2e8520fe6b7.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-03104',
  'TURMA DA MONICA (2021-) N.88',
  'TURMA DA MONICA (2021-) N.88',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/SKYvcSE0FQ5uB9BrL7tXSDuEBu0=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/2bed16ce-a4ac-11f0-8bce-3af03c92463f.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-03105',
  'TURMA DA MÔNICA E MARCELO MARMELO MARTELO N. 1 (CAPA CARTÃO)',
  'TURMA DA MÔNICA E MARCELO MARMELO MARTELO N. 1 (CAPA CARTÃO)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/_aNJiN4bIv0EdfUT11MtV0PidQ4=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/1b0adb9a-eb4b-11ef-8621-0ee70347c223.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-03106',
  'TURMA DA MONICA E MARCELO MARMELO MARTELO N.1 (CAPA DURA)',
  'TURMA DA MONICA E MARCELO MARMELO MARTELO N.1 (CAPA DURA)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/ol96nPtkepe1xaX_SfLLSQmnNSo=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/1afe1ac2-eb4b-11ef-9da2-4af6893572b2.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-03107',
  'TURMA DA MONICA JOVEM (2 N.30',
  'TURMA DA MONICA JOVEM (2 N.30',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/pmvSs_lPwkp8pLeuR2KB9YRLit4=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/698f5154-f111-11ee-a5cd-8a405d94faf7.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-03108',
  'TURMA DA MONICA JOVEM (2 N.31',
  'TURMA DA MONICA JOVEM (2 N.31',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/zxDTjjywb-FuXPBQ-g09LVQa3iA=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/85834938-f111-11ee-a04c-e21a811468e1.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-03109',
  'TURMA DA MONICA JOVEM (2 N.32',
  'TURMA DA MONICA JOVEM (2 N.32',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/na4Q1Y-BSXohMLbJpW1ebW3KbyM=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/221df386-069a-11ef-92f0-cafd48a576cd.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-03110',
  'TURMA DA MONICA JOVEM (2 N.34',
  'TURMA DA MONICA JOVEM (2 N.34',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/pLvEkQ6olx1IMs1y7rkqkZan2PY=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/8fe26fc0-4e7d-11ef-b6fd-42ec70ffd9b9.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-03111',
  'TURMA DA MONICA JOVEM (2021) N.33',
  'TURMA DA MONICA JOVEM (2021) N.33',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/M-lxB9vlV27GQvTPA5azbiSKFR4=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/037c84e8-1ca6-11ef-bc32-def7b1441874.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-03112',
  'TURMA DA MONICA JOVEM (2021) N.35',
  'TURMA DA MONICA JOVEM (2021) N.35',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/WdV_cQRYNygR0mbY16OW4zcHfhI=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/8fe70ea4-4e7d-11ef-843b-e2b73938f46c.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-03113',
  'TURMA DA MONICA JOVEM (2021) N.38 BOX',
  'TURMA DA MONICA JOVEM (2021) N.38 BOX',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/DNr5hkdc-eLw5uwKAMerg72czRQ=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/1ad66734-eb4b-11ef-8ed2-eeedfdcff086.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-03114',
  'TURMA DA MONICA JOVEM (2022) N.39',
  'TURMA DA MONICA JOVEM (2022) N.39',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/qs6JkkFiL-ZpYvihKS0FjjOu5Xc=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/ad43c0f2-eb29-11ef-913d-52f5d450f8a6.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-03115',
  'TURMA DA MONICA JOVEM (2022) N.40',
  'TURMA DA MONICA JOVEM (2022) N.40',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/bmR8m8fkmmcf9_LWBF0-sv49bX4=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/ae8c1860-eb29-11ef-a31a-8ed8743505f0.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-03116',
  'TURMA DA MONICA JOVEM N.25',
  'TURMA DA MONICA JOVEM N.25',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/40X5Ye6Ck_Wpn-71KgKwPBdMwUc=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/832e7938-d81a-11ee-9df9-5a86bcbeb6e3.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-03117',
  'TURMA DA MONICA JOVEM N.37',
  'TURMA DA MONICA JOVEM N.37',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/o1_xV6bUrEo5jzzuolG8fg54BCg=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/8ace3444-7fa9-11ef-b1d0-12caec0ea15c.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-03118',
  'TURMA DA MONICA JOVEM N.42 - BOX',
  'TURMA DA MONICA JOVEM N.42 - BOX',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/0mTuEUlh7Q4McfGG4VpifAW1H8k=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/933a958c-9d49-11f0-8d6a-ea1fee69cf88.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-03119',
  'TURMA DA MONICA JOVEM N.46 BOX',
  'TURMA DA MONICA JOVEM N.46 BOX',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/UsNgmdzyaTccZkniYptnjWw2O6Q=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/a3921a46-a7c0-11f0-8792-0ab376ee0ef4.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-03120',
  'TURMA DA MONICA JOVEM N.47',
  'TURMA DA MONICA JOVEM N.47',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/n7nm7x1eTtumUFN807cBOHZfJi0=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/2231fb28-48b7-11f0-955a-6e14298b474f.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-03121',
  'TURMA DA MONICA JOVEM N.48',
  'TURMA DA MONICA JOVEM N.48',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/r2yuN-b4w2pzk9gPP7MDWyOBeIM=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/446ed444-7fd1-11f0-b894-2e1dcafaddd0.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-03122',
  'TURMA DA MÔNICA LAÇOS - INTEGRAL',
  'TURMA DA MÔNICA LAÇOS - INTEGRAL',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/ilbCqdErT8aRcrf2VyK2Ns6PBao=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/89867a56-d81a-11ee-9df9-5a86bcbeb6e3.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-03123',
  'TURMA TITÃ: ANO UM',
  'TURMA TITÃ: ANO UM',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/FO30gbfjhlZzsJ_edcbrRh-f9ds=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/037b3548-1ca6-11ef-b80c-228c440649c1.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-03124',
  'ULTIMATE HOMEM-ARANHA (2024) VOL.01 [REB2]',
  'ULTIMATE HOMEM-ARANHA (2024) VOL.01 [REB2]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/DAWtZSF8H5qUkS6JR59ocil0rW0=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/5319bdc6-8b5f-11f0-ab6e-7e1ab2cbb1e5.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-03125',
  'ULTIMATE HOMEM-ARANHA (2024) VOL.02',
  'ULTIMATE HOMEM-ARANHA (2024) VOL.02',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/MrcRKBF6w8n080lNzhZem6kkQEg=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/2498b478-6f3c-11f0-b703-524c1decb601.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-03126',
  'ULTIMATE X-MEN (2025) VOL.01',
  'ULTIMATE X-MEN (2025) VOL.01',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/uUnry2bEov_gWyqNGV7E-Tp8ffg=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/ef4df17c-0143-11f0-9a82-ca3c9ea74dec.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-03127',
  'ULTRAMAN VOL.03: O MISTERIO DE ULTRASERVEN',
  'ULTRAMAN VOL.03: O MISTERIO DE ULTRASERVEN',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/b-3sNyfVs80TaH0SQ8VhIsghL6Q=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/d338bdda-119a-11ef-bfb2-36a257064742.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-03128',
  'UM AMOR IMPOSSIVEL! OU NÃO... - 01',
  'UM AMOR IMPOSSIVEL! OU NÃO... - 01',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/EQvSEolERubdpSyyXIGxgSvhzD0=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/dcde52de-d818-11ee-89ed-e2697ce33d53.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-03129',
  'UM AMOR IMPOSSIVEL! OU NAO... - 02',
  'UM AMOR IMPOSSIVEL! OU NAO... - 02',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/XWSwhhKs6UJaSS-S47mTc8JBDqI=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/ddf5ef92-d818-11ee-9467-e2e54ed5f9f7.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-03130',
  'UM AMOR IMPOSSIVEL! OU NÃO... - 03',
  'UM AMOR IMPOSSIVEL! OU NÃO... - 03',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/t-Hn5AZn-DsWsJxCsrJMP93dyCM=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/2e6c21b4-ebef-11ee-963f-1e73add0c60b.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-03131',
  'UM AMOR IMPOSSIVEL! OU NÃO... - 04',
  'UM AMOR IMPOSSIVEL! OU NÃO... - 04',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/o43JaqAi-t14_xGToLSHmGFpDB4=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/82d3ce5a-4e7d-11ef-876a-e24de145a09c.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-03132',
  'UM AMOR IMPOSSIVEL! OU NÃO... - 05',
  'UM AMOR IMPOSSIVEL! OU NÃO... - 05',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/C4xGnmZAljFSmkWo7pnN8TlgIIA=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/dbb0ba2a-7faa-11ef-8130-12caec0ea15c.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-03133',
  'UM AMOR IMPOSSIVEL! OU NAO... - 06',
  'UM AMOR IMPOSSIVEL! OU NAO... - 06',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/8eA095PwC3AOqSasyKG2RHWZp9w=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/e6050b64-eb4a-11ef-8230-fa812316df6c.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-03134',
  'UM AMOR IMPOSSIVEL! OU NAO... - 07',
  'UM AMOR IMPOSSIVEL! OU NAO... - 07',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/Zs5nr0VBOLRE0anNuonKfvFZ428=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/dca1e8c4-3f2f-11f0-87b4-c2502d24ff3f.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-03135',
  'UM CIRCULO VICIOSO N.1',
  'UM CIRCULO VICIOSO N.1',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/qC6rgbfr5P20k3J8RNBoM-cW-Aw=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/37ee6350-d817-11ee-b54b-e2697ce33d53.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-03136',
  'UM CIRCULO VICIOSO N.2',
  'UM CIRCULO VICIOSO N.2',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/tfiaCmKQG5_hi3xjKO_jr209LdU=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/039ce242-1ca6-11ef-bc32-def7b1441874.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-03137',
  'UM CIRCULO VICIOSO VOL.03 (DE 03)',
  'UM CIRCULO VICIOSO VOL.03 (DE 03)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/k657_9K3UMY-93IinLXzsSitWG0=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/941b90dc-eb29-11ef-9927-fa812316df6c.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-03138',
  'UM IDOL PARA MIM',
  'UM IDOL PARA MIM',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/q6Y_uE9QHdKGSgoqa-WjxiTo9xQ=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/60972822-5ea9-11f0-be82-febfa26cb361.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-03139',
  'UMA GARÇA ENTRE LOBOS',
  'UMA GARÇA ENTRE LOBOS',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/k52UmtzVpFgY0ejNDsJWOFKzGIs=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/23824f68-6f3c-11f0-b1c7-ee865bcff8a6.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-03140',
  'UNDEAD UNLUCK - 02',
  'UNDEAD UNLUCK - 02',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/uBE3prGt3O1ksEhdBQlA5PFhBJQ=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/d5f5f278-d819-11ee-83df-e2e54ed5f9f7.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-03141',
  'UNDEAD UNLUCK - 03',
  'UNDEAD UNLUCK - 03',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/ZaA_tcEYCa7KBRoVmvCNOXEO1Xg=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/d62b2c40-d819-11ee-a8da-56e6c271e0a3.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-03142',
  'UNDEAD UNLUCK - 04',
  'UNDEAD UNLUCK - 04',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/KaQ4nOpXVUtqbnUw2ZjDVAwwLrE=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/d6aa6460-d819-11ee-a453-e2697ce33d53.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-03143',
  'UNDEAD UNLUCK - 05',
  'UNDEAD UNLUCK - 05',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/oSMW1raYltAHDlHwSiNxLqSA7FQ=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/d6c45fdc-d819-11ee-a82e-32937b3ded24.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-03144',
  'UNDEAD UNLUCK - 06',
  'UNDEAD UNLUCK - 06',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/wtiwMJ5z6JpL6oL9Fbs6BnEUJ-g=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/d7556644-d819-11ee-a453-e2697ce33d53.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-03145',
  'UNDEAD UNLUCK - 10',
  'UNDEAD UNLUCK - 10',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/TYECAZ-N22WjzgKHa3IHv1NiyEg=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/d8a63668-d819-11ee-83df-e2e54ed5f9f7.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-03146',
  'UNDEAD UNLUCK - 13',
  'UNDEAD UNLUCK - 13',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/-17bxxn2Xb1_5AXUkJE63r8N1fQ=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/d9e1e39c-d819-11ee-a82e-32937b3ded24.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-03147',
  'UNDEAD UNLUCK - 19',
  'UNDEAD UNLUCK - 19',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/M01wJRQNykhxKcMhnCYF9UVO1QE=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/f5951182-eb4a-11ef-8230-fa812316df6c.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-03148',
  'UNDEAD UNLUCK - 20',
  'UNDEAD UNLUCK - 20',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/HcPO9tO1ATxgMeVWySTaHk6JrJs=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/a55efe4c-eb29-11ef-b1d3-def782e2bf12.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-03149',
  'UNDEAD UNLUCK - 7',
  'UNDEAD UNLUCK - 7',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/aHBdHdWQpGXrLkx9Hf7kMr7phCY=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/d78a88e2-d819-11ee-a8da-56e6c271e0a3.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-03150',
  'UNDEAD UNLUCK - 8',
  'UNDEAD UNLUCK - 8',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/BgmoSKet0dK5R0yA2OXs20fSisM=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/d800c91c-d819-11ee-a453-e2697ce33d53.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();