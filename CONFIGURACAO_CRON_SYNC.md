# ⏰ CONFIGURAÇÃO DO CRON DE SINCRONIZAÇÃO AUTOMÁTICA

## 🎯 OBJETIVO

Sincronizar automaticamente produtos da Mercos a cada 15 minutos, mantendo o banco sempre atualizado com apenas produtos ATIVOS.

---

## 📋 CONFIGURAÇÃO NO VERCEL

### 1. Arquivo `vercel.json`

O arquivo `vercel.json` já está configurado com:

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

**Explicação:**
- `path`: Endpoint que será chamado
- `schedule`: Cron expression (*/15 = a cada 15 minutos)

### 2. Variáveis de Ambiente (Opcional)

Para maior segurança, adicione no Vercel Dashboard:

```
CRON_SECRET=seu_secret_muito_seguro_aqui_123456
```

**Como adicionar:**
1. Acesse: https://vercel.com/sidneysantossps-projects/site-bancas-do-bairro/settings/environment-variables
2. Adicione a variável `CRON_SECRET`
3. Valor: Gere um secret forte (ex: `openssl rand -hex 32`)
4. Redeploy o projeto

---

## 🔄 COMO FUNCIONA

### Fluxo Automático (A cada 15 minutos):

```
┌─────────────────────────────────────┐
│   VERCEL CRON (Trigger)             │
│   Executa a cada 15 minutos         │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│   /api/cron/sync-mercos             │
│   - Busca distribuidores ativos     │
│   - Processa cada um                │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│   Para cada distribuidor:           │
│   1. Busca produtos da Mercos       │
│   2. Filtra apenas ATIVOS           │
│   3. Insere novos produtos          │
│   4. Atualiza existentes            │
│   5. DELETA produtos inativos       │
└─────────────────────────────────────┘
```

### O que acontece:

1. **Produtos Novos (Ativos):** São inseridos no banco
2. **Produtos Existentes (Ativos):** São atualizados (preço, estoque, etc)
3. **Produtos que ficaram Inativos:** São DELETADOS do banco
4. **Produtos Inativos na Mercos:** São IGNORADOS

---

## 📊 MONITORAMENTO

### Ver Logs no Vercel:

1. Acesse: https://vercel.com/sidneysantossps-projects/site-bancas-do-bairro/logs
2. Filtre por: `[CRON]`
3. Veja execuções, erros e estatísticas

### Logs Importantes:

```
[CRON] 🔄 Sincronizando: Brancaleone Publicações
[CRON] 📦 Lote: 200 total, 150 ativos
[CRON] 🗑️  Produto inativo deletado: Nome do Produto
[CRON] ✅ Lote 1: 150 produtos inseridos
[CRON] 🎉 Brancaleone Publicações: 3439 produtos ativos sincronizados
```

---

## 🧪 TESTAR MANUALMENTE

### Opção 1: Via cURL
```bash
curl -X POST https://www.guiadasbancas.com.br/api/cron/sync-mercos
```

### Opção 2: Via Navegador
```
https://www.guiadasbancas.com.br/api/cron/sync-mercos
```

### Opção 3: Com Autenticação (se CRON_SECRET configurado)
```bash
curl -X POST https://www.guiadasbancas.com.br/api/cron/sync-mercos \
  -H "Authorization: Bearer SEU_CRON_SECRET"
```

---

## ⏱️ FREQUÊNCIA DE SINCRONIZAÇÃO

### Atual: A cada 15 minutos
```
*/15 * * * *
```

### Outras opções:

**A cada 30 minutos:**
```json
"schedule": "*/30 * * * *"
```

**A cada hora:**
```json
"schedule": "0 * * * *"
```

**A cada 6 horas:**
```json
"schedule": "0 */6 * * *"
```

**Diariamente às 3h da manhã:**
```json
"schedule": "0 3 * * *"
```

---

## 📈 MÉTRICAS ESPERADAS

### Por Execução (15 min):

| Métrica | Valor Típico |
|---------|--------------|
| **Tempo de Execução** | 30-60 segundos |
| **Produtos Processados** | 200-500 |
| **Produtos Novos** | 0-10 |
| **Produtos Atualizados** | 50-200 |
| **Produtos Deletados** | 0-5 |

### Diariamente (96 execuções):

| Métrica | Valor Estimado |
|---------|----------------|
| **Total de Execuções** | 96 |
| **Produtos Processados** | ~10.000 |
| **Produtos Novos** | ~50 |
| **Produtos Atualizados** | ~5.000 |

---

## 🚨 ALERTAS E ERROS

### Erros Comuns:

**1. Timeout (5 minutos):**
- Causa: Muitos produtos para processar
- Solução: Sync continua na próxima execução

**2. Throttling (429):**
- Causa: Muitas requisições à Mercos
- Solução: API aguarda automaticamente

**3. Conexão falhou:**
- Causa: Tokens inválidos ou expirados
- Solução: Verificar tokens do distribuidor

### Como Investigar:

1. Ver logs no Vercel
2. Verificar última sincronização na tabela `distribuidores`
3. Executar diagnóstico: `/api/admin/distribuidores/diagnostico-sync`

---

## 🔧 MANUTENÇÃO

### Verificar Status:
```bash
curl https://www.guiadasbancas.com.br/api/admin/products/count
```

### Executar Diagnóstico:
```bash
curl https://www.guiadasbancas.com.br/api/admin/distribuidores/diagnostico-sync
```

### Reset Completo (se necessário):
```bash
curl -X POST https://www.guiadasbancas.com.br/api/admin/distribuidores/reset-sync \
  -H "Content-Type: application/json" \
  -d '{"confirmar": "SIM_DELETAR_TUDO"}'
```

---

## ✅ CHECKLIST DE CONFIGURAÇÃO

- [x] Arquivo `vercel.json` criado
- [x] API `/api/cron/sync-mercos` atualizada
- [x] Lógica de deleção de inativos implementada
- [ ] Variável `CRON_SECRET` configurada (opcional)
- [ ] Primeiro deploy realizado
- [ ] Cron ativado no Vercel
- [ ] Logs monitorados
- [ ] Teste manual executado

---

## 📝 NOTAS IMPORTANTES

1. **Vercel Hobby Plan:** Cron mínimo é 1 minuto
2. **Vercel Pro Plan:** Sem limitações de frequência
3. **Timeout:** Máximo 5 minutos (Hobby) ou 10 minutos (Pro)
4. **Produtos Próprios:** Nunca são afetados (apenas distribuidores)
5. **Rollback:** Use `/api/admin/distribuidores/reset-sync` se necessário

---

## 🎯 PRÓXIMOS PASSOS

1. ✅ Deploy do código
2. ✅ Verificar ativação do Cron no Vercel
3. ✅ Monitorar primeira execução
4. ✅ Criar dashboard de monitoramento (futuro)
5. ✅ Implementar alertas por email (futuro)

---

**Última atualização:** 15/11/2025  
**Status:** Configurado e pronto para uso ✅  
**Próxima execução:** Automática a cada 15 minutos
