-- SQL para importar produtos Brancaleone
-- Gerado em: 2025-10-17T18:20:53.612Z
-- Total de produtos: 3363
-- Fonte: brancaleone-products-1760723254011.json

-- 1. Criar distribuidor (se não existir)

-- Distribuidor já criado no batch-001

-- Lote 2 de 68
-- Produtos: 101 até 200



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-00051',
  'A GANCHO N.2',
  'A GANCHO N.2',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/zVZPP92SAs6N2Te0caOhIB1fry0=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/1a2bec7c-3350-11ef-8e13-6206394e6409.jpg"]'::jsonb,
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
  'PROD-00052',
  'A GANCHO VOL. 01',
  'A GANCHO VOL. 01',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/-3ct2rybCtfFsL09kNWy8_Mlg_Q=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/62916968-da9c-11ee-b415-da2490dbf0ff.jpg"]'::jsonb,
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
  'PROD-00053',
  'A ILHA DO TERROR (BD DISNEY)',
  'A ILHA DO TERROR (BD DISNEY)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/xYnFOlwRvHNQDNNab75ijcejzck=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/03beeea0-1ca6-11ef-b80c-228c440649c1.jpg"]'::jsonb,
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
  'PROD-00054',
  'A INCONTROLAVEL PATRULHA DO DESTINO',
  'A INCONTROLAVEL PATRULHA DO DESTINO',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/6SehYK0pJRuinQVQN5izczbXqoA=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/8ef1f43e-3692-11f0-a9ef-e679d989cbbb.jpg"]'::jsonb,
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
  'PROD-00055',
  'A JORNADA DO SUPER-HEROI',
  'A JORNADA DO SUPER-HEROI',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/f-hGo6lb7FjbMw1pZXkzs_ZMXCM=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/6eec8b2a-eb26-11ef-888a-2a856f41baa0.jpg"]'::jsonb,
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
  'PROD-00056',
  'A JOVEM DIANA VOL.02',
  'A JOVEM DIANA VOL.02',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/c5LwHirUGmCyjCjziSVDFcOo1z8=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/6ebb0b2c-eb26-11ef-a139-0af602f41cb0.jpg"]'::jsonb,
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
  'PROD-00057',
  'A JOVEM DIANA VOL.1',
  'A JOVEM DIANA VOL.1',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/nsEA0wut6FYiad3OxD1HJL99ZQ8=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/7cc4462a-4e7d-11ef-8b01-66fb588c5617.jpg"]'::jsonb,
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
  'PROD-00058',
  'A JUVENTUDE DE MICKEY (BD DISNEY)',
  'A JUVENTUDE DE MICKEY (BD DISNEY)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/Rk-z7ZeUMAK9HJYwKqu7O4VFdlg=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/40f8c176-7fd1-11f0-a5af-de5e70a27ff7.jpg"]'::jsonb,
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
  'PROD-00059',
  'A LANÇA LENDARIA E O ESCUDO IMPENETRAVEL - 1',
  'A LANÇA LENDARIA E O ESCUDO IMPENETRAVEL - 1',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/OcJg7OAztUfQf5j88iJLvIunGgY=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/c51c23d0-63e4-11ef-9cd1-4e5286e17d7d.png"]'::jsonb,
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
  'PROD-00060',
  'A LANÇA LENDARIA E O ESCUDO IMPENETRAVEL - 2',
  'A LANÇA LENDARIA E O ESCUDO IMPENETRAVEL - 2',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/LmD0IacHfTXeVmkHY5gncuk1eac=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/6e7beab4-eb26-11ef-b309-de9e9a61a672.jpg"]'::jsonb,
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
  'PROD-00061',
  'A LANÇA LENDARIA E O ESCUDO IMPENETRAVEL - 3',
  'A LANÇA LENDARIA E O ESCUDO IMPENETRAVEL - 3',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/NmShqIJNj8cdrxuu6zsWNmw6fmA=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/ae6fca5e-ee29-11ef-97c0-4eddcfde9ad5.jpg"]'::jsonb,
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
  'PROD-00062',
  'A LANÇA LENDARIA E O ESCUDO IMPENETRAVEL - 4',
  'A LANÇA LENDARIA E O ESCUDO IMPENETRAVEL - 4',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/ep8YqTR-ZHKCZGHTt7LrkqVy_-g=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/8e93d7fa-3692-11f0-b6e7-d6897a03fa64.jpg"]'::jsonb,
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
  'PROD-00063',
  'A LENDA DE LADY BYEOKSA',
  'A LENDA DE LADY BYEOKSA',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/-_GqgAiqK1K1-KndCWo6QtSczj0=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/6105eece-5ea9-11f0-a034-4eae30e658d1.jpg"]'::jsonb,
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
  'PROD-00064',
  'A MISTERIOSA LOJA DE PENHORES',
  'A MISTERIOSA LOJA DE PENHORES',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/_mYkBamLzU07lF3nFbxSpPnc7D4=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/6161c906-5ea9-11f0-be82-febfa26cb361.jpg"]'::jsonb,
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
  'PROD-00065',
  'A ODISSEIA (GRAPHICS DISNEY) N.1',
  'A ODISSEIA (GRAPHICS DISNEY) N.1',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/eof3ehbdUt-DGTCGNULUHkbb6I8=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/c644070a-63e4-11ef-858c-be57bbf68619.png"]'::jsonb,
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
  'PROD-00066',
  'A ORDEM MAGICA VOL.03',
  'A ORDEM MAGICA VOL.03',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/2Ewtn9emoAEDdPnGO4nSklCK4M4=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/72dd097c-da7d-11ee-87ab-b67307b9a4e9.jpg"]'::jsonb,
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
  'PROD-00067',
  'A PEQUENA LOJA DE CONVENIÊNCIAS  DA GALÁXIA',
  'A PEQUENA LOJA DE CONVENIÊNCIAS  DA GALÁXIA',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/R27SAp1EqNpzVmwnK3A3Zr36YEM=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/605c91da-5ea9-11f0-a034-4eae30e658d1.jpg"]'::jsonb,
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
  'PROD-00068',
  'A QUEDA DE X ESPECIAL N. 01',
  'A QUEDA DE X ESPECIAL N. 01',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/EHApev9uLMD8ZoQfrYvMUEWeNQg=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/8d17504e-4e7d-11ef-8179-b2d60c13b884.jpg"]'::jsonb,
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
  'PROD-00069',
  'A QUEDA DE X N.2',
  'A QUEDA DE X N.2',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/gyayVagUWDcPevqrjCaNMuUpscA=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/8878a95e-7fa9-11ef-b0bc-6e97175de7f7.jpg"]'::jsonb,
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
  'PROD-00070',
  'A QUEDA DE X VOL. N.3',
  'A QUEDA DE X VOL. N.3',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/qdAkfpDV6XXCrPwxabKjItrM4dk=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/8884cdc4-7fa9-11ef-b1d0-12caec0ea15c.jpg"]'::jsonb,
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
  'PROD-00071',
  'A SAGA DA LIGA DA JUSTICA VOL.01/24',
  'A SAGA DA LIGA DA JUSTICA VOL.01/24',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/kCewCplqF36HVyxg-C7xM7F7NGk=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/5b14ffac-2473-11f0-b868-ae6ee18ee784.jpg"]'::jsonb,
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
  'PROD-00072',
  'A SAGA DA LIGA DA JUSTICA VOL.02/25',
  'A SAGA DA LIGA DA JUSTICA VOL.02/25',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/PwKctmfehBVyA3KNeeytlGPRXtw=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/1f639fdc-69af-11f0-ae5d-0ebdcf797c5e.jpg"]'::jsonb,
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
  'PROD-00073',
  'A SAGA DA LIGA DA JUSTICA VOL.03/26',
  'A SAGA DA LIGA DA JUSTICA VOL.03/26',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/kyDTziZyoH0gtCDwZaW7vOhC7_s=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/50b2d9a0-8b5f-11f0-b3d9-165df9e621a1.jpg"]'::jsonb,
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
  'PROD-00074',
  'A SAGA DA LIGA DA JUSTICA VOL.05/21',
  'A SAGA DA LIGA DA JUSTICA VOL.05/21',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/iJ3s1ZbAnWafdaNIhH9U4aUk4rk=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/6f993b68-eb26-11ef-95f7-fa812316df6c.jpg"]'::jsonb,
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
  'PROD-00075',
  'A SAGA DA LIGA DA JUSTICA VOL.06/22',
  'A SAGA DA LIGA DA JUSTICA VOL.06/22',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/dDzp3seJk_gxSx5XI_N66eP4f7k=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/6f9f01ba-eb26-11ef-bb6e-e278ee2205e8.jpg"]'::jsonb,
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
  'PROD-00076',
  'A SAGA DA LIGA DA JUSTICA VOL.07/23',
  'A SAGA DA LIGA DA JUSTICA VOL.07/23',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/FeqUF85A60IyTDeoAd4QRylzaDo=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/ff559570-feb9-11ef-b6c6-4a91a624d386.jpg"]'::jsonb,
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
  'PROD-00077',
  'A SAGA DA LIGA DA JUSTICA VOL.17',
  'A SAGA DA LIGA DA JUSTICA VOL.17',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/hAM9TQNYsvHNvuORyxN-TyNXJYU=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/49f4be78-e497-11ee-83ff-7ee42cfe9644.jpg"]'::jsonb,
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
  'PROD-00078',
  'A SAGA DA LIGA DA JUSTICA VOL.18',
  'A SAGA DA LIGA DA JUSTICA VOL.18',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/4szTrQBIBN-qyvkBayxS3qeLg9Y=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/03d5d58e-1ca6-11ef-b80c-228c440649c1.jpg"]'::jsonb,
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
  'PROD-00079',
  'A SAGA DA LIGA DA JUSTICA VOL.19',
  'A SAGA DA LIGA DA JUSTICA VOL.19',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/jaAsAjOFSAv9l3PHx40KdSk9q-0=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/1a563360-3350-11ef-8e13-6206394e6409.jpg"]'::jsonb,
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
  'PROD-00080',
  'A SAGA DA LIGA DA JUSTICA VOL.20',
  'A SAGA DA LIGA DA JUSTICA VOL.20',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/lJybLjLlunH0lTr_fTiA32U8ar8=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/896bad2a-7fa9-11ef-b1d0-12caec0ea15c.jpg"]'::jsonb,
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
  'PROD-00081',
  'A SAGA DA MULHER-MARAVILHA N.3',
  'A SAGA DA MULHER-MARAVILHA N.3',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/a0uNEWPAyplVOjZYt1p7xnXlC2k=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/cfceeaec-63e4-11ef-8233-ba818e5f55ac.png"]'::jsonb,
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
  'PROD-00082',
  'A SAGA DA MULHER-MARAVILHA VOL.04',
  'A SAGA DA MULHER-MARAVILHA VOL.04',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/3ysgkwbqxy4wwSZh7bdbvwsgwDo=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/6fd3d89a-eb26-11ef-8bd0-0ee70347c223.jpg"]'::jsonb,
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
  'PROD-00083',
  'A SAGA DA MULHER-MARAVILHA VOL.05',
  'A SAGA DA MULHER-MARAVILHA VOL.05',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/FASqJ5MKFIQ-SzJt0jJAw9dvLbo=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/6fe8860a-eb26-11ef-b309-de9e9a61a672.jpg"]'::jsonb,
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
  'PROD-00084',
  'A SAGA DA MULHER-MARAVILHA VOL.08/01',
  'A SAGA DA MULHER-MARAVILHA VOL.08/01',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/XcyJS47Ec6YI43YH0Qu7Kz1CRWY=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/433519d0-7fd1-11f0-a5af-de5e70a27ff7.jpg"]'::jsonb,
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
  'PROD-00085',
  'A SAGA DO BATMAN N.38',
  'A SAGA DO BATMAN N.38',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/P-Ioni2I79lZnr3ACWjPbAMGHQ0=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/04063d64-1ca6-11ef-bc32-def7b1441874.jpg"]'::jsonb,
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
  'PROD-00086',
  'A SAGA DO BATMAN N.41',
  'A SAGA DO BATMAN N.41',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/m4WEdaL4n6jpOAqBZ7y04tl3rZ0=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/6f1ee11a-eb26-11ef-b1a7-bea26c591a3a.jpg"]'::jsonb,
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
  'PROD-00087',
  'A SAGA DO BATMAN VOL. 06/42',
  'A SAGA DO BATMAN VOL. 06/42',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/MAr6-oiP55xBndXssXlXViS3r7w=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/88d096fa-7fa9-11ef-b0bc-6e97175de7f7.jpg"]'::jsonb,
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
  'PROD-00088',
  'A SAGA DO BATMAN VOL. 08/44',
  'A SAGA DO BATMAN VOL. 08/44',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/82jrI-V_PfJrJdT3M8hQYVZVaj8=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/6f55d3d2-eb26-11ef-888a-2a856f41baa0.jpg"]'::jsonb,
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
  'PROD-00089',
  'A SAGA DO BATMAN VOL. 09/45',
  'A SAGA DO BATMAN VOL. 09/45',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/c_e1cwrHyHAkdrV_quDJoS0QPyY=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/6f76da0a-eb26-11ef-b1a7-bea26c591a3a.jpg"]'::jsonb,
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
  'PROD-00090',
  'A SAGA DO BATMAN VOL. 10/46',
  'A SAGA DO BATMAN VOL. 10/46',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/Qx6eR5crtcSoiYqnXJmThZd-xYk=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/ce87e770-eb47-11ef-80c6-0ee70347c223.jpg"]'::jsonb,
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
  'PROD-00091',
  'A SAGA DO BATMAN VOL. 11/47',
  'A SAGA DO BATMAN VOL. 11/47',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/5ThVX4andMsaC_omnGHPKs_0I-E=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/b1db78b4-ee29-11ef-9624-227a9b128a4e.jpg"]'::jsonb,
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
  'PROD-00092',
  'A SAGA DO BATMAN VOL. 12/48',
  'A SAGA DO BATMAN VOL. 12/48',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/tC8tMoubMWHtWpSuBKFvjkYwdZk=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/d08faea0-0ea0-11f0-9ccc-5a780ec1dfef.jpg"]'::jsonb,
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
  'PROD-00093',
  'A SAGA DO BATMAN VOL. 14/50',
  'A SAGA DO BATMAN VOL. 14/50',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/PS3AmV7_3YN0lKoHBhtjrOR7bVY=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/f443605e-9031-11f0-82c8-4a06203c34dc.jpg"]'::jsonb,
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
  'PROD-00094',
  'A SAGA DO BATMAN VOL. 15/51',
  'A SAGA DO BATMAN VOL. 15/51',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/BJjvQCTJ9Nj8_83jAiuk_DG3vsM=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/f4838db4-9031-11f0-82c8-4a06203c34dc.jpg"]'::jsonb,
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
  'PROD-00095',
  'A SAGA DO BATMAN VOL. 16/52',
  'A SAGA DO BATMAN VOL. 16/52',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/3fWDTe1_7xGhhStR2_kJKyfgYnI=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/42d88a62-7fd1-11f0-b894-2e1dcafaddd0.jpg"]'::jsonb,
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
  'PROD-00096',
  'A SAGA DO BATMAN VOL. 17/53',
  'A SAGA DO BATMAN VOL. 17/53',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/EKEMzsFe72bFDSPts709shO1cDg=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/f49f7da8-9031-11f0-82c8-4a06203c34dc.jpg"]'::jsonb,
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
  'PROD-00097',
  'A SAGA DO BATMAN VOL. 18/54',
  'A SAGA DO BATMAN VOL. 18/54',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/Jky0ElsBopmp0AQ6vnxk5Y2QkMQ=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/a22f4458-a7c0-11f0-96ab-2e54fc51120d.jpg"]'::jsonb,
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
  'PROD-00098',
  'A SAGA DO FLASH VOL.09',
  'A SAGA DO FLASH VOL.09',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/KijuepZl-zf0tlXKX-B_ngDTc8E=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/88f39128-7fa9-11ef-b1d0-12caec0ea15c.jpg"]'::jsonb,
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
  'PROD-00099',
  'A SAGA DO FLASH VOL.10',
  'A SAGA DO FLASH VOL.10',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/vv2vDoVeJhE3FVZ5LKaxsNbP5XY=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/b2f595b8-ee29-11ef-9ffd-5ecca552aa97.jpg"]'::jsonb,
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
  'PROD-00100',
  'A SAGA DO FLASH VOL.11',
  'A SAGA DO FLASH VOL.11',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/35t-UJ9LcIfKdZjDGtb5uQ5-9_c=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/b2fd70e4-ee29-11ef-b823-265cac193354.jpg"]'::jsonb,
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