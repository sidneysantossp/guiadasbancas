# Codex Sprint 1 Tactical Backlog

## Objetivo

Este documento quebra a sprint 1 em tarefas menores, por agente, com handoffs claros.

Ele responde:

- o que cada agente deve fazer primeiro
- em que ordem
- o que precisa estar pronto para passar ao proximo agente
- qual evidencia minima fecha cada tarefa

## Regras do backlog tatico

- tarefa pequena o suficiente para caber em 1 a 3 dias
- cada tarefa tem um dono
- cada tarefa tem uma saida objetiva
- cada tarefa define quem precisa revisar
- tarefas criticas precisam de evidencia antes de mudar de coluna

## Colunas operacionais

- `Todo`
- `Em andamento`
- `Em revisao funcional`
- `Em revisao tecnica`
- `Pronto para release`
- `Concluido`
- `Bloqueado`

## Semana 1

### Noether

| ID | Tarefa | Saida obrigatoria | Dependencias | Revisao |
| --- | --- | --- | --- | --- |
| ADM-01 | mapear rotas e middlewares sensiveis do admin | inventario de auth e guarda por rota | nenhuma | `Platform & Data Lead` |
| ADM-02 | listar fallbacks e compatibilidades legadas de auth | matriz do que remover, isolar ou manter temporariamente | ADM-01 | `Principal Codex` |
| ADM-03 | revisar `settings`, `plans` e `api-keys` para guarda e `no-store` | checklist tecnico por rota | ADM-01 | `Platform & Data Lead` |
| ADM-04 | mapear fluxo `plan -> subscription -> payment -> entitlement` | diagrama de verdade do billing | nenhuma | `Principal Codex` |

### Copernicus

| ID | Tarefa | Saida obrigatoria | Dependencias | Revisao |
| --- | --- | --- | --- | --- |
| JOR-01 | inventariar todos os estados reais da banca | tabela unica de lifecycle | nenhuma | `Principal Codex` |
| JOR-02 | localizar telas e APIs que ainda divergem do lifecycle | matriz `tela/api -> regra atual -> regra correta` | JOR-01 | `Platform & Data Lead` |
| JOR-03 | mapear onboarding atual passo a passo | fluxo real `registro -> publicacao` com pontos de vazamento | nenhuma | `Boyle` |
| JOR-04 | mapear pontos de liberacao por plano na frente jornaleiro | inventario de entitlements por tela e API | nenhuma | `Noether` + `Platform & Data Lead` |

### Darwin

| ID | Tarefa | Saida obrigatoria | Dependencias | Revisao |
| --- | --- | --- | --- | --- |
| DIS-01 | desenhar arquitetura do sync assincrono Mercos | proposta tecnica com fila, lock e status | nenhuma | `Platform & Data Lead` |
| DIS-02 | mapear pontos de timeout, lote e escrita em massa | diagnostico de risco do sync atual | nenhuma | `Principal Codex` |
| DIS-03 | definir reconciliacao Mercos x banco | especificacao do relatorio de divergencia | nenhuma | `Platform & Data Lead` |
| DIS-04 | separar conceitos de rede, elegibilidade e carteira comercial | modelo operacional de relacionamento comercial | nenhuma | `Principal Codex` |

### Boyle

| ID | Tarefa | Saida obrigatoria | Dependencias | Revisao |
| --- | --- | --- | --- | --- |
| GRO-01 | fechar taxonomia oficial do funil publico | lista oficial de eventos e propriedades | nenhuma | `Platform & Data Lead` |
| GRO-02 | mapear baseline de busca e zero-result | relatorio inicial de busca publica | nenhuma | `Principal Codex` |
| GRO-03 | mapear baseline de checkout e abandono | relatorio inicial de `cart -> checkout -> order` | nenhuma | `Principal Codex` |
| GRO-04 | mapear baseline da landing do jornaleiro | relatorio `visit -> CTA -> cadastro iniciado` | nenhuma | `Noether` |

## Semana 2

### Noether

| ID | Tarefa | Saida obrigatoria | Dependencias | Revisao |
| --- | --- | --- | --- | --- |
| ADM-05 | aplicar hardening nas rotas sensiveis do admin | PR ou diff tecnico pronto | ADM-01, ADM-02, ADM-03 | `Platform & Data Lead` |
| ADM-06 | definir politica de auditoria persistente | proposta de armazenamento e leitura | ADM-01 | `Principal Codex` |
| ADM-07 | consolidar regras de entitlement com billing | checklist de inconsistencias e regra-alvo | ADM-04, JOR-04 | `Copernicus` + `Platform & Data Lead` |

### Copernicus

| ID | Tarefa | Saida obrigatoria | Dependencias | Revisao |
| --- | --- | --- | --- | --- |
| JOR-05 | aplicar helper unico de lifecycle nas entradas criticas | diff ou PR pronto | JOR-01, JOR-02 | `Platform & Data Lead` |
| JOR-06 | redesenhar onboarding para primeira vitrine publicada | especificacao funcional + fluxo final | JOR-03 | `Boyle` + `Principal Codex` |
| JOR-07 | desenhar ativacao rapida de catalogo | especificacao do fluxo para produto proprio e parceiro | JOR-04, DIS-04 | `Darwin` + `Noether` |

### Darwin

| ID | Tarefa | Saida obrigatoria | Dependencias | Revisao |
| --- | --- | --- | --- | --- |
| DIS-05 | implementar esqueleto do sync assincrono | PR ou diff tecnico base | DIS-01, DIS-02 | `Platform & Data Lead` |
| DIS-06 | implementar reconciliacao Mercos x banco | relatorio inicial por distribuidor | DIS-03 | `Principal Codex` |
| DIS-07 | especificar estados da carteira comercial | filtros e labels da frente distribuidor | DIS-04 | `Copernicus` |

### Boyle

| ID | Tarefa | Saida obrigatoria | Dependencias | Revisao |
| --- | --- | --- | --- | --- |
| GRO-05 | instrumentar eventos faltantes no funil publico | diff tecnico pronto | GRO-01 | `Platform & Data Lead` |
| GRO-06 | desenhar melhorias de busca local e autocomplete | proposta funcional e tecnica | GRO-02 | `Principal Codex` |
| GRO-07 | desenhar quick wins de checkout | lista priorizada de friccoes e correcoes | GRO-03 | `Platform & Data Lead` |

## Semana 3

### Noether

| ID | Tarefa | Saida obrigatoria | Dependencias | Revisao |
| --- | --- | --- | --- | --- |
| ADM-08 | aplicar primeira consolidacao de billing e entitlement | diff ou PR pronto | ADM-07 | `Platform & Data Lead` |
| ADM-09 | alinhar copy comercial e limites reais no CMS/admin | checklist de promessas comerciais validas | ADM-07, GRO-04 | `Boyle` |

### Copernicus

| ID | Tarefa | Saida obrigatoria | Dependencias | Revisao |
| --- | --- | --- | --- | --- |
| JOR-08 | implementar novo onboarding | diff ou PR pronto | JOR-06 | `Platform & Data Lead` + `QA / Release Lead` |
| JOR-09 | implementar fluxo rapido de ativacao de catalogo | diff ou PR pronto | JOR-07 | `Darwin` + `Noether` |
| JOR-10 | revisar dashboard para virar cockpit de acao | proposta priorizada de cards, CTA e checklist | JOR-05, JOR-08 | `Boyle` |

### Darwin

| ID | Tarefa | Saida obrigatoria | Dependencias | Revisao |
| --- | --- | --- | --- | --- |
| DIS-08 | concluir sync com lock, status e visibilidade operacional | diff ou PR pronto | DIS-05 | `Platform & Data Lead` + `QA / Release Lead` |
| DIS-09 | aplicar primeira leitura real de carteira comercial | diff ou prototipo funcional | DIS-07 | `Principal Codex` |
| DIS-10 | revisar pricing para fonte unica de verdade | matriz de divergencias API/UI | nenhuma | `Platform & Data Lead` |

### Boyle

| ID | Tarefa | Saida obrigatoria | Dependencias | Revisao |
| --- | --- | --- | --- | --- |
| GRO-08 | implementar primeira rodada de melhoria em busca local | diff ou PR pronto | GRO-06 | `Platform & Data Lead` + `QA / Release Lead` |
| GRO-09 | implementar quick wins de checkout | diff ou PR pronto | GRO-07 | `Platform & Data Lead` + `QA / Release Lead` |
| GRO-10 | conectar landing do jornaleiro a tracking real de origem e CTA | diff ou PR pronto | GRO-04, GRO-05 | `Noether` |

## Semana 4

### Noether

| ID | Tarefa | Saida obrigatoria | Dependencias | Revisao |
| --- | --- | --- | --- | --- |
| ADM-10 | validar pacote admin/billing/settings em staging | evidencias funcionais e tecnicas | ADM-05, ADM-08, ADM-09 | `QA / Release Lead` |

### Copernicus

| ID | Tarefa | Saida obrigatoria | Dependencias | Revisao |
| --- | --- | --- | --- | --- |
| JOR-11 | validar jornada `registro -> onboarding -> publicacao -> produto -> pedido` | evidencias E2E | JOR-08, JOR-09 | `QA / Release Lead` |
| JOR-12 | priorizar proxima iteracao de notificacoes e inteligencia acionavel | backlog da sprint 2 | JOR-10 | `Principal Codex` |

### Darwin

| ID | Tarefa | Saida obrigatoria | Dependencias | Revisao |
| --- | --- | --- | --- | --- |
| DIS-11 | validar Brancaleone como caso real de carga e sync | evidencias operacionais | DIS-08, DIS-10 | `QA / Release Lead` |
| DIS-12 | publicar relatorio de reconciliacao e carteira | pacote executivo para sprint 2 | DIS-06, DIS-09 | `Principal Codex` |

### Boyle

| ID | Tarefa | Saida obrigatoria | Dependencias | Revisao |
| --- | --- | --- | --- | --- |
| GRO-11 | validar uplift inicial de busca e checkout | scorecard comparando baseline | GRO-08, GRO-09 | `Principal Codex` |
| GRO-12 | priorizar sprint 2 de CRM, PDP local e SEO Copa 2026 | backlog da sprint 2 | GRO-05, GRO-10, GRO-11 | `Noether` + `Principal Codex` |

## Handoffs obrigatorios

### Noether -> Copernicus

- regra final de entitlement validada
- limites de plano oficialmente aprovados
- qualquer mudanca de billing com efeito em onboarding

### Copernicus -> Boyle

- estados validos de publicacao da banca
- pontos de CTA do onboarding e dashboard
- eventos relevantes para ativacao

### Darwin -> Copernicus

- regra de elegibilidade do catalogo parceiro
- leitura de carteira e cobertura da rede
- restricoes de supply que impactam o jornaleiro

### Boyle -> Noether

- promessas comerciais da landing e home
- limites de plano expostos ao mercado
- funil de aquisicao do jornaleiro

### Todos -> QA / Release Lead

- resumo do que mudou
- risco classificado
- evidencias executadas
- fluxo exato a ser testado

## Definicao de pronto por tarefa

Uma tarefa deste backlog so pode sair de `Pronto para release` para `Concluido` quando:

- a saida obrigatoria foi entregue
- o revisor funcional aprovou
- o revisor tecnico aprovou, quando aplicavel
- a evidencia minima foi anexada
- o handoff foi feito para o proximo dono, se existir

## Evidencia minima esperada

- diff ou PR para tarefas de implementacao
- tabela, matriz ou especificacao para tarefas de desenho
- dashboard, relatorio ou print de validacao para tarefas de leitura operacional
- smoke ou E2E para tarefas de fluxo critico
