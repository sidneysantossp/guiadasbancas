# Smoke Automatizado da Jornada de Compra

## Objetivo

Executar um smoke pragmático da jornada de compra do cliente e, opcionalmente, validar a visibilidade do pedido no painel do jornaleiro.

O runner está em:

- [scripts/smoke-order-flow.mjs](/Applications/MAMP/htdocs/guiadasbancas/scripts/smoke-order-flow.mjs)

Por padrão, ele **não cria pedido real**. A execução padrão para antes da compra.

## O que ele cobre

Fluxo cliente:

1. home
2. busca de produto
3. abertura do primeiro produto
4. adição ao carrinho
5. validação do carrinho
6. checkout
7. gate de autenticação ou autenticação real
8. preenchimento mínimo do checkout
9. envio real do pedido, se habilitado

Fluxo jornaleiro opcional:

1. login no painel
2. lista de pedidos
3. detalhe do pedido criado
4. avanço de status no detalhe, se habilitado
5. captura dos requests para:
   - `/api/orders`
   - `/api/whatsapp/status-update`
   - `/api/whatsapp/jornaleiro-notification`

## Pré-requisitos

1. app rodando localmente ou em ambiente acessível
2. dependências instaladas
3. produto buscável no storefront
4. se for criar pedido:
   - conta de cliente válida ou permissão para registrar uma conta nova
   - dados mínimos de checkout
5. se for validar jornaleiro:
   - credenciais reais do jornaleiro da banca do pedido

## Variáveis de ambiente

Obrigatórias só quando usadas:

- `SMOKE_BASE_URL`
  - padrão: `http://localhost:3000`
- `SMOKE_PRODUCT_QUERY`
  - padrão: `energetico`
- `SMOKE_PRODUCT_URL`
  - opcional; se informado, bypass da busca
- `SMOKE_HEADLESS`
  - padrão: `true`
- `SMOKE_AUTH_MODE`
  - `none`, `login`, `register`
  - padrão: `none`
- `SMOKE_CLIENT_EMAIL`
  - obrigatório em `login`
  - opcional em `register`; se ausente, o script gera um e-mail temporário
- `SMOKE_CLIENT_PASSWORD`
  - obrigatório em `login` e `register`
- `SMOKE_CLIENT_NAME`
  - opcional
- `SMOKE_CLIENT_PHONE`
  - padrão: `(11) 99999-9999`
- `SMOKE_CREATE_ORDER`
  - padrão: `false`
- `SMOKE_SHIPPING_MODE`
  - `retirada` ou `entrega`
  - padrão: `retirada`
- `SMOKE_PAYMENT_METHOD`
  - `pix` ou `cash`
  - padrão: `pix`
- `SMOKE_OUTPUT_DIR`
  - padrão: `output/smoke`

Endereço, só se usar entrega real:

- `SMOKE_ADDRESS_CEP`
- `SMOKE_ADDRESS_NUMBER`
- `SMOKE_ADDRESS_COMPLEMENT`

Validação do jornaleiro, opcional:

- `SMOKE_JORNALEIRO_EMAIL`
- `SMOKE_JORNALEIRO_PASSWORD`
- `SMOKE_ADVANCE_JORNALEIRO_STATUS`
  - padrão: `false`

## Exemplos de uso

### 1. Smoke seguro até o checkout

```bash
node scripts/smoke-order-flow.mjs
```

Resultado esperado:

- busca realizada
- produto aberto
- item no carrinho
- checkout carregado
- parada planejada no gate de autenticação

### 2. Smoke com login do cliente até checkout pronto

```bash
SMOKE_AUTH_MODE=login \
SMOKE_CLIENT_EMAIL='cliente@teste.com' \
SMOKE_CLIENT_PASSWORD='Senha123!' \
node scripts/smoke-order-flow.mjs
```

Resultado esperado:

- login concluído
- telefone preenchido se necessário
- checkout pronto
- parada segura antes da compra real

### 3. Smoke com registro do cliente e criação real do pedido

```bash
SMOKE_AUTH_MODE=register \
SMOKE_CLIENT_PASSWORD='Senha123!' \
SMOKE_CREATE_ORDER=true \
SMOKE_CLIENT_PHONE='(11) 99999-9999' \
node scripts/smoke-order-flow.mjs
```

Resultado esperado:

- conta criada
- login realizado
- pedido criado
- captura de `orderId` e `orderNumber`

### 4. Smoke completo com validação do jornaleiro

```bash
SMOKE_AUTH_MODE=login \
SMOKE_CLIENT_EMAIL='cliente@teste.com' \
SMOKE_CLIENT_PASSWORD='Senha123!' \
SMOKE_CLIENT_PHONE='(11) 99999-9999' \
SMOKE_CREATE_ORDER=true \
SMOKE_JORNALEIRO_EMAIL='banca@teste.com' \
SMOKE_JORNALEIRO_PASSWORD='Senha123!' \
SMOKE_ADVANCE_JORNALEIRO_STATUS=true \
node scripts/smoke-order-flow.mjs
```

Resultado esperado:

- pedido criado no checkout
- pedido visível em `/jornaleiro/pedidos/[id]`
- `PATCH /api/orders` capturado
- tentativas de `/api/whatsapp/status-update` e `/api/whatsapp/jornaleiro-notification` capturadas

## Saídas geradas

Cada execução cria uma pasta com timestamp em `output/smoke/<run-id>/`.

Arquivos gerados:

- screenshots `.png`
- `summary.json`

O `summary.json` concentra:

- configuração usada
- passos executados
- artefatos
- erros de console
- warnings
- requests de pedidos e WhatsApp
- `orderId` e `orderNumber`, quando existirem

## Limites desta automação

Automatizado:

- storefront
- busca
- produto
- carrinho
- checkout
- login/cadastro do cliente
- criação do pedido
- painel do jornaleiro
- detalhe do pedido
- captura dos endpoints críticos

Mantido manual na primeira versão:

- confirmação do recebimento real da mensagem no WhatsApp
- validação visual dentro do app WhatsApp
- estado da instância Evolution
- verificação em banco de `orders` e `order_history`
- cenários múltiplas bancas, cupom, frete complexo e falhas externas

## Critério de uso recomendado

Use este runner em 3 níveis:

1. `SMOKE_CREATE_ORDER=false`
   - para checagem rápida de UI e autenticação
2. `SMOKE_CREATE_ORDER=true`
   - para homologação funcional do checkout
3. `SMOKE_ADVANCE_JORNALEIRO_STATUS=true`
   - para validar integração entre pedido, painel do jornaleiro e disparos de notificação
