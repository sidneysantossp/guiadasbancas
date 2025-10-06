# 🔗 URLs de Configuração e Integração

## 🌐 URLs Base

```
Produção: https://seudominio.com
Desenvolvimento: http://localhost:3000
```

---

## 📋 APIs de Integração Disponíveis

### 1. **Cron / Sincronização Automática**

#### Sincronização Mercos (A cada 15 minutos)
```
POST /api/cron/sync-mercos
Headers:
  Authorization: Bearer SEU_CRON_SECRET
```

**Configurar em:**
- Vercel Cron (via `vercel.json`)
- cron-job.org
- EasyCron
- Qualquer serviço de cron HTTP

---

### 2. **Webhooks de Pedidos**

#### Notificação de Novo Pedido (WhatsApp)
```
POST /api/whatsapp/jornaleiro-notification/[bancaId]
Body: {
  "pedidoId": "uuid",
  "valor": 99.90,
  "items": []
}
```

---

### 3. **APIs Públicas (Sem autenticação)**

#### Listar Produtos de uma Banca
```
GET /api/banca/[id]/products
Response: Lista de produtos disponíveis
```

#### Listar Bancas Próximas
```
GET /api/bancas?lat=-23.55&lng=-46.63&radius=5000
Response: Bancas em um raio de X metros
```

#### Buscar Produtos
```
GET /api/products/search?q=revista&category=magazines
Response: Produtos correspondentes
```

---

### 4. **Distribuidores (Admin)**

#### Sincronização Manual
```
POST /api/admin/distribuidores/[id]/sync
Headers:
  Authorization: Bearer admin-token
Response: { success: true, stats: {...} }
```

---

## 🔐 Variáveis de Ambiente Necessárias

### `.env.local`

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# Cron Jobs
CRON_SECRET=sua-chave-secreta-aqui

# URL Base (Produção)
NEXT_PUBLIC_BASE_URL=https://seudominio.com

# WhatsApp Business API (Opcional)
WHATSAPP_API_TOKEN=seu-token-aqui
WHATSAPP_PHONE_NUMBER_ID=seu-id-aqui
```

---

## 📝 Como Configurar Integrações Externas

### **Opção 1: Vercel Cron** (Recomendado para Vercel)

Crie `vercel.json` na raiz:

```json
{
  "crons": [
    {
      "path": "/api/cron/sync-mercos",
      "schedule": "*/15 * * * *"
    }
  ]
}
```

### **Opção 2: Cron-Job.org** (Serviço Externo)

1. Acesse: https://cron-job.org/en/
2. Crie conta gratuita
3. **New Cronjob:**
   - **Title**: "Sync Mercos Products"
   - **URL**: `https://seudominio.com/api/cron/sync-mercos`
   - **Schedule**: `*/15 * * * *` (a cada 15 min)
   - **Request Method**: POST
   - **Request Headers**:
     ```
     Authorization: Bearer SEU_CRON_SECRET
     ```

### **Opção 3: EasyCron** (Alternativa)

1. Acesse: https://www.easycron.com
2. **Add Cron Job:**
   - **URL**: `https://seudominio.com/api/cron/sync-mercos`
   - **Cron Expression**: `*/15 * * * *`
   - **Request Method**: POST
   - **Custom Header**:
     ```
     Authorization: Bearer SEU_CRON_SECRET
     ```

---

## 🔧 URLs do Painel Admin

### Gerenciamento de Distribuidores
```
/admin/distribuidores              - Lista
/admin/distribuidores/novo         - Cadastro
/admin/distribuidores/[id]         - Detalhes
/admin/distribuidores/[id]/sync    - Sincronização
```

### Gerenciamento de Produtos
```
/admin/products                    - Lista
/admin/products/create             - Criar
/admin/products/[id]/edit          - Editar
```

### Gerenciamento de Bancas
```
/admin/bancas                      - Lista
/admin/bancas/nova                 - Cadastro
/admin/bancas/[id]                 - Detalhes
```

---

## 📊 Endpoints de Monitoramento

### Health Check
```
GET /api/health
Response: { status: "ok", timestamp: "..." }
```

### Database Status
```
GET /api/db/status
Response: { connected: true, tables: 15 }
```

---

## 🎯 Webhooks para Configurar na Mercos

### Quando disponível, configure:

```
Webhook de Produtos: 
https://seudominio.com/api/webhooks/mercos/products

Webhook de Pedidos:
https://seudominio.com/api/webhooks/mercos/orders
```

**⚠️ Nota:** Endpoints de webhook ainda não implementados. 
Para sincronização, use o Cron Job configurado acima.

---

## 📞 Suporte

Para mais informações sobre configuração:
- Documentação API: `/MERCOS_INTEGRATION.md`
- Catálogo Distribuidor: `/CATALOGO_DISTRIBUIDOR.md`

---

## ✅ Checklist de Configuração

- [ ] Variáveis de ambiente configuradas
- [ ] CRON_SECRET gerado e salvo
- [ ] Cron job configurado (Vercel ou externo)
- [ ] Tokens Mercos adicionados no dashboard
- [ ] Primeira sincronização testada manualmente
- [ ] URLs base atualizadas para produção
- [ ] WhatsApp API configurado (opcional)

---

**Última atualização:** 2025-10-06
