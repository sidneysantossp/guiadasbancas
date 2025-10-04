# ⭐ Feature: Destacar Produtos de Distribuidores

## 📋 Resumo

Permite ao jornaleiro marcar produtos de distribuidores para aparecerem na galeria de **"Ofertas e Promoções"** da sua banca no frontend público.

---

## 🎯 Funcionalidade

### Painel do Jornaleiro

**Localização:** `/jornaleiro/catalogo-distribuidor/editar/[id]`

**Checkbox:** "⭐ Destacar em Ofertas e Promoções"
- Aparece após a seção "Tipo de Entrega"
- Background amarelo (amber-50)
- Descrição: "Este produto aparecerá na galeria de ofertas e promoções da sua banca"

### Frontend Público

**Localização:** Galeria "🔥 Ofertas e Promoções" na página da banca

**Produtos mostrados:**
1. Produtos próprios marcados como `featured = true`
2. Produtos de distribuidores com `custom_featured = true`
3. Máximo: 12 produtos
4. Filtro: Apenas produtos com estoque > 0

---

## 🗄️ Banco de Dados

### SQL para criar campo:

```sql
ALTER TABLE banca_produtos_distribuidor
ADD COLUMN IF NOT EXISTS custom_featured BOOLEAN DEFAULT false;

COMMENT ON COLUMN banca_produtos_distribuidor.custom_featured 
IS 'Se true, produto aparece na galeria de ofertas e promoções da banca';
```

**Arquivo:** `database/add-custom-featured-field.sql`

---

## 🔧 Implementação Técnica

### 1. Backend - API de Edição

**Arquivo:** `app/api/jornaleiro/catalogo-distribuidor/[productId]/route.ts`

**Campo aceito no PATCH:**
```typescript
{
  custom_featured: boolean
}
```

### 2. Backend - API de Listagem

**Arquivo:** `app/api/jornaleiro/catalogo-distribuidor/route.ts`

**Retorna:**
```typescript
{
  custom_featured: boolean // default: false
}
```

### 3. Backend - API de Produtos em Destaque

**Arquivo:** `app/api/banca/[id]/featured/route.ts`

**Lógica:**
```typescript
// 1. Buscar produtos próprios com featured = true
const produtosProprios = await supabase
  .from('products')
  .eq('banca_id', bancaId)
  .eq('featured', true)
  .eq('active', true);

// 2. Buscar customizações com custom_featured = true
const customizacoes = await supabase
  .from('banca_produtos_distribuidor')
  .eq('banca_id', bancaId)
  .eq('custom_featured', true)
  .eq('enabled', true);

// 3. Buscar produtos de distribuidores
// 4. Filtrar por estoque > 0
// 5. Combinar e limitar a 12 produtos
```

### 4. Frontend - Formulário de Edição

**Arquivo:** `app/jornaleiro/catalogo-distribuidor/editar/[id]/page.tsx`

**Estado:**
```typescript
const [customFeatured, setCustomFeatured] = useState(false);
```

**UI:**
```tsx
<div className="border-2 border-amber-200 rounded-lg p-4 bg-amber-50">
  <label className="flex items-center cursor-pointer">
    <input
      type="checkbox"
      checked={customFeatured}
      onChange={(e) => setCustomFeatured(e.target.checked)}
      className="mr-3 h-5 w-5 text-amber-500 rounded focus:ring-2 focus:ring-amber-500"
    />
    <div>
      <span className="text-sm font-semibold text-gray-900 flex items-center gap-2">
        ⭐ Destacar em Ofertas e Promoções
      </span>
      <p className="text-xs text-gray-600 mt-1">
        Este produto aparecerá na galeria de ofertas e promoções da sua banca
      </p>
    </div>
  </label>
</div>
```

---

## 🧪 Como Testar

### Passo 1: Executar SQL
```sql
-- No Supabase SQL Editor
ALTER TABLE banca_produtos_distribuidor
ADD COLUMN IF NOT EXISTS custom_featured BOOLEAN DEFAULT false;
```

### Passo 2: Reiniciar servidor
```bash
npm run dev
```

### Passo 3: Marcar produto como destaque
1. Acesse `/jornaleiro/catalogo-distribuidor`
2. Clique em "Editar" em um produto
3. Ative "⭐ Destacar em Ofertas e Promoções"
4. Salve

### Passo 4: Verificar no frontend
1. Acesse `/banca/sp/[slug]`
2. Veja a galeria "🔥 Ofertas e Promoções"
3. O produto deve aparecer (se tiver estoque)

---

## ✅ Validações

### Backend
- ✅ Apenas produtos habilitados (`enabled = true`)
- ✅ Apenas produtos com estoque > 0
- ✅ Respeita estoque próprio vs distribuidor
- ✅ Máximo 12 produtos

### Frontend
- ✅ Checkbox salva corretamente
- ✅ Estado persiste após reload
- ✅ Visual destacado (fundo amarelo)

---

## 📊 Casos de Uso

### Caso 1: Produto com estoque próprio
```
Distribuidor: 0 un
Estoque próprio: 10 un
Custom featured: true
Status: Disponível
→ APARECE na galeria ✅
```

### Caso 2: Produto sem estoque
```
Distribuidor: 0 un
Estoque próprio: 0 un
Custom featured: true
→ NÃO APARECE ❌
```

### Caso 3: Produto desabilitado
```
Distribuidor: 10 un
Custom featured: true
Enabled: false
→ NÃO APARECE ❌
```

---

## 🎨 Design

**Cor:** Amarelo (amber) - diferencia de outras seções
**Ícone:** ⭐ (estrela)
**Posição:** Após "Tipo de Entrega"

---

## 📈 Benefícios

✅ **Jornaleiro tem controle** sobre quais produtos destacar
✅ **Aumenta visibilidade** de produtos específicos
✅ **Melhora conversão** ao destacar produtos estratégicos
✅ **Flexibilidade** - pode destacar produtos próprios E de distribuidores

---

**Status:** ✅ Implementado  
**Data:** 04/10/2025  
**Versão:** 1.0.0
