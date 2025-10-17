-- SQL para importar produtos Brancaleone
-- Gerado em: 2025-10-17T17:52:46.765Z
-- Total de produtos: 3363
-- Fonte: brancaleone-products-1760723254011.json

-- 1. Criar distribuidor (se não existir)

-- Distribuidor já criado no batch-001

-- Lote 52 de 68
-- Produtos: 5101 até 5200



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02551',
  'RURI DRAGON N.01',
  'RURI DRAGON N.01',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/gpbVsjIZ_w2drzizdmilujt0kEY=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/06381178-98c6-11f0-9174-8281520868be.jpg"]'::jsonb,
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
  'PROD-02552',
  'S.H.I.E.L.D. (MARVEL OMNIBUS)',
  'S.H.I.E.L.D. (MARVEL OMNIBUS)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/XlI-6ZAfBNjNO5v_QXEJFx7TURI=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/aac517f0-dd64-11ee-a3b1-8e302e624fc0.jpg"]'::jsonb,
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
  'PROD-02553',
  'SAIBA MAIS (2022) - EM ESPANHOL N.9',
  'SAIBA MAIS (2022) - EM ESPANHOL N.9',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/HDQ-eIjeM8kpAM0J1h6vq-eoLjQ=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/a8f4b2fe-eb29-11ef-a3b1-5681c2ac1d4b.jpg"]'::jsonb,
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
  'PROD-02554',
  'SAIBA MAIS (2022) - EM INGLÊS N.9',
  'SAIBA MAIS (2022) - EM INGLÊS N.9',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/DYqJ616CNGXSK5sH1pnnhuqZmKE=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/a95934cc-eb29-11ef-b7b8-460343881edd.jpg"]'::jsonb,
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
  'PROD-02555',
  'SAIBA MAIS (2022) - EM PORTUGUÊS N.9',
  'SAIBA MAIS (2022) - EM PORTUGUÊS N.9',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/zW8NmO9FcNMLZ1rs0oMiPWpOn0k=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/ab5cae98-eb29-11ef-8d7f-eea3b61904a2.jpg"]'::jsonb,
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
  'PROD-02556',
  'SAIBA MAIS (2022) EM PORTUGUÊS N.1',
  'SAIBA MAIS (2022) EM PORTUGUÊS N.1',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/pPPMod7hnTYzbgrbalibz0DpZmk=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/47510754-16c8-11ef-b0c5-166b047735e7.JPG"]'::jsonb,
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
  'PROD-02557',
  'SAIBA MAIS (2022) N.10',
  'SAIBA MAIS (2022) N.10',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/a0ExMxEvov2ldXHtQlxPgLybJY0=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/9ab99f00-08c6-11f0-ac22-660c4bd9985d.jpg"]'::jsonb,
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
  'PROD-02558',
  'SAIBA MAIS (2022) N.11',
  'SAIBA MAIS (2022) N.11',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/Y0Gd4TMDiIaOs4sKCYdvxPy_waU=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/6331d2ee-5ea9-11f0-b926-022f8a1a6f0a.jpg"]'::jsonb,
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
  'PROD-02559',
  'SAIBA MAIS (2022) N.12',
  'SAIBA MAIS (2022) N.12',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/GkSZF70FqE8TjJ-l2V8k2FMckzM=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/29176274-a4ac-11f0-aa03-16ade38a6d4b.jpg"]'::jsonb,
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
  'PROD-02560',
  'SAIBA MAIS (2022) N.4',
  'SAIBA MAIS (2022) N.4',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/53UNzsC8Z7_Twf6o6Q1bbuE8avw=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/14911b7a-d81a-11ee-a8da-56e6c271e0a3.jpg"]'::jsonb,
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
  'PROD-02561',
  'SAIBA MAIS (2022) N.5',
  'SAIBA MAIS (2022) N.5',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/iWAVAo8NIHGiuQid85zeiTBHYuo=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/14bf0526-d81a-11ee-83df-e2e54ed5f9f7.jpg"]'::jsonb,
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
  'PROD-02562',
  'SAIBA MAIS (2022) N.6',
  'SAIBA MAIS (2022) N.6',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/nS8fogniH_wl9xxAHQZ5qyQ_p7s=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/9ea2ba96-e583-11ee-b66f-62eaabe3d6ba.jpg"]'::jsonb,
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
  'PROD-02563',
  'SAIBA MAIS (2022) N.7',
  'SAIBA MAIS (2022) N.7',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/yuxldZIG3OVw_VqnewFhPwYUo6A=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/f87b8b4c-2930-11ef-93b8-4a187dfd8c76.jpg"]'::jsonb,
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
  'PROD-02564',
  'SAIBA MAIS (2022) N.8',
  'SAIBA MAIS (2022) N.8',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/cQszl-dYYqgtYKNeC7LvdKgBR-Y=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/88e614e4-7fa9-11ef-b0bc-6e97175de7f7.jpg"]'::jsonb,
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
  'PROD-02565',
  'SAIBA MAIS (2022) N.9 (HISTORIA DO CINEMA)',
  'SAIBA MAIS (2022) N.9 (HISTORIA DO CINEMA)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/XFCRfN8q2qXwFUNrDqxtj07QQio=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/a8e7788c-eb29-11ef-8d7f-eea3b61904a2.jpg"]'::jsonb,
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
  'PROD-02566',
  'SAIBA MAIS - EM ESPANHOL N.8',
  'SAIBA MAIS - EM ESPANHOL N.8',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/GVtqa_O9Z2Xa5gO-D0ikRwFfaJM=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/892cc8da-7fa9-11ef-b1d0-12caec0ea15c.jpg"]'::jsonb,
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
  'PROD-02567',
  'SAIBA MAIS - EM INGLÊS N.8',
  'SAIBA MAIS - EM INGLÊS N.8',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/rThxAPWEeE43qPXaZD6CieM1BMQ=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/8961e2a4-7fa9-11ef-b0bc-6e97175de7f7.jpg"]'::jsonb,
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
  'PROD-02568',
  'SAIBA MAIS - EM PORTUGUÊS N.8',
  'SAIBA MAIS - EM PORTUGUÊS N.8',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/en8R9fI4QCx0Qg9WZfm5pKWrsnA=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/89f19282-7fa9-11ef-b0bc-6e97175de7f7.jpg"]'::jsonb,
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
  'PROD-02569',
  'SAIBA MAIS EM ESPANHOL (DANÇA) N.12',
  'SAIBA MAIS EM ESPANHOL (DANÇA) N.12',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/8bg1iT9LcjV7PjhvyuAjkIsIRq0=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/a933061c-eb29-11ef-b1d3-def782e2bf12.jpg"]'::jsonb,
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
  'PROD-02570',
  'SAIBA MAIS EM ESPANHOL N.1',
  'SAIBA MAIS EM ESPANHOL N.1',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/iemHgpw9xi97VEfExHLMnuH5UBk=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/9f56bbe0-e583-11ee-9d7c-f2cdc5a9e7d5.jpg"]'::jsonb,
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
  'PROD-02571',
  'SAIBA MAIS EM ESPANHOL N.10 - HIGIENE E SAUDE',
  'SAIBA MAIS EM ESPANHOL N.10 - HIGIENE E SAUDE',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/LMB5K-YKkgnkyZQnolIZObIAce0=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/05b43c3c-eb4b-11ef-8230-fa812316df6c.jpg"]'::jsonb,
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
  'PROD-02572',
  'SAIBA MAIS EM ESPANHOL N.11 (FAUNA MARINHA)',
  'SAIBA MAIS EM ESPANHOL N.11 (FAUNA MARINHA)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/ixDJgHDJq4XL1Ly6qkZU0Wu8fuY=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/a973ce2c-eb29-11ef-8b75-5ac0f052206d.jpg"]'::jsonb,
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
  'PROD-02573',
  'SAIBA MAIS EM ESPANHOL N.2',
  'SAIBA MAIS EM ESPANHOL N.2',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/53_hiqXx5L7rA-9piGcKHEqu_i0=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/dc866fae-16c7-11ef-b56f-5a6efeef8788.JPG"]'::jsonb,
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
  'PROD-02574',
  'SAIBA MAIS EM ESPANHOL N.3',
  'SAIBA MAIS EM ESPANHOL N.3',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/IE-YsdPg3QYPqUlqX-EEGhDqCWQ=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/268964c6-2ce4-11ef-976e-0a2d1595208c.jpg"]'::jsonb,
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
  'PROD-02575',
  'SAIBA MAIS EM ESPANHOL N.4',
  'SAIBA MAIS EM ESPANHOL N.4',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/gS2GFGw8oMdhaSHQbGPBbUUSrp0=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/8d3fda0a-4e7d-11ef-b438-b279561b7695.jpg"]'::jsonb,
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
  'PROD-02576',
  'SAIBA MAIS EM ESPANHOL N.5',
  'SAIBA MAIS EM ESPANHOL N.5',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/SxQdLJXsBwU9PFwN1nH9QbqmZPA=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/cf65f230-63e4-11ef-b7d3-2efe32275ec0.png"]'::jsonb,
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
  'PROD-02577',
  'SAIBA MAIS EM ESPANHOL N.6',
  'SAIBA MAIS EM ESPANHOL N.6',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/dCd6CGfBG0cWLxbvz8utzU0tswM=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/890be67e-7fa9-11ef-b0bc-6e97175de7f7.jpg"]'::jsonb,
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
  'PROD-02578',
  'SAIBA MAIS EM ESPANHOL N.7 - VIRUS E BACTERIAS',
  'SAIBA MAIS EM ESPANHOL N.7 - VIRUS E BACTERIAS',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/n7xm2UmVPzgX8oUozKnzNqUkjIw=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/89277c36-7fa9-11ef-b0bc-6e97175de7f7.jpg"]'::jsonb,
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
  'PROD-02579',
  'SAIBA MAIS EM INGLÊS  (DANÇA) N.12',
  'SAIBA MAIS EM INGLÊS  (DANÇA) N.12',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/Bb3NUtk7ASha6ozKwzL5K4YAFCY=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/a998f3f0-eb29-11ef-913d-52f5d450f8a6.jpg"]'::jsonb,
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
  'PROD-02580',
  'SAIBA MAIS EM INGLES N.10 - HIGIENE E SAUDE',
  'SAIBA MAIS EM INGLES N.10 - HIGIENE E SAUDE',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/haHrOW8Svl0vu_XBxTntPNssGVI=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/08a68580-eb4b-11ef-8230-fa812316df6c.jpg"]'::jsonb,
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
  'PROD-02581',
  'SAIBA MAIS EM INGLES N.11 (FAUNA MARINHA)',
  'SAIBA MAIS EM INGLES N.11 (FAUNA MARINHA)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/E9AuuCtAZ0DYRqlayi1QwgeDLzw=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/a982a244-eb29-11ef-9927-fa812316df6c.jpg"]'::jsonb,
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
  'PROD-02582',
  'SAIBA MAIS EM INGLES N.2',
  'SAIBA MAIS EM INGLES N.2',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/slIXewdttrMnczKoxy_zgAyWq6c=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/dc0a1292-16c7-11ef-abd8-3289728d9b7a.JPG"]'::jsonb,
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
  'PROD-02583',
  'SAIBA MAIS EM INGLES N.3',
  'SAIBA MAIS EM INGLES N.3',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/UbrJrEkZrkWfA97sPoqFADNcAHA=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/2721ce28-2ce4-11ef-97cc-6aebf26333fd.jpg"]'::jsonb,
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
  'PROD-02584',
  'SAIBA MAIS EM INGLES N.5',
  'SAIBA MAIS EM INGLES N.5',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/4--4nAX2t9vTyXEcEXf8qrBJVcw=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/cf8662ea-63e4-11ef-80fa-6e17b43757fa.png"]'::jsonb,
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
  'PROD-02585',
  'SAIBA MAIS EM INGLES N.6',
  'SAIBA MAIS EM INGLES N.6',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/OLmSPKCDXnx3M9y1ijDXFjdymw0=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/8945bf0c-7fa9-11ef-b0bc-6e97175de7f7.jpg"]'::jsonb,
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
  'PROD-02586',
  'SAIBA MAIS EM INGLES N.7 - VIRUS E BACTERIAS',
  'SAIBA MAIS EM INGLES N.7 - VIRUS E BACTERIAS',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/h-caeFtCed_s5Teu6VPHuuOWGU0=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/894c93a4-7fa9-11ef-b1d0-12caec0ea15c.jpg"]'::jsonb,
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
  'PROD-02587',
  'SAIBA MAIS EM PORTUGUÊS (DANÇA) N.12',
  'SAIBA MAIS EM PORTUGUÊS (DANÇA) N.12',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/iapd15czdmPDh1kiNIS5HJO6tUs=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/ab7d00b2-eb29-11ef-b7b8-460343881edd.jpg"]'::jsonb,
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
  'PROD-02588',
  'SAIBA MAIS EM PORTUGUÊS - VIRUS E BACTERIAS N.7',
  'SAIBA MAIS EM PORTUGUÊS - VIRUS E BACTERIAS N.7',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/vq5c1NdEpgR8Jlba2gwzqb-v6qE=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/89ed6338-7fa9-11ef-b1d0-12caec0ea15c.jpg"]'::jsonb,
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
  'PROD-02589',
  'SAIBA MAIS EM PORTUGUÊS N.10 - HIGIENE E SAUDE',
  'SAIBA MAIS EM PORTUGUÊS N.10 - HIGIENE E SAUDE',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/2I_BFbiLNNl5dW4OwLl7nqhTGWk=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/10179264-eb4b-11ef-8230-fa812316df6c.jpg"]'::jsonb,
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
  'PROD-02590',
  'SAIBA MAIS EM PORTUGUÊS N.11 (FAUNA MARINHA)',
  'SAIBA MAIS EM PORTUGUÊS N.11 (FAUNA MARINHA)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/Kiz2b0D3c5w7tGqlxkVlhdfK3LI=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/ab73e7c0-eb29-11ef-a3b1-5681c2ac1d4b.jpg"]'::jsonb,
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
  'PROD-02591',
  'SAIBA MAIS EM PORTUGUÊS N.2',
  'SAIBA MAIS EM PORTUGUÊS N.2',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/TXdKvBnV_tnQLlkxZSHWSI8-tfs=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/dc09c3fa-16c7-11ef-9970-32e1592276cd.JPG"]'::jsonb,
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
  'PROD-02592',
  'SAIBA MAIS PORTUGUÊS N.3',
  'SAIBA MAIS PORTUGUÊS N.3',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/IE-YsdPg3QYPqUlqX-EEGhDqCWQ=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/268964c6-2ce4-11ef-976e-0a2d1595208c.jpg"]'::jsonb,
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
  'PROD-02593',
  'SAIBA MAIS PORTUGUÊS N.4',
  'SAIBA MAIS PORTUGUÊS N.4',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/qlugNojxYJw5ew2zhlVS_np5swI=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/8e0e24f0-4e7d-11ef-8a79-626adc132bdd.jpg"]'::jsonb,
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
  'PROD-02594',
  'SAIBA MAIS PORTUGUÊS N.5',
  'SAIBA MAIS PORTUGUÊS N.5',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/a45qTifNfvKopbyNNiGVpxx7XdM=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/d03ef170-63e4-11ef-b7d3-2efe32275ec0.png"]'::jsonb,
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
  'PROD-02595',
  'SAIBA MAIS PORTUGUÊS N.6',
  'SAIBA MAIS PORTUGUÊS N.6',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/cRwl3DFiIpK-VqN_sSv7_9iu930=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/89d56fc6-7fa9-11ef-b1d0-12caec0ea15c.jpg"]'::jsonb,
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
  'PROD-02596',
  'SAKAMOTO DAYS - 01 [REB3]',
  'SAKAMOTO DAYS - 01 [REB3]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/PRzEoZZp5R6n6hNrKyTiD3tq0Ds=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/ee930830-0143-11f0-9a82-ca3c9ea74dec.jpg"]'::jsonb,
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
  'PROD-02597',
  'SAKAMOTO DAYS - 02 [REB]',
  'SAKAMOTO DAYS - 02 [REB]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/-cG-wzGxi6NDLMH9dpWAGg_07jw=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/9bb20ce4-08c6-11f0-ac22-660c4bd9985d.jpg"]'::jsonb,
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
  'PROD-02598',
  'SAKAMOTO DAYS - 03 [REB]',
  'SAKAMOTO DAYS - 03 [REB]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/aYVIE1_vXPl6MccPPJxPmr0_wBw=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/9c335362-08c6-11f0-9943-7e024f525d71.jpg"]'::jsonb,
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
  'PROD-02599',
  'SAKAMOTO DAYS - 04 [REB]',
  'SAKAMOTO DAYS - 04 [REB]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/gnG4LVtlonrVCOwBEsacxZs4qSo=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/9c63b872-08c6-11f0-bef2-5a37e2f27c8c.jpg"]'::jsonb,
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
  'PROD-02600',
  'SAKAMOTO DAYS - 05 [REB]',
  'SAKAMOTO DAYS - 05 [REB]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/OqlEnoj7opEqKPFr6m9TUPcNPdQ=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/ee8c9bda-0143-11f0-9602-e6e8567c501d.jpg"]'::jsonb,
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