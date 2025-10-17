-- SQL para importar produtos Brancaleone
-- Gerado em: 2025-10-17T18:20:53.612Z
-- Total de produtos: 3363
-- Fonte: brancaleone-products-1760723254011.json

-- 1. Criar distribuidor (se não existir)

-- Distribuidor já criado no batch-001

-- Lote 53 de 68
-- Produtos: 5201 até 5300



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02601',
  'SAKAMOTO DAYS - 06 [REB]',
  'SAKAMOTO DAYS - 06 [REB]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/0XfJUfbjh_Wdoa3jvQtOQGyh8kA=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/9d332ee6-1941-11f0-b10c-622de037868f.jpg"]'::jsonb,
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
  'PROD-02602',
  'SAKAMOTO DAYS - 07 [REB]',
  'SAKAMOTO DAYS - 07 [REB]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/mlgH9fZTrLPGIqHEeA2og_CNeVM=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/9d3a338a-1941-11f0-a9be-7a7afc96fac7.jpg"]'::jsonb,
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
  'PROD-02603',
  'SAKAMOTO DAYS - 08 [REB]',
  'SAKAMOTO DAYS - 08 [REB]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/LwIAN_t5ZnvhvABD3jjX7ofh7fk=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/9d64da7c-1941-11f0-b216-e656abf73baf.jpg"]'::jsonb,
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
  'PROD-02604',
  'SAKAMOTO DAYS - 09 [REB]',
  'SAKAMOTO DAYS - 09 [REB]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/Ws0Hde4uZGKDCvhjrdZbu-k_PXg=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/9d6d52a6-1941-11f0-a340-665f2a2839bf.jpg"]'::jsonb,
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
  'PROD-02605',
  'SAKAMOTO DAYS - 10 [REB]',
  'SAKAMOTO DAYS - 10 [REB]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/8Zf9mRQOEy0M3jVM9cWn1rJcU6o=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/981a306a-2461-11ef-907e-e617ee6f8487.jpg"]'::jsonb,
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
  'PROD-02606',
  'SAKAMOTO DAYS - 11 [REB]',
  'SAKAMOTO DAYS - 11 [REB]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/_Tx-rtjFYRUYKbtK2c5VEcPrTnQ=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/9d98dc14-1941-11f0-8247-9a85c6d131e4.jpg"]'::jsonb,
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
  'PROD-02607',
  'SAKAMOTO DAYS - 12',
  'SAKAMOTO DAYS - 12',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/Ryfur7kxvXlZaXOY6jhW7WXciXE=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/0889d4c6-eb4b-11ef-8230-fa812316df6c.jpg"]'::jsonb,
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
  'PROD-02608',
  'SAKAMOTO DAYS - 12 [REB]',
  'SAKAMOTO DAYS - 12 [REB]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/zO540EwPhhl97kliyfgtuk-X6oE=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/f4fe1aac-9031-11f0-82c8-4a06203c34dc.jpg"]'::jsonb,
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
  'PROD-02609',
  'SAKAMOTO DAYS - 13',
  'SAKAMOTO DAYS - 13',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/SgEHQCc0kRMak-3lgi9Q5-MVUT4=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/a9b709e4-eb29-11ef-8d7f-eea3b61904a2.jpg"]'::jsonb,
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
  'PROD-02610',
  'SAKAMOTO DAYS - 13 [REB]',
  'SAKAMOTO DAYS - 13 [REB]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/pgpnAvysokU8qXaPzEjYeOVGxc4=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/92fe7584-9d49-11f0-a7d5-525cfeff5d31.jpg"]'::jsonb,
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
  'PROD-02611',
  'SAKAMOTO DAYS - 14',
  'SAKAMOTO DAYS - 14',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/_RpCBe4Ejf4FH8WYHrXCzmUc7VY=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/1f10efd0-f2f9-11ef-ae49-4a557680f2ea.jpg"]'::jsonb,
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
  'PROD-02612',
  'SAKAMOTO DAYS - 15',
  'SAKAMOTO DAYS - 15',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/9-H5f15-PoLm3nFO1VmnTgJQ2hc=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/9da6dd82-1941-11f0-a494-3a4c16efbbdf.jpg"]'::jsonb,
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
  'PROD-02613',
  'SAKAMOTO DAYS - 15 [REB]',
  'SAKAMOTO DAYS - 15 [REB]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/LYc6xp-s9j-V6l-9pilMXy38xPc=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/f51f998e-9031-11f0-82c8-4a06203c34dc.jpg"]'::jsonb,
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
  'PROD-02614',
  'SANDMAN APRESENTA VOL.03: TESSALÍADA',
  'SANDMAN APRESENTA VOL.03: TESSALÍADA',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/Xms2WIF3fsnleSOBgfGEQmb7jhU=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/29fa9c48-d81a-11ee-a8da-56e6c271e0a3.jpg"]'::jsonb,
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
  'PROD-02615',
  'SANDMAN APRESENTA VOL.04: THESSALY - BRUXA DE ALUGUEL',
  'SANDMAN APRESENTA VOL.04: THESSALY - BRUXA DE ALUGUEL',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/f72cnpezCqc2iekQVBEhMOwyEew=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/2a30bd00-d81a-11ee-a453-e2697ce33d53.jpg"]'::jsonb,
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
  'PROD-02616',
  'SANDMAN APRESENTA VOL.05: AS FURIAS E PETREFAX',
  'SANDMAN APRESENTA VOL.05: AS FURIAS E PETREFAX',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/lyF12alfBA-Z8hVcf4iRFeL8PhA=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/2a9584ba-d81a-11ee-a8da-56e6c271e0a3.jpg"]'::jsonb,
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
  'PROD-02617',
  'SANDMAN APRESENTA VOL.06: GAROTOS DETIVES MORTOS',
  'SANDMAN APRESENTA VOL.06: GAROTOS DETIVES MORTOS',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/JEfhciR3qv-mu-lmfhXumvM5plg=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/2b044a76-d81a-11ee-9cda-5a86bcbeb6e3.jpg"]'::jsonb,
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
  'PROD-02618',
  'SANDMAN APRESENTA VOL.08: TEATRO DA MEIA-NOITE',
  'SANDMAN APRESENTA VOL.08: TEATRO DA MEIA-NOITE',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/iKoY7pn3JIa9mSN6Au-F6W9A7SM=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/2de3cc76-d81a-11ee-9cda-5a86bcbeb6e3.jpg"]'::jsonb,
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
  'PROD-02619',
  'SANDMAN APRESENTA VOL.09: A GAROTA QUE SERIA A MORTE',
  'SANDMAN APRESENTA VOL.09: A GAROTA QUE SERIA A MORTE',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/owuMTP_CbzhAdXy0FiMzLgDY0so=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/4a72415e-e497-11ee-b6a7-e2b250ff01a0.jpg"]'::jsonb,
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
  'PROD-02620',
  'SANDMAN APRESENTA VOL.10: BRUXARIA',
  'SANDMAN APRESENTA VOL.10: BRUXARIA',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/zhjYIhChGuI617TMdKGI-Je1lPc=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/981f00fe-2461-11ef-bf30-ee5794111ad8.jpg"]'::jsonb,
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
  'PROD-02621',
  'SANDMAN: EDIÇÃO ESPECIAL DE 30 ANOS VOL.10 (R.)',
  'SANDMAN: EDIÇÃO ESPECIAL DE 30 ANOS VOL.10 (R.)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/t2FD5ziVuNn8v8CFTfM81OwYwGQ=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/acedfa8c-d81a-11ee-ae87-e2e54ed5f9f7.jpg"]'::jsonb,
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
  'PROD-02622',
  'SANDMAN: EDIÇÃO ESPECIAL DE 30 ANOS VOL.11 (R.)',
  'SANDMAN: EDIÇÃO ESPECIAL DE 30 ANOS VOL.11 (R.)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/He3Q7MlnB7urqmc7QjZZiODbIs0=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/ad0675d0-d81a-11ee-9df9-5a86bcbeb6e3.jpg"]'::jsonb,
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
  'PROD-02623',
  'SANDMAN: EDIÇÃO ESPECIAL DE 30 ANOS VOL.9  (R.)',
  'SANDMAN: EDIÇÃO ESPECIAL DE 30 ANOS VOL.9  (R.)',
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
  'PROD-02624',
  'SARGENTO ROCK: ENTRE O INFERNO E DESGRACA - EDICAO DE LUXO',
  'SARGENTO ROCK: ENTRE O INFERNO E DESGRACA - EDICAO DE LUXO',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/KcWBWiDF7bnwPpFJADNvreEA-EI=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/d8822468-eb4a-11ef-a198-2a5f63e8aebc.jpg"]'::jsonb,
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
  'PROD-02625',
  'SASAKI E MIYANO - 02',
  'SASAKI E MIYANO - 02',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/Dlahwdh-c46gotafakJiTeJGQtc=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/293ea726-a4ac-11f0-ac43-c20d3852b6b7.jpg"]'::jsonb,
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
  'PROD-02626',
  'SASAKI E MIYANO - 06',
  'SASAKI E MIYANO - 06',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/ahTuILpCBKEEIHLuK-fsGIYR5ZE=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/30974984-d81a-11ee-a8da-56e6c271e0a3.jpg"]'::jsonb,
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
  'PROD-02627',
  'SASAKI E MIYANO - 08',
  'SASAKI E MIYANO - 08',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/OY7IxwPlg60zVlh-l7PReYFGwws=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/316fefc8-d81a-11ee-83df-e2e54ed5f9f7.jpg"]'::jsonb,
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
  'PROD-02628',
  'SASAKI E MIYANO - 09',
  'SASAKI E MIYANO - 09',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/6rYcpsa0lAYZlAqzwCI5kudOS1g=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/0f0dd2ca-f68c-11ee-b180-6abfb631d83c.jpg"]'::jsonb,
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
  'PROD-02629',
  'SASAKI E MIYANO - 10',
  'SASAKI E MIYANO - 10',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/DgzU7gQD5p3xWiiGRNZ2egRg-cc=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/cec31fd2-f616-11ef-a478-c21ec36c6f62.jpg"]'::jsonb,
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
  'PROD-02630',
  'SASAKI TO MIYANO N.7',
  'SASAKI TO MIYANO N.7',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/IvlZ9I2qZymGsrG3HiRxjkgt-Rs=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/3137d5ca-d81a-11ee-a8da-56e6c271e0a3.jpg"]'::jsonb,
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
  'PROD-02631',
  'SELVAGEM HOMEM-ARANHA',
  'SELVAGEM HOMEM-ARANHA',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/XfNcVTQM-ozzqr3OfszJrW47t2U=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/a29f093c-a7c0-11f0-8792-0ab376ee0ef4.jpg"]'::jsonb,
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
  'PROD-02632',
  'SENTINELA (2000) (MARVEL VINTAGE) N.1',
  'SENTINELA (2000) (MARVEL VINTAGE) N.1',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/_GSk9nb0W_krtYcM7Ehb3mkpE2M=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/8e4574e6-4e7d-11ef-acbf-3efedc1d37c9.jpg"]'::jsonb,
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
  'PROD-02633',
  'SERÁ QUE ESSE AMOR É IRRESISTÍVEL? - 01',
  'SERÁ QUE ESSE AMOR É IRRESISTÍVEL? - 01',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/rBROWr8MMdTDArbEdrhyB3Or6LY=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/d5939dca-3f2f-11f0-a17d-1ac4d5553c9e.jpg"]'::jsonb,
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
  'PROD-02634',
  'SERÁ QUE ESSE AMOR É IRRESISTÍVEL? - 02',
  'SERÁ QUE ESSE AMOR É IRRESISTÍVEL? - 02',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/otKRpR2-Glwzng3WHd5QdMLRQg8=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/9389d2fa-9d49-11f0-aa76-a269c7cd0ff8.jpg"]'::jsonb,
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
  'PROD-02635',
  'SERAPH OF THE END - 28',
  'SERAPH OF THE END - 28',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/62GshScXjoeSYQ9ZO7kkK21XHZw=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/5542604a-d818-11ee-9412-ce469b473a25.jpg"]'::jsonb,
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
  'PROD-02636',
  'SERAPH OF THE END - 29',
  'SERAPH OF THE END - 29',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/ca7C93OHW-946_X2uNLe0gBgQt4=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/558c73ec-d818-11ee-a4a8-5a86bcbeb6e3.jpg"]'::jsonb,
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
  'PROD-02637',
  'SERAPH OF THE END - 32',
  'SERAPH OF THE END - 32',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/MdhinQaVVQa3rxqZQgvmofWU5ag=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/df9eb1bc-eb4a-11ef-8621-0ee70347c223.jpg"]'::jsonb,
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
  'PROD-02638',
  'SERAPH OF THE END - 33',
  'SERAPH OF THE END - 33',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/HroM9Y1hOJ5GJrY3m2670MUp490=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/563d79aa-2473-11f0-9552-3254c5e6fae0.jpg"]'::jsonb,
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
  'PROD-02639',
  'SERAPH OF THE END - 34',
  'SERAPH OF THE END - 34',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/oCtZ8VNOK6h-IVSqm9v9uA19jn4=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/260fa08c-a4ac-11f0-aa03-16ade38a6d4b.jpg"]'::jsonb,
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
  'PROD-02640',
  'SERAPH OF THE END N.1',
  'SERAPH OF THE END N.1',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/QRtdFQVZpETCJeeMs0CPsZZ2fvU=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/c8fa3d20-63e4-11ef-8233-ba818e5f55ac.png"]'::jsonb,
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
  'PROD-02641',
  'SERAPH OF THE END N.10',
  'SERAPH OF THE END N.10',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/37KYx1SDJ0UW5buDjcRKVX01tvI=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/7f44e13e-4e7d-11ef-aed3-3a86ab418552.jpg"]'::jsonb,
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
  'PROD-02642',
  'SERAPH OF THE END N.2',
  'SERAPH OF THE END N.2',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/8ou5cHx2EpIz7Nhh-Gam3ZQSZm0=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/c914cc3a-63e4-11ef-8da1-f6206878cf7b.png"]'::jsonb,
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
  'PROD-02643',
  'SERAPH OF THE END N.3',
  'SERAPH OF THE END N.3',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/BL3R-SiRaW-L2KRnobYYJpZkCnI=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/c93e9e70-63e4-11ef-bb5f-feb6e0b40978.png"]'::jsonb,
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
  'PROD-02644',
  'SERAPH OF THE END N.30',
  'SERAPH OF THE END N.30',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/3ZByuNO4RGNJvHwS3tZedp8VlD8=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/3bc30808-de36-11ee-aae0-ca3362baf0a6.jpg"]'::jsonb,
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
  'PROD-02645',
  'SERAPH OF THE END N.31',
  'SERAPH OF THE END N.31',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/U8OEgcwWGfjGBBfNoB52BeoN4bc=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/f70ee59c-2930-11ef-8a49-928f61c71625.jpg"]'::jsonb,
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
  'PROD-02646',
  'SERAPH OF THE END N.4',
  'SERAPH OF THE END N.4',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/RGZmpPoCzM35DU-k8pP9vPqZTzk=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/7eba5fa0-4e7d-11ef-9b64-0a2a8c62a641.jpg"]'::jsonb,
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
  'PROD-02647',
  'SERAPH OF THE END N.5',
  'SERAPH OF THE END N.5',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/jIUY_MixqbzcaD2cs6Rv8ASEM_M=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/7eed045a-4e7d-11ef-b6fd-42ec70ffd9b9.jpg"]'::jsonb,
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
  'PROD-02648',
  'SERAPH OF THE END N.6',
  'SERAPH OF THE END N.6',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/YTPTqnOuUzTXbpEOeHTAVt4xecE=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/7ef20838-4e7d-11ef-b438-b279561b7695.jpg"]'::jsonb,
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
  'PROD-02649',
  'SERAPH OF THE END N.7',
  'SERAPH OF THE END N.7',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/Yu3VRNkbGqAQrmnDkNguA7sbq_I=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/7f153696-4e7d-11ef-8594-6e8213fe308c.jpg"]'::jsonb,
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
  'PROD-02650',
  'SERAPH OF THE END N.8',
  'SERAPH OF THE END N.8',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/4kqAVudeS8b2r42oxImDHW0n-oI=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/7f1a8628-4e7d-11ef-9e33-da9904c52884.jpg"]'::jsonb,
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