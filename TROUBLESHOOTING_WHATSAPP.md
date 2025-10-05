# 🔧 Troubleshooting - WhatsApp Notificações

Guia completo para diagnosticar problemas com envio de notificações WhatsApp.

---

## 🚨 PROBLEMA: Cliente não recebeu notificação

### ✅ PASSO 1: Verificar Logs do Console

1. **Abra o Console do Navegador** (F12)
2. **Limpe o console** (ícone 🚫)
3. **Mude o status do pedido**
4. **Procure por esses logs:**

```
[Pedido] ===== ENVIANDO WHATSAPP PARA CLIENTE =====
[Pedido] Telefone do cliente: (11) 9960-0318
[Pedido] Status novo: confirmado
[Pedido] Payload sendo enviado: {...}
[Pedido] Status da resposta: 200
[Pedido] Resposta da API: {...}
```

### ❌ Se NÃO aparecer nenhum log:
- **Causa**: Frontend não está chamando a API
- **Solução**: Recarregue a página (Ctrl+Shift+R)

### ⚠️ Se aparecer "Cliente não tem telefone cadastrado":
- **Causa**: Campo `customer_phone` está vazio no banco
- **Solução**: Verifique o pedido no banco de dados

---

## 📱 PASSO 2: Testar WhatsApp Diretamente

### Teste Rápido:

Acesse no navegador:
```
http://localhost:3000/api/whatsapp/test-notification?phone=11996000318
```

**Substitua `11996000318` pelo telefone da cliente**

### Respostas Possíveis:

#### ✅ SUCESSO:
```json
{
  "success": true,
  "message": "✅ Mensagem de teste ENVIADA com sucesso!",
  "connection": true,
  "phone": "5511996000318"
}
```
**Se receber isso mas cliente não recebeu:**
- ❌ Número está ERRADO no cadastro
- ❌ Cliente bloqueou o número

#### ❌ WHATSAPP DESCONECTADO:
```json
{
  "success": false,
  "message": "❌ WhatsApp está DESCONECTADO",
  "connection": false
}
```
**Solução:**
1. Acesse painel Evolution API
2. Reconecte a instância
3. Escaneie QR Code novamente

#### ❌ FALHA AO ENVIAR:
```json
{
  "success": false,
  "message": "❌ Falha ao enviar mensagem de teste",
  "connection": true
}
```
**Causa possível:**
- Número inválido
- API com problema
- Rate limit do WhatsApp

---

## 🔍 PASSO 3: Verificar Configuração

### 3.1 - Configuração do Admin

Acesse: `/admin/configuracoes/whatsapp`

Verifique:
- [ ] URL da Evolution API está correta
- [ ] API Key está correta
- [ ] Nome da instância está correto
- [ ] WhatsApp está marcado como "Ativo"

### 3.2 - Configuração do Jornaleiro

Acesse: `/jornaleiro/configuracoes/whatsapp`

Verifique:
- [ ] Número do WhatsApp cadastrado
- [ ] Formato: **(11) 99999-9999**
- [ ] Notificações ativadas

---

## 📊 PASSO 4: Logs do Servidor (Terminal)

No terminal onde o Next.js está rodando, procure:

### ✅ Logs de SUCESSO:
```
[WhatsApp Status Update] ===== INÍCIO =====
[WhatsApp Status Update] Body recebido: {...}
[WhatsApp Status Update] ✅ Dados validados
[WhatsApp Status Update] 📞 Telefone: (11) 9960-0318
[WhatsApp Status Update] 📋 Pedido: 3ed2e879...
[WhatsApp Status Update] 🔄 Status: confirmado
[WhatsApp Status Update] 📤 Chamando sendStatusWhatsAppUpdate...

[WhatsAppService] ===== sendStatusUpdate INÍCIO =====
[WhatsAppService] Telefone original: (11) 9960-0318
[WhatsAppService] Telefone limpo: 11996000318
[WhatsAppService] Telefone formatado: 5511996000318
[WhatsAppService] Mensagem formatada: (texto completo)
[WhatsAppService] Chamando sendMessage...
[WhatsAppService] sendMessage retornou: TRUE (✅ enviado)
[WhatsAppService] ✅ Status enviado para 5511996000318

[WhatsApp Status Update] Resultado do envio: ✅ SUCESSO
[WhatsApp Status Update] ===== FIM (SUCESSO) =====
```

### ❌ Logs de ERRO:
```
[WhatsApp Status Update] ❌ Dados obrigatórios faltando
[WhatsApp Status Update] ===== FIM (FALHA) =====
```

---

## 🐛 Problemas Comuns e Soluções

### 1️⃣ "WhatsApp pode estar desconectado"

**Diagnóstico:**
```bash
# Verificar conexão
curl http://localhost:3000/api/admin/whatsapp/status
```

**Solução:**
1. Acesse Evolution API: `https://api.auditseo.com.br`
2. Login com credenciais
3. Vá em "Instances"
4. Reconecte `SDR_AUDITSEO`
5. Escaneie QR Code com WhatsApp

---

### 2️⃣ Número do Cliente Incorreto

**Diagnóstico:**
```sql
-- Ver número cadastrado
SELECT customer_phone FROM orders 
WHERE id = '3ed2e879-3e91-46ca-978a-11467d3e34b8';
```

**Formatos Aceitos:**
- ✅ `(11) 9960-0318`
- ✅ `11996000318`
- ✅ `5511996000318`
- ❌ `+55 11 9960-0318` (não remove +)

**Solução:**
```sql
-- Corrigir formato
UPDATE orders 
SET customer_phone = '(11) 9960-0318'
WHERE id = '3ed2e879-3e91-46ca-978a-11467d3e34b8';
```

---

### 3️⃣ API Não Está Sendo Chamada

**Diagnóstico:**
- Não aparecem logs `[Pedido] ===== ENVIANDO WHATSAPP`

**Solução:**
1. Limpe cache do navegador
2. Recarregue a página (Ctrl+Shift+R)
3. Verifique se há erros JavaScript no console

---

### 4️⃣ Evolution API Retorna Erro

**Diagnóstico:**
```
[WhatsAppService] sendMessage retornou: FALSE (❌ falhou)
```

**Causas Possíveis:**
- WhatsApp banido/bloqueado
- Rate limit (muitas mensagens)
- Número inválido
- Sessão expirada

**Solução:**
1. Verifique WhatsApp Web
2. Desconecte e reconecte
3. Aguarde 5 minutos (rate limit)
4. Use número de teste válido

---

## 🧪 Testes Manuais

### Teste 1: API de Status Update
```bash
curl -X POST http://localhost:3000/api/whatsapp/status-update \
  -H "Content-Type: application/json" \
  -d '{
    "orderId": "3ed2e879-3e91-46ca-978a-11467d3e34b8",
    "customerPhone": "(11) 9960-0318",
    "newStatus": "confirmado"
  }'
```

### Teste 2: Mensagem Simples
```
http://localhost:3000/api/whatsapp/test-notification?phone=11996000318
```

### Teste 3: Verificar Conexão
```bash
curl http://localhost:3000/api/admin/whatsapp/status
```

---

## ✅ Checklist de Verificação

Antes de reportar problema, confirme:

- [ ] Evolution API está conectada
- [ ] QR Code foi escaneado recentemente
- [ ] Telefone do cliente está correto
- [ ] Telefone tem DDD (11, 21, etc)
- [ ] Admin configurou WhatsApp
- [ ] Jornaleiro ativou notificações
- [ ] Console mostra logs `[Pedido]`
- [ ] Terminal mostra logs `[WhatsApp Status Update]`
- [ ] Teste manual `/api/whatsapp/test-notification` funciona

---

## 📞 Números de Teste

Use esses números para testar (substituir pelos seus):

```
(11) 9960-0318  → Suelen Santos
(11) 98765-4321 → Número de teste
```

---

## 🔄 Reiniciar Sistema

Se nada funcionar:

```bash
# 1. Para o servidor
Ctrl + C

# 2. Limpa cache
rm -rf .next

# 3. Reinicia
npm run dev
```

---

## 📱 Contato Suporte Evolution API

Se o problema persistir na Evolution API:

- 🌐 Site: https://evolution-api.com
- 📧 Suporte: suporte@evolution-api.com
- 📚 Docs: https://doc.evolution-api.com

---

## 🎯 Resumo Rápido

```
1. Abra Console (F12)
2. Mude status do pedido
3. Veja logs [Pedido] e [WhatsApp]
4. Teste: /api/whatsapp/test-notification?phone=SEU_NUMERO
5. Verifique conexão Evolution API
6. Se falhar, reconecte WhatsApp Web
```

---

**Com esses passos você vai identificar exatamente onde está o problema!** 🔍
