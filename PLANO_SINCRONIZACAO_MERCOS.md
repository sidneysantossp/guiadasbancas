# 🔄 PLANO DE SINCRONIZAÇÃO AUTOMÁTICA MERCOS

## 📊 SITUAÇÃO ATUAL

### Números:
- **Mercos (Produção):** 3.439 produtos
- **Guia das Bancas (Ativos):** 3.269 produtos
- **Diferença:** 170 produtos faltando (4,9%)

### Problemas Identificados:
1. ❌ Sincronização não está 100% fiel
2. ❌ Não há sincronização automática periódica
3. ❌ Produtos inativos (4.583) podem estar desatualizados
4. ❌ Falta monitoramento de divergências

---

## 🎯 OBJETIVOS

1. **Precisão 100%:** Garantir que todos os produtos da Mercos estejam no sistema
2. **Sincronização Automática:** A cada 15-30 minutos
3. **Monitoramento:** Dashboard para acompanhar status
4. **Alertas:** Notificar quando houver divergências
5. **Performance:** Não impactar usuários durante sync

---

## 🏗️ ARQUITETURA DA SOLUÇÃO

### 1. SISTEMA DE SINCRONIZAÇÃO EM CAMADAS

```
┌─────────────────────────────────────────────────┐
│           VERCEL CRON (Trigger)                 │
│         A cada 15 ou 30 minutos                 │
└────────────────┬────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────┐
│      API: /api/cron/sync-mercos-v2              │
│  - Busca distribuidores ativos                  │
│  - Processa em paralelo (máx 3)                 │
│  - Timeout: 4.5 min                             │
└────────────────┬────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────┐
│     WORKER: Sync por Distribuidor               │
│  - Paginação automática (Mercos)                │
│  - Throttling (429)                             │
│  - Batch insert/update                          │
│  - Validação de dados                           │
└────────────────┬────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────┐
│         SUPABASE (Persistência)                 │
│  - products (produtos)                          │
│  - sync_logs (histórico)                        │
│  - sync_stats (estatísticas)                    │
└─────────────────────────────────────────────────┘
```

---

## 📋 ETAPAS DE IMPLEMENTAÇÃO

### **FASE 1: CORREÇÃO DA SINCRONIZAÇÃO ATUAL** (Prioridade: ALTA)

#### 1.1. Diagnóstico Completo
- [ ] Criar API para comparar Mercos vs Banco
- [ ] Identificar os 170 produtos faltando
- [ ] Verificar produtos duplicados
- [ ] Validar produtos inativos

#### 1.2. Correção de Dados
- [ ] Remover duplicatas (já criado)
- [ ] Sincronização full forçada
- [ ] Validar 100% de precisão

**Tempo estimado:** 2-3 horas

---

### **FASE 2: SISTEMA DE SINCRONIZAÇÃO AUTOMÁTICA** (Prioridade: ALTA)

#### 2.1. Melhorias na API de Sync
```typescript
// /app/api/cron/sync-mercos-v2/route.ts

Features:
✅ Paginação completa (sem limite de 1000)
✅ Tratamento de throttling (429)
✅ Retry logic robusto
✅ Validação de dados antes de inserir
✅ Detecção de produtos deletados na Mercos
✅ Logs detalhados
✅ Timeout inteligente
✅ Processamento paralelo (máx 3 distribuidores)
```

#### 2.2. Tabela de Logs
```sql
CREATE TABLE sync_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  distribuidor_id UUID REFERENCES distribuidores(id),
  iniciado_em TIMESTAMP NOT NULL,
  finalizado_em TIMESTAMP,
  status TEXT NOT NULL, -- 'running', 'success', 'partial', 'error'
  produtos_novos INT DEFAULT 0,
  produtos_atualizados INT DEFAULT 0,
  produtos_deletados INT DEFAULT 0,
  total_processados INT DEFAULT 0,
  total_mercos INT,
  total_banco INT,
  divergencia INT, -- total_mercos - total_banco
  erro TEXT,
  detalhes JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_sync_logs_distribuidor ON sync_logs(distribuidor_id);
CREATE INDEX idx_sync_logs_status ON sync_logs(status);
CREATE INDEX idx_sync_logs_created ON sync_logs(created_at DESC);
```

#### 2.3. Tabela de Estatísticas
```sql
CREATE TABLE sync_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  distribuidor_id UUID REFERENCES distribuidores(id) UNIQUE,
  ultima_sincronizacao TIMESTAMP,
  proxima_sincronizacao TIMESTAMP,
  total_sincronizacoes INT DEFAULT 0,
  sincronizacoes_sucesso INT DEFAULT 0,
  sincronizacoes_erro INT DEFAULT 0,
  media_tempo_segundos FLOAT,
  total_produtos_mercos INT,
  total_produtos_banco INT,
  divergencia_atual INT,
  ultima_divergencia_detectada TIMESTAMP,
  status_atual TEXT, -- 'ok', 'warning', 'error'
  updated_at TIMESTAMP DEFAULT NOW()
);
```

**Tempo estimado:** 4-5 horas

---

### **FASE 3: CONFIGURAÇÃO DO CRON** (Prioridade: ALTA)

#### 3.1. Vercel Cron
```json
// vercel.json
{
  "crons": [
    {
      "path": "/api/cron/sync-mercos-v2",
      "schedule": "*/15 * * * *"
    }
  ]
}
```

#### 3.2. Alternativa: Cron-Job.org
```
URL: https://www.guiadasbancas.com.br/api/cron/sync-mercos-v2
Method: POST
Header: Authorization: Bearer SEU_CRON_SECRET
Interval: Every 15 minutes
```

#### 3.3. Variáveis de Ambiente
```bash
CRON_SECRET=seu_secret_aqui_muito_seguro
SYNC_INTERVAL_MINUTES=15
MAX_SYNC_DURATION_SECONDS=270
SYNC_BATCH_SIZE=200
```

**Tempo estimado:** 1 hora

---

### **FASE 4: DASHBOARD DE MONITORAMENTO** (Prioridade: MÉDIA)

#### 4.1. Página Admin
```
/admin/distribuidores/sync-monitor
```

**Features:**
- ✅ Status em tempo real de cada distribuidor
- ✅ Última sincronização
- ✅ Próxima sincronização
- ✅ Divergências detectadas
- ✅ Gráfico de histórico (últimas 24h)
- ✅ Botão de sincronização manual
- ✅ Logs detalhados
- ✅ Alertas visuais

#### 4.2. Componentes
```typescript
// SyncStatusCard.tsx - Card por distribuidor
// SyncHistoryChart.tsx - Gráfico de sincronizações
// SyncLogsTable.tsx - Tabela de logs
// SyncAlerts.tsx - Alertas de divergências
```

**Tempo estimado:** 3-4 horas

---

### **FASE 5: SISTEMA DE ALERTAS** (Prioridade: BAIXA)

#### 5.1. Alertas por Email
```typescript
// Quando divergência > 5%
// Quando sync falha 3x seguidas
// Quando não sincroniza há mais de 1h
```

#### 5.2. Webhook/Slack (Opcional)
```typescript
// Notificar equipe em tempo real
```

**Tempo estimado:** 2-3 horas

---

## 🔧 MELHORIAS TÉCNICAS

### 1. Validação de Dados
```typescript
function validarProdutoMercos(produto: MercosProduto): boolean {
  if (!produto.id) return false;
  if (!produto.nome || produto.nome.trim() === '') return false;
  if (typeof produto.preco_tabela !== 'number') return false;
  if (produto.preco_tabela < 0) return false;
  return true;
}
```

### 2. Detecção de Produtos Deletados
```typescript
// Buscar produtos no banco que não existem mais na Mercos
// Marcar como active=false ou deletar
```

### 3. Comparação Inteligente
```typescript
function produtoMudou(mercosData: any, bancoData: any): boolean {
  return (
    mercosData.nome !== bancoData.name ||
    mercosData.preco_tabela !== bancoData.price ||
    mercosData.ativo !== bancoData.active ||
    mercosData.saldo_estoque !== bancoData.stock_qty
  );
}
```

### 4. Processamento Paralelo
```typescript
// Processar até 3 distribuidores simultaneamente
const CONCURRENT_DISTRIBUTORS = 3;

const chunks = [];
for (let i = 0; i < distribuidores.length; i += CONCURRENT_DISTRIBUTORS) {
  chunks.push(distribuidores.slice(i, i + CONCURRENT_DISTRIBUTORS));
}

for (const chunk of chunks) {
  await Promise.allSettled(chunk.map(d => syncDistribuidor(d)));
}
```

---

## 📊 MÉTRICAS DE SUCESSO

### KPIs:
1. **Precisão:** 100% dos produtos da Mercos no sistema
2. **Latência:** Máximo 30 minutos de atraso
3. **Confiabilidade:** 99% de sincronizações bem-sucedidas
4. **Performance:** Sync completo em < 4 minutos

### Monitoramento:
- Dashboard com status em tempo real
- Alertas automáticos para divergências
- Logs detalhados de cada sincronização
- Histórico de 30 dias

---

## 🚀 CRONOGRAMA

### Semana 1:
- ✅ Fase 1: Diagnóstico e correção (2-3h)
- ✅ Fase 2: Sistema de sync v2 (4-5h)
- ✅ Fase 3: Configuração do cron (1h)

### Semana 2:
- ✅ Fase 4: Dashboard de monitoramento (3-4h)
- ✅ Testes e ajustes (2-3h)

### Semana 3 (Opcional):
- ✅ Fase 5: Sistema de alertas (2-3h)

**Total estimado:** 14-19 horas

---

## ⚠️ RISCOS E MITIGAÇÕES

### Risco 1: Throttling da Mercos (429)
**Mitigação:** Implementar retry com backoff exponencial

### Risco 2: Timeout do Vercel (5 min)
**Mitigação:** Processamento incremental com checkpoint

### Risco 3: Dados inconsistentes
**Mitigação:** Validação rigorosa antes de inserir

### Risco 4: Sobrecarga do banco
**Mitigação:** Batch inserts e rate limiting

---

## 🎯 PRÓXIMOS PASSOS IMEDIATOS

1. **Criar API de diagnóstico** para identificar os 170 produtos faltando
2. **Executar sincronização full** para corrigir divergências
3. **Implementar sync-mercos-v2** com melhorias
4. **Configurar Vercel Cron** para 15 minutos
5. **Criar dashboard de monitoramento**

---

## 📝 NOTAS TÉCNICAS

### Limites da Mercos:
- Paginação: 200 produtos por request
- Throttling: Variável (respeitar header 429)
- Timeout: Sem limite documentado

### Limites do Vercel:
- Timeout: 5 minutos (Hobby), 10 min (Pro)
- Memória: 1024 MB (Hobby), 3008 MB (Pro)
- Cron: Mínimo 1 minuto de intervalo

### Otimizações:
- Usar `alterado_apos` para buscar apenas mudanças
- Batch inserts de 200 produtos
- Parallel updates com concorrência de 10
- Cache de categorias e distribuidores

---

## ✅ CHECKLIST DE IMPLEMENTAÇÃO

- [ ] Criar tabelas `sync_logs` e `sync_stats`
- [ ] Implementar `/api/cron/sync-mercos-v2`
- [ ] Adicionar validação de dados
- [ ] Implementar detecção de produtos deletados
- [ ] Configurar Vercel Cron
- [ ] Criar dashboard de monitoramento
- [ ] Testar com 1 distribuidor
- [ ] Testar com todos os distribuidores
- [ ] Configurar alertas
- [ ] Documentar processo

---

**Última atualização:** 15/11/2025  
**Status:** Planejamento completo ✅  
**Próxima ação:** Implementar Fase 1 (Diagnóstico)
