# ✅ Deploy Checklist - Catálogo de Distribuidores

## 📋 Pré-requisitos

- [ ] Acesso ao Supabase SQL Editor
- [ ] Servidor local rodando (`npm run dev`)
- [ ] Credenciais de admin/jornaleiro para teste

---

## 🗄️ Etapa 1: Banco de Dados (Supabase)

### 1.1 Executar SQL: Categoria "Diversos"

```sql
INSERT INTO categories (
  id,
  name,
  link,
  image,
  active,
  "order",
  created_at,
  updated_at
) VALUES (
  'aaaaaaaa-0000-0000-0000-000000000001',
  'Diversos',
  '/categorias/diversos',
  NULL,
  true,
  999,
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  link = EXCLUDED.link,
  updated_at = NOW();
```

**Status:** [ ] Executado ✅

---

### 1.2 Executar SQL: Categoria "Sem Categoria"

```sql
INSERT INTO categories (
  id,
  name,
  link,
  image,
  active,
  "order",
  created_at,
  updated_at
) VALUES (
  'bbbbbbbb-0000-0000-0000-000000000001',
  'Sem Categoria',
  '/categorias/sem-categoria',
  NULL,
  true,
  998,
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  link = EXCLUDED.link,
  updated_at = NOW();
```

**Status:** [ ] Executado ✅

---

### 1.3 Executar SQL: Campos de Estoque Próprio

```sql
ALTER TABLE banca_produtos_distribuidor
ADD COLUMN IF NOT EXISTS custom_stock_enabled BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS custom_stock_qty INTEGER DEFAULT NULL;

COMMENT ON COLUMN banca_produtos_distribuidor.custom_stock_enabled 
IS 'Se true, usa estoque próprio do jornaleiro ao invés do estoque do distribuidor';

COMMENT ON COLUMN banca_produtos_distribuidor.custom_stock_qty 
IS 'Quantidade de estoque gerenciada pelo jornaleiro (null = usa estoque do distribuidor)';
```

**Status:** [ ] Executado ✅

---

### 1.4 Verificar Campos Criados

```sql
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_name = 'banca_produtos_distribuidor'
  AND column_name IN ('custom_stock_enabled', 'custom_stock_qty');
```

**Resultado esperado:**
```
column_name          | data_type | column_default
---------------------|-----------|---------------
custom_stock_enabled | boolean   | false
custom_stock_qty     | integer   | NULL
```

**Status:** [ ] Verificado ✅

---

## 💻 Etapa 2: Código (Local)

### 2.1 Verificar Arquivos Modificados

```bash
git status
```

**Arquivos esperados:**
- `app/api/banca/[id]/products/route.ts`
- `app/api/jornaleiro/catalogo-distribuidor/route.ts`
- `app/api/jornaleiro/catalogo-distribuidor/[productId]/route.ts`
- `app/api/admin/distribuidores/[id]/sync/route.ts`
- `app/jornaleiro/catalogo-distribuidor/page.tsx`
- `app/jornaleiro/catalogo-distribuidor/editar/[id]/page.tsx`
- `next.config.js`
- `database/*.sql`
- `*.md` (documentação)

**Status:** [ ] Verificado ✅

---

### 2.2 Limpar Cache e Reinstalar

```bash
rm -rf .next
npm install
```

**Status:** [ ] Executado ✅

---

### 2.3 Iniciar Servidor Local

```bash
npm run dev
```

**Status:** [ ] Rodando ✅

Aguarde aparecer:
```
✓ Ready in 3.2s
- Local:        http://localhost:3000
```

---

## 🧪 Etapa 3: Testes Locais

### 3.1 Teste: Painel Jornaleiro

**URL:** `http://localhost:3000/jornaleiro/catalogo-distribuidor`

**Checklist:**
- [ ] Página carrega sem erros
- [ ] Lista de produtos aparece
- [ ] Estatísticas (total, habilitados, desabilitados) corretas
- [ ] Busca funciona
- [ ] Toggle habilitado/desabilitado funciona
- [ ] Edição de preço inline funciona
- [ ] Indicadores de estoque aparecem

**Status:** [ ] Testado ✅

---

### 3.2 Teste: Edição de Produto

**URL:** `http://localhost:3000/jornaleiro/catalogo-distribuidor/editar/[PRODUCT_ID]`

**Checklist:**
- [ ] Formulário carrega dados corretamente
- [ ] Campos bloqueados não são editáveis
- [ ] Seção "Gerenciar meu próprio estoque" aparece
- [ ] Toggle de estoque próprio funciona
- [ ] Campo de quantidade aparece ao ativar
- [ ] Aviso de estoque esgotado aparece (se aplicável)
- [ ] Salvar funciona sem erros
- [ ] Redirect para listagem após salvar

**Status:** [ ] Testado ✅

---

### 3.3 Teste: Frontend Público

**URL:** `http://localhost:3000/banca/sp/[SLUG]`

**Checklist:**
- [ ] Produtos próprios aparecem
- [ ] Produtos de distribuidores aparecem
- [ ] Categoria "Diversos" aparece nos filtros
- [ ] Filtro por "Diversos" funciona
- [ ] Produtos com estoque próprio aparecem como disponíveis
- [ ] Imagens carregam (com placeholder se necessário)

**Status:** [ ] Testado ✅

---

### 3.4 Teste: Estoque Próprio (Cenário Completo)

**Passos:**

1. [ ] Encontre um produto com `stock_qty = 0` (distribuidor esgotado)
2. [ ] Verifique que está "Esgotado" no frontend público
3. [ ] Acesse edição do produto no painel jornaleiro
4. [ ] Ative "Gerenciar meu próprio estoque"
5. [ ] Defina quantidade = 10
6. [ ] Salve
7. [ ] Verifique na listagem: badge azul "10 un. (próprio)"
8. [ ] Acesse frontend público novamente
9. [ ] Verifique que produto agora está "Disponível"

**Status:** [ ] Testado ✅

---

## 🚀 Etapa 4: Build e Deploy

### 4.1 Build de Produção

```bash
npm run build
```

**Checklist:**
- [ ] Build completa sem erros
- [ ] Sem warnings TypeScript
- [ ] Sem warnings de lint

**Status:** [ ] Build OK ✅

---

### 4.2 Testar Build Local

```bash
npm start
```

**Checklist:**
- [ ] Aplicação inicia na porta 3000
- [ ] Todas as rotas funcionam
- [ ] Sem erros no console

**Status:** [ ] Build testada ✅

---

### 4.3 Deploy Vercel

```bash
vercel --prod
```

**OU via Git:**
```bash
git add .
git commit -m "feat: implementar gestão de estoque próprio para produtos de distribuidores"
git push origin main
```

**Status:** [ ] Deploy realizado ✅

---

### 4.4 Verificar Deploy

**URL:** `https://[SEU-DOMINIO].vercel.app`

**Checklist:**
- [ ] Homepage carrega
- [ ] Login funciona
- [ ] Painel jornaleiro acessível
- [ ] Produtos listam corretamente
- [ ] Edição funciona
- [ ] Frontend público mostra produtos

**Status:** [ ] Deploy verificado ✅

---

## 📊 Etapa 5: Validação Final

### 5.1 Verificar Dados no Supabase

```sql
-- Total de produtos de distribuidores
SELECT COUNT(*) FROM products WHERE distribuidor_id IS NOT NULL;

-- Produtos com estoque próprio
SELECT COUNT(*) 
FROM banca_produtos_distribuidor 
WHERE custom_stock_enabled = true;

-- Categorias especiais
SELECT id, name FROM categories 
WHERE id IN (
  'aaaaaaaa-0000-0000-0000-000000000001',
  'bbbbbbbb-0000-0000-0000-000000000001'
);
```

**Status:** [ ] Dados corretos ✅

---

### 5.2 Monitorar Logs

**Vercel Dashboard → Seu Projeto → Logs**

**Verificar:**
- [ ] Sem erros 500
- [ ] APIs respondendo corretamente
- [ ] Tempos de resposta OK (<1s)

**Status:** [ ] Logs OK ✅

---

## ✅ Checklist Final

- [ ] Banco de dados atualizado
- [ ] Código committed e pushed
- [ ] Build sem erros
- [ ] Testes locais passando
- [ ] Deploy realizado
- [ ] Deploy verificado em produção
- [ ] Logs sem erros
- [ ] Documentação criada
- [ ] Time notificado

---

## 🆘 Troubleshooting

### Erro: "Column does not exist"
**Solução:** Execute os SQLs de ALTER TABLE novamente no Supabase

### Erro: "Category not found"
**Solução:** Execute os INSERTs de categorias no Supabase

### Erro: Build TypeScript
**Solução:** 
```bash
rm -rf .next
npm install
npm run build
```

### Erro: Imagens não carregam
**Solução:** Verifique `next.config.js` → domínio CDN está na lista

### Produtos não aparecem
**Solução:** 
1. Verifique se distribuidor foi sincronizado
2. Verifique se produtos estão habilitados
3. Cheque logs da API no Vercel

---

## 📞 Contato

**Dúvidas?** Consulte:
- `GESTAO_ESTOQUE_PROPRIO.md` - Funcionamento do estoque próprio
- `IMPLEMENTACAO_COMPLETA.md` - Visão geral do sistema
- `CATEGORIAS_SISTEMA.md` - Explicação das categorias

---

**Data:** 04/10/2025  
**Versão:** 1.0  
**Status:** 🚀 Pronto para Deploy
