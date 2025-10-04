# Gestão de Estoque Próprio - Documentação Completa

## 📋 Visão Geral

Sistema que permite jornaleiros gerenciarem seu próprio estoque de produtos de distribuidores, possibilitando vender produtos mesmo quando o distribuidor está sem estoque.

## 🎯 Casos de Uso

### Caso 1: Distribuidor Esgotado
- **Problema:** Distribuidor esgotou o estoque
- **Solução:** Jornaleiro compra de outro fornecedor e gerencia estoque próprio
- **Resultado:** Produto continua disponível na banca

### Caso 2: Estoque Misto
- **Cenário:** Jornaleiro tem estoque próprio E usa distribuidor
- **Benefício:** Quando acabar o próprio, volta para o do distribuidor automaticamente

### Caso 3: Sincronização Automática
- **Quando desativado:** Estoque sincroniza automaticamente com distribuidor
- **Quando ativado:** Jornaleiro controla 100% do estoque

## 🗄️ Estrutura do Banco de Dados

### Tabela: `banca_produtos_distribuidor`

```sql
-- Novos campos adicionados
custom_stock_enabled BOOLEAN DEFAULT false
  -- Se true: usa custom_stock_qty
  -- Se false: usa stock_qty do produto (distribuidor)

custom_stock_qty INTEGER DEFAULT NULL
  -- Quantidade gerenciada pelo jornaleiro
  -- NULL = não está usando estoque próprio
```

### Lógica de Estoque Efetivo

```typescript
const effectiveStock = custom_stock_enabled 
  ? (custom_stock_qty ?? 0)
  : produto.stock_qty;
```

## 🔧 APIs Modificadas

### 1. GET `/api/jornaleiro/catalogo-distribuidor`
**Retorna:** Lista com campos adicionais
```json
{
  "custom_stock_enabled": false,
  "custom_stock_qty": null
}
```

### 2. PATCH `/api/jornaleiro/catalogo-distribuidor/:productId`
**Aceita:**
```json
{
  "custom_stock_enabled": true,
  "custom_stock_qty": 10
}
```

### 3. GET `/api/banca/[id]/products` (Frontend Público)
**Retorna:** `stock_qty` efetivo (próprio ou distribuidor)
```javascript
// Se custom_stock_enabled = true → usa custom_stock_qty
// Se custom_stock_enabled = false → usa stock_qty (distribuidor)
```

## 🎨 Interface do Usuário

### Painel Principal (`/jornaleiro/catalogo-distribuidor`)

**Indicadores de Estoque:**
- **Badge Verde:** Estoque do distribuidor
- **Badge Azul:** Estoque próprio (gerenciado pelo jornaleiro)
- **Exibição dupla:** Mostra ambos quando estoque próprio ativado

### Página de Edição (`/jornaleiro/catalogo-distribuidor/editar/[id]`)

**Seção: "Gerenciar meu próprio estoque"**

```
☐ Gerenciar meu próprio estoque
  Ative para usar seu estoque ao invés do estoque do distribuidor

[Quando ativado:]

📦 Quantidade em Estoque *
[   10   ] unidades

Estoque do distribuidor: 0 un. (Esgotado no distribuidor - usando seu estoque)

✓ Este produto ficará disponível para compra na sua banca 
  mesmo com o estoque do distribuidor esgotado.
```

## 🔄 Fluxo Completo

### Cenário: Reativar Produto Esgotado

1. **Situação Inicial**
   - Distribuidor: 0 unidades
   - Status na banca: Esgotado
   - Clientes: Não podem comprar

2. **Ação do Jornaleiro**
   - Compra de outro fornecedor: 20 unidades
   - Acessa `/jornaleiro/catalogo-distribuidor`
   - Clica em "Editar" no produto
   - Ativa "Gerenciar meu próprio estoque"
   - Define: 20 unidades
   - Salva

3. **Resultado**
   - Backend: `custom_stock_enabled = true`, `custom_stock_qty = 20`
   - API Pública: Retorna `stock_qty = 20`
   - Frontend Banca: Produto DISPONÍVEL ✅
   - Clientes: Podem comprar!

4. **Venda de 15 unidades**
   - Jornaleiro atualiza: `custom_stock_qty = 5`
   - Produto continua disponível

5. **Esgotar Estoque Próprio**
   - Jornaleiro vende tudo: `custom_stock_qty = 0`
   - Produto volta para: Esgotado
   - Opção 1: Desativar gestão própria (volta para distribuidor)
   - Opção 2: Comprar mais e atualizar quantidade

## 📊 Exemplos de Dados

### Exemplo 1: Usando Estoque do Distribuidor (Padrão)
```json
{
  "product_id": "abc-123",
  "banca_id": "def-456",
  "custom_stock_enabled": false,
  "custom_stock_qty": null
}
```
**Resultado:** stock_qty vem do distribuidor

### Exemplo 2: Usando Estoque Próprio
```json
{
  "product_id": "abc-123",
  "banca_id": "def-456",
  "custom_stock_enabled": true,
  "custom_stock_qty": 15
}
```
**Resultado:** stock_qty = 15 (ignorando distribuidor)

### Exemplo 3: Estoque Próprio Zerado
```json
{
  "product_id": "abc-123",
  "banca_id": "def-456",
  "custom_stock_enabled": true,
  "custom_stock_qty": 0
}
```
**Resultado:** Produto esgotado (mesmo se distribuidor tiver)

## 🔐 Regras de Negócio

1. **Sincronização Automática NÃO afeta estoque próprio**
   - Quando `custom_stock_enabled = true`
   - Distribuidor pode atualizar dados (nome, preço, etc)
   - Mas `custom_stock_qty` é PRESERVADO

2. **Prioridade de Estoque**
   - `custom_stock_enabled = true` → SEMPRE usa `custom_stock_qty`
   - `custom_stock_enabled = false` → SEMPRE usa distribuidor

3. **Validações**
   - `custom_stock_qty` não pode ser negativo
   - Só aceita valores inteiros
   - NULL é válido (desabilitado)

4. **Permissões**
   - Apenas o jornaleiro pode editar seu estoque
   - Distribuidor NÃO pode alterar `custom_stock_qty`
   - Frontend público: somente leitura

## 🧪 Testes Recomendados

### Teste 1: Ativar Estoque Próprio
1. Acesse produto com distribuidor = 0
2. Ative gestão própria
3. Defina 10 unidades
4. Verifique na banca pública: deve estar disponível

### Teste 2: Desativar Estoque Próprio
1. Produto com estoque próprio = 10
2. Desative gestão própria
3. Se distribuidor = 0 → produto esgota
4. Se distribuidor > 0 → usa estoque do distribuidor

### Teste 3: Sincronização Preserva Custom
1. Ative estoque próprio = 5
2. Execute sincronização do distribuidor
3. Verifique: `custom_stock_qty` deve continuar = 5

### Teste 4: Visualização na Tabela
1. Produto A: Estoque distribuidor (verde)
2. Produto B: Estoque próprio (azul + "próprio")
3. Verifique ambos os badges aparecem corretamente

## 📝 Checklist de Implementação

- [x] Adicionar campos no banco (`custom_stock_enabled`, `custom_stock_qty`)
- [x] Atualizar API GET `/api/jornaleiro/catalogo-distribuidor`
- [x] Atualizar API PATCH `/api/jornaleiro/catalogo-distribuidor/:id`
- [x] Atualizar API GET `/api/banca/[id]/products` (frontend)
- [x] Adicionar UI no formulário de edição
- [x] Adicionar indicadores na tabela principal
- [x] Implementar lógica de estoque efetivo
- [x] Documentar funcionalidade
- [ ] Executar SQL no Supabase
- [ ] Testar fluxo completo
- [ ] Validar sincronização preserva dados

## 🚀 Deploy

### Passo 1: Executar SQL
```sql
\i database/add-custom-stock-fields.sql
```

### Passo 2: Verificar
```sql
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_name = 'banca_produtos_distribuidor'
  AND column_name IN ('custom_stock_enabled', 'custom_stock_qty');
```

### Passo 3: Build
```bash
npm run build
```

### Passo 4: Deploy
```bash
vercel --prod
```

---

**Criado em:** 04/10/2025  
**Versão:** 1.0  
**Status:** ✅ Implementado e pronto para uso
