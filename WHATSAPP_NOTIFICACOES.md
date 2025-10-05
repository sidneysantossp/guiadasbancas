# 📱 Sistema de Notificações WhatsApp

Sistema completo de notificações automáticas via WhatsApp para clientes e jornaleiros.

---

## 🎯 Funcionamento

### Quando o Status do Pedido Muda:

1. **Cliente recebe notificação** com:
   - Status atualizado
   - Número do pedido
   - Mensagem personalizada
   - Previsão de entrega (se houver)

2. **Jornaleiro recebe confirmação** com:
   - Confirmação da mudança
   - Dados do cliente
   - Status anterior → novo status
   - Confirmação de que cliente foi notificado

---

## 📋 Tipos de Status e Mensagens

### 🆕 Novo Pedido
**Cliente:**
```
🆕 Pedido Recebido

📋 Pedido: #abc12345

Recebemos seu pedido com sucesso! Estamos analisando 
e em breve você receberá a confirmação.

💬 Dúvidas?
Entre em contato com a banca!

Atualizado em: 05/10, 12:30
```

**Jornaleiro:**
```
🛒 NOVO PEDIDO - Banca Interlagos

📋 Pedido: #abc12345
👤 Cliente: João Silva
📱 Telefone: (11) 98765-4321

📦 Produtos:
1. Produto X
   Qtd: 2x | Valor: R$ 10.00

💰 Total: R$ 20.00
🚚 Entrega: Retirada
💳 Pagamento: PIX

⏰ Recebido em: 05/10/2025, 12:30

✅ Acesse seu painel para gerenciar este pedido.
```

---

### ✅ Pedido Confirmado
**Cliente:**
```
✅ Pedido Confirmado

📋 Pedido: #abc12345

Seu pedido foi confirmado! Estamos separando os produtos para você.

⏰ Previsão de entrega:
05/10/2025, 14:30

💬 Dúvidas?
Entre em contato com a banca!

Atualizado em: 05/10, 12:35
```

**Jornaleiro:**
```
✅ Atualização de Pedido - Banca Interlagos

📋 Pedido: #abc12345
👤 Cliente: João Silva
🔄 Status alterado: Novo → Confirmado

📱 Confirmação enviada!
O cliente João Silva foi notificado sobre a mudança de status.

⏰ 05/10/2025, 12:35
```

---

### 📦 Em Preparo
**Cliente:**
```
📦 Pedido em Preparo

📋 Pedido: #abc12345

Seu pedido está sendo preparado com carinho! 
Em breve estará pronto para entrega.

⏰ Previsão de entrega:
05/10/2025, 14:30

💬 Dúvidas?
Entre em contato com a banca!

Atualizado em: 05/10, 13:00
```

---

### 🚚 Saiu para Entrega
**Cliente:**
```
🚚 Saiu para Entrega

📋 Pedido: #abc12345

Seu pedido saiu para entrega! 
Logo chegará no endereço informado.

⏰ Previsão de entrega:
05/10/2025, 14:30

💬 Dúvidas?
Entre em contato com a banca!

Atualizado em: 05/10, 13:30
```

---

### 🎉 Entregue
**Cliente:**
```
🎉 Pedido Entregue

📋 Pedido: #abc12345

Seu pedido foi entregue com sucesso! 
Esperamos que aproveite!

💬 Dúvidas?
Entre em contato com a banca!

Atualizado em: 05/10, 14:30
```

---

## 🔧 Configuração

### 1. **Configuração do Admin (WhatsApp Principal)**

No painel admin, configure:
- URL da Evolution API
- API Key
- Nome da Instância

```
📍 /admin/configuracoes/whatsapp
```

---

### 2. **Configuração do Jornaleiro**

Cada jornaleiro precisa cadastrar:
- Número do WhatsApp da banca
- Ativar notificações

```
📍 /jornaleiro/configuracoes/whatsapp
```

---

## 🚀 Como Funciona Tecnicamente

### Fluxo de Notificação:

```
[Jornaleiro clica "Avançar Status"]
           ↓
[Sistema atualiza pedido no banco]
           ↓
[Registra no histórico]
           ↓
[Envia WhatsApp para CLIENTE] ← Evolution API
           ↓
[Envia WhatsApp para JORNALEIRO] ← Evolution API
           ↓
[Mostra confirmação no painel]
```

---

## 📁 APIs Criadas

### `/api/whatsapp/status-update` (POST)
Envia notificação de status ao **CLIENTE**

**Body:**
```json
{
  "orderId": "abc123",
  "customerPhone": "11987654321",
  "newStatus": "confirmado",
  "estimatedDelivery": "2025-10-05T14:30:00Z"
}
```

---

### `/api/whatsapp/jornaleiro-notification` (POST)
Envia confirmação ao **JORNALEIRO**

**Body:**
```json
{
  "orderId": "abc123",
  "bancaId": "uuid-banca",
  "action": "status_change",
  "oldStatus": "novo",
  "newStatus": "confirmado",
  "customerName": "João Silva"
}
```

---

## 🎨 Feedback Visual

### No Painel do Jornaleiro:

Ao mudar status, aparecem notificações:

```
✅ Pedido atualizado com sucesso
📱 Cliente notificado via WhatsApp
📱 Você recebeu confirmação via WhatsApp
```

---

## 🐛 Troubleshooting

### Cliente não recebeu:
1. ✅ Verificar se WhatsApp está conectado (Evolution API)
2. ✅ Verificar número do cliente (com DDD)
3. ✅ Ver logs no console: `[WhatsApp] ✅ Cliente notificado`

### Jornaleiro não recebeu:
1. ✅ Verificar se cadastrou WhatsApp nas configurações
2. ✅ Verificar se ativou notificações
3. ✅ Ver logs: `[WhatsApp] ✅ Jornaleiro notificado`

### WhatsApp desconectado:
1. ✅ Acessar painel Evolution API
2. ✅ Reconectar instância
3. ✅ Verificar status: `/api/admin/whatsapp/status`

---

## 📊 Logs para Debug

No console do navegador:
```
[WhatsApp] Notificação enviada ao cliente: 11987654321
[WhatsApp] ✅ Cliente notificado: 11987654321
[WhatsApp] ✅ Status enviado para 5511987654321 - Pedido Confirmado
[WhatsApp] ✅ Jornaleiro notificado
[WhatsApp] ✅ Notificação enviada para Banca Interlagos (5511912345678)
```

---

## ✅ Checklist de Funcionamento

- [ ] Evolution API configurada no admin
- [ ] Instância WhatsApp conectada
- [ ] Jornaleiro cadastrou número do WhatsApp
- [ ] Jornaleiro ativou notificações
- [ ] Cliente tem número de telefone cadastrado
- [ ] Pedido tem `customer_phone` preenchido

---

## 🎯 Benefícios

1. ✅ **Cliente sempre informado** - Transparência total
2. ✅ **Jornaleiro recebe confirmação** - Segurança na comunicação
3. ✅ **Reduz ligações** - Menos contato manual necessário
4. ✅ **Profissionalização** - Experiência de grande e-commerce
5. ✅ **Rastreabilidade** - Histórico completo de notificações

---

## 🔮 Melhorias Futuras

- [ ] Templates personalizados por banca
- [ ] Envio de imagens/comprovantes
- [ ] Notificação de novos pedidos (já implementado)
- [ ] Chat bidirecional
- [ ] Notificações de promoções
- [ ] Lembretes de entrega
