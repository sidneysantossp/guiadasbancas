# Codex Approval Checklists

## Objetivo

Este documento define o que precisa estar verdadeiro antes de uma mudanca ser considerada pronta para release no Guia das Bancas.

Regra base:

- quem implementa nao aprova
- quem aprova funcional nao substitui aprovacao tecnica
- nenhuma release critica sobe sem evidencias

## Checklist base para toda entrega

- objetivo da mudanca esta claro
- dominio dono foi definido
- risco foi classificado como `P0`, `P1`, `P2` ou `P3`
- criterio de aceite foi documentado
- validacao executada foi registrada
- impacto em `admin`, `jornaleiro`, `distribuidor`, `site publico` e `apis compartilhadas` foi considerado
- rollback foi pensado quando a mudanca nao for facilmente reversivel

## 1. Checklist de Admin / Billing / Settings

### Aprovadores

- `Noether`
- `Platform & Data Lead`
- `Principal Codex` quando tocar monetizacao ou settings sensiveis

### Verificacoes

- a regra de negocio esta coerente entre painel, API e banco
- a mudanca nao expoe segredo, chave ou configuracao sensivel
- planos, assinatura, pagamentos e grace period continuam coerentes
- a alteracao nao libera recurso sem entitlement real
- settings sensiveis usam guarda consistente
- eventos e dashboards administrativos continuam corretos

## 2. Checklist de Jornaleiro / Lifecycle / Entitlements

### Aprovadores

- `Copernicus`
- `Platform & Data Lead`
- `QA / Release Lead` para jornadas criticas

### Verificacoes

- a banca nao desaparece por regra errada de lifecycle
- `draft`, `pendente`, `publicada` e `pausada` continuam bem separados
- onboarding, perfil, catalogo, pedido e inteligencia usam a mesma verdade de entitlement
- o plano correto libera o recurso correto
- limites de plano estao aplicados no backend e nao so na interface
- colaborador nao ganha acesso acima do permitido

## 3. Checklist de Distribuidor / Mercos / Pricing

### Aprovadores

- `Darwin`
- `Platform & Data Lead`
- `QA / Release Lead` quando houver sync ou operacao em massa

### Verificacoes

- catalogos grandes continuam carregando em lotes seguros
- sync nao sobrescreve informacao sem controle
- markup e preco sao calculados de forma consistente no backend
- a rede de bancas nao depende de derivacao quebravel sem evidencia
- a atribuicao de pedido ao distribuidor continua correta
- filtros e listagens funcionam para massa grande de dados

## 4. Checklist de Growth / SEO / Discovery

### Aprovadores

- `Boyle`
- `Analytics & Experimentation Agent`
- `SEO Program Agent` quando indexavel
- `QA / Release Lead`

### Verificacoes

- a pagina tem objetivo comercial claro
- CTA e copy medem o KPI que pretendem mover
- eventos analiticos foram definidos antes da publicacao
- canonical, schema e metadata estao corretos
- a pagina nao cria canibalizacao desnecessaria
- busca, autocomplete e ranking nao pioram `zero-result rate` ou latencia
- landing, home e banners nao prometem algo que o produto nao entrega

## 5. Checklist de Commerce / Checkout / Pedido

### Aprovadores

- `Boyle`
- `Platform & Data Lead`
- `QA / Release Lead`
- `Principal Codex` quando tocar monetizacao

### Verificacoes

- carrinho, checkout e pedido funcionam ponta a ponta
- cupom, desconto e preco final batem com backend
- o pedido e idempotente
- falhas de pagamento tem mensagem e fallback adequados
- a disponibilidade comercial do item continua coerente
- o jornaleiro recebe o pedido como esperado

## 6. Checklist de Auth / Session / Permissions

### Aprovadores

- `Platform & Data Lead`
- `QA / Release Lead`
- `Principal Codex`

### Verificacoes

- login, logout, refresh de sessao e recuperacao continuam funcionando
- a rota protegida usa guarda consistente
- nao existe bypass legado indesejado
- permissao por papel continua correta
- dados sensiveis nao vazam por cache, hydration ou fallback de ambiente

## 7. Checklist de Data / Analytics / Integridade

### Aprovadores

- `Platform & Data Lead`
- `Analytics & Experimentation Agent`

### Verificacoes

- eventos possuem nome e propriedades consistentes
- tabelas relacionadas continuam coerentes
- nao ha drift entre `subscriptions`, `payments`, `orders`, `bancas` e `products`
- dashboards criticos continuam interpretaveis
- processos assincronos possuem observabilidade minima

## 8. Checklist de Release

### Aprovadores

- `QA / Release Lead`
- `Domain Lead`
- `Platform & Data Lead` quando risco tecnico for medio ou alto

### Verificacoes

- smoke principal executado
- regressao visual dos fluxos afetados verificada
- riscos residuais documentados
- rollback e mitigacao definidos
- monitoramento das primeiras 24-48h combinado

## 9. Definicao de pronto

Uma entrega so esta pronta quando:

- a mudanca foi implementada
- o dominio dono aprovou funcionalmente
- o risco tecnico foi revisado quando necessario
- o checklist do dominio foi cumprido
- a evidencia minima de validacao existe
- a release pode ser revertida ou isolada se algo falhar
