# 📦 Setup do Storage - Supabase

## ⚠️ IMPORTANTE
As políticas de Storage do Supabase **NÃO podem ser criadas via SQL**. Devem ser configuradas pelo Dashboard.

---

## 🎯 Configuração Rápida (Recomendada)

### Passo 1: Criar Bucket Público

1. Acesse seu projeto no [Supabase Dashboard](https://app.supabase.com)
2. No menu lateral: **Storage**
3. Clique em: **Create a new bucket**
4. Preencha:
   ```
   Name: product-images
   Public bucket: ✅ MARCAR (IMPORTANTE!)
   File size limit: 5 MB
   ```
5. Clique em **Create bucket**

### Passo 2: Adicionar Política de Upload

1. Clique no bucket **product-images** que você criou
2. Vá na aba **Policies**
3. Clique em **New Policy**
4. Selecione **For full customization**
5. Preencha:
   ```
   Policy name: Allow authenticated uploads
   Allowed operation: INSERT
   
   WITH CHECK expression:
   bucket_id = 'product-images'
   ```
6. Clique em **Review** → **Save policy**

### ✅ Pronto!

Como o bucket é público, a leitura já está liberada. Você só precisou configurar o upload.

---

## 🧪 Testar se Está Funcionando

### Via API (Recomendado)

Após configurar, teste fazendo upload de uma imagem pelo painel admin:
1. Acesse: `/admin/produtos/upload-imagens`
2. Faça upload de uma imagem de teste
3. Se funcionar = configuração correta! ✅

### Via URL Direta

Tente acessar:
```
https://[SEU-PROJETO].supabase.co/storage/v1/object/public/product-images/test.jpg
```

- **404 (Not Found)** = Configuração correta, arquivo não existe ✅
- **403 (Forbidden)** = Bucket não é público, revise o Passo 1 ❌

---

## 🔧 Configuração Avançada (Opcional)

Se quiser controle total, adicione mais políticas:

### Política de UPDATE

```
Name: Allow authenticated updates
Operation: UPDATE

USING expression:
bucket_id = 'product-images'

WITH CHECK expression:
bucket_id = 'product-images'
```

### Política de DELETE

```
Name: Allow authenticated deletes
Operation: DELETE

USING expression:
bucket_id = 'product-images'
```

---

## 🆘 Troubleshooting

### Erro: "new row violates row-level security policy"
**Solução:** Bucket não é público ou política de INSERT não está configurada

### Erro: "Failed to create bucket"
**Solução:** Bucket com esse nome já existe, use outro nome ou delete o existente

### Erro: "Access denied"
**Solução:** Usuário não está autenticado ou política está errada

---

## 📝 Checklist Final

- [ ] Bucket `product-images` criado
- [ ] Bucket marcado como **PUBLIC**
- [ ] Política de INSERT adicionada
- [ ] Testado upload via admin
- [ ] URLs públicas funcionando

---

## 🎉 Próximo Passo

Após configurar o storage:
1. Execute o SQL: `database/add-codigo-mercos-products.sql`
2. Cadastre alguns produtos de teste
3. Faça upload de imagens em massa
4. Valide o fluxo completo

**Storage configurado e pronto para uso!** 🚀
