# Codex Initial Execution Board

## Objetivo

Este documento converte o operating model em uma fila inicial de execucao. Ele organiza:

- prioridades por pod
- objetivo de negocio
- KPI norte
- risco
- dependencias
- aprovacao funcional
- aprovacao tecnica
- gate final

## Regras deste board

- tudo entra pelo `Chief of Staff Agent`
- todo item precisa ter um pod dono
- nenhum item critico avanca sem aprovador tecnico quando houver risco sistemico
- nenhum item e considerado concluido sem validacao executada

## Tabela mestra

| Prioridade | Pod | Iniciativa | Objetivo | KPI norte | Risco | Dependencias | Aprovacao funcional | Aprovacao tecnica | Gate final |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |

## Bloco 1. Protecao de receita e confiabilidade

Itens desta secao devem entrar antes de expansao comercial, SEO massivo ou automacao adicional.

| Prioridade | Pod | Iniciativa | Objetivo | KPI norte | Risco | Dependencias | Aprovacao funcional | Aprovacao tecnica | Gate final |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| P0 | Admin | Harden auth, billing e settings sensiveis | reduzir risco de perda de receita e bypass administrativo | incidentes criticos de auth/billing | alto | auth, settings, subscriptions, pagamentos | `Noether` | `Platform & Data Lead` | `Principal Codex` |
| P0 | Jornaleiro | estabilizar onboarding -> banca publicada -> primeira venda | eliminar perda de ativacao por lifecycle e entitlement | ativacao ate primeira venda | alto | onboarding, lifecycle, entitlement, catalogo, pedido | `Copernicus` | `Platform & Data Lead` | `QA / Release Lead` |
| P0 | Distribuidor | estabilizar catalogos grandes, Mercos e atribuicao comercial | impedir falhas de supply e visibilidade da rede | cobertura de catalogo e sync estavel | alto | produtos, sync, pricing, rede, pedidos | `Darwin` | `Platform & Data Lead` | `QA / Release Lead` |
| P0 | Growth | instrumentar funil e proteger checkout/search | impedir crescimento sem leitura e perda de conversao silenciosa | checkout complete e zero-result rate | alto | analytics, busca, checkout, pedidos | `Boyle` | `Platform & Data Lead` | `QA / Release Lead` |

## Bloco 2. Crescimento controlado

Itens desta secao entram logo depois que o bloco de confiabilidade estiver protegido.

| Prioridade | Pod | Iniciativa | Objetivo | KPI norte | Risco | Dependencias | Aprovacao funcional | Aprovacao tecnica | Gate final |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| P1 | Growth | landing e SEO de aquisicao do jornaleiro | aumentar descoberta e cadastro qualificado | CTR de CTA e cadastro iniciado | medio | CMS, tracking, landing, auth | `Boyle` | `Platform & Data Lead` | `QA / Release Lead` |
| P1 | Jornaleiro | checklist de prontidao e CRM de primeira venda | acelerar publicacao e recompra inicial | tempo ate primeira venda | medio | lifecycle, inteligencia, notificacoes | `Copernicus` | `Platform & Data Lead` | `QA / Release Lead` |
| P1 | Distribuidor | score de carteira e adocao por banca | tornar a rede comercial operavel | bancas compradoras por distribuidor | medio | rede de bancas, pedidos, supply | `Darwin` | `Platform & Data Lead` | `QA / Release Lead` |
| P1 | Admin | cockpit executivo de receita, bancas e supply | leitura unica para decisao | MRR, bancas publicadas, supply ativo | medio | analytics, billing, operacao | `Noether` | `Platform & Data Lead` | `Principal Codex` |

## Bloco 3. Escala operacional

Itens desta secao entram quando os fluxos criticos estiverem estaveis.

| Prioridade | Pod | Iniciativa | Objetivo | KPI norte | Risco | Dependencias | Aprovacao funcional | Aprovacao tecnica | Gate final |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| P2 | Admin | trilha persistente de auditoria | governanca e rastreabilidade real | tempo de auditoria e confianca operacional | medio | auth, dados, storage | `Noether` | `Platform & Data Lead` | `QA / Release Lead` |
| P2 | Jornaleiro | automacao de colaboradores e papeis | ampliar operacao sem risco de permissao | erro de permissao e uso de colaboradores | medio | memberships, auth, roles | `Copernicus` | `Platform & Data Lead` | `QA / Release Lead` |
| P2 | Distribuidor | sync Mercos assincrono com rollback | escalar abastecimento sem travar HTTP | sucesso do sync e tempo de execucao | alto | jobs, observabilidade, Mercos | `Darwin` | `Platform & Data Lead` | `Principal Codex` |
| P2 | Growth | camada formal de experimentacao | permitir CRO e SEO com decisao por dado | uplift por experimento | medio | analytics, CMS, search, checkout | `Boyle` | `Platform & Data Lead` | `QA / Release Lead` |

## Pendencias para completar este board

- confirmar a fila final de `Noether`
- consolidar os top 12 itens da operacao inteira
- transformar isso em ritual semanal de execucao

## Fila de 30 dias por pod

### Admin Control Pod

Observacao:

- esta fila foi consolidada localmente a partir dos riscos ja mapeados no admin enquanto a resposta final de `Noether` nao retornou.

| Ordem | Iniciativa | Objetivo | KPI norte | Risco | Dependencias | Aprovacao funcional | Aprovacao tecnica | Gate final |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | Endurecer auth admin e remover compatibilidades legadas | impedir bypass e reduzir risco de sessao/admin indevido | incidentes de auth admin | alto | `lib/security/admin-auth.ts`, sessoes, middlewares | `Noether` | `Platform & Data Lead` | `Principal Codex` |
| 2 | Blindar settings e APIs sensiveis do admin | padronizar guarda, `no-store` e autorizacao consistente | 0 rotas sensiveis sem guarda padrao | alto | `app/api/admin/settings`, `plans`, `api-keys` | `Noether` | `Platform & Data Lead` | `Principal Codex` |
| 3 | Migrar auditoria de arquivo local para trilha persistente | governanca real e rastreabilidade operacional | tempo de auditoria e confianca operacional | alto | `app/api/admin/audit/route.ts`, storage, dados | `Noether` | `Platform & Data Lead` | `QA / Release Lead` |
| 4 | Consolidar billing, subscriptions e entitlements | eliminar drift entre plano, cobranca e acesso liberado | divergencia entre billing e entitlement | alto | subscriptions, pagamentos, entitlements | `Noether` | `Platform & Data Lead` | `Principal Codex` |
| 5 | Governanca de CMS e campanhas publicas | impedir promessa comercial sem suporte operacional | incidentes de conteudo inconsistente | medio | home, landing, banners, CMS | `Noether` | `Boyle` + `Platform & Data Lead` | `QA / Release Lead` |
| 6 | Cockpit executivo unico de receita, bancas e supply | leitura confiavel para decisao executiva | MRR, bancas publicadas, supply ativo | medio | analytics, intelligence, billing, operacao | `Noether` | `Platform & Data Lead` | `Principal Codex` |
| 7 | Padronizar KPIs oficiais do marketplace | uma unica verdade para negocio e operacao | confianca dos dashboards | medio | admin intelligence, analytics, dados | `Noether` | `Platform & Data Lead` | `QA / Release Lead` |
| 8 | Revisar governanca de planos no onboarding e admin | impedir escolha tardia ou divergente de plano | conversao por plano e erro de onboarding | medio | onboarding, plans, billing, CMS | `Noether` | `Copernicus` + `Platform & Data Lead` | `Principal Codex` |
| 9 | Fortalecer observabilidade de Asaas, Mercos e WhatsApp | detectar falha antes de virar incidente comercial | tempo medio para detectar falha | medio | integracoes, logs, health checks | `Noether` | `Platform & Data Lead` | `QA / Release Lead` |
| 10 | Formalizar governanca do legado cotista x entitlement atual | remover ambiguidade nas regras centrais | 0 fluxos criticos dependentes de regra legada | medio | catalogo, distribuidor, jornaleiro, planos | `Noether` | `Platform & Data Lead` | `Principal Codex` |

Top 3 de protecao de receita e governanca:

- endurecer auth admin e remover compatibilidades legadas
- blindar settings e APIs sensiveis do admin
- consolidar billing, subscriptions e entitlements

### Jornaleiro Pod

| Ordem | Iniciativa | Objetivo | KPI norte | Risco | Dependencias | Aprovacao funcional | Aprovacao tecnica | Gate final |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | Unificar lifecycle da banca e regra de acesso | banca nunca desaparecer e estados terem comportamento unico | `% de bancas que chegam a publicada em 24h` | alto | lifecycle, dashboard, inteligencia, APIs de banca | `Copernicus` | `Platform & Data Lead` | `QA / Release Lead` |
| 2 | Reescrever onboarding para primeira vitrine publicada | reduzir vazamento entre cadastro e publicacao | `% de onboarding concluido -> banca publicada` | alto | onboarding, access, bancas, geocoding | `Copernicus` | `Platform & Data Lead` | `QA / Release Lead` |
| 3 | Fluxo de ativacao rapida de catalogo | sair do zero para 10 produtos ativos rapidamente | tempo medio ate 10 produtos ativos | alto | products, distributor-catalog, plano | `Copernicus` | `Platform & Data Lead` | `QA / Release Lead` |
| 4 | Unificar entitlement por plano em toda a frente jornaleiro | mesma regra em UI, API e backend | 0 divergencia entre plano e acesso | alto | `plan-entitlements`, subscriptions, telas e APIs | `Copernicus` | `Platform & Data Lead` | `Principal Codex` |
| 5 | Fechar funil da primeira venda em pedidos | pedido novo ser visto, respondido e concluido | `% pedidos respondidos em 15 min` | medio | pedidos, notificacoes, dashboard | `Copernicus` | `Platform & Data Lead` | `QA / Release Lead` |
| 6 | Reorganizar dashboard como cockpit de acao | orientar a proxima acao certa | `% usuarios que executam CTA principal` | medio | dashboard, checklist, stats | `Copernicus` | `Boyle` + `Platform & Data Lead` | `QA / Release Lead` |
| 7 | Fortalecer notificacoes operacionais | separar alerta critico de ruido | `% eventos criticos lidos em 1h` | medio | notifications, pedidos, billing | `Copernicus` | `Platform & Data Lead` | `QA / Release Lead` |
| 8 | Fechar governanca de colaboradores | ampliar operacao sem escalacao indevida | `% acoes sensiveis protegidas corretamente` | alto | collaborators, memberships, roles | `Copernicus` | `Platform & Data Lead` | `QA / Release Lead` |
| 9 | Evoluir inteligencia para recomendacao acionavel | responder o que a banca deve fazer hoje | `% recomendacoes executadas em 7 dias` | medio | intelligence, pedidos, catalogo | `Copernicus` | `Platform & Data Lead` | `QA / Release Lead` |
| 10 | Instrumentacao e QA de jornada completa | proteger a frente jornaleiro contra regressao | cobertura dos 5 fluxos criticos | medio | onboarding, catalogo, pedidos, billing | `Copernicus` | `QA / Release Lead` | `QA / Release Lead` |

Top 3 de ativacao ate a primeira venda:

- unificar lifecycle da banca e regra de acesso
- reescrever onboarding para primeira vitrine publicada
- fluxo de ativacao rapida de catalogo

### Distribuidor Pod

| Ordem | Iniciativa | Objetivo | KPI norte | Risco | Dependencias | Aprovacao funcional | Aprovacao tecnica | Gate final |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | Transformar sync Mercos em job assincrono com fila, lock e observabilidade | estabilizar supply em catalogos grandes | taxa de sync concluido > 98% | alto | integration, api sync, mecanismo de job | `Darwin` | `Platform & Data Lead` | `Principal Codex` |
| 2 | Criar reconciliacao Mercos x Banco | detectar faltas, divergencias e categorias orfas | diferenca Mercos x banco <= 1% | alto | integration, products, categories | `Darwin` | `Platform & Data Lead` | `QA / Release Lead` |
| 3 | Separar rede da plataforma, bancas elegiveis e carteira comercial | leitura comercial real da rede | `% bancas com status comercial definido` | alto | distribuidor-access, bancas, possivel nova tabela | `Darwin` | `Platform & Data Lead` | `Principal Codex` |
| 4 | Normalizar pricing como fonte unica de verdade | eliminar divergencia de preco API/UI | 0 divergencia em amostra de 200 SKUs | alto | markup, products, UI | `Darwin` | `Platform & Data Lead` | `QA / Release Lead` |
| 5 | Reestruturar atribuicao de pedidos por linha de item | parar de depender de parsing amplo de items | 100% pedidos atribuidos corretamente | alto | orders, possivel tabela derivada | `Darwin` | `Platform & Data Lead` | `QA / Release Lead` |
| 6 | Criar health panel operacional do distribuidor | detectar falha cedo | tempo medio para detectar incidente < 10 min | medio | dashboard, stats, eventos | `Darwin` | `Platform & Data Lead` | `QA / Release Lead` |
| 7 | Escalar catalogo grande com indexacao, paginacao e filtros robustos | sustentar distribuidores 5k+ | p95 de carregamento < 2s | medio | products, bancas, orders, indices | `Darwin` | `Platform & Data Lead` | `QA / Release Lead` |
| 8 | Implantar governanca de ativacao comercial por banca | medir adocao real do catalogo pela rede | `% bancas elegiveis com produtos ativos` | medio | bancas, customizacoes, carteira | `Darwin` | `Platform & Data Lead` | `QA / Release Lead` |
| 9 | Fechar trilha de qualidade de midia e taxonomia | melhorar conversao do catalogo | `% SKUs ativos com imagem e categoria` | medio | upload imagens, categorias, Mercos | `Darwin` | `Platform & Data Lead` | `QA / Release Lead` |
| 10 | Endurecer autenticacao e auditoria do distribuidor | reduzir risco operacional e suporte | 0 uso de fallback legado | medio | auth route, security, auditoria | `Darwin` | `Platform & Data Lead` | `Principal Codex` |

Top 3 de estabilidade de supply:

- sync Mercos assincrono com fila
- reconciliacao Mercos x Banco
- separacao entre rede, elegibilidade e carteira comercial

### Growth & Commerce Pod

| Ordem | Iniciativa | Objetivo | KPI norte | Risco | Dependencias | Aprovacao funcional | Aprovacao tecnica | Gate final |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | Fundacao de analytics do funil publico | medir o funil end-to-end | `% sessoes com funil rastreavel` | alto | `useAnalytics`, `track`, home, busca, PDP, checkout | `Boyle` | `Platform & Data Lead` | `QA / Release Lead` |
| 2 | Busca local e autocomplete orientados a conversao | reduzir zero-result e melhorar descoberta | `search-to-product-click rate` | alto | autocomplete, most-searched, public products, UI de busca | `Boyle` | `Platform & Data Lead` | `QA / Release Lead` |
| 3 | Checkout sem atrito e recuperacao de abandono | melhorar receita no ponto mais sensivel | `checkout start -> checkout complete` | alto | checkout, orders, addresses, profile | `Boyle` | `Platform & Data Lead` | `Principal Codex` |
| 4 | Minha Conta como motor de recompra | transformar conta em CRM de retorno | `repeat purchase rate` | medio | inteligencia, cupons, pedidos | `Boyle` | `Platform & Data Lead` | `QA / Release Lead` |
| 5 | SEO Copa 2026 com intencao transacional real | converter cluster editorial em demanda comercial | sessoes organicas nao-brand do cluster | medio | `WorldCupSeoPage`, oferta publica, bancas publicadas | `Boyle` | `Platform & Data Lead` | `QA / Release Lead` |
| 6 | PDP local com CTA comercial mais forte | aumentar add-to-cart e WhatsApp click | `PDP -> add to cart` | medio | PDP, products API, public-product-route | `Boyle` | `Platform & Data Lead` | `QA / Release Lead` |
| 7 | Home como motor de merchandising e aquisicao | separar discovery, campanhas e captacao | CTR por slot da home | medio | home, banners, CMS | `Boyle` | `Noether` + `Platform & Data Lead` | `QA / Release Lead` |
| 8 | Landing do jornaleiro com funil mensuravel | transformar `/para-jornaleiros` em funil operavel | `landing visit -> cadastro iniciado` | medio | landing, CMS, tracking, auth | `Boyle` | `Platform & Data Lead` | `QA / Release Lead` |
| 9 | Demand gap loop entre busca publica e oferta da rede | transformar top buscas sem resultado em backlog de sortimento | `% top buscas sem resultado tratadas` | medio | analytics, admin, jornaleiro, distribuidor | `Boyle` | `Platform & Data Lead` | `QA / Release Lead` |
| 10 | Camada minima de experimentacao e rollout controlado | permitir CRO com decisao por dado | numero de releases criticas com flag | medio | `system_settings`, CMS, analytics | `Boyle` | `Platform & Data Lead` | `QA / Release Lead` |

Top 3 de descoberta, conversao e CRM:

- busca local e autocomplete orientados a conversao
- checkout sem atrito e recuperacao de abandono
- Minha Conta como motor de recompra

## Top 12 da operacao inteira

### Onda 1 - blindagem imediata

1. Endurecer auth admin e remover compatibilidades legadas
2. Blindar settings e APIs sensiveis do admin
3. Unificar lifecycle da banca e regra de acesso
4. Reescrever onboarding para primeira vitrine publicada
5. Transformar sync Mercos em job assincrono com fila, lock e observabilidade
6. Fundacao de analytics do funil publico

### Onda 2 - estabilizacao comercial

7. Consolidar billing, subscriptions e entitlements
8. Fluxo de ativacao rapida de catalogo
9. Criar reconciliacao Mercos x Banco
10. Busca local e autocomplete orientados a conversao

### Onda 3 - crescimento com controle

11. Checkout sem atrito e recuperacao de abandono
12. Separar rede da plataforma, bancas elegiveis e carteira comercial

## Ritmo semanal de execucao

### Segunda

- triagem central do `Chief of Staff Agent`
- revisar bloqueios P0/P1
- congelar prioridades da semana

### Terca

- review do pod `Admin`
- review do pod `Jornaleiro`

### Quarta

- review do pod `Distribuidor`
- review do pod `Growth & Commerce`

### Quinta

- revisao tecnica com `Platform & Data Lead`
- revisao de risco de release com `QA / Release Lead`

### Sexta

- leitura executiva de KPIs
- decisao de sobe / nao sobe
- replanejamento da proxima semana

## Definicao de pronto deste board

Este board so entra em operacao quando:

- os top 12 tiverem owner definido
- cada item tiver criterio de aceite objetivo
- os gates de aprovacao estiverem acordados
- os dashboards minimos de acompanhamento existirem
