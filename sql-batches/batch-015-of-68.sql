-- SQL para importar produtos Brancaleone
-- Gerado em: 2025-10-17T18:20:53.612Z
-- Total de produtos: 3363
-- Fonte: brancaleone-products-1760723254011.json

-- 1. Criar distribuidor (se não existir)

-- Distribuidor já criado no batch-001

-- Lote 15 de 68
-- Produtos: 1401 até 1500



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00701',
  'CACANDO DRAGOES - 08 [REB]',
  'CACANDO DRAGOES - 08 [REB]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/GuXVjuKhO0U35GcDpuEd3TvukOw=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/ccf6877c-eb47-11ef-80c6-0ee70347c223.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00702',
  'CACANDO DRAGOES - 09 [REB]',
  'CACANDO DRAGOES - 09 [REB]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/CyDUNIUMFcE7R0wAhXLwnkT-M2U=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/b0376d74-ee29-11ef-b50b-52169ed8ea49.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00703',
  'CACANDO DRAGOES - 10 [REB]',
  'CACANDO DRAGOES - 10 [REB]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/k_q1SkhCzM989r2-kHTgFcUSFvQ=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/b016bc1e-ee29-11ef-9d77-2221e0623913.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00704',
  'CAÇANDO DRAGÕES - 13',
  'CAÇANDO DRAGÕES - 13',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/1qO9Cygy1fjGIY0lR_n0HkkY8-w=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/dae9c2ba-d818-11ee-9467-e2e54ed5f9f7.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00705',
  'CACANDO DRAGOES - 14',
  'CACANDO DRAGOES - 14',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/TM-EP-x5cAi3ytS2lfJW1tc-pGg=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/dbbeab60-d818-11ee-89ed-e2697ce33d53.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00706',
  'CACANDO DRAGOES - 16',
  'CACANDO DRAGOES - 16',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/NGoQreGy5tvZYjqbg2m7IYKtvng=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/84aad860-7fa9-11ef-b0bc-6e97175de7f7.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00707',
  'CACANDO DRAGOES - 17',
  'CACANDO DRAGOES - 17',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/cRf4lO729IvR1yntZvbU4ZSqiB4=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/1d4c025c-f2f9-11ef-a0d3-6e7871fdaf1f.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00708',
  'CACANDO DRAGOES - 18',
  'CACANDO DRAGOES - 18',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/2JgyXEuNa9nHMznoCGK3qWrGABY=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/90371e8c-3692-11f0-ab90-9a315decf800.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00709',
  'CACANDO DRAGOES - 19',
  'CACANDO DRAGOES - 19',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/DhAxyUp0Dnp--vBQo_-VY05U9co=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/9fdf713c-a7c0-11f0-96ab-2e54fc51120d.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00710',
  'CACANDO DRAGOES N.1',
  'CACANDO DRAGOES N.1',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/UuP_aiJ_HtMBTpMsiWsioDiy_ss=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/8462b706-7fa9-11ef-b0bc-6e97175de7f7.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00711',
  'CACANDO DRAGOES N.15',
  'CACANDO DRAGOES N.15',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/-5XwA1B7xEd0Zoh4sIhVFhs47ZM=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/dc2093d4-d818-11ee-9467-e2e54ed5f9f7.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00712',
  'CACANDO DRAGOES N.2',
  'CACANDO DRAGOES N.2',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/0vT6jayJF1i0YF1qUcVVD53zG5o=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/8468e130-7fa9-11ef-b1d0-12caec0ea15c.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00713',
  'CACANDO DRAGOES N.3',
  'CACANDO DRAGOES N.3',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/HHDEuMh2i_8twF3oiwN2wsuvAkU=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/84805efa-7fa9-11ef-b0bc-6e97175de7f7.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00714',
  'CACANDO DRAGOES N.4',
  'CACANDO DRAGOES N.4',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/0VwdZa5fhGCUL0yqlj33uG-Kzbk=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/848cea8a-7fa9-11ef-b1d0-12caec0ea15c.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00715',
  'CACANDO DRAGOES N.5',
  'CACANDO DRAGOES N.5',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/dEhS12t-wXF0AXtjl3iXXccU6fQ=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/84a6970a-7fa9-11ef-b1d0-12caec0ea15c.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00716',
  'CAGE',
  'CAGE',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/6MqSefpPhlHUuqIa-6cKQv8XkBQ=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/92ca6276-eb29-11ef-b1d3-def782e2bf12.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00717',
  'CANCOES DA NOITE - 06',
  'CANCOES DA NOITE - 06',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/-jr9MYIyPCbXNC66E5vHovlYXIQ=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/d62f9e78-d81a-11ee-9df9-5a86bcbeb6e3.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00718',
  'CANCOES DA NOITE - 07',
  'CANCOES DA NOITE - 07',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/iwoLTwsLRZ3YdMI-6x5myMh_VT8=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/d6c4219c-d81a-11ee-9df9-5a86bcbeb6e3.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00719',
  'CANCOES DA NOITE - 08',
  'CANCOES DA NOITE - 08',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/3VtoKE6jILr1hx9dfWHfuuem4n0=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/d75f51b2-d81a-11ee-98f1-c6f956d4b586.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00720',
  'CANCOES DA NOITE - 09',
  'CANCOES DA NOITE - 09',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/ow4MLIH7yVVlmDrH1X_Ns6ohj4c=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/d80f9590-d81a-11ee-8b82-06e22cdb7792.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00721',
  'CANCOES DA NOITE - 10',
  'CANCOES DA NOITE - 10',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/vGmqLyPYx7a1W-ER0kiIRJm3onU=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/c68588c6-d8a0-11ee-98e4-5a86bcbeb6e3.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00722',
  'CANCOES DA NOITE - 11',
  'CANCOES DA NOITE - 11',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/iILvPVr4dtsoPSGWS9_f3RuCNEY=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/d6ab73f4-3f2f-11f0-87b4-c2502d24ff3f.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00723',
  'CANCOES DA NOITE - 17',
  'CANCOES DA NOITE - 17',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/Toy_zWc4Bgwh73upNs3Rp53vjiw=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/d0d35e88-eb47-11ef-9d0f-8a85576a563e.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00724',
  'CANCOES DA NOITE - 18',
  'CANCOES DA NOITE - 18',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/EFyth2bvpDZH_CHi26I4Im-Ysb8=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/b19884f8-eb29-11ef-9927-fa812316df6c.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00725',
  'CANCOES DA NOITE - 19',
  'CANCOES DA NOITE - 19',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/JxaNd8cQaEUxaIWb_9_N9hMTmVA=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/b1fcecd6-eb29-11ef-a3b1-5681c2ac1d4b.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00726',
  'CANCOES DA NOITE - 20',
  'CANCOES DA NOITE - 20',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/jwiQFR-WLjt7giPL0ABxluzx4C8=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/d09bf0d6-f616-11ef-afc5-62a059094c64.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00727',
  'CANCOES DA NOITE N.12',
  'CANCOES DA NOITE N.12',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/bwypI53lUz3D8wssmxIplcr70g0=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/5d06e636-0cc8-11ef-88d1-3619a1e0872c.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00728',
  'CANCOES DA NOITE N.13',
  'CANCOES DA NOITE N.13',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/r5HeXwsABWM41zkQuHunpczPBsI=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/f8d735b4-2930-11ef-8a49-928f61c71625.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00729',
  'CANCOES DA NOITE N.14',
  'CANCOES DA NOITE N.14',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/b8E36BU97UoN0ZORExlO6g3zDVk=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/711fd650-3fd1-11ef-89d8-0a2724a6fb9b.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00730',
  'CANCOES DA NOITE N.15',
  'CANCOES DA NOITE N.15',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/nnzhM3_wC4Z7-cc8xpkX3NPtXuQ=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/db3de720-7faa-11ef-92e2-6e97175de7f7.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00731',
  'CANCOES DA NOITE N.16',
  'CANCOES DA NOITE N.16',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/EIRM-KyKKEBjy7L8lC6RRCw9fBk=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/8ba81a7e-7fa9-11ef-b0bc-6e97175de7f7.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00732',
  'CAPITÃ CARTER (2024) N.1',
  'CAPITÃ CARTER (2024) N.1',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/ycxe_Kwg918tIswI5-gbUVDqR4s=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/c38b2db8-63e4-11ef-8d0e-3ac5652279c5.png"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00733',
  'CAPITA MARVEL (2019) N.7',
  'CAPITA MARVEL (2019) N.7',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/4aJ69eW_0JfLPZSOt67rrGDzOr0=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/be4bf76c-d819-11ee-a8da-56e6c271e0a3.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00734',
  'CAPITA MARVEL (2019) N.8',
  'CAPITA MARVEL (2019) N.8',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/-OUbaN152OVvfQRc7MyJj59XWdo=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/be9e0fde-d819-11ee-83df-e2e54ed5f9f7.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00735',
  'CAPITA MARVEL (2019) N.9',
  'CAPITA MARVEL (2019) N.9',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/PMfbLBZ8RBrUZ79qncpCgAFS2b4=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/bf1883a4-d819-11ee-9cda-5a86bcbeb6e3.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00736',
  'CAPITAO AMERICA E SOLDADO INVERNAL (MARVEL-VERSE)',
  'CAPITAO AMERICA E SOLDADO INVERNAL (MARVEL-VERSE)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/jt2Ki4HGtqvZxW99JwfoNUXtkk0=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/ceda606e-0ea0-11f0-8b42-eedf42219d7c.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00737',
  'CAPITAO AMERICA POR JIM STERANKO (MARVEL VINTAGE) N.1',
  'CAPITAO AMERICA POR JIM STERANKO (MARVEL VINTAGE) N.1',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/EsgnOimvj71nrsJcv1-oSttlBIA=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/c4023804-63e4-11ef-afd1-a2b2aa9ce723.png"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00738',
  'CAPITÃO AMÉRICA: LAR DOS VALENTES ( POR MARK WAID E CHRIS SA',
  'CAPITÃO AMÉRICA: LAR DOS VALENTES ( POR MARK WAID E CHRIS SA',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/epDqsNw7NEqZnmFyQ_dkTkfCHZI=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/7f2bf7b6-7fa9-11ef-b0bc-6e97175de7f7.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00739',
  'CAPITAO AMERICA: O EXERCITO FANTASMA (SCHOLASTIC)',
  'CAPITAO AMERICA: O EXERCITO FANTASMA (SCHOLASTIC)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/MYd3ukpGY4imF0lJBBfqAsAe_0o=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/f98e17ae-d816-11ee-9ac4-da2373bc7c0b.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00740',
  'CAPITAO AMERICA: O NOVO PACTO (MARVEL ESSENCIAIS)',
  'CAPITAO AMERICA: O NOVO PACTO (MARVEL ESSENCIAIS)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/vW1F1DM6JaKGhOSbr83IRKLbs_I=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/fb75b306-d816-11ee-9ac4-da2373bc7c0b.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00741',
  'CAPITAO AMERICA: SAM WILSON VOL.04 (NOVA MARVEL DELUXE)',
  'CAPITAO AMERICA: SAM WILSON VOL.04 (NOVA MARVEL DELUXE)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/w6zIIFOlIBnATObvz4lE65MNMF0=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/234bc016-d81a-11ee-9cda-5a86bcbeb6e3.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00742',
  'CAPITAO AMERICA: STEVE ROGERS (NOVA MARVEL DELUXE) VOL.01',
  'CAPITAO AMERICA: STEVE ROGERS (NOVA MARVEL DELUXE) VOL.01',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/zMlolrJqqw_ocg_Q4m7WoTz7vTQ=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/ece633b2-d89b-11ee-9200-42b2dff02d11.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00743',
  'CAPITAO AMERICA: STEVE ROGERS (NOVA MARVEL DELUXE) VOL.02',
  'CAPITAO AMERICA: STEVE ROGERS (NOVA MARVEL DELUXE) VOL.02',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/4rG6Rd0H8v3F7_rkcDDRI8ew4Z4=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/0da95b7c-d817-11ee-b124-5a86bcbeb6e3.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00744',
  'CASCAO (2021-) N.63',
  'CASCAO (2021-) N.63',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/UIRHtS3QX7_WlqFbBATqMbv5Idk=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/7de327da-7fa9-11ef-b0bc-6e97175de7f7.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00745',
  'CASCAO (2021-) N.70',
  'CASCAO (2021-) N.70',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/p0wEfbnThswhCFq7dYlB_okP038=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/92de71bc-eb29-11ef-a31a-8ed8743505f0.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00746',
  'CASCAO (2021-) N.71',
  'CASCAO (2021-) N.71',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/fa9n17Ib894ffdl-n-RxuhGsTz4=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/92f3e786-eb29-11ef-a3b1-5681c2ac1d4b.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00747',
  'CASCAO (2021-) N.72',
  'CASCAO (2021-) N.72',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/lq3wl7wBrp5A6OLRTyqgl0neOXg=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/930d6d00-eb29-11ef-8d7f-eea3b61904a2.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00748',
  'CASCAO (2021-) N.73',
  'CASCAO (2021-) N.73',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/Fdl-YZGaqKtaH0vE6fObG3cgAmY=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/106ac866-f2f9-11ef-8119-325cf2f76bb6.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00749',
  'CASCAO (2021-) N.74',
  'CASCAO (2021-) N.74',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/YN5qDZLHFCN-1GElmPFbToH8qdg=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/09fae772-98c6-11f0-b849-2e530fdcb84f.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00750',
  'CASCAO (2021-) N.75',
  'CASCAO (2021-) N.75',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/ABVN8-QymfROctERxwMH40vanuE=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/835d6cec-08c6-11f0-b69c-5e8a9da48498.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();