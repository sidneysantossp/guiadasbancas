# 🚀 Como Cadastrar Produtos do Beta

## ⚠️ IMPORTANTE
Execute os SQLs **NA ORDEM** abaixo no SQL Editor do Supabase.

---

## 📝 PASSO 1: Adicionar Coluna codigo_mercos

**Arquivo:** `database/add-codigo-mercos-products.sql`

```sql
-- Copie e cole TODO o conteúdo do arquivo no SQL Editor
-- Isso adiciona a coluna codigo_mercos e outras colunas Mercos
```

✅ **Resultado esperado:** "Success. No rows returned"

---

## 📝 PASSO 2: Inserir os 13 Produtos

**Arquivo:** `database/insert-produtos-beta-simples.sql`

```sql
-- Copie e cole TODO o conteúdo do arquivo no SQL Editor
-- Isso insere os 13 produtos com códigos Mercos
```

✅ **Resultado esperado:** "INSERT 0 13" (13 produtos inseridos)

---

## ✅ PASSO 3: Verificar

Execute esta query no SQL Editor:

```sql
SELECT name, codigo_mercos, price, stock_qty 
FROM products 
WHERE codigo_mercos IS NOT NULL 
ORDER BY name;
```

Você deve ver 13 produtos listados com seus códigos.

---

## 🎯 PRÓXIMO PASSO: Upload de Imagens

Após inserir os produtos:

1. **Baixe as 13 imagens** da plataforma Mercos
2. **Renomeie cada imagem** com seu código:
   - `AKOTO001.jpg`
   - `ADBEM001.jpg`
   - `ACBKA004.jpg`
   - etc...
3. **Acesse** `/admin/produtos/upload-imagens`
4. **Arraste todas as imagens** de uma vez
5. **Clique em "Fazer Upload"**
6. **Verifique o relatório** de sucesso

---

## 🆘 Troubleshooting

### Erro: "column codigo_mercos already exists"
✅ **Normal!** A coluna já existe. Pule para o Passo 2.

### Erro: "duplicate key value violates unique constraint"
❌ **Produtos já foram inseridos.** Não execute novamente.

Para limpar e reinserir:
```sql
DELETE FROM products WHERE codigo_mercos IS NOT NULL;
-- Depois execute o Passo 2 novamente
```

### Erro: "column 'slug' does not exist"
❌ **Use o arquivo correto:** `insert-produtos-beta-simples.sql`

---

## 📋 Checklist Final

- [ ] PASSO 1: Executado `add-codigo-mercos-products.sql`
- [ ] PASSO 2: Executado `insert-produtos-beta-simples.sql`  
- [ ] PASSO 3: Verificado 13 produtos
- [ ] Imagens baixadas e renomeadas
- [ ] Upload em massa realizado
- [ ] Produtos aparecendo no dashboard

**Pronto para beta launch! 🎉**
