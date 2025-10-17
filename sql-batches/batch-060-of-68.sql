-- SQL para importar produtos Brancaleone
-- Gerado em: 2025-10-17T18:20:53.612Z
-- Total de produtos: 3363
-- Fonte: brancaleone-products-1760723254011.json

-- 1. Criar distribuidor (se não existir)

-- Distribuidor já criado no batch-001

-- Lote 60 de 68
-- Produtos: 5901 até 6000



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02951',
  'TAKAGI - A MESTRA DAS PEGADINHAS - 18',
  'TAKAGI - A MESTRA DAS PEGADINHAS - 18',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/wXwmh3093biInwUo5zb5D32rDoU=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/7d0d17da-d81a-11ee-ae87-e2e54ed5f9f7.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02952',
  'TAKAGI - A MESTRA DAS PEGADINHAS - 19',
  'TAKAGI - A MESTRA DAS PEGADINHAS - 19',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/PIJUl_eq_eA_Ze1MM9_5yA7fx_Q=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/7d4d2672-d81a-11ee-bd84-e2697ce33d53.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02953',
  'TAKAGI - A MESTRA DAS PEGADINHAS - 20',
  'TAKAGI - A MESTRA DAS PEGADINHAS - 20',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/fn8-bUeKdGgz1q0EOdx48_BDquI=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/1a9d7348-eb4b-11ef-9da2-4af6893572b2.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02954',
  'TAKAGI - A MESTRA DAS PEGADINHAS N.1',
  'TAKAGI - A MESTRA DAS PEGADINHAS N.1',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/dhfor6mwV1juvM889M94H0w_PKM=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/8fb98132-4e7d-11ef-acbf-3efedc1d37c9.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02955',
  'TANYA THE EVIL - 11 [REB]',
  'TANYA THE EVIL - 11 [REB]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/jPGECjqnL4U1Ft5b4cSs05QuCh0=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/e1dd3e30-eb4a-11ef-8230-fa812316df6c.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02956',
  'TANYA THE EVIL - 12 [REB]',
  'TANYA THE EVIL - 12 [REB]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/MJDZdxrnyAJ_H-GIYK_-iVmqFoE=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/e1f085d0-eb4a-11ef-8230-fa812316df6c.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02957',
  'TANYA THE EVIL - 24',
  'TANYA THE EVIL - 24',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/8DxhpSkSLmSYNECKDWIJntCQ0pg=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/9e56f4bc-d818-11ee-82a8-e2697ce33d53.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02958',
  'TANYA THE EVIL - 25',
  'TANYA THE EVIL - 25',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/Tolf4ey0B2oJkE431PRubUHZ8_g=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/9ea0a1b6-d818-11ee-a1cf-e2e54ed5f9f7.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02959',
  'TANYA THE EVIL - 26',
  'TANYA THE EVIL - 26',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/2KYM_ADNAf8fTbcu36mnu57aQ1Q=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/9f659976-d818-11ee-a11f-5a86bcbeb6e3.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02960',
  'TANYA THE EVIL - 29',
  'TANYA THE EVIL - 29',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/K3BgllIn3dr2nZwf8sKdmKD8s18=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/e230f30e-eb4a-11ef-8230-fa812316df6c.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02961',
  'TANYA THE EVIL - 30',
  'TANYA THE EVIL - 30',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/G9ojOXUyar6aW3ngZrd4v67AQxY=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/564454f0-2473-11f0-b171-7a639e1da89c.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02962',
  'TANYA THE EVIL N.10',
  'TANYA THE EVIL N.10',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/WxT0I1qUNNWtaLT1JuNpEmY4I0s=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/83adb432-7fa9-11ef-b1d0-12caec0ea15c.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02963',
  'TANYA THE EVIL N.2',
  'TANYA THE EVIL N.2',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/ofxbOHfr-PEY-iW39pd7rVi4d2s=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/e1949ed2-eb4a-11ef-8621-0ee70347c223.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02964',
  'TANYA THE EVIL N.27',
  'TANYA THE EVIL N.27',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/5GH944-ltNydJhzfMLwkDkKwrFA=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/9ff4b084-d818-11ee-a1cf-e2e54ed5f9f7.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02965',
  'TANYA THE EVIL N.28',
  'TANYA THE EVIL N.28',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/iTCqhTHRtXgbNpokSTqvha27MLo=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/5061b80a-fb7c-11ee-b174-aed4b192c71c.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02966',
  'TANYA THE EVIL N.3',
  'TANYA THE EVIL N.3',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/VJbfZtTdd1fENI1D2yoslqA1OKI=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/e1a76152-eb4a-11ef-8230-fa812316df6c.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02967',
  'TANYA THE EVIL N.6',
  'TANYA THE EVIL N.6',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/XiIyscSO9TCsqBcq7386AzlTE5g=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/8372f144-7fa9-11ef-b0bc-6e97175de7f7.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02968',
  'TANYA THE EVIL N.7',
  'TANYA THE EVIL N.7',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/kL6xobSZDXQarBjetYL5aYksqvA=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/83883d24-7fa9-11ef-b1d0-12caec0ea15c.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02969',
  'TANYA THE EVIL N.8',
  'TANYA THE EVIL N.8',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/_ABe01VwBarKdjK0TxQ-P92oY80=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/838f2030-7fa9-11ef-b0bc-6e97175de7f7.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02970',
  'TANYA THE EVIL N.9',
  'TANYA THE EVIL N.9',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/Wbj3TfA9SmXRcEa6qoshn5Q36x8=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/83a8bdec-7fa9-11ef-b0bc-6e97175de7f7.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02971',
  'TEIA SOMBRIA ESPECIAL N.1',
  'TEIA SOMBRIA ESPECIAL N.1',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/-7n100V2-n0hc0IATwHeCrk1UEQ=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/8b98cc9e-da7d-11ee-b95c-12792fd81a45.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02972',
  'TERRA LIVRE: UM CONTO DA CRUZADA DAS CRIANCAS',
  'TERRA LIVRE: UM CONTO DA CRUZADA DAS CRIANCAS',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/Dh3Nt3VpPJfPux4crQwdpz7zhso=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/4596ada8-de36-11ee-aae0-ca3362baf0a6.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02973',
  'TERRAS DESOLADAS',
  'TERRAS DESOLADAS',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/02KhgpDVHSHKTCay86WwBXhEJtg=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/8aee2780-da7d-11ee-b95c-12792fd81a45.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02974',
  'TEX: EL MUERTO (BIBLIOTECA TEX)',
  'TEX: EL MUERTO (BIBLIOTECA TEX)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/Oq3cxcgCPqbrXRneRcO9N_YoQBk=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/d71fcc74-eb4a-11ef-8621-0ee70347c223.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02975',
  'TEX: O IMPLACÁVEL (BIBLIOTECA TEX)',
  'TEX: O IMPLACÁVEL (BIBLIOTECA TEX)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/VbwurBHOCtMGSKALqMGbHET5Q3k=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/d7281942-eb4a-11ef-8230-fa812316df6c.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02976',
  'TEX: O PASSADO DE CARSON (BIBLIOTECA TEX) N.6',
  'TEX: O PASSADO DE CARSON (BIBLIOTECA TEX) N.6',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/DSrbHHDpCgONH740FZZ7Qb8Oi7o=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/90170b26-e583-11ee-b66f-62eaabe3d6ba.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02977',
  'TEX: O RETORNO DE LUPE',
  'TEX: O RETORNO DE LUPE',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/dJ9H34KWnrgxEbIVA7xAlZoP820=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/c36a3824-63e4-11ef-8da1-f6206878cf7b.png"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02978',
  'TEX: VIVO OU MORTO (BIBLIOTECA TEX) N.7',
  'TEX: VIVO OU MORTO (BIBLIOTECA TEX) N.7',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/BVphW0vtUEu6Lmf9qZcq3LgDXhc=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/871200fa-f111-11ee-96c7-6645492b56b4.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02979',
  'THE ELUSIVE SAMURAI - 01',
  'THE ELUSIVE SAMURAI - 01',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/2T6hANDFamkzQvc8sel0r8fOcbY=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/920ae390-d817-11ee-9371-e2a33adec5cd.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02980',
  'THE ELUSIVE SAMURAI - 02',
  'THE ELUSIVE SAMURAI - 02',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/DR4sttyVpXag8EGJ9E-CfeT3nUE=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/9273b55a-d817-11ee-b124-5a86bcbeb6e3.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02981',
  'THE ELUSIVE SAMURAI - 03',
  'THE ELUSIVE SAMURAI - 03',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/ztNO3LEbBdoQy9IsVo0SZqGZbiQ=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/92ca0dc4-d817-11ee-bce8-e2e54ed5f9f7.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02982',
  'THE ELUSIVE SAMURAI - 04',
  'THE ELUSIVE SAMURAI - 04',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/8bjB9UfIwvyAm7503N3W6WOiEjE=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/9324d006-d817-11ee-86d3-ce469b473a25.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02983',
  'THE ELUSIVE SAMURAI - 10',
  'THE ELUSIVE SAMURAI - 10',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/o5RxjEBsY39nTUtvWhfEPidgjK0=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/d9d881ae-eb4a-11ef-8230-fa812316df6c.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02984',
  'THE ELUSIVE SAMURAI - 11',
  'THE ELUSIVE SAMURAI - 11',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/9Tmw4jljOiA8EMzYIxcwp9DgAf8=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/96c14908-eb29-11ef-a31a-8ed8743505f0.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02985',
  'THE ELUSIVE SAMURAI - 12',
  'THE ELUSIVE SAMURAI - 12',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/zcQ_QIZVaAb6NFR9M7bJGnj8ddM=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/17940472-f2f9-11ef-bcb5-dad79b85e12c.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02986',
  'THE ELUSIVE SAMURAI - 13',
  'THE ELUSIVE SAMURAI - 13',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/k-4hQqbzIubQt9CsioM4gYnYYgw=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/54e57558-2473-11f0-a596-1e01f72415a5.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02987',
  'THE ELUSIVE SAMURAI -14',
  'THE ELUSIVE SAMURAI -14',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/fZXUDjTpH5-nSlkd8gw-KT3DdIs=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/2031151a-6f3c-11f0-a9ce-be17303ec705.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02988',
  'THE ELUSIVE SAMURAI N.5',
  'THE ELUSIVE SAMURAI N.5',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/FkdApg4wnYJ5va3hROi-NLnqgNY=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/9396e42a-d817-11ee-9371-e2a33adec5cd.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02989',
  'THE ELUSIVE SAMURAI N.6',
  'THE ELUSIVE SAMURAI N.6',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/rqlMJAPIDfQt2bJHPCFyV4B9r9Q=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/93e089b8-d817-11ee-a3da-e2697ce33d53.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02990',
  'THE ELUSIVE SAMURAI N.7',
  'THE ELUSIVE SAMURAI N.7',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/7lybw8BKHSb3uRZzJ55N-8Nfwz4=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/370098aa-e497-11ee-b6a7-e2b250ff01a0.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02991',
  'THE ELUSIVE SAMURAI N.8',
  'THE ELUSIVE SAMURAI N.8',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/7sO6NV0RbirxrzG_y9hy6xHWrTk=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/78f0864e-4e7d-11ef-a912-ae3b80f67920.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02992',
  'THE ELUSIVE SAMURAI N.9',
  'THE ELUSIVE SAMURAI N.9',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/sSSDkmJ9VCn8RNSNL12SYqDeCcg=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/c5f8db22-63e4-11ef-afd1-a2b2aa9ce723.png"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02993',
  'THE KILLER INSIDE - 04',
  'THE KILLER INSIDE - 04',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/W3wYMFRRe20bkjdDqjCHMemQc_k=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/fb64e14c-d817-11ee-a4a8-5a86bcbeb6e3.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02994',
  'THE KILLER INSIDE - 06',
  'THE KILLER INSIDE - 06',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/nTEP-2u9qTv_YDXPKj2Tr95IEyo=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/fc4cd588-d817-11ee-a3da-e2697ce33d53.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02995',
  'THE KILLER INSIDE - 07',
  'THE KILLER INSIDE - 07',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/SDrHrh3-oHf-YmOVFVfAhS2EoAY=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/fc7ef662-d817-11ee-86d3-ce469b473a25.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02996',
  'THE KILLER INSIDE - 10',
  'THE KILLER INSIDE - 10',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/RECuwBY5zC4PbjoGzarFALAMOQA=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/389be08a-7fd1-11f0-a5af-de5e70a27ff7.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02997',
  'THE KILLER INSIDE - 11',
  'THE KILLER INSIDE - 11',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/1m2gGjSfWKqWkhNDpIqVPllFWRo=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/fea4a37e-d817-11ee-86d3-ce469b473a25.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02998',
  'THE WALKING DEAD VOL 05',
  'THE WALKING DEAD VOL 05',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/-9bg6hthAnkPkJ_ClY8-B0TUCnk=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/4ff1f192-e497-11ee-83ff-7ee42cfe9644.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02999',
  'THE WALKING DEAD VOL 06',
  'THE WALKING DEAD VOL 06',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/xo3C1oe5zXdU3HMSU2k5hZccJI4=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/5042eeb2-e497-11ee-b6a7-e2b250ff01a0.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-03000',
  'THE WALKING DEAD VOL 07',
  'THE WALKING DEAD VOL 07',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/kTJw4ko7niUaCK728DfkM4Jwum0=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/33c761fa-ebef-11ee-8810-22f5b7d93b6a.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();