# Reestruturacao de Frontend com foco em performance

## Visao geral
Este documento define a nova fase de reestruturacao do frontend com foco em performance, mantendo o layout atual e evitando regressao visual. A estrategia prioriza HTML-first (SSR/ISR) no Next.js, com ilhas client apenas onde ha interacao real, e padroniza cache, dados e UX.

## Objetivos
- Reduzir tempo de carregamento e melhorar LCP/FCP/TTFB sem quebrar layout.
- Eliminar CSR global e reduzir JS inicial.
- Padronizar chamadas de API e cache.
- Garantir consistencia visual (tokens de UI e kit de componentes).
- Manter autenticacao e rotas privadas seguras.

## Metas de performance (alvo)
- TTFB: < 400ms em paginas publicas
- FCP: < 1.2s
- LCP: < 2.0s (home, buscar, produto, banca)
- TTI: < 2.5s
- JS inicial: -40% vs baseline
- Requests na home: -50% vs baseline

## Principios de arquitetura
- HTML-first: renderizar no servidor sempre que possivel.
- Ilhas client: JS apenas onde ha interacao ou estado local.
- Dados centralizados: evitar fetch disperso em componentes.
- Cache consistente: publico com revalidate; privado com no-store.
- Observabilidade: medir e acompanhar Web Vitals.
- Nao quebrar layout: preservar estrutura HTML e classes existentes.

## Arquitetura proposta

### Camada de UI
- Server Components para paginas e secoes de conteudo.
- Client Components apenas para:
  - carrinho, login, filtros, sliders e acoes interativas
  - formularios (checkout, cadastro, jornaleiro)
- Layout raiz server, sem usePathname.
- Grupos de rotas:
  - (site): publico
  - (auth): login/registro
  - (jornaleiro): painel
  - (admin): painel

### Camada de dados
- Data loaders por pagina (ex.: lib/data/home.ts).
- Agregacao por pagina via Promise.all.
- Contratos tipados e normalizacao unica.
- Eliminar fetch em useEffect para conteudo inicial.

### Cache
- Publico: fetch server com revalidate (ex.: 60s).
- Privado: no-store e headers restritivos.
- Desativar cache publico em endpoints sensiveis.
- Cache local versionado e com invalidacao clara.

### Seguranca
- Chaves sensiveis apenas no servidor (service role nunca no client).
- Tokens e sessions via cookies/headers seguros.

## Estrategia de execucao

### Fase 0 - Diagnostico e baseline
- Mapear paginas e fluxo de dados.
- Medir Web Vitals e requests por pagina.
- Capturar screenshots para comparacao visual.
- Inventario de chamadas de API e duplicacoes.

### Fase 1 - Fundacao HTML-first
- Layout raiz server; separar grupos de rotas.
- Migrar home para SSR/ISR sem CSR global.
- Criar data loaders e remover fetch client.
- Primeiro piloto: home + login + registro + jornaleiro.

### Fase 2 - Padronizacao de dados e cache
- Camada unica de dados por dominio.
- Unificar contratos e normalizacao.
- Definir TTL por tipo de dado.
- Revisar headers de cache por endpoint.

### Fase 3 - UX/UI consistente
- Definir tokens (cores, spacing, tipografia).
- Criar kit minimo de componentes reutilizaveis.
- Padronizar skeletons e estados de loading.

### Fase 4 - Otimizacoes finas
- Reduzir bundle e dependencias nao usadas.
- Otimizar imagens (tamanho, formatos, lazy).
- Revisar code-splitting e importacao dinamica.
- Ajustes finais com base em metricas.

## Escopo
- Todas as paginas do frontend (publico, login, registro, jornaleiro).
- Preservacao de layout e UI existente.
- Padronizacao de chamadas de API e cache.

## Fora de escopo (por enquanto)
- Reescrever backend completo.
- Mudanca total de design.
- Migracao para outro framework.

## Riscos e mitigacoes
- Risco: regressao visual
  - Mitigacao: screenshots e revisao por pagina
- Risco: dados stale por cache
  - Mitigacao: TTL curto e invalidacao por evento
- Risco: quebra de auth
  - Mitigacao: rotas separadas e testes de fluxo

## Entregaveis
- Documento de arquitetura e padrao de cache.
- Layout raiz server e rotas por grupo.
- Data loaders por pagina.
- Kit de componentes e tokens.
- Relatorio de metricas antes/depois.

## Validacao
- Lighthouse e Web Vitals por pagina critica.
- Comparacao visual por screenshot.
- Testes de fluxo: login, registro, compra, painel.

## Proximos passos imediatos
1. Aprovar arquitetura proposta.
2. Definir paginas piloto (home, login, registro, jornaleiro).
3. Iniciar Fase 0 com metricas baseline.

## Status atual
- Baseline Fase 0 documentado em docs/FASE0_BASELINE.ms.
- Fase 1 em andamento: layout raiz server e grupos (site)/(auth) criados, providers movidos para layouts especificos.
- Home: componentes above-the-fold agora renderizam via SSR (remocao de ssr:false na home).
- Home: hero slides/config carregados no servidor e injetados no FullBanner (menos fetch no client).
- Footer: dados, categorias e branding carregados no servidor e injetados no AppFooter (sem fetch no client).
- Categoria: pagina injeta categorias via SSR para evitar fetch inicial no client.
- Navbar: branding carregado no servidor e injetado (remove fetch global no client).
- Buscar: pagina injeta bancas, produtos e categorias via SSR para evitar fetch inicial no client.
- Promocoes: pagina injeta produtos via SSR para evitar fetch inicial no client.
- Pre-venda: pagina injeta produtos via SSR para evitar fetch inicial no client.
- Bancas perto de mim: pagina injeta bancas e categorias via SSR para evitar fetch inicial no client.
- Carrinho e checkout: paginas agora sao server shells com componentes client para reduzir JS no topo.
- Minha conta (perfil, enderecos, pedidos): paginas agora sao server shells com componentes client.
- Auth cliente (entrar/registrar) e jornaleiro (login/registro): paginas agora sao server shells com componentes client.
- Fase 2 iniciada: cache padronizado com TTLs centrais e loader de categorias compartilhado entre paginas.
- Fase 2: loaders de bancas/produtos conectados (buscar, promocoes, banca slug, bancas perto de mim).
