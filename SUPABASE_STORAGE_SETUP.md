# Configuração do Supabase Storage

## ✅ Passo a Passo

### 1. Acessar o Dashboard do Supabase
- Vá para: https://supabase.com/dashboard
- Selecione seu projeto

### 2. Criar o Bucket "images"

**Via Dashboard:**
1. No menu lateral, clique em **Storage**
2. Clique em **"New bucket"**
3. Preencha:
   - **Name:** `images`
   - **Public bucket:** ✅ Marque como público
   - **File size limit:** `5242880` (5MB)
   - **Allowed MIME types:** 
     - image/jpeg
     - image/jpg
     - image/png
     - image/webp
     - image/gif
4. Clique em **"Create bucket"**

**Via SQL Editor:**
```sql
-- Execute o arquivo: database/create-storage-bucket.sql
-- Ou copie e cole este código:

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'images',
  'images',
  true,
  5242880,
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;
```

### 3. Configurar Políticas de Acesso

No **SQL Editor**, execute:

```sql
-- Leitura pública
CREATE POLICY "Permitir leitura pública de imagens"
ON storage.objects FOR SELECT
USING (bucket_id = 'images');

-- Upload autenticado
CREATE POLICY "Permitir upload autenticado de imagens"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'images');

-- Atualização autenticada
CREATE POLICY "Permitir atualização autenticada de imagens"
ON storage.objects FOR UPDATE
USING (bucket_id = 'images');

-- Deleção autenticada
CREATE POLICY "Permitir deleção autenticada de imagens"
ON storage.objects FOR DELETE
USING (bucket_id = 'images');
```

### 4. Testar

Após criar o bucket:
1. Acesse o painel do jornaleiro
2. Vá em **Minha Banca**
3. Faça upload de uma imagem de perfil ou capa
4. Clique em **Salvar**
5. ✅ A imagem deve aparecer persistida

## 📁 Estrutura de Pastas

As imagens serão organizadas assim:
```
images/
  └── bancas/
      ├── 1234567890-abc123.jpg
      ├── 1234567891-def456.png
      └── ...
```

## 🔍 Verificar Upload

Para ver as imagens no Supabase:
1. **Storage** → **images** → **bancas/**
2. Você verá todas as imagens enviadas
3. Cada imagem terá uma URL pública:
   ```
   https://[seu-projeto].supabase.co/storage/v1/object/public/images/bancas/[arquivo]
   ```

## 🐛 Troubleshooting

### Erro: "Bucket not found"
- Certifique-se de criar o bucket "images" primeiro

### Erro: "Permission denied"
- Verifique se as políticas RLS foram criadas
- Certifique-se que o bucket está marcado como **público**

### Imagens não aparecem
- Verifique se a URL no console está correta
- Teste acessar a URL diretamente no navegador
- Verifique se o bucket é público

## 📊 Fallback

Se o Supabase Storage não estiver configurado, a API fará fallback para base64 (data URLs), mas isso NÃO É RECOMENDADO para produção pois:
- ❌ URLs muito longas
- ❌ Não funciona bem com o banco de dados
- ❌ Performance ruim
