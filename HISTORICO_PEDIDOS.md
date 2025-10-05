# Sistema de Histórico de Pedidos

Sistema completo para registrar todas as interações e mudanças em pedidos entre jornaleiros e clientes.

## 📋 Tabela no Supabase

### Estrutura: `order_history`

```sql
CREATE TABLE order_history (
  id UUID PRIMARY KEY,
  order_id UUID NOT NULL,
  action VARCHAR(50) NOT NULL,
  old_value TEXT,
  new_value TEXT NOT NULL,
  user_id UUID,
  user_name VARCHAR(255) NOT NULL,
  user_role VARCHAR(50),
  details TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Tipos de Ações Suportadas

- `created` - Pedido criado
- `status_change` - Mudança de status
- `note_added` - Observação adicionada
- `delivery_updated` - Previsão de entrega atualizada
- `payment_updated` - Pagamento atualizado
- `customer_message` - Mensagem do cliente
- `vendor_message` - Mensagem do jornaleiro
- `item_added` - Item adicionado ao pedido
- `item_removed` - Item removido do pedido
- `price_adjusted` - Preço ajustado

### Papéis de Usuário

- `customer` - Cliente
- `vendor` - Jornaleiro/Vendedor
- `admin` - Administrador
- `system` - Sistema automático

---

## 🔧 Como Usar

### 1. Registrar Criação de Pedido

```typescript
import { logOrderCreated } from '@/lib/orderHistory';

// Ao criar um pedido
await logOrderCreated(
  orderId,
  'João Silva', // Nome do cliente
  'Pedido criado via site' // Detalhes opcionais
);
```

### 2. Registrar Mudança de Status

```typescript
import { logStatusChange } from '@/lib/orderHistory';

// Quando jornaleiro confirma pedido
await logStatusChange(
  orderId,
  'novo', // Status anterior
  'confirmado', // Novo status
  'Maria Alves', // Nome do jornaleiro
  'vendor', // Papel do usuário
  'Pedido confirmado pelo jornaleiro' // Detalhes opcionais
);
```

### 3. Adicionar Observação

```typescript
import { logNote } from '@/lib/orderHistory';

// Jornaleiro adiciona nota
await logNote(
  orderId,
  'Cliente solicitou entrega após 14h',
  'Maria Alves',
  'vendor'
);
```

### 4. Atualizar Previsão de Entrega

```typescript
import { logDeliveryUpdate } from '@/lib/orderHistory';

// Atualizar horário de entrega
await logDeliveryUpdate(
  orderId,
  '2024-01-15T15:00:00Z', // Horário anterior
  '2024-01-15T16:00:00Z', // Novo horário
  'Maria Alves',
  'vendor',
  'Previsão ajustada a pedido do cliente'
);
```

### 5. Registrar Mensagem do Cliente

```typescript
import { logCustomerMessage } from '@/lib/orderHistory';

// Cliente envia mensagem
await logCustomerMessage(
  orderId,
  'Posso buscar o pedido às 16h?',
  'João Silva'
);
```

### 6. Registrar Mensagem do Jornaleiro

```typescript
import { logVendorMessage } from '@/lib/orderHistory';

// Jornaleiro responde
await logVendorMessage(
  orderId,
  'Sim, pode buscar às 16h sem problemas!',
  'Maria Alves'
);
```

---

## 📊 Exibir Histórico

### No Painel do Jornaleiro

```tsx
import OrderHistory from '@/components/admin/OrderHistory';

<OrderHistory orderId={order.id} />
```

O componente automaticamente:
- ✅ Busca dados da API
- ✅ Formata datas e horários
- ✅ Mostra ícones coloridos por tipo de ação
- ✅ Exibe timeline visual
- ✅ Destaca mudanças de status
- ✅ Mostra nome do usuário e timestamp

---

## 🎨 Exemplo de Timeline Visual

```
🆕  Pedido criado
    Pedido criado pelo cliente
    15/01/2024, 07:30
    João Silva

🔄  Status alterado
    novo → confirmado
    Pedido confirmado pelo jornaleiro
    15/01/2024, 07:45
    Maria Alves

📝  Observação adicionada
    Cliente solicitou entrega após 14h
    15/01/2024, 07:46
    Maria Alves

🚚  Previsão de entrega atualizada
    De 15/01/2024, 12:00 Para 15/01/2024, 13:00
    15/01/2024, 08:00
    Maria Alves

🔄  Status alterado
    confirmado → em_preparo
    Iniciado preparo dos produtos
    15/01/2024, 09:00
    Maria Alves
```

---

## 🔌 API Endpoints

### GET /api/orders/[id]/history

Busca histórico de um pedido específico.

**Resposta:**
```json
{
  "data": [
    {
      "id": "uuid",
      "order_id": "uuid",
      "action": "status_change",
      "old_value": "novo",
      "new_value": "confirmado",
      "user_name": "Maria Alves",
      "user_role": "vendor",
      "details": "Pedido confirmado",
      "created_at": "2024-01-15T10:45:00Z"
    }
  ]
}
```

### POST /api/orders/[id]/history

Adiciona nova entrada no histórico.

**Body:**
```json
{
  "action": "note_added",
  "new_value": "Observação do jornaleiro",
  "user_name": "Maria Alves",
  "user_role": "vendor",
  "details": "Detalhes opcionais"
}
```

---

## ✅ Melhores Práticas

1. **Sempre registre mudanças de status**
   ```typescript
   // Ao mudar status do pedido
   await updateOrderStatus(orderId, newStatus);
   await logStatusChange(orderId, oldStatus, newStatus, userName, userRole);
   ```

2. **Registre interações importantes**
   - Mensagens entre cliente e jornaleiro
   - Alterações de horário de entrega
   - Ajustes de preço
   - Adição/remoção de itens

3. **Use detalhes para contexto**
   ```typescript
   await logStatusChange(
     orderId,
     'em_preparo',
     'saiu_para_entrega',
     'Maria Alves',
     'vendor',
     'Pedido saiu com o entregador Pedro às 14h30'
   );
   ```

4. **Mantenha consistência nos nomes**
   - Use o nome completo ou apelido consistentemente
   - Para sistema automático, use "Sistema"

---

## 🚀 Benefícios

- ✅ **Transparência total** - Cliente e jornaleiro veem todas as interações
- ✅ **Auditoria completa** - Registro de quem fez o quê e quando
- ✅ **Resolução de conflitos** - Histórico claro para resolver disputas
- ✅ **Melhoria de processo** - Analisar tempos e gargalos
- ✅ **Experiência do cliente** - Cliente acompanha status em tempo real

---

## 📝 TODO / Melhorias Futuras

- [ ] Notificações push quando houver nova entrada
- [ ] Filtros por tipo de ação
- [ ] Export de histórico para PDF
- [ ] Métricas de tempo entre status
- [ ] Chat integrado no histórico
