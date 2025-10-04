# Categorias do Sistema - Documentação

## Categorias Especiais Criadas

### 1. Categoria "Produtos de Distribuidores"
**ID:** `aaaaaaaa-0000-0000-0000-000000000001`  
**Uso:** Frontend - Agrupamento visual no perfil da banca

- **Quando é usada:** Automaticamente atribuída a produtos de distribuidor quando exibidos no perfil público da banca
- **Localização:** Aparece como categoria "Produtos de Distribuidores" no frontend
- **Ordem:** 999 (última posição)

### 2. Categoria "Sem Categoria" (Fallback)
**ID:** `bbbbbbbb-0000-0000-0000-000000000001`  
**Uso:** Backend - Categoria padrão na sincronização

- **Quando é usada:** Atribuída automaticamente quando produtos são importados da API Mercos sem categoria definida
- **Localização:** Fica no banco de dados como `category_id` do produto
- **Ordem:** 998 (penúltima posição)

## Como Funciona

### Fluxo de Sincronização:
```
1. API Mercos retorna produto SEM categoria
           ↓
2. Sistema atribui category_id = "Sem Categoria" 
   (bbbbbbbb-0000-0000-0000-000000000001)
           ↓
3. Produto salvo no Supabase com categoria fallback
           ↓
4. No frontend da banca, é exibido na categoria 
   "Produtos de Distribuidores" (independente da categoria original)
```

### Diferenças:

| Aspecto | Sem Categoria | Produtos de Distribuidores |
|---------|--------------|----------------------------|
| **Finalidade** | Fallback técnico no BD | Agrupamento visual no frontend |
| **Quando aplica** | Na sincronização (backend) | Na exibição (frontend) |
| **Pode ser alterada?** | Sim, pelo admin/sistema | Não (sempre aplicada) |
| **Visível ao usuário?** | Sim, em filtros/listagens | Sim, no perfil da banca |

## SQLs de Criação

### 1. Executar no Supabase:
```sql
-- Categoria fallback (backend)
\i database/create-categoria-sem-categoria.sql

-- Categoria agrupamento (frontend)
\i database/create-categoria-distribuidores.sql
```

## Exemplos de Uso

### Exemplo 1: Produto sem categoria vindo do Mercos
```javascript
// API retorna:
{
  id: "123",
  nome: "Revista Exemplo",
  preco_tabela: 15.90,
  // SEM categoria
}

// Sistema salva como:
{
  id: "abc-123",
  name: "Revista Exemplo",
  price: 15.90,
  category_id: "bbbbbbbb-0000-0000-0000-000000000001", // Sem Categoria
  distribuidor_id: "dist-1"
}
```

### Exemplo 2: Exibição no frontend da banca
```javascript
// Backend retorna produto com category_id = "Sem Categoria"
// Frontend sobrescreve para exibir:
{
  ...produto,
  category_id: "aaaaaaaa-0000-0000-0000-000000000001", // Produtos de Distribuidores
  is_distribuidor: true
}
```

## Verificações

### Como verificar se as categorias existem:
```sql
SELECT id, name, "order", active
FROM categories
WHERE id IN (
  'aaaaaaaa-0000-0000-0000-000000000001',
  'bbbbbbbb-0000-0000-0000-000000000001'
);
```

### Como ver produtos sem categoria original:
```sql
SELECT id, name, category_id, distribuidor_id
FROM products
WHERE category_id = 'bbbbbbbb-0000-0000-0000-000000000001'
  AND distribuidor_id IS NOT NULL;
```

## Manutenção

### Alterar categoria de produto importado:
Se quiser mover um produto de "Sem Categoria" para outra:

```sql
UPDATE products
SET category_id = '[ID_DA_CATEGORIA_DESEJADA]'
WHERE id = '[ID_DO_PRODUTO]';
```

**Nota:** Isso só afeta a categoria no banco. No frontend da banca, sempre será "Produtos de Distribuidores".

---

**Criado em:** 04/10/2025  
**Versão:** 1.0
