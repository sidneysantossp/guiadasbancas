# ⚠️ URGENTE: Adicionar campo codigo_mercos à tabela products

## 🎯 Problema
O upload de imagens por código está falando porque a coluna `codigo_mercos` não existe na tabela `products` do Supabase.

## ✅ Solução (2 minutos)

### Passo 1: Acesse o Supabase Dashboard
```
https://supabase.com/dashboard/project/[seu-projeto-id]/editor
```

### Passo 2: Abra o SQL Editor
1. No menu lateral, clique em **"SQL Editor"**
2. Clique em **"New query"**

### Passo 3: Cole e Execute o SQL abaixo

```sql
-- Migration: Adicionar campo codigo_mercos à tabela products
-- Data: 2024-11-17
-- Descrição: Campo para armazenar o código do produto da API Mercos
--            Necessário para vincular imagens por código

-- Adicionar coluna codigo_mercos
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS codigo_mercos TEXT;

-- Criar índice para melhorar performance de buscas por código
CREATE INDEX IF NOT EXISTS idx_products_codigo_mercos 
ON products(codigo_mercos) 
WHERE codigo_mercos IS NOT NULL;

-- Criar índice composto para busca por distribuidor + código
CREATE INDEX IF NOT EXISTS idx_products_distribuidor_codigo 
ON products(distribuidor_id, codigo_mercos) 
WHERE codigo_mercos IS NOT NULL;

-- Comentário na coluna
COMMENT ON COLUMN products.codigo_mercos IS 'Código do produto retornado pela API Mercos (campo "codigo")';
```

### Passo 4: Clique em **"RUN"** ou pressione Ctrl+Enter

### Passo 5: Verifique o resultado
Você deve ver: ✅ **Success. No rows returned**

---

## 🔄 Após aplicar a migration:

1. **Atualizar os códigos:**
   - Acesse: `https://www.guiadasbancas.com.br/admin/distribuidores/3a989c56-bbd3-4769-b076-a83483e39542/atualizar-codigos`
   - Clique em **"🔄 Atualizar Códigos"**
   - Aguarde ~2-3 minutos

2. **Testar o upload:**
   - Acesse: `https://www.guiadasbancas.com.br/admin/produtos/upload-imagens-massa`
   - Upload da imagem `JP09.jpg`
   - Deve funcionar! ✅

---

## 📊 Verificação Manual (Opcional)

Para verificar se a coluna foi criada:

```sql
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'products' 
AND column_name = 'codigo_mercos';
```

Deve retornar:
```
column_name     | data_type
----------------|----------
codigo_mercos   | text
```

---

## 🆘 Problemas?

Se houver erro ao executar o SQL, me avise e eu ajudo a resolver!
