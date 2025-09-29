# 🧪 Teste do Sistema WhatsApp Centralizado

## 🔧 Problema Corrigido

**Erro**: "Configure a URL e API Key primeiro" mesmo com dados preenchidos

**Solução**: Criado sistema de configuração centralizada que sincroniza entre todas as APIs.

## 📋 Como Testar

### 1. Acesse o Admin
```
http://localhost:3000/admin/login
```

**Login**: admin@guiadasbancas.com  
**Senha**: admin123

### 2. Configure WhatsApp
1. Vá em **Configurações → WhatsApp**
2. Os campos já vêm preenchidos com seus dados:
   - **URL**: `https://api.auditseo.com.br`
   - **API Key**: `43F2839534E2-4231-9BA7-C8193BD064DF`
   - **Instância**: `SDR_AUDITSEO` (sua instância existente)

### 3. Salvar Configurações
1. Clique **"Salvar Configurações"**
2. Deve aparecer: ✅ "Configurações salvas com sucesso!"

### 4. Verificar Status
1. Clique **"Verificar Status"**
2. Deve mostrar o status da conexão com a Evolution API

### 5. Criar Instância (se necessário)
1. Se não existir, clique **"Criar Instância"**
2. Aguarde a criação

### 6. Conectar WhatsApp
1. Clique **"Conectar WhatsApp"**
2. Será redirecionado para o painel da Evolution API
3. Escaneie o QR Code com seu WhatsApp

### 7. Testar Envio
1. Digite um número de teste no campo **"Telefone"**
2. Clique **"Enviar Teste"**
3. Verifique se a mensagem chegou no WhatsApp

## 🔄 Arquivos Alterados

### Configuração Centralizada
- ✅ `/lib/whatsapp-config.ts` - Sistema centralizado
- ✅ `/app/api/admin/whatsapp/config/route.ts` - API de configuração
- ✅ `/app/api/admin/whatsapp/status/route.ts` - API de status
- ✅ `/app/api/admin/whatsapp/create-instance/route.ts` - API criar instância
- ✅ `/app/api/admin/whatsapp/test/route.ts` - API teste

### Valores Padrão
Agora todas as APIs usam seus dados da Evolution API como padrão:
```typescript
{
  baseUrl: 'https://api.auditseo.com.br',
  apiKey: '43F2839534E2-4231-9BA7-C8193BD064DF',
  instanceName: 'SDR_AUDITSEO',
  isActive: true
}
```

## 🎯 Próximos Passos

1. **Teste o painel admin** - Verifique se salva corretamente
2. **Conecte o WhatsApp** - Escaneie QR Code
3. **Teste envio** - Envie mensagem de teste
4. **Faça um pedido** - Teste notificação automática

## 🚨 Se Ainda Não Funcionar

Abra o **Console do Navegador** (F12) e verifique:
- Erros de JavaScript
- Respostas das APIs
- Logs de configuração

Os logs mostrarão exatamente onde está o problema.

## 📱 Seus Dados Já Configurados:
- **URL**: `https://api.auditseo.com.br`
- **API Key**: `43F2839534E2-4231-9BA7-C8193BD064DF`
- **Instância**: `SDR_AUDITSEO` (sua instância existente)

## ✅ Status: PRONTO PARA TESTE

O sistema agora deve funcionar corretamente com sua instância `SDR_AUDITSEO` da Evolution API!
