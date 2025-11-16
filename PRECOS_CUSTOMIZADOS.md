# Sistema de Preços Customizados

## 📋 Como Funciona

### **Conceito:**
Cada jornaleiro (banca) pode personalizar o preço dos produtos de distribuidores **apenas para sua banca**.

### **Estrutura:**

```
PRODUTO DO DISTRIBUIDOR
    ↓
Preço padrão: R$ 13,90 (definido pelo distribuidor)
    ↓
BANCA A customiza → R$ 15,00 (margem maior)
BANCA B customiza → R$ 14,50 (margem menor)
BANCA C não customiza → R$ 13,90 (usa preço padrão)
```

---

## 🗄️ Estrutura do Banco de Dados

### **Tabela: `products`**
- `id` - ID do produto
- `price` - Preço padrão do distribuidor
- `distribuidor_id` - ID do distribuidor

### **Tabela: `banca_produtos_distribuidor`**
- `id` - ID do relacionamento
- `banca_id` - ID da banca específica
- `product_id` - ID do produto
- `custom_price` - Preço customizado pela banca (NULL = usa preço padrão)
- `enabled` - Se o produto está habilitado para essa banca
- `custom_stock_enabled` - Se usa estoque próprio
- `custom_stock_qty` - Quantidade de estoque próprio

---

## 🔄 Fluxo de Customização

### **1. Jornaleiro acessa catálogo:**
```
GET /api/jornaleiro/catalogo-distribuidor
```

**Retorna:**
```json
{
  "id": "produto-123",
  "name": "ALMANAQUE DO CASCAO N.29",
  "price": 13.9,              // Preço do distribuidor
  "custom_price": null,       // Ainda não customizado
  "distribuidor_price": 13.9, // Preço original
  "effective_price": 13.9     // Preço efetivo (usa padrão)
}
```

### **2. Jornaleiro edita o produto:**
```
Página: /jornaleiro/catalogo-distribuidor/editar/[id]
```

**Campos:**
- Preço do distribuidor: R$ 13,90 (somente leitura)
- Preço customizado: R$ 15,00 (editável)
- Margem: 7.7% (calculada automaticamente)

### **3. Jornaleiro salva:**
```
PUT /api/jornaleiro/catalogo-distribuidor/[productId]

Body:
{
  "custom_price": 15.00
}
```

**Salva em:**
```sql
INSERT INTO banca_produtos_distribuidor (banca_id, product_id, custom_price)
VALUES ('banca-abc', 'produto-123', 15.00)
ON CONFLICT (banca_id, product_id) 
DO UPDATE SET custom_price = 15.00;
```

### **4. Catálogo atualizado:**
```json
{
  "id": "produto-123",
  "name": "ALMANAQUE DO CASCAO N.29",
  "price": 13.9,              // Preço do distribuidor (inalterado)
  "custom_price": 15.0,       // Preço customizado pela banca
  "distribuidor_price": 13.9, // Preço original
  "effective_price": 15.0     // Preço efetivo (usa customizado)
}
```

---

## 🎯 Exibição nos Cards

### **Produto SEM customização:**
```
┌─────────────────────────┐
│ ALMANAQUE DO CASCAO     │
│                         │
│ Preço original: R$ 13,90│
│ Estoque: 313            │
└─────────────────────────┘
```

### **Produto COM customização:**
```
┌─────────────────────────┐
│ ALMANAQUE DO CASCAO     │
│                         │
│ Preço original: R̶$̶ ̶1̶3̶,̶9̶0̶│
│ Preço customizado: R$ 15,00 │
│ Estoque: 313            │
└─────────────────────────┘
```

---

## 🐛 Problema Atual

### **Sintoma:**
Cards mostram "Preço customizado: R$ 1,39" ao invés de "R$ 13,90"

### **Causa:**
Versão antiga do código salvou valores incorretos no banco:
- Deveria salvar: `13.9`
- Foi salvo: `1.39`

### **Afetados:**
Apenas produtos que foram customizados **antes da correção do código**.

### **Solução:**
Execute o script de correção:
```bash
# 1. Verificar quais preços estão errados
psql -f database/CHECK-custom-prices.sql

# 2. Corrigir os preços
psql -f database/FIX-custom-prices.sql
```

---

## ✅ Código Atual (Correto)

### **Input de preço:**
```typescript
// Tipo: text (não number)
// Formato: decimal (13.90)
<input
  type="text"
  inputMode="decimal"
  value={customPrice}
  onChange={(e) => {
    const value = e.target.value.replace(/[^\d,\.]/g, '').replace(',', '.');
    setCustomPrice(value);
  }}
  onBlur={(e) => {
    const num = parseFloat(e.target.value);
    if (!isNaN(num)) {
      setCustomPrice(num.toFixed(2));
    }
  }}
/>
```

### **Salvamento:**
```typescript
// parseFloat converte string decimal para número
const body = {
  custom_price: parseFloat(customPrice) // "13.90" → 13.9 ✅
};
```

---

## 📊 Exemplos Práticos

### **Exemplo 1: Banca aumenta margem**
```
Produto: INVENCÍVEL VOL.03
Preço distribuidor: R$ 49,90
Preço customizado: R$ 55,00
Margem: 10.2%
```

### **Exemplo 2: Banca faz promoção**
```
Produto: SURFISTA PRATEADO
Preço distribuidor: R$ 39,90
Preço customizado: R$ 35,00
Margem: -12.3% (prejuízo ou atração)
```

### **Exemplo 3: Banca usa preço padrão**
```
Produto: SONO BISQUE DOLL
Preço distribuidor: R$ 44,90
Preço customizado: null
Preço efetivo: R$ 44,90 (usa padrão)
```

---

## 🔍 Debugging

### **Ver preços de uma banca específica:**
```sql
SELECT 
  p.name,
  p.price as preco_distribuidor,
  bpd.custom_price as preco_customizado,
  COALESCE(bpd.custom_price, p.price) as preco_efetivo
FROM banca_produtos_distribuidor bpd
JOIN products p ON p.id = bpd.product_id
WHERE bpd.banca_id = 'ID_DA_BANCA'
  AND bpd.enabled = true;
```

### **Ver todas as customizações:**
```sql
SELECT 
  b.name as banca,
  p.name as produto,
  p.price as original,
  bpd.custom_price as customizado
FROM banca_produtos_distribuidor bpd
JOIN bancas b ON b.id = bpd.banca_id
JOIN products p ON p.id = bpd.product_id
WHERE bpd.custom_price IS NOT NULL;
```

---

## 🚀 Próximos Passos

1. **Execute o script de correção** para fixar preços errados
2. **Teste a edição** de um produto para confirmar que salva corretamente
3. **Verifique os cards** para confirmar exibição correta
4. **Documente** para o jornaleiro como customizar preços
