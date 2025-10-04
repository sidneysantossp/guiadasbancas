# Configuração de Entrega por Banca

## 📦 O que foi implementado

Sistema para controlar se uma banca trabalha com entrega/frete ou apenas retirada no local.

### **Funcionalidades condicionais:**
1. ✅ **Seção de endereço** no checkout (só aparece se entrega habilitada)
2. ✅ **Cálculo de frete** no checkout (só aparece se entrega habilitada)
3. ✅ **Barra de meta de frete grátis** na página da banca (só aparece se entrega habilitada)
4. ✅ **Barra de meta no checkout** (só aparece se entrega habilitada)

---

## 🗄️ Passo 1: Executar Script SQL

Execute o script no **SQL Editor** do Supabase:

```bash
database/add-shipping-config-to-bancas.sql
```

Ou copie e cole:

```sql
-- Adicionar configurações de frete/entrega à tabela bancas

ALTER TABLE bancas 
ADD COLUMN IF NOT EXISTS delivery_enabled BOOLEAN DEFAULT false;

ALTER TABLE bancas 
ADD COLUMN IF NOT EXISTS free_shipping_threshold DECIMAL(10,2) DEFAULT 120.00;

ALTER TABLE bancas 
ADD COLUMN IF NOT EXISTS origin_cep VARCHAR(9);

COMMENT ON COLUMN bancas.delivery_enabled IS 'Indica se a banca trabalha com entrega/frete';
COMMENT ON COLUMN bancas.free_shipping_threshold IS 'Valor mínimo para frete grátis em R$';
COMMENT ON COLUMN bancas.origin_cep IS 'CEP de origem da banca para cálculo de frete';

CREATE INDEX IF NOT EXISTS idx_bancas_delivery_enabled ON bancas(delivery_enabled);
```

---

## ⚙️ Passo 2: Configurar Bancas

### **Habilitar entrega para uma banca:**

```sql
UPDATE bancas 
SET 
  delivery_enabled = true,
  free_shipping_threshold = 120.00,
  origin_cep = '01001-000'
WHERE id = 'ID_DA_BANCA';
```

### **Habilitar para TODAS as bancas:**

```sql
UPDATE bancas 
SET delivery_enabled = true;
```

### **Desabilitar entrega (apenas retirada):**

```sql
UPDATE bancas 
SET delivery_enabled = false
WHERE id = 'ID_DA_BANCA';
```

---

## 🧪 Passo 3: Testar

### **Teste 1: Banca COM entrega habilitada**

1. Habilite entrega para uma banca
2. Acesse o perfil da banca
3. ✅ **Deve aparecer:** Barra de meta de frete grátis abaixo do banner
4. Adicione produtos ao carrinho
5. Vá para o checkout
6. ✅ **Deve aparecer:** 
   - Seção "Endereço de entrega"
   - Seção "Entrega" com cálculo de frete
   - Barra de meta de frete grátis

### **Teste 2: Banca SEM entrega (apenas retirada)**

1. Desabilite entrega para uma banca
2. Acesse o perfil da banca
3. ❌ **NÃO deve aparecer:** Barra de meta de frete grátis
4. Adicione produtos ao carrinho
5. Vá para o checkout
6. ❌ **NÃO deve aparecer:**
   - Seção "Endereço de entrega"
   - Seção "Entrega"
   - Barra de meta de frete grátis
7. ✅ **Deve aparecer apenas:** Opção "Retirar na banca"

---

## 📊 Estrutura das Colunas

| Coluna | Tipo | Default | Descrição |
|--------|------|---------|-----------|
| `delivery_enabled` | BOOLEAN | `false` | Habilita/desabilita entrega |
| `free_shipping_threshold` | DECIMAL(10,2) | `120.00` | Valor mínimo para frete grátis |
| `origin_cep` | VARCHAR(9) | `NULL` | CEP de origem para cálculo |

---

## 🎯 Casos de Uso

### **Banca tradicional (apenas retirada):**
```sql
delivery_enabled = false
```
- Cliente só pode retirar no local
- Não aparece opções de entrega
- Fluxo mais simples

### **Banca com entrega:**
```sql
delivery_enabled = true
free_shipping_threshold = 120.00
origin_cep = '01001-000'
```
- Cliente pode escolher entre retirada ou entrega
- Cálculo de frete disponível
- Meta de frete grátis visível

---

## 🔧 API Atualizada

A API `/api/admin/bancas` agora retorna:
```json
{
  "delivery_enabled": true,
  "free_shipping_threshold": 120.00,
  "origin_cep": "01001-000"
}
```

---

## ✅ Checklist de Configuração

- [ ] Script SQL executado no Supabase
- [ ] Colunas criadas na tabela `bancas`
- [ ] Índice criado para performance
- [ ] Configurar `delivery_enabled` para bancas desejadas
- [ ] Testar banca COM entrega
- [ ] Testar banca SEM entrega
- [ ] Verificar que funcionalidades aparecem/desaparecem corretamente

---

## 🐛 Troubleshooting

### **Barra de frete sempre aparece:**
- Verifique se `delivery_enabled` está como `false` no banco
- Limpe cache do navegador (Ctrl+Shift+R)
- Verifique logs do console (F12)

### **Erro ao salvar configuração:**
- Certifique-se que as colunas existem no banco
- Verifique permissões RLS se estiverem habilitadas

### **API não retorna delivery_enabled:**
- Verifique se o script SQL foi executado
- Rode `SELECT delivery_enabled FROM bancas LIMIT 1;` para confirmar
