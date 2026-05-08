# Plano de Teste: Compra do Usuário até Operação do Jornaleiro

## Objetivo

Validar a jornada ponta a ponta de compra no marketplace:

1. busca de produto
2. página do produto
3. adição ao carrinho
4. registro/login
5. checkout
6. criação do pedido
7. visualização do pedido pelo cliente
8. operação do pedido pelo jornaleiro no dashboard
9. notificações e confirmações por WhatsApp

## Escopo validado no código

Fluxos e pontos técnicos usados como referência:

- busca e vitrine pública: `Navbar`, `BuscarPageClient`, `CategoryResultsClient`
- carrinho: `CartContext`, `CartPageClient`
- checkout: `CheckoutPageClient`
- criação/listagem/atualização de pedidos: `/api/orders`
- histórico do pedido: `order_history`
- conta do cliente: `/minha-conta/pedidos`
- operação do jornaleiro: `/jornaleiro/pedidos` e `/jornaleiro/pedidos/[id]`
- WhatsApp:
  - criação do pedido -> notificação para jornaleiro
  - criação do pedido -> boas-vindas + “pedido recebido” para cliente
  - mudança de status -> atualização para cliente
  - mudança de status -> confirmação para jornaleiro

## Pré-condições

### Ambiente

- aplicação rodando sem erro em `http://localhost:3000`
- autenticação funcionando
- Supabase acessível
- integração WhatsApp configurada no admin
- instância Evolution conectada

### Dados mínimos

- `banca A` publicada, ativa, aprovada, com `whatsapp` preenchido
- `banca B` publicada, ativa, aprovada, com `whatsapp` preenchido
- pelo menos:
  - `produto A1` ativo na banca A
  - `produto A2` ativo na banca A
  - `produto B1` ativo na banca B
- usuário cliente de teste com:
  - nome
  - e-mail válido
  - telefone celular com DDD
- jornaleiro vinculado à banca A com acesso ao painel
- CEP válido para entrega

### Evidências a coletar

- captura da busca
- captura da página do produto
- captura do carrinho
- captura do checkout antes de enviar
- ID e número do pedido criado
- registro do pedido em `/minha-conta/pedidos`
- pedido aparecendo em `/jornaleiro/pedidos`
- prints das mensagens de WhatsApp
- logs ou resposta de sucesso das rotas `/api/orders`, `/api/whatsapp/status-update` e `/api/whatsapp/jornaleiro-notification`

## Dados de teste sugeridos

### Cenário base

- produto alvo: 1 item de alta disponibilidade e com preço conhecido
- quantidade inicial: `1`
- método de entrega: `entrega`
- pagamento: `pix`

### Cenários complementares

- pagamento em `dinheiro` com troco
- `retirada` em vez de entrega
- cupom válido
- cupom inválido
- carrinho com produto da mesma banca
- tentativa de carrinho com produto de outra banca

## Roteiro principal

### CT-01 Busca do produto

Objetivo:
confirmar que o usuário encontra um produto específico pela busca principal.

Passos:

1. abrir a home
2. digitar o nome exato ou parcial do produto na navbar
3. validar autocomplete
4. abrir o resultado pelo autocomplete
5. repetir via página de resultados de busca

Resultado esperado:

- o produto aparece no autocomplete
- o produto aparece na página de resultados
- preço exibido é o preço de venda
- o produto abre a página de detalhe correta

### CT-02 Página do produto

Objetivo:
validar informações mínimas antes da compra.

Passos:

1. abrir o detalhe do produto
2. conferir nome, código, preço, imagem e banca responsável
3. confirmar que a URL é amigável

Resultado esperado:

- nome e preço batem com o cadastro do produto
- banca correta aparece vinculada
- breadcrumb e layout carregam corretamente

### CT-03 Adição ao carrinho

Objetivo:
validar inclusão do item e restrição de mistura entre bancas.

Passos:

1. adicionar `produto A1` ao carrinho
2. abrir `/carrinho`
3. confirmar quantidade, subtotal e nome da banca
4. adicionar `produto A2` da mesma banca
5. tentar adicionar `produto B1` de outra banca

Resultado esperado:

- `A1` entra no carrinho
- `A2` entra normalmente
- `B1` é bloqueado
- o modal de aviso informa que o carrinho contém produtos de outra banca

Observação técnica:

- o carrinho usa `localStorage` em `gb:cart`
- o bloqueio entre bancas acontece em `CartContext`

### CT-04 Checkout sem login

Objetivo:
validar o gate de autenticação.

Passos:

1. com carrinho preenchido, abrir `/checkout`
2. tentar finalizar sem sessão autenticada

Resultado esperado:

- sistema exige login/cadastro
- redireciona para conta/login com `redirect=/checkout`

### CT-05 Registro de usuário durante a compra

Objetivo:
validar criação de conta com retorno ao checkout.

Passos:

1. a partir do checkout, abrir cadastro de cliente
2. concluir o registro
3. retornar ao checkout

Resultado esperado:

- usuário é criado com sucesso
- sessão fica autenticada
- checkout volta com dados do usuário reaproveitados

### CT-06 Checkout com entrega

Objetivo:
validar criação do pedido completo.

Passos:

1. autenticar como cliente
2. preencher telefone
3. preencher endereço completo
4. escolher `entrega`
5. escolher `pix`
6. revisar totais
7. finalizar pedido

Resultado esperado:

- `POST /api/orders` responde `ok: true`
- pedido é criado com:
  - `order_number`
  - `user_id`
  - `banca_id`
  - `status = novo`
- carrinho é limpo
- `gb:lastOrder` e `gb:orders` são atualizados
- usuário é redirecionado para `/minha-conta?checkout=true`

### CT-07 Checkout com retirada

Objetivo:
confirmar que retirada não exige endereço de entrega completo.

Passos:

1. repetir o checkout
2. selecionar `retirada`
3. remover dependência de endereço
4. finalizar pedido

Resultado esperado:

- checkout é aceito sem exigir rua/bairro/cidade/UF
- pedido é criado normalmente

### CT-08 Pagamento em dinheiro com troco

Objetivo:
validar aviso de troco e persistência do valor informado.

Passos:

1. escolher `dinheiro`
2. informar troco maior que o total
3. repetir com troco menor que o total

Resultado esperado:

- com troco válido: pedido criado
- com troco menor que o total: aviso visual, sem travar o envio

### CT-09 Pedido na conta do cliente

Objetivo:
validar pós-compra do lado do usuário.

Passos:

1. abrir `/minha-conta/pedidos`
2. abrir o detalhe do pedido recém-criado

Resultado esperado:

- pedido aparece na listagem
- status inicial está correto
- itens, valores, banca e pagamento batem com o checkout

## Validação operacional do jornaleiro

### CT-10 Pedido no dashboard do jornaleiro

Objetivo:
confirmar que o pedido chega para a banca correta.

Passos:

1. entrar como jornaleiro da banca A
2. abrir `/jornaleiro/dashboard`
3. abrir `/jornaleiro/pedidos`

Resultado esperado:

- dashboard mostra aumento nos pedidos recentes/pendentes
- pedido aparece na listagem da banca A
- pedido não aparece para outra banca

### CT-11 Detalhe do pedido no painel do jornaleiro

Objetivo:
validar leitura e operação do pedido.

Passos:

1. abrir `/jornaleiro/pedidos/[id]`
2. conferir cliente, telefone, itens, pagamento, endereço e total
3. preencher observação
4. ajustar previsão de entrega

Resultado esperado:

- dados batem com o pedido criado
- observações podem ser salvas
- previsão de entrega pode ser atualizada
- histórico recebe registros correspondentes

### CT-12 Mudança de status pelo jornaleiro

Objetivo:
validar o fluxo operacional completo.

Passos:

1. alterar `novo -> confirmado`
2. alterar `confirmado -> em_preparo`
3. alterar `em_preparo -> saiu_para_entrega`
4. alterar `saiu_para_entrega -> entregue`

Resultado esperado:

- `PATCH /api/orders` atualiza o pedido
- histórico registra a mudança
- a tela recarrega com o novo status
- o cliente recebe notificação de status por WhatsApp
- o jornaleiro recebe confirmação de que o cliente foi notificado

## Validação do WhatsApp

### CT-13 WhatsApp do jornaleiro na criação do pedido

Objetivo:
confirmar o alerta operacional inicial da banca.

Passos:

1. concluir uma compra válida
2. monitorar o número WhatsApp da banca A

Resultado esperado:

- o jornaleiro recebe mensagem com:
  - número do pedido
  - cliente
  - telefone
  - link WhatsApp do cliente
  - itens
  - total
  - entrega
  - pagamento
- se o WhatsApp da banca estiver ausente, deve haver aviso em log sem quebrar a criação do pedido

### CT-14 WhatsApp do cliente na criação do pedido

Objetivo:
confirmar comunicação inicial com o cliente.

Passos:

1. concluir uma compra válida
2. monitorar o número do cliente

Resultado esperado:

- cliente recebe:
  - mensagem de boas-vindas
  - mensagem de “pedido recebido”

### CT-15 WhatsApp do cliente ao trocar status

Objetivo:
confirmar comunicação transacional do pedido.

Passos:

1. no painel do jornaleiro, mudar o status
2. observar a execução da rota `/api/whatsapp/status-update`

Resultado esperado:

- cliente recebe mensagem coerente com o novo status
- a mensagem traz o número do pedido correto
- se existir previsão de entrega, ela acompanha a notificação

### CT-16 WhatsApp do jornaleiro após troca de status

Objetivo:
confirmar o retorno operacional ao operador da banca.

Passos:

1. alterar o status no detalhe do pedido
2. observar a execução da rota `/api/whatsapp/jornaleiro-notification`

Resultado esperado:

- jornaleiro recebe confirmação de que o cliente foi notificado
- nome do cliente e transição de status aparecem corretamente

## Casos negativos obrigatórios

### CT-17 Produto de outra banca no carrinho

Resultado esperado:

- bloqueio por modal
- carrinho original preservado

### CT-18 Checkout com carrinho vazio

Resultado esperado:

- mensagem `Seu carrinho está vazio`
- nenhum pedido criado

### CT-19 Checkout com telefone inválido

Resultado esperado:

- pedido não é enviado
- sistema pede telefone com DDD

### CT-20 Checkout com banca inválida

Como simular:

- manipular payload ou usar item sem `banca_id`

Resultado esperado:

- `/api/orders` retorna erro `Banca não identificada`

### CT-21 Jornaleiro sem WhatsApp configurado

Resultado esperado:

- pedido é criado
- notificação WhatsApp falha sem quebrar o fluxo
- logs mostram aviso

### CT-22 Cliente cancela o próprio pedido

Objetivo:
validar permissão do lado do cliente.

Passos:

1. abrir detalhe do pedido em `/minha-conta/pedidos/[id]`
2. cancelar pedido ainda elegível

Resultado esperado:

- cliente consegue apenas cancelar
- cliente não consegue editar observação, prazo ou itens

## Checklist de banco e logs

### Banco

Validar nas tabelas:

- `orders`
- `order_history`

Conferir:

- `order_number`
- `user_id`
- `banca_id`
- `status`
- `items`
- `subtotal`
- `shipping_fee`
- `total`
- `payment_method`
- `coupon_code`
- `coupon_discount`

### Logs

Conferir logs para:

- `[API/ORDERS/POST]`
- `[NOVO PEDIDO CRIADO]`
- `[WHATSAPP]`
- `[WhatsApp Status Update]`
- `[WhatsApp Jornaleiro]`

## Critério de aprovação

O fluxo está aprovado quando:

1. o usuário encontra e compra um produto real
2. o pedido é criado sem divergência de valor
3. o cliente vê o pedido na conta
4. o jornaleiro vê e opera o pedido no painel
5. os WhatsApps essenciais são disparados ou, se falharem, não quebram a transação
6. o histórico do pedido registra criação e mudanças de status

## Recomendação de execução

Executar em três rodadas:

1. `smoke`
   - busca
   - carrinho
   - checkout pix
   - pedido no painel do jornaleiro
2. `operacional`
   - mudança de status
   - histórico
   - WhatsApp
3. `regressão`
   - outra banca no carrinho
   - retirada
   - dinheiro com troco
   - cancelamento pelo cliente
