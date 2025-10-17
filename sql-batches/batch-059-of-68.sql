-- SQL para importar produtos Brancaleone
-- Gerado em: 2025-10-17T18:20:53.612Z
-- Total de produtos: 3363
-- Fonte: brancaleone-products-1760723254011.json

-- 1. Criar distribuidor (se não existir)

-- Distribuidor já criado no batch-001

-- Lote 59 de 68
-- Produtos: 5801 até 5900



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02901',
  'SUPERMAN E BATMAN: GERACOES (DC OMNIBUS)',
  'SUPERMAN E BATMAN: GERACOES (DC OMNIBUS)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/bFmFv8zRrol5MpVze6duLNAKEos=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/2e0164ee-de36-11ee-b2b6-3e63d4f4f6bf.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02902',
  'SUPERMAN E LOIS LANE : ANIVERSARIO DE 25 ANOS DE CASAMENTO -',
  'SUPERMAN E LOIS LANE : ANIVERSARIO DE 25 ANOS DE CASAMENTO -',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/iFwfP_XDewCMinW9sQMJJFfrqJk=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/861fd2c6-da7d-11ee-999b-aaf7be4593ab.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02903',
  'SUPERMAN ESMAGA A KLAN (DC TEEN) [REB]',
  'SUPERMAN ESMAGA A KLAN (DC TEEN) [REB]',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/90FK26z9VVbdsT7VDZrGoMGcuCY=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/25a4930a-6f3c-11f0-b5d2-36049232c238.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02904',
  'SUPERMAN VS COMIDA - AS REFEICOES DO HOMEM DE ACO - 01',
  'SUPERMAN VS COMIDA - AS REFEICOES DO HOMEM DE ACO - 01',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/S4S9fcBVD7V6NQt-9Wb3Bx1FDIU=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/49ba3cc4-de36-11ee-aae0-ca3362baf0a6.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02905',
  'SUPERMAN VS COMIDA - AS REFEICOES DO HOMEM DE ACO - 02',
  'SUPERMAN VS COMIDA - AS REFEICOES DO HOMEM DE ACO - 02',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/lzxHXAvL8TBcRnkt07CaIcmpRFU=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/6be4ed32-da9c-11ee-be2d-3226a44a89fc.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02906',
  'SUPERMAN VS COMIDA - AS REFEICOES DO HOMEM DE ACO - 03',
  'SUPERMAN VS COMIDA - AS REFEICOES DO HOMEM DE ACO - 03',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/IovHayVm3G5sG5bK6FW6GLznKFA=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/88b782a4-da7d-11ee-999b-aaf7be4593ab.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02907',
  'SUPERMAN/BATMAN VOL. 01 (EDICAO ABSOLUTA)',
  'SUPERMAN/BATMAN VOL. 01 (EDICAO ABSOLUTA)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/WDiSb6TPph_jtKN10_jLBw806IM=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/8b3299de-3692-11f0-a555-0ab818bfd0ea.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02908',
  'SUPERMAN/MULHER-MARAVILHA (GRANDES TESOUROS DC)',
  'SUPERMAN/MULHER-MARAVILHA (GRANDES TESOUROS DC)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/QJrCvR2KK7-Cazpw-lFaxiH6HxY=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/52c01d2a-8b5f-11f0-b3d9-165df9e621a1.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02909',
  'SUPERMAN/SHAZAM (GRANDES TESOUROS DC)',
  'SUPERMAN/SHAZAM (GRANDES TESOUROS DC)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/aerAoA4Oe1gz7U7aLnx_oAtue7M=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/67e20dd4-d81a-11ee-ae87-e2e54ed5f9f7.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02910',
  'SUPERMAN: AJOELHE-SE PERANTE ZOD VOL.01',
  'SUPERMAN: AJOELHE-SE PERANTE ZOD VOL.01',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/0l8PQaHcsP1fbZhQ34C1q4GgP4M=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/ad9d83aa-ee29-11ef-b50b-52169ed8ea49.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02911',
  'SUPERMAN: ANO UM - EDICAO N.1',
  'SUPERMAN: ANO UM - EDICAO N.1',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/BJi_xuBQ20uOalSgi5WhVymZyz0=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/c1861908-d8a0-11ee-9406-061c358a76e0.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02912',
  'SUPERMAN: DIA DO JUIZO FINAL (DC VINTAGE)',
  'SUPERMAN: DIA DO JUIZO FINAL (DC VINTAGE)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/Fpqoc1Q6Jn7nb9NPsl8vFM7h0Qg=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/9e55e2a0-1941-11f0-b283-1e5c1e943676.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02913',
  'SUPERMAN: LACOS',
  'SUPERMAN: LACOS',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/avi0r5zhOHmP_qCDdm45VCVyoM4=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/2afb9bdc-a4ac-11f0-a599-8e83af06c4a6.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02914',
  'SUPERMAN: MUNDOS EM GUERRA VOL. 1 (GRANDES EVENTOS DC)',
  'SUPERMAN: MUNDOS EM GUERRA VOL. 1 (GRANDES EVENTOS DC)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/H8_5ISG2GbO00i3KB8g0IRiepSE=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/5b51b44c-2473-11f0-9552-3254c5e6fae0.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02915',
  'SUPERMAN: O MUNDO',
  'SUPERMAN: O MUNDO',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/TmLcmnQoQO_9yO2FKzQQz6N4j50=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/68405846-5ea9-11f0-b926-022f8a1a6f0a.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02916',
  'SUPERMAN: O QUE HA DE ERRADO COM VERDADE, JUSTICA E UM FUTUR',
  'SUPERMAN: O QUE HA DE ERRADO COM VERDADE, JUSTICA E UM FUTUR',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/Z879Y7Micfvt0mAnXik0VF2xROA=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/43f22c50-7fd1-11f0-b894-2e1dcafaddd0.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02917',
  'SUPERMAN: OS HOMENS DO AMANHA (DC DELUXE)',
  'SUPERMAN: OS HOMENS DO AMANHA (DC DELUXE)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/N3iPcwfyD6E6lIW-3OQ48otAJ-s=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/674e0aa8-d81a-11ee-bd84-e2697ce33d53.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02918',
  'SUPERMAN: PAZ NA TERRA',
  'SUPERMAN: PAZ NA TERRA',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/Gxv6cS88dhPKB4aX8GwjZaLF4Jw=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/440ca224-7fd1-11f0-a5af-de5e70a27ff7.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02919',
  'SUPERMAN: PRESIDENTE LEX (GRANDES EVENTOS DC)',
  'SUPERMAN: PRESIDENTE LEX (GRANDES EVENTOS DC)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/RxbzQ7WCVN0grFbswxVgqsc7-6o=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/c38ff8b0-f616-11ef-941d-de9e7c6e4a26.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02920',
  'SUPERMICKEY (BD DISNEY)',
  'SUPERMICKEY (BD DISNEY)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/1IqMwe7Mn6SuogoTrCGF5suyA-I=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/6035539a-5ea9-11f0-a034-4eae30e658d1.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02921',
  'SURFISTA PRATEADO RENASCIMENTO: LEGADO (LENDAS MARVEL)',
  'SURFISTA PRATEADO RENASCIMENTO: LEGADO (LENDAS MARVEL)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/mU3op953q-XESOuxHXQXJTzZUT8=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/9b2a82a2-eb29-11ef-ba4b-0ee70347c223.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02922',
  'SURFISTA PRATEADO: JUIZO FINAL (GRANDES TESOUROS MARVEL)',
  'SURFISTA PRATEADO: JUIZO FINAL (GRANDES TESOUROS MARVEL)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/BA1Fhj3i7DYP1bbi2XkRfgGVhq0=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/63646b3a-d81a-11ee-bd84-e2697ce33d53.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02923',
  'SURFISTA PRATEADO: PARABOLA (GRANDES TESOUROS MARVEL)',
  'SURFISTA PRATEADO: PARABOLA (GRANDES TESOUROS MARVEL)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/63lD5oq899C2nMdplEW1cJ0BkvQ=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/4926168e-de36-11ee-9846-6255a87f72d4.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02924',
  'SURFISTA PRATEADO: RENASCIMENTO (MARVEL LENDAS) 2',
  'SURFISTA PRATEADO: RENASCIMENTO (MARVEL LENDAS) 2',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/wW_cVIWNYAiAYKHaDrkJhYA9Igs=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/158eb70a-d818-11ee-a3e7-da2373bc7c0b.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02925',
  'SURPREENDENTES X-MEN: CAIXA FANTASMA',
  'SURPREENDENTES X-MEN: CAIXA FANTASMA',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/rpfLc6jWhex0MG5u6ZzcZ4oplHI=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/d586a82c-3f2f-11f0-87b4-c2502d24ff3f.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02926',
  'SURPREENDENTES X-MEN: TALENTOS PERIGOSOS (MARVEL ESSENCIAIS)',
  'SURPREENDENTES X-MEN: TALENTOS PERIGOSOS (MARVEL ESSENCIAIS)',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/C1fq7WJNPo2tWZ31j1xsCdOynRM=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/55a83ff0-fb7c-11ee-bf53-e27a9dd5d6a4.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02927',
  'SWORD ART ONLINE - KISS AND FLY - 22',
  'SWORD ART ONLINE - KISS AND FLY - 22',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/3f50wMCa4mNkfpEXKTizHOtPiy0=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/033939cc-1ca6-11ef-b80c-228c440649c1.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02928',
  'SWORD ART ONLINE - MOON CRADLE 20',
  'SWORD ART ONLINE - MOON CRADLE 20',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/-xFZRgflSHtDDf0glZzar0vsUk4=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/32f82d3a-d818-11ee-a1cf-e2e54ed5f9f7.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02929',
  'SWORD ART ONLINE - ROMANCES (NOVELS)  N.23',
  'SWORD ART ONLINE - ROMANCES (NOVELS)  N.23',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/33-RX7lKADvP9H1FR95f6RcsGgI=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/c7cbec28-63e4-11ef-a29c-e67413431efe.png"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02930',
  'SWORD ART ONLINE - UNITAL RING V',
  'SWORD ART ONLINE - UNITAL RING V',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/XtSm00ggdeIeCDGNsoFckQEegM8=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/39e7e8e4-7fd1-11f0-a5af-de5e70a27ff7.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02931',
  'SWORD ART ONLINE PROGRESSIVE - 06',
  'SWORD ART ONLINE PROGRESSIVE - 06',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/UlkeXjk9uZOJF_Hkf1Md6-SCdqI=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/532d8a30-d81a-11ee-bd84-e2697ce33d53.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02932',
  'SWORD ART ONLINE PROGRESSIVE - 07',
  'SWORD ART ONLINE PROGRESSIVE - 07',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/1r7LfD2zkXeMX5yac1NVOwUBv34=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/53a5db5c-d81a-11ee-9cda-5a86bcbeb6e3.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02933',
  'SWORD ART ONLINE PROGRESSIVE BARCAROLE - 1',
  'SWORD ART ONLINE PROGRESSIVE BARCAROLE - 1',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/e8QRUl5wo0kTFWTBwwQMrUeYK-s=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/28af098c-d81a-11ee-83df-e2e54ed5f9f7.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02934',
  'SWORD ART ONLINE PROGRESSIVE BARCAROLE - 2',
  'SWORD ART ONLINE PROGRESSIVE BARCAROLE - 2',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/0VSkwdfAoAlmH1p_WlDANCPfs8M=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/28ee0f42-d81a-11ee-9cda-5a86bcbeb6e3.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02935',
  'SWORD ART ONLINE: ALICIZATION LASTING - 18',
  'SWORD ART ONLINE: ALICIZATION LASTING - 18',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/NzitjLqm0ha3z_0gIdC_0nG6Daw=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/320ddcb2-d818-11ee-86d3-ce469b473a25.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02936',
  'SWORD ART ONLINE: MOON CRADLE - 19',
  'SWORD ART ONLINE: MOON CRADLE - 19',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/33PF_tu47TeDXPJ7nqtB9PtaUGU=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/32820a4c-d818-11ee-a4a8-5a86bcbeb6e3.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02937',
  'SWORD ART ONLINE: PHANTOM BULLET VOL. 4',
  'SWORD ART ONLINE: PHANTOM BULLET VOL. 4',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/1MtykGn0ZBwpSZdgOw1uU80tFTk=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/b72ea75a-d818-11ee-a11f-5a86bcbeb6e3.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02938',
  'SWORD ART ONLINE: UNITAL RING - 21',
  'SWORD ART ONLINE: UNITAL RING - 21',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/sba0ykV0EzkbGIBg-OQGaiX6jZs=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/33230d02-d818-11ee-86d3-ce469b473a25.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02939',
  'SWORD ART ONLINE: UNITAL RING III - 24',
  'SWORD ART ONLINE: UNITAL RING III - 24',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/znxgebhVNrUqAECC3-YBrH9NzHQ=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/99337bc0-1941-11f0-a130-225e61b3373a.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02940',
  'SWORD ART ONLINE: UNITAL RING IV - 25',
  'SWORD ART ONLINE: UNITAL RING IV - 25',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/h795cpVkPcnKH0lZeKArPaa4ncY=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/9961e280-1941-11f0-892a-e60d4a019210.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02941',
  'TAKAGI - A MESTRA DAS PEGADINHAS - 08',
  'TAKAGI - A MESTRA DAS PEGADINHAS - 08',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/xhLpr0O3Tghb5Zf-rk1K9WrgoLo=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/27a24e36-2ce4-11ef-8984-a212f06ea47f.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02942',
  'TAKAGI - A MESTRA DAS PEGADINHAS - 09',
  'TAKAGI - A MESTRA DAS PEGADINHAS - 09',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/b9Zs_K11JLBw4cbQ8Xw7fG5pvnw=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/79b762ac-d81a-11ee-ae87-e2e54ed5f9f7.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02943',
  'TAKAGI - A MESTRA DAS PEGADINHAS - 10',
  'TAKAGI - A MESTRA DAS PEGADINHAS - 10',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/JA0dd7uR2BDuvziiCVmYwNNzlRA=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/7a816cf0-d81a-11ee-ae87-e2e54ed5f9f7.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02944',
  'TAKAGI - A MESTRA DAS PEGADINHAS - 11',
  'TAKAGI - A MESTRA DAS PEGADINHAS - 11',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/Pqd2j-H6j4tbqqiozn7sYuRV31c=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/7abe6fec-d81a-11ee-9df9-5a86bcbeb6e3.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02945',
  'TAKAGI - A MESTRA DAS PEGADINHAS - 12',
  'TAKAGI - A MESTRA DAS PEGADINHAS - 12',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/IOjixWxF3knmXTqr5iWiR_OgoGs=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/7ab9af3e-d81a-11ee-bd84-e2697ce33d53.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02946',
  'TAKAGI - A MESTRA DAS PEGADINHAS - 13',
  'TAKAGI - A MESTRA DAS PEGADINHAS - 13',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/6uIMsUhqhZm128AtcIFmxfLb7ko=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/7b01e826-d81a-11ee-ae87-e2e54ed5f9f7.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02947',
  'TAKAGI - A MESTRA DAS PEGADINHAS - 14',
  'TAKAGI - A MESTRA DAS PEGADINHAS - 14',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/5VyY7o1bTZFAEoDz9X46iwbdqlI=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/7b77c884-d81a-11ee-9df9-5a86bcbeb6e3.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02948',
  'TAKAGI - A MESTRA DAS PEGADINHAS - 15',
  'TAKAGI - A MESTRA DAS PEGADINHAS - 15',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/Y1hjMNxvZ9ZdvFPzvU_nblYv6lw=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/7bd83610-d81a-11ee-bd84-e2697ce33d53.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02949',
  'TAKAGI - A MESTRA DAS PEGADINHAS - 16',
  'TAKAGI - A MESTRA DAS PEGADINHAS - 16',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/iYmusZiZb5UQXPVM5p0bjvn9g6g=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/7c3fc0be-d81a-11ee-ae87-e2e54ed5f9f7.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();



INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  'PROD-02950',
  'TAKAGI - A MESTRA DAS PEGADINHAS - 17',
  'TAKAGI - A MESTRA DAS PEGADINHAS - 17',
  0.00,
  '["https://thumbnails.meuspedidos.com.br/PAQ3-idiOvUb51VXwFlUYHVucG8=/fit-in/400x256/https://arquivos.mercos.com/media/imagem_produto/372791/7c91fb0e-d81a-11ee-9df9-5a86bcbeb6e3.jpg"]'::jsonb,
  (SELECT id FROM distribuidores WHERE nome = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  updated_at = NOW();