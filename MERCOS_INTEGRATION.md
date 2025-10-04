# 🚀 Integração Mercos - Guia Completo

## 📋 Visão Geral

Dashboard completo de distribuidores com integração à API Mercos para sincronização automática de catálogos de produtos.

## 🏗️ Estrutura Implementada

### 1. Banco de Dados

**Nova tabela:**
- `distribuidores` - Gerencia distribuidores integrados com Mercos

**Alterações na tabela products:**
- `distribuidor_id` - FK para distribuidores
- `mercos_id` - ID do produto na API Mercos
- `origem` - 'proprio' | 'mercos'
- `sincronizado_em` - Timestamp da última sincronização

### 2. APIs Criadas

```
GET    /api/admin/distribuidores          - Lista todos
POST   /api/admin/distribuidores          - Cadastra novo
GET    /api/admin/distribuidores/[id]     - Busca um
PUT    /api/admin/distribuidores/[id]     - Atualiza
DELETE /api/admin/distribuidores/[id]     - Exclui
POST   /api/admin/distribuidores/[id]/sync - Sincroniza manualmente
POST   /api/cron/sync-mercos              - Cron job (15 min)
```

### 3. Páginas do Dashboard

```
/admin/distribuidores              - Lista distribuidores
/admin/distribuidores/novo         - Cadastro
/admin/distribuidores/[id]/sync    - Sincronização
```

## 🔧 Instalação

### Passo 1: Criar tabelas no Supabase

Execute o SQL no **SQL Editor** do Supabase:

```bash
# Copiar conteúdo do arquivo:
database/create-distribuidores.sql
```

### Passo 2: Configurar variáveis de ambiente

Adicione no arquivo `.env.local`:

```bash
# Cron Secret (gere uma chave aleatória)
CRON_SECRET=sua-chave-secreta-aqui
```

Para gerar uma chave segura:
```bash
openssl rand -base64 32
```

### Passo 3: Instalar dependências

Não há dependências adicionais necessárias! ✅

## 📖 Como Usar

### 1. Cadastrar Distribuidor

1. Acesse `/admin/distribuidores`
2. Clique em "Novo Distribuidor"
3. Preencha:
   - **Nome**: Nome do distribuidor
   - **Application Token**: Fornecido pela Mercos após homologação
   - **Company Token**: Encontrado em Minha Conta → Sistema → Integração
   - **Ativo**: Marque para habilitar sincronização automática

### 2. Sincronizar Produtos

**Manualmente:**
1. Acesse o distribuidor
2. Clique em "Sincronizar"
3. Aguarde o processo (pode levar alguns minutos)

**Automaticamente:**
- Ocorre a cada 15 minutos para distribuidores ativos
- Configuração do cron necessária (veja abaixo)

### 3. Gerenciar Produtos

Após a sincronização:
- Produtos aparecem automaticamente na plataforma
- Identificados pela origem 'mercos'
- Vinculados ao distribuidor
- Podem ser editados pelo jornaleiro

## ⏰ Configurar Cron Job

### Opção 1: Vercel Cron (Recomendado)

Crie o arquivo `vercel.json`:

```json
{
  "crons": [{
    "path": "/api/cron/sync-mercos",
    "schedule": "*/15 * * * *"
  }]
}
```

### Opção 2: Serviço Externo (cron-job.org)

1. Acesse: https://cron-job.org
2. Crie nova tarefa:
   - **URL**: `https://seudominio.com/api/cron/sync-mercos`
   - **Method**: POST
   - **Schedule**: A cada 15 minutos
   - **Headers**: 
     ```
     Authorization: Bearer SEU_CRON_SECRET
     ```

### Opção 3: Teste Manual

```bash
curl -X POST https://seudominio.com/api/cron/sync-mercos \
  -H "Authorization: Bearer SEU_CRON_SECRET"
```

## 🎯 Homologação Mercos

### Preparação

1. **Sandbox:**
   - Use tokens de teste fornecidos
   - Teste todas as funcionalidades
   - Tire prints das telas (não código!)

2. **Módulo Beta:**
   - Acesse "Homologação Beta" no sandbox
   - Execute os testes de cada rota
   - Anexe prints das interfaces

3. **Reunião:**
   - Apresente o dashboard funcionando
   - Demonstre sincronização em tempo real
   - Mostre tratamento de throttling e paginação

### Checklist

- ✅ Throttling implementado (aguarda erro 429)
- ✅ Paginação completa (usa `alterado_apos`)
- ✅ Prints de tela prontos
- ✅ Dashboard funcional
- ✅ Sincronização manual testada

## 🔐 Segurança

### Tokens

- **ApplicationToken**: Único por integração, fornecido pela Mercos
- **CompanyToken**: Único por distribuidor
- **CRON_SECRET**: Protege endpoint de sincronização

⚠️ **IMPORTANTE:** Nunca commitar tokens reais no repositório!

### Proteção do Cron

O endpoint `/api/cron/sync-mercos` verifica o header `Authorization`.
Configure a variável `CRON_SECRET` para proteger.

## 📊 Monitoramento

### Logs

O cron job registra logs no console:

```
[CRON] Sincronizando: Distribuidor XYZ
[CRON] ✓ Distribuidor XYZ: 10 novos, 5 atualizados
```

### Dashboard

Cada distribuidor mostra:
- Total de produtos
- Última sincronização
- Status (ativo/inativo)

## 🐛 Troubleshooting

### Erro: "Falha ao conectar com API Mercos"

**Causa:** Tokens inválidos ou expirados
**Solução:** Verifique ApplicationToken e CompanyToken

### Erro: Throttling (429)

**Comportamento esperado!** O sistema aguarda automaticamente e retenta.

### Produtos não aparecem

1. Verifique se sincronização foi concluída
2. Confirme que `origem = 'mercos'`
3. Verifique logs do cron

### Sincronização lenta

Normal para muitos produtos. API Mercos tem throttling e paginação.
Primeiro sync pode levar 5-10 minutos.

## 🚀 Próximos Passos

### Recursos Adicionais (Futuro)

- [ ] Sincronização de imagens de produtos
- [ ] Gestão de categorias Mercos
- [ ] Sincronização de tabelas de preço
- [ ] Variações de produtos (grades)
- [ ] Gestão completa de pedidos
- [ ] Integração com clientes Mercos
- [ ] Dashboard de métricas

## 📞 Suporte

**Mercos:**
- Chat: https://app.mercos.com
- WhatsApp: Link no rodapé do site

**Documentação API:**
- https://docs.mercos.com

## 🎉 Conclusão

A integração está pronta para homologação!

**Fluxo completo:**
1. Cadastrar distribuidor ✅
2. Sincronizar manualmente ✅
3. Homologar no sandbox ✅
4. Receber tokens de produção ✅
5. Ativar sincronização automática ✅

Boa sorte na homologação! 🚀
