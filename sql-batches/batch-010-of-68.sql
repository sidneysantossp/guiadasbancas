-- SQL para importar produtos Brancaleone
-- Gerado em: 2025-10-17T17:52:46.765Z
-- Total de produtos: 3363
-- Fonte: brancaleone-products-1760723254011.json

-- 1. Criar distribuidor (se não existir)

-- Distribuidor já criado no batch-001

-- Lote 10 de 68
-- Produtos: 901 até 1000



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00451',
  'BATMAN E CORINGA: DUPLA LETAL VOL.03 (DE 3)',
  'BATMAN E CORINGA: DUPLA LETAL VOL.03 (DE 3)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/vrYQTQmcVTA6Coe4IW4SEp89hd4=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/bb17e1ca-0125-11ef-9d9d-e2f1d4f1a152.jpg"]'::jsonb,
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
  'PROD-00452',
  'BATMAN E OS HOMENS-MONSTRO N.1',
  'BATMAN E OS HOMENS-MONSTRO N.1',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/vKwW32bmttTmjHLCW7bN5oFhvdA=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/f674cfde-2930-11ef-8a49-928f61c71625.jpg"]'::jsonb,
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
  'PROD-00453',
  'BATMAN E SUPERMAN: OS MELHORES DO MUNDO - ERA DE PRATA VOL.2',
  'BATMAN E SUPERMAN: OS MELHORES DO MUNDO - ERA DE PRATA VOL.2',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/yOGx0BmPjI0q6T05gdBYA3joWGg=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/966a5d58-d817-11ee-b124-5a86bcbeb6e3.jpg"]'::jsonb,
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
  'PROD-00454',
  'BATMAN E SUPERMAN: OS MELHORES DO MUNDO - ERA DE PRATA VOL.3',
  'BATMAN E SUPERMAN: OS MELHORES DO MUNDO - ERA DE PRATA VOL.3',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/jZ8hbc0mJFrK5p8NJWYnuBVUu6A=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/96e78a6c-d817-11ee-9371-e2a33adec5cd.jpg"]'::jsonb,
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
  'PROD-00455',
  'BATMAN ESPECIAL (2020) N.01/14 - BATMAN E ROBIN',
  'BATMAN ESPECIAL (2020) N.01/14 - BATMAN E ROBIN',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/0A6QZTZHBFsqGsX0Wx73SMJeHdw=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/75360678-4e7d-11ef-9e73-0a4d9a837559.jpg"]'::jsonb,
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
  'PROD-00456',
  'BATMAN ESPECIAL (2020) N.02/15 - BATMAN E ROBIN',
  'BATMAN ESPECIAL (2020) N.02/15 - BATMAN E ROBIN',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/KkwdliP5OFP2ltUDtmlsQ8PbDaI=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/91135604-eb29-11ef-913d-52f5d450f8a6.jpg"]'::jsonb,
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
  'PROD-00457',
  'BATMAN ESPECIAL (2020) N.03/16 - BATMAN E ROBIN',
  'BATMAN ESPECIAL (2020) N.03/16 - BATMAN E ROBIN',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/IBf3jGNDB369qr209bP5wnXbr-M=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/541375a0-8b5f-11f0-ab6e-7e1ab2cbb1e5.jpg"]'::jsonb,
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
  'PROD-00458',
  'BATMAN ESPECIAL (2020) N.11 - EU SOU BATMAN',
  'BATMAN ESPECIAL (2020) N.11 - EU SOU BATMAN',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/2DI96JfEQRxpcv95413G9TgrBO0=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/ca1e731a-d816-11ee-a833-6efcfa6dd7bd.jpg"]'::jsonb,
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
  'PROD-00459',
  'BATMAN ESPECIAL (2020) N.12 -  EU SOU O BATMAN',
  'BATMAN ESPECIAL (2020) N.12 -  EU SOU O BATMAN',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/YbqJev_CjhE5HKedhZOIZfe7Ynw=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/ca53a2f6-d816-11ee-b54b-e2697ce33d53.jpg"]'::jsonb,
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
  'PROD-00460',
  'BATMAN ESPECIAL (2020) N.13 -  EU SOU O BATMAN',
  'BATMAN ESPECIAL (2020) N.13 -  EU SOU O BATMAN',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/RjqjSIAFU8Ys68LQvivst3LkX-Y=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/cae32822-d816-11ee-9ac4-da2373bc7c0b.jpg"]'::jsonb,
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
  'PROD-00461',
  'BATMAN MAGAZINE N.1',
  'BATMAN MAGAZINE N.1',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/kl0ax4uCFMNBj7V6RHvxo2RgfNc=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/bd961ba2-d816-11ee-a1d7-e2a33adec5cd.jpg"]'::jsonb,
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
  'PROD-00462',
  'BATMAN POR NEAL ADAMS VOL. 01 (EDICAO ABSOLUTA)',
  'BATMAN POR NEAL ADAMS VOL. 01 (EDICAO ABSOLUTA)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/tQjshGwEjVu1ghbBxEA0_s8yt90=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/d458cbec-119a-11ef-bfb2-36a257064742.jpg"]'::jsonb,
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
  'PROD-00463',
  'BATMAN POR PAUL DINI (DC OMNIBUS)',
  'BATMAN POR PAUL DINI (DC OMNIBUS)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/1s4Nl1GsqSHNYu5Fp9Rjk6L29nE=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/97cec7c6-1941-11f0-a130-225e61b3373a.jpg"]'::jsonb,
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
  'PROD-00464',
  'BATMAN POR TOM KING N.10',
  'BATMAN POR TOM KING N.10',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/kfGqf-ZJg9mCTvJQ3PFX9CJIFyE=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/7f7575c6-7fa9-11ef-b0bc-6e97175de7f7.jpg"]'::jsonb,
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
  'PROD-00465',
  'BATMAN POR TOM KING N.8',
  'BATMAN POR TOM KING N.8',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/KZKRzGPVgEEsR5d44YlQQFN_J-g=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/481c6f2e-d817-11ee-b124-5a86bcbeb6e3.jpg"]'::jsonb,
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
  'PROD-00466',
  'BATMAN POR TOM KING VOL.11',
  'BATMAN POR TOM KING VOL.11',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/eQqmYhYIvJI9V_ZOcdwVOEwa-Q4=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/8e45277c-3692-11f0-9b5f-32c7a3eebbfc.jpg"]'::jsonb,
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
  'PROD-00467',
  'BATMAN POR TOM KING VOL.9',
  'BATMAN POR TOM KING VOL.9',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/QPBvQzPDs7Bu1LZHYXPTEDfOld8=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/57b3ab10-0cc8-11ef-a93f-8e4a61da3cfa.jpg"]'::jsonb,
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
  'PROD-00468',
  'BATMAN VS. ROBIN VOL.05',
  'BATMAN VS. ROBIN VOL.05',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/RZ-0cvQYziDFvCtafkOxdB4WPy0=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/260b1278-ebef-11ee-963f-1e73add0c60b.jpg"]'::jsonb,
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
  'PROD-00469',
  'BATMAN/DREDD (DC VINTAGE)',
  'BATMAN/DREDD (DC VINTAGE)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/q0KuKd4z7BeucFF73O2O_lA2iiE=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/c6a552e0-eb47-11ef-80c6-0ee70347c223.jpg"]'::jsonb,
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
  'PROD-00470',
  'BATMAN/SPAWN [REB]',
  'BATMAN/SPAWN [REB]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/YSNrQ_WwdBH3NW_bqnVbftgcsp8=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/2502c57a-6f3c-11f0-b703-524c1decb601.jpg"]'::jsonb,
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
  'PROD-00471',
  'BATMAN/SPAWN: A COLECAO CLASSICA [REB]',
  'BATMAN/SPAWN: A COLECAO CLASSICA [REB]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/8UcxsxlPpLxkzHHW26Ia5K0opHM=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/24efc4b6-6f3c-11f0-a26d-9a5fb41f8b80.jpg"]'::jsonb,
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
  'PROD-00472',
  'BATMAN/SUPERMAN: OS MELHORES DO MUNDO VOL.12',
  'BATMAN/SUPERMAN: OS MELHORES DO MUNDO VOL.12',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/7vaimVxkfRQAPvh-aDhj5TMJdZs=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/c6512052-d816-11ee-a1d7-e2a33adec5cd.jpg"]'::jsonb,
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
  'PROD-00473',
  'BATMAN/SUPERMAN: OS MELHORES DO MUNDO VOL.13',
  'BATMAN/SUPERMAN: OS MELHORES DO MUNDO VOL.13',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/kp3h0yKylB5wevcmLVZxJ1RhmWg=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/c6ab5bf8-d816-11ee-a833-6efcfa6dd7bd.jpg"]'::jsonb,
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
  'PROD-00474',
  'BATMAN/SUPERMAN: OS MELHORES DO MUNDO VOL.17',
  'BATMAN/SUPERMAN: OS MELHORES DO MUNDO VOL.17',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/Q_EeJORmaZA_8b9ADzrsMrYdML4=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/445b7e10-fb7c-11ee-aefc-d26f22c1492c.jpg"]'::jsonb,
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
  'PROD-00475',
  'BATMAN/SUPERMAN: OS MELHORES DO MUNDO VOL.18',
  'BATMAN/SUPERMAN: OS MELHORES DO MUNDO VOL.18',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/hwmN15xLpaT8WIH-0a6ewe-SGsQ=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/489856ca-1705-11ef-aada-fab3bf54036d.jpg"]'::jsonb,
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
  'PROD-00476',
  'BATMAN/SUPERMAN: OS MELHORES DO MUNDO VOL.22',
  'BATMAN/SUPERMAN: OS MELHORES DO MUNDO VOL.22',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/zbelRoVgYATq7MV2LMvJc5g33oE=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/7d642336-7fa9-11ef-b0bc-6e97175de7f7.jpg"]'::jsonb,
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
  'PROD-00477',
  'BATMAN/SUPERMAN: OS MELHORES DO MUNDO VOL.24',
  'BATMAN/SUPERMAN: OS MELHORES DO MUNDO VOL.24',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/H1RSZsnTDKTN0hKKdy49rrRJd7g=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/90aba0d6-eb29-11ef-89a1-ce85303a26c9.jpg"]'::jsonb,
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
  'PROD-00478',
  'BATMAN/SUPERMAN: OS MELHORES DO MUNDO VOL.25',
  'BATMAN/SUPERMAN: OS MELHORES DO MUNDO VOL.25',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/smke-kOqOhIT0DBn1CjmLT8Vi1I=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/90e9c46a-eb29-11ef-8b75-5ac0f052206d.jpg"]'::jsonb,
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
  'PROD-00479',
  'BATMAN/SUPERMAN: OS MELHORES DO MUNDO VOL.26',
  'BATMAN/SUPERMAN: OS MELHORES DO MUNDO VOL.26',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/TMCd7N-Hc7shx8S2BFIL5-sVhKY=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/910244f4-eb29-11ef-8d7f-eea3b61904a2.jpg"]'::jsonb,
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
  'PROD-00480',
  'BATMAN/SUPERMAN: OS MELHORES DO MUNDO VOL.27',
  'BATMAN/SUPERMAN: OS MELHORES DO MUNDO VOL.27',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/9SynoBJwl4UOYykHJsuI8rCtydk=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/acfd78ba-ee29-11ef-bae9-4ad799f2e8c9.jpg"]'::jsonb,
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
  'PROD-00481',
  'BATMAN/SUPERMAN: OS MELHORES DO MUNDO VOL.28',
  'BATMAN/SUPERMAN: OS MELHORES DO MUNDO VOL.28',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/1UT2kqVHIDVSeWHySnrP2ONeTek=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/d1c74206-0ea0-11f0-92cd-7a93fae60ab5.jpg"]'::jsonb,
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
  'PROD-00482',
  'BATMAN/SUPERMAN: OS MELHORES DO MUNDO VOL.29',
  'BATMAN/SUPERMAN: OS MELHORES DO MUNDO VOL.29',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/jVt3rCgpoV72UUywsjxmW5_sao0=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/3cd61222-2475-11f0-a61e-b6791219cd2e.jpg"]'::jsonb,
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
  'PROD-00483',
  'BATMAN/SUPERMAN: OS MELHORES DO MUNDO VOL.30',
  'BATMAN/SUPERMAN: OS MELHORES DO MUNDO VOL.30',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/X2TzP6p_PeEkxrNLqEOxjkKf2d8=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/2e5cb5a2-44b4-11f0-a1ec-1a73b65bfa37.jpg"]'::jsonb,
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
  'PROD-00484',
  'BATMAN/SUPERMAN: OS MELHORES DO MUNDO VOL.31',
  'BATMAN/SUPERMAN: OS MELHORES DO MUNDO VOL.31',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/24PEyOqq3XZrGW9ug5-vdWvAlfI=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/30d59b78-5ea9-11f0-b8ff-8a0b5d172c0d.jpg"]'::jsonb,
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
  'PROD-00485',
  'BATMAN/SUPERMAN: OS MELHORES DO MUNDO VOL.32',
  'BATMAN/SUPERMAN: OS MELHORES DO MUNDO VOL.32',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/xFppgtYJOQKzzSN3SmzpSwuor88=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/45b05bde-7fd1-11f0-b894-2e1dcafaddd0.jpg"]'::jsonb,
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
  'PROD-00486',
  'BATMAN/SUPERMAN: OS MELHORES DO MUNDO VOL.32 - CAPA VARIANTE',
  'BATMAN/SUPERMAN: OS MELHORES DO MUNDO VOL.32 - CAPA VARIANTE',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/HiH8MaA9nUTPQ1W0RyC8Q0l1Be0=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/31159720-7fd1-11f0-a5af-de5e70a27ff7.jpg"]'::jsonb,
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
  'PROD-00487',
  'BATMAN/SUPERMAN: OS MELHORES DO MUNDO VOL.33',
  'BATMAN/SUPERMAN: OS MELHORES DO MUNDO VOL.33',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/d6uSyLA2UPzIZqZh7ptH6pra1vM=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/53f70208-8b5f-11f0-b3d9-165df9e621a1.jpg"]'::jsonb,
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
  'PROD-00488',
  'BATMAN/SUPERMAN: OS MELHORES DO MUNDO VOL.34',
  'BATMAN/SUPERMAN: OS MELHORES DO MUNDO VOL.34',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/b6XqhHaoSRroF-9PW5AG1SDgJRQ=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/1fd3b9ba-a4ac-11f0-9bb5-ee8f90996b43.jpg"]'::jsonb,
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
  'PROD-00489',
  'BATMAN/SUPERMAN: OS MELHORES DO MUNDO VOL.7',
  'BATMAN/SUPERMAN: OS MELHORES DO MUNDO VOL.7',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/XUXsuw6hBEFG2FMHLV-KI0CqNkA=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/c49765f0-d816-11ee-9ac4-da2373bc7c0b.jpg"]'::jsonb,
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
  'PROD-00490',
  'BATMAN: A CRIANCA DOS SONHOS (DC MANGA)',
  'BATMAN: A CRIANCA DOS SONHOS (DC MANGA)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/IdnCh-u1Z7oOu1mW7mRPDZ_kNag=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/6d51f2b0-da7d-11ee-9fe4-12792fd81a45.jpg"]'::jsonb,
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
  'PROD-00491',
  'BATMAN: A GARGULA DE GOTHAM VOL. 03 (DE 04)',
  'BATMAN: A GARGULA DE GOTHAM VOL. 03 (DE 04)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/LqGLZjoe69TeYu8guztZBYSlzQY=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/4735fc54-8b5f-11f0-ab6e-7e1ab2cbb1e5.jpg"]'::jsonb,
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
  'PROD-00492',
  'BATMAN: A MASCARA DA MORTE N.1',
  'BATMAN: A MASCARA DA MORTE N.1',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/-_kE40JB01kiFYng8qi7atz8_XU=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/68b5b3d0-da9c-11ee-b415-da2490dbf0ff.jpg"]'::jsonb,
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
  'PROD-00493',
  'BATMAN: A SERIE ANIMADA  N.1',
  'BATMAN: A SERIE ANIMADA  N.1',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/3XWYaqdwhEI-6GNcpMZoTIBMDXE=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/2ff74824-e497-11ee-83ff-7ee42cfe9644.jpg"]'::jsonb,
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
  'PROD-00494',
  'BATMAN: A SERIE ANIMADA  N.2',
  'BATMAN: A SERIE ANIMADA  N.2',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/Y-93Ydo5S0hXNdCeK3f6UhvKxCw=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/7d4d12a4-7fa9-11ef-b1d0-12caec0ea15c.jpg"]'::jsonb,
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
  'PROD-00495',
  'BATMAN: A SERIE ANIMADA VOL.01 - ORIGENS',
  'BATMAN: A SERIE ANIMADA VOL.01 - ORIGENS',
  0.00,
  '["https://d1y59j9xdhixp0.cloudfront.net/2dede6cdcecb2ad9d5102618f5d141cd35e28c9a/images/dc6d5f0bf4b929fa80b9.svg"]'::jsonb,
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
  'PROD-00496',
  'BATMAN: A SERIE ANIMADA VOL.03',
  'BATMAN: A SERIE ANIMADA VOL.03',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/HNQBsW6n9vIPn3ysHnablASNS8E=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/9f3e349c-1941-11f0-8247-9a85c6d131e4.jpg"]'::jsonb,
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
  'PROD-00497',
  'BATMAN: ACOSSADO (REB)',
  'BATMAN: ACOSSADO (REB)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/Q23KlEtV3Iy7dNL8yucMJ3Lj6vM=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/912c1b4e-eb29-11ef-9927-fa812316df6c.jpg"]'::jsonb,
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
  'PROD-00498',
  'BATMAN: ALEM DO PONTO DE IGNICAO VOL.2',
  'BATMAN: ALEM DO PONTO DE IGNICAO VOL.2',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/MXXsHWW9N8uGhQW2ipnZ5IswBnQ=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/9d599c00-d817-11ee-9a1e-da2373bc7c0b.jpg"]'::jsonb,
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
  'PROD-00499',
  'BATMAN: ALEM DO PONTO DE IGNICAO VOL.3',
  'BATMAN: ALEM DO PONTO DE IGNICAO VOL.3',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/4riiARyEUwQJQSZG9_B7OdyE13Y=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/9db75ab6-d817-11ee-b124-5a86bcbeb6e3.jpg"]'::jsonb,
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
  'PROD-00500',
  'BATMAN: ALEM DO UNIVERSO',
  'BATMAN: ALEM DO UNIVERSO',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/xp7FeHs62LNUAfUUowU8mLO6LEI=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/3d409110-2475-11f0-8d00-e6e875f51541.jpg"]'::jsonb,
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