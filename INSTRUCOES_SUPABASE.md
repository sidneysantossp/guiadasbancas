# 🔥 AÇÃO NECESSÁRIA: Executar SQL no Supabase

## ⚠️ IMPORTANTE: Execute estes SQLs AGORA no Supabase

Para que os pedidos funcionem corretamente, você precisa executar 2 migrações SQL:

### 📍 Como Executar:

1. **Acesse o Supabase:** https://supabase.com/dashboard/project/rgqlncxrzwgjreggrjcq
2. **Vá em:** SQL Editor (menu lateral)
3. **Cole e execute este SQL (COPIE TUDO):**

```sql
-- ========================================
-- MIGRAÇÃO 1: Adicionar customer_address
-- ========================================
ALTER TABLE orders ADD COLUMN IF NOT EXISTS customer_address TEXT;
COMMENT ON COLUMN orders.customer_address IS 'Endereço completo do cliente para entrega';

-- ========================================
-- MIGRAÇÃO 2: Adicionar order_number
-- ========================================
ALTER TABLE orders ADD COLUMN IF NOT EXISTS order_number VARCHAR(50) UNIQUE;
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON orders(order_number);
COMMENT ON COLUMN orders.order_number IS 'Número do pedido no formato ORD-timestamp (ex: ORD-1759613705412)';
```

4. **Clique em:** RUN (botão verde)

### ✅ Como Verificar se Funcionou:

```sql
-- Verificar estrutura da tabela orders
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'orders' 
ORDER BY ordinal_position;
```

Deve aparecer:
- `customer_address` com tipo `text`
- `order_number` com tipo `character varying`

---

## 🎯 O que foi corrigido no código:

### ❌ ANTES (Problemas):
1. **Erro UUID:** `invalid input syntax for type uuid: "ORD-1759613705412"`
2. Pedidos salvos em memória → **sumiam ao restart**
3. Array local → **não aparece no painel**
4. WhatsApp hardcoded → **'banca-001' fixo**
5. Sem dados da banca → **endereço vazio**

### ✅ AGORA (Soluções):
1. **UUID correto:** ID gerado automaticamente pelo Supabase, `order_number` para exibição
2. **Pedidos salvos no Supabase** → persistem permanentemente
3. **GET busca do banco** → aparecem no painel do jornaleiro
4. **WhatsApp usa banca_id real** → envia para número correto
5. **JOIN com tabela bancas** → nome, endereço, telefone completos

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
