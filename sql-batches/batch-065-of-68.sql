-- SQL para importar produtos Brancaleone
-- Gerado em: 2025-10-17T18:20:53.612Z
-- Total de produtos: 3363
-- Fonte: brancaleone-products-1760723254011.json

-- 1. Criar distribuidor (se não existir)

-- Distribuidor já criado no batch-001

-- Lote 65 de 68
-- Produtos: 6401 até 6500



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-03201',
  'VINGADORES SEM LIMITES',
  'VINGADORES SEM LIMITES',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/aYAigT_zFmdyQk3gx0W90--QxdU=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/c9019b62-d8a0-11ee-98e4-5a86bcbeb6e3.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-03202',
  'VINGADORES: BEYONDER',
  'VINGADORES: BEYONDER',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/9kikGqBuxhFugOgjd5cR7Ph86zE=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/d3559510-eb4a-11ef-8621-0ee70347c223.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-03203',
  'VINGADORES: GUERRA ATRAV N.1',
  'VINGADORES: GUERRA ATRAV N.1',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/i3qrvhlq2xBdAWf19hxBAKo6zF4=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/b2d0a300-d81a-11ee-9df9-5a86bcbeb6e3.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-03204',
  'VINGADORES: HOMEM-FORMIGA, SCOTT LANG (MARVEL VINTAGE)',
  'VINGADORES: HOMEM-FORMIGA, SCOTT LANG (MARVEL VINTAGE)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/C24DPVkww6OBRTUnjkAX7vfGx3E=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/cea9a168-d8a0-11ee-98e4-5a86bcbeb6e3.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-03205',
  'VINLAND SAGA DELUXE - 3 [REB2]',
  'VINLAND SAGA DELUXE - 3 [REB2]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/encYX9cGUbpfohCDnBipR0AEAAw=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/00d4d794-feba-11ef-be87-faf37657fe60.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-03206',
  'VINLAND SAGA DELUXE - 4 [REB2]',
  'VINLAND SAGA DELUXE - 4 [REB2]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/IEW57qS0LdJgLtkUzm0geMnwg58=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/01391808-feba-11ef-8685-6a791d69f614.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-03207',
  'VINLAND SAGA DELUXE - 6 [REB]',
  'VINLAND SAGA DELUXE - 6 [REB]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/_yEOr_A2EkdyJsiJRK6b4zP2jQg=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/b08591d2-eb29-11ef-9927-fa812316df6c.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-03208',
  'VINLAND SAGA N.2',
  'VINLAND SAGA N.2',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/XV4D_bDSftCMLHQONyeGzN0wTVM=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/8576f4c2-7fa9-11ef-b1d0-12caec0ea15c.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-03209',
  'VINLAND SAGA N.27',
  'VINLAND SAGA N.27',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/VN-SQXhzty0oLDpwqR-IA4doM6Y=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/692e7af4-da9c-11ee-be2d-3226a44a89fc.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-03210',
  'VINLAND SAGA N.3',
  'VINLAND SAGA N.3',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/CnCfDPELz5DHFhno_ZyIHzDdDz0=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/8571b3e0-7fa9-11ef-b0bc-6e97175de7f7.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-03211',
  'VINLAND SAGA N.4',
  'VINLAND SAGA N.4',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/RUDbfL-2yJqbIAVOf-GJxjTRtb8=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/858cb1d6-7fa9-11ef-b0bc-6e97175de7f7.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-03212',
  'VINLAND SAGA N.5',
  'VINLAND SAGA N.5',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/jdVP5N-4fqqA8NdPAAi0oEA1loU=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/859fbab0-7fa9-11ef-b0bc-6e97175de7f7.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-03213',
  'VISAO (MARVEL ESSENCIAIS)',
  'VISAO (MARVEL ESSENCIAIS)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/9cTX1NrTDjpmL5H7ppQFN5jh-5g=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/2c4b1be8-a4ac-11f0-a599-8e83af06c4a6.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-03214',
  'VIUVA-NEGRA: TEIA DE INTRIGAS N.1',
  'VIUVA-NEGRA: TEIA DE INTRIGAS N.1',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/zFq71HxwPmP00-9snq6hlffzslo=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/4e500914-e497-11ee-83ff-7ee42cfe9644.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-03215',
  'VOCE ME DEIXA SEM FOLEGO - 03',
  'VOCE ME DEIXA SEM FOLEGO - 03',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/iaFWEB6X9jNbrB7Vx3jchRXp8uE=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/99121d86-eb29-11ef-b1d3-def782e2bf12.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-03216',
  'VOCÊ ME DEIXA SEM FÔLEGO - 4',
  'VOCÊ ME DEIXA SEM FÔLEGO - 4',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/W0l90miAq-Scyzi9TKZ3HqSR5po=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/c34a8d0c-f616-11ef-9565-f2e31ca8a769.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-03217',
  'VOCÊ ME DEIXA SEM FÔLEGO - 5',
  'VOCÊ ME DEIXA SEM FÔLEGO - 5',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/mi6ZaIK7cEDwKRZk6vPpJzlShK0=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/1b7b97d0-48b7-11f0-9d89-9eda44bc3e04.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-03218',
  'VOCE ME DEIXA SEM FOLEGO - N. 01',
  'VOCE ME DEIXA SEM FOLEGO - N. 01',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/x7aVQudUIBADwSwjKxe6eqDRdG8=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/27cdd696-2ce4-11ef-a9d6-52a12b2a7219.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-03219',
  'VOCE ME DEIXA SEM FOLEGO - N. 02',
  'VOCE ME DEIXA SEM FOLEGO - N. 02',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/ND5Bq-PhD3vHVpfLYqKYfkIZi_w=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/c72d1df0-63e4-11ef-9c41-c67e4ff8d839.png"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-03220',
  'VOU ME APAIXONAR POR VOCE MESMO ASSIM - 1',
  'VOU ME APAIXONAR POR VOCE MESMO ASSIM - 1',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/7MXQZm4IWBdJntjuKEb65uTw0QY=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/784de33a-4e7d-11ef-876a-e24de145a09c.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-03221',
  'VOU ME APAIXONAR POR VOCE MESMO ASSIM - 2',
  'VOU ME APAIXONAR POR VOCE MESMO ASSIM - 2',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/iSSpsIGm3k4xZ8IOiLByveHCss8=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/c5bbec62-63e4-11ef-a01d-460951302070.png"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-03222',
  'VOU ME APAIXONAR POR VOCE MESMO ASSIM - 3',
  'VOU ME APAIXONAR POR VOCE MESMO ASSIM - 3',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/JHFORMTwLUnarFT-cM9D9IaYRKg=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/80422828-7fa9-11ef-b0bc-6e97175de7f7.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-03223',
  'VOU ME APAIXONAR POR VOCÊ MESMO ASSIM - 4',
  'VOU ME APAIXONAR POR VOCÊ MESMO ASSIM - 4',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/X5kG9nVt5f_89KNJ-70VBHSdOIQ=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/d8e8581e-eb4a-11ef-8230-fa812316df6c.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-03224',
  'VOU ME APAIXONAR POR VOCÊ MESMO ASSIM - 5',
  'VOU ME APAIXONAR POR VOCÊ MESMO ASSIM - 5',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/kqDPbe5oof5ZNhcBbyDSMfDC1n0=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/d90ae0aa-eb4a-11ef-8621-0ee70347c223.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-03225',
  'VOU ME APAIXONAR POR VOCÊ MESMO ASSIM - 6',
  'VOU ME APAIXONAR POR VOCÊ MESMO ASSIM - 6',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/3ae9mLKseCCMG_gFkC6rTUqpkPU=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/9655d0ba-eb29-11ef-9927-fa812316df6c.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-03226',
  'VOU ME APAIXONAR POR VOCÊ MESMO ASSIM - 7',
  'VOU ME APAIXONAR POR VOCÊ MESMO ASSIM - 7',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/RtFZtciYQIS64lE4MZWGjlzCPPU=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/9665c236-eb29-11ef-8b75-5ac0f052206d.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-03227',
  'VOU ME APAIXONAR POR VOCÊ MESMO ASSIM - 8',
  'VOU ME APAIXONAR POR VOCÊ MESMO ASSIM - 8',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/PCz6cHTb83QWqTmcR_iDuskRgLQ=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/804cb766-08c5-11f0-ba3b-324bf2c8101d.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-03228',
  'VOU ME APAIXONAR POR VOCÊ MESMO ASSIM - 9',
  'VOU ME APAIXONAR POR VOCÊ MESMO ASSIM - 9',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/A3R4WIfNeT0li21OfdWq6fLvmEE=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/d8c7ca2a-3f2f-11f0-87b4-c2502d24ff3f.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-03229',
  'VOZES DA MARVEL: ORGULHO',
  'VOZES DA MARVEL: ORGULHO',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/_rVAFgh42aSkWeSgeaEa2a0Etf0=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/d1bbf2fa-63e4-11ef-aad4-727f596e106b.png"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-03230',
  'VOZES DA MARVEL: ORGULHO (2023)',
  'VOZES DA MARVEL: ORGULHO (2023)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/tjETChv5USSvn0X5w0WUoaUxJcI=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/bb0ec006-d81a-11ee-9df9-5a86bcbeb6e3.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-03231',
  'VOZES DA MARVEL: ORGULHO (2025)',
  'VOZES DA MARVEL: ORGULHO (2025)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/EZIy8qwSEa685w3R-M7lXnqjjhw=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/24c341fc-6f3c-11f0-9cf1-c2c01d897fb1.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-03232',
  'VXE: JUIZO FINAL VOL.02',
  'VXE: JUIZO FINAL VOL.02',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/M7SzWVMIBvmcmutVIx13Ve_ZhgI=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/bbd2ef08-d81a-11ee-9df9-5a86bcbeb6e3.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-03233',
  'W0RLDTR33: TERROR DIGITAL VOL.01',
  'W0RLDTR33: TERROR DIGITAL VOL.01',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/hDC7P8fiy8LXfqIVCzRRDpQT-ac=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/b16f20ae-eb29-11ef-9927-fa812316df6c.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-03234',
  'W0RLDTR33: TERROR DIGITAL VOL.02',
  'W0RLDTR33: TERROR DIGITAL VOL.02',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/j_VqDMi4xRaPsN59XIfIsDeG52Y=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/8275f15c-4dac-11f0-869e-c68fdf865aae.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-03235',
  'WALLER VS WILDSTORM N.1',
  'WALLER VS WILDSTORM N.1',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/3ks-qSLxvgwhvyEWCTyK4lRskT4=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/d1d04c8c-63e4-11ef-9cd1-4e5286e17d7d.png"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-03236',
  'WARLOCK: RENASCIMENTO (LENDAS MARVEL)',
  'WARLOCK: RENASCIMENTO (LENDAS MARVEL)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/c4OlAyEXzTOyPaYAbPhGL82G1iw=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/fb56d546-d89b-11ee-9fe6-c2d9e886ee20.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-03237',
  'WARLOCK: SEGUNDO ADVENTO (MARVEL VINTAGE)',
  'WARLOCK: SEGUNDO ADVENTO (MARVEL VINTAGE)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/k4Cj1CFBE3giY4QeiBKYQyb_NEk=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/6c74ad5a-da9c-11ee-be2d-3226a44a89fc.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-03238',
  'WATCHMEN (DC DE BOLSO) [REB2]',
  'WATCHMEN (DC DE BOLSO) [REB2]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/R3hDPwax-oMW8xRyeG37NBKrtEQ=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/21d8398e-a4ac-11f0-ac43-c20d3852b6b7.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-03239',
  'WE NEVER LEARN - 01 [REB]',
  'WE NEVER LEARN - 01 [REB]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/wwh4RH4m9xfcMAjCltdJPqZeh44=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/a4ec2a8e-eb29-11ef-a4f3-5a40d84dae09.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-03240',
  'WE NEVER LEARN - 02 [REB]',
  'WE NEVER LEARN - 02 [REB]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/lMhTOQkWk3oYU1vUb6BX3zwFALU=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/ef28322a-eb4a-11ef-8230-fa812316df6c.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-03241',
  'WE NEVER LEARN - 03 [REB]',
  'WE NEVER LEARN - 03 [REB]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/4lzuP-mkOy3uLFQhWkWk1mwp4M4=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/f02c5e1c-eb4a-11ef-8230-fa812316df6c.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-03242',
  'WE NEVER LEARN - 04 [REB]',
  'WE NEVER LEARN - 04 [REB]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/HOuIa6Wx-esyLQ3pznaU2bF-1vk=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/f1352258-eb4a-11ef-8230-fa812316df6c.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-03243',
  'WE NEVER LEARN - 05 [REB]',
  'WE NEVER LEARN - 05 [REB]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/GfwGkNuDChT6Jk9kS9EweeASnFM=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/f194ede6-eb4a-11ef-8230-fa812316df6c.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-03244',
  'WE NEVER LEARN - 06 [REB]',
  'WE NEVER LEARN - 06 [REB]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/x2pwMyCZQo5bz0LNS3fGd8bPics=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/f1703974-eb4a-11ef-8230-fa812316df6c.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-03245',
  'WE NEVER LEARN - 07 [REB]',
  'WE NEVER LEARN - 07 [REB]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/jAyIpDkVyeO1hsn2xwxFRwrzSDU=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/f1fcc4f2-eb4a-11ef-8230-fa812316df6c.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-03246',
  'WE NEVER LEARN - 08 [REB]',
  'WE NEVER LEARN - 08 [REB]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/nVj6cB-tiy_ukYyFCf8VJNIyIBM=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/f2dd7182-eb4a-11ef-8230-fa812316df6c.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-03247',
  'WE NEVER LEARN - 09 [REB]',
  'WE NEVER LEARN - 09 [REB]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/Z76LG2pb2moEhwfrul6AdFjWClE=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/f2fd371a-eb4a-11ef-8230-fa812316df6c.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-03248',
  'WE NEVER LEARN - 10 [REB]',
  'WE NEVER LEARN - 10 [REB]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/AF9x3PZXeWxzE534KmPS_FLg7mQ=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/f3c69632-eb4a-11ef-8230-fa812316df6c.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-03249',
  'WE3 - EDICAO DE LUXO',
  'WE3 - EDICAO DE LUXO',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/F87usLfg4v6W27p7stMwpNOerSo=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/0124f9a4-feba-11ef-b0b8-be00b4f9a4bc.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-03250',
  'WESLEY DODDS: O SANDMAN',
  'WESLEY DODDS: O SANDMAN',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/9-kCizyEUoyNHy-Gu29vNsc76-Q=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/b0d9a89e-eb29-11ef-8b75-5ac0f052206d.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();