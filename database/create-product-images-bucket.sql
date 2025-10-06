-- Criar bucket para imagens de produtos (se não existir)
-- Este bucket armazena imagens dos produtos uploadadas em massa

-- 1. Criar o bucket (executar no dashboard do Supabase Storage)
-- Não há comando SQL direto, mas pode ser feito via dashboard:
-- Storage > Create Bucket > Nome: 'product-images' > Public: true

-- 2. Criar política de acesso público para leitura
CREATE POLICY "Public read access"
ON storage.objects FOR SELECT
USING (bucket_id = 'product-images');

-- 3. Criar política de upload para usuários autenticados admin
CREATE POLICY "Admin upload access"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'product-images' 
  AND auth.role() = 'authenticated'
);

-- 4. Criar política de delete para admin
CREATE POLICY "Admin delete access"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'product-images'
  AND auth.role() = 'authenticated'
);

COMMENT ON POLICY "Public read access" ON storage.objects IS 'Permite leitura pública das imagens de produtos';
COMMENT ON POLICY "Admin upload access" ON storage.objects IS 'Permite upload de imagens apenas para usuários autenticados';
COMMENT ON POLICY "Admin delete access" ON storage.objects IS 'Permite deletar imagens apenas para usuários autenticados';
