# Integração de Categorias Mercos

## 📋 Visão Geral

Este documento descreve a integração completa das categorias da API Mercos nos 4 painéis da plataforma:
- **Painel Admin**: Gestão e sincronização de categorias
- **Painel Distribuidor**: Visualização de categorias próprias
- **Painel Jornaleiro**: Filtros por categoria nos pedidos
- **Frontend Público**: Navegação por categorias

## 🗄️ Estrutura de Dados

### Tabelas

#### `distribuidor_categories`
Categorias específicas de cada distribuidor, sincronizadas da Mercos.

```sql
CREATE TABLE distribuidor_categories (
  id UUID PRIMARY KEY,
  distribuidor_id UUID REFERENCES distribuidores(id),
  mercos_id INTEGER,
  nome TEXT,
  categoria_pai_id INTEGER,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ,
  UNIQUE(distribuidor_id, mercos_id)
);
```

#### `categories`
Cache global de categorias para exibição no frontend.

```sql
CREATE TABLE categories (
  id UUID PRIMARY KEY,
  name TEXT,
  image TEXT,
  link TEXT,
  active BOOLEAN DEFAULT true,
  visible BOOLEAN DEFAULT true,
  order INTEGER,
  jornaleiro_status TEXT DEFAULT 'all',
  jornaleiro_bancas TEXT[],
  mercos_id INTEGER,                    -- NOVO: ID da categoria na Mercos
  parent_category_id UUID,              -- NOVO: Hierarquia de categorias
  ultima_sincronizacao TIMESTAMPTZ,     -- NOVO: Timestamp da última sync
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
);
```

#### `mercos_homologacao_registros`
Registro de auditoria das categorias durante homologação.

```sql
CREATE TABLE mercos_homologacao_registros (
  company_token TEXT,
  mercos_id INTEGER,
  nome TEXT,
  categoria_pai_id INTEGER,
  ultima_alteracao TIMESTAMPTZ,
  excluido BOOLEAN,
  alterado_apos TEXT,
  PRIMARY KEY (company_token, mercos_id)
);
```

## 🔄 Fluxo de Sincronização

### 1. Mercos → distribuidor_categories

**Endpoint**: `POST /api/admin/categories/sync-mercos`

**Processo**:
1. Busca distribuidores ativos com tokens Mercos configurados
2. Para cada distribuidor:
   - Faz requisições paginadas à API Mercos (`/categorias`)
   - Respeita rate limiting (429) com retry automático
   - Salva categorias em `distribuidor_categories`
   - Marca categorias excluídas como `ativo = false`

**Body**:
```json
{
  "distribuidor_id": "uuid-opcional",  // Se vazio, sincroniza todos
  "force": false                        // Força resincronização
}
```

**Response**:
```json
{
  "success": true,
  "distribuidores_processados": 2,
  "distribuidores_sucesso": 2,
  "distribuidores_erro": 0,
  "results": [
    {
      "distribuidor_id": "...",
      "distribuidor_nome": "Brancaleone",
      "success": true,
      "categorias_sincronizadas": 45,
      "categorias_desativadas": 2,
      "total_categorias_mercos": 47
    }
  ]
}
```

### 2. distribuidor_categories → categories

**Endpoint**: `POST /api/admin/categories/sync-global`

**Processo**:
1. Busca todas categorias ativas de `distribuidor_categories`
2. Agrupa por `mercos_id` (categorias únicas)
3. Cria ou atualiza em `categories`:
   - Mantém campos de UI existentes (`visible`, `order`, `jornaleiro_status`)
   - Atualiza nome se mudou na Mercos
   - Preserva configurações manuais do admin
4. Atualiza hierarquia (`parent_category_id`)
5. Desativa categorias que não existem mais

**Response**:
```json
{
  "success": true,
  "categorias_processadas": 45,
  "categorias_novas": 5,
  "categorias_atualizadas": 40,
  "hierarquia_atualizada": 12,
  "timestamp": "2026-02-25T20:00:00Z"
}
```

## 🎨 Painel Admin

### Funcionalidades

#### Sincronização Manual
- Botão "Sincronizar Mercos" no topo da página
- Executa sincronização completa (Mercos → distribuidor_categories → categories)
- Exibe progresso e resultado da sincronização
- Recarrega lista de categorias automaticamente

#### Visualização
- Badge azul "Mercos #123" para categorias sincronizadas
- Timestamp da última sincronização
- Hierarquia visual (futuramente)
- Filtros por origem (Mercos vs Manual)

#### Edição
- Categorias Mercos podem ter campos de UI editados:
  - `visible`: Controla exibição no frontend
  - `order`: Ordem de exibição
  - `jornaleiro_status`: Disponibilidade para jornaleiros
  - `image`: Imagem da categoria
- Nome e hierarquia são preservados da Mercos

### Código

**Página**: `/app/admin/cms/categories/page.tsx`

```typescript
// Função de sincronização
const syncMercos = async () => {
  // 1. Sincronizar Mercos → distribuidor_categories
  const res = await fetch('/api/admin/categories/sync-mercos', {
    method: 'POST',
    body: JSON.stringify({})
  });
  
  // 2. Sincronizar distribuidor_categories → categories
  const resGlobal = await fetch('/api/admin/categories/sync-global', {
    method: 'POST'
  });
  
  // 3. Recarregar categorias
  fetchAll();
};
```

## 📦 Painel Distribuidor

### Funcionalidades (A Implementar)

- Visualização de categorias próprias
- Estatísticas: quantos produtos por categoria
- Sincronização automática ao fazer login
- Indicador de última sincronização

### Estrutura Proposta

**Página**: `/app/distribuidor/categorias/page.tsx`

```typescript
// Lista categorias do distribuidor logado
const { data } = await fetch('/api/distribuidor/categories');

// Exibe:
// - Nome da categoria
// - Quantidade de produtos
// - Status (ativa/inativa)
// - Hierarquia (pai/filhos)
```

**API**: `/app/api/distribuidor/categories/route.ts`

```typescript
// Busca categorias do distribuidor logado
const { data } = await supabase
  .from('distribuidor_categories')
  .select('*, products:products(count)')
  .eq('distribuidor_id', distribuidorId)
  .eq('ativo', true);
```

## 🗞️ Painel Jornaleiro

### Funcionalidades (A Implementar)

- Filtro por categoria na página de pedidos
- Exibe apenas categorias dos distribuidores vinculados
- Respeita `jornaleiro_status` e `jornaleiro_bancas`

### Estrutura Proposta

**Página**: `/app/jornaleiro/pedidos/page.tsx`

```typescript
// Buscar categorias disponíveis
const categorias = await fetch('/api/jornaleiro/categories');

// Filtrar produtos por categoria selecionada
const produtos = produtos.filter(p => 
  !categoriaFiltro || p.category_id === categoriaFiltro
);
```

**API**: `/app/api/jornaleiro/categories/route.ts`

```typescript
// Busca categorias dos distribuidores vinculados ao jornaleiro
// Respeita jornaleiro_status e jornaleiro_bancas
const { data } = await supabase
  .from('categories')
  .select('*')
  .eq('active', true)
  .or(`jornaleiro_status.eq.all,jornaleiro_bancas.cs.{${bancaId}}`);
```

## 🌐 Frontend Público

### Funcionalidades (A Implementar)

- Navegação por categorias na home
- Página `/categorias` com grid de categorias
- Hierarquia: categorias pai → filhas
- Filtro de produtos por categoria

### Hook Atualizado

**Arquivo**: `/lib/useCategories.ts`

```typescript
export function useCategories() {
  // Busca categorias com hierarquia
  const { data } = await fetch('/api/categories');
  
  // Organiza em árvore
  const tree = buildCategoryTree(data);
  
  return { items: tree, loading };
}

function buildCategoryTree(categories: Category[]) {
  const map = new Map();
  const roots = [];
  
  // Primeiro passo: criar mapa
  categories.forEach(cat => map.set(cat.id, { ...cat, children: [] }));
  
  // Segundo passo: construir árvore
  categories.forEach(cat => {
    const node = map.get(cat.id);
    if (cat.parent_category_id) {
      const parent = map.get(cat.parent_category_id);
      if (parent) parent.children.push(node);
    } else {
      roots.push(node);
    }
  });
  
  return roots;
}
```

## 🔧 Manutenção

### Sincronização Automática

**Cron Job Recomendado**: Diário às 3h da manhã

```bash
# Adicionar ao crontab
0 3 * * * curl -X POST https://guiadasbancas.com.br/api/admin/categories/sync-mercos \
  -H "Authorization: Bearer admin-token"
```

### Monitoramento

**Endpoint de Status**: `GET /api/admin/categories/sync-mercos`

```json
{
  "success": true,
  "distribuidores": [
    {
      "distribuidor_id": "...",
      "ultima_sincronizacao": "2026-02-25T03:00:00Z",
      "total_categorias": 45,
      "categorias_ativas": 43
    }
  ]
}
```

### Troubleshooting

#### Erro 401 na API Mercos
- Verificar tokens em `distribuidores.mercos_app_token` e `mercos_company_token`
- Confirmar permissões no painel Mercos

#### Categorias não aparecem no frontend
- Verificar `categories.visible = true`
- Verificar `categories.active = true`
- Executar sincronização global

#### Hierarquia quebrada
- Verificar `parent_category_id` válidos
- Executar sincronização global novamente

## 📊 Estatísticas

### Consultas Úteis

```sql
-- Categorias por distribuidor
SELECT d.nome, COUNT(dc.id) as total_categorias
FROM distribuidores d
LEFT JOIN distribuidor_categories dc ON dc.distribuidor_id = d.id
WHERE dc.ativo = true
GROUP BY d.id, d.nome;

-- Categorias sem produtos
SELECT c.name, COUNT(p.id) as total_produtos
FROM categories c
LEFT JOIN products p ON p.category_id = c.id::text
WHERE c.active = true
GROUP BY c.id, c.name
HAVING COUNT(p.id) = 0;

-- Última sincronização por distribuidor
SELECT d.nome, MAX(dc.updated_at) as ultima_sync
FROM distribuidores d
JOIN distribuidor_categories dc ON dc.distribuidor_id = d.id
GROUP BY d.id, d.nome
ORDER BY ultima_sync DESC;
```

## 🚀 Próximos Passos

1. ✅ **Fase 1**: Sincronização Mercos → distribuidor_categories
2. ✅ **Fase 2**: Painel Admin com integração Mercos
3. ⏳ **Fase 3**: Implementar painéis Distribuidor, Jornaleiro e Frontend
4. ⏳ **Fase 4**: Automação com cron jobs
5. ⏳ **Fase 5**: Webhooks Mercos (notificação de mudanças)

## 📝 Notas

- Categorias manuais (sem `mercos_id`) continuam funcionando normalmente
- Sincronização preserva configurações de UI do admin
- Rate limiting da Mercos é respeitado automaticamente
- Hierarquia de categorias é opcional (pode ter categorias sem pai)
