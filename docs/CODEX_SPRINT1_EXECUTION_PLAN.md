# Codex Sprint 1 Execution Plan

## Objetivo

Esta sprint transforma o board inicial em execucao real de 30 dias.

O foco desta fase e:

- proteger receita e autenticacao
- estabilizar onboarding e primeira venda do jornaleiro
- estabilizar supply e rede do distribuidor
- medir e melhorar descoberta, checkout e CRM

## Escopo da Sprint 1

Os itens abaixo foram escolhidos a partir do top 12 do board operacional:

1. endurecer auth admin e remover compatibilidades legadas
2. blindar settings e APIs sensiveis do admin
3. unificar lifecycle da banca e regra de acesso
4. reescrever onboarding para primeira vitrine publicada
5. transformar sync Mercos em job assincrono com fila, lock e observabilidade
6. fundacao de analytics do funil publico
7. consolidar billing, subscriptions e entitlements
8. fluxo de ativacao rapida de catalogo
9. criar reconciliacao Mercos x Banco
10. busca local e autocomplete orientados a conversao
11. checkout sem atrito e recuperacao de abandono
12. separar rede da plataforma, bancas elegiveis e carteira comercial

## Lideranca da Sprint

| Papel | Responsavel | Missao na sprint |
| --- | --- | --- |
| Direcao executiva | `Principal Codex` | definir prioridade, arbitrar conflitos e aprovar mudancas criticas |
| Orquestracao | `Chief of Staff Agent` | manter fila unica, remover bloqueios e acompanhar SLA |
| Admin | `Noether` | proteger auth, settings, billing e governanca |
| Jornaleiro | `Copernicus` | proteger onboarding, lifecycle, entitlement e primeira venda |
| Distribuidor | `Darwin` | proteger Mercos, catalogo, pricing e rede comercial |
| Growth & Commerce | `Boyle` | proteger analytics, busca, checkout e CRM |
| Plataforma | `Platform & Data Lead` | revisar risco sistemico, contratos, seguranca e dados |
| Release | `QA / Release Lead` | validar e bloquear releases sem evidencia suficiente |

## Onda 1 - Blindagem imediata

Janela:

- semana 1

### 1. Hardening de auth admin

Owner:

- `Noether`

Objetivo:

- remover caminhos legados e padronizar guarda de autenticacao do admin

Entregaveis:

- mapa de todas as rotas e middlewares criticos do admin
- lista de compatibilidades legadas ainda ativas
- implementacao de guarda unica nas rotas sensiveis
- remocao ou isolamento de fallback legado

Criterios de aceite:

- nenhuma rota sensivel do admin responde sem guarda consistente
- login e sessao admin continuam funcionando
- nao existe bypass legado habilitado por engano em producao

Gate:

- funcional: `Noether`
- tecnico: `Platform & Data Lead`
- final: `Principal Codex`

### 2. Blindagem de settings e APIs sensiveis

Owner:

- `Noether`

Objetivo:

- garantir `no-store`, autorizacao consistente e trilha segura para settings, plans e chaves

Entregaveis:

- inventario das APIs sensiveis
- padrao unico de guarda e cache
- revisao das rotas de plans, settings e api keys
- checklist de acesso administrativo

Criterios de aceite:

- nenhuma API sensivel usa guarda inconsistente
- responses sensiveis nao ficam cacheadas por engano
- alteracoes criticas passam por auditoria minima

Gate:

- funcional: `Noether`
- tecnico: `Platform & Data Lead`
- final: `Principal Codex`

### 3. Fundacao de analytics do funil publico

Owner:

- `Boyle`

Objetivo:

- medir o funil publico ponta a ponta antes de ampliar SEO e CRO

Entregaveis:

- taxonomia oficial de eventos
- cobertura de tracking em home, busca, PDP, carrinho, checkout e minha conta
- dashboard minimo de `search -> PDP -> cart -> checkout -> order`

Criterios de aceite:

- sessoes relevantes do funil sao rastreaveis
- eventos possuem nome e propriedades consistentes
- existe baseline inicial dos principais gargalos

Gate:

- funcional: `Boyle`
- tecnico: `Platform & Data Lead`
- final: `QA / Release Lead`

## Onda 2 - Ativacao e primeira venda

Janela:

- semana 2

### 4. Unificar lifecycle da banca e regra de acesso

Owner:

- `Copernicus`

Objetivo:

- garantir uma unica verdade para estados da banca em painel, inteligencia, catalogo e pedido

Entregaveis:

- mapeamento final dos estados validos
- helper unico de lifecycle aplicado em todas as entradas criticas
- revisao das telas e APIs que ainda divergem

Criterios de aceite:

- a banca nao desaparece por regra errada
- dashboard, inteligencia e catalogo usam o mesmo estado
- a publicacao da banca segue criterio unico

Gate:

- funcional: `Copernicus`
- tecnico: `Platform & Data Lead`
- final: `QA / Release Lead`

### 5. Reescrever onboarding para primeira vitrine publicada

Owner:

- `Copernicus`

Objetivo:

- transformar onboarding em fluxo curto para publicar a vitrine e preparar a primeira venda

Entregaveis:

- etapa unica de dados essenciais da banca
- validacao de endereco, horario e contato
- registro claro do plano inicial
- checklist final de publicacao

Criterios de aceite:

- o fluxo `registro -> onboarding -> banca publicada` funciona de ponta a ponta
- nao ha duplicidade de banca
- o usuario sempre sabe o proximo passo

Gate:

- funcional: `Copernicus`
- tecnico: `Platform & Data Lead`
- final: `QA / Release Lead`

### 6. Fluxo de ativacao rapida de catalogo

Owner:

- `Copernicus`

Objetivo:

- reduzir tempo entre cadastro e primeira oferta ativa

Entregaveis:

- caminho rapido para produto proprio
- caminho rapido para catalogo parceiro quando liberado
- estado de bloqueio claro quando o plano nao liberar acesso

Criterios de aceite:

- e possivel chegar a 10 produtos ativos sem friccao excessiva
- o bloqueio de plano e consistente em UI e API
- o jornaleiro consegue distinguir produto proprio de parceiro

Gate:

- funcional: `Copernicus`
- tecnico: `Platform & Data Lead`
- final: `QA / Release Lead`

## Onda 3 - Supply e rede comercial

Janela:

- semana 3

### 7. Sync Mercos assincrono com fila, lock e observabilidade

Owner:

- `Darwin`

Objetivo:

- retirar o sync pesado do fluxo HTTP e estabilizar distribuidores com catalogo grande

Entregaveis:

- desenho do job assincrono
- lock por distribuidor
- logs de inicio, progresso, falha e fim
- visibilidade operacional do ultimo sync

Criterios de aceite:

- sync full da Brancaleone conclui sem timeout
- duas execucoes simultaneas nao corrompem estado
- falhas ficam visiveis e rastreaveis

Gate:

- funcional: `Darwin`
- tecnico: `Platform & Data Lead`
- final: `Principal Codex`

### 8. Reconciliacao Mercos x Banco

Owner:

- `Darwin`

Objetivo:

- ter uma verdade operacional do catalogo sincronizado

Entregaveis:

- relatorio de faltantes
- relatorio de produtos desativados indevidamente
- relatorio de categorias orfas
- acao recomendada por distribuidor

Criterios de aceite:

- distribuidores grandes possuem relatorio de reconciliacao executavel
- a diferenca Mercos x banco fica explicita
- os casos mais graves viram backlog de correcao

Gate:

- funcional: `Darwin`
- tecnico: `Platform & Data Lead`
- final: `QA / Release Lead`

### 9. Separar rede da plataforma, bancas elegiveis e carteira comercial

Owner:

- `Darwin`

Objetivo:

- deixar de tratar toda banca ativa como parceira comercial do distribuidor

Entregaveis:

- definicao dos estados comerciais da banca
- filtros claros na frente do distribuidor
- base para score comercial e acompanhamento da rede

Criterios de aceite:

- a pagina de bancas distingue rede, elegibilidade e carteira
- o distribuidor consegue enxergar quem e compradora e quem nao e
- a leitura comercial deixa de depender de inferencia solta

Gate:

- funcional: `Darwin`
- tecnico: `Platform & Data Lead`
- final: `Principal Codex`

## Onda 4 - Conversao e monetizacao com controle

Janela:

- semana 4

### 10. Consolidar billing, subscriptions e entitlements

Owner:

- `Noether`

Objetivo:

- eliminar drift entre plano contratado, cobranca e recurso liberado

Entregaveis:

- mapeamento real do fluxo `plano -> subscription -> payment -> entitlement`
- revisao dos pontos de liberacao de recurso
- contrato minimo entre billing e acesso

Criterios de aceite:

- o plano correto libera exatamente o recurso correto
- status de cobranca muda comportamento do produto de forma previsivel
- nao existe liberacao indevida por drift

Gate:

- funcional: `Noether`
- tecnico: `Platform & Data Lead`
- final: `Principal Codex`

### 11. Busca local e autocomplete orientados a conversao

Owner:

- `Boyle`

Objetivo:

- reduzir busca vazia e aumentar descoberta comercial relevante

Entregaveis:

- baseline de `zero-result rate`
- ajuste de ranking local
- refinamento do autocomplete
- melhoria do fallback de descoberta

Criterios de aceite:

- cai a taxa de busca sem resultado
- sobe o CTR de clique em resultado de busca
- latencia nao piora de forma relevante

Gate:

- funcional: `Boyle`
- tecnico: `Platform & Data Lead`
- final: `QA / Release Lead`

### 12. Checkout sem atrito e recuperacao de abandono

Owner:

- `Boyle`

Objetivo:

- reduzir perda de receita na etapa mais sensivel do funil

Entregaveis:

- revisao do fluxo de login e endereco
- validacao de cupom e total
- pontos claros de abandono e recuperacao
- smoke completo de pedido

Criterios de aceite:

- o fluxo `cart -> checkout -> order` funciona ponta a ponta
- calculo de preco e desconto bate com backend
- os pontos de abandono ficam medidos

Gate:

- funcional: `Boyle`
- tecnico: `Platform & Data Lead`
- final: `Principal Codex`

## Dependencias cruzadas da sprint

### Noether depende de

- `Platform & Data Lead` para auth, settings, billing e dados
- `Boyle` para qualquer alteracao em CMS publico ou copy de monetizacao

### Copernicus depende de

- `Noether` para plano, billing e entitlement
- `Boyle` para dashboard orientado a CTA e mensuracao
- `Darwin` para fluxo de catalogo parceiro

### Darwin depende de

- `Platform & Data Lead` para jobs, locks, contratos e observabilidade
- `Copernicus` para refletir elegibilidade da rede e catalogo parceiro

### Boyle depende de

- `Noether` para CMS, campanhas e promessas comerciais
- `Copernicus` para oferta real do jornaleiro
- `Darwin` para cobertura de catalogo e disponibilidade regional

## Rituais da sprint

### Daily de execucao

- 15 minutos
- bloqueios
- risco de release
- dependencia entre pods

### Review semanal

- segunda: definir escopo e congelar prioridades
- quarta: revisar evidencias e riscos
- sexta: decidir sobe ou nao sobe e replanejar

## Scorecard da sprint

### Admin

- incidente de auth admin
- rotas sensiveis protegidas
- divergencia billing x entitlement

### Jornaleiro

- onboarding concluido
- banca publicada
- tempo ate 10 produtos ativos
- tempo ate primeira venda

### Distribuidor

- sync concluido
- diferenca Mercos x banco
- estabilidade de catalogo grande
- rede com status comercial definido

### Growth & Commerce

- sessoes com funil rastreavel
- zero-result rate
- search-to-click
- checkout start -> checkout complete

## Definicao de pronto da sprint

Uma iniciativa desta sprint so esta pronta quando:

- o owner entregou o recorte acordado
- o aprovador funcional validou a regra
- o aprovador tecnico revisou o risco sistemico quando aplicavel
- o gate final foi cumprido
- houve evidencia de validacao
- o resultado foi incorporado ao board e ao scorecard
