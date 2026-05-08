# Roteiro de Execução: Smoke de Compra e Pedido

## Objetivo

Executar a jornada crítica completa com um roteiro operacional único:

1. usuário encontra um produto
2. adiciona ao carrinho
3. autentica
4. finaliza a compra
5. pedido nasce corretamente
6. jornaleiro recebe e opera o pedido
7. cliente e jornaleiro recebem mensagens no WhatsApp

Este documento é a versão prática de execução.

Documentos relacionados:

- [PLANO_TESTE_COMPRA_USUARIO_JORNALEIRO.md](/Applications/MAMP/htdocs/guiadasbancas/PLANO_TESTE_COMPRA_USUARIO_JORNALEIRO.md)
- [CHECKLIST_SMOKE_COMPRA_OPERACAO.md](/Applications/MAMP/htdocs/guiadasbancas/CHECKLIST_SMOKE_COMPRA_OPERACAO.md)

## Janela de execução

- ambiente:
- data:
- responsável:
- objetivo da rodada:

## Dados que devem ser definidos antes de começar

- URL base: `http://localhost:3000`
- produto alvo:
- banca alvo:
- usuário cliente:
- telefone do cliente:
- usuário jornaleiro:
- telefone WhatsApp da banca:
- CEP de entrega:

## Abas recomendadas

Abrir estas abas antes de iniciar:

1. home pública
2. carrinho
3. checkout
4. minha conta do cliente
5. painel do jornaleiro em `/jornaleiro/pedidos`
6. detalhe do pedido do jornaleiro
7. console do navegador
8. logs do terminal do `next dev`

## Evidências mínimas

Salvar ao final:

1. print da busca
2. print da página do produto
3. print do carrinho
4. print do checkout antes do envio
5. print da confirmação pós-compra
6. print do pedido na conta do cliente
7. print do pedido no painel do jornaleiro
8. print do detalhe do pedido
9. print do WhatsApp do cliente
10. print do WhatsApp da banca

## Sequência de execução

### Etapa 1: Busca pública

URL:

- `/`

Passos:

1. abrir a home
2. digitar o nome do produto na busca principal
3. validar se o autocomplete mostra o item correto
4. abrir o produto pelo autocomplete

Esperado:

- o produto aparece na busca
- o produto abre corretamente
- o preço exibido é o de venda
- a banca exibida é a banca certa

Evidência:

- print da busca
- print da página do produto

Status:

- [ ] ok
- [ ] falhou

Observações:

-

### Etapa 2: Carrinho

URL:

- `/carrinho`

Passos:

1. adicionar o produto ao carrinho
2. abrir o carrinho
3. validar quantidade
4. validar subtotal
5. validar nome da banca
6. tentar adicionar produto de outra banca

Esperado:

- o produto entra no carrinho
- subtotal e quantidade estão corretos
- produtos de outra banca são bloqueados

Evidência:

- print do carrinho
- print do modal de conflito entre bancas, se testado

Status:

- [ ] ok
- [ ] falhou

Observações:

-

### Etapa 3: Autenticação

URLs:

- `/entrar`
- `/registrar`

Passos:

1. abrir checkout sem estar autenticado
2. validar exigência de login/cadastro
3. autenticar ou registrar cliente
4. retornar ao checkout

Esperado:

- sistema exige autenticação
- usuário volta ao checkout
- sessão permanece autenticada

Evidência:

- print do gate de autenticação
- print do checkout autenticado

Status:

- [ ] ok
- [ ] falhou

Observações:

-

### Etapa 4: Checkout

URL:

- `/checkout`

Passos:

1. preencher telefone do cliente
2. preencher endereço se entrega
3. escolher método de entrega
4. escolher método de pagamento
5. revisar os itens
6. finalizar pedido

Esperado:

- nenhum erro de validação indevido
- pedido é criado com sucesso
- carrinho é limpo
- redirecionamento acontece para `/minha-conta?checkout=true`

Evidência:

- print do checkout antes de enviar
- print da tela pós-compra

Status:

- [ ] ok
- [ ] falhou

Observações:

-

### Etapa 5: Validação do pedido no cliente

URL:

- `/minha-conta/pedidos`

Passos:

1. abrir listagem de pedidos do cliente
2. localizar o pedido criado
3. abrir o detalhe do pedido

Esperado:

- pedido aparece na conta
- itens, total, banca e status inicial estão corretos

Campos que devem ser anotados:

- `order id`:
- `order number`:
- `status inicial`:
- `total`:

Evidência:

- print da listagem
- print do detalhe

Status:

- [ ] ok
- [ ] falhou

Observações:

-

### Etapa 6: Validação do pedido no jornaleiro

URLs:

- `/jornaleiro/dashboard`
- `/jornaleiro/pedidos`

Passos:

1. entrar como jornaleiro da banca correta
2. abrir dashboard
3. abrir listagem de pedidos
4. localizar o pedido criado

Esperado:

- pedido aparece para a banca correta
- pedido não aparece para outra banca
- dashboard mostra reflexo operacional do pedido

Evidência:

- print do dashboard
- print da listagem de pedidos

Status:

- [ ] ok
- [ ] falhou

Observações:

-

### Etapa 7: Operação do pedido pelo jornaleiro

URL:

- `/jornaleiro/pedidos/[id]`

Passos:

1. abrir o detalhe do pedido
2. validar dados do cliente
3. validar telefone
4. validar itens
5. validar total
6. validar método de pagamento
7. preencher observação
8. preencher previsão de entrega
9. alterar status para `confirmado`
10. alterar status para `em_preparo`

Esperado:

- o detalhe do pedido carrega
- alteração de status funciona
- histórico é atualizado

Evidência:

- print do detalhe do pedido
- print do histórico

Status:

- [ ] ok
- [ ] falhou

Observações:

-

### Etapa 8: WhatsApp

Passos:

1. confirmar se o jornaleiro recebeu mensagem na criação do pedido
2. confirmar se o cliente recebeu:
   - mensagem de boas-vindas
   - mensagem de pedido recebido
3. após mudar o status no painel, confirmar:
   - mensagem de atualização para o cliente
   - confirmação para o jornaleiro

Esperado:

- WhatsApp não bloqueia o fluxo de pedido
- mensagens saem com o pedido correto
- números e nomes estão corretos

Evidência:

- print do WhatsApp do cliente
- print do WhatsApp do jornaleiro

Status:

- [ ] ok
- [ ] falhou

Observações:

-

## Verificações técnicas rápidas

### Verificação em banco

Checar registros em:

- `orders`
- `order_history`

Validar:

- pedido criado com `banca_id`
- `user_id` preenchido
- `status = novo` no nascimento
- itens persistidos
- histórico de criação presente
- histórico de mudança de status presente

### Verificação em logs

Procurar por:

- `[API/ORDERS/POST]`
- `[NOVO PEDIDO CRIADO]`
- `[WHATSAPP]`
- `[WhatsApp Status Update]`
- `[WhatsApp Jornaleiro]`

## Critérios de reprovação imediata

Marcar a rodada como reprovada se ocorrer qualquer um destes:

1. busca não retorna o produto correto
2. preço exibido diverge do preço de venda
3. checkout não cria pedido
4. pedido não aparece para o cliente
5. pedido não aparece para o jornaleiro
6. status não atualiza
7. WhatsApp derruba ou impede a transação

## Resumo da rodada

Resultado:

- [ ] aprovado
- [ ] aprovado com ressalvas
- [ ] reprovado

Problemas encontrados:

1.
2.
3.

Próxima ação:

1.
2.
3.
