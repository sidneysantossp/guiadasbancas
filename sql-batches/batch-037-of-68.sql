-- SQL para importar produtos Brancaleone
-- Gerado em: 2025-10-17T18:20:53.612Z
-- Total de produtos: 3363
-- Fonte: brancaleone-products-1760723254011.json

-- 1. Criar distribuidor (se não existir)

-- Distribuidor já criado no batch-001

-- Lote 37 de 68
-- Produtos: 3601 até 3700



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-01801',
  'MAO N.18',
  'MAO N.18',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/SCoz_tYqxX4zrWkEIDBPfR6SqH4=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/84dabfee-7fa9-11ef-b0bc-6e97175de7f7.jpg"]'::jsonb,
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
  'PROD-01802',
  'MARRIAGE TOXIN - 2',
  'MARRIAGE TOXIN - 2',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/L4ivqYZa2WOBCDeoWRbO13WKlWM=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/850b06ea-7fa9-11ef-b1d0-12caec0ea15c.jpg"]'::jsonb,
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
  'PROD-01803',
  'MARRIAGE TOXIN - 3',
  'MARRIAGE TOXIN - 3',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/wb0z-guPUWuWUUtMIie-TQDFkh8=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/c78b5c5c-f616-11ef-aa08-9af237dc8f86.jpg"]'::jsonb,
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
  'PROD-01804',
  'MARRIAGE TOXIN - 4',
  'MARRIAGE TOXIN - 4',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/73uLgsZqKjxSzK_7jvYh4LzNllM=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/9f7dbaa4-eb29-11ef-a4f3-5a40d84dae09.jpg"]'::jsonb,
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
  'PROD-01805',
  'MARRIAGE TOXIN - 5',
  'MARRIAGE TOXIN - 5',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/3TWHlG8BLJBZtSd7VxplEXHgtFg=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/d003ed2a-0ea0-11f0-8c42-ca515fff2782.jpg"]'::jsonb,
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
  'PROD-01806',
  'MARRIAGE TOXIN - 6',
  'MARRIAGE TOXIN - 6',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/pYpi6w7hkHitNYd5gQGxIWGIUr4=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/dcf15fe4-3f2f-11f0-a17d-1ac4d5553c9e.jpg"]'::jsonb,
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
  'PROD-01807',
  'MARRIAGE TOXIN - 7',
  'MARRIAGE TOXIN - 7',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/ScW-Rpu7VEZVhvvXWsIJPwTd6s8=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/49f57352-8b5f-11f0-ab6e-7e1ab2cbb1e5.jpg"]'::jsonb,
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
  'PROD-01808',
  'MARRIAGE TOXIN N.1',
  'MARRIAGE TOXIN N.1',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/rZhA4DH2n9RZgZ95DRgICdmikm0=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/cb1738ba-63e4-11ef-afd1-a2b2aa9ce723.png"]'::jsonb,
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
  'PROD-01809',
  'MARVEL AGE 1000',
  'MARVEL AGE 1000',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/Nu6rIbO2gsJmsYlzqUloyhXoCHM=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/83eba012-7fa9-11ef-b1d0-12caec0ea15c.jpg"]'::jsonb,
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
  'PROD-01810',
  'MARVEL COMICS: UM TRIBUTO EM MANGÁ',
  'MARVEL COMICS: UM TRIBUTO EM MANGÁ',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/Mx_JfFbzP4s6m32n2EuSdIAM30A=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/9feb7f76-eb29-11ef-a31a-8ed8743505f0.jpg"]'::jsonb,
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
  'PROD-01811',
  'MARVEL DOSE DUPLA N.6',
  'MARVEL DOSE DUPLA N.6',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/-e5ALpagfYAhlyPhuI8qbhz0HCQ=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/88ceb360-d817-11ee-a3da-e2697ce33d53.jpg"]'::jsonb,
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
  'PROD-01812',
  'MARVEL EPIC COLLECTION VOL. 08 - THOR: A ARVORE DA VIDA',
  'MARVEL EPIC COLLECTION VOL. 08 - THOR: A ARVORE DA VIDA',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/_l0_pMAfvCslkw15CFyv89bpkdU=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/43e1f5b4-e497-11ee-83ff-7ee42cfe9644.jpg"]'::jsonb,
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
  'PROD-01813',
  'MARVEL EPIC COLLECTION VOL.05 - CAPITAO AMERICA: A PRIMEIRA',
  'MARVEL EPIC COLLECTION VOL.05 - CAPITAO AMERICA: A PRIMEIRA',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/aGLros4yIX_XoHOpv1V6q6IJfDo=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/4adebf08-8b5f-11f0-ab6e-7e1ab2cbb1e5.jpg"]'::jsonb,
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
  'PROD-01814',
  'MARVEL EPIC COLLECTION VOL.06 - ESPETACULAR HOMEM-ARANHA: AM',
  'MARVEL EPIC COLLECTION VOL.06 - ESPETACULAR HOMEM-ARANHA: AM',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/yRXAWQe55RZBCXfL-oEZ8YQ65RI=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/5bc1bf38-5ea9-11f0-a034-4eae30e658d1.jpg"]'::jsonb,
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
  'PROD-01815',
  'MARVEL EPIC COLLECTION VOL.07 - PUNHO DE FERRO: A FURIA DO P',
  'MARVEL EPIC COLLECTION VOL.07 - PUNHO DE FERRO: A FURIA DO P',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/Wr32q-ycObva84QyrWbYZ7fwtgg=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/3e9f393c-7fd1-11f0-b894-2e1dcafaddd0.jpg"]'::jsonb,
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
  'PROD-01816',
  'MARVEL EPIC COLLECTION VOL.10 - CAVALEIRO DA LUA: MAUS PRESS',
  'MARVEL EPIC COLLECTION VOL.10 - CAVALEIRO DA LUA: MAUS PRESS',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/3mcrqdfpyINJXBk8fNF_MImplsg=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/86185522-4e7d-11ef-9840-f20bdaf36c96.jpg"]'::jsonb,
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
  'PROD-01817',
  'MARVEL EPIC COLLECTION VOL.12 - DEMOLIDOR: CAINDO EM DESGRAC',
  'MARVEL EPIC COLLECTION VOL.12 - DEMOLIDOR: CAINDO EM DESGRAC',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/H77BWMCGQfIEtH3XGXQePHfD4Kc=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/e9816788-eb4a-11ef-8621-0ee70347c223.jpg"]'::jsonb,
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
  'PROD-01818',
  'MARVEL EPIC COLLECTION VOL.13 - GERACAO X: DE VOLTA AS AULAS',
  'MARVEL EPIC COLLECTION VOL.13 - GERACAO X: DE VOLTA AS AULAS',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/6Z9qem8z-3r1nx0L5nHzGuwpY8Y=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/c7f7fe5c-f616-11ef-b0f5-5ac998efac6d.jpg"]'::jsonb,
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
  'PROD-01819',
  'MARVEL EPIC COLLECTION VOL.14 - CAPITAO AMERICA: HOMEM SEM P',
  'MARVEL EPIC COLLECTION VOL.14 - CAPITAO AMERICA: HOMEM SEM P',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/70d_C-7NFpGU0uHPuezMkp0Ixiw=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/ecde305a-0143-11f0-9a82-ca3c9ea74dec.jpg"]'::jsonb,
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
  'PROD-01820',
  'MARVEL EPIC COLLECTION VOL.15 - THUNDERBOLTS: JUSTICA, COMO',
  'MARVEL EPIC COLLECTION VOL.15 - THUNDERBOLTS: JUSTICA, COMO',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/WzQ4ghhPzdP7pzcMaEYBMI3Ksco=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/2d05ae2a-44b4-11f0-a1ec-1a73b65bfa37.jpg"]'::jsonb,
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
  'PROD-01821',
  'MARVEL LEGADO: O VELHO LOGAN',
  'MARVEL LEGADO: O VELHO LOGAN',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/R13-DkPvadubUK3JdIJ4f375ExM=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/b0e5106c-eb29-11ef-b7b8-460343881edd.jpg"]'::jsonb,
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
  'PROD-01822',
  'MARVEL MIAU (MARVEL MANGA N.1)',
  'MARVEL MIAU (MARVEL MANGA N.1)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/oN1_mDLh8IK0713hr9VsW9RcwYA=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/e9b48fdc-eb4a-11ef-8621-0ee70347c223.jpg"]'::jsonb,
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
  'PROD-01823',
  'MARVEL-VERSE: WANDA E VISAO',
  'MARVEL-VERSE: WANDA E VISAO',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/l7C2NKLTYY4OSgyKwfblTEnH7Io=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/d43fcfd6-eb4a-11ef-8230-fa812316df6c.jpg"]'::jsonb,
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
  'PROD-01824',
  'MARVEL: ESPECIAL DE 85 ANOS',
  'MARVEL: ESPECIAL DE 85 ANOS',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/KfOx4qao_-7e_b37Bq9XudYTEEU=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/a18b69ae-eb29-11ef-a4f3-5a40d84dae09.jpg"]'::jsonb,
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
  'PROD-01825',
  'MARVELS (MARVEL-VERSE) N.1',
  'MARVELS (MARVEL-VERSE) N.1',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/W4lmoIKOorryD0Y8D8SlTXsE510=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/b2312ad8-d819-11ee-947a-32937b3ded24.jpg"]'::jsonb,
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
  'PROD-01826',
  'MARVELS ANOTADO (MARVEL GIGANTE)',
  'MARVELS ANOTADO (MARVEL GIGANTE)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/M3bzQPH-KIN5gS6Y6PO1WtY0ukY=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/a57bb208-eb29-11ef-913d-52f5d450f8a6.jpg"]'::jsonb,
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
  'PROD-01827',
  'MASHLE: MAGIA E MÚSCULOS - 01 [REB]',
  'MASHLE: MAGIA E MÚSCULOS - 01 [REB]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/VsYg5XuWEbWPqb4YyZUqWoNZ9mE=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/598697f2-5ea9-11f0-bc5c-8a0b5d172c0d.jpg"]'::jsonb,
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
  'PROD-01828',
  'MASHLE: MAGIA E MÚSCULOS - 02 [REB]',
  'MASHLE: MAGIA E MÚSCULOS - 02 [REB]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/xfBPX_Gp3qRPbC_lxNh4ANqF0bk=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/59bb2710-5ea9-11f0-a034-4eae30e658d1.jpg"]'::jsonb,
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
  'PROD-01829',
  'MASHLE: MAGIA E MÚSCULOS - 03 [REB]',
  'MASHLE: MAGIA E MÚSCULOS - 03 [REB]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/67EH7ueO6UrnLigHvWERY2InsVY=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/59f75cbc-5ea9-11f0-a034-4eae30e658d1.jpg"]'::jsonb,
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
  'PROD-01830',
  'MASHLE: MAGIA E MÚSCULOS - 04 [REB]',
  'MASHLE: MAGIA E MÚSCULOS - 04 [REB]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/dFXKaF1mNv7E9n4zlJqHEAVa5Go=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/5aa3c25e-5ea9-11f0-a034-4eae30e658d1.jpg"]'::jsonb,
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
  'PROD-01831',
  'MASHLE: MAGIA E MÚSCULOS - 05 [REB]',
  'MASHLE: MAGIA E MÚSCULOS - 05 [REB]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/LmUYP9gOVDWYgQjKS6MZoFmz6E0=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/5a9f396e-5ea9-11f0-bc5c-8a0b5d172c0d.jpg"]'::jsonb,
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
  'PROD-01832',
  'MASHLE: MAGIA E MÚSCULOS - 10',
  'MASHLE: MAGIA E MÚSCULOS - 10',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/8MEgoLV1cGdPuHvXcoPXGYm1Dac=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/3d6a2dba-7fd1-11f0-b894-2e1dcafaddd0.jpg"]'::jsonb,
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
  'PROD-01833',
  'MASHLE: MAGIA E MÚSCULOS - 12',
  'MASHLE: MAGIA E MÚSCULOS - 12',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/K3YWbMhORJRYaTwj1UvK_NL85-I=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/1a8e340a-d819-11ee-947a-32937b3ded24.jpg"]'::jsonb,
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
  'PROD-01834',
  'MASHLE: MAGIA E MÚSCULOS - 16',
  'MASHLE: MAGIA E MÚSCULOS - 16',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/ygBE_lG6DHdIU5MjX9tYn0Ci9pE=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/e91eb822-eb4a-11ef-8230-fa812316df6c.jpg"]'::jsonb,
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
  'PROD-01835',
  'MASHLE: MAGIA E MÚSCULOS - 17',
  'MASHLE: MAGIA E MÚSCULOS - 17',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/JrQFXXzdELByllbqOa9lAuP5hBo=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/c78a6eb4-f616-11ef-9832-9e7a01352361.jpg"]'::jsonb,
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
  'PROD-01836',
  'MASHLE: MAGIA E MÚSCULOS - 18',
  'MASHLE: MAGIA E MÚSCULOS - 18',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/Tx8dOQzjrmrjhF1iSVMc_KHovu0=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/58a3faac-2473-11f0-80eb-56ac2f24b505.jpg"]'::jsonb,
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
  'PROD-01837',
  'MASHLE: MAGIA E MÚSCULOS - 9',
  'MASHLE: MAGIA E MÚSCULOS - 9',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/K5RhPo8SYapzw3xY7zRBFdEDrkg=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/196f4758-d819-11ee-b57d-56e6c271e0a3.jpg"]'::jsonb,
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
  'PROD-01838',
  'MASHLE: MAGIA E MÚSCULOS N.11',
  'MASHLE: MAGIA E MÚSCULOS N.11',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/uW-nGls8dWjJQGiPU9FAhbbYQL0=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/1a299cde-d819-11ee-89ed-e2697ce33d53.jpg"]'::jsonb,
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
  'PROD-01839',
  'MASHLE: MAGIA E MÚSCULOS N.13',
  'MASHLE: MAGIA E MÚSCULOS N.13',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/re8gluknZkJXDRqIA1FltVoSe_4=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/d22d4140-119a-11ef-a951-1a13f4f3a32a.jpg"]'::jsonb,
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
  'PROD-01840',
  'MASHLE: MAGIA E MÚSCULOS N.14',
  'MASHLE: MAGIA E MÚSCULOS N.14',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/sW6fTsP8Uq4QVltiGLJSrWw7zRY=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/843b83be-4e7d-11ef-a6a6-6a75532b239b.jpg"]'::jsonb,
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
  'PROD-01841',
  'MASHLE: MAGIA E MÚSCULOS N.15',
  'MASHLE: MAGIA E MÚSCULOS N.15',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/IwiuZl5chGXKfqbsY2bXdrBXD8E=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/85235308-7fa9-11ef-b1d0-12caec0ea15c.jpg"]'::jsonb,
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
  'PROD-01842',
  'MAURICIO DE SOUSA: EDICAO DO ARTISTA - MONICA',
  'MAURICIO DE SOUSA: EDICAO DO ARTISTA - MONICA',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/-Yi6Ui_XjfMD63IJoZCYUcn95OQ=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/8de8e36c-da7d-11ee-b58c-b67307b9a4e9.jpg"]'::jsonb,
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
  'PROD-01843',
  'MELHORES HISTORIAS DA MONICA POR MONICA N.1',
  'MELHORES HISTORIAS DA MONICA POR MONICA N.1',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/hp6gXOLbDNv0NE6Agg1IK9tlR58=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/46a7eeb4-d819-11ee-9675-5a86bcbeb6e3.jpg"]'::jsonb,
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
  'PROD-01844',
  'MENINA DA LUA E O DINOSSAURO DEMONIO (MARVEL-VERSE)',
  'MENINA DA LUA E O DINOSSAURO DEMONIO (MARVEL-VERSE)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/1HxrLg3g316zeOy_J99O_W3IR2Y=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/19327fb0-d89d-11ee-ab21-7e5d6a64b034.jpg"]'::jsonb,
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
  'PROD-01845',
  'MERMAID MELODY - PICHI PICHI PITCH - 1',
  'MERMAID MELODY - PICHI PICHI PITCH - 1',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/s1edorftVOJvwntV-3FZrzy_8Kc=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/fa00bb22-eb4a-11ef-8230-fa812316df6c.jpg"]'::jsonb,
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
  'PROD-01846',
  'MERMAID MELODY - PICHI PICHI PITCH - 2',
  'MERMAID MELODY - PICHI PICHI PITCH - 2',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/ZLXLWueDReuFcawjLHBLHtb3vx4=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/a6b09698-eb29-11ef-8b75-5ac0f052206d.jpg"]'::jsonb,
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
  'PROD-01847',
  'MERMAID MELODY - PICHI PICHI PITCH - 3',
  'MERMAID MELODY - PICHI PICHI PITCH - 3',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/2npx75AiVV_JfbZ3yn0G_DEGhS0=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/cc92affc-f616-11ef-aca5-de7ac4d61988.jpg"]'::jsonb,
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
  'PROD-01848',
  'MEU CASAMENTO FELIZ  - 1',
  'MEU CASAMENTO FELIZ  - 1',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/AHul4yrcZ1uvQYBDHt0R-TpF4LI=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/2c29d28a-a4ac-11f0-a72e-eecb83d78201.jpg"]'::jsonb,
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
  'PROD-01849',
  'MICKEY ALL STARS (BD DISNEY)',
  'MICKEY ALL STARS (BD DISNEY)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/QwqZyaOnP6GhEANowkf4xSzuq2o=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/f85fb0d8-d819-11ee-9cda-5a86bcbeb6e3.jpg"]'::jsonb,
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
  'PROD-01850',
  'MICKEY ATRAVES DOS SECULOS (BD DISNEY)',
  'MICKEY ATRAVES DOS SECULOS (BD DISNEY)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/43jz84Y0tBYLw8foVbRaHet17iM=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/cc944c22-f616-11ef-8e8f-2263951fa8a2.jpg"]'::jsonb,
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