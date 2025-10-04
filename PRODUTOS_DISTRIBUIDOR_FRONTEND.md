# Produtos de Distribuidor no Frontend - Documentação

## Visão Geral

Os produtos do catálogo de distribuidor agora aparecem automaticamente no perfil público da banca, respeitando as customizações feitas pelo jornaleiro.

## Implementação

### 1. Categoria Genérica
Criada uma categoria especial para agrupar produtos de distribuidores:

**ID Fixo:** `aaaaaaaa-0000-0000-0000-000000000001`  
**Nome:** "Produtos de Distribuidores"  
**Slug:** `produtos-distribuidores`

### 2. API Modificada

**`/api/products?banca_id=xxx`** - Agora retorna:
- Produtos próprios da banca (`banca_id` e `distribuidor_id` null)
- Produtos de distribuidor **habilitados** (`enabled: true` em `banca_produtos_distribuidor`)

#### Lógica de Inclusão:
1. Busca produtos próprios normalmente
2. Se `banca_id` fornecido:
   - Consulta `banca_produtos_distribuidor` para produtos habilitados
   - Busca dados completos dos produtos
   - Aplica customizações (preço, descrição, tipo de entrega)
   - Atribui à categoria de distribuidores
   - Adiciona flag `is_distribuidor: true`

### 3. Customizações Aplicadas

Quando exibidos no frontend, produtos de distribuidor usam:

| Campo | Valor |
|-------|-------|
| `price` | `custom_price` se existir, senão preço original |
| `description` | Descrição original + `custom_description` (se houver) |
| `pronta_entrega` | `custom_pronta_entrega` ou valor original |
| `sob_encomenda` | `custom_sob_encomenda` ou valor original |
| `pre_venda` | `custom_pre_venda` ou valor original |
| `category_id` | Categoria "Produtos de Distribuidores" |
| `stock_qty` | Sempre do distribuidor (read-only) |

### 4. Campos Protegidos (Não Customizáveis)

- `name` - Nome do produto
- `images` - Imagens originais
- `stock_qty` - Estoque
- `track_stock` - Controle de estoque

## Instalação

### 1. Criar Categoria no Supabase
```sql
-- Executar no SQL Editor do Supabase:
\i database/create-categoria-distribuidores.sql
```

### 2. Executar Migration de Customizações
```sql
-- Se ainda não executou:
\i database/create-banca-produtos-distribuidor.sql
```

### 3. Testar

#### No Painel Jornaleiro:
1. Acesse `/jornaleiro/catalogo-distribuidor`
2. Habilite alguns produtos (toggle ON)
3. Customize preços e descrições
4. Salve as alterações

#### No Frontend da Banca:
1. Acesse `/banca/[slug-da-banca]`
2. Veja os produtos na categoria "Produtos de Distribuidores"
3. Confirme que preços e descrições customizadas aparecem

## Fluxo Completo

```
┌─────────────────────────────────────────────────┐
│  1. Sincronização (Admin)                       │
│     /admin/distribuidores/:id/sync              │
│     └─> Produtos salvos em `products`           │
│         com `distribuidor_id` preenchido        │
└─────────────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────┐
│  2. Habilitação (Jornaleiro)                    │
│     /jornaleiro/catalogo-distribuidor           │
│     └─> Toggle ON para habilitar               │
│     └─> Customiza preço, descrição, etc.       │
│     └─> Salvos em `banca_produtos_distribuidor`│
└─────────────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────┐
│  3. Exibição (Frontend)                         │
│     /banca/[slug]                               │
│     API: /api/products?banca_id=xxx             │
│     └─> Produtos próprios                       │
│     └─> Produtos de distribuidor habilitados   │
│         (com customizações aplicadas)           │
└─────────────────────────────────────────────────┘
```

## Arquivos Modificados

1. `/app/api/products/route.ts` - Incluir produtos de distribuidor
2. `/database/create-categoria-distribuidores.sql` - Categoria genérica
3. `/app/api/jornaleiro/catalogo-distribuidor/route.ts` - Correção de autenticação
4. `/app/api/jornaleiro/catalogo-distribuidor/[productId]/route.ts` - Correção de autenticação

## Testes Recomendados

### Teste 1: Produtos aparecem no frontend
- [ ] Habilitar 3 produtos no catálogo do jornaleiro
- [ ] Acessar perfil da banca
- [ ] Verificar que os 3 produtos aparecem
- [ ] Conferir que estão na categoria "Produtos de Distribuidores"

### Teste 2: Customizações funcionam
- [ ] Mudar preço de R$ 10,00 para R$ 15,00
- [ ] Adicionar descrição customizada
- [ ] Acessar perfil da banca
- [ ] Verificar preço R$ 15,00
- [ ] Verificar descrição adicional aparece

### Teste 3: Toggle funciona
- [ ] Desabilitar produto (toggle OFF)
- [ ] Acessar perfil da banca
- [ ] Produto não deve aparecer

### Teste 4: Sincronização preserva customizações
- [ ] Customizar preço e descrição
- [ ] Rodar sincronização automática (aguardar 15 min ou forçar)
- [ ] Verificar que customizações foram mantidas
- [ ] Estoque atualizado mas preço customizado permanece

## Troubleshooting

### Produtos não aparecem no frontend
1. Verificar se estão habilitados: `enabled: true` em `banca_produtos_distribuidor`
2. Verificar se a categoria foi criada no Supabase
3. Verificar se `banca_id` está correto na URL da API

### Preços customizados não aplicam
1. Verificar se `custom_price` está preenchido na tabela
2. Verificar se a lógica de aplicação está correta no código
3. Limpar cache do navegador

### Categoria não aparece
1. Executar SQL de criação da categoria
2. Verificar se o ID fixo está correto: `aaaaaaaa-0000-0000-0000-000000000001`
3. Verificar se a categoria está ativa: `active: true`

---

**Desenvolvido para:** Guia das Bancas  
**Data:** 04/10/2025  
**Versão:** 1.0
