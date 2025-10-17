-- SQL para importar produtos Brancaleone
-- Gerado em: 2025-10-17T17:52:46.765Z
-- Total de produtos: 3363
-- Fonte: brancaleone-products-1760723254011.json

-- 1. Criar distribuidor (se não existir)

-- Distribuidor já criado no batch-001

-- Lote 30 de 68
-- Produtos: 2901 até 3000



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01451',
  'INITIAL D - 04',
  'INITIAL D - 04',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/cwLTPxja4OOyRFTLkDY3lY19luc=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/812f1fe8-08c5-11f0-a2cf-7e024f525d71.jpg"]'::jsonb,
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
  'PROD-01452',
  'INITIAL D - 05',
  'INITIAL D - 05',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/W6if_07YjSRf-FAClT4_qBfG0eM=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/554cd266-2473-11f0-a45f-e6e875f51541.jpg"]'::jsonb,
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
  'PROD-01453',
  'INITIAL D - 06',
  'INITIAL D - 06',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/lF5m-EJQrdK5t0ajQrlNXOLLD7c=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/daa089e0-3f2f-11f0-a17d-1ac4d5553c9e.jpg"]'::jsonb,
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
  'PROD-01454',
  'INITIAL D - 07',
  'INITIAL D - 07',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/7BFYdM80riN7dxNnUhKDUTLWenI=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/841a07dc-4dac-11f0-b840-c6f13973e51f.jpg"]'::jsonb,
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
  'PROD-01455',
  'INITIAL D - 08',
  'INITIAL D - 08',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/p7xJnCAQhkvaTkdGLEMw_l9vUmE=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/47f698c4-8b5f-11f0-b876-cef4535c59b2.jpg"]'::jsonb,
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
  'PROD-01456',
  'INJUSTICA: DEUSES ENTRE  NOS VOL. 02',
  'INJUSTICA: DEUSES ENTRE  NOS VOL. 02',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/TfxZq34UMHtCQ_r0Wkt_kfEAU2k=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/ec14ce54-0143-11f0-9602-e6e8567c501d.jpg"]'::jsonb,
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
  'PROD-01457',
  'INJUSTICA: DEUSES ENTRE NOS VOL. 03',
  'INJUSTICA: DEUSES ENTRE NOS VOL. 03',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/CxPQkytpwb_TVSHjorrzxb1_qAI=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/e860d35c-9031-11f0-9754-9a60b14b6cd5.jpg"]'::jsonb,
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
  'PROD-01458',
  'INJUSTICA: DEUSES ENTRE NOS VOL. 1',
  'INJUSTICA: DEUSES ENTRE NOS VOL. 1',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/TfvQQrXJAe1S4jE9TCjarJxNt1A=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/c74e6e24-63e4-11ef-8888-36fc18488cf6.png"]'::jsonb,
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
  'PROD-01459',
  'INSONES - CACANDO ESTRELAS DEPOIS DA AULA VOL.01',
  'INSONES - CACANDO ESTRELAS DEPOIS DA AULA VOL.01',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/n5iNZS391YhPjYgNdovI2SFaYuo=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/d6fcf2ae-d817-11ee-9a1e-da2373bc7c0b.jpg"]'::jsonb,
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
  'PROD-01460',
  'INSONES - CACANDO ESTRELAS DEPOIS DA AULA VOL.02',
  'INSONES - CACANDO ESTRELAS DEPOIS DA AULA VOL.02',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/v2rzbstGknpnoqG33Wpmthn0LjU=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/d796ca5a-d817-11ee-9a1e-da2373bc7c0b.jpg"]'::jsonb,
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
  'PROD-01461',
  'INSONES - CACANDO ESTRELAS DEPOIS DA AULA VOL.03',
  'INSONES - CACANDO ESTRELAS DEPOIS DA AULA VOL.03',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/pXVSyy78UU4gGyxd1o30NlhUOTM=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/d7b813d6-d817-11ee-a4a8-5a86bcbeb6e3.jpg"]'::jsonb,
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
  'PROD-01462',
  'INSONES - CACANDO ESTRELAS DEPOIS DA AULA VOL.04',
  'INSONES - CACANDO ESTRELAS DEPOIS DA AULA VOL.04',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/ywr-wPfcvj_MxFWP4P0zINRq2nY=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/d85a25cc-d817-11ee-bce8-e2e54ed5f9f7.jpg"]'::jsonb,
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
  'PROD-01463',
  'INSONES - CACANDO ESTRELAS DEPOIS DA AULA VOL.05',
  'INSONES - CACANDO ESTRELAS DEPOIS DA AULA VOL.05',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/WV2xdOBtgXNsLU9iPHQwdc8bKKc=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/d8bc7380-d817-11ee-9a1e-da2373bc7c0b.jpg"]'::jsonb,
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
  'PROD-01464',
  'INSONES - CACANDO ESTRELAS DEPOIS DA AULA VOL.06',
  'INSONES - CACANDO ESTRELAS DEPOIS DA AULA VOL.06',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/ap_-EWBmlRfA15tuyAU7L6Te4Yc=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/d91cf43a-d817-11ee-a3da-e2697ce33d53.jpg"]'::jsonb,
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
  'PROD-01465',
  'INSONES - CACANDO ESTRELAS DEPOIS DA AULA VOL.07',
  'INSONES - CACANDO ESTRELAS DEPOIS DA AULA VOL.07',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/IFXxBF_ITb6Y3qZq-S8CY4Q87gg=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/d9746c24-d817-11ee-bce8-e2e54ed5f9f7.jpg"]'::jsonb,
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
  'PROD-01466',
  'INSONES - CACANDO ESTRELAS DEPOIS DA AULA VOL.08',
  'INSONES - CACANDO ESTRELAS DEPOIS DA AULA VOL.08',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/_W3UncP24CQCDxrK-Hd9Pd2NI0A=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/da0f659e-d817-11ee-86d3-ce469b473a25.jpg"]'::jsonb,
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
  'PROD-01467',
  'INSONES - CACANDO ESTRELAS DEPOIS DA AULA VOL.09',
  'INSONES - CACANDO ESTRELAS DEPOIS DA AULA VOL.09',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/ATUW1uf2S-W6xOUx-OhzPajIN6U=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/da5b46ee-d817-11ee-a4a8-5a86bcbeb6e3.jpg"]'::jsonb,
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
  'PROD-01468',
  'INSONES - CACANDO ESTRELAS DEPOIS DA AULA VOL.10',
  'INSONES - CACANDO ESTRELAS DEPOIS DA AULA VOL.10',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/Vbrb39xVIQFRxwq0Ac0h4LsIl3c=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/f73daa98-d89b-11ee-a97f-26337c3739c7.jpg"]'::jsonb,
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
  'PROD-01469',
  'INSONES - CACANDO ESTRELAS DEPOIS DA AULA VOL.11',
  'INSONES - CACANDO ESTRELAS DEPOIS DA AULA VOL.11',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/BGDo-ePHJCM4HKne8HMBtlN_mEU=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/3d081534-e497-11ee-83ff-7ee42cfe9644.jpg"]'::jsonb,
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
  'PROD-01470',
  'INSONES - CACANDO ESTRELAS DEPOIS DA AULA VOL.12',
  'INSONES - CACANDO ESTRELAS DEPOIS DA AULA VOL.12',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/g_woagJV5AAEonzD3y9RpG5iwbw=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/4c65ee60-fb7c-11ee-b174-aed4b192c71c.jpg"]'::jsonb,
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
  'PROD-01471',
  'INSONES - CACANDO ESTRELAS DEPOIS DA AULA VOL.13',
  'INSONES - CACANDO ESTRELAS DEPOIS DA AULA VOL.13',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/3-rIWtD4eR0bT8uNqNXxH81ygII=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/d4f4b66a-119a-11ef-ad89-8e32d0639719.jpg"]'::jsonb,
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
  'PROD-01472',
  'INSONES - CACANDO ESTRELAS DEPOIS DA AULA VOL.14',
  'INSONES - CACANDO ESTRELAS DEPOIS DA AULA VOL.14',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/xkKE7HMzsg75YgOzgIpaDqlzz6E=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/2739d11c-2ce4-11ef-82be-7aa6211a675a.jpg"]'::jsonb,
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
  'PROD-01473',
  'INVASAO (GRANDES EVENTOS DC)',
  'INVASAO (GRANDES EVENTOS DC)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/oNMhxqZAWvnMHgwmfAt2s9dPw04=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/14c511b8-d89d-11ee-bf26-5a86bcbeb6e3.jpg"]'::jsonb,
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
  'PROD-01474',
  'INVASAO SECRETA (2023) N.1',
  'INVASAO SECRETA (2023) N.1',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/Sxr1TnDsq0Jki8miPp7ukHTYui4=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/db4bec2a-d817-11ee-a4a8-5a86bcbeb6e3.jpg"]'::jsonb,
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
  'PROD-01475',
  'INVENCIVEL VOL.01 [REB4]',
  'INVENCIVEL VOL.01 [REB4]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/-OB20o7trJ2qSwxjUnjIIROYLIs=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/f80b3720-feb9-11ef-b6c6-4a91a624d386.jpg"]'::jsonb,
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
  'PROD-01476',
  'INVENCIVEL VOL.02',
  'INVENCIVEL VOL.02',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/UOt5YW9nt2xDhI8v-mICgfiYUMI=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/9894a55e-1941-11f0-a707-ceedc1648097.jpg"]'::jsonb,
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
  'PROD-01477',
  'INVENCIVEL VOL.03',
  'INVENCIVEL VOL.03',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/-z_hjR3gUmZk2LZZiiMTjX-3FtQ=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/8ed482b4-3692-11f0-a057-ba7311aaaadc.jpg"]'::jsonb,
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
  'PROD-01478',
  'INVENCIVEL VOL.04',
  'INVENCIVEL VOL.04',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/5GzoSBZYNkQoLpsPGSKRmncqhfE=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/2c35976c-44b4-11f0-a1ec-1a73b65bfa37.jpg"]'::jsonb,
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
  'PROD-01479',
  'INVENCIVEL VOL.05',
  'INVENCIVEL VOL.05',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/0zTCxbM_SC8ckUVVV2za8OSJrR0=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/c5d2a776-642a-11f0-9174-0aba59c16e94.jpg"]'::jsonb,
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
  'PROD-01480',
  'INVENCIVEL VOL.06',
  'INVENCIVEL VOL.06',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/-iAu9LhzkNDkiKbcS755Mv4A1bY=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/37f62578-7fd1-11f0-a5af-de5e70a27ff7.jpg"]'::jsonb,
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
  'PROD-01481',
  'INVENCIVEL VOL.07',
  'INVENCIVEL VOL.07',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/phi75ig8balDRsyOM1zFQqzVHf8=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/02dfc1d8-98c6-11f0-bb75-923f72ea5284.jpg"]'::jsonb,
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
  'PROD-01482',
  'JAY GARRICK: O FLASH',
  'JAY GARRICK: O FLASH',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/iTOLzVPMMoGX6KUiZyuA2d9i-h8=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/994fe260-eb29-11ef-9e36-2a856f41baa0.jpg"]'::jsonb,
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
  'PROD-01483',
  'JEREMIAS 3 (GRAPHIC MSP N.39) BROCHURA',
  'JEREMIAS 3 (GRAPHIC MSP N.39) BROCHURA',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/oxBNwZLuavLj2UvVg7lGIXcTsNo=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/dbf3bde2-d817-11ee-a3da-e2697ce33d53.jpg"]'::jsonb,
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
  'PROD-01484',
  'JESSICA JONES: ALIAS (MARVEL ESSENCIAIS)',
  'JESSICA JONES: ALIAS (MARVEL ESSENCIAIS)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/Oln0pedejuM0x4RVg_AryhnA1is=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/995ceb22-eb29-11ef-a3b1-5681c2ac1d4b.jpg"]'::jsonb,
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
  'PROD-01485',
  'JOAO DAS FABULAS: EDICAO DE LUXO VOL.2',
  'JOAO DAS FABULAS: EDICAO DE LUXO VOL.2',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/iCXuQ_2AhAtS_8l4An0tct9E4kM=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/dea30f66-d817-11ee-a4a8-5a86bcbeb6e3.jpg"]'::jsonb,
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
  'PROD-01486',
  'JOAO DAS FABULAS: EDICAO DE LUXO VOL.3',
  'JOAO DAS FABULAS: EDICAO DE LUXO VOL.3',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/MKYbDxE5qBhdxt5Hd3oULcRlx0g=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/380f8da6-7fd1-11f0-b894-2e1dcafaddd0.jpg"]'::jsonb,
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
  'PROD-01487',
  'JOJO S BIZARRE ADVENTURES - STEEL BALL RUN 01 [REB3]',
  'JOJO S BIZARRE ADVENTURES - STEEL BALL RUN 01 [REB3]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/IP-gTeW7-yW6l1i1Bch9BRzCeq0=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/d01a6a1e-0ea0-11f0-9866-428e228ef4a2.jpg"]'::jsonb,
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
  'PROD-01488',
  'JOJO S BIZARRE ADVENTURES - STEEL BALL RUN 02 [REB]',
  'JOJO S BIZARRE ADVENTURES - STEEL BALL RUN 02 [REB]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/5Rp5D4nMiSliS9vNSMNFvRxMgRw=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/5690ad32-2473-11f0-a596-1e01f72415a5.jpg"]'::jsonb,
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
  'PROD-01489',
  'JOJO S BIZARRE ADVENTURES - STEEL BALL RUN 03 [REB]',
  'JOJO S BIZARRE ADVENTURES - STEEL BALL RUN 03 [REB]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/usE9tgAH3pFxWOfB4xrnnU1PR50=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/90595696-3692-11f0-a9ef-e679d989cbbb.jpg"]'::jsonb,
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
  'PROD-01490',
  'JOJO S BIZARRE ADVENTURES - STEEL BALL RUN 04',
  'JOJO S BIZARRE ADVENTURES - STEEL BALL RUN 04',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/lW-Hi0y5yMTFb-pJxP5frg4hCxI=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/1e6579fc-48b7-11f0-9d89-9eda44bc3e04.jpg"]'::jsonb,
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
  'PROD-01491',
  'JOJOS BIZARRE ADVENTURE - 39  PARTE 5 - GOLDEN WIND VOL. 10',
  'JOJOS BIZARRE ADVENTURE - 39  PARTE 5 - GOLDEN WIND VOL. 10',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/jbkN6yzCamKOK83qsgLEAR0EYlY=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/49be6d4e-8b5f-11f0-b3d9-165df9e621a1.jpg"]'::jsonb,
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
  'PROD-01492',
  'JOJOS BIZARRE ADVENTURE - 44 (PARTE 6 – STONE OCEAN VOL. 5)',
  'JOJOS BIZARRE ADVENTURE - 44 (PARTE 6 – STONE OCEAN VOL. 5)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/w2gqTud8K4wWsUUykXiSxJu3UeI=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/25835c62-2ce4-11ef-be32-e29a78b97fe9.jpg"]'::jsonb,
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
  'PROD-01493',
  'JOJOS BIZARRE ADVENTURE - 47 PARTE 6 - STONE OCEAN VOL. 8',
  'JOJOS BIZARRE ADVENTURE - 47 PARTE 6 - STONE OCEAN VOL. 8',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/4dchxrhTtkoq_fuRoglCd84xg-Y=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/e789fa30-eb4a-11ef-8230-fa812316df6c.jpg"]'::jsonb,
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
  'PROD-01494',
  'JOJOS BIZARRE ADVENTURES - 48  PARTE 6 - STONE OCEAN VOL. 9',
  'JOJOS BIZARRE ADVENTURES - 48  PARTE 6 - STONE OCEAN VOL. 9',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/G-hWYdTXI4y-dLeKICOCIDaLUgA=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/9f034d00-eb29-11ef-8fb2-6696cc3e9cb3.jpg"]'::jsonb,
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
  'PROD-01495',
  'JOJOS BIZARRE ADVENTURES - 49  PARTE 6 - STONE OCEAN VOL. 10',
  'JOJOS BIZARRE ADVENTURES - 49  PARTE 6 - STONE OCEAN VOL. 10',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/6JxPwUXzNBIqo-aafXBiCfJfbP8=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/9f2e496a-eb29-11ef-8d7f-eea3b61904a2.jpg"]'::jsonb,
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
  'PROD-01496',
  'JOJOS BIZARRE ADVENTURES - 50  PARTE 6 - STONE OCEAN VOL. 11',
  'JOJOS BIZARRE ADVENTURES - 50  PARTE 6 - STONE OCEAN VOL. 11',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/HLiv-Jgqbg4VFnf8fjgAsyDtpSo=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/9f32097e-eb29-11ef-a4f3-5a40d84dae09.jpg"]'::jsonb,
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
  'PROD-01497',
  'JOJOS BIZARRE ADVENTURES N.42',
  'JOJOS BIZARRE ADVENTURES N.42',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/-iKemxQjZdUlIH4nR4RqQvwUt1c=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/1bfed6a0-069a-11ef-8901-2a9a18647563.jpg"]'::jsonb,
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
  'PROD-01498',
  'JOJOS BIZARRE ADVENTURES N.43',
  'JOJOS BIZARRE ADVENTURES N.43',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/xzCCjMAyewHeDx1RRvk6X8iyPzU=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/016f4fd2-1ca6-11ef-bc32-def7b1441874.jpg"]'::jsonb,
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
  'PROD-01499',
  'JOJOS BIZARRE ADVENTURES N.45',
  'JOJOS BIZARRE ADVENTURES N.45',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/Ph910pka1dDueHHIItAzY5uPjuk=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/cb1302b8-63e4-11ef-b225-d27112a10133.png"]'::jsonb,
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
  'PROD-01500',
  'JOJOS BIZARRE ADVENTURES N.46',
  'JOJOS BIZARRE ADVENTURES N.46',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/odgn9bHUn1Fxa3ZZHjJEtxG1ft8=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/84fa7866-7fa9-11ef-b0bc-6e97175de7f7.jpg"]'::jsonb,
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