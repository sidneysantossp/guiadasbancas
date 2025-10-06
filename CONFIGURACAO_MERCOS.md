# 🔧 Configuração da Integração Mercos

## 📋 URLs e Tokens Necessários

### 1. **URL Base da API Mercos**

#### Ambiente Sandbox (Testes)
```
https://sandbox.mercos.com/api/v1
```

#### Ambiente Produção
```
https://app.mercos.com/api/v1
```

---

## 🔑 Tokens de Autenticação

### ApplicationToken (Sandbox)
```
d39001ac-0b14-11f0-8ed7-6e1485be00f2
```
**⚠️ Este token é público e funciona apenas no sandbox**

### ApplicationToken (Produção)
```
Será fornecido pela Mercos após homologação
```

### CompanyToken
**Como obter:**
1. Acesse https://sandbox.mercos.com (ou https://app.mercos.com em produção)
2. Vá em **Minha Conta** → **Sistema** → **Integração**
3. Clique em **"Gerar"** ou copie o Company Token existente

**Formato:** `4b866744-a086-11f0-ada6-5e65486a6283`

---

## 🖥️ Cadastrar Distribuidor no Painel Admin

### Passo 1: Acessar Dashboard
```
http://localhost:3000/admin/distribuidores
ou
https://seudominio.com/admin/distribuidores
```

### Passo 2: Novo Distribuidor
Clique em **"Novo Distribuidor"** e preencha:

| Campo | Valor | Exemplo |
|-------|-------|---------|
| **Nome** | Nome do distribuidor | "Distribuidora ABC" |
| **Application Token** | Token da sua aplicação | `d39001ac-0b14-11f0-8ed7-6e1485be00f2` (sandbox) |
| **Company Token** | Token da empresa na Mercos | `4b866744-a086-11f0-ada6-5e65486a6283` |
| **URL Base** | URL da API Mercos | `https://sandbox.mercos.com/api/v1` |
| **Ativo** | ✅ Marcado para sincronização automática | Sim |

### Passo 3: Salvar
Após salvar, o distribuidor estará cadastrado e pronto para sincronização.

---

## 🔄 Sincronização de Produtos

### Opção 1: Sincronização Manual

1. Acesse `/admin/distribuidores/[id]`
2. Clique no botão **"Sincronizar Produtos"**
3. Aguarde o processo (pode levar alguns minutos)
4. Visualize o resultado com quantidade de produtos sincronizados

**URL da API:**
```
POST /api/admin/distribuidores/[id]/sync
Headers:
  Authorization: Bearer admin-token
```

### Opção 2: Sincronização Automática (Cron)

#### Configuração do Cron Job

**URL do Endpoint:**
```
POST https://seudominio.com/api/cron/sync-mercos
Headers:
  Authorization: Bearer SEU_CRON_SECRET
```

**Frequência:** A cada 15 minutos
**Formato Cron:** `*/15 * * * *`

#### Serviços Recomendados:

##### 1. Vercel Cron (Se hospedado na Vercel)
Crie `vercel.json`:
```json
{
  "crons": [{
    "path": "/api/cron/sync-mercos",
    "schedule": "*/15 * * * *"
  }]
}
```

##### 2. Cron-Job.org (Gratuito)
1. Acesse: https://cron-job.org/en/members/jobs/add/
2. **Title**: "Sync Mercos Products"
3. **URL**: `https://seudominio.com/api/cron/sync-mercos`
4. **Schedule**: `*/15 * * * *`
5. **Request Method**: POST
6. **Custom Headers**:
   ```
   Key: Authorization
   Value: Bearer SEU_CRON_SECRET
   ```

##### 3. EasyCron (Alternativa)
1. Acesse: https://www.easycron.com/user/cronjob/create
2. **URL**: `https://seudominio.com/api/cron/sync-mercos`
3. **Cron Expression**: `*/15 * * * *`
4. **HTTP Method**: POST
5. **HTTP Headers**:
   ```
   Authorization: Bearer SEU_CRON_SECRET
   ```

---

## 🔐 Variáveis de Ambiente

### Arquivo `.env.local`

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbG...
SUPABASE_SERVICE_ROLE_KEY=eyJhbG...

# Mercos (Sandbox)
MERCOS_API_URL=https://sandbox.mercos.com/api/v1
MERCOS_APPLICATION_TOKEN=d39001ac-0b14-11f0-8ed7-6e1485be00f2

# Mercos (Produção - após homologação)
# MERCOS_API_URL=https://app.mercos.com/api/v1
# MERCOS_APPLICATION_TOKEN=seu-token-de-producao

# Cron Secret (gere uma chave aleatória)
CRON_SECRET=sua-chave-secreta-aqui

# URL Base
NEXT_PUBLIC_BASE_URL=http://localhost:3000
# NEXT_PUBLIC_BASE_URL=https://seudominio.com (produção)
```

### Gerar CRON_SECRET

**Linux/Mac:**
```bash
openssl rand -base64 32
```

**Node.js:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

**Online:**
https://www.random.org/strings/

---

## 📊 Endpoints da API Mercos Utilizados

### 1. Verificar Status da Conexão
```
GET https://sandbox.mercos.com/api/v1/token_auth_status
Headers:
  ApplicationToken: d39001ac-0b14-11f0-8ed7-6e1485be00f2
  CompanyToken: 4b866744-a086-11f0-ada6-5e65486a6283
```

### 2. Listar Produtos
```
GET https://sandbox.mercos.com/api/v1/produtos?alterado_apos=2020-01-01T00:00:00
Headers:
  ApplicationToken: d39001ac-0b14-11f0-8ed7-6e1485be00f2
  CompanyToken: 4b866744-a086-11f0-ada6-5e65486a6283
```

### 3. Buscar Produto Específico
```
GET https://sandbox.mercos.com/api/v1/produtos/123
Headers:
  ApplicationToken: d39001ac-0b14-11f0-8ed7-6e1485be00f2
  CompanyToken: 4b866744-a086-11f0-ada6-5e65486a6283
```

---

## 🎯 Homologação Mercos

### O que é necessário?

1. **Testes no Sandbox:**
   - Sincronizar produtos
   - Criar pedidos (se aplicável)
   - Testar throttling (erro 429)
   - Testar paginação

2. **Evidências:**
   - Prints de tela do dashboard
   - Vídeo da sincronização funcionando
   - **NÃO** enviar prints de código

3. **Reunião de Homologação:**
   - Agendar pelo chat da Mercos
   - Demonstrar funcionalidades
   - Apresentar tratamento de erros

### Após Aprovação

Você receberá:
- ✅ **ApplicationToken de Produção**
- ✅ Acesso à API de produção
- ✅ Suporte técnico

Atualize `.env.local`:
```bash
MERCOS_API_URL=https://app.mercos.com/api/v1
MERCOS_APPLICATION_TOKEN=seu-token-de-producao
```

---

## ✅ Checklist de Configuração

- [ ] Conta criada no Sandbox Mercos
- [ ] CompanyToken obtido em Minha Conta → Sistema → Integração
- [ ] ApplicationToken de sandbox em mãos
- [ ] Variáveis de ambiente configuradas no `.env.local`
- [ ] CRON_SECRET gerado
- [ ] Distribuidor cadastrado no dashboard `/admin/distribuidores/novo`
- [ ] Primeira sincronização manual testada
- [ ] Cron job configurado (Vercel, cron-job.org ou EasyCron)
- [ ] Testes de throttling realizados
- [ ] Testes de paginação realizados
- [ ] Evidências preparadas (prints, vídeos)
- [ ] Reunião de homologação agendada

---

## 📞 Suporte Mercos

- **Chat:** https://sandbox.mercos.com (ou https://app.mercos.com)
- **Documentação:** https://docs.mercos.com
- **WhatsApp:** Disponível no rodapé do site
- **Parcerias:** https://mercos.com/parceiros

---

## 🔗 Links Úteis

- **Criar conta Sandbox:** https://sandbox.mercos.com
- **Postman Collections:** https://www.postman.com/mercos
- **Documentação Completa:** `/MERCOS_API_DOCUMENTATION.md`
- **Integração Guia das Bancas:** `/MERCOS_INTEGRATION.md`

---

## 🎉 Resumo Rápido

### URLs para configurar:

1. **Dashboard Admin:**
   - `http://localhost:3000/admin/distribuidores` (local)
   - `https://seudominio.com/admin/distribuidores` (produção)

2. **API Mercos Sandbox:**
   - `https://sandbox.mercos.com/api/v1`

3. **Cron Job:**
   - `https://seudominio.com/api/cron/sync-mercos`

4. **Tokens:**
   - **Application Token (sandbox):** `d39001ac-0b14-11f0-8ed7-6e1485be00f2`
   - **Company Token:** Obtido em Minha Conta → Sistema → Integração

---

**Última atualização:** 2025-10-06
