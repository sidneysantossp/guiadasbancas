-- SQL para importar produtos Brancaleone
-- Gerado em: 2025-10-17T17:52:46.765Z
-- Total de produtos: 3363
-- Fonte: brancaleone-products-1760723254011.json

-- 1. Criar distribuidor (se não existir)

-- Distribuidor já criado no batch-001

-- Lote 21 de 68
-- Produtos: 2001 até 2100



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01001',
  'DEMOLIDOR POR MARK WAID VOL.11 (MARVEL SAGA)',
  'DEMOLIDOR POR MARK WAID VOL.11 (MARVEL SAGA)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/UY7UCoSYhkvBQNQajgwySez6Hfo=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/b26237ee-eb29-11ef-8fb2-6696cc3e9cb3.jpg"]'::jsonb,
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
  'PROD-01002',
  'DEMOLIDOR: A ARMADURA NEGRA (LENDAS MARVEL)',
  'DEMOLIDOR: A ARMADURA NEGRA (LENDAS MARVEL)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/nnNhRUvQjrsHrFYKq1YPIjhZblY=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/d8a9b55a-eb4a-11ef-8621-0ee70347c223.jpg"]'::jsonb,
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
  'PROD-01003',
  'DEMOLIDOR: AMOR E GUERRA (MARVEL GRAPHIC NOVELS)',
  'DEMOLIDOR: AMOR E GUERRA (MARVEL GRAPHIC NOVELS)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/2SBrUTYAoWswJFxoLTbYVjbWy5Q=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/47c47d58-8b5f-11f0-ab6e-7e1ab2cbb1e5.jpg"]'::jsonb,
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
  'PROD-01004',
  'DEMOLIDOR: EDICAO DEFINITIVA VOL.01',
  'DEMOLIDOR: EDICAO DEFINITIVA VOL.01',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/NT-eSiV0zsP_IS-pq5PJhL6702U=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/3d71d4aa-5ea9-11f0-b8ff-8a0b5d172c0d.jpg"]'::jsonb,
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
  'PROD-01005',
  'DEMOLIDOR: EDICAO DEFINITIVA VOL.02',
  'DEMOLIDOR: EDICAO DEFINITIVA VOL.02',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/bp5Bb1gpok6PVp6d88J_FEVvo8I=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/46c02a74-8b5f-11f0-ab6e-7e1ab2cbb1e5.jpg"]'::jsonb,
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
  'PROD-01006',
  'DEMOLIDOR: EDICAO DEFINITIVA VOL.03',
  'DEMOLIDOR: EDICAO DEFINITIVA VOL.03',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/Z7jnej8G6Qj74-F_n8ynrZadEuw=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/77f4d3c6-4e7d-11ef-9a68-863736e20d5e.jpg"]'::jsonb,
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
  'PROD-01007',
  'DEMOLIDOR: EDICAO DEFINITIVA VOL.04',
  'DEMOLIDOR: EDICAO DEFINITIVA VOL.04',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/oS2V4mKhq4vq8pQ3tFDSVPsHN4M=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/979c1d62-1941-11f0-ad03-c6289aaa7a91.jpg"]'::jsonb,
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
  'PROD-01008',
  'DEMOLIDOR: EDICAO DEFINITIVA VOL.05',
  'DEMOLIDOR: EDICAO DEFINITIVA VOL.05',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/F-0brsXaVvvgRwpPIGCDyNfK5_Q=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/023cfa70-98c6-11f0-924f-76f14c3851ed.jpg"]'::jsonb,
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
  'PROD-01009',
  'DEMOLIDOR: O BATALHADOR JACK MURDOCK (MARVEL VINTAGE)',
  'DEMOLIDOR: O BATALHADOR JACK MURDOCK (MARVEL VINTAGE)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/fqLvIw3agp7iZfhaEY_7glhQvAw=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/81c08dd4-08c5-11f0-8cf7-7a78406af7b7.jpg"]'::jsonb,
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
  'PROD-01010',
  'DEMOLIDOR: OS TENTACULOS DO DEMONIO (MARVEL VINTAGE)',
  'DEMOLIDOR: OS TENTACULOS DO DEMONIO (MARVEL VINTAGE)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/-NRz4DFEMHz9BuMzIjaTmm7IlAg=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/7161ef68-da7d-11ee-9fe4-12792fd81a45.jpg"]'::jsonb,
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
  'PROD-01011',
  'DEMOLIDOR: REDENCAO (MARVEL ESSENCIAIS)',
  'DEMOLIDOR: REDENCAO (MARVEL ESSENCIAIS)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/fcdo30InPDOJ3ybiea_kIJ55QUw=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/ce747498-0ea0-11f0-8c42-ca515fff2782.jpg"]'::jsonb,
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
  'PROD-01012',
  'DEMOLIDOR: TERRA DAS SOMBRAS (MARVEL VINTAGE)',
  'DEMOLIDOR: TERRA DAS SOMBRAS (MARVEL VINTAGE)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/l-vmkxIWjYgz5wT7xP3Qf0QTh9c=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/8b6e6e8a-d817-11ee-9371-e2a33adec5cd.jpg"]'::jsonb,
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
  'PROD-01013',
  'DEMON SLAYER - ACADEMIA - 02',
  'DEMON SLAYER - ACADEMIA - 02',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/TLLA9fYaRLldI0vluvGs04jMjIs=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/adef955a-ee29-11ef-9d77-2221e0623913.jpg"]'::jsonb,
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
  'PROD-01014',
  'DEMON SLAYER - ACADEMIA - 03',
  'DEMON SLAYER - ACADEMIA - 03',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/yaNwq-ArGEqKVa_vkjeizKfrwIY=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/9a07338e-eb29-11ef-a31a-8ed8743505f0.jpg"]'::jsonb,
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
  'PROD-01015',
  'DEMON SLAYER - ACADEMIA - 04',
  'DEMON SLAYER - ACADEMIA - 04',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/mpcE8gYS5h6umYCh_obKUx3Tn5s=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/c3e687fc-f616-11ef-a478-c21ec36c6f62.jpg"]'::jsonb,
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
  'PROD-01016',
  'DEMON SLAYER - ACADEMIA - 05',
  'DEMON SLAYER - ACADEMIA - 05',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/_wu2RzBOf0z_pDKLMumNOtMnXgg=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/8f1bc7f0-3692-11f0-9b5f-32c7a3eebbfc.jpg"]'::jsonb,
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
  'PROD-01017',
  'DEMON SLAYER - ACADEMIA - 06',
  'DEMON SLAYER - ACADEMIA - 06',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/zlqVFuwdl1rJLnFLkK3A_ZJc64o=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/c602baa6-642a-11f0-bfa0-6253877c6ac4.jpg"]'::jsonb,
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
  'PROD-01018',
  'DEMON SLAYER - KIMETSU NO YAIBA - 01 [REB16]',
  'DEMON SLAYER - KIMETSU NO YAIBA - 01 [REB16]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/hplpvNcVxNMfJrr0H5C-KqR99Qw=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/eda3250e-0143-11f0-9602-e6e8567c501d.jpg"]'::jsonb,
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
  'PROD-01019',
  'DEMON SLAYER - KIMETSU NO YAIBA - 02 [REB9]',
  'DEMON SLAYER - KIMETSU NO YAIBA - 02 [REB9]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/meik7qCs0-bnZr9lA6jD5QTc0B4=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/8a9a778a-08c5-11f0-8333-1ab5e066f834.jpg"]'::jsonb,
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
  'PROD-01020',
  'DEMON SLAYER - KIMETSU NO YAIBA - 03 [REB9]',
  'DEMON SLAYER - KIMETSU NO YAIBA - 03 [REB9]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/jnQI_aNvNCHw0bJGYSQoAFz8sJA=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/8ac24a08-08c5-11f0-a314-5a37e2f27c8c.jpg"]'::jsonb,
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
  'PROD-01021',
  'DEMON SLAYER - KIMETSU NO YAIBA - 04 [REB7]',
  'DEMON SLAYER - KIMETSU NO YAIBA - 04 [REB7]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/wu6zo1pUd_0iFYC0ZlGoOR0WoDY=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/8b5f4402-08c5-11f0-929e-b63aa6c6321e.jpg"]'::jsonb,
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
  'PROD-01022',
  'DEMON SLAYER - KIMETSU NO YAIBA - 05 [REB7]',
  'DEMON SLAYER - KIMETSU NO YAIBA - 05 [REB7]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/tl0nkYnOlJw52P7UJArvOseDUUA=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/8bca0b8e-08c5-11f0-85a1-b2e99305fa63.jpg"]'::jsonb,
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
  'PROD-01023',
  'DEMON SLAYER - KIMETSU NO YAIBA - 06 [REB5]',
  'DEMON SLAYER - KIMETSU NO YAIBA - 06 [REB5]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/792q57j7VeUbJ3TtQ8XltGuFtZ8=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/9c05902c-1941-11f0-841e-32c81c05dd9b.jpg"]'::jsonb,
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
  'PROD-01024',
  'DEMON SLAYER - KIMETSU NO YAIBA - 07 [REB5]',
  'DEMON SLAYER - KIMETSU NO YAIBA - 07 [REB5]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/6Q1IXz6_Spl6n320GrkP_J3bhRs=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/9c080f46-1941-11f0-ad03-c6289aaa7a91.jpg"]'::jsonb,
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
  'PROD-01025',
  'DEMON SLAYER - KIMETSU NO YAIBA - 08 [REB5]',
  'DEMON SLAYER - KIMETSU NO YAIBA - 08 [REB5]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/zfGFV3dzYgKLHXBfcTjqJ3-CJW0=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/9c2839ec-1941-11f0-a707-ceedc1648097.jpg"]'::jsonb,
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
  'PROD-01026',
  'DEMON SLAYER - KIMETSU NO YAIBA - 09 [REB5]',
  'DEMON SLAYER - KIMETSU NO YAIBA - 09 [REB5]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/AjnKi-Bw5wnDoL_MfYFPeF8QjVE=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/9c59b2ec-1941-11f0-b283-1e5c1e943676.jpg"]'::jsonb,
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
  'PROD-01027',
  'DEMON SLAYER - KIMETSU NO YAIBA - 10 [REB5]',
  'DEMON SLAYER - KIMETSU NO YAIBA - 10 [REB5]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/P6PY4-IfqfcLj3TgKk7xanvtGK0=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/9c514472-1941-11f0-8389-fe558391bec0.jpg"]'::jsonb,
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
  'PROD-01028',
  'DEMON SLAYER - KIMETSU NO YAIBA - 11 [REB5]',
  'DEMON SLAYER - KIMETSU NO YAIBA - 11 [REB5]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/0mBtB-2H0lyCgllPBfwc84a2fCk=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/90b089c0-3692-11f0-a057-ba7311aaaadc.jpg"]'::jsonb,
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
  'PROD-01029',
  'DEMON SLAYER - KIMETSU NO YAIBA - 13 [REB5]',
  'DEMON SLAYER - KIMETSU NO YAIBA - 13 [REB5]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/6Z_6BePjZg8i9zZPdKhYMp-dHXg=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/3f23e81c-7fd1-11f0-b894-2e1dcafaddd0.jpg"]'::jsonb,
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
  'PROD-01030',
  'DEMON SLAYER - KIMETSU NO YAIBA - 14 [REB4]',
  'DEMON SLAYER - KIMETSU NO YAIBA - 14 [REB4]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/9VS088VM6PM4Qu7nUMVexJR71FM=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/3f6aabe4-7fd1-11f0-b894-2e1dcafaddd0.jpg"]'::jsonb,
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
  'PROD-01031',
  'DEMON SLAYER - KIMETSU NO YAIBA - 16 [REB4]',
  'DEMON SLAYER - KIMETSU NO YAIBA - 16 [REB4]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/dnsF5WiBHhqagoFZC_Jvwx6oc9Q=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/92665a10-9d49-11f0-8980-120bfc08d759.jpg"]'::jsonb,
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
  'PROD-01032',
  'DEMON SLAYER - KIMETSU NO YAIBA - GAIDEN',
  'DEMON SLAYER - KIMETSU NO YAIBA - GAIDEN',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/-zop4lUVfAzWsRx2GRJ1mscHlDo=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/9a22edcc-eb29-11ef-b1d3-def782e2bf12.jpg"]'::jsonb,
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
  'PROD-01033',
  'DEMON SLAYER ARTBOOK - 01',
  'DEMON SLAYER ARTBOOK - 01',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/gp9wklRrtroGQEZyvlp9mf80BvI=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/2bf18dc4-44b4-11f0-90fa-7e281e739724.jpg"]'::jsonb,
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
  'PROD-01034',
  'DEMON SLAYER [1-23] - BOX [REB]',
  'DEMON SLAYER [1-23] - BOX [REB]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/UopxAEeV3HCNuKslOtdwK3PEsTc=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/205ae228-a4ac-11f0-ac43-c20d3852b6b7.jpg"]'::jsonb,
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
  'PROD-01035',
  'DENISE - ARRASO (GRAPHIC MSP VOL.34)  (BROCHURA)',
  'DENISE - ARRASO (GRAPHIC MSP VOL.34)  (BROCHURA)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/tUOdDmQR14Ain-WKQ0qIpGNY_II=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/79f3d3d4-d817-11ee-9a1e-da2373bc7c0b.jpg"]'::jsonb,
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
  'PROD-01036',
  'DENISE: ARRRASO (GRAPHIC MSP VOL.34) (REB)',
  'DENISE: ARRRASO (GRAPHIC MSP VOL.34) (REB)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/0Ly6DeUJbpduON4chL8IDUJ3gcE=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/d8a4d8b2-3f2f-11f0-87b4-c2502d24ff3f.jpg"]'::jsonb,
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
  'PROD-01037',
  'DENTES-DE-SABRE (MARVEL GRAPHIC NOVEL) N.1',
  'DENTES-DE-SABRE (MARVEL GRAPHIC NOVEL) N.1',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/BwWkd-5ON98XSr7EP6oZLLuttlQ=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/800f7a86-7fa9-11ef-b1d0-12caec0ea15c.jpg"]'::jsonb,
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
  'PROD-01038',
  'DESAFIADOR POR KELLEY JONES - EDICAO DE LUXO',
  'DESAFIADOR POR KELLEY JONES - EDICAO DE LUXO',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/gC4ZOzvA4MfVQer-AmHtMMD-Mwg=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/95948e78-eb29-11ef-a31a-8ed8743505f0.jpg"]'::jsonb,
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
  'PROD-01039',
  'DESAFIADORES DO DESCONHECIDO POR JEPH LOEB E TIM SALE',
  'DESAFIADORES DO DESCONHECIDO POR JEPH LOEB E TIM SALE',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/5Whodvm3LQ3MaWzlJOsVXDSopn0=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/977159d8-1941-11f0-a494-3a4c16efbbdf.jpg"]'::jsonb,
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
  'PROD-01040',
  'DETETIVES DO PRÉDIO AZUL MAGAZINE 3',
  'DETETIVES DO PRÉDIO AZUL MAGAZINE 3',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/OD-yW8e3GfPxiLSTwIIXfd7RiHk=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/89f0b068-d817-11ee-9371-e2a33adec5cd.jpg"]'::jsonb,
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
  'PROD-01041',
  'DETETIVES DO PRÉDIO AZUL MAGAZINE N.2',
  'DETETIVES DO PRÉDIO AZUL MAGAZINE N.2',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/fxZiefM2HGOhAsLkRehpMGasYQw=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/899c3eca-d817-11ee-bce8-e2e54ed5f9f7.jpg"]'::jsonb,
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
  'PROD-01042',
  'DIÁRIO DE UMA CIDADE LITORÂNEA - 07',
  'DIÁRIO DE UMA CIDADE LITORÂNEA - 07',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/fnkkYkNA8G6njhucOahASCfhsWE=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/9e918c1a-d81a-11ee-9df9-5a86bcbeb6e3.jpg"]'::jsonb,
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
  'PROD-01043',
  'DIÁRIO DE UMA CIDADE LITORÂNEA - 08',
  'DIÁRIO DE UMA CIDADE LITORÂNEA - 08',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/fPXg_XVxM8XPxSrjr-Kx1Nm8LIM=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/9f183df0-d81a-11ee-ae87-e2e54ed5f9f7.jpg"]'::jsonb,
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
  'PROD-01044',
  'DIÁRIO DE UMA CIDADE LITORÂNEA - 09',
  'DIÁRIO DE UMA CIDADE LITORÂNEA - 09',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/zuOqUaTjZtIRdU2X295HPHIhTYo=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/9f86fbe6-d81a-11ee-9df9-5a86bcbeb6e3.jpg"]'::jsonb,
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
  'PROD-01045',
  'DIAS DEMONIACOS',
  'DIAS DEMONIACOS',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/1A79WBitcrOtAdP0OnOgmBPgkW8=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/adf9ae5e-dd64-11ee-b31a-caaf16734e1e.jpg"]'::jsonb,
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
  'PROD-01046',
  'DINOSSAURO DEMONIO POR JACK KIRBY (MARVEL OMNIBUS) N.1',
  'DINOSSAURO DEMONIO POR JACK KIRBY (MARVEL OMNIBUS) N.1',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/1Qo0th8yXH1_45S1IDeozmpmlZU=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/08602428-f68c-11ee-b180-6abfb631d83c.jpg"]'::jsonb,
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
  'PROD-01047',
  'DIVERSAO COM A TURMA DA MONICA BOX',
  'DIVERSAO COM A TURMA DA MONICA BOX',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/DDcFrHbRBVi_o8RafmHMfDT3aVI=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/866d68a0-d817-11ee-9a1e-da2373bc7c0b.jpg"]'::jsonb,
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
  'PROD-01048',
  'DO CONTRA E NIMBUS 30 ANOS N.1',
  'DO CONTRA E NIMBUS 30 ANOS N.1',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/o_F89kO28aA1WCOx4labeT4gjGk=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/8e684586-3692-11f0-8d7f-ba18af294916.jpg"]'::jsonb,
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
  'PROD-01049',
  'DO CONTRA GRAPHIC MSP N.1',
  'DO CONTRA GRAPHIC MSP N.1',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/vu64cUQlkghcqHIEe4Hj1-FaHI8=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/942fed40-e583-11ee-9d7c-f2cdc5a9e7d5.jpg"]'::jsonb,
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
  'PROD-01050',
  'DO CONTRA GRAPHIC MSP N.1',
  'DO CONTRA GRAPHIC MSP N.1',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/vu64cUQlkghcqHIEe4Hj1-FaHI8=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/942fed40-e583-11ee-9d7c-f2cdc5a9e7d5.jpg"]'::jsonb,
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