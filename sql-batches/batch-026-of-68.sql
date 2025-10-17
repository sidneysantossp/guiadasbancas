-- SQL para importar produtos Brancaleone
-- Gerado em: 2025-10-17T18:20:53.612Z
-- Total de produtos: 3363
-- Fonte: brancaleone-products-1760723254011.json

-- 1. Criar distribuidor (se não existir)

-- Distribuidor já criado no batch-001

-- Lote 26 de 68
-- Produtos: 2501 até 2600



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01251',
  'GOKUSHUFUDOU - TATSU IMORTAL - 12',
  'GOKUSHUFUDOU - TATSU IMORTAL - 12',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/YxKHkt5LoXUX4ls7zQlohN1eEqE=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/27765542-2ce4-11ef-8984-a212f06ea47f.jpg"]'::jsonb,
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
  'PROD-01252',
  'GOKUSHUFUDOU - TATSU IMORTAL - 13',
  'GOKUSHUFUDOU - TATSU IMORTAL - 13',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/FVrwGts_BaTbpqQl3BbiJIM99L4=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/806d2fbe-7fa9-11ef-b0bc-6e97175de7f7.jpg"]'::jsonb,
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
  'PROD-01253',
  'GOKUSHUFUDOU - TATSU IMORTAL - 14',
  'GOKUSHUFUDOU - TATSU IMORTAL - 14',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/DtyORw8DEUBtVNenIIkgPQGGur4=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/97ca7d38-eb29-11ef-a4f3-5a40d84dae09.jpg"]'::jsonb,
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
  'PROD-01254',
  'GOKUSHUFUDOU - TATSU IMORTAL - 15',
  'GOKUSHUFUDOU - TATSU IMORTAL - 15',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/LriK7Cxqju5ec7WB-YSb4lf6zlg=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/246fda2c-48b7-11f0-955a-6e14298b474f.jpg"]'::jsonb,
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
  'PROD-01255',
  'GOKUSHUFUDOU N.10',
  'GOKUSHUFUDOU N.10',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/20SjV5gbP95yC8u21jHc-tBo3uI=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/58dc1f2c-0cc8-11ef-a5c2-9eafaa3ca1cb.jpg"]'::jsonb,
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
  'PROD-01256',
  'GOLDEN KAMUY - 30',
  'GOLDEN KAMUY - 30',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/m8_bs_xCCbNljcHGQWLl-GGd35s=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/8939da04-d818-11ee-a1cf-e2e54ed5f9f7.jpg"]'::jsonb,
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
  'PROD-01257',
  'GOLDEN KAMUY - 31',
  'GOLDEN KAMUY - 31',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/H0R_LbWOJoGUOfF4uXQs_3UO6FY=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/897d21d8-d818-11ee-82a8-e2697ce33d53.jpg"]'::jsonb,
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
  'PROD-01258',
  'GOLDEN KAMUY N.1',
  'GOLDEN KAMUY N.1',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/qtUcx4eKjJl5_y5sh3qUuydjZsI=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/4fd8dcb0-fb7c-11ee-9319-1236e160da75.jpg"]'::jsonb,
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
  'PROD-01259',
  'GOLDEN KAMUY N.10',
  'GOLDEN KAMUY N.10',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/noR2m_JAWK9ANqYkGRBTiXMcPkE=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/f7c047b0-2930-11ef-93b8-4a187dfd8c76.jpg"]'::jsonb,
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
  'PROD-01260',
  'GOLDEN KAMUY N.11',
  'GOLDEN KAMUY N.11',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/RmSOC87yAr1l1sGss2QnzYoncLI=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/f7e44192-2930-11ef-93b8-4a187dfd8c76.jpg"]'::jsonb,
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
  'PROD-01261',
  'GOLDEN KAMUY N.2',
  'GOLDEN KAMUY N.2',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/ZaXEoGGP7zUU5ocymY8WkD_1W-o=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/18984b22-069a-11ef-8901-2a9a18647563.jpg"]'::jsonb,
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
  'PROD-01262',
  'GOLDEN KAMUY N.3',
  'GOLDEN KAMUY N.3',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/iJn1mwZMLGZkL6WxVUSGzB9lfn4=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/be5d3150-0125-11ef-9900-52ec7c1eeb4f.jpg"]'::jsonb,
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
  'PROD-01263',
  'GOLDEN KAMUY N.4',
  'GOLDEN KAMUY N.4',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/HQCYZ-hUD2WTFUuUd-l7sTuBRqM=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/1902518e-069a-11ef-92f0-cafd48a576cd.jpg"]'::jsonb,
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
  'PROD-01264',
  'GOLDEN KAMUY N.5',
  'GOLDEN KAMUY N.5',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/JC-mf9-nr6jABvlv3SrcSC_NlMI=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/195de06c-069a-11ef-84b4-962c2af0cd76.jpg"]'::jsonb,
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
  'PROD-01265',
  'GOLDEN KAMUY N.6',
  'GOLDEN KAMUY N.6',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/fCKFVFDLdiovmRrE7rLiaOdqNLQ=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/f77ce5d8-2930-11ef-8a49-928f61c71625.jpg"]'::jsonb,
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
  'PROD-01266',
  'GOLDEN KAMUY N.7',
  'GOLDEN KAMUY N.7',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/8eLjK3Tm7pPk4XWI67GE5nOWqE4=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/80d95282-4e7d-11ef-9468-be21be4ea405.jpg"]'::jsonb,
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
  'PROD-01267',
  'GOLDEN KAMUY N.8',
  'GOLDEN KAMUY N.8',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/-qtv0O1Jl4K6uEX8OHNVFSiIgBc=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/f79fa4c4-2930-11ef-8a49-928f61c71625.jpg"]'::jsonb,
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
  'PROD-01268',
  'GOLDEN KAMUY N.9',
  'GOLDEN KAMUY N.9',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/thPvbalPznHZ6AQQw-Sm8_a-AMk=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/f7a12e3e-2930-11ef-93b8-4a187dfd8c76.jpg"]'::jsonb,
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
  'PROD-01269',
  'GOTHAM - ESTADO FUTURO VOL.3 (DE 3)',
  'GOTHAM - ESTADO FUTURO VOL.3 (DE 3)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/p2_VKyVNx3RwLaBiNztlEIIrIgw=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/b10f44c0-d817-11ee-9371-e2a33adec5cd.jpg"]'::jsonb,
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
  'PROD-01270',
  'GRANDES HEROIS DC: OS NOVOS 52 VOL.02 - MULHER-MARAVILHA: SA',
  'GRANDES HEROIS DC: OS NOVOS 52 VOL.02 - MULHER-MARAVILHA: SA',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/AndS_FttcLzU-vFk9IsmB51Q6Fk=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/645ba65c-d81a-11ee-bd84-e2697ce33d53.jpg"]'::jsonb,
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
  'PROD-01271',
  'GRANDES HEROIS DC: OS NOVOS 52 VOL.03 - LIGA DA JUSTICA: ORI',
  'GRANDES HEROIS DC: OS NOVOS 52 VOL.03 - LIGA DA JUSTICA: ORI',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/I7Q0HqBv8LaEfC2Y0NMTmOFFGv8=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/6510a3cc-d81a-11ee-ae87-e2e54ed5f9f7.jpg"]'::jsonb,
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
  'PROD-01272',
  'GRANDES HEROIS DC: OS NOVOS 52 VOL.04 - SUPERMAN E OS HOMENS',
  'GRANDES HEROIS DC: OS NOVOS 52 VOL.04 - SUPERMAN E OS HOMENS',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/brpXB9a0TKlPOCn1O7oeieS4Zfk=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/652833ca-d81a-11ee-bd84-e2697ce33d53.jpg"]'::jsonb,
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
  'PROD-01273',
  'GRANDES HEROIS DC: OS NOVOS 52 VOL.05 - AQUAMAN: AS PROFUNDE',
  'GRANDES HEROIS DC: OS NOVOS 52 VOL.05 - AQUAMAN: AS PROFUNDE',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/ezri6c74Du2Cf3LmYEBzHRpsxIs=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/65efd2a4-d81a-11ee-bd84-e2697ce33d53.jpg"]'::jsonb,
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
  'PROD-01274',
  'GRANDES HEROIS DC: OS NOVOS 52 VOL.06 - BATMAN: FACES DA MOR',
  'GRANDES HEROIS DC: OS NOVOS 52 VOL.06 - BATMAN: FACES DA MOR',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/n2hUCw1lgmMkJcqgBKhA31mRuXE=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/667ef8bc-d81a-11ee-bd84-e2697ce33d53.jpg"]'::jsonb,
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
  'PROD-01275',
  'GRANDES HEROIS DC: OS NOVOS 52 VOL.07 - FLASH: SEGUINDO EM FRENTE',
  'GRANDES HEROIS DC: OS NOVOS 52 VOL.07 - FLASH: SEGUINDO EM FRENTE',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/KuTCixeXRppeEkq0swJX0gaF8Hc=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/bf5e8868-d8a0-11ee-82f3-be3c8dbb0cbf.jpg"]'::jsonb,
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
  'PROD-01276',
  'GRANDES HEROIS DC: OS NOVOS 52 VOL.08 - LANTERNA VERDE: SINESTRO',
  'GRANDES HEROIS DC: OS NOVOS 52 VOL.08 - LANTERNA VERDE: SINESTRO',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/RxRngnl82bx0c2wZ6QfP-axOgO8=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/c02432d4-d8a0-11ee-82f3-be3c8dbb0cbf.jpg"]'::jsonb,
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
  'PROD-01277',
  'GRANDES HEROIS DC: OS NOVOS 52 VOL.09 - BATMAN E ROBIN: NASC',
  'GRANDES HEROIS DC: OS NOVOS 52 VOL.09 - BATMAN E ROBIN: NASC',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/D5S91Iyqb-LJmoOqQpLdDsezGnQ=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/2ae03702-a4ac-11f0-84d7-06a1e9b2bf33.jpg"]'::jsonb,
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
  'PROD-01278',
  'GRANDES HEROIS DC: OS NOVOS 52 VOL.10 - QUAL O PRECO É O PRE',
  'GRANDES HEROIS DC: OS NOVOS 52 VOL.10 - QUAL O PRECO É O PRE',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/HkYYZfBxbCoo8YG2nV1kXRqcyyQ=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/321abde8-ebef-11ee-8810-22f5b7d93b6a.jpg"]'::jsonb,
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
  'PROD-01279',
  'GRANDES HEROIS DC: OS NOVOS 52 VOL.12 - MULHER-MARAVILHA: D',
  'GRANDES HEROIS DC: OS NOVOS 52 VOL.12 - MULHER-MARAVILHA: D',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/zgcyqDOPyV1ib8-hkCxTcFmh4yo=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/5e5cfae8-0cc8-11ef-9a60-4aab40cc5a40.jpg"]'::jsonb,
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
  'PROD-01280',
  'GRANDES HEROIS DC: OS NOVOS 52 VOL.13 - LIGA DA JUSTICA: A J',
  'GRANDES HEROIS DC: OS NOVOS 52 VOL.13 - LIGA DA JUSTICA: A J',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/WeOQVJUC3b65wVSvxi7nDW6MVfI=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/012a3708-1ca6-11ef-bc32-def7b1441874.jpg"]'::jsonb,
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
  'PROD-01281',
  'GRANDES HEROIS DC: OS NOVOS 52 VOL.14 - BATMAN: TATICAS DE T',
  'GRANDES HEROIS DC: OS NOVOS 52 VOL.14 - BATMAN: TATICAS DE T',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/YxKHkt5LoXUX4ls7zQlohN1eEqE=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/27765542-2ce4-11ef-8984-a212f06ea47f.jpg"]'::jsonb,
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
  'PROD-01282',
  'GRANDES HEROIS DC: OS NOVOS 52 VOL.15 - SUPERMAN: A PROVA DE',
  'GRANDES HEROIS DC: OS NOVOS 52 VOL.15 - SUPERMAN: A PROVA DE',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/w2gqTud8K4wWsUUykXiSxJu3UeI=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/25835c62-2ce4-11ef-be32-e29a78b97fe9.jpg"]'::jsonb,
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
  'PROD-01283',
  'GRANDES HEROIS DC: OS NOVOS 52 VOL.16 - LANTERNA VERDE: A VI',
  'GRANDES HEROIS DC: OS NOVOS 52 VOL.16 - LANTERNA VERDE: A VI',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/MCxhYsdW-Oc2uhMfXiTpgLQc8GU=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/8f994e44-4e7d-11ef-9b64-0a2a8c62a641.jpg"]'::jsonb,
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
  'PROD-01284',
  'GRANDES HEROIS DC: OS NOVOS 52 VOL.17 - BATMAN E ROBIN: TERM',
  'GRANDES HEROIS DC: OS NOVOS 52 VOL.17 - BATMAN E ROBIN: TERM',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/aMKjBoaSOu7-WG5TW0o5DJuoR9Q=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/d0d0b6f0-63e4-11ef-b225-d27112a10133.png"]'::jsonb,
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
  'PROD-01285',
  'GRANDES HEROIS DC: OS NOVOS 52 VOL.18 - AQUAMAN: OS OUTROS',
  'GRANDES HEROIS DC: OS NOVOS 52 VOL.18 - AQUAMAN: OS OUTROS',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/VpQ1yyCdo8IFWfSEWsqaPaECEMw=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/8a3c4c46-7fa9-11ef-b0bc-6e97175de7f7.jpg"]'::jsonb,
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
  'PROD-01286',
  'GRANDES HEROIS DC: OS NOVOS 52 VOL.19 - FLASH: A REVOLUCAO D',
  'GRANDES HEROIS DC: OS NOVOS 52 VOL.19 - FLASH: A REVOLUCAO D',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/IebJcP2RuR37laCG-prwd_Hb_6A=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/8a52aee6-7fa9-11ef-b0bc-6e97175de7f7.jpg"]'::jsonb,
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
  'PROD-01287',
  'GRANDES HEROIS DC: OS NOVOS 52 VOL.20 - MULHER-MARAVILHA: FO',
  'GRANDES HEROIS DC: OS NOVOS 52 VOL.20 - MULHER-MARAVILHA: FO',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/SG_gF580jfEk1wJtDYZBCGliZD4=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/18a3bd18-eb4b-11ef-b0d0-f6341ef53590.jpg"]'::jsonb,
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
  'PROD-01288',
  'GRANDES HEROIS DC: OS NOVOS 52 VOL.22 - SUPERMAN NO FIM DOS',
  'GRANDES HEROIS DC: OS NOVOS 52 VOL.22 - SUPERMAN NO FIM DOS',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/l2OTzaxZBro-quxS-enEQ4UoA_8=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/1981a8a8-eb4b-11ef-b0d0-f6341ef53590.jpg"]'::jsonb,
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
  'PROD-01289',
  'GRANDES HEROIS DC: OS NOVOS 52 VOL.23 - SHAZAM!',
  'GRANDES HEROIS DC: OS NOVOS 52 VOL.23 - SHAZAM!',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/_R9vy5B1LqXbXRh1VK60V8sPOXE=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/ac59b944-eb29-11ef-8d7f-eea3b61904a2.jpg"]'::jsonb,
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
  'PROD-01290',
  'GRANDES HEROIS DC: OS NOVOS 52 VOL.24 - LIGA DA JUSTICA: TRO',
  'GRANDES HEROIS DC: OS NOVOS 52 VOL.24 - LIGA DA JUSTICA: TRO',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/YHvBWvnZzB76W4LxjkVOzZ0EqQg=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/ac6da18e-eb29-11ef-a31a-8ed8743505f0.jpg"]'::jsonb,
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
  'PROD-01291',
  'GRANDES HEROIS DC: OS NOVOS 52 VOL.25 - BATMAN E ROBIN: A MO',
  'GRANDES HEROIS DC: OS NOVOS 52 VOL.25 - BATMAN E ROBIN: A MO',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/VC3S06Yb5Qacvs2TNGl6RQX9bEk=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/9e8ec718-08c6-11f0-8aef-b2e99305fa63.jpg"]'::jsonb,
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
  'PROD-01292',
  'GRANDES HEROIS DC: OS NOVOS 52 VOL.26 - AQUAMAN: O TRONO DE',
  'GRANDES HEROIS DC: OS NOVOS 52 VOL.26 - AQUAMAN: O TRONO DE',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/lNbn_PdrxmUn-3Zt7XtgPHdbtiM=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/9fa910e0-08c6-11f0-8e32-0e7787c15de6.jpg"]'::jsonb,
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
  'PROD-01293',
  'GRANDES HEROIS DC: OS NOVOS 52 VOL.27 - LANTERNA VERDE: O FI',
  'GRANDES HEROIS DC: OS NOVOS 52 VOL.27 - LANTERNA VERDE: O FI',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/SxI4LlUBH4lHrasaxhNE6SELQgY=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/21c71cea-48b7-11f0-98d1-7a925bb2c122.jpg"]'::jsonb,
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
  'PROD-01294',
  'GRANDES HEROIS DC: OS NOVOS 52 VOL.28 - FLASH: A GUERRA DOS',
  'GRANDES HEROIS DC: OS NOVOS 52 VOL.28 - FLASH: A GUERRA DOS',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/cHg75HDeAKP7Nf-Du26u2Jm2qI8=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/1f91556c-69af-11f0-ae5d-0ebdcf797c5e.jpg"]'::jsonb,
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
  'PROD-01295',
  'GRANDES HEROIS DC: OS NOVOS 52 VOL.29 - LIGA DA JUSTICA DA A',
  'GRANDES HEROIS DC: OS NOVOS 52 VOL.29 - LIGA DA JUSTICA DA A',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/3_gkoGt94PFMEZv_5ryCr5i4oqs=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/1f9a0978-69af-11f0-9a47-2e3660e82a7f.jpg"]'::jsonb,
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
  'PROD-01296',
  'GRANDES HEROIS DC: OS NOVOS 52 VOL.30 - LIGA DA JUSTICA: A G',
  'GRANDES HEROIS DC: OS NOVOS 52 VOL.30 - LIGA DA JUSTICA: A G',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/6B3kZV0vR0cnVC-nTkuLPuh6C-Q=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/52b867f6-8b5f-11f0-819b-cef4535c59b2.jpg"]'::jsonb,
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
  'PROD-01297',
  'GRANDES PARÓDIAS DA TURMA DA MONICA N.9',
  'GRANDES PARÓDIAS DA TURMA DA MONICA N.9',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/-tnfwfw7IfMNTx06jaKwq4p81KM=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/da9b67aa-eb4a-11ef-a198-2a5f63e8aebc.jpg"]'::jsonb,
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
  'PROD-01298',
  'GRANDES SAGAS DISNEY N.1',
  'GRANDES SAGAS DISNEY N.1',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/HYRK8CUrto_w8iw8wJuSC8DONLg=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/56c346f0-fb7c-11ee-bf53-e27a9dd5d6a4.jpg"]'::jsonb,
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
  'PROD-01299',
  'GRANDES SAGAS DISNEY N.10',
  'GRANDES SAGAS DISNEY N.10',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/Pp-jAimBEWz_A8qTfzIP5rFSbLQ=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/db447bb2-7faa-11ef-8130-12caec0ea15c.jpg"]'::jsonb,
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
  'PROD-01300',
  'GRANDES SAGAS DISNEY N.2',
  'GRANDES SAGAS DISNEY N.2',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/-UfSDGVnHK7aLzItmFX7Xowam5U=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/c4ce4fd8-0125-11ef-9900-52ec7c1eeb4f.jpg"]'::jsonb,
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