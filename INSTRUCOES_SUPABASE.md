# 🔥 AÇÃO NECESSÁRIA: Executar SQL no Supabase

## ⚠️ IMPORTANTE: Execute este SQL AGORA no Supabase

Para que os pedidos funcionem corretamente, você precisa adicionar o campo `customer_address` na tabela `orders`.

### 📍 Como Executar:

1. **Acesse o Supabase:** https://supabase.com/dashboard/project/rgqlncxrzwgjreggrjcq
2. **Vá em:** SQL Editor (menu lateral)
3. **Cole e execute este SQL:**

```sql
-- Adicionar campo customer_address na tabela orders
ALTER TABLE orders ADD COLUMN IF NOT EXISTS customer_address TEXT;

-- Comentário
COMMENT ON COLUMN orders.customer_address IS 'Endereço completo do cliente para entrega';
```

4. **Clique em:** RUN

### ✅ Como Verificar se Funcionou:

```sql
-- Verificar estrutura da tabela orders
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'orders' 
ORDER BY ordinal_position;
```

Deve aparecer `customer_address` com tipo `text` na lista.

---

## 🎯 O que foi corrigido no código:

### ❌ ANTES (Problemas):
1. Pedidos salvos em memória → **sumiam ao restart**
2. Array local → **não aparece no painel**
3. WhatsApp hardcoded → **'banca-001' fixo**
4. Sem dados da banca → **endereço vazio**

### ✅ AGORA (Soluções):
1. **Pedidos salvos no Supabase** → persistem permanentemente
2. **GET busca do banco** → aparecem no painel do jornaleiro
3. **WhatsApp usa banca_id real** → envia para número correto
4. **JOIN com tabela bancas** → nome, endereço, telefone completos

---

## 📋 Fluxo Completo:

### **1. Cliente faz pedido:**
```
POST /api/orders
├── Extrai banca_id do produto
├── Busca dados da banca no Supabase
├── Salva pedido no Supabase (tabela orders)
├── Envia WhatsApp para banca (número real!)
└── Retorna: pedido + dados da banca
```

### **2. Jornaleiro vê pedido:**
```
GET /api/orders?banca_id=XXX
├── Busca pedidos do Supabase
├── JOIN com tabela bancas
├── Filtra por banca (jornaleiro vê só os seus)
└── Retorna: pedidos com dados completos
```

### **3. Cliente vê histórico:**
```
GET /api/orders (localStorage)
└── Mostra: pedido + nome da banca + endereço
```

---

## 🧪 Como Testar:

### **Teste 1: Fazer Novo Pedido**
1. Adicione produtos ao carrinho
2. Vá para `/checkout`
3. Preencha dados e finalize
4. ✅ **Deve:**
   - Salvar no Supabase
   - Aparecer no painel do jornaleiro
   - WhatsApp enviado para a banca
   - Dados da banca preenchidos no histórico

### **Teste 2: Painel do Jornaleiro**
1. Acesse `/jornaleiro` (login como jornaleiro)
2. Vá em "Pedidos"
3. ✅ **Deve mostrar:**
   - Pedidos da sua banca
   - Nome do cliente
   - Status
   - Total
   - Data

### **Teste 3: Histórico do Cliente**
1. Acesse `/minha-conta`
2. Vá em "Meus Pedidos"
3. ✅ **Deve mostrar:**
   - Pedidos realizados
   - Nome da banca
   - Endereço da banca (não mais vazio!)
   - Status

---

## 🔍 Logs Importantes:

### **Console do servidor (Vercel):**
```
[NOVO PEDIDO CRIADO] { 
  orderId: 'ORD-1759610647571', 
  customer: 'Suelen Santos', 
  total: 14.16, 
  banca: 'Banca do João' 
}

[WHATSAPP] Notificação enviada para Banca do João (11999999999) - Pedido #ORD-1759610647571
```

---

## 📊 Estrutura da Tabela Orders:

```sql
CREATE TABLE orders (
    id TEXT PRIMARY KEY,                    -- ORD-timestamp
    customer_name VARCHAR(255) NOT NULL,    -- Nome do cliente
    customer_phone VARCHAR(20) NOT NULL,    -- Telefone cliente
    customer_email VARCHAR(255),            -- Email cliente
    customer_address TEXT,                  -- ✅ NOVO: Endereço completo
    items JSONB NOT NULL,                   -- Array de produtos
    subtotal DECIMAL(10, 2) NOT NULL,       -- Subtotal
    shipping_fee DECIMAL(10, 2) DEFAULT 0,  -- Taxa de entrega
    total DECIMAL(10, 2) NOT NULL,          -- Total
    payment_method VARCHAR(50) NOT NULL,    -- pix, cash, card
    status VARCHAR(50) DEFAULT 'novo',      -- novo, preparando, etc
    notes TEXT,                             -- Observações
    estimated_delivery TIMESTAMP,           -- Previsão de entrega
    banca_id UUID REFERENCES bancas(id),    -- FK para bancas
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

---

## ✅ Checklist Final:

- [ ] Executar SQL no Supabase (`ALTER TABLE orders ADD COLUMN customer_address TEXT`)
- [ ] Verificar que coluna foi criada
- [ ] Fazer novo pedido de teste
- [ ] Verificar que aparece no painel do jornaleiro
- [ ] Verificar que dados da banca estão preenchidos
- [ ] Verificar logs do WhatsApp no console

---

**Depois de executar o SQL, tudo funcionará perfeitamente!** 🎉✨
