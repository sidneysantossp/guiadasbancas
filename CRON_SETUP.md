# Configuração de Sincronização Automática

## ⚠️ Limitação do Vercel Hobby Plan

O plano gratuito (Hobby) do Vercel **não permite cron jobs mais frequentes que 1x por dia**.

Para sincronização a cada 1 minuto, você precisa:
1. **Fazer upgrade para Vercel Pro** ($20/mês) - Permite cron jobs a cada minuto
2. **Usar serviço externo gratuito** (recomendado) - Veja instruções abaixo

---

## 🚀 Solução: Usar Cron-Job.org (GRATUITO)

### Passo 1: Criar conta no Cron-Job.org

1. Acesse: https://cron-job.org/
2. Crie uma conta gratuita
3. Faça login

### Passo 2: Criar novo Cron Job

1. Clique em **"Create cronjob"**
2. Preencha os campos:

**Título:**
```
Sincronizar Produtos Mercos - Guia das Bancas
```

**URL:**
```
https://www.guiadasbancas.com.br/api/cron/sync-mercos
```

**Schedule:**
- Selecione: **Every minute** (a cada 1 minuto)
- Ou configure manualmente: `* * * * *`

**Request Method:**
- Selecione: **POST**

**Headers (Opcional - Segurança):**
```
Authorization: Bearer SEU_CRON_SECRET_AQUI
```
*(Configure a variável `CRON_SECRET` no Vercel)*

**Timeout:**
- 300 segundos (5 minutos)

**Notifications:**
- ✅ Enable failure notifications (receber email se falhar)

3. Clique em **"Create cronjob"**

---

## 🔧 Alternativas Gratuitas

### 1. **EasyCron** (https://www.easycron.com/)
- Plano gratuito: até 1 cron job a cada 1 minuto
- Limite: 100 execuções/dia no plano free

### 2. **cron-job.de** (https://console.cron-job.org/)
- Plano gratuito: até 3 cron jobs
- Frequência: a cada 1 minuto

### 3. **Render Cron Jobs** (https://render.com/)
- Plano gratuito: cron jobs ilimitados
- Frequência: a cada 1 minuto

---

## 📊 Configuração Atual no Vercel

**Arquivo:** `vercel.json`

```json
{
  "crons": [
    {
      "path": "/api/cron/sync-mercos",
      "schedule": "0 */1 * * *"
    }
  ]
}
```

**Schedule:** `0 */1 * * *` = **A cada 1 hora** (máximo permitido no Hobby)

---

## 🔐 Segurança (Recomendado)

### Adicionar autenticação no cron:

1. **No Vercel**, adicione variável de ambiente:
   - Nome: `CRON_SECRET`
   - Valor: `seu-token-secreto-aleatorio-aqui`

2. **No Cron-Job.org**, adicione header:
   ```
   Authorization: Bearer seu-token-secreto-aleatorio-aqui
   ```

Isso impede que pessoas não autorizadas executem a sincronização.

---

## 📈 Monitoramento

### Ver logs de sincronização:

1. **Vercel Dashboard:**
   - https://vercel.com/seu-usuario/site-bancas-do-bairro
   - Aba "Logs"
   - Filtrar por `/api/cron/sync-mercos`

2. **Cron-Job.org Dashboard:**
   - Ver histórico de execuções
   - Status codes (200 = sucesso)
   - Tempo de resposta

---

## 🎯 Teste Manual

Para testar se o cron está funcionando:

```bash
curl -X POST https://www.guiadasbancas.com.br/api/cron/sync-mercos \
  -H "Authorization: Bearer SEU_CRON_SECRET"
```

Ou acesse direto no navegador (se não tiver autenticação):
```
https://www.guiadasbancas.com.br/api/cron/sync-mercos
```

---

## ✅ Checklist de Configuração

- [ ] Conta criada no Cron-Job.org
- [ ] Cron job configurado para rodar a cada 1 minuto
- [ ] URL correta: `https://www.guiadasbancas.com.br/api/cron/sync-mercos`
- [ ] Method: POST
- [ ] (Opcional) Header de autenticação configurado
- [ ] Notificações de falha ativadas
- [ ] Teste manual executado com sucesso
- [ ] Primeira sincronização automática confirmada

---

## 🚨 Troubleshooting

### Problema: Cron retorna erro 401
**Solução:** Verifique se o header `Authorization` está correto

### Problema: Cron retorna erro 500
**Solução:** Verifique os logs no Vercel para ver o erro específico

### Problema: Sincronização não atualiza produtos
**Solução:** 
1. Verifique se os tokens da Mercos estão corretos
2. Teste a conexão manualmente no admin
3. Verifique os logs para erros específicos

---

## 📞 Suporte

Se precisar de ajuda:
1. Verifique os logs no Vercel
2. Teste o endpoint manualmente
3. Verifique se o distribuidor está ativo no banco de dados
