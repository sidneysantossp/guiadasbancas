# 🚀 Guia de Migração para Supabase

## 📋 Checklist de Migração

### ✅ Passo 1: Setup do Supabase
1. **Criar conta**: `https://supabase.com`
2. **Novo projeto**: `guiadasbancas`
3. **Anotar credenciais**:
   - Project URL
   - API Key (anon/public)
   - Service Role Key

### ✅ Passo 2: Configurar Variáveis de Ambiente

Crie um arquivo `.env.local` com:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-anon-key
SUPABASE_SERVICE_ROLE_KEY=sua-service-role-key

# Evolution API Configuration (WhatsApp)
EVOLUTION_API_URL=https://api.auditseo.com.br
EVOLUTION_API_KEY=43F2839534E2-4231-9BA7-C8193BD064DF
EVOLUTION_INSTANCE_NAME=SDR_AUDITSEO

# Application Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### ✅ Passo 3: Criar Schema do Banco

1. **Acesse o painel do Supabase**
2. **Vá para SQL Editor**
3. **Execute o arquivo**: `database/schema.sql`

### ✅ Passo 4: Migrar Dados Existentes

```bash
# Executar script de migração
node scripts/migrate-to-supabase.js
```

### ✅ Passo 5: Atualizar APIs

As APIs serão atualizadas para usar Supabase em vez dos arquivos JSON.

## 🗄️ Estrutura do Banco de Dados

### Tabelas Criadas:

**1. bancas**
- Dados das bancas/jornaleiros
- Localização (lat/lng)
- Categorias e avaliações

**2. categories**
- Categorias do sistema
- Ordem e status ativo

**3. products**
- Catálogo completo de produtos
- Preços, descontos, estoque
- Relacionamento com bancas

**4. orders**
- Pedidos dos clientes
- Status e informações de entrega
- Relacionamento com bancas

**5. branding**
- Configurações de marca
- Logo, cores, favicon

## 🔧 Funcionalidades

### ✅ Implementado:
- ✅ Schema completo do banco
- ✅ Triggers para updated_at
- ✅ Índices para performance
- ✅ Row Level Security (RLS)
- ✅ Políticas de acesso
- ✅ Script de migração de dados

### 🔄 Próximos Passos:
- [ ] Atualizar APIs para usar Supabase
- [ ] Implementar autenticação real
- [ ] Configurar backup automático
- [ ] Monitoramento e logs

## 🚨 Importante

1. **Backup**: Faça backup dos arquivos JSON antes da migração
2. **Teste**: Execute em ambiente de desenvolvimento primeiro
3. **Variáveis**: Configure todas as variáveis de ambiente
4. **Vercel**: Atualize as variáveis no painel da Vercel

## 📊 Vantagens do Supabase

- ✅ **Banco PostgreSQL** robusto
- ✅ **Interface administrativa** visual
- ✅ **APIs automáticas** (REST + GraphQL)
- ✅ **Autenticação** integrada
- ✅ **Real-time** subscriptions
- ✅ **Backup automático**
- ✅ **Escalabilidade** automática

## 🆘 Troubleshooting

### Erro de Conexão:
- Verifique as variáveis de ambiente
- Confirme se o projeto está ativo no Supabase

### Erro de Permissão:
- Use a Service Role Key para operações admin
- Verifique as políticas RLS

### Dados não Migrados:
- Execute o script de migração novamente
- Verifique os logs no console

---

**🎉 Após a migração, você terá um banco de dados profissional e escalável!**
