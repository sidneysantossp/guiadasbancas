-- SQL para importar produtos Brancaleone
-- Gerado em: 2025-10-17T17:52:46.765Z
-- Total de produtos: 3363
-- Fonte: brancaleone-products-1760723254011.json

-- 1. Criar distribuidor (se não existir)

-- Distribuidor já criado no batch-001

-- Lote 42 de 68
-- Produtos: 4101 até 4200



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02051',
  'NAMORADA DE ALUGUEL - 36',
  'NAMORADA DE ALUGUEL - 36',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/4zYcIgfwP_M5mfMwJ09sBj9aJes=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/f48ae802-eb4a-11ef-8230-fa812316df6c.jpg"]'::jsonb,
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
  'PROD-02052',
  'NAMORADA DE ALUGUEL - 37',
  'NAMORADA DE ALUGUEL - 37',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/NfAB2dbyhly0UipGowOZ7rqRtnE=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/1eb7590c-f2f9-11ef-ae49-4a557680f2ea.jpg"]'::jsonb,
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
  'PROD-02053',
  'NAMORADA DE ALUGUEL - 38',
  'NAMORADA DE ALUGUEL - 38',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/pYnhupMxKpyV9-u4VqoDv5T7OwE=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/5a47d504-2473-11f0-b413-de5b603f9a23.jpg"]'::jsonb,
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
  'PROD-02054',
  'NAMORADA DE ALUGUEL - 39',
  'NAMORADA DE ALUGUEL - 39',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/aIfq-Hbqo10g-FCH5fbuCOOSPIU=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/c6f75f8e-642a-11f0-bfa0-6253877c6ac4.jpg"]'::jsonb,
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
  'PROD-02055',
  'NAMORADA DE ALUGUEL N.29',
  'NAMORADA DE ALUGUEL N.29',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/YWanAReANjFrDZv9NJeMzCsy3pQ=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/d1d87dfa-d819-11ee-a453-e2697ce33d53.jpg"]'::jsonb,
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
  'PROD-02056',
  'NAMORADA DE ALUGUEL N.30',
  'NAMORADA DE ALUGUEL N.30',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/k9203xJwSa3mOcu9IAsYxU-5VDI=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/d24cc6ec-d819-11ee-a82e-32937b3ded24.jpg"]'::jsonb,
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
  'PROD-02057',
  'NAMORADA DE ALUGUEL N.32',
  'NAMORADA DE ALUGUEL N.32',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/yjErTWy2mprLgp5RCrvJX0VUaX4=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/473e2d9a-e497-11ee-83ff-7ee42cfe9644.jpg"]'::jsonb,
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
  'PROD-02058',
  'NAMORADA DE ALUGUEL N.33',
  'NAMORADA DE ALUGUEL N.33',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/htiro8xA7LD2HEFveiHm6ej5DN0=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/d25ad1e6-119a-11ef-bcb1-8607d1df3044.jpg"]'::jsonb,
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
  'PROD-02059',
  'NAMORADA DE ALUGUEL N.34',
  'NAMORADA DE ALUGUEL N.34',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/zX7lVOliXpXeKRmgKWEX-GMPe7o=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/8bc6a21c-4e7d-11ef-a912-ae3b80f67920.jpg"]'::jsonb,
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
  'PROD-02060',
  'NAMORADA DE ALUGUEL N.35',
  'NAMORADA DE ALUGUEL N.35',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/fsd4sKuhSe1eSAMgAaKRXrNEGB0=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/875bc416-7fa9-11ef-b0bc-6e97175de7f7.jpg"]'::jsonb,
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
  'PROD-02061',
  'NAO MEXA COMIGO, NAGATORO - 1',
  'NAO MEXA COMIGO, NAGATORO - 1',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/DupyF1fx_JIjP_0NflnyZjZnKg0=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/8b8f8304-4e7d-11ef-ad60-86ce4d9bc0e0.jpg"]'::jsonb,
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
  'PROD-02062',
  'NÃO MEXA COMIGO, NAGATORO - 10',
  'NÃO MEXA COMIGO, NAGATORO - 10',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/iK6Kj7yeOZpiCKmYDXFOWMWdh3w=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/5a32c31c-2473-11f0-b868-ae6ee18ee784.jpg"]'::jsonb,
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
  'PROD-02063',
  'NÃO MEXA COMIGO, NAGATORO - 11',
  'NÃO MEXA COMIGO, NAGATORO - 11',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/VrdOLjHGVovkU8AbXI07ywP0ahQ=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/910bd140-3692-11f0-8b35-7a3a9a708959.jpg"]'::jsonb,
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
  'PROD-02064',
  'NÃO MEXA COMIGO, NAGATORO - 12',
  'NÃO MEXA COMIGO, NAGATORO - 12',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/TiHn5ucv74ThMmTUbVOpdQExXMY=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/1f99f546-48b7-11f0-98d1-7a925bb2c122.jpg"]'::jsonb,
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
  'PROD-02065',
  'NÃO MEXA COMIGO, NAGATORO - 13',
  'NÃO MEXA COMIGO, NAGATORO - 13',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/YtsQqwz8zrAii7LVpzU_ZPNam9k=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/40c0dda6-7fd1-11f0-b894-2e1dcafaddd0.jpg"]'::jsonb,
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
  'PROD-02066',
  'NÃO MEXA COMIGO, NAGATORO - 14',
  'NÃO MEXA COMIGO, NAGATORO - 14',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/n5edNowyfJn4KRl0r7rpkJQOjP8=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/4fa6b298-8b5f-11f0-b3d9-165df9e621a1.jpg"]'::jsonb,
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
  'PROD-02067',
  'NÃO MEXA COMIGO, NAGATORO - 15',
  'NÃO MEXA COMIGO, NAGATORO - 15',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/0dcRrZrQGcLCN3HvBYpB6f7geqs=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/051a1fc0-98c6-11f0-8324-461851874bd4.jpg"]'::jsonb,
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
  'PROD-02068',
  'NAO MEXA COMIGO, NAGATORO - 2',
  'NAO MEXA COMIGO, NAGATORO - 2',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/XLxu4szE3zulbuAOcTadSTzZjzI=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/cede4060-63e4-11ef-b1cf-4e63865ab0a7.png"]'::jsonb,
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
  'PROD-02069',
  'NÃO MEXA COMIGO, NAGATORO - 3',
  'NÃO MEXA COMIGO, NAGATORO - 3',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/1JhgGE2fsSIUdWRCDZGMLmZAXQo=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/8742cdb2-7fa9-11ef-b0bc-6e97175de7f7.jpg"]'::jsonb,
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
  'PROD-02070',
  'NÃO MEXA COMIGO, NAGATORO - 4',
  'NÃO MEXA COMIGO, NAGATORO - 4',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/eQVLIDYxuRkNlSamtVcB--FgbSI=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/f364975c-eb4a-11ef-8230-fa812316df6c.jpg"]'::jsonb,
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
  'PROD-02071',
  'NÃO MEXA COMIGO, NAGATORO - 5',
  'NÃO MEXA COMIGO, NAGATORO - 5',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/UAyT_auiHY74DSnwSCNSVdCtM0o=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/f3b08770-eb4a-11ef-8230-fa812316df6c.jpg"]'::jsonb,
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
  'PROD-02072',
  'NÃO MEXA COMIGO, NAGATORO - 6',
  'NÃO MEXA COMIGO, NAGATORO - 6',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/4CUmcURbLpFKv30MFsLGi1lJg30=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/a4faafdc-eb29-11ef-a3b1-5681c2ac1d4b.jpg"]'::jsonb,
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
  'PROD-02073',
  'NÃO MEXA COMIGO, NAGATORO - 7',
  'NÃO MEXA COMIGO, NAGATORO - 7',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/TFuUjj3qUYNow2gRxwqOwHpH0h4=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/a508700e-eb29-11ef-8d7f-eea3b61904a2.jpg"]'::jsonb,
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
  'PROD-02074',
  'NÃO MEXA COMIGO, NAGATORO - 8',
  'NÃO MEXA COMIGO, NAGATORO - 8',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/h8tDj49V_5w7Ga77WVesLqud4Lw=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/a551f774-eb29-11ef-a31a-8ed8743505f0.jpg"]'::jsonb,
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
  'PROD-02075',
  'NÃO MEXA COMIGO, NAGATORO - 9',
  'NÃO MEXA COMIGO, NAGATORO - 9',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/wfpiVpAcetVj4Fv19OvTA26N5Jo=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/91cd3730-08c6-11f0-b5a3-7a78406af7b7.jpg"]'::jsonb,
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
  'PROD-02076',
  'NARUTO - A ÉPICA HISTORIA DE KAKASHI: O SEXTO HOKAGE E O GAR',
  'NARUTO - A ÉPICA HISTORIA DE KAKASHI: O SEXTO HOKAGE E O GAR',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/CBWOBfEkUvYMXBM5_xjnDCqrG8s=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/d06cbce2-0ea0-11f0-9e93-ea4d61c6c6f0.jpg"]'::jsonb,
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
  'PROD-02077',
  'NARUTO - A ÉPICA HISTORIA DE SASUKE: OS DECENDENTES UCHIHA E',
  'NARUTO - A ÉPICA HISTORIA DE SASUKE: OS DECENDENTES UCHIHA E',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/kmj7mOz3wXKWSw--vB5dUatQNZQ=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/4fbb63e6-8b5f-11f0-b3d9-165df9e621a1.jpg"]'::jsonb,
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
  'PROD-02078',
  'NARUTO - A VERDADEIRA HISTORIA DA FOLHA 10',
  'NARUTO - A VERDADEIRA HISTORIA DA FOLHA 10',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/NfZpJH9CHB6fZegNSIf2MgYzo0E=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/d4b74e16-d819-11ee-83df-e2e54ed5f9f7.jpg"]'::jsonb,
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
  'PROD-02079',
  'NARUTO - A VERDADEIRA HISTORIA DE NARUTO: DIA DE PAIS E FILH',
  'NARUTO - A VERDADEIRA HISTORIA DE NARUTO: DIA DE PAIS E FILH',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/a1HhXlv6VOCqKl1h0PgVVn6lMME=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/d53fc674-d819-11ee-a453-e2697ce33d53.jpg"]'::jsonb,
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
  'PROD-02080',
  'NARUTO - A VERDADEIRA HISTORIA DE SASUKE: PUPILO E PRODIGIO',
  'NARUTO - A VERDADEIRA HISTORIA DE SASUKE: PUPILO E PRODIGIO',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/oVk5JBlDRTC8qh8JbIxHhQr5cok=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/c177262a-0125-11ef-9900-52ec7c1eeb4f.jpg"]'::jsonb,
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
  'PROD-02081',
  'NARUTO - A VERDADEIRA HISTORIA DE SHIKAMARU: UMA NUVEM DANÇA',
  'NARUTO - A VERDADEIRA HISTORIA DE SHIKAMARU: UMA NUVEM DANÇA',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/Mdsg1qAHDeKsD4Sd744PXbZPJVs=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/f4a2e600-eb4a-11ef-8230-fa812316df6c.jpg"]'::jsonb,
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
  'PROD-02082',
  'NARUTO GOLD - 01 [REB6]',
  'NARUTO GOLD - 01 [REB6]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/EwnrSPEKe-esYnzeSWjLO0yacZA=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/fa1d7528-feb9-11ef-9819-be00b4f9a4bc.jpg"]'::jsonb,
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
  'PROD-02083',
  'NARUTO GOLD - 02 [REB7]',
  'NARUTO GOLD - 02 [REB7]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/xXUe0YKk_8OVowe-pho79c63fb8=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/8432e2c4-08c5-11f0-a314-5a37e2f27c8c.jpg"]'::jsonb,
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
  'PROD-02084',
  'NARUTO GOLD - 03 [REB7]',
  'NARUTO GOLD - 03 [REB7]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/7nNWbGPh8T-N2kebvw_ce9NTAc4=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/845e16ce-08c5-11f0-a2cf-7e024f525d71.jpg"]'::jsonb,
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
  'PROD-02085',
  'NARUTO GOLD - 04 [REB5]',
  'NARUTO GOLD - 04 [REB5]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/ieFTakGxeX6vnMFBTHEcr3Ii5Xc=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/cc0617dc-63e4-11ef-aad4-727f596e106b.png"]'::jsonb,
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
  'PROD-02086',
  'NARUTO GOLD - 04 [REB6]',
  'NARUTO GOLD - 04 [REB6]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/A5kR__HZjG4jkjCO_j2vbsQgbl8=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/85bb27c8-08c5-11f0-be53-5e8a9da48498.jpg"]'::jsonb,
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
  'PROD-02087',
  'NARUTO GOLD - 05 [REB6]',
  'NARUTO GOLD - 05 [REB6]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/Y5QKZ_k2RKAbmo_wxHscBhqpnns=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/8658764a-08c5-11f0-8283-fac9a3e7e647.jpg"]'::jsonb,
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
  'PROD-02088',
  'NARUTO GOLD - 06 [REB6]',
  'NARUTO GOLD - 06 [REB6]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/MOkh2s3zVzJjCY0yC_3ESE6VMks=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/9ad15d26-1941-11f0-b283-1e5c1e943676.jpg"]'::jsonb,
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
  'PROD-02089',
  'NARUTO GOLD - 07 [REB5]',
  'NARUTO GOLD - 07 [REB5]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/2vFaaWZMYqfIAQzTweoTFY8uu0U=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/9abd877e-1941-11f0-89d0-967dab4f0af5.jpg"]'::jsonb,
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
  'PROD-02090',
  'NARUTO GOLD - 08 [REB5]',
  'NARUTO GOLD - 08 [REB5]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/Won1zuAOcbFAMcLMmbHnGrDh5yg=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/9ae44210-1941-11f0-857d-1a640e6f5312.jpg"]'::jsonb,
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
  'PROD-02091',
  'NARUTO GOLD - 09 [REB5]',
  'NARUTO GOLD - 09 [REB5]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/_l150KjX0Et6UQTThMCX3STwUIQ=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/9af3d978-1941-11f0-aa5f-0aa6513a3731.jpg"]'::jsonb,
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
  'PROD-02092',
  'NARUTO GOLD - 10 [REB5]',
  'NARUTO GOLD - 10 [REB5]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/4DIlq98KnqBwxg96TPZMCXWCJhE=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/9b1cf6aa-1941-11f0-857d-1a640e6f5312.jpg"]'::jsonb,
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
  'PROD-02093',
  'NARUTO GOLD - 12 [REB 7]',
  'NARUTO GOLD - 12 [REB 7]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/br8dkaxRDAJKJfB3AN2gxnF_aps=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/907600fc-3692-11f0-a057-ba7311aaaadc.jpg"]'::jsonb,
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
  'PROD-02094',
  'NARUTO GOLD - 15 [REB6]',
  'NARUTO GOLD - 15 [REB6]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/A4_gNm2Do0yzXmKnZDCTH-4_res=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/4a0c7372-8b5f-11f0-b876-cef4535c59b2.jpg"]'::jsonb,
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
  'PROD-02095',
  'NARUTO GOLD - 16 [REB4]',
  'NARUTO GOLD - 16 [REB4]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/HtfxRgyCaE60Gp2noTGDfYUN-vY=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/4a2e5050-8b5f-11f0-b3d9-165df9e621a1.jpg"]'::jsonb,
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
  'PROD-02096',
  'NARUTO GOLD - 17 [REB4]',
  'NARUTO GOLD - 17 [REB4]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/GmSPcMs_4LWPARsFAaJt023GQXQ=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/4a3ffd82-8b5f-11f0-b876-cef4535c59b2.jpg"]'::jsonb,
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
  'PROD-02097',
  'NARUTO GOLD - 18 [REB4]',
  'NARUTO GOLD - 18 [REB4]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/aEEonhzjyzxpUofacyR-IHM8NvE=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/4a4d38e4-8b5f-11f0-ab6e-7e1ab2cbb1e5.jpg"]'::jsonb,
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
  'PROD-02098',
  'NARUTO GOLD - 21 [REB4]',
  'NARUTO GOLD - 21 [REB4]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/jt1clUlri2W8QVNIxK3uF2Qqj58=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/2710b5fc-a4ac-11f0-a72e-eecb83d78201.jpg"]'::jsonb,
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
  'PROD-02099',
  'NARUTO GOLD - 22 [REB4]',
  'NARUTO GOLD - 22 [REB4]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/gzS0bk1wwQ66mbld-vouXzAmBjU=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/271c9944-a4ac-11f0-8687-a638114deac1.jpg"]'::jsonb,
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
  'PROD-02100',
  'NARUTO GOLD EDITION N.11',
  'NARUTO GOLD EDITION N.11',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/_RcDbSc1ZqVoq-mx3hN9RU22uyQ=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/85a2148e-4e7d-11ef-896f-5e025afe733a.jpg"]'::jsonb,
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