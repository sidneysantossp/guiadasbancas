-- SQL para importar produtos Brancaleone
-- Gerado em: 2025-10-17T18:20:53.612Z
-- Total de produtos: 3363
-- Fonte: brancaleone-products-1760723254011.json

-- 1. Criar distribuidor (se não existir)

-- Distribuidor já criado no batch-001

-- Lote 18 de 68
-- Produtos: 1701 até 1800



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00851',
  'COLECAO CLASSICA MARVEL VOL.16 - HULK VOL.02',
  'COLECAO CLASSICA MARVEL VOL.16 - HULK VOL.02',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/TnRbb9F8kkg7jTtbR25JKb7bi30=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/e3163142-d81a-11ee-8f71-e2e54ed5f9f7.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00852',
  'COLECAO CLASSICA MARVEL VOL.17 - DEMOLIDOR VOL.02',
  'COLECAO CLASSICA MARVEL VOL.17 - DEMOLIDOR VOL.02',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/rTyljjfWWQOtsrKjYbuF2x5iKAs=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/e35eee64-d81a-11ee-8b82-06e22cdb7792.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00853',
  'COLECAO CLASSICA MARVEL VOL.18 - QUARTETO FANTASTICO VOL.03',
  'COLECAO CLASSICA MARVEL VOL.18 - QUARTETO FANTASTICO VOL.03',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/naSpJvmQ4cenPYE55yUNru6_qQY=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/e3b1def8-d81a-11ee-9df9-5a86bcbeb6e3.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00854',
  'COLECAO CLASSICA MARVEL VOL.20 - THOR VOL.03',
  'COLECAO CLASSICA MARVEL VOL.20 - THOR VOL.03',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/zvNffWpzK8fPet59Yg3Ns3Y92DM=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/e455e7f0-d81a-11ee-8b82-06e22cdb7792.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00855',
  'COLECAO CLASSICA MARVEL VOL.21 - HOMEM DE FERRO VOL.03',
  'COLECAO CLASSICA MARVEL VOL.21 - HOMEM DE FERRO VOL.03',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/is5t4AkuTrwy0v8KZOv_YEFBtKQ=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/e4a17e72-d81a-11ee-98f1-c6f956d4b586.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00856',
  'COLECAO CLASSICA MARVEL VOL.22 - X-MEN VOL.02',
  'COLECAO CLASSICA MARVEL VOL.22 - X-MEN VOL.02',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/KE3YJ5ZjMJnJcpGnVR6IqAsIRDs=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/e510967c-d81a-11ee-8b82-06e22cdb7792.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00857',
  'COLECAO CLASSICA MARVEL VOL.23 - QUARTETO FANTASTICO 4',
  'COLECAO CLASSICA MARVEL VOL.23 - QUARTETO FANTASTICO 4',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/e9y4mWRInomKwWwk8Ooq-Tbwq0U=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/e57f5206-d81a-11ee-8b82-06e22cdb7792.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00858',
  'COLECAO CLASSICA MARVEL VOL.24 - HOMEM-ARANHA 5',
  'COLECAO CLASSICA MARVEL VOL.24 - HOMEM-ARANHA 5',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/4pHfPU_zkOWhlx65PN170JBdqzQ=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/e5b6469e-d81a-11ee-98f1-c6f956d4b586.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00859',
  'COLECAO CLASSICA MARVEL VOL.25 - THOR VOL.04',
  'COLECAO CLASSICA MARVEL VOL.25 - THOR VOL.04',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/FsddXttEoR4cM8M5BPvA7j4WzPY=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/e61f3e74-d81a-11ee-8b82-06e22cdb7792.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00860',
  'COLECAO CLASSICA MARVEL VOL.26 - HOMEM DE FERRO VOL.04',
  'COLECAO CLASSICA MARVEL VOL.26 - HOMEM DE FERRO VOL.04',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/ysDAR9I32fQCa23NuVAROttEJR4=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/e6674fca-d81a-11ee-8f71-e2e54ed5f9f7.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00861',
  'COLECAO CLASSICA MARVEL VOL.27 - VINGADORES VOL.03',
  'COLECAO CLASSICA MARVEL VOL.27 - VINGADORES VOL.03',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/vwNET0iWT4WZIah0mIpeOQwdX1A=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/e65336ca-d81a-11ee-8b82-06e22cdb7792.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00862',
  'COLECAO CLASSICA MARVEL VOL.28 - QUARTETO FANTASTICO VOL.05',
  'COLECAO CLASSICA MARVEL VOL.28 - QUARTETO FANTASTICO VOL.05',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/Pyn259k3U-7efftXplh16dC8tis=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/e714849c-d81a-11ee-9df9-5a86bcbeb6e3.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00863',
  'COLECAO CLASSICA MARVEL VOL.29 - DEMOLIDOR VOL.03',
  'COLECAO CLASSICA MARVEL VOL.29 - DEMOLIDOR VOL.03',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/bQVlv5X1_5y4UuvRNX28oRZcP9k=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/e7564b3e-d81a-11ee-8b82-06e22cdb7792.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00864',
  'COLECAO CLASSICA MARVEL VOL.30 - X-MEN VOL.03',
  'COLECAO CLASSICA MARVEL VOL.30 - X-MEN VOL.03',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/lfn-w3X2RXsrL8T83HKkcJCkCvk=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/e7bd5ea0-d81a-11ee-8f71-e2e54ed5f9f7.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00865',
  'COLECAO CLASSICA MARVEL VOL.31 - QUARTETO FANTASTICO VOL.06',
  'COLECAO CLASSICA MARVEL VOL.31 - QUARTETO FANTASTICO VOL.06',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/jTj5Awr3hLaiQ-0Y6nAT6152AyE=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/2eafd036-a4ac-11f0-a72e-eecb83d78201.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00866',
  'COLECAO CLASSICA MARVEL VOL.32 - THOR VOL.05',
  'COLECAO CLASSICA MARVEL VOL.32 - THOR VOL.05',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/oauiTuEweMsgn6YLzZe3E27yrnw=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/2eb846c6-a4ac-11f0-8687-a638114deac1.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00867',
  'COLECAO CLASSICA MARVEL VOL.34 - HULK VOL.03',
  'COLECAO CLASSICA MARVEL VOL.34 - HULK VOL.03',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/M3AxNXVpwWgG6S0HBXbOnNZwm_U=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/2ed51792-a4ac-11f0-8b51-cad07a812184.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00868',
  'COLECAO CLASSICA MARVEL VOL.37 - THOR VOL.06',
  'COLECAO CLASSICA MARVEL VOL.37 - THOR VOL.06',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/1fbBycGSz3nBQ_gCLkKIN5ReW5U=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/2ee8adc0-a4ac-11f0-ac43-c20d3852b6b7.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00869',
  'COLECAO CLASSICA MARVEL VOL.39 - QUARTETO FANTASTICO VOL.08',
  'COLECAO CLASSICA MARVEL VOL.39 - QUARTETO FANTASTICO VOL.08',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/MsXg9YcXHCsfj6Szq2zZGFkaSLM=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/2ef856c6-a4ac-11f0-9bb5-ee8f90996b43.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00870',
  'COLECAO CLASSICA MARVEL VOL.41 - HOMEM DE FERRO VOL.05',
  'COLECAO CLASSICA MARVEL VOL.41 - HOMEM DE FERRO VOL.05',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/sjr9wTEj8Q0ezXL_zp-ZhE-szuI=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/eb4802b4-d81a-11ee-98f1-c6f956d4b586.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00871',
  'COLECAO CLASSICA MARVEL VOL.42 - THOR VOL.07',
  'COLECAO CLASSICA MARVEL VOL.42 - THOR VOL.07',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/90DekKn2fYG0OTrE28n2HgaedRM=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/ebb0e798-d81a-11ee-8f71-e2e54ed5f9f7.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00872',
  'COLECAO CLASSICA MARVEL VOL.43 - QUARTETO FANTASTICO VOL.09',
  'COLECAO CLASSICA MARVEL VOL.43 - QUARTETO FANTASTICO VOL.09',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/_BRoklnyIVRt6Or40lqZRW7QLes=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/2f299330-a4ac-11f0-8687-a638114deac1.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00873',
  'COLECAO CLASSICA MARVEL VOL.44 - VINGADORES VOL.05',
  'COLECAO CLASSICA MARVEL VOL.44 - VINGADORES VOL.05',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/Up5oW48GiIO6LwOqfLCyg2yt3wU=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/2f25eea6-a4ac-11f0-a72e-eecb83d78201.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00874',
  'COLECAO CLASSICA MARVEL VOL.53 - VINGADORES VOL.06',
  'COLECAO CLASSICA MARVEL VOL.53 - VINGADORES VOL.06',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/MKNO6slYRRnD-mtbqJ4YwPRme2w=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/2f5b00dc-a4ac-11f0-9f2b-b616a40784ef.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00875',
  'COLECAO CLASSICA MARVEL VOL.56 - THOR VOL.09',
  'COLECAO CLASSICA MARVEL VOL.56 - THOR VOL.09',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/XmIzeonvg5qbK5UEnnaq7JCmwpg=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/2020f01e-f2f9-11ef-a0d3-6e7871fdaf1f.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00876',
  'COLECAO CLASSICA MARVEL VOL.57 - DEMOLIDOR VOL.05',
  'COLECAO CLASSICA MARVEL VOL.57 - DEMOLIDOR VOL.05',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/iRlmzxNQZ5-QRaIRhU90UQn93DM=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/204a49dc-f2f9-11ef-87c9-c69faf7ce99e.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00877',
  'COLECAO CLASSICA MARVEL VOL.60 - X-MEN VOL.04',
  'COLECAO CLASSICA MARVEL VOL.60 - X-MEN VOL.04',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/G2OWvAWiLi_UgNk1gyxkaczprcU=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/2f902e10-a4ac-11f0-9bb5-ee8f90996b43.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00878',
  'COLECAO CLASSICA MARVEL VOL.61 - THOR VOL.10',
  'COLECAO CLASSICA MARVEL VOL.61 - THOR VOL.10',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/t_a46myW0hQK7iUUVAoC89mHTA8=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/f33b313a-d81a-11ee-8b82-06e22cdb7792.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00879',
  'COLECAO CLASSICA MARVEL VOL.62 - VINGADORES VOL.07',
  'COLECAO CLASSICA MARVEL VOL.62 - VINGADORES VOL.07',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/pf072wmvbEHUZuX8o4r5jiX6D0I=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/2fb675de-a4ac-11f0-9bb5-ee8f90996b43.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00880',
  'COLECAO CLASSICA MARVEL: NOVA FASE VOL.01',
  'COLECAO CLASSICA MARVEL: NOVA FASE VOL.01',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/v73ZQ0m0nmdUbXnPTiJ_kHRGe9Y=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/33c15522-7fd1-11f0-b894-2e1dcafaddd0.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00881',
  'COLECAO CLASSICA MARVEL: NOVA FASE VOL.02',
  'COLECAO CLASSICA MARVEL: NOVA FASE VOL.02',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/B1SwDI075HmW9QGzYJrCBmLNsME=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/54d52678-8b5f-11f0-b3d9-165df9e621a1.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00882',
  'COLECAO CLASSICA MARVEL: NOVA FASE VOL.03',
  'COLECAO CLASSICA MARVEL: NOVA FASE VOL.03',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/RHQSVkuk6VvavjWW1zZy0d9ptzY=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/54efeb84-8b5f-11f0-ab6e-7e1ab2cbb1e5.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00883',
  'COLECAO CLASSICA MARVEL: NOVA FASE VOL.04',
  'COLECAO CLASSICA MARVEL: NOVA FASE VOL.04',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/KuAnP7z7Q-CtkDGW0xv22y_tEW4=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/550df82c-8b5f-11f0-ab6e-7e1ab2cbb1e5.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00884',
  'COLECAO CLASSICA MARVEL: NOVA FASE VOL.05',
  'COLECAO CLASSICA MARVEL: NOVA FASE VOL.05',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/WzX70nT91u5saEGYED8nJXKyETA=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/e7153736-9031-11f0-9754-9a60b14b6cd5.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00885',
  'COLECAO CLASSICA MARVEL: NOVA FASE VOL.06',
  'COLECAO CLASSICA MARVEL: NOVA FASE VOL.06',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/-yQR78vI5XNHuw_QxBWZjCr6KFg=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/2116116a-a4ac-11f0-84d7-06a1e9b2bf33.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00886',
  'COLEÇÃO MSP 50',
  'COLEÇÃO MSP 50',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/RTmB8KdrLd59ohSBGw9CcQ61KMs=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/a748d340-eb29-11ef-8cc5-0ee70347c223.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00887',
  'COMO ACABEI NUM ENCONTRO SÓ DE GAROTOS - 01',
  'COMO ACABEI NUM ENCONTRO SÓ DE GAROTOS - 01',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/7ZbRZe-7JXiAdV8rlDiuLKi4ukQ=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/1af32f62-48b7-11f0-98d1-7a925bb2c122.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00888',
  'COMO ACABEI NUM ENCONTRO SÓ DE GAROTOS - 02',
  'COMO ACABEI NUM ENCONTRO SÓ DE GAROTOS - 02',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/53V7BKPcS4F8MfrLhQxhCLPhW5g=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/473cd9e8-8b5f-11f0-b876-cef4535c59b2.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00889',
  'COMO ACABEI NUM ENCONTRO SÓ DE GAROTOS - 03',
  'COMO ACABEI NUM ENCONTRO SÓ DE GAROTOS - 03',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/LGo_Au5ZERGd0fQ44uTD-Fc-n8c=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/8f737144-9d49-11f0-8d6a-ea1fee69cf88.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00890',
  'COMO CONHECI A MINHA ALMA GÊMEA - 01',
  'COMO CONHECI A MINHA ALMA GÊMEA - 01',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/f0jrgsnRb01PivGgd11gRHV1d8M=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/533b96d0-8b5f-11f0-ab6e-7e1ab2cbb1e5.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00891',
  'COMO CONHECI A MINHA ALMA GÊMEA - 02',
  'COMO CONHECI A MINHA ALMA GÊMEA - 02',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/vKRMKYGoGwWnichB2KFOkaYzDh0=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/a3cf4330-a7c0-11f0-8792-0ab376ee0ef4.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00892',
  'CONAN (2023) N.4',
  'CONAN (2023) N.4',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/W86RrTy6L2quDxUAKfVBIEwPSVs=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/7f68bbec-7fa9-11ef-b1d0-12caec0ea15c.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00893',
  'CONAN (2024) N.05',
  'CONAN (2024) N.05',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/-xxdRz0Fsq9tHseZ3II2cPdUCbY=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/c53913ce-eb47-11ef-a496-fa812316df6c.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00894',
  'CONAN (2024) N.06',
  'CONAN (2024) N.06',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/mxb7EG1aiqVc3cZYbFThi6IjcNE=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/bafd3000-f616-11ef-8bcd-4e33e7a5489c.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00895',
  'CONAN (2024) N.07',
  'CONAN (2024) N.07',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/_A4zUZFGN9_YjSs4G0UiQP4yR9g=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/7e09c160-08c5-11f0-929e-b63aa6c6321e.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00896',
  'CONAN (2024) N.08',
  'CONAN (2024) N.08',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/8HcCQufzqwwEIQBXdRYKMJa4UaE=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/d8235d50-3f2f-11f0-87b4-c2502d24ff3f.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00897',
  'CONAN (2024) N.09',
  'CONAN (2024) N.09',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/yzau-2gRrndoztZC1kZk3SmTGMM=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/c4e428b2-642a-11f0-bfa0-6253877c6ac4.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00898',
  'CONAN, O BARBARO ESPECIAL N.2',
  'CONAN, O BARBARO ESPECIAL N.2',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/R7rsV7D7viQjZfCEQ98BWGNEAAM=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/577a509a-0cc8-11ef-88d1-3619a1e0872c.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00899',
  'CONAN, O BARBARO: A ERA CLASSICA VOL.07 (OMNIBUS)',
  'CONAN, O BARBARO: A ERA CLASSICA VOL.07 (OMNIBUS)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/_PF4BI6_kfwuC6P5mjADjtbfbq8=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/54cbd708-8b5f-11f0-ab6e-7e1ab2cbb1e5.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00900',
  'CONAN, O BARBARO: A ERA CLASSICA VOL.08 (OMNIBUS)',
  'CONAN, O BARBARO: A ERA CLASSICA VOL.08 (OMNIBUS)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/fniCqUNT86AifdotYoEozvFtSDg=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/01cdac98-feba-11ef-9796-da66c594d682.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();