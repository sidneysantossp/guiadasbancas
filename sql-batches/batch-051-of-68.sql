-- SQL para importar produtos Brancaleone
-- Gerado em: 2025-10-17T17:52:46.765Z
-- Total de produtos: 3363
-- Fonte: brancaleone-products-1760723254011.json

-- 1. Criar distribuidor (se não existir)

-- Distribuidor já criado no batch-001

-- Lote 51 de 68
-- Produtos: 5001 até 5100



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02501',
  'QUARTETO FANTASTICO POR MARK MILLAR (MARVEL OMNIBUS)',
  'QUARTETO FANTASTICO POR MARK MILLAR (MARVEL OMNIBUS)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/ahaeaL9sndFkVRDbipVETo4Wc7o=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/02d6a080-d81a-11ee-a453-e2697ce33d53.jpg"]'::jsonb,
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
  'PROD-02502',
  'QUARTETO FANTASTICO VOL.11',
  'QUARTETO FANTASTICO VOL.11',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/PUIDXgFT4uEcZ95UJZCgWllfsDU=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/b1fdd868-d819-11ee-83df-e2e54ed5f9f7.jpg"]'::jsonb,
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
  'PROD-02503',
  'QUARTETO FANTASTICO: CICLOS',
  'QUARTETO FANTASTICO: CICLOS',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/Mm6ZMzWiaEaF15Zwz_EdV1pJOi0=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/027c6d9a-d81a-11ee-83df-e2e54ed5f9f7.jpg"]'::jsonb,
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
  'PROD-02504',
  'QUARTETO FANTASTICO: EDICAO DEFINITIVA VOL.01',
  'QUARTETO FANTASTICO: EDICAO DEFINITIVA VOL.01',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/QD42Czn2v8bIe4sstN-2eFpG0T4=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/d4b67fda-3f2f-11f0-87b4-c2502d24ff3f.jpg"]'::jsonb,
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
  'PROD-02505',
  'QUARTETO FANTASTICO: MOLECULAS INSTAVEIS N.1',
  'QUARTETO FANTASTICO: MOLECULAS INSTAVEIS N.1',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/YS0R1-vmBAJ5s4c8D0EVbQ7ex-c=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/89f0ca1c-4e7d-11ef-8063-de10c0ad3180.jpg"]'::jsonb,
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
  'PROD-02506',
  'QUARTETO FANTASTICO: PRIMEIROS PASSOS',
  'QUARTETO FANTASTICO: PRIMEIROS PASSOS',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/QEiSeqV08Bq2uiCltpN96afXrQ0=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/c771037a-642a-11f0-9174-0aba59c16e94.jpg"]'::jsonb,
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
  'PROD-02507',
  'QUARTO MUNDO POR JACK KIRBY VOL. 01 (EDICAO ABSOLUTA)',
  'QUARTO MUNDO POR JACK KIRBY VOL. 01 (EDICAO ABSOLUTA)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/3nB3pqaQBsNR1PrE2g3FqJS0m8s=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/8151c7f0-7fa9-11ef-b1d0-12caec0ea15c.jpg"]'::jsonb,
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
  'PROD-02508',
  'QUARTO MUNDO POR JACK KIRBY VOL. 02 (EDICAO ABSOLUTA)',
  'QUARTO MUNDO POR JACK KIRBY VOL. 02 (EDICAO ABSOLUTA)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/Y74_DgdMFg7nKHXC4V5Hq4UQNkw=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/1dc9f84c-69af-11f0-9a47-2e3660e82a7f.jpg"]'::jsonb,
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
  'PROD-02509',
  'QUESTAO POR DENNIS O''NEIL E DENYS COWAN VOL 1 (DC OMNIBUS)',
  'QUESTAO POR DENNIS O''NEIL E DENYS COWAN VOL 1 (DC OMNIBUS)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/75Bc3ZkudZxPO3d9WyY0_DiQw7k=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/42424aac-7fd1-11f0-a5af-de5e70a27ff7.jpg"]'::jsonb,
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
  'PROD-02510',
  'RADIANT - 01 [REB]',
  'RADIANT - 01 [REB]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/4zqX24BG6wQCQtrLdJa8Qw2eGmA=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/dc518a6e-3f2f-11f0-87b4-c2502d24ff3f.jpg"]'::jsonb,
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
  'PROD-02511',
  'RADIANT - 03 [REB]',
  'RADIANT - 03 [REB]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/hm7-4K0PS9MzR8C_7qWx7YNe8O0=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/3ba93296-7fd1-11f0-a5af-de5e70a27ff7.jpg"]'::jsonb,
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
  'PROD-02512',
  'RADIANT - 04 [REB]',
  'RADIANT - 04 [REB]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/rlH1-VxcbNehDScdMNGlp-lwgoE=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/3bb673c0-7fd1-11f0-b894-2e1dcafaddd0.jpg"]'::jsonb,
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
  'PROD-02513',
  'RADIANT - 16',
  'RADIANT - 16',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/zFP2fnHEzUpf1DOX9-gdYuAZ6sM=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/979bd552-d818-11ee-a11f-5a86bcbeb6e3.jpg"]'::jsonb,
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
  'PROD-02514',
  'RADIANT N.15',
  'RADIANT N.15',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/9Bjp-R-i0d1DPIpmvx9NbHbQ964=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/96a5af9c-d818-11ee-a1cf-e2e54ed5f9f7.jpg"]'::jsonb,
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
  'PROD-02515',
  'RAGNA CRIMSON - 07',
  'RAGNA CRIMSON - 07',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/LTDkA1IYoynT3g7y8sjZ6V_KTW4=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/02d3a638-eb4b-11ef-8230-fa812316df6c.jpg"]'::jsonb,
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
  'PROD-02516',
  'RAGNA CRIMSON - 08',
  'RAGNA CRIMSON - 08',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/StMffnCEmr6eC_zDLsAiOSlbWZ0=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/a82a2ff2-eb29-11ef-8b75-5ac0f052206d.jpg"]'::jsonb,
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
  'PROD-02517',
  'RAGNA CRIMSON - 09',
  'RAGNA CRIMSON - 09',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/wQq-ID1m8s90Fq4kUKlUewVZtOg=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/a84c4bf0-eb29-11ef-8fb2-6696cc3e9cb3.jpg"]'::jsonb,
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
  'PROD-02518',
  'RAGNA CRIMSON - 10',
  'RAGNA CRIMSON - 10',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/NdzcqXP7GxPXoTbNNArb65r318A=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/a858f486-eb29-11ef-913d-52f5d450f8a6.jpg"]'::jsonb,
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
  'PROD-02519',
  'RAGNA CRIMSON - 11',
  'RAGNA CRIMSON - 11',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/DYiwa5Dihl8_s9kXB4AUDkf8dwA=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/ce9268ce-f616-11ef-aa08-9af237dc8f86.jpg"]'::jsonb,
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
  'PROD-02520',
  'RAGNA CRIMSON - 12',
  'RAGNA CRIMSON - 12',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/uzNli1oEvxUf005rqF7nUmWOVeg=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/d0831280-0ea0-11f0-b796-52490362e15f.jpg"]'::jsonb,
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
  'PROD-02521',
  'RAGNA CRIMSON - 13',
  'RAGNA CRIMSON - 13',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/jEBX50QkewIvyDDZ98pLODUV5ZQ=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/5ad17340-2473-11f0-bce4-02956f46298b.jpg"]'::jsonb,
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
  'PROD-02522',
  'RAGNA CRIMSON - 14',
  'RAGNA CRIMSON - 14',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/anxbnxuvM6I6nfNvg-lKED4Oe5A=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/d4b0c0a4-3f2f-11f0-a17d-1ac4d5553c9e.jpg"]'::jsonb,
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
  'PROD-02523',
  'RAGNA CRIMSON N.1',
  'RAGNA CRIMSON N.1',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/5g8jI7ZZjsoVkTR9RKIMjUSCaAU=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/5335118a-fb7c-11ee-b9a7-42c387d0d3d3.jpg"]'::jsonb,
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
  'PROD-02524',
  'RAGNA CRIMSON N.2',
  'RAGNA CRIMSON N.2',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/Pko9uvAlv1SWJCnbkeRd_EzHHdU=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/225944fe-069a-11ef-a94b-3e276098a5a4.jpg"]'::jsonb,
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
  'PROD-02525',
  'RAGNA CRIMSON N.3',
  'RAGNA CRIMSON N.3',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/6oqs5j49EsuessgPxMlRI9ny0ZA=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/97d19300-2461-11ef-845e-aa6efae8e89c.jpg"]'::jsonb,
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
  'PROD-02526',
  'RAGNA CRIMSON N.4',
  'RAGNA CRIMSON N.4',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/ltMWuV-q69V6LNDfsgtbCebA7Kk=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/8ca6d67a-4e7d-11ef-aed3-3a86ab418552.jpg"]'::jsonb,
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
  'PROD-02527',
  'RAGNA CRIMSON N.5',
  'RAGNA CRIMSON N.5',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/iSe8A3bBxbYnuxU7Cbi1LIfOjgY=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/88a62a50-7fa9-11ef-b1d0-12caec0ea15c.jpg"]'::jsonb,
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
  'PROD-02528',
  'RAGNA CRIMSON N.6',
  'RAGNA CRIMSON N.6',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/jaTvWH5OjC_Yi0tmFyAs0iAQuJI=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/88acf358-7fa9-11ef-b0bc-6e97175de7f7.jpg"]'::jsonb,
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
  'PROD-02529',
  'RE CERVIN -.01',
  'RE CERVIN -.01',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/pJOVISOos9CfssJZVQ7LlmHaSxI=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/206d7b00-48b7-11f0-955a-6e14298b474f.jpg"]'::jsonb,
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
  'PROD-02530',
  'RE: ZERO CAPITULO 4 - 05',
  'RE: ZERO CAPITULO 4 - 05',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/ziTve-4hllmzsOqEUCPnHG9CXd4=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/0e5cf328-d81a-11ee-83df-e2e54ed5f9f7.jpg"]'::jsonb,
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
  'PROD-02531',
  'RE: ZERO CAPITULO 4 - 06',
  'RE: ZERO CAPITULO 4 - 06',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/_MihmNDFy1PSbd0s958tlyfLh4I=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/0ecc0bfa-d81a-11ee-a453-e2697ce33d53.jpg"]'::jsonb,
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
  'PROD-02532',
  'RE: ZERO CAPITULO 4 - 07',
  'RE: ZERO CAPITULO 4 - 07',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/UZdIp0Q8bs8x_h8QlTatKf3SIfk=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/0f149bd6-d81a-11ee-83df-e2e54ed5f9f7.jpg"]'::jsonb,
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
  'PROD-02533',
  'RE: ZERO CAPITULO 4 - 08',
  'RE: ZERO CAPITULO 4 - 08',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/0ljZMzM9YO0aKGmX8GUTpScjjI0=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/680b9464-f111-11ee-8a58-32e5278604dc.jpg"]'::jsonb,
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
  'PROD-02534',
  'RE: ZERO CAPITULO 4 - 09',
  'RE: ZERO CAPITULO 4 - 09',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/bVFBLGeZiaWIWPBhli4iP4K7Db8=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/a886224e-eb29-11ef-b1d3-def782e2bf12.jpg"]'::jsonb,
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
  'PROD-02535',
  'RE: ZERO CAPITULO 4 - 10',
  'RE: ZERO CAPITULO 4 - 10',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/uEqhf-yetny3RJ_NwHypHwkAU74=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/9177d0f2-3692-11f0-b6e7-d6897a03fa64.jpg"]'::jsonb,
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
  'PROD-02536',
  'RED PALACE',
  'RED PALACE',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/LCFza1yKxW10D7y5ivtunQHG2SQ=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/239093ca-6f3c-11f0-a0bf-1abfc156ef81.jpg"]'::jsonb,
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
  'PROD-02537',
  'REGIEN MAX 131 (MOB PSYCHO) N.1',
  'REGIEN MAX 131 (MOB PSYCHO) N.1',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/ngpks2CIZOOd0YYs0ZylpcCNHxU=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/cf46556a-63e4-11ef-807c-4e837066fdd4.png"]'::jsonb,
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
  'PROD-02538',
  'REI SPAWN VOL.01',
  'REI SPAWN VOL.01',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/tCXpmIecVpLtAkuMxR7CHwXoOh0=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/a879760c-eb29-11ef-913d-52f5d450f8a6.jpg"]'::jsonb,
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
  'PROD-02539',
  'REI SPAWN VOL.02',
  'REI SPAWN VOL.02',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/PDu7w37QbrcYVjzPwY0OPhEAhew=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/62ae7bd8-5ea9-11f0-bc5c-8a0b5d172c0d.jpg"]'::jsonb,
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
  'PROD-02540',
  'REINO DO AMANHA (DC DE BOLSO) (REB)',
  'REINO DO AMANHA (DC DE BOLSO) (REB)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/B86fqUQ-2lmj66S0Arpk93ukVbw=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/96fdae2a-1941-11f0-841e-32c81c05dd9b.jpg"]'::jsonb,
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
  'PROD-02541',
  'RICK GRIMES 2000 N.1',
  'RICK GRIMES 2000 N.1',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/7zErnYRbS0MeK88QNnncH1KIytA=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/263efb16-2ce4-11ef-a8b4-5a1a0672c527.jpg"]'::jsonb,
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
  'PROD-02542',
  'ROBIN: FILHO DO BATMAN POR PATRICK GLEASON',
  'ROBIN: FILHO DO BATMAN POR PATRICK GLEASON',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/EzeQRQNUsuTWQF1wskBN_ox0ejg=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/5affae4a-2473-11f0-b202-e6e875f51541.jpg"]'::jsonb,
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
  'PROD-02543',
  'ROBIN: O MENINO-PRODIGIO',
  'ROBIN: O MENINO-PRODIGIO',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/QL3lfCqVasMsBETKtFC2vVUAuF8=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/416d7ffc-7fd1-11f0-b894-2e1dcafaddd0.jpg"]'::jsonb,
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
  'PROD-02544',
  'ROCKY E GROOT: A BUSCA PELO SENHOR DAS ESTRELAS',
  'ROCKY E GROOT: A BUSCA PELO SENHOR DAS ESTRELAS',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/gkSN_QtQF96Y1n3LPq89b7dKILs=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/14807cce-d89d-11ee-ada8-be3c8dbb0cbf.jpg"]'::jsonb,
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
  'PROD-02545',
  'ROOSTER FIGHTER - O GALO LUTADOR - 02',
  'ROOSTER FIGHTER - O GALO LUTADOR - 02',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/3A4BCHVvumijzlLdaq67swcmU1w=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/97f72a3e-2461-11ef-845e-aa6efae8e89c.jpg"]'::jsonb,
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
  'PROD-02546',
  'ROOSTER FIGHTER - O GALO LUTADOR - 06',
  'ROOSTER FIGHTER - O GALO LUTADOR - 06',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/WOI2sEjP5PfnwEQxLX_zPo3CThE=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/3087d5e2-ebef-11ee-963f-1e73add0c60b.jpg"]'::jsonb,
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
  'PROD-02547',
  'ROOSTER FIGHTER - O GALO LUTADOR - 07',
  'ROOSTER FIGHTER - O GALO LUTADOR - 07',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/ksrljvkXKTY3Oo7lMhjX-9z5lu4=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/88c2ef82-7fa9-11ef-b1d0-12caec0ea15c.jpg"]'::jsonb,
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
  'PROD-02548',
  'ROOSTER FIGHTER - O GALO LUTADOR - 08',
  'ROOSTER FIGHTER - O GALO LUTADOR - 08',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/QoDx9DVdIahWZgKB7eJHkJVMbHM=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/996e6590-08c6-11f0-b869-1ee56e5e8e6d.jpg"]'::jsonb,
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
  'PROD-02549',
  'RUA PERIGO N.1',
  'RUA PERIGO N.1',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/J-W-Ga8y048rUMbDsRZ_PFbZUfw=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/cf5ee550-d8a0-11ee-98e4-5a86bcbeb6e3.jpg"]'::jsonb,
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
  'PROD-02550',
  'RUA PERIGO N.2',
  'RUA PERIGO N.2',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/jizaCh6N3sp8L2hN8o2nJwY2nh0=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/492436c2-e497-11ee-b6a7-e2b250ff01a0.jpg"]'::jsonb,
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