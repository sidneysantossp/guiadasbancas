-- SQL para importar produtos Brancaleone
-- Gerado em: 2025-10-17T18:20:53.612Z
-- Total de produtos: 3363
-- Fonte: brancaleone-products-1760723254011.json

-- 1. Criar distribuidor (se não existir)

-- Distribuidor já criado no batch-001

-- Lote 24 de 68
-- Produtos: 2301 até 2400



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01151',
  'ENVELOPE C/ 6 CARDS STUMBLE GUYS TC',
  'ENVELOPE C/ 6 CARDS STUMBLE GUYS TC',
  0.00,
  '["https://d1y59j9xdhixp0.cloudfront.net/2dede6cdcecb2ad9d5102618f5d141cd35e28c9a/images/dc6d5f0bf4b929fa80b9.svg"]'::jsonb,
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
  'PROD-01152',
  'ENVELOPE C/ 6 CARDS STUMBLE GUYS TC 2 CAIXINHA 24',
  'ENVELOPE C/ 6 CARDS STUMBLE GUYS TC 2 CAIXINHA 24',
  0.00,
  '["https://d1y59j9xdhixp0.cloudfront.net/2dede6cdcecb2ad9d5102618f5d141cd35e28c9a/images/dc6d5f0bf4b929fa80b9.svg"]'::jsonb,
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
  'PROD-01153',
  'ENVELOPE FLOWPACK 8 CARDS SUPER MARIO',
  'ENVELOPE FLOWPACK 8 CARDS SUPER MARIO',
  0.00,
  '["https://d1y59j9xdhixp0.cloudfront.net/2dede6cdcecb2ad9d5102618f5d141cd35e28c9a/images/dc6d5f0bf4b929fa80b9.svg"]'::jsonb,
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
  'PROD-01154',
  'ERROS DIVINOS - 01',
  'ERROS DIVINOS - 01',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/ZueQs6F-0qFfgMk70x_rhK3QJFU=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/3e6259da-e497-11ee-83ff-7ee42cfe9644.jpg"]'::jsonb,
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
  'PROD-01155',
  'ERROS DIVINOS - 02',
  'ERROS DIVINOS - 02',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/Wb0HO5VEpe4aVBCTCXZMI9gUxHc=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/bd5b799c-0125-11ef-9900-52ec7c1eeb4f.jpg"]'::jsonb,
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
  'PROD-01156',
  'ERROS DIVINOS - 03',
  'ERROS DIVINOS - 03',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/PX3yfT59Nvdk2SRqe6qQBwAc2-Q=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/7d22b098-4e7d-11ef-ad76-364e4b45dfa1.jpg"]'::jsonb,
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
  'PROD-01157',
  'ERROS DIVINOS - 04',
  'ERROS DIVINOS - 04',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/jM7XFKWNU0daIjoyqXUO9Ik2tIc=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/813171b2-7fa9-11ef-b1d0-12caec0ea15c.jpg"]'::jsonb,
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
  'PROD-01158',
  'ESQUADRAO SUICIDA VOL.04: CONSPIRACAO JANUS (DC VINTAGE)',
  'ESQUADRAO SUICIDA VOL.04: CONSPIRACAO JANUS (DC VINTAGE)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/JbwZ1vGSYqz2-Z-c4zUxgjD2R3Q=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/98d4b78e-eb29-11ef-8b75-5ac0f052206d.jpg"]'::jsonb,
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
  'PROD-01159',
  'ESQUADRAO SUICIDA VOL.05: APOKOLIPS NOW (DC VINTAGE)',
  'ESQUADRAO SUICIDA VOL.05: APOKOLIPS NOW (DC VINTAGE)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/avuP2_72v-cJnKmBWMYdq_wNBsw=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/14609b04-2791-11f0-b86b-f6e5aee4fef4.jpg"]'::jsonb,
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
  'PROD-01160',
  'ESQUADRAO SUICIDA: CHAMA N.1',
  'ESQUADRAO SUICIDA: CHAMA N.1',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/6kTygbIVm-VNRvAR9iNLSRmIqrU=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/94324e92-2461-11ef-a07c-c63aa4de974e.jpg"]'::jsonb,
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
  'PROD-01161',
  'ESQUADRAO SUICIDA: DESTROI O ASILO ARKHAM',
  'ESQUADRAO SUICIDA: DESTROI O ASILO ARKHAM',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/xdktEw5D_GnNPRs2ogkUBLcYmfs=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/da43013c-eb4a-11ef-8230-fa812316df6c.jpg"]'::jsonb,
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
  'PROD-01162',
  'ESQUADRAO SUICIDA: TIME DOS SONHOS - PROLOGO PARA O PODER AB',
  'ESQUADRAO SUICIDA: TIME DOS SONHOS - PROLOGO PARA O PODER AB',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/oytJBDXMEjcLsxh0Oo231IHDzhE=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/fefcd57a-feb9-11ef-bc0a-5e7da1f62926.jpg"]'::jsonb,
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
  'PROD-01163',
  'ETRIGAN, O DEMONIO POR GARTH ENNIS - EDICAO DE LUX N.2',
  'ETRIGAN, O DEMONIO POR GARTH ENNIS - EDICAO DE LUX N.2',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/MaH_QRuofGYZqgJTlxQ4PfZfnl0=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/781cdfa6-4e7d-11ef-8594-6e8213fe308c.jpg"]'::jsonb,
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
  'PROD-01164',
  'ETRIGAN, O DEMONIO POR GARTH ENNIS - EDICAO DE LUXO VOL.01',
  'ETRIGAN, O DEMONIO POR GARTH ENNIS - EDICAO DE LUXO VOL.01',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/NQ45Yo_l2aZY6sfc5f6S4Cu_CVs=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/7c2b5640-d817-11ee-9a1e-da2373bc7c0b.jpg"]'::jsonb,
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
  'PROD-01165',
  'FÁBULAS EDIÇÃO DE LUXO N.13',
  'FÁBULAS EDIÇÃO DE LUXO N.13',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/QP6N7HzOIjqdbxG-jxCSAT9ZP8I=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/2d9d9640-d818-11ee-82a8-e2697ce33d53.jpg"]'::jsonb,
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
  'PROD-01166',
  'FÁBULAS EDIÇÃO DE LUXO N.14',
  'FÁBULAS EDIÇÃO DE LUXO N.14',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/FG9Bg5Urw2yENwunR0ag1_XL0bc=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/f6dcb8ec-2930-11ef-8a49-928f61c71625.jpg"]'::jsonb,
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
  'PROD-01167',
  'FÁBULAS EDIÇÃO DE LUXO VOL. 01 (REB)',
  'FÁBULAS EDIÇÃO DE LUXO VOL. 01 (REB)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/4tkMtPgh91KJK_6-STVSiT1BHPY=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/af4463ea-ee29-11ef-8407-02478a88c6f1.jpg"]'::jsonb,
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
  'PROD-01168',
  'FÁBULAS EDIÇÃO DE LUXO VOL.12',
  'FÁBULAS EDIÇÃO DE LUXO VOL.12',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/0Puwwtc0QmEMQPmbInIjmQq7dVw=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/2d86b952-d818-11ee-86d3-ce469b473a25.jpg"]'::jsonb,
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
  'PROD-01169',
  'FÁBULAS EDIÇÃO DE LUXO VOL.15',
  'FÁBULAS EDIÇÃO DE LUXO VOL.15',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/Hv0E0OM_1l0GZhVuTzGP4aV7XaY=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/9bc231b0-eb29-11ef-a4f3-5a40d84dae09.jpg"]'::jsonb,
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
  'PROD-01170',
  'FÁBULAS EDIÇÃO DE LUXO VOL.16',
  'FÁBULAS EDIÇÃO DE LUXO VOL.16',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/SSxY7UuTkb_5JVfYBnyjsHQAl2M=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/1bea990a-48b7-11f0-9d89-9eda44bc3e04.jpg"]'::jsonb,
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
  'PROD-01171',
  'FÁBULAS EDICAO DE LUXO VOL.2 (REB)',
  'FÁBULAS EDICAO DE LUXO VOL.2 (REB)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/O4qUMOXuuqNlXCIjyUkYws_KoiA=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/2bf7bc80-d818-11ee-86d3-ce469b473a25.jpg"]'::jsonb,
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
  'PROD-01172',
  'FEITICEIRA ESCARLATE (2024) VOL.02',
  'FEITICEIRA ESCARLATE (2024) VOL.02',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/45JNxzcBTZEZicdEUDpFjKcuip8=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/96fb673c-eb29-11ef-9e36-2a856f41baa0.jpg"]'::jsonb,
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
  'PROD-01173',
  'FEITICEIRA ESCARLATE E MERCURIO',
  'FEITICEIRA ESCARLATE E MERCURIO',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/vUFsCBaUmMy0odT_5Dcpxci1rJU=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/c53a7168-642a-11f0-855d-8e3a9156bfaa.jpg"]'::jsonb,
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
  'PROD-01174',
  'FIRE FORCE N.2',
  'FIRE FORCE N.2',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/y4n5OqDrletREtvA6pLLNJRE6gs=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/83e99144-4e7d-11ef-8179-b2d60c13b884.jpg"]'::jsonb,
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
  'PROD-01175',
  'FIRE FORCE N.3',
  'FIRE FORCE N.3',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/-x_KXG__AtJcItasELvb-Kc-mVY=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/840deb16-4e7d-11ef-b6ff-da43772e5616.jpg"]'::jsonb,
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
  'PROD-01176',
  'FLASH (2023) N.05',
  'FLASH (2023) N.05',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/vae_7IXO39qRXcSpY_d6rk2tV-o=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/9bdce850-d817-11ee-86d3-ce469b473a25.jpg"]'::jsonb,
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
  'PROD-01177',
  'FLASH (2023) N.7',
  'FLASH (2023) N.7',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/xLYUmcFhhaSip76ClmvjaJevjYM=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/9c77c83e-d817-11ee-bce8-e2e54ed5f9f7.jpg"]'::jsonb,
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
  'PROD-01178',
  'FLASH ESPECIAL',
  'FLASH ESPECIAL',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/92qO5rxp3tuz8IbDB9EWgOJpU_E=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/2c9e85fa-de36-11ee-b2b6-3e63d4f4f6bf.jpg"]'::jsonb,
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
  'PROD-01179',
  'FLASH POR JOSHUA WILLIAMSON E CARMINE DI GIANDOMEN',
  'FLASH POR JOSHUA WILLIAMSON E CARMINE DI GIANDOMEN',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/s1m1AO20sIt9fMk7xWM9ZtV5AYw=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/c62522f4-63e4-11ef-b08c-feee356726a9.png"]'::jsonb,
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
  'PROD-01180',
  'FLASH POR JOSHUA WILLIAMSON E CARMINE DI GIANDOMENICO VOL. 2',
  'FLASH POR JOSHUA WILLIAMSON E CARMINE DI GIANDOMENICO VOL. 2',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/IL13fLYBDCWLt6dszM1gUOXo8x4=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/973a2418-eb29-11ef-8fb2-6696cc3e9cb3.jpg"]'::jsonb,
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
  'PROD-01181',
  'FLASH POR JOSHUA WILLIAMSON E CARMINE DI GIANDOMENICO VOL. 3',
  'FLASH POR JOSHUA WILLIAMSON E CARMINE DI GIANDOMENICO VOL. 3',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/DUontDrsQ5qdfe-ZdjRVlvtwp6g=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/c54dd546-642a-11f0-b55e-2a081a9d92fa.jpg"]'::jsonb,
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
  'PROD-01182',
  'FLASH/AQUAMAN: CANCAO DO VAZIO',
  'FLASH/AQUAMAN: CANCAO DO VAZIO',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/LDpMnmFU8bEdVHRoPUaTy6aW_LU=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/f318399c-d89b-11ee-ad97-ee1b80a1fcb2.jpg"]'::jsonb,
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
  'PROD-01183',
  'FLASH/ZAGOR (DC/BONELLI)',
  'FLASH/ZAGOR (DC/BONELLI)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/Gfv-FavAurgDJA74svfxULxuPZw=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/00fd54c2-1ca6-11ef-b80c-228c440649c1.jpg"]'::jsonb,
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
  'PROD-01184',
  'FLASH: A MORTE DE IRIS WEST (DC VINTAGE)',
  'FLASH: A MORTE DE IRIS WEST (DC VINTAGE)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/o-njH4FgxU_u36yI9AUcHP-STpg=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/9e27675c-d817-11ee-a3da-e2697ce33d53.jpg"]'::jsonb,
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
  'PROD-01185',
  'FLASH: FORCA DE ACELERACAO',
  'FLASH: FORCA DE ACELERACAO',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/towfpDPV3Jo4pVUE19g1GpLxzSY=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/d756f2e4-eb4a-11ef-a198-2a5f63e8aebc.jpg"]'::jsonb,
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
  'PROD-01186',
  'FLASH: O HOMEM MAIS RAPIDO DO MUNDO',
  'FLASH: O HOMEM MAIS RAPIDO DO MUNDO',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/Yu0oVLVPhmH25C5lwt-WYezHqZc=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/61200e7c-da9c-11ee-acb0-3226a44a89fc.jpg"]'::jsonb,
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
  'PROD-01187',
  'FLASH: UNIDOS ELES CAEM N.1',
  'FLASH: UNIDOS ELES CAEM N.1',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/Cgzdk3752sIo__xEbqAL6egS3jU=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/01158bc8-1ca6-11ef-b80c-228c440649c1.jpg"]'::jsonb,
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
  'PROD-01188',
  'FOOD WARS N.1',
  'FOOD WARS N.1',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/DTPZ5goXmn39ag0bRqcLxAVg_rc=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/0baa52f2-f68c-11ee-95eb-568a0913e72e.jpg"]'::jsonb,
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
  'PROD-01189',
  'FOOD WARS N.10',
  'FOOD WARS N.10',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/dkUoU0OZqmOIE50i9nA1AWMzJM4=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/96ad77d2-2461-11ef-bf30-ee5794111ad8.jpg"]'::jsonb,
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
  'PROD-01190',
  'FOOD WARS N.2',
  'FOOD WARS N.2',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/UweoPd8hAjTDSsltRUFdhRj9Nz0=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/2cbc87dc-ebef-11ee-963f-1e73add0c60b.jpg"]'::jsonb,
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
  'PROD-01191',
  'FOOD WARS N.3',
  'FOOD WARS N.3',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/bK_e6HjP5GIzqa4-f4j6C1nV2Mo=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/2cf33a2a-ebef-11ee-8810-22f5b7d93b6a.jpg"]'::jsonb,
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
  'PROD-01192',
  'FOOD WARS N.4',
  'FOOD WARS N.4',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/xVzJe1zMDXpQqUm5mH5QeBcUE2Y=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/2d63923e-ebef-11ee-8810-22f5b7d93b6a.jpg"]'::jsonb,
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
  'PROD-01193',
  'FOOD WARS N.5',
  'FOOD WARS N.5',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/sSpQ1lyKYS6oPFZttjDfCzuJdk8=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/2de3c242-ebef-11ee-8810-22f5b7d93b6a.jpg"]'::jsonb,
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
  'PROD-01194',
  'FOOD WARS N.6',
  'FOOD WARS N.6',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/k57eoT3blLkhBNVCgWMiyNhynk8=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/f81ecf06-2930-11ef-93b8-4a187dfd8c76.jpg"]'::jsonb,
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
  'PROD-01195',
  'FOOD WARS N.7',
  'FOOD WARS N.7',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/2dLRg7k-mf88miCK_Ds5fihXzik=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/96823c66-2461-11ef-907e-e617ee6f8487.jpg"]'::jsonb,
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
  'PROD-01196',
  'FOOD WARS N.8',
  'FOOD WARS N.8',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/TbvFe_eEWbRQiTKt3FFAicKpO7M=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/968f2ebc-2461-11ef-b00f-3eff3e6e8cf3.jpg"]'::jsonb,
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
  'PROD-01197',
  'FOOD WARS N.9',
  'FOOD WARS N.9',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/0hu3Ib5JxAiVGafgfgVvql8O2wY=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/96a8ceb2-2461-11ef-907e-e617ee6f8487.jpg"]'::jsonb,
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
  'PROD-01198',
  'FORÇA-TAREFA Z N.1',
  'FORÇA-TAREFA Z N.1',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/XAyydFEejIkabblBf6Czgkfv-xE=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/bcb73346-0125-11ef-9900-52ec7c1eeb4f.jpg"]'::jsonb,
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
  'PROD-01199',
  'FORÇA-TAREFA Z VOL. 02',
  'FORÇA-TAREFA Z VOL. 02',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/w9roN3RJcK4eS6aTVjrzr4ZEGNA=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/ac487564-ee29-11ef-9ffd-5ecca552aa97.jpg"]'::jsonb,
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
  'PROD-01200',
  'FRANJINHA: CONTATO (GRAPHIC MSP VOL. N33) (REB) CAPA DURA',
  'FRANJINHA: CONTATO (GRAPHIC MSP VOL. N33) (REB) CAPA DURA',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/IWdqF_7M_ZJKRq3cUaiOBdr7lo8=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/2fed9a5c-de36-11ee-aae0-ca3362baf0a6.jpg"]'::jsonb,
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