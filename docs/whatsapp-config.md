# Configuração WhatsApp - Evolution API

## Variáveis de Ambiente Necessárias

Adicione as seguintes variáveis no seu arquivo `.env.local`:

```bash
# Evolution API Configuration
EVOLUTION_API_URL=http://localhost:8080
EVOLUTION_API_KEY=your-api-key-here
EVOLUTION_INSTANCE_NAME=guiadasbancas

# WhatsApp do Jornaleiro (para receber notificações de novos pedidos)
JORNALEIRO_WHATSAPP=5511999999999
```

## Configuração da Evolution API

### 1. Instalação da Evolution API

```bash
# Clone o repositório
git clone https://github.com/EvolutionAPI/evolution-api.git
cd evolution-api

# Instale as dependências
npm install

# Configure o arquivo .env
cp .env.example .env
```

### 2. Configuração do .env da Evolution API

```bash
# Server
SERVER_PORT=8080
SERVER_URL=http://localhost:8080

# Database
DATABASE_ENABLED=true
DATABASE_CONNECTION_URI=mongodb://localhost:27017/evolution

# Instance
INSTANCE_NAME=guiadasbancas
```

### 3. Iniciar a Evolution API

```bash
npm run start:prod
```

### 4. Criar Instância WhatsApp

```bash
# POST http://localhost:8080/instance/create
{
  "instanceName": "guiadasbancas",
  "token": "your-token-here"
}
```

### 5. Conectar WhatsApp

1. Acesse: `http://localhost:8080/instance/connect/guiadasbancas`
2. Escaneie o QR Code com o WhatsApp
3. Aguarde a confirmação de conexão

## Funcionalidades Implementadas

### Notificações Automáticas

#### 1. Novo Pedido (para Jornaleiro)
- **Quando**: Cliente finaliza pedido
- **Para**: Número configurado em `JORNALEIRO_WHATSAPP`
- **Conteúdo**: Detalhes completos do pedido

#### 2. Atualização de Status (para Cliente)
- **Quando**: Jornaleiro atualiza status do pedido
- **Para**: Telefone do cliente
- **Conteúdo**: Notificação do novo status

### Mensagens Enviadas

#### Formato da Mensagem de Novo Pedido:
```
🛒 *NOVO PEDIDO RECEBIDO*

📋 *Pedido:* #ORD-123456789
👤 *Cliente:* João Silva
📱 *Telefone:* 11999999999

📦 *Produtos:*
1. Revista Veja
   Qtd: 2x | Valor: R$ 8.90
2. Jornal Folha
   Qtd: 1x | Valor: R$ 3.50

💰 *Total:* R$ 21.30
🚚 *Entrega:* Entrega
💳 *Pagamento:* PIX
📍 *Endereço:* Rua das Flores, 123

⏰ *Recebido em:* 29/09/2025 10:30

✅ Acesse seu painel para gerenciar este pedido.
```

#### Formato da Mensagem de Status:
```
📋 *Atualização do Pedido #ORD-123456789*

✅ Seu pedido foi confirmado e está sendo preparado!

⏰ *Previsão de entrega:* 29/09/2025 15:00

💬 Dúvidas? Entre em contato conosco!
```

## API Endpoints

### GET /api/whatsapp
Verifica status da conexão WhatsApp

**Resposta:**
```json
{
  "connected": true,
  "status": "Conectado",
  "timestamp": "2025-09-29T13:30:00.000Z"
}
```

### POST /api/whatsapp
Envia mensagem de teste

**Body:**
```json
{
  "phone": "5511999999999",
  "message": "Teste de conexão"
}
```

**Resposta:**
```json
{
  "success": true,
  "message": "Mensagem enviada com sucesso",
  "timestamp": "2025-09-29T13:30:00.000Z"
}
```

## Configuração no Painel

### Acesso às Configurações
1. Painel Jornaleiro → Configurações → WhatsApp
2. Clique em "Configurar" (botão azul)
3. Acesse `/jornaleiro/configuracoes/whatsapp`

### Funcionalidades da Página
- **Status da Conexão**: Verificar se WhatsApp está conectado
- **Teste de Mensagem**: Enviar mensagem para qualquer número
- **Monitoramento**: Ver logs e status da integração

## Troubleshooting

### Problemas Comuns

#### 1. WhatsApp não conecta
- Verifique se a Evolution API está rodando
- Confirme as variáveis de ambiente
- Tente recriar a instância

#### 2. Mensagens não são enviadas
- Verifique se o número está no formato correto (55XXXXXXXXXXX)
- Confirme se a instância está ativa
- Verifique os logs da Evolution API

#### 3. Erro de API Key
- Confirme se `EVOLUTION_API_KEY` está configurada
- Verifique se a key é válida na Evolution API

### Logs Úteis

```bash
# Logs da aplicação Next.js
npm run dev

# Logs da Evolution API
tail -f evolution-api/logs/app.log
```

## Segurança

### Recomendações
- Use HTTPS em produção
- Configure firewall para proteger a Evolution API
- Use tokens seguros e únicos
- Monitore logs regularmente

### Backup
- Faça backup regular do banco de dados da Evolution API
- Mantenha backup das configurações de instância
- Documente números e configurações importantes

## Suporte

Para problemas técnicos:
1. Verifique os logs da aplicação
2. Consulte a documentação da Evolution API
3. Entre em contato com o suporte técnico

---

**Última atualização:** 29/09/2025
**Versão:** 1.0.0
