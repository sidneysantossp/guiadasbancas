# ⏰ SINCRONIZAÇÃO A CADA 15 MINUTOS (Cron Externo)

## 🚨 LIMITAÇÃO DO VERCEL HOBBY

O plano **Vercel Hobby** (gratuito) só permite cron jobs **1x por dia**.

Para sincronizar a cada 15 minutos, precisamos usar um serviço externo gratuito.

---

## ✅ SOLUÇÃO: CRON-JOB.ORG (100% GRATUITO)

### 🎯 Características:
- ✅ **Gratuito** para sempre
- ✅ Até **3 cron jobs** no plano free
- ✅ Intervalo mínimo: **1 minuto**
- ✅ Histórico de execuções
- ✅ Notificações por email
- ✅ Sem necessidade de cartão de crédito

---

## 📋 CONFIGURAÇÃO PASSO A PASSO

### 1. Criar Conta no Cron-Job.org

1. Acesse: https://cron-job.org/en/signup/
2. Preencha:
   - Email
   - Senha
   - Aceite os termos
3. Confirme o email

### 2. Criar Novo Cron Job

1. Faça login: https://console.cron-job.org/
2. Clique em **"Create cronjob"**
3. Preencha os dados:

#### **Aba "General":**
```
Title: Sync Mercos - Guia das Bancas
URL: https://www.guiadasbancas.com.br/api/cron/sync-mercos
```

#### **Aba "Schedule":**
```
Execution: Every 15 minutes
```

Ou configure manualmente:
```
Minutes: */15
Hours: *
Days: *
Months: *
Weekdays: *
```

#### **Aba "Notifications":**
```
☑ Notify me on execution failures
Email: seu-email@exemplo.com
```

#### **Aba "Advanced":**
```
Request method: POST
Request timeout: 60 seconds
```

4. Clique em **"Create cronjob"**

---

## 🔒 SEGURANÇA (OPCIONAL)

### Adicionar Autenticação:

1. Gere um secret forte:
```bash
openssl rand -hex 32
```

2. Adicione no Vercel (Environment Variables):
```
CRON_SECRET=seu_secret_gerado_aqui
```

3. No Cron-Job.org, adicione header:
```
Aba "Advanced" > "Request headers"
Authorization: Bearer seu_secret_gerado_aqui
```

---

## 📊 MONITORAMENTO

### No Cron-Job.org:

1. Acesse: https://console.cron-job.org/
2. Veja seu cron job
3. Clique em **"History"** para ver execuções
4. Status codes:
   - ✅ **200**: Sucesso
   - ❌ **500**: Erro no servidor
   - ⏱️ **Timeout**: Demorou mais de 60s

### No Vercel:

1. Acesse: https://vercel.com/sidneysantossps-projects/site-bancas-do-bairro/logs
2. Filtre por: `[CRON]`
3. Veja logs detalhados

---

## 🎯 RESULTADO ESPERADO

### Execuções Diárias:
```
24 horas ÷ 15 minutos = 96 execuções por dia
```

### Horários de Execução:
```
00:00, 00:15, 00:30, 00:45
01:00, 01:15, 01:30, 01:45
02:00, 02:15, 02:30, 02:45
... (e assim por diante)
```

### Por Execução:
- ⏱️ Tempo: 30-60 segundos
- 📦 Produtos processados: 200-500
- ✅ Produtos novos: 0-10
- 🔄 Produtos atualizados: 50-200
- 🗑️ Produtos deletados: 0-5

---

## 🆚 COMPARAÇÃO DE SOLUÇÕES

| Recurso | Vercel Hobby | Cron-Job.org | Vercel Pro |
|---------|--------------|--------------|------------|
| **Preço** | Grátis | Grátis | $20/mês |
| **Frequência Mínima** | 1x/dia | 1 minuto | 1 minuto |
| **Timeout** | 5 min | 60 seg | 10 min |
| **Cron Jobs** | Ilimitados | 3 | Ilimitados |
| **Notificações** | ❌ | ✅ | ✅ |
| **Histórico** | Logs Vercel | ✅ | Logs Vercel |

### 🏆 Recomendação:

**Para produção:** Use **Cron-Job.org** (grátis) para sincronizar a cada 15 minutos

**Backup:** Mantenha o Vercel Cron (1x/dia às 3h) como fallback

---

## 🔧 ALTERNATIVAS GRATUITAS

### 1. **EasyCron** (https://www.easycron.com/)
- Grátis: 1 cron job
- Intervalo mínimo: 1 hora
- ❌ Não serve (precisa de 15 min)

### 2. **Cronitor** (https://cronitor.io/)
- Grátis: 5 monitores
- Intervalo mínimo: 1 minuto
- ✅ Funciona, mas limite de 5

### 3. **GitHub Actions** (https://github.com/features/actions)
- Grátis: 2.000 minutos/mês
- Intervalo mínimo: 5 minutos
- ✅ Funciona bem

### 4. **Render Cron Jobs** (https://render.com/)
- Grátis: Cron jobs ilimitados
- Intervalo mínimo: 1 minuto
- ✅ Excelente alternativa

---

## 📝 CONFIGURAÇÃO ATUAL

### Vercel Cron (Backup):
```json
{
  "crons": [
    {
      "path": "/api/cron/sync-mercos",
      "schedule": "0 3 * * *"
    }
  ]
}
```
**Executa:** 1x por dia às 3h da manhã

### Cron-Job.org (Principal):
```
URL: https://www.guiadasbancas.com.br/api/cron/sync-mercos
Schedule: Every 15 minutes (*/15 * * * *)
Method: POST
```
**Executa:** 96x por dia (a cada 15 minutos)

---

## ✅ CHECKLIST DE CONFIGURAÇÃO

- [x] Vercel Cron configurado (1x/dia)
- [ ] Conta criada no Cron-Job.org
- [ ] Cron job criado (15 minutos)
- [ ] Teste manual executado
- [ ] Notificações configuradas
- [ ] Primeira execução monitorada
- [ ] CRON_SECRET configurado (opcional)

---

## 🧪 TESTAR AGORA

### Teste Manual:
```bash
curl -X POST https://www.guiadasbancas.com.br/api/cron/sync-mercos
```

### Verificar Resultado:
```bash
curl https://www.guiadasbancas.com.br/api/admin/products/count
```

---

## 🎯 PRÓXIMOS PASSOS

1. ✅ Deploy do código (Vercel Cron 1x/dia)
2. [ ] Criar conta no Cron-Job.org
3. [ ] Configurar cron job (15 minutos)
4. [ ] Testar primeira execução
5. [ ] Monitorar por 24h
6. [ ] Validar precisão dos dados

---

**Última atualização:** 15/11/2025  
**Status:** Vercel Cron (1x/dia) configurado ✅  
**Próximo:** Configurar Cron-Job.org (15 min) 🚀
