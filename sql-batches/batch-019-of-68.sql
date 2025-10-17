-- SQL para importar produtos Brancaleone
-- Gerado em: 2025-10-17T18:20:53.612Z
-- Total de produtos: 3363
-- Fonte: brancaleone-products-1760723254011.json

-- 1. Criar distribuidor (se não existir)

-- Distribuidor já criado no batch-001

-- Lote 19 de 68
-- Produtos: 1801 até 1900



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00901',
  'CONAN, O BARBARO: A ERA CLASSICA VOL.09 (OMNIBUS)',
  'CONAN, O BARBARO: A ERA CLASSICA VOL.09 (OMNIBUS)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/efidTBQO7C64F5EP0fJRrNCzoaY=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/36db1070-5ea9-11f0-885d-4eae30e658d1.jpg"]'::jsonb,
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
  'PROD-00902',
  'CONAN, O BARBARO: AS TIRAS VOL.02 (DE 2)',
  'CONAN, O BARBARO: AS TIRAS VOL.02 (DE 2)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/Zvq7g5DSLk2T5i2JWI82iHkZEro=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/3ab80a28-d817-11ee-9a1e-da2373bc7c0b.jpg"]'::jsonb,
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
  'PROD-00903',
  'CONAN/DRAGONERO',
  'CONAN/DRAGONERO',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/JS16-UzcKlNeJj47R4d8ofBvoYA=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/7f496ada-7fa9-11ef-b0bc-6e97175de7f7.jpg"]'::jsonb,
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
  'PROD-00904',
  'CONFUSÕES DO PRIMEIRO AMOR - 02',
  'CONFUSÕES DO PRIMEIRO AMOR - 02',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/cyl3lQ5li2nLlE-a-ECm9oLeJfM=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/f644dd66-d817-11ee-9a1e-da2373bc7c0b.jpg"]'::jsonb,
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
  'PROD-00905',
  'CONFUSÕES DO PRIMEIRO AMOR - 03',
  'CONFUSÕES DO PRIMEIRO AMOR - 03',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/EKjXbP8a9vMFmjW0dRviQLSxDFo=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/f6d74426-d817-11ee-86d3-ce469b473a25.jpg"]'::jsonb,
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
  'PROD-00906',
  'CONFUSÕES DO PRIMEIRO AMOR - 04',
  'CONFUSÕES DO PRIMEIRO AMOR - 04',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/ea0jFj-hDboJYP5ZEbTf5bnN1FU=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/f6f40c8c-d817-11ee-9a1e-da2373bc7c0b.jpg"]'::jsonb,
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
  'PROD-00907',
  'CONFUSÕES DO PRIMEIRO AMOR - 05',
  'CONFUSÕES DO PRIMEIRO AMOR - 05',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/H7OMD9rfw2sqIwi-UVrGP79I5-s=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/f76b36cc-d817-11ee-86d3-ce469b473a25.jpg"]'::jsonb,
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
  'PROD-00908',
  'CONFUSÕES DO PRIMEIRO AMOR - 06',
  'CONFUSÕES DO PRIMEIRO AMOR - 06',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/Nk9eC8HR1-MjReV2YZiz4nzV08A=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/f7a0648c-d817-11ee-a3da-e2697ce33d53.jpg"]'::jsonb,
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
  'PROD-00909',
  'CONFUSÕES DO PRIMEIRO AMOR - 07',
  'CONFUSÕES DO PRIMEIRO AMOR - 07',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/w7_g7zJlAxzeld-BQnOaXxGVJ8c=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/f8113fc2-d817-11ee-bce8-e2e54ed5f9f7.jpg"]'::jsonb,
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
  'PROD-00910',
  'CONFUSÕES DO PRIMEIRO AMOR - 08',
  'CONFUSÕES DO PRIMEIRO AMOR - 08',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/zKzIc7dLzfKfB11eRu-T9rv9HPg=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/f86ff2ba-d817-11ee-a4a8-5a86bcbeb6e3.jpg"]'::jsonb,
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
  'PROD-00911',
  'CONFUSÕES DO PRIMEIRO AMOR - 09',
  'CONFUSÕES DO PRIMEIRO AMOR - 09',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/jRUJyW6EAQwl8ZLxBfmQ92o_PO0=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/f91fb83a-d817-11ee-9a1e-da2373bc7c0b.jpg"]'::jsonb,
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
  'PROD-00912',
  'CORINGA: A ERA DE BRONZE (DC OMNIBUS)',
  'CORINGA: A ERA DE BRONZE (DC OMNIBUS)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/rKitaP4AFc0t6R0YjwIbr47-huA=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/9431b56a-eb29-11ef-913d-52f5d450f8a6.jpg"]'::jsonb,
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
  'PROD-00913',
  'CORINGA: O HOMEM QUE PAROU DE RIR VOL. 01',
  'CORINGA: O HOMEM QUE PAROU DE RIR VOL. 01',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/DUzoiZ_Jw3x0TmsyWRrCk3SgCE4=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/eddd797e-d89b-11ee-815b-5a86bcbeb6e3.jpg"]'::jsonb,
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
  'PROD-00914',
  'CORINGA: O HOMEM QUE PAROU DE RIR VOL. 02',
  'CORINGA: O HOMEM QUE PAROU DE RIR VOL. 02',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/WETWmywpbyJNSrU5wemU94SXus8=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/93e54098-2461-11ef-b00f-3eff3e6e8cf3.jpg"]'::jsonb,
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
  'PROD-00915',
  'CORINGA: O MUNDO',
  'CORINGA: O MUNDO',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/rZVMcKiQMjLpE_ePcpFcXThW8SM=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/7f5c7558-7fa9-11ef-b0bc-6e97175de7f7.jpg"]'::jsonb,
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
  'PROD-00916',
  'CORINGA: OPERACAO BABA - 01',
  'CORINGA: OPERACAO BABA - 01',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/1LF-I63fqrb1990GLd6UcWgbDeo=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/f74e3d2c-d89b-11ee-8d35-d6162862a756.jpg"]'::jsonb,
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
  'PROD-00917',
  'CORINGA: OPERACAO BABA - 02',
  'CORINGA: OPERACAO BABA - 02',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/QFZKjLvnEGr2TNKxBnLOxnwuiIY=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/f79ed14c-d89b-11ee-a97f-26337c3739c7.jpg"]'::jsonb,
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
  'PROD-00918',
  'CORINGA: OPERACAO BABA - 03',
  'CORINGA: OPERACAO BABA - 03',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/jWNWwnckoFxeJ6Ja-70ohqj0iy4=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/f7eb4662-d89b-11ee-9fe6-c2d9e886ee20.jpg"]'::jsonb,
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
  'PROD-00919',
  'CORPORACAO BATMAN (2023) N.1',
  'CORPORACAO BATMAN (2023) N.1',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/na2QJbzX4fvZdACZZjgx3X3ObPs=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/6c874740-da7d-11ee-87ab-b67307b9a4e9.jpg"]'::jsonb,
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
  'PROD-00920',
  'CORPORACAO BATMAN (2023) N.2',
  'CORPORACAO BATMAN (2023) N.2',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/8IBO3fd1P64_d8iKBXdf5IYOvx4=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/7598e018-4e7d-11ef-8f2a-626adc132bdd.jpg"]'::jsonb,
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
  'PROD-00921',
  'CRISE DE IDENTIDADE (GRANDES EVENTOS DC) N.1',
  'CRISE DE IDENTIDADE (GRANDES EVENTOS DC) N.1',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/qp-Q8uYAFCb31Btda7GmKBSdgFA=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/c678cc92-63e4-11ef-8233-ba818e5f55ac.png"]'::jsonb,
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
  'PROD-00922',
  'CRISE FINAL (GRANDES EVENTOS DC)',
  'CRISE FINAL (GRANDES EVENTOS DC)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/_S6kT1hBFB8NaiqaXvn1BQAEIJs=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/97855d8e-eb29-11ef-9e36-2a856f41baa0.jpg"]'::jsonb,
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
  'PROD-00923',
  'CRISE SOMBRIA VOL. 02',
  'CRISE SOMBRIA VOL. 02',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/6NzQNl8FGypKtasG--tOlR24niY=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/3bc23f56-d817-11ee-b124-5a86bcbeb6e3.jpg"]'::jsonb,
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
  'PROD-00924',
  'CYBORG N.1',
  'CYBORG N.1',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/mYG_TNRYoKP3rXDx41NwFPznCh4=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/009674a0-1ca6-11ef-bc32-def7b1441874.jpg"]'::jsonb,
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
  'PROD-00925',
  'D.E.U.S.E.S.',
  'D.E.U.S.E.S.',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/Z8uWNrQZa_VjXsp8F3IeOwXvEm4=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/963e82f2-eb29-11ef-a3b1-5681c2ac1d4b.jpg"]'::jsonb,
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
  'PROD-00926',
  'DAKAICHI: O HOMEM MAIS DESEJADO DO ANO - 01',
  'DAKAICHI: O HOMEM MAIS DESEJADO DO ANO - 01',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/7DBvijwPCC7uZmY40u5NrYpB584=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/aaf55100-ee29-11ef-893a-2e61cb86d715.jpg"]'::jsonb,
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
  'PROD-00927',
  'DAKAICHI: O HOMEM MAIS DESEJADO DO ANO N.9',
  'DAKAICHI: O HOMEM MAIS DESEJADO DO ANO N.9',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/hzN-piXcsEdYCX1GYYHJ7sdnqL8=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/94071a7e-2461-11ef-845e-aa6efae8e89c.jpg"]'::jsonb,
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
  'PROD-00928',
  'DANDADAN - 02 [REB3]',
  'DANDADAN - 02 [REB3]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/NeFmLDqiHSeYcpzf9ekD5Jjahqc=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/962f6aa6-1941-11f0-8389-fe558391bec0.jpg"]'::jsonb,
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
  'PROD-00929',
  'DANDADAN - 03 [REB 2]',
  'DANDADAN - 03 [REB 2]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/U9NxT60oibCYYb8Ka_vxDd2EdLE=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/966350e6-1941-11f0-ad03-c6289aaa7a91.jpg"]'::jsonb,
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
  'PROD-00930',
  'DANDADAN - 04 [REB2]',
  'DANDADAN - 04 [REB2]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/X53YDkDylrM-JyZEF3pg0Md3rnE=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/967cc350-1941-11f0-a494-3a4c16efbbdf.jpg"]'::jsonb,
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
  'PROD-00931',
  'DANDADAN - 05 [REB2]',
  'DANDADAN - 05 [REB2]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/Q5zp4mI704IUxbhl6w5PEnwBuD0=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/968db19c-1941-11f0-85af-b67ae79b02ea.jpg"]'::jsonb,
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
  'PROD-00932',
  'DANDADAN - 06 [REB2]',
  'DANDADAN - 06 [REB2]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/-3_Bb-cV0HJ4l57BVi8Scsebhug=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/387e8cae-5ea9-11f0-885d-4eae30e658d1.jpg"]'::jsonb,
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
  'PROD-00933',
  'DANDADAN - 06 [REB]',
  'DANDADAN - 06 [REB]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/oCUTKLmmUGNq-XQU1nf7jxHfpFw=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/bb207fe2-f616-11ef-9565-f2e31ca8a769.jpg"]'::jsonb,
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
  'PROD-00934',
  'DANDADAN - 07 [REB2]',
  'DANDADAN - 07 [REB2]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/LDne0Ny-ow4Ei7NzB0pvz-sVoyM=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/38ef91ec-5ea9-11f0-885d-4eae30e658d1.jpg"]'::jsonb,
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
  'PROD-00935',
  'DANDADAN - 07 [REB]',
  'DANDADAN - 07 [REB]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/0oto-w4sRoHONCk-_rtHN0l4doc=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/bb3011aa-f616-11ef-aa08-9af237dc8f86.jpg"]'::jsonb,
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
  'PROD-00936',
  'DANDADAN - 08 [REB2]',
  'DANDADAN - 08 [REB2]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/yp4-sg5_FEhE_N-5BkGtmf5ocMQ=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/39399d14-5ea9-11f0-885d-4eae30e658d1.jpg"]'::jsonb,
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
  'PROD-00937',
  'DANDADAN - 09 [REB2]',
  'DANDADAN - 09 [REB2]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/KI7SwzRU65KdK90wWKwrMq1vi90=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/3a1b8cce-5ea9-11f0-885d-4eae30e658d1.jpg"]'::jsonb,
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
  'PROD-00938',
  'DANDADAN - 10 [REB2]',
  'DANDADAN - 10 [REB2]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/9-otcdZM9E6lI-XY0U1wy9HB9HQ=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/3a4d4e8a-5ea9-11f0-b8ff-8a0b5d172c0d.jpg"]'::jsonb,
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
  'PROD-00939',
  'DANDADAN - 10 [REB]',
  'DANDADAN - 10 [REB]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/7fuOeXhEoaLdwkr2eF_n3KRqR2I=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/c0b6759c-f616-11ef-b583-1612b939ee2a.jpg"]'::jsonb,
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
  'PROD-00940',
  'DANDADAN - 11 [REB 2]',
  'DANDADAN - 11 [REB 2]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/_pVF0woc0ch2EvM5-ABJCXQ9V7s=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/3b16636a-5ea9-11f0-b8ff-8a0b5d172c0d.jpg"]'::jsonb,
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
  'PROD-00941',
  'DANDADAN - 12',
  'DANDADAN - 12',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/Bq0EiUtlq71APIApMKU3DBKgnQk=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/365dcacc-7fd1-11f0-b894-2e1dcafaddd0.jpg"]'::jsonb,
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
  'PROD-00942',
  'DANDADAN - 13',
  'DANDADAN - 13',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/pMM4Gl_KwLxQ6bHhvQshHZl5abY=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/36770258-7fd1-11f0-b894-2e1dcafaddd0.jpg"]'::jsonb,
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
  'PROD-00943',
  'DANDADAN - 15 [REB]',
  'DANDADAN - 15 [REB]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/Yzjl7DSaDZTLOM4vZ-Zf4VMNFFc=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/c4f373a8-642a-11f0-9174-0aba59c16e94.jpg"]'::jsonb,
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
  'PROD-00944',
  'DANDADAN - 16',
  'DANDADAN - 16',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/LBnJVU8Z3xy4Wfr3enONox63YOw=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/e7424816-9031-11f0-9754-9a60b14b6cd5.jpg"]'::jsonb,
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
  'PROD-00945',
  'DANNY KETCH: MOTOQUEIRO FANTASMA (LENDAS MARVEL)',
  'DANNY KETCH: MOTOQUEIRO FANTASMA (LENDAS MARVEL)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/DU8h1sLY9mfPOzijCTzDE4Tg9qU=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/aec33ffe-ee29-11ef-97c0-4eddcfde9ad5.jpg"]'::jsonb,
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
  'PROD-00946',
  'DARK SOULS -  01',
  'DARK SOULS -  01',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/S-UeUkItNsm0DD70wUPvHPFQni4=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/ab20de42-ee29-11ef-9fcc-be91c53273e3.jpg"]'::jsonb,
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
  'PROD-00947',
  'DARK SOULS - 02',
  'DARK SOULS - 02',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/B5Qt23nxl9rAwsv3nczf2we6kas=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/98a0ac2e-a7c0-11f0-96ab-2e54fc51120d.jpg"]'::jsonb,
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
  'PROD-00948',
  'DC DE OURO: BATMAN',
  'DC DE OURO: BATMAN',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/aYMndM6nHHCbOz9qAGm3OG9frzA=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/09590808-98c6-11f0-b694-7613bb286ee1.jpg"]'::jsonb,
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
  'PROD-00949',
  'DC DE OURO: SUPERMAN',
  'DC DE OURO: SUPERMAN',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/Rzkb9k0Js1uK6MFiC1wEXaCJhk0=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/1f7d826c-69af-11f0-9136-d26b36de5d6c.jpg"]'::jsonb,
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
  'PROD-00950',
  'DC SEM PALAVRAS',
  'DC SEM PALAVRAS',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/3sstixlTsPWNiNdEAG01kBeuGCw=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/ab5cf1ca-ee29-11ef-975b-c638c3b0d24f.jpg"]'::jsonb,
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