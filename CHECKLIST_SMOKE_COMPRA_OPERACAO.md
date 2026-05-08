# Checklist Smoke: Compra do Cliente e Operação do Jornaleiro

## Objetivo

Executar uma validação rápida do fluxo crítico:

1. busca
2. carrinho
3. login/cadastro
4. checkout
5. criação do pedido
6. operação pelo jornaleiro
7. WhatsApp

Tempo estimado:

- smoke rápido: 10 a 15 minutos
- smoke completo com WhatsApp: 20 a 30 minutos

## Pré-condições

- ambiente em `http://localhost:3000`
- banca publicada, ativa e aprovada
- produto ativo com estoque e preço de venda correto
- cliente de teste
- jornaleiro da banca com acesso
- WhatsApp da banca configurado
- integração WhatsApp ativa

## Dados do teste

- produto alvo:
- banca alvo:
- cliente:
- telefone cliente:
- jornaleiro:
- data/hora:

## Bloco 1: Busca e Produto

### 1. Busca por produto

- abrir home
- buscar um produto específico na navbar
- validar se o autocomplete traz o item correto
- abrir o item pela busca

Esperado:

- produto aparece na busca
- preço exibido é o preço de venda
- banca correta aparece vinculada

### 2. Página do produto

- validar nome
- validar código
- validar preço
- validar imagem
- validar URL amigável

Esperado:

- página carrega sem erro
- dados do produto batem com o cadastro

## Bloco 2: Carrinho e Checkout

### 3. Adicionar ao carrinho

- adicionar o produto ao carrinho
- abrir `/carrinho`
- validar quantidade e subtotal

Esperado:

- item entra no carrinho
- subtotal está correto

### 4. Regra de banca única

- tentar adicionar produto de outra banca

Esperado:

- sistema bloqueia
- modal informa conflito de banca

### 5. Login ou cadastro

- ir para `/checkout`
- se estiver deslogado, seguir para login/cadastro
- voltar ao checkout autenticado

Esperado:

- usuário retorna ao checkout
- sessão autenticada

### 6. Finalizar compra

- preencher telefone
- preencher endereço se entrega
- escolher pagamento
- finalizar pedido

Esperado:

- pedido criado com sucesso
- carrinho limpo
- redirecionamento para `/minha-conta?checkout=true`

## Bloco 3: Pedido do Cliente

### 7. Minha Conta

- abrir `/minha-conta/pedidos`
- abrir o pedido criado

Esperado:

- pedido aparece na listagem
- status inicial correto
- itens e total corretos

## Bloco 4: Operação do Jornaleiro

### 8. Dashboard do jornaleiro

- entrar como jornaleiro
- abrir `/jornaleiro/dashboard`
- abrir `/jornaleiro/pedidos`

Esperado:

- pedido aparece para a banca correta
- pedido não aparece para outra banca

### 9. Detalhe do pedido

- abrir `/jornaleiro/pedidos/[id]`
- validar cliente, telefone, itens, total, endereço e pagamento

Esperado:

- dados batem com o checkout

### 10. Troca de status

- alterar `novo -> confirmado`
- alterar `confirmado -> em_preparo`
- alterar `em_preparo -> saiu_para_entrega`
- alterar `saiu_para_entrega -> entregue`

Esperado:

- status atualiza sem erro
- histórico registra a mudança

## Bloco 5: WhatsApp

### 11. Notificação para jornaleiro na criação

- confirmar recebimento no WhatsApp da banca

Esperado:

- mensagem com pedido, cliente, itens, total e próximos passos

### 12. Notificação para cliente na criação

- confirmar recebimento no WhatsApp do cliente

Esperado:

- mensagem de boas-vindas
- mensagem de pedido recebido

### 13. Notificação para cliente ao mudar status

- alterar status no painel do jornaleiro
- confirmar nova mensagem no WhatsApp do cliente

Esperado:

- cliente recebe atualização coerente com o status

### 14. Confirmação para jornaleiro ao mudar status

- confirmar mensagem no WhatsApp do jornaleiro

Esperado:

- jornaleiro recebe confirmação de que o cliente foi notificado

## Falhas críticas

Marcar como falha crítica se ocorrer qualquer um destes:

- produto não aparece na busca
- preço do produto diverge do preço de venda
- carrinho aceita produtos de bancas diferentes
- checkout não cria pedido
- pedido não aparece para o cliente
- pedido não aparece para o jornaleiro
- mudança de status falha
- WhatsApp quebra a criação do pedido

## Evidências obrigatórias

- print da busca
- print do carrinho
- print do checkout
- ID e número do pedido
- print da listagem do cliente
- print da listagem do jornaleiro
- print do detalhe do pedido
- print das mensagens de WhatsApp

## Resultado final

- [ ] aprovado
- [ ] aprovado com ressalvas
- [ ] reprovado

### Observações

-
