# Catálogo de Distribuidor - Documentação

## Visão Geral

O **Catálogo de Distribuidor** permite que jornaleiros gerenciem produtos sincronizados automaticamente de distribuidores (via API Mercos) em suas bancas. Os jornaleiros podem personalizar preços, descrições e configurações sem perder essas customizações durante as sincronizações automáticas.

## Arquitetura

### 1. Tabelas do Banco de Dados

#### `products` (existente)
Armazena os produtos **base** dos distribuidores. Estes dados são sempre atualizados pela sincronização.

Campos principais relacionados a distribuidores:
- `distribuidor_id` (UUID) - Referência ao distribuidor
- `mercos_id` (INTEGER) - ID do produto na API Mercos
- `origem` (VARCHAR) - 'mercos' para produtos de distribuidor
- `price` (DECIMAL) - Preço base do distribuidor
- `stock_qty` (INTEGER) - Estoque atual
- `name`, `description`, `images` - Dados base (não editáveis pelo jornaleiro)

#### `banca_produtos_distribuidor` (nova)
Armazena as **customizações** feitas pelo jornaleiro para cada produto.

Campos:
- `id` (UUID) - Chave primária
- `banca_id` (UUID) - Referência à banca
- `product_id` (UUID) - Referência ao produto
- `enabled` (BOOLEAN) - Se o produto está habilitado na banca (padrão: `true`)
- `custom_price` (DECIMAL) - Preço customizado pelo jornaleiro (NULL = usar preço do distribuidor)
- `custom_description` (TEXT) - Descrição adicional customizada
- `custom_status` (VARCHAR) - Status: `available`, `unavailable`, `hidden`
- `custom_pronta_entrega` (BOOLEAN) - Tipo de entrega customizado
- `custom_sob_encomenda` (BOOLEAN)
- `custom_pre_venda` (BOOLEAN)
- `modificado_em` (TIMESTAMP) - Data da última modificação

**Constraint:** Um jornaleiro pode ter apenas uma customização por produto (`UNIQUE(banca_id, product_id)`)

### 2. APIs

#### `GET /api/jornaleiro/catalogo-distribuidor`
Lista todos os produtos de distribuidores com as customizações da banca.

**Resposta:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Nome do Produto",
      "description": "Descrição base",
      "price": 10.00,
      "stock_qty": 50,
      "images": [],
      "mercos_id": 12345,
      "distribuidor_id": "uuid",
      "enabled": true,
      "custom_price": 15.00,
      "custom_description": "Descrição adicional",
      "custom_status": "available",
      "custom_pronta_entrega": true,
      "custom_sob_encomenda": false,
      "custom_pre_venda": false,
      "distribuidor_price": 10.00,
      "effective_price": 15.00
    }
  ],
  "total": 17
}
```

#### `PATCH /api/jornaleiro/catalogo-distribuidor/:productId`
Atualiza customizações de um produto específico.

**Body:**
```json
{
  "enabled": true,
  "custom_price": 15.00,
  "custom_description": "Texto adicional",
  "custom_status": "available",
  "custom_pronta_entrega": true,
  "custom_sob_encomenda": false,
  "custom_pre_venda": false
}
```

### 3. Páginas

#### `/jornaleiro/catalogo-distribuidor`
Listagem completa dos produtos com:
- Toggle para habilitar/desabilitar
- Visualização de estoque (read-only)
- Comparação de preço (distribuidor vs customizado)
- Input para editar preço inline
- Botão para editar detalhes completos
- Busca por nome ou ID Mercos
- Estatísticas (total, habilitados, desabilitados)

#### `/jornaleiro/catalogo-distribuidor/editar/:id`
Edição de produto com:
- **Campos bloqueados** (somente leitura):
  - Nome do produto
  - Descrição original
  - Imagens
  - Estoque
- **Campos editáveis**:
  - Preço de venda (com comparação ao preço do distribuidor)
  - Descrição adicional
  - Status (disponível, indisponível, oculto)
  - Tipo de entrega (pronta entrega, sob encomenda, pré-venda)

## Fluxo de Uso

### 1. Sincronização de Produtos
1. Admin sincroniza produtos de um distribuidor via `/admin/distribuidores/:id/sync`
2. Produtos são salvos na tabela `products` com `distribuidor_id` e `origem: 'mercos'`
3. A cada 15 minutos, o cron job `/api/cron/sync-mercos` atualiza automaticamente

### 2. Habilitação Automática
- Todos os produtos sincronizados são **habilitados por padrão** (`enabled: true`)
- O jornaleiro pode desabilitar individualmente usando o toggle

### 3. Customização pelo Jornaleiro
1. Jornaleiro acessa `/jornaleiro/catalogo-distribuidor`
2. Vê todos os produtos com preços do distribuidor
3. Pode customizar:
   - Preço de venda (aplicar margem)
   - Adicionar descrição extra
   - Alterar status e tipo de entrega
4. Customizações são salvas em `banca_produtos_distribuidor`

### 4. Sincronização Preservando Customizações
- Durante sincronizações (a cada 15 min), a tabela `products` é atualizada
- **Customizações em `banca_produtos_distribuidor` são preservadas**
- O jornaleiro mantém suas alterações de preço e configurações

### 5. Exibição no Frontend
- Produtos habilitados (`enabled: true`) aparecem no catálogo da banca
- Usa `effective_price` (custom_price se existir, senão distribuidor_price)
- Descrição combina a original + custom_description
- Estoque é sempre do distribuidor (read-only para jornaleiro)

## Regras de Negócio

### ✅ Jornaleiro PODE editar:
- Preço de venda (`custom_price`)
- Descrição adicional (`custom_description`)
- Status do produto (`custom_status`)
- Tipo de entrega (pronta entrega, sob encomenda, pré-venda)
- Habilitar/desabilitar produto

### ❌ Jornaleiro NÃO PODE editar:
- Nome do produto
- Descrição original
- Imagens
- Estoque (`stock_qty`)
- Controle de estoque (`track_stock`)

### 📊 Jornaleiro PODE visualizar (read-only):
- Estoque atual
- Preço do distribuidor (para comparação)
- Dados originais do produto

## Arquivos Criados/Modificados

### Novos Arquivos
1. `/database/create-banca-produtos-distribuidor.sql` - Schema da tabela
2. `/app/api/jornaleiro/catalogo-distribuidor/route.ts` - API de listagem
3. `/app/api/jornaleiro/catalogo-distribuidor/[productId]/route.ts` - API de atualização
4. `/app/jornaleiro/catalogo-distribuidor/page.tsx` - Página de listagem
5. `/app/jornaleiro/catalogo-distribuidor/editar/[id]/page.tsx` - Página de edição

### Arquivos Modificados
1. `/app/jornaleiro/layout.tsx` - Adicionado link "Catálogo Distribuidor" no menu
2. `/app/api/admin/distribuidores/[id]/sync/route.ts` - Comentários sobre preservação de customizações

## Instalação

### 1. Executar Migration SQL
```sql
-- No Supabase SQL Editor, executar:
\i database/create-banca-produtos-distribuidor.sql
```

### 2. Reiniciar Servidor
```bash
npm run dev
```

### 3. Sincronizar Produtos
1. Acessar `/admin/distribuidores`
2. Selecionar um distribuidor
3. Clicar em "Sincronizar Todos (Completo)"

### 4. Testar no Painel Jornaleiro
1. Login como jornaleiro
2. Acessar "Catálogo Distribuidor" no menu lateral
3. Verificar produtos sincronizados
4. Testar toggle, edição de preços e customizações

## Próximas Melhorias (Opcionais)

- [ ] Filtro por distribuidor na listagem
- [ ] Importação em massa de produtos (habilitar múltiplos de uma vez)
- [ ] Histórico de alterações de preço
- [ ] Notificação quando produtos ficam sem estoque
- [ ] Sugestão automática de markup baseado em categoria
- [ ] Exportação de relatório de produtos do catálogo

## Troubleshooting

### Produtos não aparecem no catálogo
- Verificar se foram sincronizados via admin (`/admin/distribuidores/:id/produtos`)
- Verificar se têm `distribuidor_id` preenchido
- Checar logs da API: `[API] Produtos encontrados`

### Customizações não são salvas
- Verificar tabela `banca_produtos_distribuidor` no Supabase
- Verificar erro no console do navegador
- Confirmar que usuário está autenticado e tem `banca_id`

### Sincronização sobrescrevendo preços
- **Não deve acontecer!** Customizações ficam em tabela separada
- Se acontecer, verificar lógica de `GET /api/jornaleiro/catalogo-distribuidor`
- Confirmar que `effective_price` está usando `custom_price` quando disponível

---

**Desenvolvido para:** Guia das Bancas  
**Data:** 04/10/2025  
**Versão:** 1.0
